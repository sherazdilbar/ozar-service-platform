import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { bookingsApi } from '@ozar/shared/apiClient';
import { useAuth } from '../../contexts/AuthContext';

interface Booking {
  id: string;
  status: string;
  service: {
    name: string;
    category: string;
  };
  pro: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
    businessName?: string;
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
  };
  scheduledFor?: string;
  isASAP: boolean;
  locationAddr: string;
  locationCity: string;
  servicePrice: number;
  platformFee: number;
  total: number;
  currency: string;
  createdAt: string;
}

export default function BookingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [responding, setResponding] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const isPro = user?.role === 'PRO';

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const result = await bookingsApi.getBookings();
      setBookings(result.data || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBookings();
  }, []);

  const handleRespond = async (bookingId: string, action: 'accept' | 'decline') => {
    setResponding(bookingId);
    try {
      if (action === 'accept') {
        await bookingsApi.acceptBooking(bookingId);
        Alert.alert('Success', 'Booking accepted!');
      } else {
        await bookingsApi.declineBooking(bookingId, 'Not available at this time');
        Alert.alert('Success', 'Booking declined');
      }
      loadBookings();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to respond to booking');
    } finally {
      setResponding(null);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // For PRO users, show only REQUESTED bookings
  const displayBookings = isPro 
    ? bookings.filter(b => b.status === 'REQUESTED')
    : bookings;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    if (isToday) return `Today at ${timeStr}`;
    if (isTomorrow) return `Tomorrow at ${timeStr}`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={isPro ? '#4F46E5' : '#00BCD4'} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // PRO View - Booking Requests
  if (isPro) {
    return (
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.proHeader}>
            <Text style={styles.proTitle}>Booking Requests</Text>
            <Text style={styles.proSubtitle}>{displayBookings.length} pending requests</Text>
          </View>

          {/* Requests List */}
          <View style={styles.requestsList}>
            {displayBookings.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyTitle}>No Pending Requests</Text>
                <Text style={styles.emptyText}>
                  New booking requests will appear here
                </Text>
              </View>
            ) : (
              displayBookings.map((booking) => {
                const customerName = `${booking.customer.firstName} ${booking.customer.lastName}`;
                const customerInitials = `${booking.customer.firstName[0]}${booking.customer.lastName[0]}`;
                
                return (
                  <View key={booking.id} style={styles.requestCard}>
                    {/* Time Badge */}
                    <View style={styles.timeRow}>
                      <Text style={styles.timeText}>
                        Requested {getTimeAgo(booking.createdAt)}
                      </Text>
                      <TouchableOpacity onPress={() => router.push(`/booking/${booking.id}`)}>
                        <Text style={styles.chatIcon}>💬</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Customer Info */}
                    <View style={styles.customerRow}>
                      <View style={styles.requestAvatar}>
                        <Text style={styles.requestAvatarText}>{customerInitials}</Text>
                      </View>
                      <View style={styles.customerInfo}>
                        <View style={styles.customerNameRow}>
                          <Text style={styles.customerName}>{customerName}</Text>
                          <View style={styles.ratingBadge}>
                            <Text style={styles.ratingStar}>⭐</Text>
                            <Text style={styles.ratingText}>4.8</Text>
                          </View>
                        </View>
                        <Text style={styles.serviceName}>{booking.service.name}</Text>
                      </View>
                    </View>

                    {/* Description */}
                    <Text style={styles.description} numberOfLines={3}>
                      Service request for {booking.service.name}. Location: {booking.locationAddr}
                    </Text>

                    {/* Details */}
                    <View style={styles.detailsContainer}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>📅</Text>
                        <Text style={styles.detailText}>
                          {booking.isASAP ? 'ASAP' : formatDate(booking.scheduledFor)} • 2 hours
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>📍</Text>
                        <Text style={styles.detailText} numberOfLines={1}>
                          {booking.locationAddr}, {booking.locationCity}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>💰</Text>
                        <Text style={styles.detailText}>
                          {booking.total?.toLocaleString() || '0'} {booking.currency || 'HUF'} estimated
                        </Text>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={styles.declineButton}
                        onPress={() => handleRespond(booking.id, 'decline')}
                        disabled={responding === booking.id}
                      >
                        {responding === booking.id ? (
                          <ActivityIndicator size="small" color="#DC2626" />
                        ) : (
                          <>
                            <Text style={styles.declineIcon}>✕</Text>
                            <Text style={styles.declineText}>Decline</Text>
                          </>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.acceptButton}
                        onPress={() => handleRespond(booking.id, 'accept')}
                        disabled={responding === booking.id}
                      >
                        {responding === booking.id ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <>
                            <Text style={styles.acceptIcon}>✓</Text>
                            <Text style={styles.acceptText}>Accept</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }

  // Customer View - Original bookings view
  const upcomingStatuses = ['REQUESTED', 'OFFERED', 'ACCEPTED', 'PAYMENT_AUTHORIZED', 'SCHEDULED', 'IN_PROGRESS'];
  const pastStatuses = ['COMPLETED', 'CAPTURED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_PRO', 'NO_SHOW', 'DISPUTED', 'REFUNDED'];

  const upcomingBookings = bookings.filter(b => upcomingStatuses.includes(b.status));
  const pastBookings = bookings.filter(b => pastStatuses.includes(b.status));
  const customerDisplayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      REQUESTED: { bg: '#fef3c7', text: '#92400e' },
      OFFERED: { bg: '#dbeafe', text: '#1e40af' },
      ACCEPTED: { bg: '#dcfce7', text: '#166534' },
      PAYMENT_AUTHORIZED: { bg: '#dcfce7', text: '#166534' },
      SCHEDULED: { bg: '#e0e7ff', text: '#3730a3' },
      IN_PROGRESS: { bg: '#ddd6fe', text: '#5b21b6' },
      COMPLETED: { bg: '#dcfce7', text: '#166534' },
      CAPTURED: { bg: '#dcfce7', text: '#166534' },
      CANCELLED_BY_CUSTOMER: { bg: '#fee2e2', text: '#991b1b' },
      CANCELLED_BY_PRO: { bg: '#fee2e2', text: '#991b1b' },
      NO_SHOW: { bg: '#fee2e2', text: '#991b1b' },
      DISPUTED: { bg: '#fef3c7', text: '#92400e' },
      REFUNDED: { bg: '#f3f4f6', text: '#374151' },
    };
    return colors[status] || { bg: '#f3f4f6', text: '#374151' };
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      REQUESTED: 'Pending',
      OFFERED: 'Offer Received',
      ACCEPTED: 'Accepted',
      PAYMENT_AUTHORIZED: 'Payment OK',
      SCHEDULED: 'Scheduled',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
      CAPTURED: 'Paid',
      CANCELLED_BY_CUSTOMER: 'Cancelled',
      CANCELLED_BY_PRO: 'Cancelled by Pro',
      NO_SHOW: 'No Show',
      DISPUTED: 'Disputed',
      REFUNDED: 'Refunded',
    };
    return labels[status] || status;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>
          {bookings.length} total
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            Upcoming ({upcomingBookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
            Past ({pastBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00BCD4']} />
        }
      >
        {customerDisplayBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>
              {activeTab === 'upcoming' ? '📋' : '✅'}
            </Text>
            <Text style={styles.emptyTitle}>
              {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'upcoming' 
                ? 'Find a professional to get started'
                : 'Completed bookings will appear here'
              }
            </Text>
            {activeTab === 'upcoming' && (
              <TouchableOpacity 
                style={styles.browseButton}
                onPress={() => router.push('/(tabs)')}
              >
                <Text style={styles.browseButtonText}>Browse Professionals</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          customerDisplayBookings.map((booking) => {
            const statusColors = getStatusColor(booking.status);
            const displayName = booking.pro.businessName || `${booking.pro.user.firstName} ${booking.pro.user.lastName}`;

            return (
              <TouchableOpacity
                key={booking.id}
                style={styles.bookingCard}
                onPress={() => router.push(`/booking/${booking.id}`)}
              >
                <View style={styles.bookingHeader}>
                  <View style={styles.bookingHeaderLeft}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {displayName.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                    <View style={styles.bookingHeaderInfo}>
                      <Text style={styles.proName}>{displayName}</Text>
                      <Text style={styles.serviceName}>{booking.service.name}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                    <Text style={[styles.statusText, { color: statusColors.text }]}>
                      {getStatusLabel(booking.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.bookingDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📅</Text>
                    <Text style={styles.detailText}>
                      {booking.isASAP ? 'ASAP' : formatDate(booking.scheduledFor)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📍</Text>
                    <Text style={styles.detailText} numberOfLines={1}>
                      {booking.locationAddr || 'Address not provided'}, {booking.locationCity || 'City not provided'}
                    </Text>
                  </View>
                </View>

                <View style={styles.bookingFooter}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Total</Text>
                    <Text style={styles.bookingPrice}>
                      {booking.total?.toLocaleString() || '0'} {booking.currency || 'HUF'}
                    </Text>
                  </View>
                  <View style={styles.viewDetailsButton}>
                    <Text style={styles.viewDetails}>View Details</Text>
                    <Text style={styles.viewDetailsArrow}>→</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
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
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  // PRO View Styles
  scrollView: {
    flex: 1,
  },
  proHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  proTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  proSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  requestsList: {
    padding: 16,
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
  },
  chatIcon: {
    fontSize: 20,
  },
  customerRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  requestAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  requestAvatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  customerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  customerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingStar: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  serviceName: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  detailsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    gap: 6,
  },
  declineIcon: {
    fontSize: 16,
    color: '#DC2626',
  },
  declineText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#DC2626',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#10B981',
    gap: 6,
  },
  acceptIcon: {
    fontSize: 16,
    color: 'white',
  },
  acceptText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Customer View Styles
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#00BCD4',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#00BCD4',
    fontWeight: '600',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  browseButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  bookingHeaderInfo: {
    flex: 1,
  },
  proName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bookingDetails: {
    marginBottom: 12,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },
  bookingPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetails: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: '600',
    marginRight: 4,
  },
  viewDetailsArrow: {
    fontSize: 16,
    color: '#00BCD4',
  },
});
