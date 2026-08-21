import React from 'react';
import {
  Star,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Provider } from '../types';
import { PROVIDERS } from '../data/mockData';

interface FeaturedSpotlightProps {
  provider?: Provider;
  onSelectProvider: (provider: Provider) => void;
  onBookProvider: (provider: Provider) => void;
}

export const FeaturedSpotlight: React.FC<FeaturedSpotlightProps> = ({
  provider = PROVIDERS[0],
  onSelectProvider,
  onBookProvider,
}) => {
  const currentProvider = provider || PROVIDERS[0];

  return (
    <section className="py-14 sm:py-20 bg-[#FFF9F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Soft Lavender Container */}
        <div className="relative rounded-3xl bg-[#EEE7F4] border border-[#DFD4E8] p-6 sm:p-10 lg:p-12 shadow-sm overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Large Rounded Portrait */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden bg-white border-4 border-white shadow-xl">
                <img
                  src={currentProvider.avatar}
                  alt={currentProvider.name}
                  className="w-full h-88 sm:h-96 object-cover object-top"
                  referrerPolicy="no-referrer"
                />

                {/* Rating Badge */}
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs text-[#29242A] text-xs font-black flex items-center gap-1.5 shadow-md">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>⭐ {currentProvider.rating.toFixed(1)}</span>
                </div>

                {/* Available Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-[#493548] text-white shadow-lg">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-[#F4D98B]">
                      <span className="w-2 h-2 rounded-full bg-[#B7CDB9] animate-ping" />
                      🟢 Available in {currentProvider.town} today
                    </span>
                    <span className="text-white/90">₹{currentProvider.startingRate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Info & Badges */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Pill Header */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#493548] text-[#F4D98B] text-xs font-black tracking-wide uppercase shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 fill-[#F4D98B]" />
                <span>TOP RATED NEARBY</span>
              </div>

              {/* Name & Title */}
              <div>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-[#493548] tracking-tight">
                  {currentProvider.name}
                </h3>
                <p className="text-base sm:text-lg font-bold text-[#766D75] mt-1">
                  {currentProvider.title} · {currentProvider.town}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-[#493548] mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#493548]" />
                  <span>{currentProvider.neighborhood}, {currentProvider.town} · {currentProvider.distanceKm} km</span>
                </div>
              </div>

              {/* Feature Checklist List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#29242A]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>8+ years experience in Kangra</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#29242A]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>✓ 100% ID & Police Verified</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#29242A]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>✓ 126 community reviews</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#29242A]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>✓ Available today for urgent calls</span>
                </div>
              </div>

              {/* Neighbor Review Quote */}
              <div className="p-4 rounded-2xl bg-white/90 border border-white shadow-xs space-y-1.5">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="text-xs font-bold text-[#766D75] ml-2">
                    Verified Resident in Ward 4, Nurpur
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#29242A] italic leading-relaxed">
                  "Rakesh ji arrived in 20 minutes when our main switch tripped. Fixed the issue cleanly with genuine parts. Highly trusted in our locality!"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="spotlight-book-btn"
                  onClick={() => onBookProvider(currentProvider)}
                  className="px-6 py-3.5 rounded-2xl bg-[#493548] hover:bg-[#352334] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Request Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="spotlight-profile-btn"
                  onClick={() => onSelectProvider(currentProvider)}
                  className="px-5 py-3.5 rounded-2xl bg-white hover:bg-[#EEE7F4] text-[#493548] font-bold text-sm border border-[#DFD4E8] shadow-2xs transition-all cursor-pointer active:scale-95"
                >
                  View Profile & Rates
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
