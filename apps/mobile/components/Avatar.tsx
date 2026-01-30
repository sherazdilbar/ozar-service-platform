import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';

interface AvatarProps {
  imageUrl?: string | null;
  name: string;
  size?: number;
  style?: ViewStyle;
  textStyle?: any;
}

export function Avatar({ imageUrl, name, size = 40, style, textStyle }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarUrl = imageUrl ? `http://localhost:4000${imageUrl}` : null;
  const showImage = avatarUrl && !imageError;

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {showImage ? (
        <Image 
          source={{ uri: avatarUrl }} 
          style={styles.avatarImage}
          onError={() => setImageError(true)}
        />
      ) : (
        <Text style={[styles.avatarText, { fontSize: size * 0.4 }, textStyle]}>
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontWeight: '600',
    color: '#374151',
  },
});
