import { Provider, Booking, UserProfile, AppNotification } from '../types';
import { PROVIDERS, INITIAL_BOOKINGS } from '../data/mockData';

const STORAGE_KEYS = {
  USER: 'locallink_user_profile',
  PROVIDERS: 'locallink_providers',
  SAVED_IDS: 'locallink_saved_ids',
  BOOKINGS: 'locallink_bookings',
  NOTIFICATIONS: 'locallink_notifications',
  LOCATION: 'locallink_selected_location',
};

// Initial default user (Mehak - Customer in Suliali)
export const DEFAULT_CUSTOMER_USER: UserProfile = {
  id: 'usr-customer-1',
  name: 'Mehak Sharma',
  phone: '+91 98160 54321',
  email: 'mehak.suliali@gmail.com',
  role: 'customer',
  location: 'Suliali',
};

// Initial provider user (Rakesh Sharma - Master Electrician in Suliali)
export const DEFAULT_PROVIDER_USER: UserProfile = {
  id: 'usr-provider-p1',
  name: 'Rakesh Sharma',
  phone: '+91 98160 23456',
  email: 'rakesh.electricals@gmail.com',
  role: 'provider',
  location: 'Suliali',
  providerProfileId: 'p1',
};

// Initial realistic notifications
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    recipientRole: 'customer',
    title: '🟢 Request Accepted',
    message: 'Sunil Kumar (Plumber) accepted your request for Suliali. Expected visit: Today · Evening.',
    time: '15 mins ago',
    read: false,
    type: 'request_accepted',
    bookingId: 'bk-102',
  },
  {
    id: 'notif-2',
    recipientRole: 'customer',
    title: '🔔 Service Reminder',
    message: 'Amit Sharma (Car & Bike Mechanic) is scheduled for Suliali tomorrow at 10:00 AM.',
    time: '2 hours ago',
    read: true,
    type: 'service_reminder',
    bookingId: 'bk-103',
  },
  {
    id: 'notif-3',
    recipientRole: 'provider',
    title: '🔔 New Service Request',
    message: 'Mehak Sharma requested Ceiling Fan Repair in Suliali. Preferred time: Today · 5:00 PM.',
    time: '10 mins ago',
    read: false,
    type: 'new_request',
    bookingId: 'bk-101',
  },
];

export function getStoredUser(): UserProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_CUSTOMER_USER;
}

export function saveStoredUser(user: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch {}
}

export function getStoredProviders(): Provider[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROVIDERS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return PROVIDERS;
}

export function saveStoredProviders(providers: Provider[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
  } catch {}
}

export function getStoredSavedIds(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_IDS);
    if (saved) return JSON.parse(saved);
  } catch {}
  return ['p1', 'p4'];
}

export function saveStoredSavedIds(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify(ids));
  } catch {}
}

export function getStoredBookings(): Booking[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_BOOKINGS;
}

export function saveStoredBookings(bookings: Booking[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch {}
}

export function getStoredNotifications(): AppNotification[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return INITIAL_NOTIFICATIONS;
}

export function saveStoredNotifications(notifications: AppNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch {}
}

export function getStoredLocation(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCATION);
    if (saved) return saved;
  } catch {}
  return 'Suliali';
}

export function saveStoredLocation(location: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.LOCATION, location);
  } catch {}
}

export const storage = {
  getUser: getStoredUser,
  saveUser: saveStoredUser,
  getProviders: getStoredProviders,
  saveProviders: saveStoredProviders,
  getSavedProviders: getStoredSavedIds,
  saveSavedProviders: saveStoredSavedIds,
  getBookings: getStoredBookings,
  saveBookings: saveStoredBookings,
  getNotifications: getStoredNotifications,
  saveNotifications: saveStoredNotifications,
  getSelectedLocation: getStoredLocation,
  saveSelectedLocation: saveStoredLocation,
};

