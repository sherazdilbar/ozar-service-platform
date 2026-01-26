import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import * as ImagePickerExpo from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface MultiImagePickerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  imageSize?: number;
}

export function MultiImagePicker({
  images,
  onImagesChange,
  maxImages = 5,
  imageSize = 100,
}: MultiImagePickerProps) {
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus} = await ImagePickerExpo.requestCameraPermissionsAsync();
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

  const pickImages = async (source: 'camera' | 'library') => {
    if (images.length >= maxImages) {
      Alert.alert('Limit Reached', `You can only upload up to ${maxImages} images.`);
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);

    try {
      let result;
      
      if (source === 'camera') {
        result = await ImagePickerExpo.launchCameraAsync({
          mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        result = await ImagePickerExpo.launchImageLibraryAsync({
          mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          allowsEditing: false,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets.length > 0) {
        const newImages = result.assets.map(asset => asset.uri);
        const remainingSlots = maxImages - images.length;
        const imagesToAdd = newImages.slice(0, remainingSlots);
        
        onImagesChange([...images, ...imagesToAdd]);

        if (newImages.length > remainingSlots) {
          Alert.alert(
            'Some Images Skipped',
            `Only ${remainingSlots} image(s) were added due to the ${maxImages} image limit.`
          );
        }
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Photos',
      'Choose where you want to pick photos from',
      [
        {
          text: 'Camera',
          onPress: () => pickImages('camera'),
        },
        {
          text: 'Photo Library',
          onPress: () => pickImages('library'),
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Photos</Text>
        <Text style={styles.count}>
          {images.length}/{maxImages}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add Photo Button */}
        {images.length < maxImages && (
          <TouchableOpacity
            style={[styles.imageBox, { width: imageSize, height: imageSize }]}
            onPress={showImageOptions}
            activeOpacity={0.7}
            disabled={loading}
          >
            <View style={styles.addButton}>
              <Ionicons name="add" size={32} color="#00BCD4" />
              <Text style={styles.addText}>Add Photo</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Image Grid */}
        {images.map((uri, index) => (
          <View
            key={index}
            style={[styles.imageBox, { width: imageSize, height: imageSize }]}
          >
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={24} color="#F44336" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {images.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={48} color="#CCC" />
          <Text style={styles.emptyText}>No photos added yet</Text>
          <Text style={styles.emptySubtext}>
            Add up to {maxImages} photos to showcase your work
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00BCD4',
  },
  scrollContent: {
    gap: 12,
    paddingRight: 16,
  },
  imageBox: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  addButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FFF',
    borderRadius: 12,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
