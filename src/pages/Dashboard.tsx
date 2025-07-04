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

  // 在庫アラート
  const inventoryAlerts = [
    { item: '部品B (A2344)', current: 5, min: 10, status: '在庫少', severity: 'warning' },
    { item: '材料G (C3422)', current: 0, min: 10, status: '在庫切れ', severity: 'critical' },
    { item: 'パーツF (C1001)', current: 8, min: 10, status: '在庫少', severity: 'warning' },
  ];

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

  // 週間生産実績
  const weeklyActual = productionData.reduce((sum, d) => sum + d.actual, 0);
  const weeklyTarget = productionData.reduce((sum, d) => sum + d.target, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mt-1 text-sm text-gray-500">製造業管理システムの概要と主要指標</p>
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