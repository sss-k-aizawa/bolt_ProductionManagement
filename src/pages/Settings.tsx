import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { Users, Bell, Lock, Eye, EyeOff, Mail } from 'lucide-react';

const Settings: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="mt-1 text-sm text-gray-500">アカウントとアプリケーションの設定管理</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 flex-shrink-0">
          <Card className="overflow-hidden">
            <nav className="flex flex-col">
              <button
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <Users size={18} className="mr-3" />
                プロフィール設定
              </button>
              <button
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'notifications'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={18} className="mr-3" />
                通知設定
              </button>
              <button
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'security'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <Lock size={18} className="mr-3" />
                セキュリティ
              </button>
            </nav>
          </Card>
        </div>
        
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card>
              <h2 className="text-lg font-medium text-gray-900 mb-6">プロフィール設定</h2>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                    TY
                  </div>
                  <div className="ml-5">
                    <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      アバターを変更
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      名
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      defaultValue="太郎"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      姓
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      defaultValue="山田"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        defaultValue="taro.yamada@example.com"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    役職
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    defaultValue="生産管理者"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    部署
                  </label>
                  <select
                    id="department"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option>生産部</option>
                    <option>品質管理部</option>
                    <option>保全部</option>
                    <option>在庫管理部</option>
                    <option>総務部</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    変更を保存
                  </button>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-lg font-medium text-gray-900 mb-6">通知設定</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">メール通知</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="dailySummary"
                          type="checkbox"
                          defaultChecked
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="dailySummary" className="text-sm font-medium text-gray-700">
                          日次生産概要
                        </label>
                        <p className="text-xs text-gray-500">生産統計の日次メールを受信</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="alerts"
                          type="checkbox"
                          defaultChecked
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="alerts" className="text-sm font-medium text-gray-700">
                          重要アラート
                        </label>
                        <p className="text-xs text-gray-500">重要なアラートのメール通知を受信</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="reportGeneration"
                          type="checkbox"
                          className="focus:ring-blue-500  h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="reportGeneration" className="text-sm font-medium text-gray-700">
                          レポート生成
                        </label>
                        <p className="text-xs text-gray-500">レポート生成時のメールを受信</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">システム通知</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="maintenanceAlerts"
                          type="checkbox"
                          defaultChecked
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="maintenanceAlerts" className="text-sm font-medium text-gray-700">
                          メンテナンスアラート
                        </label>
                        <p className="text-xs text-gray-500">予定されているメンテナンスの通知を受信</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="inventoryAlerts"
                          type="checkbox"
                          defaultChecked
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="inventoryAlerts" className="text-sm font-medium text-gray-700">
                          在庫アラート
                        </label>
                        <p className="text-xs text-gray-500">在庫不足の通知を受信</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="orderCompletion"
                          type="checkbox"
                          defaultChecked
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="orderCompletion" className="text-sm font-medium text-gray-700">
                          作業完了
                        </label>
                        <p className="text-xs text-gray-500">作業指示完了時の通知を受信</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    変更を保存
                  </button>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'security' && (
            <Card>
              <h2 className="text-lg font-medium text-gray-900 mb-6">セキュリティ設定</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">パスワード変更</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        現在のパスワード
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="currentPassword"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        新しいパスワード
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="newPassword"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        新しいパスワード（確認）
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="confirmPassword"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    変更を保存
                  </button>
                </div>
              </div>
            </Card>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Settings;