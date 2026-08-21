import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Star,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Booking, BookingStatus, Provider } from '../types';

interface RequestTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onCancelBooking: (id: string) => void;
  onAddReview?: (bookingId: string, rating: number, comment: string) => void;
  onFindAlternative?: (category?: string, town?: string) => void;
  onUpdateStatus?: (bookingId: string, newStatus: BookingStatus) => void;
}

export const RequestTrackingModal: React.FC<RequestTrackingModalProps> = ({
  isOpen,
  onClose,
  booking,
  onCancelBooking,
  onAddReview,
  onFindAlternative,
  onUpdateStatus,
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!isOpen || !booking) return null;

  const getTimelineSteps = (status: BookingStatus) => {
    const steps = [
      { key: 'sent', label: 'Request Sent', desc: 'Received by LocalLink network', done: true },
      {
        key: 'responding',
        label: 'Provider Responding',
        desc: 'Reviewing schedule & location',
        done: status !== 'declined' && status !== 'cancelled',
        active: status === 'pending',
      },
      {
        key: 'accepted',
        label: 'Accepted',
        desc: 'Visit date & time confirmed',
        done: status === 'accepted' || status === 'in_progress' || status === 'completed',
        active: status === 'accepted',
      },
      {
        key: 'in_progress',
        label: 'Service in Progress',
        desc: 'Provider on-site or active',
        done: status === 'in_progress' || status === 'completed',
        active: status === 'in_progress',
      },
      {
        key: 'completed',
        label: 'Completed',
        desc: 'Service finished & verified',
        done: status === 'completed',
        active: status === 'completed',
      },
    ];
    return steps;
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddReview) {
      onAddReview(booking.id, reviewRating, reviewComment.trim() || 'Great reliable local service!');
    }
    setReviewSubmitted(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F4B8A4', '#B7CDB9', '#F4D98B', '#493548'],
      });
    } catch {}
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleConfirmCancel = () => {
    onCancelBooking(booking.id);
    setShowCancelConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#29242A]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#EFE4DC] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-[#FFF9F3] border-b border-[#EFE4DC] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={booking.providerAvatar}
              alt={booking.providerName}
              className="w-12 h-12 rounded-2xl object-cover border border-[#EEE7F4] shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg text-[#29242A]">
                  {booking.providerName}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEE7F4] text-[#493548]">
                  {booking.providerTitle}
                </span>
              </div>
              <p className="text-xs text-[#766D75]">
                📍 {booking.town} · Preferred: {booking.date} ({booking.timeSlot || 'Flexible'})
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
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Current Status Header Banner */}
          <div className="p-4 rounded-2xl border flex items-center justify-between gap-3 bg-[#FFF9F3] border-[#EFE4DC]">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#766D75] uppercase tracking-wider block">
                Current Status
              </span>
              <h3 className="font-display font-black text-base text-[#29242A]">
                {booking.status === 'pending' && '🟡 Waiting for Provider Response'}
                {booking.status === 'accepted' && '🟢 Provider Accepted Your Request'}
                {booking.status === 'in_progress' && '🔵 Service in Progress'}
                {booking.status === 'completed' && '✓ Service Completed'}
                {booking.status === 'declined' && '🔴 Request Declined'}
                {booking.status === 'cancelled' && '⚪ Request Cancelled'}
              </h3>
            </div>

            {/* Direct Call Button */}
            <a
              href={`tel:${booking.providerPhone.replace(/[^0-9+]/g, '')}`}
              className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Phone className="w-3.5 h-3.5 fill-white" />
              <span>Call ({booking.providerPhone})</span>
            </a>
          </div>

          {/* Declined Notice & Find Another Provider */}
          {booking.status === 'declined' && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <div>
                  <strong className="block font-bold">Reason from Provider:</strong>
                  <span>“{booking.declineReason || 'Not available for this slot.'}”</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onFindAlternative) {
                    onFindAlternative(booking.providerCategory, booking.town);
                  }
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#493548] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#352334] transition-colors cursor-pointer shadow-xs"
              >
                <span>Find Another Provider in {booking.town}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Timeline Section (if not cancelled/declined) */}
          {booking.status !== 'declined' && booking.status !== 'cancelled' && (
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#EFE4DC]">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#493548]">
                Request Progress Timeline
              </h4>
              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EFE4DC]">
                {getTimelineSteps(booking.status).map((step, idx) => (
                  <div key={step.key} className="flex items-start gap-3 relative z-10">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                        step.done
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : step.active
                          ? 'bg-[#F4D98B] border-[#E5A824] text-[#493548] animate-pulse'
                          : 'bg-white border-[#EFE4DC] text-[#766D75]'
                      }`}
                    >
                      {step.done ? '✓' : idx + 1}
                    </div>
                    <div className="space-y-0.5">
                      <p
                        className={`text-xs font-bold ${
                          step.done || step.active ? 'text-[#29242A]' : 'text-[#766D75]'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[11px] text-[#766D75]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Details */}
          <div className="bg-[#FFF9F3] p-4 rounded-2xl border border-[#EFE4DC] space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-[#EFE4DC] pb-2">
              <span className="text-[#766D75]">Service Requested:</span>
              <strong className="text-[#29242A]">{booking.serviceTitle}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-[#EFE4DC] pb-2">
              <span className="text-[#766D75]">Problem Note:</span>
              <strong className="text-[#29242A]">“{booking.problemDescription}”</strong>
            </div>
            <div className="flex items-center justify-between border-b border-[#EFE4DC] pb-2">
              <span className="text-[#766D75]">Service Location:</span>
              <strong className="text-[#29242A]">📍 {booking.town} ({booking.customerAddress})</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#766D75]">Estimated Visit Charge:</span>
              <strong className="text-emerald-700">₹{booking.estimatedPrice || 200} (Pay directly to pro)</strong>
            </div>
          </div>

          {/* Section 18: Completed Service Review Card */}
          {booking.status === 'completed' && (
            <div className="p-4 rounded-2xl bg-white border border-[#EFE4DC] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-black text-sm text-[#29242A]">
                  How was your experience?
                </h4>
                {booking.userRating && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    ✓ Reviewed ({booking.userRating}★)
                  </span>
                )}
              </div>

              {reviewSubmitted || booking.userRating ? (
                <div className="p-3 bg-[#EFF5F0] rounded-xl text-xs text-emerald-800 font-medium">
                  “{booking.userReviewComment || reviewComment || 'Great service!'}”
                  <div className="text-[10px] text-emerald-600 pt-1 font-bold">
                    Thank you! Your review helps your neighbors in {booking.town}.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-2xl cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating
                              ? 'text-[#F4D98B] fill-[#F4D98B]'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#493548] ml-2">
                      {reviewRating} of 5 stars
                    </span>
                  </div>

                  <input
                    type="text"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Write a short review (e.g. Reached on time and fixed quickly)"
                    className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#493548] hover:bg-[#352334] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Leave Review
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Section 17: Cancellation confirmation or trigger */}
          {(booking.status === 'pending' || booking.status === 'accepted') && (
            <div className="pt-2 border-t border-[#F6F0FA]">
              {showCancelConfirm ? (
                <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 space-y-2.5 animate-in fade-in">
                  <p className="text-xs font-bold text-red-900">
                    Are you sure you want to cancel this request?
                  </p>
                  <p className="text-[11px] text-red-700">
                    Your provider in {booking.town} will be notified immediately.
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EFE4DC] text-xs font-bold text-[#493548]"
                    >
                      Keep Request
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmCancel}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                    >
                      Cancel Request
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                >
                  Cancel this request
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
