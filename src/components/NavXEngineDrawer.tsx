import React, { useState } from 'react';
import { 
  X, 
  Wifi, 
  WifiOff, 
  Radio, 
  Cpu, 
  RotateCcw, 
  Zap, 
  Layers, 
  Mic, 
  Activity, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { GPSQuality, PositionState, BatteryState } from '../types';
import { NavigationProgress } from '../engine/navigationController';

interface NavXEngineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

export const NavXEngineDrawer: React.FC<NavXEngineDrawerProps> = ({
  isOpen,
  onClose,
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
  const [activeTab, setActiveTab] = useState<'usp' | 'simulation'>('usp');
  const [activeStep, setActiveStep] = useState<number | null>(null);

  if (!isOpen) return null;

  const uspFeatures = [
    {
      icon: Layers,
      color: 'text-[#FFD400]',
      title: 'Offline-First Navigation',
      description: 'Zero-data graph routing using compressed local regional topology packages.',
      status: isOffline ? 'Active (Offline Graph)' : 'Ready in Storage'
    },
    {
      icon: Activity,
      color: 'text-[#3B82F6]',
      title: '6-DOF Sensor Fusion',
      description: 'Fuses Accelerometer + Gyroscope + Compass when satellite reception drops.',
      status: posState.isSensorAssisted ? 'IMU Dead Reckoning Active' : 'Satellite Fix Synchronized'
    },
    {
      icon: RotateCcw,
      color: 'text-[#22C55E]',
      title: 'Instant Offline Rerouting',
      description: 'Sub-50ms alternative path calculation without waiting for server response.',
      status: navProgress.status === 'rerouting' ? 'Recalculating...' : 'Dijkstra Local Solver'
    },
    {
      icon: Mic,
      color: 'text-[#3B82F6]',
      title: 'Natural AI Voice Guidance',
      description: 'Hands-free speech commands parsed locally with offline text-to-speech.',
      status: 'Voice Engine Ready'
    },
    {
      icon: Zap,
      color: 'text-[#FFD400]',
      title: 'Ultra Navigation Mode',
      description: 'OLED pitch-black high contrast UI for power preservation on long trips.',
      status: batteryState.isUltraMode ? 'Ultra Mode Active' : `${Math.round(batteryState.level * 100)}% Battery`
    }
  ];

  const simulationSteps = [
    { step: 1, title: 'Boot & Splash', desc: 'System check & offline map verification' },
    { step: 2, title: 'Offline Regions', desc: 'View local regional packages' },
    { step: 3, title: 'Destination Select', desc: 'Pick College / Innovation Hub' },
    { step: 4, title: 'Calculate Route', desc: 'Compute local graph Dijkstra path' },
    { step: 5, title: 'Start Navigation', desc: 'Turn-by-turn guidance mode' },
    { step: 6, title: 'Internet Offline', desc: 'Simulate connection blackout' },
    { step: 9, title: 'GPS Lost / IMU', desc: 'Switch to 6-DOF sensor dead reckoning' },
    { step: 11, title: 'Missed Turn', desc: 'Instant local offline rerouting' },
    { step: 13, title: 'GPS Restored', desc: 'Satellite sync & track correction' },
    { step: 18, title: 'Ultra Navigation', desc: 'OLED power preservation' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#111315] border border-[#2B2F33] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#2B2F33] flex items-center justify-between bg-[#191C1F]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFD400] flex items-center justify-center text-black font-black text-xs font-display">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#F5F7F8] uppercase tracking-wider font-display">
                NAVX TECHNOLOGY & SIMULATION
              </h3>
              <p className="text-[10px] text-[#A4A9AE]">Core Differentiators & Interactive Testing</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#191C1F] hover:bg-[#22262A] border border-[#2B2F33] flex items-center justify-center text-[#A4A9AE] hover:text-[#F5F7F8] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher: USPs vs Simulation Controls */}
        <div className="flex border-b border-[#2B2F33] bg-[#08090A] p-1 font-display">
          <button
            onClick={() => setActiveTab('usp')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'usp'
                ? 'bg-[#191C1F] text-[#FFD400] shadow-sm'
                : 'text-[#A4A9AE] hover:text-[#F5F7F8]'
            }`}
          >
            Core USPs (5 Features)
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'simulation'
                ? 'bg-[#191C1F] text-[#FFD400] shadow-sm'
                : 'text-[#A4A9AE] hover:text-[#F5F7F8]'
            }`}
          >
            Interactive Simulation
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* TAB 1: Core USPs */}
          {activeTab === 'usp' && (
            <div className="space-y-3">
              {uspFeatures.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={i} 
                    className="p-3.5 rounded-2xl bg-[#08090A] border border-[#2B2F33] hover:border-[#FFD400]/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl bg-[#191C1F] ${item.color} flex-shrink-0 mt-0.5`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#F5F7F8] font-display">{item.title}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33]">
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#A4A9AE] mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Interactive Simulation Controls */}
          {activeTab === 'simulation' && (
            <div className="space-y-3">
              {/* 1. Internet Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                <div className="flex items-center gap-2.5">
                  {isOffline ? <WifiOff size={16} className="text-[#F59E0B]" /> : <Wifi size={16} className="text-[#22C55E]" />}
                  <div>
                    <span className="text-xs font-bold text-[#F5F7F8] block font-display">Internet Connectivity</span>
                    <span className="text-[10px] text-[#6F757B]">Local offline graph vs online</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-display">
                  <button
                    onClick={() => { if (isOffline) onToggleInternet(); }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      !isOffline ? 'bg-[#22C55E] text-black' : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33]'
                    }`}
                  >
                    ONLINE
                  </button>
                  <button
                    onClick={() => { if (!isOffline) onToggleInternet(); }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      isOffline ? 'bg-[#F59E0B] text-black' : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33]'
                    }`}
                  >
                    OFFLINE
                  </button>
                </div>
              </div>

              {/* 2. GPS Signal Quality */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                <div className="flex items-center gap-2.5">
                  {posState.isSensorAssisted ? <Cpu size={16} className="text-[#3B82F6]" /> : <Radio size={16} className="text-[#22C55E]" />}
                  <div>
                    <span className="text-xs font-bold text-[#F5F7F8] block font-display">GPS Satellite Status</span>
                    <span className="text-[10px] text-[#6F757B]">6-DOF IMU Dead Reckoning</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-display">
                  <button
                    onClick={() => onSetGpsQuality('strong')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      !posState.isSensorAssisted ? 'bg-[#22C55E] text-black' : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33]'
                    }`}
                  >
                    NORMAL
                  </button>
                  <button
                    onClick={() => onSetGpsQuality('weak')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      posState.isSensorAssisted ? 'bg-[#3B82F6] text-white' : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33]'
                    }`}
                  >
                    SIGNAL LOST
                  </button>
                </div>
              </div>

              {/* 3. Missed Turn */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                <div className="flex items-center gap-2.5">
                  <RotateCcw size={16} className="text-purple-400" />
                  <div>
                    <span className="text-xs font-bold text-[#F5F7F8] block font-display">Simulate Missed Turn</span>
                    <span className="text-[10px] text-[#6F757B]">Instant sub-50ms local reroute</span>
                  </div>
                </div>
                <button
                  onClick={onSimulateMissedTurn}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-display flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <RotateCcw size={12} className={navProgress.status === 'rerouting' ? 'animate-spin' : ''} />
                  <span>TRIGGER</span>
                </button>
              </div>

              {/* 4. Ultra Navigation Mode & Battery Level */}
              <div className="p-3 rounded-2xl bg-[#08090A] border border-[#2B2F33] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Zap size={16} className="text-[#FFD400]" />
                    <div>
                      <span className="text-xs font-bold text-[#F5F7F8] block font-display">Ultra Navigation Mode</span>
                      <span className="text-[10px] text-[#6F757B]">OLED pitch-black power saver</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-display">
                    <button
                      onClick={() => { if (batteryState.isUltraMode) onToggleUltraMode(); }}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        !batteryState.isUltraMode ? 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33]' : 'bg-[#191C1F] text-[#A4A9AE]'
                      }`}
                    >
                      OFF
                    </button>
                    <button
                      onClick={() => { if (!batteryState.isUltraMode) onToggleUltraMode(); }}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        batteryState.isUltraMode ? 'bg-[#FFD400] text-black' : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33]'
                      }`}
                    >
                      ON
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#2B2F33]/60 text-xs">
                  <span className="text-[#A4A9AE]">Simulate Battery ({Math.round(batteryState.level * 100)}%):</span>
                  <input
                    type="range"
                    min="0.05"
                    max="1.0"
                    step="0.05"
                    value={batteryState.level}
                    onChange={(e) => onSetBatteryLevel(parseFloat(e.target.value))}
                    className="w-32 accent-[#FFD400] cursor-pointer"
                  />
                </div>
              </div>

              {/* Scenario Quick Runner */}
              <div className="pt-2 border-t border-[#2B2F33]">
                <span className="text-xs font-bold text-[#A4A9AE] block mb-2 font-display">
                  Automated Scenarios:
                </span>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {simulationSteps.map((item) => (
                    <button
                      key={item.step}
                      onClick={() => {
                        setActiveStep(item.step);
                        onRunAutoDemoStep(item.step);
                      }}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        activeStep === item.step
                          ? 'bg-[#FFD400]/15 border-[#FFD400] text-[#F5F7F8]'
                          : 'bg-[#08090A] border-[#2B2F33] hover:border-[#FFD400]/40 text-[#A4A9AE]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F5F7F8] font-display">
                          {item.step}. {item.title}
                        </span>
                        <CheckCircle2 size={11} className={activeStep === item.step ? 'text-[#FFD400]' : 'text-[#6F757B]'} />
                      </div>
                      <p className="text-[10px] text-[#A4A9AE] mt-0.5 line-clamp-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Close */}
        <div className="p-3.5 border-t border-[#2B2F33] bg-[#191C1F]/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#FFD400] hover:bg-[#ffe033] text-black font-bold text-xs font-display transition-colors cursor-pointer"
          >
            Return to Map
          </button>
        </div>

      </div>
    </div>
  );
};
