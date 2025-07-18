import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Package, Settings, X, User, Truck, Database, Send } from 'lucide-react';

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
  const navItems = [
    { name: 'ダッシュボード', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: '生産', path: '/production', icon: <Calendar size={20} /> },
    { name: '出荷', path: '/shipment', icon: <Send size={20} /> },
    { name: '在庫', path: '/inventory', icon: <Package size={20} /> },
    { name: 'マスタ管理', path: '/master-management', icon: <Database size={20} /> },
    { name: '設定', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-blue-900 text-white">
      <div className="flex items-center justify-between px-4 py-6">
        <div className="flex items-center">
          <div className="mr-2 w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <span className="text-blue-900 font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold">生産管理</span>
        </div>
        <button 
          onClick={closeSidebar}
          className="lg:hidden text-white hover:text-gray-300 focus:outline-none"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                  isActive
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-blue-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-9 w-9 rounded-full bg-blue-700 flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">山田 太郎</p>
            <p className="text-xs text-blue-200">生産管理者</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;