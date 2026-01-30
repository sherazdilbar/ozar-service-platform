'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { prosApi } from '@ozar/shared/apiClient';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Star,
  Users,
  Clock,
  CheckCircle,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    change: number;
  };
  bookings: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
  };
  rating: {
    average: number;
    total: number;
    distribution: Record<number, number>;
  };
  performance: {
    responseTime: number;
    completionRate: number;
    repeatCustomers: number;
  };
}

export default function ProAnalyticsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    revenue: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      change: 0,
    },
    bookings: {
      total: 0,
      completed: 0,
      pending: 0,
      cancelled: 0,
    },
    rating: {
      average: 0,
      total: 0,
      distribution: {},
    },
    performance: {
      responseTime: 0,
      completionRate: 0,
      repeatCustomers: 0,
    },
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
      return;
    }
    loadAnalytics();
  }, [isAuthenticated, user, period]);

  const loadAnalytics = async () => {
    try {
      const profile = await prosApi.getMyProfile();
      
      // Mock analytics data - replace with actual API call
      setAnalytics({
        revenue: {
          total: 125000,
          thisMonth: 45000,
          lastMonth: 38000,
          change: 18.4,
        },
        bookings: {
          total: profile.jobsCompleted || 0,
          completed: profile.jobsCompleted || 0,
          pending: 5,
          cancelled: 2,
        },
        rating: {
          average: profile.rating || 0,
          total: profile.reviewCount || 0,
          distribution: {
            5: 45,
            4: 12,
            3: 3,
            2: 1,
            1: 0,
          },
        },
        performance: {
          responseTime: 12,
          completionRate: 95,
          repeatCustomers: 23,
        },
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600" />
        </div>
      </div>
    );
  }

  const revenueChange = analytics.revenue.change;
  const isPositiveChange = revenueChange >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-teal-600" />
                Analytics & Insights
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your performance and business growth
              </p>
            </div>
            <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
              {(['week', 'month', 'year'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    period === p
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8" />
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                isPositiveChange ? 'bg-green-500/30' : 'bg-red-500/30'
              }`}>
                {isPositiveChange ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(revenueChange)}%
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">HUF {analytics.revenue.thisMonth.toLocaleString()}</div>
            <div className="text-teal-100 text-sm">This {period}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.bookings.completed}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Completed Bookings</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.rating.average.toFixed(1)}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Average Rating</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.performance.repeatCustomers}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Repeat Customers</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-teal-600" />
              Performance Metrics
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Response Time</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.performance.responseTime} min
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full"
                    style={{ width: `${Math.min((30 - analytics.performance.responseTime) / 30 * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {analytics.performance.responseTime < 15 ? 'Excellent' : 'Good'} - Keep it under 15 minutes
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Completion Rate</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.performance.completionRate}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                    style={{ width: `${analytics.performance.completionRate}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {analytics.performance.completionRate >= 90 ? 'Outstanding' : 'Good'} - Target is 90%+
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 text-teal-600 dark:text-teal-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">You're in the top 10% of professionals!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              Rating Distribution
            </h2>
            
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = analytics.rating.distribution[rating] || 0;
                const percentage = analytics.rating.total > 0 
                  ? (count / analytics.rating.total) * 100 
                  : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Reviews</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.rating.total}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Status */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-600" />
            Booking Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {analytics.bookings.total}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Total Bookings</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {analytics.bookings.completed}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Completed</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {analytics.bookings.pending}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Pending</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <X className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {analytics.bookings.cancelled}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Cancelled</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
