import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Edit, Package, ChevronLeft, ChevronRight, Truck, Calendar, Send } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ShipmentDestination {
  destination_name: string;
  daily_shipment: { [date: string]: number };
}

interface ShipmentCustomer {
  customer_name: string;
  unit_price: number;
  destinations: ShipmentDestination[];
}

interface ProductShipmentItem {
  id: string;
  product_id: string;
  product_name: string;
  category: string;
  unit: string;
  customers: ShipmentCustomer[];
}

const Shipment: React.FC = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'schedule' | 'history'>('schedule');

  // 現在の週の開始日から1週間分の日付を生成
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 月曜日開始
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return format(date, 'yyyy-MM-dd');
  });

  // 初期データ（階層構造）
  const [shipmentItems] = useState<ProductShipmentItem[]>([
    {
      id: 'prod-1',
      product_id: 'PROD-A',
      product_name: '製品A',
      category: '製品',
      unit: '個',
      customers: [
        {
          customer_name: 'A商事株式会社',
          unit_price: 1500,
          destinations: [
            {
              destination_name: '東京都港区本社',
              daily_shipment: dates.reduce((acc, date) => ({
                ...acc,
                [date]: Math.floor(Math.random() * 100) + 50
              }), {})
            },
            {
              destination_name: '東京都江東区倉庫',
              daily_shipment: dates.reduce((acc, date) => ({
                ...acc,
                [date]: Math.floor(Math.random() * 80) + 30
              }), {})
            }
          ]
        },
        {
          customer_name: 'X流通株式会社',
          unit_price: 1450,
          destinations: [
            {
              destination_name: '神奈川県横浜市',
              daily_shipment: dates.reduce((acc, date) => ({
                ...acc,
                [date]: Math.floor(Math.random() * 120) + 60
              }), {})
            }
          ]
        }
      ]
    },
    {
      id: 'prod-2',
      product_id: 'PROD-B',
      product_name: '製品B',
      category: '製品',
      unit: '個',
      customers: [
        {
          customer_name: 'B流通株式会社',
          unit_price: 2200,
          destinations: [
            {
              destination_name: '大阪府大阪市本店',
              daily_shipment: dates.reduce((acc, date) => ({
                ...acc,
                [date]: Math.floor(Math.random() * 150) + 80
              }), {})
            },
            {
              destination_name: '大阪府堺市支店',
              daily_shipment: dates.reduce((acc, date) => ({
                ...acc,
                [date]: Math.floor(Math.random() * 60) + 20
              }), {})
            }
          ]
        }
      ]
    },
    {
      id: 'prod-3',
      product_id: 'PROD-C',
      product_name: '製品C',
      category: '製品',
      unit: '個',
      customers: [
        {
          customer_name: 'Cマート',
          unit_price: 3800,
          destinations: [
            {
              destination_name: '愛知県名古屋市店舗',
              daily_shipment: dates.reduce((acc, date) => ({
                ...acc,
                [date]: Math.floor(Math.random() * 90) + 40
              }), {})
            }
          ]
        },
        {
          customer_name: 'Y商事',
          unit_price: 3650,
          destinations: [
            {
              destination_name: '静岡県浜松市',
              daily_shipment: dates.reduce((acc, date) => ({
                ...acc,
                [date]: Math.floor(Math.random() * 50) + 20
              }), {})
            }
          ]
        }
      ]
    }
  ]);

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

  const getProductTotalShipment = (product: ProductShipmentItem, date: string) => {
    return product.customers.reduce((total, customer) => 
      total + customer.destinations.reduce((destTotal, dest) => 
        destTotal + (dest.daily_shipment[date] || 0), 0
      ), 0
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">出荷</h1>
          <p className="mt-1 text-sm text-gray-500">製品出荷の管理と履歴</p>
        </div>
        <div className="flex space-x-2">
          {activeTab === 'schedule' && (
            <button 
              onClick={() => navigate('/shipment/edit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit size={16} className="mr-2" />
              出荷編集
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
            <Send size={16} className="inline mr-1" />
            製品出荷予定（階層別・日別）
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar size={16} className="inline mr-1" />
            出荷履歴
          </button>
        </nav>
      </div>

      {activeTab === 'schedule' && (
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

          <Card className="p-0">
            <div className="overflow-x-auto">
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
                    {shipmentItems.map((product) => (
                      <React.Fragment key={product.id}>
                        {/* 製品レベル（合計行） */}
                        <tr className="bg-orange-50 border-t-2 border-orange-200">
                          <td className="sticky left-0 z-10 bg-orange-50 px-4 py-4 whitespace-nowrap border-r border-gray-200">
                            <div className="flex items-center">
                              <Truck size={18} className="text-orange-600 mr-3" />
                              <div>
                                <div className="font-bold text-orange-900">{product.product_name}</div>
                                <div className="text-xs text-orange-600">{product.product_id} - 日別合計出荷</div>
                              </div>
                            </div>
                          </td>
                          <td className="sticky left-64 z-10 bg-orange-50 px-4 py-4 whitespace-nowrap border-r border-gray-200">
                            <div className="text-center">
                              <span className="text-orange-600">-</span>
                            </div>
                          </td>
                          {dates.map((date) => {
                            const totalShipment = getProductTotalShipment(product, date);
                            const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                            const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                            
                            return (
                              <td key={`${product.id}-total-${date}`} className={`px-4 py-4 whitespace-nowrap text-sm ${
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
                          <React.Fragment key={`${product.id}-${customerIndex}`}>
                            {customer.destinations.map((destination, destIndex) => {
                              const isFirstDestination = destIndex === 0;
                              
                              return (
                                <tr key={`${product.id}-${customerIndex}-${destIndex}`} className="hover:bg-gray-50">
                                  <td className="sticky left-0 z-10 bg-white px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                    <div className="flex items-center">
                                      <div className="w-6 mr-2"></div> {/* インデント */}
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 border-l border-b border-gray-300 mr-2"></div>
                                        <div className="space-y-2">
                                          {isFirstDestination && (
                                            <Link
                                              to={`/shipment-history?customerName=${encodeURIComponent(customer.customer_name)}`}
                                              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                              {customer.customer_name}
                                            </Link>
                                          )}
                                          <div className="ml-4 text-sm text-gray-600">
                                            {destination.destination_name}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="sticky left-64 z-10 bg-white px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                    <div className="text-center">
                                      {isFirstDestination ? (
                                        <span className="text-sm font-medium text-gray-900">
                                          ¥{customer.unit_price.toLocaleString()}
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </div>
                                  </td>
                                  {dates.map((date) => {
                                    const shipmentValue = destination.daily_shipment[date] || 0;
                                    const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                                    const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                                    
                                    return (
                                      <td key={`${product.id}-${customerIndex}-${destIndex}-${date}`} className={`px-4 py-4 whitespace-nowrap ${
                                        isToday ? 'bg-orange-50' : isWeekend ? 'bg-gray-50' : ''
                                      }`}>
                                        <div className="text-center">
                                          <span className="text-sm font-medium text-gray-900">
                                            {shipmentValue.toLocaleString()}
                                          </span>
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

    </div>
  );
};

export default Shipment;