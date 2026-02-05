'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProLayout from '@/components/ProLayout';
import { jobsApi } from '@ozar/shared/apiClient';
import { CATEGORY_LABELS, CATEGORY_ICONS, ServiceCategory } from '@ozar/shared';
import { Briefcase, MapPin, DollarSign, Clock, Eye, Search } from 'lucide-react';

export default function ProJobsPageListeo() {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'PRO') {
      router.push('/');
      return;
    }
    loadJobs();
  }, [user]);

  const loadJobs = async () => {
    try {
      const result = await jobsApi.getAvailableJobs();
      setJobs(result || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !job.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedCategory && job.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const categories = Object.keys(CATEGORY_LABELS) as ServiceCategory[];

  if (loading) {
    return (
      <ProLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600" />
        </div>
      </ProLayout>
    );
  }

  return (
    <ProLayout>
      <div className="p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Available Jobs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and bid on jobs that match your skills
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Jobs ({filteredJobs.length})
            </h2>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No jobs available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check back later for new job opportunities
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredJobs.map((job) => (
                <div key={job.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.budget} {job.currency}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/jobs/${job.id}`)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProLayout>
  );
}
