import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Save, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';

interface InventoryDailyItem {
  item_id: string;
  item_name: string;
  min_lot: number;
  memo: string;
  delivery_period: string; // 期間をテキストで管理
  daily_stock: { [date: string]: number };
}

const InventoryDailyEdit: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  // 日別表示用の日付を生成（現在の週）
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 月曜日開始
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return format(date, 'yyyy-MM-dd');
  });

  // 初期データ
  const [inventoryItems, setInventoryItems] = useState<InventoryDailyItem[]>([
    {
      item_id: 'A1001',
      item_name: '原材料A',
      min_lot: 100,
      memo: '主要原材料',
      delivery_period: '2週間',
      daily_stock: dates.reduce((acc, date) => ({
        ...acc,
        [date]: Math.floor(Math.random() * 500) + 200
      }), {})
    },
    {
      item_id: 'A2344',
      item_name: '部品B',
      min_lot: 50,
      memo: '重要部品',
      delivery_period: '10日',
      daily_stock: dates.reduce((acc, date) => ({
        ...acc,
        [date]: Math.floor(Math.random() * 300) + 100
      }), {})
    },
    {
      item_id: 'A3422',
      item_name: '工具C',
      min_lot: 5,
      memo: '生産工具',
      delivery_period: '1ヶ月',
      daily_stock: dates.reduce((acc, date) => ({
        ...acc,
        [date]: Math.floor(Math.random() * 50) + 10
      }), {})
    },
    {
      item_id: 'B1422',
      item_name: '材料D',
      min_lot: 200,
      memo: '補助材料',
      delivery_period: '3週間',
      daily_stock: dates.reduce((acc, date) => ({
        ...acc,
        [date]: Math.floor(Math.random() * 800) + 300
      }), {})
    },
    {
      item_id: 'B2344',
      item_name: '部品E',
      min_lot: 25,
      memo: '汎用部品',
      delivery_period: '1週間',
      daily_stock: dates.reduce((acc, date) => ({
        ...acc,
        [date]: Math.floor(Math.random() * 200) + 50
      }), {})
    },
    {
      item_id: 'C1001',
      item_name: 'パーツF',
      min_lot: 10,
      memo: '特殊パーツ',
      delivery_period: '4週間',
      daily_stock: dates.reduce((acc, date) => ({
        ...acc,
        [date]: Math.floor(Math.random() * 80) + 20
      }), {})
    },
    {
      item_id: 'C3422',
      item_name: '材料G',
      min_lot: 50,
      memo: '液体材料',
      delivery_period: '2週間',
      daily_stock: dates.reduce((acc, date) => ({
        ...acc,
        [date]: Math.floor(Math.random() * 400) + 100
      }), {})
    }
  ]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000));
    }
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const updateDailyStock = (itemIndex: number, date: string, value: number) => {
    setInventoryItems(prev => prev.map((item, index) => {
      if (index === itemIndex) {
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

  const updateItemField = (itemIndex: number, field: 'min_lot' | 'memo' | 'delivery_period', value: string | number) => {
    setInventoryItems(prev => prev.map((item, index) => {
      if (index === itemIndex) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // 実際の実装では、APIに送信
      console.log('Saving inventory daily data:', inventoryItems);
      
      // 保存成功のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/inventory');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/inventory')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">在庫編集</h1>
            <p className="mt-1 text-sm text-gray-500">在庫情報</p>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 統合された一覧表 */}
        <Card className="p-0">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-48">
                      資材
                    </th>
                    <th className="sticky left-48 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-20">
                      最小lot
                    </th>
                    <th className="sticky left-68 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-32">
                      メモ
                    </th>
                    <th className="sticky left-100 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-24">
                      納期
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventoryItems.map((item, itemIndex) => (
                    <tr key={item.item_id} className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-white px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                        <div>
                          <div className="font-medium text-gray-500">{item.item_name}</div>
                          <div className="text-xs text-gray-400">{item.item_id}</div>
                        </div>
                      </td>
                      <td className="sticky left-48 z-10 bg-white px-4 py-3 whitespace-nowrap border-r border-gray-200">
                        <input
                          type="number"
                          value={item.min_lot}
                          onChange={(e) => updateItemField(itemIndex, 'min_lot', parseInt(e.target.value) || 0)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-center"
                          min="0"
                        />
                      </td>
                      <td className="sticky left-68 z-10 bg-white px-4 py-3 whitespace-nowrap border-r border-gray-200">
                        <input
                          type="text"
                          value={item.memo}
                          onChange={(e) => updateItemField(itemIndex, 'memo', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="メモ"
                        />
                      </td>
                      <td className="sticky left-100 z-10 bg-white px-4 py-3 whitespace-nowrap border-r border-gray-200">
                        <input
                          type="text"
                          value={item.delivery_period}
                          onChange={(e) => updateItemField(itemIndex, 'delivery_period', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="例: 2週間"
                        />
                      </td>
                      {dates.map((date) => {
                        const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                        const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                        return (
                          <td key={`${item.item_id}-${date}`} className={`px-4 py-3 whitespace-nowrap ${
                            isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50' : ''
                          }`}>
                            <input
                              type="number"
                              value={item.daily_stock[date] || 0}
                              onChange={(e) => updateDailyStock(itemIndex, date, parseInt(e.target.value) || 0)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-center"
                              min="0"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default InventoryDailyEdit;