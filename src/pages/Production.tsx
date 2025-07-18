import React, { useState } from 'react';
import { CalendarDays, Plus, Filter, TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, Edit, ChevronLeft, ChevronRight, Package, FileText, ClipboardList, Truck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { useProductionSchedule } from '../hooks/useProductionSchedule';
import { useInventory } from '../hooks/useInventory';
import { format, addDays, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';

const Production: React.FC = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { scheduleData, loading, error } = useProductionSchedule(currentWeek);
  const { items: inventoryItems, loading: inventoryLoading } = useInventory();
  const [activeTab, setActiveTab] = useState<'schedule' | 'monthly' | 'shipment' | 'inventory'>('schedule');
  
  // 現在の週の日付を生成
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 月曜日開始
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return format(date, 'yyyy-MM-dd');
  });

  // サンプル生産スケジュールデータを生成
  const generateSampleScheduleData = () => {
    const sampleProducts = [
      { id: 'PROD-A', name: '製品A' },
      { id: 'PROD-B', name: '製品B' },
      { id: 'PROD-C', name: '製品C' },
    ];

    const sampleData = [];
    dates.forEach(date => {
      sampleProducts.forEach(product => {
        const dayOfWeek = new Date(date).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        let plannedQuantity = 0;
        if (!isWeekend) {
          // 製品別の基本生産量
          const baseQuantity = product.id === 'PROD-A' ? 200 : 
                              product.id === 'PROD-B' ? 150 : 100;
          plannedQuantity = baseQuantity + Math.floor(Math.random() * 100) - 50;
          plannedQuantity = Math.max(0, plannedQuantity);
        }
        
        const actualQuantity = Math.floor(plannedQuantity * (0.85 + Math.random() * 0.3));
        const completionRate = plannedQuantity > 0 ? (actualQuantity / plannedQuantity) * 100 : 0;
        
        let status = 'scheduled';
        const today = format(new Date(), 'yyyy-MM-dd');
        if (date < today) {
          status = actualQuantity >= plannedQuantity * 0.95 ? 'completed' : 'delayed';
        } else if (date === today) {
          status = 'in_progress';
        }

        sampleData.push({
          date,
          product_id: product.id,
          product_name: product.name,
          planned_quantity: plannedQuantity,
          actual_quantity: date <= today ? actualQuantity : 0,
          status,
          completion_rate: Math.min(completionRate, 100),
        });
      });
    });
    
    return sampleData;
  };

  // サンプルデータを使用（実際のデータがない場合）
  const displayScheduleData = scheduleData && scheduleData.length > 0 ? scheduleData : generateSampleScheduleData();

  // ユニークな製品リストを取得
  const uniqueProducts = Array.from(new Set(displayScheduleData.map(s => s.product_id)))
    .map(productId => displayScheduleData.find(s => s.product_id === productId))
    .filter(Boolean);

  // 年度データの生成（11月～翌年10月）
  const generateYearlyData = (year: number) => {
    const months = [];
    
    // 11月から翌年10月まで（年度）
    for (let i = 0; i < 12; i++) {
      const monthIndex = (10 + i) % 12; // 10=11月, 11=12月, 0=1月, ..., 9=10月
      const yearOffset = i < 2 ? 0 : 1; // 11月、12月は当年、1月～10月は翌年
      const month = new Date(year + yearOffset, monthIndex, 1);
      
      months.push({
        month: format(month, 'yyyy年M月'),
        monthIndex: i, // 年度内での順序（0=11月, 1=12月, 2=1月, ..., 11=10月）
        data: [
          {
            product_id: 'PROD-A',
            product_name: '製品A',
            total: Math.floor(Math.random() * 5000) + 3000,
            target: Math.floor(Math.random() * 6000) + 3500,
            minTarget: Math.floor(Math.random() * 4500) + 2800,
          },
          {
            product_id: 'PROD-B',
            product_name: '製品B',
            total: Math.floor(Math.random() * 4000) + 2000,
            target: Math.floor(Math.random() * 5000) + 2500,
            minTarget: Math.floor(Math.random() * 3500) + 1800,
          },
          {
            product_id: 'PROD-C',
            product_name: '製品C',
            total: Math.floor(Math.random() * 3000) + 1500,
            target: Math.floor(Math.random() * 4000) + 2000,
            minTarget: Math.floor(Math.random() * 2500) + 1200,
          }
        ]
      });
    }
    
    return months;
  };

  const yearlyData = generateYearlyData(currentYear);

  const navigateYear = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentYear(currentYear + 1);
    }
  };

  const goToCurrentYear = () => {
    setCurrentYear(new Date().getFullYear());
  };

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
    const forecast: { [key: string]: { [date: string]: { 
      inbound: number; 
      outbound: number; 
      external_transfer: number; 
      stock: number; 
    } } } = {};
    
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
            const productionData = (scheduleData || []).find(s => 
              s.date === date && s.product_id === product.product_id
            );
            const inbound = Math.floor((productionData?.planned_quantity || 0) * 0.3); // 出荷先別に分散
            
            // 出荷・使用による在庫減少（サンプル値）
            const baseUsage = Math.floor(currentStock * 0.1);
            const dailyVariation = Math.floor(Math.random() * baseUsage * 0.6);
            const outbound = Math.max(0, baseUsage + dailyVariation - (baseUsage * 0.3));
            
            // 外部移送（他の拠点への移送など）
            const externalTransfer = Math.floor(Math.random() * 30); // 0-30の範囲
            
            // 週末は使用量を減らす
            const dayOfWeek = new Date(date).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const adjustedOutbound = isWeekend ? Math.floor(outbound * 0.2) : outbound;
            const adjustedExternalTransfer = isWeekend ? Math.floor(externalTransfer * 0.1) : externalTransfer;
            
            // 在庫計算
            currentStock = Math.max(0, Math.floor(currentStock + inbound - adjustedOutbound - adjustedExternalTransfer));
            forecast[key][date] = {
              inbound,
              outbound: adjustedOutbound,
              external_transfer: adjustedExternalTransfer,
              stock: currentStock
            };
          });
        });
      });
      
      // 製品レベルの合計在庫を計算
      dates.forEach(date => {
        let totalInbound = 0;
        let totalOutbound = 0;
        let totalExternalTransfer = 0;
        let totalStock = 0;
        
        product.customers.forEach(customer => {
          customer.destinations.forEach(destination => {
            const key = `${product.product_id}-${customer.customer_name}-${destination.destination_name}`;
            const dayData = forecast[key][date];
            if (dayData) {
              totalInbound += dayData.inbound;
              totalOutbound += dayData.outbound;
              totalExternalTransfer += dayData.external_transfer;
              totalStock += dayData.stock;
            }
          });
        });
        
        forecast[product.product_id][date] = {
          inbound: totalInbound,
          outbound: totalOutbound,
          external_transfer: totalExternalTransfer,
          stock: totalStock
        };
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
    return displayScheduleData
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
            <h1 className="text-2xl font-bold text-gray-900">生産計画</h1>
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
            <h1 className="text-2xl font-bold text-gray-900">生産計画</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">生産</h1>
          <p className="mt-1 text-sm text-gray-500">週間生産スケジュールと製品出庫管理</p>
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
            生産計画
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
                          const dayData = displayScheduleData.find(s => s.date === date && s.product_id === product?.product_id);
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
                        
                        // 達成率計算
                        const targetAchievementRate = target > 0 ? (total / target) * 100 : 0;
                        const minTargetAchievementRate = minTarget > 0 ? (total / minTarget) * 100 : 0;
                        
                        // 達成率の色分け
                        const getAchievementColor = (rate: number) => {
                          if (rate >= 100) return 'text-green-800';
                          if (rate >= 80) return 'text-amber-800';
                          return 'text-red-800';
                        };
                        
                        return (
                          <td key={`total-${date}`} className={`px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-blue-800 ${
                            isWeekend ? 'bg-blue-100' : ''
                          }`}>
                            <div className="space-y-1">
                              <div className="text-lg font-bold">
                                {total.toLocaleString()}
                              </div>
                              {target > 0 && (
                                <div className="text-xs space-y-1">
                                  <div className={`${getAchievementColor(targetAchievementRate)}`}>
                                    目標達成率: {targetAchievementRate.toFixed(1)}%
                                  </div>
                                  {minTarget > 0 && (
                                    <div className={`${getAchievementColor(minTargetAchievementRate)}`}>
                                      最低達成率: {minTargetAchievementRate.toFixed(1)}%
                                    </div>
                                  )}
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
        <>
          {/* 年ナビゲーション */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-1.5">
            <button
              onClick={() => navigateYear('prev')}
              className="inline-flex items-center px-1.5 py-0.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={14} />
            </button>
            
            <div className="text-center">
              <h3 className="text-xs font-medium text-gray-900">
                生産集計: {currentYear}年度（{currentYear}年11月 - {currentYear + 1}年10月）
              </h3>
              <button
                onClick={goToCurrentYear}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                今年度
              </button>
            </div>
            
            <button
              onClick={() => navigateYear('next')}
              className="inline-flex items-center px-1.5 py-0.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={14} />
            </button>
          </div>

        <Card>
          <div className="overflow-x-auto -mx-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    製品
                  </th>
                  {yearlyData.map((month) => (
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
                  {yearlyData.map((month) => {
                    const monthlyTarget = month.data.reduce((sum, product) => sum + product.target, 0);
                    const currentDate = new Date();
                    const currentMonthYear = format(currentDate, 'yyyy年M月');
                    const isCurrentMonth = month.month === currentMonthYear;
                    
                    return (
                      <td key={`target-${month.month}`} className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${isCurrentMonth ? 'bg-green-100 text-green-900' : 'text-green-800'}`}>
                        {monthlyTarget.toLocaleString()}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-green-800">
                    {yearlyData.reduce((sum, month) => 
                      sum + month.data.reduce((monthSum, product) => monthSum + product.target, 0), 0
                    ).toLocaleString()}
                  </td>
                </tr>

                {/* 最低生産数行 */}
                <tr className="bg-amber-50">
                  <td className="sticky left-0 z-10 bg-amber-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-800 border-r border-gray-200">
                    最低生産数
                  </td>
                  {yearlyData.map((month) => {
                    const monthlyMinTarget = month.data.reduce((sum, product) => sum + product.minTarget, 0);
                    const currentDate = new Date();
                    const currentMonthYear = format(currentDate, 'yyyy年M月');
                    const isCurrentMonth = month.month === currentMonthYear;
                    
                    return (
                      <td key={`min-target-${month.month}`} className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${isCurrentMonth ? 'bg-amber-100 text-amber-900' : 'text-amber-800'}`}>
                        {monthlyMinTarget.toLocaleString()}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-amber-800">
                    {yearlyData.reduce((sum, month) => 
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
                    {yearlyData.map((month) => {
                      const productData = month.data.find(d => d.product_id === product?.product_id);
                      const currentDate = new Date();
                      const currentMonthYear = format(currentDate, 'yyyy年M月');
                      const isCurrentMonth = month.month === currentMonthYear;
                      
                      return (
                        <td key={`${product?.product_id}-${month.month}`} className={`px-6 py-4 whitespace-nowrap text-center text-sm ${isCurrentMonth ? 'bg-blue-50 font-medium text-blue-900' : 'text-gray-900'}`}>
                          {productData?.total.toLocaleString() || 0}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                      {yearlyData.reduce((sum, month) => 
                        sum + (month.data.find(d => d.product_id === product?.product_id)?.total || 0), 0
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
                
                {/* 月別合計行 */}
                <tr className="bg-gray-50 font-medium">
                  <td className="sticky left-0 z-10 bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                    月別合計
                  </td>
                  {yearlyData.map((month) => (
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
                        {yearlyData.reduce((sum, month) => 
                          sum + month.data.reduce((monthSum, product) => monthSum + product.total, 0), 0
                        ).toLocaleString()}
                      </div>
                      <div className="text-xs space-y-1">
                        {(() => {
                          const totalActual = yearlyData.reduce((sum, month) => 
                            sum + month.data.reduce((monthSum, product) => monthSum + product.total, 0), 0
                          );
                          const totalTarget = yearlyData.reduce((sum, month) => 
                            sum + month.data.reduce((monthSum, product) => monthSum + product.target, 0), 0
                          );
                          const totalMinTarget = yearlyData.reduce((sum, month) => 
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
                        {dates.map((date) => {
                          const dayData = productInventoryForecast[product.product_id]?.[date];
                          const totalStock = dayData?.stock || 0;
                          const inbound = dayData?.inbound || 0;
                          const outbound = dayData?.outbound || 0;
                          const externalTransfer = dayData?.external_transfer || 0;
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
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-green-600">入庫:</span>
                                  <span className="text-green-600 font-medium">
                                    {inbound.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-red-600">出荷:</span>
                                  <span className="text-red-600 font-medium">
                                    {outbound.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-purple-600">移送:</span>
                                  <span className="text-purple-600 font-medium">
                                    {externalTransfer.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                                  <span className="text-xs text-blue-600">在庫:</span>
                                  <span className={`font-bold ${getInventoryLevelColor(totalStock, totalMinQuantity, totalMaxQuantity)}`}>
                                    {totalStock.toLocaleString()}
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
    </div>
  );
};

export default Production;