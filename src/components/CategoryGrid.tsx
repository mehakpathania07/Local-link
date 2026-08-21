import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { CategoryId, CategoryGroup } from '../types';

interface CategoryGridProps {
  onSelectCategory: (categoryId: CategoryId) => void;
  selectedCategory?: CategoryId | 'all';
}

const tileThemeMap: Record<string, { bg: string; border: string; iconBg: string }> = {
  electrician: { bg: 'bg-[#FEF9EB]', border: 'border-[#F4D98B]', iconBg: 'bg-[#F4D98B]/40' },
  plumber: { bg: 'bg-[#F6F0FA]', border: 'border-[#EDE5F3]', iconBg: 'bg-[#EDE5F3]' },
  carpenter: { bg: 'bg-[#FDF1ED]', border: 'border-[#F4B8A4]', iconBg: 'bg-[#F4B8A4]/30' },
  painter: { bg: 'bg-[#EFF5F0]', border: 'border-[#B7CDB9]', iconBg: 'bg-[#B7CDB9]/40' },
  mason: { bg: 'bg-[#FEF9EB]', border: 'border-[#F4D98B]', iconBg: 'bg-[#F4D98B]/40' },
  repair: { bg: 'bg-[#FEF9EB]', border: 'border-[#F4D98B]', iconBg: 'bg-[#F4D98B]/40' },
  mechanic: { bg: 'bg-[#F6F0FA]', border: 'border-[#EDE5F3]', iconBg: 'bg-[#EDE5F3]' },
  bike_repair: { bg: 'bg-[#F6F0FA]', border: 'border-[#EDE5F3]', iconBg: 'bg-[#EDE5F3]' },
  car_repair: { bg: 'bg-[#FEF9EB]', border: 'border-[#F4D98B]', iconBg: 'bg-[#F4D98B]/40' },
  puncture: { bg: 'bg-[#FDF1ED]', border: 'border-[#F4B8A4]', iconBg: 'bg-[#F4B8A4]/30' },
  tutor: { bg: 'bg-[#EFF5F0]', border: 'border-[#B7CDB9]', iconBg: 'bg-[#B7CDB9]/40' },
  computer_tutor: { bg: 'bg-[#F6F0FA]', border: 'border-[#EDE5F3]', iconBg: 'bg-[#EDE5F3]' },
  barber: { bg: 'bg-[#FEF9EB]', border: 'border-[#F4D98B]', iconBg: 'bg-[#F4D98B]/40' },
  beautician: { bg: 'bg-[#FDF1ED]', border: 'border-[#F4B8A4]', iconBg: 'bg-[#F4B8A4]/30' },
  tailor: { bg: 'bg-[#EFF5F0]', border: 'border-[#B7CDB9]', iconBg: 'bg-[#B7CDB9]/40' },
  mobile_repair: { bg: 'bg-[#F6F0FA]', border: 'border-[#EDE5F3]', iconBg: 'bg-[#EDE5F3]' },
  laptop_repair: { bg: 'bg-[#FEF9EB]', border: 'border-[#F4D98B]', iconBg: 'bg-[#F4D98B]/40' },
  internet_help: { bg: 'bg-[#FDF1ED]', border: 'border-[#F4B8A4]', iconBg: 'bg-[#F4B8A4]/30' },
  photographer: { bg: 'bg-[#EFF5F0]', border: 'border-[#B7CDB9]', iconBg: 'bg-[#B7CDB9]/40' },
  cleaner: { bg: 'bg-[#EFF5F0]', border: 'border-[#B7CDB9]', iconBg: 'bg-[#B7CDB9]/40' },
  cook: { bg: 'bg-[#FEF9EB]', border: 'border-[#F4D98B]', iconBg: 'bg-[#F4D98B]/40' },
  other: { bg: 'bg-[#FDF1ED]', border: 'border-[#F4B8A4]', iconBg: 'bg-[#F4B8A4]/30' },
};

const GROUPS: (CategoryGroup | 'All')[] = [
  'All',
  'Home & Repair',
  'Vehicles',
  'Education',
  'Personal Services',
  'Technology',
  'Other',
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const [activeGroup, setActiveGroup] = useState<CategoryGroup | 'All'>('All');

  const filteredCategories = activeGroup === 'All'
    ? CATEGORIES
    : CATEGORIES.filter((c) => c.group === activeGroup);

  return (
    <section className="py-12 sm:py-16 bg-[#FFF9F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEE7F4] text-[#493548] text-xs font-bold mb-2 shadow-2xs">
              <span>🛠️</span> Practical Local Trades
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#493548] tracking-tight">
              Service Categories
            </h2>
            <p className="text-sm sm:text-base text-[#766D75] mt-1 font-medium">
              Everyday home, vehicle, teaching and repair services in Nurpur and surrounding villages.
            </p>
          </div>

          {/* Group Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {GROUPS.map((grp) => (
              <button
                key={grp}
                onClick={() => setActiveGroup(grp)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeGroup === grp
                    ? 'bg-[#493548] text-white shadow-xs'
                    : 'bg-white text-[#766D75] hover:bg-[#EEE7F4] border border-[#EFE4DC]'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Grid with Soft Pastel Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const theme = tileThemeMap[cat.id] || {
              bg: 'bg-white',
              border: 'border-[#EFE4DC]',
              iconBg: 'bg-[#EEE7F4]',
            };

            return (
              <button
                key={cat.id}
                id={`category-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative p-5 rounded-3xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-42 sm:h-46 overflow-hidden hover:-translate-y-1 hover:shadow-lg ${theme.bg} ${theme.border} ${
                  isSelected ? 'ring-2 ring-[#493548] shadow-md' : 'shadow-2xs'
                }`}
              >
                {/* Top Row: Large Emoji Icon & Subtle Arrow */}
                <div className="flex items-start justify-between">
                  <div
                    className={`w-13 h-13 rounded-2xl flex items-center justify-center text-3xl ${theme.iconBg} group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-2xs`}
                  >
                    <span>{cat.emoji}</span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[#493548] shadow-xs">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Row: Name & Provider Count */}
                <div>
                  <h3 className="font-display font-black text-base sm:text-lg text-[#29242A] group-hover:text-[#493548] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#766D75] font-medium line-clamp-1 mt-0.5">
                    {cat.popularServices.slice(0, 2).join(', ')}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span className="text-[11px] font-bold text-[#493548]">
                      {cat.providerCount} nearby
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
