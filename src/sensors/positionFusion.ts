import {
  Coordinates,
  GPSQuality,
  PositionState,
  SensorData,
} from '../types';
import { getDistanceMeters } from '../engine/offlineRouter';

export class PositionFusionManager {
  private currentPosition: Coordinates;

  private heading: number = 0;
  private speed: number = 0;
  private accuracyMeters: number = 4.0;

  private gpsQuality: GPSQuality = 'strong';
  private isSensorAssisted: boolean = false;
  private isRecoverySmoothing: boolean = false;

  // GPS recovery state
  private recoveryTargetGps: Coordinates | null = null;
  private recoveryStepCount: number = 0;
  private recoveryIntervalId: ReturnType<typeof setInterval> | null =
    null;

  // IMU sensor cache
  private sensorData: SensorData = {
    accelerometer: {
      x: 0,
      y: 0,
      z: 9.81,
    },
    gyroscope: {
      alpha: 0,
      beta: 0,
      gamma: 0,
    },
    compassHeading: 0,
    stepCount: 0,
    isAvailable: true,
  };

  // Sensor event handlers are stored so they can be removed.
  private orientationHandler:
    | ((event: DeviceOrientationEvent) => void)
    | null = null;

  private motionHandler:
    | ((event: DeviceMotionEvent) => void)
    | null = null;

  private listeners: Array<
    (state: PositionState) => void
  > = [];

  constructor(initialCoord: Coordinates) {
    this.currentPosition = {
      ...initialCoord,
    };

    this.initSensors();
  }

  private initSensors() {
    if (typeof window === 'undefined') {
      return;
    }

    // Device Orientation / Compass
    if ('DeviceOrientationEvent' in window) {
      this.orientationHandler = (
        e: DeviceOrientationEvent
      ) => {
        if (e.alpha !== null) {
          this.sensorData.gyroscope.alpha =
            e.alpha;

          this.sensorData.gyroscope.beta =
            e.beta || 0;

          this.sensorData.gyroscope.gamma =
            e.gamma || 0;

          this.sensorData.compassHeading =
            e.alpha;

          if (
            this.gpsQuality === 'weak' ||
            this.gpsQuality === 'lost'
          ) {
            this.heading = e.alpha;
          }
        }
      };

      window.addEventListener(
        'deviceorientation',
        this.orientationHandler
      );
    }

    // Device Motion / Accelerometer
    if ('DeviceMotionEvent' in window) {
      this.motionHandler = (
        e: DeviceMotionEvent
      ) => {
        if (e.acceleration) {
          this.sensorData.accelerometer = {
            x: e.acceleration.x || 0,
            y: e.acceleration.y || 0,
            z: e.acceleration.z || 9.81,
          };
        }
      };

      window.addEventListener(
        'devicemotion',
        this.motionHandler
      );
    }
  }

