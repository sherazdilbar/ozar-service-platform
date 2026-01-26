import {
  User,
  ProProfile,
  Service,
  PortfolioItem,
  Review,
  Booking,
  BookingEvent,
  Conversation,
  Message,
  AvailabilitySlot,
  ProDashboard,
  UserRole,
  ServiceCategory,
  PricingModel,
  VerificationStatus,
  AvailabilityStatus,
  BookingStatus
} from './types';
import { DEFAULT_CURRENCY } from './constants';

// Mock Users
export const mockCustomers: User[] = [
  {
    id: 'cust_001',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    firstName: 'Ahmed',
    lastName: 'Al-Rashid',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: UserRole.CUSTOMER,
    createdAt: '2024-01-15T10:00:00Z',
    location: {
      city: 'Karachi',
      area: 'Saddar',
      lat: 24.8607,
      lng: 67.0011
    }
  },
  {
    id: 'cust_002',
    email: 'fatima@example.com',
    phone: '+966507654321',
    firstName: 'Fatima',
    lastName: 'Hassan',
    avatar: 'https://i.pravatar.cc/150?img=45',
    role: UserRole.CUSTOMER,
    createdAt: '2024-02-20T14:30:00Z',
    location: {
      city: 'Karachi',
      area: 'DHA',
      lat: 24.8256,
      lng: 67.0603
    }
  }
];

// Mock Pro Users
const mockProUsers: User[] = [
  {
    id: 'user_pro_001',
    email: 'mohammed.electrician@example.com',
    phone: '+966501111111',
    firstName: 'Mohammed',
    lastName: 'Al-Zahrani',
    avatar: 'https://i.pravatar.cc/150?img=33',
    role: UserRole.PRO,
    createdAt: '2023-06-10T08:00:00Z'
  },
  {
    id: 'user_pro_002',
    email: 'khalid.plumber@example.com',
    phone: '+966502222222',
    firstName: 'Khalid',
    lastName: 'Al-Otaibi',
    avatar: 'https://i.pravatar.cc/150?img=51',
    role: UserRole.PRO,
    createdAt: '2023-05-15T09:00:00Z'
  },
  {
    id: 'user_pro_003',
    email: 'abdullah.locksmith@example.com',
    phone: '+966503333333',
    firstName: 'Abdullah',
    lastName: 'Al-Mutairi',
    avatar: 'https://i.pravatar.cc/150?img=14',
    role: UserRole.PRO,
    createdAt: '2023-07-20T10:00:00Z'
  },
  {
    id: 'user_pro_004',
    email: 'omar.ac@example.com',
    phone: '+966504444444',
    firstName: 'Omar',
    lastName: 'Al-Ghamdi',
    avatar: 'https://i.pravatar.cc/150?img=68',
    role: UserRole.PRO,
    createdAt: '2023-04-05T11:00:00Z'
  },
  {
    id: 'user_pro_005',
    email: 'faisal.carpenter@example.com',
    phone: '+966505555555',
    firstName: 'Faisal',
    lastName: 'Al-Harbi',
    avatar: 'https://i.pravatar.cc/150?img=15',
    role: UserRole.PRO,
    createdAt: '2023-08-12T09:00:00Z'
  },
  {
    id: 'user_pro_006',
    email: 'salem.painter@example.com',
    phone: '+966506666666',
    firstName: 'Salem',
    lastName: 'Al-Qahtani',
    avatar: 'https://i.pravatar.cc/150?img=52',
    role: UserRole.PRO,
    createdAt: '2023-03-20T10:00:00Z'
  },
  {
    id: 'user_pro_007',
    email: 'tariq.gas@example.com',
    phone: '+966507777777',
    firstName: 'Tariq',
    lastName: 'Al-Shammari',
    avatar: 'https://i.pravatar.cc/150?img=60',
    role: UserRole.PRO,
    createdAt: '2023-09-05T11:00:00Z'
  },
  {
    id: 'user_pro_008',
    email: 'youssef.cleaner@example.com',
    phone: '+966508888888',
    firstName: 'Youssef',
    lastName: 'Al-Dosari',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: UserRole.PRO,
    createdAt: '2023-02-14T08:00:00Z'
  }
];

