import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  MapPin,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Phone,
  Share2,
  Bookmark,
  Sparkles,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import { Provider, ServiceOffering } from '../types';
import { DirectCallModal } from './DirectCallModal';
import { ReportProviderModal } from './ReportProviderModal';

interface ProviderDetailPageProps {
  provider: Provider;
  onBack: () => void;
  onBookService: (provider: Provider, selectedService?: ServiceOffering) => void;
  onToggleSave?: (providerId: string) => void;
  isSaved?: boolean;
}

export const ProviderDetailPage: React.FC<ProviderDetailPageProps> = ({
  provider,
  onBack,
  onBookService,
  onToggleSave,
  isSaved = false,
}) => {
  const [showCallModal, setShowCallModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    try {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  const rawPhone = provider.phone.replace(/[^0-9+]/g, '');

  return (
    <div className="py-6 sm:py-10 bg-[#FFF9F3] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation & Header Actions */}
        <div className="flex items-center justify-between">
          <button
            id="back-to-directory-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[#EFE4DC] hover:border-[#493548] text-xs font-bold text-[#493548] transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Providers</span>
          </button>

          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(provider.id)}
                className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-[#EEE7F4] border-[#DFD4E8] text-[#493548]'
                    : 'bg-white border-[#EFE4DC] text-[#766D75] hover:text-[#493548]'
                }`}
                title={isSaved ? 'Saved' : 'Save'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#493548]' : ''}`} />
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-white border border-[#EFE4DC] hover:border-[#493548] text-[#766D75] transition-colors cursor-pointer"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                Link copied!
              </span>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-[#EFE4DC] p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Top Banner: Info + Immediate Call CTA */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-[#EEE7F4] shadow-sm"
                  referrerPolicy="no-referrer"
                />
                {provider.isVerified && (
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#493548] text-[#F4D98B] flex items-center justify-center shadow-xs"
                    title="Phone Verified Provider"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-[#29242A]">
                    {provider.name}
                  </h1>
                  {provider.isVerified && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EFF5F0] text-xs font-bold text-emerald-800 flex items-center gap-1 border border-[#B7CDB9]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Phone Verified
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-[#493548]">
                  {provider.title}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#766D75] font-medium pt-0.5">
                  <span className="flex items-center gap-1 text-[#29242A] font-bold">
                    <MapPin className="w-3.5 h-3.5 text-[#766D75]" />
                    Based in {provider.town}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-bold text-[#29242A]">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {provider.rating.toFixed(2)} ({provider.reviewCount} community ratings)
                  </span>
                  <span>·</span>
                  <span>{provider.yearsExperience} yrs experience</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 min-w-48">
              <button
                onClick={() => setShowCallModal(true)}
                id="profile-call-btn"
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>Call {provider.phone}</span>
              </button>

              <button
                onClick={() => onBookService(provider)}
                id="profile-request-btn"
                className="w-full py-3 px-4 rounded-2xl bg-[#493548] hover:bg-[#352334] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <span>Send Quick Request</span>
              </button>
            </div>
          </div>

          {/* Availability & Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#FFF9F3] rounded-2xl border border-[#EFE4DC]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#766D75] block">Availability</span>
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available Today
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#766D75] block">Typical Response</span>
              <span className="text-xs font-bold text-[#29242A] mt-0.5 block">
                ⚡ {provider.responseTime}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#766D75] block">Starting Price</span>
              <span className="text-xs font-bold text-[#493548] mt-0.5 block">
                ₹{provider.startingRate} / {provider.rateUnit}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#766D75] block">Languages</span>
              <span className="text-xs font-bold text-[#29242A] mt-0.5 block">
                {provider.languages?.join(', ') || 'Hindi, Pahadi'}
              </span>
            </div>
          </div>

          {/* Section 1: About the Provider & Work Description */}
          <div className="space-y-2">
            <h3 className="font-display font-black text-lg text-[#29242A]">
              About & Service Description
            </h3>
            <p className="text-sm text-[#29242A] leading-relaxed">
              {provider.bio}
            </p>
          </div>

          {/* Section 2: Areas Covered */}
          <div className="space-y-2">
            <h3 className="font-display font-black text-base text-[#29242A]">
              📍 Areas Covered Around Nurpur
            </h3>
            <div className="flex flex-wrap gap-2">
              {provider.servesAreas.map((area, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-[#EEE7F4] text-[#493548] text-xs font-bold border border-[#DFD4E8]"
                >
                  📍 {area}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#766D75] mt-1">
              Available for home visits in these towns and nearby village roads.
            </p>
          </div>

          {/* Section 3: Popular Services & Pricing */}
          <div className="space-y-3">
            <h3 className="font-display font-black text-base text-[#29242A]">
              Services & Standard Rates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {provider.services.map((svc) => (
                <div
                  key={svc.id}
                  className="p-4 rounded-2xl border border-[#EFE4DC] bg-white hover:border-[#493548]/30 transition-all flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-display font-black text-sm text-[#29242A]">
                      {svc.title}
                    </h4>
                    <p className="text-xs text-[#766D75]">{svc.description}</p>
                    <span className="text-[11px] font-bold text-[#493548] block pt-0.5">
                      Est. time: {svc.duration}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-display font-black text-base text-[#493548]">
                      ₹{svc.price}
                    </div>
                    <button
                      onClick={() => onBookService(provider, svc)}
                      className="mt-1 px-3 py-1 rounded-xl bg-[#EEE7F4] hover:bg-[#493548] hover:text-white text-[#493548] text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Customer Ratings & Community Reviews */}
          <div className="space-y-3 pt-2 border-t border-[#F6F0FA]">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-base text-[#29242A]">
                Community Reviews ({provider.reviews.length})
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-[#29242A]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{provider.rating.toFixed(2)} out of 5</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {provider.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-[#FFF9F3] border border-[#EFE4DC] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#29242A]">
                      {rev.customerName} ({rev.town})
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#766D75] font-medium leading-relaxed">
                    “{rev.comment}”
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Trust, Safety & Report Profile */}
          <div className="pt-4 border-t border-[#F6F0FA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#766D75]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct connection with independent local specialist. No middleman charges.</span>
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Report incorrect info</span>
            </button>
          </div>

        </div>

      </div>

      {/* Direct Call Modal */}
      <DirectCallModal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        provider={provider}
        onBookInstead={() => {
          setShowCallModal(false);
          onBookService(provider);
        }}
      />

      {/* Report Provider Modal */}
      <ReportProviderModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        provider={provider}
      />

    </div>
  );
};
