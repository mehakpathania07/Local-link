import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Star,
  ChevronDown,
  PhoneCall,
  Sparkles,
  Zap,
  Wrench,
  Car,
  BookOpen,
  Scissors,
  HelpCircle,
} from 'lucide-react';
import { Provider } from '../types';
import { TOWNS_LIST, CATEGORIES, matchQueryToCategoryOrProviders, PROVIDERS } from '../data/mockData';

interface HeroSectionProps {
  selectedTown: string;
  userName?: string;
  setSelectedTown?: (town: string) => void;
  onSearch?: (keyword: string, town: string) => void;
  onSearchSubmit?: (keyword: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectProvider?: (provider: Provider) => void;
  onOpenAssistant?: () => void;
  featuredPro?: Provider;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedTown,
  userName = 'Mehak',
  setSelectedTown,
  onSearch,
  onSearchSubmit,
  onSelectCategory,
  onSelectProvider,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isTownPickerOpen, setIsTownPickerOpen] = useState(false);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Time-aware greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Close autocomplete on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live search suggestions based on input
  const suggestions = useMemo(() => {
    if (!searchInput.trim() || searchInput.trim().length < 2) return null;
    const q = searchInput.toLowerCase().trim();

    // 1. Matched Categories
    const matchedCategories = CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.popularServices.some((s) => s.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q)
    );

    // 2. Matched Providers
    const matchedPros = PROVIDERS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.skills.some((sk) => sk.toLowerCase().includes(q)) ||
        p.services.some((srv) => srv.title.toLowerCase().includes(q))
    ).slice(0, 3);

    // 3. Quick Keyword completions
    const keywords = [
      'Electrician',
      'Fan repair',
      'Plumber',
      'Water motor repair',
      'Car & Bike Mechanic',
      'Math Tutor',
      'Physics Teacher',
      'Mobile Repair',
      'Tailor',
      'House Cleaner',
      'Carpenter',
    ].filter((kw) => kw.toLowerCase().includes(q) && kw.toLowerCase() !== q);

