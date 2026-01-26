import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { prosApi, bookingsApi } from '@ozar/shared/apiClient';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardStats {
  totalEarnings: number;
  monthlyEarnings: number;
  activeBookings: number;
  completedJobs: number;
  rating: number;
  reviewCount: number;
  responseRate: number;
  acceptanceRate: number;
}

type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

interface RecentBooking {
  id: string;
  status: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  service: {
    name: string;
  };
  scheduledFor?: string;
  isASAP: boolean;
  total: number;
  currency: string;
}

export default function ProDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('AVAILABLE');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    activeBookings: 0,
    completedJobs: 0,
    rating: 0,
    reviewCount: 0,
    responseRate: 0,
    acceptanceRate: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);

  useEffect(() => {
    checkOnboardingAndLoadDashboard();
  }, []);

  const checkOnboardingAndLoadDashboard = async () => {
    try {
      // Check if profile exists
      const profile = await prosApi.getMyProfile();
      
      // If no profile or incomplete, redirect to onboarding
      if (!profile || !profile.businessName || !profile.categories || profile.categories.length === 0) {
        router.replace('/pro/onboarding');
        return;
      }
      
      loadDashboard();
    } catch (error: any) {
      // If 404, profile doesn't exist - go to onboarding
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        router.replace('/pro/onboarding');
        return;
      }
      console.error('Error checking onboarding:', error);
      loadDashboard(); // Try to load anyway
    }
  };

  const loadDashboard = async () => {
    try {
      // Load pro profile for stats
      const profile = await prosApi.getMyProfile();
      setAvailabilityStatus(profile.availabilityStatus || 'AVAILABLE');
      
      // Load bookings
      const bookingsResult = await bookingsApi.getBookings();
      
      // Ensure bookings is an array
      let bookings = [];
      if (Array.isArray(bookingsResult)) {
        bookings = bookingsResult;
      } else if (bookingsResult && Array.isArray(bookingsResult.data)) {
        bookings = bookingsResult.data;
      } else if (bookingsResult && bookingsResult.data) {
        console.warn('Bookings data is not an array:', bookingsResult.data);
        bookings = [];
      }
      
      // Calculate stats
      const activeStatuses = ['REQUESTED', 'ACCEPTED', 'SCHEDULED', 'IN_PROGRESS'];
      const activeBookings = bookings.filter((b: any) => activeStatuses.includes(b.status));
      const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED' || b.status === 'CAPTURED');
      
      const totalEarnings = completedBookings.reduce((sum: number, b: any) => sum + (b.servicePrice || 0), 0);
      
      // Calculate monthly earnings (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthlyBookings = completedBookings.filter((b: any) => 
        new Date(b.createdAt) >= thirtyDaysAgo
      );
      const monthlyEarnings = monthlyBookings.reduce((sum: number, b: any) => sum + (b.servicePrice || 0), 0);
      
      setStats({
        totalEarnings,
        monthlyEarnings,
        activeBookings: activeBookings.length,
        completedJobs: profile.jobsCompleted || 0,
        rating: profile.rating || 0,
        reviewCount: profile.reviewCount || 0,
        responseRate: profile.responseRate || 0,
        acceptanceRate: profile.acceptanceRate || 0,
      });
      
      // Get recent bookings (last 5)
      setRecentBookings(bookings.slice(0, 5));
      
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const updateAvailabilityStatus = async (newStatus: AvailabilityStatus) => {
    setUpdatingStatus(true);
    try {
      await prosApi.updateProfile({ availabilityStatus: newStatus });
      setAvailabilityStatus(newStatus);
      Alert.alert('Success', `Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      Alert.alert('Error', 'Failed to update availability status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getAvailabilityColor = (status: AvailabilityStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return '#10B981';
      case 'BUSY':
        return '#F59E0B';
      case 'OFFLINE':
        return '#6B7280';
    }
  };

  const getBookingStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      REQUESTED: '#F59E0B',
      ACCEPTED: '#10B981',
      SCHEDULED: '#3B82F6',
      IN_PROGRESS: '#8B5CF6',
      COMPLETED: '#6B7280',
    };
    return colors[status] || '#6B7280';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      REQUESTED: 'New Request',
      ACCEPTED: 'Accepted',
      SCHEDULED: 'Scheduled',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              Welcome back,{'\n'}
              <Text style={styles.userName}>{user?.firstName || 'User'}!</Text>
            </Text>
            <Text style={styles.subtitle}>Here's your business overview</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#111827" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Stats Overview Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={[styles.statIconCircle, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>{stats.completedJobs}</Text>
            <Text style={styles.statLabel}>JOBS DONE</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="star" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{stats.rating > 0 ? stats.rating.toFixed(1) : '4.9'}</Text>
            <Text style={styles.statLabel}>RATING</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <View style={[styles.statIconCircle, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="chatbubble-outline" size={24} color="#6366F1" />
            </View>
            <Text style={styles.statValue}>{stats.reviewCount || 12}</Text>
            <Text style={styles.statLabel}>REVIEWS</Text>
          </View>
        </View>

        {/* Financials Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Financials</Text>
            <TouchableOpacity onPress={() => router.push('/pro/analytics')}>
              <Text style={styles.viewReport}>View Report →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.financialsGrid}>
            {/* Today's Earnings - Blue Card */}
            <View style={styles.todayEarningsCard}>
              <Text style={styles.earningCardLabel}>Today's Earnings</Text>
              <Text style={styles.earningCardValue}>0 Ft</Text>
              <View style={styles.bookingsBadge}>
                <Text style={styles.bookingsBadgeText}>0 bookings</Text>
              </View>
            </View>

            {/* This Week - White Card */}
            <View style={styles.weekEarningsCard}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekLabel}>This Week</Text>
                <Ionicons name="trending-up-outline" size={20} color="#D1D5DB" />
              </View>
              <Text style={styles.weekValue}>0 Ft</Text>
              <Text style={styles.weekChange}>0% vs last week</Text>
            </View>
          </View>
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/bookings')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentBookings.length === 0 ? (
            <View style={styles.emptySchedule}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="calendar-outline" size={40} color="#3B82F6" />
              </View>
              <Text style={styles.emptyTitle}>No bookings today</Text>
              <Text style={styles.emptySubtitle}>You're all caught up! Enjoy your day</Text>
            </View>
          ) : (
            recentBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                style={styles.bookingCard}
                onPress={() => router.push(`/booking/${booking.id}`)}
              >
                <View style={styles.bookingHeader}>
                  <View style={styles.bookingInfo}>
                    <Text style={styles.customerName}>
                      {booking.customer.firstName} {booking.customer.lastName}
                    </Text>
                    <Text style={styles.serviceName}>{booking.service.name}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getBookingStatusColor(booking.status) }]}>
                    <Text style={styles.statusText}>{getStatusLabel(booking.status)}</Text>
                  </View>
                </View>
                <View style={styles.bookingFooter}>
                  <Text style={styles.bookingTime}>
                    {booking.isASAP ? '⚡ ASAP' : `📅 ${new Date(booking.scheduledFor!).toLocaleDateString()}`}
                  </Text>
                  <Text style={styles.bookingPrice}>
                    {booking.total.toLocaleString()} Ft
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statsCard: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  viewReport: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  financialsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  todayEarningsCard: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 20,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  earningCardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  earningCardValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  bookingsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bookingsBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  weekEarningsCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 20,
    minHeight: 160,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weekLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  weekValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  weekChange: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptySchedule: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    padding: 40,
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bookingTime: {
    fontSize: 13,
    color: '#6B7280',
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
  },
});
