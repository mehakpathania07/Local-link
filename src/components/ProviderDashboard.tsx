import React, { useState } from 'react';
import {
  Briefcase,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Phone,
  Settings,
  Plus,
  Save,
  Check,
  XCircle,
  AlertTriangle,
  IndianRupee,
  Calendar,
} from 'lucide-react';
import { Booking, Provider, CategoryId } from '../types';
import { TOWNS_LIST, CATEGORIES } from '../data/mockData';
import { DeclineReasonModal } from './DeclineReasonModal';

interface ProviderDashboardProps {
  currentProvider: Provider;
  bookings: Booking[];
  onUpdateProviderProfile?: (updated: Partial<Provider>) => void;
  onAcceptBooking?: (id: string) => void;
  onDeclineBooking?: (id: string, reason?: string) => void;
  onUpdateBookingStatus?: (id: string, status: Booking['status']) => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  currentProvider,
  bookings,
  onUpdateProviderProfile,
  onAcceptBooking,
  onDeclineBooking,
  onUpdateBookingStatus,
}) => {
  const [isAvailable, setIsAvailable] = useState(currentProvider.isAvailableToday);
  const [activeTab, setActiveTab] = useState<'requests' | 'active' | 'completed' | 'profile'>('requests');
  const [declineBookingId, setDeclineBookingId] = useState<string | null>(null);

  // Profile Settings Form
  const [proName, setProName] = useState(currentProvider.name);
  const [proTitle, setProTitle] = useState(currentProvider.title);
  const [proCategory, setProCategory] = useState<CategoryId>(currentProvider.category);
  const [proPhone, setProPhone] = useState(currentProvider.phone);
  const [proTown, setProTown] = useState(currentProvider.town);
  const [proServesAreas, setProServesAreas] = useState<string[]>(currentProvider.servesAreas);
  const [proStartingRate, setProStartingRate] = useState(currentProvider.startingRate);
  const [savedNotice, setSavedNotice] = useState(false);

  // Filter bookings for this provider
  const myBookings = bookings.filter(
    (b) => !b.providerId || b.providerId === currentProvider.id
  );

  const pendingRequests = myBookings.filter((b) => b.status === 'pending');
  const activeJobs = myBookings.filter((b) => b.status === 'accepted' || b.status === 'in_progress');
  const completedJobs = myBookings.filter((b) => b.status === 'completed');

  const totalEarnings = completedJobs.reduce((sum, b) => sum + (b.estimatedCost || currentProvider.startingRate || 350), 0);

  const handleToggleArea = (area: string) => {
    if (proServesAreas.includes(area)) {
      setProServesAreas(proServesAreas.filter((a) => a !== area));
    } else {
      setProServesAreas([...proServesAreas, area]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProviderProfile) {
      onUpdateProviderProfile({
        name: proName,
        title: proTitle,
        category: proCategory,
        phone: proPhone,
        town: proTown,
        servesAreas: proServesAreas,
        startingRate: Number(proStartingRate),
        isAvailableToday: isAvailable,
      });
    }
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
    }, 1500);
  };

  const handleToggleAvailability = () => {
    const next = !isAvailable;
    setIsAvailable(next);
    if (onUpdateProviderProfile) {
      onUpdateProviderProfile({ isAvailableToday: next });
    }
  };

  const handleAccept = (id: string) => {
    if (onAcceptBooking) {
      onAcceptBooking(id);
    } else if (onUpdateBookingStatus) {
      onUpdateBookingStatus(id, 'accepted');
    }
  };

  const handleConfirmDecline = (reason: string) => {
    if (declineBookingId) {
      if (onDeclineBooking) {
        onDeclineBooking(declineBookingId, reason);
      } else if (onUpdateBookingStatus) {
        onUpdateBookingStatus(declineBookingId, 'declined');
      }
      setDeclineBookingId(null);
    }
  };

  return (
    <div className="py-6 sm:py-10 bg-[#FFF9F3] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Profile Header & Availability Toggle */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EFE4DC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={currentProvider.avatar}
              alt={currentProvider.name}
              className="w-16 h-16 rounded-2xl object-cover border border-[#EEE7F4] shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-xl sm:text-2xl text-[#29242A]">
                  {currentProvider.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EFF5F0] text-emerald-800 text-[10px] font-bold border border-[#B7CDB9]">
                  Verified Local Partner
                </span>
              </div>
              <p className="text-xs font-bold text-[#493548]">
                {currentProvider.title} · 📍 {currentProvider.town}
              </p>
              <p className="text-xs text-[#766D75]">
                📞 {currentProvider.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Availability Toggle */}
            <button
              onClick={handleToggleAvailability}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
                isAvailable
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isAvailable ? 'bg-emerald-600 animate-pulse' : 'bg-red-500'
                }`}
              />
              <span>{isAvailable ? '🟢 Available for work' : '🔴 Currently Unavailable'}</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EFE4DC] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#766D75] block">Pending Requests</span>
            <span className="font-display font-black text-2xl sm:text-3xl text-amber-600">
              {pendingRequests.length}
            </span>
            <span className="text-[10px] text-[#766D75] block">Requires your action</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EFE4DC] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#766D75] block">Active Jobs</span>
            <span className="font-display font-black text-2xl sm:text-3xl text-[#493548]">
              {activeJobs.length}
            </span>
            <span className="text-[10px] text-[#766D75] block">In progress or scheduled</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EFE4DC] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#766D75] block">Completed Jobs</span>
            <span className="font-display font-black text-2xl sm:text-3xl text-emerald-700">
              {completedJobs.length}
            </span>
            <span className="text-[10px] text-[#766D75] block">Total satisfied customers</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EFE4DC] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#766D75] block">Total Earnings</span>
            <span className="font-display font-black text-2xl sm:text-3xl text-[#493548]">
              ₹{totalEarnings}
            </span>
            <span className="text-[10px] text-[#766D75] block">From completed visits</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#EFE4DC] pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-[#493548] text-white shadow-xs'
                : 'bg-white text-[#766D75] hover:bg-[#EEE7F4] border border-[#EFE4DC]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>New Requests ({pendingRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-[#493548] text-white shadow-xs'
                : 'bg-white text-[#766D75] hover:bg-[#EEE7F4] border border-[#EFE4DC]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Jobs ({activeJobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'completed'
                ? 'bg-[#493548] text-white shadow-xs'
                : 'bg-white text-[#766D75] hover:bg-[#EEE7F4] border border-[#EFE4DC]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Job History ({completedJobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-[#493548] text-white shadow-xs'
                : 'bg-white text-[#766D75] hover:bg-[#EEE7F4] border border-[#EFE4DC]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Service & Rates</span>
          </button>
        </div>

        {/* Tab 1: New Requests Feed */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-[#EFE4DC] text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#EEE7F4] text-[#493548] flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="font-display font-black text-base text-[#29242A]">
                  All Caught Up!
                </h3>
                <p className="text-xs text-[#766D75] max-w-sm mx-auto">
                  No new customer requests right now. Keep your status 🟢 Available to receive new local bookings.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    id={`incoming-req-${req.id}`}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EFE4DC] shadow-xs space-y-4 transition-all hover:border-[#493548]/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F6F0FA] pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#766D75] uppercase tracking-wider block">
                          Customer Request
                        </span>
                        <h3 className="font-display font-black text-base text-[#29242A]">
                          {req.customerName} · 📍 {req.town} {req.customerAddress && `(${req.customerAddress})`}
                        </h3>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-[#FEF9EB] text-[#493548] text-[11px] font-bold border border-[#F4D98B] self-start sm:self-auto">
                        🟡 Needs Response
                      </span>
                    </div>

                    {/* Problem & Time */}
                    <div className="bg-[#FFF9F3] p-3.5 rounded-2xl border border-[#EFE4DC] space-y-1">
                      <span className="text-[11px] font-bold text-[#766D75] block">
                        Problem Description:
                      </span>
                      <p className="text-sm font-bold text-[#29242A]">
                        “{req.problemDescription}”
                      </p>
                      <div className="text-xs text-[#766D75] pt-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#493548]" />
                        <span>Date & Slot: <strong>{req.date} · {req.timeSlot}</strong></span>
                      </div>
                    </div>

                    {/* Actions: Call, Accept, Decline */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <a
                        href={`tel:${req.customerPhone.replace(/[^0-9+]/g, '')}`}
                        className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 fill-white" />
                        <span>Call Customer ({req.customerPhone})</span>
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="py-2.5 px-5 rounded-xl bg-[#493548] hover:bg-[#352334] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          🟢 Accept Request
                        </button>

                        <button
                          onClick={() => setDeclineBookingId(req.id)}
                          className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-red-50 border border-[#EFE4DC] hover:border-red-200 text-red-600 text-xs font-medium transition-colors cursor-pointer"
                        >
                          🔴 Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Active Jobs Feed */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-[#EFE4DC] text-center space-y-2">
                <p className="text-xs text-[#766D75]">
                  No active jobs scheduled right now.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EFE4DC] shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F6F0FA] pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                          Ongoing Job
                        </span>
                        <h3 className="font-display font-black text-base text-[#29242A]">
                          {job.customerName} · 📍 {job.town}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-300 self-start sm:self-auto">
                        {job.status === 'in_progress' ? '⚡ In Progress' : '🟢 Scheduled'}
                      </span>
                    </div>

                    <div className="bg-[#FFF9F3] p-3.5 rounded-2xl border border-[#EFE4DC] space-y-1">
                      <span className="text-[11px] font-bold text-[#766D75] block">Requirement:</span>
                      <p className="text-sm font-bold text-[#29242A]">“{job.problemDescription}”</p>
                      <p className="text-xs text-[#766D75]">
                        Scheduled: {job.date} · {job.timeSlot} · Address: {job.customerAddress || 'Local town'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <a
                        href={`tel:${job.customerPhone.replace(/[^0-9+]/g, '')}`}
                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 fill-white" />
                        <span>Call Customer ({job.customerPhone})</span>
                      </a>

                      <div className="flex items-center gap-2">
                        {job.status === 'accepted' && (
                          <button
                            onClick={() => onUpdateBookingStatus && onUpdateBookingStatus(job.id, 'in_progress')}
                            className="py-2 px-4 rounded-xl bg-[#EEE7F4] hover:bg-[#E2D6EB] text-[#493548] text-xs font-bold transition-colors cursor-pointer"
                          >
                            Mark On The Way
                          </button>
                        )}
                        <button
                          onClick={() => onUpdateBookingStatus && onUpdateBookingStatus(job.id, 'completed')}
                          className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          ✓ Mark Completed
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Completed Jobs */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            {completedJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-[#EFE4DC] text-center space-y-2">
                <p className="text-xs text-[#766D75]">
                  No completed jobs logged yet. Completed jobs will show up here along with earnings.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-3xl p-5 border border-[#EFE4DC] shadow-xs flex flex-col justify-between gap-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                            ✓ Completed
                          </span>
                          <h4 className="font-bold text-sm text-[#29242A]">{job.customerName} (📍 {job.town})</h4>
                        </div>
                        <p className="text-xs text-[#766D75]">“{job.problemDescription}” · {job.date}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-[#766D75] block">Received</span>
                        <span className="font-display font-black text-base text-[#493548]">
                          ₹{job.estimatedPrice || currentProvider.startingRate || 350}
                        </span>
                      </div>
                    </div>

                    {/* Customer Review if given */}
                    {job.userRating && (
                      <div className="p-3 rounded-2xl bg-[#EFF5F0] border border-[#B7CDB9] flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{job.userRating} Stars</span>
                        </div>
                        <span className="text-[#493548] font-medium truncate">
                          — “{job.userReviewComment || 'Great service!'}”
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Provider Public Reviews List */}
            {currentProvider.reviews && currentProvider.reviews.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-[#EFE4DC] shadow-xs space-y-3 mt-4">
                <div className="flex items-center justify-between border-b border-[#F6F0FA] pb-2">
                  <h3 className="font-display font-black text-base text-[#29242A]">
                    Customer Reviews Received ({currentProvider.reviews.length})
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#29242A]">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{currentProvider.rating.toFixed(1)} / 5.0 Rating</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {currentProvider.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-2xl bg-[#FFF9F3] border border-[#EFE4DC] space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#29242A]">{rev.userName} ({rev.userTown})</span>
                        <div className="flex items-center gap-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#766D75]">“{rev.comment}”</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile & Rates Settings */}
        {activeTab === 'profile' && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFE4DC] shadow-xs space-y-4 animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#F6F0FA] pb-3">
              <h3 className="font-display font-black text-lg text-[#29242A]">
                Provider Profile & Service Areas
              </h3>
              {savedNotice && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                  ✓ Profile Saved!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#766D75]">Your Name</label>
                <input
                  type="text"
                  required
                  value={proName}
                  onChange={(e) => setProName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#766D75]">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={proPhone}
                  onChange={(e) => setProPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#766D75]">Primary Trade / Title</label>
                <input
                  type="text"
                  required
                  value={proTitle}
                  onChange={(e) => setProTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#766D75]">Starting Inspection Rate (₹)</label>
                <input
                  type="number"
                  required
                  value={proStartingRate}
                  onChange={(e) => setProStartingRate(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#766D75]">Home Base Town</label>
                <select
                  value={proTown}
                  onChange={(e) => setProTown(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A]"
                >
                  {TOWNS_LIST.map((t) => (
                    <option key={t} value={t}>
                      📍 {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Areas you can travel to */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-[#493548]">
                Areas & Villages You Can Travel To:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TOWNS_LIST.map((t) => {
                  const isChecked = proServesAreas.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleToggleArea(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
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

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#493548] hover:bg-[#352334] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Decline Reason Modal */}
      <DeclineReasonModal
        isOpen={!!declineBookingId}
        onClose={() => setDeclineBookingId(null)}
        onConfirmDecline={handleConfirmDecline}
      />

    </div>
  );
};