  public subscribe(
    cb: (state: PositionState) => void
  ): () => void {
    this.listeners.push(cb);

    cb(this.getState());

    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== cb
      );
    };
  }

  private notify() {
    const state = this.getState();

    // Copy listeners before notification so an unsubscribe
    // during a callback does not affect this notification cycle.
    [...this.listeners].forEach((listener) => {
      listener(state);
    });
  }

  public resetPosition(target: Coordinates) {
    this.cancelGpsRecovery();

    this.currentPosition = {
      ...target,
    };

    this.heading = 0;
    this.speed = 0;
    this.accuracyMeters = 4.0;
    this.gpsQuality = 'strong';
    this.isSensorAssisted = false;
    this.isRecoverySmoothing = false;

    this.notify();
  }

  public getState(): PositionState {
    return {
      currentPosition: {
        ...this.currentPosition,
      },

      heading: this.heading,
      speed: this.speed,
      accuracyMeters: this.accuracyMeters,

      source: this.isSensorAssisted
        ? 'sensor_fusion'
        : 'gps',

      gpsQuality: this.gpsQuality,
      isSensorAssisted:
        this.isSensorAssisted,

      isRecoverySmoothing:
        this.isRecoverySmoothing,

      lastUpdated: Date.now(),
    };
  }

  // Update real or simulated GPS reading
  public updateGpsPosition(
    newGpsCoord: Coordinates,
    speedMs: number,
    headingDeg?: number,
    accuracy = 4.0
  ) {
    if (this.gpsQuality === 'strong') {
      this.isSensorAssisted = false;
      this.isRecoverySmoothing = false;
      this.accuracyMeters = accuracy;

      this.currentPosition = {
        ...newGpsCoord,
      };

      this.speed = speedMs;

      if (headingDeg !== undefined) {
        this.heading = headingDeg;
      }

      this.notify();
      return;
    }

    if (
      this.gpsQuality === 'weak' ||
      this.gpsQuality === 'lost'
    ) {
      this.isSensorAssisted = true;

      this.accuracyMeters =
        24.0 + Math.random() * 8;

      this.stepDeadReckoning(
        speedMs,
        headingDeg
      );
    }
  }

  // Set GPS Quality
  public setGpsQuality(
    quality: GPSQuality,
    trueGpsCoord?: Coordinates
  ) {
    const previousQuality =
      this.gpsQuality;

    this.gpsQuality = quality;

    if (
      quality === 'weak' ||
      quality === 'lost'
    ) {
      // If GPS becomes unreliable, cancel any
      // previous recovery animation.
      this.cancelGpsRecovery();

      this.isSensorAssisted = true;
      this.isRecoverySmoothing = false;
      this.accuracyMeters = 28.0;
    } else if (quality === 'strong') {
      if (
        previousQuality === 'weak' ||
        previousQuality === 'lost'
      ) {
        if (trueGpsCoord) {
          this.beginGpsRecovery(
            trueGpsCoord
          );
        } else {
          this.isSensorAssisted = false;
          this.isRecoverySmoothing = false;
          this.accuracyMeters = 4.0;
        }
      } else {
        this.isSensorAssisted = false;
        this.isRecoverySmoothing = false;
        this.accuracyMeters = 4.0;
      }
    }

    this.notify();
  }

  // Advance position via IMU dead reckoning
  public stepDeadReckoning(
    speedMs: number,
    headingDeg?: number,
    dtSeconds = 1.0
  ) {
    if (headingDeg !== undefined) {
      this.heading = headingDeg;
    } else if (
      this.sensorData.compassHeading
    ) {
      this.heading =
        this.sensorData.compassHeading;
    }

    this.speed = speedMs;

    const distanceMeters =
      speedMs * dtSeconds;

    const headingRad =
      (this.heading * Math.PI) / 180;

    // 1 degree latitude ~= 111,111 meters
    const deltaLat =
      (distanceMeters *
        Math.cos(headingRad)) /
      111111;

    // 1 degree longitude depends on latitude
    const latitudeRad =
      (this.currentPosition.lat *
        Math.PI) /
      180;

    const cosLatitude =
      Math.cos(latitudeRad);

    // Avoid division by an extremely small number
    // near the poles.
    const safeCosLatitude =
      Math.max(Math.abs(cosLatitude), 0.01) *
      Math.sign(cosLatitude || 1);

    const deltaLng =
      (distanceMeters *
        Math.sin(headingRad)) /
      (111111 * safeCosLatitude);

    this.currentPosition = {
      lat:
        this.currentPosition.lat +
        deltaLat,

      lng:
        this.currentPosition.lng +
        deltaLng,
    };

    this.notify();
  }

  // Smooth GPS recovery
  private beginGpsRecovery(
    targetGps: Coordinates
  ) {
    // Prevent multiple recovery intervals.
    this.cancelGpsRecovery();

    this.isRecoverySmoothing = true;
    this.isSensorAssisted = false;

    this.recoveryTargetGps = {
      ...targetGps,
    };

    this.recoveryStepCount = 0;

    this.recoveryIntervalId =
      setInterval(() => {
        if (
          !this.recoveryTargetGps
        ) {
          this.cancelGpsRecovery();
          return;
        }

        this.recoveryStepCount++;

        const alpha = 0.35;

        this.currentPosition = {
          lat:
            this.currentPosition.lat +
            alpha *
              (this.recoveryTargetGps.lat -
                this.currentPosition.lat),

          lng:
            this.currentPosition.lng +
            alpha *
              (this.recoveryTargetGps.lng -
                this.currentPosition.lng),
        };

        const distanceRemaining =
          getDistanceMeters(
            this.currentPosition,
            this.recoveryTargetGps
          );

        if (
          distanceRemaining < 1.0 ||
          this.recoveryStepCount > 10
        ) {
          this.currentPosition = {
            ...this.recoveryTargetGps,
          };

          this.isRecoverySmoothing =
            false;

          this.recoveryTargetGps =
            null;

          this.accuracyMeters = 3.5;

          this.cancelGpsRecovery();
        }

        this.notify();
      }, 120);
  }

  private cancelGpsRecovery() {
    if (
      this.recoveryIntervalId !== null
    ) {
      clearInterval(
        this.recoveryIntervalId
      );

      this.recoveryIntervalId = null;
    }

    this.recoveryTargetGps = null;
    this.isRecoverySmoothing = false;
  }

  // Force map snapping to nearest road coordinate
  public snapToRoadCoordinate(
    target: Coordinates
  ) {
    this.cancelGpsRecovery();

    this.currentPosition = {
      ...target,
    };

    this.notify();
  }

  // Complete cleanup for this manager.
  // Useful if the manager is ever destroyed/recreated.
  public destroy() {
    this.cancelGpsRecovery();

    if (
      typeof window !== 'undefined'
    ) {
      if (
        this.orientationHandler
      ) {
        window.removeEventListener(
          'deviceorientation',
          this.orientationHandler
        );

        this.orientationHandler =
          null;
      }

      if (this.motionHandler) {
        window.removeEventListener(
          'devicemotion',
          this.motionHandler
        );

        this.motionHandler = null;
      }
    }

    this.listeners = [];
  }
}
