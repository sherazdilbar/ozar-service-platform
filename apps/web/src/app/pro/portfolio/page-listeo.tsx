'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProLayout from '@/components/ProLayout';
import { prosApi } from '@ozar/shared/apiClient';
import { getImageUrl } from '@/utils/imageUrl';
import { Plus, Trash2, Upload, X, Camera } from 'lucide-react';

interface PortfolioItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}

export default function ProPortfolioPageListeo() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [proId, setProId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
      return;
    }
    loadPortfolio();
  }, [isAuthenticated, user]);

  const loadPortfolio = async () => {
    try {
      const profile = await prosApi.getMyProfile();
      setProId(profile.id);
      const portfolioItems = await prosApi.getPortfolio(profile.id);
      setItems(portfolioItems || []);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !proId) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const uploadedUrls = data.urls || [];
      
      for (const url of uploadedUrls) {
        await prosApi.addPortfolioItem(proId, {
          imageUrl: url,
          title: 'Portfolio Item',
          description: '',
          category: 'GENERAL',
        });
      }
      
      await loadPortfolio();
      setShowUploadModal(false);
      alert('Portfolio items added successfully!');
    } catch (error) {
      console.error('Failed to upload:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;
    
    try {
      await prosApi.deletePortfolioItem(itemId);
      await loadPortfolio();
      alert('Portfolio item deleted successfully!');
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete portfolio item');
    }
  };

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Portfolio
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Showcase your best work to attract more customers
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Photos
          </button>
        </div>

        {/* Portfolio Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Your Work ({items.length})
            </h2>
          </div>

          {items.length === 0 ? (
            <div className="p-12 text-center">
              <Camera className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No portfolio items yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add photos of your completed work to showcase your skills
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Photos
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all"
                  >
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Upload Photos
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-6">
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-teal-500 dark:hover:border-teal-500 transition-all cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Click to upload photos
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      PNG, JPG up to 10MB each
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>

                {uploading && (
                  <div className="mt-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProLayout>
  );
}
