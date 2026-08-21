import React, { useState } from 'react';
import { Star, CheckCircle2, X } from 'lucide-react';
import { Booking, ReviewItem } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSubmitReview: (bookingId: string, rating: number, comment: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !booking) return null;

  const quickComments = [
    'Good service and reached on time.',
    'Very polite and honest rates.',
    'Solved the problem quickly.',
    'Clean and professional work.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(booking.id, rating, comment.trim() || 'Good service and reached on time.');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29242A]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EFE4DC] shadow-2xl p-6 sm:p-7 relative space-y-5 animate-in zoom-in-95 duration-150">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#766D75] hover:text-[#29242A] hover:bg-[#EEE7F4] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-black text-xl text-[#29242A]">Review Saved!</h3>
            <p className="text-xs text-[#766D75]">
              Thank you for supporting our local professionals in {booking.town}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#766D75]">
                Leave Community Feedback
              </span>
              <h3 className="font-display font-black text-xl text-[#29242A]">
                How was your service with {booking.providerName}?
              </h3>
              <p className="text-xs text-[#766D75]">
                {booking.serviceTitle} · {booking.town}
              </p>
            </div>

            {/* Star selector */}
            <div className="flex justify-center items-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 cursor-pointer transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-9 h-9 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-[#EFE4DC]'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Quick comment chips */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#493548]">Quick Notes</label>
              <div className="flex flex-wrap gap-1.5">
                {quickComments.map((qc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setComment(qc)}
                    className="px-2.5 py-1 rounded-lg bg-[#EEE7F4] hover:bg-[#E2D6EB] text-[11px] font-medium text-[#493548] text-left transition-colors"
                  >
                    {qc}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#493548]">Your Review (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Example: Good service and reached on time."
                rows={3}
                className="w-full p-3 rounded-2xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-white border border-[#EFE4DC] text-xs font-bold text-[#766D75] hover:bg-[#FFF9F3]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-[#493548] text-white text-xs font-bold hover:bg-[#352334] transition-colors shadow-xs"
              >
                Submit Rating
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
