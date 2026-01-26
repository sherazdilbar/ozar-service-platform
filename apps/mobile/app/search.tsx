import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { prosApi } from '@ozar/shared/apiClient';
import { ServiceCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@ozar/shared';
import { useLanguage } from '../contexts/LanguageContext';

interface Pro {
  id: string;
  user: {
    firstName: string;
    lastName: string;
  };
  businessName?: string;
  categories: string[];
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
  startingPrice: number;
  currency: string;
  locationCity: string;
  locationArea: string;
  verificationStatus: string;
  availabilityStatus: string;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ServiceCategory[];

export default function SearchScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [availableNow, setAvailableNow] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [pros, setPros] = useState<Pro[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Auto-search on mount
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const filters: any = {};
      if (searchTerm.trim()) filters.searchTerm = searchTerm.trim();
      if (selectedCategory) filters.category = selectedCategory;
      if (minRating) filters.minRating = minRating;
      if (availableNow) filters.availableNow = true;
      filters.city = 'Budapest'; // Default to Budapest

      const result = await prosApi.getPros(filters);
      setPros(result.data || []);
    } catch (error) {
      console.error('Search failed:', error);
      setPros([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setMinRating(null);
    setAvailableNow(false);
  };

  const activeFiltersCount = [selectedCategory, minRating, availableNow].filter(Boolean).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Professionals</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or service..."
            placeholderTextColor="#9ca3af"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Text style={styles.filterButtonText}>
              🎛️ Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
          onPress={() => {
            setSelectedCategory(null);
            handleSearch();
          }}
        >
          <Text style={[styles.categoryChipText, !selectedCategory && styles.categoryChipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => {
              setSelectedCategory(category);
              setTimeout(handleSearch, 100);
            }}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive,
              ]}
            >
              {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <ScrollView style={styles.results}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00BCD4" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : pros.length === 0 && searched ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No professionals found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters</Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {pros.length} professional{pros.length !== 1 ? 's' : ''} found
            </Text>
            {pros.map((pro) => {
              const displayName = pro.businessName || `${pro.user.firstName} ${pro.user.lastName}`;
              const initials = `${pro.user.firstName[0]}${pro.user.lastName[0]}`.toUpperCase();
              const isVerified = pro.verificationStatus === 'APPROVED';
              const isAvailable = pro.availabilityStatus === 'AVAILABLE';

              return (
                <TouchableOpacity
                  key={pro.id}
                  style={styles.proCard}
                  onPress={() => router.push(`/pro/${pro.id}`)}
                >
                  <View style={styles.proHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{initials}</Text>
                      {isVerified && (
                        <View style={styles.verifiedBadge}>
                          <Text style={styles.verifiedText}>✓</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.proInfo}>
                      <Text style={styles.proName}>{displayName}</Text>
                      <View style={styles.ratingRow}>
                        <Text style={styles.ratingStar}>★</Text>
                        <Text style={styles.ratingValue}>{pro.rating.toFixed(1)}</Text>
                        <Text style={styles.ratingCount}>({pro.reviewCount})</Text>
                      </View>
                      <Text style={styles.location}>
                        📍 {pro.locationArea}, {pro.locationCity}
                      </Text>
                    </View>

                    {isAvailable && (
                      <View style={styles.availableBadge}>
                        <Text style={styles.availableText}>Available</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.proCategories}>
                    {pro.categories.slice(0, 3).map((cat, idx) => (
                      <View key={idx} style={styles.categoryTag}>
                        <Text style={styles.categoryTagText}>
                          {CATEGORY_ICONS[cat as ServiceCategory]} {CATEGORY_LABELS[cat as ServiceCategory]}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.proFooter}>
                    <Text style={styles.jobsCount}>
                      {pro.jobsCompleted} jobs completed
                    </Text>
                    <Text style={styles.price}>
                      From {pro.startingPrice.toLocaleString()} {pro.currency}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Rating Filter */}
              <Text style={styles.filterLabel}>Minimum Rating</Text>
              <View style={styles.ratingOptions}>
                {[null, 3, 4, 4.5].map((rating) => (
                  <TouchableOpacity
                    key={rating || 'any'}
                    style={[
                      styles.ratingOption,
                      minRating === rating && styles.ratingOptionActive,
                    ]}
                    onPress={() => setMinRating(rating)}
                  >
                    <Text
                      style={[
                        styles.ratingOptionText,
                        minRating === rating && styles.ratingOptionTextActive,
                      ]}
                    >
                      {rating ? `${rating}+ ★` : 'Any'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Availability Filter */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAvailableNow(!availableNow)}
              >
                <View style={[styles.checkbox, availableNow && styles.checkboxChecked]}>
                  {availableNow && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Available now</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  setShowFilters(false);
                  handleSearch();
                }}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  backBtnText: {
    fontSize: 28,
    color: '#00BCD4',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  searchSection: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  clearIcon: {
    fontSize: 18,
    color: '#9ca3af',
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  searchButton: {
    flex: 1,
    backgroundColor: '#00BCD4',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  categoriesScroll: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#00BCD4',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  categoryChipTextActive: {
    color: 'white',
  },
  results: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  emptyState: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  resultsCount: {
    fontSize: 14,
    color: '#6b7280',
    padding: 16,
    paddingBottom: 8,
  },
  proCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  proHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00BCD4',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  proInfo: {
    flex: 1,
  },
  proName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingStar: {
    fontSize: 14,
    color: '#FF6B35',
    marginRight: 2,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  location: {
    fontSize: 12,
    color: '#6b7280',
  },
  availableBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  availableText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  proCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  categoryTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 11,
    color: '#374151',
  },
  proFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  jobsCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00BCD4',
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalClose: {
    fontSize: 24,
    color: '#6b7280',
  },
  modalBody: {
    padding: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  ratingOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  ratingOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  ratingOptionActive: {
    backgroundColor: '#00BCD4',
  },
  ratingOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  ratingOptionTextActive: {
    color: 'white',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00BCD4',
    borderColor: '#00BCD4',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#374151',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#00BCD4',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});
