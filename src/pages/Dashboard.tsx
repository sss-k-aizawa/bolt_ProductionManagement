import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Package,
  FileText,
  Calendar,
  Truck,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/ui/MetricCard';
import Chart from '../components/ui/Chart';
import Card from '../components/ui/Card';
import { format, addDays, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // 生産データ（週間）
  const productionData = [
    { name: '月', actual: 240, target: 250 },
    { name: '火', actual: 278, target: 250 },
    { name: '水', actual: 189, target: 250 },
    { name: '木', actual: 239, target: 250 },
    { name: '金', actual: 302, target: 250 },
    { name: '土', actual: 0, target: 0 },
    { name: '日', actual: 0, target: 0 },
  ];

  // 在庫状況データ
  const inventoryData = [
    { name: '原材料', current: 85, target: 100 },
    { name: '部品', current: 45, target: 80 },
    { name: '工具', current: 92, target: 90 },
    { name: 'パーツ', current: 67, target: 75 },
  ];

  // 製造指示書データ
  const manufacturingInstructions = [
    { 
      id: 'MI-20250410-001', 
      product: 'ミネラルウォーター 500ml', 
      quantity: 10000, 
      status: '製造中', 
      priority: '高',
      dueDate: '2025-04-11'
    },
    { 
      id: 'MI-20250409-002', 
      product: 'お茶 350ml', 
      quantity: 8000, 
      status: '承認済み', 
      priority: '中',
      dueDate: '2025-04-12'
    },
    { 
      id: 'MI-20250408-003', 
      product: 'スポーツドリンク 500ml', 
      quantity: 15000, 
      status: '完了', 
      priority: '中',
      dueDate: '2025-04-09'
    },
    { 
      id: 'MI-20250407-004', 
      product: 'コーヒー 250ml', 
      quantity: 5000, 
      status: '承認待ち', 
      priority: '低',
      dueDate: '2025-04-13'
    },
  ];

  // パレット在庫データ
  const palletData = [
    { company: 'SPRパレット', stock: 850, usage: 180, inbound: 150 },
    { company: 'JPRパレット', stock: 620, usage: 140, inbound: 120 },
  ];

  // 在庫アラート
  const inventoryAlerts = [
    { item: '部品B (A2344)', current: 5, min: 10, status: '在庫少', severity: 'warning' },
    { item: '材料G (C3422)', current: 0, min: 10, status: '在庫切れ', severity: 'critical' },
    { item: 'パーツF (C1001)', current: 8, min: 10, status: '在庫少', severity: 'warning' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '完了':
        return 'bg-green-100 text-green-800';
      case '製造中':
        return 'bg-blue-100 text-blue-800';
      case '承認済み':
        return 'bg-purple-100 text-purple-800';
      case '承認待ち':
        return 'bg-amber-100 text-amber-800';
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

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="text-red-500" size={20} />;
      case 'warning':
        return <Clock className="text-amber-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  // 今日の生産実績
  const todayProduction = productionData.find(d => d.name === format(new Date(), 'EEE', { locale: ja }))?.actual || 0;
  const todayTarget = productionData.find(d => d.name === format(new Date(), 'EEE', { locale: ja }))?.target || 0;
  const productionRate = todayTarget > 0 ? (todayProduction / todayTarget) * 100 : 0;

  // 週間生産実績
  const weeklyActual = productionData.reduce((sum, d) => sum + d.actual, 0);
  const weeklyTarget = productionData.reduce((sum, d) => sum + d.target, 0);

  // 在庫アラート数
  const criticalAlerts = inventoryAlerts.filter(alert => alert.severity === 'critical').length;
  const warningAlerts = inventoryAlerts.filter(alert => alert.severity === 'warning').length;

  // 製造指示書統計
  const totalInstructions = manufacturingInstructions.length;
  const inProgressInstructions = manufacturingInstructions.filter(inst => inst.status === '製造中').length;
  const pendingInstructions = manufacturingInstructions.filter(inst => inst.status === '承認待ち').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mt-1 text-sm text-gray-500">製造業管理システムの概要と主要指標</p>
      </div>

      {/* 主要指標カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="今日の生産率"
          value={productionRate.toFixed(1)}
          unit="%"
          change={productionRate >= 100 ? "+達成" : `${(100 - productionRate).toFixed(1)}%不足`}
          trend={productionRate >= 100 ? "up" : "down"}
          icon={<Activity size={20} />}
          color={productionRate >= 100 ? "green" : productionRate >= 80 ? "amber" : "red"}
        />
        <MetricCard
          title="在庫アラート"
          value={criticalAlerts + warningAlerts}
          unit="件"
          change={criticalAlerts > 0 ? `緊急${criticalAlerts}件` : "正常"}
          trend={criticalAlerts > 0 ? "down" : "up"}
          icon={<Package size={20} />}
          color={criticalAlerts > 0 ? "red" : warningAlerts > 0 ? "amber" : "green"}
        />
        <MetricCard
          title="製造指示書"
          value={inProgressInstructions}
          unit="件製造中"
          change={`承認待ち${pendingInstructions}件`}
          trend={pendingInstructions === 0 ? "up" : "neutral"}
          icon={<FileText size={20} />}
          color="blue"
        />
        <MetricCard
          title="パレット在庫"
          value={(palletData.reduce((sum, p) => sum + p.stock, 0)).toLocaleString()}
          unit="個"
          change={`使用${palletData.reduce((sum, p) => sum + p.usage, 0)}個/日`}
          trend="neutral"
          icon={<Truck size={20} />}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 週間生産実績 */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">週間生産実績</h2>
            <button 
              onClick={() => navigate('/production')}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              詳細表示 <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <Chart 
            data={productionData} 
            height={300}
            dataKeys={[
              { key: 'actual', name: '実績', color: '#3B82F6' },
              { key: 'target', name: '目標', color: '#E5E7EB' }
            ]} 
          />
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500">週間実績</p>
              <p className="text-xl font-semibold text-gray-900">{weeklyActual.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">週間目標</p>
              <p className="text-xl font-semibold text-gray-900">{weeklyTarget.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* 在庫アラート */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">在庫アラート</h2>
            <button 
              onClick={() => navigate('/inventory')}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              在庫管理 <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="space-y-3">
            {inventoryAlerts.map((alert, index) => (
              <div key={index} className={`flex items-start p-3 rounded-lg border ${getAlertColor(alert.severity)}`}>
                {getAlertIcon(alert.severity)}
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.item}</p>
                  <p className="text-xs text-gray-600">
                    現在庫: {alert.current} / 最小: {alert.min}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>
            ))}
            {inventoryAlerts.length === 0 && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-500" size={20} />
                <p className="ml-3 text-sm text-green-800">すべての在庫は適正レベルです</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 製造指示書一覧 */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">最新の製造指示書</h2>
            <button 
              onClick={() => navigate('/manufacturing-instructions')}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              すべて表示 <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">指示書No</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">製品</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {manufacturingInstructions.slice(0, 4).map((instruction) => (
                  <tr key={instruction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {instruction.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{instruction.product}</div>
                        <div className="text-xs text-gray-400">{instruction.quantity.toLocaleString()}個</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(instruction.status)}`}>
                        {instruction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* パレット在庫状況 */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">パレット在庫状況</h2>
            <button 
              onClick={() => navigate('/pallet-planning')}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              計画管理 <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {palletData.map((pallet, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">{pallet.company}</h3>
                  <span className="text-lg font-bold text-blue-600">{pallet.stock.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">使用/日:</span>
                    <span className="text-red-600 font-medium">{pallet.usage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">入庫/日:</span>
                    <span className="text-green-600 font-medium">{pallet.inbound}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((pallet.stock / 1000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>1,000</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 資材在庫レベル */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">資材在庫レベル</h2>
          <button 
            onClick={() => navigate('/inventory')}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            詳細管理 <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
        <Chart 
          data={inventoryData} 
          height={250}
          dataKeys={[
            { key: 'current', name: '現在在庫', color: '#3B82F6' },
            { key: 'target', name: '目標在庫', color: '#10B981' }
          ]} 
        />
      </Card>

      {/* 最近の活動 */}
      <Card>
        <h2 className="text-lg font-medium text-gray-900 mb-4">最近の活動</h2>
        <div className="space-y-3">
          <div className="flex items-start p-3 bg-blue-50 rounded-lg">
            <Activity className="text-blue-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">MI-20250410-001 の製造が開始されました</p>
              <p className="text-xs text-gray-500 mt-1">2時間前 • ミネラルウォーター 500ml</p>
            </div>
          </div>
          <div className="flex items-start p-3 bg-green-50 rounded-lg">
            <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">MI-20250408-003 が完了しました</p>
              <p className="text-xs text-gray-500 mt-1">4時間前 • スポーツドリンク 500ml (15,000個)</p>
            </div>
          </div>
          <div className="flex items-start p-3 bg-amber-50 rounded-lg">
            <AlertTriangle className="text-amber-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">材料G (C3422) の在庫が切れました</p>
              <p className="text-xs text-gray-500 mt-1">6時間前 • 発注が必要です</p>
            </div>
          </div>
          <div className="flex items-start p-3 bg-purple-50 rounded-lg">
            <FileText className="text-purple-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">MI-20250409-002 が承認されました</p>
              <p className="text-xs text-gray-500 mt-1">1日前 • お茶 350ml (8,000個)</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;