    return {
      categories: matchedCategories.slice(0, 3),
      providers: matchedPros,
      keywords: keywords.slice(0, 4),
    };
  }, [searchInput]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAutocompleteOpen(false);
    if (onSearch) {
      onSearch(searchInput.trim(), selectedTown);
    } else if (onSearchSubmit) {
      onSearchSubmit(searchInput.trim());
    }
  };

  const handleSelectQuery = (query: string) => {
    setSearchInput(query);
    setIsAutocompleteOpen(false);
    if (onSearch) {
      onSearch(query, selectedTown);
    } else if (onSearchSubmit) {
      onSearchSubmit(query);
    }
  };

  const popularNearYou = [
    { title: `Electricians near ${selectedTown}`, category: 'electrician', icon: Zap, color: 'bg-amber-100 text-amber-900 border-amber-200' },
    { title: `Plumbers near ${selectedTown}`, category: 'plumber', icon: Wrench, color: 'bg-blue-100 text-blue-900 border-blue-200' },
    { title: `Mechanics near ${selectedTown}`, category: 'mechanic', icon: Car, color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
    { title: `Tutors in ${selectedTown}`, category: 'teacher', icon: BookOpen, color: 'bg-purple-100 text-purple-900 border-purple-200' },
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-14 lg:pt-10 lg:pb-18 bg-[#FFF9F3]">
      {/* Soft ambient pastel glows */}
      <div className="absolute top-12 right-1/4 w-96 h-96 rounded-full bg-[#EEE7F4]/70 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#FDF1ED]/80 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Simple Direct Home Experience */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Location Pill & Dynamic Greeting */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EFE4DC] shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-xs font-bold text-[#493548]">
                  📍 {selectedTown} & Surrounding Villages
                </span>
              </div>
              <span className="text-xs font-bold text-[#766D75] px-2 py-1 rounded-full bg-[#EEE7F4]">
                {greeting}, {userName} 👋
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-5.5xl tracking-tight text-[#493548] leading-[1.14]">
                Find someone nearby who can help.
              </h1>
              <p className="text-base sm:text-lg text-[#766D75] max-w-xl font-normal leading-relaxed">
                Connect directly with trusted craftspeople, technicians and teachers across <span className="font-bold text-[#493548]">{selectedTown}</span> and surrounding Kangra valley villages.
              </p>
            </div>

            {/* Search Box with Live Autocomplete */}
            <div ref={searchContainerRef} className="relative">
              <form
                id="hero-search-form"
                onSubmit={handleFormSubmit}
                className="p-2 sm:p-2.5 rounded-3xl bg-white border-2 border-[#493548]/15 hover:border-[#493548]/40 focus-within:border-[#493548] shadow-lg transition-all"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  
                  {/* 1. What do you need help with? */}
                  <div className="flex items-center gap-3 px-3.5 py-2 flex-1">
                    <Search className="w-5 h-5 text-[#493548] shrink-0" />
                    <input
                      id="hero-search-input"
                      type="text"
                      value={searchInput}
                      onFocus={() => setIsAutocompleteOpen(true)}
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                        setIsAutocompleteOpen(true);
                      }}
                      placeholder="What do you need help with? (e.g. Electrician, Plumber, Fan repair)"
                      className="w-full bg-transparent border-none text-[#29242A] placeholder-[#766D75]/70 text-sm sm:text-base font-medium focus:outline-hidden"
                    />
                  </div>

                  <div className="hidden sm:block h-8 w-px bg-[#EFE4DC]" />

                  {/* 2. Where? Location Picker */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsTownPickerOpen(!isTownPickerOpen)}
                      className="w-full sm:w-auto flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-[#EEE7F4] text-xs font-bold text-[#493548] hover:bg-[#E2D6EB] transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#493548]" />
                      <span>📍 {selectedTown}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isTownPickerOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown with all local areas */}
                    {isTownPickerOpen && (
                      <div className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 w-56 bg-white rounded-2xl border border-[#EFE4DC] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                        <div className="text-[10px] font-bold text-[#766D75] px-2 py-1 uppercase tracking-wider">
                          📍 Where are you located?
                        </div>
                        <div className="max-h-56 overflow-y-auto space-y-0.5">
                          {TOWNS_LIST.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => {
                                if (setSelectedTown) setSelectedTown(t);
                                setIsTownPickerOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                                selectedTown === t
                                  ? 'bg-[#EEE7F4] text-[#493548] font-bold'
                                  : 'text-[#29242A] hover:bg-[#FFF9F3]'
                              }`}
                            >
                              <span>{t}</span>
                              {t === 'Suliali' || t === 'Sadwan' ? (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#B7CDB9]/40 text-[#493548] font-medium">
                                  Village
                                </span>
                              ) : t === 'Nurpur' ? (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F4D98B] text-[#493548] font-bold">
                                  Main Area
                                </span>
                              ) : null}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Find Help Action */}
                  <button
                    id="hero-submit-btn"
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-[#493548] hover:bg-[#352334] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer shrink-0"
                  >
                    <span>Find Help</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Live Autocomplete Dropdown */}
              {isAutocompleteOpen && suggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-[#EFE4DC] shadow-2xl p-4 z-40 animate-in fade-in zoom-in-95 space-y-3">
                  
                  {/* Category Matches */}
                  {suggestions.categories.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-[#766D75] uppercase tracking-wider block">
                        Matching Trades
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {suggestions.categories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              onSelectCategory(cat.id);
                              setIsAutocompleteOpen(false);
                            }}
                            className="p-2 rounded-xl text-left hover:bg-[#FFF9F3] border border-transparent hover:border-[#EFE4DC] flex items-center gap-2.5 transition-colors cursor-pointer"
                          >
                            <span className="text-lg">{cat.icon}</span>
                            <div>
                              <span className="text-xs font-bold text-[#29242A] block">{cat.name}</span>
                              <span className="text-[10px] text-[#766D75] truncate block max-w-[200px]">
                                {cat.popularServices.slice(0, 2).join(', ')}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Provider Matches */}
                  {suggestions.providers.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-[#F6F0FA]">
                      <span className="text-[10px] font-bold text-[#766D75] uppercase tracking-wider block">
                        Verified Professionals
                      </span>
                      <div className="space-y-1">
                        {suggestions.providers.map((pro) => (
                          <button
                            key={pro.id}
                            type="button"
                            onClick={() => {
                              if (onSelectProvider) onSelectProvider(pro);
                              setIsAutocompleteOpen(false);
                            }}
                            className="w-full p-2 rounded-xl text-left hover:bg-[#FFF9F3] border border-transparent hover:border-[#EFE4DC] flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={pro.avatar}
                                alt={pro.name}
                                className="w-8 h-8 rounded-xl object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span className="text-xs font-bold text-[#29242A] block">{pro.name}</span>
                                <span className="text-[10px] text-[#766D75]">
                                  {pro.title} · 📍 {pro.town}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                              ★ {pro.rating}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Keyword search suggestions */}
                  {suggestions.keywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#F6F0FA]">
                      <span className="text-[10px] font-bold text-[#766D75] mr-1">Suggestions:</span>
                      {suggestions.keywords.map((kw, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectQuery(kw)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-[#EEE7F4] text-[#493548] font-bold hover:bg-[#E2D6EB] cursor-pointer"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Popular Near You Section */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#493548] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5A824]" />
                  <span>Popular Near {selectedTown}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onSelectCategory('all')}
                  className="text-xs font-bold text-[#493548] hover:underline cursor-pointer"
                >
                  View all services →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {popularNearYou.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectCategory(item.category)}
                      className="p-3 rounded-2xl bg-white border border-[#EFE4DC] hover:border-[#493548]/40 text-left transition-all shadow-2xs hover:scale-102 cursor-pointer group"
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 border ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#29242A] group-hover:text-[#493548] block leading-tight">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-[#766D75] mt-1 block">
                        Verified local pros
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fast Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-white/80 border border-[#EFE4DC] text-center">
                <span className="text-xs font-black text-[#493548] block">📞 Direct Call</span>
                <span className="text-[11px] text-[#766D75] font-medium">No middleman fees</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-[#EFE4DC] text-center">
                <span className="text-xs font-black text-[#493548] block">📍 Village First</span>
                <span className="text-[11px] text-[#766D75] font-medium">Closest help prioritized</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-[#EFE4DC] text-center">
                <span className="text-xs font-black text-[#493548] block">✓ Verified Pros</span>
                <span className="text-[11px] text-[#766D75] font-medium">Phone & area checked</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual with Real Local Context */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden bg-white border-4 border-white shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
                alt="Local electrician working in Nurpur home"
                className="w-full h-84 sm:h-96 object-cover object-center"
                referrerPolicy="no-referrer"
              />

              {/* Floating Verified Badge */}
              <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/95 backdrop-blur-xs border border-white shadow-lg space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#493548]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Serving {selectedTown}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#766D75] font-medium">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>4.9 Avg community rating</span>
                </div>
              </div>

              {/* Bottom Card for Quick Direct Action */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-[#493548] text-white shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#F4D98B] font-bold block">🟢 Active Providers Nearby</span>
                    <span className="text-[11px] text-white/80">Electricians, Plumbers & Mechanics in {selectedTown}</span>
                  </div>
                  <button
                    onClick={() => onSelectCategory('all')}
                    className="px-3 py-1.5 rounded-xl bg-white text-[#493548] font-bold text-xs hover:bg-[#EEE7F4] transition-colors cursor-pointer"
                  >
                    View All →
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
