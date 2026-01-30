'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { jobsApi } from '@ozar/shared/apiClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Plus, 
  Briefcase, 
  Clock, 
  MapPin, 
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: string;
  locationAddr: string;
  locationCity: string;
  budgetMin?: number;
  budgetMax?: number;
  currency: string;
  images: string[];
  preferredDate?: string;
  bids: any[];
  createdAt: string;
}

export default function JobsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/jobs');
      return;
    }
    if (user?.role !== 'CUSTOMER') {
      router.push('/');
      return;
    }
    loadJobs();
  }, [isAuthenticated, user]);

  const loadJobs = async () => {
    try {
      const data = await jobsApi.getMyJobs();
      setJobs(data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeJobs = jobs.filter(j => ['OPEN', 'BIDDING', 'ACCEPTED'].includes(j.status));
  const completedJobs = jobs.filter(j => ['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(j.status));
  const displayJobs = activeTab === 'active' ? activeJobs : completedJobs;

  const getStatusConfig = (status: string) => {
    const configs: Record<string, any> = {
      OPEN: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Open', icon: <Briefcase className="w-4 h-4" /> },
      BIDDING: { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Receiving Bids', icon: <Users className="w-4 h-4" /> },
      ACCEPTED: { color: 'bg-green-100 text-green-700 border-green-200', label: 'Accepted', icon: <CheckCircle className="w-4 h-4" /> },
      COMPLETED: { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Completed', icon: <CheckCircle className="w-4 h-4" /> },
      CANCELLED: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Cancelled', icon: <XCircle className="w-4 h-4" /> },
      EXPIRED: { color: 'bg-gray-100 text-gray-500 border-gray-200', label: 'Expired', icon: <Clock className="w-4 h-4" /> },
    };
    return configs[status as keyof typeof configs] || configs.OPEN;
  };

  const getUrgencyBadge = (urgency: string) => {
    const badges: Record<string, any> = {
      ASAP: { color: 'bg-red-100 text-red-700', label: '🔥 ASAP' },
      THIS_WEEK: { color: 'bg-orange-100 text-orange-700', label: '⚡ This Week' },
      FLEXIBLE: { color: 'bg-green-100 text-green-700', label: '📅 Flexible' },
    };
    return badges[urgency] || badges.FLEXIBLE;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Job Posts
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Post jobs and receive competitive bids from professionals
              </p>
            </div>
            <button
              onClick={() => router.push('/jobs/new')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Post a Job
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Jobs</span>
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{activeJobs.length}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Bids</span>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {jobs.reduce((sum, j) => sum + (j.bids?.length || 0), 0)}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completed</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {jobs.filter(j => j.status === 'COMPLETED').length}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Success Rate</span>
                <TrendingUp className="w-5 h-5 text-teal-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {jobs.length > 0 ? Math.round((jobs.filter(j => j.status === 'COMPLETED').length / jobs.length) * 100) : 0}%
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'active'
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Active ({activeJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'completed'
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Completed ({completedJobs.length})
            </button>
          </div>
        </div>

        {/* Jobs List */}
        {displayJobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {activeTab === 'active' ? 'No Active Jobs' : 'No Completed Jobs'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {activeTab === 'active' 
                ? 'Post your first job and start receiving bids from professionals'
                : 'Completed jobs will appear here'
              }
            </p>
            {activeTab === 'active' && (
              <button
                onClick={() => router.push('/jobs/new')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition"
              >
                <Plus className="w-5 h-5" />
                Post Your First Job
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {displayJobs.map((job) => {
              const statusConfig = getStatusConfig(job.status);
              const urgencyBadge = getUrgencyBadge(job.urgency);
              const bidCount = job.bids?.length || 0;

              return (
                <div
                  key={job.id}
                  onClick={() => router.push(`/jobs/${job.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                          {job.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${urgencyBadge.color}`}>
                          {urgencyBadge.label}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{job.locationCity}</span>
                    </div>
                    {job.budgetMin && job.budgetMax && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.budgetMin.toLocaleString()} - {job.budgetMax.toLocaleString()} {job.currency}</span>
                      </div>
                    )}
                    {job.preferredDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(job.preferredDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <Users className="w-5 h-5" />
                        <span className="font-semibold">{bidCount} {bidCount === 1 ? 'Bid' : 'Bids'}</span>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg font-semibold transition">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
