import React, { useState } from 'react';
import {
  X,
  MapPin,
  User,
  Briefcase,
  Phone,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { TOWNS_LIST } from '../data/mockData';
import { DEFAULT_CUSTOMER_USER, DEFAULT_PROVIDER_USER } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLogin: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup' | 'switch_role';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  initialMode = 'login',
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(
    initialMode === 'switch_role' ? 'login' : initialMode
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // phone or email
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Suliali');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleUseCurrentLocation = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Simulation / detected near Nurpur-Suliali region
          setTimeout(() => {
            setLocation('Suliali');
            setIsDetectingLocation(false);
          }, 400);
        },
        () => {
          setLocation('Suliali');
          setIsDetectingLocation(false);
        },
        { timeout: 3000 }
      );
    } else {
      setLocation('Suliali');
      setIsDetectingLocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    const finalName =
      name.trim() ||
      (selectedRole === 'provider' ? 'Ramesh Kumar (Pro)' : identifier.split('@')[0] || 'Local Resident');

    const newUser: UserProfile = {
      id: `usr-${Date.now().toString().slice(-5)}`,
      name: finalName,
      phone: identifier.includes('@') ? '+91 98160 12345' : identifier,
      email: identifier.includes('@') ? identifier : `${finalName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      role: selectedRole,
      location: location,
      providerProfileId: selectedRole === 'provider' ? 'p1' : undefined,
    };

    setSuccessMessage(
      authMode === 'signup'
        ? `Account created! Welcome, ${newUser.name} 👋`
        : `Logged in as ${newUser.name}`
    );

    setTimeout(() => {
      onLogin(newUser);
      setSuccessMessage('');
      onClose();
    }, 700);
  };

  const handleQuickDemoSwitch = (role: UserRole) => {
    const userToSet = role === 'customer' ? DEFAULT_CUSTOMER_USER : DEFAULT_PROVIDER_USER;
    setSuccessMessage(`Switched to ${role === 'customer' ? 'Customer (Mehak)' : 'Provider (Rakesh)'}`);
    setTimeout(() => {
      onLogin(userToSet);
      setSuccessMessage('');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#29242A]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EFE4DC] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FFF9F3] border-b border-[#EFE4DC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#493548] flex items-center justify-center text-[#F4D98B] font-display font-black text-sm">
              LL
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-[#29242A]">
                {authMode === 'signup' ? 'Join LocalLink' : 'Sign in to LocalLink'}
              </h2>
              <p className="text-xs text-[#766D75]">
                {authMode === 'signup'
                  ? 'Nurpur & Kangra Valley Local Community'
                  : 'Welcome back to your local hub'}
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

        {/* Success Notice */}
        {successMessage ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-black text-xl text-[#29242A]">
              {successMessage}
            </h3>
            <p className="text-xs text-[#766D75]">Updating your dashboard...</p>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Quick Demo Switcher Banner */}
            <div className="p-3 bg-[#EEE7F4]/70 rounded-2xl border border-[#DFD4E8] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#493548]">
                <span>⚡ 1-Click Fast Switch:</span>
                <span className="text-[10px] text-[#766D75] font-medium">Test both flows</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoSwitch('customer')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    currentUser.role === 'customer'
                      ? 'bg-[#493548] text-white shadow-2xs'
                      : 'bg-white text-[#493548] border border-[#DFD4E8] hover:bg-[#F6F0FA]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Customer (Mehak)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoSwitch('provider')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    currentUser.role === 'provider'
                      ? 'bg-[#493548] text-white shadow-2xs'
                      : 'bg-white text-[#493548] border border-[#DFD4E8] hover:bg-[#F6F0FA]'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Provider (Rakesh)</span>
                </button>
              </div>
            </div>

            {/* Step 1: Role Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#493548] block">
                What are you here for?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedRole('customer')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedRole === 'customer'
                      ? 'bg-[#FFF9F3] border-[#493548] shadow-xs'
                      : 'bg-white border-[#EFE4DC] hover:border-[#493548]/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-[#493548]" />
                    <span className="font-bold text-xs text-[#29242A]">Find a Service</span>
                  </div>
                  <p className="text-[11px] text-[#766D75]">
                    I need an electrician, plumber, mechanic, etc.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('provider')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedRole === 'provider'
                      ? 'bg-[#FFF9F3] border-[#493548] shadow-xs'
                      : 'bg-white border-[#EFE4DC] hover:border-[#493548]/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4 text-[#493548]" />
                    <span className="font-bold text-xs text-[#29242A]">Offer a Service</span>
                  </div>
                  <p className="text-[11px] text-[#766D75]">
                    I am a craftsperson offering services locally.
                  </p>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#766D75]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={selectedRole === 'customer' ? 'e.g. Mehak Sharma' : 'e.g. Rakesh Sharma'}
                    className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
                  />
                </div>
              )}

              {/* Phone or Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#766D75]">Phone Number or Email</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="+91 98160 XXXXX or your@email.com"
                    className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#766D75]">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] focus:outline-hidden focus:border-[#493548]"
                />
              </div>

              {/* Location Setup */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#766D75]">
                    Where are you located?
                  </label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isDetectingLocation}
                    className="text-[10px] font-bold text-[#493548] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Navigation className="w-2.5 h-2.5" />
                    <span>{isDetectingLocation ? 'Detecting...' : 'Use my current location'}</span>
                  </button>
                </div>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EFE4DC] text-xs text-[#29242A] bg-white focus:outline-hidden focus:border-[#493548]"
                >
                  {TOWNS_LIST.map((t) => (
                    <option key={t} value={t}>
                      📍 {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="auth-submit-btn"
                className="w-full py-3 rounded-xl bg-[#493548] hover:bg-[#352334] text-white font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-98"
              >
                {authMode === 'signup' ? 'Create Account & Continue' : 'Sign In'}
              </button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="text-center pt-1 border-t border-[#F6F0FA]">
              {authMode === 'login' ? (
                <p className="text-xs text-[#766D75]">
                  New to LocalLink?{' '}
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="font-bold text-[#493548] hover:underline cursor-pointer"
                  >
                    Create a free account
                  </button>
                </p>
              ) : (
                <p className="text-xs text-[#766D75]">
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="font-bold text-[#493548] hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
