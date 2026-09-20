import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Radio, 
  Cpu, 
  RotateCcw, 
  Zap, 
  Sliders, 
  CheckCircle2, 
  X,
  Sparkles
} from 'lucide-react';
import { GPSQuality, PositionState, BatteryState } from '../types';
import { NavigationProgress } from '../engine/navigationController';

interface DemoSimulationBarProps {
  isOffline: boolean;
  onToggleInternet: () => void;
  posState: PositionState;
  onSetGpsQuality: (quality: GPSQuality) => void;
  onSimulateMissedTurn: () => void;
  batteryState: BatteryState;
  onSetBatteryLevel: (level: number) => void;
  onToggleUltraMode: () => void;
  navProgress: NavigationProgress;
  onRunAutoDemoStep: (stepNumber: number) => void;
}

export const DemoSimulationBar: React.FC<DemoSimulationBarProps> = ({
  isOffline,
  onToggleInternet,
  posState,
  onSetGpsQuality,
  onSimulateMissedTurn,
  batteryState,
  onSetBatteryLevel,
  onToggleUltraMode,
  navProgress,
  onRunAutoDemoStep
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const demoStepsList = [
    { step: 1, title: 'Boot & Splash', desc: 'System check & offline map verification' },
    { step: 2, title: 'Offline Regions', desc: 'View local regional packages' },
    { step: 3, title: 'Destination Select', desc: 'Pick target waypoint (College)' },
    { step: 4, title: 'Calculate Route', desc: 'Compute local graph Dijkstra path' },
    { step: 5, title: 'Start Navigation', desc: 'Turn-by-turn guidance mode' },
    { step: 6, title: 'Drop Internet', desc: 'Simulate connection blackout' },
    { step: 9, title: 'GPS Lost / IMU', desc: 'Switch to 6-DOF sensor dead reckoning' },
    { step: 11, title: 'Missed Turn', desc: 'Instant local offline rerouting' },
    { step: 13, title: 'GPS Restored', desc: 'Satellite sync & track correction' },
    { step: 15, title: 'Voice AI Command', desc: 'Hands-free voice recognition' },
    { step: 18, title: 'Low Battery Mode', desc: 'Ultra Nav OLED power optimization' }
  ];

  return (
    <>
      {/* Non-intrusive Floating Trigger Pill */}
      <div className="w-full px-4 py-2 flex items-center justify-between z-30 select-none bg-[#08090A]/80 backdrop-blur-md border-t border-[#2B2F33]/60">
        <div className="flex items-center gap-2 text-xs text-[#A4A9AE]">
          <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'}`} />
          <span className="text-[11px] font-mono">
            {isOffline ? 'OFFLINE GRAPH' : 'ONLINE MAPPING'} • {posState.isSensorAssisted ? 'IMU SENSORS' : 'GPS STABLE'}
          </span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#191C1F] hover:bg-[#22262A] text-xs font-bold text-[#FFD400] border border-[#2B2F33] hover:border-[#FFD400]/40 transition-all active:scale-95 font-display cursor-pointer"
        >
          <Sliders size={13} />
          <span>Experience NavX</span>
        </button>
      </div>

      {/* Experience NavX Simulation Modal / Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 select-none">
          <div className="w-full max-w-lg bg-[#111315] border border-[#2B2F33] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#2B2F33] flex items-center justify-between bg-[#191C1F]/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FFD400] flex items-center justify-center text-black font-black text-xs font-display">
                  <Sliders size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#F5F7F8] uppercase tracking-wider font-display">
                    EXPERIENCE NAVX
                  </h3>
                  <p className="text-[10px] text-[#A4A9AE]">Interactive Feature Simulation</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#191C1F] hover:bg-[#22262A] border border-[#2B2F33] flex items-center justify-center text-[#A4A9AE] hover:text-[#F5F7F8] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Simulation Controls Grid */}
            <div className="p-5 overflow-y-auto space-y-5">
              
              {/* 1. Internet Simulation */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                <div className="flex items-center gap-3">
                  {isOffline ? <WifiOff size={18} className="text-[#F59E0B]" /> : <Wifi size={18} className="text-[#22C55E]" />}
                  <div>
                    <div className="text-xs font-bold text-[#F5F7F8] font-display">Internet Connectivity</div>
                    <div className="text-[10px] text-[#6F757B]">Test local offline graph vs cloud</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-display">
                  <button
                    onClick={() => { if (isOffline) onToggleInternet(); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      !isOffline
                        ? 'bg-[#22C55E] text-black shadow-md'
                        : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33] hover:text-[#F5F7F8]'
                    }`}
                  >
                    ONLINE
                  </button>
                  <button
                    onClick={() => { if (!isOffline) onToggleInternet(); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isOffline
                        ? 'bg-[#F59E0B] text-black shadow-md'
                        : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33] hover:text-[#F5F7F8]'
                    }`}
                  >
                    OFFLINE
                  </button>
                </div>
              </div>

              {/* 2. GPS Signal State */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                <div className="flex items-center gap-3">
                  {posState.isSensorAssisted ? <Cpu size={18} className="text-[#3B82F6]" /> : <Radio size={18} className="text-[#22C55E]" />}
                  <div>
                    <div className="text-xs font-bold text-[#F5F7F8] font-display">GPS Signal Status</div>
                    <div className="text-[10px] text-[#6F757B]">Test IMU sensor fusion dead reckoning</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-display">
                  <button
                    onClick={() => onSetGpsQuality('strong')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      !posState.isSensorAssisted
                        ? 'bg-[#22C55E] text-black shadow-md'
                        : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33] hover:text-[#F5F7F8]'
                    }`}
                  >
                    NORMAL
                  </button>
                  <button
                    onClick={() => onSetGpsQuality('weak')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      posState.isSensorAssisted
                        ? 'bg-[#3B82F6] text-white shadow-md'
                        : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33] hover:text-[#F5F7F8]'
                    }`}
                  >
                    SIGNAL LOST
                  </button>
                </div>
              </div>

              {/* 3. Navigation Turn Simulation */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                <div className="flex items-center gap-3">
                  <RotateCcw size={18} className="text-purple-400" />
                  <div>
                    <div className="text-xs font-bold text-[#F5F7F8] font-display">Navigation Route</div>
                    <div className="text-[10px] text-[#6F757B]">Test sub-50ms offline recalculation</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-display">
                  <button
                    onClick={onSimulateMissedTurn}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <RotateCcw size={12} className={navProgress.status === 'rerouting' ? 'animate-spin' : ''} />
                    <span>MISSED TURN</span>
                  </button>
                </div>
              </div>

              {/* 4. Battery Simulation */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                <div className="flex items-center gap-3">
                  <Zap size={18} className={batteryState.isLowBattery ? 'text-[#EF4444]' : 'text-[#22C55E]'} />
                  <div>
                    <div className="text-xs font-bold text-[#F5F7F8] font-display">Battery Level ({Math.round(batteryState.level * 100)}%)</div>
                    <div className="text-[10px] text-[#6F757B]">Test low battery triggers</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-display">
                  <button
                    onClick={() => onSetBatteryLevel(0.85)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      !batteryState.isLowBattery
                        ? 'bg-[#22C55E] text-black shadow-md'
                        : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33]'
                    }`}
                  >
                    NORMAL
                  </button>
                  <button
                    onClick={() => onSetBatteryLevel(0.15)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      batteryState.isLowBattery
                        ? 'bg-[#EF4444] text-white shadow-md'
                        : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33]'
                    }`}
                  >
                    LOW (15%)
                  </button>
                </div>
              </div>

              {/* 5. Ultra Navigation Mode */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                <div className="flex items-center gap-3">
                  <Zap size={18} className="text-[#FFD400]" />
                  <div>
                    <div className="text-xs font-bold text-[#F5F7F8] font-display">Ultra Navigation Mode</div>
                    <div className="text-[10px] text-[#6F757B]">OLED pitch-black high contrast power saver</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-display">
                  <button
                    onClick={() => { if (batteryState.isUltraMode) onToggleUltraMode(); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      !batteryState.isUltraMode
                        ? 'bg-[#191C1F] text-[#F5F7F8] border border-[#2B2F33]'
                        : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33]'
                    }`}
                  >
                    OFF
                  </button>
                  <button
                    onClick={() => { if (!batteryState.isUltraMode) onToggleUltraMode(); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      batteryState.isUltraMode
                        ? 'bg-[#FFD400] text-black font-extrabold shadow-md'
                        : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33]'
                    }`}
                  >
                    ON
                  </button>
                </div>
              </div>

              {/* Judge Walkthrough Quick-Runner */}
              <div className="pt-2 border-t border-[#2B2F33]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#A4A9AE] font-display mb-3">
                  <Sparkles size={14} className="text-[#FFD400]" />
                  <span>Interactive Judging Scenario Runner</span>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {demoStepsList.map((item) => (
                    <button
                      key={item.step}
                      onClick={() => {
                        setActiveStep(item.step);
                        onRunAutoDemoStep(item.step);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        activeStep === item.step
                          ? 'bg-[#FFD400]/15 border-[#FFD400] text-[#F5F7F8]'
                          : 'bg-[#08090A] border-[#2B2F33] hover:border-[#FFD400]/40 text-[#A4A9AE]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F5F7F8] font-display">
                          {item.step}. {item.title}
                        </span>
                        <CheckCircle2 size={12} className={activeStep === item.step ? 'text-[#FFD400]' : 'text-[#6F757B]'} />
                      </div>
                      <p className="text-[10px] text-[#A4A9AE] mt-0.5 line-clamp-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer Close */}
            <div className="p-4 border-t border-[#2B2F33] bg-[#191C1F]/60 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#FFD400] text-black font-bold text-xs font-display hover:bg-[#ffe033] transition-colors"
              >
                Close & Return to Navigation
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
