import React from 'react';
import { RouteContextInfo } from '../types';
import { ShieldAlert, AlertTriangle, Milestone, CreditCard, RadioTower } from 'lucide-react';

interface RouteContextCardProps {
  context: RouteContextInfo;
}

export const RouteContextCard: React.FC<RouteContextCardProps> = ({ context }) => {
  if (!context || context.details.length === 0) return null;

  return (
    <div className="w-full px-4 select-none">
      <div className="p-3.5 rounded-2xl bg-[#111315]/95 backdrop-blur-md border border-[#2B2F33] space-y-2.5 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A4A9AE] font-display">
          <Milestone size={14} className="text-[#FFD400]" />
          <span>Factual Route Context</span>
        </div>

        {/* Badges Flow */}
        <div className="flex flex-wrap gap-1.5">
          {context.isHighway && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-[#3B82F6]/30 text-[11px] font-semibold text-blue-300">
              <Milestone size={12} className="text-[#3B82F6]" />
              <span>NH-44 Highway</span>
            </div>
          )}

          {context.isToll && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[11px] font-semibold text-purple-300">
              <CreditCard size={12} className="text-purple-400" />
              <span>Toll Road</span>
            </div>
          )}

          {context.isPoorConnectivityZone && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/40 text-[11px] font-semibold text-rose-300 animate-pulse">
              <RadioTower size={12} className="text-rose-400" />
              <span>Poor-Connectivity Underpass</span>
            </div>
          )}

          {context.isUnpaved && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-[#F59E0B]/30 text-[11px] font-semibold text-amber-300">
              <AlertTriangle size={12} className="text-[#F59E0B]" />
              <span>Unpaved Road</span>
            </div>
          )}

          {context.hasRoadClosure && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/60 border border-[#EF4444]/40 text-[11px] font-semibold text-red-300">
              <ShieldAlert size={12} className="text-[#EF4444]" />
              <span>Road Closure Ahead</span>
            </div>
          )}
        </div>

        {/* Factual bullet list */}
        <div className="space-y-1 pt-0.5">
          {context.details.map((detail, idx) => (
            <p key={idx} className="text-[11px] text-[#A4A9AE] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
              <span className="text-[#F5F7F8]">{detail}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
