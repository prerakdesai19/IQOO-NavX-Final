import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { REGIONS } from './data/regions';

import {
  Coordinates,
  MapRegion,
  POI,
  PositionState,
  BatteryState,
  AICommandResult,
} from './types';

import {
  NavigationController,
  NavigationProgress,
} from './engine/navigationController';

import { PositionFusionManager } from './sensors/positionFusion';
import { RouteManager } from './engine/routeManager';
import { batteryManager } from './battery/batteryManager';
import { voiceEngine } from './voice/voiceGuidance';

import { SplashScreen } from './components/SplashScreen';
import { LandingPage } from './components/LandingPage';
import { NavigationHeader } from './components/NavigationHeader';
import { OriginIsland } from './components/OriginIsland';
import { MapView } from './components/MapView';
import { TurnGuidanceHUD } from './components/TurnGuidanceHUD';
import { RouteContextCard } from './components/RouteContextCard';
import { RoutePreviewCard } from './components/RoutePreviewCard';
import { HomeScreenOverlay } from './components/HomeScreenOverlay';
import { SearchScreen } from './components/SearchScreen';
import { DestinationDetailsModal } from './components/DestinationDetailsModal';
import { SavedLocationsScreen } from './components/SavedLocationsScreen';
import { DownloadRegionScreen } from './components/DownloadRegionScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { UltraNavOverlay } from './components/UltraNavOverlay';
import { VoiceAIPanel } from './components/VoiceAIPanel';
import { NavXEngineDrawer } from './components/NavXEngineDrawer';
import {
  BottomNavBar,
  TabType,
} from './components/BottomNavBar';

import { Sparkles, Zap } from 'lucide-react';

