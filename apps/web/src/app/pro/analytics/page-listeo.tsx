'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProLayout from '@/components/ProLayout';
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
  ArrowDown,
  X
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

export default function ProAnalyticsPageListeo() {
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
      <ProLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600" />
        </div>
      </ProLayout>
    );
  }

  const revenueChange = analytics.revenue.change;
  const isPositiveChange = revenueChange >= 0;

  return (
    <ProLayout>
      <div className="p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
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
                  className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
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
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg p-6 text-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                isPositiveChange ? 'bg-green-500/30' : 'bg-red-500/30'
              }`}>
                {isPositiveChange ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(revenueChange)}%
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">HUF {analytics.revenue.thisMonth.toLocaleString()}</div>
            <div className="text-teal-100 text-sm">This {period}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.bookings.completed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed Bookings</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.rating.average.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.performance.repeatCustomers}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Repeat Customers</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Performance Metrics
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Response Time</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {analytics.performance.responseTime} min
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-600 rounded-full transition-all"
                    style={{ width: `${Math.min((30 - analytics.performance.responseTime) / 30 * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {analytics.performance.responseTime < 15 ? 'Excellent' : 'Good'} - Keep it under 15 minutes
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Completion Rate</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {analytics.performance.completionRate}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full transition-all"
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
                  <span className="text-sm font-semibold">You're in the top 10% of professionals!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
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
                        className="h-full bg-yellow-500 rounded-full transition-all duration-500"
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
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {analytics.rating.total}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Booking Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {analytics.bookings.total}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {analytics.bookings.completed}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {analytics.bookings.pending}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <X className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {analytics.bookings.cancelled}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Cancelled</div>
            </div>
          </div>
        </div>
      </div>
    </ProLayout>
  );
}
