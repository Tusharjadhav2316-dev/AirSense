import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-mistWhite text-deepAtmosphere flex flex-col md:flex-row antialiased selection:bg-clearSky selection:text-deepAtmosphere">
      {/* Desktop Navigation Sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-16 md:pb-0">
        <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};
