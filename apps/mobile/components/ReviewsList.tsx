import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { MultiImagePicker } from './MultiImagePicker';
import { reviewsApi } from '@ozar/shared/apiClient';

interface Review {
  id: string;
  rating: number;
  comment: string;
  images?: string[];
  customerName: string;
  customerAvatar?: string;
  createdAt: string;
  helpfulCount?: number;
  isHelpful?: boolean;
  responseText?: string;
  responseAt?: string;
}

interface ReviewsListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  canLeaveReview?: boolean;
  canRespond?: boolean;
  currentUserId?: string;
  onSubmitReview?: (rating: number, comment: string, images?: string[]) => Promise<void>;
  onRefresh?: () => void;
}

export default function ReviewsList({
  reviews,
  averageRating,
  totalReviews,
  canLeaveReview = false,
  canRespond = false,
  currentUserId,
  onSubmitReview,
  onRefresh,
}: ReviewsListProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Response modal state
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [respondingToReview, setRespondingToReview] = useState(false);
  
  // Image viewer
  const [viewingImages, setViewingImages] = useState<string[]>([]);
  const [showImageViewer, setShowImageViewer] = useState(false);

  // Safety check: ensure reviews is always an array
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('Required', 'Please write a review');
      return;
    }

    if (!onSubmitReview) return;

    setSubmitting(true);
    try {
      await onSubmitReview(rating, comment.trim(), images);
      setShowReviewModal(false);
      setRating(5);
      setComment('');
      setImages([]);
      Alert.alert('Success', 'Review submitted successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleHelpful = async (reviewId: string) => {
    try {
      await reviewsApi.toggleHelpfulVote(reviewId);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update helpful vote');
    }
  };

  const handleRespondToReview = async () => {
    if (!responseText.trim()) {
      Alert.alert('Required', 'Please write a response');
      return;
    }

    if (!selectedReviewId) return;

    setRespondingToReview(true);
    try {
      await reviewsApi.respondToReview(selectedReviewId, responseText.trim());
      setShowResponseModal(false);
      setResponseText('');
      setSelectedReviewId(null);
      Alert.alert('Success', 'Response posted successfully!');
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to post response');
    } finally {
      setRespondingToReview(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <View style={styles.container}>
      {/* Reviews List */}
      {safeReviews.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⭐</Text>
          <Text style={styles.emptyTitle}>No Reviews Yet</Text>
          <Text style={styles.emptyText}>Be the first to review this professional!</Text>
        </View>
      ) : (
        <View style={styles.reviewsList}>
          {safeReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {review.customerName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.reviewHeaderInfo}>
                  <Text style={styles.customerName}>{review.customerName}</Text>
                  <View style={styles.ratingRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Text key={star} style={styles.reviewStar}>
                        {star <= review.rating ? '★' : '☆'}
                      </Text>
                    ))}
                    <Text style={styles.reviewDate}> • {formatDate(review.createdAt)}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.reviewComment}>{review.comment}</Text>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.reviewImages}
                >
                  {review.images.map((image, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => {
                        setViewingImages(review.images || []);
                        setShowImageViewer(true);
                      }}
                    >
                      <Image source={{ uri: image }} style={styles.reviewImage} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {/* Helpful Button */}
              <View style={styles.reviewActions}>
                <TouchableOpacity
                  style={[styles.helpfulButton, review.isHelpful && styles.helpfulButtonActive]}
                  onPress={() => handleToggleHelpful(review.id)}
                >
                  <Text style={[styles.helpfulButtonText, review.isHelpful && styles.helpfulButtonTextActive]}>
                    👍 Helpful {review.helpfulCount ? `(${review.helpfulCount})` : ''}
                  </Text>
                </TouchableOpacity>

                {canRespond && !review.responseText && (
                  <TouchableOpacity
                    style={styles.respondButton}
                    onPress={() => {
                      setSelectedReviewId(review.id);
                      setShowResponseModal(true);
                    }}
                  >
                    <Text style={styles.respondButtonText}>💬 Respond</Text>
                  </TouchableOpacity>
                )}
              </View>

              {review.responseText && (
                <View style={styles.responseContainer}>
                  <Text style={styles.responseLabel}>Response from Professional:</Text>
                  <Text style={styles.responseText}>{review.responseText}</Text>
                  <Text style={styles.responseDate}>{formatDate(review.responseAt!)}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Write Review Modal */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Write a Review</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Your Rating</Text>
              <View style={styles.ratingSelector}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    style={styles.starButton}
                  >
                    <Text style={styles.starButtonText}>
                      {star <= rating ? '★' : '☆'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Your Review *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Share your experience..."
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={6}
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{comment.length}/500</Text>

              <Text style={styles.label}>Photos (Optional)</Text>
              <MultiImagePicker
                images={images}
                onImagesChange={setImages}
                maxImages={5}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowReviewModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.label}>Your Response *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Thank the customer and address their feedback..."
                value={responseText}
                onChangeText={setResponseText}
                multiline
                numberOfLines={6}
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{responseText.length}/500</Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowResponseModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, respondingToReview && styles.submitButtonDisabled]}
                onPress={handleRespondToReview}
                disabled={respondingToReview}
              >
                {respondingToReview ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Post Response</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Viewer Modal */}
      <Modal
        visible={showImageViewer}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowImageViewer(false)}
      >
        <View style={styles.imageViewerOverlay}>
          <TouchableOpacity
            style={styles.imageViewerClose}
            onPress={() => setShowImageViewer(false)}
          >
            <Text style={styles.imageViewerCloseText}>✕</Text>
          </TouchableOpacity>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageViewerScroll}
          >
            {viewingImages.map((image, idx) => (
              <View key={idx} style={styles.imageViewerContainer}>
                <Image source={{ uri: image }} style={styles.imageViewerImage} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    marginBottom: 16,
  },
  summaryLeft: {
    alignItems: 'center',
  },
  averageRating: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  star: {
    fontSize: 20,
    color: '#F59E0B',
    marginHorizontal: 2,
  },
  totalReviews: {
    fontSize: 14,
    color: '#6b7280',
  },
  writeReviewButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  writeReviewText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
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
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewHeaderInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewStar: {
    fontSize: 14,
    color: '#F59E0B',
  },
  reviewDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  responseContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00BCD4',
    marginBottom: 4,
  },
  responseText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 4,
  },
  responseDate: {
    fontSize: 11,
    color: '#9ca3af',
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalClose: {
    fontSize: 24,
    color: '#6b7280',
  },
  modalBody: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  starButton: {
    padding: 8,
  },
  starButtonText: {
    fontSize: 36,
    color: '#F59E0B',
  },
  textArea: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#111827',
    height: 150,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
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
    backgroundColor: '#00BCD4',
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
  // Review Images
  reviewImages: {
    marginTop: 12,
    marginBottom: 8,
  },
  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  // Review Actions
  reviewActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  helpfulButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  helpfulButtonActive: {
    backgroundColor: '#E0F2F1',
    borderColor: '#00BCD4',
  },
  helpfulButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  helpfulButtonTextActive: {
    color: '#00BCD4',
  },
  respondButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  respondButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  // Image Viewer
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  imageViewerClose: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerCloseText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  imageViewerScroll: {
    flex: 1,
  },
  imageViewerContainer: {
    width: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerImage: {
    width: '100%',
    height: '100%',
  },
});
