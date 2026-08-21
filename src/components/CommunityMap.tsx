import React, { useState } from 'react';
import {
  MapPin,
  Users,
  Navigation,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { LOCAL_COMMUNITY_PINS } from '../data/mockData';

interface CommunityMapProps {
  selectedTown: string;
  onSelectTown: (town: string) => void;
  onExploreTown: (town: string) => void;
}

export const CommunityMap: React.FC<CommunityMapProps> = ({
  selectedTown,
  onSelectTown,
  onExploreTown,
}) => {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  return (
    <section className="py-14 sm:py-20 bg-[#FFF9F3] border-t border-[#EFE4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDE5F3] text-[#493548] text-xs font-bold shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#493548]" />
            <span>Nurpur & Kangra Valley Network</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#493548] tracking-tight">
            Built around your community.
          </h2>
          <p className="text-sm sm:text-base text-[#756B73] font-medium leading-relaxed">
            From a leaking tap to a broken fan, find someone right down the road who knows the neighborhood.
          </p>
        </div>

        {/* Interactive Valley Map Container */}
        <div className="relative bg-gradient-to-b from-[#F6F0FA] to-[#FFF9F3] rounded-3xl border border-[#EFE4DC] p-6 sm:p-10 shadow-sm overflow-hidden">
          
          {/* Subtle Contour Background Lines */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-dots" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#493548" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-dots)" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Interactive Map Canvas */}
            <div className="lg:col-span-8 relative h-[360px] sm:h-[420px] bg-white/70 backdrop-blur-xs rounded-2xl border border-[#DFD4E8] p-4 flex items-center justify-center overflow-hidden">
              
              {/* Connecting Valley Road Paths */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M 20 56 Q 30 38 48 44 T 68 28 T 78 64 M 48 44 Q 30 38 12 72"
                  fill="none"
                  stroke="#DEBD66"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                  className="opacity-70"
                />
              </svg>

              {/* Pin Nodes */}
              {LOCAL_COMMUNITY_PINS.map((pin) => {
                const isCurrent = selectedTown === pin.name;
                const isHovered = hoveredPin === pin.id;

                return (
                  <div
                    key={pin.id}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    onMouseEnter={() => setHoveredPin(pin.id)}
                    onMouseLeave={() => setHoveredPin(null)}
                    onClick={() => onSelectTown(pin.name)}
                  >
                    {/* Pulsing Ripple if Selected */}
                    {isCurrent && (
                      <div className="absolute -inset-2 rounded-full bg-[#F4B8A4]/50 animate-ping" />
                    )}

                    {/* Pin Badge */}
                    <div
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all shadow-md ${
                        isCurrent
                          ? 'bg-[#493548] text-white scale-110 ring-2 ring-[#F5D98B]'
                          : isHovered
                          ? 'bg-[#EDE5F3] text-[#493548] scale-105 border border-[#493548]'
                          : 'bg-white text-[#29242A] border border-[#EFE4DC]'
                      }`}
                    >
                      <MapPin
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isCurrent ? 'text-[#F5D98B]' : 'text-[#493548]'
                        }`}
                      />
                      <span className="whitespace-nowrap">{pin.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isCurrent
                            ? 'bg-[#F5D98B] text-[#493548]'
                            : 'bg-[#EDE5F3] text-[#493548]'
                        }`}
                      >
                        {pin.prosCount}
                      </span>
                    </div>

                    {/* Hover Card Preview */}
                    {(isHovered || isCurrent) && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#EFE4DC] p-2.5 z-30 pointer-events-none text-left">
                        <div className="font-bold text-xs text-[#493548]">{pin.name}</div>
                        <div className="text-[10px] text-[#756B73] font-medium">{pin.distance}</div>
                        <div className="text-[10px] text-[#29242A] mt-1 font-semibold border-t border-[#F6F0FA] pt-1">
                          📍 {pin.highlight}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Map Corner Legend */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#EFE4DC] text-[11px] font-bold text-[#756B73] shadow-2xs">
                <span>📍 Kangra Valley Zone</span>
              </div>
            </div>

            {/* Right Information Panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-[#EFE4DC] shadow-xs space-y-3">
                <div className="text-xs font-bold text-[#756B73] uppercase tracking-wider">
                  Currently Viewing
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-2xl text-[#493548]">
                    {selectedTown}
                  </h3>
                  <span className="px-2.5 py-1 rounded-full bg-[#EDE5F3] text-[#493548] text-xs font-bold">
                    Active Hub
                  </span>
                </div>
                <p className="text-xs text-[#756B73] leading-relaxed">
                  LocalLink connects households in {selectedTown} with certified technicians within 15-30 minutes driving radius.
                </p>

                <div className="pt-2 border-t border-[#F6F0FA] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#756B73]">Available Trades:</span>
                    <span className="text-[#29242A] font-bold">11 Categories</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#756B73]">Average ETA:</span>
                    <span className="text-emerald-700 font-bold">25 Minutes</span>
                  </div>
                </div>

                <button
                  onClick={() => onExploreTown(selectedTown)}
                  className="w-full mt-2 py-2.5 rounded-xl bg-[#493548] hover:bg-[#352334] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Browse {selectedTown} Pros</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Community Pledge */}
              <div className="p-4 rounded-2xl bg-[#EDE5F3]/70 border border-[#DFD4E8] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#493548] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#493548] block">Himachal Local First</span>
                  <span className="text-[#756B73]">
                    Zero middleman fees. Direct cash/UPI payments directly to the craftsperson.
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
