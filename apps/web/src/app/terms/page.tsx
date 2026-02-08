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
  FileText,
  AlertCircle,
} from 'lucide-react';

// Types & Data
type TermSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

const termsData: TermSection[] = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>
          By accessing or using the Ozar platform ("Service"), you agree to be
          bound by these Terms of Service ("Terms"). If you disagree with any
          part of the terms, you may not access the Service.
        </p>
        <p>
          These Terms apply to all visitors, users, and others who access or use
          the Service. Your access to and use of the Service is conditioned on
          your acceptance of and compliance with these Terms.
        </p>
      </div>
    ),
  },
  {
    id: 'accounts',
    title: '2. User Accounts',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>
          When you create an account with us, you must provide us information
          that is accurate, complete, and current at all times. Failure to do so
          constitutes a breach of the Terms, which may result in immediate
          termination of your account on our Service.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            You are responsible for safeguarding the password that you use to
            access the Service.
          </li>
          <li>You agree not to disclose your password to any third party.</li>
          <li>
            You must notify us immediately upon becoming aware of any breach of
            security or unauthorized use of your account.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'services',
    title: '3. Platform Services',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>
          Ozar provides a suite of tools for connecting customers with service professionals in Budapest. We
          reserve the right to modify, suspend, or discontinue any part of the
          Service at any time with or without notice.
        </p>
        <p>
          We do not guarantee that the Service will be available at all times or
          in all locations. We may experience hardware, software, or other
          problems or need to perform maintenance related to the Service,
          resulting in interruptions, delays, or errors.
        </p>
      </div>
    ),
  },
  {
    id: 'payments',
    title: '4. Payments and Fees',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>
          Some parts of the Service are billed on a subscription basis
          ("Subscription(s)"). You will be billed in advance on a recurring and
          periodic basis ("Billing Cycle"). Billing cycles are set either on a
          monthly or annual basis, depending on the type of subscription plan
          you select when purchasing a Subscription.
        </p>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm">
          <strong>Note:</strong> All fees are exclusive of all taxes, levies, or
          duties imposed by taxing authorities, and you shall be responsible for
          payment of all such taxes, levies, or duties.
        </div>
      </div>
    ),
  },
  {
    id: 'prohibited',
    title: '5. Prohibited Activities',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>You may not use the Service for any of the following purposes:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            In any way that violates any applicable national or international
            law or regulation.
          </li>
          <li>
            For the purpose of exploiting, harming, or attempting to exploit or
            harm minors in any way.
          </li>
          <li>
            To transmit, or procure the sending of, any advertising or
            promotional material, including any "junk mail", "chain letter",
            "spam," or any other similar solicitation.
          </li>
          <li>
            To impersonate or attempt to impersonate the Company, a Company
            employee, another user, or any other person or entity.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'liability',
    title: '6. Limitation of Liability',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>
          In no event shall Ozar, nor its directors, employees, partners,
          agents, suppliers, or affiliates, be liable for any indirect,
          incidental, special, consequential or punitive damages, including
          without limitation, loss of profits, data, use, goodwill, or other
          intangible losses, resulting from your access to or use of or
          inability to access or use the Service.
        </p>
      </div>
    ),
  },
  {
    id: 'changes',
    title: '7. Changes to Terms',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. If a revision is material we will try to
          provide at least 30 days notice prior to any new terms taking effect.
          What constitutes a material change will be determined at our sole
          discretion.
        </p>
        <p>
          By continuing to access or use our Service after those revisions
          become effective, you agree to be bound by the revised terms. If you
          do not agree to the new terms, please stop using the Service.
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
          className="text-teal-600 transition-all duration-1000 ease-out"
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

export default function TermsOfServicePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [reviewedSections, setReviewedSections] = useState<Set<string>>(new Set());
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Filter terms based on search
  const filteredTerms = termsData.filter((term) =>
    term.title.toLowerCase().includes(searchQuery.toLowerCase())
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
  const totalSections = termsData.length;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
      <Header />

      {/* Hero / Banner */}
      <div className="bg-teal-50 dark:bg-teal-900/20 border-b border-teal-100 dark:border-teal-800">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-200 text-xs font-medium mb-6">
            <FileText className="w-3 h-3" />
            Last Updated: February 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Please read these terms carefully before using our platform. We've
            made them as clear and transparent as possible.
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
                placeholder="Search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all"
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
            {filteredTerms.map((term) => {
              const isOpen = expandedSections.has(term.id);
              return (
                <motion.div
                  key={term.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`group rounded-xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-white dark:bg-gray-800 border-teal-200 dark:border-teal-700 shadow-lg shadow-teal-900/5 ring-1 ring-teal-500/20'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => toggleSection(term.id)}
                    className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                          isOpen
                            ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/50 group-hover:text-teal-600 dark:group-hover:text-teal-400'
                        }`}
                      >
                        {isOpen ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-bold">
                            {term.id.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-lg font-semibold transition-colors ${
                          isOpen ? 'text-teal-900 dark:text-teal-100' : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {term.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''
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
                          <div className="prose prose-teal dark:prose-invert prose-sm max-w-none pt-4 border-t border-dashed border-teal-100 dark:border-teal-800">
                            {term.content}
                          </div>
                          <div className="mt-6 flex justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSection(term.id);
                              }}
                              className="px-4 py-2 text-sm font-medium bg-teal-50 dark:bg-teal-900/30 text-teal-900 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 rounded-lg transition-colors"
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

          {filteredTerms.length === 0 && (
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
          <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-teal-500/20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl"></div>
          <div className="relative z-10">
            <AlertCircle className="h-10 w-10 text-teal-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Our legal team is available to clarify any points in these terms.
              We believe in full transparency with our users.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-lg font-medium transition-colors"
              >
                Contact Legal Team
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
            className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-teal-600 text-white shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
