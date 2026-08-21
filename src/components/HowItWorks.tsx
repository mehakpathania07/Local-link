import React from 'react';
import {
  Search,
  ShieldCheck,
  CalendarCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface HowItWorksProps {
  onStartExploring: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartExploring }) => {
  const steps = [
    {
      number: '1',
      title: 'Search by Trade or Problem',
      description:
        'Choose a trade or type your issue in simple words. We quickly match verified pros located right in Nurpur, Jassur or your nearby panchayat.',
      emoji: '🔍',
      tag: 'Smart Diagnosis',
      bgTint: 'bg-[#FDF1ED] border-[#F4B8A4]/40',
    },
    {
      number: '2',
      title: 'Compare Rates & Neighbor Reviews',
      description:
        'Every professional displays verified ID badges, years of experience, authentic reviews from local residents, and transparent starting rates in ₹.',
      emoji: '⭐',
      tag: 'Verified Profiles',
      bgTint: 'bg-[#EFF5F0] border-[#B5CDB8]/40',
    },
    {
      number: '3',
      title: 'Schedule a Visit & Pay Direct',
      description:
        'Pick a convenient date and time slot. Get direct phone contact, pay zero booking surcharge, and pay the technician directly via Cash or UPI.',
      emoji: '🤝',
      tag: 'Zero Markup Fee',
      bgTint: 'bg-[#EDE5F3] border-[#DFD4E8]',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FFF9F3] border-t border-[#EFE4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EDE5F3] text-xs font-bold text-[#493548] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#493548]" />
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#493548] tracking-tight">
            How LocalLink works for you
          </h2>
          <p className="text-sm text-[#756B73] font-medium leading-relaxed">
            Connecting households in Kangra with trusted local craftspeople without high middleman agency commissions.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`rounded-3xl p-6 sm:p-7 border shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between ${step.bgTint}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-2xl">
                    <span>{step.emoji}</span>
                  </div>
                  <span className="font-display font-black text-2xl text-[#493548]/30">
                    0{step.number}
                  </span>
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-full bg-white text-[10px] font-black uppercase text-[#493548] shadow-2xs">
                  {step.tag}
                </div>

                <h3 className="font-display font-black text-lg text-[#29242A]">
                  {step.title}
                </h3>

                <p className="text-xs text-[#756B73] font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-[#493548]/10 flex items-center gap-1.5 text-xs font-bold text-[#493548]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified in Nurpur Valley</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-2">
          <button
            id="how-it-works-start-cta"
            onClick={onStartExploring}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#493548] hover:bg-[#352334] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <span>Start Exploring Verified Pros Nearby</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
