import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface DeclineReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDecline: (reason: string) => void;
  bookingTitle?: string;
  customerName?: string;
}

export const DeclineReasonModal: React.FC<DeclineReasonModalProps> = ({
  isOpen,
  onClose,
  onConfirmDecline,
  bookingTitle,
  customerName,
}) => {
  const [selectedReason, setSelectedReason] = useState('Not available today');
  const [customNote, setCustomNote] = useState('');

  if (!isOpen) return null;

  const reasons = [
    'Not available today',
    'Too far from current location',
    'Already fully booked',
    'Required spare parts not in stock',
    'Other reason',
  ];

  const handleDecline = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason =
      selectedReason === 'Other reason' && customNote.trim()
        ? customNote.trim()
        : selectedReason;
    onConfirmDecline(finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#29242A]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EFE4DC] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-red-50/70 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-black text-base text-[#29242A]">
                Decline Service Request
              </h2>
              <p className="text-xs text-[#766D75]">
                {customerName ? `From ${customerName}` : 'Notify customer with reason'}
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

        {/* Form */}
        <form onSubmit={handleDecline} className="p-5 sm:p-6 space-y-4">
          <p className="text-xs text-[#766D75]">
            Please select a reason so we can help the customer find another local technician promptly:
          </p>

          <div className="space-y-2">
            {reasons.map((r) => (
              <label
                key={r}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedReason === r
                    ? 'bg-[#FFF9F3] border-[#493548] font-bold text-[#29242A]'
                    : 'bg-white border-[#EFE4DC] text-[#766D75] hover:bg-[#FFF9F3]'
                }`}
              >
                <span>{r}</span>
                <input
                  type="radio"
                  name="decline-reason"
                  checked={selectedReason === r}
                  onChange={() => setSelectedReason(r)}
                  className="accent-[#493548]"
                />
              </label>
            ))}
          </div>

          {selectedReason === 'Other reason' && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#766D75]">Custom Note</label>
              <textarea
                rows={2}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Briefly state reason..."
                className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#EFE4DC] text-xs font-bold text-[#766D75] hover:bg-[#FFF9F3] cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Confirm Decline
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
