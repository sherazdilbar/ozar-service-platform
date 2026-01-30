'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { prosApi } from '@ozar/shared/apiClient';
import Header from '@/components/Header';
import { Clock, CheckCircle, Mail, Phone, MessageSquare } from 'lucide-react';

export default function ProPendingApprovalPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
      return;
    }
    checkApprovalStatus();
  }, [isAuthenticated, user]);

  const checkApprovalStatus = async () => {
    try {
      const profile = await prosApi.getMyProfile();
      if (profile.verificationStatus === 'APPROVED') {
        // If approved, redirect to dashboard
        router.push('/pro/dashboard');
        return;
      }
      setChecking(false);
    } catch (error) {
      console.error('Failed to check approval status:', error);
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                  <Clock className="w-12 h-12 text-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Application Under Review
            </h1>
            
            <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-8">
              Thank you for joining Ozar! Your professional profile is being reviewed by our team.
            </p>

            {/* Status Steps */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 dark:text-green-100">Profile Submitted</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">Your application has been received successfully</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 dark:text-amber-100">Under Review</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">Our team is verifying your information and credentials</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 opacity-50">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-700 dark:text-gray-300">Approval</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">You'll get access to your dashboard once approved</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border-2 border-teal-200 dark:border-teal-800 mb-8">
              <h3 className="font-bold text-teal-900 dark:text-teal-100 mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-teal-800 dark:text-teal-200">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 mt-0.5">•</span>
                  <span>Our team will review your profile within <strong>24-48 hours</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 mt-0.5">•</span>
                  <span>You'll receive an <strong>email notification</strong> once your profile is approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 dark:text-teal-400 mt-0.5">•</span>
                  <span>After approval, you can access your dashboard and start receiving job requests</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Have questions? Contact our support team:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@ozar.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold transition"
                >
                  <Mail className="w-5 h-5" />
                  support@ozar.com
                </a>
                <a
                  href="tel:+36201234567"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold transition"
                >
                  <Phone className="w-5 h-5" />
                  +36 20 123 4567
                </a>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold transition"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
