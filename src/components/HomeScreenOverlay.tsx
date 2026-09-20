import React from 'react';

import {
  Search,
  Mic,
  MapPin,
  Home,
  GraduationCap,
  Building2,
  Fuel,
  Radio,
  Sparkles,
  Settings,
  ChevronRight,
  BatteryCharging,
  Download,
  Navigation,
  WifiOff,
  Bookmark,
  Crosshair,
  CloudOff,
} from 'lucide-react';

import {
  MapRegion,
  POI,
  PositionState,
  BatteryState,
} from '../types';

interface HomeScreenOverlayProps {
  activeRegion: MapRegion;
  savedLocations: POI[];
  posState: PositionState;
  batteryState?: BatteryState;
  isOffline: boolean;

  onOpenSearch: () => void;
  onOpenVoice: () => void;
  onOpenSavedLocations: () => void;
  onOpenDownloadRegion: () => void;
  onSelectDestination: (poi: POI) => void;
  onOpenEngineDrawer: () => void;
}

export const HomeScreenOverlay: React.FC<HomeScreenOverlayProps> = ({
  activeRegion,
  savedLocations,
  posState,
  batteryState,
  isOffline,
  onOpenSearch,
  onOpenVoice,
  onOpenSavedLocations,
  onOpenDownloadRegion,
  onSelectDestination,
  onOpenEngineDrawer,
}) => {
  const batteryPercent = batteryState
    ? Math.round(batteryState.level * 100)
    : 85;

  const quickPois =
    savedLocations.length > 0
      ? savedLocations.slice(0, 3)
      : activeRegion.pois.filter((p) => p.isSaved).slice(0, 3);

  const getIcon = (category: string) => {
    switch (category) {
      case 'home':
        return <Home size={17} />;

      case 'college':
        return <GraduationCap size={17} />;

      case 'fuel':
        return <Fuel size={17} />;

      case 'hospital':
  return <Crosshair size={17} />;

      case 'work':
      case 'tech_park':
        return <Building2 size={17} />;

      default:
        return <MapPin size={17} />;
    }
  };

  const findAndNavigate = (category: string) => {
    const poi = activeRegion.pois.find(
      (p) => p.category === category
    );

    if (poi) {
      onSelectDestination(poi);
    }
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none font-sans">

      {/* =====================================================
          TOP BRAND HEADER
      ====================================================== */}

      <div className="absolute top-3 left-3 right-3 pointer-events-auto">

        <div className="flex items-center justify-between">

          {/* Brand */}
          <div>
            <div className="flex items-center leading-none">
              <span className="text-[24px] font-black tracking-[-1.5px] text-white">
                iQOO
              </span>

              <span className="ml-1 text-[24px] font-black tracking-[-1.5px] text-[#C8FF00]">
                NavX
              </span>
            </div>

            <div className="mt-1 text-[8px] font-bold uppercase tracking-[2.5px] text-white/45">
              Navigate Beyond
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">

            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#080B0C]/90 px-2.5 py-2 backdrop-blur-xl">

              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isOffline
                    ? 'bg-[#C8FF00] shadow-[0_0_8px_#C8FF00]'
                    : 'bg-green-400'
                }`}
              />

              <span className="text-[8px] font-bold tracking-wide text-white/80">
                {isOffline ? 'OFFLINE' : 'ONLINE'}
              </span>
            </div>

            <button
              onClick={onOpenEngineDrawer}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#080B0C]/90 text-white/75 backdrop-blur-xl active:scale-95"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>


      {/* =====================================================
          SEARCH BAR
      ====================================================== */}

      <div className="absolute top-[72px] left-3 right-3 pointer-events-auto">

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0B1012]/95 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">

          <button
            onClick={onOpenSearch}
            className="flex min-w-0 flex-1 items-center gap-3 px-2.5 py-2 text-left"
          >
            <Search
              size={19}
              className="shrink-0 text-white/55"
            />

            <span className="truncate text-[13px] font-medium text-white/45">
              Search destination...
            </span>
          </button>

          <button
            onClick={onOpenVoice}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C8FF00] text-black shadow-[0_0_20px_rgba(200,255,0,0.18)] active:scale-90"
          >
            <Mic size={18} strokeWidth={2.6} />
          </button>
        </div>
      </div>


      {/* =====================================================
          GPS / 6-DOF STATUS
      ====================================================== */}

      <div className="absolute top-[128px] left-3 pointer-events-auto">

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#080B0C]/85 px-2.5 py-1.5 backdrop-blur-xl">

          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C8FF00]/10">
            <Radio
              size={13}
              className={
                posState.isSensorAssisted
                  ? 'text-[#C8FF00]'
                  : 'text-green-400'
              }
            />
          </div>

          <div>
            <p className="text-[8px] font-bold text-white/80">
              {posState.isSensorAssisted
                ? '6-DOF SENSOR ASSIST'
                : 'GPS ACTIVE'}
            </p>

            <p className="text-[7px] text-white/35">
              Positioning active
            </p>
          </div>
        </div>
      </div>


      {/* =====================================================
          RIGHT MAP CONTROLS
      ====================================================== */}

      <div className="absolute right-3 top-[178px] flex flex-col gap-2 pointer-events-auto">

        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#080B0C]/90 text-white/80 shadow-xl backdrop-blur-xl active:scale-95"
          title="My location"
        >
          <Crosshair size={18} />
        </button>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#080B0C]/90 shadow-xl backdrop-blur-xl">

          <button
            className="flex h-10 w-10 items-center justify-center text-white/80 active:bg-white/10"
          >
            <span className="text-xl">+</span>
          </button>

          <div className="mx-2 border-t border-white/10" />

          <button
            className="flex h-10 w-10 items-center justify-center text-white/80 active:bg-white/10"
          >
            <span className="text-xl">−</span>
          </button>

        </div>
      </div>


      {/* =====================================================
          CURRENT LOCATION CARD
      ====================================================== */}

      <div className="absolute left-3 bottom-[305px] pointer-events-auto">

        <button
          onClick={onOpenEngineDrawer}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#071012]/90 px-3 py-2.5 shadow-[0_12px_35px_rgba(0,0,0,0.45)] backdrop-blur-xl active:scale-[0.98]"
        >

          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#C8FF00]/10">

            <span className="absolute inset-1 rounded-full border border-[#C8FF00]/20 animate-pulse" />

            <MapPin
              size={18}
              className="relative z-10 text-[#C8FF00]"
              fill="currentColor"
            />
          </div>

          <div className="text-left">

            <p className="text-[8px] font-bold uppercase tracking-wider text-white/40">
              Current Location
            </p>

            <p className="text-[11px] font-bold text-white">
              Sensor-assisted positioning
            </p>

          </div>

          <ChevronRight
            size={15}
            className="text-white/30"
          />

        </button>
      </div>


      {/* =====================================================
          BOTTOM HOME PANEL
      ====================================================== */}

      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">

        <div className="rounded-t-[28px] border-t border-white/10 bg-[#070A0B]/96 px-3 pt-3 pb-3 shadow-[0_-25px_70px_rgba(0,0,0,0.75)] backdrop-blur-2xl">


          {/* HANDLE */}

          <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-white/15" />


          {/* =================================================
              NAVIGATION STATUS
          ================================================== */}

          <div className="mb-2 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C8FF00]/10">

                {isOffline ? (
                  <WifiOff
                    size={14}
                    className="text-[#C8FF00]"
                  />
                ) : (
                  <Navigation
                    size={14}
                    className="text-[#C8FF00]"
                  />
                )}

              </div>

              <div>
                <p className="text-[7px] uppercase tracking-wider text-white/35">
                  Navigation
                </p>

                <p className="text-[10px] font-bold text-white">
                  {isOffline
                    ? 'Offline navigation ready'
                    : 'Online navigation active'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">

              <BatteryCharging
                size={14}
                className="text-[#C8FF00]"
              />

              <span className="text-[10px] font-bold text-white">
                {batteryPercent}%
              </span>

            </div>

          </div>


          {/* =================================================
              PRIMARY NAVIGATE BUTTON
          ================================================== */}

          <button
            onClick={onOpenSearch}
            className="group mb-2 flex w-full items-center justify-between rounded-2xl bg-[#C8FF00] px-3.5 py-3 text-black shadow-[0_8px_30px_rgba(200,255,0,0.18)] active:scale-[0.985]"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/10">

                <Navigation
                  size={18}
                  fill="currentColor"
                  strokeWidth={2.5}
                />

              </div>

              <div className="text-left">

                <p className="text-[13px] font-black">
                  Navigate Offline
                </p>

                <p className="text-[8px] font-semibold text-black/50">
                  No continuous internet required
                </p>

              </div>

            </div>

            <ChevronRight
              size={20}
              strokeWidth={2.5}
            />

          </button>


          {/* =================================================
              QUICK ACTIONS
          ================================================== */}

          <div className="mb-2 grid grid-cols-4 gap-1.5">

            <QuickAction
              icon={<Home size={16} />}
              label="Home"
              onClick={() => findAndNavigate('home')}
            />

            <QuickAction
              icon={<GraduationCap size={16} />}
              label="College"
              onClick={() => findAndNavigate('college')}
            />

            <QuickAction
              icon={<Fuel size={16} />}
              label="Fuel"
              onClick={() => findAndNavigate('fuel')}
            />

            <QuickAction
              icon={<Bookmark size={16} />}
              label="Saved"
              onClick={onOpenSavedLocations}
            />

          </div>


          {/* =================================================
              RECENT DESTINATIONS
          ================================================== */}

          <div className="mb-2 flex items-center justify-between">

            <div>
              <h3 className="text-[12px] font-bold text-white">
                Recent Destinations
              </h3>

              <p className="text-[7px] text-white/30">
                Quick access to your places
              </p>
            </div>

            <button
              onClick={onOpenSavedLocations}
              className="text-[9px] font-bold text-[#C8FF00]"
            >
              View all
            </button>

          </div>


          <div className="mb-2 overflow-hidden rounded-2xl border border-white/8 bg-[#0C1113]">

            {quickPois.length > 0 ? (

              quickPois.map((poi, index) => (

                <button
                  key={poi.id}
                  onClick={() => onSelectDestination(poi)}
                  className={`group flex w-full items-center gap-2.5 px-3 py-2 text-left active:bg-white/5 ${
                    index !== 0
                      ? 'border-t border-white/5'
                      : ''
                  }`}
                >

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#C8FF00]/8 text-[#C8FF00]">
                    {getIcon(poi.category)}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-[10px] font-bold text-white">
                      {poi.name}
                    </p>

                    <p className="truncate text-[7px] capitalize text-white/30">
                      {poi.category.replace('_', ' ')}
                    </p>

                  </div>

                  <ChevronRight
                    size={14}
                    className="text-white/25"
                  />

                </button>

              ))

            ) : (

              <button
                onClick={onOpenSearch}
                className="flex w-full items-center gap-3 px-3 py-3 text-left"
              >

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C8FF00]/8">
                  <Search
                    size={14}
                    className="text-[#C8FF00]"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold text-white">
                    Find your first destination
                  </p>

                  <p className="text-[7px] text-white/30">
                    Search for a place to navigate
                  </p>
                </div>

              </button>

            )}

          </div>


          {/* =================================================
              AI VOICE ASSISTANT
          ================================================== */}

          <button
            onClick={onOpenVoice}
            className="group mb-2 flex w-full items-center gap-3 rounded-2xl border border-[#C8FF00]/15 bg-gradient-to-r from-[#11160F] to-[#0C1113] p-2.5 text-left active:scale-[0.99]"
          >

            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C8FF00] text-black shadow-[0_0_20px_rgba(200,255,0,0.18)]">

              <Mic size={17} strokeWidth={2.5} />

              <span className="absolute inset-[-3px] rounded-full border border-[#C8FF00]/20" />

            </div>

            <div className="min-w-0 flex-1">

              <div className="flex items-center gap-1.5">

                <p className="text-[11px] font-black text-white">
                  AI Voice Assistant
                </p>

                <span className="rounded-full bg-[#C8FF00]/10 px-1.5 py-0.5 text-[6px] font-bold text-[#C8FF00]">
                  AI
                </span>

              </div>

              <p className="mt-0.5 truncate text-[8px] text-white/35">
                “Hey NavX, take me home”
              </p>

            </div>

            <ChevronRight
              size={16}
              className="text-white/30"
            />

          </button>


          {/* =================================================
              TECH FEATURES
          ================================================== */}

          <div className="flex items-center justify-center gap-6">

            <button
              onClick={onOpenSavedLocations}
              className="flex flex-col items-center gap-1 text-white/40 active:text-[#C8FF00]"
            >
              <Bookmark size={14} />
              <span className="text-[7px]">
                Saved
              </span>
            </button>

            <button
              onClick={onOpenDownloadRegion}
              className="flex flex-col items-center gap-1 text-white/40 active:text-[#C8FF00]"
            >
              <Download size={14} />
              <span className="text-[7px]">
                Offline Maps
              </span>
            </button>

            <button
              onClick={onOpenEngineDrawer}
              className="flex flex-col items-center gap-1 text-white/40 active:text-[#C8FF00]"
            >
              <Sparkles size={14} />
              <span className="text-[7px]">
                NavX Engine
              </span>
            </button>

          </div>


          {/* Small offline indicator */}

          <div className="mt-2 flex items-center justify-center gap-1.5">

            <CloudOff
              size={9}
              className="text-[#C8FF00]/50"
            />

            <span className="text-[6px] uppercase tracking-[1.5px] text-white/20">
              Offline-first navigation
            </span>

          </div>

        </div>
      </div>
    </div>
  );
};


/* ============================================================
   QUICK ACTION COMPONENT
============================================================ */

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="group flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/8 bg-[#0D1214] px-1.5 py-2 active:scale-95"
    >

      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C8FF00]/8 text-[#C8FF00] group-active:bg-[#C8FF00] group-active:text-black">
        {icon}
      </div>

      <span className="truncate text-[7px] font-bold text-white/60">
        {label}
      </span>

    </button>
  );
};
