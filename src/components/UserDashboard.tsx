import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  Bookmark,
  RotateCcw,
  Sparkles,
  Activity,
  Trash2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { Booking, Provider, CategoryId, BookingStatus } from '../types';
import { CATEGORIES } from '../data/mockData';
import { DirectCallModal } from './DirectCallModal';
import { ReviewModal } from './ReviewModal';
import { RequestTrackingModal } from './RequestTrackingModal';

interface UserDashboardProps {
  bookings: Booking[];
  savedProviders: Provider[];
  allProviders: Provider[];
  selectedTown: string;
  onSelectProvider: (provider: Provider) => void;
  onBookProvider: (provider: Provider) => void;
  onExploreCategory: (categoryId: CategoryId) => void;
  onCancelBooking: (bookingId: string) => void;
  onStartSearch: () => void;
  onAddReview?: (bookingId: string, rating: number, comment: string) => void;
  onToggleSave?: (providerId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  bookings,
  savedProviders,
  allProviders,
  selectedTown,
  onSelectProvider,
  onBookProvider,
  onExploreCategory,
  onCancelBooking,
  onStartSearch,
  onAddReview,
  onToggleSave,
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'saved'>('requests');
  const [requestFilter, setRequestFilter] = useState<'all' | 'active' | 'completed' | 'declined'>('all');
  const [callingProvider, setCallingProvider] = useState<Provider | null>(null);
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [trackingBooking, setTrackingBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (requestFilter === 'active') return b.status === 'pending' || b.status === 'accepted' || b.status === 'in_progress';
    if (requestFilter === 'completed') return b.status === 'completed';
    if (requestFilter === 'declined') return b.status === 'declined' || b.status === 'cancelled';
    return true;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full bg-[#FEF9EB] border border-[#F4D98B] text-[#493548] text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#E5A824] animate-ping" />
            🟡 Waiting for response
          </span>
        );
      case 'accepted':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            🟢 Provider accepted
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-300 text-blue-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            🔵 Service in progress
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full bg-[#EEE7F4] border border-[#DFD4E8] text-[#493548] text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#493548]" />
            ✓ Completed
          </span>
        );
      case 'declined':
        return (
          <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            🔴 Request declined
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const handleCallByPhone = (proName: string, phone: string, town: string) => {
    const match = allProviders.find((p) => p.name === proName) || {
      id: 'temp',
      name: proName,
      phone,
      town,
      title: 'Local Professional',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      category: 'electrician' as any,
      rating: 4.9,
      reviewCount: 20,
      startingRate: 200,
      rateUnit: 'visit' as any,
      distanceKm: 1,
      neighborhood: town,
      servesAreas: [town],
      bio: '',
      shortBio: '',
      skills: [],
      isVerified: true,
      isTopRated: true,
      isAvailableToday: true,
      isQuickResponder: true,
      yearsExperience: 5,
      completedJobs: 50,
      responseTime: '< 15 mins',
      availabilityNext: 'Available',
      languages: ['Hindi', 'Pahadi'],
      badges: ['Verified'],
      services: [],
      portfolio: [],
      reviews: [],
    };
    setCallingProvider(match);
  };

  return (
    <div className="py-6 sm:py-10 bg-[#FFF9F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Simple Top Banner */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#EFE4DC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEE7F4] text-[#493548] text-xs font-bold mb-1.5">
              <span>📍</span> Community Requests · {selectedTown}
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#493548] tracking-tight">
              My Service Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#766D75] font-medium">
              Track requests sent to local craftspeople, view live status, or call them directly.
            </p>
          </div>

          <button
            onClick={onStartSearch}
            className="px-5 py-3 rounded-2xl bg-[#493548] hover:bg-[#352334] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Find Local Services</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-[#EFE4DC] pb-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'bg-[#493548] text-white shadow-xs'
                : 'text-[#766D75] hover:bg-[#EEE7F4]'
            }`}
          >
            <span>My Requests</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#F4B8A4] text-[#493548] text-[10px] font-black">
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'bg-[#493548] text-white shadow-xs'
                : 'text-[#766D75] hover:bg-[#EEE7F4]'
            }`}
          >
            <span>Saved Local Pros</span>
            <span className="text-[10px] opacity-70">({savedProviders.length})</span>
          </button>
        </div>

        {/* Tab 1: Requests List */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {/* Sub-filter chips */}
            {bookings.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setRequestFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    requestFilter === 'all'
                      ? 'bg-[#493548] text-white'
                      : 'bg-white text-[#766D75] border border-[#EFE4DC]'
                  }`}
                >
                  All ({bookings.length})
                </button>
                <button
                  onClick={() => setRequestFilter('active')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    requestFilter === 'active'
                      ? 'bg-[#493548] text-white'
                      : 'bg-white text-[#766D75] border border-[#EFE4DC]'
                  }`}
                >
                  Active ({bookings.filter((b) => b.status === 'pending' || b.status === 'accepted' || b.status === 'in_progress').length})
                </button>
                <button
                  onClick={() => setRequestFilter('completed')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    requestFilter === 'completed'
                      ? 'bg-[#493548] text-white'
                      : 'bg-white text-[#766D75] border border-[#EFE4DC]'
                  }`}
                >
                  Completed ({bookings.filter((b) => b.status === 'completed').length})
                </button>
                <button
                  onClick={() => setRequestFilter('declined')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    requestFilter === 'declined'
                      ? 'bg-[#493548] text-white'
                      : 'bg-white text-[#766D75] border border-[#EFE4DC]'
                  }`}
                >
                  Cancelled / Declined ({bookings.filter((b) => b.status === 'declined' || b.status === 'cancelled').length})
                </button>
              </div>
            )}

            {filteredBookings.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-[#EFE4DC] p-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#EEE7F4] text-[#493548] flex items-center justify-center mx-auto text-xl font-bold">
                  📋
                </div>
                <h3 className="font-display font-black text-xl text-[#29242A]">
                  {bookings.length === 0 ? 'No service requests yet' : 'No requests match this filter'}
                </h3>
                <p className="text-xs text-[#766D75] max-w-sm mx-auto">
                  When you need an electrician, plumber, mechanic or tutor in {selectedTown} or nearby villages, search or request service directly.
                </p>
                <button
                  onClick={onStartSearch}
                  className="mt-2 px-5 py-2.5 rounded-2xl bg-[#493548] text-white text-xs font-bold hover:bg-[#352334] cursor-pointer"
                >
                  Find Nearby Help
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    id={`booking-card-${booking.id}`}
                    className="bg-white rounded-3xl border border-[#EFE4DC] p-5 sm:p-6 shadow-xs space-y-4 transition-all hover:border-[#493548]/30"
                  >
                    {/* Top Row: Provider info + Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F6F0FA] pb-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={booking.providerAvatar}
                          alt={booking.providerName}
                          className="w-13 h-13 rounded-2xl object-cover border border-[#EEE7F4] shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h3 className="font-display font-black text-base sm:text-lg text-[#29242A]">
                            {booking.providerName} — <span className="font-medium text-[#766D75]">{booking.serviceTitle}</span>
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-[#766D75] font-medium mt-0.5">
                            <span className="flex items-center gap-1 text-[#493548] font-bold">
                              <MapPin className="w-3.5 h-3.5 text-[#766D75]" />
                              📍 {booking.town}
                            </span>
                            <span>·</span>
                            <span>Requested: {booking.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <div>{getStatusBadge(booking.status)}</div>
                    </div>

                    {/* Problem Description Card */}
                    <div className="bg-[#FFF9F3] p-3.5 rounded-2xl border border-[#EFE4DC] space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#766D75] block">
                        Problem Described:
                      </span>
                      <p className="text-xs text-[#29242A] font-medium">
                        “{booking.problemDescription}”
                      </p>
                      <div className="text-[11px] text-[#766D75] pt-1">
                        Preferred timing: <strong>{booking.date} {booking.timeSlot ? `· ${booking.timeSlot}` : ''}</strong>
                      </div>
                    </div>

                    {/* Decline Reason if applicable */}
                    {booking.status === 'declined' && booking.declineReason && (
                      <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800">
                        <strong>Reason provided by provider:</strong> {booking.declineReason}
                      </div>
                    )}

                    {/* Rating if already given */}
                    {booking.userRating && (
                      <div className="p-3 rounded-2xl bg-[#EFF5F0] border border-[#B7CDB9] flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{booking.userRating} Stars</span>
                        </div>
                        <span className="text-[#766D75] font-medium">
                          — “{booking.userReviewComment}”
                        </span>
                      </div>
                    )}

                    {/* Bottom Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      
                      {/* Left: Direct Call button */}
                      <button
                        onClick={() => handleCallByPhone(booking.providerName, booking.providerPhone, booking.town)}
                        className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 fill-white" />
                        <span>Call {booking.providerName.split(' ')[0]} ({booking.providerPhone})</span>
                      </button>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2">
                        {/* Live Tracking Modal Button */}
                        <button
                          onClick={() => setTrackingBooking(booking)}
                          className="py-2 px-3 rounded-xl bg-[#EEE7F4] hover:bg-[#E2D6EB] text-[#493548] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>Live Timeline</span>
                        </button>

                        {booking.status === 'completed' && !booking.userRating && (
                          <button
                            onClick={() => setReviewingBooking(booking)}
                            className="py-2 px-3.5 rounded-xl bg-[#F4D98B] hover:bg-[#ebd07c] text-[#493548] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Star className="w-3.5 h-3.5 fill-[#493548]" />
                            <span>Leave Review</span>
                          </button>
                        )}

                        {booking.status === 'pending' && (
                          <button
                            onClick={() => onCancelBooking(booking.id)}
                            className="py-2 px-3 rounded-xl bg-white hover:bg-red-50 border border-[#EFE4DC] hover:border-red-200 text-xs font-medium text-red-600 transition-colors cursor-pointer"
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Providers */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {savedProviders.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-[#EFE4DC] p-8 space-y-3">
                <Bookmark className="w-12 h-12 text-[#766D75] mx-auto opacity-50" />
                <h3 className="font-display font-black text-xl text-[#29242A]">No saved professionals</h3>
                <p className="text-xs text-[#766D75]">
                  Click the bookmark icon on any provider profile in Nurpur or nearby villages to save them for quick access.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProviders.map((pro) => (
                  <div
                    key={pro.id}
                    className="bg-white rounded-3xl border border-[#EFE4DC] p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={pro.avatar}
                            alt={pro.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-[#EEE7F4]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <h4
                              onClick={() => onSelectProvider(pro)}
                              className="font-display font-black text-base text-[#29242A] truncate cursor-pointer hover:text-[#493548]"
                            >
                              {pro.name}
                            </h4>
                            <p className="text-xs text-[#766D75] truncate">{pro.title}</p>
                            <p className="text-xs font-bold text-[#493548]">📍 {pro.town}</p>
                          </div>
                        </div>

                        {onToggleSave && (
                          <button
                            onClick={() => onToggleSave(pro.id)}
                            className="p-2 rounded-xl text-[#F4B8A4] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-[#F6F0FA] mt-4">
                      <button
                        onClick={() => setCallingProvider(pro)}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 fill-white" />
                        <span>Call</span>
                      </button>
                      <button
                        onClick={() => onBookProvider(pro)}
                        className="flex-1 py-2 rounded-xl bg-[#493548] text-white text-xs font-bold cursor-pointer"
                      >
                        Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Direct Call Modal */}
      <DirectCallModal
        isOpen={!!callingProvider}
        onClose={() => setCallingProvider(null)}
        provider={callingProvider}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={!!reviewingBooking}
        onClose={() => setReviewingBooking(null)}
        booking={reviewingBooking}
        onSubmitReview={(bookingId, rating, comment) => {
          if (onAddReview) {
            onAddReview(bookingId, rating, comment);
          }
        }}
      />

      {/* Live Request Tracking Modal */}
      <RequestTrackingModal
        isOpen={!!trackingBooking}
        onClose={() => setTrackingBooking(null)}
        booking={trackingBooking}
        onCancelBooking={(id) => {
          onCancelBooking(id);
          setTrackingBooking(null);
        }}
        onAddReview={(id, rating, comment) => {
          if (onAddReview) {
            onAddReview(id, rating, comment);
          }
          setTrackingBooking(null);
        }}
        onFindAlternative={() => {
          setTrackingBooking(null);
          onStartSearch();
        }}
      />

    </div>
  );
};
