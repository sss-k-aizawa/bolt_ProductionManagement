import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Save, ArrowLeft, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';

interface PalletData {
  company: 'SPR' | 'JPR';
  companyName: string;
  dailyData: {
    [date: string]: {
      usage: number;        // 使用数
      inbound: number;      // 入庫数
      stock: number;        // 在庫数
    };
  };
}

const PalletPlanningEdit: React.FC = () => {
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

  // パレットデータ（編集可能）
  const [palletData, setPalletData] = useState<PalletData[]>([
    {
      company: 'SPR',
      companyName: 'SPRパレット',
      dailyData: dates.reduce((acc, date) => {
        const dayOfWeek = new Date(date).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // 平日と週末で異なる値を設定
        const baseUsage = isWeekend ? 50 : 200;
        const baseInbound = isWeekend ? 20 : 150;
        
        acc[date] = {
          usage: baseUsage + Math.floor(Math.random() * 50) - 25,
          inbound: baseInbound + Math.floor(Math.random() * 30) - 15,
          stock: 800 + Math.floor(Math.random() * 200) - 100,
        };
        return acc;
      }, {} as { [date: string]: any })
    },
    {
      company: 'JPR',
      companyName: 'JPRパレット',
      dailyData: dates.reduce((acc, date) => {
        const dayOfWeek = new Date(date).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // 平日と週末で異なる値を設定
        const baseUsage = isWeekend ? 40 : 160;
        const baseInbound = isWeekend ? 15 : 120;
        
        acc[date] = {
          usage: baseUsage + Math.floor(Math.random() * 40) - 20,
          inbound: baseInbound + Math.floor(Math.random() * 25) - 12,
          stock: 600 + Math.floor(Math.random() * 150) - 75,
        };
        return acc;
      }, {} as { [date: string]: any })
    }
  ]);

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

  const updatePalletData = (companyIndex: number, date: string, field: 'usage' | 'inbound' | 'stock', value: number) => {
    setPalletData(prev => prev.map((company, index) => {
      if (index === companyIndex) {
        return {
          ...company,
          dailyData: {
            ...company.dailyData,
            [date]: {
              ...company.dailyData[date],
              [field]: value
            }
          }
        };
      }
      return company;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // 実際の実装では、APIに送信
      console.log('Saving pallet planning data:', palletData);
      
      // 保存成功のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/pallet-planning');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setSaving(false);
    }
  };

  // 日別パレット全体在庫数を計算
  const getTotalStockForDate = (date: string) => {
    return palletData.reduce((total, company) => {
      return total + (company.dailyData[date]?.stock || 0);
    }, 0);
  };

  // 日別合計を計算
  const getDailyTotals = (date: string) => {
    return palletData.reduce((totals, company) => {
      const dayData = company.dailyData[date];
      return {
        usage: totals.usage + (dayData?.usage || 0),
        inbound: totals.inbound + (dayData?.inbound || 0),
        stock: totals.stock + (dayData?.stock || 0),
      };
    }, { usage: 0, inbound: 0, stock: 0 });
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
            <h1 className="text-2xl font-bold text-gray-900">パレット入荷計画編集</h1>
            <p className="mt-1 text-sm text-gray-500">SPRパレットとJPRパレットの使用数・入庫数を編集</p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* パレット計画編集表 */}
        <Card className="p-0">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-48">
                      レンタル会社
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
                  {palletData.map((company, companyIndex) => (
                    <tr key={company.company} className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-white px-4 py-4 whitespace-nowrap border-r border-gray-200">
                        <div className="flex items-center">
                          <Package size={16} className="text-blue-500 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">{company.companyName}</div>
                            <div className="text-xs text-gray-500">{company.company}</div>
                          </div>
                        </div>
                      </td>
                      {dates.map((date) => {
                        const dayData = company.dailyData[date];
                        const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                        const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                        
                        return (
                          <td key={`${company.company}-${date}`} className={`px-4 py-4 whitespace-nowrap text-center text-sm ${
                            isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50' : ''
                          }`}>
                            <div className="space-y-2">
                              <div className="flex items-center justify-center">
                                <span className="text-xs text-red-600 mr-1">出庫:</span>
                                <input
                                  type="number"
                                  value={dayData?.usage || 0}
                                  onChange={(e) => updatePalletData(companyIndex, date, 'usage', parseInt(e.target.value) || 0)}
                                  className="w-16 text-center rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-xs"
                                  min="0"
                                />
                              </div>
                              <div className="flex items-center justify-center">
                                <span className="text-xs text-green-600 mr-1">入庫:</span>
                                <input
                                  type="number"
                                  value={dayData?.inbound || 0}
                                  onChange={(e) => updatePalletData(companyIndex, date, 'inbound', parseInt(e.target.value) || 0)}
                                  className="w-16 text-center rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-xs"
                                  min="0"
                                />
                              </div>
                              <div className="flex items-center justify-center pt-1 border-t border-gray-200">
                                <span className="text-xs text-blue-600 mr-1">在庫:</span>
                                <input
                                  type="number"
                                  value={dayData?.stock || 0}
                                  onChange={(e) => updatePalletData(companyIndex, date, 'stock', parseInt(e.target.value) || 0)}
                                  className="w-16 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs font-bold"
                                  min="0"
                                />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* パレット全体在庫数行 */}
                  <tr className="bg-blue-50 font-bold border-t-2 border-blue-200">
                    <td className="sticky left-0 z-10 bg-blue-50 px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-800 border-r border-gray-200">
                      <div className="flex items-center">
                        <Package size={16} className="text-blue-600 mr-3" />
                        <div>
                          <div className="font-bold text-blue-900">パレット全体</div>
                          <div className="text-xs text-blue-600">総在庫数</div>
                        </div>
                      </div>
                    </td>
                    {dates.map((date) => {
                      const totalStock = getTotalStockForDate(date);
                      const totals = getDailyTotals(date);
                      const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                      const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                      
                      return (
                        <td key={`total-stock-${date}`} className={`px-4 py-4 whitespace-nowrap text-center text-sm ${
                          isToday ? 'bg-blue-100' : isWeekend ? 'bg-blue-100' : ''
                        }`}>
                          <div className="space-y-2">
                            <div className="text-xs text-red-700">
                              出庫: {totals.usage.toLocaleString()}
                            </div>
                            <div className="text-xs text-green-700">
                              入庫: {totals.inbound.toLocaleString()}
                            </div>
                            <div className="pt-1 border-t border-blue-300">
                              <div className="text-lg font-bold text-blue-800">
                                {totalStock.toLocaleString()}
                              </div>
                              <div className="text-xs text-blue-600">総在庫</div>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* 編集ガイド */}
        <Card className="bg-blue-50 border-blue-200">
          <h2 className="text-lg font-medium text-blue-900 mb-4">編集ガイド</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-blue-800 mb-2">出庫数</h3>
              <p className="text-blue-700">日別のパレット出庫数を入力してください。生産活動に応じて調整します。</p>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">入庫数</h3>
              <p className="text-blue-700">日別のパレット入庫予定数を入力してください。配送スケジュールに基づいて設定します。</p>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">在庫数</h3>
              <p className="text-blue-700">日別の在庫予定数を入力してください。出庫数と入庫数のバランスを考慮して調整します。</p>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default PalletPlanningEdit;