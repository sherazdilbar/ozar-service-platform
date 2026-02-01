'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CATEGORY_ICONS } from '@ozar/shared';
import { chatApi, prosApi } from '@ozar/shared/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Avatar from '@/components/Avatar';
import FavoriteButton from '@/components/FavoriteButton';
import { getImageUrl } from '@/utils/imageUrl';
import Image from 'next/image';
import { 
  ArrowLeft, Star, CheckCircle, MapPin, Clock, MessageCircle, 
  Calendar, Award, Shield, TrendingUp, Heart, Share2, Phone, Mail
} from 'lucide-react';

export default function ProProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [pro, setPro] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'portfolio' | 'reviews'>('services');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    loadProData();
  }, [params?.id]);

  const loadProData = async () => {
    if (!params?.id) return;
    try {
      const proData = await prosApi.getProById(params.id as string);
      const reviewsData = await prosApi.getProReviews(params.id as string);
      setPro(proData);
      setReviews(reviewsData.data || []);
    } catch (error) {
      console.error('Failed to load pro data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    router.push(`/booking/new?proId=${pro.id}`);
  };

  const handleMessage = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Prevent pros from messaging other pros
    if (user.role === 'PRO') {
      alert('Professionals cannot message other professionals. Only customers can initiate conversations.');
      return;
    }

    try {
      const conversation = await chatApi.createConversation({
        customerId: user.id,
        proId: pro.id,
      });
      router.push(`/chat/${conversation.id}`);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      alert('Failed to start conversation');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{t('proProfile.loading')}</p>
        </div>
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('proProfile.notFound')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t('proProfile.notFoundDesc')}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition"
          >
            {t('proProfile.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'services', label: t('proProfile.services'), icon: Award, count: pro.services?.length || 0 },
    { id: 'portfolio', label: t('proProfile.portfolio'), icon: TrendingUp, count: pro.portfolio?.length || 0 },
    { id: 'reviews', label: t('proProfile.reviewsTab'), icon: Star, count: reviews.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Top Navigation */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{t('proProfile.back')}</span>
            </button>
            <div className="flex items-center gap-3">
              <FavoriteButton proId={pro.id} size="lg" />
              <button className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-blue-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left: Profile Info */}
            <div className="md:col-span-2">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                    <Avatar
                      imageUrl={pro.user.avatar}
                      name={`${pro.user.firstName} ${pro.user.lastName}`}
                      size={160}
                      className="rounded-3xl shadow-2xl ring-4 ring-white dark:ring-gray-800"
                    />
                    {pro.verificationStatus === 'APPROVED' && (
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-800">
                        <Shield className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {t('proProfile.availableNow')}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {pro.user.firstName} {pro.user.lastName}
                      </h1>
                      {pro.businessName && (
                        <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">{pro.businessName}</p>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {pro.categories.map((cat: string) => (
                      <div key={cat} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <span className="text-2xl">{CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS]}</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{cat.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Star className="w-6 h-6 text-white fill-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{pro.rating}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{pro.reviewCount} {t('proProfile.reviews')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-4 border border-teal-200 dark:border-teal-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{pro.jobsCompleted}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{t('proProfile.completed')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{pro.yearsExperience}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{t('proProfile.yearsExp')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{pro.locationArea}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{pro.locationCity}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Action Card */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('searchPage.startingFrom')}</div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    {pro.startingPrice} {pro.currency}
                  </div>
                </div>

                <div className="space-y-3">
                  {user?.role === 'CUSTOMER' ? (
                    <button
                      onClick={handleBookNow}
                      className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      {t('proProfile.bookNow')}
                    </button>
                  ) : user?.role === 'PRO' ? (
                    <div className="w-full py-4 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 cursor-not-allowed">
                      <Calendar className="w-5 h-5" />
                      {t('proProfile.prosCannotBook')}
                    </div>
                  ) : (
                    <button
                      onClick={handleBookNow}
                      className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      {t('proProfile.bookNow')}
                    </button>
                  )}

                  {user?.role === 'PRO' ? (
                    <div className="w-full py-4 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                      <MessageCircle className="w-5 h-5" />
                      {t('proProfile.prosCannotMessage')}
                    </div>
                  ) : (
                    <button 
                      onClick={handleMessage}
                      className="w-full py-4 bg-white dark:bg-gray-700 border-2 border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-2xl font-bold hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {t('proProfile.sendMessage')}
                    </button>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-600 dark:text-gray-400">{t('proProfile.responseTime')}</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{pro.responseTime} min</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-600 dark:text-gray-400">{t('proProfile.serviceRadius')}</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{pro.serviceAreaRadius} km</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all relative whitespace-nowrap ${
                    isActive
                      ? 'text-teal-600 dark:text-teal-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isActive 
                        ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-t-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* About Section */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                About Me
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{pro.bio}</p>
            </div>

            {/* Services */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                Services Offered
              </h2>
              <div className="grid gap-4">
                {pro.services?.map((service: any) => (
                  <div 
                    key={service.id} 
                    className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl p-6 hover:border-teal-500 dark:hover:border-teal-400 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{service.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration} min</span>
                          </div>
                          <div className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-xl text-sm font-medium">
                            {service.pricingModel === 'HOURLY' ? '⏱️ Per Hour' : service.pricingModel === 'FIXED' ? '💰 Fixed Price' : '🔍 Inspection'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                          {service.price}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{service.currency}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              Portfolio Gallery
            </h2>
            {pro.portfolio?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pro.portfolio.map((item: any) => (
                  <div key={item.id} className="group cursor-pointer">
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-lg">
                      <Image
                        src={getImageUrl(item.imageUrl) || item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-lg">{item.title}</h3>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Portfolio Yet</h3>
                <p className="text-gray-600 dark:text-gray-400">This professional hasn't added any portfolio items</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
                Customer Reviews
              </h2>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{pro.rating}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{reviews.length} reviews</div>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review: any) => (
                  <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        {review.customerAvatar ? (
                          <Image
                            src={review.customerAvatar}
                            alt={review.customerName}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                            {review.customerName?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{review.customerName}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                        {review.response && (
                          <div className="mt-4 ml-4 p-4 bg-teal-50 dark:bg-teal-900/30 rounded-xl border-l-4 border-teal-500">
                            <div className="text-sm font-semibold text-teal-900 dark:text-teal-300 mb-1">
                              Response from {pro.user.firstName}
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{review.response.text}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Reviews Yet</h3>
                <p className="text-gray-600 dark:text-gray-400">Be the first to review this professional!</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign In Required</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please sign in or create an account to book services and message professionals
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push(`/auth/login?redirect=/pros/${pro.id}`)}
                className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push(`/auth/signup?redirect=/pros/${pro.id}`)}
                className="w-full py-4 bg-white dark:bg-gray-700 border-2 border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-xl font-bold text-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all flex items-center justify-center gap-2"
              >
                Create Account
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              New to Ozar? Sign up to get started with booking trusted professionals
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
