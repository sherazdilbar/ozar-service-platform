'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Booking, getBookings, BookingStatus } from '@ozar/shared';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ModernHeader from '@/components/ModernHeader';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  Star,
  X,
  FileText,
  CreditCard,
  Zap
} from 'lucide-react';

export default function BookingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/bookings');
      return;
    }
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;
    
    try {
      const data = await getBookings(user.id, user.role === 'PRO' ? 'pro' : 'customer');
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('bookings.redirectingToLogin')}</p>
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => 
    [BookingStatus.REQUESTED, BookingStatus.ACCEPTED, BookingStatus.SCHEDULED, BookingStatus.IN_PROGRESS].includes(b.status)
  );

  const pastBookings = bookings.filter(b => 
    [BookingStatus.COMPLETED, BookingStatus.CANCELLED_BY_CUSTOMER, BookingStatus.CANCELLED_BY_PRO].includes(b.status)
  );

  const getStatusConfig = (status: BookingStatus) => {
    const configs = {
      REQUESTED: {
        color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        icon: <AlertCircle className="w-4 h-4" />,
        label: t('bookings.status.pendingApproval'),
        description: t('bookings.status.waitingForPro')
      },
      ACCEPTED: {
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        icon: <CheckCircle className="w-4 h-4" />,
        label: t('bookings.status.accepted'),
        description: t('bookings.status.proAccepted')
      },
      SCHEDULED: {
        color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
        icon: <Calendar className="w-4 h-4" />,
        label: t('bookings.status.scheduled'),
        description: t('bookings.status.appointmentConfirmed')
      },
      IN_PROGRESS: {
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
        icon: <Loader className="w-4 h-4 animate-spin" />,
        label: t('bookings.status.inProgress'),
        description: t('bookings.status.workInProgress')
      },
      COMPLETED: {
        color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800',
        icon: <CheckCircle className="w-4 h-4" />,
        label: t('bookings.status.completed'),
        description: t('bookings.status.serviceCompleted')
      },
      CANCELLED_BY_CUSTOMER: {
        color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
        icon: <XCircle className="w-4 h-4" />,
        label: t('bookings.status.cancelled'),
        description: t('bookings.status.cancelledByYou')
      },
      CANCELLED_BY_PRO: {
        color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
        icon: <XCircle className="w-4 h-4" />,
        label: t('bookings.status.cancelled'),
        description: t('bookings.status.cancelledByPro')
      }
    };
    return configs[status] || configs.REQUESTED;
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <ModernHeader
          title={t('bookings.title')}
          subtitle={`${bookings.length} ${bookings.length !== 1 ? t('bookings.totalBookingsPlural') : t('bookings.totalBookings')}`}
          showBack
          backUrl="/"
          actions={
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'upcoming'
                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/30'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {t('bookings.upcoming')} ({upcomingBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'past'
                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/30'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {t('bookings.past')} ({pastBookings.length})
              </button>
            </div>
          }
        />

        <main className="max-w-7xl mx-auto px-4 py-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">{t('bookings.loadingBookings')}</p>
            </div>
          ) : displayBookings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center border border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                {activeTab === 'upcoming' ? t('bookings.noUpcomingBookings') : t('bookings.noPastBookings')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {activeTab === 'upcoming' 
                  ? t('bookings.noUpcomingDesc')
                  : t('bookings.noPastDesc')}
              </p>
              {activeTab === 'upcoming' && (
                <button 
                  onClick={() => router.push('/')} 
                  className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all transform hover:scale-105 active:scale-95"
                >
                  {t('bookings.findProfessionals')}
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayBookings.map((booking) => {
                const statusConfig = getStatusConfig(booking.status);
                return (
                  <div
                    key={booking.id}
                    onClick={() => handleBookingClick(booking)}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer border border-gray-200 dark:border-gray-700 transform hover:scale-[1.02] hover:-translate-y-1"
                  >
                    {/* Header with Pro Image */}
                    <div className="relative h-32 bg-gradient-to-br from-teal-500 to-teal-600 p-6">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="relative flex items-center gap-4">
                        <div className="relative">
                          <Image
                            src={booking.pro.user.avatar || '/placeholder-avatar.png'}
                            alt={`${booking.pro.user.firstName} ${booking.pro.user.lastName}`}
                            width={64}
                            height={64}
                            className="rounded-xl border-4 border-white shadow-lg"
                            unoptimized
                          />
                          {booking.isASAP && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                              <Zap className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-white">
                          <h3 className="font-bold text-lg leading-tight">
                            {booking.pro.user.firstName} {booking.pro.user.lastName}
                          </h3>
                          <p className="text-teal-100 text-sm">{booking.service.name}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Status Badge */}
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border ${statusConfig.color}`}>
                        {statusConfig.icon}
                        <span>{statusConfig.label}</span>
                      </div>

                      {/* Details */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 text-sm">
                          <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-gray-600 dark:text-gray-400 text-xs mb-1">{t('bookings.dateTime')}</div>
                            <div className="text-gray-900 dark:text-white font-medium">
                              {booking.isASAP 
                                ? t('bookings.asap')
                                : new Date(booking.scheduledFor!).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 text-sm">
                          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-gray-600 dark:text-gray-400 text-xs mb-1">{t('bookings.location')}</div>
                            <div className="text-gray-900 dark:text-white font-medium line-clamp-2">
                              {booking.location.address}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('bookings.totalPrice')}</div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {booking.pricing.total} <span className="text-sm text-gray-500">{booking.pricing.currency}</span>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg font-medium hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors group-hover:shadow-md">
                          {t('bookings.viewDetails')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-t-3xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    src={selectedBooking.pro.user.avatar || '/placeholder-avatar.png'}
                    alt={`${selectedBooking.pro.user.firstName} ${selectedBooking.pro.user.lastName}`}
                    width={80}
                    height={80}
                    className="rounded-2xl border-4 border-white shadow-lg"
                    unoptimized
                  />
                  <div className="text-white">
                    <h2 className="text-2xl font-bold mb-1">
                      {selectedBooking.pro.user.firstName} {selectedBooking.pro.user.lastName}
                    </h2>
                    <p className="text-teal-100">{selectedBooking.service.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{selectedBooking.pro.rating || '5.0'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('bookings.bookingStatus')}</h3>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${getStatusConfig(selectedBooking.status).color}`}>
                    {getStatusConfig(selectedBooking.status).icon}
                    <span>{getStatusConfig(selectedBooking.status).label}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {getStatusConfig(selectedBooking.status).description}
                </p>
              </div>

              {/* Booking Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t('bookings.dateTime')}</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {selectedBooking.isASAP 
                          ? t('bookings.asap')
                          : new Date(selectedBooking.scheduledFor!).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t('bookings.totalPrice')}</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {selectedBooking.pricing.total} {selectedBooking.pricing.currency}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('bookings.serviceLocation')}</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {selectedBooking.location.address}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedBooking.description && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('bookings.description')}</div>
                      <div className="text-gray-900 dark:text-white">
                        {selectedBooking.description}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Professional */}
              <div className="flex gap-3">
                <Link
                  href={`/chat/${selectedBooking.pro.userId}`}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  {t('bookings.messageProfessional')}
                </Link>
                <Link
                  href={`/pros/${selectedBooking.proId}`}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  {t('bookings.viewProfile')}
                </Link>
              </div>

              {/* Booking ID */}
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('bookings.bookingId')}</div>
                <div className="text-sm font-mono text-gray-600 dark:text-gray-300 mt-1">
                  {selectedBooking.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
