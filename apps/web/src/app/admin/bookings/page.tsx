'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@ozar/shared/apiClient';

export default function AdminBookingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    loadBookings();
  }, [isAuthenticated, user, statusFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (statusFilter !== 'ALL') {
        filters.status = statusFilter;
      }
      const data = await adminApi.getAllBookings(filters);
      setBookings(data.data || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      REQUESTED: 'bg-yellow-100 text-yellow-700',
      ACCEPTED: 'bg-blue-100 text-blue-700',
      SCHEDULED: 'bg-purple-100 text-purple-700',
      IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
      COMPLETED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
              <p className="text-gray-600 mt-1">Monitor platform bookings</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'REQUESTED', 'ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">No bookings match the selected filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        Booking #{booking.id.slice(0, 8)}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Service: {booking.service.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{booking.total} {booking.currency}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Customer:</div>
                    <div className="font-medium">
                      {booking.customer.firstName} {booking.customer.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{booking.customer.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Professional:</div>
                    <div className="font-medium">
                      {booking.pro.user.firstName} {booking.pro.user.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{booking.pro.user.email}</div>
                  </div>
                </div>

                {booking.scheduledFor && (
                  <div className="mt-4 text-sm">
                    <span className="text-gray-600">Scheduled for: </span>
                    <span className="font-medium">
                      {new Date(booking.scheduledFor).toLocaleString()}
                    </span>
                  </div>
                )}

                {booking.description && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-1">Description:</div>
                    <div className="text-gray-700">{booking.description}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
