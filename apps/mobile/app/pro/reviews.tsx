import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { reviewsApi } from '@ozar/shared/apiClient';

interface Review {
  id: string;
  rating: number;
  comment: string;
  response?: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  booking: {
    service: {
      name: string;
    };
  };
  createdAt: string;
}

const RESPONSE_TEMPLATES = [
  "Thank you for your kind words! It was a pleasure working with you.",
  "We appreciate your feedback and are glad you're satisfied with our service.",
  "Thank you for choosing us! We look forward to serving you again.",
  "We're thrilled to hear you had a great experience. Thank you!",
  "Your satisfaction is our priority. Thank you for the positive review!",
];

export default function ProReviewsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const result = await reviewsApi.getMyReviews();
      setReviews(result.data || result || []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      Alert.alert('Error', 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const openResponseModal = (review: Review) => {
    setSelectedReview(review);
    setResponseText(review.response || '');
    setShowResponseModal(true);
  };

  const useTemplate = (template: string) => {
    setResponseText(template);
  };

  const submitResponse = async () => {
    if (!selectedReview) return;
    if (!responseText.trim()) {
      Alert.alert('Required', 'Please enter a response');
      return;
    }

    setSubmitting(true);
    try {
      await reviewsApi.respondToReview(selectedReview.id, responseText.trim());
      Alert.alert('Success', 'Response posted successfully');
      setShowResponseModal(false);
      loadReviews();
    } catch (error: any) {
      console.error('Failed to post response:', error);
      Alert.alert('Error', error.message || 'Failed to post response');
    } finally {
      setSubmitting(false);
    }
  };

  const flagReview = (review: Review) => {
    Alert.alert(
      'Flag Review',
      'Why are you flagging this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Inappropriate Content',
          onPress: () => handleFlag(review.id, 'inappropriate'),
        },
        {
          text: 'Spam',
          onPress: () => handleFlag(review.id, 'spam'),
        },
        {
          text: 'False Information',
          onPress: () => handleFlag(review.id, 'false'),
        },
      ]
    );
  };

  const handleFlag = async (reviewId: string, reason: string) => {
    try {
      await reviewsApi.flagReview(reviewId, reason);
      Alert.alert('Flagged', 'Review has been flagged for moderation');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to flag review');
    }
  };

  const shareReview = (review: Review) => {
    Alert.alert(
      'Share Review',
      'Share this positive review on social media or with potential customers',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Copy Link', onPress: () => Alert.alert('Link copied!') },
        { text: 'Share', onPress: () => Alert.alert('Share functionality coming soon') },
      ]
    );
  };

  const filteredReviews = filterRating === 'ALL'
    ? reviews
    : reviews.filter(r => r.rating === filterRating);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
  }));

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading reviews...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Reviews</Text>
          <Text style={styles.subtitle}>{reviews.length} total reviews</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rating Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.averageRating}>{averageRating}</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={16}
                  color={star <= parseFloat(averageRating) ? '#F59E0B' : '#E5E7EB'}
                />
              ))}
            </View>
            <Text style={styles.totalReviews}>{reviews.length} reviews</Text>
          </View>

          <View style={styles.summaryRight}>
            {ratingCounts.map(({ rating, count }) => (
              <View key={rating} style={styles.ratingRow}>
                <Text style={styles.ratingLabel}>{rating}★</Text>
                <View style={styles.ratingBar}>
                  <View
                    style={[
                      styles.ratingBarFill,
                      {
                        width: reviews.length > 0
                          ? `${(count / reviews.length) * 100}%`
                          : '0%',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.ratingCount}>{count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[styles.filterTab, filterRating === 'ALL' && styles.filterTabActive]}
            onPress={() => setFilterRating('ALL')}
          >
            <Text style={[styles.filterTabText, filterRating === 'ALL' && styles.filterTabTextActive]}>
              All ({reviews.length})
            </Text>
          </TouchableOpacity>
          {[5, 4, 3, 2, 1].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[styles.filterTab, filterRating === rating && styles.filterTabActive]}
              onPress={() => setFilterRating(rating)}
            >
              <Text style={[styles.filterTabText, filterRating === rating && styles.filterTabTextActive]}>
                {rating}★ ({reviews.filter(r => r.rating === rating).length})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyTitle}>No reviews yet</Text>
            <Text style={styles.emptyText}>
              Complete bookings to start receiving reviews from customers
            </Text>
          </View>
        ) : (
          filteredReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {review.customer.firstName[0]}{review.customer.lastName[0]}
                  </Text>
                </View>
                <View style={styles.reviewInfo}>
                  <Text style={styles.customerName}>
                    {review.customer.firstName} {review.customer.lastName}
                  </Text>
                  <View style={styles.reviewMeta}>
                    <View style={styles.stars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name="star"
                          size={14}
                          color={star <= review.rating ? '#F59E0B' : '#E5E7EB'}
                        />
                      ))}
                    </View>
                    <Text style={styles.reviewDate}>{getTimeAgo(review.createdAt)}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() => flagReview(review)}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.serviceName}>{review.booking.service.name}</Text>
              <Text style={styles.reviewComment}>{review.comment}</Text>

              {review.response ? (
                <View style={styles.responseContainer}>
                  <View style={styles.responseHeader}>
                    <Ionicons name="chatbubble-outline" size={16} color="#3B82F6" />
                    <Text style={styles.responseLabel}>Your Response</Text>
                  </View>
                  <Text style={styles.responseText}>{review.response}</Text>
                  <TouchableOpacity
                    style={styles.editResponseButton}
                    onPress={() => openResponseModal(review)}
                  >
                    <Ionicons name="create-outline" size={16} color="#3B82F6" />
                    <Text style={styles.editResponseText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.reviewActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openResponseModal(review)}
                  >
                    <Ionicons name="chatbubble-outline" size={18} color="#3B82F6" />
                    <Text style={styles.actionButtonText}>Respond</Text>
                  </TouchableOpacity>
                  {review.rating >= 4 && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => shareReview(review)}
                    >
                      <Ionicons name="share-social-outline" size={18} color="#10B981" />
                      <Text style={[styles.actionButtonText, { color: '#10B981' }]}>Share</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Response Modal */}
      <Modal
        visible={showResponseModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowResponseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Respond to Review</Text>
              <TouchableOpacity onPress={() => setShowResponseModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedReview && (
              <View style={styles.modalReviewPreview}>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name="star"
                      size={16}
                      color={star <= selectedReview.rating ? '#F59E0B' : '#E5E7EB'}
                    />
                  ))}
                </View>
                <Text style={styles.modalReviewText} numberOfLines={3}>
                  {selectedReview.comment}
                </Text>
              </View>
            )}

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Your Response</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write a professional and friendly response..."
                value={responseText}
                onChangeText={setResponseText}
                multiline
                numberOfLines={6}
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{responseText.length}/500</Text>

              <Text style={styles.templatesLabel}>Quick Templates</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {RESPONSE_TEMPLATES.map((template, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.templateChip}
                    onPress={() => useTemplate(template)}
                  >
                    <Text style={styles.templateText} numberOfLines={2}>
                      {template}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.tipsBox}>
                <Ionicons name="bulb-outline" size={20} color="#F59E0B" />
                <View style={styles.tipsContent}>
                  <Text style={styles.tipsTitle}>Response Tips</Text>
                  <Text style={styles.tipsText}>• Thank the customer for their feedback</Text>
                  <Text style={styles.tipsText}>• Keep it professional and friendly</Text>
                  <Text style={styles.tipsText}>• Address any concerns mentioned</Text>
                  <Text style={styles.tipsText}>• Invite them to book again</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowResponseModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={submitResponse}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Post Response</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
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
  content: {
    flex: 1,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryLeft: {
    alignItems: 'center',
    paddingRight: 20,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  averageRating: {
    fontSize: 48,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  totalReviews: {
    fontSize: 12,
    color: '#6B7280',
  },
  summaryRight: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    width: 30,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  ratingCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: 30,
    textAlign: 'right',
  },
  filterContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    backgroundColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: 'white',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  reviewInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  moreButton: {
    padding: 4,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 12,
  },
  responseContainer: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  responseText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    marginBottom: 8,
  },
  editResponseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  editResponseText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalReviewPreview: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalReviewText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 20,
  },
  modalBody: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#111827',
    height: 150,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 16,
  },
  templatesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  templateChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
    maxWidth: 200,
  },
  templateText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  tipsBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  tipsContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 12,
    color: '#92400E',
    marginBottom: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});
