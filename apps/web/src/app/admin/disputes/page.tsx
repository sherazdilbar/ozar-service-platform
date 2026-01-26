'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@ozar/shared/apiClient';

export default function AdminDisputesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [resolution, setResolution] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    loadDisputes();
  }, [isAuthenticated, user, statusFilter]);

  const loadDisputes = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (statusFilter !== 'ALL') {
        filters.status = statusFilter;
      }
      const data = await adminApi.getDisputes(filters);
      setDisputes(data.data || []);
    } catch (error) {
      console.error('Failed to load disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedDispute || !resolution.trim()) {
      alert('Please provide a resolution');
      return;
    }

    try {
      setResolving(true);
      await adminApi.resolveDispute(
        selectedDispute.id,
        resolution,
        refundAmount ? parseInt(refundAmount) : undefined,
      );
      setSelectedDispute(null);
      setResolution('');
      setRefundAmount('');
      await loadDisputes();
      alert('Dispute resolved successfully!');
    } catch (error) {
      console.error('Failed to resolve dispute:', error);
      alert('Failed to resolve dispute');
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Disputes</h1>
              <p className="text-gray-600 mt-1">Review and resolve customer disputes</p>
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
          <div className="flex gap-2">
            {['ALL', 'OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Disputes List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : disputes.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No disputes found</h3>
            <p className="text-gray-600">No disputes match the selected filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <div key={dispute.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        Dispute #{dispute.id.slice(0, 8)}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        dispute.status === 'OPEN'
                          ? 'bg-red-100 text-red-700'
                          : dispute.status === 'RESOLVED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {dispute.status.replace('_', ' ')}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Raised by: {dispute.raisedByUser.firstName} {dispute.raisedByUser.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Booking: #{dispute.booking.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {new Date(dispute.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="font-semibold text-gray-900 mb-1">Reason:</div>
                  <div className="text-gray-700">{dispute.reason}</div>
                </div>

                <div className="mb-4">
                  <div className="font-semibold text-gray-900 mb-1">Description:</div>
                  <div className="text-gray-700">{dispute.description}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Customer:</div>
                    <div className="font-medium">
                      {dispute.booking.customer.firstName} {dispute.booking.customer.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{dispute.booking.customer.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Professional:</div>
                    <div className="font-medium">
                      {dispute.booking.pro.user.firstName} {dispute.booking.pro.user.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{dispute.booking.pro.user.email}</div>
                  </div>
                </div>

                {dispute.status === 'RESOLVED' && dispute.resolution && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                    <div className="font-semibold text-green-900 mb-1">Resolution:</div>
                    <div className="text-green-800">{dispute.resolution}</div>
                    {dispute.resolvedBy && (
                      <div className="text-sm text-green-700 mt-2">
                        Resolved by admin on {new Date(dispute.resolvedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}

                {dispute.status === 'OPEN' && (
                  <button
                    onClick={() => setSelectedDispute(dispute)}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700"
                  >
                    Resolve Dispute
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Resolve Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Resolve Dispute #{selectedDispute.id.slice(0, 8)}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution *
              </label>
              <textarea
                rows={4}
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Explain your decision and any actions taken..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Amount - Optional
              </label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="0"
              />
              <p className="text-sm text-gray-600 mt-1">
                Booking total: {selectedDispute.booking.total} {selectedDispute.booking.currency}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleResolve}
                disabled={resolving || !resolution.trim()}
                className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
              >
                {resolving ? 'Resolving...' : 'Resolve Dispute'}
              </button>
              <button
                onClick={() => {
                  setSelectedDispute(null);
                  setResolution('');
                  setRefundAmount('');
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
