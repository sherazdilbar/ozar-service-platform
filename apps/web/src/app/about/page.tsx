'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Target,
  Users,
  CheckCircle,
  Award,
  Zap,
  TrendingUp,
  ArrowRight,
  MapPin,
  Calendar,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative w-full py-16 md:py-20 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                About Ozar
              </h1>
              <div className="w-16 h-0.5 bg-teal-600 mb-8 rounded-full" />
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                Connecting communities with trusted professionals, one service at a time
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-sm font-medium tracking-widest text-teal-600 uppercase mb-4">
                  Our Mission
                </h2>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Making Professional Services Accessible to Everyone
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  At Ozar, we believe that finding reliable, skilled professionals shouldn't be complicated or stressful. Our mission is to create a trusted marketplace where customers can easily connect with verified professionals for any service they need.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  We're building a platform that empowers both customers and professionals, fostering trust, transparency, and quality service delivery in every interaction.
                </p>
              </div>
              <div className="relative">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">10K+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Professionals</div>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">50K+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">100+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Service Categories</div>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">4.9</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-medium tracking-widest text-teal-600 uppercase mb-4">
                Our Core Values
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Trust */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700"
              >
                <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Trust</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We verify every professional and ensure secure payments, building a platform where trust is the foundation of every interaction.
                </p>
              </motion.div>

              {/* Quality */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700"
              >
                <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Award className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quality</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We maintain high standards by continuously monitoring service quality and customer satisfaction across our platform.
                </p>
              </motion.div>

              {/* Innovation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700"
              >
                <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We leverage technology to make service booking seamless, efficient, and accessible to everyone, everywhere.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                      <Calendar className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Founded</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">2026</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                      <MapPin className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Headquarters</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">Budapest, Hungary</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                      <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Coverage</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">Nationwide</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-sm font-medium tracking-widest text-teal-600 uppercase mb-4">
                  Our Journey
                </h2>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  How Ozar Started
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Ozar was born from a simple observation: finding reliable professionals for everyday services was unnecessarily difficult. We saw people struggling to find trustworthy electricians, plumbers, cleaners, and other service providers.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  We decided to build a platform that would solve this problem by creating a trusted marketplace where verified professionals could connect with customers who need their services.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  Today, Ozar serves thousands of customers and professionals across Hungary, making service booking simple, secure, and reliable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-20 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-medium tracking-widest text-teal-600 uppercase mb-4">
                Why Choose Ozar
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                We're committed to providing the best experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Verified Professionals</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Every professional is thoroughly vetted and verified
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Quality Guarantee</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  We ensure high-quality service delivery every time
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Fast Booking</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Book services in minutes with our easy platform
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Growing Network</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Expanding coverage with more pros joining daily
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Join the Ozar Community
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Whether you're looking for services or offering them, Ozar is the place for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition inline-flex items-center justify-center gap-2"
              >
                <span>Find a Professional</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/signup?role=PRO"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-teal-600 dark:hover:border-teal-500 rounded-xl font-semibold transition inline-flex items-center justify-center gap-2"
              >
                <span>Become a Pro</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
