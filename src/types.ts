export type CategoryId =
  // Home & Repair
  | 'electrician'
  | 'plumber'
  | 'carpenter'
  | 'painter'
  | 'mason'
  | 'repair' // AC / Cooler / Appliance Repair
  // Vehicles
  | 'mechanic'
  | 'bike_repair'
  | 'car_repair'
  | 'puncture'
  // Education
  | 'tutor'
  | 'computer_tutor'
  // Personal Services
  | 'barber'
  | 'beautician'
  | 'tailor'
  // Technology
  | 'mobile_repair'
  | 'laptop_repair'
  | 'internet_help'
  // Other
  | 'photographer'
  | 'cleaner'
  | 'cook'
  | 'other';

export type CategoryGroup =
  | 'Home & Repair'
  | 'Vehicles'
  | 'Education'
  | 'Personal Services'
  | 'Technology'
  | 'Other';

export interface ServiceCategory {
  id: CategoryId;
  name: string;
  emoji: string;
  iconName: string;
  group: CategoryGroup;
  description: string;
  popularServices: string[];
  providerCount: number;
  bgTint: 'peach' | 'sage' | 'lavender' | 'yellow';
}

export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  categoryTag: string;
  description?: string;
}

export interface ReviewItem {
  id: string;
  userName: string;
  userAvatar?: string;
  userTown: string;
  rating: number;
  date: string;
  comment: string;
  serviceTag?: string;
  helpfulCount?: number;
}

export interface ServiceOffering {
  id: string;
  title: string;
  price: number;
  priceType: 'hourly' | 'fixed' | 'starting_at';
  duration: string;
  description: string;
  includedItems?: string[];
}

export interface Provider {
  id: string;
  name: string;
  businessName?: string;
  avatar: string;
  coverImage?: string;
  title: string;
  category: CategoryId;
  rating: number;
  reviewCount: number;
  startingRate: number;
  rateUnit: 'visit' | 'hr' | 'job' | 'service';
  distanceKm: number;
  town: string;
  neighborhood: string;
  servesAreas: string[];
  bio: string;
  shortBio: string;
  skills: string[];
  isVerified: boolean;
  isTopRated: boolean;
  isAvailableToday: boolean;
  isQuickResponder: boolean;
  yearsExperience: number;
  completedJobs: number;
  responseTime: string;
  availabilityNext: string;
  languages: string[];
  phone: string;
  email?: string;
  badges: string[];
  services: ServiceOffering[];
  portfolio: PortfolioItem[];
  reviews: ReviewItem[];
}

export type BookingStatus =
  | 'pending'      // 🟡 Waiting for response
  | 'accepted'     // 🟢 Provider accepted
  | 'in_progress'  // 🔵 Service in progress
  | 'completed'    // ✓ Completed
  | 'declined'     // 🔴 Request declined
  | 'cancelled';

export interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerTitle: string;
  providerPhone: string;
  providerTown: string;
  providerCategory?: CategoryId;
  serviceTitle: string;
  date: string; // e.g. "Today", "Tomorrow", "2026-08-25"
  timeSlot?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  town: string;
  problemDescription: string;
  status: BookingStatus;
  estimatedPrice?: number;
  createdAt: string;
  declineReason?: string;
  userRating?: number;
  userReviewComment?: string;
}

export type UserRole = 'customer' | 'provider';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  location: string;
  providerProfileId?: string;
}

export interface AppNotification {
  id: string;
  recipientRole: UserRole;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type:
    | 'request_accepted'
    | 'provider_responded'
    | 'service_reminder'
    | 'request_completed'
    | 'new_request'
    | 'request_cancelled'
    | 'new_review'
    | 'request_declined';
  bookingId?: string;
  providerId?: string;
}

export interface FilterState {
  category: CategoryId | 'all';
  town: string;
  maxDistance: number;
  maxPrice: number;
  minRating: number;
  verifiedOnly: boolean;
  availableTodayOnly: boolean;
  searchKeyword: string;
  sortBy: 'recommended' | 'rating' | 'distance' | 'price-low' | 'jobs';
}

export type ActivePage =
  | 'home'
  | 'discover'
  | 'provider-detail'
  | 'my-requests'
  | 'my-bookings'
  | 'saved-pros'
  | 'provider-dashboard'
  | 'register-provider'
  | 'how-it-works'
  | 'profile';
