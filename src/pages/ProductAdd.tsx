import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Save, ArrowLeft, Package, FileText, DollarSign } from 'lucide-react';

interface ProductFormData {
  code: string;
  name: string;
  category: string;
  unit: string;
  standard_price: number;
  description: string;
  status: 'アクティブ' | '廃止';
}

const ProductAdd: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    code: '',
    name: '',
    category: '',
    unit: '個',
    standard_price: 0,
    description: '',
    status: 'アクティブ'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.category) {
      setError('製品コード、製品名、カテゴリーは必須です');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // 実際の実装では、APIに送信
      console.log('Saving product data:', formData);
      
      // 保存成功のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/master-management');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'standard_price' ? parseFloat(value) || 0 : value
    }));
  };

  const generateProductCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    const newCode = `PROD-${timestamp}`;
    setFormData(prev => ({
      ...prev,
      code: newCode
    }));
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
            <h1 className="text-2xl font-bold text-gray-900">製品新規追加</h1>
            <p className="mt-1 text-sm text-gray-500">新しい製品情報を登録</p>
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
        {/* 基本情報 */}
        <Card>
          <div className="flex items-center mb-6">
            <Package className="h-6 w-6 text-green-500 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">基本情報</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                製品コード <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="例: PROD-A001"
                  required
                />
                <button
                  type="button"
                  onClick={generateProductCode}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                >
                  自動生成
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                製品名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="例: ミネラルウォーター 500ml"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリー <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">カテゴリーを選択</option>
                <option value="飲料">飲料</option>
                <option value="食品">食品</option>
                <option value="日用品">日用品</option>
                <option value="化粧品">化粧品</option>
                <option value="医薬品">医薬品</option>
                <option value="その他">その他</option>
              </select>
            </div>

            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                単位
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="個">個</option>
                <option value="本">本</option>
                <option value="箱">箱</option>
                <option value="ケース">ケース</option>
                <option value="セット">セット</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="リットル">リットル</option>
                <option value="ml">ml</option>
              </select>
            </div>

            <div>
              <label htmlFor="standard_price" className="block text-sm font-medium text-gray-700 mb-1">
                標準価格
              </label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  id="standard_price"
                  name="standard_price"
                  value={formData.standard_price}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                ステータス
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="アクティブ">アクティブ</option>
                <option value="廃止">廃止</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="製品の詳細説明を入力してください"
              />
            </div>
          </div>
        </Card>

        {/* 入力内容の確認 */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">入力内容の確認</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">製品コード:</span>
                <span className="ml-2 text-gray-900">{formData.code || '未入力'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">製品名:</span>
                <span className="ml-2 text-gray-900">{formData.name || '未入力'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">カテゴリー:</span>
                <span className="ml-2 text-gray-900">{formData.category || '未選択'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">単位:</span>
                <span className="ml-2 text-gray-900">{formData.unit}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">標準価格:</span>
                <span className="ml-2 text-gray-900">¥{formData.standard_price.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">ステータス:</span>
                <span className="ml-2 text-gray-900">{formData.status}</span>
              </div>
            </div>
            {formData.description && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="font-medium text-gray-700">説明:</span>
                <p className="mt-1 text-gray-900">{formData.description}</p>
              </div>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
};

export default ProductAdd;