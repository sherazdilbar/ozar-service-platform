'use client';

import { useCallback, useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ProProfile,
  ServiceCategory,
  getPros,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  BUDAPEST_DISTRICTS,
  BudapestDistrict,
} from '@ozar/shared';
import { getImageUrl } from '@/utils/imageUrl';
import {
  Search,
  MapPin,
  Star,
  Shield,
  Clock,
  MapIcon,
  LayoutList,
  CheckCircle,
  Filter,
  X,
} from 'lucide-react';

const DynamicMap = dynamic(() => import('@/components/DynamicMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  ),
});

type ViewMode = 'list' | 'map';
type SortOption = 'recommended' | 'rating' | 'price' | 'distance' | 'responseTime';

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Pro Card Component - Listeo Style
function ProCard({ pro, userLocation }: { pro: ProProfile; userLocation: { lat: number; lng: number } | null }) {
  const distance = userLocation
    ? calculateDistance(userLocation.lat, userLocation.lng, pro.location.lat, pro.location.lng)
    : null;

  return (
    <Link href={`/pros/${pro.id}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500">
        <div className="flex flex-col sm:flex-row">
          {/* Avatar Section */}
          <div className="relative flex-shrink-0 sm:w-48 md:w-56">
            {pro.user.avatar ? (
              <img
                src={getImageUrl(pro.user.avatar) || '/placeholder-avatar.png'}
                alt={`${pro.user.firstName} ${pro.user.lastName}`}
                className="w-full h-48 sm:h-full object-cover"
              />
            ) : (
              <div className="w-full h-48 sm:h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-5xl font-bold">
                {pro.user.firstName[0]}{pro.user.lastName[0]}
              </div>
            )}
            
            {/* Availability Badge */}
            {pro.availabilityStatus === 'AVAILABLE_NOW' && (
              <div className="absolute top-3 left-3 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1.5">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Available Now
              </div>
            )}
            
            {/* Verification Badge */}
            {pro.verificationStatus === 'APPROVED' && (
              <div className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                <CheckCircle className="w-5 h-5 text-teal-600" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 md:p-5 lg:p-6">
            {/* Header Row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-1 line-clamp-1">
                  {pro.businessName || `${pro.user.firstName} ${pro.user.lastName}`}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{pro.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({pro.reviewCount} {pro.reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>
              
              {/* Price Badge */}
              <div className="flex-shrink-0 text-right">
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl border border-teal-200 dark:border-teal-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Starting from</div>
                  <div className="text-xl md:text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {pro.startingPrice.toLocaleString()}
                    <span className="text-sm font-normal ml-1">{pro.currency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {pro.bio || 'Professional service provider ready to help with your needs.'}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                  <MapPin className="w-4 h-4 text-teal-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Location</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {pro.location.area}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                  <Shield className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {pro.jobsCompleted} jobs
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                  <Clock className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Response</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    ~{pro.responseTime}min
                  </div>
                </div>
              </div>
              
              {distance && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                    <MapPin className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Distance</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {distance.toFixed(1)}km
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl">
              View Profile & Book
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  // Get initial values from URL
  const initialCategory = (searchParams?.get('category') as ServiceCategory) || undefined;
  const initialQuery = searchParams?.get('q') || '';
  const initialDistrict = searchParams?.get('district') || '';
  
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | undefined>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);

  const [availableNow, setAvailableNow] = useState(false);
  const [radiusKm, setRadiusKm] = useState(10);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [pros, setPros] = useState<ProProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(null)
      );
    }
  }, []);

  // Fetch pros
  const fetchPros = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Search page fetching pros with:', {
        category: selectedCategory,
        availableNow: availableNow || undefined,
        searchTerm: debouncedQuery || undefined,
        location: userLocation || undefined,
        maxDistance: radiusKm,
        district: selectedDistrict || undefined,
      });
      
      const results = await getPros({
        category: selectedCategory,
        availableNow: availableNow || undefined,
        searchTerm: debouncedQuery || undefined,
        location: userLocation || undefined,
        maxDistance: radiusKm,
        district: selectedDistrict || undefined,
      });
      
      console.log('Search page received pros:', results.length);
      setPros(results);
    } catch (error) {
      console.error('Failed to fetch pros:', error);
      setPros([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, availableNow, debouncedQuery, userLocation, radiusKm, selectedDistrict]);

  useEffect(() => {
    fetchPros();
  }, [fetchPros]);

  // Filter and sort pros
  const filteredPros = useMemo(() => {
    let out = pros;

    if (minRating > 0) {
      out = out.filter((p) => p.rating >= minRating);
    }

    if (maxPrice > 0) {
      out = out.filter((p) => p.startingPrice <= maxPrice);
    }

    // Sort
    out = [...out].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.startingPrice - b.startingPrice;
        case 'distance':
          if (userLocation) {
            const distA = calculateDistance(userLocation.lat, userLocation.lng, a.location.lat, a.location.lng);
            const distB = calculateDistance(userLocation.lat, userLocation.lng, b.location.lat, b.location.lng);
            return distA - distB;
          }
          return 0;
        case 'responseTime':
          return a.responseTime - b.responseTime;
        case 'recommended':
        default:
          const aAvail = a.availabilityStatus === 'AVAILABLE_NOW' ? 1 : 0;
          const bAvail = b.availabilityStatus === 'AVAILABLE_NOW' ? 1 : 0;
          if (bAvail !== aAvail) return bAvail - aAvail;
          if (b.rating !== a.rating) return b.rating - a.rating;
          return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      }
    });

    return out;
  }, [pros, minRating, maxPrice, sortBy, userLocation]);

  const total = filteredPros.length;
  
  // Pagination
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPros = filteredPros.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedDistrict, availableNow, minRating, maxPrice, sortBy, debouncedQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 sm:top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden px-3 sm:px-4 py-2 sm:py-3 bg-teal-600 text-white rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2 font-medium hover:bg-teal-700 transition-all text-sm sm:text-base flex-shrink-0"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">{t('searchPage.filters')}</span>
            </button>
          </div>

          {/* Active Filters Display */}
          {(selectedDistrict || selectedCategory) && (
            <div className="flex items-center gap-2 mt-2 sm:mt-3 flex-wrap">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active:</span>
              {selectedDistrict && (
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">District </span>
                  <span>{selectedDistrict}</span>
                  <button
                    onClick={() => {
                      setSelectedDistrict('');
                      const params = new URLSearchParams(window.location.search);
                      params.delete('district');
                      router.push(`/search?${params.toString()}`);
                    }}
                    className="hover:bg-teal-200 dark:hover:bg-teal-800 rounded p-0.5"
                  >
                    <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              )}
              {selectedCategory && (
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium">
                  <span className="text-base sm:text-lg">{CATEGORY_ICONS[selectedCategory]}</span>
                  <span className="hidden xs:inline">{CATEGORY_LABELS[selectedCategory]}</span>
                  <button
                    onClick={() => {
                      setSelectedCategory(undefined);
                      const params = new URLSearchParams(window.location.search);
                      params.delete('category');
                      router.push(`/search?${params.toString()}`);
                    }}
                    className="hover:bg-teal-200 dark:hover:bg-teal-800 rounded p-0.5"
                  >
                    <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
          {/* Filters Sidebar */}
          <aside className={cn(
            'lg:block lg:w-72 flex-shrink-0',
            showMobileFilters ? 'fixed inset-0 z-50 bg-white dark:bg-gray-800 p-4 sm:p-6 overflow-y-auto' : 'hidden'
          )}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 lg:sticky lg:top-24">
              <div className="space-y-4 sm:space-y-6">
              {showMobileFilters && (
                <div className="flex items-center justify-between mb-4 sm:mb-6 lg:hidden">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{t('searchPage.filters')}</h3>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              )}

              <div className="hidden lg:block">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-teal-600" />
                  {t('searchPage.filters')}
                </h3>
              </div>

              {/* Category */}
              {selectedCategory && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('categories.title')}</h4>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl border border-teal-200 dark:border-teal-800">
                    <span className="text-2xl">{CATEGORY_ICONS[selectedCategory]}</span>
                    <span className="text-sm font-semibold text-teal-700 dark:text-teal-300 flex-1">
                      {CATEGORY_LABELS[selectedCategory]}
                    </span>
                    <button
                      onClick={() => setSelectedCategory(undefined)}
                      className="p-1 hover:bg-teal-200 dark:hover:bg-teal-800 rounded-lg transition"
                    >
                      <X className="w-4 h-4 text-teal-700 dark:text-teal-300" />
                    </button>
                  </div>
                </div>
              )}

              {/* District Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  <MapPin className="w-4 h-4 inline mr-2 text-teal-600" />
                  Budapest District
                </h4>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    const newDistrict = e.target.value;
                    setSelectedDistrict(newDistrict);
                    
                    // Update URL
                    const params = new URLSearchParams(window.location.search);
                    if (newDistrict) {
                      params.set('district', newDistrict);
                    } else {
                      params.delete('district');
                    }
                    router.push(`/search?${params.toString()}`);
                  }}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                >
                  <option value="">All Districts</option>
                  {Object.keys(BUDAPEST_DISTRICTS).map((district) => (
                    <option key={district} value={district}>
                      District {district} - {BUDAPEST_DISTRICTS[district as BudapestDistrict].nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('searchPage.availableNowDesc')}</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availableNow}
                    onChange={(e) => setAvailableNow(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Within 48 hours</span>
                </label>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('searchPage.minimumRating')}</h4>
                <div className="space-y-2">
                  {[0, 3, 3.5, 4, 4.5].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="w-4 h-4 text-teal-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {rating === 0 ? t('searchPage.any') : `${rating}+ stars`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Distance */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('searchPage.distance')}</h4>
                <div className="space-y-2">
                  {[5, 10, 20, 50].map((km) => (
                    <label key={km} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="distance"
                        checked={radiusKm === km}
                        onChange={() => setRadiusKm(km)}
                        className="w-4 h-4 text-teal-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t('searchPage.searchingWithin')} {km}{t('searchPage.radius')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory(undefined);
                  setSelectedDistrict('');
                  setAvailableNow(false);
                  setMinRating(0);
                  setMaxPrice(0);
                  setRadiusKm(10);
                  setSortBy('recommended');
                  setShowMobileFilters(false);
                  router.push('/search');
                }}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
              >
                {t('searchPage.clearAllFilters')}
              </button>
            </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                    {selectedCategory ? CATEGORY_LABELS[selectedCategory] : t('searchPage.title')}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 sm:w-4 sm:h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                        {t('searchPage.findingProfessionals')}
                      </span>
                    ) : (
                      <span className="font-medium">{total} {t('searchPage.professionals')} {t('searchPage.available')}</span>
                    )}
                  </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'flex-1 sm:flex-none p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all font-medium',
                      viewMode === 'list' 
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    )}
                    title={t('searchPage.listView')}
                  >
                    <LayoutList className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={cn(
                      'flex-1 sm:flex-none p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all font-medium',
                      viewMode === 'map' 
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    )}
                    title={t('searchPage.mapView')}
                  >
                    <MapIcon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                  </button>
                </div>
              </div>

              {/* Pagination Info - Only show in list view */}
              {viewMode === 'list' && total > 0 && (
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                  Showing {startIndex + 1}-{Math.min(endIndex, total)} of {total} professionals
                </div>
              )}

              {/* Sort Options */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{t('searchPage.sortBy')}:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium"
                >
                  <option value="recommended">{t('searchPage.recommended')}</option>
                  <option value="rating">{t('searchPage.highestRating')}</option>
                  <option value="price">{t('searchPage.lowestPrice')}</option>
                  <option value="distance">{t('searchPage.nearest')}</option>
                  <option value="responseTime">{t('searchPage.fastestResponse')}</option>
                </select>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-b-4 border-teal-600 mx-auto mb-3 sm:mb-4" />
                  <p className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">{t('searchPage.findingProfessionals')}</p>
                </div>
              </div>
            ) : viewMode === 'list' ? (
              <>
                <div className="space-y-4 md:space-y-5 lg:space-y-6">
                  {filteredPros.length === 0 ? (
                    <div className="w-full text-center py-10 sm:py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 px-4 sm:px-6">
                      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4 md:mb-6">🔍</div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                        {t('searchPage.noResults')}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto px-4">
                        {t('searchPage.tryAdjusting')}
                      </p>
                      <button
                        onClick={() => {
                          setSelectedCategory(undefined);
                          setSelectedDistrict('');
                          setAvailableNow(false);
                          setMinRating(0);
                          setMaxPrice(0);
                          setRadiusKm(10);
                          router.push('/search');
                        }}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-teal-600 text-white rounded-lg sm:rounded-xl hover:bg-teal-700 transition font-medium text-sm sm:text-base"
                      >
                        {t('searchPage.clearFilters')}
                      </button>
                    </div>
                  ) : (
                    paginatedPros.map((pro) => (
                      <ProCard key={pro.id} pro={pro} userLocation={userLocation} />
                    ))
                  )}
                </div>

                {/* Pagination Controls */}
                {total > itemsPerPage && (
                  <div className="mt-4 sm:mt-6 md:mt-8 flex items-center justify-center gap-1 sm:gap-2">
                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.max(1, prev - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </button>

                    <div className="flex items-center gap-1 sm:gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        const showPage = 
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1);
                        
                        const showEllipsis = 
                          (page === currentPage - 2 && currentPage > 3) ||
                          (page === currentPage + 2 && currentPage < totalPages - 2);

                        if (showEllipsis) {
                          return (
                            <span key={page} className="px-2 text-gray-500 dark:text-gray-400">
                              ...
                            </span>
                          );
                        }

                        if (!showPage) return null;

                        return (
                          <button
                            key={page}
                            onClick={() => {
                              setCurrentPage(page);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={cn(
                              'w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base font-medium rounded-lg transition',
                              currentPage === page
                                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                                : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            )}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.min(totalPages, prev + 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="h-[700px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
                <DynamicMap
                  pros={filteredPros}
                  height="700px"
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Main export with Suspense wrapper
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
