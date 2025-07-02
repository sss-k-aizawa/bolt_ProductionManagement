import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Save, ArrowLeft, ShoppingCart, Package, Calendar, User, FileText } from 'lucide-react';

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

const InventoryOrder: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const materialId = searchParams.get('materialId');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState({
    order_date: new Date().toISOString().split('T')[0],
    delivery_date: '',
    supplier: '',
    notes: '',
    priority: 'normal' as 'high' | 'normal' | 'low',
    order_type: 'regular' as 'regular' | 'urgent' | 'bulk'
  });

  // サンプル資材データ
  const [availableMaterials] = useState([
    {
      material_id: 'A1001',
      material_name: '原材料A',
      category: '原材料',
      unit: 'kg',
      current_stock: 1250,
      min_quantity: 100,
      supplier: 'サプライヤーX',
      unit_price: 150
    },
    {
      material_id: 'A2344',
      material_name: '部品B',
      category: '部品',
      unit: '個',
      current_stock: 5,
      min_quantity: 10,
      supplier: 'サプライヤーX',
      unit_price: 2500
    },
    {
      material_id: 'A3422',
      material_name: '工具C',
      category: '工具',
      unit: 'セット',
      current_stock: 15,
      min_quantity: 5,
      supplier: 'サプライヤーY',
      unit_price: 8000
    },
    {
      material_id: 'B1422',
      material_name: '材料D',
      category: '原材料',
      unit: 'kg',
      current_stock: 450,
      min_quantity: 50,
      supplier: 'サプライヤーZ',
      unit_price: 200
    },
    {
      material_id: 'B2344',
      material_name: '部品E',
      category: '部品',
      unit: '個',
      current_stock: 120,
      min_quantity: 20,
      supplier: 'サプライヤーX',
      unit_price: 1200
    },
    {
      material_id: 'C1001',
      material_name: 'パーツF',
      category: 'パーツ',
      unit: '個',
      current_stock: 8,
      min_quantity: 10,
      supplier: 'サプライヤーY',
      unit_price: 3500
    },
    {
      material_id: 'C3422',
      material_name: '材料G',
      category: '原材料',
      unit: 'リットル',
      current_stock: 0,
      min_quantity: 10,
      supplier: 'サプライヤーZ',
      unit_price: 800
    }
  ]);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    // 確認ページから戻ってきた場合のデータ復元
    if (location.state?.orderData) {
      const savedData = location.state.orderData;
      setOrderData({
        order_date: savedData.order_date,
        delivery_date: savedData.delivery_date,
        supplier: savedData.supplier,
        notes: savedData.notes,
        priority: savedData.priority,
        order_type: savedData.order_type
      });
      setOrderItems(savedData.items);
      return;
    }

    // URLパラメータで指定された資材がある場合、初期選択
    if (materialId) {
      const material = availableMaterials.find(m => m.material_id === materialId);
      if (material) {
        const suggestedQuantity = Math.max(material.min_quantity - material.current_stock, material.min_quantity);
        addOrderItem(material, suggestedQuantity);
        setOrderData(prev => ({
          ...prev,
          supplier: material.supplier
        }));
      }
    }
  }, [materialId, location.state]);

  const addOrderItem = (material: typeof availableMaterials[0], quantity: number = 0) => {
    const existingIndex = orderItems.findIndex(item => item.material_id === material.material_id);
    
    if (existingIndex >= 0) {
      // 既存のアイテムの数量を更新
      updateOrderQuantity(existingIndex, quantity);
    } else {
      // 新しいアイテムを追加
      const newItem: OrderItem = {
        material_id: material.material_id,
        material_name: material.material_name,
        category: material.category,
        unit: material.unit,
        current_stock: material.current_stock,
        min_quantity: material.min_quantity,
        supplier: material.supplier,
        unit_price: material.unit_price,
        order_quantity: quantity,
        total_price: quantity * material.unit_price
      };
      setOrderItems([...orderItems, newItem]);
    }
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderQuantity = (index: number, quantity: number) => {
    setOrderItems(orderItems.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          order_quantity: quantity,
          total_price: quantity * item.unit_price
        };
      }
      return item;
    }));
  };

  const getTotalAmount = () => {
    return orderItems.reduce((sum, item) => sum + item.total_price, 0);
  };

  const getStockStatus = (currentStock: number, minQuantity: number) => {
    if (currentStock === 0) return { status: '在庫切れ', color: 'text-red-600' };
    if (currentStock <= minQuantity) return { status: '在庫少', color: 'text-amber-600' };
    return { status: '適正', color: 'text-green-600' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (orderItems.length === 0) {
      setError('発注する資材を選択してください');
      return;
    }

    if (!orderData.delivery_date) {
      setError('希望納期を入力してください');
      return;
    }

    if (!orderData.supplier) {
      setError('サプライヤーを入力してください');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const orderRequest = {
        ...orderData,
        items: orderItems,
        total_amount: getTotalAmount(),
        created_at: new Date().toISOString()
      };
      
      // 確認ページに遷移
      navigate('/inventory/order/confirm', {
        state: { orderData: orderRequest }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">資材発注</h1>
            <p className="mt-1 text-sm text-gray-500">資材の発注申請を作成</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || orderItems.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <ShoppingCart size={16} className="mr-2" />
          {loading ? '処理中...' : '発注申請'}
        </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 発注情報 */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">発注情報</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="order_date" className="block text-sm font-medium text-gray-700 mb-1">
                  発注日
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    id="order_date"
                    value={orderData.order_date}
                    onChange={(e) => setOrderData(prev => ({ ...prev, order_date: e.target.value }))}
                    className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="delivery_date" className="block text-sm font-medium text-gray-700 mb-1">
                  希望納期 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    id="delivery_date"
                    value={orderData.delivery_date}
                    onChange={(e) => setOrderData(prev => ({ ...prev, delivery_date: e.target.value }))}
                    className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                  サプライヤー <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="supplier"
                    value={orderData.supplier}
                    onChange={(e) => setOrderData(prev => ({ ...prev, supplier: e.target.value }))}
                    className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="サプライヤー名"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  優先度
                </label>
                <select
                  id="priority"
                  value={orderData.priority}
                  onChange={(e) => setOrderData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="low">低</option>
                  <option value="normal">通常</option>
                  <option value="high">高</option>
                </select>
              </div>

              <div>
                <label htmlFor="order_type" className="block text-sm font-medium text-gray-700 mb-1">
                  発注タイプ
                </label>
                <select
                  id="order_type"
                  value={orderData.order_type}
                  onChange={(e) => setOrderData(prev => ({ ...prev, order_type: e.target.value as any }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="regular">通常発注</option>
                  <option value="urgent">緊急発注</option>
                  <option value="bulk">まとめ発注</option>
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  備考
                </label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    id="notes"
                    rows={3}
                    value={orderData.notes}
                    onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                    className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="発注に関する特記事項"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 資材選択と発注リスト */}
        <div className="lg:col-span-2 space-y-6">
          {/* 資材選択 */}
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">資材選択</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableMaterials.map((material) => {
                const stockStatus = getStockStatus(material.current_stock, material.min_quantity);
                const isSelected = orderItems.some(item => item.material_id === material.material_id);
                
                return (
                  <div
                    key={material.material_id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (!isSelected) {
                        const suggestedQuantity = Math.max(material.min_quantity - material.current_stock, material.min_quantity);
                        addOrderItem(material, suggestedQuantity);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Package size={16} className="text-gray-400 mr-2" />
                          <h3 className="text-sm font-medium text-gray-900">{material.material_name}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{material.material_id} • {material.category}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            現在庫: {material.current_stock} {material.unit}
                          </span>
                          <span className={`text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          単価: ¥{material.unit_price.toLocaleString()}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="ml-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 発注リスト */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">発注リスト</h2>
              <div className="text-sm text-gray-500">
                合計: ¥{getTotalAmount().toLocaleString()}
              </div>
            </div>
            
            {orderItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">発注する資材がありません</h3>
                <p className="mt-1 text-sm text-gray-500">上記から資材を選択してください</p>
              </div>
            ) : (
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
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderItems.map((item, index) => (
                      <tr key={item.material_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.material_name}</div>
                            <div className="text-sm text-gray-500">{item.material_id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.current_stock} {item.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={item.order_quantity}
                            onChange={(e) => updateOrderQuantity(index, parseInt(e.target.value) || 0)}
                            className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            min="1"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ¥{item.unit_price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ¥{item.total_price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => removeOrderItem(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            削除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InventoryOrder;