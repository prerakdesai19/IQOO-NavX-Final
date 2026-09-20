import React, { useState } from 'react';
import { 
  ArrowLeft, 
  DownloadCloud, 
  RefreshCw, 
  ShieldCheck 
} from 'lucide-react';
import { MapRegion } from '../types';
import { REGIONS } from '../data/regions';

interface DownloadRegionScreenProps {
  isOpen: boolean;
  onClose: () => void;
  activeRegion: MapRegion;
  onSelectRegion: (region: MapRegion) => void;
}

export const DownloadRegionScreen: React.FC<DownloadRegionScreenProps> = ({
  isOpen,
  onClose,
  activeRegion,
  onSelectRegion,
}) => {
  const [regionsList, setRegionsList] = useState<MapRegion[]>(REGIONS);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  if (!isOpen) return null;

  const handleStartDownload = (regId: string) => {
    setDownloadingId(regId);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingId(null);
          setRegionsList((list) =>
            list.map((r) => (r.id === regId ? { ...r, isDownloaded: true } : r))
          );
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleToggleRemove = (regId: string) => {
    setRegionsList((list) =>
      list.map((r) => (r.id === regId ? { ...r, isDownloaded: false } : r))
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08090A] text-[#F5F7F8] flex flex-col p-4 select-none animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-[#2B2F33]">
        <button
          onClick={onClose}
          className="p-2.5 rounded-2xl bg-[#191C1F] hover:bg-[#22262A] text-[#A4A9AE] hover:text-[#F5F7F8] transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#F5F7F8] font-display">
            Download Region
          </h1>
          <p className="text-[10px] text-[#A4A9AE]">Offline Map Packages for Zero-Data Navigation</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-3 my-3 rounded-2xl bg-[#111315] border border-[#2B2F33] flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#22C55E]/15 text-[#22C55E] flex-shrink-0">
          <ShieldCheck size={18} />
        </div>
        <p className="text-xs text-[#A4A9AE]">
          Downloaded maps are <strong className="text-[#F5F7F8]">available for 100% offline navigation</strong>, turn-by-turn recalculation, and POI search without internet or cellular connectivity.
        </p>
      </div>

      {/* Regions List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {regionsList.map((region) => {
          const isCurrent = region.id === activeRegion.id;
          const isDownloading = downloadingId === region.id;

          let statusText: 'AVAILABLE' | 'DOWNLOADING' | 'DOWNLOADED' | 'FAILED' = 'AVAILABLE';
          if (isDownloading) statusText = 'DOWNLOADING';
          else if (region.isDownloaded) statusText = 'DOWNLOADED';

          return (
            <div
              key={region.id}
              className={`p-4 rounded-3xl border transition-all ${
                isCurrent
                  ? 'bg-[#191C1F] border-[#FFD400]/60 shadow-lg'
                  : 'bg-[#111315] border-[#2B2F33]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#F5F7F8] font-display">
                      {region.name}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FFD400] text-black font-display">
                        Active Map
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#A4A9AE]">
                    {region.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-[#6F757B] pt-1 font-mono">
                    <span>Size: {region.sizeMB} MB</span>
                    <span>•</span>
                    <span>Version: {region.version}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {/* Status Badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-display ${
                    statusText === 'DOWNLOADED'
                      ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                      : statusText === 'DOWNLOADING'
                      ? 'bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30 animate-pulse'
                      : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33]'
                  }`}>
                    {statusText}
                  </span>

                  {/* Download / Active Action */}
                  {statusText === 'DOWNLOADING' ? (
                    <div className="flex items-center gap-1 text-xs text-[#3B82F6] font-bold font-mono">
                      <RefreshCw size={13} className="animate-spin" />
                      <span>{downloadProgress}%</span>
                    </div>
                  ) : region.isDownloaded ? (
                    <div className="flex items-center gap-1.5">
                      {!isCurrent && (
                        <button
                          onClick={() => onSelectRegion(region)}
                          className="text-xs font-bold text-[#FFD400] hover:underline font-display"
                        >
                          Set Active
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleRemove(region.id)}
                        className="p-1.5 rounded-lg bg-[#22262A] text-[#A4A9AE] hover:text-[#EF4444] text-[10px] transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartDownload(region.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFD400] hover:bg-[#e6bf00] text-black font-extrabold text-xs transition-colors font-display shadow-md"
                    >
                      <DownloadCloud size={13} />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Downloading Progress Bar */}
              {isDownloading && (
                <div className="w-full h-1 rounded-full bg-[#22262A] overflow-hidden mt-3">
                  <div
                    className="h-full bg-[#3B82F6] transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
