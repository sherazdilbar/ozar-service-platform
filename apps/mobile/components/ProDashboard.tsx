import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { prosApi, bookingsApi } from '@ozar/shared/apiClient';

export default function ProDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    todayBookings: 0,
    weekEarnings: 0,
    weekGrowth: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load profile data
      const profileData = await prosApi.getMyProfile();
      setProfile(profileData);
      
      // Load today's scheduled bookings
      const bookingsData = await bookingsApi.getBookings();
      const today = new Date().toDateString();
      const todayBookings = (bookingsData || []).filter((booking: any) => {
        if (!booking.scheduledFor) return false;
        return new Date(booking.scheduledFor).toDateString() === today;
      });
      setTodaySchedule(todayBookings.slice(0, 3));

      // Calculate earnings (this would come from a real earnings API)
      const completedToday = (bookingsData || []).filter((b: any) => 
        b.status === 'COMPLETED' && 
        new Date(b.completedAt).toDateString() === today
      );
      const todayTotal = completedToday.reduce((sum: number, b: any) => sum + (b.pricing?.total || 0), 0);
      
      setStats({
        todayEarnings: todayTotal,
        todayBookings: completedToday.length,
        weekEarnings: todayTotal * 5, // Simplified calculation
        weekGrowth: 12, // This would come from analytics API
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  // Check if profile exists (new PRO might not have profile yet)
  const hasProfile = profile && profile.id;
  const jobsCompleted = profile?.jobsCompleted || 0;
  const rating = profile?.rating || 0;
  const reviewCount = profile?.reviewCount || 0;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Gradient Header */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome back, {user?.firstName}!</Text>
              <Text style={styles.headerSubtext}>Here's your business overview</Text>
            </View>
            <TouchableOpacity style={styles.waveButton}>
              <Text style={styles.waveEmoji}>👋</Text>
            </TouchableOpacity>
          </View>

          {/* Earnings Cards */}
          <View style={styles.earningsRow}>
            <View style={styles.earningCard}>
              <View style={styles.earningHeader}>
                <Text style={styles.earningLabel}>Today's{'\n'}Earnings</Text>
                <Text style={styles.earningIcon}>💰</Text>
              </View>
              <Text style={styles.earningAmount}>
                ${stats.todayEarnings.toFixed(2)}
              </Text>
              <Text style={styles.earningDetail}>
                {stats.todayBookings} booking{stats.todayBookings !== 1 ? 's' : ''}
              </Text>
            </View>

            <View style={styles.earningCard}>
              <View style={styles.earningHeader}>
                <Text style={styles.earningLabel}>This Week</Text>
                <Text style={styles.earningIcon}>📈</Text>
              </View>
              <Text style={styles.earningAmount}>
                ${stats.weekEarnings.toFixed(2)}
              </Text>
              <Text style={styles.earningGrowth}>
                {stats.weekGrowth > 0 ? '+' : ''}{stats.weekGrowth}% from last week
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>📅</Text>
            </View>
            <Text style={styles.statValue}>{jobsCompleted}</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.statIcon}>⭐</Text>
            </View>
            <Text style={styles.statValue}>{rating > 0 ? rating.toFixed(1) : '0.0'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: '#D1FAE5' }]}>
              <Text style={styles.statIcon}>👥</Text>
            </View>
            <Text style={styles.statValue}>{reviewCount}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Setup Profile CTA for new pros */}
        {!hasProfile && (
          <View style={styles.setupCard}>
            <Text style={styles.setupIcon}>🚀</Text>
            <Text style={styles.setupTitle}>Complete Your Profile</Text>
            <Text style={styles.setupText}>
              Set up your professional profile to start receiving booking requests
            </Text>
            <TouchableOpacity 
              style={styles.setupButton}
              onPress={() => router.push('/pro/profile-edit')}
            >
              <Text style={styles.setupButtonText}>Setup Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Today's Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity onPress={() => router.push('/pro-requests')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {todaySchedule.length === 0 ? (
            <View style={styles.emptySchedule}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>No bookings scheduled for today</Text>
            </View>
          ) : (
            todaySchedule.map((booking) => (
              <TouchableOpacity 
                key={booking.id} 
                style={styles.scheduleCard}
                onPress={() => router.push(`/booking/${booking.id}`)}
              >
                <View style={styles.scheduleRow}>
                  <View style={styles.customerAvatar}>
                    <Text style={styles.avatarText}>
                      {booking.customer?.firstName?.[0]}{booking.customer?.lastName?.[0]}
                    </Text>
                  </View>
                  <View style={styles.scheduleInfo}>
                    <Text style={styles.customerName}>
                      {booking.customer?.firstName} {booking.customer?.lastName}
                    </Text>
                    <Text style={styles.serviceName}>{booking.service?.name || 'Service'}</Text>
                  </View>
                  <Text style={styles.bookingPrice}>
                    ${booking.pricing?.total || booking.service?.price || 0}
                  </Text>
                </View>
                <View style={styles.scheduleTime}>
                  <Text style={styles.timeIcon}>🕐</Text>
                  <Text style={styles.timeText}>
                    {booking.scheduledFor ? new Date(booking.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ASAP'} • {booking.service?.duration || 60} min
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Recent Reviews - Only show if there are reviews */}
        {reviewCount > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Reviews</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.reviewCard}>
              <Text style={styles.noReviewsText}>
                Reviews will appear here once customers rate your services
              </Text>
            </View>
          </View>
        )}

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
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  waveButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveEmoji: {
    fontSize: 24,
  },
  earningsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  earningCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
  },
  earningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  earningLabel: {
    fontSize: 13,
    color: 'white',
    fontWeight: '500',
  },
  earningIcon: {
    fontSize: 20,
  },
  earningAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  earningDetail: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  earningGrowth: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
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
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  emptySchedule: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'white',
    borderRadius: 16,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  scheduleCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  scheduleInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  serviceName: {
    fontSize: 13,
    color: '#6B7280',
  },
  bookingPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5',
  },
  scheduleTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  timeText: {
    fontSize: 13,
    color: '#6B7280',
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  reviewTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  setupCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  setupIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  setupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  setupText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  setupButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  setupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  noReviewsText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    padding: 20,
  },
});
