import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import { ArrowLeft, Search, Filter, Calendar, Package, FileText, Truck, Building, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';
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
  status: '出荷済み' | '配送中' | '納品完了' | '返品';
  notes?: string;
}

interface CustomerInfo {
  customer_id: string;
  customer_code: string;
  customer_name: string;
  contact_person: string;
  phone: string;
  email: string;
}

const CustomerShipmentHistory: React.FC = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [searchParams] = useSearchParams();
  const customerName = searchParams.get('customerName') || '';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('3months');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 顧客情報
  const [customerInfo] = useState<CustomerInfo>({
    customer_id: customerId || '',
    customer_code: 'CUST-001',
    customer_name: customerName || 'A商事株式会社',
    contact_person: '田中一郎',
    phone: '03-1234-5678',
    email: 'tanaka@a-shoji.co.jp'
  });

  // サンプル出荷履歴データ
  const [shipmentHistory] = useState<ShipmentHistoryItem[]>([
    {
      id: 'SH-2025-001',
      product_code: 'PROD-A001',
      product_name: 'ミネラルウォーター 500ml',
      delivery_note_no: 'DN-2025-0410-001',
      order_no: 'ORD-2025-0408-001',
      shipment_quantity_cases: 50,
      shipment_quantity_pieces: 1200,
      shipment_date: '2025-04-10',
      delivery_date: '2025-04-11',
      delivery_destination: '東京都港区本社',
      shipping_company: 'ヤマト運輸',
      order_source: 'A商事株式会社',
      unit_price: 120,
      total_amount: 144000,
      status: '納品完了'
    },
    {
      id: 'SH-2025-002',
      product_code: 'PROD-A002',
      product_name: 'お茶 350ml',
      delivery_note_no: 'DN-2025-0409-002',
      order_no: 'ORD-2025-0407-002',
      shipment_quantity_cases: 30,
      shipment_quantity_pieces: 720,
      shipment_date: '2025-04-09',
      delivery_date: '2025-04-10',
      delivery_destination: '東京都江東区倉庫',
      shipping_company: '佐川急便',
      order_source: 'A商事株式会社',
      unit_price: 150,
      total_amount: 108000,
      status: '納品完了'
    },
    {
      id: 'SH-2025-003',
      product_code: 'PROD-A003',
      product_name: 'スポーツドリンク 500ml',
      delivery_note_no: 'DN-2025-0408-003',
      order_no: 'ORD-2025-0406-003',
      shipment_quantity_cases: 40,
      shipment_quantity_pieces: 960,
      shipment_date: '2025-04-08',
      delivery_date: '2025-04-09',
      delivery_destination: '東京都港区本社',
      shipping_company: 'ヤマト運輸',
      order_source: 'A商事株式会社',
      unit_price: 180,
      total_amount: 172800,
      status: '納品完了'
    },
    {
      id: 'SH-2025-004',
      product_code: 'PROD-A001',
      product_name: 'ミネラルウォーター 500ml',
      delivery_note_no: 'DN-2025-0407-004',
      order_no: 'ORD-2025-0405-004',
      shipment_quantity_cases: 60,
      shipment_quantity_pieces: 1440,
      shipment_date: '2025-04-07',
      delivery_date: '2025-04-08',
      delivery_destination: '東京都江東区倉庫',
      shipping_company: '佐川急便',
      order_source: 'A商事株式会社',
      unit_price: 120,
      total_amount: 172800,
      status: '納品完了'
    },
    {
      id: 'SH-2025-005',
      product_code: 'PROD-A004',
      product_name: 'コーヒー 250ml',
      delivery_note_no: 'DN-2025-0406-005',
      order_no: 'ORD-2025-0404-005',
      shipment_quantity_cases: 25,
      shipment_quantity_pieces: 600,
      shipment_date: '2025-04-06',
      delivery_date: '2025-04-07',
      delivery_destination: '東京都港区本社',
      shipping_company: 'ヤマト運輸',
      order_source: 'A商事株式会社',
      unit_price: 200,
      total_amount: 120000,
      status: '納品完了'
    },
    {
      id: 'SH-2025-006',
      product_code: 'PROD-A002',
      product_name: 'お茶 350ml',
      delivery_note_no: 'DN-2025-0405-006',
      order_no: 'ORD-2025-0403-006',
      shipment_quantity_cases: 35,
      shipment_quantity_pieces: 840,
      shipment_date: '2025-04-05',
      delivery_date: '2025-04-06',
      delivery_destination: '東京都江東区倉庫',
      shipping_company: '佐川急便',
      order_source: 'A商事株式会社',
      unit_price: 150,
      total_amount: 126000,
      status: '納品完了'
    },
    {
      id: 'SH-2025-007',
      product_code: 'PROD-A003',
      product_name: 'スポーツドリンク 500ml',
      delivery_note_no: 'DN-2025-0404-007',
      order_no: 'ORD-2025-0402-007',
      shipment_quantity_cases: 45,
      shipment_quantity_pieces: 1080,
      shipment_date: '2025-04-04',
      delivery_date: '2025-04-05',
      delivery_destination: '東京都港区本社',
      shipping_company: 'ヤマト運輸',
      order_source: 'A商事株式会社',
      unit_price: 180,
      total_amount: 194400,
      status: '納品完了'
    },
    {
      id: 'SH-2025-008',
      product_code: 'PROD-A001',
      product_name: 'ミネラルウォーター 500ml',
      delivery_note_no: 'DN-2025-0403-008',
      order_no: 'ORD-2025-0401-008',
      shipment_quantity_cases: 55,
      shipment_quantity_pieces: 1320,
      shipment_date: '2025-04-03',
      delivery_date: '2025-04-04',
      delivery_destination: '東京都江東区倉庫',
      shipping_company: '佐川急便',
      order_source: 'A商事株式会社',
      unit_price: 120,
      total_amount: 158400,
      status: '納品完了'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '納品完了':
        return 'bg-green-100 text-green-800';
      case '配送中':
        return 'bg-blue-100 text-blue-800';
      case '出荷済み':
        return 'bg-purple-100 text-purple-800';
      case '返品':
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

  // ページネーション
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  // 統計情報
  const getTotalStats = () => {
    const totalShipments = filteredHistory.length;
    const totalAmount = filteredHistory.reduce((sum, item) => sum + item.total_amount, 0);
    const totalCases = filteredHistory.reduce((sum, item) => sum + item.shipment_quantity_cases, 0);
    const totalPieces = filteredHistory.reduce((sum, item) => sum + item.shipment_quantity_pieces, 0);
    
    return { totalShipments, totalAmount, totalCases, totalPieces };
  };

  const stats = getTotalStats();

  const handleViewDetails = (shipmentId: string) => {
    // 詳細表示の処理（今後実装）
    alert(`出荷詳細 ${shipmentId} を表示します`);
  };

  const handleDownload = (shipmentId: string) => {
    // ダウンロード処理（今後実装）
    alert(`${shipmentId} の納品書をダウンロードします`);
  };

  const handleExportAll = () => {
    // 全データエクスポート処理（今後実装）
    alert('出荷履歴をCSVでエクスポートします');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">顧客別出荷履歴</h1>
            <p className="mt-1 text-sm text-gray-500">{customerInfo.customer_name} の出荷履歴と詳細情報</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleExportAll}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Download size={16} className="mr-2" />
            エクスポート
          </button>
        </div>
      </div>

      {/* 顧客情報 */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building size={24} className="text-blue-500 mr-4" />
            <div>
              <h2 className="text-lg font-medium text-gray-900">{customerInfo.customer_name}</h2>
              <div className="mt-1 text-sm text-gray-500 space-y-1">
                <div>顧客コード: {customerInfo.customer_code}</div>
                <div>担当者: {customerInfo.contact_person}</div>
                <div>電話: {customerInfo.phone} | メール: {customerInfo.email}</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">総出荷回数</div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalShipments}回</div>
          </div>
        </div>
      </Card>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">総出荷金額</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">¥{stats.totalAmount.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">総出荷数（c/s）</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalCases.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">総出荷数（本）</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalPieces.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">平均単価</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">¥{Math.round(stats.totalAmount / stats.totalPieces).toLocaleString()}</p>
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
            <option value="返品">返品</option>
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

          <div className="flex items-center text-sm text-gray-500">
            {filteredHistory.length}件の履歴
          </div>
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
              {paginatedHistory.map((item) => (
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
                        <Building size={12} className="mr-1 text-gray-400" />
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
                      <div className="font-medium">¥{item.total_amount.toLocaleString()}</div>
                      <div className="text-gray-500">@¥{item.unit_price}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(item.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="詳細表示"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownload(item.id)}
                        className="text-green-600 hover:text-green-900"
                        title="納品書ダウンロード"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                前へ
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                次へ
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{startIndex + 1}</span> - <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredHistory.length)}</span> / <span className="font-medium">{filteredHistory.length}</span> 件
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">出荷履歴が見つかりません</h3>
            <p className="mt-1 text-sm text-gray-500">検索条件を変更してください</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomerShipmentHistory;