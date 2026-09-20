import {
  Coordinates,
  MapRegion,
  NavigationStatus,
  Route,
  TurnInstruction,
} from '../types';
import {
  calculateOfflineRoute,
  getBearing,
  getDistanceMeters,
  isOffRoute,
} from './offlineRouter';
import { PositionFusionManager } from '../sensors/positionFusion';
import { voiceEngine } from '../voice/voiceGuidance';

export interface NavigationProgress {
  status: NavigationStatus;
  activeRoute: Route | null;
  currentStepIndex: number;
  currentInstruction: TurnInstruction | null;
  distanceToNextTurnMeters: number;
  remainingDistanceMeters: number;
  remainingDurationSeconds: number;
  progressPercent: number;
  isOffRouteDetected: boolean;
  rerouteCount: number;
}

export class NavigationController {
  private status: NavigationStatus = 'idle';
  private activeRoute: Route | null = null;
  private currentStepIndex: number = 0;
  private distanceToNextTurnMeters: number = 0;
  private remainingDistanceMeters: number = 0;
  private remainingDurationSeconds: number = 0;
  private isOffRouteDetected: boolean = false;
  private rerouteCount: number = 0;

  private activeRegion: MapRegion;
  private positionManager: PositionFusionManager;

  // Navigation simulation timer
  private simIntervalId: ReturnType<typeof setInterval> | null =
    null;

  // Offline reroute calculation timer
  private rerouteTimeoutId: ReturnType<typeof setTimeout> | null =
    null;

  private currentCoordIndex: number = 0;
  private simSpeedMultiplier: number = 1.0;

  private listeners: Array<
    (progress: NavigationProgress) => void
  > = [];

  constructor(
    region: MapRegion,
    positionManager: PositionFusionManager
  ) {
    this.activeRegion = region;
    this.positionManager = positionManager;
  }

  public setRegion(region: MapRegion) {
    this.activeRegion = region;
  }

  public subscribe(
    cb: (progress: NavigationProgress) => void
  ): () => void {
    this.listeners.push(cb);

    // Immediately provide current state.
    cb(this.getProgress());

    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== cb
      );
    };
  }

  private notify() {
    const progress = this.getProgress();

    // Copy listeners so an unsubscribe during notification
    // does not interfere with the current notification cycle.
    [...this.listeners].forEach((listener) => {
      listener(progress);
    });
  }

  public getProgress(): NavigationProgress {
    const currentInstruction =
      this.activeRoute &&
      this.activeRoute.instructions[this.currentStepIndex]
        ? this.activeRoute.instructions[
            this.currentStepIndex
          ]
        : null;

    const totalDist =
      this.activeRoute?.totalDistanceMeters || 1;

    const progressPercent = Math.min(
      100,
      Math.max(
        0,
        ((totalDist - this.remainingDistanceMeters) /
          totalDist) *
          100
      )
    );

    return {
      status: this.status,
      activeRoute: this.activeRoute,
      currentStepIndex: this.currentStepIndex,
      currentInstruction,
      distanceToNextTurnMeters: Math.round(
        this.distanceToNextTurnMeters
      ),
      remainingDistanceMeters: Math.round(
        this.remainingDistanceMeters
      ),
      remainingDurationSeconds: Math.round(
        this.remainingDurationSeconds
      ),
      progressPercent: Math.round(progressPercent),
      isOffRouteDetected: this.isOffRouteDetected,
      rerouteCount: this.rerouteCount,
    };
  }

  public startPreview(route: Route) {
    this.stopSimulation();
    this.cancelPendingReroute();

    this.activeRoute = route;
    this.status = 'previewing';
    this.currentStepIndex = 0;
    this.currentCoordIndex = 0;

    this.remainingDistanceMeters =
      route.totalDistanceMeters;

    this.remainingDurationSeconds =
      route.totalDurationSeconds;

    this.distanceToNextTurnMeters =
      route.instructions[0]?.distanceMeters || 0;

    this.isOffRouteDetected = false;

    // New route = new navigation session.
    this.rerouteCount = 0;

    this.notify();
  }

  public startNavigation(route?: Route) {
    this.stopSimulation();
    this.cancelPendingReroute();

    if (route) {
      this.activeRoute = route;
    }

    if (!this.activeRoute) return;

    this.status = 'navigating';
    this.currentStepIndex = 0;
    this.currentCoordIndex = 0;

    this.remainingDistanceMeters =
      this.activeRoute.totalDistanceMeters;

    this.remainingDurationSeconds =
      this.activeRoute.totalDurationSeconds;

    this.distanceToNextTurnMeters =
      this.activeRoute.instructions[0]?.distanceMeters || 0;

    this.isOffRouteDetected = false;

    // New navigation session starts with zero reroutes.
    this.rerouteCount = 0;

    const firstTurn =
      this.activeRoute.instructions[0];

    voiceEngine.speak(
      `Starting navigation to ${this.activeRoute.destinationName}. ${
        firstTurn?.instruction || 'Proceed on route'
      }.`,
      true
    );

    this.startSimulationLoop();
    this.notify();
  }

  public stopNavigation() {
    this.stopSimulation();
    this.cancelPendingReroute();

    this.status = 'idle';
    this.activeRoute = null;
    this.isOffRouteDetected = false;

    this.currentStepIndex = 0;
    this.currentCoordIndex = 0;
    this.distanceToNextTurnMeters = 0;
    this.remainingDistanceMeters = 0;
    this.remainingDurationSeconds = 0;

    voiceEngine.speak(
      'Navigation stopped.',
      true
    );

    this.notify();
  }

  public pauseNavigation() {
    this.stopSimulation();
    this.cancelPendingReroute();

    this.status = 'paused';
    this.notify();
  }

  public resumeNavigation() {
    if (
      this.status === 'paused' &&
      this.activeRoute
    ) {
      this.status = 'navigating';
      this.startSimulationLoop();
      this.notify();
    }
  }

  public setSimSpeed(speedMultiplier: number) {
    this.simSpeedMultiplier = Math.max(
      0.1,
      speedMultiplier
    );

    if (this.status === 'navigating') {
      this.startSimulationLoop();
    }
  }

  // Simulate vehicle advancing along route coordinates.
  private startSimulationLoop() {
    this.stopSimulation();

    this.simIntervalId = setInterval(() => {
      if (
        this.status !== 'navigating' ||
        !this.activeRoute
      ) {
        return;
      }

      const coords =
        this.activeRoute.coordinates;

      if (
        this.currentCoordIndex >=
        coords.length - 1
      ) {
        const destinationName =
          this.activeRoute.destinationName;

        this.status = 'arrived';
        this.stopSimulation();

        this.remainingDistanceMeters = 0;
        this.remainingDurationSeconds = 0;
        this.distanceToNextTurnMeters = 0;
        this.isOffRouteDetected = false;

        voiceEngine.speak(
          `You have arrived at your destination: ${destinationName}.`,
          true
        );

        this.notify();
        return;
      }

      this.currentCoordIndex++;

      const currentCoord =
        coords[this.currentCoordIndex];

      const prevCoord =
        coords[this.currentCoordIndex - 1];

      const bearing = getBearing(
        prevCoord,
        currentCoord
      );

      const speedMs =
        15 * this.simSpeedMultiplier;

      this.positionManager.updateGpsPosition(
        currentCoord,
        speedMs,
        bearing
      );

      this.updateRemainingMeters(
        currentCoord
      );

      if (
        isOffRoute(
          currentCoord,
          coords,
          80
        )
      ) {
        this.triggerOfflineReroute(
          currentCoord
        );
        return;
      }

      this.notify();
    }, 1000 / this.simSpeedMultiplier);
  }

  private stopSimulation() {
    if (this.simIntervalId !== null) {
      clearInterval(this.simIntervalId);
      this.simIntervalId = null;
    }
  }

  private cancelPendingReroute() {
    if (this.rerouteTimeoutId !== null) {
      clearTimeout(this.rerouteTimeoutId);
      this.rerouteTimeoutId = null;
    }
  }

  private updateRemainingMeters(
    currentPos: Coordinates
  ) {
    if (!this.activeRoute) return;

    let remainingDist = 0;

    const coords =
      this.activeRoute.coordinates;

    for (
      let i = this.currentCoordIndex;
      i < coords.length - 1;
      i++
    ) {
      remainingDist += getDistanceMeters(
        coords[i],
        coords[i + 1]
      );
    }

    this.remainingDistanceMeters =
      remainingDist;

    this.remainingDurationSeconds =
      Math.round(remainingDist / 12);

    for (
      let s = this.currentStepIndex;
      s < this.activeRoute.instructions.length;
      s++
    ) {
      const step =
        this.activeRoute.instructions[s];

      const distToStep =
        getDistanceMeters(
          currentPos,
          step.coordinate
        );

      if (
        distToStep < 25 &&
        s <
          this.activeRoute.instructions.length - 1
      ) {
        this.currentStepIndex = s + 1;

        const nextStep =
          this.activeRoute.instructions[
            this.currentStepIndex
          ];

        if (nextStep) {
          voiceEngine.speak(
            nextStep.instruction
          );
        }
      }
    }

    const currentStep =
      this.activeRoute.instructions[
        this.currentStepIndex
      ];

    if (currentStep) {
      this.distanceToNextTurnMeters =
        getDistanceMeters(
          currentPos,
          currentStep.coordinate
        );
    }
  }

  // Force trigger a simulated missed turn.
  // Used by the hackathon demo.
  public simulateMissedTurn() {
    if (
      !this.activeRoute ||
      this.status !== 'navigating'
    ) {
      return;
    }

    const currentPosition =
      this.positionManager.getState().currentPosition;

    // Move slightly away from the current route
    // to simulate a missed turn in any supported region.
    const missedCoord: Coordinates = {
      lat: currentPosition.lat + 0.0012,
      lng: currentPosition.lng + 0.0012,
    };

    this.positionManager.updateGpsPosition(
      missedCoord,
      12,
      110
    );

    this.triggerOfflineReroute(
      missedCoord
    );
  }

  // Automatic offline rerouting calculation.
  public triggerOfflineReroute(
    fromCoord: Coordinates
  ) {
    if (
      !this.activeRoute ||
      this.status === 'rerouting'
    ) {
      return;
    }

    // Cancel any older reroute timer before creating
    // a new one.
    this.cancelPendingReroute();

    const destination =
      this.activeRoute.destination;

    const destinationName =
      this.activeRoute.destinationName;

    this.status = 'rerouting';
    this.isOffRouteDetected = true;
    this.rerouteCount++;

    // Stop the simulation while rerouting.
    this.stopSimulation();

    this.notify();

    voiceEngine.speak(
      'Off-route detected. Recalculating offline route...',
      true
    );

    this.rerouteTimeoutId = setTimeout(() => {
      this.rerouteTimeoutId = null;

      // Navigation may have been stopped,
      // paused, or replaced while rerouting.
      if (
        !this.activeRoute ||
        this.status !== 'rerouting'
      ) {
        return;
      }

      const newRoute =
        calculateOfflineRoute(
          fromCoord,
          'Current Position (Off-Route Detour)',
          destination,
          destinationName,
          this.activeRegion
        );

      if (newRoute) {
        this.activeRoute = newRoute;
        this.status = 'navigating';
        this.currentStepIndex = 0;
        this.currentCoordIndex = 0;

        this.remainingDistanceMeters =
          newRoute.totalDistanceMeters;

        this.remainingDurationSeconds =
          newRoute.totalDurationSeconds;

        this.distanceToNextTurnMeters =
          newRoute.instructions[0]
            ?.distanceMeters || 0;

        this.isOffRouteDetected = false;

        voiceEngine.speak(
          `Route recalculated. In ${
            newRoute.instructions[0]
              ?.distanceMeters || 100
          } meters, ${
            newRoute.instructions[0]
              ?.instruction || 'continue'
          }.`,
          true
        );

        this.startSimulationLoop();
        this.notify();
      } else {
        // Reroute failed, but keep navigation alive.
        this.status = 'navigating';
        this.isOffRouteDetected = false;

        this.startSimulationLoop();
        this.notify();
      }
    }, 750);
  }
}
