import React from 'react';

interface AuthTabsProps {
  activeTab: 'login' | 'signup';
  onTabChange: (tab: 'login' | 'signup') => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center border-b border-slate-200 mb-6">
      <button
        type="button"
        onClick={() => onTabChange('login')}
        className={`relative pb-3.5 px-6 text-sm font-semibold transition-all cursor-pointer ${
          activeTab === 'login'
            ? 'text-[#1D4ED8] font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        Log In
        {activeTab === 'login' && (
          <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#1D4ED8] rounded-full" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onTabChange('signup')}
        className={`relative pb-3.5 px-6 text-sm font-semibold transition-all cursor-pointer ${
          activeTab === 'signup'
            ? 'text-[#1D4ED8] font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        Sign Up
        {activeTab === 'signup' && (
          <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#1D4ED8] rounded-full" />
        )}
      </button>
    </div>
  );
};
