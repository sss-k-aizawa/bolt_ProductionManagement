import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Save, ArrowLeft, Plus, Trash2, Truck, Phone, Mail, MapPin, User, FileText, CreditCard, Layers } from 'lucide-react';

interface SupplierFormData {
  code: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  payment_terms: string;
  materials: string[];
  notes: string;
  status: 'アクティブ' | '非アクティブ';
}

const SupplierAdd: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMaterial, setNewMaterial] = useState('');
  
  const [formData, setFormData] = useState<SupplierFormData>({
    code: '',
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    payment_terms: '',
    materials: [],
    notes: '',
    status: 'アクティブ'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name) {
      setError('サプライヤーコードとサプライヤー名は必須です');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // 実際の実装では、APIに送信
      console.log('Saving supplier data:', formData);
      
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
      [name]: value
    }));
  };

  const generateSupplierCode = () => {
    const timestamp = Date.now().toString().slice(-3);
    const newCode = `SUP-${timestamp}`;
    setFormData(prev => ({
      ...prev,
      code: newCode
    }));
  };

  const addMaterial = () => {
    if (newMaterial.trim() && !formData.materials.includes(newMaterial.trim())) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, newMaterial.trim()]
      }));
      setNewMaterial('');
    }
  };

  const removeMaterial = (material: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m !== material)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMaterial();
    }
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
            <h1 className="text-2xl font-bold text-gray-900">サプライヤー新規追加</h1>
            <p className="mt-1 text-sm text-gray-500">新しいサプライヤー情報を登録</p>
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
            <Truck className="h-6 w-6 text-orange-500 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">基本情報</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                サプライヤーコード <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="例: SUP-001"
                  required
                />
                <button
                  type="button"
                  onClick={generateSupplierCode}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                >
                  自動生成
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                サプライヤー名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="例: サプライヤーX株式会社"
                required
              />
            </div>

            <div>
              <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-1">
                担当者
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="例: 営業部 鈴木"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                電話番号
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="例: 03-1111-2222"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="例: contact@supplier.co.jp"
                />
              </div>
            </div>

            <div>
              <label htmlFor="payment_terms" className="block text-sm font-medium text-gray-700 mb-1">
                支払条件
              </label>
              <div className="relative">
                <CreditCard size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="payment_terms"
                  name="payment_terms"
                  value={formData.payment_terms}
                  onChange={handleChange}
                  className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="例: 月末締め翌月末払い"
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
                <option value="非アクティブ">非アクティブ</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              住所
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
              <textarea
                id="address"
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="例: 東京都千代田区丸の内1-1-1"
              />
            </div>
          </div>
        </Card>

        {/* 扱っている資材 */}
        <Card>
          <div className="flex items-center mb-6">
            <Layers className="h-6 w-6 text-purple-500 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">扱っている資材</h2>
          </div>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="資材名を入力してEnterキーで追加"
              />
              <button
                type="button"
                onClick={addMaterial}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus size={16} className="mr-1" />
                追加
              </button>
            </div>

            {formData.materials.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.materials.map((material, index) => (
                  <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {material}
                    <button
                      type="button"
                      onClick={() => removeMaterial(material)}
                      className="ml-2 inline-flex items-center p-0.5 rounded-full text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Layers className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">資材が登録されていません</h3>
                <p className="mt-1 text-sm text-gray-500">上記の入力欄から資材を追加してください</p>
              </div>
            )}
          </div>
        </Card>

        {/* 備考 */}
        <Card>
          <div className="flex items-center mb-6">
            <FileText className="h-6 w-6 text-gray-500 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">備考</h2>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              備考
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="サプライヤーに関する特記事項を入力してください"
            />
          </div>
        </Card>

        {/* 入力内容の確認 */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">入力内容の確認</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">サプライヤーコード:</span>
                <span className="ml-2 text-gray-900">{formData.code || '未入力'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">サプライヤー名:</span>
                <span className="ml-2 text-gray-900">{formData.name || '未入力'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">担当者:</span>
                <span className="ml-2 text-gray-900">{formData.contact_person || '未入力'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">電話番号:</span>
                <span className="ml-2 text-gray-900">{formData.phone || '未入力'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">支払条件:</span>
                <span className="ml-2 text-gray-900">{formData.payment_terms || '未入力'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">扱っている資材数:</span>
                <span className="ml-2 text-gray-900">{formData.materials.length}件</span>
              </div>
            </div>
            {formData.address && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="font-medium text-gray-700">住所:</span>
                <p className="mt-1 text-gray-900">{formData.address}</p>
              </div>
            )}
            {formData.materials.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="font-medium text-gray-700">扱っている資材:</span>
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.materials.map((material, index) => (
                    <span key={index} className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
};

export default SupplierAdd;