import React from 'react';
import { Route, RouteContextInfo } from '../types';
import { 
  Play, 
  X, 
  MapPin, 
  Clock, 
  Milestone, 
  ShieldCheck, 
  WifiOff, 
  CreditCard, 
  AlertTriangle, 
  RadioTower, 
  ShieldAlert 
} from 'lucide-react';

interface RoutePreviewCardProps {
  route: Route;
  onStartNavigation: () => void;
  onCancel: () => void;
}

export const RoutePreviewCard: React.FC<RoutePreviewCardProps> = ({
  route,
  onStartNavigation,
  onCancel,
}) => {
  const distanceKm = (route.totalDistanceMeters / 1000).toFixed(1);
  const durationMins = Math.ceil(route.totalDurationSeconds / 60);

  const context: RouteContextInfo = route.context || {
    isHighway: false,
    isToll: false,
    isUnpaved: false,
    isRestricted: false,
    hasRoadClosure: false,
    isPoorConnectivityZone: false,
    details: [],
  };

  return (
    <div className="w-full px-4 pb-2 z-40 select-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-4 rounded-3xl bg-[#111315]/95 backdrop-blur-xl border border-[#2B2F33] shadow-2xl space-y-3.5">
        {/* Header: Destination & Close */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 pr-2">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A4A9AE]">
              <div className="w-2 h-2 rounded-full bg-[#6F757B]" />
              <span className="truncate max-w-[190px]">From: {route.originName || 'Current Location'}</span>
            </div>

            <div className="flex items-center gap-2 text-base font-bold text-[#F5F7F8] font-display">
              <MapPin size={17} className="text-[#FFD400] flex-shrink-0" />
              <span className="truncate">{route.destinationName}</span>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 rounded-full bg-[#191C1F] hover:bg-[#22262A] text-[#A4A9AE] hover:text-[#F5F7F8] transition-colors"
            title="Cancel Preview"
          >
            <X size={16} />
          </button>
        </div>

        {/* Telemetry Bar: Distance & ETA & Offline Tag */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#191C1F] border border-[#2B2F33]">
          <div className="flex items-baseline gap-3">
            <div>
              <span className="text-2xl font-black text-[#F5F7F8] font-display tracking-tight">
                {distanceKm}
              </span>
              <span className="text-xs text-[#A4A9AE] ml-1 font-semibold">km</span>
            </div>

            <div className="flex items-center gap-1 text-[#F5F7F8] text-xs font-semibold">
              <Clock size={13} className="text-[#FFD400]" />
              <span>{durationMins} min</span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase font-display bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
            {route.isOffline ? (
              <>
                <WifiOff size={11} className="text-[#F59E0B]" />
                <span className="text-[#F59E0B]">Offline Map Available</span>
              </>
            ) : (
              <>
                <ShieldCheck size={11} className="text-[#22C55E]" />
                <span>Online Route</span>
              </>
            )}
          </div>
        </div>

        {/* Factual Route Context Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A4A9AE] font-display">
            Route Context:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {context.isHighway && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-[10px] font-semibold text-blue-300">
                <Milestone size={11} className="text-blue-400" />
                <span>Highway (NH-44)</span>
              </div>
            )}

            {context.isToll && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[10px] font-semibold text-purple-300">
                <CreditCard size={11} className="text-purple-400" />
                <span>Toll Road</span>
              </div>
            )}

            {context.isPoorConnectivityZone && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-[10px] font-semibold text-rose-300">
                <RadioTower size={11} className="text-rose-400" />
                <span>Poor-Connectivity Underpass</span>
              </div>
            )}

            {context.isUnpaved && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-[10px] font-semibold text-amber-300">
                <AlertTriangle size={11} className="text-amber-400" />
                <span>Unpaved Road</span>
              </div>
            )}

            {context.hasRoadClosure && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-950/60 border border-red-500/50 text-[10px] font-semibold text-red-300">
                <ShieldAlert size={11} className="text-red-400" />
                <span>Road Closure Ahead</span>
              </div>
            )}
          </div>
        </div>

        {/* Primary CTA: START NAVIGATION (Large high-contrast yellow button) */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onCancel}
            className="px-4 py-3.5 rounded-2xl bg-[#191C1F] hover:bg-[#22262A] text-xs font-bold text-[#A4A9AE] hover:text-[#F5F7F8] transition-colors border border-[#2B2F33] font-display"
          >
            Cancel
          </button>

          <button
            onClick={onStartNavigation}
            className="flex-1 py-3.5 rounded-2xl bg-[#FFD400] hover:bg-[#e6bf00] text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[rgba(255,212,0,0.3)] transition-all font-display tracking-wide"
          >
            <Play size={16} className="fill-black" />
            <span>START NAVIGATION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
