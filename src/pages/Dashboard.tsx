import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Users,
  Package,
  FileText
} from 'lucide-react';
import MetricCard from '../components/ui/MetricCard';
import Chart from '../components/ui/Chart';
import StatusTable from '../components/ui/StatusTable';
import Card from '../components/ui/Card';

const Dashboard: React.FC = () => {
  const productionData = [
    { name: '月', actual: 240, target: 250 },
    { name: '火', actual: 278, target: 250 },
    { name: '水', actual: 189, target: 250 },
    { name: '木', actual: 239, target: 250 },
    { name: '金', actual: 302, target: 250 },
    { name: '土', actual: 201, target: 250 },
    { name: '日', actual: 178, target: 250 },
  ];

  const workOrders = [
    { id: 'WO-3842', product: '製品A', quantity: 500, status: '完了', priority: '中' },
    { id: 'WO-3843', product: '製品B', quantity: 250, status: '進行中', priority: '高' },
    { id: 'WO-3844', product: '製品C', quantity: 1000, status: '予定', priority: '低' },
    { id: 'WO-3845', product: '製品D', quantity: 750, status: '保留中', priority: '中' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mt-1 text-sm text-gray-500">生産概要と主要指標</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="生産率"
          value="278"
          unit="個/時"
          change="+8%"
          trend="up"
          icon={<Activity size={20} />}
          color="blue"
        />
        <MetricCard
          title="総合設備効率"
          value="87"
          unit="%"
          change="-2%"
          trend="down"
          icon={<TrendingDown size={20} />}
          color="amber"
        />
        <MetricCard
          title="進行中の注文"
          value="23"
          unit="件"
          change="+5"
          trend="up"
          icon={<FileText size={20} />}
          color="green"
        />
        <MetricCard
          title="品質率"
          value="98.7"
          unit="%"
          change="+0.3%"
          trend="up"
          icon={<CheckCircle size={20} />}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">週間生産量</h2>
            <select className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option>今週</option>
              <option>先週</option>
              <option>先月</option>
            </select>
          </div>
          <Chart 
            data={productionData} 
            height={300}
            dataKeys={[
              { key: 'actual', name: '実績', color: '#0F52BA' },
              { key: 'target', name: '目標', color: '#E5E7EB' }
            ]} 
          />
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">アラート</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">すべて表示</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="text-red-500 mr-3 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-900">機械#3 エラー</p>
                <p className="text-xs text-gray-500">10分前</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-amber-50 rounded-lg">
              <Clock className="text-amber-500 mr-3 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-900">メンテナンス予定</p>
                <p className="text-xs text-gray-500">ライン#2 24時間以内</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-amber-50 rounded-lg">
              <Package className="text-amber-500 mr-3 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-900">在庫不足</p>
                <p className="text-xs text-gray-500">部品#A2344（残り5個）</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-900">注文完了</p>
                <p className="text-xs text-gray-500">WO-3842 予定通り完了</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">最近の作業指示</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">すべて表示</button>
          </div>
          <StatusTable data={workOrders} />
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">リソース使用率</h2>
            <select className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option>今日</option>
              <option>今週</option>
              <option>今月</option>
            </select>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">生産ライン1</span>
                <span className="text-sm font-medium text-gray-700">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">生産ライン2</span>
                <span className="text-sm font-medium text-gray-700">64%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">生産ライン3</span>
                <span className="text-sm font-medium text-gray-700">93%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '93%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">作業員</span>
                <span className="text-sm font-medium text-gray-700">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;