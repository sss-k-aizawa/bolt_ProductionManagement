import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Save, ArrowLeft, Package, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ProductInventoryItem {
  id: string;
  item_id: string;
  name: string;
  category: string;
  unit: string;
  unit_price: number;
  shipping_customer: string;
  shipping_destination: string;
  min_quantity: number;
  max_quantity: number;
  location: string;
  supplier: string;
  description: string;
  daily_stock: { [date: string]: number };
}

const ProductInventoryEdit: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // 現在の週の開始日から1週間分の日付を生成
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 月曜日開始
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return format(date, 'yyyy-MM-dd');
  });

  // 初期データ（実際の実装では、APIから取得）
  const [inventoryItems, setInventoryItems] = useState<ProductInventoryItem[]>([
    {
      id: 'prod-1',
      item_id: 'PROD-A',
      name: '製品A',
      category: '製品',
      unit: '個',
      unit_price: 1500,
      shipping_customer: 'A商事株式会社',
      shipping_destination: '東京都港区',
      min_quantity: 200,
      max_quantity: 2000,
      location: '製品倉庫A-01',
      supplier: '自社製造',
      description: '主力製品A',
      daily_stock: dates.reduce((acc, date) => ({
        ...acc,
        [date]: Math.floor(Math.random() * 1000) + 500
      }), {})
    },
    {
      id: 'prod-2',
      item_id: 'PROD-B',
      name: '製品B',
      category: '製品',
      unit: '個',
      unit_price: 2200,
      shipping_customer: 'B流通株式会社',
      shipping_destination: '大阪府大阪市',
      min_quantity: 150,
      max_quantity: 1500,
      location: '製品倉庫A-02',
      supplier: '自社製造',
      description: '標準製品B',
      daily_stock: dates.reduce((acc, date) => ({
        ...acc,
        [date]: Math.floor(Math.random() * 800) + 400
      }), {})
    },
    {
      id: 'prod-3',
      item_id: 'PROD-C',
      name: '製品C',
      category: '製品',
      unit: '個',
      unit_price: 3800,
      shipping_customer: 'Cマート',
      shipping_destination: '愛知県名古屋市',
      min_quantity: 100,
      max_quantity: 800,
      location: '製品倉庫B-01',
      supplier: '自社製造',
      description: '特殊製品C',
      daily_stock: dates.reduce((acc, date) => ({
        ...acc,
        [date]: Math.floor(Math.random() * 300) + 100
      }), {})
    },
    {
      id: 'prod-4',
      item_id: 'PROD-D',
      name: '製品D',
      category: '製品',
      unit: '個',
      unit_price: 980,
      shipping_customer: 'D食品株式会社',
      shipping_destination: '福岡県福岡市',
      min_quantity: 80,
      max_quantity: 600,
      location: '製品倉庫B-02',
      supplier: '自社製造',
      description: '新製品D',
      daily_stock: dates.reduce((acc, date) => ({
        ...acc,
        [date]: Math.floor(Math.random() * 200) + 50
      }), {})
    },
    {
      id: 'prod-5',
      item_id: 'PROD-E',
      name: '製品E',
      category: '製品',
      unit: '個',
      unit_price: 5500,
      shipping_customer: 'E商店',
      shipping_destination: '北海道札幌市',
      min_quantity: 50,
      max_quantity: 500,
      location: '製品倉庫C-01',
      supplier: '自社製造',
      description: 'プレミアム製品E',
      daily_stock: dates.reduce((acc, date) => ({
        ...acc,
        [date]: Math.floor(Math.random() * 400) + 200
      }), {})
    },
    {
      id: 'prod-6',
      item_id: 'PROD-F',
      name: '製品F',
      category: '製品',
      unit: '個',
      unit_price: 750,
      shipping_customer: 'F卸売株式会社',
      shipping_destination: '宮城県仙台市',
      min_quantity: 300,
      max_quantity: 2500,
      location: '製品倉庫C-02',
      supplier: '自社製造',
      description: '大量生産製品F',
      daily_stock: dates.reduce((acc, date) => ({
        ...acc,
        [date]: Math.floor(Math.random() * 1500) + 800
      }), {})
    },
    {
      id: 'prod-7',
      item_id: 'PROD-G',
      name: '製品G',
      category: '製品',
      unit: '個',
      unit_price: 4200,
      shipping_customer: 'G商事',
      shipping_destination: '広島県広島市',
      min_quantity: 100,
      max_quantity: 400,
      location: '製品倉庫D-01',
      supplier: '自社製造',
      description: '限定製品G',
      daily_stock: dates.reduce((acc, date) => ({
        ...acc,
        [date]: Math.floor(Math.random() * 300) + 100
      }), {})
    },
  ]);

  const addInventoryItem = () => {
    const newItem: ProductInventoryItem = {
      id: `prod-${inventoryItems.length + 1}`,
      item_id: '',
      name: '',
      category: '製品',
      unit: '個',
      unit_price: 0,
      shipping_customer: '',
      shipping_destination: '',
      min_quantity: 0,
      max_quantity: 1000,
      location: '',
      supplier: '自社製造',
      description: '',
      daily_stock: dates.reduce((acc, date) => ({ ...acc, [date]: 0 }), {}),
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

  const updateDailyStock = (itemId: string, date: string, value: number) => {
    setInventoryItems(inventoryItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          daily_stock: {
            ...item.daily_stock,
            [date]: value
          }
        };
      }
      return item;
    }));
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentWeek(subWeeks(currentWeek, 1));
    } else {
      setCurrentWeek(addWeeks(currentWeek, 1));
    }
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
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
            <p className="mt-1 text-sm text-gray-500">製品在庫情報の日別編集と管理</p>
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

      {/* 週ナビゲーション */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2">
        <button
          onClick={() => navigateWeek('prev')}
          className="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-900">
            {format(weekStart, 'yyyy年M月d日', { locale: ja })} - {format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'M月d日', { locale: ja })}
          </h3>
          <button
            onClick={goToCurrentWeek}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            今週
          </button>
        </div>
        
        <button
          onClick={() => navigateWeek('next')}
          className="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-0">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-48">
                      製品情報
                    </th>
                    <th className="sticky left-48 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-24">
                      単価
                    </th>
                    <th className="sticky left-72 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-24">
                      出荷顧客
                    </th>
                    <th className="sticky left-96 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-32">
                      出荷先
                    </th>
                    <th className="sticky left-128 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-24">
                      最小在庫
                    </th>
                    <th className="sticky left-152 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-24">
                      最大在庫
                    </th>
                    <th className="sticky left-176 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-32">
                      保管場所
                    </th>
                    {dates.map((date) => {
                      const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                      return (
                        <th key={date} className={`px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32 ${
                          isWeekend ? 'bg-gray-100' : ''
                        }`}>
                          <div className="flex flex-col">
                            <span>{format(new Date(date), 'M/d', { locale: ja })}</span>
                            <span className="text-xs text-gray-400">{format(new Date(date), 'EEE', { locale: ja })}</span>
                          </div>
                        </th>
                      );
                    })}
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-20">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventoryItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-white px-4 py-4 whitespace-nowrap border-r border-gray-200">
                        <div className="flex items-center">
                          <Package size={16} className="text-blue-500 mr-2" />
                          <div className="space-y-2">
                            {item.item_id ? (
                              <div>
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.item_id}</div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  value={item.item_id}
                                  onChange={(e) => updateInventoryItem(item.id, 'item_id', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  placeholder="製品ID"
                                  required
                                />
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => updateInventoryItem(item.id, 'name', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  placeholder="製品名"
                                  required
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="sticky left-48 z-10 bg-white px-4 py-4 whitespace-nowrap border-r border-gray-200">
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => updateInventoryItem(item.id, 'unit_price', parseInt(e.target.value) || 0)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-center"
                          min="0"
                          placeholder="単価"
                        />
                      </td>
                      <td className="sticky left-72 z-10 bg-white px-4 py-4 whitespace-nowrap border-r border-gray-200">
                        <input
                          type="text"
                          value={item.shipping_customer}
                          onChange={(e) => updateInventoryItem(item.id, 'shipping_customer', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-center"
                          placeholder="出荷顧客"
                        />
                      </td>
                      <td className="sticky left-96 z-10 bg-white px-4 py-4 whitespace-nowrap border-r border-gray-200">
                        <input
                          type="text"
                          value={item.shipping_destination}
                          onChange={(e) => updateInventoryItem(item.id, 'shipping_destination', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="出荷先"
                        />
                      </td>
                      <td className="sticky left-128 z-10 bg-white px-4 py-4 whitespace-nowrap border-r border-gray-200">
                        <input
                          type="number"
                          value={item.min_quantity}
                          onChange={(e) => updateInventoryItem(item.id, 'min_quantity', parseInt(e.target.value) || 0)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-center"
                          min="0"
                        />
                      </td>
                      <td className="sticky left-152 z-10 bg-white px-4 py-4 whitespace-nowrap border-r border-gray-200">
                        <input
                          type="number"
                          value={item.max_quantity}
                          onChange={(e) => updateInventoryItem(item.id, 'max_quantity', parseInt(e.target.value) || 0)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-center"
                          min="0"
                        />
                      </td>
                      <td className="sticky left-176 z-10 bg-white px-4 py-4 whitespace-nowrap border-r border-gray-200">
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) => updateInventoryItem(item.id, 'location', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="保管場所"
                        />
                      </td>
                      {dates.map((date) => {
                        const stockValue = item.daily_stock[date] || 0;
                        const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                        const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                        
                        return (
                          <td key={`${item.id}-${date}`} className={`px-4 py-4 whitespace-nowrap ${
                            isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50' : ''
                          }`}>
                            <div className="text-center space-y-1">
                              <input
                                type="number"
                                value={stockValue}
                                onChange={(e) => updateDailyStock(item.id, date, parseInt(e.target.value) || 0)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-center"
                                min="0"
                              />
                              <div className={`text-xs px-1 py-0.5 rounded ${
                                getInventoryLevelStatus(stockValue, item.min_quantity, item.max_quantity) === '在庫切れ' ? 'bg-red-100 text-red-700' :
                                getInventoryLevelStatus(stockValue, item.min_quantity, item.max_quantity) === '在庫少' ? 'bg-amber-100 text-amber-700' :
                                getInventoryLevelStatus(stockValue, item.min_quantity, item.max_quantity) === '在庫過多' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {getInventoryLevelStatus(stockValue, item.min_quantity, item.max_quantity)}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-4 py-4 whitespace-nowrap text-center">
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
      </form>
    </div>
  );
};

export default ProductInventoryEdit;