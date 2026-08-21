import React, { useState } from 'react';
import { Briefcase, CheckCircle2, X, MapPin, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Provider, CategoryId } from '../types';
import { TOWNS_LIST, CATEGORIES } from '../data/mockData';

interface RegisterProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (newProvider: Provider) => void;
}

export const RegisterProviderModal: React.FC<RegisterProviderModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('electrician');
  const [phone, setPhone] = useState('+91 ');
  const [town, setTown] = useState('Nurpur');
  const [servesAreas, setServesAreas] = useState<string[]>(['Nurpur', 'Suliali', 'Sadwan']);
  const [startingRate, setStartingRate] = useState('200');
  const [shortBio, setShortBio] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleToggleArea = (area: string) => {
    if (servesAreas.includes(area)) {
      setServesAreas(servesAreas.filter((a) => a !== area));
    } else {
      setServesAreas([...servesAreas, area]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newProvider: Provider = {
      id: `pro-custom-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      title: title.trim() || `${category} Specialist`,
      businessName: `${name.trim()} Services`,
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
      category,
      rating: 5.0,
      reviewCount: 1,
      startingRate: Number(startingRate) || 200,
      rateUnit: 'visit',
      distanceKm: 0.5,
      neighborhood: `${town} Center`,
      town,
      servesAreas: servesAreas.length > 0 ? servesAreas : [town],
      bio: shortBio.trim() || `Experienced local ${category} serving ${town} and neighboring villages with quick response.`,
      shortBio: shortBio.trim() || `Professional ${category} based in ${town}.`,
      skills: ['Quick Diagnosis', 'Reliable Service', 'Emergency Repair'],
      isVerified: true,
      isTopRated: true,
      isAvailableToday: true,
      isQuickResponder: true,
      yearsExperience: 4,
      completedJobs: 1,
      responseTime: '< 15 mins',
      availabilityNext: 'Available Today',
      languages: ['Hindi', 'Pahadi'],
      badges: ['Verified Local Pro'],
      phone: phone.trim(),
      email: `${name.toLowerCase().replace(/\s+/g, '')}@locallink.hp`,
      services: [
        {
          id: 'svc-1',
          title: 'Standard Diagnostic Visit & Repair',
          price: Number(startingRate) || 200,
          priceType: 'starting_at',
          duration: '45 mins',
          description: 'On-site diagnosis and repair estimate for home services.',
        },
      ],
      portfolio: [],
      reviews: [
        {
          id: 'rev-init',
          userName: 'Resident',
          rating: 5,
          date: 'Recently',
          comment: 'Registered local partner in Nurpur region.',
          userTown: town,
        },
      ],
    };

    onRegister(newProvider);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F4B8A4', '#B7CDB9', '#F4D98B', '#493548'],
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#29242A]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#EFE4DC] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-[#FFF9F3] border-b border-[#EFE4DC] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEE7F4] text-[#493548] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-[#29242A]">
                Join as a Local Provider
              </h2>
              <p className="text-xs text-[#766D75]">
                Get direct customer calls in Nurpur & nearby villages with ₹0 fees.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#766D75] hover:text-[#29242A] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-display font-black text-2xl text-[#29242A]">
              Profile Listed Successfully!
            </h3>
            <p className="text-xs text-[#766D75] max-w-xs mx-auto">
              Your profile is now discoverable to people in {town} and neighboring villages.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4 overflow-y-auto">
            
            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#493548]">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#493548]">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98160 XXXXX"
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
                />
              </div>
            </div>

            {/* Service Trade & Specific Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#493548]">Trade / Service Type</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] bg-white focus:outline-hidden focus:border-[#493548]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#493548]">Specialty Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Electrician & Motor Repair"
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
                />
              </div>
            </div>

            {/* Base Location & Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#493548]">Where are you located?</label>
                <select
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] bg-white focus:outline-hidden focus:border-[#493548]"
                >
                  {TOWNS_LIST.map((t) => (
                    <option key={t} value={t}>
                      📍 {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#493548]">Starting Visit Charge (₹)</label>
                <input
                  type="number"
                  value={startingRate}
                  onChange={(e) => setStartingRate(e.target.value)}
                  placeholder="200"
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
                />
              </div>
            </div>

            {/* Areas you can travel to (multi-select) */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-[#493548] flex items-center justify-between">
                <span>Areas you can travel to:</span>
                <span className="text-[11px] text-[#766D75] font-normal">Tap to select all that apply</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-[#FFF9F3] rounded-2xl border border-[#EFE4DC]">
                {TOWNS_LIST.map((t) => {
                  const isChecked = servesAreas.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleToggleArea(t)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#493548] text-white border-[#493548]'
                          : 'bg-white text-[#766D75] border-[#EFE4DC] hover:bg-[#EEE7F4]'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Short Bio */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#493548]">Short Description of Your Work</label>
              <textarea
                rows={2}
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
                placeholder="e.g. 8 years experience in motor rewinding and domestic wiring. Prompt service."
                className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="register-submit-btn"
                className="w-full py-3.5 rounded-2xl bg-[#493548] hover:bg-[#352334] text-white font-display font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
              >
                <span>Register & Go Live in {town}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
