import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Save, ArrowLeft, Plus, Trash2, Package, Building, Users, Search, X } from 'lucide-react';

interface Customer {
  id: string;
  code: string;
  name: string;
  type: '法人' | '個人';
}

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  standard_price: number;
}

interface DeliveryDestination {
  id: string;
  name: string;
  address: string;
}

interface CustomerMapping {
  customer_id: string;
  customer_code: string;
  customer_name: string;
  unit_price: number;
  delivery_destinations: string[]; // 選択された出荷先IDの配列
}

interface FormData {
  product_id: string;
  product_code: string;
  product_name: string;
  customer_mappings: CustomerMapping[];
}

const ProductCustomerMappingAdd: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');

  // サンプルデータ
  const [products] = useState<Product[]>([
    {
      id: '1',
      code: 'PROD-A001',
      name: 'ミネラルウォーター 500ml',
      category: '飲料',
      unit: '本',
      standard_price: 120
    },
    {
      id: '2',
      code: 'PROD-A002',
      name: 'お茶 350ml',
      category: '飲料',
      unit: '本',
      standard_price: 150
    },
    {
      id: '3',
      code: 'PROD-A003',
      name: 'スポーツドリンク 500ml',
      category: '飲料',
      unit: '本',
      standard_price: 180
    },
    {
      id: '4',
      code: 'PROD-A004',
      name: 'コーヒー 250ml',
      category: '飲料',
      unit: '本',
      standard_price: 200
    }
  ]);

  const [customers] = useState<Customer[]>([
    {
      id: '1',
      code: 'CUST-001',
      name: 'A商事株式会社',
      type: '法人'
    },
    {
      id: '2',
      code: 'CUST-002',
      name: 'B流通株式会社',
      type: '法人'
    },
    {
      id: '3',
      code: 'CUST-003',
      name: 'Cマート',
      type: '法人'
    },
    {
      id: '4',
      code: 'CUST-004',
      name: 'D食品株式会社',
      type: '法人'
    },
    {
      id: '5',
      code: 'CUST-005',
      name: 'E商店',
      type: '個人'
    }
  ]);

  // 顧客別の出荷先データ（サンプル）
  const [customerDeliveryDestinations] = useState<{ [customerId: string]: DeliveryDestination[] }>({
    '1': [
      { id: 'dest-1-1', name: '東京都港区本社', address: '東京都港区赤坂1-1-1' },
      { id: 'dest-1-2', name: '東京都江東区倉庫', address: '東京都江東区豊洲2-2-2' }
    ],
    '2': [
      { id: 'dest-2-1', name: '大阪府大阪市本店', address: '大阪府大阪市中央区本町2-2-2' },
      { id: 'dest-2-2', name: '大阪府堺市支店', address: '大阪府堺市堺区南瓦町3-3-3' }
    ],
    '3': [
      { id: 'dest-3-1', name: '愛知県名古屋市店舗', address: '愛知県名古屋市中区栄3-3-3' }
    ],
    '4': [
      { id: 'dest-4-1', name: '福岡県福岡市本社', address: '福岡県福岡市博多区博多駅前4-4-4' }
    ],
    '5': [
      { id: 'dest-5-1', name: '北海道札幌市店舗', address: '北海道札幌市中央区大通5-5-5' }
    ]
  });

  const [formData, setFormData] = useState<FormData>({
    product_id: '',
    product_code: '',
    product_name: '',
    customer_mappings: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.product_id) {
      setError('製品を選択してください');
      return;
    }

    if (formData.customer_mappings.length === 0) {
      setError('少なくとも1つの顧客を追加してください');
      return;
    }

    // 単価が設定されていない顧客をチェック
    const invalidMappings = formData.customer_mappings.filter(mapping => 
      !mapping.unit_price || mapping.unit_price <= 0
    );

    if (invalidMappings.length > 0) {
      setError('すべての顧客に単価を設定してください');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // 実際の実装では、APIに送信
      console.log('Saving product customer mapping:', formData);
      
      // 保存成功のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/master-management');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setSaving(false);
    }
  };

  const selectProduct = (product: Product) => {
    setFormData(prev => ({
      ...prev,
      product_id: product.id,
      product_code: product.code,
      product_name: product.name
    }));
    setShowProductModal(false);
    setProductSearchTerm('');
  };

  const addCustomerMapping = (customer: Customer) => {
    // 既に追加されている顧客かチェック
    const existingMapping = formData.customer_mappings.find(mapping => 
      mapping.customer_id === customer.id
    );

    if (existingMapping) {
      setError('この顧客は既に追加されています');
      return;
    }

    const newMapping: CustomerMapping = {
      customer_id: customer.id,
      customer_code: customer.code,
      customer_name: customer.name,
      unit_price: 0,
      delivery_destinations: []
    };

    setFormData(prev => ({
      ...prev,
      customer_mappings: [...prev.customer_mappings, newMapping]
    }));
    
    setShowCustomerModal(false);
    setCustomerSearchTerm('');
    setError(null);
  };

  const removeCustomerMapping = (customerId: string) => {
    setFormData(prev => ({
      ...prev,
      customer_mappings: prev.customer_mappings.filter(mapping => 
        mapping.customer_id !== customerId
      )
    }));
  };

  const updateCustomerMapping = (customerId: string, field: keyof CustomerMapping, value: any) => {
    setFormData(prev => ({
      ...prev,
      customer_mappings: prev.customer_mappings.map(mapping =>
        mapping.customer_id === customerId 
          ? { ...mapping, [field]: value }
          : mapping
      )
    }));
  };

  const toggleDeliveryDestination = (customerId: string, destinationId: string) => {
    setFormData(prev => ({
      ...prev,
      customer_mappings: prev.customer_mappings.map(mapping => {
        if (mapping.customer_id === customerId) {
          const destinations = mapping.delivery_destinations.includes(destinationId)
            ? mapping.delivery_destinations.filter(id => id !== destinationId)
            : [...mapping.delivery_destinations, destinationId];
          
          return { ...mapping, delivery_destinations: destinations };
        }
        return mapping;
      })
    }));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.code.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );

  const getSelectedProduct = () => {
    return products.find(p => p.id === formData.product_id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/master-management')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">製品顧客紐付追加</h1>
            <p className="mt-1 text-sm text-gray-500">製品に顧客と単価情報を紐付け</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Save size={16} className="mr-2" />
          {saving ? '保存中...' : '保存'}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 製品選択 */}
        <Card>
          <div className="flex items-center mb-6">
            <Package className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">製品選択</h2>
          </div>
          
          {formData.product_id ? (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <Package size={20} className="text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-blue-900">{formData.product_name}</div>
                  <div className="text-sm text-blue-600">{formData.product_code}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, product_id: '', product_code: '', product_name: '' }))}
                className="text-blue-600 hover:text-blue-800"
              >
                変更
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowProductModal(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">製品を選択</span>
              <span className="mt-1 block text-sm text-gray-500">クリックして製品を選択してください</span>
            </button>
          )}
        </Card>

        {/* 顧客紐付 */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-green-500 mr-3" />
              <h2 className="text-lg font-medium text-gray-900">顧客紐付</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowCustomerModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Plus size={16} className="mr-1" />
              顧客追加
            </button>
          </div>

          {formData.customer_mappings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">紐付された顧客がありません</h3>
              <p className="mt-1 text-sm text-gray-500">「顧客追加」ボタンから顧客を追加してください</p>
            </div>
          ) : (
            <div className="space-y-6">
              {formData.customer_mappings.map((mapping, index) => {
                const customerDestinations = customerDeliveryDestinations[mapping.customer_id] || [];
                
                return (
                  <div key={mapping.customer_id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Building size={20} className="text-green-500 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{mapping.customer_name}</h3>
                          <p className="text-xs text-gray-500">{mapping.customer_code}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCustomerMapping(mapping.customer_id)}
                        className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          単価 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                          <input
                            type="number"
                            value={mapping.unit_price}
                            onChange={(e) => updateCustomerMapping(mapping.customer_id, 'unit_price', parseInt(e.target.value) || 0)}
                            className="pl-8 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="0"
                            min="0"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          出荷先選択
                        </label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {customerDestinations.map((destination) => (
                            <label key={destination.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={mapping.delivery_destinations.includes(destination.id)}
                                onChange={() => toggleDeliveryDestination(mapping.customer_id, destination.id)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              />
                              <span className="ml-2 text-sm text-gray-700">{destination.name}</span>
                            </label>
                          ))}
                          {customerDestinations.length === 0 && (
                            <p className="text-xs text-gray-500">この顧客に出荷先が登録されていません</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* 入力内容の確認 */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">入力内容の確認</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">選択製品:</span>
                <span className="ml-2 text-gray-900">
                  {formData.product_name || '未選択'} 
                  {formData.product_code && ` (${formData.product_code})`}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">紐付顧客数:</span>
                <span className="ml-2 text-gray-900">{formData.customer_mappings.length}社</span>
              </div>
              {formData.customer_mappings.length > 0 && (
                <div className="pt-3 border-t border-gray-200">
                  <span className="font-medium text-gray-700">顧客一覧:</span>
                  <div className="mt-2 space-y-1">
                    {formData.customer_mappings.map((mapping) => (
                      <div key={mapping.customer_id} className="text-sm text-gray-900">
                        • {mapping.customer_name} - ¥{mapping.unit_price.toLocaleString()} 
                        {mapping.delivery_destinations.length > 0 && 
                          ` (出荷先: ${mapping.delivery_destinations.length}件)`
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </form>

      {/* 製品選択モーダル */}
      {showProductModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">製品選択</h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="製品を検索..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => selectProduct(product)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center">
                      <Package size={16} className="text-blue-500 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {product.code} • {product.category} • ¥{product.standard_price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 顧客選択モーダル */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">顧客選択</h3>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="顧客を検索..."
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {filteredCustomers.map((customer) => {
                  const isAlreadyAdded = formData.customer_mappings.some(mapping => 
                    mapping.customer_id === customer.id
                  );
                  
                  return (
                    <button
                      key={customer.id}
                      onClick={() => addCustomerMapping(customer)}
                      disabled={isAlreadyAdded}
                      className={`w-full text-left p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isAlreadyAdded 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Building size={16} className="text-green-500 mr-3" />
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-500">
                              {customer.code} • {customer.type}
                            </div>
                          </div>
                        </div>
                        {isAlreadyAdded && (
                          <span className="text-xs text-gray-500">追加済み</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCustomerMappingAdd;