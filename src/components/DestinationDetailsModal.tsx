import React from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Star, 
  Mic, 
  HardDrive 
} from 'lucide-react';
import { POI, Coordinates } from '../types';
import { getDistanceMeters } from '../engine/offlineRouter';

interface DestinationDetailsModalProps {
  poi: POI | null;
  isOpen: boolean;
  onClose: () => void;
  currentCoord: Coordinates;
  onStartRoute: (poi: POI) => void;
  onToggleSave: (poi: POI) => void;
  onOpenVoice: () => void;
}

export const DestinationDetailsModal: React.FC<DestinationDetailsModalProps> = ({
  poi,
  isOpen,
  onClose,
  currentCoord,
  onStartRoute,
  onToggleSave,
  onOpenVoice,
}) => {
  if (!isOpen || !poi) return null;

  const distanceMeters = getDistanceMeters(currentCoord, poi.coordinate);
  const distanceKm = (distanceMeters / 1000).toFixed(1);
  const durationMins = Math.ceil((distanceMeters / 12) / 60); // ~43 km/h avg

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#111315] border border-[#2B2F33] rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#FFD400]/15 text-[#FFD400]">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F5F7F8] font-display">
                {poi.name}
              </h2>
              <p className="text-xs text-[#A4A9AE] mt-0.5">{poi.address}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#191C1F] hover:bg-[#22262A] text-[#A4A9AE] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Telemetry Summary */}
        <div className="grid grid-cols-3 gap-2 text-center font-display">
          <div className="p-2.5 rounded-2xl bg-[#191C1F] border border-[#2B2F33]">
            <span className="text-[10px] text-[#A4A9AE] uppercase font-bold block">Distance</span>
            <span className="text-sm font-black text-[#F5F7F8] block mt-0.5">{distanceKm} km</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#191C1F] border border-[#2B2F33]">
            <span className="text-[10px] text-[#A4A9AE] uppercase font-bold block">Estimated Time</span>
            <span className="text-sm font-black text-[#F5F7F8] block mt-0.5">{durationMins} min</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#191C1F] border border-[#2B2F33]">
            <span className="text-[10px] text-[#A4A9AE] uppercase font-bold block">Map Cache</span>
            <span className="text-[11px] font-black text-[#22C55E] block mt-0.5">Offline Ready</span>
          </div>
        </div>

        {/* Route Availability Banner */}
        <div className="p-3 rounded-2xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <HardDrive size={15} className="text-[#FFD400]" />
            <span className="text-[#F5F7F8] font-semibold">Available Route via Offline Road Graph</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 font-display">
            100% OFFLINE
          </span>
        </div>

        {/* Primary CTA & Secondary Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Primary CTA: START ROUTE */}
          <button
            onClick={() => {
              onClose();
              onStartRoute(poi);
            }}
            className="w-full py-3.5 rounded-2xl bg-[#FFD400] hover:bg-[#e6bf00] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[rgba(255,212,0,0.25)] transition-all font-display"
          >
            <Navigation size={17} className="fill-black" />
            <span>START ROUTE</span>
          </button>

          {/* Secondary Actions: Save Location & Voice Navigation */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onToggleSave(poi)}
              className="py-2.5 rounded-xl bg-[#191C1F] hover:bg-[#22262A] text-xs font-semibold text-[#F5F7F8] border border-[#2B2F33] flex items-center justify-center gap-1.5 transition-colors font-display"
            >
              <Star size={14} className={poi.isSaved ? "fill-[#FFD400] text-[#FFD400]" : "text-[#A4A9AE]"} />
              <span>{poi.isSaved ? 'Saved Destination' : 'Save Location'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenVoice();
              }}
              className="py-2.5 rounded-xl bg-[#191C1F] hover:bg-[#22262A] text-xs font-semibold text-[#F5F7F8] border border-[#2B2F33] flex items-center justify-center gap-1.5 transition-colors font-display"
            >
              <Mic size={14} className="text-[#FFD400]" />
              <span>Voice Navigation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
