import React from 'react';
import { ArrowLeft, Radio, Zap, Globe, Smartphone, Monitor } from 'lucide-react';
import { PositionState, BatteryState } from '../types';
import { IQOOLogo } from './IQOOLogo';

interface NavigationHeaderProps {
  isNavigating: boolean;
  isOffline: boolean;
  posState: PositionState;
  batteryState: BatteryState;
  onBackOrStopNav: () => void;
  onToggleViewMode: () => void;
  isPhoneFrameView: boolean;
  onTogglePhoneFrame: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  isNavigating,
  isOffline,
  posState,
  batteryState,
  onBackOrStopNav,
  onToggleViewMode,
  isPhoneFrameView,
  onTogglePhoneFrame,
}) => {
  return (
    <header className="w-full max-w-6xl px-4 py-2.5 flex items-center justify-between border-b border-[#2B2F33] z-30 select-none bg-[#08090A]/95 backdrop-blur-md">
      {/* Left: Brand Identity or Back Button when navigating */}
      <div className="flex items-center gap-2.5">
        {isNavigating ? (
          <button
            onClick={onBackOrStopNav}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#191C1F] hover:bg-[#22262A] text-xs font-bold text-[#F5F7F8] border border-[#2B2F33] transition-colors"
            title="Stop Navigation"
          >
            <ArrowLeft size={16} className="text-[#FFD400]" />
            <span className="font-display">Exit</span>
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            <IQOOLogo size="sm" variant="full" />
            <div className="h-3.5 w-px bg-[#2B2F33]" />
            <span className="font-extrabold text-sm tracking-wider text-[#F5F7F8] font-display">
              NavX
            </span>
          </div>
        )}
      </div>

      {/* Center / Right: Compact Telemetry & Controls */}
      <div className="flex items-center gap-2">
        {/* Active Navigation Mode: show compact status badge */}
        {isNavigating ? (
          <div className="flex items-center gap-2 font-display">
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase border ${
              isOffline
                ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/35'
                : 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/35'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'}`} />
              <span>{isOffline ? '● OFFLINE' : 'ONLINE'}</span>
            </div>
          </div>
        ) : (
          /* Normal State: GPS and Battery indicator */
          <div className="flex items-center gap-2">
            {/* GPS Telemetry */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[#191C1F] border border-[#2B2F33] text-[11px] font-bold">
              <Radio size={12} className={posState.isSensorAssisted ? 'text-[#3B82F6]' : 'text-[#22C55E]'} />
              <span className="hidden sm:inline text-[#A4A9AE]">GPS:</span>
              <span className={posState.isSensorAssisted ? 'text-[#3B82F6]' : 'text-[#22C55E]'}>
                {posState.isSensorAssisted ? 'IMU' : 'Active'}
              </span>
            </div>

            {/* Battery Telemetry */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[#191C1F] border border-[#2B2F33] text-[11px] font-bold">
              <Zap size={12} className={batteryState.isLowBattery ? 'text-[#EF4444]' : 'text-[#22C55E]'} />
              <span className={batteryState.isLowBattery ? 'text-[#EF4444]' : 'text-[#F5F7F8]'}>
                {Math.round(batteryState.level * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* View Mode Toggle: Back to Product Landing Page */}
        <button
          onClick={onToggleViewMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#191C1F] hover:bg-[#22262A] text-xs font-bold text-[#A4A9AE] hover:text-[#FFD400] border border-[#2B2F33] transition-colors font-display cursor-pointer"
          title="Return to Product Landing Page"
        >
          <Globe size={13} />
          <span className="hidden sm:inline">Landing Page</span>
        </button>

        {/* Frame Toggle on Desktop */}
        <button
          onClick={onTogglePhoneFrame}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#191C1F] hover:bg-[#22262A] text-xs font-semibold text-[#A4A9AE] hover:text-[#F5F7F8] border border-[#2B2F33] transition-colors font-display"
          title={isPhoneFrameView ? 'Switch to Full Width View' : 'Switch to Mobile Phone View'}
        >
          {isPhoneFrameView ? <Monitor size={13} /> : <Smartphone size={13} />}
        </button>
      </div>
    </header>
  );
};
