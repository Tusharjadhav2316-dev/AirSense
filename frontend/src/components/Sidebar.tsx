import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Wind,
  Home,
  LineChart,
  GitCompare,
  MessageSquare,
  Bell,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/trends', label: 'Trends', icon: LineChart },
    { to: '/compare', label: 'Compare', icon: GitCompare },
    { to: '/chat', label: 'AI Chat', icon: MessageSquare },
    { to: '/alerts', label: 'Alerts', icon: Bell },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`w-64 bg-deepAtmosphere text-mistWhite flex flex-col justify-between border-r border-slateInk/20 h-screen sticky top-0 shrink-0 ${className}`}
    >
      {/* Brand Header */}
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-slateInk/15">
          <div className="w-9 h-9 rounded-xl bg-clearSky/20 border border-clearSky/40 flex items-center justify-center text-clearSky shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight text-mistWhite leading-none">
              AirSense
            </h1>
            <p className="text-[11px] text-slateInk mt-1 font-sans">
              AI Health Reasoning
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-clearSky/15 text-clearSky border border-clearSky/30 font-semibold'
                      : 'text-slateInk hover:text-mistWhite hover:bg-slateInk/10'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile & RAG Status */}
      <div className="p-4 border-t border-slateInk/15">
        <div className="p-3 rounded-xl bg-slateInk/10 border border-slateInk/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-clearSky/20 text-clearSky flex items-center justify-center font-bold text-xs shrink-0">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-mistWhite truncate">
                {user?.email || 'Guest User'}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-clearSky mt-0.5">
                <ShieldCheck className="w-3 h-3" />
                <span>WHO / EPA AI Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
