import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Save, ArrowLeft, Package, Plus, Trash2, ChevronLeft, ChevronRight, Truck } from 'lucide-react';
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

const ProductShipmentEdit: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // 現在の週の開始日から1週間分の日付を生成
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 月曜日開始
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return format(date, 'yyyy-MM-dd');
  });

  // 初期データ（階層構造）
  const [shipmentItems, setShipmentItems] = useState<ProductShipmentItem[]>([
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

  const addProduct = () => {
    const newProduct: ProductShipmentItem = {
      id: `prod-${Date.now()}`,
      product_id: '',
      product_name: '',
      category: '製品',
      unit: '個',
      customers: []
    };
    setShipmentItems([...shipmentItems, newProduct]);
  };

  const removeProduct = (productId: string) => {
    setShipmentItems(shipmentItems.filter(item => item.id !== productId));
  };

  const addCustomer = (productId: string) => {
    setShipmentItems(shipmentItems.map(product => {
      if (product.id === productId) {
        const newCustomer: ShipmentCustomer = {
          customer_name: '',
          unit_price: 0,
          destinations: []
        };
        return {
          ...product,
          customers: [...product.customers, newCustomer]
        };
      }
      return product;
    }));
  };

  const removeCustomer = (productId: string, customerIndex: number) => {
    setShipmentItems(shipmentItems.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          customers: product.customers.filter((_, index) => index !== customerIndex)
        };
      }
      return product;
    }));
  };

  const addDestination = (productId: string, customerIndex: number) => {
    setShipmentItems(shipmentItems.map(product => {
      if (product.id === productId) {
        const updatedCustomers = [...product.customers];
        const newDestination: ShipmentDestination = {
          destination_name: '',
          daily_shipment: dates.reduce((acc, date) => ({ ...acc, [date]: 0 }), {})
        };
        updatedCustomers[customerIndex] = {
          ...updatedCustomers[customerIndex],
          destinations: [...updatedCustomers[customerIndex].destinations, newDestination]
        };
        return {
          ...product,
          customers: updatedCustomers
        };
      }
      return product;
    }));
  };

  const removeDestination = (productId: string, customerIndex: number, destinationIndex: number) => {
    setShipmentItems(shipmentItems.map(product => {
      if (product.id === productId) {
        const updatedCustomers = [...product.customers];
        updatedCustomers[customerIndex] = {
          ...updatedCustomers[customerIndex],
          destinations: updatedCustomers[customerIndex].destinations.filter((_, index) => index !== destinationIndex)
        };
        return {
          ...product,
          customers: updatedCustomers
        };
      }
      return product;
    }));
  };

  const updateProduct = (productId: string, field: keyof ProductShipmentItem, value: string) => {
    setShipmentItems(shipmentItems.map(product => 
      product.id === productId ? { ...product, [field]: value } : product
    ));
  };

  const updateCustomer = (productId: string, customerIndex: number, field: keyof ShipmentCustomer, value: string | number) => {
    setShipmentItems(shipmentItems.map(product => {
      if (product.id === productId) {
        const updatedCustomers = [...product.customers];
        updatedCustomers[customerIndex] = {
          ...updatedCustomers[customerIndex],
          [field]: value
        };
        return {
          ...product,
          customers: updatedCustomers
        };
      }
      return product;
    }));
  };

  const updateDestination = (productId: string, customerIndex: number, destinationIndex: number, field: keyof ShipmentDestination, value: string | { [date: string]: number }) => {
    setShipmentItems(shipmentItems.map(product => {
      if (product.id === productId) {
        const updatedCustomers = [...product.customers];
        const updatedDestinations = [...updatedCustomers[customerIndex].destinations];
        updatedDestinations[destinationIndex] = {
          ...updatedDestinations[destinationIndex],
          [field]: value
        };
        updatedCustomers[customerIndex] = {
          ...updatedCustomers[customerIndex],
          destinations: updatedDestinations
        };
        return {
          ...product,
          customers: updatedCustomers
        };
      }
      return product;
    }));
  };

  const updateDailyShipment = (productId: string, customerIndex: number, destinationIndex: number, date: string, value: number) => {
    setShipmentItems(shipmentItems.map(product => {
      if (product.id === productId) {
        const updatedCustomers = [...product.customers];
        const updatedDestinations = [...updatedCustomers[customerIndex].destinations];
        updatedDestinations[destinationIndex] = {
          ...updatedDestinations[destinationIndex],
          daily_shipment: {
            ...updatedDestinations[destinationIndex].daily_shipment,
            [date]: value
          }
        };
        updatedCustomers[customerIndex] = {
          ...updatedCustomers[customerIndex],
          destinations: updatedDestinations
        };
        return {
          ...product,
          customers: updatedCustomers
        };
      }
      return product;
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // バリデーション
      const invalidProducts = shipmentItems.filter(product => 
        !product.product_id || !product.product_name
      );
      
      if (invalidProducts.length > 0) {
        throw new Error('製品IDと製品名は必須です');
      }
      
      // 実際の実装では、APIに送信
      console.log('Saving hierarchical product shipment:', shipmentItems);
      
      // 保存成功のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/production');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setSaving(false);
    }
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
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/shipment')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">製品出庫編集（階層別・日別）</h1>
            <p className="mt-1 text-sm text-gray-500">製品 → 出荷顧客 → 出荷先の階層構造で出庫情報を編集</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={addProduct}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-2" />
            製品追加
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save size={16} className="mr-2" />
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </Card>
      )}

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

      <form onSubmit={handleSubmit} className="space-y-6">
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
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                      操作
                    </th>
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
                            <div className="space-y-2">
                              {product.product_id ? (
                                <div>
                                  <div className="font-bold text-orange-900">{product.product_name}</div>
                                  <div className="text-xs text-orange-600">{product.product_id} - 日別合計出庫</div>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <input
                                    type="text"
                                    value={product.product_id}
                                    onChange={(e) => updateProduct(product.id, 'product_id', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    placeholder="製品ID"
                                    required
                                  />
                                  <input
                                    type="text"
                                    value={product.product_name}
                                    onChange={(e) => updateProduct(product.id, 'product_name', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    placeholder="製品名"
                                    required
                                  />
                                </div>
                              )}
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
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              type="button"
                              onClick={() => addCustomer(product.id)}
                              className="inline-flex items-center p-1 border border-transparent rounded-full text-orange-600 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              title="顧客追加"
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeProduct(product.id)}
                              className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                              title="製品削除"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
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
                                          <input
                                            type="text"
                                            value={customer.customer_name}
                                            onChange={(e) => updateCustomer(product.id, customerIndex, 'customer_name', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm font-medium"
                                            placeholder="出荷顧客名"
                                          />
                                        )}
                                        <div className="ml-4">
                                          <input
                                            type="text"
                                            value={destination.destination_name}
                                            onChange={(e) => updateDestination(product.id, customerIndex, destIndex, 'destination_name', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                            placeholder="出荷先"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="sticky left-64 z-10 bg-white px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                  <div className="text-center">
                                    {isFirstDestination ? (
                                      <input
                                        type="number"
                                        value={customer.unit_price}
                                        onChange={(e) => updateCustomer(product.id, customerIndex, 'unit_price', parseInt(e.target.value) || 0)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-center"
                                        min="0"
                                        placeholder="単価"
                                      />
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
                                        <input
                                          type="number"
                                          value={shipmentValue}
                                          onChange={(e) => updateDailyShipment(product.id, customerIndex, destIndex, date, parseInt(e.target.value) || 0)}
                                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-center"
                                          min="0"
                                        />
                                      </div>
                                    </td>
                                  );
                                })}
                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                  <div className="flex items-center justify-center space-x-1">
                                    {isFirstDestination && (
                                      <button
                                        type="button"
                                        onClick={() => addDestination(product.id, customerIndex)}
                                        className="inline-flex items-center p-1 border border-transparent rounded-full text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        title="出荷先追加"
                                      >
                                        <Plus size={12} />
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => removeDestination(product.id, customerIndex, destIndex)}
                                      className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                                      title="出荷先削除"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                    {isFirstDestination && customer.destinations.length === 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeCustomer(product.id, customerIndex)}
                                        className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        title="顧客削除"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    )}
                                  </div>
                                </td>
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

          {shipmentItems.length === 0 && (
            <div className="text-center py-12">
              <Truck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">製品出庫がありません</h3>
              <p className="mt-1 text-sm text-gray-500">製品を追加して階層別出庫管理を開始してください</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={addProduct}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                >
                  <Plus size={16} className="mr-2" />
                  製品を追加
                </button>
              </div>
            </div>
          )}
        </Card>
      </form>
    </div>
  );
};

export default ProductShipmentEdit;