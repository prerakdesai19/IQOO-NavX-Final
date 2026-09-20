import React, { useEffect, useRef } from 'react';
import { Coordinates, MapRegion, POI, PositionState, Route } from '../types';
import L from 'leaflet';
import { Plus, Minus, Navigation, Compass } from 'lucide-react';

interface MapViewProps {
  currentPosition: Coordinates;
  positionState: PositionState;
  activeRoute: Route | null;
  activeRegion: MapRegion;
  savedLocations: POI[];
  isUltraMode: boolean;
  onSelectPOI?: (poi: POI) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  currentPosition,
  positionState,
  activeRoute,
  activeRegion,
  savedLocations,
  isUltraMode,
  onSelectPOI,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const roadGraphLayerRef = useRef<L.LayerGroup | null>(null);
  const poiLayerRef = useRef<L.LayerGroup | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [activeRegion.center.lat, activeRegion.center.lng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark Carto basemap tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    mapInstanceRef.current = map;
    roadGraphLayerRef.current = L.layerGroup().addTo(map);
    poiLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activeRegion.center.lat, activeRegion.center.lng]);

  // Handle Zoom In / Out / Recenter controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([currentPosition.lat, currentPosition.lng], 15, {
        animate: true,
      });
    }
  };

  // Render Offline Regional Vector Road Graph
  useEffect(() => {
    if (!mapInstanceRef.current || !roadGraphLayerRef.current) return;
    roadGraphLayerRef.current.clearLayers();

    activeRegion.edges.forEach((edge) => {
      const fromNode = activeRegion.nodes[edge.from];
      const toNode = activeRegion.nodes[edge.to];
      if (fromNode && toNode) {
        let color = isUltraMode ? '#111315' : '#191C1F';
        let weight = 4;
        let dashArray = undefined;

        if (edge.isHighway) {
          color = isUltraMode ? '#22262A' : '#2B2F33';
          weight = 6;
        }
        if (edge.isPoorConnectivity) {
          color = isUltraMode ? '#EF4444' : '#F59E0B';
          dashArray = '6, 6';
        }
        if (edge.isUnpaved) {
          color = '#B45309';
          dashArray = '4, 4';
        }

        const line = L.polyline(
          [
            [fromNode.coord.lat, fromNode.coord.lng],
            [toNode.coord.lat, toNode.coord.lng],
          ],
          { color, weight, opacity: 0.85, dashArray }
        );
        line.addTo(roadGraphLayerRef.current!);
      }
    });
  }, [activeRegion, isUltraMode]);

  // Render POIs & Saved Places
  useEffect(() => {
    if (!mapInstanceRef.current || !poiLayerRef.current) return;
    poiLayerRef.current.clearLayers();

    const allPois = [...activeRegion.pois, ...savedLocations];
    const uniquePois = Array.from(new Map(allPois.map((p) => [p.id, p])).values());

    uniquePois.forEach((poi) => {
      const isSaved = poi.isSaved;
      const markerHtml = `
        <div style="
          background: ${isSaved ? '#FFD400' : '#191C1F'};
          border: 1.5px solid ${isSaved ? '#000000' : '#2B2F33'};
          color: ${isSaved ? '#000000' : '#F5F7F8'};
          border-radius: 9999px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 800;
          font-family: 'Outfit', 'Inter', sans-serif;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        ">
          <span>${isSaved ? '★' : '📍'}</span>
          <span>${poi.name}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'poi-custom-marker',
        iconAnchor: [30, 15],
      });

      const marker = L.marker([poi.coordinate.lat, poi.coordinate.lng], { icon: customIcon });
      marker.on('click', () => {
        if (onSelectPOI) onSelectPOI(poi);
      });
      marker.addTo(poiLayerRef.current!);
    });
  }, [activeRegion.pois, savedLocations, onSelectPOI]);

  // Render Active Route Polyline & Endpoints
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    if (startMarkerRef.current) {
      mapInstanceRef.current.removeLayer(startMarkerRef.current);
      startMarkerRef.current = null;
    }
    if (destMarkerRef.current) {
      mapInstanceRef.current.removeLayer(destMarkerRef.current);
      destMarkerRef.current = null;
    }

    if (activeRoute && activeRoute.coordinates.length > 1) {
      const latlngs: [number, number][] = activeRoute.coordinates.map((c) => [c.lat, c.lng]);
      const routeColor = positionState.isSensorAssisted ? '#3B82F6' : '#FFD400';

      routeLayerRef.current = L.polyline(latlngs, {
        color: routeColor,
        weight: isUltraMode ? 6 : 8,
        opacity: 0.95,
        lineJoin: 'round',
        lineCap: 'round',
      }).addTo(mapInstanceRef.current);

      // Add Destination Pin Marker
      const destCoord = activeRoute.coordinates[activeRoute.coordinates.length - 1];
      const destHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div class="destination-pulse-ring"></div>
          <div style="
            width: 26px;
            height: 26px;
            background: #EF4444;
            border: 2.5px solid #FFFFFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 14px rgba(239, 68, 68, 0.6);
            color: #FFFFFF;
            font-size: 12px;
            font-weight: 900;
          ">
            🏁
          </div>
        </div>
      `;

      const destIcon = L.divIcon({
        html: destHtml,
        className: 'dest-custom-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      destMarkerRef.current = L.marker([destCoord.lat, destCoord.lng], { icon: destIcon }).addTo(mapInstanceRef.current);

      // Fit bounds if previewing route
      if (activeRoute.coordinates.length > 0 && !positionState.speed) {
        mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), {
          padding: [60, 60],
          maxZoom: 16,
        });
      }
    }
  }, [activeRoute, positionState.isSensorAssisted, isUltraMode, positionState.speed]);

  // Render Vehicle Indicator & Sensor Uncertainty Radius
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const lat = currentPosition.lat;
    const lng = currentPosition.lng;

    // Vehicle Marker
    const markerColor = positionState.isSensorAssisted ? '#3B82F6' : '#FFD400';
    const vehicleHtml = `
      <div class="vehicle-marker-wrapper" style="transform: rotate(${positionState.heading}deg);">
        <div class="vehicle-pulse-ring" style="border-color: ${markerColor}; background: ${markerColor}25;"></div>
        <div style="
          width: 28px;
          height: 28px;
          background: ${markerColor};
          border: 3px solid #000000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px ${markerColor};
        ">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#000000" stroke="#000000" stroke-width="2">
            <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
          </svg>
        </div>
      </div>
    `;

    const vehicleIcon = L.divIcon({
      html: vehicleHtml,
      className: 'vehicle-nav-icon',
      iconSize: [42, 42],
      iconAnchor: [21, 21],
    });

    if (!vehicleMarkerRef.current) {
      vehicleMarkerRef.current = L.marker([lat, lng], { icon: vehicleIcon }).addTo(mapInstanceRef.current);
    } else {
      vehicleMarkerRef.current.setLatLng([lat, lng]);
      vehicleMarkerRef.current.setIcon(vehicleIcon);
    }

    // Accuracy Circle
    if (!accuracyCircleRef.current) {
      accuracyCircleRef.current = L.circle([lat, lng], {
        radius: positionState.accuracyMeters,
        color: markerColor,
        fillColor: markerColor,
        fillOpacity: 0.12,
        weight: 1,
      }).addTo(mapInstanceRef.current);
    } else {
      accuracyCircleRef.current.setLatLng([lat, lng]);
      accuracyCircleRef.current.setRadius(positionState.accuracyMeters);
      accuracyCircleRef.current.setStyle({
        color: markerColor,
        fillColor: markerColor,
      });
    }

    // Pan with vehicle during active driving
    if (positionState.speed > 0) {
      mapInstanceRef.current.panTo([lat, lng], { animate: true, duration: 0.8 });
    }
  }, [currentPosition, positionState]);

  return (
    <div className="relative w-full h-full min-h-[380px]">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Elevated Map Controls */}
      <div className="absolute right-3.5 top-20 z-30 flex flex-col gap-2 select-none">
        {/* Recenter Button */}
        <button
          onClick={handleRecenter}
          title="Recenter Position"
          className="w-11 h-11 rounded-2xl bg-[#191C1F]/95 hover:bg-[#22262A] text-[#F5F7F8] hover:text-[#FFD400] border border-[#2B2F33] shadow-xl flex items-center justify-center transition-all active:scale-95 group"
        >
          <Navigation size={18} className="text-[#FFD400] group-hover:scale-110 transition-transform" />
        </button>

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-11 h-11 rounded-2xl bg-[#191C1F]/95 hover:bg-[#22262A] text-[#F5F7F8] border border-[#2B2F33] shadow-xl flex items-center justify-center transition-all active:scale-95"
        >
          <Plus size={18} />
        </button>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-11 h-11 rounded-2xl bg-[#191C1F]/95 hover:bg-[#22262A] text-[#F5F7F8] border border-[#2B2F33] shadow-xl flex items-center justify-center transition-all active:scale-95"
        >
          <Minus size={18} />
        </button>
      </div>

      {/* Compass / Heading Indicator */}
      <div className="absolute left-3.5 top-20 z-30 select-none">
        <div 
          onClick={handleRecenter}
          className="w-11 h-11 rounded-2xl bg-[#191C1F]/95 border border-[#2B2F33] shadow-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FFD400]/40 transition-colors"
          title={`Heading: ${Math.round(positionState.heading)}°`}
        >
          <Compass 
            size={18} 
            className="text-[#FFD400] transition-transform duration-300" 
            style={{ transform: `rotate(${positionState.heading}deg)` }}
          />
          <span className="text-[9px] font-bold text-[#A4A9AE] font-display">
            {Math.round(positionState.heading)}°
          </span>
        </div>
      </div>
    </div>
  );
};
