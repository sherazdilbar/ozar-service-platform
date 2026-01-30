'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Booking, getBookings, respondToBooking, BookingStatus } from '@ozar/shared';
import { prosApi } from '@ozar/shared/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Settings, 
  Briefcase,
  Users,
  Star,
  ArrowRight,
  Bell,
  Award,
  Zap,
  Target,
  Camera
} from 'lucide-react';

export default function ProDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/pro/dashboard');
      return;
    }
    
    if (user.role !== 'PRO') {
      router.push('/');
      return;
    }
    
    checkOnboardingStatus();
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      const status = await prosApi.getOnboardingStatus();
      if (!status.completed) {
        router.push('/pro/onboarding');
        return;
      }
      
      // Check verification/approval status
      const profile = await prosApi.getMyProfile();
      if (profile.verificationStatus === 'PENDING') {
        router.push('/pro/pending');
        return;
      }
      
      setCheckingOnboarding(false);
      loadBookings();
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      setCheckingOnboarding(false);
      loadBookings();
    }
  };

  const loadBookings = async () => {
    if (!user) return;
    
    try {
      const data = await getBookings(user.id, 'pro');
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (bookingId: string, action: 'accept' | 'decline') => {
    // Prevent double-clicks
    if (responding) return;
    
    setResponding(bookingId);
    try {
      // Find the booking to check its current status
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // Validate status before attempting transition
      if (action === 'accept' && booking.status !== BookingStatus.REQUESTED) {
        alert(`Cannot accept booking. Current status: ${booking.status}`);
        return;
      }
      
      if (action === 'decline' && booking.status !== BookingStatus.REQUESTED) {
        alert(`Cannot decline booking. Current status: ${booking.status}`);
        return;
      }
      
      await respondToBooking(bookingId, action);
      await loadBookings();
    } catch (error: any) {
      console.error('Failed to respond to booking:', error);
      alert(error.message || 'Failed to respond to booking. Please try again.');
    } finally {
      setResponding(null);
    }
  };

  if (!user || user.role !== 'PRO' || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600" />
      </div>
    );
  }

  const pendingRequests = bookings.filter(b => b.status === BookingStatus.REQUESTED);
  const todaySchedule = bookings.filter(b => 
    [BookingStatus.ACCEPTED, BookingStatus.SCHEDULED, BookingStatus.IN_PROGRESS].includes(b.status)
  );
  const completedToday = bookings.filter(b => 
    b.status === BookingStatus.COMPLETED && 
    new Date(b.completedAt!).toDateString() === new Date().toDateString()
  ).length;

  const totalEarnings = bookings
    .filter(b => b.status === BookingStatus.COMPLETED)
    .reduce((sum, b) => sum + b.pricing.servicePrice, 0);

  const todayEarnings = bookings
    .filter(b => 
      b.status === BookingStatus.COMPLETED && 
      new Date(b.completedAt!).toDateString() === new Date().toDateString()
    )
    .reduce((sum, b) => sum + b.pricing.servicePrice, 0);

  const currency = bookings.find(b => b.status === BookingStatus.COMPLETED)?.pricing.currency || 'HUF';

  const avgResponseTime = 12; // Mock data - calculate from actual data
  const completionRate = bookings.length > 0 
    ? Math.round((bookings.filter(b => b.status === BookingStatus.COMPLETED).length / bookings.length) * 100)
    : 0;

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <span>{t('proDashboard.welcomeBack')}, {user.firstName}!</span>
            <span className="text-4xl">👋</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('proDashboard.businessToday')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Earnings */}
          <div className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span>{t('proDashboard.today')}</span>
                </div>
              </div>
              <div className="text-4xl font-bold mb-1">{currency} {todayEarnings}</div>
              <div className="text-teal-100 text-sm font-medium">{t('proDashboard.todayEarnings')}</div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-teal-100">{t('proDashboard.total')}: {currency} {totalEarnings}</span>
                  <span className="font-semibold">+{completedToday} {t('proDashboard.jobs')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:border-orange-500 dark:hover:border-orange-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1.5 rounded-full">
                {t('proDashboard.active')}
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{todaySchedule.length}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-4">{t('proDashboard.activeBookings')}</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((todaySchedule.length / 10) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {todaySchedule.length}/10
              </span>
            </div>
          </div>

          {/* Completed Today */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:border-green-500 dark:hover:border-green-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              {completedToday > 0 && (
                <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full animate-pulse">
                  +{completedToday}
                </span>
              )}
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{completedToday}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-4">{t('proDashboard.completedToday')}</div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{t('proDashboard.greatWork')}</span>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:border-yellow-500 dark:hover:border-yellow-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                {t('proDashboard.allTime')}
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{currency} {totalEarnings}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-4">{t('proDashboard.totalEarnings')}</div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-600 dark:text-gray-400">
                {bookings.filter(b => b.status === BookingStatus.COMPLETED).length} {t('proDashboard.jobsCompleted')}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/pro/services"
            className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">{t('proDashboard.manageServices')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('proDashboard.addEditServices')}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            href="/pro/profile"
            className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">{t('proDashboard.editProfile')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('proDashboard.updateInfo')}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            href="/chat"
            className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800 hover:border-green-500 dark:hover:border-green-500 transition-all hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">{t('proDashboard.messages')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('proDashboard.chatWithCustomers')}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-green-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            href="/pro/analytics"
            className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">View insights & stats</p>
              </div>
              <ArrowRight className="w-5 h-5 text-orange-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            href="/pro/portfolio"
            className="group relative overflow-hidden bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-2xl p-6 border-2 border-pink-200 dark:border-pink-800 hover:border-pink-500 dark:hover:border-pink-500 transition-all hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">Portfolio</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Showcase your work</p>
              </div>
              <ArrowRight className="w-5 h-5 text-pink-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            href="/pro/availability"
            className="group relative overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-2xl p-6 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">Availability</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Set working hours</p>
              </div>
              <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            href="/pro/reviews"
            className="group relative overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl p-6 border-2 border-yellow-200 dark:border-yellow-800 hover:border-yellow-500 dark:hover:border-yellow-500 transition-all hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Star className="w-7 h-7 text-white fill-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">Reviews</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer feedback</p>
              </div>
              <ArrowRight className="w-5 h-5 text-yellow-400 group-hover:text-yellow-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            href="/pro/customers"
            className="group relative overflow-hidden bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-2xl p-6 border-2 border-cyan-200 dark:border-cyan-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">Customers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage relationships</p>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            href="/pro/service-area"
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl p-6 border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">Service Area</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Coverage settings</p>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            href="/pro/quick-messages"
            className="group relative overflow-hidden bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 rounded-2xl p-6 border-2 border-violet-200 dark:border-violet-800 hover:border-violet-500 dark:hover:border-violet-500 transition-all hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">Quick Messages</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Message templates</p>
              </div>
              <ArrowRight className="w-5 h-5 text-violet-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Requests */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('proDashboard.pendingRequests')}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {pendingRequests.length} {pendingRequests.length === 1 ? t('proDashboard.request') : t('proDashboard.requests')} {t('proDashboard.waitingForResponse')}
                  </p>
                </div>
                {pendingRequests.length > 0 && (
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-semibold">
                    {pendingRequests.length}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mx-auto" />
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">{t('proDashboard.noPendingRequests')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{t('proDashboard.newRequestsAppear')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((booking) => (
                    <div key={booking.id} className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-teal-500 dark:hover:border-teal-500 transition-all">
                      <div className="flex gap-4 mb-4">
                        {booking.customer.avatar ? (
                          <img
                            src={booking.customer.avatar}
                            alt={`${booking.customer.firstName} ${booking.customer.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                            {booking.customer.firstName[0]}{booking.customer.lastName[0]}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {booking.customer.firstName} {booking.customer.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{booking.service.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {booking.isASAP ? 'ASAP' : new Date(booking.scheduledFor!).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900 dark:text-white">{booking.pricing.servicePrice}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{booking.pricing.currency}</div>
                        </div>
                      </div>

                      {booking.description && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          {booking.description}
                        </p>
                      )}

                      {/* Only show action buttons if status is REQUESTED */}
                      {booking.status === BookingStatus.REQUESTED ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleRespond(booking.id, 'accept')}
                            disabled={responding === booking.id}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {responding === booking.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                {t('proDashboard.processing')}
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-5 h-5" />
                                {t('proDashboard.accept')}
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleRespond(booking.id, 'decline')}
                            disabled={responding === booking.id}
                            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {t('proDashboard.decline')}
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Status: <span className="font-semibold">{booking.status}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Today's Schedule */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('proDashboard.todaySchedule')}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {todaySchedule.length} {todaySchedule.length === 1 ? t('proDashboard.booking') : t('proDashboard.bookings')} {t('proDashboard.scheduled')}
                  </p>
                </div>
              </div>

              {todaySchedule.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">{t('proDashboard.noBookingsToday')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{t('proDashboard.scheduleIsClear')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaySchedule.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer group" 
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                    >
                      <div className="text-center min-w-[60px]">
                        <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                          {booking.scheduledFor ? new Date(booking.scheduledFor).getHours() : '--'}:{booking.scheduledFor ? new Date(booking.scheduledFor).getMinutes().toString().padStart(2, '0') : '--'}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {booking.service.duration}min
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {booking.customer.firstName} {booking.customer.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.service.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-600 dark:text-gray-400">{booking.location.address}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Performance Insights */}
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6" />
                <h3 className="font-bold text-lg">{t('proDashboard.performance')}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/90">{t('proDashboard.responseTime')}</span>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold">{avgResponseTime} min</div>
                  <div className="text-xs text-white/80 mt-1">{t('proDashboard.avgResponse')}</div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/90">{t('proDashboard.completionRate')}</span>
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold">{completionRate}%</div>
                  <div className="text-xs text-white/80 mt-1">{t('proDashboard.jobsCompletedPercent')}</div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/90">{t('proDashboard.thisWeek')}</span>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold">{todayEarnings.toLocaleString()} {currency}</div>
                  <div className="text-xs text-white/80 mt-1">{t('proDashboard.todaysEarnings')}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>{t('proDashboard.topPros')}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('proDashboard.quickLinks')}</h3>
              <div className="space-y-2">
                <Link 
                  href="/pro/profile"
                  className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 transition-all font-medium text-gray-700 dark:text-gray-300 flex items-center gap-3"
                >
                  <Calendar className="w-5 h-5" />
                  {t('proDashboard.manageAvailability')}
                </Link>
                <Link 
                  href="/bookings"
                  className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 transition-all font-medium text-gray-700 dark:text-gray-300 flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5" />
                  {t('proDashboard.viewAllBookings')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
