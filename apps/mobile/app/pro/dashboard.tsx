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
import { LinearGradient } from 'expo-linear-gradient';
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
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Load pro profile for stats
      const profile = await prosApi.getMyProfile();
      
      // Load bookings
      const bookingsResult = await bookingsApi.getBookings();
      const bookings = bookingsResult.data || [];
      
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

  const getStatusColor = (status: string) => {
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B35']} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={['#FF6B35', '#FF8C61']}
          style={styles.header}
        >
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.firstName}! 👋</Text>
          
          <View style={styles.ratingCard}>
            <View style={styles.ratingLeft}>
              <Text style={styles.ratingValue}>★ {stats.rating.toFixed(1)}</Text>
              <Text style={styles.ratingLabel}>{stats.reviewCount} reviews</Text>
            </View>
            <View style={styles.ratingDivider} />
            <View style={styles.ratingRight}>
              <Text style={styles.jobsValue}>{stats.completedJobs}</Text>
              <Text style={styles.jobsLabel}>Jobs Done</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Earnings Cards */}
        <View style={styles.earningsSection}>
          <View style={styles.earningCard}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.earningGradient}
            >
              <Text style={styles.earningLabel}>Total Earnings</Text>
              <Text style={styles.earningValue}>
                {stats.totalEarnings.toLocaleString()} HUF
              </Text>
            </LinearGradient>
          </View>
          
          <View style={styles.earningCard}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.earningGradient}
            >
              <Text style={styles.earningLabel}>This Month</Text>
              <Text style={styles.earningValue}>
                {stats.monthlyEarnings.toLocaleString()} HUF
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Text style={styles.statEmoji}>📋</Text>
            </View>
            <Text style={styles.statValue}>{stats.activeBookings}</Text>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Text style={styles.statEmoji}>✅</Text>
            </View>
            <Text style={styles.statValue}>{stats.acceptanceRate}%</Text>
            <Text style={styles.statLabel}>Accept Rate</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Text style={styles.statEmoji}>⚡</Text>
            </View>
            <Text style={styles.statValue}>{stats.responseRate}%</Text>
            <Text style={styles.statLabel}>Response Rate</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/bookings')}
            >
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionEmoji}>📅</Text>
                <Text style={styles.actionText}>View Bookings</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/pro/services')}
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionEmoji}>🛠️</Text>
                <Text style={styles.actionText}>My Services</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/pro/profile-edit')}
            >
              <LinearGradient
                colors={['#06B6D4', '#0891B2']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionEmoji}>👤</Text>
                <Text style={styles.actionText}>Edit Profile</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/chat')}
            >
              <LinearGradient
                colors={['#EC4899', '#DB2777']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionEmoji}>💬</Text>
                <Text style={styles.actionText}>Messages</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/bookings')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>

          {recentBookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No recent bookings</Text>
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
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                    <Text style={styles.statusText}>{getStatusLabel(booking.status)}</Text>
                  </View>
                </View>
                <View style={styles.bookingFooter}>
                  <Text style={styles.bookingTime}>
                    {booking.isASAP ? '⚡ ASAP' : `📅 ${new Date(booking.scheduledFor!).toLocaleDateString()}`}
                  </Text>
                  <Text style={styles.bookingPrice}>
                    {booking.total.toLocaleString()} {booking.currency}
                  </Text>
                </View>
              </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  ratingCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  ratingLeft: {
    flex: 1,
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  ratingLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  ratingDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  ratingRight: {
    flex: 1,
    alignItems: 'center',
  },
  jobsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  jobsLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  earningsSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  earningCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  earningGradient: {
    padding: 16,
  },
  earningLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    fontWeight: '600',
  },
  earningValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  bookingTime: {
    fontSize: 13,
    color: '#6b7280',
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
});
