import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import { ArrowLeft, Search, Filter, Calendar, Package, Truck, FileText, Download, Eye } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ShipmentHistoryItem {
  id: string;
  product_code: string;
  product_name: string;
  delivery_note_no: string;
  order_no: string;
  shipment_quantity_cases: number;
  shipment_quantity_pieces: number;
  shipment_date: string;
  delivery_date: string;
  delivery_destination: string;
  shipping_company: string;
  order_source: string;
  unit_price: number;
  total_amount: number;
  status: '出荷済み' | '配送中' | '納品完了' | 'キャンセル';
}

const ShipmentHistory: React.FC = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [searchParams] = useSearchParams();
  const customerName = searchParams.get('customerName') || '';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('3months');
  const [loading, setLoading] = useState(true);

  // サンプル出荷履歴データ
  const [shipmentHistory, setShipmentHistory] = useState<ShipmentHistoryItem[]>([]);

  useEffect(() => {
    loadShipmentHistory();
  }, [customerId, dateRange]);

  const loadShipmentHistory = async () => {
    try {
      setLoading(true);
      
      // 実際の実装では、APIから顧客IDに基づいて出荷履歴を取得
      const mockData: ShipmentHistoryItem[] = [
        {
          id: 'SH-001',
          product_code: 'PROD-A001',
          product_name: 'ミネラルウォーター 500ml',
          delivery_note_no: 'DN-2025-001',
          order_no: 'ORD-2025-001',
          shipment_quantity_cases: 50,
          shipment_quantity_pieces: 1200,
          shipment_date: '2025-04-08',
          delivery_date: '2025-04-09',
          delivery_destination: '東京都港区本社',
          shipping_company: 'ヤマト運輸',
          order_source: customerName || 'A商事株式会社',
          unit_price: 120,
          total_amount: 144000,
          status: '納品完了'
        },
        {
          id: 'SH-002',
          product_code: 'PROD-A002',
          product_name: 'お茶 350ml',
          delivery_note_no: 'DN-2025-002',
          order_no: 'ORD-2025-002',
          shipment_quantity_cases: 30,
          shipment_quantity_pieces: 720,
          shipment_date: '2025-04-07',
          delivery_date: '2025-04-08',
          delivery_destination: '東京都江東区倉庫',
          shipping_company: '佐川急便',
          order_source: customerName || 'A商事株式会社',
          unit_price: 150,
          total_amount: 108000,
          status: '納品完了'
        },
        {
          id: 'SH-003',
          product_code: 'PROD-A003',
          product_name: 'スポーツドリンク 500ml',
          delivery_note_no: 'DN-2025-003',
          order_no: 'ORD-2025-003',
          shipment_quantity_cases: 40,
          shipment_quantity_pieces: 960,
          shipment_date: '2025-04-06',
          delivery_date: '2025-04-07',
          delivery_destination: '東京都港区本社',
          shipping_company: 'ヤマト運輸',
          order_source: customerName || 'A商事株式会社',
          unit_price: 180,
          total_amount: 172800,
          status: '納品完了'
        },
        {
          id: 'SH-004',
          product_code: 'PROD-A001',
          product_name: 'ミネラルウォーター 500ml',
          delivery_note_no: 'DN-2025-004',
          order_no: 'ORD-2025-004',
          shipment_quantity_cases: 25,
          shipment_quantity_pieces: 600,
          shipment_date: '2025-04-05',
          delivery_date: '2025-04-06',
          delivery_destination: '東京都江東区倉庫',
          shipping_company: '西濃運輸',
          order_source: customerName || 'A商事株式会社',
          unit_price: 120,
          total_amount: 72000,
          status: '納品完了'
        },
        {
          id: 'SH-005',
          product_code: 'PROD-A004',
          product_name: 'コーヒー 250ml',
          delivery_note_no: 'DN-2025-005',
          order_no: 'ORD-2025-005',
          shipment_quantity_cases: 20,
          shipment_quantity_pieces: 480,
          shipment_date: '2025-04-10',
          delivery_date: '2025-04-11',
          delivery_destination: '東京都港区本社',
          shipping_company: 'ヤマト運輸',
          order_source: customerName || 'A商事株式会社',
          unit_price: 200,
          total_amount: 96000,
          status: '配送中'
        }
      ];

      setShipmentHistory(mockData);
    } catch (error) {
      console.error('Failed to load shipment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '納品完了':
        return 'bg-green-100 text-green-800';
      case '配送中':
        return 'bg-blue-100 text-blue-800';
      case '出荷済み':
        return 'bg-purple-100 text-purple-800';
      case 'キャンセル':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredHistory = shipmentHistory.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.delivery_note_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.order_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.delivery_destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getTotalStats = () => {
    const totalShipments = filteredHistory.length;
    const totalAmount = filteredHistory.reduce((sum, item) => sum + item.total_amount, 0);
    const totalCases = filteredHistory.reduce((sum, item) => sum + item.shipment_quantity_cases, 0);
    const totalPieces = filteredHistory.reduce((sum, item) => sum + item.shipment_quantity_pieces, 0);
    
    return { totalShipments, totalAmount, totalCases, totalPieces };
  };

  const stats = getTotalStats();

  const handleExport = () => {
    alert('出荷履歴をCSVでエクスポートします');
  };

  const handleViewDetails = (shipmentId: string) => {
    alert(`出荷詳細 ${shipmentId} を表示します`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/production')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">出荷履歴</h1>
            <p className="mt-1 text-sm text-gray-500">データを読み込み中...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">出荷履歴を読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">出荷履歴</h1>
            <p className="mt-1 text-sm text-gray-500">
              {customerName ? `${customerName} の出荷履歴` : '全顧客の出荷履歴'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Download size={16} className="mr-2" />
            エクスポート
          </button>
        </div>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">総出荷件数</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalShipments}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">総売上金額</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">¥{stats.totalAmount.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">総出荷数（c/s）</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalCases.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">総出荷数（本）</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalPieces.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      {/* フィルター */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="出荷履歴を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">すべてのステータス</option>
            <option value="出荷済み">出荷済み</option>
            <option value="配送中">配送中</option>
            <option value="納品完了">納品完了</option>
            <option value="キャンセル">キャンセル</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="1month">過去1ヶ月</option>
            <option value="3months">過去3ヶ月</option>
            <option value="6months">過去6ヶ月</option>
            <option value="1year">過去1年</option>
          </select>

          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Filter size={16} className="mr-2" />
            詳細フィルター
          </button>
        </div>
      </Card>

      {/* 出荷履歴一覧 */}
      <Card>
        <div className="overflow-x-auto -mx-5">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  製品情報
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  伝票番号
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  出荷数量
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  出荷日・納品日
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  納品先・運送会社
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package size={16} className="text-blue-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                        <div className="text-sm text-gray-500">{item.product_code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <FileText size={12} className="mr-1 text-gray-400" />
                        納品書: {item.delivery_note_no}
                      </div>
                      <div className="flex items-center mt-1">
                        <FileText size={12} className="mr-1 text-gray-400" />
                        注文書: {item.order_no}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{item.shipment_quantity_cases} c/s</div>
                      <div className="text-gray-500">{item.shipment_quantity_pieces.toLocaleString()} 本</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1 text-gray-400" />
                        出荷: {format(new Date(item.shipment_date), 'yyyy/MM/dd', { locale: ja })}
                      </div>
                      <div className="flex items-center mt-1">
                        <Calendar size={12} className="mr-1 text-gray-400" />
                        納品: {format(new Date(item.delivery_date), 'yyyy/MM/dd', { locale: ja })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Package size={12} className="mr-1 text-gray-400" />
                        {item.delivery_destination}
                      </div>
                      <div className="flex items-center mt-1">
                        <Truck size={12} className="mr-1 text-gray-400" />
                        {item.shipping_company}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>単価: ¥{item.unit_price.toLocaleString()}</div>
                      <div className="font-medium">合計: ¥{item.total_amount.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(item.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="詳細表示"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={handleExport}
                      className="text-green-600 hover:text-green-900"
                      title="PDF出力"
                    >
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <Truck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">出荷履歴が見つかりません</h3>
            <p className="mt-1 text-sm text-gray-500">検索条件を変更してください</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ShipmentHistory;