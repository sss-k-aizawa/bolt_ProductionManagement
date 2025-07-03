import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Chart from '../components/ui/Chart';
import { Calendar, Package, TrendingUp, TrendingDown, Edit, Truck, BarChart3, Target, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';

const Production: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'schedule' | 'shipment' | 'inventory' | 'summary'>('schedule');
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // 週間生産データ
  const productionData = [
    { name: '月', actual: 240, target: 250 },
    { name: '火', actual: 278, target: 250 },
    { name: '水', actual: 189, target: 250 },
    { name: '木', actual: 239, target: 250 },
    { name: '金', actual: 302, target: 250 },
    { name: '土', actual: 0, target: 0 },
    { name: '日', actual: 0, target: 0 },
  ];

  // 製品別生産実績データ
  const productionByProduct = [
    { name: '製品A', production: 450, target: 400, efficiency: 112.5 },
    { name: '製品B', production: 320, target: 350, efficiency: 91.4 },
    { name: '製品C', production: 280, target: 300, efficiency: 93.3 },
    { name: '製品D', production: 198, target: 200, efficiency: 99.0 },
  ];

  // 現在の週の開始日から1週間分の日付を生成
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return format(date, 'yyyy-MM-dd');
  });

  // 生産スケジュールデータ
  const scheduleData = [
    {
      product: '製品A',
      quantities: {
        [dates[0]]: 200,
        [dates[1]]: 250,
        [dates[2]]: 180,
        [dates[3]]: 300,
        [dates[4]]: 220,
        [dates[5]]: 0,
        [dates[6]]: 0,
      }
    },
    {
      product: '製品B',
      quantities: {
        [dates[0]]: 150,
        [dates[1]]: 180,
        [dates[2]]: 200,
        [dates[3]]: 160,
        [dates[4]]: 190,
        [dates[5]]: 0,
        [dates[6]]: 0,
      }
    },
    {
      product: '製品C',
      quantities: {
        [dates[0]]: 100,
        [dates[1]]: 120,
        [dates[2]]: 0,
        [dates[3]]: 140,
        [dates[4]]: 110,
        [dates[5]]: 0,
        [dates[6]]: 0,
      }
    },
  ];

  // 製品出庫データ
  const shipmentData = [
    {
      product: '製品A',
      customer: 'A商事株式会社',
      destination: '東京都港区',
      quantities: {
        [dates[0]]: 180,
        [dates[1]]: 200,
        [dates[2]]: 150,
        [dates[3]]: 220,
        [dates[4]]: 190,
        [dates[5]]: 0,
        [dates[6]]: 0,
      }
    },
    {
      product: '製品B',
      customer: 'B流通株式会社',
      destination: '大阪府大阪市',
      quantities: {
        [dates[0]]: 120,
        [dates[1]]: 140,
        [dates[2]]: 160,
        [dates[3]]: 130,
        [dates[4]]: 150,
        [dates[5]]: 0,
        [dates[6]]: 0,
      }
    },
    {
      product: '製品C',
      customer: 'Cマート',
      destination: '愛知県名古屋市',
      quantities: {
        [dates[0]]: 80,
        [dates[1]]: 90,
        [dates[2]]: 0,
        [dates[3]]: 110,
        [dates[4]]: 85,
        [dates[5]]: 0,
        [dates[6]]: 0,
      }
    },
  ];

  // 製品在庫データ
  const inventoryData = [
    {
      product: '製品A',
      customer: 'A商事株式会社',
      destination: '東京都港区',
      quantities: {
        [dates[0]]: 850,
        [dates[1]]: 900,
        [dates[2]]: 930,
        [dates[3]]: 1010,
        [dates[4]]: 1040,
        [dates[5]]: 1040,
        [dates[6]]: 1040,
      }
    },
    {
      product: '製品B',
      customer: 'B流通株式会社',
      destination: '大阪府大阪市',
      quantities: {
        [dates[0]]: 620,
        [dates[1]]: 660,
        [dates[2]]: 700,
        [dates[3]]: 730,
        [dates[4]]: 770,
        [dates[5]]: 770,
        [dates[6]]: 770,
      }
    },
    {
      product: '製品C',
      customer: 'Cマート',
      destination: '愛知県名古屋市',
      quantities: {
        [dates[0]]: 420,
        [dates[1]]: 450,
        [dates[2]]: 450,
        [dates[3]]: 480,
        [dates[4]]: 505,
        [dates[5]]: 505,
        [dates[6]]: 505,
      }
    },
  ];

  const getTotalForDate = (data: any[], date: string) => {
    return data.reduce((sum, item) => sum + (item.quantities[date] || 0), 0);
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 100) return 'text-green-600';
    if (efficiency >= 90) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusIcon = (efficiency: number) => {
    if (efficiency >= 100) return <CheckCircle size={16} className="text-green-600" />;
    if (efficiency >= 90) return <Clock size={16} className="text-amber-600" />;
    return <AlertTriangle size={16} className="text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">生産管理</h1>
          <p className="mt-1 text-sm text-gray-500">生産スケジュール、出庫、在庫の管理</p>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'schedule'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar size={16} className="inline mr-1" />
            生産計画
          </button>
          <button
            onClick={() => setActiveTab('shipment')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'shipment'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Truck size={16} className="inline mr-1" />
            製品出庫
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inventory'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package size={16} className="inline mr-1" />
            製品在庫
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'summary'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 size={16} className="inline mr-1" />
            生産集計
          </button>
        </nav>
      </div>

      {/* 生産計画タブ */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">週間生産スケジュール</h2>
            <button 
              onClick={() => navigate('/production/schedule/edit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit size={16} className="mr-2" />
              スケジュール編集
            </button>
          </div>

          <Card className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      製品
                    </th>
                    {dates.map((date) => (
                      <th key={date} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {format(new Date(date), 'M/d (EEE)', { locale: ja })}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      週計
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scheduleData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.product}
                      </td>
                      {dates.map((date) => (
                        <td key={date} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {item.quantities[date]?.toLocaleString() || 0}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                        {Object.values(item.quantities).reduce((sum, qty) => sum + qty, 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-medium">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      日別合計
                    </td>
                    {dates.map((date) => (
                      <td key={date} className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                        {getTotalForDate(scheduleData, date).toLocaleString()}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                      {scheduleData.reduce((sum, item) => sum + Object.values(item.quantities).reduce((itemSum, qty) => itemSum + qty, 0), 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">週間生産実績</h3>
              <Chart 
                data={productionData} 
                height={300}
                dataKeys={[
                  { key: 'actual', name: '実績', color: '#3B82F6' },
                  { key: 'target', name: '目標', color: '#E5E7EB' }
                ]} 
              />
            </Card>

            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">製品別生産効率</h3>
              <div className="space-y-4">
                {productionByProduct.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Package size={16} className="text-blue-500 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          実績: {product.production} / 目標: {product.target}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(product.efficiency)}
                      <span className={`ml-2 font-medium ${getEfficiencyColor(product.efficiency)}`}>
                        {product.efficiency.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 製品出庫タブ */}
      {activeTab === 'shipment' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">週間製品出庫計画</h2>
            <button 
              onClick={() => navigate('/production/shipment/edit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit size={16} className="mr-2" />
              出庫計画編集
            </button>
          </div>

          <Card className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      製品・出荷先
                    </th>
                    {dates.map((date) => (
                      <th key={date} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {format(new Date(date), 'M/d (EEE)', { locale: ja })}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      週計
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shipmentData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.product}</div>
                          <div className="text-sm text-gray-500">{item.customer}</div>
                          <div className="text-xs text-gray-400">{item.destination}</div>
                        </div>
                      </td>
                      {dates.map((date) => (
                        <td key={date} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {item.quantities[date]?.toLocaleString() || 0}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                        {Object.values(item.quantities).reduce((sum, qty) => sum + qty, 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-medium">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      日別合計
                    </td>
                    {dates.map((date) => (
                      <td key={date} className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                        {getTotalForDate(shipmentData, date).toLocaleString()}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                      {shipmentData.reduce((sum, item) => sum + Object.values(item.quantities).reduce((itemSum, qty) => itemSum + qty, 0), 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 製品在庫タブ */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">週間製品在庫推移</h2>
            <button 
              onClick={() => navigate('/production/inventory/edit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit size={16} className="mr-2" />
              在庫編集
            </button>
          </div>

          <Card className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      製品・保管先
                    </th>
                    {dates.map((date) => (
                      <th key={date} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {format(new Date(date), 'M/d (EEE)', { locale: ja })}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventoryData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.product}</div>
                          <div className="text-sm text-gray-500">{item.customer}</div>
                          <div className="text-xs text-gray-400">{item.destination}</div>
                        </div>
                      </td>
                      {dates.map((date) => {
                        const quantity = item.quantities[date] || 0;
                        const prevDate = dates[dates.indexOf(date) - 1];
                        const prevQuantity = prevDate ? item.quantities[prevDate] || 0 : quantity;
                        const change = quantity - prevQuantity;
                        
                        return (
                          <td key={date} className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {quantity.toLocaleString()}
                            </div>
                            {change !== 0 && (
                              <div className={`text-xs flex items-center justify-center ${
                                change > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {change > 0 ? (
                                  <TrendingUp size={12} className="mr-1" />
                                ) : (
                                  <TrendingDown size={12} className="mr-1" />
                                )}
                                {Math.abs(change)}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 生産集計タブ */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">生産実績サマリー</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">週間生産目標</dt>
                    <dd className="text-lg font-medium text-gray-900">1,250個</dd>
                  </dl>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">週間生産実績</dt>
                    <dd className="text-lg font-medium text-gray-900">1,248個</dd>
                  </dl>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-amber-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">達成率</dt>
                    <dd className="text-lg font-medium text-gray-900">99.8%</dd>
                  </dl>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">日別生産実績</h3>
              <Chart 
                data={productionData} 
                height={300}
                dataKeys={[
                  { key: 'actual', name: '実績', color: '#3B82F6' },
                  { key: 'target', name: '目標', color: '#E5E7EB' }
                ]} 
              />
            </Card>

            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">製品別生産実績</h3>
              <div className="space-y-4">
                {productionByProduct.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Package size={16} className="text-blue-500 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {product.production}個 / {product.target}個
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${getEfficiencyColor(product.efficiency)}`}>
                        {product.efficiency.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.production >= product.target ? '目標達成' : '未達成'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Production;