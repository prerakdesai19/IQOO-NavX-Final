import { Coordinates, MapRegion, ManeuverType, Route, RouteContextInfo, TurnInstruction } from '../types';

// Haversine formula for exact distance between two coordinates in meters
export function getDistanceMeters(c1: Coordinates, c2: Coordinates): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (c1.lat * Math.PI) / 180;
  const phi2 = (c2.lat * Math.PI) / 180;
  const deltaPhi = ((c2.lat - c1.lat) * Math.PI) / 180;
  const deltaLambda = ((c2.lng - c1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Compute bearing in degrees (0 - 360) from c1 to c2
export function getBearing(c1: Coordinates, c2: Coordinates): number {
  const phi1 = (c1.lat * Math.PI) / 180;
  const phi2 = (c2.lat * Math.PI) / 180;
  const lambda1 = (c1.lng * Math.PI) / 180;
  const lambda2 = (c2.lng * Math.PI) / 180;

  const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);

  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

// Determine maneuver type based on angular bearing change
export function getManeuverFromTurnAngle(angleDelta: number): ManeuverType {
  // Normalize angle to [-180, 180]
  let delta = ((angleDelta + 180) % 360) - 180;
  if (delta < -180) delta += 360;

  if (Math.abs(delta) < 20) return 'straight';
  if (delta > 20 && delta <= 60) return 'slight-right';
  if (delta > 60 && delta <= 120) return 'turn-right';
  if (delta > 120 && delta <= 165) return 'sharp-right';
  if (delta < -20 && delta >= -60) return 'slight-left';
  if (delta < -60 && delta >= -120) return 'turn-left';
  if (delta < -120 && delta >= -165) return 'sharp-left';
  return 'u-turn';
}

// Find nearest node in graph to coordinate
export function findNearestNodeId(coord: Coordinates, region: MapRegion): string {
  let minDistance = Infinity;
  let nearestNodeId = Object.keys(region.nodes)[0];

  for (const [nodeId, node] of Object.entries(region.nodes)) {
    const dist = getDistanceMeters(coord, node.coord);
    if (dist < minDistance) {
      minDistance = dist;
      nearestNodeId = nodeId;
    }
  }
  return nearestNodeId;
}

// Calculate shortest path using Dijkstra / A*
export function calculateOfflineRoute(
  originCoord: Coordinates,
  originName: string,
  destCoord: Coordinates,
  destName: string,
  region: MapRegion
): Route | null {
  const startNodeId = findNearestNodeId(originCoord, region);
  const endNodeId = findNearestNodeId(destCoord, region);

  const distances: Record<string, number> = {};
  const previous: Record<string, { nodeId: string; edge: MapRegion['edges'][0] } | null> = {};
  const unvisited = new Set<string>();

  for (const nodeId of Object.keys(region.nodes)) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    unvisited.add(nodeId);
  }

  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    let current: string | null = null;
    let minD = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minD) {
        minD = distances[nodeId];
        current = nodeId;
      }
    }

    if (!current || distances[current] === Infinity || current === endNodeId) {
      break;
    }

    unvisited.delete(current);

    // Get neighbors
    const outgoingEdges = region.edges.filter((e) => e.from === current && !e.isClosed);
    for (const edge of outgoingEdges) {
      const neighbor = edge.to;
      if (!unvisited.has(neighbor)) continue;

      // Weight based on distance and road quality
      let weight = edge.distance;
      if (edge.isUnpaved) weight *= 1.3;

      const alt = distances[current] + weight;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = { nodeId: current, edge };
      }
    }
  }

  if (distances[endNodeId] === Infinity && startNodeId !== endNodeId) {
    return null; // No path found
  }

  // Reconstruct path
  const pathNodeIds: string[] = [];
  const pathEdges: Array<MapRegion['edges'][0]> = [];
  let curr: string | null = endNodeId;

  while (curr) {
    pathNodeIds.unshift(curr);
    const prev: { nodeId: string; edge: MapRegion['edges'][0] } | null = previous[curr] || null;
    if (prev) {
      pathEdges.unshift(prev.edge);
      curr = prev.nodeId;
    } else {
      break;
    }
  }

  if (pathNodeIds[0] !== startNodeId && startNodeId !== endNodeId) {
    return null;
  }

  // Construct coordinates list
  const coordinates: Coordinates[] = [originCoord];
  for (const nId of pathNodeIds) {
    coordinates.push(region.nodes[nId].coord);
  }
  coordinates.push(destCoord);

  // Compute total distance & duration
  let totalDistanceMeters = 0;
  let totalDurationSeconds = 0;

  for (const edge of pathEdges) {
    totalDistanceMeters += edge.distance;
    const speedMs = (edge.speedLimit * 1000) / 3600;
    totalDurationSeconds += edge.distance / (speedMs || 10);
  }

  // Analyze route context
  const context: RouteContextInfo = {
    isHighway: pathEdges.some((e) => e.isHighway || e.type === 'motorway'),
    isToll: pathEdges.some((e) => e.isToll),
    isUnpaved: pathEdges.some((e) => e.isUnpaved),
    isRestricted: pathEdges.some((e) => e.isRestricted),
    hasRoadClosure: false,
    isPoorConnectivityZone: pathEdges.some((e) => e.isPoorConnectivity),
    details: [],
  };

  if (context.isHighway) context.details.push('Includes Express Highway (NH-44)');
  if (context.isToll) context.details.push('Includes Electronic Toll Plaza');
  if (context.isPoorConnectivityZone) context.details.push('Sub-Surface Underpass (Poor GPS / Cellular Zone)');
  if (context.isUnpaved) context.details.push('Caution: Contains unpaved road segment');

  // Generate Turn-by-Turn Instructions
  const instructions: TurnInstruction[] = [];

  // Depart step
  instructions.push({
    id: `step-0`,
    stepIndex: 0,
    maneuver: 'depart',
    instruction: `Head towards ${pathEdges[0]?.roadName || 'main road'}`,
    roadName: pathEdges[0]?.roadName || 'Starting Road',
    distanceMeters: pathEdges[0]?.distance || 100,
    durationSeconds: Math.round((pathEdges[0]?.distance || 100) / 10),
    coordinate: originCoord,
    laneInfo: { totalLanes: 3, activeLanes: [1, 2] },
  });

  for (let i = 0; i < pathEdges.length - 1; i++) {
    const currentEdge = pathEdges[i];
    const nextEdge = pathEdges[i + 1];

    const cPrev = region.nodes[currentEdge.from].coord;
    const cCurr = region.nodes[currentEdge.to].coord;
    const cNext = region.nodes[nextEdge.to].coord;

    const b1 = getBearing(cPrev, cCurr);
    const b2 = getBearing(cCurr, cNext);
    const delta = b2 - b1;

    const maneuver = getManeuverFromTurnAngle(delta);
    let instructionText = '';
    switch (maneuver) {
      case 'turn-left':
        instructionText = `Turn left onto ${nextEdge.roadName}`;
        break;
      case 'turn-right':
        instructionText = `Turn right onto ${nextEdge.roadName}`;
        break;
      case 'slight-left':
        instructionText = `Bear left onto ${nextEdge.roadName}`;
        break;
      case 'slight-right':
        instructionText = `Bear right onto ${nextEdge.roadName}`;
        break;
      case 'sharp-left':
        instructionText = `Make a sharp left onto ${nextEdge.roadName}`;
        break;
      case 'sharp-right':
        instructionText = `Make a sharp right onto ${nextEdge.roadName}`;
        break;
      case 'u-turn':
        instructionText = `Make a U-turn onto ${nextEdge.roadName}`;
        break;
      case 'straight':
      default:
        instructionText = `Continue straight onto ${nextEdge.roadName}`;
        break;
    }

    instructions.push({
      id: `step-${i + 1}`,
      stepIndex: i + 1,
      maneuver,
      instruction: instructionText,
      roadName: nextEdge.roadName,
      distanceMeters: nextEdge.distance,
      durationSeconds: Math.round(nextEdge.distance / ((nextEdge.speedLimit * 1000) / 3600)),
      coordinate: cCurr,
      laneInfo: { totalLanes: 3, activeLanes: maneuver.includes('left') ? [0] : maneuver.includes('right') ? [2] : [1] },
    });
  }

  // Arrive step
  instructions.push({
    id: `step-${instructions.length}`,
    stepIndex: instructions.length,
    maneuver: 'arrive',
    instruction: `Arrive at destination: ${destName}`,
    roadName: destName,
    distanceMeters: 0,
    durationSeconds: 0,
    coordinate: destCoord,
  });

  return {
    id: `route-${Date.now()}`,
    name: `${originName} to ${destName}`,
    origin: originCoord,
    originName,
    destination: destCoord,
    destinationName: destName,
    coordinates,
    totalDistanceMeters: Math.round(totalDistanceMeters),
    totalDurationSeconds: Math.round(totalDurationSeconds),
    instructions,
    context,
    isOffline: true,
    calculatedAt: Date.now(),
  };
}

