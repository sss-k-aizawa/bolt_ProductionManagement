import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Calendar, Package, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Edit, Download, FileText, Mail } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';

interface PalletData {
  company: 'SPR' | 'JPR';
  companyName: string;
  dailyData: {
    [date: string]: {
      usage: number;        // 使用数
      arranged: number;     // 手配数
      inbound: number;      // 入庫数
      stock: number;        // 在庫数
    };
  };
}

const PalletPlanning: React.FC = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  // 現在の週の開始日から1週間分の日付を生成
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 月曜日開始
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return format(date, 'yyyy-MM-dd');
  });

  // パレットデータ（サンプル）
  const [palletData] = useState<PalletData[]>([
    {
      company: 'SPR',
      companyName: 'SPRパレット',
      dailyData: dates.reduce((acc, date) => {
        const dayOfWeek = new Date(date).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // 平日と週末で異なる値を設定
        const baseUsage = isWeekend ? 50 : 200;
        const baseArranged = isWeekend ? 30 : 180;
        const baseInbound = isWeekend ? 20 : 150;
        
        acc[date] = {
          usage: baseUsage + Math.floor(Math.random() * 50) - 25,
          arranged: baseArranged + Math.floor(Math.random() * 40) - 20,
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
        const baseArranged = isWeekend ? 25 : 140;
        const baseInbound = isWeekend ? 15 : 120;
        
        acc[date] = {
          usage: baseUsage + Math.floor(Math.random() * 40) - 20,
          arranged: baseArranged + Math.floor(Math.random() * 30) - 15,
          inbound: baseInbound + Math.floor(Math.random() * 25) - 12,
          stock: 600 + Math.floor(Math.random() * 150) - 75,
        };
        return acc;
      }, {} as { [date: string]: any })
    }
  ]);

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
        arranged: totals.arranged + (dayData?.arranged || 0),
        inbound: totals.inbound + (dayData?.inbound || 0),
        stock: totals.stock + (dayData?.stock || 0),
      };
    }, { usage: 0, arranged: 0, inbound: 0, stock: 0 });
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

  const handleSPRRequest = () => {
    navigate('/pallet-planning/spr-request');
  };

  const handleJPRRequest = () => {
    navigate('/pallet-planning/jpr-request');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">パレット入荷計画</h1>
          <p className="mt-1 text-sm text-gray-500">パレットレンタル会社別の入荷計画と在庫管理</p>
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Edit size={16} className="mr-2" />
            <span onClick={() => navigate('/pallet-planning/edit')}>計画編集</span>
          </button>
        </div>
      </div>

      {/* パレット引取手配依頼ボタン */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package size={24} className="text-blue-500 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">SPRパレット</h3>
                <p className="text-sm text-gray-500">引取手配依頼書を作成</p>
              </div>
            </div>
            <button
              onClick={handleSPRRequest}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FileText size={16} className="mr-2" />
              依頼書作成
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package size={24} className="text-green-500 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">JPRパレット</h3>
                <p className="text-sm text-gray-500">引取手配依頼をメール送信</p>
              </div>
            </div>
            <button
              onClick={handleJPRRequest}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Mail size={16} className="mr-2" />
              メール送信
            </button>
          </div>
        </Card>
      </div>

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

      {/* パレット計画表 */}
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
                {palletData.map((company) => (
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
                              <span className="text-xs text-red-600 mr-1">使用:</span>
                              <span className="font-medium text-red-600">{dayData?.usage.toLocaleString()}</span>
                              <TrendingDown size={10} className="ml-1 text-red-500" />
                            </div>
                            <div className="flex items-center justify-center">
                              <span className="text-xs text-green-600 mr-1">入庫:</span>
                              <span className="font-medium text-green-600">{dayData?.inbound.toLocaleString()}</span>
                              <TrendingUp size={10} className="ml-1 text-green-500" />
                            </div>
                            <div className="flex items-center justify-center pt-1 border-t border-gray-200">
                              <span className="text-xs text-blue-600 mr-1">在庫:</span>
                              <span className="font-bold text-blue-600">{dayData?.stock.toLocaleString()}</span>
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
                            使用: {totals.usage.toLocaleString()}
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
    </div>
  );
};

export default PalletPlanning;