export const App: React.FC = () => {
  // =========================================================
  // MAIN VIEW STATE
  // =========================================================

  const [viewMode, setViewMode] =
    useState<'app' | 'landing'>('app');

  const [showSplash, setShowSplash] =
    useState(false);

  // =========================================================
  // REGION & SAVED LOCATIONS
  // =========================================================

  const [activeRegion, setActiveRegion] =
    useState<MapRegion>(REGIONS[0]);

  const [savedLocations, setSavedLocations] =
    useState<POI[]>(
      REGIONS[0].pois.filter(
        (p) => p.isSaved
      )
    );

  const [activeTab, setActiveTab] =
    useState<TabType>('map');

  // =========================================================
  // INITIAL ORIGIN & DESTINATION
  // =========================================================

  const homePoi =
    activeRegion.pois.find(
      (p) => p.category === 'home'
    ) || activeRegion.pois[0];

  const collegePoi =
    activeRegion.pois.find(
      (p) => p.category === 'college'
    ) || activeRegion.pois[1];

  const [originCoord, setOriginCoord] =
    useState<Coordinates>(
      homePoi.coordinate
    );

  const [originName, setOriginName] =
    useState<string>(
      homePoi.name
    );

  const [selectedDestination, setSelectedDestination] =
    useState<POI | null>(
      collegePoi
    );

  const [detailedPoi, setDetailedPoi] =
    useState<POI | null>(null);

  // =========================================================
  // POSITION FUSION
  // =========================================================

  const positionManager = useMemo(
    () =>
      new PositionFusionManager(
        REGIONS[0].pois.find(
          (p) => p.category === 'home'
        )?.coordinate ||
          REGIONS[0].pois[0].coordinate
      ),
    []
  );

  const [posState, setPosState] =
    useState<PositionState>(
      positionManager.getState()
    );

  // =========================================================
  // ROUTE MANAGER
  // =========================================================

  // Start ONLINE.
  // Demo switches to offline at Step 6.
  const routeManager = useMemo(
    () => new RouteManager(false),
    []
  );

  const [isOfflineForced, setIsOfflineForced] =
    useState<boolean>(false);

  // =========================================================
  // NAVIGATION CONTROLLER
  // =========================================================

  // Keep ONE NavigationController instance alive.
  // Region changes are synchronized through setRegion().
  const navCtrl = useMemo(
    () =>
      new NavigationController(
        activeRegion,
        positionManager
      ),
    [positionManager]
  );

  const [navProgress, setNavProgress] =
    useState<NavigationProgress>(
      navCtrl.getProgress()
    );

  // =========================================================
  // BATTERY
  // =========================================================

  const [batteryState, setBatteryState] =
    useState<BatteryState>(
      batteryManager.getState()
    );

  const [isVoiceMuted, setIsVoiceMuted] =
    useState<boolean>(false);

  // =========================================================
  // UI / MODAL STATE
  // =========================================================

  const [isSearchScreenOpen, setIsSearchScreenOpen] =
    useState(false);

  const [isSavedLocationsOpen, setIsSavedLocationsOpen] =
    useState(false);

  const [isDownloadRegionOpen, setIsDownloadRegionOpen] =
    useState(false);

  const [isSettingsScreenOpen, setIsSettingsScreenOpen] =
    useState(false);

  const [isVoiceModalOpen, setIsVoiceModalOpen] =
    useState(false);

  const [isDestinationDetailsOpen, setIsDestinationDetailsOpen] =
    useState(false);

  const [isEngineDrawerOpen, setIsEngineDrawerOpen] =
    useState(false);

  const [isPhoneFrameView, setIsPhoneFrameView] =
    useState(true);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  // Prevent overlapping toast timers.
  const toastTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  // =========================================================
  // REACTIVE ENGINE SUBSCRIPTIONS
  // =========================================================

  useEffect(() => {
    const unsubPos =
      positionManager.subscribe((state) => {
        setPosState(state);
      });

    const unsubNav =
      navCtrl.subscribe((progress) => {
        setNavProgress(progress);
      });

    const unsubBat =
      batteryManager.subscribe((battery) => {
        setBatteryState(battery);

        if (battery.isUltraMode) {
          document.body.classList.add(
            'ultra-mode'
          );
        } else {
          document.body.classList.remove(
            'ultra-mode'
          );
        }
      });

    return () => {
      unsubPos();
      unsubNav();
      unsubBat();

      document.body.classList.remove(
        'ultra-mode'
      );
    };
  }, [positionManager, navCtrl]);

  // =========================================================
  // POSITION MANAGER CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      positionManager.destroy();
    };
  }, [positionManager]);

  // =========================================================
  // TOAST CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      if (
        toastTimeoutRef.current !== null
      ) {
        clearTimeout(
          toastTimeoutRef.current
        );

        toastTimeoutRef.current = null;
      }
    };
  }, []);

  // =========================================================
  // REGION SYNCHRONIZATION
  // =========================================================

  useEffect(() => {
    // Keep navigation controller synchronized.
    navCtrl.setRegion(activeRegion);

    // Update saved locations.
    setSavedLocations(
      activeRegion.pois.filter(
        (p) => p.isSaved
      )
    );

    const newHome =
      activeRegion.pois.find(
        (p) => p.category === 'home'
      ) || activeRegion.pois[0];

    const newDestination =
      activeRegion.pois.find(
        (p) => p.category === 'college'
      ) || activeRegion.pois[1];

    // Update origin React state.
    setOriginCoord(
      newHome.coordinate
    );

    setOriginName(
      newHome.name
    );

    // IMPORTANT:
    // Reset the actual position-fusion engine too.
    // This prevents coordinates from the previous
    // region from carrying into the new region.
    positionManager.resetPosition(
      newHome.coordinate
    );

    setSelectedDestination(
      newDestination
    );
  }, [
    activeRegion,
    navCtrl,
    positionManager,
  ]);

  // =========================================================
  // TOAST
  // =========================================================

  const showToast = (
    message: string
  ) => {
    setToastMessage(message);

    // Cancel previous toast timer.
    if (
      toastTimeoutRef.current !== null
    ) {
      clearTimeout(
        toastTimeoutRef.current
      );
    }

    toastTimeoutRef.current =
      setTimeout(() => {
        setToastMessage(null);
        toastTimeoutRef.current = null;
      }, 3500);
  };

  // =========================================================
  // LAUNCH APP
  // =========================================================

  const handleLaunchApp = () => {
    setShowSplash(true);
    setViewMode('app');
  };

  // =========================================================
  // CALCULATE ROUTE
  // =========================================================

  const handleCalculateRoute = async (
    destination: POI
  ) => {
    setSelectedDestination(
      destination
    );

    const result =
      await routeManager.calculateRoute(
        originCoord,
        originName,
        destination.coordinate,
        destination.name,
        activeRegion
      );

    if (result) {
      navCtrl.startPreview(
        result.route
      );

      showToast(
        result.source === 'offline'
          ? `Calculated offline graph route: ${(
              result.route
                .totalDistanceMeters / 1000
            ).toFixed(1)} km`
          : `Calculated online route: ${(
              result.route
                .totalDistanceMeters / 1000
            ).toFixed(1)} km`
      );

      return result.route;
    }

    showToast(
      'Could not calculate route for this destination.'
    );

    return null;
  };

  // =========================================================
  // START NAVIGATION
  // =========================================================

  const handleStartNavigation = async () => {
    if (
      !navProgress.activeRoute &&
      selectedDestination
    ) {
      const result =
        await routeManager.calculateRoute(
          originCoord,
          originName,
          selectedDestination.coordinate,
          selectedDestination.name,
          activeRegion
        );

      if (result) {
        navCtrl.startNavigation(
          result.route
        );
      }

      return;
    }

    if (navProgress.activeRoute) {
      navCtrl.startNavigation();
    }
  };

  // =========================================================
  // AI COMMAND EXECUTION
  // =========================================================

  const handleExecuteAICommand = async (
    result: AICommandResult
  ) => {
    setIsVoiceModalOpen(false);

    if (
      result.intent === 'STOP_NAV'
    ) {
      navCtrl.stopNavigation();

      showToast(
        'Navigation stopped via voice command'
      );

      return;
    }

    if (
      result.intent === 'REROUTE'
    ) {
      navCtrl.simulateMissedTurn();

      showToast(
        'Offline reroute triggered via voice command'
      );

      return;
    }

    if (
      result.intent === 'NAVIGATE' ||
      result.intent === 'GO_HOME' ||
      result.intent === 'GO_SAVED'
    ) {
      const destination =
        result.matchedPOI ||
        selectedDestination;

      if (!destination) {
        showToast(
          'No destination selected for navigation'
        );

        return;
      }

      const route =
        await handleCalculateRoute(
          destination
        );

      if (route) {
        navCtrl.startNavigation(
          route
        );
      }
    }
  };

  // =========================================================
  // BOTTOM TAB NAVIGATION
  // =========================================================

  const handleSelectTab = (
    tab: TabType
  ) => {
    setActiveTab(tab);

    if (tab === 'saved') {
      setIsSavedLocationsOpen(true);
    }

    if (tab === 'regions') {
      setIsDownloadRegionOpen(true);
    }

    if (tab === 'settings') {
      setIsSettingsScreenOpen(true);
    }
  };

  // =========================================================
  // SAVE / UNSAVE POI
  // =========================================================

  const handleToggleSavePOI = (
    poi: POI
  ) => {
    setSavedLocations((previous) => {
      const exists =
        previous.some(
          (item) =>
            item.id === poi.id
        );

      if (exists) {
        showToast(
          `Removed "${poi.name}" from saved places`
        );

        return previous.filter(
          (item) =>
            item.id !== poi.id
        );
      }

      showToast(
        `Saved "${poi.name}" to favorites`
      );

      return [
        ...previous,
        {
          ...poi,
          isSaved: true,
        },
      ];
    });
  };

  // =========================================================
  // 15-STEP HACKATHON DEMO
  // =========================================================

  const handleRunDemoStep = (
    stepNumber: number
  ) => {
    switch (stepNumber) {

      // -----------------------------------------------------
      // STEP 1 — LAUNCH
      // -----------------------------------------------------

      case 1:
        setShowSplash(true);

        showToast(
          'Step 1: Launching IQOO NavX'
        );

        break;

      // -----------------------------------------------------
      // STEP 2 — REGIONAL OFFLINE MAPS
      // -----------------------------------------------------

      case 2:
        setIsDownloadRegionOpen(true);

        showToast(
          'Step 2: Regional Offline Maps'
        );

        break;

      // -----------------------------------------------------
      // STEP 3 — SELECT COLLEGE
      // -----------------------------------------------------

      case 3:
        if (collegePoi) {
          setSelectedDestination(
            collegePoi
          );

          setDetailedPoi(
            collegePoi
          );

          setIsDestinationDetailsOpen(
            true
          );
        }

        showToast(
          'Step 3: College selected as destination'
        );

        break;

      // -----------------------------------------------------
      // STEP 4 — CALCULATE ROUTE
      // -----------------------------------------------------

      case 4:
        if (collegePoi) {
          void handleCalculateRoute(
            collegePoi
          ).then((route) => {
            if (route) {
              showToast(
                'Step 4: Route calculated successfully'
              );
            }
          });
        }

        break;

      // -----------------------------------------------------
      // STEP 5 — START NAVIGATION
      // -----------------------------------------------------

      case 5:
        void handleStartNavigation();

        showToast(
          'Step 5: Turn-by-turn navigation started'
        );

        break;

      // -----------------------------------------------------
      // STEP 6 — INTERNET OFF
      // -----------------------------------------------------

      case 6:
        setIsOfflineForced(true);

        routeManager.setOfflineSimulation(
          true
        );

        showToast(
          'Step 6: Internet connection disabled'
        );

        break;

      // -----------------------------------------------------
      // STEP 7 — OFFLINE NAVIGATION CONTINUES
      // -----------------------------------------------------

      case 7:
        setIsOfflineForced(true);

        routeManager.setOfflineSimulation(
          true
        );

        showToast(
          'Step 7: Offline navigation continues'
        );

        break;

      // -----------------------------------------------------
      // STEP 8 — GPS WEAK
      // -----------------------------------------------------

      case 8:
        positionManager.setGpsQuality(
          'weak'
        );

        showToast(
          'Step 8: GPS weak — sensor-assisted positioning active'
        );

        break;

      // -----------------------------------------------------
      // STEP 9 — DEAD RECKONING
      // -----------------------------------------------------

      case 9:
        positionManager.stepDeadReckoning(
          Math.max(
            posState.speed,
            8
          ),
          posState.heading,
          1.0
        );

        showToast(
          'Step 9: Dead reckoning maintains position'
        );

        break;

      // -----------------------------------------------------
      // STEP 10 — GPS RESTORED
      // -----------------------------------------------------

      case 10: {
        const recoveryTarget =
          navProgress.activeRoute?.destination ||
          selectedDestination?.coordinate ||
          collegePoi.coordinate;

        positionManager.setGpsQuality(
          'strong',
          recoveryTarget
        );

        showToast(
          'Step 10: GPS restored — position smoothly corrected'
        );

        break;
      }

      // -----------------------------------------------------
      // STEP 11 — AI VOICE
      // -----------------------------------------------------

      case 11:
        setIsVoiceModalOpen(true);

        showToast(
          'Step 11: AI voice navigation ready'
        );

        break;

      // -----------------------------------------------------
      // STEP 12 — ORIGIN ISLAND
      // -----------------------------------------------------

      case 12:
        showToast(
          'Step 12: Origin Island live navigation status active'
        );

        break;

      // -----------------------------------------------------
      // STEP 13 — LOW BATTERY
      // -----------------------------------------------------

      case 13:
        batteryManager.setSimulatedBatteryLevel(
          0.15
        );

        showToast(
          'Step 13: Low battery detected'
        );

        break;

      // -----------------------------------------------------
      // STEP 14 — ULTRA NAVIGATION MODE
      // -----------------------------------------------------

      case 14:
        batteryManager.toggleUltraMode(
          true
        );

        showToast(
          'Step 14: Ultra Navigation Mode activated'
        );

        break;

      // -----------------------------------------------------
      // STEP 15 — CONTINUE NAVIGATION
      // -----------------------------------------------------

      case 15:
        showToast(
          'Step 15: Navigation continues in Ultra Mode'
        );

        break;

      default:
        break;
    }
  };

  // =========================================================
  // NAVIGATION STATE HELPERS
  // =========================================================

  const isNavigating =
    navProgress.status === 'navigating' ||
    navProgress.status === 'rerouting';

  const isPreviewing =
    navProgress.status === 'previewing' &&
    navProgress.activeRoute !== null;

  const isIdle =
    navProgress.status === 'idle' ||
    navProgress.status === 'arrived';

  // =========================================================
  // LANDING PAGE
  // =========================================================

  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLaunchApp={
          handleLaunchApp
        }
      />
    );
  }

  // =========================================================
  // MAIN APPLICATION
  // =========================================================

  return (
    <div className="min-h-screen bg-[#08090A] text-[#F5F7F8] flex flex-col items-center justify-start relative overflow-x-hidden font-sans">

      {/* SPLASH SCREEN */}

      {showSplash && (
        <SplashScreen
          onComplete={() =>
            setShowSplash(false)
          }
        />
      )}

      {/* HEADER */}

      <NavigationHeader
        isNavigating={
          isNavigating
        }
        isOffline={
          isOfflineForced
        }
        posState={
          posState
        }
        batteryState={
          batteryState
        }
        onBackOrStopNav={() =>
          navCtrl.stopNavigation()
        }
        onToggleViewMode={() =>
          setViewMode('landing')
        }
        isPhoneFrameView={
          isPhoneFrameView
        }
        onTogglePhoneFrame={() =>
          setIsPhoneFrameView(
            !isPhoneFrameView
          )
        }
      />

      {/* MAIN APP FRAME */}

      <main
        className={`w-full flex-1 flex flex-col items-center justify-start p-0 sm:py-2 transition-all ${
          isPhoneFrameView
            ? 'max-w-md'
            : 'max-w-6xl'
        }`}
      >
        <div
          className={`w-full flex-1 flex flex-col bg-[#08090A] sm:rounded-3xl border border-[#2B2F33] shadow-2xl relative overflow-hidden ${
            isPhoneFrameView
              ? 'min-h-[820px] max-h-[880px]'
              : 'min-h-[720px]'
          }`}
        >

          {/* ORIGIN ISLAND */}

          <OriginIsland
            navProgress={
              navProgress
            }
            posState={
              posState
            }
            batteryState={
              batteryState
            }
            isOffline={
              isOfflineForced
            }
            onToggleUltraMode={() =>
              batteryManager.toggleUltraMode()
            }
          />

          {/* TURN GUIDANCE HUD */}

          <TurnGuidanceHUD
            progress={
              navProgress
            }
            posState={
              posState
            }
            activeRoute={
              navProgress.activeRoute
            }
            isMuted={
              isVoiceMuted
            }
            isOffline={
              isOfflineForced
            }
            onToggleMute={() => {
              const muted =
                !isVoiceMuted;

              setIsVoiceMuted(
                muted
              );

              voiceEngine.setMuted(
                muted
              );
            }}
            onStopNav={() =>
              navCtrl.stopNavigation()
            }
            onReroute={() =>
              navCtrl.simulateMissedTurn()
            }
            onOpenVoice={() =>
              setIsVoiceModalOpen(
                true
              )
            }
          />

          {/* MAP AREA */}

          <div className="flex-1 w-full relative min-h-[420px]">

            <MapView
              currentPosition={
                posState.currentPosition
              }
              positionState={
                posState
              }
              activeRoute={
                navProgress.activeRoute
              }
              activeRegion={
                activeRegion
              }
              savedLocations={
                savedLocations
              }
              isUltraMode={
                batteryState.isUltraMode
              }
              onSelectPOI={(poi) => {
                setDetailedPoi(
                  poi
                );

                setIsDestinationDetailsOpen(
                  true
                );
              }}
            />

            {/* HOME OVERLAY */}

            {isIdle && (
              <HomeScreenOverlay
                activeRegion={
                  activeRegion
                }
                savedLocations={
                  savedLocations
                }
                posState={
                  posState
                }
                batteryState={
                  batteryState
                }
                isOffline={
                  isOfflineForced
                }
                onOpenSearch={() =>
                  setIsSearchScreenOpen(
                    true
                  )
                }
                onOpenVoice={() =>
                  setIsVoiceModalOpen(
                    true
                  )
                }
                onOpenSavedLocations={() =>
                  setIsSavedLocationsOpen(
                    true
                  )
                }
                onOpenDownloadRegion={() =>
                  setIsDownloadRegionOpen(
                    true
                  )
                }
                onSelectDestination={(poi) => {
                  setDetailedPoi(
                    poi
                  );

                  setIsDestinationDetailsOpen(
                    true
                  );
                }}
                onOpenEngineDrawer={() =>
                  setIsEngineDrawerOpen(
                    true
                  )
                }
              />
            )}

            {/* ROUTE CONTEXT */}

            {isNavigating &&
              navProgress.activeRoute && (
                <div className="absolute bottom-3 left-0 right-0 z-30 pointer-events-none">
                  <RouteContextCard
                    context={
                      navProgress
                        .activeRoute
                        .context
                    }
                  />
                </div>
              )}

          </div>

          {/* ROUTE PREVIEW */}

          {isPreviewing &&
            navProgress.activeRoute && (
              <RoutePreviewCard
                route={
                  navProgress.activeRoute
                }
                onStartNavigation={
                  handleStartNavigation
                }
                onCancel={() =>
                  navCtrl.stopNavigation()
                }
              />
            )}

          {/* LOW BATTERY WARNING */}

          {batteryState.isLowBattery &&
            !batteryState.isUltraMode && (
              <div className="mx-4 my-2 p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-200 flex items-center justify-between z-30 select-none">

                <div className="flex items-center gap-2">

                  <Zap
                    size={16}
                    className="text-[#FFD400] animate-pulse"
                  />

                  <span className="text-xs font-semibold">
                    Battery low (
                    {Math.round(
                      batteryState.level *
                        100
                    )}
                    %) — Ultra Navigation Mode
                    recommended
                  </span>

                </div>

                <button
                  onClick={() =>
                    batteryManager.toggleUltraMode(
                      true
                    )
                  }
                  className="px-3 py-1 rounded-xl bg-[#FFD400] text-black font-extrabold text-xs hover:bg-[#e6bf00] transition-colors font-display"
                >
                  Enable
                </button>

              </div>
            )}

          {/* BOTTOM NAVIGATION */}

          <BottomNavBar
  activeTab={activeTab}
  onChangeTab={
    handleSelectTab
  }
  isNavigating={isNavigating}
/>
          {/* TOAST */}

          {toastMessage && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#FFD400] text-black font-extrabold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 font-display">

              <Sparkles size={14} />

              <span>
                {toastMessage}
              </span>

            </div>
          )}

          {/* ULTRA MODE */}

          {batteryState.isUltraMode && (
            <UltraNavOverlay
              navProgress={
                navProgress
              }
              posState={
                posState
              }
              batteryState={
                batteryState
              }
              isVoiceMuted={
                isVoiceMuted
              }
              onToggleMute={() => {
                const muted =
                  !isVoiceMuted;

                setIsVoiceMuted(
                  muted
                );

                voiceEngine.setMuted(
                  muted
                );
              }}
              onExitUltraMode={() =>
                batteryManager.toggleUltraMode(
                  false
                )
              }
            />
          )}

        </div>
      </main>

      {/* =====================================================
          ENGINE DRAWER
          ===================================================== */}

      <NavXEngineDrawer
        isOpen={
          isEngineDrawerOpen
        }
        onClose={() =>
          setIsEngineDrawerOpen(
            false
          )
        }
        isOffline={
          isOfflineForced
        }
        onToggleInternet={() => {
          const nextState =
            !isOfflineForced;

          setIsOfflineForced(
            nextState
          );

          routeManager.setOfflineSimulation(
            nextState
          );

          showToast(
            nextState
              ? 'Simulating Offline Mode (No Internet)'
              : 'Simulating Online Mode'
          );
        }}
        posState={
          posState
        }
        onSetGpsQuality={(quality) => {
          positionManager.setGpsQuality(
            quality,
            collegePoi.coordinate
          );

          showToast(
            quality === 'weak'
              ? 'GPS Weak — Position Fusion switched to IMU Dead Reckoning'
              : 'GPS Restored — Position smoothly corrected'
          );
        }}
        onSimulateMissedTurn={() => {
          navCtrl.simulateMissedTurn();

          showToast(
            'Missed turn simulated! Calculating offline alternative route...'
          );
        }}
        batteryState={
          batteryState
        }
        onSetBatteryLevel={(level) =>
          batteryManager.setSimulatedBatteryLevel(
            level
          )
        }
        onToggleUltraMode={() =>
          batteryManager.toggleUltraMode()
        }
        navProgress={
          navProgress
        }
        onRunAutoDemoStep={(step) =>
          handleRunDemoStep(step)
        }
      />

      {/* =====================================================
          SEARCH
          ===================================================== */}

      <SearchScreen
        isOpen={
          isSearchScreenOpen
        }
        onClose={() =>
          setIsSearchScreenOpen(
            false
          )
        }
        activeRegion={
          activeRegion
        }
        currentCoord={
          posState.currentPosition
        }
        savedLocations={
          savedLocations
        }
        onSelectDestination={(poi) => {
          setIsSearchScreenOpen(
            false
          );

          setDetailedPoi(
            poi
          );

          setIsDestinationDetailsOpen(
            true
          );
        }}
        onOpenVoice={() =>
          setIsVoiceModalOpen(
            true
          )
        }
      />

      {/* =====================================================
          DESTINATION DETAILS
          ===================================================== */}

      <DestinationDetailsModal
        isOpen={
          isDestinationDetailsOpen
        }
        poi={
          detailedPoi
        }
        onClose={() =>
          setIsDestinationDetailsOpen(
            false
          )
        }
        currentCoord={
          posState.currentPosition
        }
        onStartRoute={(poi) => {
          setIsDestinationDetailsOpen(
            false
          );

          void handleCalculateRoute(
            poi
          );
        }}
        onToggleSave={
          handleToggleSavePOI
        }
        onOpenVoice={() =>
          setIsVoiceModalOpen(
            true
          )
        }
      />

      {/* =====================================================
          SAVED LOCATIONS
          ===================================================== */}

      <SavedLocationsScreen
        isOpen={
          isSavedLocationsOpen
        }
        onClose={() => {
          setIsSavedLocationsOpen(
            false
          );

          setActiveTab('map');
        }}
        savedLocations={
          savedLocations
        }
        currentCoord={
          posState.currentPosition
        }
        onSelectDestination={(poi) => {
          setIsSavedLocationsOpen(
            false
          );

          void handleCalculateRoute(
            poi
          );
        }}
        onAddLocation={(newPoi) => {
          setSavedLocations(
            (previous) => [
              ...previous,
              newPoi,
            ]
          );

          showToast(
            `Added "${newPoi.name}" to saved locations`
          );
        }}
        onDeleteLocation={(id) => {
          setSavedLocations(
            (previous) =>
              previous.filter(
                (poi) =>
                  poi.id !== id
              )
          );

          showToast(
            'Removed saved location'
          );
        }}
      />

      {/* =====================================================
          DOWNLOAD REGIONS
          ===================================================== */}

      <DownloadRegionScreen
        isOpen={
          isDownloadRegionOpen
        }
        onClose={() => {
          setIsDownloadRegionOpen(
            false
          );

          setActiveTab('map');
        }}
        activeRegion={
          activeRegion
        }
        onSelectRegion={(region) => {
          // Stop old navigation before switching
          // to another region.
          if (
            navProgress.status ===
              'navigating' ||
            navProgress.status ===
              'rerouting' ||
            navProgress.status ===
              'previewing' ||
            navProgress.status ===
              'paused'
          ) {
            navCtrl.stopNavigation();
          }

          setActiveRegion(
            region
          );

          showToast(
            `Active offline region set to: ${region.name}`
          );
        }}
      />

      {/* =====================================================
          SETTINGS
          ===================================================== */}

      <SettingsScreen
        isOpen={
          isSettingsScreenOpen
        }
        onClose={() => {
          setIsSettingsScreenOpen(
            false
          );

          setActiveTab('map');
        }}
        batteryState={
          batteryState
        }
        onToggleUltraMode={() =>
          batteryManager.toggleUltraMode()
        }
        isVoiceMuted={
          isVoiceMuted
        }
        onToggleMute={() => {
          const muted =
            !isVoiceMuted;

          setIsVoiceMuted(
            muted
          );

          voiceEngine.setMuted(
            muted
          );
        }}
      />

      {/* =====================================================
          AI VOICE PANEL
          ===================================================== */}

      <VoiceAIPanel
        isOpen={
          isVoiceModalOpen
        }
        onClose={() =>
          setIsVoiceModalOpen(
            false
          )
        }
        activeRegion={
          activeRegion
        }
        savedLocations={
          savedLocations
        }
        onExecuteCommand={
          handleExecuteAICommand
        }
      />

    </div>
  );
};

export default App;
