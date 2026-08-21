import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Sparkles,
  MapPin,
  Star,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { PROVIDERS, CATEGORIES, TOWNS_LIST } from '../data/mockData';
import { Provider, CategoryId } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProvider: (provider: Provider) => void;
  onSelectCategory: (categoryId: CategoryId) => void;
  selectedTown: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProvider,
  onSelectCategory,
  selectedTown,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const matchedPros = PROVIDERS.filter((p) => {
    if (!searchTerm.trim()) return false;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.title.toLowerCase().includes(term) ||
      p.skills.some((s) => s.toLowerCase().includes(term))
    );
  }).slice(0, 4);

  const matchedCats = CATEGORIES.filter((c) => {
    if (!searchTerm.trim()) return false;
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.popularServices.some((s) => s.toLowerCase().includes(term))
    );
  }).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#EFE4DC] shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#EFE4DC] flex items-center gap-3 bg-[#FFF9F3]">
          <Search className="w-5 h-5 text-[#493548] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search electrician, plumber, AC repair, tutor in Nurpur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-[#29242A] placeholder-[#9E939C] focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-[#756B73] hover:text-[#29242A] hover:bg-[#EDE5F3] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {!searchTerm.trim() ? (
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[#756B73] uppercase tracking-wider block">
                Popular Categories in {selectedTown}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-2xl bg-[#FFF9F3] hover:bg-[#EDE5F3] text-left text-xs font-bold text-[#29242A] flex items-center justify-between transition-colors cursor-pointer border border-[#EFE4DC]"
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-[10px] text-[#756B73] font-medium">{cat.providerCount} pros</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Matched Categories */}
              {matchedCats.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-[#756B73] uppercase">Trades</span>
                  {matchedCats.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCategory(c.id);
                        onClose();
                      }}
                      className="w-full p-2.5 rounded-2xl bg-[#FFF9F3] hover:bg-[#EDE5F3] text-left flex items-center justify-between text-xs font-bold text-[#493548] cursor-pointer border border-[#EFE4DC]"
                    >
                      <span className="flex items-center gap-2">
                        <span>{c.emoji}</span>
                        <span>{c.name}</span>
                      </span>
                      <span className="text-[11px] font-normal text-[#756B73]">{c.description}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Matched Pros */}
              {matchedPros.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-[#756B73] uppercase">
                    Verified Pros in Kangra Valley
                  </span>
                  {matchedPros.map((pro) => (
                    <button
                      key={pro.id}
                      onClick={() => {
                        onSelectProvider(pro);
                        onClose();
                      }}
                      className="w-full p-3 rounded-2xl bg-white hover:bg-[#FFF9F3] border border-[#EFE4DC] text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          className="w-10 h-10 rounded-xl object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[#29242A]">{pro.name}</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <p className="text-[11px] text-[#756B73]">{pro.title}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-display font-black text-xs text-[#493548]">
                          ₹{pro.startingRate}/{pro.rateUnit}
                        </span>
                        <div className="flex items-center gap-0.5 text-[10px] font-bold text-[#29242A]">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{pro.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {matchedCats.length === 0 && matchedPros.length === 0 && (
                <div className="py-8 text-center text-xs text-[#756B73]">
                  No direct matches for "{searchTerm}". Try general terms like "plumber", "electrician", "inverter", or "mechanic".
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
