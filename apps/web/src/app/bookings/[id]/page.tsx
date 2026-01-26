'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Booking, getBookingById, BookingStatus } from '@ozar/shared';
import { useAuth } from '@/contexts/AuthContext';
import { bookingsApi } from '@ozar/shared/apiClient';
import Image from 'next/image';
import { 
  ArrowLeft, 
  MessageSquare, 
  Phone, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader, 
  Star,
  Play,
  Check,
  X,
  User,
  Zap
} from 'lucide-react';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/bookings/' + params.id);
      return;
    }
    loadBooking();
    
    const interval = setInterval(loadBooking, 10000);
    return () => clearInterval(interval);
  }, [params.id, user]);

  const loadBooking = async () => {
    try {
      const data = await getBookingById(params.id as string);
      setBooking(data);
    } catch (error) {
      console.error('Failed to load booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!booking || !cancelReason.trim() || !user) return;

    setCancelling(true);
    try {
      await bookingsApi.updateBookingStatus(
        booking.id,
        'CANCELLED_BY_CUSTOMER',
        cancelReason
      );
      await loadBooking();
      setShowCancelModal(false);
      setCancelReason('');
    } catch (error: any) {
      console.error('Failed to cancel booking:', error);
      alert(error.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const handleStartJob = async () => {
    if (!booking) return;
    
    setProcessing(true);
    try {
      await bookingsApi.startJob(booking.id);
      await loadBooking();
    } catch (error: any) {
      console.error('Failed to start job:', error);
      alert(error.message || 'Failed to start job');
    } finally {
      setProcessing(false);
    }
  };

  const handleCompleteJob = async () => {
    if (!booking) return;
    
    setProcessing(true);
    try {
      await bookingsApi.completeJob(booking.id);
      await loadBooking();
    } catch (error: any) {
      console.error('Failed to complete job:', error);
      alert(error.message || 'Failed to complete job');
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!booking || !reviewComment.trim()) {
      alert('Please write a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      await bookingsApi.createReview(booking.id, rating, reviewComment);
      await loadBooking();
      setShowReviewModal(false);
      setReviewComment('');
      setRating(5);
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      alert(error.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusConfig = (status: BookingStatus) => {
    const configs = {
      REQUESTED: {
        color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        icon: <AlertCircle className="w-5 h-5" />,
        label: 'Pending Approval'
      },
      ACCEPTED: {
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Accepted'
      },
      SCHEDULED: {
        color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
        icon: <Calendar className="w-5 h-5" />,
        label: 'Scheduled'
      },
      IN_PROGRESS: {
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
        icon: <Loader className="w-5 h-5 animate-spin" />,
        label: 'In Progress'
      },
      COMPLETED: {
        color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Completed'
      },
      CANCELLED_BY_CUSTOMER: {
        color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
        icon: <XCircle className="w-5 h-5" />,
        label: 'Cancelled'
      },
      CANCELLED_BY_PRO: {
        color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
        icon: <XCircle className="w-5 h-5" />,
        label: 'Cancelled'
      }
    };
    return configs[status] || configs.REQUESTED;
  };

  const isPro = user?.role === 'PRO';
  const isCustomer = user?.role === 'CUSTOMER';

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Not Found</h2>
          <button onClick={() => router.back()} className="text-teal-600 dark:text-teal-400 hover:underline">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Modern Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Booking Details</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Status Banner */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-6">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-1">Booking #{booking.id.slice(0, 8)}</h2>
                <p className="text-teal-100">Created {new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 ${statusConfig.color} bg-white dark:bg-gray-800`}>
                {statusConfig.icon}
                <span>{statusConfig.label}</span>
              </div>
            </div>
          </div>

          {/* Pro/Customer Info */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src={booking.pro.user.avatar || '/placeholder-avatar.png'}
                alt={`${booking.pro.user.firstName} ${booking.pro.user.lastName}`}
                width={80}
                height={80}
                className="rounded-2xl border-4 border-gray-100 dark:border-gray-700 shadow-lg"
                unoptimized
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {booking.pro.user.firstName} {booking.pro.user.lastName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{booking.pro.businessName}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
                    <span className="font-semibold text-amber-900 dark:text-amber-300">{booking.pro.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl font-semibold hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-all">
                <MessageSquare className="w-5 h-5" />
                <span>Message</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all">
                <Phone className="w-5 h-5" />
                <span>Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            Service Details
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Service</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{booking.service.name}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  {booking.isASAP ? (
                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">When</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {booking.isASAP ? 'ASAP' : new Date(booking.scheduledFor!).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Location</div>
                  <div className="font-semibold text-gray-900 dark:text-white line-clamp-1">{booking.location.address}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{booking.service.duration} min</div>
                </div>
              </div>
            </div>
          </div>

          {booking.description && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Description</div>
              <p className="text-gray-900 dark:text-white">{booking.description}</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        {booking.events && booking.events.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              Booking Timeline
            </h3>
            <div className="space-y-4">
              {booking.events.map((event: any, index: number) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    {index < booking.events!.length - 1 && (
                      <div className="w-1 flex-1 min-h-[40px] bg-gradient-to-b from-teal-500 to-teal-300 dark:from-teal-600 dark:to-teal-800 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                      <div className="font-bold text-gray-900 dark:text-white mb-1">
                        {event.status.replace(/_/g, ' ')}
                      </div>
                      {event.note && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{event.note}</div>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(event.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            Payment Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Service price</span>
              <span className="font-semibold">{booking.pricing.servicePrice} {booking.pricing.currency}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Platform fee</span>
              <span className="font-semibold">{booking.pricing.platformFee} {booking.pricing.currency}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white pt-3 border-t-2 border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span className="text-teal-600 dark:text-teal-400">{booking.pricing.total} {booking.pricing.currency}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {/* Pro Actions */}
          {isPro && (booking.status === BookingStatus.ACCEPTED || booking.status === BookingStatus.SCHEDULED) && (
            <button
              onClick={handleStartJob}
              disabled={processing}
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {processing ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Starting...</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  <span>Start Job</span>
                </>
              )}
            </button>
          )}

          {isPro && booking.status === BookingStatus.IN_PROGRESS && (
            <button
              onClick={handleCompleteJob}
              disabled={processing}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {processing ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Completing...</span>
                </>
              ) : (
                <>
                  <Check className="w-6 h-6" />
                  <span>Mark as Completed</span>
                </>
              )}
            </button>
          )}

          {/* Customer Actions */}
          {isCustomer && [BookingStatus.REQUESTED, BookingStatus.ACCEPTED, BookingStatus.SCHEDULED].includes(booking.status) && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-bold text-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all border-2 border-red-200 dark:border-red-800 flex items-center justify-center gap-3"
            >
              <XCircle className="w-6 h-6" />
              <span>Cancel Booking</span>
            </button>
          )}

          {isCustomer && booking.status === BookingStatus.COMPLETED && !booking.review && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Star className="w-6 h-6" />
              <span>Leave a Review</span>
            </button>
          )}

          {/* Show review if already submitted */}
          {isCustomer && booking.review && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                Your Review
              </h3>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-6 h-6 ${i < booking.review!.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300 dark:text-gray-600'}`}
                  />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">{booking.review.comment}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Submitted {new Date(booking.review.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-slideUp">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Cancel Booking</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Please tell us why you're cancelling this booking
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={!cancelReason.trim() || cancelling}
                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-slideUp">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Leave a Review</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              How was your experience with {booking?.pro.user.firstName}?
            </p>
            
            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">Your Rating</label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-125 active:scale-110"
                  >
                    <Star 
                      className={`w-10 h-10 ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-center mt-2 text-gray-600 dark:text-gray-400 font-semibold">{rating} / 5</div>
            </div>

            {/* Review Comment */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Review</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewComment('');
                  setRating(5);
                }}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={!reviewComment.trim() || submittingReview}
                className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
