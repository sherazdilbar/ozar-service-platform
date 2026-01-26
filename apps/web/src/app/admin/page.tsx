'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@ozar/shared/apiClient';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    loadStats();
  }, [isAuthenticated, user]);

  const loadStats = async () => {
    try {
      const data = await adminApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      alert('Failed to load admin stats. Make sure you have admin access.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page</p>
          <button onClick={() => router.push('/')} className="text-primary-600 hover:text-primary-700">
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Platform management and oversight</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Site
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Pros Stats */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Professionals</h3>
              <span className="text-2xl">👨‍🔧</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.pros.total}</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Pending:</span>
                <span className="font-semibold text-yellow-600">{stats.pros.pending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Approved:</span>
                <span className="font-semibold text-green-600">{stats.pros.approved}</span>
              </div>
            </div>
          </div>

          {/* Bookings Stats */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Bookings</h3>
              <span className="text-2xl">📅</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.bookings.total}</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Active:</span>
                <span className="font-semibold text-blue-600">{stats.bookings.active}</span>
              </div>
            </div>
          </div>

          {/* Disputes Stats */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Disputes</h3>
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.disputes.total}</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Open:</span>
                <span className="font-semibold text-red-600">{stats.disputes.open}</span>
              </div>
            </div>
          </div>

          {/* Revenue Stats */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Platform Revenue</h3>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.revenue.total}</div>
            <div className="text-sm text-gray-600">Platform Fees</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Manage Pros */}
          <Link href="/admin/pros">
            <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                  👨‍🔧
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">Manage Professionals</h3>
                  <p className="text-sm text-gray-600">Approve, reject, and manage pros</p>
                </div>
                {stats.pros.pending > 0 && (
                  <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {stats.pros.pending}
                  </div>
                )}
              </div>
            </div>
          </Link>

          {/* View Bookings */}
          <Link href="/admin/bookings">
            <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                  📅
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">View Bookings</h3>
                  <p className="text-sm text-gray-600">Monitor all platform bookings</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Handle Disputes */}
          <Link href="/admin/disputes">
            <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
                  ⚠️
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">Handle Disputes</h3>
                  <p className="text-sm text-gray-600">Resolve customer disputes</p>
                </div>
                {stats.disputes.open > 0 && (
                  <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {stats.disputes.open}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="card p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stats.pros.pending}
                </div>
                <div className="text-sm text-gray-600">Pros Awaiting Approval</div>
                {stats.pros.pending > 0 && (
                  <Link href="/admin/pros?status=PENDING">
                    <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Review Now →
                    </button>
                  </Link>
                )}
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stats.bookings.active}
                </div>
                <div className="text-sm text-gray-600">Active Bookings</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {stats.disputes.open}
                </div>
                <div className="text-sm text-gray-600">Open Disputes</div>
                {stats.disputes.open > 0 && (
                  <Link href="/admin/disputes?status=OPEN">
                    <button className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium">
                      Resolve Now →
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
