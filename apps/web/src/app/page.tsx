'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProProfile, ServiceCategory, getPros } from '@ozar/shared';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryGroupCarousel from '@/components/CategoryGroupCarousel';
import ImprovedSearchBar from '@/components/ImprovedSearchBar';
import { Search, MapIcon, CheckCircle } from 'lucide-react';

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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 sm:py-16 md:py-24">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="animate-fade-in text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-semibold mb-4 md:mb-6">
                <CheckCircle className="w-4 h-4" />
                <span>{t('hero.badge')}</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
                {t('hero.title')}
                <span className="block bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {t('hero.professionals')}
                </span>
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="text-center p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">10K+</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('hero.stats.professionals')}</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">50K+</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('hero.stats.reviews')}</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">100%</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('hero.stats.secure')}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button
                  onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  {t('hero.cta.findPro')}
                </button>
                <button
                  onClick={() => router.push('/auth/signup?role=PRO')}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  {t('hero.cta.becomePro')}
                  <span className="text-xl">→</span>
                </button>
              </div>
            </div>

            <div className="relative animate-fade-in hidden md:block" style={{ animationDelay: '0.2s' }}>
              <div className="relative h-96 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10"></div>
                
                {/* Floating Cards */}
                <div className="absolute top-8 left-8 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-gray-700 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">Verified</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">100% Trusted</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-gray-700 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">4.9/5</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Avg Rating</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl">
                    <MapIcon className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="bg-white dark:bg-gray-800 py-8 sm:py-10 md:py-12 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Connect with verified experts across Budapest's 23 districts. Book instantly or request custom quotes.
            </p>
          </div>

          {/* Improved Search Bar */}
          <ImprovedSearchBar />
        </div>
      </section>

      {/* Category Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse by Category</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Find the perfect professional for your needs</p>
          </div>
          
          <CategoryGroupCarousel 
            onCategorySelect={(category) => router.push(`/search?category=${category}`)} 
          />
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-white dark:bg-gray-900 py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('map.title')}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {loading ? t('map.loading') : `${pros.length} ${t('map.available')}`}
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg">
            <DynamicMap
              pros={pros}
              onProClick={(pro) => router.push(`/pros/${pro.id}`)}
              height="600px"
            />
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/search')}
              className="px-6 sm:px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto text-sm sm:text-base"
            >
              <span>{t('map.viewAll')}</span>
              <MapIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
