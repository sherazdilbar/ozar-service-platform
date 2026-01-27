import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
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
  const [availabilityStatus, setAvailabilityStatus] = useState<'AVAILABLE_NOW' | 'BUSY' | 'OFFLINE'>('OFFLINE');
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    try {
      // Load profile data
      const profileData = await prosApi.getMyProfile();
      setProfile(profileData);
      setAvailabilityStatus(profileData.availabilityStatus || 'OFFLINE');
      
      // Check if onboarding is completed
      if (!profileData.onboardingCompleted) {
        router.replace('/pro/onboarding');
        return;
      }
      
      // Check verification status - if PENDING, show pending screen
      if (profileData.verificationStatus === 'PENDING') {
        setLoading(false);
        return; // Don't load bookings, just show pending state
      }
      
      // Load today's scheduled bookings
      const bookingsData = await bookingsApi.getBookings();
      const today = new Date().toDateString();
      
      // Show ACCEPTED, SCHEDULED, and IN_PROGRESS bookings for today
      const todayBookings = (bookingsData.data || []).filter((booking: any) => {
        // Include if status is active
        const isActive = ['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS'].includes(booking.status);
        if (!isActive) return false;
        
        // If ASAP, show it
        if (booking.isASAP) return true;
        
        // If scheduled for today, show it
        if (booking.scheduledFor) {
          return new Date(booking.scheduledFor).toDateString() === today;
        }
        
        // If accepted today (no specific schedule), show it
        if (booking.acceptedAt) {
          return new Date(booking.acceptedAt).toDateString() === today;
        }
        
        return false;
      });
      setTodaySchedule(todayBookings.slice(0, 3));

      // Calculate earnings (this would come from a real earnings API)
      const completedToday = (bookingsData.data || []).filter((b: any) => 
        b.status === 'COMPLETED' && 
        b.completedAt &&
        new Date(b.completedAt).toDateString() === today
      );
      const todayTotal = completedToday.reduce((sum: number, b: any) => sum + (b.total || 0), 0);
      
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

  // Format number with k notation
  const formatEarnings = (amount: number): string => {
    if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + 'k';
    }
    return amount.toFixed(0);
  };

  const toggleAvailability = async () => {
    const newStatus = availabilityStatus === 'AVAILABLE_NOW' ? 'OFFLINE' : 'AVAILABLE_NOW';
    setUpdatingAvailability(true);
    try {
      await prosApi.updateProfile({ availabilityStatus: newStatus });
      setAvailabilityStatus(newStatus);
    } catch (error) {
      console.error('Failed to update availability:', error);
      Alert.alert('Error', 'Failed to update availability status');
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const getAvailabilityColor = () => {
    return availabilityStatus === 'AVAILABLE_NOW' ? '#10B981' : '#6B7280';
  };

  const getAvailabilityText = () => {
    return availabilityStatus === 'AVAILABLE_NOW' ? 'Available Now' : 'Offline';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
      </View>
    );
  }

  // Show pending approval screen
  if (profile && profile.verificationStatus === 'PENDING') {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>
                Welcome,{'\n'}
                <Text style={styles.userName}>{user?.firstName || 'User'}!</Text>
              </Text>
              <Text style={styles.subtitle}>Your professional journey begins here</Text>
            </View>
          </View>

          {/* Pending Approval Card */}
          <View style={styles.pendingContainer}>
            <View style={styles.pendingIconCircle}>
              <Text style={styles.pendingIcon}>⏳</Text>
            </View>
            <Text style={styles.pendingTitle}>Application Under Review</Text>
            <Text style={styles.pendingMessage}>
              Thank you for submitting your professional application! Our team is currently reviewing your profile.
            </Text>
            <Text style={styles.pendingSubtext}>
              You'll receive a notification once your application is approved. This usually takes 24-48 hours.
            </Text>

            {/* What's Next Section */}
            <View style={styles.whatsNextCard}>
              <Text style={styles.whatsNextTitle}>While You Wait</Text>
              <View style={styles.whatsNextList}>
                <View style={styles.whatsNextItem}>
                  <Text style={styles.whatsNextIcon}>✓</Text>
                  <Text style={styles.whatsNextText}>Your profile has been created</Text>
                </View>
                <View style={styles.whatsNextItem}>
                  <Text style={styles.whatsNextIcon}>✓</Text>
                  <Text style={styles.whatsNextText}>Application submitted successfully</Text>
                </View>
                <View style={styles.whatsNextItem}>
                  <Text style={styles.whatsNextIcon}>⏳</Text>
                  <Text style={styles.whatsNextText}>Admin review in progress</Text>
                </View>
                <View style={styles.whatsNextItem}>
                  <Text style={styles.whatsNextIcon}>📧</Text>
                  <Text style={styles.whatsNextText}>You'll be notified via email</Text>
                </View>
              </View>
            </View>

            {/* Profile Summary */}
            <View style={styles.profileSummaryCard}>
              <Text style={styles.profileSummaryTitle}>Your Profile</Text>
              <View style={styles.profileSummaryRow}>
                <Text style={styles.profileSummaryLabel}>Business Name:</Text>
                <Text style={styles.profileSummaryValue}>{profile.businessName || 'Not set'}</Text>
              </View>
              <View style={styles.profileSummaryRow}>
                <Text style={styles.profileSummaryLabel}>Experience:</Text>
                <Text style={styles.profileSummaryValue}>{profile.yearsExperience} years</Text>
              </View>
              <View style={styles.profileSummaryRow}>
                <Text style={styles.profileSummaryLabel}>Services:</Text>
                <Text style={styles.profileSummaryValue}>{profile.categories?.length || 0} categories</Text>
              </View>
              <View style={styles.profileSummaryRow}>
                <Text style={styles.profileSummaryLabel}>Location:</Text>
                <Text style={styles.profileSummaryValue}>{profile.locationCity}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => router.push('/pro/profile-edit')}
            >
              <Ionicons name="create-outline" size={20} color="#3B82F6" />
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.contactSupportButton}
              onPress={() => Alert.alert('Support', 'Contact us at support@ozar.com')}
            >
              <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
              <Text style={styles.contactSupportButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              Welcome back,{'\n'}
              <Text style={styles.userName}>{user?.firstName || 'User'}!</Text>
            </Text>
            <Text style={styles.subtitle}>Here's your business overview</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => router.push('/notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color="#111827" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Availability Toggle Card */}
        <View style={styles.availabilityCard}>
          <View style={styles.availabilityLeft}>
            <View style={[styles.availabilityDot, { backgroundColor: getAvailabilityColor() }]} />
            <View>
              <Text style={styles.availabilityLabel}>Status</Text>
              <Text style={styles.availabilityStatus}>{getAvailabilityText()}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.availabilityToggle,
              availabilityStatus === 'AVAILABLE_NOW' && styles.availabilityToggleActive
            ]}
            onPress={toggleAvailability}
            disabled={updatingAvailability}
          >
            {updatingAvailability ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons 
                  name={availabilityStatus === 'AVAILABLE_NOW' ? 'checkmark-circle' : 'power'} 
                  size={20} 
                  color="#FFFFFF" 
                />
                <Text style={styles.availabilityToggleText}>
                  {availabilityStatus === 'AVAILABLE_NOW' ? 'Go Offline' : 'Go Online'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={[styles.statIconCircle, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>{jobsCompleted}</Text>
            <Text style={styles.statLabel}>JOBS DONE</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="star" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{rating > 0 ? rating.toFixed(1) : '0.0'}</Text>
            <Text style={styles.statLabel}>RATING</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIconCircle, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="chatbubble-outline" size={24} color="#6366F1" />
            </View>
            <Text style={styles.statValue}>{reviewCount}</Text>
            <Text style={styles.statLabel}>REVIEWS</Text>
          </View>
        </View>

        {/* Financials Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Financials</Text>
            <TouchableOpacity onPress={() => router.push('/pro/analytics')}>
              <Text style={styles.viewAllText}>View Report →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.earningsRow}>
            {/* Today's Earnings - Blue Card */}
            <View style={styles.todayCard}>
              <Text style={styles.earningLabel}>Today's Earnings</Text>
              <Text style={styles.earningAmount}>{formatEarnings(stats.todayEarnings)} Ft</Text>
              <View style={styles.bookingsBadge}>
                <Text style={styles.bookingsBadgeText}>{stats.todayBookings} bookings</Text>
              </View>
            </View>

            {/* This Week - White Card */}
            <View style={styles.weekCard}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekLabel}>This Week</Text>
                <Ionicons name="trending-up-outline" size={20} color="#D1D5DB" />
              </View>
              <Text style={styles.weekAmount}>{formatEarnings(stats.weekEarnings)} Ft</Text>
              <Text style={styles.weekGrowth}>{stats.weekGrowth}% vs last week</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/pro/services')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="briefcase-outline" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.quickActionTitle}>Services</Text>
              <Text style={styles.quickActionSubtitle}>Manage offerings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/pro/portfolio')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="images-outline" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.quickActionTitle}>Portfolio</Text>
              <Text style={styles.quickActionSubtitle}>Showcase work</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/pro/customers')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FCE7F3' }]}>
                <Ionicons name="people-outline" size={24} color="#EC4899" />
              </View>
              <Text style={styles.quickActionTitle}>Customers</Text>
              <Text style={styles.quickActionSubtitle}>Manage clients</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/pro/reviews')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="star-outline" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.quickActionTitle}>Reviews</Text>
              <Text style={styles.quickActionSubtitle}>Manage feedback</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/pro/profile-edit')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E0E7FF' }]}>
                <Ionicons name="person-outline" size={24} color="#6366F1" />
              </View>
              <Text style={styles.quickActionTitle}>Profile</Text>
              <Text style={styles.quickActionSubtitle}>Edit details</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/pro/analytics')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="stats-chart-outline" size={24} color="#10B981" />
              </View>
              <Text style={styles.quickActionTitle}>Analytics</Text>
              <Text style={styles.quickActionSubtitle}>View insights</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/bookings')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {todaySchedule.length === 0 ? (
            <View style={styles.emptySchedule}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="calendar-outline" size={40} color="#3B82F6" />
              </View>
              <Text style={styles.emptyTitle}>No bookings today</Text>
              <Text style={styles.emptySubtitle}>You're all caught up! Enjoy your day</Text>
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
                    {booking.pricing?.total || booking.service?.price || 0} Ft
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
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
  availabilityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  availabilityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  availabilityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  availabilityLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  availabilityStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  availabilityToggleActive: {
    backgroundColor: '#10B981',
  },
  availabilityToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  earningsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  todayCard: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 20,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  earningLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  earningAmount: {
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
  weekCard: {
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
  weekAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  weekGrowth: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
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
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
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
    color: '#3B82F6',
  },
  pendingContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  pendingIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  pendingIcon: {
    fontSize: 64,
  },
  pendingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  pendingMessage: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  pendingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  whatsNextCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  whatsNextTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 16,
  },
  whatsNextList: {
    gap: 12,
  },
  whatsNextItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatsNextIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  whatsNextText: {
    fontSize: 14,
    color: '#1E40AF',
    flex: 1,
  },
  profileSummaryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  profileSummaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  profileSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileSummaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  profileSummaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
    gap: 8,
  },
  editProfileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  contactSupportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  contactSupportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});
