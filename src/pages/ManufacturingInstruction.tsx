import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { ArrowLeft, FileText, Calendar, Package, User, Building, Save, Download, Printer, Plus, Trash2, Camera, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Material {
  type: '原材料' | 'プリフォーム' | 'キャップ' | 'ラベル' | 'カートン' | 'パレット／天面';
  manufacturer: string;
  partNumber: string;
  usageLot: string;
}

interface CheckItem {
  name: string;
  status: 'OK' | 'NG' | '';
  remarks: string;
}

interface DocumentCheck {
  name: string;
  checked: boolean;
}

const ManufacturingInstruction: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ヘッダー情報
  const [headerData, setHeaderData] = useState({
    createdDate: format(new Date(), 'yyyy-MM-dd'),
    updatedDate: format(new Date(), 'yyyy-MM-dd'),
    version: '1.0',
    instructionNumber: `MI-${format(new Date(), 'yyyyMMdd')}-001`,
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    qualityManagerApproval: '',
    generalManagerApproval: '',
    manufacturingManagerApproval: '',
    issuerApproval: '',
  });

  // 製造指示情報
  const [instructionData, setInstructionData] = useState({
    manufacturingDate1: '',
    manufacturingDate2: '',
    productName: '',
    manufacturingLot: '',
    salesDestination: '',
    expirationDate: '',
    bottlePrint1: '',
    bottlePrint2: '',
    cartonPrint1: '',
    cartonPrint2: '',
    plannedQuantity1: 0,
    plannedQuantity2: 0,
    csConversion1: 0,
    csConversion2: 0,
    palletConversion1: 0,
    palletConversion2: 0,
    usedPallet1: '',
    usedPallet2: '',
  });

  // 資材情報
  const [materials, setMaterials] = useState<Material[]>([
    { type: 'プリフォーム', manufacturer: '', partNumber: '', usageLot: '' },
    { type: 'キャップ', manufacturer: '', partNumber: '', usageLot: '' },
    { type: 'ラベル', manufacturer: '', partNumber: '', usageLot: '' },
    { type: 'カートン', manufacturer: '', partNumber: '', usageLot: '' },
    { type: 'パレット／天面', manufacturer: '', partNumber: '', usageLot: '' },
  ]);

  // 商品画像
  const [productImage, setProductImage] = useState<string>('');

  // 製造記録
  const [manufacturingRecord, setManufacturingRecord] = useState({
    cipStartTime: '',
    manufacturingStartTime: '',
    manufacturingEndTime: '',
    operatingTime: 0,
    pallet4Stage: 0,
    palletRemainder: 0,
    cs4Stage: 0,
    csRemainder: 0,
    manufacturingCount: 0,
    storageLocation: '',
  });

  // チェック項目
  const [checkItems, setCheckItems] = useState<CheckItem[]>([
    { name: 'セラミックフィルター差圧', status: '', remarks: '' },
    { name: 'リンサー水判定', status: '', remarks: '' },
    { name: 'UV判定', status: '', remarks: '' },
  ]);

  // 帳票確認
  const [documentChecks, setDocumentChecks] = useState<DocumentCheck[]>([
    { name: '水処理作業チェック記録', checked: false },
    { name: 'ブロー作業チェック記録', checked: false },
    { name: '充填作業チェック記録', checked: false },
    { name: 'キャップ投入記録', checked: false },
    { name: 'プリフォーム投入記録', checked: false },
    { name: 'キャップ検査器点検記録', checked: false },
    { name: 'プリフォーム検査機点検記録', checked: false },
    { name: 'ボトル検査機点検記録', checked: false },
    { name: 'ラベラー・金属探知機作業チェック記録', checked: false },
    { name: 'ダンボール印字チェック記録', checked: false },
    { name: 'ケーサー作業チェック記録', checked: false },
    { name: '段ボール投入記録', checked: false },
    { name: 'ケーサー停止記録', checked: false },
    { name: '格納記録', checked: false },
    { name: '製品検査記録A（微生物）', checked: false },
    { name: '製品検査記録B（容器包装）', checked: false },
  ]);

  const [finalCheck, setFinalCheck] = useState({
    itemChange: false,
    supervisor: '',
    changePoint: false,
    manufacturingDetails: '',
    qualityDetails: '',
    holdStatus: false,
    holdQuantity: 0,
    judgment: '' as 'OK' | 'NG' | '',
  });

  // ページマウント時にbodyのスクロールを無効化
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const updateHeaderData = (field: string, value: string) => {
    setHeaderData(prev => ({ ...prev, [field]: value }));
  };

  const updateInstructionData = (field: string, value: string | number) => {
    setInstructionData(prev => ({ ...prev, [field]: value }));
  };

  const updateMaterial = (index: number, field: keyof Material, value: string) => {
    setMaterials(prev => prev.map((material, i) => 
      i === index ? { ...material, [field]: value } : material
    ));
  };

  const updateManufacturingRecord = (field: string, value: string | number) => {
    setManufacturingRecord(prev => ({ ...prev, [field]: value }));
  };

  const updateCheckItem = (index: number, field: keyof CheckItem, value: string) => {
    setCheckItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const updateDocumentCheck = (index: number, checked: boolean) => {
    setDocumentChecks(prev => prev.map((doc, i) => 
      i === index ? { ...doc, checked } : doc
    ));
  };

  const updateFinalCheck = (field: string, value: string | number | boolean) => {
    setFinalCheck(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const instructionSheet = {
        header: headerData,
        instruction: instructionData,
        materials,
        productImage,
        manufacturingRecord,
        checkItems,
        documentChecks,
        finalCheck,
      };
      
      console.log('Saving manufacturing instruction:', instructionSheet);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('製造指示書を保存しました。');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('製造指示書をPDFでダウンロードします。');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 print:h-auto print:block print:bg-white">
      {/* ヘッダーバー */}
      <div className="bg-white border-b border-gray-200 shadow-sm print:hidden">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/production')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">製造指示書</h1>
                <p className="mt-1 text-sm text-gray-500">製造指示書の作成・編集</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <Printer size={16} className="mr-2" />
                印刷
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <Download size={16} className="mr-2" />
                PDF出力
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                <Save size={16} className="mr-2" />
                {loading ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 print:hidden">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* スクロール可能なコンテンツエリア */}
      <div className="flex-1 overflow-y-auto print:overflow-visible print:flex-none">
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-8 print:max-w-none print:px-0 print:py-0 print:space-y-4">
          
          {/* ①ヘッダー */}
          <Card className="print:shadow-none print:border-2 print:border-black bg-white">
            <div className="border-b-2 border-gray-900 pb-6 mb-6 print:border-black">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg print:bg-white print:border print:border-gray-300">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">作成・更新情報</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">作成・更新</label>
                        <input
                          type="date"
                          value={headerData.createdDate}
                          onChange={(e) => updateHeaderData('createdDate', e.target.value)}
                          className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">日付</label>
                        <input
                          type="date"
                          value={headerData.updatedDate}
                          onChange={(e) => updateHeaderData('updatedDate', e.target.value)}
                          className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Ver</label>
                        <input
                          type="text"
                          value={headerData.version}
                          onChange={(e) => updateHeaderData('version', e.target.value)}
                          className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-blue-50 p-6 rounded-lg print:bg-white print:border-2 print:border-blue-600">
                    <FileText className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">製造指示書</h1>
                    <div className="bg-white p-3 rounded-md border border-blue-200 print:border-black">
                      <label className="block text-xs font-medium text-gray-600 mb-1">指示No</label>
                      <input
                        type="text"
                        value={headerData.instructionNumber}
                        onChange={(e) => updateHeaderData('instructionNumber', e.target.value)}
                        className="w-full text-center font-mono text-lg font-semibold border-0 focus:ring-0 print:border print:border-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="bg-gray-50 p-4 rounded-lg print:bg-white print:border print:border-gray-300">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">発行情報</h3>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">発行日</label>
                      <input
                        type="date"
                        value={headerData.issueDate}
                        onChange={(e) => updateHeaderData('issueDate', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 承認印枠 */}
              <div className="grid grid-cols-4 gap-4 border-t-2 border-gray-200 pt-6 print:border-black">
                {[
                  { title: '品質保証課長', icon: <CheckCircle className="h-6 w-6 text-green-500" /> },
                  { title: '総務課長', icon: <User className="h-6 w-6 text-blue-500" /> },
                  { title: '製造課長', icon: <Building className="h-6 w-6 text-purple-500" /> },
                  { title: '発行者', icon: <FileText className="h-6 w-6 text-orange-500" /> }
                ].map((approval, index) => (
                  <div key={index} className="border-2 border-gray-300 rounded-lg p-4 text-center bg-white hover:border-gray-400 transition-colors print:border-black print:rounded-none">
                    <div className="flex justify-center mb-2 print:hidden">
                      {approval.icon}
                    </div>
                    <div className="text-xs font-medium text-gray-700 mb-3">{approval.title}</div>
                    <div className="h-16 border border-gray-200 rounded-md bg-gray-50 print:bg-white print:border-black print:rounded-none"></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* ②製造指示 */}
          <Card className="print:shadow-none print:border-2 print:border-black">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                ②製造指示
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg print:bg-white print:border print:border-blue-300">
                  <h3 className="text-sm font-semibold text-blue-800 mb-4">基本情報</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">製造年月日1</label>
                      <input
                        type="date"
                        value={instructionData.manufacturingDate1}
                        onChange={(e) => updateInstructionData('manufacturingDate1', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">製造年月日2</label>
                      <input
                        type="date"
                        value={instructionData.manufacturingDate2}
                        onChange={(e) => updateInstructionData('manufacturingDate2', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">製品名</label>
                      <input
                        type="text"
                        value={instructionData.productName}
                        onChange={(e) => updateInstructionData('productName', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                        placeholder="製品名を入力"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">製造LOT</label>
                      <input
                        type="text"
                        value={instructionData.manufacturingLot}
                        onChange={(e) => updateInstructionData('manufacturingLot', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                        placeholder="LOT番号を入力"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">販売先</label>
                      <input
                        type="text"
                        value={instructionData.salesDestination}
                        onChange={(e) => updateInstructionData('salesDestination', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                        placeholder="販売先を入力"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">賞味期限</label>
                      <input
                        type="date"
                        value={instructionData.expirationDate}
                        onChange={(e) => updateInstructionData('expirationDate', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg print:bg-white print:border print:border-green-300">
                  <h3 className="text-sm font-semibold text-green-800 mb-4">印字・数量情報</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">ボトル印字1</label>
                        <input
                          type="text"
                          value={instructionData.bottlePrint1}
                          onChange={(e) => updateInstructionData('bottlePrint1', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 print:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">ボトル印字2</label>
                        <input
                          type="text"
                          value={instructionData.bottlePrint2}
                          onChange={(e) => updateInstructionData('bottlePrint2', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 print:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">カートン印字1</label>
                        <input
                          type="text"
                          value={instructionData.cartonPrint1}
                          onChange={(e) => updateInstructionData('cartonPrint1', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 print:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">カートン印字2</label>
                        <input
                          type="text"
                          value={instructionData.cartonPrint2}
                          onChange={(e) => updateInstructionData('cartonPrint2', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 print:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">製造予定数1</label>
                        <input
                          type="number"
                          value={instructionData.plannedQuantity1}
                          onChange={(e) => updateInstructionData('plannedQuantity1', parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 print:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">製造予定数2</label>
                        <input
                          type="number"
                          value={instructionData.plannedQuantity2}
                          onChange={(e) => updateInstructionData('plannedQuantity2', parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 print:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">C/S換算1</label>
                        <input
                          type="number"
                          value={instructionData.csConversion1}
                          onChange={(e) => updateInstructionData('csConversion1', parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 print:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">C/S換算2</label>
                        <input
                          type="number"
                          value={instructionData.csConversion2}
                          onChange={(e) => updateInstructionData('csConversion2', parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 print:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">パレット換算1</label>
                        <input
                          type="number"
                          value={instructionData.palletConversion1}
                          onChange={(e) => updateInstructionData('palletConversion1', parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 print:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">パレット換算2</label>
                        <input
                          type="number"
                          value={instructionData.palletConversion2}
                          onChange={(e) => updateInstructionData('palletConversion2', parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 print:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">使用パレット1</label>
                        <input
                          type="text"
                          value={instructionData.usedPallet1}
                          onChange={(e) => updateInstructionData('usedPallet1', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 print:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">使用パレット2</label>
                        <input
                          type="text"
                          value={instructionData.usedPallet2}
                          onChange={(e) => updateInstructionData('usedPallet2', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 print:border-black"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ③資材 */}
          <Card className="print:shadow-none print:border-2 print:border-black">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Package className="h-6 w-6 text-green-600 mr-3" />
                ③資材
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 print:border-black">
                <thead className="bg-gray-50 print:bg-white">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 print:border-black">使用資材</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 print:border-black">指定メーカー</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 print:border-black">品番</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 print:border-black">使用LOT</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material, index) => (
                    <tr key={index} className="hover:bg-gray-50 print:hover:bg-white">
                      <td className="border border-gray-300 px-4 py-3 print:border-black">
                        <div className="flex items-center">
                          <Package size={16} className="text-green-600 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{material.type}</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 print:border-black">
                        <input
                          type="text"
                          value={material.manufacturer}
                          onChange={(e) => updateMaterial(index, 'manufacturer', e.target.value)}
                          className="w-full border-0 bg-transparent text-sm focus:ring-0 print:border print:border-black print:px-2 print:py-1"
                          placeholder="メーカー名"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3 print:border-black">
                        <input
                          type="text"
                          value={material.partNumber}
                          onChange={(e) => updateMaterial(index, 'partNumber', e.target.value)}
                          className="w-full border-0 bg-transparent text-sm focus:ring-0 print:border print:border-black print:px-2 print:py-1"
                          placeholder="品番"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3 print:border-black">
                        <input
                          type="text"
                          value={material.usageLot}
                          onChange={(e) => updateMaterial(index, 'usageLot', e.target.value)}
                          className="w-full border-0 bg-transparent text-sm focus:ring-0 print:border print:border-black print:px-2 print:py-1"
                          placeholder="LOT番号"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* ④商品画像 */}
          <Card className="print:shadow-none print:border-2 print:border-black">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Camera className="h-6 w-6 text-purple-600 mr-3" />
                ④商品画像
              </h2>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 print:border-black print:bg-white">
              {productImage ? (
                <div className="relative">
                  <img src={productImage} alt="商品画像" className="max-h-64 mx-auto rounded-lg shadow-md" />
                  <button
                    onClick={() => setProductImage('')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors print:hidden"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div className="print:hidden">
                  <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <div className="mt-4">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="mt-2 block text-lg font-medium text-gray-900 mb-2">
                        商品画像をアップロード
                      </span>
                      <span className="text-sm text-gray-500">
                        JPG、PNG、GIF形式に対応
                      </span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* ⑤製造記録 */}
          <Card className="print:shadow-none print:border-2 print:border-black">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FileText className="h-6 w-6 text-orange-600 mr-3" />
                ⑤製造記録
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-orange-50 p-4 rounded-lg print:bg-white print:border print:border-orange-300">
                <h3 className="text-sm font-semibold text-orange-800 mb-4">時間記録</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">CIP開始時刻</label>
                    <input
                      type="time"
                      value={manufacturingRecord.cipStartTime}
                      onChange={(e) => updateManufacturingRecord('cipStartTime', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 print:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">製造開始時刻</label>
                    <input
                      type="time"
                      value={manufacturingRecord.manufacturingStartTime}
                      onChange={(e) => updateManufacturingRecord('manufacturingStartTime', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 print:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">製造終了時刻</label>
                    <input
                      type="time"
                      value={manufacturingRecord.manufacturingEndTime}
                      onChange={(e) => updateManufacturingRecord('manufacturingEndTime', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 print:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">稼働時間（分）</label>
                    <input
                      type="number"
                      value={manufacturingRecord.operatingTime}
                      onChange={(e) => updateManufacturingRecord('operatingTime', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 print:border-black"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg print:bg-white print:border print:border-blue-300">
                <h3 className="text-sm font-semibold text-blue-800 mb-4">数量記録</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">パレット：4段積</label>
                      <input
                        type="number"
                        value={manufacturingRecord.pallet4Stage}
                        onChange={(e) => updateManufacturingRecord('pallet4Stage', parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">端数</label>
                      <input
                        type="number"
                        value={manufacturingRecord.palletRemainder}
                        onChange={(e) => updateManufacturingRecord('palletRemainder', parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">C/S：4段積</label>
                      <input
                        type="number"
                        value={manufacturingRecord.cs4Stage}
                        onChange={(e) => updateManufacturingRecord('cs4Stage', parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">端数</label>
                      <input
                        type="number"
                        value={manufacturingRecord.csRemainder}
                        onChange={(e) => updateManufacturingRecord('csRemainder', parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">製造本数</label>
                    <input
                      type="number"
                      value={manufacturingRecord.manufacturingCount}
                      onChange={(e) => updateManufacturingRecord('manufacturingCount', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">置き場所</label>
                    <input
                      type="text"
                      value={manufacturingRecord.storageLocation}
                      onChange={(e) => updateManufacturingRecord('storageLocation', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:border-black"
                      placeholder="保管場所を入力"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ⑥チェック */}
          <Card className="print:shadow-none print:border-2 print:border-black">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                ⑥チェック
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 print:border-black">
                <thead className="bg-gray-50 print:bg-white">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 print:border-black">項目</th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 print:border-black">OK</th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 print:border-black">NG</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 print:border-black">備考</th>
                  </tr>
                </thead>
                <tbody>
                  {checkItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 print:hover:bg-white">
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900 print:border-black">{item.name}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center print:border-black">
                        <input
                          type="radio"
                          name={`check-${index}`}
                          checked={item.status === 'OK'}
                          onChange={() => updateCheckItem(index, 'status', 'OK')}
                          className="text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center print:border-black">
                        <input
                          type="radio"
                          name={`check-${index}`}
                          checked={item.status === 'NG'}
                          onChange={() => updateCheckItem(index, 'status', 'NG')}
                          className="text-red-600 focus:ring-red-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3 print:border-black">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => updateCheckItem(index, 'remarks', e.target.value)}
                          className="w-full border-0 bg-transparent text-sm focus:ring-0 print:border print:border-black print:px-2 print:py-1"
                          placeholder="備考を入力"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* ⑦帳票確認 */}
          <Card className="print:shadow-none print:border-2 print:border-black">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FileText className="h-6 w-6 text-indigo-600 mr-3" />
                ⑦帳票確認
              </h2>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">帳票名</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {documentChecks.map((doc, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors print:bg-white print:border print:border-gray-300">
                    <input
                      type="checkbox"
                      id={`doc-${index}`}
                      checked={doc.checked}
                      onChange={(e) => updateDocumentCheck(index, e.target.checked)}
                      className="text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <label htmlFor={`doc-${index}`} className="text-sm text-gray-700 cursor-pointer flex-1">{doc.name}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-indigo-50 p-6 rounded-lg print:bg-white print:border print:border-indigo-300">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4">基本情報</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">アイテムの切替</label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="itemChange"
                          checked={finalCheck.itemChange === true}
                          onChange={() => updateFinalCheck('itemChange', true)}
                          className="text-indigo-600 focus:ring-indigo-500 mr-2"
                        />
                        <span className="text-sm text-gray-700">有</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="itemChange"
                          checked={finalCheck.itemChange === false}
                          onChange={() => updateFinalCheck('itemChange', false)}
                          className="text-indigo-600 focus:ring-indigo-500 mr-2"
                        />
                        <span className="text-sm text-gray-700">無</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">担当</label>
                    <input
                      type="text"
                      value={finalCheck.supervisor}
                      onChange={(e) => updateFinalCheck('supervisor', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 print:border-black"
                      placeholder="担当者名を入力"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">変化点の有無</label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="changePoint"
                          checked={finalCheck.changePoint === true}
                          onChange={() => updateFinalCheck('changePoint', true)}
                          className="text-indigo-600 focus:ring-indigo-500 mr-2"
                        />
                        <span className="text-sm text-gray-700">有</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="changePoint"
                          checked={finalCheck.changePoint === false}
                          onChange={() => updateFinalCheck('changePoint', false)}
                          className="text-indigo-600 focus:ring-indigo-500 mr-2"
                        />
                        <span className="text-sm text-gray-700">無</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg print:bg-white print:border print:border-purple-300">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">詳細情報</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">内容・対処詳細（製造枠）</label>
                    <textarea
                      rows={3}
                      value={finalCheck.manufacturingDetails}
                      onChange={(e) => updateFinalCheck('manufacturingDetails', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 print:border-black"
                      placeholder="製造に関する詳細を入力"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">内容・対処詳細（品管枠）</label>
                    <textarea
                      rows={3}
                      value={finalCheck.qualityDetails}
                      onChange={(e) => updateFinalCheck('qualityDetails', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 print:border-black"
                      placeholder="品質管理に関する詳細を入力"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-amber-50 p-4 rounded-lg print:bg-white print:border print:border-amber-300">
                <h4 className="text-sm font-semibold text-amber-800 mb-3">保留</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="holdStatus"
                      checked={finalCheck.holdStatus === true}
                      onChange={() => updateFinalCheck('holdStatus', true)}
                      className="text-amber-600 focus:ring-amber-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">有</span>
                  </label>
                  {finalCheck.holdStatus && (
                    <div className="ml-6 flex items-center space-x-2">
                      <input
                        type="number"
                        value={finalCheck.holdQuantity}
                        onChange={(e) => updateFinalCheck('holdQuantity', parseInt(e.target.value) || 0)}
                        className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 print:border-black"
                      />
                      <span className="text-sm text-gray-700">c/s</span>
                    </div>
                  )}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="holdStatus"
                      checked={finalCheck.holdStatus === false}
                      onChange={() => updateFinalCheck('holdStatus', false)}
                      className="text-amber-600 focus:ring-amber-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">無</span>
                  </label>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg print:bg-white print:border print:border-green-300">
                <h4 className="text-sm font-semibold text-green-800 mb-3">判定</h4>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="judgment"
                      checked={finalCheck.judgment === 'OK'}
                      onChange={() => updateFinalCheck('judgment', 'OK')}
                      className="text-green-600 focus:ring-green-500 mr-2"
                    />
                    <span className="text-sm font-semibold text-green-700 flex items-center">
                      <CheckCircle size={16} className="mr-1" />
                      OK
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="judgment"
                      checked={finalCheck.judgment === 'NG'}
                      onChange={() => updateFinalCheck('judgment', 'NG')}
                      className="text-red-600 focus:ring-red-500 mr-2"
                    />
                    <span className="text-sm font-semibold text-red-700 flex items-center">
                      <XCircle size={16} className="mr-1" />
                      NG
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManufacturingInstruction;