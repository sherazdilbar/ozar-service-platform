'use client';

import { Star } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface ReviewsListProps {
  reviews: Review[];
  showImages?: boolean;
}

export default function ReviewsList({ reviews, showImages = true }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex gap-3 mb-3">
            {review.customer.avatar ? (
              <img
                src={review.customer.avatar}
                alt={`${review.customer.firstName} ${review.customer.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {review.customer.firstName[0]}{review.customer.lastName[0]}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {review.customer.firstName} {review.customer.lastName}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
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
            </div>
          </div>
          
          {review.comment && (
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {review.comment}
            </p>
          )}
          
          {showImages && review.images && review.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
