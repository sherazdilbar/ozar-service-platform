'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Heart,
  Target,
  Users,
  Globe,
  Award,
  Zap,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-700 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Our Story</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            About Ozar
          </h1>
          <p className="text-xl text-purple-50 max-w-2xl mx-auto mb-8">
            Connecting communities with trusted professionals, one service at a time
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full mb-4">
                <Target className="w-4 h-4" />
                <span className="font-bold">Our Mission</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Making Professional Services Accessible to Everyone
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                At Ozar, we believe that finding reliable, skilled professionals shouldn't be complicated or stressful. Our mission is to create a trusted marketplace where customers can easily connect with verified professionals for any service they need.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We're building a platform that empowers both customers and professionals, fostering trust, transparency, and quality service delivery in every interaction.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold mb-2">10K+</div>
                    <div className="text-sm text-white/90">Professionals</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold mb-2">50K+</div>
                    <div className="text-sm text-white/90">Happy Customers</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold mb-2">100+</div>
                    <div className="text-sm text-white/90">Service Categories</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold mb-2">4.9</div>
                    <div className="text-sm text-white/90">Average Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Trust */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Trust</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We verify every professional and ensure secure payments, building a platform where trust is the foundation of every interaction.
              </p>
            </div>

            {/* Quality */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quality</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We maintain high standards by continuously monitoring service quality and customer satisfaction across our platform.
              </p>
            </div>

            {/* Innovation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We leverage technology to make service booking seamless, efficient, and accessible to everyone, everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl p-12 shadow-2xl text-white">
                <div className="flex items-center gap-4 mb-6">
                  <Calendar className="w-8 h-8" />
                  <div>
                    <div className="text-sm text-teal-100">Founded</div>
                    <div className="text-2xl font-bold">2024</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <MapPin className="w-8 h-8" />
                  <div>
                    <div className="text-sm text-teal-100">Headquarters</div>
                    <div className="text-2xl font-bold">Budapest, Hungary</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Globe className="w-8 h-8" />
                  <div>
                    <div className="text-sm text-teal-100">Coverage</div>
                    <div className="text-2xl font-bold">Nationwide</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold">Our Journey</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                How Ozar Started
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Ozar was born from a simple observation: finding reliable professionals for everyday services was unnecessarily difficult. We saw people struggling to find trustworthy electricians, plumbers, cleaners, and other service providers.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                We decided to build a platform that would solve this problem by creating a trusted marketplace where verified professionals could connect with customers who need their services.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Today, Ozar serves thousands of customers and professionals across Hungary, making service booking simple, secure, and reliable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Ozar?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We're committed to providing the best experience for both customers and professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verified Professionals</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every professional is thoroughly vetted and verified
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Quality Guarantee</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We ensure high-quality service delivery every time
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Fast Booking</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Book services in minutes with our easy platform
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Growing Network</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Expanding coverage with more pros joining daily
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join the Ozar Community
          </h2>
          <p className="text-xl text-purple-50 mb-8">
            Whether you're looking for services or offering them, Ozar is the place for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-50 transition shadow-lg inline-flex items-center justify-center gap-2"
            >
              <span>Find a Professional</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/signup?role=PRO"
              className="px-8 py-4 bg-purple-700 text-white rounded-xl font-semibold hover:bg-purple-800 transition inline-flex items-center justify-center gap-2 border-2 border-white/20"
            >
              <span>Become a Pro</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
