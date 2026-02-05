'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProLayout from '@/components/ProLayout';
import { ProProfile, ServiceCategory, AvailabilityStatus, CATEGORY_ICONS, CATEGORY_LABELS } from '@ozar/shared';
import { prosApi } from '@ozar/shared/apiClient';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import BudapestLocationSelector from '@/components/BudapestLocationSelector';
import { 
  User, Briefcase, MapPin, Award, Save, CheckCircle
} from 'lucide-react';

export default function ProProfilePageListeo() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'categories' | 'location'>('basic');
  
  const [formData, setFormData] = useState({
    businessName: '',
    bio: '',
    categories: [] as ServiceCategory[],
    availabilityStatus: AvailabilityStatus.AVAILABLE_NOW,
    yearsExperience: 0,
    serviceAreaCity: '',
    serviceAreaRadius: 10,
    locationCity: '',
    locationDistrict: '',
    locationLat: 0,
    locationLng: 0,
    phone: '',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
      return;
    }
    loadProfile();
  }, [isAuthenticated, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await prosApi.getMyProfile();
      setProfile(data);
      setFormData({
        businessName: data.businessName || '',
        bio: data.bio || '',
        categories: data.categories || [],
        availabilityStatus: data.availabilityStatus,
        yearsExperience: data.yearsExperience || 0,
        serviceAreaCity: data.serviceAreaCity || '',
        serviceAreaRadius: data.serviceAreaRadius || 10,
        locationCity: data.locationCity || '',
        locationDistrict: data.locationArea || '',
        locationLat: data.locationLat || 0,
        locationLng: data.locationLng || 0,
        phone: data.user.phone || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await prosApi.updateProfile({
        businessName: formData.businessName,
        bio: formData.bio,
        categories: formData.categories,
        availabilityStatus: formData.availabilityStatus,
        yearsExperience: formData.yearsExperience,
        serviceAreaCity: formData.serviceAreaCity,
        serviceAreaRadius: formData.serviceAreaRadius,
        locationCity: formData.locationCity,
        locationArea: formData.locationDistrict,
        locationLat: formData.locationLat,
        locationLng: formData.locationLng,
      });
      
      alert('Profile updated successfully!');
      await loadProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (category: ServiceCategory) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleLocationSelect = (location: { city: string; district: string; lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      locationCity: location.city,
      locationDistrict: location.district,
      locationLat: location.lat,
      locationLng: location.lng,
    }));
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

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'categories', label: 'Service Categories', icon: Briefcase },
    { id: 'location', label: 'Location', icon: MapPin },
  ];

  return (
    <ProLayout>
      <div className="p-6 lg:p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your professional profile and settings
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                        activeTab === tab.id
                          ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Basic Information
                  </h2>

                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Profile Picture
                      </label>
                      <ProfilePictureUpload
                        currentAvatar={user?.avatar}
                        onUploadSuccess={(url) => {
                          updateUser({ ...user!, avatar: url });
                        }}
                      />
                    </div>

                    {/* Business Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Your business or professional name"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Professional Bio *
                      </label>
                      <textarea
                        rows={5}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                        placeholder="Tell customers about your experience, skills, and what makes you stand out..."
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {formData.bio.length} characters
                      </p>
                    </div>

                    {/* Years of Experience */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.yearsExperience}
                        onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="+36 XX XXX XXXX"
                      />
                    </div>

                    {/* Availability Status */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Availability Status
                      </label>
                      <select
                        value={formData.availabilityStatus}
                        onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as AvailabilityStatus })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value={AvailabilityStatus.AVAILABLE_NOW}>Available Now</option>
                        <option value={AvailabilityStatus.BUSY}>Busy</option>
                        <option value={AvailabilityStatus.OFFLINE}>Offline</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Categories Tab */}
              {activeTab === 'categories' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Service Categories
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Select the categories that match your services
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.values(ServiceCategory).map((category) => (
                      <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.categories.includes(category)
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{CATEGORY_ICONS[category]}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">
                              {CATEGORY_LABELS[category]}
                            </div>
                          </div>
                          {formData.categories.includes(category) && (
                            <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {formData.categories.length > 0 && (
                    <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-700">
                      <p className="text-sm font-semibold text-teal-900 dark:text-teal-100">
                        {formData.categories.length} {formData.categories.length === 1 ? 'category' : 'categories'} selected
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Location Tab */}
              {activeTab === 'location' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Location Settings
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Set your location and service area
                  </p>

                  <div className="space-y-6">
                    {/* Budapest Location Selector */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Your Location *
                      </label>
                      <BudapestLocationSelector
                        selectedCity={formData.locationCity}
                        selectedDistrict={formData.locationDistrict}
                        onLocationSelect={handleLocationSelect}
                      />
                    </div>

                    {/* Service Area Radius */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Service Area Radius (km)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={formData.serviceAreaRadius}
                        onChange={(e) => setFormData({ ...formData, serviceAreaRadius: parseInt(e.target.value) || 10 })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        How far are you willing to travel for jobs?
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProLayout>
  );
}
