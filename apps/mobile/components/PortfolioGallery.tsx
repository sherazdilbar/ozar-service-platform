import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface PortfolioItem {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
}

interface PortfolioGalleryProps {
  items: PortfolioItem[];
  apiUrl?: string;
}

export default function PortfolioGallery({ items, apiUrl = process.env.EXPO_PUBLIC_API_URL }: PortfolioGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📸</Text>
        <Text style={styles.emptyTitle}>No Portfolio Yet</Text>
        <Text style={styles.emptyText}>This professional hasn't added any work samples</Text>
      </View>
    );
  }

  const openImage = (item: PortfolioItem, index: number) => {
    setSelectedImage(item);
    setCurrentIndex(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const goToNext = () => {
    if (currentIndex < items.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedImage(items[nextIndex]);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedImage(items[prevIndex]);
    }
  };

  return (
    <>
      <View style={styles.grid}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.gridItem}
            onPress={() => openImage(item, index)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: `${apiUrl}${item.imageUrl}` }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <Text style={styles.overlayText} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Full Screen Image Viewer */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImage}
      >
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={closeImage}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Image Counter */}
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {currentIndex + 1} / {items.length}
            </Text>
          </View>

          {/* Image */}
          <View style={styles.imageContainer}>
            {selectedImage && (
              <Image
                source={{ uri: `${apiUrl}${selectedImage.imageUrl}` }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          </View>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <TouchableOpacity style={styles.leftArrow} onPress={goToPrevious}>
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>
          )}
          {currentIndex < items.length - 1 && (
            <TouchableOpacity style={styles.rightArrow} onPress={goToNext}>
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          )}

          {/* Image Info */}
          {selectedImage && (
            <View style={styles.infoContainer}>
              <ScrollView style={styles.infoScroll}>
                <Text style={styles.imageTitle}>{selectedImage.title}</Text>
                {selectedImage.description && (
                  <Text style={styles.imageDescription}>{selectedImage.description}</Text>
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: {
    width: (width - 48) / 2, // 2 columns with padding
    height: (width - 48) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  overlayText: {
    color: 'white',
    fontSize: 12,
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
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  counter: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  counterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 150,
  },
  fullImage: {
    width: width,
    height: height - 250,
  },
  leftArrow: {
    position: 'absolute',
    left: 20,
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightArrow: {
    position: 'absolute',
    right: 20,
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    maxHeight: 150,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  infoScroll: {
    maxHeight: 120,
  },
  imageTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  imageDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
});