// Off-route deviation detection
export function isOffRoute(currentPos: Coordinates, routeCoordinates: Coordinates[], thresholdMeters = 70): boolean {
  if (routeCoordinates.length < 2) return false;

  let minDistance = Infinity;
  for (let i = 0; i < routeCoordinates.length - 1; i++) {
    const p1 = routeCoordinates[i];
    const p2 = routeCoordinates[i + 1];
    const dist = distanceToSegment(currentPos, p1, p2);
    if (dist < minDistance) {
      minDistance = dist;
    }
  }

  return minDistance > thresholdMeters;
}

// Distance from point P to line segment AB
function distanceToSegment(p: Coordinates, a: Coordinates, b: Coordinates): number {
  const dAB = getDistanceMeters(a, b);
  if (dAB === 0) return getDistanceMeters(p, a);

  const dAP = getDistanceMeters(a, p);
  const dBP = getDistanceMeters(b, p);

  // If projection falls outside segment
  if (dAP * dAP > dBP * dBP + dAB * dAB) return dBP;
  if (dBP * dBP > dAP * dAP + dAB * dAB) return dAP;

  // Approximate perpendicular distance
  const s = (dAB + dAP + dBP) / 2;
  const area = Math.sqrt(Math.max(0, s * (s - dAB) * (s - dAP) * (s - dBP)));
  return (2 * area) / dAB;
}
