import React, { useState } from 'react';
import { 
  ArrowLeft
} from 'lucide-react';
import { BatteryState } from '../types';

interface SettingsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  batteryState: BatteryState;
  onToggleUltraMode: (enable?: boolean) => void;
  isVoiceMuted: boolean;
  onToggleMute: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  isOpen,
  onClose,
  batteryState,
  onToggleUltraMode,
  isVoiceMuted,
  onToggleMute,
}) => {
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [useOfflineMaps, setUseOfflineMaps] = useState(true);
  const [units, setUnits] = useState<'km' | 'mi'>('km');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#08090A] text-[#F5F7F8] flex flex-col p-4 select-none animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-[#2B2F33]">
        <button
          onClick={onClose}
          className="p-2.5 rounded-2xl bg-[#191C1F] hover:bg-[#22262A] text-[#A4A9AE] hover:text-[#F5F7F8] transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#F5F7F8] font-display">
            Settings
          </h1>
          <p className="text-[10px] text-[#A4A9AE]">IQOO NavX Mobile Preferences</p>
        </div>
      </div>

      {/* Settings Sections List */}
      <div className="flex-1 overflow-y-auto space-y-4 py-3 pb-6">
        {/* Section: Navigation & Voice */}
        <div className="p-4 rounded-3xl bg-[#111315] border border-[#2B2F33] space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFD400] font-display">
            Navigation & Voice Guidance
          </span>

          <div className="flex items-center justify-between py-1 border-b border-[#2B2F33]">
            <div>
              <span className="text-xs font-bold text-[#F5F7F8] block">Voice Guidance</span>
              <span className="text-[11px] text-[#A4A9AE]">Spoken turn-by-turn prompts</span>
            </div>
            <button
              onClick={onToggleMute}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                !isVoiceMuted ? 'bg-[#FFD400]' : 'bg-[#22262A]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  !isVoiceMuted ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-xs font-bold text-[#F5F7F8] block">Avoid Toll Roads</span>
              <span className="text-[11px] text-[#A4A9AE]">Prefer free offline highway corridors</span>
            </div>
            <button
              onClick={() => setAvoidTolls(!avoidTolls)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                avoidTolls ? 'bg-[#FFD400]' : 'bg-[#22262A]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  avoidTolls ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section: Battery & Power Optimization */}
        <div className="p-4 rounded-3xl bg-[#111315] border border-[#2B2F33] space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFD400] font-display">
            Battery & Ultra Navigation
          </span>

          <div className="flex items-center justify-between py-1 border-b border-[#2B2F33]">
            <div>
              <span className="text-xs font-bold text-[#F5F7F8] block">Ultra Navigation Mode</span>
              <span className="text-[11px] text-[#A4A9AE]">OLED power-saving minimal HUD</span>
            </div>
            <button
              onClick={() => onToggleUltraMode()}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                batteryState.isUltraMode ? 'bg-[#FFD400]' : 'bg-[#22262A]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  batteryState.isUltraMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-1 text-xs">
            <span className="text-[#A4A9AE]">Current Battery Level:</span>
            <span className={`font-bold font-mono ${batteryState.isLowBattery ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
              {Math.round(batteryState.level * 100)}%
            </span>
          </div>
        </div>

        {/* Section: Offline Maps & Data */}
        <div className="p-4 rounded-3xl bg-[#111315] border border-[#2B2F33] space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFD400] font-display">
            Offline Maps & Units
          </span>

          <div className="flex items-center justify-between py-1 border-b border-[#2B2F33]">
            <div>
              <span className="text-xs font-bold text-[#F5F7F8] block">Use Offline Map Engine</span>
              <span className="text-[11px] text-[#A4A9AE]">Zero-data graph routing priority</span>
            </div>
            <button
              onClick={() => setUseOfflineMaps(!useOfflineMaps)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                useOfflineMaps ? 'bg-[#FFD400]' : 'bg-[#22262A]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  useOfflineMaps ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-xs font-bold text-[#F5F7F8] block">Distance Units</span>
              <span className="text-[11px] text-[#A4A9AE]">Kilometers vs Miles</span>
            </div>
            <div className="flex bg-[#191C1F] p-1 rounded-xl border border-[#2B2F33] font-display">
              <button
                onClick={() => setUnits('km')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  units === 'km' ? 'bg-[#FFD400] text-black' : 'text-[#A4A9AE]'
                }`}
              >
                km
              </button>
              <button
                onClick={() => setUnits('mi')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  units === 'mi' ? 'bg-[#FFD400] text-black' : 'text-[#A4A9AE]'
                }`}
              >
                mi
              </button>
            </div>
          </div>
        </div>

        {/* Section: About IQOO NavX */}
        <div className="p-4 rounded-3xl bg-[#111315] border border-[#2B2F33] space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFD400] font-display">
            About IQOO NavX
          </span>

          <div className="text-xs text-[#A4A9AE] space-y-1 pt-1">
            <div className="flex justify-between">
              <span>Application Version:</span>
              <span className="text-[#F5F7F8] font-mono">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Tagline:</span>
              <span className="text-[#FFD400] font-display italic">"Navigate. Even When It's Not Perfect."</span>
            </div>
            <div className="flex justify-between">
              <span>Platform:</span>
              <span className="text-[#F5F7F8]">iQOO Smartphone First</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
