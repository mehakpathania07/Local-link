/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryGrid } from './components/CategoryGrid';
import { FeaturedPros } from './components/FeaturedPros';
import { ConversationalHelper } from './components/ConversationalHelper';
import { FeaturedSpotlight } from './components/FeaturedSpotlight';
import { CommunityMap } from './components/CommunityMap';
import { HowItWorks } from './components/HowItWorks';
import { TrustCommunity } from './components/TrustCommunity';
import { DiscoveryPage } from './components/DiscoveryPage';
import { ProviderDetailPage } from './components/ProviderDetailPage';
import { BookingFlowModal } from './components/BookingFlowModal';
import { UserDashboard } from './components/UserDashboard';
import { ProviderDashboard } from './components/ProviderDashboard';
import { RegisterProviderModal } from './components/RegisterProviderModal';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { LocationSetupModal } from './components/LocationSetupModal';
import { NotificationDrawer } from './components/NotificationDrawer';

import { PROVIDERS as INITIAL_PROVIDERS } from './data/mockData';
import {
  Provider,
  CategoryId,
  ActivePage,
  Booking,
  ServiceOffering,
  UserProfile,
  AppNotification,
  BookingStatus,
} from './types';
import { storage, DEFAULT_CUSTOMER_USER, DEFAULT_PROVIDER_USER } from './utils/storage';

