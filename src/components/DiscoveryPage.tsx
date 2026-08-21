import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Star,
  ShieldCheck,
  Phone,
  ArrowRight,
  Sparkles,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
} from 'lucide-react';
import { CATEGORIES, TOWNS_LIST, getEstimatedDistance, sortProvidersByProximity, matchQueryToCategoryOrProviders } from '../data/mockData';
import { Provider, FilterState, CategoryId } from '../types';
import { DirectCallModal } from './DirectCallModal';
import { ReportProviderModal } from './ReportProviderModal';

interface DiscoveryPageProps {
  providers: Provider[];
  onSelectProvider: (provider: Provider) => void;
  onBookProvider: (provider: Provider) => void;
  initialCategory?: CategoryId | 'all';
  initialTown?: string;
  initialKeyword?: string;
  onToggleSave?: (providerId: string) => void;
  savedIds?: string[];
}

export const DiscoveryPage: React.FC<DiscoveryPageProps> = ({
  providers,
  onSelectProvider,
  onBookProvider,
  initialCategory = 'all',
  initialTown = 'Nurpur',
  initialKeyword = '',
  onToggleSave,
  savedIds = [],
}) => {
  const [selectedTown, setSelectedTown] = useState<string>(initialTown);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [searchKeyword, setSearchKeyword] = useState<string>(initialKeyword);
  const [availableTodayOnly, setAvailableTodayOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [maxDistance, setMaxDistance] = useState<number>(0); // 0 = any, 2 = under 2km, 5 = under 5km, 10 = under 10km
  const [minRating, setMinRating] = useState<number>(0); // 0 = any, 4 = 4.0+, 4.5 = 4.5+
  const [priceRange, setPriceRange] = useState<'all' | 'under300' | '300-500' | 'above500'>('all');
  const [locationScope, setLocationScope] = useState<'all' | 'same_village' | 'nearby'>('all');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Modals for calling & reporting
  const [callingProvider, setCallingProvider] = useState<Provider | null>(null);
  const [reportingProvider, setReportingProvider] = useState<Provider | null>(null);

  // Filter and Proximity Sort
  const { filteredProviders, isExactVillageEmpty, nearbyTownSuggestions } = useMemo(() => {
    let result = [...providers];

    // 1. Keyword search (with forgiving synonyms)
    if (searchKeyword.trim()) {
      const matchResult = matchQueryToCategoryOrProviders(searchKeyword, result, CATEGORIES);
      result = matchResult.filteredProviders;
    }

    // 2. Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 3. Verified / Available filters
    if (verifiedOnly) {
      result = result.filter((p) => p.isVerified);
    }
    if (availableTodayOnly) {
      result = result.filter((p) => p.isAvailableToday);
    }

    // 4. Rating filter
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // 5. Price range filter
    if (priceRange === 'under300') {
      result = result.filter((p) => p.startingRate <= 300);
    } else if (priceRange === '300-500') {
      result = result.filter((p) => p.startingRate >= 300 && p.startingRate <= 500);
    } else if (priceRange === 'above500') {
      result = result.filter((p) => p.startingRate > 500);
    }

    // 6. Location scope filter
    if (locationScope === 'same_village') {
      result = result.filter((p) => p.town.toLowerCase() === selectedTown.toLowerCase());
    } else if (locationScope === 'nearby') {
      result = result.filter((p) => {
        const dist = getEstimatedDistance(selectedTown, p.town);
        return dist <= 10;
      });
    }

    // 7. Distance filter
    if (maxDistance > 0) {
      result = result.filter((p) => {
        const dist = getEstimatedDistance(selectedTown, p.town);
        return dist <= maxDistance;
      });
    }

    // Check if there is an exact provider based in selectedTown
    const hasExactInTown = result.some(
      (p) => p.town.toLowerCase() === selectedTown.toLowerCase()
    );

    // Nearby towns for empty state suggestions
    const nearby = ['Suliali', 'Sadwan', 'Rehan', 'Nurpur', 'Jassur'].filter(
      (t) => t.toLowerCase() !== selectedTown.toLowerCase()
    );

    // Proximity Sorting based on selectedTown
    const sorted = sortProvidersByProximity(result, selectedTown);

    return {
      filteredProviders: sorted,
      isExactVillageEmpty: !hasExactInTown && selectedCategory !== 'all',
      nearbyTownSuggestions: nearby.slice(0, 3),
    };
  }, [
    providers,
    selectedTown,
    selectedCategory,
    searchKeyword,
    verifiedOnly,
    availableTodayOnly,
    maxDistance,
    minRating,
    priceRange,
    locationScope,
  ]);

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchKeyword ? 1 : 0) +
    (availableTodayOnly ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (maxDistance > 0 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (locationScope !== 'all' ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchKeyword('');
    setAvailableTodayOnly(false);
    setVerifiedOnly(false);
    setMaxDistance(0);
    setMinRating(0);
    setPriceRange('all');
    setLocationScope('all');
  };

  return (
    <div className="py-6 sm:py-10 bg-[#FFF9F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#EFE4DC] shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEE7F4] text-[#493548] text-xs font-bold">
              <span>📍</span> {selectedTown} & Surrounding Villages
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[#493548] tracking-tight">
              Find Trusted People Nearby
            </h1>
            <p className="text-xs sm:text-sm text-[#766D75] font-medium">
              Showing closest verified craftspeople for <strong>{selectedTown}</strong> and neighboring Kangra valley areas.
            </p>
          </div>

          {/* Quick Town Switcher */}
          <div className="flex items-center gap-2 bg-[#FFF9F3] p-2 rounded-2xl border border-[#EFE4DC]">
            <span className="text-xs font-bold text-[#766D75] pl-2 hidden sm:inline">Location:</span>
            <select
              value={selectedTown}
              onChange={(e) => setSelectedTown(e.target.value)}
              className="bg-white px-3 py-2 rounded-xl text-xs font-bold text-[#493548] border border-[#EFE4DC] focus:outline-hidden focus:border-[#493548] cursor-pointer"
            >
              {TOWNS_LIST.map((t) => (
                <option key={t} value={t}>
                  📍 {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EFE4DC] space-y-3.5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#766D75] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search by problem or trade (e.g. fan repair, plumber, bike problem, math teacher)..."
                className="w-full pl-10 pr-8 py-2.5 rounded-2xl border border-[#EFE4DC] text-xs sm:text-sm text-[#29242A] placeholder-[#766D75]/60 focus:outline-hidden focus:border-[#493548]"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#766D75] hover:text-[#29242A] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Buttons & Filters Drawer Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAvailableTodayOnly(!availableTodayOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  availableTodayOnly
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                    : 'bg-white text-[#766D75] border-[#EFE4DC] hover:bg-[#EEE7F4]'
                }`}
              >
                🟢 Available Today
              </button>

              <button
                onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeFilterCount > 0 || showFilterDrawer
                    ? 'bg-[#493548] text-white border-[#493548]'
                    : 'bg-white text-[#766D75] border-[#EFE4DC] hover:bg-[#EEE7F4]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="p-2 rounded-xl bg-[#FFF9F3] text-[#766D75] hover:text-[#493548] border border-[#EFE4DC] transition-colors cursor-pointer"
                  title="Reset filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Collapsible Rich Filters Panel */}
          {showFilterDrawer && (
            <div className="p-4 bg-[#FFF9F3] rounded-2xl border border-[#EFE4DC] space-y-3.5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between text-xs font-bold text-[#493548]">
                <span>Refine Search & Proximity</span>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#766D75] hover:underline font-normal cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                
                {/* Distance Filter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#766D75] block">Distance</label>
                  <select
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-white border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden"
                  >
                    <option value={0}>Any distance</option>
                    <option value={2}>Under 2 km (Same vicinity)</option>
                    <option value={5}>Under 5 km (Quick reach)</option>
                    <option value={10}>Under 10 km (Nearby areas)</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#766D75] block">Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-white border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden"
                  >
                    <option value={0}>Any rating</option>
                    <option value={4.0}>⭐ 4.0+ Stars</option>
                    <option value={4.5}>⭐ 4.5+ Stars (Top Rated)</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#766D75] block">Starting Price</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-white border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden"
                  >
                    <option value="all">Any price</option>
                    <option value="under300">Under ₹300</option>
                    <option value="300-500">₹300 – ₹500</option>
                    <option value="above500">₹500+</option>
                  </select>
                </div>

                {/* Location Scope */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#766D75] block">Location Scope</label>
                  <select
                    value={locationScope}
                    onChange={(e) => setLocationScope(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-white border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden"
                  >
                    <option value="all">All Nurpur Region</option>
                    <option value="same_village">Same village ({selectedTown} only)</option>
                    <option value="nearby">Nearby villages (within 10km)</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Category Chips Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#493548] text-white shadow-xs'
                  : 'bg-[#FFF9F3] text-[#766D75] hover:bg-[#EEE7F4] border border-[#EFE4DC]'
              }`}
            >
              All Trades ({providers.length})
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#493548] text-white shadow-xs'
                    : 'bg-white text-[#493548] hover:bg-[#EEE7F4] border border-[#EFE4DC]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 19: Village Empty State Notification */}
        {isExactVillageEmpty && (
          <div className="p-4 rounded-2xl bg-[#FEF9EB] border border-[#F4D98B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-[#493548]">
                  We couldn't find someone directly based in {selectedTown} yet for this trade.
                </h4>
                <p className="text-[11px] text-[#766D75]">
                  Showing trusted providers from nearby areas who serve {selectedTown}: <strong>{nearbyTownSuggestions.join(' · ')}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTown('Nurpur')}
              className="px-3.5 py-1.5 rounded-xl bg-[#493548] text-white text-xs font-bold hover:bg-[#352334] transition-colors shrink-0"
            >
              Search Nurpur Hub →
            </button>
          </div>
        )}

        {/* Provider Cards List */}
        {filteredProviders.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-[#EFE4DC] p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EEE7F4] text-[#493548] flex items-center justify-center mx-auto text-2xl font-bold">
              🔍
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-black text-xl text-[#29242A]">
                No exact match found
              </h3>
              <p className="text-xs text-[#766D75] max-w-md mx-auto">
                Try searching for broader keywords like "Electrician", "Plumber", "Mechanic" or reset your filters.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-2xl bg-[#493548] text-white text-xs font-bold hover:bg-[#352334]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((pro) => {
              const isSaved = savedIds.includes(pro.id);
              const calculatedDistance = getEstimatedDistance(selectedTown, pro.town);
              const isLocalResident = pro.town.toLowerCase() === selectedTown.toLowerCase();

              return (
                <div
                  key={pro.id}
                  id={`pro-card-${pro.id}`}
                  className="bg-white rounded-3xl border border-[#EFE4DC] hover:border-[#493548]/30 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    
                    {/* Header: Photo + Info + Local Badge */}
                    <div className="flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-[#EEE7F4] shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        {pro.isVerified && (
                          <div
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#493548] text-[#F4D98B] flex items-center justify-center shadow-xs"
                            title="Phone Verified Pro"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-display font-black text-lg text-[#29242A] truncate">
                            {pro.name}
                          </h3>
                          {onToggleSave && (
                            <button
                              onClick={() => onToggleSave(pro.id)}
                              className="p-1 text-[#766D75] hover:text-[#493548]"
                              title={isSaved ? 'Saved' : 'Save'}
                            >
                              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#493548] text-[#493548]' : ''}`} />
                            </button>
                          )}
                        </div>

                        <p className="text-xs font-bold text-[#493548] truncate">
                          {pro.title}
                        </p>

                        {/* Location & Distance from selected town */}
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="flex items-center gap-1 font-bold text-[#29242A]">
                            <MapPin className="w-3.5 h-3.5 text-[#766D75]" />
                            {pro.town}
                          </span>
                          <span className="text-[#EFE4DC]">·</span>
                          <span className="text-[#766D75] font-medium">
                            {calculatedDistance} km from {selectedTown}
                          </span>
                        </div>

                        {/* Rating + Experience */}
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <div className="flex items-center gap-1 font-black text-[#29242A]">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{pro.rating.toFixed(2)}</span>
                            <span className="text-[#766D75] font-normal">({pro.reviewCount})</span>
                          </div>
                          <span className="text-[#EFE4DC]">·</span>
                          <span className="text-[#766D75] font-medium">
                            {pro.yearsExperience} yrs exp
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-[#766D75] line-clamp-2 leading-relaxed">
                      {pro.shortBio}
                    </p>

                    {/* Serves Areas Pill */}
                    <div className="bg-[#FFF9F3] p-2.5 rounded-xl border border-[#EFE4DC] text-[11px] space-y-1">
                      <span className="text-[#766D75] font-bold block">
                        Serves: {pro.servesAreas.slice(0, 4).join(', ')}
                        {pro.servesAreas.length > 4 && ' & nearby villages'}
                      </span>
                    </div>

                    {/* Availability & Starting Rate */}
                    <div className="pt-2 flex items-center justify-between text-xs border-t border-[#F6F0FA]">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>🟢 Available today</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#766D75] font-bold block text-right">Starts at</span>
                        <span className="font-display font-black text-sm text-[#493548]">
                          ₹{pro.startingRate}
                        </span>
                        <span className="text-[10px] text-[#766D75]">/{pro.rateUnit}</span>
                      </div>
                    </div>

                  </div>

                  {/* Section 6 & 7: Explicit Action Buttons: Call, Request Service, View Details */}
                  <div className="px-5 py-3.5 bg-[#FFF9F3] border-t border-[#EFE4DC] grid grid-cols-3 gap-2">
                    
                    {/* 1. Direct Call Button */}
                    <button
                      onClick={() => setCallingProvider(pro)}
                      className="py-2 px-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                      title="Call Provider directly"
                    >
                      <Phone className="w-3.5 h-3.5 fill-white" />
                      <span>Call</span>
                    </button>

                    {/* 2. Request Service Button */}
                    <button
                      onClick={() => onBookProvider(pro)}
                      className="py-2 px-1 rounded-xl bg-[#493548] hover:bg-[#352334] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Request</span>
                    </button>

                    {/* 3. View Details Button */}
                    <button
                      onClick={() => onSelectProvider(pro)}
                      className="py-2 px-1 rounded-xl bg-white hover:bg-[#EEE7F4] border border-[#DFD4E8] text-[#493548] text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <span>Details</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Direct Call Modal */}
      <DirectCallModal
        isOpen={!!callingProvider}
        onClose={() => setCallingProvider(null)}
        provider={callingProvider}
        onBookInstead={() => {
          if (callingProvider) {
            const p = callingProvider;
            setCallingProvider(null);
            onBookProvider(p);
          }
        }}
      />

      {/* Report Provider Modal */}
      <ReportProviderModal
        isOpen={!!reportingProvider}
        onClose={() => setReportingProvider(null)}
        provider={reportingProvider}
      />

    </div>
  );
};
