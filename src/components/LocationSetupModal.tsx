import React, { useState } from 'react';
import { MapPin, Navigation, X, Check } from 'lucide-react';
import { TOWNS_LIST } from '../data/mockData';

interface LocationSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTown: string;
  onSelectTown: (town: string) => void;
}

export const LocationSetupModal: React.FC<LocationSetupModalProps> = ({
  isOpen,
  onClose,
  selectedTown,
  onSelectTown,
}) => {
  const [isDetecting, setIsDetecting] = useState(false);

  if (!isOpen) return null;

  const handleUseCurrent = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            onSelectTown('Suliali');
            setIsDetecting(false);
            onClose();
          }, 300);
        },
        () => {
          onSelectTown('Suliali');
          setIsDetecting(false);
          onClose();
        },
        { timeout: 3000 }
      );
    } else {
      onSelectTown('Suliali');
      setIsDetecting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#29242A]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EFE4DC] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-[#FFF9F3] border-b border-[#EFE4DC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#EEE7F4] text-[#493548] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-black text-base sm:text-lg text-[#29242A]">
                Where are you located?
              </h2>
              <p className="text-xs text-[#766D75]">
                We'll prioritize nearest craftspeople & shortest response times.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#766D75] hover:text-[#29242A] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Current GPS button */}
          <button
            type="button"
            onClick={handleUseCurrent}
            disabled={isDetecting}
            className="w-full py-3 px-4 rounded-2xl bg-[#FFF9F3] hover:bg-[#EEE7F4] border border-[#EFE4DC] text-[#493548] text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Navigation className={`w-4 h-4 text-[#493548] ${isDetecting ? 'animate-spin' : ''}`} />
              <span>{isDetecting ? 'Detecting nearest village...' : 'Use my current location'}</span>
            </div>
            <span className="text-[10px] text-[#766D75] font-normal">GPS</span>
          </button>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#766D75] uppercase tracking-wider block px-1">
              Select Your Area / Village
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
              {TOWNS_LIST.map((town) => {
                const isSelected = selectedTown.toLowerCase() === town.toLowerCase();
                return (
                  <button
                    key={town}
                    type="button"
                    onClick={() => {
                      onSelectTown(town);
                      onClose();
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#493548] text-white border-[#493548] shadow-2xs font-bold'
                        : 'bg-white text-[#29242A] border-[#EFE4DC] hover:bg-[#FFF9F3]'
                    }`}
                  >
                    <span>📍 {town}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
