import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Chart from '../components/ui/Chart';
import { Calendar, Package, TrendingUp, TrendingDown, Edit, Plus, Eye, CheckCircle, Clock, AlertTriangle, Target, BarChart3 } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';

// 生産計画データの型定義
interface ProductionPlan {
  id: string;
  product_id: string;
  product_name: string;
  category: string;
  planned_quantity: number;
  actual_quantity: number;
  planned_date: string;
  status: '予定' | '進行中' | '完了' | '遅延';
  priority: '高' | '中' | '低';
  line: string;
  shift: '日勤' | '夜勤';
  notes: string;
}

// 生産集計データの型定義
interface ProductionSummary {
  id: string;
  product_id: string;
  product_name: string;
  category: string;
  total_planned: number;
  total_actual: number;
  efficiency: number;
  defect_rate: number;
  period: string;
  line: string;
}

const Production: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'schedule' | 'summary'>('schedule');
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // 現在の週の開始日から1週間分の日付を生成
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return format(date, 'yyyy-MM-dd');
  });

  // サンプル生産計画データ
  const [productionPlans] = useState<ProductionPlan[]>([
    {
      id: '1',
      product_id: 'PROD-A001',
      product_name: 'ミネラルウォーター 500ml',
      category: '飲料',
      planned_quantity: 10000,
      actual_quantity: 9800,
      planned_date: dates[0],
      status: '完了',
      priority: '高',
      line: 'ライン1',
      shift: '日勤',
      notes: '品質チェック完了'
    },
    {
      id: '2',
      product_id: 'PROD-A002',
      product_name: 'お茶 350ml',
      category: '飲料',
      planned_quantity: 8000,
      actual_quantity: 7500,
      planned_date: dates[0],
      status: '進行中',
      priority: '中',
      line: 'ライン2',
      shift: '日勤',
      notes: '原材料調達中'
    },
    {
      id: '3',
      product_id: 'PROD-A003',
      product_name: 'スポーツドリンク 500ml',
      category: '飲料',
      planned_quantity: 15000,
      actual_quantity: 0,
      planned_date: dates[1],
      status: '予定',
      priority: '高',
      line: 'ライン1',
      shift: '日勤',
      notes: '大口注文対応'
    },
    {
      id: '4',
      product_id: 'PROD-A004',
      product_name: 'コーヒー 250ml',
      category: '飲料',
      planned_quantity: 5000,
      actual_quantity: 4800,
      planned_date: dates[1],
      status: '完了',
      priority: '低',
      line: 'ライン3',
      shift: '夜勤',
      notes: ''
    },
    {
      id: '5',
      product_id: 'PROD-A005',
      product_name: 'フルーツジュース 1L',
      category: '飲料',
      planned_quantity: 3000,
      actual_quantity: 2500,
      planned_date: dates[2],
      status: '遅延',
      priority: '中',
      line: 'ライン2',
      shift: '日勤',
      notes: '設備メンテナンスのため遅延'
    },
    {
      id: '6',
      product_id: 'PROD-A001',
      product_name: 'ミネラルウォーター 500ml',
      category: '飲料',
      planned_quantity: 12000,
      actual_quantity: 0,
      planned_date: dates[3],
      status: '予定',
      priority: '高',
      line: 'ライン1',
      shift: '日勤',
      notes: '追加注文対応'
    },
    {
      id: '7',
      product_id: 'PROD-A002',
      product_name: 'お茶 350ml',
      category: '飲料',
      planned_quantity: 9000,
      actual_quantity: 0,
      planned_date: dates[4],
      status: '予定',
      priority: '中',
      line: 'ライン2',
      shift: '日勤',
      notes: ''
    }
  ]);

  // サンプル生産集計データ
  const [productionSummaries] = useState<ProductionSummary[]>([
    {
      id: '1',
      product_id: 'PROD-A001',
      product_name: 'ミネラルウォーター 500ml',
      category: '飲料',
      total_planned: 50000,
      total_actual: 48500,
      efficiency: 97.0,
      defect_rate: 0.5,
      period: '2025年1月',
      line: 'ライン1'
    },
    {
      id: '2',
      product_id: 'PROD-A002',
      product_name: 'お茶 350ml',
      category: '飲料',
      total_planned: 35000,
      total_actual: 33200,
      efficiency: 94.9,
      defect_rate: 0.8,
      period: '2025年1月',
      line: 'ライン2'
    },
    {
      id: '3',
      product_id: 'PROD-A003',
      product_name: 'スポーツドリンク 500ml',
      category: '飲料',
      total_planned: 60000,
      total_actual: 58800,
      efficiency: 98.0,
      defect_rate: 0.3,
      period: '2025年1月',
      line: 'ライン1'
    },
    {
      id: '4',
      product_id: 'PROD-A004',
      product_name: 'コーヒー 250ml',
      category: '飲料',
      total_planned: 20000,
      total_actual: 19200,
      efficiency: 96.0,
      defect_rate: 0.6,
      period: '2025年1月',
      line: 'ライン3'
    },
    {
      id: '5',
      product_id: 'PROD-A005',
      product_name: 'フルーツジュース 1L',
      category: '飲料',
      total_planned: 15000,
      total_actual: 13500,
      efficiency: 90.0,
      defect_rate: 1.2,
      period: '2025年1月',
      line: 'ライン2'
    },
    {
      id: '6',
      product_id: 'PROD-A001',
      product_name: 'ミネラルウォーター 500ml',
      category: '飲料',
      total_planned: 45000,
      total_actual: 44100,
      efficiency: 98.0,
      defect_rate: 0.4,
      period: '2024年12月',
      line: 'ライン1'
    },
    {
      id: '7',
      product_id: 'PROD-A002',
      product_name: 'お茶 350ml',
      category: '飲料',
      total_planned: 32000,
      total_actual: 30800,
      efficiency: 96.3,
      defect_rate: 0.7,
      period: '2024年12月',
      line: 'ライン2'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '完了':
        return 'bg-green-100 text-green-800';
      case '進行中':
        return 'bg-blue-100 text-blue-800';
      case '予定':
        return 'bg-gray-100 text-gray-800';
      case '遅延':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '高':
        return 'bg-red-100 text-red-800';
      case '中':
        return 'bg-amber-100 text-amber-800';
      case '低':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '完了':
        return <CheckCircle size={16} className="text-green-600" />;
      case '進行中':
        return <Clock size={16} className="text-blue-600" />;
      case '予定':
        return <Calendar size={16} className="text-gray-600" />;
      case '遅延':
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return <Package size={16} className="text-gray-600" />;
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-green-600';
    if (efficiency >= 90) return 'text-amber-600';
    return 'text-red-600';
  };

  const getDefectRateColor = (defectRate: number) => {
    if (defectRate <= 0.5) return 'text-green-600';
    if (defectRate <= 1.0) return 'text-amber-600';
    return 'text-red-600';
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

  // 週間生産実績データ（チャート用）
  const weeklyProductionData = dates.map(date => {
    const dayPlans = productionPlans.filter(plan => plan.planned_date === date);
    const planned = dayPlans.reduce((sum, plan) => sum + plan.planned_quantity, 0);
    const actual = dayPlans.reduce((sum, plan) => sum + plan.actual_quantity, 0);
    
    return {
      name: format(new Date(date), 'M/d', { locale: ja }),
      planned,
      actual
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">生産管理</h1>
          <p className="mt-1 text-sm text-gray-500">生産計画の管理と実績の追跡</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate('/production/schedule/edit')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Edit size={16} className="mr-2" />
            スケジュール編集
          </button>
          <button 
            onClick={() => navigate('/production/shipment/edit')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Package size={16} className="mr-2" />
            出庫編集
          </button>
        </div>
      </div>

      {/* 週間生産実績チャート */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">週間生産実績</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <TrendingDown size={16} className="text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">
              {format(weekStart, 'M/d', { locale: ja })} - {format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'M/d', { locale: ja })}
            </span>
            <button
              onClick={() => navigateWeek('next')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <TrendingUp size={16} className="text-gray-600" />
            </button>
            <button
              onClick={goToCurrentWeek}
              className="text-xs text-blue-600 hover:text-blue-800 ml-2"
            >
              今週
            </button>
          </div>
        </div>
        <Chart 
          data={weeklyProductionData} 
          height={300}
          dataKeys={[
            { key: 'planned', name: '計画', color: '#E5E7EB' },
            { key: 'actual', name: '実績', color: '#3B82F6' }
          ]} 
        />
      </Card>

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
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">生産計画一覧</h2>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Plus size={16} className="mr-1" />
              計画追加
            </button>
          </div>
          
          <div className="overflow-x-auto -mx-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    製品情報
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    計画数量
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    実績数量
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    計画日
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ライン・シフト
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    優先度
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productionPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package size={16} className="text-blue-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{plan.product_name}</div>
                          <div className="text-sm text-gray-500">{plan.product_id} • {plan.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {plan.planned_quantity.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {plan.actual_quantity.toLocaleString()}
                        {plan.planned_quantity > 0 && (
                          <div className="text-xs text-gray-500">
                            ({((plan.actual_quantity / plan.planned_quantity) * 100).toFixed(1)}%)
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(plan.planned_date), 'yyyy/MM/dd', { locale: ja })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{plan.line}</div>
                      <div className="text-sm text-gray-500">{plan.shift}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(plan.status)}
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(plan.status)}`}>
                          {plan.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(plan.priority)}`}>
                        {plan.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Eye size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 生産集計タブ */}
      {activeTab === 'summary' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">生産集計一覧</h2>
            <div className="flex items-center space-x-2">
              <select className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="2025-01">2025年1月</option>
                <option value="2024-12">2024年12月</option>
                <option value="2024-11">2024年11月</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto -mx-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    製品情報
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    計画数量
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    実績数量
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    生産効率
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    不良率
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    期間
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ライン
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productionSummaries.map((summary) => (
                  <tr key={summary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BarChart3 size={16} className="text-purple-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{summary.product_name}</div>
                          <div className="text-sm text-gray-500">{summary.product_id} • {summary.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {summary.total_planned.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {summary.total_actual.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Target size={14} className={`mr-1 ${getEfficiencyColor(summary.efficiency)}`} />
                        <span className={`text-sm font-medium ${getEfficiencyColor(summary.efficiency)}`}>
                          {summary.efficiency.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <AlertTriangle size={14} className={`mr-1 ${getDefectRateColor(summary.defect_rate)}`} />
                        <span className={`text-sm font-medium ${getDefectRateColor(summary.defect_rate)}`}>
                          {summary.defect_rate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {summary.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {summary.line}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Eye size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <BarChart3 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Production;