export default function App() {
  // Navigation State
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Persistent User State
  const [user, setUser] = useState<UserProfile>(() => storage.getUser());

  // Persistent Location State
  const [selectedTown, setSelectedTown] = useState<string>(() => storage.getSelectedLocation());

  // Persistent Providers State
  const [providers, setProviders] = useState<Provider[]>(INITIAL_PROVIDERS);

  // Selected Provider for Detail View
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  // Persistent Saved Providers
  const [savedProviderIds, setSavedProviderIds] = useState<string[]>(() =>
    storage.getSavedProviders()
  );

  // Persistent Bookings State
  const [bookings, setBookings] = useState<Booking[]>(() => storage.getBookings());

  // Persistent Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    storage.getNotifications()
  );

  // Modals Visibility
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingTargetProvider, setBookingTargetProvider] = useState<Provider | null>(null);
  const [bookingInitialService, setBookingInitialService] = useState<ServiceOffering | undefined>(undefined);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Sync state changes with persistence
  useEffect(() => {
    storage.saveUser(user);
  }, [user]);

  useEffect(() => {
    storage.saveSelectedLocation(selectedTown);
  }, [selectedTown]);

  useEffect(() => {
    storage.saveBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    storage.saveSavedProviders(savedProviderIds);
  }, [savedProviderIds]);

  useEffect(() => {
    storage.saveNotifications(notifications);
  }, [notifications]);

  // Scroll to top on page change
  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (keyword: string, town: string) => {
    setSearchKeyword(keyword);
    setSelectedTown(town);
    storage.saveSelectedLocation(town);
    navigateTo('discover');
  };

  const handleSelectCategory = (catId: CategoryId | 'all') => {
    setSelectedCategory(catId);
    navigateTo('discover');
  };

  const handleOpenProviderDetail = (provider: Provider) => {
    setSelectedProvider(provider);
    navigateTo('provider-detail');
  };

  const handleStartBooking = (provider: Provider, service?: ServiceOffering) => {
    setBookingTargetProvider(provider);
    setBookingInitialService(service);
    setIsBookingModalOpen(true);
  };

  // Notification helper
  const addNotification = (
    title: string,
    message: string,
    recipientRole: 'customer' | 'provider',
    type: AppNotification['type'],
    bookingId?: string
  ) => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title,
      message,
      time: 'Just now',
      read: false,
      recipientRole,
      type,
      bookingId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    // Create notifications for both customer & provider
    addNotification(
      'Service Request Submitted',
      `Your booking request #${newBooking.id.slice(-4)} for ${newBooking.serviceTitle || 'Service'} has been sent to ${newBooking.providerName}.`,
      'customer',
      'provider_responded',
      newBooking.id
    );
    addNotification(
      'New Job Request Received',
      `New request from ${newBooking.customerName || 'Resident'} in ${newBooking.town || selectedTown} for ${newBooking.serviceTitle || 'Service'}.`,
      'provider',
      'new_request',
      newBooking.id
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
    addNotification(
      'Booking Cancelled',
      `Service request #${bookingId.slice(-4)} was marked as cancelled.`,
      'customer',
      'request_cancelled',
      bookingId
    );
  };

  const handleAcceptBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'accepted' } : b))
    );
    const target = bookings.find((b) => b.id === bookingId);
    addNotification(
      'Request Accepted! 🎉',
      `${target?.providerName || 'The technician'} has accepted your booking #${bookingId.slice(-4)}. They will contact you shortly.`,
      'customer',
      'request_accepted',
      bookingId
    );
  };

  const handleDeclineBooking = (bookingId: string, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'declined',
              declineReason: reason || 'Technician unavailable for this time slot.',
            }
          : b
      )
    );
    addNotification(
      'Request Declined',
      `Technician was unable to take request #${bookingId.slice(-4)}: "${reason || 'Schedule conflict'}". You can explore other pros in ${selectedTown}.`,
      'customer',
      'request_declined',
      bookingId
    );
  };

  const handleUpdateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    const label =
      status === 'in_progress'
        ? 'Technician is on the way 🛵'
        : status === 'completed'
        ? 'Job marked completed ✅'
        : `Status updated to ${status}`;
    addNotification(
      label,
      `Your service request #${bookingId.slice(-4)} is now: ${status.replace('_', ' ').toUpperCase()}.`,
      'customer',
      status === 'completed' ? 'request_completed' : 'provider_responded',
      bookingId
    );
  };

  const handleAddReview = (bookingId: string, rating: number, comment: string) => {
    let targetBooking: Booking | undefined;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          targetBooking = {
            ...b,
            userRating: rating,
            userReviewComment: comment,
          };
          return targetBooking;
        }
        return b;
      })
    );

    const b = targetBooking || bookings.find((item) => item.id === bookingId);
    if (b) {
      setProviders((prev) =>
        prev.map((p) => {
          if (p.id === b.providerId || p.name === b.providerName) {
            const newRev = {
              id: `rev-${Date.now()}`,
              userName: b.customerName || user.name || 'Verified Customer',
              userTown: b.town || selectedTown,
              rating: rating,
              date: 'Just now',
              comment: comment,
            };
            const updatedReviews = [newRev, ...(p.reviews || [])];
            const newAvg =
              updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
              updatedReviews.length;
            return {
              ...p,
              reviews: updatedReviews,
              reviewCount: (p.reviewCount || 0) + 1,
              rating: Math.round(newAvg * 10) / 10,
            };
          }
          return p;
        })
      );

      addNotification(
        'New Customer Review Received ⭐',
        `${b.customerName || 'Customer'} left a ${rating}-star review: "${comment}"`,
        'provider',
        'request_completed',
        bookingId
      );
    }
  };

  const handleToggleSave = (providerId: string) => {
    setSavedProviderIds((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleRegisterNewProvider = (newPro: Provider) => {
    setProviders((prev) => [newPro, ...prev]);
    setSelectedProvider(newPro);
    // Switch to provider role
    setUser({
      id: 'usr-' + newPro.id,
      name: newPro.name,
      role: 'provider',
      location: newPro.town,
      phone: newPro.phone,
      email: newPro.email || `${newPro.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      providerProfileId: newPro.id,
    });
    navigateTo('provider-dashboard');
  };

  const handleUpdateProviderProfile = (updated: Partial<Provider>) => {
    setProviders((prev) =>
      prev.map((p, idx) => (idx === 0 ? { ...p, ...updated } : p))
    );
  };

  const handleLogin = (userProfile: UserProfile) => {
    setUser(userProfile);
    if (userProfile.location) {
      setSelectedTown(userProfile.location);
    }
    if (userProfile.role === 'provider') {
      navigateTo('provider-dashboard');
    }
  };

  const handleLogout = () => {
    const defaultUser: UserProfile = {
      id: 'usr-guest-' + Date.now(),
      name: 'Guest Resident',
      role: 'customer',
      location: selectedTown,
      phone: '',
      email: '',
    };
    setUser(defaultUser);
    navigateTo('home');
  };

  const handleSwitchRole = () => {
    const nextRole = user.role === 'customer' ? 'provider' : 'customer';
    const nextUser =
      nextRole === 'provider' ? DEFAULT_PROVIDER_USER : DEFAULT_CUSTOMER_USER;
    setUser(nextUser);
    if (nextRole === 'provider') {
      navigateTo('provider-dashboard');
    } else {
      navigateTo('home');
    }
  };

  // Keyboard shortcut for ⌘K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const savedProvidersList = providers.filter((p) => savedProviderIds.includes(p.id));
  const unreadNotifsCount = notifications.filter(
    (n) => n.recipientRole === user.role && !n.read
  ).length;

  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#29242A] flex flex-col font-sans selection:bg-[#F4B8A4]/40 selection:text-[#493548]">
      
      {/* Top Sticky Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={navigateTo}
        selectedTown={selectedTown}
        setSelectedTown={(town) => {
          setSelectedTown(town);
          storage.saveSelectedLocation(town);
        }}
        bookingsCount={bookings.filter((b) => b.status === 'pending' || b.status === 'accepted' || b.status === 'in_progress').length}
        savedCount={savedProviderIds.length}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        unreadNotificationsCount={unreadNotifsCount}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            <HeroSection
              onSearch={handleHeroSearch}
              onSelectCategory={(catId) => handleSelectCategory(catId as any)}
              selectedTown={selectedTown}
              setSelectedTown={(town) => {
                setSelectedTown(town);
                storage.saveSelectedLocation(town);
              }}
              onOpenAssistant={() => {
                const el = document.getElementById('conversational-assistant-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            <CategoryGrid
              onSelectCategory={handleSelectCategory}
              selectedCategory={selectedCategory !== 'all' ? selectedCategory : undefined}
            />

            <FeaturedPros
              providers={providers}
              onSelectProvider={handleOpenProviderDetail}
              onBookProvider={handleStartBooking}
              onViewAll={() => navigateTo('discover')}
              onToggleSave={handleToggleSave}
              savedIds={savedProviderIds}
              selectedTown={selectedTown}
            />

            <div id="conversational-assistant-section">
              <ConversationalHelper
                providers={providers}
                selectedTown={selectedTown}
                onSelectProvider={handleOpenProviderDetail}
                onBookProvider={handleStartBooking}
              />
            </div>

            <FeaturedSpotlight
              provider={providers[0]}
              onSelectProvider={handleOpenProviderDetail}
              onBookProvider={handleStartBooking}
            />

            <CommunityMap
              selectedTown={selectedTown}
              onSelectTown={(town) => {
                setSelectedTown(town);
                storage.saveSelectedLocation(town);
              }}
              onExploreTown={() => navigateTo('discover')}
            />

            <HowItWorks onStartExploring={() => navigateTo('discover')} />

            <TrustCommunity />
          </>
        )}

        {activePage === 'discover' && (
          <DiscoveryPage
            providers={providers}
            onSelectProvider={handleOpenProviderDetail}
            onBookProvider={handleStartBooking}
            initialCategory={selectedCategory}
            initialTown={selectedTown}
            initialKeyword={searchKeyword}
            onToggleSave={handleToggleSave}
            savedIds={savedProviderIds}
          />
        )}

        {activePage === 'provider-detail' && selectedProvider && (
          <ProviderDetailPage
            provider={selectedProvider}
            onBack={() => navigateTo('discover')}
            onBookService={handleStartBooking}
            onToggleSave={handleToggleSave}
            isSaved={savedProviderIds.includes(selectedProvider.id)}
          />
        )}

        {activePage === 'my-bookings' && (
          <UserDashboard
            bookings={bookings}
            savedProviders={savedProvidersList}
            allProviders={providers}
            selectedTown={selectedTown}
            onSelectProvider={handleOpenProviderDetail}
            onBookProvider={handleStartBooking}
            onExploreCategory={handleSelectCategory}
            onCancelBooking={handleCancelBooking}
            onStartSearch={() => setIsSearchModalOpen(true)}
            onAddReview={handleAddReview}
            onToggleSave={handleToggleSave}
          />
        )}

        {activePage === 'saved-pros' && (
          <UserDashboard
            bookings={bookings}
            savedProviders={savedProvidersList}
            allProviders={providers}
            selectedTown={selectedTown}
            onSelectProvider={handleOpenProviderDetail}
            onBookProvider={handleStartBooking}
            onExploreCategory={handleSelectCategory}
            onCancelBooking={handleCancelBooking}
            onStartSearch={() => setIsSearchModalOpen(true)}
            onAddReview={handleAddReview}
            onToggleSave={handleToggleSave}
          />
        )}

        {activePage === 'provider-dashboard' && (
          <ProviderDashboard
            currentProvider={providers[0]}
            bookings={bookings}
            onUpdateProviderProfile={handleUpdateProviderProfile}
            onAcceptBooking={handleAcceptBooking}
            onDeclineBooking={handleDeclineBooking}
            onUpdateBookingStatus={handleUpdateBookingStatus}
          />
        )}

        {activePage === 'how-it-works' && (
          <div className="pt-4">
            <HowItWorks onStartExploring={() => navigateTo('discover')} />
            <TrustCommunity />
          </div>
        )}
      </main>

      {/* Global Footer with Join as Provider button */}
      <Footer
        setActivePage={navigateTo}
        onSelectCategory={handleSelectCategory}
        setSelectedTown={(town) => {
          setSelectedTown(town);
          storage.saveSelectedLocation(town);
        }}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectProvider={(pro) => {
          handleOpenProviderDetail(pro);
        }}
        onSelectCategory={(catId) => {
          handleSelectCategory(catId);
        }}
        selectedTown={selectedTown}
      />

      {/* Frictionless 3-Field Booking Modal */}
      {isBookingModalOpen && bookingTargetProvider && (
        <BookingFlowModal
          provider={bookingTargetProvider}
          initialService={bookingInitialService}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirmBooking={handleAddBooking}
          selectedTown={selectedTown}
          onOpenMyBookings={() => navigateTo('my-bookings')}
        />
      )}

      {/* Provider Quick Registration Modal */}
      <RegisterProviderModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegisterNewProvider}
      />

      {/* Authentication & Role Selection Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onLogin={handleLogin}
      />

      {/* Dedicated Location Setup Modal */}
      <LocationSetupModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedTown={selectedTown}
        onSelectTown={(town) => {
          setSelectedTown(town);
          storage.saveSelectedLocation(town);
        }}
      />

      {/* Live Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        userRole={user.role}
        onMarkAllRead={() => {
          setNotifications((prev) =>
            prev.map((n) =>
              n.recipientRole === user.role ? { ...n, read: true } : n
            )
          );
        }}
        onClearAll={() => {
          setNotifications((prev) =>
            prev.filter((n) => n.recipientRole !== user.role)
          );
        }}
        onSelectNotification={(notif) => {
          if (notif.bookingId) {
            if (user.role === 'provider') {
              navigateTo('provider-dashboard');
            } else {
              navigateTo('my-bookings');
            }
          }
          setIsNotificationDrawerOpen(false);
        }}
      />

    </div>
  );
}
