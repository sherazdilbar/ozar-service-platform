'use client';

import { useCallback, useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BudapestDistrictSelector from '@/components/BudapestDistrictSelector';
import {
  ProProfile,
  ServiceCategory,
  getPros,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  isBudapest,
} from '@ozar/shared';
import { getImageUrl } from '@/utils/imageUrl';
import {
  Search,
  MapPin,
  Star,
  Shield,
  Clock,
  ChevronRight,
  Heart,
  MessageSquare,
  MapIcon,
  LayoutList,
  CheckCircle,
  Filter,
  X,
  Zap,
  TrendingUp,
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

// Pro Card Component - Enhanced
function ProCard({ pro, userLocation }: { pro: ProProfile; userLocation: { lat: number; lng: number } | null }) {
  const { t } = useLanguage();
  const distance = userLocation
    ? calculateDistance(userLocation.lat, userLocation.lng, pro.location.lat, pro.location.lng)
    : null;

  // Determine badge
  const isTopRated = pro.rating >= 4.7;
  const isQuickResponse = pro.responseTime <= 15;

  return (
    <Link href={`/pros/${pro.id}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 relative overflow-hidden">
        {/* Hover Effect Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative">
          <div className="flex gap-4">
            {/* Avatar with Status */}
            <div className="flex-shrink-0 relative">
              {pro.user.avatar ? (
                <img
                  src={getImageUrl(pro.user.avatar) || '/placeholder-avatar.png'}
                  alt={`${pro.user.firstName} ${pro.user.lastName}`}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {pro.user.firstName[0]}{pro.user.lastName[0]}
                </div>
              )}
              {pro.availabilityStatus === 'AVAILABLE_NOW' && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full animate-pulse" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {pro.businessName || `${pro.user.firstName} ${pro.user.lastName}`}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900 dark:text-white">{pro.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({pro.reviewCount} {t('searchPage.reviews')})
                      </span>
                    </div>
                    {pro.verificationStatus === 'APPROVED' && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">{t('search.quickActions.verifiedOnly')}</span>
                      </div>
                    )}
                    {isTopRated && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">{t('searchPage.topRated')}</span>
                      </div>
                    )}
                    {isQuickResponse && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                        <Zap className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">{t('searchPage.fastestResponse')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Availability Badge */}
                {pro.availabilityStatus === 'AVAILABLE_NOW' && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    {t('searchPage.availableNow')}
                  </div>
                )}
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                {pro.bio}
              </p>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {pro.categories.slice(0, 3).map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium"
                  >
                    {CATEGORY_LABELS[cat]}
                  </span>
                ))}
                {pro.categories.length > 3 && (
                  <span className="px-3 py-1 text-gray-600 dark:text-gray-400 text-xs font-medium">
                    +{pro.categories.length - 3} more
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="font-medium">{pro.location.area}</span>
                  {distance && <span className="text-xs text-gray-500">• {distance.toFixed(1)}km</span>}
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="font-medium">{pro.jobsCompleted} {t('searchPage.jobsCompleted').toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="font-medium">~{pro.responseTime}min</span>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('searchPage.startingFrom')}</span>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pro.startingPrice.toLocaleString()} <span className="text-base font-normal text-gray-600 dark:text-gray-400">{pro.currency}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle message
                    }}
                    className="p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all"
                    title={t('nav.messages')}
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl">
                    {t('searchPage.viewProfile')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Get initial values from URL
  const initialCategory = (searchParams?.get('category') as ServiceCategory) || undefined;
  const initialQuery = searchParams?.get('q') || '';
  
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | undefined>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  const [availableNow, setAvailableNow] = useState(false);
  const [radiusKm, setRadiusKm] = useState(10);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  
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
      });
      
      const results = await getPros({
        category: selectedCategory,
        availableNow: availableNow || undefined,
        searchTerm: debouncedQuery || undefined,
        location: userLocation || undefined,
        maxDistance: radiusKm,
      });
      
      console.log('Search page received pros:', results.length);
      setPros(results);
    } catch (error) {
      console.error('Failed to fetch pros:', error);
      setPros([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, availableNow, debouncedQuery, userLocation, radiusKm]);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <Header />

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden px-4 py-3 bg-teal-600 text-white rounded-xl flex items-center gap-2 font-medium hover:bg-teal-700 transition-all"
            >
              <Filter className="w-5 h-5" />
              <span>{t('searchPage.filters')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={cn(
            'lg:block lg:w-72 flex-shrink-0',
            showMobileFilters ? 'fixed inset-0 z-50 bg-white dark:bg-gray-800 p-6 overflow-y-auto' : 'hidden'
          )}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
              <div className="space-y-6">
              {showMobileFilters && (
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('searchPage.filters')}</h3>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              )}

              <div className="hidden lg:block">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
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
                  setAvailableNow(false);
                  setMinRating(0);
                  setMaxPrice(0);
                  setRadiusKm(10);
                  setSortBy('recommended');
                  setShowMobileFilters(false);
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedCategory ? CATEGORY_LABELS[selectedCategory] : t('searchPage.title')}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                        {t('searchPage.findingProfessionals')}
                      </span>
                    ) : (
                      <span className="font-medium">{total} {t('searchPage.professionals')} {t('searchPage.available')}</span>
                    )}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-3 rounded-xl transition-all font-medium',
                      viewMode === 'list' 
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    )}
                    title={t('searchPage.listView')}
                  >
                    <LayoutList className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={cn(
                      'p-3 rounded-xl transition-all font-medium',
                      viewMode === 'map' 
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    )}
                    title={t('searchPage.mapView')}
                  >
                    <MapIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('searchPage.sortBy')}:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium"
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
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-400">{t('searchPage.findingProfessionals')}</p>
                </div>
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-8">
                {filteredPros.length === 0 ? (
                  <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="text-7xl mb-6">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {t('searchPage.noResults')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      {t('searchPage.tryAdjusting')}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory(undefined);
                        setAvailableNow(false);
                        setMinRating(0);
                        setMaxPrice(0);
                        setRadiusKm(10);
                      }}
                      className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-medium"
                    >
                      {t('searchPage.clearFilters')}
                    </button>
                  </div>
                ) : (
                  filteredPros.map((pro) => (
                    <ProCard key={pro.id} pro={pro} userLocation={userLocation} />
                  ))
                )}
              </div>
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
