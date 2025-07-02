import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center min-w-0">
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">
              製造業管理システム
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            <button className="p-1.5 lg:p-2 text-gray-400 hover:text-gray-500 relative">
              <Bell className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>
            
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="flex items-center space-x-1 lg:space-x-2">
                <User className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
                <span className="text-xs lg:text-sm text-gray-700 truncate max-w-24 lg:max-w-none">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 lg:p-2 text-gray-400 hover:text-gray-500"
                title="ログアウト"
              >
                <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;