// Mock Services
const mockServices: Service[] = [
  {
    id: 'svc_001',
    name: 'Electrical Inspection',
    description: 'Complete home electrical system inspection',
    category: ServiceCategory.ELECTRICIAN,
    pricingModel: PricingModel.FIXED,
    price: 200,
    duration: 60,
    currency: DEFAULT_CURRENCY
  },
  {
    id: 'svc_002',
    name: 'Outlet Installation',
    description: 'Install new electrical outlets',
    category: ServiceCategory.ELECTRICIAN,
    pricingModel: PricingModel.FIXED,
    price: 150,
    duration: 45,
    currency: DEFAULT_CURRENCY
  },
  {
    id: 'svc_003',
    name: 'Pipe Repair',
    description: 'Fix leaking or broken pipes',
    category: ServiceCategory.PLUMBER,
    pricingModel: PricingModel.HOURLY,
    price: 120,
    duration: 60,
    currency: DEFAULT_CURRENCY
  },
  {
    id: 'svc_004',
    name: 'Emergency Lockout',
    description: '24/7 emergency lockout service',
    category: ServiceCategory.LOCKSMITH,
    pricingModel: PricingModel.FIXED,
    price: 180,
    duration: 30,
    currency: DEFAULT_CURRENCY
  },
  {
    id: 'svc_005',
    name: 'AC Maintenance',
    description: 'Regular AC unit maintenance and cleaning',
    category: ServiceCategory.AC_TECHNICIAN,
    pricingModel: PricingModel.FIXED,
    price: 250,
    duration: 90,
    currency: DEFAULT_CURRENCY
  }
];

// Mock Portfolio Items
const mockPortfolio: PortfolioItem[] = [
  {
    id: 'port_001',
    proId: 'pro_001',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
    title: 'Complete Home Rewiring',
    description: 'Full electrical system upgrade for 3-bedroom villa',
    category: ServiceCategory.ELECTRICIAN,
    createdAt: '2024-03-10T12:00:00Z'
  },
  {
    id: 'port_002',
    proId: 'pro_001',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
    title: 'Smart Home Installation',
    description: 'Installed smart lighting and automation system',
    category: ServiceCategory.ELECTRICIAN,
    createdAt: '2024-02-15T14:00:00Z'
  },
  {
    id: 'port_003',
    proId: 'pro_002',
    imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400',
    title: 'Bathroom Renovation',
    description: 'Complete plumbing work for luxury bathroom',
    category: ServiceCategory.PLUMBER,
    createdAt: '2024-01-20T10:00:00Z'
  }
];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: 'rev_001',
    bookingId: 'book_001',
    proId: 'pro_001',
    customerId: 'cust_001',
    customerName: 'Ahmed Al-Rashid',
    customerAvatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    comment: 'Excellent work! Very professional and arrived on time. Fixed the issue quickly.',
    createdAt: '2024-11-15T16:00:00Z',
    response: {
      text: 'Thank you for your kind words! Happy to help.',
      createdAt: '2024-11-15T18:00:00Z'
    }
  },
  {
    id: 'rev_002',
    bookingId: 'book_002',
    proId: 'pro_001',
    customerId: 'cust_002',
    customerName: 'Fatima Hassan',
    customerAvatar: 'https://i.pravatar.cc/150?img=45',
    rating: 5,
    comment: 'Highly recommend! Great service and fair pricing.',
    createdAt: '2024-11-10T14:30:00Z'
  },
  {
    id: 'rev_003',
    bookingId: 'book_003',
    proId: 'pro_002',
    customerId: 'cust_001',
    customerName: 'Ahmed Al-Rashid',
    customerAvatar: 'https://i.pravatar.cc/150?img=12',
    rating: 4,
    comment: 'Good service, but took a bit longer than expected.',
    createdAt: '2024-11-05T11:00:00Z'
  }
];

