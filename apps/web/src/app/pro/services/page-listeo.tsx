'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import ProLayout from '@/components/ProLayout';
import { Service, ServiceCategory, PricingModel, CATEGORY_ICONS, CATEGORY_LABELS } from '@ozar/shared';
import { servicesApi, prosApi } from '@ozar/shared/apiClient';
import { detectCurrencyFromPlace, CurrencyInfo } from '@ozar/shared/currency';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Clock, 
  DollarSign, 
  Tag, 
  FileText, 
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

export default function ProServicesPageListeo() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [profileCategories, setProfileCategories] = useState<ServiceCategory[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [detectedCurrency, setDetectedCurrency] = useState<CurrencyInfo>({ 
    code: 'USD', 
    symbol: '$', 
    name: 'US Dollar' 
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '' as ServiceCategory,
    pricingModel: PricingModel.FIXED,
    price: 0,
    duration: 60,
    currency: 'USD',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
      return;
    }
    loadServices();
    detectUserCurrency();
  }, [isAuthenticated, user]);

  const detectUserCurrency = async () => {
    try {
      const proProfile = await prosApi.getMyProfile();
      if (proProfile && proProfile.locationCity) {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(proProfile.locationCity)}.json?types=place&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const currency = detectCurrencyFromPlace(data.features[0]);
          setDetectedCurrency(currency);
          setFormData(prev => ({ ...prev, currency: currency.code }));
        }
      }
    } catch (error) {
      console.error('Failed to detect currency:', error);
    }
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await servicesApi.getMyServices();
      setServices(data);
      
      const proProfile = await prosApi.getMyProfile();
      setProfileCategories(proProfile.categories || []);
    } catch (error) {
      console.error('Failed to load services:', error);
      setServices([]);
      setProfileCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await servicesApi.deleteService(serviceId);
      await loadServices();
      alert('Service deleted successfully!');
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('Failed to delete service');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      pricingModel: service.pricingModel,
      price: service.price,
      duration: service.duration,
      currency: service.currency,
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    try {
      setSaving(true);
      
      if (editingService) {
        await servicesApi.updateService(editingService.id, formData);
        alert('Service updated successfully!');
      } else {
        await servicesApi.createService(formData);
        alert('Service added successfully!');
      }
      
      setShowAddForm(false);
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        category: '' as ServiceCategory,
        pricingModel: PricingModel.FIXED,
        price: 0,
        duration: 60,
        currency: detectedCurrency.code,
      });
      await loadServices();
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Failed to save service. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      category: '' as ServiceCategory,
      pricingModel: PricingModel.FIXED,
      price: 0,
      duration: 60,
      currency: detectedCurrency.code,
    });
  };

  if (loading) {
    return (
      <ProLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading services...</p>
          </div>
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
              My Services
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your service offerings and pricing
            </p>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Service
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button
                  onClick={cancelForm}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Service Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder="e.g., Electrical Inspection & Repair"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none"
                    placeholder="Describe what this service includes..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  >
                    <option value="">Select category</option>
                    {Object.values(ServiceCategory).map(cat => (
                      <option key={cat} value={cat}>
                        {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pricing Model */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Pricing Model *
                  </label>
                  <select
                    required
                    value={formData.pricingModel}
                    onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as PricingModel })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  >
                    <option value={PricingModel.FIXED}>Fixed Price</option>
                    <option value={PricingModel.HOURLY}>Hourly Rate</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      placeholder="0"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                      {detectedCurrency.symbol}
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min="15"
                    step="15"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder="60"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {editingService ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingService ? 'Update Service' : 'Add Service'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Your Services ({services.length})
            </h2>
          </div>

          {services.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No services yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start by adding your first service offering
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Service
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {service.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                            {service.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                          <span>{CATEGORY_ICONS[service.category]}</span>
                          <span>{CATEGORY_LABELS[service.category]}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {service.price} {service.currency}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {service.pricingModel === PricingModel.HOURLY ? 'per hour' : 'fixed'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900 dark:text-white">
                          {service.duration} min
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProLayout>
  );
}
