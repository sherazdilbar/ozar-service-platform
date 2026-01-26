'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  FileText,
  CheckCircle,
  AlertTriangle,
  Scale,
  Users,
  CreditCard,
  Ban,
  Shield,
  Mail,
  Sparkles
} from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Legal Agreement</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Terms of Service
          </h1>
          <p className="text-xl text-blue-50 max-w-2xl mx-auto mb-4">
            Please read these terms carefully before using Ozar
          </p>
          <p className="text-sm text-blue-100">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#acceptance" className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition">
              Acceptance
            </a>
            <a href="#user-accounts" className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition">
              User Accounts
            </a>
            <a href="#services" className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition">
              Services
            </a>
            <a href="#payments" className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition">
              Payments
            </a>
            <a href="#prohibited" className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition">
              Prohibited Use
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Agreement to Terms
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    By accessing and using Ozar, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Acceptance */}
          <div id="acceptance" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                1. Acceptance of Terms
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                These Terms of Service constitute a legally binding agreement between you and Ozar. By using our platform, you represent that:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>You are at least 18 years old</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>You have the legal capacity to enter into binding contracts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>You will comply with all applicable laws and regulations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>All information you provide is accurate and truthful</span>
                </li>
              </ul>
            </div>
          </div>

          {/* User Accounts */}
          <div id="user-accounts" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                2. User Accounts
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Account Registration
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  To use certain features, you must create an account. You agree to:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Provide accurate and complete information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Maintain the security of your password</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Notify us immediately of any unauthorized access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Be responsible for all activities under your account</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Professional Accounts
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Professionals must undergo verification and maintain accurate credentials, licenses, and insurance information. We reserve the right to verify and approve all professional accounts.
                </p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div id="services" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                3. Platform Services
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Service Marketplace
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ozar provides a platform connecting customers with service professionals. We are not a party to the actual service agreement between customers and professionals. We do not employ professionals and are not responsible for their actions or the quality of services provided.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Booking and Cancellation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Customers and professionals must adhere to our booking and cancellation policies:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Bookings must be made in good faith</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Cancellations may incur fees as per our policy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>No-shows may result in account penalties</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payments */}
          <div id="payments" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                4. Payments and Fees
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Payment Processing
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  All payments are processed securely through our platform:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Customers pay through the platform for all services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Platform fees are clearly disclosed before booking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Professionals receive payment after service completion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Refunds are processed according to our refund policy</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Service Fees
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ozar charges a platform fee for facilitating connections between customers and professionals. This fee is typically 15% of the service price and is added to the total booking cost.
                </p>
              </div>
            </div>
          </div>

          {/* Prohibited Use */}
          <div id="prohibited" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Ban className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                5. Prohibited Activities
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You agree not to:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Violate any laws or regulations</span>
                </div>
                <div className="flex items-start gap-2">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Provide false information</span>
                </div>
                <div className="flex items-start gap-2">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Impersonate others</span>
                </div>
                <div className="flex items-start gap-2">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Harass or abuse users</span>
                </div>
                <div className="flex items-start gap-2">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Circumvent platform fees</span>
                </div>
                <div className="flex items-start gap-2">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Spam or send unsolicited messages</span>
                </div>
                <div className="flex items-start gap-2">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Hack or compromise security</span>
                </div>
                <div className="flex items-start gap-2">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Use automated systems (bots)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Violation Consequences
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Violation of these terms may result in account suspension or termination, legal action, and reporting to authorities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Liability */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                6. Limitation of Liability
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Ozar provides the platform "as is" and makes no warranties about:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>The quality, safety, or legality of services provided by professionals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>The accuracy of user-provided information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>Uninterrupted or error-free platform operation</span>
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400">
                We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
              </p>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                7. Changes to Terms
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes via email or platform notification. Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white text-center">
            <Mail className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">
              Questions About These Terms?
            </h2>
            <p className="text-blue-100 mb-6">
              If you have any questions about our Terms of Service, please contact us
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
