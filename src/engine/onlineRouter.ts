import { Coordinates, Route } from '../types';

export async function calculateOnlineRoute(
  originCoord: Coordinates,
  originName: string,
  destCoord: Coordinates,
  destName: string
): Promise<Route | null> {
  // If offline or network disabled, reject or return null
  if (!navigator.onLine) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://router.project-osrm.org/route/v1/driving/${originCoord.lng},${originCoord.lat};${destCoord.lng},${destCoord.lat}?overview=full&geometries=geojson&steps=true`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.routes || data.routes.length === 0) return null;

    const osrmRoute = data.routes[0];
    const coords: Coordinates[] = osrmRoute.geometry.coordinates.map((pt: [number, number]) => ({
      lat: pt[1],
      lng: pt[0],
    }));

    return {
      id: `online-route-${Date.now()}`,
      name: `${originName} to ${destName}`,
      origin: originCoord,
      originName,
      destination: destCoord,
      destinationName: destName,
      coordinates: coords,
      totalDistanceMeters: Math.round(osrmRoute.distance),
      totalDurationSeconds: Math.round(osrmRoute.duration),
      instructions: [
        {
          id: 'step-0',
          stepIndex: 0,
          maneuver: 'depart',
          instruction: `Head towards destination on main corridor`,
          roadName: 'Main Road',
          distanceMeters: Math.round(osrmRoute.distance),
          durationSeconds: Math.round(osrmRoute.duration),
          coordinate: originCoord,
        },
        {
          id: 'step-1',
          stepIndex: 1,
          maneuver: 'arrive',
          instruction: `Arrive at ${destName}`,
          roadName: destName,
          distanceMeters: 0,
          durationSeconds: 0,
          coordinate: destCoord,
        },
      ],
      context: {
        isHighway: true,
        isToll: false,
        isUnpaved: false,
        isRestricted: false,
        hasRoadClosure: false,
        isPoorConnectivityZone: false,
        details: ['Cloud-calculated route via online routing provider'],
      },
      isOffline: false,
      calculatedAt: Date.now(),
    };
  } catch {
    // Graceful fallback on network error, offline timeout, or CORS
    return null;
  }
}
