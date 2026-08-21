import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Calendar,
  Bookmark,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Menu,
  X,
  User,
  Heart,
  Bell,
  LogOut,
  Repeat,
  LogIn,
} from 'lucide-react';
import { TOWNS_LIST } from '../data/mockData';
import { ActivePage, UserProfile } from '../types';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedTown: string;
  setSelectedTown: (town: string) => void;
  bookingsCount: number;
  savedCount?: number;
  onOpenSearch: () => void;
  user?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onOpenLocationModal?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  onLogout?: () => void;
  onSwitchRole?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  selectedTown,
  setSelectedTown,
  bookingsCount,
  savedCount = 0,
  onOpenSearch,
  user,
  onOpenAuthModal,
  onOpenLocationModal,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  onLogout,
  onSwitchRole,
}) => {
  const [isTownMenuOpen, setIsTownMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'LL';

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F3]/95 backdrop-blur-md border-b border-[#EFE4DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Brand + Tagline */}
          <div className="flex items-center gap-6">
            <button
              id="navbar-logo-btn"
              onClick={() => setActivePage('home')}
              className="flex flex-col text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#493548] flex items-center justify-center text-[#F4D98B] font-display font-black text-base shadow-xs group-hover:scale-105 transition-transform">
                  LL
                </div>
                <span className="font-display font-black text-2xl tracking-tight text-[#493548]">
                  Local<span className="text-[#F4B8A4]">Link</span>
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#766D75] ml-10 -mt-1 hidden sm:block">
                Nearby help. Trusted locally.
              </span>
            </button>
          </div>

          {/* Center Navigation: Home · Explore · Requests · Saved */}
          <nav className="hidden md:flex items-center gap-1 bg-white/80 p-1.5 rounded-full border border-[#EFE4DC] shadow-2xs">
            <button
              id="nav-home-btn"
              onClick={() => setActivePage('home')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activePage === 'home'
                  ? 'bg-[#493548] text-white shadow-xs'
                  : 'text-[#29242A] hover:bg-[#EEE7F4]'
              }`}
            >
              Home
            </button>

            <button
              id="nav-explore-btn"
              onClick={() => setActivePage('discover')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activePage === 'discover'
                  ? 'bg-[#493548] text-white shadow-xs'
                  : 'text-[#29242A] hover:bg-[#EEE7F4]'
              }`}
            >
              Explore
            </button>

            <button
              id="nav-requests-btn"
              onClick={() => setActivePage('my-bookings')}
              className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activePage === 'my-bookings'
                  ? 'bg-[#493548] text-white shadow-xs'
                  : 'text-[#29242A] hover:bg-[#EEE7F4]'
              }`}
            >
              <span>Requests</span>
              {bookingsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#F4B8A4] text-[#493548] text-[10px] font-black flex items-center justify-center">
                  {bookingsCount}
                </span>
              )}
            </button>

            <button
              id="nav-saved-btn"
              onClick={() => setActivePage('saved-pros')}
              className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activePage === 'saved-pros'
                  ? 'bg-[#493548] text-white shadow-xs'
                  : 'text-[#29242A] hover:bg-[#EEE7F4]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${activePage === 'saved-pros' ? 'fill-white' : 'text-[#766D75]'}`} />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#EEE7F4] text-[#493548] text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Controls: Location Pin, Search, Notifications & User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-full bg-white hover:bg-[#EEE7F4] border border-[#EFE4DC] text-[#493548] transition-all cursor-pointer shadow-2xs"
              title="Quick Search (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2.5 rounded-full bg-white hover:bg-[#EEE7F4] border border-[#EFE4DC] text-[#493548] transition-all cursor-pointer shadow-2xs"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {/* Location Selector Pill */}
            <div className="relative">
              <button
                id="location-picker-btn"
                onClick={() => {
                  if (onOpenLocationModal) {
                    onOpenLocationModal();
                  } else {
                    setIsTownMenuOpen(!isTownMenuOpen);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 rounded-full bg-[#EEE7F4] hover:bg-[#E2D6EB] text-[#493548] font-bold text-xs border border-[#DFD4E8] transition-all shadow-2xs cursor-pointer active:scale-98"
              >
                <MapPin className="w-3.5 h-3.5 text-[#493548] shrink-0" />
                <span className="truncate max-w-[90px] sm:max-w-none">
                  {selectedTown}, HP
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isTownMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Town Dropdown Menu */}
              {isTownMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-3xl border border-[#EFE4DC] shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-[#F6F0FA]">
                    <p className="text-[10px] font-bold text-[#766D75] uppercase tracking-wider">
                      Select Community
                    </p>
                    <p className="text-xs font-bold text-[#29242A]">
                      Nurpur, Kangra Valley
                    </p>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                    {TOWNS_LIST.map((town) => (
                      <button
                        key={town}
                        onClick={() => {
                          setSelectedTown(town);
                          setIsTownMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-2xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          selectedTown === town
                            ? 'bg-[#EEE7F4] text-[#493548] font-bold'
                            : 'text-[#29242A] hover:bg-[#FFF9F3]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-[#766D75]" />
                          {town}
                        </span>
                        {town === 'Nurpur' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4D98B] text-[#493548] font-bold">
                            Hub
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Menu or Login button */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-10 h-10 rounded-full bg-[#493548] hover:bg-[#352334] text-[#F4D98B] font-display font-bold text-sm flex items-center justify-center border-2 border-white shadow-xs transition-all cursor-pointer active:scale-95"
                  title="Account & Portal"
                >
                  {initials}
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-3xl border border-[#EFE4DC] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                    <div className="px-3 py-2 border-b border-[#F6F0FA]">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs text-[#29242A] truncate">{user.name}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEE7F4] text-[#493548] font-bold capitalize">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#766D75]">
                        📍 {user.location || selectedTown}, HP
                      </p>
                      {user.phone && (
                        <p className="text-[11px] text-[#766D75]">📞 {user.phone}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setActivePage('my-bookings');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#29242A] hover:bg-[#EEE7F4] flex items-center justify-between cursor-pointer"
                      >
                        <span>My Service Requests</span>
                        {bookingsCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-[#F4B8A4] text-[#493548] text-[10px] font-bold">
                            {bookingsCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setActivePage('saved-pros');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#29242A] hover:bg-[#EEE7F4] cursor-pointer"
                      >
                        Saved Local Pros ({savedCount})
                      </button>

                      <div className="border-t border-[#F6F0FA] my-1" />

                      <button
                        onClick={() => {
                          setActivePage('provider-dashboard');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#493548] bg-[#EEE7F4] hover:bg-[#E2D6EB] flex items-center justify-between cursor-pointer"
                      >
                        <span>Pro Partner Portal</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#493548] font-bold">
                          Partner
                        </span>
                      </button>

                      {onSwitchRole && (
                        <button
                          onClick={() => {
                            onSwitchRole();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#766D75] hover:bg-[#FFF9F3] flex items-center gap-2 cursor-pointer"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          <span>Switch to {user.role === 'provider' ? 'Customer Mode' : 'Provider Mode'}</span>
                        </button>
                      )}

                      {onLogout && (
                        <button
                          onClick={() => {
                            onLogout();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 rounded-full bg-[#493548] hover:bg-[#352334] text-[#F4D98B] font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-2xl bg-white border border-[#EFE4DC] text-[#493548] cursor-pointer"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FFF9F3] border-b border-[#EFE4DC] px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => {
              setActivePage('home');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-2xl font-bold text-sm ${
              activePage === 'home' ? 'bg-[#493548] text-white' : 'text-[#29242A] hover:bg-[#EEE7F4]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              setActivePage('discover');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-2xl font-bold text-sm ${
              activePage === 'discover' ? 'bg-[#493548] text-white' : 'text-[#29242A] hover:bg-[#EEE7F4]'
            }`}
          >
            Explore Pros
          </button>
          <button
            onClick={() => {
              setActivePage('my-bookings');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-2xl font-bold text-sm flex items-center justify-between ${
              activePage === 'my-bookings' ? 'bg-[#493548] text-white' : 'text-[#29242A] hover:bg-[#EEE7F4]'
            }`}
          >
            <span>Service Requests</span>
            {bookingsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#F4B8A4] text-[#493548] text-xs font-black">
                {bookingsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActivePage('saved-pros');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-2xl font-bold text-sm ${
              activePage === 'saved-pros' ? 'bg-[#493548] text-white' : 'text-[#29242A] hover:bg-[#EEE7F4]'
            }`}
          >
            Saved Pros ({savedCount})
          </button>
          <button
            onClick={() => {
              setActivePage('provider-dashboard');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-2xl font-bold text-sm text-[#493548] bg-[#EEE7F4]"
          >
            Technician & Pro Partner Portal
          </button>

          {!user && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenAuthModal) onOpenAuthModal();
              }}
              className="w-full text-center py-2.5 rounded-2xl font-bold text-sm bg-[#493548] text-[#F4D98B] mt-2"
            >
              Sign In / Sign Up
            </button>
          )}
        </div>
      )}
    </header>
  );
};
