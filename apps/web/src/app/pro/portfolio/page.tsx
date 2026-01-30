'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { prosApi } from '@ozar/shared/apiClient';
import { getImageUrl } from '@/utils/imageUrl';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Upload, 
  X,
  Camera,
  Grid,
  List,
  Loader
} from 'lucide-react';

interface PortfolioItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}

export default function ProPortfolioPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [proId, setProId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
      return;
    }
    loadPortfolio();
  }, [isAuthenticated, user]);

  const loadPortfolio = async () => {
    try {
      // First get the pro profile to get the proId
      const profile = await prosApi.getMyProfile();
      setProId(profile.id);
      
      // Then load portfolio items
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
      // Upload images first
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

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Upload failed');
      }

      const data = await response.json();
      const uploadedUrls = data.urls || []; // Fix: extract urls from response
      
      // Add each image as a portfolio item
      for (const url of uploadedUrls) {
        await prosApi.addPortfolioItem(proId, {
          imageUrl: url,
          title: 'Untitled',
          description: '',
          category: 'GENERAL',
        });
      }

      // Reload portfolio
      await loadPortfolio();
    } catch (error: any) {
      console.error('Failed to upload images:', error);
      alert(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await prosApi.deletePortfolioItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item');
    }
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <Camera className="w-8 h-8 text-teal-600" />
                Portfolio
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Showcase your best work to attract more customers
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid'
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } transition`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list'
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } transition`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Upload Button */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50">
                  {uploading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add Photos
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Photos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{items.length}</p>
                </div>
                <ImageIcon className="w-8 h-8 text-teal-600" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {items.filter(item => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(item.createdAt) > weekAgo;
                    }).length}
                  </p>
                </div>
                <Upload className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Slots Available</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{20 - items.length}</p>
                </div>
                <Camera className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Grid/List */}
        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No portfolio images yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload photos of your best work to showcase your skills
            </p>
            <label className="cursor-pointer inline-block">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition">
                <Plus className="w-5 h-5" />
                Upload Your First Photo
              </div>
            </label>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={getImageUrl(item.imageUrl) || item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {item.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(item.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex gap-4">
                  <img
                    src={getImageUrl(item.imageUrl) || item.imageUrl}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-lg cursor-pointer"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {item.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(item.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition h-fit"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Image Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={getImageUrl(selectedItem.imageUrl) || selectedItem.imageUrl}
            alt={selectedItem.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
