import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ServiceCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@ozar/shared';
import { CATEGORY_GROUPS } from '@ozar/shared/categoryStructure';
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
  const [showAllCategories, setShowAllCategories] = useState(false);
  
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

  const handleSearch = () => {
    const text = searchText.trim();
    if (text) {
      setShowResults(true);
      setShowSearchHistory(false);
      addToHistory(text);
      loadPros({ searchTerm: text, category: selectedCategory });
    } else if (!selectedCategory) {
      setShowResults(false);
      setShowSearchHistory(false);
      loadPopularPros();
    }
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    // Don't auto-search, just update the text
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
          
          {/* Search Bar in Results */}
          <View style={styles.resultsSearchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.resultsSearchInput}
              placeholder="Search for services..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={handleSearchTextChange}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
          
          <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.filterButton}>
            <Text style={styles.filterIcon}>🔽</Text>
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
                  onChangeText={handleSearchTextChange}
                  onSubmitEditing={handleSearch}
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
            </View>

            {/* Search History - Now in normal flow */}
            {showSearchHistory && searchHistory.length > 0 && !showResults && searchText.length === 0 && (
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
                      setShowSearchHistory(false);
                      handleSearch();
                    }}
                  >
                    <Text style={styles.searchHistoryIcon}>🕐</Text>
                    <Text style={styles.searchHistoryText}>{item}</Text>
                    <Text style={styles.searchHistoryArrow}>↗</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
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
                {/* Sort By */}
                <Text style={styles.filterLabel}>Sort By</Text>
                <View style={styles.sortOptionsRow}>
                  <TouchableOpacity
                    style={[styles.sortOptionButton, sortBy === 'available' && styles.sortOptionButtonActive]}
                    onPress={() => setSortBy('available')}
                  >
                    <Text style={[styles.sortOptionText, sortBy === 'available' && styles.sortOptionTextActive]}>
                      Available Now
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.sortOptionButton, sortBy === 'rating' && styles.sortOptionButtonActive]}
                    onPress={() => setSortBy('rating')}
                  >
                    <Text style={[styles.sortOptionText, sortBy === 'rating' && styles.sortOptionTextActive]}>
                      Top Rated
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.sortOptionButton, sortBy === 'price' && styles.sortOptionButtonActive]}
                    onPress={() => setSortBy('price')}
                  >
                    <Text style={[styles.sortOptionText, sortBy === 'price' && styles.sortOptionTextActive]}>
                      Price: Low to Hi
                    </Text>
                  </TouchableOpacity>
                </View>

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
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Browse Categories</Text>
                <TouchableOpacity onPress={() => setShowAllCategories(true)}>
                  <Text style={styles.seeAllLink}>See All</Text>
                </TouchableOpacity>
              </View>
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

        {/* All Categories Modal */}
        <Modal
          visible={showAllCategories}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAllCategories(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.categoriesModal}>
              <View style={styles.filterHeader}>
                <Text style={styles.filterTitle}>All Categories</Text>
                <TouchableOpacity onPress={() => setShowAllCategories(false)}>
                  <Text style={styles.filterClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.filterBody}>
                {CATEGORY_GROUPS.map((group) => (
                  <View key={group.id} style={styles.categoryGroup}>
                    <Text style={styles.categoryGroupTitle}>{group.label}</Text>
                    <View style={styles.categoryGroupGrid}>
                      {group.subcategories.map((category) => (
                        <TouchableOpacity
                          key={category}
                          style={[
                            styles.categoryModalCard,
                            selectedCategory === category && styles.categoryModalCardSelected,
                          ]}
                          onPress={() => {
                            handleCategorySelect(category);
                            setShowAllCategories(false);
                          }}
                        >
                          <Text style={styles.categoryModalIcon}>
                            {CATEGORY_ICONS[category]}
                          </Text>
                          <Text style={styles.categoryModalLabel}>
                            {CATEGORY_LABELS[category]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

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
                <Text style={styles.emptyText}>
                  {searchText.trim() 
                    ? `No results for "${searchText}"`
                    : selectedCategory 
                      ? `No ${CATEGORY_LABELS[selectedCategory as ServiceCategory]} available`
                      : 'Try adjusting your search or filters'
                  }
                </Text>
                <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
                  <Text style={styles.clearSearchButtonText}>Clear Search</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredAndSortedPros.map((pro) => {
                const personName = `${pro.user.firstName} ${pro.user.lastName}`;
                const workType = pro.categories[0] ? CATEGORY_LABELS[pro.categories[0] as ServiceCategory] : 'Professional';
                const initials = `${pro.user.firstName[0]}${pro.user.lastName[0]}`.toUpperCase();
                const isVerified = pro.verificationStatus === 'APPROVED';
                
                return (
                  <View key={pro.id} style={styles.proCard}>
                    <TouchableOpacity
                      onPress={() => router.push(`/pro/${pro.id}`)}
                    >
                      <View style={styles.cardRow}>
                        {/* Left: Avatar with verified badge */}
                        <View style={styles.avatarContainer}>
                          <View style={styles.proAvatar}>
                            <Text style={styles.proAvatarText}>{initials}</Text>
                          </View>
                          {isVerified && (
                            <View style={styles.verifiedBadgeBottom}>
                              <Text style={styles.verifiedIcon}>✓</Text>
                            </View>
                          )}
                        </View>

                        {/* Middle: Info */}
                        <View style={styles.cardMiddle}>
                          <Text style={styles.proNameNew}>{personName}</Text>
                          <Text style={styles.proLocationNew}>
                            📍 {pro.locationArea} • {pro.jobsCompleted} jobs
                          </Text>
                          <Text style={styles.categoryText}>{workType}</Text>
                        </View>

                        {/* Right: Rating and Price */}
                        <View style={styles.cardRight}>
                          <View style={styles.ratingBadgeNew}>
                            <Text style={styles.ratingStarNew}>⭐</Text>
                            <Text style={styles.ratingValueNew}>{pro.rating.toFixed(1)}</Text>
                            <Text style={styles.ratingCountNew}>({pro.reviewCount})</Text>
                          </View>
                          <Text style={styles.priceNew}>{pro.startingPrice} Ft/hr</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Action Buttons */}
                    <View style={styles.cardActions}>
                      <TouchableOpacity 
                        style={styles.viewProfileButton}
                        onPress={() => router.push(`/pro/${pro.id}`)}
                      >
                        <Text style={styles.viewProfileText}>👤 View Full Profile</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.bookNowButton}
                        onPress={() => router.push(`/booking/new?proId=${pro.id}`)}
                      >
                        <Text style={styles.bookNowText}>Book Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
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
              pros.slice(0, 2).map((pro) => {
                const personName = `${pro.user.firstName} ${pro.user.lastName}`;
                const workType = pro.categories[0] ? CATEGORY_LABELS[pro.categories[0] as ServiceCategory] : 'Professional';
                const initials = `${pro.user.firstName[0]}${pro.user.lastName[0]}`.toUpperCase();
                const isVerified = pro.verificationStatus === 'APPROVED';
                
                return (
                  <View key={pro.id} style={styles.proCard}>
                    <TouchableOpacity
                      onPress={() => router.push(`/pro/${pro.id}`)}
                    >
                      <View style={styles.cardRow}>
                        {/* Left: Avatar with verified badge */}
                        <View style={styles.avatarContainer}>
                          <View style={styles.proAvatar}>
                            <Text style={styles.proAvatarText}>{initials}</Text>
                          </View>
                          {isVerified && (
                            <View style={styles.verifiedBadgeBottom}>
                              <Text style={styles.verifiedIcon}>✓</Text>
                            </View>
                          )}
                        </View>

                        {/* Middle: Info */}
                        <View style={styles.cardMiddle}>
                          <Text style={styles.proNameNew}>{personName}</Text>
                          <Text style={styles.proLocationNew}>
                            📍 {pro.locationArea} • {pro.jobsCompleted} jobs
                          </Text>
                          <Text style={styles.categoryText}>{workType}</Text>
                        </View>

                        {/* Right: Rating and Price */}
                        <View style={styles.cardRight}>
                          <View style={styles.ratingBadgeNew}>
                            <Text style={styles.ratingStarNew}>⭐</Text>
                            <Text style={styles.ratingValueNew}>{pro.rating.toFixed(1)}</Text>
                            <Text style={styles.ratingCountNew}>({pro.reviewCount})</Text>
                          </View>
                          <Text style={styles.priceNew}>{pro.startingPrice} Ft/hr</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Action Buttons */}
                    <View style={styles.cardActions}>
                      <TouchableOpacity 
                        style={styles.viewProfileButton}
                        onPress={() => router.push(`/pro/${pro.id}`)}
                      >
                        <Text style={styles.viewProfileText}>👤 View Full Profile</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.bookNowButton}
                        onPress={() => router.push(`/booking/new?proId=${pro.id}`)}
                      >
                        <Text style={styles.bookNowText}>Book Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
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
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  proAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  verifiedBadgeBottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#00BCD4',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedIcon: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardMiddle: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  proNameNew: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  proLocationNew: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 13,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 64,
  },
  ratingBadgeNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  ratingStarNew: {
    fontSize: 14,
    marginRight: 2,
  },
  ratingValueNew: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 2,
  },
  ratingCountNew: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priceNew: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00BCD4',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  viewProfileButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  bookNowButton: {
    flex: 1,
    backgroundColor: '#00BCD4',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bookNowText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  searchHistoryContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 300,
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
  sortOptionsRow: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 8,
  },
  sortOptionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  sortOptionButtonActive: {
    backgroundColor: '#E0F7FA',
    borderColor: '#00BCD4',
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  sortOptionTextActive: {
    color: '#00BCD4',
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
  categoriesModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  categoryGroup: {
    marginBottom: 24,
  },
  categoryGroupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  categoryGroupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryModalCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryModalCardSelected: {
    backgroundColor: '#E0F7FA',
    borderColor: '#00BCD4',
  },
  categoryModalIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryModalLabel: {
    fontSize: 10,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  resultsSearchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  resultsSearchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    marginLeft: 4,
  },
  clearSearchButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  clearSearchButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