// Mock Pro Profiles
export const mockProProfiles: ProProfile[] = [
  {
    id: 'pro_001',
    userId: 'user_pro_001',
    user: mockProUsers[0],
    businessName: 'Al-Zahrani Electrical Services',
    bio: 'Licensed electrician with 8 years of experience. Specialized in residential and commercial electrical work. Available for emergency calls.',
    categories: [ServiceCategory.ELECTRICIAN],
    services: [mockServices[0], mockServices[1]],
    portfolio: [mockPortfolio[0], mockPortfolio[1]],
    rating: 4.9,
    reviewCount: 127,
    jobsCompleted: 342,
    yearsExperience: 8,
    verificationStatus: VerificationStatus.APPROVED,
    availabilityStatus: AvailabilityStatus.AVAILABLE_NOW,
    serviceArea: {
      city: 'Karachi',
      radiusKm: 15
    },
    location: {
      city: 'Karachi',
      area: 'Clifton',
      lat: 24.8138,
      lng: 67.0299
    },
    startingPrice: 150,
    currency: DEFAULT_CURRENCY,
    responseTime: 15,
    createdAt: '2023-06-10T08:00:00Z'
  },
  {
    id: 'pro_002',
    userId: 'user_pro_002',
    user: mockProUsers[1],
    businessName: 'Khalid Plumbing Solutions',
    bio: 'Expert plumber serving Karachi for 10+ years. Fast, reliable, and affordable service for all your plumbing needs.',
    categories: [ServiceCategory.PLUMBER],
    services: [mockServices[2]],
    portfolio: [mockPortfolio[2]],
    rating: 4.7,
    reviewCount: 89,
    jobsCompleted: 256,
    yearsExperience: 10,
    verificationStatus: VerificationStatus.APPROVED,
    availabilityStatus: AvailabilityStatus.AVAILABLE_SOON,
    serviceArea: {
      city: 'Karachi',
      radiusKm: 20
    },
    location: {
      city: 'Karachi',
      area: 'DHA',
      lat: 24.8256,
      lng: 67.0603
    },
    startingPrice: 120,
    currency: DEFAULT_CURRENCY,
    responseTime: 30,
    createdAt: '2023-05-15T09:00:00Z'
  },
  {
    id: 'pro_003',
    userId: 'user_pro_003',
    user: mockProUsers[2],
    businessName: '24/7 Locksmith Services',
    bio: 'Emergency locksmith available 24/7. Car, home, and office lockout services. Fast response time guaranteed.',
    categories: [ServiceCategory.LOCKSMITH],
    services: [mockServices[3]],
    portfolio: [],
    rating: 4.8,
    reviewCount: 156,
    jobsCompleted: 412,
    yearsExperience: 6,
    verificationStatus: VerificationStatus.APPROVED,
    availabilityStatus: AvailabilityStatus.AVAILABLE_NOW,
    serviceArea: {
      city: 'Karachi',
      radiusKm: 25
    },
    location: {
      city: 'Karachi',
      area: 'Gulshan',
      lat: 24.9207,
      lng: 67.0822
    },
    startingPrice: 180,
    currency: DEFAULT_CURRENCY,
    responseTime: 20,
    createdAt: '2023-07-20T10:00:00Z'
  },
  {
    id: 'pro_004',
    userId: 'user_pro_004',
    user: mockProUsers[3],
    businessName: 'Cool Air AC Services',
    bio: 'Professional AC technician with expertise in all major brands. Installation, maintenance, and repair services.',
    categories: [ServiceCategory.AC_TECHNICIAN],
    services: [mockServices[4]],
    portfolio: [],
    rating: 4.6,
    reviewCount: 73,
    jobsCompleted: 198,
    yearsExperience: 7,
    verificationStatus: VerificationStatus.APPROVED,
    availabilityStatus: AvailabilityStatus.BUSY,
    serviceArea: {
      city: 'Karachi',
      radiusKm: 18
    },
    location: {
      city: 'Karachi',
      area: 'North Nazimabad',
      lat: 24.9300,
      lng: 67.0400
    },
    startingPrice: 250,
    currency: DEFAULT_CURRENCY,
    responseTime: 45,
    createdAt: '2023-04-05T11:00:00Z'
  },
  {
    id: 'pro_005',
    userId: 'user_pro_005',
    user: mockProUsers[4],
    businessName: 'Master Carpentry Works',
    bio: 'Skilled carpenter specializing in custom furniture, kitchen cabinets, and home renovations. Quality craftsmanship guaranteed.',
    categories: [ServiceCategory.CARPENTER],
    services: [],
    portfolio: [],
    rating: 4.9,
    reviewCount: 94,
    jobsCompleted: 287,
    yearsExperience: 12,
    verificationStatus: VerificationStatus.APPROVED,
    availabilityStatus: AvailabilityStatus.AVAILABLE_NOW,
    serviceArea: {
      city: 'Karachi',
      radiusKm: 15
    },
    location: {
      city: 'Karachi',
      area: 'Korangi',
      lat: 24.8300,
      lng: 67.1100
    },
    startingPrice: 200,
    currency: DEFAULT_CURRENCY,
    responseTime: 25,
    createdAt: '2023-08-12T09:00:00Z'
  },
  {
    id: 'pro_006',
    userId: 'user_pro_006',
    user: mockProUsers[5],
    businessName: 'Perfect Paint Solutions',
    bio: 'Professional painting services for residential and commercial properties. Interior and exterior painting with premium quality materials.',
    categories: [ServiceCategory.PAINTER],
    services: [],
    portfolio: [],
    rating: 4.7,
    reviewCount: 112,
    jobsCompleted: 324,
    yearsExperience: 9,
    verificationStatus: VerificationStatus.APPROVED,
    availabilityStatus: AvailabilityStatus.AVAILABLE_SOON,
    serviceArea: {
      city: 'Karachi',
      radiusKm: 20
    },
    location: {
      city: 'Karachi',
      area: 'Malir',
      lat: 24.8900,
      lng: 67.2000
    },
    startingPrice: 180,
    currency: DEFAULT_CURRENCY,
    responseTime: 35,
    createdAt: '2023-03-20T10:00:00Z'
  },
  {
    id: 'pro_007',
    userId: 'user_pro_007',
    user: mockProUsers[6],
    businessName: 'Safe Gas Services',
    bio: 'Certified gas heater technician. Installation, repair, and maintenance of all gas heating systems. Safety is our priority.',
    categories: [ServiceCategory.GAS_HEATER],
    services: [],
    portfolio: [],
    rating: 4.8,
    reviewCount: 67,
    jobsCompleted: 189,
    yearsExperience: 8,
    verificationStatus: VerificationStatus.APPROVED,
    availabilityStatus: AvailabilityStatus.AVAILABLE_NOW,
    serviceArea: {
      city: 'Karachi',
      radiusKm: 22
    },
    location: {
      city: 'Karachi',
      area: 'Landhi',
      lat: 24.8500,
      lng: 67.2200
    },
    startingPrice: 220,
    currency: DEFAULT_CURRENCY,
    responseTime: 18,
    createdAt: '2023-09-05T11:00:00Z'
  },
  {
    id: 'pro_008',
    userId: 'user_pro_008',
    user: mockProUsers[7],
    businessName: 'Sparkle Clean Services',
    bio: 'Professional cleaning services for homes and offices. Deep cleaning, regular maintenance, and move-in/out cleaning available.',
    categories: [ServiceCategory.CLEANER],
    services: [],
    portfolio: [],
    rating: 4.9,
    reviewCount: 203,
    jobsCompleted: 567,
    yearsExperience: 5,
    verificationStatus: VerificationStatus.APPROVED,
    availabilityStatus: AvailabilityStatus.AVAILABLE_NOW,
    serviceArea: {
      city: 'Karachi',
      radiusKm: 25
    },
    location: {
      city: 'Karachi',
      area: 'Bahria Town',
      lat: 24.9000,
      lng: 67.1800
    },
    startingPrice: 150,
    currency: DEFAULT_CURRENCY,
    responseTime: 12,
    createdAt: '2023-02-14T08:00:00Z'
  }
];

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: 'book_001',
    customerId: 'cust_001',
    proId: 'pro_001',
    serviceId: 'svc_001',
    status: BookingStatus.COMPLETED,
    service: mockServices[0],
    pro: mockProProfiles[0],
    customer: mockCustomers[0],
    scheduledFor: '2024-11-15T14:00:00Z',
    isASAP: false,
    description: 'Need electrical inspection for new apartment',
    images: [],
    location: {
      address: 'Apartment 5B, Sunset Boulevard, Clifton Block 5',
      city: 'Karachi',
      lat: 24.8138,
      lng: 67.0299
    },
    pricing: {
      servicePrice: 200,
      platformFee: 30,
      total: 230,
      currency: DEFAULT_CURRENCY
    },
    createdAt: '2024-11-14T10:00:00Z',
    updatedAt: '2024-11-15T15:30:00Z',
    completedAt: '2024-11-15T15:30:00Z'
  },
  {
    id: 'book_002',
    customerId: 'cust_001',
    proId: 'pro_003',
    serviceId: 'svc_004',
    status: BookingStatus.SCHEDULED,
    service: mockServices[3],
    pro: mockProProfiles[2],
    customer: mockCustomers[0],
    scheduledFor: '2024-12-26T10:00:00Z',
    isASAP: false,
    description: 'Need to install new locks on front door',
    images: [],
    location: {
      address: 'House 42, Street 7, Gulshan-e-Iqbal Block 13',
      city: 'Karachi',
      lat: 24.9207,
      lng: 67.0822
    },
    pricing: {
      servicePrice: 180,
      platformFee: 27,
      total: 207,
      currency: DEFAULT_CURRENCY
    },
    createdAt: '2024-12-20T09:00:00Z',
    updatedAt: '2024-12-20T09:30:00Z'
  }
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: 'msg_001',
    conversationId: 'conv_001',
    senderId: 'cust_001',
    text: 'Hi, I need an electrician for tomorrow',
    createdAt: '2024-12-23T10:00:00Z',
    read: true
  },
  {
    id: 'msg_002',
    conversationId: 'conv_001',
    senderId: 'user_pro_001',
    text: 'Hello! I can help you. What time works best?',
    createdAt: '2024-12-23T10:05:00Z',
    read: true
  },
  {
    id: 'msg_003',
    conversationId: 'conv_001',
    senderId: 'cust_001',
    text: 'Around 2 PM would be perfect',
    createdAt: '2024-12-23T10:07:00Z',
    read: true
  }
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv_001',
    customerId: 'cust_001',
    proId: 'pro_001',
    bookingId: 'book_001',
    lastMessage: mockMessages[2],
    unreadCount: 0,
    customer: mockCustomers[0],
    pro: mockProProfiles[0],
    createdAt: '2024-12-23T10:00:00Z',
    updatedAt: '2024-12-23T10:07:00Z'
  }
];

// Helper function to calculate distance (mock)
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  // Simple mock distance calculation
  const latDiff = Math.abs(lat1 - lat2);
  const lngDiff = Math.abs(lng1 - lng2);
  return Math.round((latDiff + lngDiff) * 100 * 10) / 10; // Mock km
}
