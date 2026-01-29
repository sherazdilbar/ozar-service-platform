import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { jobsApi } from '@ozar/shared/apiClient';
import { CATEGORY_LABELS, CATEGORY_ICONS, ServiceCategory } from '@ozar/shared';

const STATUS_COLORS: Record<string, string> = {
  OPEN: '#10B981',
  BIDDING: '#F59E0B',
  ACCEPTED: '#00BCD4',
  IN_PROGRESS: '#8B5CF6',
  COMPLETED: '#6B7280',
  CANCELLED: '#EF4444',
  EXPIRED: '#9CA3AF',
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Open',
  BIDDING: 'Bidding',
  ACCEPTED: 'Accepted',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
};

export default function MyJobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const loadJobs = async () => {
    try {
      const result = await jobsApi.getMyJobs(filter || undefined);
      setJobs(result || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [filter]);

  const onRefresh = () => {
    setRefreshing(true);
    loadJobs();
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Expiring soon';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Jobs</Text>
        <TouchableOpacity onPress={() => router.push('/job-post')} style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filterTabs}
        contentContainerStyle={styles.filterTabsContent}
      >
        <TouchableOpacity
          style={[styles.filterTab, !filter && styles.filterTabActive]}
          onPress={() => setFilter(null)}
        >
          <Text style={[styles.filterTabText, !filter && styles.filterTabTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'OPEN' && styles.filterTabActive]}
          onPress={() => setFilter('OPEN')}
        >
          <Text style={[styles.filterTabText, filter === 'OPEN' && styles.filterTabTextActive]}>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'ACCEPTED' && styles.filterTabActive]}
          onPress={() => setFilter('ACCEPTED')}
        >
          <Text style={[styles.filterTabText, filter === 'ACCEPTED' && styles.filterTabTextActive]}>Accepted</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'COMPLETED' && styles.filterTabActive]}
          onPress={() => setFilter('COMPLETED')}
        >
          <Text style={[styles.filterTabText, filter === 'COMPLETED' && styles.filterTabTextActive]}>Completed</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Jobs List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#00BCD4" style={{ marginTop: 32 }} />
        ) : jobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Jobs Yet</Text>
            <Text style={styles.emptyText}>Post your first job to get started</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/job-post')}>
              <Text style={styles.emptyButtonText}>Post a Job</Text>
            </TouchableOpacity>
          </View>
        ) : (
          jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={styles.jobCard}
              onPress={() => router.push(`/job-details?id=${job.id}`)}
            >
              {/* Header */}
              <View style={styles.jobHeader}>
                <View style={styles.jobHeaderLeft}>
                  <Text style={styles.jobIcon}>{CATEGORY_ICONS[job.category as ServiceCategory]}</Text>
                  <View style={styles.jobHeaderText}>
                    <Text style={styles.jobTitle} numberOfLines={1}>
                      {job.title}
                    </Text>
                    <Text style={styles.jobCategory}>{CATEGORY_LABELS[job.category as ServiceCategory]}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[job.status] }]}>
                  <Text style={styles.statusText}>{STATUS_LABELS[job.status]}</Text>
                </View>
              </View>

              {/* Description */}
              <Text style={styles.jobDescription} numberOfLines={2}>
                {job.description}
              </Text>

              {/* Info Row */}
              <View style={styles.jobInfo}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>📍</Text>
                  <Text style={styles.infoText}>{job.locationCity}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>💰</Text>
                  <Text style={styles.infoText}>
                    {job.budgetMin && job.budgetMax
                      ? `${job.budgetMin}-${job.budgetMax} Ft`
                      : 'Budget not set'}
                  </Text>
                </View>
              </View>

              {/* Bids Info */}
              {job.status === 'OPEN' && (
                <View style={styles.bidsInfo}>
                  <View style={styles.bidsCount}>
                    <Text style={styles.bidsCountNumber}>{job._count?.bids || 0}</Text>
                    <Text style={styles.bidsCountText}>Bids Received</Text>
                  </View>
                  {job.expiresAt && (
                    <Text style={styles.timeRemaining}>{getTimeRemaining(job.expiresAt)}</Text>
                  )}
                </View>
              )}

              {/* Preview Bids */}
              {job.bids && job.bids.length > 0 && (
                <View style={styles.bidPreview}>
                  <Text style={styles.bidPreviewTitle}>Latest Bids:</Text>
                  {job.bids.slice(0, 2).map((bid: any) => (
                    <View key={bid.id} style={styles.bidPreviewItem}>
                      <Text style={styles.bidPreviewName}>
                        {bid.pro.user.firstName} {bid.pro.user.lastName}
                      </Text>
                      <Text style={styles.bidPreviewPrice}>{bid.proposedPrice} Ft</Text>
                    </View>
                  ))}
                  {job._count?.bids > 2 && (
                    <Text style={styles.bidPreviewMore}>+{job._count.bids - 2} more</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#00BCD4',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00BCD4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  filterTabs: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexGrow: 0,
  },
  filterTabsContent: {
    alignItems: 'center',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: '#00BCD4',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
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
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  jobHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  jobIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  jobHeaderText: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  jobCategory: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  jobDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
  },
  bidsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bidsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bidsCountNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00BCD4',
  },
  bidsCountText: {
    fontSize: 13,
    color: '#6B7280',
  },
  timeRemaining: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  bidPreview: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bidPreviewTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  bidPreviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  bidPreviewName: {
    fontSize: 13,
    color: '#111827',
  },
  bidPreviewPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00BCD4',
  },
  bidPreviewMore: {
    fontSize: 12,
    color: '#00BCD4',
    marginTop: 4,
  },
});
