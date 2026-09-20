import { MapRegion } from '../types';

export const REGIONS: MapRegion[] = [
  {
    id: 'bengaluru_tech_corridor',
    name: 'iQOO Innovation Corridor (Bengaluru)',
    description: 'Tech Hub, Universities, Outer Ring Highway, & Poor-Connectivity Underpass Zones',
    sizeMB: 48.5,
    version: '2026.3.1-offline',
    center: { lat: 12.9352, lng: 77.6946 },
    bounds: {
      north: 12.9800,
      south: 12.8900,
      east: 77.7600,
      west: 77.6200,
    },
    isDownloaded: true,
    pois: [
      {
        id: 'poi-college',
        name: 'National Institute of Technology (College)',
        category: 'college',
        coordinate: { lat: 12.9480, lng: 77.7200 },
        address: 'Academic Zone, Campus Main Gate',
        regionId: 'bengaluru_tech_corridor',
        isSaved: true
      },
      {
        id: 'poi-home',
        name: 'Residence - Cyber Heights (Home)',
        category: 'home',
        coordinate: { lat: 12.9150, lng: 77.6500 },
        address: 'Tower 4, Cyber Heights, Sector 7',
        regionId: 'bengaluru_tech_corridor',
        isSaved: true
      },
      {
        id: 'poi-iqoo-hq',
        name: 'iQOO Research & Innovation Labs',
        category: 'tech_park',
        coordinate: { lat: 12.9352, lng: 77.6946 },
        address: 'Tech Bay 5, Innovation Boulevard',
        regionId: 'bengaluru_tech_corridor',
        isSaved: true
      },
      {
        id: 'poi-hospital',
        name: 'Apex Super Specialty Hospital',
        category: 'hospital',
        coordinate: { lat: 12.9560, lng: 77.6750 },
        address: 'Health City Road, Near Ring Road',
        regionId: 'bengaluru_tech_corridor',
        isSaved: false
      },
      {
        id: 'poi-fuel',
        name: 'Express Energy Station (Fuel & EV)',
        category: 'fuel',
        coordinate: { lat: 12.9280, lng: 77.6800 },
        address: 'Exit 12, Highway Expressway',
        regionId: 'bengaluru_tech_corridor',
        isSaved: false
      },
      {
        id: 'poi-transit',
        name: 'Central Metro Transit Hub',
        category: 'transit',
        coordinate: { lat: 12.9400, lng: 77.6600 },
        address: 'Station Square, Metro Line 2',
        regionId: 'bengaluru_tech_corridor',
        isSaved: false
      }
    ],
    nodes: {
      'N1': { id: 'N1', name: 'Cyber Heights Home', coord: { lat: 12.9150, lng: 77.6500 } },
      'N2': { id: 'N2', name: 'South Ring Junction', coord: { lat: 12.9200, lng: 77.6620 } },
      'N3': { id: 'N3', name: 'Expressway Toll Plaza', coord: { lat: 12.9280, lng: 77.6800 } },
      'N4': { id: 'N4', name: 'iQOO Innovation Labs Hub', coord: { lat: 12.9352, lng: 77.6946 } },
      'N5': { id: 'N5', name: 'Tech Park Flyover West', coord: { lat: 12.9410, lng: 77.7050 } },
      'N6': { id: 'N6', name: 'Underpass Poor-Connectivity Tunnel', coord: { lat: 12.9440, lng: 77.7120 } },
      'N7': { id: 'N7', name: 'Campus Main Gate (College)', coord: { lat: 12.9480, lng: 77.7200 } },
      // Alternate detour nodes for rerouting / missed turn
      'N8_MISSED': { id: 'N8_MISSED', name: 'Industrial Bypass Exit (Missed Turn)', coord: { lat: 12.9380, lng: 77.7250 } },
      'N9_DETOUR': { id: 'N9_DETOUR', name: 'East Link Canal Road', coord: { lat: 12.9450, lng: 77.7300 } },
      'N10_REJOIN': { id: 'N10_REJOIN', name: 'North Campus Bypass', coord: { lat: 12.9500, lng: 77.7230 } },
      // Extra peripheral nodes
      'N11_HOSPITAL': { id: 'N11_HOSPITAL', name: 'Hospital Junction', coord: { lat: 12.9560, lng: 77.6750 } },
      'N12_METRO': { id: 'N12_METRO', name: 'Central Metro Hub', coord: { lat: 12.9400, lng: 77.6600 } },
      'N13_UNPAVED': { id: 'N13_UNPAVED', name: 'Old Quarry Connector (Unpaved)', coord: { lat: 12.9240, lng: 77.7000 } }
    },
    edges: [
      // Primary Route: Home -> South Ring -> Expressway Toll -> iQOO HQ -> Flyover -> Tunnel -> College
      { from: 'N1', to: 'N2', distance: 1450, speedLimit: 40, roadName: 'Sector 7 Residential Blvd', type: 'residential' },
      { from: 'N2', to: 'N1', distance: 1450, speedLimit: 40, roadName: 'Sector 7 Residential Blvd', type: 'residential' },
      
      { from: 'N2', to: 'N3', distance: 2100, speedLimit: 80, roadName: 'NH-44 Outer Ring Highway', type: 'motorway', isHighway: true, isToll: true },
      { from: 'N3', to: 'N2', distance: 2100, speedLimit: 80, roadName: 'NH-44 Outer Ring Highway', type: 'motorway', isHighway: true, isToll: true },

      { from: 'N3', to: 'N4', distance: 1850, speedLimit: 70, roadName: 'NH-44 Tech Corridor Link', type: 'primary', isHighway: true },
      { from: 'N4', to: 'N3', distance: 1850, speedLimit: 70, roadName: 'NH-44 Tech Corridor Link', type: 'primary', isHighway: true },

      { from: 'N4', to: 'N5', distance: 1300, speedLimit: 50, roadName: 'Innovation Boulevard Flyover', type: 'primary' },
      { from: 'N5', to: 'N4', distance: 1300, speedLimit: 50, roadName: 'Innovation Boulevard Flyover', type: 'primary' },

      { from: 'N5', to: 'N6', distance: 950, speedLimit: 40, roadName: 'Sub-Surface Underpass Tunnel', type: 'secondary', isPoorConnectivity: true },
      { from: 'N6', to: 'N5', distance: 950, speedLimit: 40, roadName: 'Sub-Surface Underpass Tunnel', type: 'secondary', isPoorConnectivity: true },

      { from: 'N6', to: 'N7', distance: 1100, speedLimit: 30, roadName: 'University Avenue', type: 'secondary' },
      { from: 'N7', to: 'N6', distance: 1100, speedLimit: 30, roadName: 'University Avenue', type: 'secondary' },

      // Detour & Missed Turn Graph Edges
      { from: 'N4', to: 'N8_MISSED', distance: 2400, speedLimit: 50, roadName: 'Industrial Bypass East', type: 'secondary' },
      { from: 'N8_MISSED', to: 'N4', distance: 2400, speedLimit: 50, roadName: 'Industrial Bypass East', type: 'secondary' },

      { from: 'N8_MISSED', to: 'N9_DETOUR', distance: 1200, speedLimit: 45, roadName: 'Canal Road Detour', type: 'secondary' },
      { from: 'N9_DETOUR', to: 'N8_MISSED', distance: 1200, speedLimit: 45, roadName: 'Canal Road Detour', type: 'secondary' },

      { from: 'N9_DETOUR', to: 'N10_REJOIN', distance: 900, speedLimit: 40, roadName: 'North Campus Link', type: 'residential' },
      { from: 'N10_REJOIN', to: 'N9_DETOUR', distance: 900, speedLimit: 40, roadName: 'North Campus Link', type: 'residential' },

      { from: 'N10_REJOIN', to: 'N7', distance: 600, speedLimit: 30, roadName: 'Campus North Gate Way', type: 'residential' },
      { from: 'N7', to: 'N10_REJOIN', distance: 600, speedLimit: 30, roadName: 'Campus North Gate Way', type: 'residential' },

      // Unpaved shortcut edge
      { from: 'N3', to: 'N13_UNPAVED', distance: 1600, speedLimit: 25, roadName: 'Old Quarry Dirt Connector', type: 'unpaved', isUnpaved: true },
      { from: 'N13_UNPAVED', to: 'N3', distance: 1600, speedLimit: 25, roadName: 'Old Quarry Dirt Connector', type: 'unpaved', isUnpaved: true },
      { from: 'N13_UNPAVED', to: 'N8_MISSED', distance: 1800, speedLimit: 25, roadName: 'Old Quarry Dirt Connector', type: 'unpaved', isUnpaved: true },

      // Hospital & Metro links
      { from: 'N2', to: 'N12_METRO', distance: 1900, speedLimit: 45, roadName: 'Station Link Way', type: 'secondary' },
      { from: 'N12_METRO', to: 'N11_HOSPITAL', distance: 2300, speedLimit: 50, roadName: 'Health City Boulevard', type: 'primary' },
      { from: 'N11_HOSPITAL', to: 'N5', distance: 3100, speedLimit: 50, roadName: 'North Cross Highway', type: 'primary', isHighway: true }
    ]
  },
  {
    id: 'delhi_ncr_urban_zone',
    name: 'National Capital Urban Zone (Delhi-NCR)',
    description: 'Expressways, Cyber City, Ring Roads & Airport Corridor',
    sizeMB: 62.1,
    version: '2026.2.8-offline',
    center: { lat: 28.6139, lng: 77.2090 },
    bounds: {
      north: 28.7500,
      south: 28.4500,
      east: 77.3500,
      west: 77.0500,
    },
    isDownloaded: false,
    pois: [
      {
        id: 'poi-delhi-campus',
        name: 'Delhi Technological University (College)',
        category: 'college',
        coordinate: { lat: 28.7495, lng: 77.1184 },
        address: 'Bawana Road, Shahbad Daulatpur',
        regionId: 'delhi_ncr_urban_zone',
        isSaved: true
      },
      {
        id: 'poi-delhi-cyber',
        name: 'Cyber City Innovation Park',
        category: 'tech_park',
        coordinate: { lat: 28.4950, lng: 77.0890 },
        address: 'DLF Phase 2, Gurugram',
        regionId: 'delhi_ncr_urban_zone',
        isSaved: true
      }
    ],
    nodes: {
      'D1': { id: 'D1', name: 'Cyber Hub', coord: { lat: 28.4950, lng: 77.0890 } },
      'D2': { id: 'D2', name: 'Airport Express Road', coord: { lat: 28.5560, lng: 77.1000 } },
      'D3': { id: 'D3', name: 'Ring Road Junction', coord: { lat: 28.6139, lng: 77.2090 } },
      'D4': { id: 'D4', name: 'DTU Main Campus', coord: { lat: 28.7495, lng: 77.1184 } }
    },
    edges: [
      { from: 'D1', to: 'D2', distance: 7500, speedLimit: 80, roadName: 'NH-48 Expressway', type: 'motorway', isHighway: true, isToll: true },
      { from: 'D2', to: 'D3', distance: 9200, speedLimit: 70, roadName: 'Inner Ring Road', type: 'primary', isHighway: true },
      { from: 'D3', to: 'D4', distance: 16000, speedLimit: 60, roadName: 'Outer Ring & Bawana Link', type: 'primary' }
    ]
  },
  {
    id: 'mumbai_central_coastal',
    name: 'Coastal Metro Corridor (Mumbai Central)',
    description: 'Coastal Road, Sea Link, Tech Hub & Marine Enclave',
    sizeMB: 54.0,
    version: '2026.1.15-offline',
    center: { lat: 19.0178, lng: 72.8478 },
    bounds: {
      north: 19.1500,
      south: 18.9000,
      east: 72.9200,
      west: 72.7800,
    },
    isDownloaded: false,
    pois: [
      {
        id: 'poi-mumbai-iit',
        name: 'Indian Institute of Technology (College)',
        category: 'college',
        coordinate: { lat: 19.1334, lng: 72.9133 },
        address: 'Powai, Mumbai',
        regionId: 'mumbai_central_coastal',
        isSaved: true
      }
    ],
    nodes: {
      'M1': { id: 'M1', name: 'Bandra Reclamation', coord: { lat: 19.0400, lng: 72.8250 } },
      'M2': { id: 'M2', name: 'Sea Link Toll Plaza', coord: { lat: 19.0300, lng: 72.8180 } },
      'M3': { id: 'M3', name: 'Worli Interchange', coord: { lat: 19.0100, lng: 72.8150 } },
      'M4': { id: 'M4', name: 'Powai Tech Gate', coord: { lat: 19.1334, lng: 72.9133 } }
    },
    edges: [
      { from: 'M1', to: 'M2', distance: 1500, speedLimit: 80, roadName: 'Bandra-Worli Sea Link', type: 'motorway', isHighway: true, isToll: true },
      { from: 'M2', to: 'M3', distance: 4200, speedLimit: 80, roadName: 'Sea Link Expressway', type: 'motorway', isHighway: true, isToll: true },
      { from: 'M3', to: 'M4', distance: 17500, speedLimit: 60, roadName: 'Western Expressway Connector', type: 'primary', isHighway: true },
      { from: 'M4', to: 'M3', distance: 17500, speedLimit: 60, roadName: 'Western Expressway Connector', type: 'primary', isHighway: true }
    ]
  }
];
