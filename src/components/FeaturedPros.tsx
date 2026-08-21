import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Provider, CategoryId } from '../types';
import { CATEGORIES } from '../data/mockData';

interface FeaturedProsProps {
  providers: Provider[];
  selectedTown: string;
  onSelectProvider: (provider: Provider) => void;
  onBookProvider: (provider: Provider) => void;
  onViewAll?: () => void;
  onToggleSave?: (providerId: string) => void;
  savedIds?: string[];
}

export const FeaturedPros: React.FC<FeaturedProsProps> = ({
  providers,
  selectedTown,
  onSelectProvider,
  onBookProvider,
  onViewAll,
  onToggleSave,
  savedIds = [],
}) => {
  const [activeTab, setActiveTab] = useState<CategoryId | 'all'>('all');

  const filtered = providers.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  return (
    <section className="py-14 sm:py-20 bg-[#FFF9F3] border-t border-[#EFE4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B7CDB9]/30 text-[#493548] text-xs font-bold mb-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Verified Local Craftspeople
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#493548] tracking-tight">
              Trusted people nearby
            </h2>
            <p className="text-sm sm:text-base text-[#766D75] mt-1.5 font-medium">
              Helping homes across {selectedTown} & nearby communities.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#493548] text-white shadow-xs'
                  : 'bg-white text-[#766D75] hover:bg-[#EEE7F4] border border-[#EFE4DC]'
              }`}
            >
              All Trades
            </button>
            {CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === cat.id
                    ? 'bg-[#493548] text-white shadow-xs'
                    : 'bg-white text-[#766D75] hover:bg-[#EEE7F4] border border-[#EFE4DC]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Premium Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filtered.map((pro) => {
            const isSaved = savedIds.includes(pro.id);

            return (
              <div
                key={pro.id}
                id={`pro-card-${pro.id}`}
                className="group relative bg-white rounded-3xl border border-[#EFE4DC] hover:border-[#493548]/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Badge for Top Rated */}
                {pro.isTopRated && (
                  <div className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 rounded-full bg-[#F4D98B] text-[#493548] text-[10px] font-black tracking-wide uppercase flex items-center gap-1 shadow-2xs">
                    <Sparkles className="w-3 h-3 fill-[#493548]" />
                    <span>Top Rated</span>
                  </div>
                )}

                {/* Save Bookmark Button */}
                {onToggleSave && (
                  <button
                    onClick={() => onToggleSave(pro.id)}
                    className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#766D75] hover:text-[#493548] hover:bg-white shadow-2xs transition-all cursor-pointer"
                    title={isSaved ? 'Remove from saved' : 'Save pro'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isSaved ? 'fill-[#493548] text-[#493548]' : ''
                      }`}
                    />
                  </button>
                )}

                <div className="p-6 space-y-4">
                  {/* Photo + Name + Trade */}
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={pro.avatar}
                        alt={pro.name}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover object-top border border-[#EEE7F4] shadow-xs group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      {pro.isVerified && (
                        <div
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#493548] text-[#F4D98B] flex items-center justify-center shadow-xs"
                          title="Verified Professional"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-black text-lg sm:text-xl text-[#29242A] truncate">
                        {pro.name}
                      </h3>
                      <p className="text-xs font-bold text-[#766D75] truncate">
                        {pro.title} · {pro.town}
                      </p>

                      {/* Rating + Distance */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-1 text-xs font-black text-[#29242A]">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{pro.rating.toFixed(2)}</span>
                          <span className="text-[#766D75] font-normal">
                            ({pro.reviewCount})
                          </span>
                        </div>

                        <span className="text-[#EFE4DC]">·</span>

                        <div className="flex items-center gap-1 text-xs font-bold text-[#493548]">
                          <MapPin className="w-3 h-3 text-[#766D75]" />
                          <span>{pro.distanceKm} km</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Short Bio */}
                  <p className="text-xs text-[#766D75] font-medium line-clamp-2 leading-relaxed">
                    {pro.shortBio}
                  </p>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {pro.skills.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg bg-[#EEE7F4] text-[#493548] text-[11px] font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Availability Badge */}
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-[#F6F0FA]">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>🟢 Available today</span>
                    </div>

                    <div className="text-[11px] text-[#766D75] font-medium">
                      ⚡ Responds {pro.responseTime}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="px-6 py-4 bg-[#FFF9F3] border-t border-[#EFE4DC] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#766D75] block">
                      Starting at
                    </span>
                    <span className="font-display font-black text-lg text-[#493548]">
                      ₹{pro.startingRate}
                    </span>
                    <span className="text-xs text-[#766D75] font-medium">
                      /{pro.rateUnit}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectProvider(pro)}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EEE7F4] border border-[#DFD4E8] text-[#493548] text-xs font-bold transition-all cursor-pointer active:scale-95"
                    >
                      View Profile →
                    </button>

                    <button
                      onClick={() => onBookProvider(pro)}
                      className="px-4 py-2 rounded-xl bg-[#493548] hover:bg-[#352334] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>Request</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              if (onViewAll) onViewAll();
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#EFE4DC] hover:border-[#493548] text-[#493548] text-xs font-bold shadow-2xs hover:shadow-md transition-all cursor-pointer"
          >
            <span>Explore all {providers.length}+ verified providers in {selectedTown}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
