import React, { useEffect, useState } from 'react';
import { Cpu, HardDrive, Zap } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState('Initializing offline map engine...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(35);
      setStepText('Loading offline road graph & POIs...');
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(75);
      setStepText('Calibrating 6-DOF IMU sensor fusion...');
    }, 900);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStepText('IQOO NavX Engine Ready');
    }, 1400);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-[#08090A] text-white flex flex-col items-center justify-between p-8 select-none font-sans">
      {/* Top Spacer */}
      <div className="w-full pt-6 flex justify-end">
        <button
          onClick={onComplete}
          className="text-xs text-[#A4A9AE] hover:text-[#FFD400] font-medium px-3 py-1 rounded-full bg-[#191C1F] border border-[#2B2F33] transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Center Branding & Tagline */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-xs animate-in fade-in zoom-in-95 duration-500">
        {/* iQOO Brand Mark */}
        <div className="w-16 h-16 rounded-2xl bg-[#FFD400] flex items-center justify-center font-black text-black text-2xl font-display shadow-[0_0_30px_rgba(255,212,0,0.3)]">
          iQ
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-wider text-[#F5F7F8] font-display">
            IQOO NavX
          </h1>
          <p className="text-xs font-semibold text-[#FFD400] tracking-wide mt-1 font-display">
            "Navigate. Even When It's Not Perfect."
          </p>
        </div>

        <p className="text-[11px] text-[#A4A9AE] leading-relaxed pt-2">
          Offline-First Navigation • Sensor-Assisted Positioning • Battery-Aware Routing
        </p>
      </div>

      {/* Bottom Loading Progress & Engine Status */}
      <div className="w-full max-w-xs space-y-3 pb-6">
        {/* Feature Icons Row */}
        <div className="flex items-center justify-around text-[#A4A9AE] text-[10px] pb-1">
          <div className="flex items-center gap-1">
            <HardDrive size={13} className="text-[#FFD400]" />
            <span>Offline Graph</span>
          </div>
          <div className="flex items-center gap-1">
            <Cpu size={13} className="text-[#3B82F6]" />
            <span>IMU Fusion</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={13} className="text-[#22C55E]" />
            <span>Ultra Mode</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-[#191C1F] border border-[#2B2F33] overflow-hidden">
          <div
            className="h-full bg-[#FFD400] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#A4A9AE] font-mono">
          <span className="truncate">{stepText}</span>
          <span className="text-[#FFD400] font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
