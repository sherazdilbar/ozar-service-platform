import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ServiceCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@ozar/shared';
import { prosApi } from '@ozar/shared/apiClient';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useSearch } from '../../contexts/SearchContext';
import { useAuth } from '../../contexts/AuthContext';
import ProDashboard from '../../components/ProDashboard';

// Conditionally import ProsMapView only on native platforms
let ProsMapView: any = null;
if (Platform.OS !== 'web') {
  ProsMapView = require('../../components/ProsMapView').default;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ServiceCategory[];

const CATEGORY_COLORS: Record<string, string> = {
  PLUMBING: '#E3F2FD',
  ELECTRICAL: '#FFF9C4',
  CLEANING: '#FCE4EC',
  PAINTING: '#F3E5F5',
  CARPENTRY: '#E8F5E9',
  HVAC: '#FFF3E0',
  LANDSCAPING: '#E0F2F1',
  MOVING: '#FFEBEE',
};

type ViewMode = 'list' | 'map';
type SortOption = 'available' | 'rating' | 'price';

export default function HomeScreen() {
  const { user } = useAuth();
  
  // If user is a PRO, show Pro Dashboard
  if (user?.role === 'PRO') {
    return <ProDashboard />;
  }
  
  // Customer Home Screen
  return <CustomerHome />;
}

function CustomerHome() {
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const { searchHistory, addToHistory } = useSearch();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [pros, setPros] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortOption>('available');
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [radiusKm, setRadiusKm] = useState(50); // Default 50km radius

  useEffect(() => {
    if (!showResults) {
      loadPopularPros();
    }
  }, [showResults]);

  const loadPopularPros = async () => {
    setLoading(true);
    try {
      const result = await prosApi.getPros({
        city: 'Budapest',
        radiusKm: radiusKm,
        lat: 47.4979, // Budapest center
        lng: 19.0402,
      });
      // Show first 6 for homepage preview
      setPros((result.data || []).slice(0, 6));
    } catch (error) {
      console.error('Failed to load pros:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPros = async (filters?: any) => {
    setLoading(true);
    try {
      const filterParams: any = {
        city: 'Budapest',
        radiusKm: radiusKm, // Include radius in API call
        lat: 47.4979, // Budapest center
        lng: 19.0402,
        ...filters,
      };
      
      console.log('Loading pros with filters:', filterParams);
      
      // Only send basic filters to API
      // We'll do client-side filtering for more control
      const result = await prosApi.getPros(filterParams);
      console.log('Pros loaded:', result.data?.length || 0, 'professionals');
      setPros(result.data || []);
    } catch (error) {
      console.error('Failed to load pros:', error);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering and sorting (like web app)
  const filteredAndSortedPros = useMemo(() => {
    let filtered = [...pros];

    // Apply filters
    if (minPrice) {
      const min = parseInt(minPrice);
      filtered = filtered.filter(p => p.startingPrice >= min);
    }

    if (maxPrice) {
      const max = parseInt(maxPrice);
      filtered = filtered.filter(p => p.startingPrice <= max);
    }

    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating);
    }

    if (availableOnly) {
      filtered = filtered.filter(p => p.availabilityStatus === 'AVAILABLE');
    }

    if (verifiedOnly) {
      filtered = filtered.filter(p => p.verificationStatus === 'APPROVED');
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.startingPrice - b.startingPrice;
        case 'available':
        default:
          // Recommended: Available first, then by rating, then by review count
          const aAvail = a.availabilityStatus === 'AVAILABLE' ? 1 : 0;
          const bAvail = b.availabilityStatus === 'AVAILABLE' ? 1 : 0;
          if (bAvail !== aAvail) return bAvail - aAvail;
          if (b.rating !== a.rating) return b.rating - a.rating;
          return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
    });

    return filtered;
  }, [pros, minPrice, maxPrice, minRating, availableOnly, verifiedOnly, sortBy]);

  const applyFilters = () => {
    setShowFilters(false);
    // Reload pros with new radius
    if (showResults) {
      loadPros({ 
        category: selectedCategory, 
        searchTerm: searchText.trim() || undefined 
      });
    }
  };
  
  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setAvailableOnly(false);
    setVerifiedOnly(false);
    setRadiusKm(50); // Reset to default 50km
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim()) {
      setShowResults(true);
      setShowSearchHistory(false);
      addToHistory(text.trim());
      loadPros({ searchTerm: text.trim(), category: selectedCategory });
    } else if (!selectedCategory) {
      setShowResults(false);
      setShowSearchHistory(false);
      loadPopularPros();
    }
  };

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setShowResults(false);
      loadPopularPros();
    } else {
      setSelectedCategory(category);
      setShowResults(true);
      loadPros({ 
        category, 
        searchTerm: searchText.trim() || undefined 
      });
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setSelectedCategory(null);
    setShowResults(false);
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setAvailableOnly(false);
    setVerifiedOnly(false);
    setRadiusKm(50); // Reset radius
    loadPopularPros();
  };

  return (
    <View style={styles.container}>
      {showResults && (
        <View style={styles.resultsHeader}>
          <TouchableOpacity onPress={clearSearch} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.resultsTitle}>
            {selectedCategory ? CATEGORY_LABELS[selectedCategory as ServiceCategory] : 'Search Results'}
          </Text>
          <TouchableOpacity onPress={clearSearch} style={styles.filterButton}>
            <Text style={styles.filterIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={showResults && styles.scrollViewResults}
      >
        {!showResults && (
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View>
                  <Text style={styles.brandName}>Ozar</Text>
                  <Text style={styles.tagline}>Find professionals instantly</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.notificationButton}
                  onPress={() => router.push('/notifications')}
                >
                  <Text style={styles.bellIcon}>🔔</Text>
                  {unreadCount > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>Current Location</Text>
                <TouchableOpacity>
                  <Text style={styles.changeLink}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for services..."
                  placeholderTextColor="#9CA3AF"
                  value={searchText}
                  onChangeText={handleSearch}
                  onFocus={() => setShowSearchHistory(true)}
                  onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
                  returnKeyType="search"
                />
                {(searchText || selectedCategory) && (
                  <TouchableOpacity onPress={clearSearch}>
                    <Text style={styles.clearIcon}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Search History */}
              {showSearchHistory && searchHistory.length > 0 && !showResults && (
                <View style={styles.searchHistoryContainer}>
                  <View style={styles.searchHistoryHeader}>
                    <Text style={styles.searchHistoryTitle}>Recent Searches</Text>
                    <TouchableOpacity onPress={() => {}}>
                      <Text style={styles.clearHistoryText}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                  {searchHistory.slice(0, 5).map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.searchHistoryItem}
                      onPress={() => {
                        setSearchText(item);
                        handleSearch(item);
                      }}
                    >
                      <Text style={styles.searchHistoryIcon}>🕐</Text>
                      <Text style={styles.searchHistoryText}>{item}</Text>
                      <Text style={styles.searchHistoryArrow}>↗</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        {/* Filter Button - Show when results are displayed */}
        {showResults && (
          <View style={styles.filterButtonContainer}>
            <TouchableOpacity 
              style={styles.filterButtonMain}
              onPress={() => setShowFilters(true)}
            >
              <Text style={styles.filterButtonText}>🔧 Filters</Text>
              {(minPrice || maxPrice || minRating > 0 || availableOnly || verifiedOnly) && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>•</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Filter Modal */}
        <Modal
          visible={showFilters}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowFilters(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.filterModal}>
              <View style={styles.filterHeader}>
                <Text style={styles.filterTitle}>Filters</Text>
                <TouchableOpacity onPress={() => setShowFilters(false)}>
                  <Text style={styles.filterClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.filterBody}>
                {/* Distance Radius */}
                <Text style={styles.filterLabel}>Distance</Text>
                <View style={styles.radiusRow}>
                  {[5, 10, 25, 50, 100].map((km) => (
                    <TouchableOpacity
                      key={km}
                      style={[
                        styles.radiusButton,
                        radiusKm === km && styles.radiusButtonActive,
                      ]}
                      onPress={() => setRadiusKm(km)}
                    >
                      <Text style={[
                        styles.radiusButtonText,
                        radiusKm === km && styles.radiusButtonTextActive
                      ]}>{km} km</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Price Range */}
                <Text style={styles.filterLabel}>Price Range (HUF)</Text>
                <View style={styles.priceRow}>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Min"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    keyboardType="numeric"
                  />
                  <Text style={styles.priceSeparator}>-</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Max"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    keyboardType="numeric"
                  />
                </View>

                {/* Rating */}
                <Text style={styles.filterLabel}>Minimum Rating</Text>
                <View style={styles.ratingFilterRow}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      style={[
                        styles.ratingFilterButton,
                        minRating >= rating && styles.ratingFilterButtonActive,
                      ]}
                      onPress={() => setMinRating(rating === minRating ? 0 : rating)}
                    >
                      <Text style={[
                        styles.ratingFilterStar,
                        minRating >= rating && styles.ratingFilterStarActive
                      ]}>★</Text>
                      <Text style={[
                        styles.ratingFilterLabel,
                        minRating >= rating && styles.ratingFilterLabelActive
                      ]}>{rating}+</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Toggles */}
                <TouchableOpacity
                  style={styles.toggleRow}
                  onPress={() => setAvailableOnly(!availableOnly)}
                >
                  <Text style={styles.toggleLabel}>Available Now Only</Text>
                  <View style={[styles.toggle, availableOnly && styles.toggleActive]}>
                    <View style={[styles.toggleThumb, availableOnly && styles.toggleThumbActive]} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.toggleRow}
                  onPress={() => setVerifiedOnly(!verifiedOnly)}
                >
                  <Text style={styles.toggleLabel}>Verified Only</Text>
                  <View style={[styles.toggle, verifiedOnly && styles.toggleActive]}>
                    <View style={[styles.toggleThumb, verifiedOnly && styles.toggleThumbActive]} />
                  </View>
                </TouchableOpacity>
              </ScrollView>

              <View style={styles.filterFooter}>
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={clearFilters}
                >
                  <Text style={styles.clearFiltersText}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyFiltersButton}
                  onPress={applyFilters}
                >
                  <Text style={styles.applyFiltersText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {!showResults && (
          <>
            {/* Browse Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Browse Categories</Text>
              <View style={styles.categoriesGrid}>
                {CATEGORIES.slice(0, 8).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryCard,
                      { backgroundColor: CATEGORY_COLORS[category] || '#F3F4F6' },
                      selectedCategory === category && styles.categoryCardSelected,
                    ]}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text style={styles.categoryIcon}>
                      {CATEGORY_ICONS[category]}
                    </Text>
                    <Text style={styles.categoryLabel}>
                      {CATEGORY_LABELS[category]}
                    </Text>
                    {selectedCategory === category && (
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedCheck}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Results Section */}
        {showResults ? (
          <View style={styles.section}>
            {/* Location & View Toggle */}
            <View style={styles.controlsRow}>
              <TouchableOpacity 
                style={styles.locationBadge}
                onPress={() => setShowFilters(true)}
              >
                <Text style={styles.locationBadgeIcon}>📍</Text>
                <Text style={styles.locationBadgeText}>Within {radiusKm} km</Text>
              </TouchableOpacity>
              <View style={styles.viewToggle}>
                <TouchableOpacity
                  style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
                  onPress={() => setViewMode('list')}
                >
                  <Text style={styles.viewButtonIcon}>☰</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.viewButton, viewMode === 'map' && styles.viewButtonActive]}
                  onPress={() => setViewMode('map')}
                >
                  <Text style={styles.viewButtonIcon}>🗺️</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sort Pills */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.sortScroll}
            >
              <TouchableOpacity
                style={[styles.sortPill, sortBy === 'available' && styles.sortPillActive]}
                onPress={() => setSortBy('available')}
              >
                <Text style={[styles.sortPillText, sortBy === 'available' && styles.sortPillTextActive]}>
                  Available Now
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortPill, sortBy === 'rating' && styles.sortPillActive]}
                onPress={() => setSortBy('rating')}
              >
                <Text style={[styles.sortPillText, sortBy === 'rating' && styles.sortPillTextActive]}>
                  Top Rated
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortPill, sortBy === 'price' && styles.sortPillActive]}
                onPress={() => setSortBy('price')}
              >
                <Text style={[styles.sortPillText, sortBy === 'price' && styles.sortPillTextActive]}>
                  Price: Low to Hi
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <Text style={styles.resultsCount}>
              {filteredAndSortedPros.length} professional{filteredAndSortedPros.length !== 1 ? 's' : ''} available
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color="#00BCD4" style={{ marginVertical: 32 }} />
            ) : viewMode === 'map' ? (
              Platform.OS === 'web' ? (
                <View style={styles.mapPlaceholder}>
                  <Text style={styles.mapPlaceholderText}>🗺️</Text>
                  <Text style={styles.mapPlaceholderTitle}>Map View</Text>
                  <Text style={styles.mapPlaceholderSubtitle}>
                    Map view is available on mobile app only
                  </Text>
                </View>
              ) : ProsMapView ? (
                <View style={styles.mapContainer}>
                  <ProsMapView 
                    professionals={filteredAndSortedPros}
                    onProSelect={(proId: string) => router.push(`/pro/${proId}`)}
                  />
                </View>
              ) : (
                <View style={styles.mapPlaceholder}>
                  <Text style={styles.mapPlaceholderText}>🗺️</Text>
                  <Text style={styles.mapPlaceholderTitle}>Map View</Text>
                  <Text style={styles.mapPlaceholderSubtitle}>
                    Loading map...
                  </Text>
                </View>
              )
            ) : filteredAndSortedPros.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>No professionals found</Text>
                <Text style={styles.emptyText}>Try adjusting your search or category</Text>
              </View>
            ) : (
              filteredAndSortedPros.map((pro, index) => {
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
                      <View style={styles.proAvatar}>
                        <Text style={styles.proAvatarText}>{initials}</Text>
                        {isVerified && (
                          <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedText}>✓</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.proInfo}>
                        <View style={styles.proNameRow}>
                          <Text style={styles.proName}>{displayName}</Text>
                          <View style={styles.ratingBadge}>
                            <Text style={styles.ratingStar}>⭐</Text>
                            <Text style={styles.ratingValue}>{pro.rating.toFixed(1)}</Text>
                            <Text style={styles.ratingCount}>({pro.reviewCount})</Text>
                          </View>
                        </View>
                        <Text style={styles.proLocation}>
                          {pro.locationArea} • {pro.jobsCompleted} jobs
                        </Text>
                      </View>
                    </View>

                    <View style={styles.proCategories}>
                      {pro.categories.slice(0, 2).map((cat: string, idx: number) => (
                        <View key={idx} style={styles.categoryTag}>
                          <Text style={styles.categoryTagText}>
                            {CATEGORY_LABELS[cat as ServiceCategory]}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.proFooter}>
                      {isAvailable && (
                        <View style={styles.availableBadge}>
                          <View style={styles.greenDot} />
                          <Text style={styles.availableText}>Available Now</Text>
                        </View>
                      )}
                      <Text style={styles.proPrice}>${pro.startingPrice}/hr</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        ) : (
          /* Popular Near You Section - Homepage Only */
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Near You</Text>
              <TouchableOpacity onPress={() => {
                setShowResults(true);
                loadPros();
              }}>
                <Text style={styles.seeAllLink}>See All</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#00BCD4" style={{ marginVertical: 32 }} />
            ) : pros.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>No professionals found</Text>
                <Text style={styles.emptyText}>Check back later</Text>
              </View>
            ) : (
              pros.slice(0, 2).map((pro, index) => {
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
                      <View style={styles.proAvatar}>
                        <Text style={styles.proAvatarText}>{initials}</Text>
                        {isVerified && (
                          <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedText}>✓</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.proInfo}>
                        <View style={styles.proNameRow}>
                          <Text style={styles.proName}>{displayName}</Text>
                          <View style={styles.ratingBadge}>
                            <Text style={styles.ratingStar}>⭐</Text>
                            <Text style={styles.ratingValue}>{pro.rating.toFixed(1)}</Text>
                            <Text style={styles.ratingCount}>({pro.reviewCount})</Text>
                          </View>
                        </View>
                        <Text style={styles.proLocation}>
                          {pro.locationArea} • {pro.jobsCompleted} jobs
                        </Text>
                      </View>
                    </View>

                    <View style={styles.proCategories}>
                      {pro.categories.slice(0, 2).map((cat: string, idx: number) => (
                        <View key={idx} style={styles.categoryTag}>
                          <Text style={styles.categoryTagText}>
                            {CATEGORY_LABELS[cat as ServiceCategory]}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.proFooter}>
                      {isAvailable && (
                        <View style={styles.availableBadge}>
                          <View style={styles.greenDot} />
                          <Text style={styles.availableText}>Available Now</Text>
                        </View>
                      )}
                      <Text style={styles.proPrice}>${pro.startingPrice}/hr</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  resultsHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#00BCD4',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  filterButton: {
    padding: 8,
  },
  filterIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewResults: {
    paddingTop: 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  bellIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  changeLink: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  clearIcon: {
    fontSize: 18,
    color: '#9CA3AF',
    padding: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  seeAllLink: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: '600',
  },
  clearAllLink: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationBadgeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationBadgeText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewButtonActive: {
    backgroundColor: 'white',
  },
  viewButtonIcon: {
    fontSize: 16,
  },
  sortScroll: {
    marginBottom: 16,
  },
  sortPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  sortPillActive: {
    backgroundColor: '#00BCD4',
  },
  sortPillText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  sortPillTextActive: {
    color: 'white',
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  mapContainer: {
    height: 500,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mapPlaceholder: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  mapPlaceholderText: {
    fontSize: 48,
    marginBottom: 12,
  },
  mapPlaceholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  mapPlaceholderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    position: 'relative',
  },
  categoryCardSelected: {
    borderWidth: 2,
    borderColor: '#00BCD4',
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheck: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 11,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
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
    color: '#6B7280',
  },
  proCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  proHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  proAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  proAvatarText: {
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
  proNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  proName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingStar: {
    fontSize: 12,
    marginRight: 2,
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginRight: 2,
  },
  ratingCount: {
    fontSize: 11,
    color: '#6B7280',
  },
  proLocation: {
    fontSize: 12,
    color: '#6B7280',
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
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
    backgroundColor: '#F3F4F6',
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
    borderTopColor: '#F3F4F6',
  },
  jobsCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  proPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00BCD4',
  },
  searchHistoryContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  searchHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchHistoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  clearHistoryText: {
    fontSize: 12,
    color: '#00BCD4',
    fontWeight: '600',
  },
  searchHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  searchHistoryIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchHistoryText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  searchHistoryArrow: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  filterButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButtonMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    position: 'relative',
  },
  filterButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00BCD4',
  },
  filterBadgeText: {
    fontSize: 8,
    color: '#00BCD4',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  filterClose: {
    fontSize: 24,
    color: '#6b7280',
  },
  filterBody: {
    padding: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    marginTop: 16,
  },
  radiusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  radiusButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  radiusButtonActive: {
    backgroundColor: '#E0F7FA',
    borderColor: '#00BCD4',
  },
  radiusButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  radiusButtonTextActive: {
    color: '#00BCD4',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  priceSeparator: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  ratingFilterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingFilterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ratingFilterButtonActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#F59E0B',
  },
  ratingFilterStar: {
    fontSize: 20,
    color: '#9ca3af',
    marginBottom: 4,
  },
  ratingFilterStarActive: {
    color: '#F59E0B',
  },
  ratingFilterLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  ratingFilterLabelActive: {
    color: '#F59E0B',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  toggleLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  toggle: {
    width: 51,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#00BCD4',
  },
  toggleThumb: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  filterFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  applyFiltersButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#00BCD4',
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});
