'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { jobsApi } from '@ozar/shared/apiClient';
import { CATEGORY_LABELS, CATEGORY_ICONS, ServiceCategory } from '@ozar/shared';
import { getImageUrl } from '@/utils/imageUrl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Avatar from '@/components/Avatar';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-green-100 text-green-800',
  BIDDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-100 text-gray-600',
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Open',
  BIDDING: 'Bidding',
  ACCEPTED: 'Accepted',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
};

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [accepting, setAccepting] = useState<string | null>(null);
  
  // Bid form state
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    proposedPrice: '',
    estimatedDuration: '',
    message: '',
  });
  const [bidError, setBidError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/jobs/' + params.id);
      return;
    }
    loadJob();
  }, [params.id, user]);

  const loadJob = async () => {
    try {
      const result = await jobsApi.getJobById(params.id as string);
      setJob(result);
    } catch (error: any) {
      console.error('Failed to load job:', error);
      alert(error.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setBidError('');

    // Validation
    if (!bidData.proposedPrice || parseInt(bidData.proposedPrice) <= 0) {
      setBidError('Please enter a valid price');
      return;
    }

    if (!bidData.estimatedDuration || parseInt(bidData.estimatedDuration) < 15) {
      setBidError('Duration must be at least 15 minutes');
      return;
    }

    if (!bidData.message || bidData.message.length < 20) {
      setBidError('Message must be at least 20 characters');
      return;
    }

    setSubmitting(true);

    try {
      await jobsApi.submitBid(job.id, {
        proposedPrice: parseInt(bidData.proposedPrice),
        estimatedDuration: parseInt(bidData.estimatedDuration),
        message: bidData.message,
      });

      alert('Bid submitted successfully!');
      setShowBidForm(false);
      loadJob(); // Reload to show the new bid
    } catch (error: any) {
      console.error('Failed to submit bid:', error);
      setBidError(error.message || 'Failed to submit bid');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    if (!confirm('Accept this bid? A booking will be created automatically.')) {
      return;
    }

    setAccepting(bidId);

    try {
      await jobsApi.acceptBid(job.id, bidId);
      alert('Bid accepted! Booking has been created.');
      router.push('/bookings');
    } catch (error: any) {
      console.error('Failed to accept bid:', error);
      alert(error.message || 'Failed to accept bid');
    } finally {
      setAccepting(null);
    }
  };

  const handleRejectBid = async (bidId: string) => {
    if (!confirm('Reject this bid?')) {
      return;
    }

    try {
      await jobsApi.rejectBid(job.id, bidId);
      alert('Bid rejected');
      loadJob();
    } catch (error: any) {
      console.error('Failed to reject bid:', error);
      alert(error.message || 'Failed to reject bid');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <button
            onClick={() => router.push('/jobs')}
            className="text-teal-600 hover:text-teal-700"
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === job.customerId;
  const isPro = user?.role === 'PRO';
  // Check if user has already bid by matching the pro's userId with current user's id
  const userBid = job.bids?.find((bid: any) => bid.pro?.userId === user?.id);
  const canBid = isPro && job.status === 'OPEN' && !userBid;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-teal-600 hover:text-teal-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">
                    {CATEGORY_ICONS[job.category as ServiceCategory]}
                  </span>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-gray-600">{CATEGORY_LABELS[job.category as ServiceCategory]}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[job.status]}`}>
                  {STATUS_LABELS[job.status]}
                </span>
              </div>

              {/* Job Info */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{job.locationCity}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span>
                    {job.budgetMin && job.budgetMax
                      ? `${job.budgetMin.toLocaleString()}-${job.budgetMax.toLocaleString()} ${job.currency}`
                      : 'Budget not set'}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="capitalize">{job.urgency.replace('_', ' ').toLowerCase()}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>

            {/* Images */}
            {job.images && job.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {job.images.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={getImageUrl(image) || image}
                      alt={`Job photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bids Section */}
            {isOwner && job.bids && job.bids.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Bids Received ({job.bids.length})
                </h2>
                <div className="space-y-4">
                  {job.bids.map((bid: any) => (
                    <div key={bid.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <Avatar
                            imageUrl={bid.pro.user.avatar}
                            name={`${bid.pro.user.firstName} ${bid.pro.user.lastName}`}
                            size={48}
                          />
                          <div className="ml-3">
                            <h3 className="font-semibold text-gray-900">
                              {bid.pro.user.firstName} {bid.pro.user.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              ⭐ {bid.pro.rating.toFixed(1)} • {bid.pro.jobsCompleted} jobs
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-teal-600">
                            {bid.proposedPrice.toLocaleString()} {job.currency}
                          </p>
                          <p className="text-sm text-gray-600">
                            {bid.estimatedDuration} min
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{bid.message}</p>
                      
                      {bid.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptBid(bid.id)}
                            disabled={accepting === bid.id}
                            className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {accepting === bid.id ? 'Accepting...' : 'Accept Bid'}
                          </button>
                          <button
                            onClick={() => handleRejectBid(bid.id)}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center justify-center"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {bid.status === 'ACCEPTED' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">Bid Accepted</span>
                        </div>
                      )}
                      
                      {bid.status === 'REJECTED' && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center">
                          <XCircle className="w-5 h-5 text-gray-600 mr-2" />
                          <span className="text-gray-600">Bid Rejected</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            {!isOwner && job.customer && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Posted By</h3>
                <div className="flex items-center mb-4">
                  <Avatar
                    imageUrl={job.customer.avatar}
                    name={`${job.customer.firstName} ${job.customer.lastName}`}
                    size={48}
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">
                      {job.customer.firstName} {job.customer.lastName}
                    </p>
                    <p className="text-sm text-gray-600">Customer</p>
                  </div>
                </div>
              </div>
            )}

            {/* Your Bid (for pros) */}
            {userBid && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Your Bid</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Proposed Price</p>
                    <p className="text-2xl font-bold text-teal-600">
                      {userBid.proposedPrice.toLocaleString()} {job.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{userBid.estimatedDuration} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      userBid.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                      userBid.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {userBid.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bid Form (for pros) */}
            {canBid && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                {!showBidForm ? (
                  <button
                    onClick={() => setShowBidForm(true)}
                    className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 font-medium flex items-center justify-center"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit a Bid
                  </button>
                ) : (
                  <form onSubmit={handleSubmitBid} className="space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Submit Your Bid</h3>
                    
                    {bidError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-red-800 text-sm">{bidError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proposed Price ({job.currency}) *
                      </label>
                      <input
                        type="number"
                        value={bidData.proposedPrice}
                        onChange={(e) => setBidData({ ...bidData, proposedPrice: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Enter your price"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        value={bidData.estimatedDuration}
                        onChange={(e) => setBidData({ ...bidData, estimatedDuration: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="e.g., 60"
                        min="15"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 15 minutes</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        value={bidData.message}
                        onChange={(e) => setBidData({ ...bidData, message: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        rows={4}
                        placeholder="Explain your approach and why you're the best fit..."
                        minLength={20}
                        maxLength={500}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {bidData.message.length}/500 characters (min 20)
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 font-medium"
                      >
                        {submitting ? 'Submitting...' : 'Submit Bid'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowBidForm(false);
                          setBidError('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Job Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bids</span>
                  <span className="font-semibold">{job._count?.bids || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-semibold">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {job.expiresAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires</span>
                    <span className="font-semibold">
                      {new Date(job.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
