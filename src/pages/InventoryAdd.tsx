import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Save, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type InventoryItemInsert = Database['public']['Tables']['inventory_items']['Insert'];

const InventoryAdd: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<InventoryItemInsert>({
    item_id: '',
    name: '',
    category: '',
    quantity: 0,
    unit: '個',
    min_quantity: 0,
    max_quantity: 100,
    location: '',
    supplier: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.item_id || !formData.name || !formData.category) {
      setError('必須項目を入力してください');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const { error } = await supabase
        .from('inventory_items')
        .insert(formData);

      if (error) {
        if (error.code === '23505') {
          throw new Error('このアイテムIDは既に使用されています');
        }
        throw error;
      }
      
      navigate('/inventory');
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
      [name]: name === 'quantity' || name === 'min_quantity' || name === 'max_quantity' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const generateItemId = () => {
    const prefix = formData.category ? formData.category.charAt(0).toUpperCase() : 'A';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const newId = `${prefix}${timestamp}${random}`;
    
    setFormData(prev => ({
      ...prev,
      item_id: newId
    }));
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
            <h1 className="text-2xl font-bold text-gray-900">新規アイテム追加</h1>
            <p className="mt-1 text-sm text-gray-500">資材在庫アイテムの新規登録</p>
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
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="item_id" className="block text-sm font-medium text-gray-700 mb-1">
                アイテムID <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="item_id"
                  name="item_id"
                  value={formData.item_id}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="例: A123456"
                  required
                />
                <button
                  type="button"
                  onClick={generateItemId}
                  className="mt-1 inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                >
                  自動生成
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">一意のアイテムIDを入力してください</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                アイテム名 <span className="text-red-500">*</span>
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
                <option value="個">個</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="リットル">リットル</option>
                <option value="ml">ml</option>
                <option value="m">m</option>
                <option value="cm">cm</option>
                <option value="セット">セット</option>
                <option value="箱">箱</option>
                <option value="本">本</option>
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                初期数量
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="min_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                最小在庫数
              </label>
              <input
                type="number"
                id="min_quantity"
                name="min_quantity"
                value={formData.min_quantity}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">この数量を下回ると在庫不足として表示されます</p>
            </div>

            <div>
              <label htmlFor="max_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                最大在庫数
              </label>
              <input
                type="number"
                id="max_quantity"
                name="max_quantity"
                value={formData.max_quantity}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                保管場所
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="例: 倉庫A-01"
              />
            </div>

            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                サプライヤー
              </label>
              <input
                type="text"
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="例: サプライヤーX"
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="アイテムの詳細説明を入力してください"
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">入力内容の確認</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">アイテムID:</span>
                <span className="ml-2 text-gray-900">{formData.item_id || '未入力'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">名称:</span>
                <span className="ml-2 text-gray-900">{formData.name || '未入力'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">カテゴリー:</span>
                <span className="ml-2 text-gray-900">{formData.category || '未選択'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">数量:</span>
                <span className="ml-2 text-gray-900">{formData.quantity} {formData.unit}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">在庫範囲:</span>
                <span className="ml-2 text-gray-900">{formData.min_quantity} - {formData.max_quantity} {formData.unit}</span>
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

export default InventoryAdd;