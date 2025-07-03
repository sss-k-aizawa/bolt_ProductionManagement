import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Chart from '../components/ui/Chart';
import { Calendar, Package, TrendingUp, TrendingDown, Edit, Truck, BarChart3, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';

const Production: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'schedule' | 'shipment' | 'inventory' | 'summary'>('schedule');
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // 現在の週の開始日から1週間分の日付を生成
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 月曜日開始
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return format(date, 'yyyy-MM-dd');
  });

  // 生産スケジュールデータ（サンプル）
  const productionSchedule = [
    {
      product_id: 'PROD-A',
      product_name: '製品A',
      daily_production: {
        [dates[0]]: 200,
        [dates[1]]: 250,
        [dates[2]]: 180,
        [dates[3]]: 300,
        [dates[4]]: 220,
        [dates[5]]: 0,
        [dates[6]]: 0,
      }
    },
    {
      product_id: 'PROD-B',
      product_name: '製品B',
      daily_production: {
        [dates[0]]: 150,
        [dates[1]]: 180,
        [dates[2]]: 200,
        [dates[3]]: 160,
        [dates[4]]: 190,
        [dates[5]]: 0,
        [dates[6]]: 0,
      }
    },
    {
      product_id: 'PROD-C',
      product_name: '製品C',
      daily_production: {
        [dates[0]]: 100,
        [dates[1]]: 120,
        [dates[2]]: 0,
        [dates[3]]: 140,
        [dates[4]]: 110,
        [dates[5]]: 0,
        [dates[6]]: 0,
      }
    }
  ];

  // 製品出庫データ（サンプル）
  const productShipment = [
    {
      product_id: 'PROD-A',
      product_name: '製品A',
      customers: [
        {
          customer_name: 'A商事株式会社',
          destinations: [
            {
              destination_name: '東京都港区本社',
              daily_shipment: {
                [dates[0]]: 80,
                [dates[1]]: 95,
                [dates[2]]: 70,
                [dates[3]]: 110,
                [dates[4]]: 85,
                [dates[5]]: 0,
                [dates[6]]: 0,
              }
            },
            {
              destination_name: '東京都江東区倉庫',
              daily_shipment: {
                [dates[0]]: 50,
                [dates[1]]: 60,
                [dates[2]]: 45,
                [dates[3]]: 70,
                [dates[4]]: 55,
                [dates[5]]: 0,
                [dates[6]]: 0,
              }
            }
          ]
        }
      ]
    },
    {
      product_id: 'PROD-B',
      product_name: '製品B',
      customers: [
        {
          customer_name: 'B流通株式会社',
          destinations: [
            {
              destination_name: '大阪府大阪市本店',
              daily_shipment: {
                [dates[0]]: 120,
                [dates[1]]: 140,
                [dates[2]]: 150,
                [dates[3]]: 130,
                [dates[4]]: 145,
                [dates[5]]: 0,
                [dates[6]]: 0,
              }
            }
          ]
        }
      ]
    }
  ];

  // 製品在庫データ（サンプル）
  const productInventory = [
    {
      product_id: 'PROD-A',
      product_name: '製品A',
      customers: [
        {
          customer_name: 'A商事株式会社',
          destinations: [
            {
              destination_name: '東京都港区本社',
              daily_stock: {
                [dates[0]]: 450,
                [dates[1]]: 520,
                [dates[2]]: 380,
                [dates[3]]: 600,
                [dates[4]]: 480,
                [dates[5]]: 480,
                [dates[6]]: 480,
              }
            },
            {
              destination_name: '東京都江東区倉庫',
              daily_stock: {
                [dates[0]]: 280,
                [dates[1]]: 320,
                [dates[2]]: 250,
                [dates[3]]: 380,
                [dates[4]]: 300,
                [dates[5]]: 300,
                [dates[6]]: 300,
              }
            }
          ]
        }
      ]
    },
    {
      product_id: 'PROD-B',
      product_name: '製品B',
      customers: [
        {
          customer_name: 'B流通株式会社',
          destinations: [
            {
              destination_name: '大阪府大阪市本店',
              daily_stock: {
                [dates[0]]: 680,
                [dates[1]]: 720,
                [dates[2]]: 770,
                [dates[3]]: 800,
                [dates[4]]: 845,
                [dates[5]]: 845,
                [dates[6]]: 845,
              }
            }
          ]
        }
      ]
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

  const getTotalProductionForDate = (date: string) => {
    return productionSchedule.reduce((sum, product) => sum + (product.daily_production[date] || 0), 0);
  };

  const getTotalShipmentForDate = (date: string) => {
    return productShipment.reduce((total, product) => 
      total + product.customers.reduce((customerTotal, customer) => 
        customerTotal + customer.destinations.reduce((destTotal, dest) => 
          destTotal + (dest.daily_shipment[date] || 0), 0
        ), 0
      ), 0
    );
  };

  const getTotalInventoryForDate = (date: string) => {
    return productInventory.reduce((total, product) => 
      total + product.customers.reduce((customerTotal, customer) => 
        customerTotal + customer.destinations.reduce((destTotal, dest) => 
          destTotal + (dest.daily_stock[date] || 0), 0
        ), 0
      ), 0
    );
  };

  const getProductTotalProduction = (product: any) => {
    return Object.values(product.daily_production).reduce((sum: number, qty: any) => sum + qty, 0);
  };

  const getProductTotalShipment = (product: any, date: string) => {
    return product.customers.reduce((total: number, customer: any) => 
      total + customer.destinations.reduce((destTotal: number, dest: any) => 
        destTotal + (dest.daily_shipment[date] || 0), 0
      ), 0
    );
  };

  const getProductTotalInventory = (product: any, date: string) => {
    return product.customers.reduce((total: number, customer: any) => 
      total + customer.destinations.reduce((destTotal: number, dest: any) => 
        destTotal + (dest.daily_stock[date] || 0), 0
      ), 0
    );
  };

  // 生産集計データの生成
  const generateSummaryData = () => {
    return dates.map(date => ({
      date: format(new Date(date), 'M/d', { locale: ja }),
      production: getTotalProductionForDate(date),
      shipment: getTotalShipmentForDate(date),
      inventory: getTotalInventoryForDate(date)
    }));
  };

  const summaryData = generateSummaryData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">生産管理</h1>
          <p className="mt-1 text-sm text-gray-500">生産計画、製品出庫、在庫管理の統合ダッシュボード</p>
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
            <Calendar size={16} className="inline mr-1" />
            生産計画
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
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'summary'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 size={16} className="inline mr-1" />
            生産集計
          </button>
        </nav>
      </div>

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

      {/* タブコンテンツ */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">週間生産計画</h2>
            <button 
              onClick={() => navigate('/production/schedule/edit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit size={16} className="mr-2" />
              計画編集
            </button>
          </div>

          <Card className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      製品
                    </th>
                    {dates.map((date) => {
                      const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                      return (
                        <th key={date} className={`px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          isWeekend ? 'bg-gray-100' : ''
                        }`}>
                          <div className="flex flex-col">
                            <span>{format(new Date(date), 'M/d', { locale: ja })}</span>
                            <span className="text-xs text-gray-400">{format(new Date(date), 'EEE', { locale: ja })}</span>
                          </div>
                        </th>
                      );
                    })}
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      週計
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productionSchedule.map((product) => (
                    <tr key={product.product_id} className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                        <div className="flex items-center">
                          <Package size={16} className="text-blue-500 mr-2" />
                          <div>
                            <div className="font-medium">{product.product_name}</div>
                            <div className="text-xs text-gray-500">{product.product_id}</div>
                          </div>
                        </div>
                      </td>
                      {dates.map((date) => {
                        const quantity = product.daily_production[date] || 0;
                        const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                        const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                        
                        return (
                          <td key={`${product.product_id}-${date}`} className={`px-6 py-4 whitespace-nowrap text-center text-sm ${
                            isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50' : ''
                          }`}>
                            <span className={`font-medium ${quantity > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                              {quantity.toLocaleString()}
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                        {getProductTotalProduction(product).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  
                  {/* 日別合計行 */}
                  <tr className="bg-blue-50 font-medium">
                    <td className="sticky left-0 z-10 bg-blue-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900 border-r border-gray-200">
                      日別合計
                    </td>
                    {dates.map((date) => {
                      const total = getTotalProductionForDate(date);
                      const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                      const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                      
                      return (
                        <td key={`total-${date}`} className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-blue-900 ${
                          isToday ? 'bg-blue-100' : isWeekend ? 'bg-blue-100' : ''
                        }`}>
                          {total.toLocaleString()}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-blue-900">
                      {dates.reduce((sum, date) => sum + getTotalProductionForDate(date), 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'shipment' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">製品出庫管理</h2>
            <button 
              onClick={() => navigate('/production/shipment/edit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit size={16} className="mr-2" />
              出庫編集
            </button>
          </div>

          <Card className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      製品 / 出荷先
                    </th>
                    {dates.map((date) => {
                      const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                      return (
                        <th key={date} className={`px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${
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
                  {productShipment.map((product) => (
                    <React.Fragment key={product.product_id}>
                      {/* 製品レベル（合計行） */}
                      <tr className="bg-orange-50">
                        <td className="sticky left-0 z-10 bg-orange-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-900 border-r border-gray-200">
                          <div className="flex items-center">
                            <Truck size={16} className="text-orange-600 mr-2" />
                            <div>
                              <div className="font-medium">{product.product_name}</div>
                              <div className="text-xs text-orange-600">{product.product_id} - 日別合計出庫</div>
                            </div>
                          </div>
                        </td>
                        {dates.map((date) => {
                          const totalShipment = getProductTotalShipment(product, date);
                          const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                          const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                          
                          return (
                            <td key={`${product.product_id}-total-${date}`} className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-orange-900 ${
                              isToday ? 'bg-orange-100' : isWeekend ? 'bg-orange-100' : ''
                            }`}>
                              {totalShipment.toLocaleString()}
                            </td>
                          );
                        })}
                      </tr>
                      
                      {/* 顧客・出荷先レベル */}
                      {product.customers.map((customer, customerIndex) => (
                        <React.Fragment key={`${product.product_id}-${customerIndex}`}>
                          {customer.destinations.map((destination, destIndex) => (
                            <tr key={`${product.product_id}-${customerIndex}-${destIndex}`} className="hover:bg-gray-50">
                              <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                <div className="flex items-center">
                                  <div className="w-6 mr-2"></div> {/* インデント */}
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 border-l border-b border-gray-300 mr-2"></div>
                                    <div>
                                      <div className="font-medium text-gray-700">{customer.customer_name}</div>
                                      <div className="text-xs text-gray-500">{destination.destination_name}</div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              {dates.map((date) => {
                                const shipment = destination.daily_shipment[date] || 0;
                                const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                                const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                                
                                return (
                                  <td key={`${product.product_id}-${customerIndex}-${destIndex}-${date}`} className={`px-6 py-4 whitespace-nowrap text-center text-sm ${
                                    isToday ? 'bg-orange-50' : isWeekend ? 'bg-gray-50' : ''
                                  }`}>
                                    <span className={`${shipment > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                                      {shipment.toLocaleString()}
                                    </span>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">製品在庫管理</h2>
            <button 
              onClick={() => navigate('/production/inventory/edit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit size={16} className="mr-2" />
              在庫編集
            </button>
          </div>

          <Card className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      製品 / 出荷先
                    </th>
                    {dates.map((date) => {
                      const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                      return (
                        <th key={date} className={`px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${
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
                  {productInventory.map((product) => (
                    <React.Fragment key={product.product_id}>
                      {/* 製品レベル（合計行） */}
                      <tr className="bg-blue-50">
                        <td className="sticky left-0 z-10 bg-blue-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900 border-r border-gray-200">
                          <div className="flex items-center">
                            <Package size={16} className="text-blue-600 mr-2" />
                            <div>
                              <div className="font-medium">{product.product_name}</div>
                              <div className="text-xs text-blue-600">{product.product_id} - 日別合計在庫</div>
                            </div>
                          </div>
                        </td>
                        {dates.map((date) => {
                          const totalInventory = getProductTotalInventory(product, date);
                          const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                          const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                          
                          return (
                            <td key={`${product.product_id}-total-${date}`} className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-blue-900 ${
                              isToday ? 'bg-blue-100' : isWeekend ? 'bg-blue-100' : ''
                            }`}>
                              {totalInventory.toLocaleString()}
                            </td>
                          );
                        })}
                      </tr>
                      
                      {/* 顧客・出荷先レベル */}
                      {product.customers.map((customer, customerIndex) => (
                        <React.Fragment key={`${product.product_id}-${customerIndex}`}>
                          {customer.destinations.map((destination, destIndex) => (
                            <tr key={`${product.product_id}-${customerIndex}-${destIndex}`} className="hover:bg-gray-50">
                              <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                <div className="flex items-center">
                                  <div className="w-6 mr-2"></div> {/* インデント */}
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 border-l border-b border-gray-300 mr-2"></div>
                                    <div>
                                      <div className="font-medium text-gray-700">{customer.customer_name}</div>
                                      <div className="text-xs text-gray-500">{destination.destination_name}</div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              {dates.map((date) => {
                                const stock = destination.daily_stock[date] || 0;
                                const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                                const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                                
                                return (
                                  <td key={`${product.product_id}-${customerIndex}-${destIndex}-${date}`} className={`px-6 py-4 whitespace-nowrap text-center text-sm ${
                                    isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50' : ''
                                  }`}>
                                    <span className={`font-medium ${
                                      stock < 200 ? 'text-red-600' : 
                                      stock < 400 ? 'text-amber-600' : 'text-blue-600'
                                    }`}>
                                      {stock.toLocaleString()}
                                    </span>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">生産集計</h2>
          
          {/* 週間サマリーカード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">週間生産数</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dates.reduce((sum, date) => sum + getTotalProductionForDate(date), 0).toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">週間出庫数</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dates.reduce((sum, date) => sum + getTotalShipmentForDate(date), 0).toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">現在在庫数</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {getTotalInventoryForDate(dates[dates.length - 1]).toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>
          </div>

          {/* 生産・出庫・在庫推移グラフ */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">週間推移</h3>
            <Chart 
              data={summaryData} 
              height={400}
              dataKeys={[
                { key: 'production', name: '生産数', color: '#3B82F6' },
                { key: 'shipment', name: '出庫数', color: '#F97316' },
                { key: 'inventory', name: '在庫数', color: '#10B981' }
              ]} 
              type="line"
            />
          </Card>

          {/* 詳細データテーブル */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">日別詳細データ</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日付
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      生産数
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      出庫数
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      在庫数
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      在庫変動
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dates.map((date, index) => {
                    const production = getTotalProductionForDate(date);
                    const shipment = getTotalShipmentForDate(date);
                    const inventory = getTotalInventoryForDate(date);
                    const prevInventory = index > 0 ? getTotalInventoryForDate(dates[index - 1]) : inventory;
                    const inventoryChange = inventory - prevInventory;
                    const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                    const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                    
                    return (
                      <tr key={date} className={`${isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50' : ''} hover:bg-gray-100`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex flex-col">
                            <span>{format(new Date(date), 'M月d日', { locale: ja })}</span>
                            <span className="text-xs text-gray-500">{format(new Date(date), 'EEE', { locale: ja })}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                          <span className={`font-medium ${production > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                            {production.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                          <span className={`font-medium ${shipment > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                            {shipment.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-green-600">
                          {inventory.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                          <div className="flex items-center justify-center">
                            {inventoryChange > 0 ? (
                              <>
                                <TrendingUp size={16} className="text-green-500 mr-1" />
                                <span className="text-green-600 font-medium">+{inventoryChange.toLocaleString()}</span>
                              </>
                            ) : inventoryChange < 0 ? (
                              <>
                                <TrendingDown size={16} className="text-red-500 mr-1" />
                                <span className="text-red-600 font-medium">{inventoryChange.toLocaleString()}</span>
                              </>
                            ) : (
                              <span className="text-gray-400">±0</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Production;