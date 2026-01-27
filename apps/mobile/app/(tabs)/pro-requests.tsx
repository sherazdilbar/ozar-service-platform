import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { bookingsApi } from '@ozar/shared/apiClient';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function ProRequestsScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [])
  );

  const loadRequests = async () => {
    try {
      const result = await bookingsApi.getBookings();
      // Filter for REQUESTED status only
      const requestedBookings = Array.isArray(result) 
        ? result.filter((b: any) => b.status === 'REQUESTED')
        : result?.data?.filter((b: any) => b.status === 'REQUESTED') || [];
      setRequests(requestedBookings);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await bookingsApi.acceptBooking(bookingId);
      Alert.alert('Success', 'Booking accepted! Customer has been notified.');
      loadRequests();
    } catch (error: any) {
      console.error('Failed to accept booking:', error);
      Alert.alert('Error', error.message || 'Failed to accept booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (bookingId: string) => {
    Alert.prompt(
      'Decline Booking',
      'Please provide a reason (optional):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async (reason) => {
            setActionLoading(bookingId);
            try {
              await bookingsApi.declineBooking(bookingId, reason || 'Not available');
              Alert.alert('Declined', 'Booking has been declined');
              loadRequests();
            } catch (error: any) {
              console.error('Failed to decline booking:', error);
              Alert.alert('Error', error.message || 'Failed to decline booking');
            } finally {
              setActionLoading(null);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleQuickMessage = (bookingId: string, customerId: string) => {
    // Navigate to chat with pre-filled quick messages
    router.push(`/chat/${bookingId}`);
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000 / 60);
    
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hour${Math.floor(diff / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diff / 1440)} day${Math.floor(diff / 1440) > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Booking Requests</Text>
          <Text style={styles.subtitle}>{requests.length} pending requests</Text>
        </View>

        {/* Requests List */}
        <View style={styles.requestsList}>
          {requests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitle}>No Pending Requests</Text>
              <Text style={styles.emptyText}>
                New booking requests will appear here
              </Text>
            </View>
          ) : (
            requests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                {/* Urgency Badge for ASAP */}
                {request.isASAP && (
                  <View style={styles.urgencyBadge}>
                    <Ionicons name="flash" size={14} color="#FFFFFF" />
                    <Text style={styles.urgencyText}>ASAP</Text>
                  </View>
                )}

                {/* Time Badge */}
                <View style={styles.timeRow}>
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text style={styles.timeText}>
                    {getTimeAgo(request.createdAt)}
                  </Text>
                </View>

                {/* Customer Info */}
                <View style={styles.customerRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {request.customer?.firstName?.[0]}{request.customer?.lastName?.[0]}
                    </Text>
                  </View>
                  <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>
                      {request.customer?.firstName} {request.customer?.lastName}
                    </Text>
                    <Text style={styles.serviceName}>{request.service?.name || 'Service Request'}</Text>
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={14} color="#6B7280" />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {request.locationCity}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.chatIconButton}
                    onPress={() => handleQuickMessage(request.id, request.customer.id)}
                  >
                    <Ionicons name="chatbubble-outline" size={22} color="#3B82F6" />
                  </TouchableOpacity>
                </View>

                {/* Description */}
                <Text style={styles.description} numberOfLines={3}>
                  {request.description}
                </Text>

                {/* Details Grid */}
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {request.isASAP ? 'ASAP' : new Date(request.scheduledFor).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={18} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {request.service?.duration || 120} min
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="cash-outline" size={18} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {request.total || request.servicePrice || 0} Ft
                    </Text>
                  </View>
                </View>

                {/* Quick Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.declineButton}
                    onPress={() => handleDecline(request.id)}
                    disabled={actionLoading === request.id}
                  >
                    {actionLoading === request.id ? (
                      <ActivityIndicator size="small" color="#DC2626" />
                    ) : (
                      <>
                        <Ionicons name="close-circle-outline" size={20} color="#DC2626" />
                        <Text style={styles.declineText}>Decline</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.acceptButton}
                    onPress={() => handleAccept(request.id)}
                    disabled={actionLoading === request.id}
                  >
                    {actionLoading === request.id ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                        <Text style={styles.acceptText}>Accept</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {/* View Details Link */}
                <TouchableOpacity 
                  style={styles.viewDetailsButton}
                  onPress={() => router.push(`/booking/${request.id}`)}
                >
                  <Text style={styles.viewDetailsText}>View Full Details</Text>
                  <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  requestsList: {
    padding: 16,
    gap: 16,
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  urgencyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  customerRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3B82F6',
  },
  customerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  chatIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  declineButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    gap: 6,
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
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    gap: 6,
  },
  acceptText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
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
});
