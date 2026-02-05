'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CATEGORY_ICONS } from '@ozar/shared';
import { chatApi, prosApi } from '@ozar/shared/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Avatar from '@/components/Avatar';
import FavoriteButton from '@/components/FavoriteButton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getImageUrl } from '@/utils/imageUrl';
import Image from 'next/image';
import { 
  Star, MapPin, Clock, MessageCircle, Calendar, Award, 
  Shield, CheckCircle, Phone, Mail, Share2, ChevronRight
} from 'lucide-react';

export default function ProProfilePageListeo() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [pro, setPro] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'portfolio' | 'reviews'>('overview');
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

    if (user.role === 'PRO') {
      alert('Professionals cannot message other professionals.');
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600" />
        </div>
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Professional not found</h2>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />

      {/* Hero Section with Cover */}
      <div className="relative h-48 sm:h-64 lg:h-80 bg-gradient-to-r from-teal-600 to-cyan-600">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Could add cover image here if available */}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 lg:-mt-32 pb-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <div className="relative">
                    <Avatar
                      imageUrl={pro.user.avatar}
                      name={`${pro.user.firstName} ${pro.user.lastName}`}
                      size={100}
                      className="rounded-lg sm:w-[120px] sm:h-[120px]"
                    />
                    {pro.verificationStatus === 'APPROVED' && (
                      <div className="absolute -bottom-2 -right-2 bg-teal-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-3 gap-3">
                    <div className="flex-1">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {pro.user.firstName} {pro.user.lastName}
                      </h1>
                      {pro.businessName && (
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">{pro.businessName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <FavoriteButton proId={pro.id} />
                      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pro.categories.map((cat: string) => (
                      <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-sm font-medium">
                        <span>{CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS]}</span>
                        <span>{cat.replace('_', ' ')}</span>
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-900 dark:text-white">{pro.rating}</span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">({pro.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                      <span>{pro.jobsCompleted} jobs</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{pro.locationCity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <nav className="flex -mb-px min-w-max">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'services', label: 'Services', count: pro.services?.length },
                    { id: 'portfolio', label: 'Portfolio', count: pro.portfolio?.length },
                    { id: 'reviews', label: 'Reviews', count: reviews.length },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* About */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About</h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{pro.bio}</p>
                    </div>

                    {/* Quick Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Response Time</div>
                          <div className="font-semibold text-gray-900 dark:text-white">{pro.responseTime} min</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Experience</div>
                          <div className="font-semibold text-gray-900 dark:text-white">{pro.yearsExperience} years</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="space-y-4">
                    {pro.services?.map((service: any) => (
                      <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-teal-500 dark:hover:border-teal-400 transition">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">{service.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{service.description}</p>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <Clock className="w-4 h-4" />
                                {service.duration} min
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600 dark:text-gray-400">
                                {service.pricingModel === 'HOURLY' ? 'Per Hour' : service.pricingModel === 'FIXED' ? 'Fixed Price' : 'Inspection'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                              {service.price}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{service.currency}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'portfolio' && (
                  <div>
                    {pro.portfolio?.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {pro.portfolio.map((item: any) => (
                          <div key={item.id} className="group cursor-pointer">
                            <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                              <Image
                                src={getImageUrl(item.imageUrl) || item.imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{item.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">No portfolio items yet</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((review: any) => {
                        const customerName = review.customerName || review.customer?.firstName 
                          ? `${review.customer?.firstName || ''} ${review.customer?.lastName || ''}`.trim()
                          : 'Anonymous';
                        const customerAvatar = review.customerAvatar || review.customer?.avatar;
                        
                        return (
                          <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                            <div className="flex items-start gap-4">
                              <Avatar
                                imageUrl={customerAvatar}
                                name={customerName}
                                size={48}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{customerName}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex items-center">
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
                                <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">No reviews yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Booking Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starting from</div>
                  <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">
                    {pro.startingPrice} <span className="text-xl">{pro.currency}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {user?.role === 'PRO' ? (
                    <>
                      <div className="w-full py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-lg font-semibold text-center cursor-not-allowed">
                        Pros cannot book
                      </div>
                      <div className="w-full py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-lg font-semibold text-center cursor-not-allowed">
                        Pros cannot message
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleBookNow}
                        className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-5 h-5" />
                        Book Now
                      </button>
                      <button 
                        onClick={handleMessage}
                        className="w-full py-3 bg-white dark:bg-gray-700 border-2 border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-lg font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/30 transition flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Send Message
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-gray-600 dark:text-gray-400">Response time</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{pro.responseTime} min</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-gray-600 dark:text-gray-400">Service area</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{pro.serviceAreaRadius} km radius</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  {pro.user.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{pro.user.phone}</span>
                    </div>
                  )}
                  {pro.user.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{pro.user.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{pro.locationCity}, {pro.locationArea}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign In Required</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please sign in to book services and message professionals
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push(`/auth/login?redirect=/pros/${pro.id}`)}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push(`/auth/signup?redirect=/pros/${pro.id}`)}
                className="w-full py-3 bg-white dark:bg-gray-700 border-2 border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-lg font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/30 transition"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
