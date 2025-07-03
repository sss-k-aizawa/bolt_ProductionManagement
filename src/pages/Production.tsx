import React, { useState } from 'react';
import { CalendarDays, Plus, Filter, TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, Edit, ChevronLeft, ChevronRight, Package, FileText, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { useProductionSchedule } from '../hooks/useProductionSchedule';
import { useInventory } from '../hooks/useInventory';
import { format, addDays, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';

const Production: React.FC = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'delayed'>('all');

  const { scheduleData, loading: scheduleLoading, error: scheduleError } = useProductionSchedule();
  const { items: inventoryItems, loading: inventoryLoading } = useInventory();

  // 週の開始日と終了日を取得
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  // 表示する日付の配列を生成
  const dates = Array.from({ length: 7 }, (_, i) => 
    format(addDays(weekStart, i), 'yyyy-MM-dd')
  );

  // 月表示用のデータ生成
  const monthlyData = React.useMemo(() => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = -2; i <= 2; i++) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthKey = format(monthDate, 'yyyy-MM');
      
      const monthSchedule = scheduleData.filter(s => s.date.startsWith(monthKey));
      const productData = new Map();
      
      monthSchedule.forEach(schedule => {
        if (!productData.has(schedule.product_id)) {
          productData.set(schedule.product_id, {
            product_id: schedule.product_id,
            product_name: schedule.product_name,
            total: 0,
            target: 0,
            minTarget: 0
          });
        }
        
        const data = productData.get(schedule.product_id);
        data.total += schedule.actual_quantity || 0;
        data.target += schedule.planned_quantity || 0;
        data.minTarget += Math.floor((schedule.planned_quantity || 0) * 0.8);
      });
      
      months.push({
        month: monthKey,
        monthName: format(monthDate, 'yyyy年M月', { locale: ja }),
        data: Array.from(productData.values()),
        isCurrentMonth: monthKey === format(currentDate, 'yyyy-MM')
      });
    }
    
    return months;
  }, [scheduleData]);

  // ユニークな製品リストを取得
  const uniqueProducts = React.useMemo(() => {
    const productMap = new Map();
    scheduleData.forEach(schedule => {
      if (!productMap.has(schedule.product_id)) {
        productMap.set(schedule.product_id, {
          product_id: schedule.product_id,
          product_name: schedule.product_name
        });
      }
    });
    return Array.from(productMap.values());
  }, [scheduleData]);

  // 日別の目標値を計算
  const getDailyTargets = (date: string) => {
    const daySchedule = scheduleData.filter(s => s.date === date);
    const totalTarget = daySchedule.reduce((sum, s) => sum + (s.planned_quantity || 0), 0);
    const minTarget = Math.floor(totalTarget * 0.8);
    return { totalTarget, minTarget };
  };

  // 週間統計を計算
  const weeklyStats = React.useMemo(() => {
    const weekSchedule = scheduleData.filter(s => 
      dates.includes(s.date)
    );
    
    const totalPlanned = weekSchedule.reduce((sum, s) => sum + (s.planned_quantity || 0), 0);
    const totalActual = weekSchedule.reduce((sum, s) => sum + (s.actual_quantity || 0), 0);
    const achievementRate = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;
    
    return {
      totalPlanned,
      totalActual,
      achievementRate,
      variance: totalActual - totalPlanned
    };
  }, [scheduleData, dates]);

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const handleToday = () => {
    setCurrentWeek(new Date());
  };

  if (scheduleLoading || inventoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (scheduleError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">データの読み込みに失敗しました</h2>
          <p className="text-gray-600">{scheduleError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            生産管理
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            生産スケジュールと実績を管理します
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => navigate('/manufacturing-instruction')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FileText className="h-4 w-4 mr-2" />
            製造指示書
          </button>
          <button
            onClick={() => navigate('/production-schedule-edit')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            スケジュール編集
          </button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    週間計画
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {weeklyStats.totalPlanned.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    週間実績
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {weeklyStats.totalActual.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className={`h-8 w-8 ${weeklyStats.achievementRate >= 100 ? 'text-green-600' : weeklyStats.achievementRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    達成率
                  </dt>
                  <dd className={`text-lg font-medium ${weeklyStats.achievementRate >= 100 ? 'text-green-600' : weeklyStats.achievementRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {weeklyStats.achievementRate.toFixed(1)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className={`h-8 w-8 ${weeklyStats.variance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    差異
                  </dt>
                  <dd className={`text-lg font-medium ${weeklyStats.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {weeklyStats.variance > 0 ? '+' : ''}{weeklyStats.variance.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 表示モード切り替え */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'week'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              週表示
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                viewMode === 'month'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              月表示
            </button>
          </div>
        </div>

        {viewMode === 'week' && (
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousWeek}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-lg font-medium text-gray-900">
              {format(weekStart, 'M月d日', { locale: ja })} - {format(weekEnd, 'M月d日', { locale: ja })}
            </div>
            <button
              onClick={handleNextWeek}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              今週
            </button>
          </div>
        )}
      </div>

      {/* 生産スケジュール表 */}
      {viewMode === 'week' ? (
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">週間生産スケジュール</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    製品
                  </th>
                  {dates.map((date) => {
                    const dayOfWeek = format(new Date(date), 'E', { locale: ja });
                    const dayOfMonth = format(new Date(date), 'd');
                    const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                    const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                    
                    return (
                      <th
                        key={date}
                        className={`px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          isToday ? 'bg-blue-100' : isWeekend ? 'bg-gray-100' : ''
                        }`}
                      >
                        <div>
                          <div>{dayOfWeek}</div>
                          <div className="text-lg font-bold text-gray-900">{dayOfMonth}</div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* 目標生産数行 */}
                <tr className="bg-blue-50">
                  <td className="sticky left-0 z-10 bg-blue-50 px-6 py-3 whitespace-nowrap text-sm font-medium text-blue-800 border-r border-gray-200">
                    目標生産数
                  </td>
                  {dates.map((date) => {
                    const { totalTarget } = getDailyTargets(date);
                    const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                    return (
                      <td key={`target-${date}`} className={`px-6 py-3 whitespace-nowrap text-center text-sm font-medium text-blue-800 ${
                        isWeekend ? 'bg-blue-100' : ''
                      }`}>
                        {totalTarget > 0 ? totalTarget.toLocaleString() : '-'}
                      </td>
                    );
                  })}
                </tr>

                {/* 最低生産数行 */}
                <tr className="bg-amber-50">
                  <td className="sticky left-0 z-10 bg-amber-50 px-6 py-3 whitespace-nowrap text-sm font-medium text-amber-800 border-r border-gray-200">
                    最低生産数
                  </td>
                  {dates.map((date) => {
                    const { minTarget } = getDailyTargets(date);
                    const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                    return (
                      <td key={`min-target-${date}`} className={`px-6 py-3 whitespace-nowrap text-center text-sm font-medium text-amber-800 ${
                        isWeekend ? 'bg-amber-100' : ''
                      }`}>
                        {minTarget > 0 ? minTarget.toLocaleString() : '-'}
                      </td>
                    );
                  })}
                </tr>

                {/* 製品別生産予定 */}
                {uniqueProducts.map((product) => (
                  <tr key={product?.product_id} className="hover:bg-gray-50">
                    <td className="sticky left-0 z-10 bg-white px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                      <div>
                        <div className="font-medium">{product?.product_name}</div>
                        <div className="text-xs text-gray-500">{product?.product_id}</div>
                      </div>
                    </td>
                    {dates.map((date) => {
                      const dayData = scheduleData.find(s => s.date === date && s.product_id === product?.product_id);
                      const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                      return (
                        <td key={`${product?.product_id}-${date}`} className={`px-6 py-3 whitespace-nowrap text-center text-sm ${
                          isWeekend ? 'bg-gray-50' : ''
                        }`}>
                          {dayData ? (
                            <div className="space-y-1">
                              <div className="font-medium">
                                {dayData.planned_quantity > 0 ? dayData.planned_quantity.toLocaleString() : '-'}
                              </div>
                              {dayData.actual_quantity !== null && (
                                <div className={`text-xs ${
                                  dayData.actual_quantity >= dayData.planned_quantity 
                                    ? 'text-green-600' 
                                    : dayData.actual_quantity >= dayData.planned_quantity * 0.8
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                                }`}>
                                  実績: {dayData.actual_quantity.toLocaleString()}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-400 text-xs">
                              休止
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">月別生産実績</h3>
            </div>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                        項目
                      </th>
                      {monthlyData.map((month) => (
                        <th
                          key={month.month}
                          className={`px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${
                            month.isCurrentMonth ? 'bg-blue-100' : ''
                          }`}
                        >
                          {month.monthName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* 目標生産数行 */}
                    <tr className="bg-blue-50">
                      <td className="sticky left-0 z-10 bg-blue-50 px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-800 border-r border-gray-200">
                        目標生産数
                      </td>
                      {monthlyData.map((month) => {
                        const monthTarget = month.data.reduce((sum, product) => sum + product.target, 0);
                        return (
                          <td key={`target-${month.month}`} className={`px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-blue-800 ${
                            month.isCurrentMonth ? 'bg-blue-100' : ''
                          }`}>
                            {monthTarget > 0 ? monthTarget.toLocaleString() : '-'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* 最低生産数行 */}
                    <tr className="bg-amber-50">
                      <td className="sticky left-0 z-10 bg-amber-50 px-4 py-3 whitespace-nowrap text-sm font-medium text-amber-800 border-r border-gray-200">
                        最低生産数
                      </td>
                      {monthlyData.map((month) => {
                        const monthMinTarget = month.data.reduce((sum, product) => sum + product.minTarget, 0);
                        return (
                          <td key={`min-target-${month.month}`} className={`px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-amber-800 ${
                            month.isCurrentMonth ? 'bg-amber-100' : ''
                          }`}>
                            {monthMinTarget > 0 ? monthMinTarget.toLocaleString() : '-'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* 製品別生産予定 */}
                    {uniqueProducts.map((product) => (
                      <tr key={product?.product_id} className="hover:bg-gray-50">
                        <td className="sticky left-0 z-10 bg-white px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                          <div>
                            <div className="font-medium">{product?.product_name}</div>
                            <div className="text-xs text-gray-500">{product?.product_id}</div>
                          </div>
                        </td>
                        {monthlyData.map((month) => {
                          const productData = month.data.find(p => p.product_id === product?.product_id);
                          return (
                            <td key={`${product?.product_id}-${month.month}`} className={`px-4 py-3 whitespace-nowrap text-center text-sm ${
                              month.isCurrentMonth ? 'bg-gray-50' : ''
                            }`}>
                              {productData && productData.total > 0 ? (
                                <div className="text-center">
                                  <span className="font-medium">{productData.total.toLocaleString()}</span>
                                </div>
                              ) : (
                                <div className="text-center text-gray-400 text-xs">
                                  休止
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* 月別合計行 */}
                    <tr className="bg-gray-50 font-medium">
                      <td className="sticky left-0 z-10 bg-gray-50 px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                        月別合計
                      </td>
                      {monthlyData.map((month) => {
                        const monthTotal = month.data.reduce((sum, product) => sum + product.total, 0);
                        const monthTarget = month.data.reduce((sum, product) => sum + product.target, 0);
                        const monthMinTarget = month.data.reduce((sum, product) => sum + product.minTarget, 0);
                        const targetAchievementRate = monthTarget > 0 ? (monthTotal / monthTarget) * 100 : 0;
                        const minTargetAchievementRate = monthMinTarget > 0 ? (monthTotal / monthMinTarget) * 100 : 0;
                        
                        return (
                          <td key={`total-${month.month}`} className={`px-4 py-3 whitespace-nowrap text-center text-sm ${month.isCurrentMonth ? 'bg-gray-100' : ''}`}>
                            <div className="space-y-1">
                              <div className="text-lg font-bold">
                                {monthTotal.toLocaleString()}
                              </div>
                              <div className="text-xs space-y-0.5">
                                <div className={`${targetAchievementRate >= 100 ? 'text-green-600' : targetAchievementRate >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                                  目標達成率: {targetAchievementRate.toFixed(1)}%
                                </div>
                                <div className={`${minTargetAchievementRate >= 100 ? 'text-green-600' : minTargetAchievementRate >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                                  最低達成率: {minTargetAchievementRate.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Production;