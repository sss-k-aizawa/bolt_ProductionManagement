import React, { useState } from 'react';
import { Plus, AlertTriangle, Calendar, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Edit, History, Package, Truck, Triangle as ExclamationTriangle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { useInventory } from '../hooks/useInventory';
import { useInventoryHistory } from '../hooks/useInventoryHistory';
import { format, subDays, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';

interface PalletData {
  company: 'SPR' | 'JPR';
  companyName: string;
  dailyData: {
    [date: string]: {
      usage: number;        // 使用数
      arranged: number;     // 手配数
      inbound: number;      // 入庫数
      stock: number;        // 在庫数
    };
  };
}

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const { items, loading, error } = useInventory();
  const { historyData, loading: historyLoading } = useInventoryHistory();
  const [activeTab, setActiveTab] = useState<'daily' | 'pallet'>('daily');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case '適正':
        return 'bg-green-100 text-green-800';
      case '在庫少':
        return 'bg-amber-100 text-amber-800';
      case '在庫切れ':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 日別表示用の日付を生成（現在の週）
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 月曜日開始
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return format(date, 'yyyy-MM-dd');
  });

  // パレットデータ（サンプル）
  const [palletData] = useState<PalletData[]>([
    {
      company: 'SPR',
      companyName: 'SPRパレット',
      dailyData: dates.reduce((acc, date) => {
        const dayOfWeek = new Date(date).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // 平日と週末で異なる値を設定
        const baseUsage = isWeekend ? 50 : 200;
        const baseArranged = isWeekend ? 30 : 180;
        const baseInbound = isWeekend ? 20 : 150;
        
        acc[date] = {
          usage: baseUsage + Math.floor(Math.random() * 50) - 25,
          arranged: baseArranged + Math.floor(Math.random() * 40) - 20,
          inbound: baseInbound + Math.floor(Math.random() * 30) - 15,
          stock: 800 + Math.floor(Math.random() * 200) - 100,
        };
        return acc;
      }, {} as { [date: string]: any })
    },
    {
      company: 'JPR',
      companyName: 'JPRパレット',
      dailyData: dates.reduce((acc, date) => {
        const dayOfWeek = new Date(date).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // 平日と週末で異なる値を設定
        const baseUsage = isWeekend ? 40 : 160;
        const baseArranged = isWeekend ? 25 : 140;
        const baseInbound = isWeekend ? 15 : 120;
        
        acc[date] = {
          usage: baseUsage + Math.floor(Math.random() * 40) - 20,
          arranged: baseArranged + Math.floor(Math.random() * 30) - 15,
          inbound: baseInbound + Math.floor(Math.random() * 25) - 12,
          stock: 600 + Math.floor(Math.random() * 150) - 75,
        };
        return acc;
      }, {} as { [date: string]: any })
    }
  ]);

  // 拡張されたアイテムデータ（最小lot、メモ、納期を含む）
  const extendedItemsData = [
    {
      item_id: 'A1001',
      item_name: '原材料A',
      category: '原材料',
      unit: 'kg',
      min_lot: 100,
      memo: '主要原材料',
      delivery_date: '2025-04-15'
    },
    {
      item_id: 'A2344',
      item_name: '部品B',
      category: '部品',
      unit: '個',
      min_lot: 50,
      memo: '重要部品',
      delivery_date: '2025-04-12'
    },
    {
      item_id: 'A3422',
      item_name: '工具C',
      category: '工具',
      unit: 'セット',
      min_lot: 5,
      memo: '生産工具',
      delivery_date: '2025-04-20'
    },
    {
      item_id: 'B1422',
      item_name: '材料D',
      category: '原材料',
      unit: 'kg',
      min_lot: 200,
      memo: '補助材料',
      delivery_date: '2025-04-18'
    },
    {
      item_id: 'B2344',
      item_name: '部品E',
      category: '部品',
      unit: '個',
      min_lot: 25,
      memo: '汎用部品',
      delivery_date: '2025-04-14'
    },
    {
      item_id: 'C1001',
      item_name: 'パーツF',
      category: 'パーツ',
      unit: '個',
      min_lot: 10,
      memo: '特殊パーツ',
      delivery_date: '2025-04-22'
    },
    {
      item_id: 'C3422',
      item_name: '材料G',
      category: '原材料',
      unit: 'リットル',
      min_lot: 50,
      memo: '液体材料',
      delivery_date: '2025-04-16'
    }
  ];

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

  const handleOrder = (itemId: string) => {
    // 発注ページに遷移（クエリパラメータで資材IDを渡す）
    navigate(`/inventory/order?materialId=${itemId}`);
  };

  // 在庫不足をチェックする関数
  const checkInventoryShortage = (itemId: string) => {
    const shortages = [];
    
    dates.forEach(date => {
      const dayData = historyData.find(h => h.date === date && h.item_id === itemId);
      const currentStock = dayData?.current_stock || 0;
      
      // 在庫が0または10以下の場合を在庫不足とする
      if (currentStock === 0) {
        shortages.push({ date, level: 'critical', stock: currentStock });
      } else if (currentStock <= 10) {
        shortages.push({ date, level: 'warning', stock: currentStock });
      }
    });
    
    return shortages;
  };

  // 在庫不足アラートの色を取得
  const getShortageAlertColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // 日別パレット全体在庫数を計算
  const getTotalStockForDate = (date: string) => {
    return palletData.reduce((total, company) => {
      return total + (company.dailyData[date]?.stock || 0);
    }, 0);
  };

  // 日別合計を計算
  const getDailyTotals = (date: string) => {
    return palletData.reduce((totals, company) => {
      const dayData = company.dailyData[date];
      return {
        usage: totals.usage + (dayData?.usage || 0),
        arranged: totals.arranged + (dayData?.arranged || 0),
        inbound: totals.inbound + (dayData?.inbound || 0),
        stock: totals.stock + (dayData?.stock || 0),
      };
    }, { usage: 0, arranged: 0, inbound: 0, stock: 0 });
  };

  if (loading || historyLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">資材在庫管理</h1>
            <p className="mt-1 text-sm text-gray-500">資材在庫レベルの追跡と管理</p>
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
            <h1 className="text-2xl font-bold text-gray-900">資材在庫管理</h1>
            <p className="mt-1 text-sm text-gray-500">資材在庫レベルの追跡と管理</p>
          </div>
        </div>
        <Card>
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">エラーが発生しました</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                再読み込み
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">在庫管理</h1>
          <p className="mt-1 text-sm text-gray-500">在庫の追跡と管理</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate('/inventory/order/history')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <History size={16} className="mr-2" />
            発注履歴
          </button>
          {activeTab === 'daily' && (
            <button 
              onClick={() => navigate('/inventory/daily/edit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit size={16} className="mr-2" />
              日別編集
            </button>
          )}
          {activeTab === 'pallet' && (
            <button 
              onClick={() => navigate('/pallet-planning/edit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit size={16} className="mr-2" />
              計画編集
            </button>
          )}
          <button 
            onClick={() => navigate('/inventory/add')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-2" />
            資材追加
          </button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('daily')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'daily'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar size={16} className="inline mr-1" />
            資材在庫
          </button>
          <button
            onClick={() => setActiveTab('pallet')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pallet'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Truck size={16} className="inline mr-1" />
            パレット在庫
          </button>
        </nav>
      </div>

      {activeTab === 'daily' && (
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

          <Card>
            <div className="overflow-x-auto -mx-5">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-48">
                        資材
                      </th>
                      <th className="sticky left-48 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-20">
                        最小lot
                      </th>
                      <th className="sticky left-68 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-32">
                        メモ
                      </th>
                      <th className="sticky left-100 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-24">
                        納期
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
                    {extendedItemsData.map((item) => (
                      <tr key={item.item_id} className="hover:bg-gray-50">
                        <td className="sticky left-0 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                          <div className="flex items-center">
                            {(() => {
                              const shortages = checkInventoryShortage(item.item_id);
                              const hasCritical = shortages.some(s => s.level === 'critical');
                              const hasWarning = shortages.some(s => s.level === 'warning');
                              
                              if (hasCritical || hasWarning) {
                                return (
                                  <div className="mr-2 relative group">
                                    <ExclamationTriangle 
                                      size={16} 
                                      className={hasCritical ? 'text-red-500' : 'text-amber-500'} 
                                    />
                                    {/* ツールチップ */}
                                    <div className="absolute left-0 top-6 hidden group-hover:block z-20 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg">
                                      <div className="font-medium mb-1">在庫不足アラート</div>
                                      {shortages.map((shortage, index) => (
                                        <div key={index} className="flex justify-between">
                                          <span>{format(new Date(shortage.date), 'M/d', { locale: ja })}</span>
                                          <span className={shortage.level === 'critical' ? 'text-red-300' : 'text-amber-300'}>
                                            {shortage.stock === 0 ? '在庫切れ' : `在庫少(${shortage.stock})`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                            <div>
                            <Link
                              to={`/inventory/order?materialId=${item.item_id}`}
                              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {item.item_name}
                            </Link>
                            <div className="text-xs text-gray-500">{item.item_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="sticky left-48 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                          {item.min_lot}
                        </td>
                        <td className="sticky left-68 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                          {item.memo}
                        </td>
                        <td className="sticky left-100 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                          {format(new Date(item.delivery_date), 'M/d', { locale: ja })}
                        </td>
                        {dates.map((date) => {
                          const dayData = historyData.find(h => h.date === date && h.item_id === item.item_id);
                          const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                          const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                          const currentStock = dayData?.current_stock || 0;
                          
                          // 在庫レベルに応じた背景色
                          const getStockBackgroundColor = () => {
                            if (currentStock === 0) return 'bg-red-100';
                            if (currentStock <= 10) return 'bg-amber-100';
                            return '';
                          };
                          
                          return (
                            <td key={`${item.item_id}-${date}`} className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 ${
                              isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50' : getStockBackgroundColor()
                            }`}>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">在庫:</span>
                                  <span className={`font-medium ${
                                    currentStock === 0 ? 'text-red-600' : 
                                    currentStock <= 10 ? 'text-amber-600' : 'text-gray-900'
                                  }`}>
                                    {currentStock}
                                    {currentStock === 0 && (
                                      <ExclamationTriangle size={12} className="inline ml-1 text-red-500" />
                                    )}
                                    {currentStock > 0 && currentStock <= 10 && (
                                      <ExclamationTriangle size={12} className="inline ml-1 text-amber-500" />
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-green-600">入庫:</span>
                                  <span className="text-green-600 flex items-center">
                                    {dayData?.inbound || 0}
                                    {(dayData?.inbound || 0) > 0 && <TrendingUp size={12} className="ml-1" />}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-red-600">使用:</span>
                                  <span className="text-red-600 flex items-center">
                                    {dayData?.usage || 0}
                                    {(dayData?.usage || 0) > 0 && <TrendingDown size={12} className="ml-1" />}
                                  </span>
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

      {activeTab === 'pallet' && (
        <>
          {/* パレット計画表 */}
          <Card className="p-0">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-48">
                        レンタル会社
                      </th>
                      {dates.map((date) => {
                        const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                        return (
                          <th key={date} className={`px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32 ${
                            isWeekend ? 'bg-gray-100' : ''
                          }`}>
                            <div className="flex flex-col">
                              <span>{format(new Date(date), 'M/d', { locale: ja })}</span>
                              <span className="text-xs text-gray-400">{format(new Date(date), 'EEE', { locale: ja })}</span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {palletData.map((company) => (
                      <tr key={company.company} className="hover:bg-gray-50">
                        <td className="sticky left-0 z-10 bg-white px-4 py-4 whitespace-nowrap border-r border-gray-200">
                          <div className="flex items-center">
                            <Package size={16} className="text-blue-500 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900">{company.companyName}</div>
                              <div className="text-xs text-gray-500">{company.company}</div>
                            </div>
                          </div>
                        </td>
                        {dates.map((date) => {
                          const dayData = company.dailyData[date];
                          const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                          const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                          
                          return (
                            <td key={`${company.company}-${date}`} className={`px-4 py-4 whitespace-nowrap text-center text-sm ${
                              isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50' : ''
                            }`}>
                              <div className="space-y-2">
                                <div className="flex items-center justify-center">
                                  <span className="text-xs text-red-600 mr-1">出庫:</span>
                                  <span className="font-medium text-red-600">{dayData?.usage || 0}</span>
                                  <TrendingDown size={10} className="ml-1 text-red-500" />
                                </div>
                                <div className="flex items-center justify-center">
                                  <span className="text-xs text-green-600 mr-1">入庫:</span>
                                  <span className="font-medium text-green-600">{dayData?.inbound.toLocaleString()}</span>
                                  <TrendingUp size={10} className="ml-1 text-green-500" />
                                </div>
                                <div className="flex items-center justify-center pt-1 border-t border-gray-200">
                                  <span className="text-xs text-blue-600 mr-1">在庫:</span>
                                  <span className="font-bold text-blue-600">{dayData?.stock.toLocaleString()}</span>
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* パレット全体在庫数行 */}
                    <tr className="bg-blue-50 font-bold border-t-2 border-blue-200">
                      <td className="sticky left-0 z-10 bg-blue-50 px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-800 border-r border-gray-200">
                        <div className="flex items-center">
                          <Package size={16} className="text-blue-600 mr-3" />
                          <div>
                            <div className="font-bold text-blue-900">パレット全体</div>
                            <div className="text-xs text-blue-600">総在庫数</div>
                          </div>
                        </div>
                      </td>
                      {dates.map((date) => {
                        const totalStock = getTotalStockForDate(date);
                        const totals = getDailyTotals(date);
                        const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                        const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                        
                        return (
                          <td key={`total-stock-${date}`} className={`px-4 py-4 whitespace-nowrap text-center text-sm ${
                            isToday ? 'bg-blue-100' : isWeekend ? 'bg-blue-100' : ''
                          }`}>
                            <div className="space-y-2">
                              <div className="text-xs text-red-700">
                                出庫: {totals.usage.toLocaleString()}
                              </div>
                              <div className="text-xs text-green-700">
                                入庫: {totals.inbound.toLocaleString()}
                              </div>
                              <div className="pt-1 border-t border-blue-300">
                                <div className="text-lg font-bold text-blue-800">
                                  {totalStock.toLocaleString()}
                                </div>
                                <div className="text-xs text-blue-600">総在庫</div>
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

export default Inventory;