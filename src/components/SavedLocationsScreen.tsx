import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Navigation, 
  Star, 
  Home, 
  GraduationCap, 
  Building2, 
  Cross, 
  Fuel, 
  Train, 
  MapPin,
  Check
} from 'lucide-react';
import { POI, Coordinates } from '../types';
import { getDistanceMeters } from '../engine/offlineRouter';

interface SavedLocationsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  savedLocations: POI[];
  currentCoord: Coordinates;
  onSelectDestination: (poi: POI) => void;
  onAddLocation: (poi: POI) => void;
  onDeleteLocation: (id: string) => void;
}

export const SavedLocationsScreen: React.FC<SavedLocationsScreenProps> = ({
  isOpen,
  onClose,
  savedLocations,
  currentCoord,
  onSelectDestination,
  onAddLocation,
  onDeleteLocation,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCategory, setNewCategory] = useState<'home' | 'college' | 'work' | 'hospital' | 'fuel' | 'transit'>('work');

  if (!isOpen) return null;

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

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newPoi: POI = {
      id: `saved-${Date.now()}`,
      name: newName.trim(),
      category: newCategory === 'work' ? 'tech_park' : newCategory,
      coordinate: {
        lat: currentCoord.lat + (Math.random() - 0.5) * 0.02,
        lng: currentCoord.lng + (Math.random() - 0.5) * 0.02,
      },
      address: newAddress.trim() || 'Saved Custom Location',
      regionId: 'bengaluru_tech_corridor',
      isSaved: true,
    };

    onAddLocation(newPoi);
    setNewName('');
    setNewAddress('');
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08090A] text-[#F5F7F8] flex flex-col p-4 select-none animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2B2F33]">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#191C1F] hover:bg-[#22262A] text-[#A4A9AE] hover:text-[#F5F7F8] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#F5F7F8] font-display">
              Saved Locations
            </h1>
            <p className="text-[10px] text-[#A4A9AE]">1-Tap Navigation to Frequent Places</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-[#FFD400] text-black text-xs font-bold font-display hover:bg-[#e6bf00] transition-colors shadow-md"
        >
          <Plus size={15} />
          <span>Add Place</span>
        </button>
      </div>

      {/* Add New Place Form */}
      {isAddingNew && (
        <form onSubmit={handleCreateLocation} className="p-4 my-3 rounded-2xl bg-[#111315] border border-[#2B2F33] space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs font-bold text-[#F5F7F8] font-display">
            <span>Add New Saved Location</span>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-[#A4A9AE] hover:text-white"
            >
              Cancel
            </button>
          </div>

          <input
            type="text"
            required
            placeholder="Place Name (e.g. My Workspace, Gym)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-[#191C1F] border border-[#2B2F33] rounded-xl px-3 py-2 text-xs text-[#F5F7F8] placeholder-[#6F757B] focus:outline-none focus:border-[#FFD400]"
          />

          <input
            type="text"
            placeholder="Address / Area"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="w-full bg-[#191C1F] border border-[#2B2F33] rounded-xl px-3 py-2 text-xs text-[#F5F7F8] placeholder-[#6F757B] focus:outline-none focus:border-[#FFD400]"
          />

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-[#A4A9AE]">Category:</span>
            <div className="flex gap-1 overflow-x-auto">
              {(['work', 'college', 'home', 'fuel', 'hospital'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setNewCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                    newCategory === cat
                      ? 'bg-[#FFD400] text-black'
                      : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#22C55E] text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#1eb053] transition-colors font-display"
          >
            <Check size={14} />
            <span>Save Location</span>
          </button>
        </form>
      )}

      {/* Locations List */}
      <div className="flex-1 overflow-y-auto space-y-2 py-3">
        {savedLocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-[#A4A9AE] space-y-2">
            <Star size={36} className="text-[#6F757B]" />
            <p className="text-xs font-semibold text-[#F5F7F8]">No saved locations yet</p>
            <p className="text-[11px]">Add your Home, College, or Work for fast offline navigation</p>
          </div>
        ) : (
          savedLocations.map((poi) => {
            const distance = calculateDistanceKm(poi.coordinate);
            return (
              <div
                key={poi.id}
                className="p-3.5 rounded-2xl bg-[#111315] hover:bg-[#191C1F] border border-[#2B2F33] transition-all flex items-center justify-between group"
              >
                <div 
                  onClick={() => {
                    onSelectDestination(poi);
                    onClose();
                  }}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-[#191C1F] group-hover:bg-[#FFD400]/20 flex-shrink-0 transition-colors">
                    {getCategoryIcon(poi.category)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#F5F7F8] group-hover:text-[#FFD400] truncate block transition-colors font-display">
                        {poi.name}
                      </span>
                      <Star size={10} className="fill-[#FFD400] text-[#FFD400] flex-shrink-0" />
                    </div>
                    <span className="text-[11px] text-[#A4A9AE] truncate block mt-0.5">
                      {poi.address}
                    </span>
                    <span className="text-[10px] text-[#22C55E] font-medium block mt-0.5">
                      {distance} km away • Offline Ready
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <button
                    onClick={() => {
                      onSelectDestination(poi);
                      onClose();
                    }}
                    title="Navigate"
                    className="p-2.5 rounded-xl bg-[#FFD400] hover:bg-[#e6bf00] text-black font-bold transition-all shadow-md"
                  >
                    <Navigation size={14} className="fill-black" />
                  </button>

                  <button
                    onClick={() => onDeleteLocation(poi.id)}
                    title="Delete Saved Place"
                    className="p-2.5 rounded-xl bg-[#191C1F] hover:bg-[#EF4444]/20 text-[#A4A9AE] hover:text-[#EF4444] border border-[#2B2F33] transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
