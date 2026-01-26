'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@ozar/shared/apiClient';
import Image from 'next/image';

export default function AdminProsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pros, setPros] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    loadPros();
  }, [isAuthenticated, user, statusFilter]);

  const loadPros = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (statusFilter !== 'ALL') {
        filters.status = statusFilter;
      }
      const data = await adminApi.getPros(filters);
      setPros(data.data || []);
    } catch (error) {
      console.error('Failed to load pros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (proId: string, status: 'APPROVED' | 'REJECTED') => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this professional?`)) {
      return;
    }

    try {
      setProcessing(proId);
      await adminApi.verifyPro(proId, status);
      await loadPros();
      alert(`Professional ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error('Failed to verify pro:', error);
      alert('Failed to update verification status');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Professionals</h1>
              <p className="text-gray-600 mt-1">Review and approve professional accounts</p>
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
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
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

        {/* Pros List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : pros.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">👨‍🔧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No professionals found</h3>
            <p className="text-gray-600">No pros match the selected filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pros.map((pro) => (
              <div key={pro.id} className="card p-6">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={pro.user.avatar || '/placeholder-avatar.png'}
                      alt={`${pro.user.firstName} ${pro.user.lastName}`}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {pro.businessName || `${pro.user.firstName} ${pro.user.lastName}`}
                        </h3>
                        <p className="text-gray-600">{pro.user.email}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        pro.verificationStatus === 'APPROVED'
                          ? 'bg-green-100 text-green-700'
                          : pro.verificationStatus === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {pro.verificationStatus}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <div className="font-medium">{pro.user.phone}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <div className="font-medium">{pro.locationCity}, {pro.locationArea}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Categories:</span>
                        <div className="font-medium">{pro.categories.join(', ')}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Services:</span>
                        <div className="font-medium">{pro.services?.length || 0} services</div>
                      </div>
                    </div>

                    {pro.bio && (
                      <p className="text-gray-700 mb-4">{pro.bio}</p>
                    )}

                    {/* Actions */}
                    {pro.verificationStatus === 'PENDING' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleVerify(pro.id, 'APPROVED')}
                          disabled={processing === pro.id}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                        >
                          {processing === pro.id ? 'Processing...' : '✓ Approve'}
                        </button>
                        <button
                          onClick={() => handleVerify(pro.id, 'REJECTED')}
                          disabled={processing === pro.id}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                        >
                          {processing === pro.id ? 'Processing...' : '✗ Reject'}
                        </button>
                      </div>
                    )}

                    {pro.verificationStatus === 'APPROVED' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleVerify(pro.id, 'REJECTED')}
                          disabled={processing === pro.id}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                        >
                          Revoke Approval
                        </button>
                      </div>
                    )}

                    {pro.verificationStatus === 'REJECTED' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleVerify(pro.id, 'APPROVED')}
                          disabled={processing === pro.id}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
