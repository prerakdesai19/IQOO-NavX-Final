import React, { useState } from 'react';
import { 
  WifiOff, 
  Radio, 
  RotateCcw, 
  Mic, 
  Activity, 
  ChevronRight, 
  ArrowUpRight, 
  Zap, 
  Sparkles,
  ArrowRight,
  Menu,
  X,
  CheckCircle2
} from 'lucide-react';
import { IQOOLogo } from './IQOOLogo';

interface LandingPageProps {
  onLaunchApp: () => void;
}

type DemoControlState = 'NORMAL' | 'INTERNET_OFF' | 'GPS_WEAK' | 'MISSED_TURN' | 'ULTRA_NAV';

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  // Mobile Nav Drawer Toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Rerouting Animation State
  const [rerouteState, setRerouteState] = useState<'original' | 'deviated' | 'recalculated'>('original');

  // Ultra Nav Toggle in landing section
  const [isUltraPreview, setIsUltraPreview] = useState(false);

  // Experience NavX Interactive Demo State
  const [activeDemoState, setActiveDemoState] = useState<DemoControlState>('NORMAL');

  const triggerRerouteSimulation = () => {
    setRerouteState('deviated');
    setTimeout(() => {
      setRerouteState('recalculated');
      setTimeout(() => {
        setRerouteState('original');
      }, 3500);
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-[#08090A] text-[#F5F7F8] font-sans selection:bg-[#FFD400] selection:text-black overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* 01 — HEADER                                                  */}
      {/* ============================================================ */}
      <nav className="w-full border-b border-[#2B2F33] sticky top-0 z-50 bg-[#08090A]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: iQOO logo & NavX brand */}
          <div className="flex items-center gap-3">
            <IQOOLogo size="md" variant="full" />
            <div className="h-4 w-px bg-[#2B2F33]" />
            <span className="font-extrabold text-sm tracking-wider text-[#F5F7F8] font-display">
              NavX
            </span>
          </div>

          {/* Right: Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A4A9AE] font-display">
            <a href="#core-idea" className="hover:text-[#FFD400] transition-colors">Explore</a>
            <a href="#technology" className="hover:text-[#FFD400] transition-colors">Technology</a>
            <a href="#experience-demo" className="hover:text-[#FFD400] transition-colors">Experience</a>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchApp}
              className="px-4 py-2 rounded-xl bg-[#FFD400] hover:bg-[#ffe033] text-black font-extrabold text-xs tracking-wider transition-all transform active:scale-95 shadow-[0_0_20px_rgba(255,212,0,0.25)] flex items-center gap-1.5 font-display cursor-pointer"
            >
              <span>Launch NavX</span>
              <ArrowUpRight size={14} className="stroke-[3]" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#191C1F] border border-[#2B2F33] text-[#A4A9AE]"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#111315] border-b border-[#2B2F33] px-4 py-4 space-y-3 animate-in fade-in duration-200 font-display">
            <a 
              href="#core-idea" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#A4A9AE] hover:text-[#FFD400]"
            >
              Explore
            </a>
            <a 
              href="#technology" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#A4A9AE] hover:text-[#FFD400]"
            >
              Technology
            </a>
            <a 
              href="#experience-demo" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#A4A9AE] hover:text-[#FFD400]"
            >
              Experience
            </a>
          </div>
        )}
      </nav>

      {/* ============================================================ */}
      {/* 02 — HERO                                                    */}
      {/* ============================================================ */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-28 overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#FFD400]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[420px] h-[420px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
              
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#191C1F] border border-[#2B2F33] mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FFD400] animate-pulse" />
                <span className="text-[11px] font-bold tracking-widest text-[#A4A9AE] uppercase font-display">
                  IQOO NAVX • OFFLINE-FIRST NAVIGATION
                </span>
              </div>

              {/* Exact Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F7F8] font-display leading-[1.08] mb-6">
                Navigate.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F7F8] via-[#FFD400] to-[#F5F7F8]">
                  Even when it's not perfect.
                </span>
              </h1>

              {/* Exact Supporting Copy */}
              <p className="text-base sm:text-lg text-[#A4A9AE] max-w-xl font-normal leading-relaxed mb-8">
                Offline-first navigation designed to keep you moving when connectivity, GPS reliability, or battery becomes a challenge.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={onLaunchApp}
                  className="px-7 py-3.5 rounded-2xl bg-[#FFD400] hover:bg-[#ffe033] text-black font-extrabold text-sm tracking-wide transition-all transform active:scale-95 shadow-[0_0_30px_rgba(255,212,0,0.35)] flex items-center justify-center gap-2 font-display cursor-pointer"
                >
                  <span>Launch NavX</span>
                  <ChevronRight size={16} className="stroke-[3]" />
                </button>
                <a
                  href="#technology"
                  className="px-6 py-3.5 rounded-2xl bg-[#191C1F] hover:bg-[#22262A] text-[#F5F7F8] border border-[#2B2F33] font-semibold text-sm transition-all flex items-center justify-center gap-2 font-display"
                >
                  <span>Explore the technology</span>
                </a>
              </div>

              {/* ============================================================ */}
              {/* 03 — HERO MICRO-STATUS (Under Hero Visual / Text)           */}
              {/* ============================================================ */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 mt-10 border-t border-[#2B2F33]/80 w-full max-w-xl font-display">
                <div className="p-2.5 rounded-xl bg-[#111315] border border-[#2B2F33]">
                  <div className="flex items-center gap-1.5 text-[#22C55E] text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    <span>OFFLINE READY</span>
                  </div>
                  <div className="text-[10px] text-[#6F757B] mt-0.5">Local Road Graph</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#111315] border border-[#2B2F33]">
                  <div className="flex items-center gap-1.5 text-[#3B82F6] text-xs font-bold">
                    <Radio size={12} />
                    <span>GPS ACTIVE</span>
                  </div>
                  <div className="text-[10px] text-[#6F757B] mt-0.5">Dual L1/L5 Fix</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#111315] border border-[#2B2F33]">
                  <div className="flex items-center gap-1.5 text-[#FFD400] text-xs font-bold">
                    <Activity size={12} />
                    <span>SENSOR FUSION</span>
                  </div>
                  <div className="text-[10px] text-[#6F757B] mt-0.5">6-DOF Dead Reckoning</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#111315] border border-[#2B2F33]">
                  <div className="flex items-center gap-1.5 text-[#F5F7F8] text-xs font-bold">
                    <Zap size={12} className="text-[#FFD400]" />
                    <span>ULTRA MODE</span>
                  </div>
                  <div className="text-[10px] text-[#6F757B] mt-0.5">OLED Low Power</div>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Smartphone Mockup with ACTUAL NavX UI */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* 3D Smartphone Device Container */}
              <div className="w-[300px] sm:w-[325px] h-[610px] sm:h-[650px] bg-[#111315] rounded-[44px] p-3 border-4 border-[#2B2F33] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(255,212,0,0.12)] relative flex flex-col overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
                
                {/* Speaker Notch / Origin Island Pill */}
                <div className="w-full flex items-center justify-center pt-1 pb-2 z-30">
                  <div className="px-3.5 py-1.5 rounded-full bg-black/95 border border-[#2B2F33] flex items-center gap-2 shadow-md">
                    <div className="w-2 h-2 rounded-full bg-[#FFD400] animate-pulse" />
                    <span className="text-[10px] font-bold text-[#F5F7F8] font-display">Turn right in 200m</span>
                    <span className="text-[9px] text-[#A4A9AE]">12:42</span>
                  </div>
                </div>

                {/* Inner Screen: Dark Navigation Map UI */}
                <div className="flex-1 w-full bg-[#08090A] rounded-[32px] border border-[#2B2F33]/60 relative overflow-hidden flex flex-col justify-between p-3">
                  
                  {/* Top Turn Instruction HUD */}
                  <div className="w-full bg-[#111315]/95 backdrop-blur-md border border-[#2B2F33] rounded-2xl p-3 shadow-lg z-20">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                        <span className="text-[9px] font-extrabold tracking-wider text-[#FFD400] uppercase font-display">
                          ● OFFLINE NAVIGATION
                        </span>
                      </div>
                      <span className="text-[9px] text-[#A4A9AE] font-mono">87%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFD400] flex items-center justify-center text-black font-black text-lg font-display">
                        ↱
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#F5F7F8] uppercase tracking-wide font-display">
                          TURN RIGHT
                        </div>
                        <div className="text-[11px] text-[#A4A9AE]">
                          in 200 m on University Road
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SVG Navigation Map Canvas */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-90">
                    <svg className="w-full h-full" viewBox="0 0 300 500" fill="none">
                      {/* Roads */}
                      <path d="M-20 180 H320" stroke="#191C1F" strokeWidth="12" />
                      <path d="M-20 320 H320" stroke="#191C1F" strokeWidth="8" />
                      <path d="M150 -20 V520" stroke="#191C1F" strokeWidth="12" />
                      <path d="M60 -20 V520" stroke="#191C1F" strokeWidth="6" />
                      <path d="M240 -20 V520" stroke="#191C1F" strokeWidth="6" />

                      {/* Active Yellow Navigation Route */}
                      <path 
                        d="M 150 420 L 150 240 Q 150 200 190 200 L 260 200" 
                        stroke="#FFD400" 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="drop-shadow-[0_0_8px_rgba(255,212,0,0.6)]"
                      />

                      {/* Origin & Destination */}
                      <circle cx="150" cy="420" r="6" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="260" cy="200" r="8" fill="#FFD400" stroke="#000000" strokeWidth="2" />

                      {/* Vehicle Marker */}
                      <g transform="translate(150, 310)">
                        <circle cx="0" cy="0" r="16" fill="rgba(255,212,0,0.2)" />
                        <circle cx="0" cy="0" r="8" fill="#FFD400" stroke="#000000" strokeWidth="2" />
                        <polygon points="0,-12 4,-5 -4,-5" fill="#000000" />
                      </g>
                    </svg>
                  </div>

                  {/* Bottom ETA & Status */}
                  <div className="w-full bg-[#111315]/95 backdrop-blur-md border border-[#2B2F33] rounded-2xl p-3 z-20 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-extrabold text-[#F5F7F8] font-display">12 min</div>
                        <div className="text-[10px] text-[#A4A9AE]">4.8 km • ETA 12:42 PM</div>
                      </div>
                      <div className="px-2.5 py-1 rounded-xl bg-[#FFD400]/15 border border-[#FFD400]/30 text-[#FFD400] text-[10px] font-bold font-display">
                        LOCAL GRAPH
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 04 — THE CORE IDEA                                           */}
      {/* ============================================================ */}
      <section id="core-idea" className="py-20 bg-[#111315] border-y border-[#2B2F33]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-14 text-left">
            <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
              THE CORE IDEA
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display mt-2 leading-tight">
              When connectivity disappears, NavX doesn't have to.
            </h2>
            <p className="text-base text-[#A4A9AE] mt-4 leading-relaxed">
              Standard navigation apps break the moment you enter underground parking, mountain roads, or poor signal corridors. NavX is built from the silicon up to continue navigating entirely on-device.
            </p>
          </div>

          {/* Real Map-Like Demonstration: INTERNET ↓ OFFLINE MAP ↓ NAVIGATION ↓ REROUTING */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-display">
            
            <div className="p-5 rounded-2xl bg-[#08090A] border border-[#2B2F33] relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#A4A9AE]">STEP 01</span>
                <span className="px-2 py-0.5 rounded-md bg-[#22C55E]/15 text-[#22C55E] text-[10px] font-bold">ONLINE</span>
              </div>
              <div className="text-base font-extrabold text-[#F5F7F8]">Internet</div>
              <p className="text-xs text-[#6F757B] mt-1">
                Regional map packages and routing matrices synchronize in background.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#08090A] border border-[#2B2F33] relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#A4A9AE]">STEP 02</span>
                <span className="px-2 py-0.5 rounded-md bg-[#3B82F6]/15 text-[#3B82F6] text-[10px] font-bold">CACHED</span>
              </div>
              <div className="text-base font-extrabold text-[#F5F7F8]">Offline Map</div>
              <p className="text-xs text-[#6F757B] mt-1">
                Vector tile geometries and node-edge graphs store safely on-device.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#08090A] border border-[#2B2F33] relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#A4A9AE]">STEP 03</span>
                <span className="px-2 py-0.5 rounded-md bg-[#FFD400]/15 text-[#FFD400] text-[10px] font-bold">ZERO LAG</span>
              </div>
              <div className="text-base font-extrabold text-[#F5F7F8]">Navigation</div>
              <p className="text-xs text-[#6F757B] mt-1">
                Continuous turn-by-turn guidance proceeds without network pings.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#08090A] border border-[#FFD400]/40 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#FFD400]">STEP 04</span>
                <span className="px-2 py-0.5 rounded-md bg-[#FFD400] text-black text-[10px] font-extrabold">&lt; 50ms</span>
              </div>
              <div className="text-base font-extrabold text-[#FFD400]">Rerouting</div>
              <p className="text-xs text-[#A4A9AE] mt-1">
                Local Dijkstra graph solver computes instant path recovery on missed turns.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 05 — OFFLINE NAVIGATION (Full-Width Visual Map)              */}
      {/* ============================================================ */}
      <section id="technology" className="py-20 bg-[#08090A] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Copy */}
            <div className="lg:col-span-5 text-left">
              <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
                ZERO CONNECTIVITY REQUIRED
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display mt-2 leading-tight">
                Navigation without the network.
              </h2>
              <p className="text-base text-[#A4A9AE] mt-4 leading-relaxed">
                Downloaded regional maps allow NavX to continue navigation when internet connectivity is unavailable.
              </p>

              <div className="mt-6 space-y-3 font-display text-xs">
                <div className="p-3.5 rounded-xl bg-[#111315] border border-[#2B2F33] flex items-center justify-between">
                  <span className="text-[#F5F7F8] font-bold">Gujarat Region Road Network</span>
                  <span className="text-[#22C55E] font-mono font-bold">248 MB Available</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#111315] border border-[#2B2F33] flex items-center justify-between">
                  <span className="text-[#F5F7F8] font-bold">Local Graph Routing Computation</span>
                  <span className="text-[#FFD400] font-mono font-bold">&lt; 35ms</span>
                </div>
              </div>
            </div>

            {/* Right: Large Navigation Map Visualization */}
            <div className="lg:col-span-7">
              <div className="w-full h-80 sm:h-96 rounded-3xl bg-[#111315] border border-[#2B2F33] relative overflow-hidden shadow-2xl flex flex-col justify-between p-6">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between z-20">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-[#2B2F33]">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <span className="text-xs font-bold text-[#F5F7F8] font-display">● OFFLINE NAVIGATION ACTIVE</span>
                  </div>
                  <span className="text-xs font-mono text-[#A4A9AE]">Local Graph Mode</span>
                </div>

                {/* SVG Visual Map Canvas */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 600 350" fill="none">
                    <path d="M 50 180 H 550" stroke="#191C1F" strokeWidth="16" />
                    <path d="M 300 30 V 320" stroke="#191C1F" strokeWidth="16" />
                    <path d="M 120 60 L 480 300" stroke="#191C1F" strokeWidth="10" />

                    {/* Active Route */}
                    <path d="M 80 180 H 300 V 80 H 460" stroke="#FFD400" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Markers */}
                    <circle cx="80" cy="180" r="7" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="460" cy="80" r="8" fill="#FFD400" stroke="#000000" strokeWidth="2" />

                    {/* Navigation Vehicle Marker */}
                    <g transform="translate(260, 180)">
                      <circle cx="0" cy="0" r="14" fill="rgba(255,212,0,0.25)" />
                      <circle cx="0" cy="0" r="6" fill="#FFD400" stroke="#000000" strokeWidth="1.5" />
                    </g>
                  </svg>
                </div>

                {/* Bottom Route Summary */}
                <div className="z-20 p-3.5 rounded-2xl bg-[#08090A]/95 border border-[#2B2F33] flex items-center justify-between font-display">
                  <div className="text-xs font-bold text-[#F5F7F8]">
                    Turn left in 400 m on Tech Boulevard
                  </div>
                  <span className="text-xs text-[#22C55E] font-mono">Dijkstra On-Device</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 06 — SENSOR FUSION                                           */}
      {/* ============================================================ */}
      <section className="py-20 bg-[#111315] border-y border-[#2B2F33]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 text-left">
              <span className="text-xs font-extrabold text-[#3B82F6] uppercase tracking-widest font-display">
                MULTI-SENSOR DEAD RECKONING
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display mt-2 leading-tight">
                When GPS gets uncertain, NavX keeps estimating.
              </h2>
              <p className="text-base text-[#A4A9AE] mt-4 leading-relaxed">
                When GPS signal drops in tunnels, deep underpasses, and urban high-rises, NavX seamlessly fuses onboard inertial measurements with map data to estimate your true position without sudden trajectory jumps.
              </p>

              {/* Technical Mathematical Flow */}
              <div className="mt-8 space-y-2 font-display text-xs">
                <div className="p-3 rounded-xl bg-[#08090A] border border-[#2B2F33] flex items-center justify-between">
                  <span className="text-[#F5F7F8] font-bold">GPS Satellite Fix</span>
                  <span className="text-[#3B82F6]">Dual-Band L1 / L5</span>
                </div>
                <div className="p-3 rounded-xl bg-[#08090A] border border-[#2B2F33] flex items-center justify-between">
                  <span className="text-[#F5F7F8] font-bold">Accelerometer + Gyroscope</span>
                  <span className="text-[#FFD400]">IMU Velocity & Heading</span>
                </div>
                <div className="p-3 rounded-xl bg-[#08090A] border border-[#2B2F33] flex items-center justify-between">
                  <span className="text-[#F5F7F8] font-bold">Compass + Map Data</span>
                  <span className="text-[#22C55E]">Road Graph Snapping</span>
                </div>

                <div className="pt-2 text-center">
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#3B82F6] text-white font-extrabold text-xs font-display shadow-md">
                    <span>↓ POSITION ESTIMATION</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Technical Position State HUD */}
            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl bg-[#08090A] border border-[#2B2F33] shadow-2xl relative">
                <div className="flex items-center justify-between pb-6 border-b border-[#2B2F33]">
                  <div>
                    <div className="text-xs font-black uppercase text-[#A4A9AE] tracking-wider font-display">
                      POSITIONING TELEMETRY
                    </div>
                    <div className="text-lg font-black text-[#F5F7F8] font-display mt-0.5">
                      Sensor Fusion Confidence
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 text-xs font-bold font-display">
                    SYNCHRONIZED
                  </span>
                </div>

                <div className="py-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5 font-display">
                      <span className="text-[#A4A9AE]">Confidence Score</span>
                      <span className="text-[#FFD400] font-mono font-bold">92%</span>
                    </div>
                    <div className="w-full h-3 bg-[#191C1F] rounded-full overflow-hidden p-0.5 border border-[#2B2F33]">
                      <div className="h-full bg-gradient-to-r from-[#3B82F6] via-[#FFD400] to-[#22C55E] rounded-full w-[92%]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 font-display">
                    <div className="p-3 rounded-xl bg-[#111315] border border-[#2B2F33]">
                      <div className="text-[10px] text-[#6F757B] uppercase font-bold">GPS Mode</div>
                      <div className="text-xs font-black text-[#3B82F6] mt-1">Dual-Frequency L1/L5</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#111315] border border-[#2B2F33]">
                      <div className="text-[10px] text-[#6F757B] uppercase font-bold">IMU Sampling</div>
                      <div className="text-xs font-black text-[#FFD400] mt-1">60 Hz Realtime</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#111315] border border-[#2B2F33] text-xs text-[#A4A9AE] leading-relaxed">
                  GPS signal becomes weak → sensor-assisted estimation continues → GPS returns → position is corrected smoothly.
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 07 — MISSED TURN / REROUTING                                 */}
      {/* ============================================================ */}
      <section className="py-20 bg-[#08090A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 text-left">
              <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
                AUTOMATIC RECOVERY
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7F8] font-display mt-2 leading-tight">
                Missed the turn?<br />Keep moving.
              </h2>
              <p className="text-base text-[#A4A9AE] mt-4 leading-relaxed">
                NavX detects route deviation instantly and computes an available offline alternative without round-trip network lag.
              </p>

              <div className="mt-8">
                <button
                  onClick={triggerRerouteSimulation}
                  className="px-5 py-3 rounded-xl bg-[#191C1F] hover:bg-[#22262A] text-xs font-bold text-[#FFD400] border border-[#FFD400]/40 transition-all active:scale-95 font-display flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <RotateCcw size={14} className={rerouteState === 'deviated' ? 'animate-spin' : ''} />
                  <span>Simulate Route Recalculation</span>
                </button>
              </div>
            </div>

            {/* Reroute Interactive SVG Diagram */}
            <div className="lg:col-span-7">
              <div className="w-full h-80 bg-[#111315] rounded-3xl border border-[#2B2F33] p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between z-20">
                  <div className="flex items-center gap-2 font-display">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      rerouteState === 'original' ? 'bg-[#22C55E]' : rerouteState === 'deviated' ? 'bg-[#EF4444] animate-ping' : 'bg-[#FFD400]'
                    }`} />
                    <span className="text-xs font-black tracking-wider uppercase">
                      {rerouteState === 'original' && 'ORIGINAL ROUTE ACTIVE'}
                      {rerouteState === 'deviated' && 'MISSED TURN DETECTED — RECALCULATING...'}
                      {rerouteState === 'recalculated' && 'NEW ROUTE GENERATED'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#6F757B]">Local Solver</span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 500 300" fill="none">
                    <path d="M 50 150 H 450" stroke="#191C1F" strokeWidth="16" />
                    <path d="M 250 50 V 250" stroke="#191C1F" strokeWidth="16" />
                    <path d="M 380 50 V 250" stroke="#191C1F" strokeWidth="12" />

                    {rerouteState === 'original' && (
                      <path d="M 60 150 H 250 V 70" stroke="#FFD400" strokeWidth="6" strokeLinecap="round" className="animate-pulse" />
                    )}

                    {rerouteState === 'deviated' && (
                      <>
                        <path d="M 60 150 H 320" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
                        <circle cx="320" cy="150" r="8" fill="#EF4444" />
                      </>
                    )}

                    {rerouteState === 'recalculated' && (
                      <path d="M 60 150 H 380 V 70 H 260" stroke="#FFD400" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 8" className="animate-pulse" />
                    )}

                    <circle cx="250" cy="70" r="10" fill="#FFD400" stroke="#000000" strokeWidth="3" />
                  </svg>
                </div>

                <div className="z-20 bg-[#08090A]/95 border border-[#2B2F33] rounded-xl p-3 flex items-center justify-between font-display">
                  <div className="text-xs font-bold text-[#F5F7F8]">
                    {rerouteState === 'original' && 'Turn right in 200 m on Cross Road'}
                    {rerouteState === 'deviated' && '⚠ Rerouting locally on-device...'}
                    {rerouteState === 'recalculated' && '✓ Continue straight 450 m then turn right'}
                  </div>
                  <span className="text-[10px] text-[#A4A9AE] font-mono">0.04s latency</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 08 — IQOO EXPERIENCE (Origin Island-Style Status)             */}
      {/* ============================================================ */}
      <section className="py-20 bg-[#111315] border-y border-[#2B2F33]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-14 text-left">
            <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
              PHONE-NATIVE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display mt-2 leading-tight">
              Origin Island-style navigation status.
            </h2>
            <p className="text-base text-[#A4A9AE] mt-4 leading-relaxed">
              Glanceable navigation telemetry integrated directly into the system status bar, keeping your next turn, ETA, distance, and offline indicators always accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Origin Island Visualization */}
            <div className="p-8 rounded-3xl bg-[#08090A] border border-[#2B2F33] flex flex-col justify-between shadow-2xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#FFD400] mb-6">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#F5F7F8] font-display mb-3">
                  Origin Island-style navigation status
                </h3>
                <p className="text-sm text-[#A4A9AE] leading-relaxed mb-6">
                  Compact floating capsule shows real-time maneuvers without obscuring your phone's active app.
                </p>
              </div>

              {/* Pill Card */}
              <div className="w-full p-4 rounded-2xl bg-[#111315] border border-[#2B2F33] space-y-2.5 font-display">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFD400] animate-pulse" />
                    <span className="text-[#F5F7F8]">Turn right in 200m</span>
                  </div>
                  <span className="text-[#FFD400] font-mono">ETA 12:42</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#6F757B]">
                  <span>4.8 km remaining</span>
                  <span className="text-[#22C55E] font-bold">● OFFLINE ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Voice Navigation Showcase */}
            <div className="p-8 rounded-3xl bg-[#08090A] border border-[#2B2F33] flex flex-col justify-between shadow-2xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#3B82F6] mb-6">
                  <Mic size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#F5F7F8] font-display mb-3">
                  Voice / Screenless Navigation
                </h3>
                <p className="text-sm text-[#A4A9AE] leading-relaxed mb-6">
                  Microphone + Voice Command + Navigation Action. Keep eyes on the road while NavX handles intent parsing.
                </p>
              </div>

              {/* Voice Card */}
              <div className="w-full p-4 rounded-2xl bg-[#111315] border border-[#2B2F33] space-y-2 font-display">
                <div className="flex items-center gap-2 text-xs text-[#F5F7F8] font-mono">
                  <Mic size={15} className="text-[#3B82F6]" />
                  <span>"Take me to the nearest saved place."</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#22C55E] font-bold pl-5">
                  <CheckCircle2 size={13} />
                  <span>"Starting navigation to College Campus."</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 09 — ULTRA NAVIGATION MODE                                   */}
      {/* ============================================================ */}
      <section className="py-20 bg-[#08090A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 text-left">
              <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
                POWER PRESERVATION
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display mt-2 leading-tight">
                Less distraction.<br />More navigation.
              </h2>
              <p className="text-base text-[#A4A9AE] mt-4 leading-relaxed">
                Prioritizes navigation while reducing unnecessary visual and background work. High-contrast OLED pitch-black styling preserves critical guidance when battery is critical.
              </p>

              <div className="mt-6">
                <button
                  onClick={() => setIsUltraPreview(!isUltraPreview)}
                  className="px-5 py-2.5 rounded-xl bg-[#191C1F] hover:bg-[#22262A] text-xs font-bold text-[#FFD400] border border-[#FFD400]/40 transition-all active:scale-95 font-display flex items-center gap-2 cursor-pointer"
                >
                  <Zap size={14} />
                  <span>{isUltraPreview ? 'Exit Ultra Preview' : 'Preview Ultra Navigation UI'}</span>
                </button>
              </div>
            </div>

            {/* Ultra Navigation Display Box */}
            <div className="lg:col-span-6">
              <div className={`p-6 rounded-3xl transition-all duration-300 shadow-2xl ${
                isUltraPreview 
                  ? 'bg-black border-2 border-amber-500/50 text-amber-400' 
                  : 'bg-[#111315] border border-[#2B2F33] text-[#F5F7F8]'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-[#2B2F33]/80 font-display">
                  <div className="flex items-center gap-2 text-xs font-extrabold">
                    <Zap size={16} className={isUltraPreview ? 'text-[#FFD400]' : 'text-[#A4A9AE]'} />
                    <span>ULTRA NAVIGATION MODE</span>
                  </div>
                  <span className="text-xs font-mono text-[#22C55E] font-bold">14% Battery</span>
                </div>

                <div className="py-4 space-y-3 font-display">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#A4A9AE]">Turn Guidance:</span>
                    <span className="font-extrabold text-[#FFD400]">Turn right in 200 m</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#A4A9AE]">Distance & ETA:</span>
                    <span className="font-bold">4.8 km • 12 min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#A4A9AE]">Display Profile:</span>
                    <span className="font-bold text-[#22C55E]">OLED Pure Black (Minimal Power)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#08090A] border border-[#2B2F33] text-[11px] text-[#A4A9AE]">
                  Map rendering and voice guidance are maintained at optimal efficiency.
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 11 — EXPERIENCE NAVX (Interactive Product Simulator)        */}
      {/* ============================================================ */}
      <section id="experience-demo" className="py-20 bg-[#111315] border-y border-[#2B2F33]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
              LIVE PRODUCT SIMULATOR
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display mt-2 leading-tight">
              Experience NavX
            </h2>
            <p className="text-sm text-[#A4A9AE] mt-3">
              Test how the NavX engine responds in real-time across internet, GPS, and power conditions.
            </p>
          </div>

          {/* Simulator Radio Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 font-display">
            <button
              onClick={() => setActiveDemoState('NORMAL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeDemoState === 'NORMAL'
                  ? 'bg-[#22C55E] text-black shadow-lg shadow-[rgba(34,197,94,0.3)]'
                  : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33] hover:text-[#F5F7F8]'
              }`}
            >
              Standard Online
            </button>

            <button
              onClick={() => setActiveDemoState('INTERNET_OFF')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeDemoState === 'INTERNET_OFF'
                  ? 'bg-[#F59E0B] text-black shadow-lg shadow-[rgba(245,158,11,0.3)]'
                  : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33] hover:text-[#F5F7F8]'
              }`}
            >
              Internet: OFFLINE
            </button>

            <button
              onClick={() => setActiveDemoState('GPS_WEAK')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeDemoState === 'GPS_WEAK'
                  ? 'bg-[#3B82F6] text-white shadow-lg shadow-[rgba(59,130,246,0.3)]'
                  : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33] hover:text-[#F5F7F8]'
              }`}
            >
              GPS: WEAK (IMU Fusion)
            </button>

            <button
              onClick={() => setActiveDemoState('MISSED_TURN')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeDemoState === 'MISSED_TURN'
                  ? 'bg-purple-600 text-white shadow-lg shadow-[rgba(168,85,247,0.3)]'
                  : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33] hover:text-[#F5F7F8]'
              }`}
            >
              Route: MISSED TURN
            </button>

            <button
              onClick={() => setActiveDemoState('ULTRA_NAV')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeDemoState === 'ULTRA_NAV'
                  ? 'bg-[#FFD400] text-black shadow-lg shadow-[rgba(255,212,0,0.3)]'
                  : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33] hover:text-[#F5F7F8]'
              }`}
            >
              Power: ULTRA MODE
            </button>
          </div>

          {/* Simulator Response Card */}
          <div className="w-full max-w-xl mx-auto bg-[#08090A] border border-[#2B2F33] rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#2B2F33]">
              <div className="flex items-center gap-2 font-display">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  activeDemoState === 'NORMAL' ? 'bg-[#22C55E]' :
                  activeDemoState === 'INTERNET_OFF' ? 'bg-[#F59E0B]' :
                  activeDemoState === 'GPS_WEAK' ? 'bg-[#3B82F6]' :
                  activeDemoState === 'MISSED_TURN' ? 'bg-purple-400' : 'bg-[#EF4444]'
                }`} />
                <span className="text-xs font-black uppercase text-[#F5F7F8]">
                  {activeDemoState === 'NORMAL' && 'Standard Navigation Fix'}
                  {activeDemoState === 'INTERNET_OFF' && 'Offline Local Graph Active'}
                  {activeDemoState === 'GPS_WEAK' && 'Sensor-Assisted Dead Reckoning'}
                  {activeDemoState === 'MISSED_TURN' && 'Automatic Route Recalculation'}
                  {activeDemoState === 'ULTRA_NAV' && 'Ultra Navigation Power Saving'}
                </span>
              </div>
            </div>

            {/* Inner Content */}
            <div className={`mt-4 p-5 rounded-2xl border transition-all ${
              activeDemoState === 'ULTRA_NAV'
                ? 'bg-black border-amber-500/30'
                : 'bg-[#111315] border-[#2B2F33]'
            }`}>
              {activeDemoState === 'NORMAL' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#22C55E]">
                      <Radio size={16} />
                      <span>GPS Satellite Fix: Strong</span>
                    </div>
                    <span className="text-[10px] text-[#A4A9AE]">Dual Frequency</span>
                  </div>
                  <div className="text-xs text-[#A4A9AE]">
                    Turn right in 200 m on University Road. ETA 12:42 PM (4.8 km remaining).
                  </div>
                </div>
              )}

              {activeDemoState === 'INTERNET_OFF' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#191C1F] border border-[#F59E0B]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#F59E0B]">
                      <WifiOff size={16} />
                      <span>● OFFLINE GRAPH ACTIVE</span>
                    </div>
                    <span className="text-[10px] text-[#F59E0B]">0 KB Data Used</span>
                  </div>
                  <div className="text-xs text-[#A4A9AE]">
                    Network unavailable. Route calculation and turn-by-turn guidance continue seamlessly from local storage.
                  </div>
                </div>
              )}

              {activeDemoState === 'GPS_WEAK' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#191C1F] border border-[#3B82F6]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#3B82F6]">
                      <Activity size={16} />
                      <span>IMU SENSOR POSITIONING</span>
                    </div>
                    <span className="text-[10px] text-[#3B82F6]">60 Hz IMU</span>
                  </div>
                  <div className="text-xs text-[#A4A9AE]">
                    Satellite signal degraded. Accelerometer + Gyroscope + Compass maintain continuous track.
                  </div>
                </div>
              )}

              {activeDemoState === 'MISSED_TURN' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#191C1F] border border-purple-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                      <RotateCcw size={16} />
                      <span>ALTERNATIVE ROUTE SOLVED</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#22C55E]">0.04s</span>
                  </div>
                  <div className="text-xs text-[#A4A9AE]">
                    Route deviation detected. Alternative path computed locally: Proceed 450m and make next right.
                  </div>
                </div>
              )}

              {activeDemoState === 'ULTRA_NAV' && (
                <div className="space-y-3 text-amber-400">
                  <div className="p-3 rounded-xl bg-black border border-amber-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <Zap size={16} />
                      <span>ULTRA NAVIGATION ACTIVE</span>
                    </div>
                    <span className="text-[10px] font-mono">OLED Pitch Black</span>
                  </div>
                  <div className="text-xs text-amber-200">
                    Background visual operations minimized. Turn guidance and voice guidance maintained.
                  </div>
                </div>
              )}
            </div>

            {/* Launch Action */}
            <div className="mt-6 pt-4 border-t border-[#2B2F33] flex items-center justify-between font-display">
              <span className="text-xs text-[#A4A9AE]">Launch full navigation app:</span>
              <button
                onClick={onLaunchApp}
                className="px-5 py-2.5 rounded-xl bg-[#FFD400] hover:bg-[#ffe033] text-black font-extrabold text-xs tracking-wider transition-all transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch App</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 12 — FINAL CTA & FOOTER                                      */}
      {/* ============================================================ */}
      <section className="py-24 bg-[#08090A] text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-6xl font-black text-[#F5F7F8] font-display tracking-tight leading-tight">
            Navigation that keeps moving.
          </h2>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 font-display">
            <button
              onClick={onLaunchApp}
              className="px-9 py-4 rounded-2xl bg-[#FFD400] hover:bg-[#ffe033] text-black font-black text-sm tracking-wider transition-all transform active:scale-95 shadow-[0_0_35px_rgba(255,212,0,0.35)] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Launch NavX</span>
              <ChevronRight size={16} className="stroke-[3]" />
            </button>
            <a
              href="#technology"
              className="px-7 py-4 rounded-2xl bg-[#111315] hover:bg-[#191C1F] text-[#F5F7F8] border border-[#2B2F33] font-bold text-sm transition-all"
            >
              Explore the experience
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-[#08090A] border-t border-[#2B2F33] text-center text-xs text-[#6F757B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <IQOOLogo size="sm" variant="full" />
            <div className="h-3 w-px bg-[#2B2F33]" />
            <span className="font-bold text-[#F5F7F8] font-display">IQOO NavX</span>
          </div>

          <p className="text-[11px] text-[#A4A9AE]">
            Offline-first navigation for iQOO devices
          </p>

          <div className="flex items-center gap-5 text-[11px] text-[#A4A9AE] font-display">
            <a href="#core-idea" className="hover:text-[#FFD400] transition-colors">Explore</a>
            <a href="#technology" className="hover:text-[#FFD400] transition-colors">Technology</a>
            <a href="#experience-demo" className="hover:text-[#FFD400] transition-colors">Experience</a>
            <a href="https://github.com/aditya25-25/IQOO-NavX" target="_blank" rel="noreferrer" className="hover:text-[#FFD400] transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
