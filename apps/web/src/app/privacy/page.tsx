'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  FileText,
  AlertCircle,
  CheckCircle,
  Mail,
  Sparkles
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-700 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Your Privacy Matters</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-indigo-50 max-w-2xl mx-auto mb-4">
            How we collect, use, and protect your personal information
          </p>
          <p className="text-sm text-indigo-100">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#information-collection" className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition">
              Information Collection
            </a>
            <a href="#how-we-use" className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition">
              How We Use Data
            </a>
            <a href="#data-sharing" className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition">
              Data Sharing
            </a>
            <a href="#your-rights" className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition">
              Your Rights
            </a>
            <a href="#security" className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition">
              Security
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border-2 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Our Commitment to Your Privacy
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    At Ozar, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully to understand our practices regarding your personal data.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Information Collection */}
          <div id="information-collection" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Information We Collect
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  Personal Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  When you create an account, we collect:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Name, email address, and phone number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Profile photo and bio (optional)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Location information for service delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Payment information (processed securely)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  Usage Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  We automatically collect certain information when you use our platform:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Device information (browser type, operating system)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>IP address and location data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Pages visited and features used</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Booking and transaction history</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Data */}
          <div id="how-we-use" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                How We Use Your Information
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We use your information to:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Provide and improve our services</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Process bookings and payments</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Send notifications and updates</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Verify professional credentials</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Prevent fraud and abuse</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Provide customer support</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Analyze platform usage</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Comply with legal obligations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div id="data-sharing" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Information Sharing
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  With Service Professionals
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  When you book a service, we share your name, contact information, and service details with the professional to fulfill your booking.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  With Payment Processors
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We use secure third-party payment processors to handle transactions. Your payment information is encrypted and never stored on our servers.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  For Legal Compliance
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We may disclose information when required by law, to protect our rights, or to prevent fraud and ensure platform safety.
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      We Never Sell Your Data
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div id="your-rights" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Your Privacy Rights
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You have the right to:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Access Your Data</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Request a copy of your personal information</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Correct Your Data</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Update or correct inaccurate information</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Delete Your Data</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Request deletion of your account and data</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Opt-Out of Marketing</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Unsubscribe from promotional emails</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div id="security" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Data Security
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Encryption</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">SSL/TLS encryption for data transmission</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Secure Storage</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Encrypted database storage</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Access Control</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Limited employee access to data</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Monitoring</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">24/7 security monitoring</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-8 text-white text-center">
            <Mail className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">
              Questions About Privacy?
            </h2>
            <p className="text-indigo-100 mb-6">
              If you have any questions about this Privacy Policy, please contact us
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-50 transition"
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
