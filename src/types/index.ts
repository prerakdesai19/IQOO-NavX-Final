// IQOO NavX Core Types

export interface Coordinates {
  lat: number;
  lng: number;
}

export type ManeuverType =
  | 'depart'
  | 'turn-left'
  | 'turn-right'
  | 'slight-left'
  | 'slight-right'
  | 'sharp-left'
  | 'sharp-right'
  | 'straight'
  | 'u-turn'
  | 'roundabout'
  | 'arrive';

export interface TurnInstruction {
  id: string;
  stepIndex: number;
  maneuver: ManeuverType;
  instruction: string;
  roadName: string;
  distanceMeters: number;
  durationSeconds: number;
  coordinate: Coordinates;
  laneInfo?: {
    totalLanes: number;
    activeLanes: number[]; // 0-indexed from left
  };
}

export type RoadType = 'motorway' | 'trunk' | 'primary' | 'secondary' | 'residential' | 'unpaved' | 'service';

export interface RouteContextInfo {
  isHighway: boolean;
  isToll: boolean;
  isUnpaved: boolean;
  isRestricted: boolean;
  hasRoadClosure: boolean;
  isPoorConnectivityZone: boolean;
  details: string[];
}

export interface Route {
  id: string;
  name: string;
  origin: Coordinates;
  originName: string;
  destination: Coordinates;
  destinationName: string;
  coordinates: Coordinates[];
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  instructions: TurnInstruction[];
  context: RouteContextInfo;
  isOffline: boolean;
  calculatedAt: number;
}

export interface POI {
  id: string;
  name: string;
  category: 'college' | 'work' | 'home' | 'hospital' | 'tech_park' | 'fuel' | 'transit' | 'landmark';
  coordinate: Coordinates;
  address: string;
  regionId: string;
  isSaved?: boolean;
}

export interface MapRegion {
  id: string;
  name: string;
  description: string;
  sizeMB: number;
  version: string;
  center: Coordinates;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  isDownloaded: boolean;
  pois: POI[];
  nodes: Record<string, { id: string; coord: Coordinates; name: string }>;
  edges: Array<{
    from: string;
    to: string;
    distance: number;
    speedLimit: number;
    roadName: string;
    type: RoadType;
    isHighway?: boolean;
    isToll?: boolean;
    isUnpaved?: boolean;
    isRestricted?: boolean;
    isClosed?: boolean;
    isPoorConnectivity?: boolean;
  }>;
}

export type GPSQuality = 'strong' | 'weak' | 'lost' | 'simulated';

export interface PositionState {
  currentPosition: Coordinates;
  heading: number; // 0 - 360 deg
  speed: number; // m/s
  accuracyMeters: number;
  source: 'gps' | 'sensor_fusion' | 'map_snapped';
  gpsQuality: GPSQuality;
  isSensorAssisted: boolean;
  isRecoverySmoothing: boolean;
  lastUpdated: number;
}

export interface SensorData {
  accelerometer: { x: number; y: number; z: number };
  gyroscope: { alpha: number; beta: number; gamma: number };
  compassHeading: number;
  stepCount: number;
  isAvailable: boolean;
}

export type NavigationStatus = 'idle' | 'previewing' | 'navigating' | 'rerouting' | 'arrived' | 'paused';

export interface BatteryState {
  level: number; // 0.0 to 1.0 (e.g. 0.15 = 15%)
  isCharging: boolean;
  isLowBattery: boolean;
  isUltraMode: boolean; // Ultra Navigation Mode
  powerSavingPercentage: number;
}

export interface AICommandResult {
  rawText: string;
  intent: 'NAVIGATE' | 'STOP_NAV' | 'GO_HOME' | 'GO_SAVED' | 'SEARCH_POI' | 'ZOOM_IN' | 'ZOOM_OUT' | 'REROUTE' | 'STATUS' | 'UNKNOWN';
  destinationName?: string;
  matchedPOI?: POI;
  confidence: number;
  responseVoiceText: string;
}

export interface OriginIslandState {
  isExpanded: boolean;
  currentManeuver: ManeuverType;
  nextDistanceMeters: number;
  instructionText: string;
  etaMinutes: number;
  remainingDistanceKm: number;
  isOffline: boolean;
  isSensorAssisted: boolean;
  isUltraMode: boolean;
  batteryLevel: number;
}
