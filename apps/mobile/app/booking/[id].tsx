import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { bookingsApi, chatApi } from '@ozar/shared/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import BookingTimeline from '../../components/BookingTimeline';

interface Booking {
  id: string;
  status: string;
  isASAP: boolean;
  scheduledFor?: string;
  description: string;
  images: string[];
  locationAddr: string;
  locationCity: string;
  locationLat: number;
  locationLng: number;
  servicePrice: number;
  platformFee: number;
  total: number;
  currency: string;
  customerNotes?: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  pro: {
    id: string;
    businessName?: string;
    locationLat?: number;
    locationLng?: number;
    user: {
      id: true;
      firstName: string;
      lastName: string;
      phone: string;
    };
  };
  service: {
    id: string;
    name: string;
    duration: number;
  };
  review?: {
    id: string;
    rating: number;
    comment: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: '#F59E0B',
  ACCEPTED: '#10B981',
  SCHEDULED: '#3B82F6',
  IN_PROGRESS: '#8B5CF6',
  COMPLETED: '#10B981',
  CANCELLED_BY_CUSTOMER: '#EF4444',
  CANCELLED_BY_PRO: '#EF4444',
  DECLINED: '#EF4444',
};

const STATUS_LABELS: Record<string, string> = {
  REQUESTED: 'Pending',
  ACCEPTED: 'Accepted',
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED_BY_CUSTOMER: 'Cancelled',
  CANCELLED_BY_PRO: 'Cancelled',
  DECLINED: 'Declined',
};

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  
  // Notes state
  const [customerNotes, setCustomerNotes] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  
  // ETA calculation for ASAP bookings
  const [estimatedArrival, setEstimatedArrival] = useState<string | null>(null);

  useEffect(() => {
    loadBooking();
  }, [id]);

  useEffect(() => {
    // Calculate ETA for ASAP bookings
    if (booking?.isASAP && booking.status === 'ACCEPTED' && booking.pro) {
      calculateETA();
    }
  }, [booking]);

  const calculateETA = () => {
    if (!booking) return;
    
    // Simple distance-based calculation
    // In a real app, you'd use Mapbox Directions API
    // For now, assume average speed of 30 km/h in city
    const avgSpeedKmh = 30;
    
    // Calculate straight-line distance (Haversine formula)
    const R = 6371; // Earth's radius in km
    const dLat = toRad(booking.locationLat - (booking.pro.locationLat || 47.4979));
    const dLon = toRad(booking.locationLng - (booking.pro.locationLng || 19.0402));
    const lat1 = toRad(booking.pro.locationLat || 47.4979);
    const lat2 = toRad(booking.locationLat);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Calculate time in minutes (add 10 min buffer for city traffic)
    const timeMinutes = Math.round((distance / avgSpeedKmh) * 60) + 10;
    
    if (timeMinutes < 60) {
      setEstimatedArrival(`${timeMinutes} minutes`);
    } else {
      const hours = Math.floor(timeMinutes / 60);
      const mins = timeMinutes % 60;
      setEstimatedArrival(`${hours}h ${mins}m`);
    }
  };
  
  const toRad = (deg: number) => deg * (Math.PI / 180);

