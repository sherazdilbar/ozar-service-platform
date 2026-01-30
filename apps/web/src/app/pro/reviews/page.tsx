'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { prosApi, reviewsApi } from '@ozar/shared/apiClient';
import { Star, MessageSquare, ThumbsUp, Filter } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUrl';
import Avatar from '@/components/Avatar';

interface Review {
  id: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  booking: {
    service: {
      name: string;
    };
  };
}

export default function ProReviewsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 5 | 4 | 3 | 2 | 1>('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
      return;
    }
    loadReviews();
  }, [isAuthenticated, user]);

  const loadReviews = async () => {
    try {
      const response = await reviewsApi.getMyReviews();
      // Backend returns { data: reviews }
      setReviews(response?.data || []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === filter);

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 
      : 0,
  }));

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            Customer Reviews
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            See what your customers are saying about your services
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Rating Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(averageRating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Based on {reviews.length} reviews
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <button
                    key={rating}
                    onClick={() => setFilter(filter === rating ? 'all' : (rating as 5 | 4 | 3 | 2 | 1))}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${
                      filter === rating
                        ? 'bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-8 text-right">
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="w-full px-4 py-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg font-semibold transition"
                >
                  Show All Reviews
                </button>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            {filteredReviews.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {filter === 'all' ? 'No reviews yet' : `No ${filter}-star reviews`}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'all' 
                    ? 'Complete your first booking to start receiving reviews'
                    : 'Try selecting a different rating filter'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                  >
                    <div className="flex gap-4 mb-4">
                      <Avatar
                        imageUrl={review.customer.avatar}
                        name={`${review.customer.firstName} ${review.customer.lastName}`}
                        size={48}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {review.customer.firstName} {review.customer.lastName}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {review.booking.service.name}
                        </p>
                      </div>
                    </div>

                    {review.comment && (
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {review.comment}
                      </p>
                    )}

                    {review.images && review.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={getImageUrl(image) || image}
                            alt={`Review image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Helpful</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-medium">Respond</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
