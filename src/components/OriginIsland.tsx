import React, { useState } from 'react';
import { 
  Navigation, 
  CornerUpLeft, 
  CornerUpRight, 
  ArrowUp, 
  Compass, 
  WifiOff, 
  Cpu, 
  BatteryCharging, 
  Battery, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';
import { ManeuverType, PositionState, BatteryState } from '../types';
import { NavigationProgress } from '../engine/navigationController';

interface OriginIslandProps {
  navProgress: NavigationProgress;
  posState: PositionState;
  batteryState: BatteryState;
  isOffline: boolean;
  onToggleUltraMode?: () => void;
}

export const OriginIsland: React.FC<OriginIslandProps> = ({
  navProgress,
  posState,
  batteryState,
  isOffline,
  onToggleUltraMode,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getManeuverIcon = (type: ManeuverType, size = 16) => {
    switch (type) {
      case 'turn-left':
      case 'sharp-left':
        return <CornerUpLeft size={size} className="text-[#FFD400]" />;
      case 'turn-right':
      case 'sharp-right':
        return <CornerUpRight size={size} className="text-[#FFD400]" />;
      case 'slight-left':
        return <CornerUpLeft size={size} className="text-[#FFD400] -rotate-12" />;
      case 'slight-right':
        return <CornerUpRight size={size} className="text-[#FFD400] rotate-12" />;
      case 'arrive':
        return <Navigation size={size} className="text-[#22C55E]" />;
      default:
        return <ArrowUp size={size} className="text-[#FFD400]" />;
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.ceil(seconds / 60);
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      return `${hrs}h ${mins % 60}m`;
    }
    return `${mins} min`;
  };

  const isNavigating = navProgress.status === 'navigating' || navProgress.status === 'rerouting';
  const maneuver = navProgress.currentInstruction?.maneuver || 'straight';
  const instruction = navProgress.currentInstruction?.instruction || 'Proceed along route';
  const distanceToTurn = navProgress.distanceToNextTurnMeters;

  return (
    <div className="relative z-50 flex flex-col items-center w-full px-4 pt-2 select-none">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`cursor-pointer transition-all duration-300 ease-out backdrop-blur-xl ${
          batteryState.isUltraMode
            ? 'bg-black border border-[#2B2F33] text-white rounded-2xl shadow-none'
            : 'bg-[#111315]/95 border border-[#2B2F33] hover:border-[#FFD400]/50 text-white rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.65)]'
        } ${isExpanded ? 'w-full max-w-md !rounded-3xl p-4' : 'w-auto px-4 py-2 flex items-center gap-3'}`}
      >
        {/* COLLAPSED FLOATING PILL */}
        {!isExpanded ? (
          <div className="flex items-center gap-3">
            {/* Pulsing Origin Island dot */}
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#FFD400] animate-pulse" />
              <span className="text-[10px] font-black tracking-wider uppercase text-[#F5F7F8] font-display">
                Origin Island
              </span>
            </div>

            <div className="h-3 w-px bg-[#2B2F33]" />

            {/* Navigation Instruction Preview */}
            {isNavigating ? (
              <div className="flex items-center gap-2 font-display">
                <div className="p-1 rounded-full bg-[#191C1F]">
                  {getManeuverIcon(maneuver, 13)}
                </div>
                <span className="text-xs font-bold text-[#F5F7F8]">
                  {formatDistance(distanceToTurn)}
                </span>
                <span className="text-[10px] text-[#A4A9AE] truncate max-w-[100px]">
                  {navProgress.currentInstruction?.roadName || 'Next turn'}
                </span>
              </div>
            ) : (
              <span className="text-xs text-[#A4A9AE] font-medium">
                IQOO NavX Active
              </span>
            )}

            <div className="h-3 w-px bg-[#2B2F33]" />

            {/* Status indicators */}
            <div className="flex items-center gap-1.5 text-[10px] font-display">
              {isOffline && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 font-bold">
                  <WifiOff size={9} />
                  <span>OFFLINE</span>
                </div>
              )}

              {posState.isSensorAssisted && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#3B82F6]/15 text-[#60A5FA] border border-[#3B82F6]/30 font-bold">
                  <Cpu size={9} />
                  <span>IMU</span>
                </div>
              )}

              <div className="flex items-center gap-1 text-[#A4A9AE]">
                {batteryState.isCharging ? (
                  <BatteryCharging size={12} className="text-[#22C55E]" />
                ) : (
                  <Battery size={12} className={batteryState.isLowBattery ? "text-[#EF4444]" : "text-[#A4A9AE]"} />
                )}
                <span>{Math.round(batteryState.level * 100)}%</span>
              </div>
            </div>

            <ChevronDown size={13} className="text-[#A4A9AE]" />
          </div>
        ) : (
          /* EXPANDED NATIVE-LIKE FLOATING CARD */
          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2B2F33] pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FFD400]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#F5F7F8] font-display">
                  Origin Island Live Status
                </span>
              </div>

              <div className="flex items-center gap-2">
                {batteryState.isUltraMode && (
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#FFD400] text-black font-display">
                    Ultra Nav Mode
                  </span>
                )}
                <ChevronUp size={15} className="text-[#A4A9AE]" />
              </div>
            </div>

            {/* Instruction Card */}
            <div className="flex items-start gap-3 bg-[#191C1F] p-3 rounded-2xl border border-[#2B2F33]">
              <div className="p-2.5 rounded-xl bg-[#22262A] flex-shrink-0">
                {getManeuverIcon(maneuver, 24)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-black text-[#F5F7F8] font-display">
                    {formatDistance(distanceToTurn)}
                  </span>
                  <span className="text-xs text-[#FFD400] font-bold uppercase tracking-wide font-display">
                    {navProgress.status === 'rerouting' ? 'Recalculating...' : 'Next Turn'}
                  </span>
                </div>
                <p className="text-xs text-[#A4A9AE] font-medium line-clamp-2 mt-0.5">
                  {instruction}
                </p>
              </div>
            </div>

            {/* Telemetry Row */}
            <div className="grid grid-cols-4 gap-1.5 text-center font-display">
              <div className="p-2 rounded-xl bg-[#191C1F] border border-[#2B2F33]">
                <span className="text-[9px] text-[#A4A9AE] uppercase font-bold block">ETA</span>
                <span className="text-xs font-black text-[#F5F7F8]">
                  {formatTime(navProgress.remainingDurationSeconds)}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-[#191C1F] border border-[#2B2F33]">
                <span className="text-[9px] text-[#A4A9AE] uppercase font-bold block">Remaining</span>
                <span className="text-xs font-black text-[#F5F7F8]">
                  {formatDistance(navProgress.remainingDistanceMeters)}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-[#191C1F] border border-[#2B2F33]">
                <span className="text-[9px] text-[#A4A9AE] uppercase font-bold block">Speed</span>
                <span className="text-xs font-black text-[#F5F7F8]">
                  {Math.round(posState.speed * 3.6)} km/h
                </span>
              </div>

              <div className="p-2 rounded-xl bg-[#191C1F] border border-[#2B2F33]">
                <span className="text-[9px] text-[#A4A9AE] uppercase font-bold block">Mode</span>
                <span className={`text-[10px] font-bold ${posState.isSensorAssisted ? 'text-[#3B82F6]' : 'text-[#22C55E]'}`}>
                  {posState.isSensorAssisted ? 'IMU Sensor' : 'GPS Active'}
                </span>
              </div>
            </div>

            {/* Alert if off route or sensor active */}
            {posState.isSensorAssisted && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 text-[10px]">
                <Cpu size={13} className="text-[#3B82F6] flex-shrink-0" />
                <span>GPS weak — 6-DOF IMU dead reckoning active.</span>
              </div>
            )}

            {navProgress.isOffRouteDetected && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[10px]">
                <ShieldAlert size={13} className="text-[#F59E0B] flex-shrink-0" />
                <span>Missed turn — Instant offline rerouting engaged.</span>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-[10px] text-[#A4A9AE]">
                <Compass size={12} className="text-[#A4A9AE]" />
                <span>Heading: {Math.round(posState.heading)}°</span>
              </div>

              {onToggleUltraMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleUltraMode();
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all font-display ${
                    batteryState.isUltraMode
                      ? 'bg-[#22262A] text-white border border-[#2B2F33]'
                      : 'bg-[#FFD400] text-black hover:bg-[#e6bf00]'
                  }`}
                >
                  <Zap size={12} />
                  <span>{batteryState.isUltraMode ? 'Exit Ultra Mode' : 'Ultra Nav Mode'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
