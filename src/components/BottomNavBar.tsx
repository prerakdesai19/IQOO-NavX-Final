import React from 'react';
import { Map, Bookmark, DownloadCloud, Settings } from 'lucide-react';

export type TabType = 'map' | 'saved' | 'regions' | 'settings';

interface BottomNavBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  isNavigating: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  isNavigating,
}) => {
  // During active turn-by-turn navigation, keep bottom interface clean and map-focused
  if (isNavigating) {
    return null;
  }

  const navItems = [
    { id: 'map' as TabType, label: 'Map', icon: Map },
    { id: 'saved' as TabType, label: 'Saved', icon: Bookmark },
    { id: 'regions' as TabType, label: 'Offline', icon: DownloadCloud },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <nav 
      role="navigation" 
      aria-label="Main Navigation"
      className="w-full bg-[#111315]/95 backdrop-blur-xl border-t border-[#2B2F33] px-3 py-1.5 flex items-center justify-around z-30 select-none"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              isActive
                ? 'text-[#FFD400] bg-[#FFD400]/10 font-bold shadow-[0_0_12px_rgba(255,212,0,0.15)]'
                : 'text-[#A4A9AE] hover:text-[#F5F7F8] hover:bg-[#191C1F] font-medium'
            }`}
          >
            <Icon size={20} className={isActive ? 'text-[#FFD400]' : 'text-[#A4A9AE]'} />
            <span className="text-[11px] tracking-wide font-display">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
