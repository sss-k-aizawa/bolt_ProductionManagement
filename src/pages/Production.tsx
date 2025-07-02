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
  const { scheduleData, loading, error } = useProductionSchedule(currentWeek);
  const { items: inventoryItems, loading: inventoryLoading } = useInventory();
  const [activeTab, setActiveTab] = useState<'schedule' | 'monthly' | 'inventory'>('schedule');
  
  // 現在の週の日付を生成
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 月曜日開始
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return format(date, 'yyyy-MM-dd');
  });

  // ユニークな製品リストを取得
  const uniqueProducts = Array.from(new Set(scheduleData.map(s => s.product_id)))
    .map(productId => scheduleData.find(s => s.product_id === productId))
    .filter(Boolean);

  // 月次データの生成（当月前後2か月）
  const generateMonthlyData = () => {
    const currentMonth = new Date();
    const months = [];
    
    for (let i = -2; i <= 2; i++) {
      const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + i, 1);
      months.push({
        month: format(month, 'yyyy年M月'),
        data: uniqueProducts.map(product => ({
          product_id: product?.product_id || '',
          product_name: product?.product_name || '',
          total: Math.floor(Math.random() * 5000) + 1000, // サンプルデータ
        }))
      });
    }
    
    return months;
  };

  const monthlyData = generateMonthlyData();

  // 製品在庫のサンプルデータを生成
  const generateProductInventoryData = () => {
    const productInventoryData = [
      {
        id: 'prod-1',
        item_id: 'PROD-A',
        name: '製品A',
        category: '製品',
        quantity: 1250,
        unit: '個',
        min_quantity: 200,
        max_quantity: 2000,
        location: '製品倉庫A-01',
        supplier: '自社製造',
        description: '主力製品A',
      },
      {
        id: 'prod-2',
        item_id: 'PROD-B',
        name: '製品B',
        category: '製品',
        quantity: 850,
        unit: '個',
        min_quantity: 150,
        max_quantity: 1500,
        location: '製品倉庫A-02',
        supplier: '自社製造',
        description: '標準製品B',
      },
      {
        id: 'prod-3',
        item_id: 'PROD-C',
        name: '製品C',
        category: '製品',
        quantity: 45,
        unit: '個',
        min_quantity: 100,
        max_quantity: 800,
        location: '製品倉庫B-01',
        supplier: '自社製造',
        description: '特殊製品C',
      },
      {
        id: 'prod-4',
        item_id: 'PROD-D',
        name: '製品D',
        category: '製品',
        quantity: 0,
        unit: '個',
        min_quantity: 80,
        max_quantity: 600,
        location: '製品倉庫B-02',
        supplier: '自社製造',
        description: '新製品D',
      },
      {
        id: 'prod-5',
        item_id: 'PROD-E',
        name: '製品E',
        category: '製品',
        quantity: 320,
        unit: '個',
        min_quantity: 50,
        max_quantity: 500,
        location: '製品倉庫C-01',
        supplier: '自社製造',
        description: 'プレミアム製品E',
      },
      {
        id: 'prod-6',
        item_id: 'PROD-F',
        name: '製品F',
        category: '製品',
        quantity: 1850,
        unit: '個',
        min_quantity: 300,
        max_quantity: 2500,
        location: '製品倉庫C-02',
        supplier: '自社製造',
        description: '大量生産製品F',
      },
      {
        id: 'prod-7',
        item_id: 'PROD-G',
        name: '製品G',
        category: '製品',
        quantity: 125,
        unit: '個',
        min_quantity: 100,
        max_quantity: 400,
        location: '製品倉庫D-01',
        supplier: '自社製造',
        description: '限定製品G',
      },
    ];

    return productInventoryData;
  };

  // 製品在庫データ（サンプル）
  const productInventoryItems = generateProductInventoryData();

  // 製品の日別在庫予測を生成
  const generateProductInventoryForecast = () => {
    const forecast: { [productId: string]: { [date: string]: number } } = {};
    
    productInventoryItems.forEach(item => {
      forecast[item.item_id] = {};
      let currentStock = item.quantity; // 現在の在庫数
      
      // 過去7日分のデータも含めて14日分生成
      const extendedDates = Array.from({ length: 14 }, (_, i) => {
        const date = addDays(weekStart, i - 7);
        return format(date, 'yyyy-MM-dd');
      });
      
      extendedDates.forEach((date, index) => {
        // 生産による在庫増加
        const productionData = scheduleData.find(s => 
          s.date === date && s.product_id === item.item_id
        );
        const production = productionData?.planned_quantity || 0;
        
        // 出荷・使用による在庫減少（サンプル値）
        const baseUsage = Math.floor(item.quantity * 0.08); // 現在在庫の8%程度
        const dailyVariation = Math.floor(Math.random() * baseUsage * 0.6); // ±30%の変動
        const usage = Math.max(0, baseUsage + dailyVariation - (baseUsage * 0.3));
        
        // 週末は使用量を減らす
        const dayOfWeek = new Date(date).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const adjustedUsage = isWeekend ? Math.floor(usage * 0.2) : usage;
        
        // 在庫計算
        currentStock = Math.max(0, currentStock + production - adjustedUsage);
        forecast[item.item_id][date] = currentStock;
      });
    });
    
    return forecast;
  };

  const productInventoryForecast = generateProductInventoryForecast();

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 80) return 'text-amber-600';
    return 'text-red-600';
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentWeek(subWeeks(currentWeek, 1));
    } else {
      setCurrentWeek(addWeeks(currentWeek, 1));
    }
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  // 日別の目標生産数と最低目標を計算
  const getDailyTargets = (date: string) => {
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (isWeekend) {
      return { target: 0, minTarget: 0 };
    }
    
    // 平日の目標生産数（サンプル値）
    const baseTarget = 800;
    const dailyVariation = Math.floor(Math.random() * 200) - 100; // ±100の変動
    const target = Math.max(0, baseTarget + dailyVariation);
    const minTarget = Math.floor(target * 0.95); // 95%
    
    return { target, minTarget };
  };

  // 日別合計を計算
  const getDailyTotal = (date: string) => {
    return scheduleData
      .filter(item => item.date === date)
      .reduce((sum, item) => sum + item.planned_quantity, 0);
  };

  // 在庫レベルの色を取得
  const getInventoryLevelColor = (current: number, min: number, max: number) => {
    if (current === 0) return 'text-red-600';
    if (current <= min) return 'text-amber-600';
    if (current >= max * 0.9) return 'text-blue-600';
    return 'text-green-600';
  };

  // 在庫レベルのステータステキストを取得
  const getInventoryLevelStatus = (current: number, min: number, max: number) => {
    if (current === 0) return '在庫切れ';
    if (current <= min) return '在庫少';
    if (current >= max * 0.9) return '在庫過多';
    return '適正';
  };

  if (loading || inventoryLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">生産スケジュール</h1>
            <p className="mt-1 text-sm text-gray-500">生産活動の計画と管理</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">データを読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">生産スケジュール</h1>
            <p className="mt-1 text-sm text-gray-500">生産活動の計画と管理</p>
          </div>
        </div>
        <Card>
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">エラーが発生しました</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">生産スケジュール</h1>
          <p className="mt-1 text-sm text-gray-500">生産活動の計画と管理</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate('/production/schedule/edit')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Edit size={16} className="mr-2" />
            生産編集
          </button>
          {activeTab === 'inventory' && (
            <button 
              onClick={() => navigate('/production/inventory/edit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit size={16} className="mr-2" />
              在庫編集
            </button>
          )}
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'schedule'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CalendarDays size={16} className="inline mr-1" />
            生産スケジュール
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'monthly'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            生産集計
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inventory'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package size={16} className="inline mr-1" />
            製品在庫
          </button>
        </nav>
      </div>

      {activeTab === 'schedule' && (
        <>
          {/* スリムな週ナビゲーション */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2">
            <button
              onClick={() => navigateWeek('prev')}
              className="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900">
                {format(weekStart, 'yyyy年M月d日', { locale: ja })} - {format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'M月d日', { locale: ja })}
              </h3>
              <button
                onClick={goToCurrentWeek}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                今週
              </button>
            </div>
            
            <button
              onClick={() => navigateWeek('next')}
              className="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <Card className="p-0">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                        製品
                      </th>
                      {dates.map((date) => (
                        <th key={date} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                          <div className="flex flex-col">
                            <span>{format(new Date(date), 'M/d', { locale: ja })}</span>
                            <span className="text-xs text-gray-400">{format(new Date(date), 'EEE', { locale: ja })}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* 目標生産数行 */}
                    <tr className="bg-green-50">
                      <td className="sticky left-0 z-10 bg-green-50 px-4 py-3 whitespace-nowrap text-sm font-medium text-green-800 border-r border-gray-200">
                        目標生産数
                      </td>
                      {dates.map((date) => {
                        const { target } = getDailyTargets(date);
                        const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                        return (
                          <td key={`target-${date}`} className={`px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-green-800 ${
                            isWeekend ? 'bg-green-100' : ''
                          }`}>
                            {target > 0 ? target.toLocaleString() : '-'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* 最低生産数行 */}
                    <tr className="bg-amber-50">
                      <td className="sticky left-0 z-10 bg-amber-50 px-4 py-3 whitespace-nowrap text-sm font-medium text-amber-800 border-r border-gray-200">
                        最低生産数
                      </td>
                      {dates.map((date) => {
                        const { minTarget } = getDailyTargets(date);
                        const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                        return (
                          <td key={`min-target-${date}`} className={`px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-amber-800 ${
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
                        <td className="sticky left-0 z-10 bg-white px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                          <div>
                            <div className="font-medium">{product?.product_name}</div>
                            <div className="text-xs text-gray-500">{product?.product_id}</div>
                          </div>
                        </td>
                        {dates.map((date) => {
                          const dayData = scheduleData.find(s => s.date === date && s.product_id === product?.product_id);
                          const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                          
                          return (
                            <td key={`${product?.product_id}-${date}`} className={`px-4 py-3 whitespace-nowrap text-sm text-gray-500 ${isToday ? 'bg-blue-50' : ''}`}>
                              {dayData && dayData.planned_quantity > 0 ? (
                                <div className="text-center">
                                  <span className="font-medium">{dayData.planned_quantity.toLocaleString()}</span>
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

                    {/* 日別合計行 */}
                    <tr className="bg-blue-50 font-medium">
                      <td className="sticky left-0 z-10 bg-blue-50 px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-800 border-r border-gray-200">
                        日別合計
                      </td>
                      {dates.map((date) => {
                        const total = getDailyTotal(date);
                        const { target, minTarget } = getDailyTargets(date);
                        const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                        const isPast = new Date(date) < new Date(format(new Date(), 'yyyy-MM-dd'));
                        
                        // 目標達成状況の色分け
                        let textColor = 'text-blue-800';
                        if (total >= target && target > 0) {
                          textColor = 'text-green-800';
                        } else if (total >= minTarget && minTarget > 0) {
                          textColor = 'text-amber-800';
                        } else if (target > 0) {
                          textColor = 'text-red-800';
                        }

                        // 実績データ（サンプル）
                        const actualTotal = isPast ? Math.floor(total * (0.85 + Math.random() * 0.3)) : 0;
                        const completionRate = target > 0 ? (actualTotal / target) * 100 : 0;
                        
                        return (
                          <td key={`total-${date}`} className={`px-4 py-3 whitespace-nowrap text-center text-sm font-medium ${textColor} ${
                            isWeekend ? 'bg-blue-100' : ''
                          }`}>
                            <div className="space-y-1">
                              <div>
                                <span className="font-medium">{total.toLocaleString()}</span>
                              </div>
                              {isPast && (
                                <div className="text-xs">
                                  <div className="flex items-center justify-center">
                                    <span className="text-blue-600 mr-1">実績:</span>
                                    <span className="text-blue-600 flex items-center">
                                      {actualTotal.toLocaleString()}
                                      {actualTotal >= total ? 
                                        <TrendingUp size={10} className="ml-1 text-green-600" /> : 
                                        <TrendingDown size={10} className="ml-1 text-red-600" />
                                      }
                                    </span>
                                  </div>
                                  <div className="mt-1">
                                    <span className="text-gray-400 mr-1">達成率:</span>
                                    <span className={`font-medium ${getCompletionRateColor(completionRate)}`}>
                                      {completionRate.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              )}
                              {target > 0 && !isPast && (
                                <div className="text-xs text-gray-500">
                                  目標: {target.toLocaleString()}
                                </div>
                              )}
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

      {activeTab === 'monthly' && (
        <Card>
          <div className="overflow-x-auto -mx-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    製品
                  </th>
                  {monthlyData.map((month) => (
                    <th key={month.month} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                      {month.month}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                    合計
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {uniqueProducts.map((product) => (
                  <tr key={product?.product_id} className="hover:bg-gray-50">
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                      <div>
                        <div className="font-medium">{product?.product_name}</div>
                        <div className="text-xs text-gray-500">{product?.product_id}</div>
                      </div>
                    </td>
                    {monthlyData.map((month) => {
                      const productData = month.data.find(d => d.product_id === product?.product_id);
                      const isCurrentMonth = month.month.includes(format(new Date(), 'yyyy年M月'));
                      
                      return (
                        <td key={`${product?.product_id}-${month.month}`} className={`px-6 py-4 whitespace-nowrap text-center text-sm ${isCurrentMonth ? 'bg-blue-50 font-medium text-blue-900' : 'text-gray-900'}`}>
                          {productData?.total.toLocaleString() || 0}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                      {monthlyData.reduce((sum, month) => {
                        const productData = month.data.find(d => d.product_id === product?.product_id);
                        return sum + (productData?.total || 0);
                      }, 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
                
                {/* 月別合計行 */}
                <tr className="bg-gray-50 font-medium">
                  <td className="sticky left-0 z-10 bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                    月別合計
                  </td>
                  {monthlyData.map((month) => (
                    <td key={`total-${month.month}`} className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                      {month.data.reduce((sum, product) => sum + product.total, 0).toLocaleString()}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                    {monthlyData.reduce((sum, month) => 
                      sum + month.data.reduce((monthSum, product) => monthSum + product.total, 0), 0
                    ).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'inventory' && (
        <>
          {/* 週ナビゲーション */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2">
            <button
              onClick={() => navigateWeek('prev')}
              className="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900">
                製品在庫予測: {format(weekStart, 'yyyy年M月d日', { locale: ja })} - {format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'M月d日', { locale: ja })}
              </h3>
              <button
                onClick={goToCurrentWeek}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                今週
              </button>
            </div>
            
            <button
              onClick={() => navigateWeek('next')}
              className="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900">製品在庫予測（日別）</h2>
              <p className="text-sm text-gray-500">生産計画と出荷予定に基づく在庫予測</p>
            </div>
            
            <div className="overflow-x-auto -mx-5">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                        製品
                      </th>
                      <th className="sticky left-32 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                        現在在庫
                      </th>
                      {dates.map((date) => (
                        <th key={date} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                          <div className="flex flex-col">
                            <span>{format(new Date(date), 'M/d', { locale: ja })}</span>
                            <span className="text-xs text-gray-400">{format(new Date(date), 'EEE', { locale: ja })}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productInventoryItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="sticky left-0 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                          <div className="flex items-center">
                            <Package size={16} className="text-blue-500 mr-2" />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500">{item.item_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="sticky left-32 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                          <div className="text-center">
                            <div className={`font-medium ${getInventoryLevelColor(item.quantity, item.min_quantity || 0, item.max_quantity || 1000)}`}>
                              {item.quantity.toLocaleString()}
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                              getInventoryLevelStatus(item.quantity, item.min_quantity || 0, item.max_quantity || 1000) === '在庫切れ' ? 'bg-red-100 text-red-700' :
                              getInventoryLevelStatus(item.quantity, item.min_quantity || 0, item.max_quantity || 1000) === '在庫少' ? 'bg-amber-100 text-amber-700' :
                              getInventoryLevelStatus(item.quantity, item.min_quantity || 0, item.max_quantity || 1000) === '在庫過多' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {getInventoryLevelStatus(item.quantity, item.min_quantity || 0, item.max_quantity || 1000)}
                            </div>
                          </div>
                        </td>
                        {dates.map((date) => {
                          const forecastStock = productInventoryForecast[item.item_id]?.[date] || 0;
                          const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                          const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                          
                          // 生産予定数を取得
                          const productionData = scheduleData.find(s => 
                            s.date === date && s.product_id === item.item_id
                          );
                          const plannedProduction = productionData?.planned_quantity || 0;
                          
                          return (
                            <td key={`${item.id}-${date}`} className={`px-4 py-4 whitespace-nowrap text-sm ${
                              isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50' : ''
                            }`}>
                              <div className="text-center space-y-1">
                                <div className={`font-medium ${getInventoryLevelColor(forecastStock, item.min_quantity || 0, item.max_quantity || 1000)}`}>
                                  {forecastStock.toLocaleString()}
                                </div>
                                {plannedProduction > 0 && (
                                  <div className="text-xs text-green-600 flex items-center justify-center">
                                    <TrendingUp size={10} className="mr-1" />
                                    +{plannedProduction.toLocaleString()}
                                  </div>
                                )}
                                <div className={`text-xs px-1 py-0.5 rounded ${
                                  getInventoryLevelStatus(forecastStock, item.min_quantity || 0, item.max_quantity || 1000) === '在庫切れ' ? 'bg-red-100 text-red-700' :
                                  getInventoryLevelStatus(forecastStock, item.min_quantity || 0, item.max_quantity || 1000) === '在庫少' ? 'bg-amber-100 text-amber-700' :
                                  getInventoryLevelStatus(forecastStock, item.min_quantity || 0, item.max_quantity || 1000) === '在庫過多' ? 'bg-blue-100 text-blue-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {getInventoryLevelStatus(forecastStock, item.min_quantity || 0, item.max_quantity || 1000)}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
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