import React from 'react';
import { 
  Zap, 
  CornerUpLeft, 
  CornerUpRight, 
  ArrowUp, 
  Navigation, 
  Battery, 
  Volume2, 
  VolumeX, 
  Power 
} from 'lucide-react';
import { ManeuverType, PositionState, BatteryState } from '../types';
import { NavigationProgress } from '../engine/navigationController';

interface UltraNavOverlayProps {
  navProgress: NavigationProgress;
  posState: PositionState;
  batteryState: BatteryState;
  isVoiceMuted: boolean;
  onToggleMute: () => void;
  onExitUltraMode: () => void;
}

export const UltraNavOverlay: React.FC<UltraNavOverlayProps> = ({
  navProgress,
  posState,
  batteryState,
  isVoiceMuted,
  onToggleMute,
  onExitUltraMode,
}) => {
  const instruction = navProgress.currentInstruction;
  const maneuver: ManeuverType = instruction?.maneuver || 'straight';
  const distance = navProgress.distanceToNextTurnMeters;

  const renderMinimalIcon = (type: ManeuverType) => {
    switch (type) {
      case 'turn-left':
      case 'sharp-left':
        return <CornerUpLeft size={88} className="text-[#FFD400]" strokeWidth={3} />;
      case 'turn-right':
      case 'sharp-right':
        return <CornerUpRight size={88} className="text-[#FFD400]" strokeWidth={3} />;
      case 'slight-left':
        return <CornerUpLeft size={88} className="text-[#FFD400] -rotate-12" strokeWidth={3} />;
      case 'slight-right':
        return <CornerUpRight size={88} className="text-[#FFD400] rotate-12" strokeWidth={3} />;
      case 'arrive':
        return <Navigation size={88} className="text-[#22C55E]" strokeWidth={3} />;
      default:
        return <ArrowUp size={88} className="text-[#FFD400]" strokeWidth={3} />;
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.ceil(seconds / 60);
    return `${mins} min`;
  };

  const getManeuverTitle = (type: ManeuverType) => {
    switch (type) {
      case 'turn-left': return 'TURN LEFT';
      case 'turn-right': return 'TURN RIGHT';
      case 'slight-left': return 'SLIGHT LEFT';
      case 'slight-right': return 'SLIGHT RIGHT';
      case 'sharp-left': return 'SHARP LEFT';
      case 'sharp-right': return 'SHARP RIGHT';
      case 'arrive': return 'ARRIVING AT DESTINATION';
      default: return 'PROCEED STRAIGHT';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col justify-between p-6 select-none font-display">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-[#FFD400]" />
            <span className="text-sm font-black tracking-widest uppercase text-white">
              ULTRA NAVIGATION MODE
            </span>
          </div>
          <p className="text-[10px] text-neutral-400 font-sans">
            Navigation prioritized • Voice guidance active • Reduced visual rendering
          </p>
        </div>

        <div className="flex items-center gap-3 font-sans">
          <div className="flex items-center gap-1.5 text-xs text-neutral-300">
            <Battery size={16} className={batteryState.isLowBattery ? "text-[#EF4444]" : "text-[#F59E0B]"} />
            <span className="font-bold">Battery {Math.round(batteryState.level * 100)}%</span>
          </div>

          <button
            onClick={onExitUltraMode}
            className="flex items-center gap-1 text-xs font-bold text-neutral-300 hover:text-white px-2.5 py-1 rounded-lg border border-neutral-800 bg-neutral-950"
          >
            <Power size={13} />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Main High-Contrast Turn Card */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-4">
        <div className="mb-4">
          {renderMinimalIcon(maneuver)}
        </div>

        <div className="text-xl font-black text-[#FFD400] tracking-wider uppercase mb-1">
          {navProgress.status === 'rerouting' ? 'RECALCULATING OFFLINE...' : getManeuverTitle(maneuver)}
        </div>

        <div className="text-6xl font-black text-white tracking-tighter mb-2">
          {formatDistance(distance)}
        </div>

        <p className="text-lg font-bold text-neutral-200 max-w-xs">
          {instruction?.instruction || 'Proceed on route'}
        </p>

        <p className="text-sm text-neutral-400 font-medium mt-1">
          {instruction?.roadName || 'Next Waypoint'}
        </p>
      </div>

      {/* Bottom Summary & Voice Controls */}
      <div className="border-t border-neutral-900 pt-4 space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center font-sans">
          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-900">
            <span className="text-[10px] uppercase text-neutral-500 block">Remaining</span>
            <span className="text-base font-bold text-white font-display">
              {formatDistance(navProgress.remainingDistanceMeters)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-900">
            <span className="text-[10px] uppercase text-neutral-500 block">ETA</span>
            <span className="text-base font-bold text-white font-display">
              {formatTime(navProgress.remainingDurationSeconds)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-900">
            <span className="text-[10px] uppercase text-neutral-500 block">Speed</span>
            <span className="text-base font-bold text-white font-display">
              {Math.round(posState.speed * 3.6)} km/h
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-sans">
            <span className={`w-2 h-2 rounded-full ${posState.isSensorAssisted ? 'bg-[#3B82F6]' : 'bg-[#22C55E]'}`} />
            <span>{posState.isSensorAssisted ? 'IMU Dead Reckoning Active' : 'GPS Active'}</span>
          </div>

          <button
            onClick={onToggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-semibold text-neutral-200"
          >
            {isVoiceMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-[#FFD400]" />}
            <span>{isVoiceMuted ? 'Voice Muted' : 'Voice Guidance ON'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
