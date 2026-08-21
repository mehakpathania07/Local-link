import React from 'react';
import {
  ShieldCheck,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { TOWNS_LIST, CATEGORIES } from '../data/mockData';
import { ActivePage, CategoryId } from '../types';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  onSelectCategory: (categoryId: CategoryId) => void;
  setSelectedTown: (town: string) => void;
  onOpenRegisterModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActivePage,
  onSelectCategory,
  setSelectedTown,
  onOpenRegisterModal,
}) => {
  return (
    <footer className="bg-[#352334] text-[#FFF9F3] pt-14 pb-10 border-t border-[#493548]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-4 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#F4B8A4] flex items-center justify-center text-[#493548] font-display font-black text-lg shadow-xs">
                LL
              </div>
              <span className="font-display font-black text-xl text-white tracking-tight">
                Local<span className="text-[#F4B8A4]">Link</span>
              </span>
            </div>
            <p className="text-xs text-[#DFD4E8] leading-relaxed max-w-sm font-medium">
              Connecting households across Nurpur, Suliali, Sadwan, and Kangra Valley with verified local craftspeople, electricians, mechanics, and tutors — 100% direct and transparent.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#B7CDB9] font-bold pt-1">
              <ShieldCheck className="w-4 h-4 text-[#B7CDB9]" />
              <span>Nurpur & Kangra Community Directory</span>
            </div>
          </div>

          {/* Col 2: Popular Trades */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#F4D98B]">
              Popular Trades
            </h4>
            <ul className="space-y-2 text-xs text-[#DFD4E8]">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setActivePage('discover');
                    }}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Towns Served */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#F4B8A4]">
              Local Communities
            </h4>
            <ul className="space-y-2 text-xs text-[#DFD4E8]">
              {TOWNS_LIST.slice(0, 6).map((town) => (
                <li key={town}>
                  <button
                    onClick={() => {
                      setSelectedTown(town);
                      setActivePage('discover');
                    }}
                    className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <MapPin className="w-3 h-3 text-[#F4B8A4]" />
                    <span>{town}, HP</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Platform & Provider Join */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              For Providers & Users
            </h4>
            <ul className="space-y-2 text-xs text-[#DFD4E8]">
              {onOpenRegisterModal && (
                <li>
                  <button
                    onClick={onOpenRegisterModal}
                    className="px-3 py-1.5 rounded-xl bg-[#F4D98B] text-[#493548] font-bold hover:bg-[#ebd07c] transition-colors cursor-pointer flex items-center gap-1.5 text-xs shadow-2xs"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Join as Provider</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => setActivePage('my-bookings')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  My Service Requests
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('provider-dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Provider Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DFD4E8]/80">
          <p>© {new Date().getFullYear()} LocalLink India. Built for Nurpur and Himachal Pradesh communities.</p>
          <div className="flex items-center gap-4">
            <span>Direct Phone Directory</span>
            <span>•</span>
            <span>Zero Commission</span>
            <span>•</span>
            <span>Community Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
