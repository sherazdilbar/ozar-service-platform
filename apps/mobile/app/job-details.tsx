import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, TextInput, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { jobsApi } from '@ozar/shared/apiClient';
import { CATEGORY_LABELS, CATEGORY_ICONS, ServiceCategory } from '@ozar/shared';
import { useAuth } from '../contexts/AuthContext';

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

const URGENCY_ICONS: Record<string, string> = {
  ASAP: '🔥',
  THIS_WEEK: '📅',
  FLEXIBLE: '⏰',
};

export default function JobDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const jobId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidPrice, setBidPrice] = useState('');
  const [bidDuration, setBidDuration] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [showBidSuccess, setShowBidSuccess] = useState(false);

  useEffect(() => {
    console.log('🔍 Job Details - params:', params);
    console.log('🔍 Job Details - jobId:', jobId);
    if (jobId) {
      loadJob();
    } else {
      console.error('❌ No job ID provided');
      setLoading(false);
    }
  }, [jobId]);

  const loadJob = async () => {
    try {
      console.log('📡 Loading job with ID:', jobId);
      const result = await jobsApi.getJobById(jobId as string);
      console.log('✅ Job loaded:', result);
      setJob(result);
    } catch (error) {
      console.error('❌ Failed to load job:', error);
      Alert.alert('Error', 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    console.log('🔵 Accept bid clicked, bidId:', bidId);
    
    // For web, use window.confirm instead of Alert.alert
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to accept this bid? This will create a booking.');
      if (!confirmed) return;
      
      console.log('🔵 User confirmed, accepting bid...');
      setActionLoading(true);
      try {
        console.log('📡 Calling acceptBid API...');
        const result = await jobsApi.acceptBid(bidId);
        console.log('✅ Bid accepted successfully:', result);
        window.alert('Bid accepted! A booking has been created.');
        router.push('/(tabs)/bookings');
      } catch (error: any) {
        console.error('❌ Failed to accept bid:', error);
        window.alert(error.message || 'Failed to accept bid');
      } finally {
        setActionLoading(false);
      }
    } else {
      Alert.alert(
        'Accept Bid',
        'Are you sure you want to accept this bid? This will create a booking.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Accept',
            onPress: async () => {
              console.log('🔵 User confirmed, accepting bid...');
              setActionLoading(true);
              try {
                console.log('📡 Calling acceptBid API...');
                const result = await jobsApi.acceptBid(bidId);
                console.log('✅ Bid accepted successfully:', result);
                Alert.alert('Success', 'Bid accepted! A booking has been created.', [
                  { text: 'OK', onPress: () => router.push('/(tabs)/bookings') },
                ]);
              } catch (error: any) {
                console.error('❌ Failed to accept bid:', error);
                Alert.alert('Error', error.message || 'Failed to accept bid');
              } finally {
                setActionLoading(false);
              }
            },
          },
        ]
      );
    }
  };

  const handleRejectBid = async (bidId: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to reject this bid?');
      if (!confirmed) return;
      
      setActionLoading(true);
      try {
        await jobsApi.rejectBid(bidId);
        loadJob();
        window.alert('Bid rejected');
      } catch (error: any) {
        window.alert(error.message || 'Failed to reject bid');
      } finally {
        setActionLoading(false);
      }
    } else {
      Alert.alert(
        'Reject Bid',
        'Are you sure you want to reject this bid?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reject',
            style: 'destructive',
            onPress: async () => {
              setActionLoading(true);
              try {
                await jobsApi.rejectBid(bidId);
                loadJob();
                Alert.alert('Success', 'Bid rejected');
              } catch (error: any) {
                Alert.alert('Error', error.message || 'Failed to reject bid');
              } finally {
                setActionLoading(false);
              }
            },
          },
        ]
      );
    }
  };

  const handleCancelJob = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to cancel this job? This action cannot be undone.');
      if (!confirmed) return;
      
      setActionLoading(true);
      try {
        await jobsApi.cancelJob(jobId as string);
        window.alert('Job cancelled');
        router.back();
      } catch (error: any) {
        window.alert(error.message || 'Failed to cancel job');
      } finally {
        setActionLoading(false);
      }
    } else {
      Alert.alert(
        'Cancel Job',
        'Are you sure you want to cancel this job? This action cannot be undone.',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: async () => {
              setActionLoading(true);
              try {
                await jobsApi.cancelJob(jobId as string);
                Alert.alert('Success', 'Job cancelled', [
                  { text: 'OK', onPress: () => router.back() },
                ]);
              } catch (error: any) {
                Alert.alert('Error', error.message || 'Failed to cancel job');
              } finally {
                setActionLoading(false);
              }
            },
          },
        ]
      );
    }
  };

  const handleSubmitBid = async () => {
    // Validate price
    if (!bidPrice || parseFloat(bidPrice) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    // Validate duration (required, minimum 15 minutes)
    if (!bidDuration || parseFloat(bidDuration) < 15) {
      Alert.alert('Error', 'Please enter estimated duration (minimum 15 minutes)');
      return;
    }

    // Validate message (required, 20-500 characters)
    if (!bidMessage || bidMessage.trim().length < 20) {
      Alert.alert('Error', 'Please enter a message (minimum 20 characters)');
      return;
    }

    if (bidMessage.trim().length > 500) {
      Alert.alert('Error', 'Message is too long (maximum 500 characters)');
      return;
    }

    setActionLoading(true);
    try {
      await jobsApi.createBid({
        jobId: jobId as string,
        proposedPrice: parseFloat(bidPrice),
        estimatedDuration: parseFloat(bidDuration),
        message: bidMessage.trim(),
      });
      
      // Show success state
      setShowBidSuccess(true);
      setShowBidForm(false);
      
      // Reset form
      setBidPrice('');
      setBidDuration('');
      setBidMessage('');
      
      // Reload job to show the new bid
      await loadJob();
    } catch (error: any) {
      console.error('Bid submission error:', error);
      Alert.alert('Error', error.message || 'Failed to submit bid');
    } finally {
      setActionLoading(false);
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    return 'Expiring soon';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <ActivityIndicator size="large" color="#00BCD4" style={{ marginTop: 32 }} />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>❌</Text>
          <Text style={styles.emptyTitle}>Job Not Found</Text>
        </View>
      </View>
    );
  }

  const isOwner = user?.id === job.customerId;
  const isPro = user?.role === 'PRO';
  const userProBid = isPro ? job.bids?.find((bid: any) => bid.pro.userId === user?.id) : null;
  const canBid = isPro && !isOwner && job.status === 'OPEN' && !userProBid;
  
  const sortedBids = [...(job.bids || [])].sort((a, b) => {
    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
    if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
    return a.proposedPrice - b.proposedPrice;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.jobCard}>
          <View style={styles.jobHeader}>
            <View style={styles.jobHeaderLeft}>
              <Text style={styles.jobIcon}>{CATEGORY_ICONS[job.category as ServiceCategory]}</Text>
              <View style={styles.jobHeaderText}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobCategory}>{CATEGORY_LABELS[job.category as ServiceCategory]}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[job.status] }]}>
              <Text style={styles.statusText}>{STATUS_LABELS[job.status]}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{job.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{job.locationCity}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>{URGENCY_ICONS[job.urgency]}</Text>
              <Text style={styles.detailLabel}>Urgency:</Text>
              <Text style={styles.detailValue}>{job.urgency.replace('_', ' ')}</Text>
            </View>
            {job.budgetMin && job.budgetMax && (
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>💰</Text>
                <Text style={styles.detailLabel}>Budget:</Text>
                <Text style={styles.detailValue}>{job.budgetMin} - {job.budgetMax} Ft</Text>
              </View>
            )}
            {job.expiresAt && job.status === 'OPEN' && (
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>⏰</Text>
                <Text style={styles.detailLabel}>Expires:</Text>
                <Text style={[styles.detailValue, styles.expiryText]}>{getTimeRemaining(job.expiresAt)}</Text>
              </View>
            )}
          </View>

          {job.images && job.images.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Photos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
                {job.images.map((imageUrl: string, index: number) => (
                  <Image
                    key={index}
                    source={{ uri: imageUrl }}
                    style={styles.jobImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {isOwner && job.status === 'OPEN' && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelJob}
              disabled={actionLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel Job</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Pro Bid Section */}
        {isPro && !isOwner && (
          <View style={styles.proBidSection}>
            {showBidSuccess ? (
              <View style={styles.successCard}>
                <View style={styles.successIconContainer}>
                  <Text style={styles.successIcon}>✓</Text>
                </View>
                <Text style={styles.successTitle}>Bid Submitted Successfully!</Text>
                <Text style={styles.successMessage}>
                  Your bid has been sent to the customer. You'll be notified when they respond.
                </Text>
                <TouchableOpacity
                  style={styles.successButton}
                  onPress={() => {
                    setShowBidSuccess(false);
                    router.back();
                  }}
                >
                  <Text style={styles.successButtonText}>Back to Available Jobs</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.successSecondaryButton}
                  onPress={() => setShowBidSuccess(false)}
                >
                  <Text style={styles.successSecondaryButtonText}>View Job Details</Text>
                </TouchableOpacity>
              </View>
            ) : userProBid ? (
              <View style={styles.existingBidCard}>
                <View style={styles.existingBidHeader}>
                  <Text style={styles.existingBidTitle}>Your Bid</Text>
                  <View style={[
                    styles.bidStatusBadge,
                    userProBid.status === 'ACCEPTED' && styles.bidStatusAccepted,
                    userProBid.status === 'REJECTED' && styles.bidStatusRejected,
                    userProBid.status === 'WITHDRAWN' && styles.bidStatusWithdrawn,
                  ]}>
                    <Text style={styles.bidStatusText}>{userProBid.status}</Text>
                  </View>
                </View>
                <View style={styles.existingBidDetails}>
                  <View style={styles.existingBidRow}>
                    <Text style={styles.existingBidLabel}>Price:</Text>
                    <Text style={styles.existingBidValue}>{userProBid.proposedPrice} Ft</Text>
                  </View>
                  {userProBid.estimatedDuration && (
                    <View style={styles.existingBidRow}>
                      <Text style={styles.existingBidLabel}>Duration:</Text>
                      <Text style={styles.existingBidValue}>{userProBid.estimatedDuration} minutes</Text>
                    </View>
                  )}
                  {userProBid.message && (
                    <View style={styles.existingBidMessageContainer}>
                      <Text style={styles.existingBidLabel}>Message:</Text>
                      <Text style={styles.existingBidMessage}>{userProBid.message}</Text>
                    </View>
                  )}
                </View>
              </View>
            ) : canBid ? (
              showBidForm ? (
                <View style={styles.bidFormCard}>
                  <Text style={styles.bidFormTitle}>Submit Your Bid</Text>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Proposed Price (Ft) *</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="e.g., 15000"
                      keyboardType="numeric"
                      value={bidPrice}
                      onChangeText={setBidPrice}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Estimated Duration (minutes) *</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="e.g., 120 (minimum 15)"
                      keyboardType="numeric"
                      value={bidDuration}
                      onChangeText={setBidDuration}
                    />
                    <Text style={styles.formHint}>Minimum 15 minutes</Text>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Message to Customer *</Text>
                    <TextInput
                      style={[styles.formInput, styles.formTextArea]}
                      placeholder="Introduce yourself and explain your approach... (20-500 characters)"
                      multiline
                      numberOfLines={4}
                      value={bidMessage}
                      onChangeText={setBidMessage}
                      maxLength={500}
                    />
                    <Text style={styles.formHint}>
                      {bidMessage.length}/500 characters (minimum 20)
                    </Text>
                  </View>

                  <View style={styles.bidFormActions}>
                    <TouchableOpacity
                      style={styles.bidFormCancelButton}
                      onPress={() => {
                        setShowBidForm(false);
                        setBidPrice('');
                        setBidDuration('');
                        setBidMessage('');
                      }}
                      disabled={actionLoading}
                    >
                      <Text style={styles.bidFormCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.bidFormSubmitButton}
                      onPress={handleSubmitBid}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={styles.bidFormSubmitText}>Submit Bid</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.placeBidButton}
                  onPress={() => setShowBidForm(true)}
                >
                  <Text style={styles.placeBidButtonText}>Place Your Bid</Text>
                </TouchableOpacity>
              )
            ) : job.status !== 'OPEN' ? (
              <View style={styles.notAvailableCard}>
                <Text style={styles.notAvailableText}>This job is no longer accepting bids</Text>
              </View>
            ) : null}
          </View>
        )}

        {isOwner && (
          <View style={styles.bidsSection}>
            <View style={styles.bidsSectionHeader}>
              <Text style={styles.bidsSectionTitle}>Bids Received</Text>
              <View style={styles.bidsCount}>
                <Text style={styles.bidsCountNumber}>{sortedBids.length}</Text>
              </View>
            </View>

            {sortedBids.length === 0 ? (
              <View style={styles.noBids}>
                <Text style={styles.noBidsIcon}>📭</Text>
                <Text style={styles.noBidsTitle}>No Bids Yet</Text>
                <Text style={styles.noBidsText}>Professionals will start bidding soon</Text>
              </View>
            ) : (
              sortedBids.map((bid: any) => {
                const pro = bid.pro;
                const proUser = pro.user;
                const initials = `${proUser.firstName[0]}${proUser.lastName[0]}`.toUpperCase();
                const isPending = bid.status === 'PENDING';
                const isAccepted = bid.status === 'ACCEPTED';
                const isRejected = bid.status === 'REJECTED';

                return (
                  <View key={bid.id} style={[styles.bidCard, isAccepted && styles.bidCardAccepted]}>
                    <TouchableOpacity
                      style={styles.bidHeader}
                      onPress={() => router.push(`/pro/${pro.id}`)}
                    >
                      <View style={styles.proAvatar}>
                        <Text style={styles.proAvatarText}>{initials}</Text>
                      </View>
                      <View style={styles.bidProInfo}>
                        <Text style={styles.bidProName}>
                          {proUser.firstName} {proUser.lastName}
                        </Text>
                        <View style={styles.bidProStats}>
                          <Text style={styles.bidProRating}>⭐ {pro.rating.toFixed(1)}</Text>
                          <Text style={styles.bidProJobs}>• {pro.jobsCompleted} jobs</Text>
                        </View>
                      </View>
                      {pro.verificationStatus === 'APPROVED' && (
                        <View style={styles.verifiedBadge}>
                          <Text style={styles.verifiedIcon}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    <View style={styles.bidDetails}>
                      <View style={styles.bidPriceRow}>
                        <Text style={styles.bidPriceLabel}>Proposed Price:</Text>
                        <Text style={styles.bidPrice}>{bid.proposedPrice} Ft</Text>
                      </View>
                      {bid.estimatedDuration && (
                        <View style={styles.bidDurationRow}>
                          <Text style={styles.bidDurationLabel}>Estimated Duration:</Text>
                          <Text style={styles.bidDuration}>{bid.estimatedDuration} minutes</Text>
                        </View>
                      )}
                      {bid.message && (
                        <View style={styles.bidMessageContainer}>
                          <Text style={styles.bidMessageLabel}>Message:</Text>
                          <Text style={styles.bidMessage}>{bid.message}</Text>
                        </View>
                      )}
                    </View>

                    {isAccepted && (
                      <View style={styles.acceptedBadge}>
                        <Text style={styles.acceptedBadgeText}>✓ Accepted</Text>
                      </View>
                    )}
                    {isRejected && (
                      <View style={styles.rejectedBadge}>
                        <Text style={styles.rejectedBadgeText}>✕ Rejected</Text>
                      </View>
                    )}

                    {isPending && job.status === 'OPEN' && (
                      <View style={styles.bidActions}>
                        <TouchableOpacity
                          style={styles.rejectButton}
                          onPress={() => handleRejectBid(bid.id)}
                          disabled={actionLoading}
                        >
                          <Text style={styles.rejectButtonText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.acceptButton}
                          onPress={() => handleAcceptBid(bid.id)}
                          disabled={actionLoading}
                        >
                          <Text style={styles.acceptButtonText}>Accept Bid</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })
            )}
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
  scrollView: {
    flex: 1,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  jobHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  jobIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  jobHeaderText: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  jobCategory: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
  },
  expiryText: {
    color: '#F59E0B',
  },
  imagesScroll: {
    marginTop: 8,
  },
  jobImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
  },
  cancelButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  bidsSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  bidsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bidsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  bidsCount: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bidsCountNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noBids: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
  },
  noBidsIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  noBidsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  noBidsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  bidCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bidCardAccepted: {
    borderColor: '#00BCD4',
    borderWidth: 2,
    backgroundColor: '#E0F7FA',
  },
  bidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  proAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  proAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bidProInfo: {
    flex: 1,
  },
  bidProName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  bidProStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidProRating: {
    fontSize: 12,
    color: '#6B7280',
  },
  bidProJobs: {
    fontSize: 12,
    color: '#6B7280',
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedIcon: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bidDetails: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bidPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bidPriceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  bidPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00BCD4',
  },
  bidDurationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bidDurationLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  bidDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  bidMessageContainer: {
    marginTop: 8,
  },
  bidMessageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  bidMessage: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  acceptedBadge: {
    backgroundColor: '#D1FAE5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  acceptedBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  rejectedBadge: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  rejectedBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
  bidActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#00BCD4',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  proBidSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 48,
    color: '#10B981',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  successButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successSecondaryButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  successSecondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  existingBidCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00BCD4',
  },
  existingBidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  existingBidTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  bidStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
  },
  bidStatusAccepted: {
    backgroundColor: '#10B981',
  },
  bidStatusRejected: {
    backgroundColor: '#EF4444',
  },
  bidStatusWithdrawn: {
    backgroundColor: '#6B7280',
  },
  bidStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  existingBidDetails: {
    gap: 12,
  },
  existingBidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  existingBidLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  existingBidValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  existingBidMessageContainer: {
    marginTop: 8,
  },
  existingBidMessage: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
    marginTop: 4,
  },
  placeBidButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  placeBidButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bidFormCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bidFormTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  formHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  formTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  bidFormActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  bidFormCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  bidFormCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  bidFormSubmitButton: {
    flex: 2,
    backgroundColor: '#00BCD4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  bidFormSubmitText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notAvailableCard: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  notAvailableText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400E',
  },
});
