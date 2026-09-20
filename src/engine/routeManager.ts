import {
  Coordinates,
  MapRegion,
  Route,
} from '../types';
import { calculateOfflineRoute } from './offlineRouter';
import { calculateOnlineRoute } from './onlineRouter';

export class RouteManager {
  // When true, routing is forced to offline.
  // App.tsx currently creates RouteManager(false),
  // so the normal demo starts online.
  private isOfflineForced: boolean;

  constructor(offlineFirst = true) {
    this.isOfflineForced = offlineFirst;
  }

  public setOfflineSimulation(
    offline: boolean
  ) {
    this.isOfflineForced = offline;
  }

  public isOfflineMode(): boolean {
    const browserOffline =
      typeof navigator !== 'undefined' &&
      navigator.onLine === false;

    return (
      this.isOfflineForced ||
      browserOffline
    );
  }

  public async calculateRoute(
    origin: Coordinates,
    originName: string,
    destination: Coordinates,
    destinationName: string,
    region: MapRegion
  ): Promise<{
    route: Route;
    source: 'offline' | 'online';
  } | null> {
    // --------------------------------------------------
    // OFFLINE MODE
    // --------------------------------------------------

    if (this.isOfflineMode()) {
      const offlineRoute =
        calculateOfflineRoute(
          origin,
          originName,
          destination,
          destinationName,
          region
        );

      if (offlineRoute) {
        return {
          route: offlineRoute,
          source: 'offline',
        };
      }

      return null;
    }

    // --------------------------------------------------
    // ONLINE MODE
    // --------------------------------------------------

    try {
      const onlineRoute =
        await calculateOnlineRoute(
          origin,
          originName,
          destination,
          destinationName
        );

      if (onlineRoute) {
        return {
          route: onlineRoute,
          source: 'online',
        };
      }
    } catch {
      // Online routing failed.
      // Automatically continue with offline routing.
    }

    // --------------------------------------------------
    // OFFLINE FALLBACK
    // --------------------------------------------------

    const offlineRoute =
      calculateOfflineRoute(
        origin,
        originName,
        destination,
        destinationName,
        region
      );

    if (offlineRoute) {
      return {
        route: offlineRoute,
        source: 'offline',
      };
    }

    return null;
  }
}
