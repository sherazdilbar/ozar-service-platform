'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { favoritesApi } from '@ozar/shared/apiClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Avatar from '@/components/Avatar';
import FavoriteButton from '@/components/FavoriteButton';
import { Star, MapPin, DollarSign, Heart } from 'lucide-react';

export default function FavoritesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/favorites');
      return;
    }
    loadFavorites();
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      const result = await favoritesApi.getFavorites();
      setFavorites(result || []);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (proId: string) => {
    setFavorites(favorites.filter(pro => pro.id !== proId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">Your saved professionals for quick access</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h3>
            <p className="text-gray-600 mb-6">
              Save your favorite professionals for quick access later
            </p>
            <button
              onClick={() => router.push('/search')}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 font-medium"
            >
              Browse Professionals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((pro) => {
              const displayName = pro.businessName || `${pro.user.firstName} ${pro.user.lastName}`;

              return (
                <div
                  key={pro.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center flex-1">
                        <Avatar
                          imageUrl={pro.user.avatar}
                          name={displayName}
                          size={60}
                        />
                        <div className="ml-3 flex-1">
                          <h3 className="font-semibold text-gray-900 line-clamp-1">
                            {displayName}
                          </h3>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm font-medium text-gray-900">
                              {pro.rating.toFixed(1)}
                            </span>
                            <span className="ml-1 text-sm text-gray-600">
                              ({pro.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>
                      <FavoriteButton
                        proId={pro.id}
                        onToggle={(isFavorite) => {
                          if (!isFavorite) {
                            handleRemoveFavorite(pro.id);
                          }
                        }}
                      />
                    </div>

                    {/* Services */}
                    {pro.services && pro.services.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Services:</p>
                        <div className="flex flex-wrap gap-2">
                          {pro.services.slice(0, 3).map((service: any) => (
                            <span
                              key={service.id}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {service.name}
                            </span>
                          ))}
                          {pro.services.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              +{pro.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Location & Price */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{pro.locationCity}, {pro.locationArea}</span>
                      </div>
                      {pro.startingPrice > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>From {pro.startingPrice.toLocaleString()} {pro.currency}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => router.push(`/pros/${pro.id}`)}
                        className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-medium text-sm"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => router.push(`/booking/new?proId=${pro.id}`)}
                        className="flex-1 border border-teal-600 text-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 font-medium text-sm"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
