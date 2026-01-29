import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { prosApi } from '@ozar/shared/apiClient';
import { ServiceCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@ozar/shared';
import MultiImagePicker from '../../components/MultiImagePicker';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;
const ITEM_HEIGHT = ITEM_WIDTH * 1.2; // Slightly taller than wide for card aspect ratio

interface PortfolioItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  category: ServiceCategory;
  createdAt: string;
}

export default function ProPortfolioScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<ServiceCategory | 'ALL'>('ALL');

  // Form state
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('PLUMBING');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const profile = await prosApi.getMyProfile();
      setPortfolio(profile.portfolio || []);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
      Alert.alert('Error', 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setImages([]);
    setTitle('');
    setDescription('');
    setCategory('PLUMBING');
    setShowAddModal(true);
  };

  const openDetailModal = (item: PortfolioItem) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      Alert.alert('Required', 'Please select at least one image');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a title');
      return;
    }

    setSubmitting(true);
    try {
      // Get pro profile to get the proId
      const profile = await prosApi.getMyProfile();
      
      // Upload images and create portfolio items
      for (const imageUri of images) {
        await prosApi.addPortfolioItem(profile.id, {
          imageUrl: imageUri, // In production, upload to server first
          title: title.trim(),
          description: description.trim(),
          category,
        });
      }

      Alert.alert('Success', 'Portfolio items added successfully');
      setShowAddModal(false);
      loadPortfolio();
    } catch (error: any) {
      console.error('Failed to add portfolio items:', error);
      Alert.alert('Error', error.message || 'Failed to add portfolio items');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (item: PortfolioItem) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this portfolio item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await prosApi.deletePortfolioItem(item.id);
              Alert.alert('Deleted', 'Portfolio item deleted successfully');
              setShowDetailModal(false);
              loadPortfolio();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const filteredPortfolio = filterCategory === 'ALL'
    ? portfolio
    : portfolio.filter(item => item.category === filterCategory);

  const categories = ['ALL', ...Array.from(new Set(portfolio.map(item => item.category)))];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading portfolio...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Portfolio</Text>
          <Text style={styles.subtitle}>{portfolio.length} items</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Category Filter - Only show if there are multiple categories */}
      {portfolio.length > 0 && categories.length > 2 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterChip,
                filterCategory === cat && styles.filterChipActive,
              ]}
              onPress={() => setFilterCategory(cat as ServiceCategory | 'ALL')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterCategory === cat && styles.filterChipTextActive,
                ]}
              >
                {cat === 'ALL' ? 'All' : CATEGORY_LABELS[cat as ServiceCategory]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Portfolio Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredPortfolio.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={styles.emptyTitle}>
              {portfolio.length === 0 ? 'No portfolio items yet' : 'No items in this category'}
            </Text>
            <Text style={styles.emptyText}>
              {portfolio.length === 0
                ? 'Showcase your best work to attract more customers'
                : 'Try selecting a different category'}
            </Text>
            {portfolio.length === 0 && (
              <TouchableOpacity style={styles.emptyButton} onPress={openAddModal}>
                <Text style={styles.emptyButtonText}>Add Your First Item</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredPortfolio.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                onPress={() => openDetailModal(item)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                <View style={styles.itemOverlay}>
                  <View style={styles.itemCategoryBadge}>
                    <Text style={styles.itemCategoryText}>
                      {CATEGORY_ICONS[item.category]} {CATEGORY_LABELS[item.category]}
                    </Text>
                  </View>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Portfolio Item</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Photos *</Text>
              <MultiImagePicker
                images={images}
                onImagesChange={setImages}
                maxImages={10}
              />

              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Modern Kitchen Renovation"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the project, challenges, and results..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                maxLength={500}
              />

              <Text style={styles.label}>Category *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {Object.keys(CATEGORY_LABELS).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryOption,
                      category === cat && styles.categoryOptionActive,
                    ]}
                    onPress={() => setCategory(cat as ServiceCategory)}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        category === cat && styles.categoryOptionTextActive,
                      ]}
                    >
                      {CATEGORY_ICONS[cat as ServiceCategory]}{' '}
                      {CATEGORY_LABELS[cat as ServiceCategory]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Add to Portfolio</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.detailOverlay}>
          <View style={styles.detailContent}>
            <TouchableOpacity
              style={styles.detailCloseButton}
              onPress={() => setShowDetailModal(false)}
            >
              <Ionicons name="close-circle" size={32} color="white" />
            </TouchableOpacity>

            {selectedItem && (
              <>
                <Image
                  source={{ uri: selectedItem.imageUrl }}
                  style={styles.detailImage}
                  resizeMode="contain"
                />
                <View style={styles.detailInfo}>
                  <View style={styles.detailCategoryBadge}>
                    <Text style={styles.detailCategoryText}>
                      {CATEGORY_ICONS[selectedItem.category]}{' '}
                      {CATEGORY_LABELS[selectedItem.category]}
                    </Text>
                  </View>
                  <Text style={styles.detailTitle}>{selectedItem.title}</Text>
                  {selectedItem.description && (
                    <Text style={styles.detailDescription}>
                      {selectedItem.description}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(selectedItem)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    maxHeight: 60,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
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
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  gridItem: {
    width: ITEM_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: '100%',
    height: ITEM_HEIGHT,
    backgroundColor: '#F3F4F6',
  },
  itemOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  itemCategoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  itemCategoryText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  itemInfo: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 18,
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalBody: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  categoryOptionActive: {
    backgroundColor: '#3B82F6',
  },
  categoryOptionText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  categoryOptionTextActive: {
    color: 'white',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  detailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  detailImage: {
    width: '100%',
    height: '60%',
  },
  detailInfo: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  detailCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  detailDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 24,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
});
