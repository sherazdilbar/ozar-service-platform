'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { favoritesApi } from '@ozar/shared/apiClient';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  proId: string;
  onToggle?: (isFavorite: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({ proId, onToggle, size = 'md' }: FavoriteButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [proId, isAuthenticated]);

  const checkFavoriteStatus = async () => {
    try {
      const favorites = await favoritesApi.getFavorites();
      const isFav = favorites.some((fav: any) => fav.id === proId);
      setIsFavorite(isFav);
    } catch (error) {
      console.error('Failed to check favorite status:', error);
    }
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please login to save favorites');
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        await favoritesApi.removeFavorite(proId);
        setIsFavorite(false);
        onToggle?.(false);
      } else {
        await favoritesApi.addFavorite(proId);
        setIsFavorite(true);
        onToggle?.(true);
      }
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error);
      alert(error.message || 'Failed to update favorite');
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${
        isFavorite
          ? 'bg-red-100 hover:bg-red-200'
          : 'bg-gray-100 hover:bg-gray-200'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        size={iconSizes[size]}
        className={`transition-colors ${
          isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
        }`}
      />
    </button>
  );
}
