import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Save, ArrowLeft, Package, Plus, Trash2 } from 'lucide-react';

interface ProductInventoryItem {
  id: string;
  item_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  min_quantity: number;
  max_quantity: number;
  location: string;
  supplier: string;
  description: string;
}

const ProductInventoryEdit: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初期データ（実際の実装では、APIから取得）
  const [inventoryItems, setInventoryItems] = useState<ProductInventoryItem[]>([
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
  ]);

  const addInventoryItem = () => {
    const newItem: ProductInventoryItem = {
      id: `prod-${inventoryItems.length + 1}`,
      item_id: '',
      name: '',
      category: '製品',
      quantity: 0,
      unit: '個',
      min_quantity: 0,
      max_quantity: 1000,
      location: '',
      supplier: '自社製造',
      description: '',
    };
    setInventoryItems([...inventoryItems, newItem]);
  };

  const removeInventoryItem = (id: string) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== id));
  };

  const updateInventoryItem = (id: string, field: keyof ProductInventoryItem, value: string | number) => {
    setInventoryItems(inventoryItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // バリデーション
      const invalidItems = inventoryItems.filter(item => 
        !item.item_id || !item.name
      );
      
      if (invalidItems.length > 0) {
        throw new Error('製品IDと製品名は必須です');
      }
      
      // 実際の実装では、APIに送信
      console.log('Saving product inventory items:', inventoryItems);
      
      // 保存成功のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/production');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setSaving(false);
    }
  };

  const getInventoryLevelColor = (current: number, min: number, max: number) => {
    if (current === 0) return 'text-red-600';
    if (current <= min) return 'text-amber-600';
    if (current >= max * 0.9) return 'text-blue-600';
    return 'text-green-600';
  };

  const getInventoryLevelStatus = (current: number, min: number, max: number) => {
    if (current === 0) return '在庫切れ';
    if (current <= min) return '在庫少';
    if (current >= max * 0.9) return '在庫過多';
    return '適正';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/production')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">製品在庫編集</h1>
            <p className="mt-1 text-sm text-gray-500">製品在庫情報の編集と管理</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={addInventoryItem}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="overflow-x-auto -mx-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    製品ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    製品名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    現在在庫
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最小在庫
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最大在庫
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    保管場所
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    説明
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.item_id}
                        onChange={(e) => updateInventoryItem(item.id, 'item_id', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="PROD-XXX"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateInventoryItem(item.id, 'name', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="製品名"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateInventoryItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={item.min_quantity}
                        onChange={(e) => updateInventoryItem(item.id, 'min_quantity', parseInt(e.target.value) || 0)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={item.max_quantity}
                        onChange={(e) => updateInventoryItem(item.id, 'max_quantity', parseInt(e.target.value) || 0)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.location}
                        onChange={(e) => updateInventoryItem(item.id, 'location', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="保管場所"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateInventoryItem(item.id, 'description', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="説明"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-center">
                        <div className={`text-sm font-medium ${getInventoryLevelColor(item.quantity, item.min_quantity, item.max_quantity)}`}>
                          {getInventoryLevelStatus(item.quantity, item.min_quantity, item.max_quantity)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => removeInventoryItem(item.id)}
                        className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {inventoryItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">製品在庫がありません</h3>
              <p className="mt-1 text-sm text-gray-500">製品を追加して在庫管理を開始してください</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={addInventoryItem}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus size={16} className="mr-2" />
                  製品を追加
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* 在庫統計サマリー */}
        {inventoryItems.length > 0 && (
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">在庫統計</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-medium text-blue-700">製品総数</p>
                  <p className="mt-1 text-2xl font-semibold text-blue-900">{inventoryItems.length}</p>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-medium text-green-700">適正在庫</p>
                  <p className="mt-1 text-2xl font-semibold text-green-900">
                    {inventoryItems.filter(item => 
                      getInventoryLevelStatus(item.quantity, item.min_quantity, item.max_quantity) === '適正'
                    ).length}
                  </p>
                </div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-medium text-amber-700">在庫少</p>
                  <p className="mt-1 text-2xl font-semibold text-amber-900">
                    {inventoryItems.filter(item => 
                      getInventoryLevelStatus(item.quantity, item.min_quantity, item.max_quantity) === '在庫少'
                    ).length}
                  </p>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-medium text-red-700">在庫切れ</p>
                  <p className="mt-1 text-2xl font-semibold text-red-900">
                    {inventoryItems.filter(item => 
                      getInventoryLevelStatus(item.quantity, item.min_quantity, item.max_quantity) === '在庫切れ'
                    ).length}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </form>
    </div>
  );
};

export default ProductInventoryEdit;