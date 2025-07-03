import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { ArrowLeft, FileText, Calendar, Package, User, Building, Phone, Mail, Save, Download, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface RequestItem {
  id: string;
  palletType: string;
  quantity: number;
  requestDate: string;
  deliveryDate: string;
  deliveryLocation: string;
  notes: string;
}

const SPRPalletRequest: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [requestData, setRequestData] = useState({
    requestNumber: `SPR-${format(new Date(), 'yyyyMMdd')}-001`,
    requestDate: format(new Date(), 'yyyy-MM-dd'),
    companyName: '株式会社製造業',
    department: '生産部',
    requestorName: '山田太郎',
    contactPhone: '03-1234-5678',
    contactEmail: 'yamada@example.com',
    deliveryAddress: '東京都千代田区丸の内1-1-1 工場A',
    urgency: 'normal' as 'urgent' | 'normal' | 'low',
    notes: '',
  });

  const [requestItems, setRequestItems] = useState<RequestItem[]>([
    {
      id: '1',
      palletType: '標準パレット（1100×1100）',
      quantity: 100,
      requestDate: format(new Date(), 'yyyy-MM-dd'),
      deliveryDate: format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 3日後
      deliveryLocation: '工場A 入荷口',
      notes: '通常配送'
    }
  ]);

  const addRequestItem = () => {
    const newItem: RequestItem = {
      id: (requestItems.length + 1).toString(),
      palletType: '標準パレット（1100×1100）',
      quantity: 0,
      requestDate: format(new Date(), 'yyyy-MM-dd'),
      deliveryDate: format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      deliveryLocation: '',
      notes: ''
    };
    setRequestItems([...requestItems, newItem]);
  };

  const removeRequestItem = (id: string) => {
    setRequestItems(requestItems.filter(item => item.id !== id));
  };

  const updateRequestItem = (id: string, field: keyof RequestItem, value: string | number) => {
    setRequestItems(requestItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateRequestData = (field: string, value: string) => {
    setRequestData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // バリデーション
      if (requestItems.length === 0) {
        throw new Error('依頼項目を追加してください');
      }
      
      if (requestItems.some(item => item.quantity <= 0)) {
        throw new Error('数量を正しく入力してください');
      }
      
      // 実際の実装では、APIに送信
      console.log('Saving SPR pallet request:', { requestData, requestItems });
      
      // 保存成功のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('SPRパレット引取手配依頼書を保存しました。');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // PDF生成のシミュレーション
    alert('SPRパレット引取手配依頼書をダウンロードします。');
  };

  const handlePrint = () => {
    window.print();
  };

  const getTotalQuantity = () => {
    return requestItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return '緊急';
      case 'normal': return '通常';
      case 'low': return '低';
      default: return urgency;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/pallet-planning')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SPRパレット引取手配依頼書</h1>
            <p className="mt-1 text-sm text-gray-500">SPRパレットの引取手配依頼書を作成</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Printer size={16} className="mr-2" />
            印刷
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Download size={16} className="mr-2" />
            PDF出力
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save size={16} className="mr-2" />
            {loading ? '保存中...' : '保存'}
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

      {/* 依頼書ヘッダー */}
      <Card>
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText size={24} className="text-blue-500 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">SPRパレット引取手配依頼書</h2>
                <p className="text-sm text-gray-500">依頼番号: {requestData.requestNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">作成日</p>
              <p className="text-lg font-medium text-gray-900">
                {format(new Date(requestData.requestDate), 'yyyy年M月d日', { locale: ja })}
              </p>
            </div>
          </div>
        </div>

        {/* 依頼者情報 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">依頼者情報</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  会社名
                </label>
                <div className="relative">
                  <Building size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="companyName"
                    value={requestData.companyName}
                    onChange={(e) => updateRequestData('companyName', e.target.value)}
                    className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  部署
                </label>
                <input
                  type="text"
                  id="department"
                  value={requestData.department}
                  onChange={(e) => updateRequestData('department', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="requestorName" className="block text-sm font-medium text-gray-700 mb-1">
                  担当者名
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="requestorName"
                    value={requestData.requestorName}
                    onChange={(e) => updateRequestData('requestorName', e.target.value)}
                    className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">連絡先情報</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  電話番号
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    id="contactPhone"
                    value={requestData.contactPhone}
                    onChange={(e) => updateRequestData('contactPhone', e.target.value)}
                    className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="contactEmail"
                    value={requestData.contactEmail}
                    onChange={(e) => updateRequestData('contactEmail', e.target.value)}
                    className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                  緊急度
                </label>
                <select
                  id="urgency"
                  value={requestData.urgency}
                  onChange={(e) => updateRequestData('urgency', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="low">低</option>
                  <option value="normal">通常</option>
                  <option value="urgent">緊急</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 配送先情報 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">配送先情報</h3>
          <div>
            <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
              配送先住所
            </label>
            <textarea
              id="deliveryAddress"
              rows={3}
              value={requestData.deliveryAddress}
              onChange={(e) => updateRequestData('deliveryAddress', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="配送先の詳細住所を入力してください"
            />
          </div>
        </div>
      </Card>

      {/* 依頼項目 */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">依頼項目</h2>
          <button
            onClick={addRequestItem}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            項目追加
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  パレット種類
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  数量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  希望配送日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  配送場所
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  備考
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requestItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={item.palletType}
                      onChange={(e) => updateRequestItem(item.id, 'palletType', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="標準パレット（1100×1100）">標準パレット（1100×1100）</option>
                      <option value="大型パレット（1200×1000）">大型パレット（1200×1000）</option>
                      <option value="小型パレット（800×600）">小型パレット（800×600）</option>
                      <option value="特殊パレット">特殊パレット</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateRequestItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      min="1"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="date"
                      value={item.deliveryDate}
                      onChange={(e) => updateRequestItem(item.id, 'deliveryDate', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.deliveryLocation}
                      onChange={(e) => updateRequestItem(item.id, 'deliveryLocation', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="配送場所"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => updateRequestItem(item.id, 'notes', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="備考"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => removeRequestItem(item.id)}
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

        {/* 合計 */}
        <div className="mt-4 flex justify-end">
          <div className="bg-gray-50 px-4 py-2 rounded-md">
            <span className="text-sm font-medium text-gray-700">
              合計数量: <span className="text-lg font-bold text-blue-600">{getTotalQuantity().toLocaleString()}</span> パレット
            </span>
          </div>
        </div>
      </Card>

      {/* 備考・特記事項 */}
      <Card>
        <h2 className="text-lg font-medium text-gray-900 mb-4">備考・特記事項</h2>
        <textarea
          rows={4}
          value={requestData.notes}
          onChange={(e) => updateRequestData('notes', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="その他の要望や特記事項があれば記入してください"
        />
      </Card>

    </div>
  );
};

export default SPRPalletRequest;