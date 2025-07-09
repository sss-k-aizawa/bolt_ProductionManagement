import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { ArrowLeft, Search, Filter, Calendar, Package, FileText, User, Eye, Download } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';

interface OrderHistoryItem {
  order_no: string;
  order_date: string;
  material_id: string;
  material_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  status: '承認待ち' | '承認済み' | '発注済み' | '納品済み' | 'キャンセル';
  delivery_date: string;
  actual_delivery_date?: string;
  notes?: string;
}

interface SupplierOrderHistory {
  supplier_name: string;
  supplier_id: string;
  total_orders: number;
  total_amount: number;
  last_order_date: string;
  orders: OrderHistoryItem[];
}

const InventoryOrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('3months');

  // サンプル発注履歴データ
  const [orderHistory] = useState<SupplierOrderHistory[]>([
    {
      supplier_name: 'サプライヤーX',
      supplier_id: 'SUP-001',
      total_orders: 15,
      total_amount: 2850000,
      last_order_date: '2025-04-08',
      orders: [
        {
          order_no: 'ORD-2025-001',
          order_date: '2025-04-08',
          material_id: 'A1001',
          material_name: '原材料A',
          quantity: 500,
          unit: 'kg',
          unit_price: 150,
          total_price: 75000,
          status: '発注済み',
          delivery_date: '2025-04-15',
          notes: '緊急発注'
        },
        {
          order_no: 'ORD-2025-001',
          order_date: '2025-04-08',
          material_id: 'A2344',
          material_name: '部品B',
          quantity: 100,
          unit: '個',
          unit_price: 2500,
          total_price: 250000,
          status: '発注済み',
          delivery_date: '2025-04-15'
        },
        {
          order_no: 'ORD-2025-002',
          order_date: '2025-04-05',
          material_id: 'B2344',
          material_name: '部品E',
          quantity: 200,
          unit: '個',
          unit_price: 1200,
          total_price: 240000,
          status: '納品済み',
          delivery_date: '2025-04-12',
          actual_delivery_date: '2025-04-11'
        },
        {
          order_no: 'ORD-2025-003',
          order_date: '2025-04-01',
          material_id: 'A1001',
          material_name: '原材料A',
          quantity: 1000,
          unit: 'kg',
          unit_price: 150,
          total_price: 150000,
          status: '納品済み',
          delivery_date: '2025-04-08',
          actual_delivery_date: '2025-04-08'
        }
      ]
    },
    {
      supplier_name: 'サプライヤーY',
      supplier_id: 'SUP-002',
      total_orders: 8,
      total_amount: 1420000,
      last_order_date: '2025-04-06',
      orders: [
        {
          order_no: 'ORD-2025-004',
          order_date: '2025-04-06',
          material_id: 'A3422',
          material_name: '工具C',
          quantity: 10,
          unit: 'セット',
          unit_price: 8000,
          total_price: 80000,
          status: '承認済み',
          delivery_date: '2025-04-20'
        },
        {
          order_no: 'ORD-2025-005',
          order_date: '2025-04-03',
          material_id: 'C1001',
          material_name: 'パーツF',
          quantity: 50,
          unit: '個',
          unit_price: 3500,
          total_price: 175000,
          status: '発注済み',
          delivery_date: '2025-04-17'
        },
        {
          order_no: 'ORD-2025-006',
          order_date: '2025-03-28',
          material_id: 'A3422',
          material_name: '工具C',
          quantity: 15,
          unit: 'セット',
          unit_price: 8000,
          total_price: 120000,
          status: '納品済み',
          delivery_date: '2025-04-05',
          actual_delivery_date: '2025-04-04'
        }
      ]
    },
    {
      supplier_name: 'サプライヤーZ',
      supplier_id: 'SUP-003',
      total_orders: 12,
      total_amount: 1680000,
      last_order_date: '2025-04-07',
      orders: [
        {
          order_no: 'ORD-2025-007',
          order_date: '2025-04-07',
          material_id: 'C3422',
          material_name: '材料G',
          quantity: 200,
          unit: 'リットル',
          unit_price: 800,
          total_price: 160000,
          status: '承認待ち',
          delivery_date: '2025-04-16'
        },
        {
          order_no: 'ORD-2025-008',
          order_date: '2025-04-04',
          material_id: 'B1422',
          material_name: '材料D',
          quantity: 300,
          unit: 'kg',
          unit_price: 200,
          total_price: 60000,
          status: '発注済み',
          delivery_date: '2025-04-14'
        },
        {
          order_no: 'ORD-2025-009',
          order_date: '2025-03-30',
          material_id: 'C3422',
          material_name: '材料G',
          quantity: 150,
          unit: 'リットル',
          unit_price: 800,
          total_price: 120000,
          status: '納品済み',
          delivery_date: '2025-04-06',
          actual_delivery_date: '2025-04-06'
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '承認待ち':
        return 'bg-yellow-100 text-yellow-800';
      case '承認済み':
        return 'bg-blue-100 text-blue-800';
      case '発注済み':
        return 'bg-purple-100 text-purple-800';
      case '納品済み':
        return 'bg-green-100 text-green-800';
      case 'キャンセル':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredHistory = orderHistory.filter(supplier => {
    if (selectedSupplier !== 'all' && supplier.supplier_id !== selectedSupplier) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return supplier.supplier_name.toLowerCase().includes(searchLower) ||
             supplier.orders.some(order => 
               order.material_name.toLowerCase().includes(searchLower) ||
               order.material_id.toLowerCase().includes(searchLower) ||
               order.order_no.toLowerCase().includes(searchLower)
             );
    }
    
    return true;
  });

  const getAllOrders = () => {
    return filteredHistory.flatMap(supplier => 
      supplier.orders.map(order => ({
        ...order,
        supplier_name: supplier.supplier_name,
        supplier_id: supplier.supplier_id
      }))
    ).filter(order => {
      if (selectedStatus !== 'all' && order.status !== selectedStatus) {
        return false;
      }
      return true;
    }).sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());
  };

  const allOrders = getAllOrders();

  const getTotalStats = () => {
    const totalOrders = allOrders.length;
    const totalAmount = allOrders.reduce((sum, order) => sum + order.total_price, 0);
    const pendingOrders = allOrders.filter(order => order.status === '承認待ち' || order.status === '承認済み').length;
    
    return { totalOrders, totalAmount, pendingOrders };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/inventory')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">資材発注履歴</h1>
            <p className="mt-1 text-sm text-gray-500">サプライヤー別の発注履歴と詳細</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Download size={16} className="mr-2" />
            エクスポート
          </button>
        </div>
      </div>

      {/* フィルター */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="発注履歴を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">すべてのサプライヤー</option>
            {orderHistory.map(supplier => (
              <option key={supplier.supplier_id} value={supplier.supplier_id}>
                {supplier.supplier_name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">すべてのステータス</option>
            <option value="承認待ち">承認待ち</option>
            <option value="承認済み">承認済み</option>
            <option value="発注済み">発注済み</option>
            <option value="納品済み">納品済み</option>
            <option value="キャンセル">キャンセル</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="1month">過去1ヶ月</option>
            <option value="3months">過去3ヶ月</option>
            <option value="6months">過去6ヶ月</option>
            <option value="1year">過去1年</option>
          </select>
        </div>
      </Card>

      {/* サプライヤー別発注履歴 */}
      {selectedSupplier === 'all' ? (
        <div className="space-y-6">
          {filteredHistory.map((supplier) => (
            <Card key={supplier.supplier_id}>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <User className="h-6 w-6 text-blue-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{supplier.supplier_name}</h3>
                      <p className="text-sm text-gray-500">ID: {supplier.supplier_id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">総発注数: {supplier.total_orders}件</div>
                    <div className="text-sm text-gray-500">総金額: ¥{supplier.total_amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">最終発注: {format(new Date(supplier.last_order_date), 'yyyy/MM/dd', { locale: ja })}</div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        発注No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        発注日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        資材名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        数量
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        単価
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        承継
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        希望納期
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {supplier.orders
                      .filter(order => selectedStatus === 'all' || order.status === selectedStatus)
                      .map((order, index) => (
                      <tr key={`${order.order_no}-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.order_no}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(order.order_date), 'yyyy/MM/dd', { locale: ja })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.material_name}</div>
                            <div className="text-sm text-gray-500">{order.material_id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.quantity} {order.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ¥{order.unit_price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>{format(new Date(order.delivery_date), 'yyyy/MM/dd', { locale: ja })}</div>
                            {order.actual_delivery_date && (
                              <div className="text-xs text-green-600">
                                実績: {format(new Date(order.actual_delivery_date), 'MM/dd', { locale: ja })}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Download size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* 全発注履歴（日付順） */
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">発注履歴一覧</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    発注No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    発注日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    サプライヤー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    資材名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    数量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    単価
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    承継
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    希望納期
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allOrders.map((order, index) => (
                  <tr key={`${order.order_no}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.order_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(order.order_date), 'yyyy/MM/dd', { locale: ja })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.supplier_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.material_name}</div>
                        <div className="text-sm text-gray-500">{order.material_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.quantity} {order.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ¥{order.unit_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>{format(new Date(order.delivery_date), 'yyyy/MM/dd', { locale: ja })}</div>
                        {order.actual_delivery_date && (
                          <div className="text-xs text-green-600">
                            実績: {format(new Date(order.actual_delivery_date), 'MM/dd', { locale: ja })}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Eye size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InventoryOrderHistory;