'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProLayout from '@/components/ProLayout';
import { Booking, getBookings, respondToBooking, BookingStatus } from '@ozar/shared';
import { prosApi } from '@ozar/shared/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Users,
  Star,
  TrendingUp,
  X
} from 'lucide-react';

export default function ProDashboardPageListeo() {
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
    if (responding) return;
    
    setResponding(bookingId);
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) throw new Error('Booking not found');
      
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

  return (
    <ProLayout>
      <div className="p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('proDashboard.welcomeBack')}, {user.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('proDashboard.businessToday')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Earnings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {t('proDashboard.today')}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {currency} {todayEarnings.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('proDashboard.todayEarnings')}
            </div>
          </div>

          {/* Active Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              {todaySchedule.length > 0 && (
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                  {t('proDashboard.active')}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {todaySchedule.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('proDashboard.activeBookings')}
            </div>
          </div>

          {/* Completed Today */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {completedToday}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('proDashboard.completedToday')}
            </div>
          </div>

          {/* Total Earnings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {t('proDashboard.allTime')}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {currency} {totalEarnings.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('proDashboard.totalEarnings')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Requests */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {t('proDashboard.pendingRequests')}
                    </h2>
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
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mx-auto" />
                  </div>
                ) : pendingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {t('proDashboard.noPendingRequests')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {t('proDashboard.newRequestsAppear')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-teal-500 dark:hover:border-teal-500 transition-all"
                      >
                        <div className="flex gap-4 mb-4">
                          {booking.customer.avatar ? (
                            <img
                              src={booking.customer.avatar}
                              alt={`${booking.customer.firstName} ${booking.customer.lastName}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
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
                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                              {booking.pricing.servicePrice}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {booking.pricing.currency}
                            </div>
                          </div>
                        </div>

                        {booking.description && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            {booking.description}
                          </p>
                        )}

                        {booking.status === BookingStatus.REQUESTED && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleRespond(booking.id, 'accept')}
                              disabled={responding === booking.id}
                              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                              className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              <X className="w-5 h-5" />
                              {t('proDashboard.decline')}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('proDashboard.todaySchedule')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {todaySchedule.length} {todaySchedule.length === 1 ? t('proDashboard.booking') : t('proDashboard.bookings')} {t('proDashboard.scheduled')}
                </p>
              </div>

              <div className="p-6">
                {todaySchedule.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {t('proDashboard.noBookingsToday')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {t('proDashboard.scheduleIsClear')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todaySchedule.map((booking) => (
                      <Link
                        key={booking.id}
                        href={`/bookings/${booking.id}`}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer"
                      >
                        <div className="text-center min-w-[60px]">
                          <div className="text-xl font-bold text-teal-600 dark:text-teal-400">
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
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                {t('proDashboard.quickLinks')}
              </h3>
              <div className="space-y-2">
                <Link 
                  href="/pro/profile"
                  className="block px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 transition-all font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('proDashboard.manageAvailability')}
                </Link>
                <Link 
                  href="/bookings"
                  className="block px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 transition-all font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('proDashboard.viewAllBookings')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProLayout>
  );
}
