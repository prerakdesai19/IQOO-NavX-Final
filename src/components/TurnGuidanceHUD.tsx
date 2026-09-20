import React from 'react';
import { 
  CornerUpLeft, 
  CornerUpRight, 
  ArrowUp, 
  Navigation, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  X,
  Cpu,
  WifiOff,
  CheckCircle2,
  Mic
} from 'lucide-react';
import { ManeuverType, PositionState, Route } from '../types';
import { NavigationProgress } from '../engine/navigationController';

interface TurnGuidanceHUDProps {
  progress: NavigationProgress;
  posState: PositionState;
  activeRoute: Route | null;
  isMuted: boolean;
  isOffline: boolean;
  onToggleMute: () => void;
  onStopNav: () => void;
  onReroute: () => void;
  onOpenVoice: () => void;
}

export const TurnGuidanceHUD: React.FC<TurnGuidanceHUDProps> = ({
  progress,
  posState,
  activeRoute,
  isMuted,
  isOffline,
  onToggleMute,
  onStopNav,
  onReroute,
  onOpenVoice,
}) => {
  if (progress.status !== 'navigating' && progress.status !== 'rerouting') {
    return null;
  }

  const instruction = progress.currentInstruction;
  const maneuver = instruction?.maneuver || 'straight';
  const distance = progress.distanceToNextTurnMeters;

  const renderManeuverIcon = (type: ManeuverType) => {
    switch (type) {
      case 'turn-left':
      case 'sharp-left':
        return <CornerUpLeft size={36} className="text-[#FFD400]" strokeWidth={2.5} />;
      case 'turn-right':
      case 'sharp-right':
        return <CornerUpRight size={36} className="text-[#FFD400]" strokeWidth={2.5} />;
      case 'slight-left':
        return <CornerUpLeft size={36} className="text-[#FFD400] -rotate-12" strokeWidth={2.5} />;
      case 'slight-right':
        return <CornerUpRight size={36} className="text-[#FFD400] rotate-12" strokeWidth={2.5} />;
      case 'arrive':
        return <Navigation size={36} className="text-[#22C55E]" strokeWidth={2.5} />;
      default:
        return <ArrowUp size={36} className="text-[#FFD400]" strokeWidth={2.5} />;
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
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
    <div className="w-full px-4 pt-1 z-40 select-none animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="p-4 rounded-3xl bg-[#111315]/95 backdrop-blur-2xl border border-[#2B2F33] shadow-2xl relative overflow-hidden space-y-3">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD400] to-transparent opacity-90" />

        {/* Top Maneuver & Distance Info Card */}
        <div className="flex items-center justify-between gap-3">
          {/* Large Turn Maneuver Icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#191C1F] border border-[#2B2F33] flex-shrink-0 shadow-lg">
            {renderManeuverIcon(maneuver)}
          </div>

          {/* Turn Instruction & Road Name */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-xs uppercase font-black text-[#FFD400] tracking-wider font-display">
                {progress.status === 'rerouting' ? 'REROUTING OFFLINE...' : getManeuverTitle(maneuver)}
              </span>
              <span className="text-xl font-black text-[#F5F7F8] tracking-tight font-display">
                in {formatDistance(distance)}
              </span>
            </div>

            <p className="text-sm font-bold text-[#F5F7F8] truncate mt-0.5">
              {instruction?.roadName || 'MG Road / Outer Ring Link'}
            </p>

            <span className="text-[11px] text-[#A4A9AE] truncate block">
              {instruction?.instruction || 'Continue on route'}
            </span>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Voice Command Button */}
            <button
              onClick={onOpenVoice}
              title="Voice navigation"
              className="p-2.5 rounded-xl bg-[#FFD400] hover:bg-[#e6bf00] text-black shadow-md transition-colors"
            >
              <Mic size={17} />
            </button>

            {/* Mute Voice */}
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute voice' : 'Mute voice'}
              className="p-2.5 rounded-xl bg-[#191C1F] hover:bg-[#22262A] text-[#A4A9AE] hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} className="text-[#FFD400]" />}
            </button>

            {/* Reroute */}
            <button
              onClick={onReroute}
              title="Recalculate route"
              className="p-2.5 rounded-xl bg-[#191C1F] hover:bg-[#22262A] text-[#A4A9AE] hover:text-white transition-colors"
            >
              <RotateCcw size={17} className={progress.status === 'rerouting' ? 'animate-spin text-[#F59E0B]' : ''} />
            </button>

            {/* Cancel Navigation */}
            <button
              onClick={onStopNav}
              title="Exit navigation"
              className="p-2.5 rounded-xl bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/30 transition-colors"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Lane Guidance Indicators if present */}
        {instruction?.laneInfo && (
          <div className="flex items-center gap-1.5 pt-2 border-t border-[#2B2F33]">
            <span className="text-[10px] uppercase font-bold text-[#A4A9AE] tracking-wider mr-1">
              Lane Guidance:
            </span>
            {Array.from({ length: instruction.laneInfo.totalLanes }).map((_, idx) => {
              const isActive = instruction.laneInfo!.activeLanes.includes(idx);
              return (
                <div
                  key={idx}
                  className={`w-5 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-[#FFD400] text-black border border-white shadow-md'
                      : 'bg-[#191C1F] text-[#6F757B] border border-[#2B2F33]'
                  }`}
                >
                  ↑
                </div>
              );
            })}
          </div>
        )}

        {/* Navigation Status States Banner */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2B2F33] text-[11px] font-display">
          {/* Status 1-6 Pills */}
          <div className="flex items-center gap-1.5">
            {posState.isSensorAssisted ? (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/35 text-[#60A5FA] font-bold">
                <Cpu size={11} className="text-[#3B82F6] animate-pulse" />
                <span>SENSOR ASSISTED</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/35 text-[#4ADE80] font-bold">
                <CheckCircle2 size={11} className="text-[#22C55E]" />
                <span>GPS ACTIVE</span>
              </div>
            )}

            {isOffline && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/35 text-[#FBBF24] font-bold">
                <WifiOff size={11} className="text-[#F59E0B]" />
                <span>OFFLINE NAVIGATION</span>
              </div>
            )}
          </div>

          <span className="text-[#A4A9AE] truncate max-w-[130px] font-medium">
            To: {activeRoute?.destinationName}
          </span>
        </div>
      </div>
    </div>
  );
};
