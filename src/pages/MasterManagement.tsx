import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Search, Filter, Plus, Edit, Trash2, Building, Package, Users, Phone, Mail, MapPin, Calendar, Tag, Layers, UserPlus, Truck } from 'lucide-react';

interface Customer {
  id: string;
  code: string;
  name: string;
  type: '法人' | '個人';
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
  status: 'アクティブ' | '非アクティブ';
}

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  standard_price: number;
  description: string;
  created_at: string;
  status: 'アクティブ' | '廃止';
}

interface Material {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  standard_cost: number;
  supplier: string;
  lead_time: number;
  created_at: string;
  status: 'アクティブ' | '廃止';
}

interface Supplier {
  id: string;
  code: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  payment_terms: string;
  materials: string[];
  created_at: string;
  status: 'アクティブ' | '非アクティブ';
}

const MasterManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'customers' | 'products' | 'materials' | 'suppliers' | 'product-customer'>('customers');
  const [searchTerm, setSearchTerm] = useState('');

  // サンプルデータ
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      code: 'CUST-001',
      name: 'A商事株式会社',
      type: '法人',
      contact_person: '田中一郎',
      phone: '03-1234-5678',
      email: 'tanaka@a-shoji.co.jp',
      address: '東京都港区赤坂1-1-1',
      created_at: '2024-01-15',
      status: 'アクティブ'
    },
    {
      id: '2',
      code: 'CUST-002',
      name: 'B流通株式会社',
      type: '法人',
      contact_person: '佐藤花子',
      phone: '06-2345-6789',
      email: 'sato@b-ryutsu.co.jp',
      address: '大阪府大阪市中央区本町2-2-2',
      created_at: '2024-02-20',
      status: 'アクティブ'
    },
    {
      id: '3',
      code: 'CUST-003',
      name: 'Cマート',
      type: '法人',
      contact_person: '鈴木次郎',
      phone: '052-3456-7890',
      email: 'suzuki@c-mart.co.jp',
      address: '愛知県名古屋市中区栄3-3-3',
      created_at: '2024-03-10',
      status: 'アクティブ'
    },
    {
      id: '4',
      code: 'CUST-004',
      name: 'D食品株式会社',
      type: '法人',
      contact_person: '高橋三郎',
      phone: '092-4567-8901',
      email: 'takahashi@d-foods.co.jp',
      address: '福岡県福岡市博多区博多駅前4-4-4',
      created_at: '2024-01-25',
      status: 'アクティブ'
    },
    {
      id: '5',
      code: 'CUST-005',
      name: 'E商店',
      type: '個人',
      contact_person: '山田太郎',
      phone: '011-5678-9012',
      email: 'yamada@e-shop.com',
      address: '北海道札幌市中央区大通5-5-5',
      created_at: '2024-02-05',
      status: '非アクティブ'
    }
  ]);

  const [products] = useState<Product[]>([
    {
      id: '1',
      code: 'PROD-A001',
      name: 'ミネラルウォーター 500ml',
      category: '飲料',
      unit: '本',
      standard_price: 120,
      description: '天然水を使用したミネラルウォーター',
      created_at: '2024-01-10',
      status: 'アクティブ'
    },
    {
      id: '2',
      code: 'PROD-A002',
      name: 'お茶 350ml',
      category: '飲料',
      unit: '本',
      standard_price: 150,
      description: '国産茶葉を使用した緑茶',
      created_at: '2024-01-15',
      status: 'アクティブ'
    },
    {
      id: '3',
      code: 'PROD-A003',
      name: 'スポーツドリンク 500ml',
      category: '飲料',
      unit: '本',
      standard_price: 180,
      description: 'イオン補給に最適なスポーツドリンク',
      created_at: '2024-01-20',
      status: 'アクティブ'
    },
    {
      id: '4',
      code: 'PROD-A004',
      name: 'コーヒー 250ml',
      category: '飲料',
      unit: '本',
      standard_price: 200,
      description: 'アラビカ豆100%使用のブラックコーヒー',
      created_at: '2024-02-01',
      status: 'アクティブ'
    },
    {
      id: '5',
      code: 'PROD-A005',
      name: 'フルーツジュース 1L',
      category: '飲料',
      unit: '本',
      standard_price: 350,
      description: '100%果汁のミックスフルーツジュース',
      created_at: '2024-02-10',
      status: '廃止'
    }
  ]);

  const [materials] = useState<Material[]>([
    {
      id: '1',
      code: 'MAT-R001',
      name: '原材料A',
      category: '原材料',
      unit: 'kg',
      standard_cost: 150,
      supplier: 'サプライヤーX',
      lead_time: 7,
      created_at: '2024-01-05',
      status: 'アクティブ'
    },
    {
      id: '2',
      code: 'MAT-P001',
      name: '部品B',
      category: '部品',
      unit: '個',
      standard_cost: 2500,
      supplier: 'サプライヤーX',
      lead_time: 14,
      created_at: '2024-01-08',
      status: 'アクティブ'
    },
    {
      id: '3',
      code: 'MAT-T001',
      name: '工具C',
      category: '工具',
      unit: 'セット',
      standard_cost: 8000,
      supplier: 'サプライヤーY',
      lead_time: 21,
      created_at: '2024-01-12',
      status: 'アクティブ'
    },
    {
      id: '4',
      code: 'MAT-R002',
      name: '材料D',
      category: '原材料',
      unit: 'kg',
      standard_cost: 200,
      supplier: 'サプライヤーZ',
      lead_time: 10,
      created_at: '2024-01-18',
      status: 'アクティブ'
    },
    {
      id: '5',
      code: 'MAT-P002',
      name: '部品E',
      category: '部品',
      unit: '個',
      standard_cost: 1200,
      supplier: 'サプライヤーX',
      lead_time: 7,
      created_at: '2024-01-25',
      status: 'アクティブ'
    },
    {
      id: '6',
      code: 'MAT-PT001',
      name: 'パーツF',
      category: 'パーツ',
      unit: '個',
      standard_cost: 3500,
      supplier: 'サプライヤーY',
      lead_time: 28,
      created_at: '2024-02-02',
      status: 'アクティブ'
    },
    {
      id: '7',
      code: 'MAT-R003',
      name: '材料G',
      category: '原材料',
      unit: 'リットル',
      standard_cost: 800,
      supplier: 'サプライヤーZ',
      lead_time: 14,
      created_at: '2024-02-08',
      status: '廃止'
    }
  ]);

  const [suppliers] = useState<Supplier[]>([
    {
      id: '1',
      code: 'SUP-001',
      name: 'サプライヤーX株式会社',
      contact_person: '営業部 鈴木',
      phone: '03-1111-2222',
      email: 'suzuki@supplier-x.co.jp',
      address: '東京都千代田区丸の内1-1-1',
      payment_terms: '月末締め翌月末払い',
      materials: ['原材料A', '部品B', '部品E'],
      created_at: '2024-01-10',
      status: 'アクティブ'
    },
    {
      id: '2',
      code: 'SUP-002',
      name: 'サプライヤーY有限会社',
      contact_person: '購買部 田中',
      phone: '06-3333-4444',
      email: 'tanaka@supplier-y.co.jp',
      address: '大阪府大阪市北区梅田2-2-2',
      payment_terms: '20日締め翌月10日払い',
      materials: ['工具C', 'パーツF'],
      created_at: '2024-01-15',
      status: 'アクティブ'
    },
    {
      id: '3',
      code: 'SUP-003',
      name: 'サプライヤーZ商事',
      contact_person: '代表 佐藤',
      phone: '052-5555-6666',
      email: 'sato@supplier-z.co.jp',
      address: '愛知県名古屋市中区栄3-3-3',
      payment_terms: '15日締め当月末払い',
      materials: ['材料D', '材料G'],
      created_at: '2024-02-01',
      status: 'アクティブ'
    },
    {
      id: '4',
      code: 'SUP-004',
      name: '九州サプライ株式会社',
      contact_person: '営業課 山田',
      phone: '092-7777-8888',
      email: 'yamada@kyushu-supply.co.jp',
      address: '福岡県福岡市博多区博多駅前4-4-4',
      payment_terms: '月末締め翌々月10日払い',
      materials: ['原材料A', '材料D'],
      created_at: '2024-02-10',
      status: 'アクティブ'
    },
    {
      id: '5',
      code: 'SUP-005',
      name: '北海道マテリアル',
      contact_person: '部長 高橋',
      phone: '011-9999-0000',
      email: 'takahashi@hokkaido-material.co.jp',
      address: '北海道札幌市中央区大通5-5-5',
      payment_terms: '月末締め翌月20日払い',
      materials: ['工具C', '部品E', 'パーツF'],
      created_at: '2024-03-01',
      status: '非アクティブ'
    }
  ]);

  // 製品顧客紐付データ
  const [productCustomerMappings] = useState([
    {
      product_id: '1',
      product_code: 'PROD-A001',
      product_name: 'ミネラルウォーター 500ml',
      category: '飲料',
      unit: '本',
      customers: [
        {
          customer_id: '1',
          customer_code: 'CUST-001',
          customer_name: 'A商事株式会社',
          unit_price: 120,
          discount_rate: 0,
          min_order_quantity: 100,
          delivery_destinations: [
            { name: '東京都港区本社', unit_price: 120 },
            { name: '東京都江東区倉庫', unit_price: 115 }
          ]
        },
        {
          customer_id: '2',
          customer_code: 'CUST-002',
          customer_name: 'B流通株式会社',
          unit_price: 110,
          discount_rate: 5,
          min_order_quantity: 500,
          delivery_destinations: [
            { name: '大阪府大阪市本店', unit_price: 110 }
          ]
        }
      ]
    },
    {
      product_id: '2',
      product_code: 'PROD-A002',
      product_name: 'お茶 350ml',
      category: '飲料',
      unit: '本',
      customers: [
        {
          customer_id: '2',
          customer_code: 'CUST-002',
          customer_name: 'B流通株式会社',
          unit_price: 150,
          discount_rate: 0,
          min_order_quantity: 200,
          delivery_destinations: [
            { name: '大阪府大阪市本店', unit_price: 150 },
            { name: '大阪府堺市支店', unit_price: 145 }
          ]
        },
        {
          customer_id: '3',
          customer_code: 'CUST-003',
          customer_name: 'Cマート',
          unit_price: 140,
          discount_rate: 10,
          min_order_quantity: 1000,
          delivery_destinations: [
            { name: '愛知県名古屋市店舗', unit_price: 140 }
          ]
        }
      ]
    },
    {
      product_id: '3',
      product_code: 'PROD-A003',
      product_name: 'スポーツドリンク 500ml',
      category: '飲料',
      unit: '本',
      customers: [
        {
          customer_id: '1',
          customer_code: 'CUST-001',
          customer_name: 'A商事株式会社',
          unit_price: 180,
          discount_rate: 0,
          min_order_quantity: 50,
          delivery_destinations: [
            { name: '東京都港区本社', unit_price: 180 }
          ]
        },
        {
          customer_id: '3',
          customer_code: 'CUST-003',
          customer_name: 'Cマート',
          unit_price: 170,
          discount_rate: 5,
          min_order_quantity: 300,
          delivery_destinations: [
            { name: '愛知県名古屋市店舗', unit_price: 170 }
          ]
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'アクティブ':
        return 'bg-green-100 text-green-800';
      case '非アクティブ':
      case '廃止':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '法人':
        return 'bg-blue-100 text-blue-800';
      case '個人':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    navigate('/master-management/customer/add');
  };

  const getAddButtonText = () => {
    switch (activeTab) {
      case 'customers':
        return '顧客追加';
      case 'products':
        return '製品追加';
      case 'materials':
        return '資材追加';
      case 'suppliers':
        return 'サプライヤー追加';
      case 'product-customer':
        return '紐付追加';
      default:
        return '新規追加';
    }
  };

  const getAddButtonIcon = () => {
    switch (activeTab) {
      case 'customers':
        return <UserPlus size={16} className="mr-2" />;
      case 'products':
        return <Package size={16} className="mr-2" />;
      case 'materials':
        return <Layers size={16} className="mr-2" />;
      case 'suppliers':
        return <Truck size={16} className="mr-2" />;
      case 'product-customer':
        return <Plus size={16} className="mr-2" />;
      default:
        return <Plus size={16} className="mr-2" />;
    }
  };

  const handleAddClick = () => {
    switch (activeTab) {
      case 'customers':
        handleAddCustomer();
        break;
      case 'products':
        // 製品追加の処理（今後実装）
        alert('製品追加機能は今後実装予定です');
        break;
      case 'materials':
        // 資材追加の処理（今後実装）
        alert('資材追加機能は今後実装予定です');
        break;
      case 'suppliers':
        // サプライヤー追加の処理（今後実装）
        alert('サプライヤー追加機能は今後実装予定です');
        break;
      case 'product-customer':
        navigate('/master-management/product-customer/add');
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">マスタ管理</h1>
          <p className="mt-1 text-sm text-gray-500">顧客、製品、資材の基本情報を管理</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {getAddButtonIcon()}
          {getAddButtonText()}
        </button>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('customers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'customers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users size={16} className="inline mr-1" />
            顧客
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'products'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package size={16} className="inline mr-1" />
            製品
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'materials'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Layers size={16} className="inline mr-1" />
            資材
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'suppliers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Truck size={16} className="inline mr-1" />
            サプライヤー
          </button>
          <button
            onClick={() => setActiveTab('product-customer')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'product-customer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Tag size={16} className="inline mr-1" />
            製品顧客紐付
          </button>
        </nav>
      </div>

      {/* 検索・フィルター */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`${
                activeTab === 'customers' ? '顧客' : 
                activeTab === 'products' ? '製品' : 
                activeTab === 'materials' ? '資材' :
                activeTab === 'suppliers' ? 'サプライヤー' :
                activeTab === 'product-customer' ? '製品・顧客' : ''
              }を検索...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Filter size={16} className="mr-2" />
              フィルター
            </button>
          </div>
        </div>
      </Card>

      {/* 顧客一覧 */}
      {activeTab === 'customers' && (
        <Card>
          <div className="overflow-x-auto -mx-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    顧客コード
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    顧客名
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    種別
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    担当者
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    連絡先
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
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building size={16} className="text-blue-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin size={12} className="mr-1" />
                            {customer.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(customer.type)}`}>
                        {customer.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.contact_person}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Phone size={12} className="mr-1" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail size={12} className="mr-1" />
                          {customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 製品一覧 */}
      {activeTab === 'products' && (
        <Card>
          <div className="overflow-x-auto -mx-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    製品コード
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    製品名
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    カテゴリー
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    単位
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    標準価格
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package size={16} className="text-green-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ¥{product.standard_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 資材一覧 */}
      {activeTab === 'materials' && (
        <Card>
          <div className="overflow-x-auto -mx-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    資材コード
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    資材名
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    カテゴリー
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    単位
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    標準原価
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    サプライヤー
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    リードタイム
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
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {material.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Layers size={16} className="text-orange-500 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{material.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {material.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ¥{material.standard_cost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {material.lead_time}日
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(material.status)}`}>
                        {material.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* サプライヤー一覧 */}
      {activeTab === 'suppliers' && (
        <Card>
          <div className="overflow-x-auto -mx-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    サプライヤーコード
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    サプライヤー名
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    担当者
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    連絡先
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    扱っている資材
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    支払条件
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
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {supplier.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Truck size={16} className="text-orange-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin size={12} className="mr-1" />
                            {supplier.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplier.contact_person}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Phone size={12} className="mr-1" />
                          {supplier.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail size={12} className="mr-1" />
                          {supplier.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {supplier.materials.map((material, index) => (
                          <span key={index} className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {material}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplier.payment_terms}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(supplier.status)}`}>
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 製品顧客紐付一覧 */}
      {activeTab === 'product-customer' && (
        <div className="space-y-6">
          {productCustomerMappings.map((mapping) => (
            <Card key={mapping.product_id}>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package size={20} className="text-blue-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{mapping.product_name}</h3>
                      <p className="text-sm text-gray-500">{mapping.product_code} • {mapping.category} • {mapping.unit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">紐付顧客数: {mapping.customers.length}社</div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        顧客情報
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        単価
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        出荷先
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mapping.customers.map((customer, customerIndex) => (
                      <tr key={`${mapping.product_id}-${customer.customer_id}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building size={16} className="text-green-500 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{customer.customer_name}</div>
                              <div className="text-sm text-gray-500">{customer.customer_code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ¥{customer.unit_price.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {customer.delivery_destinations.map((dest, destIndex) => (
                              <div key={destIndex} className="text-xs">
                                <span className="text-gray-600">{dest.name}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {mapping.customers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">紐付された顧客がありません</h3>
                  <p className="mt-1 text-sm text-gray-500">この製品に顧客を紐付けてください</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MasterManagement;