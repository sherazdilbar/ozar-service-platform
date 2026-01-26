'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Service, ServiceCategory, PricingModel, CATEGORY_ICONS, CATEGORY_LABELS } from '@ozar/shared';
import { servicesApi, prosApi } from '@ozar/shared/apiClient';
import { detectCurrencyFromPlace, CurrencyInfo, getAllCurrencies } from '@ozar/shared/currency';
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
  ArrowLeft,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function ProServicesPage() {
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
      // Get pro profile to get location
      const proProfile = await prosApi.getMyProfile();
      if (proProfile && proProfile.locationCity) {
        // Try to detect currency from location
        // For now, use a simple mapping
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
      // Get services for the current authenticated pro
      const data = await servicesApi.getMyServices();
      setServices(data);
      
      // Also load profile categories
      const proProfile = await prosApi.getMyProfile();
      console.log('📋 Profile categories loaded:', proProfile.categories);
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
        // Update existing service
        await servicesApi.updateService(editingService.id, formData);
        alert('Service updated successfully!');
      } else {
        // Create new service
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">{t('proServices.loadingServices')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/pro/dashboard')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{t('proServices.backToDashboard')}</span>
            </button>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-teal-600" />
                  {t('proServices.title')}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {t('proServices.subtitle')}
                </p>
              </div>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  {t('proServices.addService')}
                </button>
              )}
            </div>
          </div>

          {/* Profile Categories Section */}
          {profileCategories.length > 0 && (
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 mb-8 border-2 border-teal-200 dark:border-teal-700">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Your Service Categories
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                These are the categories you selected during signup. You can manage them in your profile settings.
              </p>
              <div className="flex flex-wrap gap-3">
                {profileCategories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border-2 border-teal-500 dark:border-teal-400 shadow-sm"
                  >
                    <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {CATEGORY_LABELS[category]}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push('/pro/profile')}
                className="mt-4 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold flex items-center gap-1"
              >
                Edit categories in profile →
              </button>
            </div>
          )}

          {/* Add/Edit Service Form */}
          {showAddForm && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {editingService ? (
                    <>
                      <Edit2 className="w-6 h-6 text-teal-600" />
                      {t('proServices.editService')}
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-teal-600" />
                      {t('proServices.addNewService')}
                    </>
                  )}
                </h2>
                <button
                  onClick={() => {
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
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <FileText className="w-4 h-4 text-teal-600" />
                    {t('proServices.serviceName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder={t('proServices.serviceNamePlaceholder')}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <FileText className="w-4 h-4 text-teal-600" />
                    {t('proServices.description')} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none"
                    placeholder={t('proServices.descriptionPlaceholder')}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {t('proServices.descriptionHelp')}
                  </p>
                </div>

                {/* Category & Pricing Model */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <Tag className="w-4 h-4 text-teal-600" />
                      {t('proServices.category')} *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    >
                      <option value="">{t('proServices.selectCategory')}</option>
                      {Object.values(ServiceCategory).map(cat => (
                        <option key={cat} value={cat}>
                          {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <DollarSign className="w-4 h-4 text-teal-600" />
                      {t('proServices.pricingModel')} *
                    </label>
                    <select
                      required
                      value={formData.pricingModel}
                      onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as PricingModel })}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    >
                      <option value={PricingModel.FIXED}>{t('proServices.fixedPrice')}</option>
                      <option value={PricingModel.HOURLY}>{t('proServices.hourlyRate')}</option>
                    </select>
                  </div>
                </div>

                {/* Price & Duration */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <DollarSign className="w-4 h-4 text-teal-600" />
                      {t('proServices.price')} *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        placeholder="0"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                        {detectedCurrency.symbol}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {t('proServices.currency')}: {detectedCurrency.name} ({detectedCurrency.code})
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <Clock className="w-4 h-4 text-teal-600" />
                      {t('proServices.duration')} *
                    </label>
                    <input
                      type="number"
                      required
                      min="15"
                      step="15"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      placeholder="60"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {t('proServices.durationHelp')}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        {editingService ? t('proServices.updating') : t('proServices.adding')}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingService ? t('proServices.updateService') : t('proServices.addService')}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
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
                    }}
                    className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    {t('proServices.cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Services List */}
          <div className="space-y-6">
            {services.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-16 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-8xl mb-6">📋</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('proServices.noServices')}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
                  {t('proServices.noServicesDesc')}
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {t('proServices.addFirstService')}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    {services.length} {services.length !== 1 ? t('proServices.servicesAvailable') : t('proServices.serviceAvailable')}
                  </p>
                </div>
                
                {/* Group services by category */}
                {(() => {
                  // Group services by category
                  const groupedServices = services.reduce((acc, service) => {
                    const category = service.category || 'OTHER';
                    if (!acc[category]) {
                      acc[category] = [];
                    }
                    acc[category].push(service);
                    return acc;
                  }, {} as Record<string, Service[]>);

                  // Sort categories to show profile categories first
                  const sortedCategories = Object.keys(groupedServices).sort((a, b) => {
                    const aInProfile = profileCategories.includes(a as ServiceCategory);
                    const bInProfile = profileCategories.includes(b as ServiceCategory);
                    if (aInProfile && !bInProfile) return -1;
                    if (!aInProfile && bInProfile) return 1;
                    return 0;
                  });

                  return sortedCategories.map((category) => {
                    const categoryServices = groupedServices[category];
                    const isProfileCategory = profileCategories.includes(category as ServiceCategory);
                    
                    return (
                      <div key={category} className="mb-10">
                        {/* Category Header */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl flex items-center justify-center text-3xl">
                              {CATEGORY_ICONS[category as ServiceCategory] || '📦'}
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {CATEGORY_LABELS[category as ServiceCategory] || category}
                              </h2>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {categoryServices.length} service{categoryServices.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          {isProfileCategory && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-500 dark:border-blue-400">
                              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                Your Category
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Services in this category */}
                        <div className="space-y-4">
                          {categoryServices.map((service) => (
                            <div 
                              key={service.id} 
                              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-xl transition-all duration-300"
                            >
                              <div className="flex items-start justify-between gap-6">
                                <div className="flex-1">
                                  <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                                      {CATEGORY_ICONS[service.category]}
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                        {service.name}
                                      </h3>
                                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                                        <Tag className="w-3 h-3" />
                                        {CATEGORY_LABELS[service.category]}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                    {service.description}
                                  </p>
                                  
                                  <div className="flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                                      <DollarSign className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                      <span className="font-bold text-gray-900 dark:text-white">{service.price} {service.currency}</span>
                                      <span className="text-gray-600 dark:text-gray-400">
                                        ({service.pricingModel === PricingModel.HOURLY ? t('proServices.perHour') : t('proServices.fixed')})
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                      <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                      <span className="font-bold text-gray-900 dark:text-white">{service.duration} min</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                  <button 
                                    type="button"
                                    onClick={() => handleEdit(service)}
                                    className="px-4 py-2 text-teal-600 dark:text-teal-400 hover:text-white bg-white dark:bg-gray-700 hover:bg-teal-600 dark:hover:bg-teal-600 font-medium border-2 border-teal-600 dark:border-teal-400 rounded-xl transition-all flex items-center gap-2"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => handleDelete(service.id)}
                                    className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-white bg-white dark:bg-gray-700 hover:bg-red-600 dark:hover:bg-red-600 font-medium border-2 border-red-600 dark:border-red-400 rounded-xl transition-all flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
