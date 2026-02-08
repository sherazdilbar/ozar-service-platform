'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Search,
  ChevronDown,
  Check,
  ArrowUp,
  Shield,
  AlertCircle,
} from 'lucide-react';

// Types & Data
type PrivacySection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

const privacyData: PrivacySection[] = [
  {
    id: 'information-collection',
    title: '1. Information We Collect',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h4>
          <p className="mb-2">When you create an account, we collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name, email address, and phone number</li>
            <li>Profile photo and bio (optional)</li>
            <li>Location information for service delivery</li>
            <li>Payment information (processed securely)</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Usage Information</h4>
          <p className="mb-2">We automatically collect certain information when you use our platform:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Device information (browser type, operating system)</li>
            <li>IP address and location data</li>
            <li>Pages visited and features used</li>
            <li>Booking and transaction history</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>We use your information to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Provide and improve our services</li>
          <li>Process bookings and payments</li>
          <li>Send notifications and updates</li>
          <li>Verify professional credentials</li>
          <li>Prevent fraud and abuse</li>
          <li>Provide customer support</li>
          <li>Analyze platform usage</li>
          <li>Comply with legal obligations</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'data-sharing',
    title: '3. Information Sharing',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">With Service Professionals</h4>
          <p>
            When you book a service, we share your name, contact information, and service details with the professional to fulfill your booking.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">With Payment Processors</h4>
          <p>
            We use secure third-party payment processors to handle transactions. Your payment information is encrypted and never stored on our servers.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">For Legal Compliance</h4>
          <p>
            We may disclose information when required by law, to protect our rights, or to prevent fraud and ensure platform safety.
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">We Never Sell Your Data</p>
          <p className="text-sm">
            We do not sell, rent, or trade your personal information to third parties for marketing purposes.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'your-rights',
    title: '4. Your Privacy Rights',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>You have the right to:</p>
        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white mb-1">Access Your Data</div>
            <div className="text-sm">Request a copy of your personal information</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white mb-1">Correct Your Data</div>
            <div className="text-sm">Update or correct inaccurate information</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white mb-1">Delete Your Data</div>
            <div className="text-sm">Request deletion of your account and data</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white mb-1">Opt-Out of Marketing</div>
            <div className="text-sm">Unsubscribe from promotional emails</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'security',
    title: '5. Data Security',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>We implement industry-standard security measures to protect your information:</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white mb-1">Encryption</div>
            <div className="text-sm">SSL/TLS encryption for data transmission</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white mb-1">Secure Storage</div>
            <div className="text-sm">Encrypted database storage</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white mb-1">Access Control</div>
            <div className="text-sm">Limited employee access to data</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white mb-1">Monitoring</div>
            <div className="text-sm">24/7 security monitoring</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'cookies',
    title: '6. Cookies and Tracking',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>
          We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us remember your preferences, analyze site traffic, and provide personalized content.
        </p>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Types of Cookies We Use:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Essential Cookies:</strong> Required for the platform to function properly</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
          </ul>
        </div>
        <p className="text-sm">
          You can control cookies through your browser settings. Note that disabling certain cookies may affect platform functionality.
        </p>
      </div>
    ),
  },
  {
    id: 'changes',
    title: '7. Changes to Privacy Policy',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Posting the updated policy on our platform</li>
          <li>Sending you an email notification</li>
          <li>Displaying a prominent notice on our website</li>
        </ul>
        <p>
          Your continued use of the platform after changes become effective constitutes acceptance of the updated Privacy Policy. We encourage you to review this policy periodically.
        </p>
      </div>
    ),
  },
];

// Circular Progress Component
function CircularProgress({ value, total }: { value: number; total: number }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const percentage = (value / total) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-12 h-12">
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth="3"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="24"
          cy="24"
        />
        <circle
          className="text-indigo-600 transition-all duration-1000 ease-out"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="24"
          cy="24"
        />
      </svg>
      <span className="absolute text-xs font-semibold text-gray-700 dark:text-gray-300">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [reviewedSections, setReviewedSections] = useState<Set<string>>(new Set());
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Filter privacy sections based on search
  const filteredSections = privacyData.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
      // Mark as reviewed permanently when opened
      setReviewedSections((prev) => {
        const newReviewed = new Set(prev);
        newReviewed.add(id);
        return newReviewed;
      });
    }
    setExpandedSections(newExpanded);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const progress = reviewedSections.size;
  const totalSections = privacyData.length;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
      <Header />

      {/* Hero / Banner */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 text-xs font-medium mb-6">
            <Shield className="w-3 h-3" />
            Last Updated: February 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            How we collect, use, and protect your personal information. Your privacy is our priority.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 relative">
        {/* Sticky Controls Bar */}
        <div className="sticky top-16 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm py-4 mb-8 border-b border-gray-200 dark:border-gray-700 transition-all">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search privacy policy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>
            <div className="hidden sm:flex items-center gap-3 bg-white dark:bg-gray-800 pl-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Reviewed
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {progress} of {totalSections}
                </p>
              </div>
              <CircularProgress value={progress} total={totalSections} />
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredSections.map((section) => {
              const isOpen = expandedSections.has(section.id);
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`group rounded-xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-700 shadow-lg shadow-indigo-900/5 ring-1 ring-indigo-500/20'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                          isOpen
                            ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                        }`}
                      >
                        {isOpen ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-bold">
                            {section.id.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-lg font-semibold transition-colors ${
                          isOpen ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {section.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-0 border-t border-transparent">
                          <div className="prose prose-indigo dark:prose-invert prose-sm max-w-none pt-4 border-t border-dashed border-indigo-100 dark:border-indigo-800">
                            {section.content}
                          </div>
                          <div className="mt-6 flex justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSection(section.id);
                              }}
                              className="px-4 py-2 text-sm font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors"
                            >
                              Close Section
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No results found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Try adjusting your search query.
              </p>
            </div>
          )}
        </div>

        {/* Questions CTA */}
        <div className="mt-16 rounded-2xl bg-gray-900 dark:bg-gray-800 p-8 sm:p-12 text-center relative overflow-hidden border border-gray-800 dark:border-gray-700">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl"></div>
          <div className="relative z-10">
            <AlertCircle className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Questions About Privacy?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Our privacy team is available to answer any questions about how we handle your data. We're committed to transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg font-medium transition-colors"
              >
                Contact Privacy Team
              </a>
              <a
                href="/help"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg font-medium transition-colors"
              >
                Visit Help Center
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Floating Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
