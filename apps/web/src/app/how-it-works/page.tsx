'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Search, 
  MessageSquare, 
  Calendar, 
  CheckCircle, 
  Star,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function HowItWorksPage() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate which step should be active based on scroll
      const step = Math.floor(scrollPosition / (windowHeight * 0.6));
      setActiveStep(Math.min(step, 4));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-700 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">{t('howItWorks.badge')}</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {t('howItWorks.title')}
          </h1>
          <p className="text-xl text-teal-50 max-w-2xl mx-auto mb-8">
            {t('howItWorks.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold hover:bg-gray-50 transition shadow-lg inline-flex items-center justify-center gap-2"
            >
              <span>{t('howItWorks.getStarted')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/signup?role=PRO"
              className="px-8 py-4 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 transition inline-flex items-center justify-center gap-2"
            >
              <span>{t('howItWorks.becomePro')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step 1 */}
          <div className={`mb-32 transition-all duration-1000 ${activeStep >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full mb-4">
                  <span className="font-bold">{t('howItWorks.step')} 1</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('howItWorks.step1.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {t('howItWorks.step1.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('howItWorks.step1.point1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('howItWorks.step1.point2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('howItWorks.step1.point3')}</span>
                  </li>
                </ul>
              </div>
              
              <div className="order-1 md:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-3xl transform rotate-3"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <Search className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                      <div className="flex-1 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center px-4">
                        <span className="text-gray-400">Search for electrician...</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 transition cursor-pointer">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                            {String.fromCharCode(64 + i)}
                          </div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                          </div>
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`mb-32 transition-all duration-1000 ${activeStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-3xl transform -rotate-3"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <MessageSquare className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Chat with Pro</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none p-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">Hi! I need help with electrical work</p>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end">
                        <div className="flex-1 bg-teal-500 text-white rounded-2xl rounded-tr-none p-4 max-w-xs">
                          <p className="text-sm">Sure! I can help. When works for you?</p>
                        </div>
                        <div className="w-10 h-10 bg-teal-500 rounded-full flex-shrink-0"></div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none p-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">Tomorrow at 2 PM?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full mb-4">
                  <span className="font-bold">{t('howItWorks.step')} 2</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('howItWorks.step2.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {t('howItWorks.step2.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('howItWorks.step2.point1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('howItWorks.step2.point2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('howItWorks.step2.point3')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className={`mb-32 transition-all duration-1000 ${activeStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full mb-4">
                  <span className="font-bold">{t('howItWorks.step')} 3</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('howItWorks.step3.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {t('howItWorks.step3.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('howItWorks.step3.point1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('howItWorks.step3.point2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('howItWorks.step3.point3')}</span>
                  </li>
                </ul>
              </div>
              
              <div className="order-1 md:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl transform rotate-3"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Schedule Service</h3>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2 mb-6">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                          </div>
                          <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                            i === 3 ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}>
                            {i + 15}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</span>
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">2:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</span>
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">2 hours</span>
                      </div>
                      <button className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition">
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className={`mb-32 transition-all duration-1000 ${activeStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl transform -rotate-3"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Job Completed!</h3>
                      <p className="text-gray-600 dark:text-gray-400">Your service has been completed successfully</p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Service</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Electrical Repair</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Professional</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">John Doe</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">$150</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Rate your experience</p>
                      <div className="flex justify-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-8 h-8 text-yellow-500 fill-yellow-500 cursor-pointer hover:scale-110 transition" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full mb-4">
                  <span className="font-bold">{t('howItWorks.step')} 4</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('howItWorks.step4.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {t('howItWorks.step4.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('howItWorks.step4.point1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('howItWorks.step4.point2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('howItWorks.step4.point3')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('howItWorks.whyChoose.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('howItWorks.whyChoose.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('howItWorks.whyChoose.verified.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('howItWorks.whyChoose.verified.description')}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('howItWorks.whyChoose.fast.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('howItWorks.whyChoose.fast.description')}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('howItWorks.whyChoose.community.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('howItWorks.whyChoose.community.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">{t('howItWorks.cta.title')}</h2>
          <p className="text-xl text-teal-50 mb-8">
            {t('howItWorks.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold hover:bg-gray-50 transition shadow-lg inline-flex items-center justify-center gap-2"
            >
              <span>{t('howItWorks.cta.signUp')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 transition inline-flex items-center justify-center gap-2"
            >
              <span>{t('howItWorks.cta.browse')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
