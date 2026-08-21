import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { Provider } from '../types';

interface ReportProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
}

export const ReportProviderModal: React.FC<ReportProviderModalProps> = ({
  isOpen,
  onClose,
  provider,
}) => {
  const [reportType, setReportType] = useState<string>('incorrect_info');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !provider) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      onClose();
    }, 1800);
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
            <h3 className="font-display font-black text-xl text-[#29242A]">Report Submitted</h3>
            <p className="text-xs text-[#766D75]">
              Thank you for keeping our local Nurpur community safe. Our team will review this promptly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FDF1ED] text-[#E05638] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-[#29242A]">Report Provider / Details</h3>
                <p className="text-xs text-[#766D75]">{provider.name} · {provider.town}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#493548]">What is the issue?</label>
              <div className="space-y-1.5">
                {[
                  { id: 'incorrect_info', label: 'Wrong phone number or area information' },
                  { id: 'unresponsive', label: 'Does not answer phone / unreachable' },
                  { id: 'overcharging', label: 'Different price charged than quoted' },
                  { id: 'poor_behavior', label: 'Unprofessional or inappropriate behavior' },
                  { id: 'other', label: 'Other community feedback' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      reportType === item.id
                        ? 'bg-[#EEE7F4] border-[#493548] text-[#493548] font-bold'
                        : 'bg-white border-[#EFE4DC] text-[#29242A]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportType"
                      checked={reportType === item.id}
                      onChange={() => setReportType(item.id)}
                      className="accent-[#493548]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#493548]">Brief details (Optional)</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what happened..."
                rows={3}
                className="w-full p-3 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white border border-[#EFE4DC] text-xs font-bold text-[#766D75] hover:bg-[#FFF9F3]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#493548] text-white text-xs font-bold hover:bg-[#352334] transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