  const loadBooking = async () => {
    try {
      const result = await bookingsApi.getBookingById(id as string);
      setBooking(result);
      setCustomerNotes(result.customerNotes || '');
    } catch (error) {
      console.error('Failed to load booking:', error);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    Alert.alert(
      'Accept Booking',
      'Are you sure you want to accept this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            setActionLoading(true);
            try {
              await bookingsApi.acceptBooking(id as string);
              await loadBooking();
              Alert.alert('Success', 'Booking accepted!');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to accept booking');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDecline = async () => {
    Alert.prompt(
      'Decline Booking',
      'Please provide a reason:',
      async (reason) => {
        if (!reason?.trim()) return;
        
        setActionLoading(true);
        try {
          await bookingsApi.declineBooking(id as string, reason.trim());
          await loadBooking();
          Alert.alert('Declined', 'Booking has been declined');
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Failed to decline booking');
        } finally {
          setActionLoading(false);
        }
      }
    );
  };

  const handleStartJob = async () => {
    setActionLoading(true);
    try {
      await bookingsApi.startJob(id as string);
      await loadBooking();
      Alert.alert('Started', 'Job has been started');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start job');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteJob = async () => {
    console.log('Complete job button pressed for booking:', id);
    console.log('Current booking status:', booking?.status);
    
    // Use window.confirm for web compatibility
    const confirmed = typeof window !== 'undefined' && window.confirm
      ? window.confirm(`Mark this job as completed?\n\nCurrent status: ${booking?.status}`)
      : true; // On native, just proceed
    
    if (!confirmed) {
      console.log('User cancelled completion');
      return;
    }
    
    console.log('User confirmed completion');
    setActionLoading(true);
    try {
      console.log('Calling completeJob API...');
      const result = await bookingsApi.completeJob(id as string);
      console.log('Complete job result:', result);
      
      await loadBooking();
      
      // Show success message
      if (typeof window !== 'undefined' && window.alert) {
        window.alert('Success! Job completed. The customer can now leave a review.');
      } else {
        Alert.alert('Success', 'Job completed! The customer can now leave a review.');
      }
    } catch (error: any) {
      console.error('Complete job error:', error);
      const errorMsg = error.message || 'Failed to complete job';
      console.error('Error details:', errorMsg);
      
      if (typeof window !== 'undefined' && window.alert) {
        window.alert('Error: ' + errorMsg + '\n\nMake sure the job is in IN_PROGRESS status.');
      } else {
        Alert.alert('Error', errorMsg);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to send messages');
      return;
    }

    setActionLoading(true);
    try {
      const conversation = await chatApi.getOrCreateConversation({
        customerId: user.id,
        proId: booking!.pro.id,
        bookingId: booking!.id,
      });
      
      console.log('Conversation created/found:', conversation);
      
      // Navigate to the chat screen with the conversation ID
      router.push(`/chat/${conversation.id}`);
    } catch (error: any) {
      console.error('Failed to get or create conversation:', error);
      Alert.alert('Error', error.message || 'Failed to start conversation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveReview = async () => {
    if (!reviewComment.trim()) {
      Alert.alert('Required', 'Please write a review comment');
      return;
    }

    setActionLoading(true);
    try {
      await bookingsApi.createReview(id as string, rating, reviewComment.trim());
      setShowReviewModal(false);
      await loadBooking();
      Alert.alert('Success', 'Thank you for your review!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit review');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    Alert.prompt(
      'Cancel Booking',
      'Please provide a reason for cancellation:',
      async (reason) => {
        if (!reason?.trim()) return;
        
        setActionLoading(true);
        try {
          await bookingsApi.cancelBooking(id as string, reason.trim());
          await loadBooking();
          Alert.alert('Cancelled', 'Booking has been cancelled');
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Failed to cancel booking');
        } finally {
          setActionLoading(false);
        }
      }
    );
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await bookingsApi.updateBookingNotes(id as string, customerNotes);
      setEditingNotes(false);
      Alert.alert('Success', 'Notes saved successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text style={styles.loadingText}>Loading booking...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>😕</Text>
        <Text style={styles.errorTitle}>Booking not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isPro = user?.role === 'PRO';
  const otherUser = isPro ? booking.customer : booking.pro.user;
  const displayName = isPro
    ? `${otherUser.firstName} ${otherUser.lastName}`
    : booking.pro.businessName || `${otherUser.firstName} ${otherUser.lastName}`;

  const statusColor = STATUS_COLORS[booking.status] || '#6B7280';
  const statusLabel = STATUS_LABELS[booking.status] || booking.status;

  const showProActions = isPro && booking.status === 'REQUESTED';
  const showStartButton = isPro && (booking.status === 'ACCEPTED' || booking.status === 'SCHEDULED');
  const showCompleteButton = isPro && booking.status === 'IN_PROGRESS';
  
  // Customer actions
  const showMessageButton = !isPro && !['CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_PRO'].includes(booking.status);
  const showReviewButton = !isPro && booking.status === 'COMPLETED' && !booking.review;
  const showCancelButton = !isPro && ['REQUESTED', 'ACCEPTED', 'SCHEDULED'].includes(booking.status);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
        </View>

        {/* Status Badge */}
        <View style={styles.section}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service</Text>
          <Text style={styles.serviceName}>{booking.service.name}</Text>
          <Text style={styles.serviceDetail}>
            ⏱️ {booking.service.duration} minutes
          </Text>
        </View>

        {/* Pro/Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isPro ? 'Customer' : 'Professional'}
          </Text>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userPhone}>📞 {otherUser.phone}</Text>
        </View>

        {/* Timing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>When</Text>
          {booking.isASAP ? (
            <>
              <Text style={styles.asapBadge}>⚡ As Soon As Possible</Text>
              {estimatedArrival && booking.status === 'ACCEPTED' && (
                <View style={styles.etaContainer}>
                  <Text style={styles.etaLabel}>Estimated Arrival:</Text>
                  <Text style={styles.etaValue}>🚗 {estimatedArrival}</Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.scheduledText}>
              📅 {new Date(booking.scheduledFor!).toLocaleString()}
            </Text>
          )}
        </View>

        {/* Booking Timeline */}
        <View style={styles.section}>
          <BookingTimeline
            status={booking.status}
            isASAP={booking.isASAP}
            createdAt={booking.createdAt}
            scheduledFor={booking.scheduledFor}
            completedAt={booking.completedAt}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{booking.description}</Text>
        </View>

        {/* Customer Notes - Only for customers */}
        {!isPro && (
          <View style={styles.section}>
            <View style={styles.notesHeader}>
              <Text style={styles.sectionTitle}>Your Notes</Text>
              {!editingNotes && (
                <TouchableOpacity onPress={() => setEditingNotes(true)}>
                  <Text style={styles.editNotesButton}>
                    {customerNotes ? '✏️ Edit' : '+ Add Notes'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {editingNotes ? (
              <>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Add special instructions or notes for the professional..."
                  placeholderTextColor="#9ca3af"
                  value={customerNotes}
                  onChangeText={setCustomerNotes}
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                />
                <Text style={styles.charCount}>{customerNotes.length}/500</Text>
                <View style={styles.notesActions}>
                  <TouchableOpacity
                    style={styles.notesCancelButton}
                    onPress={() => {
                      setCustomerNotes(booking.customerNotes || '');
                      setEditingNotes(false);
                    }}
                  >
                    <Text style={styles.notesCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.notesSaveButton}
                    onPress={handleSaveNotes}
                    disabled={savingNotes}
                  >
                    {savingNotes ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.notesSaveText}>Save Notes</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text style={styles.notesText}>
                {customerNotes || 'No notes added yet. Tap "Add Notes" to include special instructions.'}
              </Text>
            )}
          </View>
        )}

        {/* Images */}
        {booking.images && booking.images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {booking.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.image}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.locationText}>
            📍 {booking.locationAddr}, {booking.locationCity}
          </Text>
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Service Price</Text>
            <Text style={styles.pricingValue}>
              {booking.servicePrice.toLocaleString()} {booking.currency}
            </Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Platform Fee (15%)</Text>
            <Text style={styles.pricingValue}>
              {booking.platformFee.toLocaleString()} {booking.currency}
            </Text>
          </View>
          <View style={[styles.pricingRow, styles.pricingTotal]}>
            <Text style={styles.pricingLabelTotal}>Total</Text>
            <Text style={styles.price}>
              {booking.total.toLocaleString()} {booking.currency}
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Buttons */}
      {(showProActions || showStartButton || showCompleteButton || showMessageButton || showReviewButton || showCancelButton) && (
        <View style={styles.bottomActions}>
          {showProActions && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.declineButton]}
                onPress={handleDecline}
                disabled={actionLoading}
              >
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={handleAccept}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.acceptButtonText}>Accept</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {showStartButton && (
            <TouchableOpacity
              style={[styles.actionButton, styles.startButton]}
              onPress={handleStartJob}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.startButtonText}>Start Job</Text>
              )}
            </TouchableOpacity>
          )}

          {showCompleteButton && (
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={handleCompleteJob}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.completeButtonText}>Complete Job</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Customer Actions */}
          {showCancelButton && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancelBooking}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
              )}
            </TouchableOpacity>
          )}

          {showMessageButton && (
            <TouchableOpacity
              style={[styles.actionButton, styles.messageButton]}
              onPress={handleMessage}
            >
              <Text style={styles.messageButtonText}>💬 Message Pro</Text>
            </TouchableOpacity>
          )}

          {showReviewButton && (
            <TouchableOpacity
              style={[styles.actionButton, styles.reviewButton]}
              onPress={() => setShowReviewModal(true)}
            >
              <Text style={styles.reviewButtonText}>⭐ Leave Review</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Review Modal */}
      <Modal
        visible={showReviewModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Leave a Review</Text>
            <Text style={styles.modalSubtitle}>How was your experience with {displayName}?</Text>

            {/* Star Rating */}
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Text style={styles.starText}>
                    {star <= rating ? '⭐' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Comment Input */}
            <TextInput
              style={styles.reviewInput}
              placeholder="Share your experience..."
              placeholderTextColor="#9ca3af"
              value={reviewComment}
              onChangeText={setReviewComment}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.charCount}>{reviewComment.length}/500</Text>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setShowReviewModal(false);
                  setReviewComment('');
                  setRating(5);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSubmitButton]}
                onPress={handleLeaveReview}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.modalSubmitText}>Submit Review</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  backBtnText: {
    fontSize: 28,
    color: '#00BCD4',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  serviceDetail: {
    fontSize: 14,
    color: '#6b7280',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#6b7280',
  },
  asapBadge: {
    fontSize: 15,
    color: '#F59E0B',
    fontWeight: '600',
  },
  scheduledText: {
    fontSize: 15,
    color: '#374151',
  },
  description: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
  },
  locationText: {
    fontSize: 15,
    color: '#374151',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  pricingTotal: {
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  pricingLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  pricingValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  pricingLabelTotal: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00BCD4',
  },
  bottomActions: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    backgroundColor: '#f3f4f6',
  },
  declineButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#00BCD4',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: '#f3f4f6',
  },
  messageButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#FEE2E2',
    flex: 1,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
  },
  reviewButton: {
    backgroundColor: '#00BCD4',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  // Review Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  starButton: {
    padding: 4,
  },
  starText: {
    fontSize: 40,
  },
  reviewInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#f3f4f6',
  },
  modalCancelText: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '600',
  },
  modalSubmitButton: {
    backgroundColor: '#00BCD4',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalSubmitText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  // Notes Styles
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editNotesButton: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: '600',
  },
  notesInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  notesActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  notesCancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  notesCancelText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  notesSaveButton: {
    flex: 2,
    backgroundColor: '#00BCD4',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  notesSaveText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  notesText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  // ETA Styles
  etaContainer: {
    marginTop: 12,
    backgroundColor: '#E0F2F1',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00BCD4',
  },
  etaLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  etaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00BCD4',
  },
});
