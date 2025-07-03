import React, { useState } from 'react';
import { CalendarDays, Plus, Filter, TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, Edit, ChevronLeft, ChevronRight, Package, FileText, ClipboardList, Truck } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'schedule' | 'monthly' | 'shipment' | 'inventory'>('schedule');
  
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
          target: Math.floor(Math.random() * 6000) + 1200, // 目標生産数
          minTarget: Math.floor(Math.random() * 4500) + 900, // 最低生産数
        }))
      });
    }
    
    return months;
  };

  const monthlyData = generateMonthlyData();

  // 製品在庫のサンプルデータを生成
  const generateProductInventoryData = () => {
    // 製品 -> 出荷顧客 -> 出荷先の階層構造
    const productInventoryData = [
      {
        product_id: 'PROD-A',
        product_name: '製品A',
        unit_price: 1500,
        customers: [
          {
            customer_name: 'A商事株式会社',
            unit_price: 1500,
            destinations: [
              {
                destination_name: '東京都港区本社',
                min_quantity: 100,
                max_quantity: 1000,
              },
              {
                destination_name: '東京都江東区倉庫',
                min_quantity: 50,
                max_quantity: 500,
              }
            ]
          },
          {
            customer_name: 'X流通株式会社',
            unit_price: 1450,
            destinations: [
              {
                destination_name: '神奈川県横浜市',
                min_quantity: 80,
                max_quantity: 800,
              }
            ]
          }
        ]
      },
      {
        product_id: 'PROD-B',
        product_name: '製品B',
        unit_price: 2200,
        customers: [
          {
            customer_name: 'B流通株式会社',
            unit_price: 2200,
            destinations: [
              {
                destination_name: '大阪府大阪市本店',
                min_quantity: 120,
                max_quantity: 1200,
              },
              {
                destination_name: '大阪府堺市支店',
                min_quantity: 30,
                max_quantity: 300,
              }
            ]
          }
        ]
      },
      {
        product_id: 'PROD-C',
        product_name: '製品C',
        unit_price: 3800,
        customers: [
          {
            customer_name: 'Cマート',
            unit_price: 3800,
            destinations: [
              {
                destination_name: '愛知県名古屋市店舗',
                min_quantity: 60,
                max_quantity: 600,
              }
            ]
          },
          {
            customer_name: 'Y商事',
            unit_price: 3650,
            destinations: [
              {
                destination_name: '静岡県浜松市',
                min_quantity: 40,
                max_quantity: 200,
              }
            ]
          }
        ]
      },
    ];

    return productInventoryData;
  };

  // 製品在庫データ（サンプル）
  const productInventoryItems = generateProductInventoryData();

  // 製品の日別在庫予測を生成（階層構造対応）
  const generateProductInventoryForecast = () => {
    const forecast: { [key: string]: { [date: string]: number } } = {};
    
    productInventoryItems.forEach(product => {
      // 製品レベルの予測
      forecast[product.product_id] = {};
      let productTotalStock = 0;
      
      // 過去7日分のデータも含めて14日分生成
      const extendedDates = Array.from({ length: 14 }, (_, i) => {
        const date = addDays(weekStart, i - 7);
        return format(date, 'yyyy-MM-dd');
      });
      
      // 顧客・出荷先レベルの予測
      product.customers.forEach(customer => {
        customer.destinations.forEach(destination => {
          const key = `${product.product_id}-${customer.customer_name}-${destination.destination_name}`;
          forecast[key] = {};
          let currentStock = Math.floor(Math.random() * 500) + 200; // 初期在庫
          
          dates.forEach((date) => {
            // 生産による在庫増加
            const productionData = scheduleData.find(s => 
              s.date === date && s.product_id === product.product_id
            );
            const production = Math.floor((productionData?.planned_quantity || 0) * 0.3); // 出荷先別に分散
            
            // 出荷・使用による在庫減少（サンプル値）
            const baseUsage = Math.floor(currentStock * 0.1);
            const dailyVariation = Math.floor(Math.random() * baseUsage * 0.6);
            const usage = Math.max(0, baseUsage + dailyVariation - (baseUsage * 0.3));
            
            // 週末は使用量を減らす
            const dayOfWeek = new Date(date).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const adjustedUsage = isWeekend ? Math.floor(usage * 0.2) : usage;
            
            // 在庫計算
            currentStock = Math.max(0, Math.floor(currentStock + production - adjustedUsage));
            forecast[key][date] = currentStock;
          });
        });
      });
      
      // 製品レベルの合計在庫を計算
      dates.forEach(date => {
        let dailyTotal = 0;
        product.customers.forEach(customer => {
          customer.destinations.forEach(destination => {
            const key = `${product.product_id}-${customer.customer_name}-${destination.destination_name}`;
            dailyTotal += forecast[key][date] || 0;
          });
        });
        forecast[product.product_id][date] = dailyTotal;
      });
    });
    
    return forecast;
  };

  const productInventoryForecast = generateProductInventoryForecast();

  // 製品出庫データを生成（サンプル）
  const generateProductShipmentData = () => {
    const shipmentData: { [key: string]: { [date: string]: number } } = {};
    
    productInventoryItems.forEach(product => {
      // 製品レベルの出庫予定
      shipmentData[product.product_id] = {};
      
      // 顧客・出荷先レベルの出庫予定
      product.customers.forEach(customer => {
        customer.destinations.forEach(destination => {
          const key = `${product.product_id}-${customer.customer_name}-${destination.destination_name}`;
          shipmentData[key] = {};
          
          dates.forEach((date) => {
            // 出荷予定数（サンプル値）
            const dayOfWeek = new Date(date).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            if (isWeekend) {
              shipmentData[key][date] = 0;
            } else {
              const baseShipment = Math.floor(Math.random() * 100) + 20;
              shipmentData[key][date] = baseShipment;
            }
          });
        });
      });
      
      // 製品レベルの合計出庫を計算
      dates.forEach(date => {
        let dailyTotal = 0;
        product.customers.forEach(customer => {
          customer.destinations.forEach(destination => {
            const key = `${product.product_id}-${customer.customer_name}-${destination.destination_name}`;
            dailyTotal += shipmentData[key][date] || 0;
          });
        });
        shipmentData[product.product_id][date] = dailyTotal;
      });
    });
    
    return shipmentData;
  };

  const productShipmentData = generateProductShipmentData();

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
          {(activeTab === 'schedule' || activeTab === 'monthly') && (
            <button 
              onClick={() => navigate('/production/schedule/edit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit size={16} className="mr-2" />
              生産編集
            </button>
          )}
          {activeTab === 'shipment' && (
            <button 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit size={16} className="mr-2" />
              出庫編集
            </button>
          )}
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
            onClick={() => setActiveTab('shipment')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'shipment'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Truck size={16} className="inline mr-1" />
            製品出庫
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
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-1.5">
            <button
              onClick={() => navigateWeek('prev')}
              className="inline-flex items-center px-1.5 py-0.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={14} />
            </button>
            
            <div className="text-center">
              <h3 className="text-xs font-medium text-gray-900">
                {format(weekStart, 'yyyy年M月d日', { locale: ja })} - {format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'M月d日', { locale: ja })}
              </h3>
              <button
                onClick={goToCurrentWeek}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                今週
              </button>
            </div>
            
            <button
              onClick={() => navigateWeek('next')}
              className="inline-flex items-center px-1.5 py-0.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={14} />
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
                        
                        // 目標達成状況の色分け
                        let textColor = 'text-blue-800';
                        if (total >= target && target > 0) {
                          textColor = 'text-green-800';
                        } else if (total >= minTarget && minTarget > 0) {
                          textColor = 'text-amber-800';
                        } else if (target > 0) {
                          textColor = 'text-red-800';
                        }
                        
                        return (
                          <td key={`total-${date}`} className={`px-4 py-3 whitespace-nowrap text-center text-sm font-medium ${textColor} ${
                            isWeekend ? 'bg-blue-100' : ''
                          }`}>
                            <div>
                              <span className="font-medium">{total.toLocaleString()}</span>
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
                {/* 目標生産数行 */}
                <tr className="bg-green-50">
                  <td className="sticky left-0 z-10 bg-green-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-green-800 border-r border-gray-200">
                    目標生産数
                  </td>
                  {monthlyData.map((month) => {
                    const monthlyTarget = month.data.reduce((sum, product) => sum + product.target, 0);
                    const isCurrentMonth = month.month.includes(format(new Date(), 'yyyy年M月'));
                    
                    return (
                      <td key={`target-${month.month}`} className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${isCurrentMonth ? 'bg-green-100 text-green-900' : 'text-green-800'}`}>
                        {monthlyTarget.toLocaleString()}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-green-800">
                    {monthlyData.reduce((sum, month) => 
                      sum + month.data.reduce((monthSum, product) => monthSum + product.target, 0), 0
                    ).toLocaleString()}
                  </td>
                </tr>

                {/* 最低生産数行 */}
                <tr className="bg-amber-50">
                  <td className="sticky left-0 z-10 bg-amber-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-800 border-r border-gray-200">
                    最低生産数
                  </td>
                  {monthlyData.map((month) => {
                    const monthlyMinTarget = month.data.reduce((sum, product) => sum + product.minTarget, 0);
                    const isCurrentMonth = month.month.includes(format(new Date(), 'yyyy年M月'));
                    
                    return (
                      <td key={`min-target-${month.month}`} className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${isCurrentMonth ? 'bg-amber-100 text-amber-900' : 'text-amber-800'}`}>
                        {monthlyMinTarget.toLocaleString()}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-amber-800">
                    {monthlyData.reduce((sum, month) => 
                      sum + month.data.reduce((monthSum, product) => monthSum + product.minTarget, 0), 0
                    ).toLocaleString()}
                  </td>
                </tr>

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
                    (() => {
                      const monthlyTotal = month.data.reduce((sum, product) => sum + product.total, 0);
                      const monthlyTarget = month.data.reduce((sum, product) => sum + product.target, 0);
                      const monthlyMinTarget = month.data.reduce((sum, product) => sum + product.minTarget, 0);
                      
                      // 達成率計算
                      const targetAchievementRate = monthlyTarget > 0 ? (monthlyTotal / monthlyTarget) * 100 : 0;
                      const minTargetAchievementRate = monthlyMinTarget > 0 ? (monthlyTotal / monthlyMinTarget) * 100 : 0;
                      
                      // 達成率の色分け
                      const getAchievementColor = (rate: number) => {
                        if (rate >= 100) return 'text-green-600';
                        if (rate >= 80) return 'text-amber-600';
                        return 'text-red-600';
                      };
                      
                      return (
                        <td key={`total-${month.month}`} className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                         <div className="space-y-1">
                           <div className="text-lg font-bold">
                             {monthlyTotal.toLocaleString()}
                           </div>
                           <div className="text-xs space-y-1">
                             <div className={`${getAchievementColor(targetAchievementRate)}`}>
                               目標達成率: {targetAchievementRate.toFixed(1)}%
                             </div>
                             <div className={`${getAchievementColor(minTargetAchievementRate)}`}>
                               最低達成率: {minTargetAchievementRate.toFixed(1)}%
                             </div>
                           </div>
                         </div>
                        </td>
                      );
                    })()
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                    <div className="space-y-1">
                      <div className="text-lg font-bold">
                        {monthlyData.reduce((sum, month) => 
                          sum + month.data.reduce((monthSum, product) => monthSum + product.total, 0), 0
                        ).toLocaleString()}
                      </div>
                      <div className="text-xs space-y-1">
                        {(() => {
                          const totalActual = monthlyData.reduce((sum, month) => 
                            sum + month.data.reduce((monthSum, product) => monthSum + product.total, 0), 0
                          );
                          const totalTarget = monthlyData.reduce((sum, month) => 
                            sum + month.data.reduce((monthSum, product) => monthSum + product.target, 0), 0
                          );
                          const totalMinTarget = monthlyData.reduce((sum, month) => 
                            sum + month.data.reduce((monthSum, product) => monthSum + product.minTarget, 0), 0
                          );
                          
                          const totalTargetRate = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;
                          const totalMinTargetRate = totalMinTarget > 0 ? (totalActual / totalMinTarget) * 100 : 0;
                          
                          const getAchievementColor = (rate: number) => {
                            if (rate >= 100) return 'text-green-600';
                            if (rate >= 80) return 'text-amber-600';
                            return 'text-red-600';
                          };
                          
                          return (
                            <>
                              <div className={`${getAchievementColor(totalTargetRate)}`}>
                                目標: {totalTargetRate.toFixed(1)}%
                              </div>
                              <div className={`${getAchievementColor(totalMinTargetRate)}`}>
                                最低: {totalMinTargetRate.toFixed(1)}%
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'shipment' && (
        <>
          {/* 週ナビゲーション */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-1.5">
            <button
              onClick={() => navigateWeek('prev')}
              className="inline-flex items-center px-1.5 py-0.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={14} />
            </button>
            
            <div className="text-center">
              <h3 className="text-xs font-medium text-gray-900">
                製品出庫予定: {format(weekStart, 'yyyy年M月d日', { locale: ja })} - {format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'M月d日', { locale: ja })}
              </h3>
              <button
                onClick={goToCurrentWeek}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                今週
              </button>
            </div>
            
            <button
              onClick={() => navigateWeek('next')}
              className="inline-flex items-center px-1.5 py-0.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900">製品出庫予定（階層別・日別）</h2>
              <p className="text-sm text-gray-500">顧客・出荷先別の出庫予定と配送計画</p>
            </div>
            
            <div className="overflow-x-auto -mx-5">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-64">
                        製品 / 出荷顧客 / 出荷先
                      </th>
                      <th className="sticky left-64 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-24">
                        単価
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
                    {productInventoryItems.map((product) => (
                      <React.Fragment key={product.product_id}>
                        {/* 製品レベル（合計行） */}
                        <tr className="bg-orange-50 border-t-2 border-orange-200">
                          <td className="sticky left-0 z-10 bg-orange-50 px-4 py-4 whitespace-nowrap text-sm font-bold text-orange-900 border-r border-gray-200">
                            <div className="flex items-center">
                              <Truck size={18} className="text-orange-600 mr-3" />
                              <div>
                                <div className="font-bold text-orange-900">{product.product_name}</div>
                                <div className="text-xs text-orange-600">{product.product_id} - 日別合計出庫</div>
                              </div>
                            </div>
                          </td>
                          <td className="sticky left-64 z-10 bg-orange-50 px-4 py-4 whitespace-nowrap text-sm text-orange-900 border-r border-gray-200">
                            <div className="text-center">
                              <span className="text-orange-600">-</span>
                            </div>
                          </td>
                          {dates.map((date) => {
                            const totalShipment = productShipmentData[product.product_id]?.[date] || 0;
                            const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                            const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                            
                            return (
                              <td key={`${product.product_id}-total-${date}`} className={`px-4 py-4 whitespace-nowrap text-sm ${
                                isToday ? 'bg-orange-100' : isWeekend ? 'bg-orange-100' : ''
                              }`}>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-orange-800">
                                    {totalShipment.toLocaleString()}
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                        
                        {/* 顧客・出荷先レベル */}
                        {product.customers.map((customer, customerIndex) => (
                          <React.Fragment key={`${product.product_id}-${customer.customer_name}`}>
                            {customer.destinations.map((destination, destIndex) => {
                              const key = `${product.product_id}-${customer.customer_name}-${destination.destination_name}`;
                              const isFirstDestination = destIndex === 0;
                              
                              return (
                                <tr key={key} className="hover:bg-gray-50">
                                  <td className="sticky left-0 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                    <div className="flex items-center">
                                      <div className="w-6 mr-2"></div> {/* インデント */}
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 border-l border-b border-gray-300 mr-2"></div>
                                        <div>
                                          {isFirstDestination && (
                                            <div className="font-medium text-gray-700 mb-1">
                                              {customer.customer_name}
                                            </div>
                                          )}
                                          <div className="text-sm text-gray-600 ml-4">
                                            {destination.destination_name}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="sticky left-64 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                                    <div className="text-center">
                                      {isFirstDestination ? (
                                        <span className="font-medium text-gray-900">¥{customer.unit_price.toLocaleString()}</span>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </div>
                                  </td>
                                  {dates.map((date) => {
                                    const shipmentQuantity = productShipmentData[key]?.[date] || 0;
                                    const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                                    const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                                    
                                    return (
                                      <td key={`${key}-${date}`} className={`px-4 py-4 whitespace-nowrap text-sm ${
                                        isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50' : ''
                                      }`}>
                                        <div className="text-center">
                                          <div className={`font-medium ${
                                            shipmentQuantity > 0 ? 'text-orange-600' : 'text-gray-400'
                                          }`}>
                                            {shipmentQuantity > 0 ? shipmentQuantity.toLocaleString() : '-'}
                                          </div>
                                          {shipmentQuantity > 0 && isFirstDestination && (
                                            <div className="text-xs text-gray-500 mt-1">
                                              ¥{(shipmentQuantity * customer.unit_price).toLocaleString()}
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'inventory' && (
        <>
          {/* 週ナビゲーション */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-1.5">
            <button
              onClick={() => navigateWeek('prev')}
              className="inline-flex items-center px-1.5 py-0.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={14} />
            </button>
            
            <div className="text-center">
              <h3 className="text-xs font-medium text-gray-900">
                製品在庫予測: {format(weekStart, 'yyyy年M月d日', { locale: ja })} - {format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'M月d日', { locale: ja })}
              </h3>
              <button
                onClick={goToCurrentWeek}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                今週
              </button>
            </div>
            
            <button
              onClick={() => navigateWeek('next')}
              className="inline-flex items-center px-1.5 py-0.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900">製品在庫予測（階層別・日別）</h2>
              <p className="text-sm text-gray-500">生産計画と出荷予定に基づく在庫予測</p>
            </div>
            
            <div className="overflow-x-auto -mx-5">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-64">
                        製品 / 出荷顧客 / 出荷先
                      </th>
                      <th className="sticky left-64 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-24">
                        単価
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
                    {productInventoryItems.map((product) => (
                      <tr key={product.product_id} className="hover:bg-gray-50">
                        <td className="sticky left-0 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                          <div className="flex items-center">
                            <Package size={18} className="text-blue-600 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900">{product.product_name}</div>
                              <div className="text-xs text-gray-500">{product.product_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="sticky left-64 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                          <div className="text-center">
                            <span className="font-medium text-gray-900">¥{product.unit_price.toLocaleString()}</span>
                          </div>
                        </td>
                        {dates.map((date) => {
                          const totalStock = productInventoryForecast[product.product_id]?.[date] || 0;
                          const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                          const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                          
                          // 製品全体の最小・最大在庫を計算（全出荷先の合計）
                          const totalMinQuantity = product.customers.reduce((sum, customer) => 
                            sum + customer.destinations.reduce((destSum, dest) => destSum + dest.min_quantity, 0), 0
                          );
                          const totalMaxQuantity = product.customers.reduce((sum, customer) => 
                            sum + customer.destinations.reduce((destSum, dest) => destSum + dest.max_quantity, 0), 0
                          );
                          
                          return (
                            <td key={`${product.product_id}-${date}`} className={`px-4 py-4 whitespace-nowrap text-sm ${
                              isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50' : ''
                            }`}>
                              <div className="text-center">
                                <div className={`font-medium ${getInventoryLevelColor(totalStock, totalMinQuantity, totalMaxQuantity)}`}>
                                  {totalStock.toLocaleString()}
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