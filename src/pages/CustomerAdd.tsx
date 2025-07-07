import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Save, ArrowLeft, Plus, Trash2, Building, Phone, Mail, MapPin, User, FileText } from 'lucide-react';

interface DeliveryDestination {
  id: string;
  name: string;
  address: string;
  contact_person: string;
  phone: string;
  email: string;
  notes: string;
}

interface CustomerFormData {
  code: string;
  name: string;
  type: '法人' | '個人';
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  status: 'アクティブ' | '非アクティブ';
  delivery_destinations: DeliveryDestination[];
}

const CustomerAdd: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CustomerFormData>({
    code: '',
    name: '',
    type: '法人',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    status: 'アクティブ',
    delivery_destinations: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name) {
      setError('顧客コードと顧客名は必須です');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // 実際の実装では、APIに送信
      console.log('Saving customer data:', formData);
      
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

  const generateCustomerCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    const newCode = `CUST-${timestamp}`;
    setFormData(prev => ({
      ...prev,
      code: newCode
    }));
  };

  const addDeliveryDestination = () => {
    const newDestination: DeliveryDestination = {
      id: Date.now().toString(),
      name: '',
      address: '',
      contact_person: '',
      phone: '',
      email: '',
      notes: ''
    };
    
    setFormData(prev => ({
      ...prev,
      delivery_destinations: [...prev.delivery_destinations, newDestination]
    }));
  };

  const removeDeliveryDestination = (id: string) => {
    setFormData(prev => ({
      ...prev,
      delivery_destinations: prev.delivery_destinations.filter(dest => dest.id !== id)
    }));
  };

  const updateDeliveryDestination = (id: string, field: keyof DeliveryDestination, value: string) => {
    setFormData(prev => ({
      ...prev,
      delivery_destinations: prev.delivery_destinations.map(dest =>
        dest.id === id ? { ...dest, [field]: value } : dest
      )
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
            <h1 className="text-2xl font-bold text-gray-900">顧客新規追加</h1>
            <p className="mt-1 text-sm text-gray-500">新しい顧客情報と輸送先を登録</p>
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
            <Building className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">基本情報</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                顧客コード <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="例: CUST-001"
                  required
                />
                <button
                  type="button"
                  onClick={generateCustomerCode}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                >
                  自動生成
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                顧客名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="例: A商事株式会社"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                種別
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="法人">法人</option>
                <option value="個人">個人</option>
              </select>
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
                  placeholder="例: 田中一郎"
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
                  placeholder="例: 03-1234-5678"
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
                  placeholder="例: contact@example.com"
                />
              </div>
            </div>

            <div>
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
                  placeholder="例: 東京都港区赤坂1-1-1"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              備考
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="顧客に関する特記事項"
              />
            </div>
          </div>
        </Card>

        {/* 輸送先情報 */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-green-500 mr-3" />
              <h2 className="text-lg font-medium text-gray-900">輸送先情報</h2>
            </div>
            <button
              type="button"
              onClick={addDeliveryDestination}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Plus size={16} className="mr-1" />
              輸送先追加
            </button>
          </div>

          {formData.delivery_destinations.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">輸送先が登録されていません</h3>
              <p className="mt-1 text-sm text-gray-500">「輸送先追加」ボタンから輸送先を追加してください</p>
            </div>
          ) : (
            <div className="space-y-6">
              {formData.delivery_destinations.map((destination, index) => (
                <div key={destination.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">輸送先 {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeDeliveryDestination(destination.id)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        輸送先名称
                      </label>
                      <input
                        type="text"
                        value={destination.name}
                        onChange={(e) => updateDeliveryDestination(destination.id, 'name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="例: 東京都港区本社"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        担当者
                      </label>
                      <input
                        type="text"
                        value={destination.contact_person}
                        onChange={(e) => updateDeliveryDestination(destination.id, 'contact_person', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="例: 山田太郎"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        電話番号
                      </label>
                      <input
                        type="tel"
                        value={destination.phone}
                        onChange={(e) => updateDeliveryDestination(destination.id, 'phone', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="例: 03-1234-5678"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        メールアドレス
                      </label>
                      <input
                        type="email"
                        value={destination.email}
                        onChange={(e) => updateDeliveryDestination(destination.id, 'email', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="例: delivery@example.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        住所
                      </label>
                      <textarea
                        rows={2}
                        value={destination.address}
                        onChange={(e) => updateDeliveryDestination(destination.id, 'address', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="例: 東京都江東区豊洲1-1-1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        備考
                      </label>
                      <textarea
                        rows={2}
                        value={destination.notes}
                        onChange={(e) => updateDeliveryDestination(destination.id, 'notes', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="輸送先に関する特記事項"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 入力内容の確認 */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">入力内容の確認</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">顧客コード:</span>
                <span className="ml-2 text-gray-900">{formData.code || '未入力'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">顧客名:</span>
                <span className="ml-2 text-gray-900">{formData.name || '未入力'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">種別:</span>
                <span className="ml-2 text-gray-900">{formData.type}</span>
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
                <span className="font-medium text-gray-700">輸送先数:</span>
                <span className="ml-2 text-gray-900">{formData.delivery_destinations.length}件</span>
              </div>
            </div>
            {formData.address && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="font-medium text-gray-700">住所:</span>
                <p className="mt-1 text-gray-900">{formData.address}</p>
              </div>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CustomerAdd;