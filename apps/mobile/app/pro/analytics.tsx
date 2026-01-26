import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { prosApi, bookingsApi } from '@ozar/shared/apiClient';

const { width } = Dimensions.get('window');

export default function ProAnalyticsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [earnings, setEarnings] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
  });
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    cancelledJobs: 0,
    avgJobValue: 0,
    topService: '',
    responseTime: 0,
    acceptanceRate: 0,
    completionRate: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const profile = await prosApi.getMyProfile();
      const bookingsResult = await bookingsApi.getBookings();
      
      // Ensure bookings is an array
      let bookings = [];
      if (Array.isArray(bookingsResult)) {
        bookings = bookingsResult;
      } else if (bookingsResult && Array.isArray(bookingsResult.data)) {
        bookings = bookingsResult.data;
      } else {
        console.warn('Bookings data is not an array');
        bookings = [];
      }

      // Calculate earnings
      const completedBookings = bookings.filter((b: any) => 
        b.status === 'COMPLETED' || b.status === 'CAPTURED'
      );
      
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

      const totalEarnings = completedBookings.reduce((sum: number, b: any) => 
        sum + (b.servicePrice || 0), 0
      );
      
      const weekEarnings = completedBookings
        .filter((b: any) => new Date(b.createdAt) >= weekAgo)
        .reduce((sum: number, b: any) => sum + (b.servicePrice || 0), 0);
      
      const monthEarnings = completedBookings
        .filter((b: any) => new Date(b.createdAt) >= monthAgo)
        .reduce((sum: number, b: any) => sum + (b.servicePrice || 0), 0);
      
      const yearEarnings = completedBookings
        .filter((b: any) => new Date(b.createdAt) >= yearAgo)
        .reduce((sum: number, b: any) => sum + (b.servicePrice || 0), 0);

      setEarnings({
        total: totalEarnings,
        thisWeek: weekEarnings,
        thisMonth: monthEarnings,
        thisYear: yearEarnings,
      });

      // Calculate stats
      const cancelledJobs = bookings.filter((b: any) => 
        b.status === 'CANCELLED_BY_PRO' || b.status === 'CANCELLED_BY_CUSTOMER'
      ).length;

      const avgJobValue = completedBookings.length > 0
        ? totalEarnings / completedBookings.length
        : 0;

      setStats({
        totalJobs: bookings.length,
        completedJobs: completedBookings.length,
        cancelledJobs,
        avgJobValue,
        topService: 'General Service', // TODO: Calculate from actual data
        responseTime: profile.responseRate || 0,
        acceptanceRate: profile.acceptanceRate || 0,
        completionRate: bookings.length > 0 
          ? Math.round((completedBookings.length / bookings.length) * 100)
          : 0,
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEarningsForRange = () => {
    switch (timeRange) {
      case 'week':
        return earnings.thisWeek;
      case 'month':
        return earnings.thisMonth;
      case 'year':
        return earnings.thisYear;
      default:
        return earnings.thisMonth;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Analytics & Earnings</Text>
          <Text style={styles.subtitle}>Track your performance</Text>
        </View>

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === 'week' && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange('week')}
          >
            <Text style={[styles.timeRangeText, timeRange === 'week' && styles.timeRangeTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === 'month' && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange('month')}
          >
            <Text style={[styles.timeRangeText, timeRange === 'month' && styles.timeRangeTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === 'year' && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange('year')}
          >
            <Text style={[styles.timeRangeText, timeRange === 'year' && styles.timeRangeTextActive]}>
              Year
            </Text>
          </TouchableOpacity>
        </View>

        {/* Earnings Card */}
        <LinearGradient
          colors={['#00BCD4', '#00ACC1']}
          style={styles.earningsCard}
        >
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          <Text style={styles.earningsValue}>{getEarningsForRange().toLocaleString()} Ft</Text>
          <Text style={styles.earningsSubtext}>
            {timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'This Year'}
          </Text>
          
          <View style={styles.earningsBreakdown}>
            <View style={styles.earningsBreakdownItem}>
              <Text style={styles.earningsBreakdownLabel}>All Time</Text>
              <Text style={styles.earningsBreakdownValue}>{earnings.total.toLocaleString()} Ft</Text>
            </View>
            <View style={styles.earningsBreakdownDivider} />
            <View style={styles.earningsBreakdownItem}>
              <Text style={styles.earningsBreakdownLabel}>Avg per Job</Text>
              <Text style={styles.earningsBreakdownValue}>{Math.round(stats.avgJobValue).toLocaleString()} Ft</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text style={styles.metricEmoji}>⚡</Text>
              </View>
              <Text style={styles.metricValue}>{stats.responseTime}%</Text>
              <Text style={styles.metricLabel}>Response Rate</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text style={styles.metricEmoji}>✅</Text>
              </View>
              <Text style={styles.metricValue}>{stats.acceptanceRate}%</Text>
              <Text style={styles.metricLabel}>Accept Rate</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text style={styles.metricEmoji}>🎯</Text>
              </View>
              <Text style={styles.metricValue}>{stats.completionRate}%</Text>
              <Text style={styles.metricLabel}>Completion</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text style={styles.metricEmoji}>📊</Text>
              </View>
              <Text style={styles.metricValue}>{stats.totalJobs}</Text>
              <Text style={styles.metricLabel}>Total Jobs</Text>
            </View>
          </View>
        </View>

        {/* Job Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Statistics</Text>
          
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <Text style={styles.statIcon}>✅</Text>
                <Text style={styles.statLabel}>Completed Jobs</Text>
              </View>
              <Text style={styles.statValue}>{stats.completedJobs}</Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <Text style={styles.statIcon}>❌</Text>
                <Text style={styles.statLabel}>Cancelled Jobs</Text>
              </View>
              <Text style={styles.statValue}>{stats.cancelledJobs}</Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <Text style={styles.statIcon}>🏆</Text>
                <Text style={styles.statLabel}>Top Service</Text>
              </View>
              <Text style={styles.statValue}>{stats.topService}</Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <Text style={styles.statIcon}>💰</Text>
                <Text style={styles.statLabel}>Avg Job Value</Text>
              </View>
              <Text style={styles.statValue}>{Math.round(stats.avgJobValue).toLocaleString()} Ft</Text>
            </View>
          </View>
        </View>

        {/* Earnings Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
          
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>This Week</Text>
              <Text style={styles.breakdownValue}>{earnings.thisWeek.toLocaleString()} Ft</Text>
            </View>
            <View style={styles.breakdownProgress}>
              <View 
                style={[
                  styles.breakdownProgressFill, 
                  { width: `${Math.min((earnings.thisWeek / earnings.total) * 100, 100)}%` }
                ]} 
              />
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>This Month</Text>
              <Text style={styles.breakdownValue}>{earnings.thisMonth.toLocaleString()} Ft</Text>
            </View>
            <View style={styles.breakdownProgress}>
              <View 
                style={[
                  styles.breakdownProgressFill, 
                  { width: `${Math.min((earnings.thisMonth / earnings.total) * 100, 100)}%` }
                ]} 
              />
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>This Year</Text>
              <Text style={styles.breakdownValue}>{earnings.thisYear.toLocaleString()} Ft</Text>
            </View>
            <View style={styles.breakdownProgress}>
              <View 
                style={[
                  styles.breakdownProgressFill, 
                  { width: `${Math.min((earnings.thisYear / earnings.total) * 100, 100)}%` }
                ]} 
              />
            </View>

            <View style={[styles.breakdownRow, styles.breakdownRowTotal]}>
              <Text style={styles.breakdownLabelTotal}>All Time Total</Text>
              <Text style={styles.breakdownValueTotal}>{earnings.total.toLocaleString()} Ft</Text>
            </View>
          </View>
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
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
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
  timeRangeContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  timeRangeButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  timeRangeTextActive: {
    color: 'white',
  },
  earningsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  earningsLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginBottom: 8,
  },
  earningsValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  earningsSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  earningsBreakdown: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
  },
  earningsBreakdownItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningsBreakdownDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  earningsBreakdownLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  earningsBreakdownValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: (width - 48) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricEmoji: {
    fontSize: 24,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  breakdownCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownRowTotal: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  breakdownLabelTotal: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  breakdownValueTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00BCD4',
  },
  breakdownProgress: {
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  breakdownProgressFill: {
    height: '100%',
    backgroundColor: '#00BCD4',
    borderRadius: 3,
  },
});
