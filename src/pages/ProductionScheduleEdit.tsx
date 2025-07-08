import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Save, ArrowLeft, Calendar, Package, ChevronLeft, ChevronRight, Plus, Trash2, Target } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, endOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useInventory } from '../hooks/useInventory';

interface ProductionScheduleItem {
  product_id: string;
  product_name: string;
  quantities: { [date: string]: number };
  notes: string;
}

interface DailyTargets {
  [date: string]: {
    target: number;
  };
}

interface InventoryForecast {
  [productId: string]: {
    [date: string]: number;
  };
}

const ProductionScheduleEdit: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduleItems, setScheduleItems] = useState<ProductionScheduleItem[]>([]);
  const [dailyTargets, setDailyTargets] = useState<DailyTargets>({});
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { items: inventoryItems } = useInventory();
  
  // 現在の週の開始日から1週間分の日付を生成
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return format(date, 'yyyy-MM-dd');
  });

  // 製品マスターデータ
  const products = [
    { id: 'PROD-A001', name: 'ミネラルウォーター 500ml' },
    { id: 'PROD-A002', name: 'お茶 350ml' },
    { id: 'PROD-A003', name: 'スポーツドリンク 500ml' },
    { id: 'PROD-A004', name: 'コーヒー 250ml' },
    { id: 'PROD-A005', name: 'フルーツジュース 1L' },
    { id: 'PROD-A006', name: '炭酸水 500ml' },
    { id: 'PROD-A007', name: 'エナジードリンク 250ml' },
  ];

  // 在庫予測データを生成（サンプル）
  const generateInventoryForecast = (): InventoryForecast => {
    const forecast: InventoryForecast = {};
    
    scheduleItems.forEach(item => {
      if (!item.product_id) return;
      
      forecast[item.product_id] = {};
      let currentStock = Math.floor(Math.random() * 1000) + 500; // 初期在庫
      
      dates.forEach((date, index) => {
        // 生産による在庫増加
        const production = item.quantities[date] || 0;
        // 出荷による在庫減少（サンプル）
        const shipment = Math.floor(Math.random() * 200) + 50;
        
        currentStock = currentStock + production - shipment;
        if (currentStock < 0) currentStock = 0;
        
        forecast[item.product_id][date] = currentStock;
      });
    });
    
    return forecast;
  };

  const [inventoryForecast, setInventoryForecast] = useState<InventoryForecast>({});

  useEffect(() => {
    // 初期データの読み込み（実際の実装では、APIから取得）
    loadInitialData();
    loadDailyTargets();
  }, [currentWeek]);

  useEffect(() => {
    // スケジュールが変更されたら在庫予測を再計算
    setInventoryForecast(generateInventoryForecast());
  }, [scheduleItems]);

  const loadInitialData = () => {
    // モックデータで初期化（固定の製品リスト）
    const initialData: ProductionScheduleItem[] = [
      {
        product_id: 'PROD-A001',
        product_name: 'ミネラルウォーター 500ml',
        quantities: {
          [dates[0]]: 200,
          [dates[1]]: 250,
          [dates[2]]: 180,
          [dates[3]]: 300,
          [dates[4]]: 220,
          [dates[5]]: 0,
          [dates[6]]: 0,
        },
        notes: '主力商品・通常生産',
      },
      {
        product_id: 'PROD-A002',
        product_name: 'お茶 350ml',
        quantities: {
          [dates[0]]: 150,
          [dates[1]]: 180,
          [dates[2]]: 200,
          [dates[3]]: 160,
          [dates[4]]: 190,
          [dates[5]]: 0,
          [dates[6]]: 0,
        },
        notes: '季節商品',
      },
      {
        product_id: 'PROD-A003',
        product_name: 'スポーツドリンク 500ml',
        quantities: {
          [dates[0]]: 100,
          [dates[1]]: 120,
          [dates[2]]: 0,
          [dates[3]]: 140,
          [dates[4]]: 110,
          [dates[5]]: 0,
          [dates[6]]: 0,
        },
        notes: '水曜日メンテナンス',
      },
      {
        product_id: 'PROD-A004',
        product_name: 'コーヒー 250ml',
        quantities: {
          [dates[0]]: 80,
          [dates[1]]: 90,
          [dates[2]]: 110,
          [dates[3]]: 95,
          [dates[4]]: 105,
          [dates[5]]: 0,
          [dates[6]]: 0,
        },
        notes: '高単価商品',
      },
      {
        product_id: 'PROD-A005',
        product_name: 'フルーツジュース 1L',
        quantities: {
          [dates[0]]: 60,
          [dates[1]]: 70,
          [dates[2]]: 85,
          [dates[3]]: 75,
          [dates[4]]: 80,
          [dates[5]]: 0,
          [dates[6]]: 0,
        },
        notes: '限定商品',
      },
    ];
    setScheduleItems(initialData);
  };

  const loadDailyTargets = () => {
    // 日別目標値の初期化
    const targets: DailyTargets = {};
    dates.forEach(date => {
      const dayOfWeek = new Date(date).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      if (isWeekend) {
        targets[date] = { target: 0 };
      } else {
        // 平日の目標生産数（サンプル値）
        const baseTarget = 800;
        const dailyVariation = Math.floor(Math.random() * 200) - 100; // ±100の変動
        const target = Math.max(0, baseTarget + dailyVariation);
        
        targets[date] = { target };
      }
    });
    setDailyTargets(targets);
  };

  const addScheduleItem = () => {
    const newItem: ProductionScheduleItem = {
      product_id: '',
      product_name: '',
      quantities: dates.reduce((acc, date) => ({ ...acc, [date]: 0 }), {}),
      notes: '',
    };
    setScheduleItems([...scheduleItems, newItem]);
  };

  const removeScheduleItem = (index: number) => {
    setScheduleItems(scheduleItems.filter((_, i) => i !== index));
  };

  const updateScheduleItem = (index: number, field: keyof ProductionScheduleItem, value: any) => {
    setScheduleItems(scheduleItems.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        // 製品IDが変更された場合、製品名も更新
        if (field === 'product_id') {
          const product = products.find(p => p.id === value);
          updatedItem.product_name = product?.name || '';
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const updateQuantity = (index: number, date: string, quantity: number) => {
    setScheduleItems(scheduleItems.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          quantities: {
            ...item.quantities,
            [date]: quantity,
          },
        };
      }
      return item;
    }));
  };

  const updateNotes = (index: number, notes: string) => {
    setScheduleItems(scheduleItems.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          notes,
        };
      }
      return item;
    }));
  };

  const updateDailyTarget = (date: string, value: number) => {
    setDailyTargets(prev => ({
      ...prev,
      [date]: {
        target: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // バリデーション
      const invalidItems = scheduleItems.filter(item => 
        !item.product_id
      );
      
      if (invalidItems.length > 0) {
        throw new Error('製品を選択してください');
      }
      
      // 実際の実装では、APIに送信
      console.log('Saving schedule items:', scheduleItems);
      console.log('Saving daily targets:', dailyTargets);
      
      // 保存成功のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/production');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setSaving(false);
    }
  };

  const getTotalQuantityForDate = (date: string) => {
    return scheduleItems.reduce((sum, item) => sum + (item.quantities[date] || 0), 0);
  };

  const getTotalQuantityForProduct = (index: number) => {
    const item = scheduleItems[index];
    return Object.values(item.quantities).reduce((sum, qty) => sum + qty, 0);
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

  // 目標達成状況の色分け
  const getTargetAchievementColor = (actual: number, target: number) => {
    if (target === 0) return 'text-gray-600';
    if (actual >= target) return 'text-green-600';
    if (actual >= target * 0.8) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/production')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">週間生産スケジュール編集</h1>
            <p className="mt-1 text-sm text-gray-500">1週間分の生産計画と目標値を表形式で編集</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={addScheduleItem}
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

      {/* スリムな週ナビゲーション */}
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
        {/* 生産スケジュール表 */}
        <Card className="p-0">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-48">
                      項目
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
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-24">
                      週計
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                      備考
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-20">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* 目標生産数行 */}
                  <tr className="bg-green-50">
                    <td className="sticky left-0 z-10 bg-green-50 px-4 py-3 whitespace-nowrap border-r border-gray-200">
                      <div className="flex items-center text-sm font-medium text-green-800">
                        <Target size={16} className="mr-2" />
                        目標生産数
                      </div>
                    </td>
                    {dates.map((date) => {
                      const target = dailyTargets[date]?.target || 0;
                      const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                      return (
                        <td key={`target-${date}`} className={`px-4 py-3 whitespace-nowrap ${
                          isWeekend ? 'bg-green-100' : ''
                        }`}>
                          <input
                            type="number"
                            value={target}
                            onChange={(e) => updateDailyTarget(date, parseInt(e.target.value) || 0)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-center bg-white"
                            min="0"
                            placeholder="0"
                            disabled={isWeekend}
                          />
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className="text-sm font-medium text-green-800">
                        {Object.values(dailyTargets).reduce((sum, target) => sum + target.target, 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-green-700">日別目標値</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      -
                    </td>
                  </tr>

                  {/* 製品別生産予定 */}
                  {scheduleItems.map((item, index) => (
                    <React.Fragment key={index}>
                      {/* 生産予定行 */}
                      <tr className="hover:bg-gray-50">
                        <td className="sticky left-0 z-10 bg-white px-4 py-3 whitespace-nowrap border-r border-gray-200">
                          {item.product_id ? (
                            <div className="flex items-center">
                              <Package size={16} className="text-blue-500 mr-2" />
                              <div>
                                <div className="font-medium text-gray-900">{item.product_name}</div>
                                <div className="text-xs text-gray-500">{item.product_id}</div>
                              </div>
                            </div>
                          ) : (
                            <select
                              value={item.product_id}
                              onChange={(e) => updateScheduleItem(index, 'product_id', e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              required
                            >
                              <option value="">製品を選択</option>
                              {products.map(product => (
                                <option key={product.id} value={product.id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        {dates.map((date) => {
                          const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                          return (
                            <td key={`${index}-${date}`} className={`px-4 py-3 whitespace-nowrap ${
                              isWeekend ? 'bg-gray-50' : ''
                            }`}>
                              <input
                                type="number"
                                value={item.quantities[date] || 0}
                                onChange={(e) => updateQuantity(index, date, parseInt(e.target.value) || 0)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-center"
                                min="0"
                                placeholder="0"
                              />
                            </td>
                          );
                        })}
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-gray-900">
                            {getTotalQuantityForProduct(index).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => updateNotes(index, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="備考"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button
                            type="button"
                            onClick={() => removeScheduleItem(index)}
                            className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                      
                      {/* 在庫予定行 */}
                      {item.product_id && (
                        <tr className="bg-blue-50">
                          <td className="sticky left-0 z-10 bg-blue-50 px-4 py-2 whitespace-nowrap border-r border-gray-200">
                            <div className="flex items-center text-xs text-blue-700">
                              <Package size={12} className="mr-1" />
                              在庫予定数
                            </div>
                          </td>
                          {dates.map((date) => {
                            const forecastStock = inventoryForecast[item.product_id]?.[date] || 0;
                            const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                            return (
                              <td key={`inventory-${index}-${date}`} className={`px-4 py-2 whitespace-nowrap text-center ${
                                isWeekend ? 'bg-blue-100' : ''
                              }`}>
                                <span className={`text-xs font-medium ${
                                  forecastStock < 100 ? 'text-red-600' : 
                                  forecastStock < 300 ? 'text-amber-600' : 'text-blue-600'
                                }`}>
                                  {forecastStock.toLocaleString()}
                                </span>
                              </td>
                            );
                          })}
                          <td className="px-4 py-2 whitespace-nowrap text-center">
                            <span className="text-xs text-blue-600">-</span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className="text-xs text-blue-600">予測在庫</span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className="text-xs text-blue-600">-</span>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  
                  {/* 日別合計行 */}
                  <tr className="bg-gray-50 font-medium">
                    <td className="sticky left-0 z-10 bg-gray-50 px-4 py-3 whitespace-nowrap border-r border-gray-200 text-sm font-medium text-gray-900">
                      日別合計
                    </td>
                    {dates.map((date) => {
                      const total = getTotalQuantityForDate(date);
                      const target = dailyTargets[date]?.target || 0;
                      const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                      
                      return (
                        <td key={`total-${date}`} className={`px-4 py-3 whitespace-nowrap text-center ${
                          isWeekend ? 'bg-gray-100' : ''
                        }`}>
                          <div className="space-y-1">
                            <div className={`text-sm font-medium ${getTargetAchievementColor(total, target)}`}>
                              {total.toLocaleString()}
                            </div>
                            {target > 0 && (
                              <div className="text-xs text-gray-500">
                                {((total / target) * 100).toFixed(0)}%
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                      {scheduleItems.reduce((sum, item) => sum + getTotalQuantityForProduct(scheduleItems.indexOf(item)), 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-gray-600">実績合計</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      -
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {scheduleItems.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">生産予定がありません</h3>
              <p className="mt-1 text-sm text-gray-500">製品を追加して生産スケジュールを作成してください</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={addScheduleItem}
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

export default ProductionScheduleEdit;