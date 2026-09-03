import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LineChart, MessageSquare, Bell, Settings } from 'lucide-react';

export type NavTab = 'home' | 'compare' | 'trends' | 'chat' | 'alerts' | 'settings';

export interface BottomNavProps {
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  className = '',
}) => {

  const tabs: Array<{ id: NavTab; to: string; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'home', to: '/dashboard', label: 'Home', icon: Home },
    { id: 'trends', to: '/trends', label: 'Trends', icon: LineChart },
    { id: 'chat', to: '/chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'alerts', to: '/alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', to: '/settings', label: 'Settings', icon: Settings },
  ];


  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slateInk/15 px-3 py-1.5 shadow-lg md:hidden ${className}`}
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.id}
              to={tab.to}
              onClick={() => {
                if (onTabChange) onTabChange(tab.id);
              }}
              className={({ isActive }) => {
                const active = activeTab ? activeTab === tab.id : isActive;
                return `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
                  active
                    ? 'text-clearSky font-semibold bg-clearSky/10'
                    : 'text-slateInk hover:text-deepAtmosphere hover:bg-mistWhite'
                }`;
              }}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
