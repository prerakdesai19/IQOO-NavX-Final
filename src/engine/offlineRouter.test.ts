import { describe, it, expect } from 'vitest';
import { calculateOfflineRoute, getDistanceMeters, getBearing } from './offlineRouter';
import { REGIONS } from '../data/regions';

describe('Offline Router & Navigation Engine', () => {
  const region = REGIONS[0]; // Bengaluru Tech Corridor
  const home = region.pois.find((p) => p.category === 'home')!;
  const college = region.pois.find((p) => p.category === 'college')!;

  it('calculates offline route between Home and College', () => {
    const route = calculateOfflineRoute(
      home.coordinate,
      home.name,
      college.coordinate,
      college.name,
      region
    );

    expect(route).not.toBeNull();
    if (route) {
      expect(route.coordinates.length).toBeGreaterThan(2);
      expect(route.totalDistanceMeters).toBeGreaterThan(0);
      expect(route.instructions.length).toBeGreaterThan(0);
      expect(route.isOffline).toBe(true);
      expect(route.context.isHighway).toBe(true);
      expect(route.context.isPoorConnectivityZone).toBe(true);
    }
  });

  it('correctly calculates distance and bearing', () => {
    const p1 = { lat: 12.915, lng: 77.65 };
    const p2 = { lat: 12.92, lng: 77.662 };
    const dist = getDistanceMeters(p1, p2);
    const bearing = getBearing(p1, p2);

    expect(dist).toBeGreaterThan(1000);
    expect(dist).toBeLessThan(2000);
    expect(bearing).toBeGreaterThanOrEqual(0);
    expect(bearing).toBeLessThanOrEqual(360);
  });
});
