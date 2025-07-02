import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Plus, Search, Filter, FileText, Calendar, User, Eye, Edit, Download, Printer, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ManufacturingInstruction {
  id: string;
  instructionNumber: string;
  productName: string;
  manufacturingLot: string;
  salesDestination: string;
  plannedQuantity: number;
  status: '作成中' | '承認待ち' | '承認済み' | '製造中' | '完了' | 'キャンセル';
  priority: '高' | '中' | '低';
  createdDate: string;
  issueDate: string;
  manufacturingDate: string;
  createdBy: string;
  approvedBy?: string;
  version: string;
}

const ManufacturingInstructionList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // サンプルデータ
  const [instructions] = useState<ManufacturingInstruction[]>([
    {
      id: '1',
      instructionNumber: 'MI-20250410-001',
      productName: 'ミネラルウォーター 500ml',
      manufacturingLot: 'LOT-2025041001',
      salesDestination: 'A商事株式会社',
      plannedQuantity: 10000,
      status: '製造中',
      priority: '高',
      createdDate: '2025-04-10',
      issueDate: '2025-04-10',
      manufacturingDate: '2025-04-11',
      createdBy: '山田太郎',
      approvedBy: '田中部長',
      version: '1.0'
    },
    {
      id: '2',
      instructionNumber: 'MI-20250409-002',
      productName: 'お茶 350ml',
      manufacturingLot: 'LOT-2025040902',
      salesDestination: 'B流通株式会社',
      plannedQuantity: 8000,
      status: '承認済み',
      priority: '中',
      createdDate: '2025-04-09',
      issueDate: '2025-04-09',
      manufacturingDate: '2025-04-12',
      createdBy: '佐藤花子',
      approvedBy: '田中部長',
      version: '1.1'
    },
    {
      id: '3',
      instructionNumber: 'MI-20250408-003',
      productName: 'スポーツドリンク 500ml',
      manufacturingLot: 'LOT-2025040803',
      salesDestination: 'Cマート',
      plannedQuantity: 15000,
      status: '完了',
      priority: '中',
      createdDate: '2025-04-08',
      issueDate: '2025-04-08',
      manufacturingDate: '2025-04-09',
      createdBy: '鈴木一郎',
      approvedBy: '田中部長',
      version: '1.0'
    },
    {
      id: '4',
      instructionNumber: 'MI-20250407-004',
      productName: 'コーヒー 250ml',
      manufacturingLot: 'LOT-2025040704',
      salesDestination: 'D食品株式会社',
      plannedQuantity: 5000,
      status: '承認待ち',
      priority: '低',
      createdDate: '2025-04-07',
      issueDate: '2025-04-07',
      manufacturingDate: '2025-04-13',
      createdBy: '高橋次郎',
      version: '1.0'
    },
    {
      id: '5',
      instructionNumber: 'MI-20250406-005',
      productName: 'フルーツジュース 1L',
      manufacturingLot: 'LOT-2025040605',
      salesDestination: 'E商店',
      plannedQuantity: 3000,
      status: '作成中',
      priority: '高',
      createdDate: '2025-04-06',
      issueDate: '',
      manufacturingDate: '2025-04-14',
      createdBy: '中村三郎',
      version: '0.9'
    }
  ]);

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
      case '作成中':
        return 'bg-gray-100 text-gray-800';
      case 'キャンセル':
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
      case '製造中':
        return <Clock size={16} className="text-blue-600" />;
      case '承認済み':
        return <CheckCircle size={16} className="text-purple-600" />;
      case '承認待ち':
        return <Clock size={16} className="text-amber-600" />;
      case '作成中':
        return <Edit size={16} className="text-gray-600" />;
      case 'キャンセル':
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  const filteredInstructions = instructions.filter(instruction => {
    const matchesSearch = instruction.instructionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instruction.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instruction.manufacturingLot.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instruction.salesDestination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || instruction.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || instruction.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusCounts = () => {
    return {
      total: instructions.length,
      inProgress: instructions.filter(i => i.status === '製造中').length,
      pending: instructions.filter(i => i.status === '承認待ち').length,
      completed: instructions.filter(i => i.status === '完了').length,
      draft: instructions.filter(i => i.status === '作成中').length,
    };
  };

  const statusCounts = getStatusCounts();

  const handleView = (id: string) => {
    navigate(`/manufacturing-instructions/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/manufacturing-instructions/${id}/edit`);
  };

  const handleCreate = () => {
    navigate('/manufacturing-instructions/new');
  };

  const handleDownload = (instruction: ManufacturingInstruction) => {
    alert(`${instruction.instructionNumber} をPDFでダウンロードします。`);
  };

  const handlePrint = (instruction: ManufacturingInstruction) => {
    alert(`${instruction.instructionNumber} を印刷します。`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">製造指示書一覧</h1>
          <p className="mt-1 text-sm text-gray-500">製造指示書の管理と作成</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus size={16} className="mr-2" />
          新規作成
        </button>
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
              placeholder="製造指示書を検索..."
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
            <option value="作成中">作成中</option>
            <option value="承認待ち">承認待ち</option>
            <option value="承認済み">承認済み</option>
            <option value="製造中">製造中</option>
            <option value="完了">完了</option>
            <option value="キャンセル">キャンセル</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">すべての優先度</option>
            <option value="高">高</option>
            <option value="中">中</option>
            <option value="低">低</option>
          </select>
        </div>
      </Card>

      {/* 製造指示書一覧 */}
      <Card>
        <div className="overflow-x-auto -mx-5">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  指示書番号
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  製品名
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  製造LOT
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  販売先
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  予定数量
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  製造予定日
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
              {filteredInstructions.map((instruction) => (
                <tr key={instruction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText size={16} className="text-blue-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{instruction.instructionNumber}</div>
                        <div className="text-sm text-gray-500">Ver.{instruction.version}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{instruction.productName}</div>
                    <div className="text-sm text-gray-500">{instruction.plannedQuantity.toLocaleString()}個</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {instruction.manufacturingLot}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {instruction.salesDestination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {instruction.plannedQuantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {instruction.manufacturingDate ? format(new Date(instruction.manufacturingDate), 'yyyy/MM/dd', { locale: ja }) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(instruction.status)}
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(instruction.status)}`}>
                        {instruction.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleView(instruction.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="詳細表示"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(instruction.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title="編集"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDownload(instruction)}
                        className="text-green-600 hover:text-green-900"
                        title="PDF出力"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handlePrint(instruction)}
                        className="text-purple-600 hover:text-purple-900"
                        title="印刷"
                      >
                        <Printer size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInstructions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">製造指示書が見つかりません</h3>
            <p className="mt-1 text-sm text-gray-500">検索条件を変更するか、新しい製造指示書を作成してください。</p>
            <div className="mt-6">
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={16} className="mr-2" />
                新規作成
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* 最近の活動 */}
      <Card>
        <h2 className="text-lg font-medium text-gray-900 mb-4">最近の活動</h2>
        <div className="space-y-3">
          <div className="flex items-start p-3 bg-blue-50 rounded-lg">
            <CheckCircle className="text-blue-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">MI-20250410-001 が製造開始されました</p>
              <p className="text-xs text-gray-500 mt-1">2時間前 • 山田太郎</p>
            </div>
          </div>
          <div className="flex items-start p-3 bg-green-50 rounded-lg">
            <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">MI-20250409-002 が承認されました</p>
              <p className="text-xs text-gray-500 mt-1">4時間前 • 田中部長</p>
            </div>
          </div>
          <div className="flex items-start p-3 bg-amber-50 rounded-lg">
            <Clock className="text-amber-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">MI-20250407-004 が承認待ちです</p>
              <p className="text-xs text-gray-500 mt-1">1日前 • 高橋次郎</p>
            </div>
          </div>
          <div className="flex items-start p-3 bg-gray-50 rounded-lg">
            <Edit className="text-gray-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">MI-20250406-005 が作成されました</p>
              <p className="text-xs text-gray-500 mt-1">2日前 • 中村三郎</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ManufacturingInstructionList;