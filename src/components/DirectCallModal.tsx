import React from 'react';
import { Phone, CheckCircle2, ShieldCheck, Clock, X, MapPin } from 'lucide-react';
import { Provider } from '../types';

interface DirectCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
  onBookInstead?: () => void;
}

export const DirectCallModal: React.FC<DirectCallModalProps> = ({
  isOpen,
  onClose,
  provider,
  onBookInstead,
}) => {
  if (!isOpen || !provider) return null;

  const rawPhone = provider.phone.replace(/[^0-9+]/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29242A]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EFE4DC] shadow-2xl p-6 sm:p-7 relative space-y-6 animate-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#766D75] hover:text-[#29242A] hover:bg-[#EEE7F4] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Provider Info */}
        <div className="flex items-center gap-4">
          <img
            src={provider.avatar}
            alt={provider.name}
            className="w-16 h-16 rounded-2xl object-cover border border-[#EEE7F4] shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Available to take calls now</span>
            </div>
            <h3 className="font-display font-black text-xl text-[#29242A] truncate">
              {provider.name}
            </h3>
            <p className="text-xs text-[#766D75] font-medium truncate">
              {provider.title} · {provider.town}
            </p>
          </div>
        </div>

        {/* Call Banner */}
        <div className="p-4 rounded-2xl bg-[#FEF9EB] border border-[#F4D98B] space-y-2 text-center">
          <span className="text-xs font-bold text-[#766D75] uppercase tracking-wider block">
            Direct Phone Number
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-[#493548] tracking-tight">
            {provider.phone}
          </div>
          <p className="text-xs text-[#766D75]">
            No platform fees. Speak directly with {provider.name.split(' ')[0]}.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="space-y-2 text-xs text-[#29242A] bg-[#FFF9F3] p-3.5 rounded-2xl border border-[#EFE4DC]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Phone Verified:</strong> Verified local connection</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#493548] shrink-0" />
            <span><strong>Based in:</strong> {provider.town} (serves {provider.servesAreas.slice(0, 3).join(', ')})</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#766D75] shrink-0" />
            <span><strong>Average response:</strong> {provider.responseTime}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <a
            href={`tel:${rawPhone}`}
            id="modal-call-now-btn"
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-black text-base flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98"
          >
            <Phone className="w-5 h-5 fill-white" />
            <span>Call Now ({provider.phone})</span>
          </a>

          {onBookInstead && (
            <button
              onClick={() => {
                onClose();
                onBookInstead();
              }}
              className="w-full py-2.5 rounded-2xl bg-[#EEE7F4] hover:bg-[#E2D6EB] text-[#493548] text-xs font-bold transition-all cursor-pointer"
            >
              Or Send Quick Service Request →
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
