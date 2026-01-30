'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { jobsApi } from '@ozar/shared/apiClient';
import { CATEGORY_LABELS, CATEGORY_ICONS, ServiceCategory } from '@ozar/shared';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Eye,
  Filter,
  Search
} from 'lucide-react';

export default function ProAvailableJobsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [urgencyFilter, setUrgencyFilter] = useState<string | null>(null);

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
    if (urgencyFilter && job.urgency !== urgencyFilter) {
      return false;
    }
    return true;
  });

  const categories = Object.keys(CATEGORY_LABELS) as ServiceCategory[];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Jobs</h1>
          <p className="text-gray-600">Browse and bid on jobs that match your skills</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>

            {/* Urgency Filter */}
            <select
              value={urgencyFilter || ''}
              onChange={(e) => setUrgencyFilter(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">All Urgencies</option>
              <option value="ASAP">🔥 ASAP</option>
              <option value="THIS_WEEK">📅 This Week</option>
              <option value="FLEXIBLE">⏰ Flexible</option>
            </select>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory || urgencyFilter) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                  Search: {searchTerm}
                </span>
              )}
              {selectedCategory && (
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                  {CATEGORY_LABELS[selectedCategory as ServiceCategory]}
                </span>
              )}
              {urgencyFilter && (
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                  {urgencyFilter.replace('_', ' ')}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                  setUrgencyFilter(null);
                }}
                className="text-sm text-teal-600 hover:text-teal-700"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Available</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory || urgencyFilter
                ? 'Try adjusting your filters'
                : 'Check back later for new opportunities'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/jobs/${job.id}`)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">
                        {CATEGORY_ICONS[job.category as ServiceCategory]}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {CATEGORY_LABELS[job.category as ServiceCategory]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{job.locationCity}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>
                        {job.budgetMin && job.budgetMax
                          ? `${job.budgetMin.toLocaleString()}-${job.budgetMax.toLocaleString()} ${job.currency}`
                          : 'Budget not set'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="capitalize">{job.urgency.replace('_', ' ').toLowerCase()}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      {job._count?.bids || 0} bid{job._count?.bids !== 1 ? 's' : ''}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/jobs/${job.id}`);
                      }}
                      className="flex items-center text-teal-600 hover:text-teal-700 font-medium text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
