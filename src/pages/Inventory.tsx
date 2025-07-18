import React, { useState } from 'react';
import { Search, Filter, Plus, ArrowUpDown, AlertTriangle, Calendar, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Edit, ShoppingCart, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { useInventory } from '../hooks/useInventory';
import { useInventoryHistory } from '../hooks/useInventoryHistory';
import { format, subDays, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const { items, loading, error } = useInventory();
  const { historyData, loading: historyLoading } = useInventoryHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState<'daily'>('daily');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case '適正':
        return 'bg-green-100 text-green-800';
      case '在庫少':
        return 'bg-amber-100 text-amber-800';
      case '在庫切れ':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'quantity') {
      comparison = a.quantity - b.quantity;
    } else if (sortField === 'item_id') {
      comparison = a.item_id.localeCompare(b.item_id);
    } else if (sortField === 'category') {
      comparison = a.category.localeCompare(b.category);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // 日別表示用の日付を生成（現在の週）
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 月曜日開始
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return format(date, 'yyyy-MM-dd');
  });

  // 拡張されたアイテムデータ（最小lot、メモ、納期を含む）
  const extendedItemsData = [
    {
      item_id: 'A1001',
      item_name: '原材料A',
      category: '原材料',
      unit: 'kg',
      min_lot: 100,
      memo: '主要原材料',
      delivery_date: '2025-04-15'
    },
    {
      item_id: 'A2344',
      item_name: '部品B',
      category: '部品',
      unit: '個',
      min_lot: 50,
      memo: '重要部品',
      delivery_date: '2025-04-12'
    },
    {
      item_id: 'A3422',
      item_name: '工具C',
      category: '工具',
      unit: 'セット',
      min_lot: 5,
      memo: '生産工具',
      delivery_date: '2025-04-20'
    },
    {
      item_id: 'B1422',
      item_name: '材料D',
      category: '原材料',
      unit: 'kg',
      min_lot: 200,
      memo: '補助材料',
      delivery_date: '2025-04-18'
    },
    {
      item_id: 'B2344',
      item_name: '部品E',
      category: '部品',
      unit: '個',
      min_lot: 25,
      memo: '汎用部品',
      delivery_date: '2025-04-14'
    },
    {
      item_id: 'C1001',
      item_name: 'パーツF',
      category: 'パーツ',
      unit: '個',
      min_lot: 10,
      memo: '特殊パーツ',
      delivery_date: '2025-04-22'
    },
    {
      item_id: 'C3422',
      item_name: '材料G',
      category: '原材料',
      unit: 'リットル',
      min_lot: 50,
      memo: '液体材料',
      delivery_date: '2025-04-16'
    }
  ];

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentWeek(subDays(currentWeek, 7));
    } else {
      setCurrentWeek(addDays(currentWeek, 7));
    }
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const handleOrder = (itemId: string) => {
    // 発注ページに遷移（クエリパラメータで資材IDを渡す）
    navigate(`/inventory/order?materialId=${itemId}`);
  };

  if (loading || historyLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">資材在庫管理</h1>
            <p className="mt-1 text-sm text-gray-500">資材在庫レベルの追跡と管理</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">データを読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">資材在庫管理</h1>
            <p className="mt-1 text-sm text-gray-500">資材在庫レベルの追跡と管理</p>
          </div>
        </div>
        <Card>
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">エラーが発生しました</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                再読み込み
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">資材在庫管理</h1>
          <p className="mt-1 text-sm text-gray-500">資材在庫レベルの追跡と管理</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate('/inventory/order/history')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <History size={16} className="mr-2" />
            発注履歴
          </button>
          {activeTab === 'daily' && (
            <button 
              onClick={() => navigate('/inventory/daily/edit')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Edit size={16} className="mr-2" />
              日別編集
            </button>
          )}
          <button 
            onClick={() => navigate('/inventory/add')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-2" />
            資材追加
          </button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('daily')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'daily'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar size={16} className="inline mr-1" />
            日別在庫推移
          </button>
        </nav>
      </div>

      {activeTab === 'daily' && (
        <>
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

          <Card>
            <div className="overflow-x-auto -mx-5">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-48">
                        資材
                      </th>
                      <th className="sticky left-48 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-20">
                        最小lot
                      </th>
                      <th className="sticky left-68 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-32">
                        メモ
                      </th>
                      <th className="sticky left-100 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-24">
                        納期
                      </th>
                      {dates.map((date) => (
                        <th key={date} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                          <div className="flex flex-col">
                            <span>{format(new Date(date), 'M/d', { locale: ja })}</span>
                            <span className="text-xs text-gray-400">{format(new Date(date), 'EEE', { locale: ja })}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {extendedItemsData.map((item) => (
                      <tr key={item.item_id} className="hover:bg-gray-50">
                        <td className="sticky left-0 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                          <div>
                            <div className="font-medium">{item.item_name}</div>
                            <div className="text-xs text-gray-500">{item.item_id}</div>
                          </div>
                        </td>
                        <td className="sticky left-48 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                          {item.min_lot}
                        </td>
                        <td className="sticky left-68 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                          {item.memo}
                        </td>
                        <td className="sticky left-100 z-10 bg-white px-4 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                          {format(new Date(item.delivery_date), 'M/d', { locale: ja })}
                        </td>
                        {dates.map((date) => {
                          const dayData = historyData.find(h => h.date === date && h.item_id === item.item_id);
                          const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                          const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                          
                          return (
                            <td key={`${item.item_id}-${date}`} className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 ${
                              isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50' : ''
                            }`}>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">在庫:</span>
                                  <span className="font-medium">{dayData?.current_stock || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-green-600">入庫:</span>
                                  <span className="text-green-600 flex items-center">
                                    {dayData?.inbound || 0}
                                    {(dayData?.inbound || 0) > 0 && <TrendingUp size={12} className="ml-1" />}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-red-600">使用:</span>
                                  <span className="text-red-600 flex items-center">
                                    {dayData?.usage || 0}
                                    {(dayData?.usage || 0) > 0 && <TrendingDown size={12} className="ml-1" />}
                                  </span>
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Inventory;