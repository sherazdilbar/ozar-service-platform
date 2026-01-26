'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Shield,
  CheckCircle,
  Lock,
  Eye,
  FileCheck,
  AlertCircle,
  Users,
  CreditCard,
  MessageSquare,
  Star,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  UserCheck,
  BadgeCheck
} from 'lucide-react';

export default function TrustSafetyPage() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      const section = Math.floor(scrollPosition / (windowHeight * 0.5));
      setActiveSection(Math.min(section, 5));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">{t('trustSafety.badge')}</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {t('trustSafety.title')}
          </h1>
          <p className="text-xl text-blue-50 max-w-2xl mx-auto mb-8">
            {t('trustSafety.subtitle')}
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center text-left max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
              <ShieldCheck className="w-6 h-6" />
              <div>
                <div className="font-bold">100%</div>
                <div className="text-sm text-blue-100">{t('trustSafety.stats.verified')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
              <Lock className="w-6 h-6" />
              <div>
                <div className="font-bold">{t('trustSafety.stats.secure')}</div>
                <div className="text-sm text-blue-100">{t('trustSafety.stats.payments')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
              <Users className="w-6 h-6" />
              <div>
                <div className="font-bold">24/7</div>
                <div className="text-sm text-blue-100">{t('trustSafety.stats.support')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Professional Verification */}
          <div className={`mb-32 transition-all duration-1000 ${activeSection >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full mb-4">
                  <BadgeCheck className="w-4 h-4" />
                  <span className="font-bold">{t('trustSafety.verification.badge')}</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('trustSafety.verification.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {t('trustSafety.verification.description')}
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.verification.identity.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.verification.identity.description')}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.verification.background.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.verification.background.description')}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.verification.skills.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.verification.skills.description')}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.verification.insurance.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.verification.insurance.description')}</div>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="order-1 md:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl transform rotate-3"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserCheck className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Verification Status</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { label: 'Identity Verified', status: 'complete' },
                        { label: 'Background Check', status: 'complete' },
                        { label: 'Skills Verified', status: 'complete' },
                        { label: 'Insurance Active', status: 'complete' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                          <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">✓ Approved</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Ready to serve customers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Payments */}
          <div className={`mb-32 transition-all duration-1000 ${activeSection >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl transform -rotate-3"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <Lock className="w-8 h-8 text-green-600 dark:text-green-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Secure Payment</h3>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Service Fee</span>
                          <span className="font-semibold text-gray-900 dark:text-white">$150.00</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Platform Fee</span>
                          <span className="font-semibold text-gray-900 dark:text-white">$22.50</span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                            <span className="text-xl font-bold text-green-600 dark:text-green-400">$172.50</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <Shield className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <div className="font-semibold mb-1">Payment Protected</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Funds held securely until job completion</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-1 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">
                        PayPal
                      </div>
                      <div className="flex-1 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">
                        Stripe
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full mb-4">
                  <Lock className="w-4 h-4" />
                  <span className="font-bold">{t('trustSafety.payment.badge')}</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('trustSafety.payment.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {t('trustSafety.payment.description')}
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.payment.escrow.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.payment.escrow.description')}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.payment.encrypted.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.payment.encrypted.description')}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.payment.dispute.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.payment.dispute.description')}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.payment.refund.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.payment.refund.description')}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reviews & Ratings */}
          <div className={`mb-32 transition-all duration-1000 ${activeSection >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full mb-4">
                  <Star className="w-4 h-4" />
                  <span className="font-bold">{t('trustSafety.reviews.badge')}</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('trustSafety.reviews.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {t('trustSafety.reviews.description')}
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.reviews.verified.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.reviews.verified.description')}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.reviews.noFake.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.reviews.noFake.description')}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.reviews.response.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.reviews.response.description')}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.reviews.transparent.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.reviews.transparent.description')}</div>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="order-1 md:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-3xl transform rotate-3"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                    <div className="space-y-4">
                      {[
                        { name: 'Sarah M.', rating: 5, text: 'Excellent service! Very professional and on time.' },
                        { name: 'John D.', rating: 5, text: 'Highly recommend! Great quality work.' },
                        { name: 'Emma W.', rating: 4, text: 'Good experience overall. Would use again.' }
                      ].map((review, i) => (
                        <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                {review.name[0]}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white text-sm">{review.name}</div>
                                <div className="flex gap-0.5">
                                  {[...Array(review.rating)].map((_, j) => (
                                    <Star key={j} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{review.text}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center border border-yellow-200 dark:border-yellow-800">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">4.8/5.0</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating from 10,000+ Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Data */}
          <div className={`mb-32 transition-all duration-1000 ${activeSection >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl transform -rotate-3"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Privacy Matters</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-3 mb-2">
                          <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <span className="font-semibold text-gray-900 dark:text-white">Data Encryption</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">All personal data encrypted at rest and in transit</p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <span className="font-semibold text-gray-900 dark:text-white">GDPR Compliant</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Full compliance with data protection regulations</p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-3 mb-2">
                          <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <span className="font-semibold text-gray-900 dark:text-white">No Data Selling</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">We never sell your personal information</p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-3 mb-2">
                          <FileCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <span className="font-semibold text-gray-900 dark:text-white">Data Control</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Request, export, or delete your data anytime</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full mb-4">
                  <Eye className="w-4 h-4" />
                  <span className="font-bold">{t('trustSafety.privacy.badge')}</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('trustSafety.privacy.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {t('trustSafety.privacy.description')}
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.privacy.minimal.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.privacy.minimal.description')}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.privacy.secure.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.privacy.secure.description')}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.privacy.transparent.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.privacy.transparent.description')}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">{t('trustSafety.privacy.audits.title')}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{t('trustSafety.privacy.audits.description')}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('trustSafety.support.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('trustSafety.support.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('trustSafety.support.liveChat.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t('trustSafety.support.liveChat.description')}</p>
              <button className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition">
                {t('trustSafety.support.liveChat.button')}
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('trustSafety.support.report.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t('trustSafety.support.report.description')}</p>
              <button className="px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition">
                {t('trustSafety.support.report.button')}
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FileCheck className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('trustSafety.support.helpCenter.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t('trustSafety.support.helpCenter.description')}</p>
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
                {t('trustSafety.support.helpCenter.button')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">{t('trustSafety.cta.title')}</h2>
          <p className="text-xl text-blue-50 mb-8">
            {t('trustSafety.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-50 transition shadow-lg inline-flex items-center justify-center gap-2"
            >
              <span>{t('trustSafety.cta.getStarted')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition inline-flex items-center justify-center gap-2"
            >
              <span>{t('trustSafety.cta.browse')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
