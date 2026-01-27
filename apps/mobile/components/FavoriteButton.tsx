import { useState, useEffect } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { favoritesApi } from '@ozar/shared/apiClient';
import { useAuth } from '../contexts/AuthContext';

interface FavoriteButtonProps {
  proId: string;
  size?: number;
  color?: string;
}

export default function FavoriteButton({ proId, size = 24, color = '#EF4444' }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [proId]);

  const checkFavoriteStatus = async () => {
    if (!user || user.role !== 'CUSTOMER') return;
    
    try {
      const result = await favoritesApi.isFavorite(proId);
      setIsFavorite(result.isFavorite);
    } catch (error) {
      console.error('Failed to check favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user || user.role !== 'CUSTOMER') return;
    
    setLoading(true);
    try {
      if (isFavorite) {
        await favoritesApi.removeFavorite(proId);
        setIsFavorite(false);
      } else {
        await favoritesApi.addFavorite(proId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show for pros
  if (!user || user.role !== 'CUSTOMER') {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={toggleFavorite}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={size}
          color={color}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
