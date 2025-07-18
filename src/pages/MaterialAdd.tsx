import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Save, ArrowLeft, Layers, FileText, DollarSign, User, Calendar, MapPin } from 'lucide-react';

interface MaterialFormData {
  code: string;
  name: string;
  category: string;
  unit: string;
  standard_cost: number;
  supplier: string;
  lead_time: number;
  location: string;
  description: string;
  status: 'アクティブ' | '廃止';
}

const MaterialAdd: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<MaterialFormData>({
    code: '',
    name: '',
    category: '',
    unit: 'kg',
    standard_cost: 0,
    supplier: '',
    lead_time: 7,
    location: '',
    description: '',
    status: 'アクティブ'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.category) {
      setError('資材コード、資材名、カテゴリーは必須です');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // 実際の実装では、APIに送信
      console.log('Saving material data:', formData);
      
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
      [name]: name === 'standard_cost' ? parseFloat(value) || 0 : 
              name === 'lead_time' ? parseInt(value) || 0 : value
    }));
  };

  const generateMaterialCode = () => {
    const categoryPrefix = formData.category ? 
      (formData.category === '原材料' ? 'MAT-R' :
       formData.category === '部品' ? 'MAT-P' :
       formData.category === '工具' ? 'MAT-T' :
       formData.category === 'パーツ' ? 'MAT-PT' : 'MAT') : 'MAT';
    const timestamp = Date.now().toString().slice(-3);
    const newCode = `${categoryPrefix}${timestamp}`;
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
            <h1 className="text-2xl font-bold text-gray-900">資材新規追加</h1>
            <p className="mt-1 text-sm text-gray-500">新しい資材情報を登録</p>
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
            <Layers className="h-6 w-6 text-orange-500 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">基本情報</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                資材コード <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="例: MAT-R001"
                  required
                />
                <button
                  type="button"
                  onClick={generateMaterialCode}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                >
                  自動生成
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                資材名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="例: 原材料A"
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
                <option value="原材料">原材料</option>
                <option value="部品">部品</option>
                <option value="工具">工具</option>
                <option value="パーツ">パーツ</option>
                <option value="消耗品">消耗品</option>
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
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="個">個</option>
                <option value="本">本</option>
                <option value="セット">セット</option>
                <option value="箱">箱</option>
                <option value="リットル">リットル</option>
                <option value="ml">ml</option>
                <option value="m">m</option>
                <option value="cm">cm</option>
              </select>
            </div>

            <div>
              <label htmlFor="standard_cost" className="block text-sm font-medium text-gray-700 mb-1">
                標準原価
              </label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  id="standard_cost"
                  name="standard_cost"
                  value={formData.standard_cost}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                サプライヤー
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="例: サプライヤーX"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lead_time" className="block text-sm font-medium text-gray-700 mb-1">
                リードタイム（日）
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  id="lead_time"
                  name="lead_time"
                  value={formData.lead_time}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="7"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                保管場所
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="例: 倉庫A-01"
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
                placeholder="資材の詳細説明を入力してください"
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
                <span className="font-medium text-gray-700">資材コード:</span>
                <span className="ml-2 text-gray-900">{formData.code || '未入力'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">資材名:</span>
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
                <span className="font-medium text-gray-700">標準原価:</span>
                <span className="ml-2 text-gray-900">¥{formData.standard_cost.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">サプライヤー:</span>
                <span className="ml-2 text-gray-900">{formData.supplier || '未入力'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">リードタイム:</span>
                <span className="ml-2 text-gray-900">{formData.lead_time}日</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">保管場所:</span>
                <span className="ml-2 text-gray-900">{formData.location || '未入力'}</span>
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

export default MaterialAdd;