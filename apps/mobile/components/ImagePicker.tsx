import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import * as ImagePickerExpo from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../contexts/LanguageContext';
import { uploadApi } from '@ozar/shared/apiClient';

interface ImagePickerProps {
  onImageSelected: (uri: string) => void;
  currentImage?: string;
  aspectRatio?: [number, number];
  quality?: number;
  allowsEditing?: boolean;
  circular?: boolean;
  size?: number;
}

export function ImagePicker({
  onImageSelected,
  currentImage,
  aspectRatio = [1, 1],
  quality = 0.8,
  allowsEditing = true,
  circular = false,
  size = 120,
}: ImagePickerProps) {
  const t = useTranslation();
  const [loading, setLoading] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePickerExpo.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePickerExpo.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant camera and photo library permissions to upload images.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pickImage = async (source: 'camera' | 'library') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);
    animatePress();

    try {
      let result;
      
      if (source === 'camera') {
        result = await ImagePickerExpo.launchCameraAsync({
          mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
          allowsEditing,
          aspect: aspectRatio,
          quality,
        });
      } else {
        result = await ImagePickerExpo.launchImageLibraryAsync({
          mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
          allowsEditing,
          aspect: aspectRatio,
          quality,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        // Upload the image to the backend
        console.log('📤 Uploading image:', imageUri);
        const uploadedUrl = await uploadApi.uploadImage(imageUri);
        console.log('✅ Image uploaded:', uploadedUrl);
        
        onImageSelected(uploadedUrl);
      }
    } catch (error: any) {
      console.error('Error picking/uploading image:', error);
      Alert.alert('Error', error.message || 'Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showImageOptions = () => {
    // On web, use file input directly
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e: any) => {
        const file = e.target?.files?.[0];
        if (file) {
          setLoading(true);
          try {
            console.log('📤 Uploading image from web:', file.name);
            const uploadedUrl = await uploadApi.uploadImage(file);
            console.log('✅ Image uploaded:', uploadedUrl);
            onImageSelected(uploadedUrl);
          } catch (error: any) {
            console.error('Error uploading image:', error);
            alert(error.message || 'Failed to upload image. Please try again.');
          } finally {
            setLoading(false);
          }
        }
      };
      input.click();
      return;
    }

    // On mobile, show camera/library options
    Alert.alert(
      'Choose Image Source',
      'Select where you want to pick the image from',
      [
        {
          text: 'Camera',
          onPress: () => pickImage('camera'),
        },
        {
          text: 'Photo Library',
          onPress: () => pickImage('library'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: circular ? size / 2 : 16,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.imageContainer,
          {
            borderRadius: circular ? size / 2 : 16,
          },
        ]}
        onPress={showImageOptions}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00BCD4" />
            <Text style={styles.loadingText}>Uploading...</Text>
          </View>
        ) : currentImage ? (
          <>
            <Image
              source={{ uri: currentImage }}
              style={[
                styles.image,
                {
                  borderRadius: circular ? size / 2 : 16,
                },
              ]}
            />
            <View style={styles.editOverlay}>
              <Ionicons name="camera" size={24} color="#FFF" />
            </View>
          </>
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.iconContainer}>
              <Ionicons name="camera-outline" size={32} color="#00BCD4" />
            </View>
            <Text style={styles.placeholderText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {currentImage && !loading && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onImageSelected('')}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={28} color="#F44336" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 4,
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFF',
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
