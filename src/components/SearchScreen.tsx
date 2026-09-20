import React, { useState } from 'react';
import { 
  Search, 
  ArrowLeft, 
  Mic, 
  MapPin, 
  Star, 
  Navigation, 
  GraduationCap, 
  Building2, 
  Home, 
  Fuel, 
  Cross, 
  Train,
  X
} from 'lucide-react';
import { MapRegion, POI, Coordinates } from '../types';
import { getDistanceMeters } from '../engine/offlineRouter';

interface SearchScreenProps {
  isOpen: boolean;
  onClose: () => void;
  activeRegion: MapRegion;
  currentCoord: Coordinates;
  savedLocations: POI[];
  onSelectDestination: (poi: POI) => void;
  onOpenVoice: () => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  isOpen,
  onClose,
  activeRegion,
  currentCoord,
  savedLocations,
  onSelectDestination,
  onOpenVoice,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const allPois = [...activeRegion.pois, ...savedLocations];
  const uniquePois = Array.from(new Map(allPois.map((p) => [p.id, p])).values());

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'college':
        return <GraduationCap size={16} className="text-[#FFD400]" />;
      case 'home':
        return <Home size={16} className="text-[#22C55E]" />;
      case 'work':
      case 'tech_park':
        return <Building2 size={16} className="text-[#3B82F6]" />;
      case 'hospital':
        return <Cross size={16} className="text-[#EF4444]" />;
      case 'fuel':
        return <Fuel size={16} className="text-[#F59E0B]" />;
      case 'transit':
        return <Train size={16} className="text-purple-400" />;
      default:
        return <MapPin size={16} className="text-[#FFD400]" />;
    }
  };

  const calculateDistanceKm = (poiCoord: Coordinates) => {
    const distMeters = getDistanceMeters(currentCoord, poiCoord);
    return (distMeters / 1000).toFixed(1);
  };

  const filteredPois = uniquePois.filter((poi) => {
    const matchesSearch =
      poi.name.toLowerCase().includes(query.toLowerCase()) ||
      poi.address.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || poi.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#08090A] text-[#F5F7F8] flex flex-col p-4 select-none animate-in fade-in duration-200">
      {/* Top Mobile Search Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-[#2B2F33]">
        <button
          onClick={onClose}
          className="p-2.5 rounded-2xl bg-[#191C1F] hover:bg-[#22262A] text-[#A4A9AE] hover:text-[#F5F7F8] transition-colors"
          title="Back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A4A9AE]" />
          <input
            type="text"
            autoFocus
            placeholder="Search destination, college, road..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#191C1F] border border-[#2B2F33] focus:border-[#FFD400] rounded-2xl pl-10 pr-9 py-2.5 text-xs text-[#F5F7F8] placeholder-[#6F757B] focus:outline-none transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A4A9AE] hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <button
          onClick={() => {
            onClose();
            onOpenVoice();
          }}
          className="p-2.5 rounded-2xl bg-[#FFD400] text-black hover:bg-[#e6bf00] transition-colors flex-shrink-0 shadow-lg shadow-[rgba(255,212,0,0.2)]"
          title="Voice Search"
        >
          <Mic size={18} />
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto py-2.5 scrollbar-none">
        {[
          { id: 'all', label: 'All Places' },
          { id: 'college', label: 'Colleges' },
          { id: 'tech_park', label: 'Tech Parks' },
          { id: 'home', label: 'Saved Home' },
          { id: 'hospital', label: 'Hospitals' },
          { id: 'fuel', label: 'Fuel & EV' },
          { id: 'transit', label: 'Transit' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all font-display ${
              selectedCategory === cat.id
                ? 'bg-[#FFD400] text-black font-bold shadow-md'
                : 'bg-[#191C1F] text-[#A4A9AE] hover:text-white border border-[#2B2F33]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between py-1 text-[11px] text-[#A4A9AE] font-display">
        <span>{query ? `Search Results for "${query}"` : 'Nearby & Saved Destinations'}</span>
        <span>{filteredPois.length} places found</span>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto space-y-2 pt-1 pb-4">
        {filteredPois.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-[#A4A9AE] space-y-2">
            <Search size={32} className="text-[#6F757B]" />
            <p className="text-xs font-semibold text-[#F5F7F8]">No matching destinations found</p>
            <p className="text-[11px]">Try searching for "College", "Home", "Highway", or "Labs"</p>
          </div>
        ) : (
          filteredPois.map((poi) => {
            const distance = calculateDistanceKm(poi.coordinate);
            return (
              <div
                key={poi.id}
                onClick={() => {
                  onSelectDestination(poi);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-[#111315] hover:bg-[#191C1F] border border-[#2B2F33] hover:border-[#FFD400]/50 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-[#191C1F] group-hover:bg-[#FFD400]/20 flex-shrink-0 transition-colors">
                    {getCategoryIcon(poi.category)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#F5F7F8] group-hover:text-[#FFD400] truncate block transition-colors">
                        {poi.name}
                      </span>
                      {poi.isSaved && (
                        <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#FFD400]/15 text-[#FFD400] border border-[#FFD400]/30 font-display">
                          <Star size={9} className="fill-[#FFD400]" />
                          SAVED
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#A4A9AE] truncate block mt-0.5">
                      {poi.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-black text-[#F5F7F8] font-display block">
                      {distance} km
                    </span>
                    <span className="text-[10px] text-[#22C55E] font-medium block">
                      Offline Ready
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#191C1F] group-hover:bg-[#FFD400] text-[#A4A9AE] group-hover:text-black transition-all">
                    <Navigation size={14} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
