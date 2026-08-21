import React from 'react';
import {
  ShieldCheck,
  Star,
  MapPin,
  CircleDollarSign,
  HeartHandshake,
  Users,
  CheckCircle2,
} from 'lucide-react';

export const TrustCommunity: React.FC = () => {
  const trustPillars = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#493548]" />,
      emoji: '🛡️',
      title: '100% Verified Local Pros',
      description: 'Government Aadhaar/trade credential checked. Only authentic professionals from Nurpur sub-division.',
      bgTint: 'bg-[#EDE5F3]',
      badge: 'Background Checked',
    },
    {
      icon: <Star className="w-8 h-8 text-[#493548]" />,
      emoji: '⭐',
      title: 'Real Neighbor Reviews',
      description: 'Zero fake ratings. Genuine testimonials from residents living in your local ward, mohalla or village.',
      bgTint: 'bg-[#FEF9EB]',
      badge: '100% Authentic',
    },
    {
      icon: <MapPin className="w-8 h-8 text-[#493548]" />,
      emoji: '📍',
      title: 'Fast Doorstep ETA',
      description: 'Discover technicians living within 1 to 10 km. No waiting for days — quick response when emergencies strike.',
      bgTint: 'bg-[#EFF5F0]',
      badge: '15-30 Min Response',
    },
    {
      icon: <CircleDollarSign className="w-8 h-8 text-[#493548]" />,
      emoji: '💰',
      title: 'Honest, Transparent Rates',
      description: 'Clear upfront pricing starting at ₹199. Pay direct to pro via Google Pay / Paytm / Cash after satisfactory work.',
      bgTint: 'bg-[#FDF1ED]',
      badge: 'Zero Middleman Fee',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FFFCF8] border-t border-[#EFE4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDE5F3] text-[#493548] text-xs font-bold shadow-2xs">
            <span>🤝</span>
            <span>Built for Trust & Reliability</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#493548] tracking-tight">
            Why locals choose LocalLink
          </h2>
          <p className="text-sm sm:text-base text-[#756B73] font-medium leading-relaxed">
            We’re bringing transparency, dignity of labor, and prompt home service to smaller towns and hill communities.
          </p>
        </div>

        {/* 4 Soft Illustrated Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((pillar, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-7 rounded-3xl border border-[#EFE4DC] ${pillar.bgTint} flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-200`}
            >
              <div>
                {/* Top Badge + Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/90 shadow-2xs flex items-center justify-center text-2xl">
                    <span>{pillar.emoji}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white text-[#493548] shadow-2xs">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="font-display font-black text-lg text-[#29242A]">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#756B73] font-medium leading-relaxed mt-2">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#493548]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Local Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Community Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#493548] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#F5D98B]">
              Are you a skilled technician or tutor in Kangra?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              Join 120+ verified local professionals. Get direct client calls, build your reputation, and keep 100% of your earnings.
            </p>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3.5 rounded-2xl bg-[#F5D98B] hover:bg-[#DEBD66] text-[#493548] font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer active:scale-95"
          >
            Register as a Provider (Free)
          </button>
        </div>

      </div>
    </section>
  );
};
