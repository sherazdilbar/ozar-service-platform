import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { analyticsApi } from '@ozar/shared/apiClient';

const { width } = Dimensions.get('window');

export default function ProAnalyticsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const result = await analyticsApi.getProDashboard(period);
      setData(result);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load analytics</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAnalytics}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { earnings, bookingTrends, customerInsights, performanceMetrics } = data;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(['week', 'month', 'year'] as const).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodButton, period === p && styles.periodButtonActive]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.periodButtonText, period === p && styles.periodButtonTextActive]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Earnings Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Earnings Overview</Text>
          <View style={styles.earningsGrid}>
            <View style={styles.earningsCard}>
              <Text style={styles.earningsLabel}>Net Earnings</Text>
              <Text style={styles.earningsValue}>
                {earnings.netEarnings.toLocaleString()} {earnings.currency}
              </Text>
            </View>
            <View style={styles.earningsCard}>
              <Text style={styles.earningsLabel}>Total Revenue</Text>
              <Text style={styles.earningsValue}>
                {earnings.totalRevenue.toLocaleString()} {earnings.currency}
              </Text>
            </View>
            <View style={styles.earningsCard}>
              <Text style={styles.earningsLabel}>Platform Fees</Text>
              <Text style={styles.earningsValueSmall}>
                {earnings.totalFees.toLocaleString()} {earnings.currency}
              </Text>
            </View>
            <View style={styles.earningsCard}>
              <Text style={styles.earningsLabel}>Completed Jobs</Text>
              <Text style={styles.earningsValueSmall}>{earnings.completedJobs}</Text>
            </View>
          </View>
        </View>

        {/* Booking Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Booking Trends</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{bookingTrends.total}</Text>
              <Text style={styles.statLabel}>Total Bookings</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{bookingTrends.asapCount}</Text>
              <Text style={styles.statLabel}>ASAP</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{bookingTrends.scheduledCount}</Text>
              <Text style={styles.statLabel}>Scheduled</Text>
            </View>
          </View>

          <View style={styles.statusBreakdown}>
            <Text style={styles.subsectionTitle}>By Status</Text>
            {Object.entries(bookingTrends.byStatus).map(([status, count]) => (
              <View key={status} style={styles.statusRow}>
                <Text style={styles.statusLabel}>{status.replace(/_/g, ' ')}</Text>
                <Text style={styles.statusValue}>{count as number}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Customer Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Customer Insights</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{customerInsights.uniqueCustomers}</Text>
              <Text style={styles.statLabel}>Unique Customers</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{customerInsights.repeatCustomers}</Text>
              <Text style={styles.statLabel}>Repeat Customers</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{customerInsights.repeatRate.toFixed(1)}%</Text>
              <Text style={styles.statLabel}>Repeat Rate</Text>
            </View>
          </View>

          {customerInsights.topCustomers.length > 0 && (
            <View style={styles.topCustomers}>
              <Text style={styles.subsectionTitle}>Top Customers</Text>
              {customerInsights.topCustomers.map((customer: any, idx: number) => (
                <View key={customer.customerId} style={styles.customerRow}>
                  <Text style={styles.customerRank}>#{idx + 1}</Text>
                  <Text style={styles.customerName}>{customer.name}</Text>
                  <Text style={styles.customerCount}>{customer.bookingCount} bookings</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Performance Metrics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{performanceMetrics.averageRating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{performanceMetrics.totalReviews}</Text>
              <Text style={styles.statLabel}>Total Reviews</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{performanceMetrics.completionRate}%</Text>
              <Text style={styles.statLabel}>Completion Rate</Text>
            </View>
          </View>

          <View style={styles.responseTime}>
            <Text style={styles.subsectionTitle}>Average Response Time</Text>
            <Text style={styles.responseTimeValue}>
              {performanceMetrics.averageResponseTime} minutes
            </Text>
          </View>

          {Object.keys(performanceMetrics.ratingDistribution).length > 0 && (
            <View style={styles.ratingDistribution}>
              <Text style={styles.subsectionTitle}>Rating Distribution</Text>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = performanceMetrics.ratingDistribution[rating] || 0;
                const percentage = performanceMetrics.totalReviews > 0
                  ? (count / performanceMetrics.totalReviews) * 100
                  : 0;
                return (
                  <View key={rating} style={styles.ratingRow}>
                    <Text style={styles.ratingLabel}>{rating} ★</Text>
                    <View style={styles.ratingBar}>
                      <View style={[styles.ratingBarFill, { width: `${percentage}%` }]} />
                    </View>
                    <Text style={styles.ratingCount}>{count}</Text>
                  </View>
                );
              })}
            </View>
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
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
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
    color: '#3B82F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#3B82F6',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  earningsCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  earningsLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  earningsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
  },
  earningsValueSmall: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  statusBreakdown: {
    marginTop: 8,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statusLabel: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  topCustomers: {
    marginTop: 16,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  customerRank: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
    width: 40,
  },
  customerName: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  customerCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  responseTime: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  responseTimeValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3B82F6',
  },
  ratingDistribution: {
    marginTop: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    width: 50,
  },
  ratingBar: {
    flex: 1,
    height: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  ratingCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    width: 40,
    textAlign: 'right',
  },
});
