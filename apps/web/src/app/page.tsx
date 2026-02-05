'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProProfile, getPros } from '@ozar/shared';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryGroupCarousel from '@/components/CategoryGroupCarousel';
import ImprovedSearchBar from '@/components/ImprovedSearchBar';
import RotatingText from '@/components/RotatingText';
import VisionSection from '@/components/VisionSection';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapIcon, Users, Briefcase, Star } from 'lucide-react';

// Dynamically import Map component with no SSR
const DynamicMap = dynamic(() => import('@/components/DynamicMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [pros, setPros] = useState<ProProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all pros for the map
  const fetchPros = useCallback(async () => {
    setLoading(true);
    try {
      const results = await getPros({});
      console.log('Fetched', results.length, 'professionals for homepage map');
      setPros(results);
    } catch (error) {
      console.error('Failed to fetch pros:', error);
      setPros([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPros();
  }, [fetchPros]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Hero Section with Integrated Search */}
      <section className="relative bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 sm:py-16 md:py-20 pb-24 sm:pb-28 md:pb-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-teal-600 dark:text-teal-400 rounded-full text-sm font-medium shadow-lg mb-6">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>{t('hero.badge')}</span>
            </div>
            
            {/* Main Heading with Rotating Text */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-8">
              {t('hero.title')} <br className="hidden md:block" />
              <RotatingText />
            </h1>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <ImprovedSearchBar />
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 pt-4 text-gray-700 dark:text-gray-300 font-medium">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span><strong className="text-gray-900 dark:text-white text-lg">10K+</strong> {t('hero.stats.pros')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span><strong className="text-gray-900 dark:text-white text-lg">50K+</strong> {t('hero.stats.jobsDone')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span><strong className="text-gray-900 dark:text-white text-lg">4.9/5</strong> {t('hero.stats.averageRating')}</span>
              </div>
            </div>

            {/* Quick Links Below Stats */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => router.push('/how-it-works')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:border-teal-300 dark:hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('nav.howItWorks')}
              </button>
              <button
                onClick={() => router.push('/trust-safety')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:border-teal-300 dark:hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {t('nav.trustSafety')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <VisionSection />

      {/* Category Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryGroupCarousel 
            onCategorySelect={(category) => router.push(`/search?category=${category}`)} 
          />
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-white dark:bg-gray-900 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-6 lg:space-y-8 order-first text-center lg:text-left">
              <div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t('map.title')}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('map.subtitle')}
                </p>
              </div>
              
              {/* Button and Count - Stacked on Mobile, Side by Side on Desktop */}
              <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:justify-center lg:justify-start sm:gap-4">
                <button
                  onClick={() => router.push('/search')}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mx-auto sm:mx-0"
                >
                  {t('map.viewAllProfessionals')}
                </button>
                
                <div className="flex items-center justify-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {loading ? t('map.loading') : `${pros.length} ${t('map.available')}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Map */}
            <div className="relative order-last">
              <div className="rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-2xl h-[400px] sm:h-[450px] lg:h-[500px]">
                <DynamicMap
                  pros={pros}
                  onProClick={(pro) => router.push(`/pros/${pro.id}`)}
                  height="100%"
                />
              </div>
              
              {/* Districts Badge - Below Map and Centered */}
              <div className="flex justify-center mt-4">
                <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
                  <MapIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">23 {t('map.districtsCovered')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
