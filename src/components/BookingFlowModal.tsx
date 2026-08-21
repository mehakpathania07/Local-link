import React, { useState } from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  Phone,
  Clock,
  Send,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Provider, ServiceOffering, Booking } from '../types';
import { TOWNS_LIST } from '../data/mockData';

interface BookingFlowModalProps {
  provider: Provider;
  initialService?: ServiceOffering;
  onClose: () => void;
  onConfirmBooking: (newBooking: Booking) => void;
  selectedTown: string;
  onOpenMyBookings?: () => void;
  onViewBookingDetails?: (booking: Booking) => void;
  customerName?: string;
  customerPhone?: string;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  provider,
  initialService,
  onClose,
  onConfirmBooking,
  selectedTown,
  onOpenMyBookings,
  onViewBookingDetails,
  customerName = 'Mehak Sharma',
  customerPhone = '+91 98160 54321',
}) => {
  const [problemDescription, setProblemDescription] = useState(
    initialService ? `Need help with ${initialService.title}` : ''
  );
  const [town, setTown] = useState(selectedTown || provider.town);
  const [address, setAddress] = useState('');
  const [when, setWhen] = useState<'Today' | 'Tomorrow' | 'Choose date'>('Today');
  const [customDate, setCustomDate] = useState('');
  const [preferredTime, setPreferredTime] = useState<'Morning' | 'Afternoon' | 'Evening'>('Evening');
  const [nameInput, setNameInput] = useState(customerName);
  const [phoneInput, setPhoneInput] = useState(customerPhone);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemDescription.trim()) return;

    const finalDate = when === 'Choose date' && customDate ? customDate : when;

    const newBooking: Booking = {
      id: `req-${Date.now().toString().slice(-4)}`,
      providerId: provider.id,
      providerName: provider.name,
      providerAvatar: provider.avatar,
      providerTitle: provider.title,
      providerPhone: provider.phone,
      providerTown: provider.town,
      providerCategory: provider.category,
      serviceTitle: initialService?.title || provider.title,
      date: finalDate,
      timeSlot: preferredTime,
      customerName: nameInput.trim() || 'Mehak Sharma',
      customerPhone: phoneInput.trim() || '+91 98160 54321',
      customerAddress: address.trim() || `${town} Village`,
      town,
      problemDescription: problemDescription.trim(),
      status: 'pending', // 🟡 Waiting for provider
      estimatedPrice: initialService?.price || provider.startingRate,
      createdAt: 'Just now',
    };

    setCreatedBooking(newBooking);
    onConfirmBooking(newBooking);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F4B8A4', '#B7CDB9', '#F4D98B', '#493548'],
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#29242A]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#EFE4DC] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FFF9F3] border-b border-[#EFE4DC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={provider.avatar}
              alt={provider.name}
              className="w-12 h-12 rounded-2xl object-cover border border-[#EEE7F4] shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="font-display font-black text-base sm:text-lg text-[#29242A]">
                {provider.name}
              </h2>
              <p className="text-xs text-[#766D75] font-medium">
                {provider.title} · 📍 {provider.town}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#766D75] hover:text-[#29242A] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isSubmitted && createdBooking ? (
          <div className="p-6 sm:p-7 space-y-5 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-black text-2xl text-[#29242A]">
                Request sent successfully ✓
              </h3>
              <p className="text-xs text-[#766D75]">
                Your service request has been dispatched to {createdBooking.providerName}
              </p>
            </div>

            {/* Structured Confirmation Summary Card */}
            <div className="p-4 rounded-2xl bg-[#FFF9F3] border border-[#EFE4DC] text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#EFE4DC]">
                <span className="text-[#766D75]">Provider:</span>
                <strong className="text-[#29242A]">{createdBooking.providerName}</strong>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-[#EFE4DC]">
                <span className="text-[#766D75]">Service:</span>
                <strong className="text-[#29242A]">{createdBooking.serviceTitle}</strong>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-[#EFE4DC]">
                <span className="text-[#766D75]">Location:</span>
                <strong className="text-[#29242A]">📍 {createdBooking.town}</strong>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-[#EFE4DC]">
                <span className="text-[#766D75]">Preferred time:</span>
                <strong className="text-[#29242A]">{createdBooking.date} · {createdBooking.timeSlot}</strong>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[#766D75]">Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F4D98B] text-[#493548] font-bold">
                  🟡 Waiting for provider
                </span>
              </div>
            </div>

            {/* Action Buttons: [View Request] [Back to Home] */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onViewBookingDetails) {
                    onViewBookingDetails(createdBooking);
                  } else if (onOpenMyBookings) {
                    onOpenMyBookings();
                  }
                }}
                className="w-full py-3 rounded-2xl bg-[#493548] hover:bg-[#352334] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
              >
                View Request
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-[#EEE7F4] hover:bg-[#E2D6EB] text-[#493548] text-xs font-bold transition-all cursor-pointer"
              >
                Back to Home
              </button>
            </div>

          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4 max-h-[75vh] overflow-y-auto">
            
            {/* 1. What do you need? */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#493548]">
                What do you need help with?
              </label>
              <textarea
                required
                rows={3}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="e.g. My kitchen tap is leaking / Ceiling fan is making noise"
                className="w-full p-3 rounded-2xl border-2 border-[#EFE4DC] focus:border-[#493548] text-xs sm:text-sm text-[#29242A] focus:outline-hidden placeholder-[#766D75]/60 transition-colors"
              />
            </div>

            {/* 2. Where do you need help? */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#493548]">
                Where do you need help?
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5">
                {TOWNS_LIST.slice(0, 6).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTown(t)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                      town === t
                        ? 'bg-[#493548] text-white border-[#493548]'
                        : 'bg-white text-[#29242A] border-[#EFE4DC] hover:bg-[#EEE7F4]'
                    }`}
                  >
                    📍 {t}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Neighborhood or landmark (e.g. Near Suliali Bus Stand)"
                className="w-full mt-1 p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
              />
            </div>

            {/* 3. When? */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#493548]">
                When?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Today', 'Tomorrow', 'Choose date'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setWhen(opt)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      when === opt
                        ? 'bg-[#493548] text-white border-[#493548]'
                        : 'bg-white text-[#29242A] border-[#EFE4DC] hover:bg-[#EEE7F4]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {when === 'Choose date' && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A]"
                />
              )}
            </div>

            {/* 4. Preferred Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#493548]">
                Preferred time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Morning', 'Afternoon', 'Evening'] as const).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setPreferredTime(slot)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      preferredTime === slot
                        ? 'bg-[#493548] text-white border-[#493548]'
                        : 'bg-white text-[#29242A] border-[#EFE4DC] hover:bg-[#EEE7F4]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#F6F0FA]">
              <div>
                <label className="text-[11px] font-bold text-[#766D75]">Your Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your Name"
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#766D75]">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 98160 XXXXX"
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                id="send-service-request-btn"
                className="w-full py-3.5 rounded-2xl bg-[#493548] hover:bg-[#352334] text-white font-display font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Request</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
