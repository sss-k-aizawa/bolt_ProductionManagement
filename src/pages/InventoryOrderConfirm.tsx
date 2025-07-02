import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/ui/Card';
import { ArrowLeft, CheckCircle, Package, Calendar, User, FileText, ShoppingCart } from 'lucide-react';

interface OrderItem {
  material_id: string;
  material_name: string;
  category: string;
  unit: string;
  current_stock: number;
  min_quantity: number;
  supplier: string;
  unit_price: number;
  order_quantity: number;
  total_price: number;
}

interface OrderData {
  order_date: string;
  delivery_date: string;
  supplier: string;
  notes: string;
  priority: 'high' | 'normal' | 'low';
  order_type: 'regular' | 'urgent' | 'bulk';
  items: OrderItem[];
  total_amount: number;
  created_at: string;
}

const InventoryOrderConfirm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // 発注ページから渡されたデータを取得
    if (location.state?.orderData) {
      setOrderData(location.state.orderData);
    } else {
      // データがない場合は発注ページに戻る
      navigate('/inventory/order');
    }
  }, [location.state, navigate]);

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'normal': return '通常';
      case 'low': return '低';
      default: return priority;
    }
  };

  const getOrderTypeLabel = (orderType: string) => {
    switch (orderType) {
      case 'regular': return '通常発注';
      case 'urgent': return '緊急発注';
      case 'bulk': return 'まとめ発注';
      default: return orderType;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConfirmOrder = async () => {
    if (!orderData) return;

    try {
      setSubmitting(true);
      
      // 実際の実装では、APIに発注データを送信
      console.log('Confirming order:', orderData);
      
      // 発注処理のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 成功後、在庫ページに戻る
      navigate('/inventory', {
        state: {
          message: '発注申請が正常に送信されました。',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Order submission failed:', error);
      // エラーハンドリング
    } finally {
      setSubmitting(false);
    }
  };

  if (!orderData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/inventory/order')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">発注確認</h1>
            <p className="mt-1 text-sm text-gray-500">発注内容を確認してください</p>
          </div>
        </div>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">発注データが見つかりません。</p>
            <button
              onClick={() => navigate('/inventory/order')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              発注ページに戻る
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/inventory/order')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">発注確認</h1>
            <p className="mt-1 text-sm text-gray-500">発注内容を確認してください</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/inventory/order', { state: { orderData } })}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            修正
          </button>
          <button
            onClick={handleConfirmOrder}
            disabled={submitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            <CheckCircle size={16} className="mr-2" />
            {submitting ? '送信中...' : '発注確定'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 発注情報 */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">発注情報</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">発注日</p>
                  <p className="text-sm text-gray-900">{orderData.order_date}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar size={16} className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">希望納期</p>
                  <p className="text-sm text-gray-900">{orderData.delivery_date}</p>
                </div>
              </div>

              <div className="flex items-center">
                <User size={16} className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">サプライヤー</p>
                  <p className="text-sm text-gray-900">{orderData.supplier}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">優先度</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(orderData.priority)}`}>
                  {getPriorityLabel(orderData.priority)}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">発注タイプ</p>
                <p className="text-sm text-gray-900">{getOrderTypeLabel(orderData.order_type)}</p>
              </div>

              {orderData.notes && (
                <div className="flex items-start">
                  <FileText size={16} className="text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">備考</p>
                    <p className="text-sm text-gray-900">{orderData.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* 発注サマリー */}
          <Card className="mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">発注サマリー</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">発注アイテム数</span>
                <span className="text-sm font-medium text-gray-900">{orderData.items.length}件</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">総数量</span>
                <span className="text-sm font-medium text-gray-900">
                  {orderData.items.reduce((sum, item) => sum + item.order_quantity, 0)}個
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">合計金額</span>
                  <span className="text-base font-bold text-gray-900">
                    ¥{orderData.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 発注アイテム一覧 */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">発注アイテム一覧</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      資材
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      現在庫
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      発注数量
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      単価
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      小計
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderData.items.map((item) => (
                    <tr key={item.material_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package size={16} className="text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.material_name}</div>
                            <div className="text-sm text-gray-500">{item.material_id} • {item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.current_stock} {item.unit}</div>
                        <div className="text-xs text-gray-500">最小: {item.min_quantity} {item.unit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.order_quantity} {item.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ¥{item.unit_price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ¥{item.total_price.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      合計金額:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ¥{orderData.total_amount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          {/* 注意事項 */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">発注確認</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>発注確定後は内容の変更ができません</li>
                    <li>サプライヤーに発注書が自動送信されます</li>
                    <li>納期は希望日であり、確定日ではありません</li>
                    <li>緊急発注の場合は追加料金が発生する可能性があります</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InventoryOrderConfirm;