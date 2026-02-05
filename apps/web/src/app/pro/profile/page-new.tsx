'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ProProfile, ServiceCategory, AvailabilityStatus, CATEGORY_ICONS, CATEGORY_LABELS } from '@ozar/shared';
import { prosApi } from '@ozar/shared/apiClient';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/contexts/ToastContext';
import { getImageUrl } from '@/utils/imageUrl';
import { 
  User, Briefcase, MapPin, Image as ImageIcon, Award,
  Save, ArrowLeft, CheckCircle, AlertCircle, Camera, Star
} from 'lucide-react';

export default function ProProfilePageNew() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProProfile | null>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'categories' | 'location' | 'portfolio' | 'certifications'>('basic');
  
  const [formData, setFormData] = useState({
    businessName: '',
    bio: '',
    categories: [] as ServiceCategory[],
    availabilityStatus: AvailabilityStatus.AVAILABLE_NOW,
    yearsExperience: 0,
    serviceAreaCity: '',
    serviceAreaRadius: 10,
    locationCity: '',
    locationArea: '',
    locationLat: 0,
    locationLng: 0,
    phone: '',
  });

  const [portfolioForm, setPortfolioForm] = useState({
    title: '',
    description: '',
    category: ServiceCategory.ELECTRICIAN,
  });

  // Location search states
  const [citySearchResults, setCitySearchResults] = useState<any[]>([]);
  const [searchingCity, setSearchingCity] = useState(false);
  const [showCityResults, setShowCityResults] = useState(false);
  const [areaSearchResults, setAreaSearchResults] = useState<any[]>([]);
  const [searchingArea, setSearchingArea] = useState(false);
  const [showAreaResults, setShowAreaResults] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [userInteractedWithCity, setUserInteractedWithCity] = useState(false);
  const [userInteractedWithArea, setUserInteractedWithArea] = useState(false);

  // Calculate profile completion
  const calculateCompletion = () => {
    let completed = 0;
    let total = 7;

    if (user?.avatar) completed++;
    if (formData.businessName) completed++;
    if (formData.bio && formData.bio.length > 50) completed++;
    if (formData.categories.length > 0) completed++;
    if (formData.locationCity && formData.locationArea) completed++;
    if (formData.yearsExperience > 0) completed++;
    if (portfolio.length >= 3) completed++;

    return Math.round((completed / total) * 100);
  };

  const completion = calculateCompletion();

  const getCompletionTasks = () => {
    const tasks = [];
    if (!user?.avatar) tasks.push('Add profile photo');
    if (portfolio.length < 3) tasks.push(`Add ${3 - portfolio.length} more portfolio items`);
    if (formData.categories.length === 0) tasks.push('Add service categories');
    return tasks;
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
      return;
    }
    loadProfile();
    loadPortfolio();
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
        locationArea: data.locationArea || '',
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

  const loadPortfolio = async () => {
    try {
      const data = await prosApi.getMyProfile();
      if (data.id) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pros/${data.id}/portfolio`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (response.ok) {
          const portfolioData = await response.json();
          setPortfolio(portfolioData);
        }
      }
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    }
  };

  // Location detection
  const detectLocation = () => {
    setDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
            );
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
              const cityFeature = data.features.find((f: any) => 
                f.place_type.includes('place') || f.place_type.includes('locality')
              );
              const areaFeature = data.features.find((f: any) => 
                f.place_type.includes('neighborhood') || f.place_type.includes('locality')
              );
              
              if (cityFeature) {
                setFormData(prev => ({ 
                  ...prev, 
                  locationCity: cityFeature.text,
                  locationArea: areaFeature?.text || '',
                  locationLat: latitude,
                  locationLng: longitude,
                }));
              }
            }
          } catch (err) {
            console.error('Geocoding error:', err);
          }
          
          setDetectingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setDetectingLocation(false);
        }
      );
    } else {
      setDetectingLocation(false);
    }
  };

  // City search
  const searchCity = async (query: string) => {
    if (query.length < 2) {
      setCitySearchResults([]);
      return;
    }

    setSearchingCity(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place,locality&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=5`
      );
      const data = await response.json();
      
      if (data.features) {
        setCitySearchResults(data.features);
        setShowCityResults(true);
      }
    } catch (err) {
      console.error('City search error:', err);
    } finally {
      setSearchingCity(false);
    }
  };

  // Area search
  const searchArea = async (query: string) => {
    if (query.length < 2 || !formData.locationCity || formData.locationLat === 0) {
      setAreaSearchResults([]);
      return;
    }

    setSearchingArea(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=neighborhood,locality,address&proximity=${formData.locationLng},${formData.locationLat}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=10`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const filteredFeatures = data.features.filter((f: any) => {
          const featureText = f.text.toLowerCase();
          const cityName = formData.locationCity.toLowerCase();
          return featureText !== cityName;
        });
        
        setAreaSearchResults(filteredFeatures);
        setShowAreaResults(filteredFeatures.length > 0);
      } else {
        setAreaSearchResults([]);
        setShowAreaResults(false);
      }
    } catch (err) {
      console.error('Area search error:', err);
      setAreaSearchResults([]);
      setShowAreaResults(false);
    } finally {
      setSearchingArea(false);
    }
  };

  const selectCity = (feature: any) => {
    setFormData(prev => ({
      ...prev,
      locationCity: feature.text,
      locationArea: '',
      locationLat: feature.center[1],
      locationLng: feature.center[0],
    }));
    setShowCityResults(false);
    setCitySearchResults([]);
    setAreaSearchResults([]);
  };

  const selectArea = (feature: any) => {
    setFormData(prev => ({
      ...prev,
      locationArea: feature.text,
      locationLat: feature.center[1],
      locationLng: feature.center[0],
    }));
    setShowAreaResults(false);
    setAreaSearchResults([]);
  };

  // City search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userInteractedWithCity && formData.locationCity && formData.locationCity.length >= 2) {
        searchCity(formData.locationCity);
      } else {
        setCitySearchResults([]);
        setShowCityResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.locationCity, userInteractedWithCity]);

  // Area search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userInteractedWithArea && formData.locationArea && formData.locationArea.length >= 2 && formData.locationCity && formData.locationLat !== 0) {
        searchArea(formData.locationArea);
      } else {
        setAreaSearchResults([]);
        setShowAreaResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.locationArea, userInteractedWithArea, formData.locationCity, formData.locationLat]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      setSaving(true);
      console.log('Submitting profile data:', formData);
      const result = await prosApi.updateProfile(formData);
      console.log('Profile update result:', result);
      toast.success('Profile updated successfully!');
      await loadProfile();
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = (avatarUrl: string) => {
    if (user) {
      updateUser({ ...user, avatar: avatarUrl });
      toast.success('Profile picture updated!');
    }
  };

  const handlePortfolioUpload = async (urls: string[]) => {
    if (!profile) return;
    
    try {
      for (const url of urls) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pros/${profile.id}/portfolio`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({
            imageUrl: url,
            title: portfolioForm.title || 'Portfolio Image',
            description: portfolioForm.description || '',
            category: portfolioForm.category,
          }),
        });
      }
      
      toast.success('Portfolio images added successfully!');
      setPortfolioForm({
        title: '',
        description: '',
        category: ServiceCategory.ELECTRICIAN,
      });
      loadPortfolio();
    } catch (error) {
      console.error('Failed to add portfolio:', error);
      toast.error('Failed to add portfolio images');
    }
  };

  const deletePortfolioItem = async (itemId: string) => {
    if (!confirm('Delete this portfolio item?')) return;
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pros/portfolio/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      toast.success('Portfolio item deleted');
      loadPortfolio();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete portfolio item');
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

  const getSectionStatus = (section: string) => {
    switch (section) {
      case 'basic':
        return formData.businessName && formData.bio && formData.yearsExperience > 0;
      case 'categories':
        return formData.categories.length > 0;
      case 'location':
        return formData.locationCity && formData.locationArea;
      case 'portfolio':
        return portfolio.length >= 3;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'categories', label: 'Services', icon: Briefcase },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'portfolio', label: 'Portfolio', icon: ImageIcon, badge: portfolio.length },
    { id: 'certifications', label: 'Certifications', icon: Award, badge: 0 },
  ];

  const completionTasks = getCompletionTasks();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/pro/dashboard')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <button
              onClick={() => handleSubmit()}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Completion Card */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Complete Your Profile</h2>
              <p className="text-teal-50">A complete profile gets 3x more customer views!</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{completion}%</div>
              <div className="text-sm text-teal-50">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-teal-400/30 rounded-full h-3 mb-4">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>

          {/* Action Items */}
          {completionTasks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {completionTasks.map((task, index) => (
                <button
                  key={index}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition backdrop-blur-sm"
                >
                  {task.includes('photo') && '📸 '}
                  {task.includes('portfolio') && '🖼️ '}
                  {task.includes('categories') && '🏷️ '}
                  {task}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm sticky top-24">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Profile Sections
              </h3>
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const isComplete = getSectionStatus(tab.id);
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1 text-left font-medium">{tab.label}</span>
                      {isComplete ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-orange-400" />
                      )}
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full text-xs font-bold">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              <div className="p-8">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        Basic Information
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">Tell customers about yourself and your business</p>
                    </div>

                    {/* Profile Photo Section */}
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border-2 border-teal-100 dark:border-teal-800">
                      <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        Profile Photo
                      </h3>
                      <div className="flex items-center gap-6">
                        <ProfilePictureUpload
                          currentAvatar={user?.avatar}
                          onUploadSuccess={handleAvatarUpload}
                          userName={user ? `${user.firstName} ${user.lastName}` : 'Pro'}
                          size="xl"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            A professional photo helps customers trust you
                          </p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            <li>✓ Use a clear, well-lit photo</li>
                            <li>✓ Show your face clearly</li>
                            <li>✓ Smile and look professional</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Business Details */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                          placeholder="e.g., John's Plumbing Services"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Professional Bio *
                        </label>
                        <textarea
                          required
                          rows={6}
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                          placeholder="Tell customers about your experience, skills, and what makes you stand out..."
                        />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Write at least 50 characters for a complete profile
                          </p>
                          <span className={`text-xs font-medium ${formData.bio.length >= 50 ? 'text-green-600' : 'text-gray-400'}`}>
                            {formData.bio.length} / 50
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Contact Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                          placeholder="+36 20 123 4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Years of Experience
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[0, 1, 3, 5, 10, 15, 20, 25].map((years) => (
                            <button
                              key={years}
                              type="button"
                              onClick={() => setFormData({ ...formData, yearsExperience: years })}
                              className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                                formData.yearsExperience === years
                                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 shadow-lg'
                                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-500'
                              }`}
                            >
                              <div className={`text-2xl font-bold ${formData.yearsExperience === years ? 'text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                {years === 0 ? '<1' : years === 25 ? '25+' : years}
                              </div>
                              <div className={`text-xs font-medium mt-1 ${formData.yearsExperience === years ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                {years === 0 ? 'year' : 'years'}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Availability Status
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.values(AvailabilityStatus).map((status) => {
                            const statusConfig = {
                              [AvailabilityStatus.AVAILABLE_NOW]: { icon: '🟢', label: 'Available Now', color: 'green' },
                              [AvailabilityStatus.AVAILABLE_SOON]: { icon: '🟡', label: 'Available Soon', color: 'yellow' },
                              [AvailabilityStatus.BUSY]: { icon: '🔴', label: 'Busy', color: 'red' },
                              [AvailabilityStatus.OFFLINE]: { icon: '⚫', label: 'Offline', color: 'gray' },
                            };
                            const config = statusConfig[status];
                            const isActive = formData.availabilityStatus === status;
                            
                            return (
                              <button
                                key={status}
                                type="button"
                                onClick={() => setFormData({ ...formData, availabilityStatus: status })}
                                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                                  isActive
                                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 shadow-lg'
                                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                              >
                                <div className="text-2xl mb-1">{config.icon}</div>
                                <div className={`text-xs font-bold ${isActive ? 'text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {config.label}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        Service Categories
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Select all categories you provide services in</p>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/30 rounded-xl border border-teal-200 dark:border-teal-700">
                          <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span className="font-semibold text-teal-700 dark:text-teal-300">
                            {formData.categories.length} Selected
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Selected Categories Section */}
                    {formData.categories.length > 0 && (
                      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-3xl p-6 border-2 border-teal-200 dark:border-teal-700">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Star className="w-5 h-5 text-teal-600 dark:text-teal-400 fill-teal-600 dark:fill-teal-400" />
                            Your Selected Categories
                          </h3>
                          <span className="text-sm text-teal-600 dark:text-teal-400 font-semibold">
                            {formData.categories.length} active
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {formData.categories.map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => toggleCategory(category)}
                              className="group p-5 rounded-2xl border-2 border-teal-500 dark:border-teal-400 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 relative"
                            >
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-500 dark:bg-teal-400 rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              <div className="text-4xl mb-3">{CATEGORY_ICONS[category]}</div>
                              <div className="text-sm font-bold text-teal-700 dark:text-teal-300">
                                {CATEGORY_LABELS[category] || category}
                              </div>
                              <div className="mt-2 text-xs text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to remove
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available Categories by Group */}
                    {(() => {
                      const categoryGroups: Record<string, ServiceCategory[]> = {
                        'Home Repairs & Maintenance': [
                          ServiceCategory.ELECTRICIAN,
                          ServiceCategory.PLUMBER,
                          ServiceCategory.HANDYMAN,
                          ServiceCategory.HVAC_AC_REPAIR,
                          ServiceCategory.APPLIANCE_REPAIR,
                          ServiceCategory.GAS_TECHNICIAN,
                        ],
                        'Renovation & Installation': [
                          ServiceCategory.PAINTING,
                          ServiceCategory.FLOORING,
                          ServiceCategory.TILE_WORK,
                          ServiceCategory.KITCHEN_BATHROOM_REMODELING,
                          ServiceCategory.DOOR_WINDOW_INSTALLATION,
                        ],
                        'Outdoor & Property Care': [
                          ServiceCategory.GARDENING_LAWN_MOWING,
                          ServiceCategory.TREE_TRIMMING,
                          ServiceCategory.FENCE_INSTALLATION,
                          ServiceCategory.PRESSURE_WASHING,
                          ServiceCategory.SNOW_REMOVAL,
                        ],
                        'Cleaning Services': [
                          ServiceCategory.HOME_CLEANING,
                          ServiceCategory.DEEP_CLEANING,
                          ServiceCategory.OFFICE_CLEANING,
                          ServiceCategory.MOVE_IN_OUT_CLEANING,
                          ServiceCategory.CARPET_SOFA_CLEANING,
                          ServiceCategory.POST_CONSTRUCTION_CLEANING,
                        ],
                        'Hair & Grooming': [
                          ServiceCategory.HAIRCUT,
                          ServiceCategory.HAIRSTYLIST,
                          ServiceCategory.BARBER,
                          ServiceCategory.BEARD_GROOMING,
                        ],
                        'Beauty Services': [
                          ServiceCategory.MANICURE_PEDICURE,
                          ServiceCategory.MAKEUP_ARTIST,
                          ServiceCategory.NAIL_TECHNICIAN,
                          ServiceCategory.EYELASH_EYEBROW_SERVICES,
                        ],
                        'Wellness & Fitness': [
                          ServiceCategory.MASSAGE_THERAPY,
                          ServiceCategory.PHYSIOTHERAPY,
                          ServiceCategory.YOGA_INSTRUCTOR,
                          ServiceCategory.PERSONAL_TRAINER,
                        ],
                        'Tech & Smart Home': [
                          ServiceCategory.TV_MOUNTING,
                          ServiceCategory.WIFI_SETUP,
                          ServiceCategory.SMART_HOME_INSTALLATION,
                          ServiceCategory.CCTV_INSTALLATION,
                          ServiceCategory.COMPUTER_LAPTOP_REPAIR,
                          ServiceCategory.PRINTER_SETUP,
                        ],
                        'Moving & Logistics': [
                          ServiceCategory.HOUSE_SHIFTING,
                          ServiceCategory.FURNITURE_MOVING,
                          ServiceCategory.SMALL_DELIVERIES,
                          ServiceCategory.PACKING_UNPACKING,
                          ServiceCategory.JUNK_REMOVAL,
                        ],
                        'Daily Help & Personal Care': [
                          ServiceCategory.COOKING_HOME_CHEF,
                          ServiceCategory.MEAL_PREP,
                          ServiceCategory.BABYSITTING,
                          ServiceCategory.ELDERLY_CARE,
                          ServiceCategory.HOME_HELPER,
                        ],
                        'Pet Services': [
                          ServiceCategory.DOG_WALKING,
                          ServiceCategory.PET_SITTING,
                          ServiceCategory.PET_GROOMING,
                          ServiceCategory.VET_VISIT_ASSISTANCE,
                        ],
                      };

                      return Object.entries(categoryGroups).map(([groupName, groupCategories]) => {
                        const availableCategories = groupCategories.filter(
                          cat => cat && !formData.categories.includes(cat)
                        );

                        if (availableCategories.length === 0) return null;

                        return (
                          <div key={groupName} className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                {groupName}
                              </h3>
                              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {availableCategories.map((category) => (
                                <button
                                  key={category}
                                  type="button"
                                  onClick={() => toggleCategory(category)}
                                  className="group p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg transition-all transform hover:scale-105"
                                >
                                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                                    {CATEGORY_ICONS[category]}
                                  </div>
                                  <div className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                    {CATEGORY_LABELS[category] || category}
                                  </div>
                                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to add
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        Location & Service Area
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">Set your base location and service coverage area</p>
                    </div>

                    <div className="space-y-6 max-w-3xl">
                      {/* Base Location */}
                      <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-2xl p-6 border-2 border-blue-100 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                            <span>🏠</span>
                            <span>Your Base Location</span>
                          </h3>
                          <button
                            type="button"
                            onClick={detectLocation}
                            disabled={detectingLocation}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                          >
                            {detectingLocation ? (
                              <>
                                <span className="animate-spin">🔄</span>
                                <span>Detecting...</span>
                              </>
                            ) : (
                              <>
                                <span>📍</span>
                                <span>Auto-Detect</span>
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {/* City Input */}
                          <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.locationCity}
                              onChange={(e) => {
                                setUserInteractedWithCity(true);
                                setFormData({ ...formData, locationCity: e.target.value, locationArea: '' });
                                if (e.target.value.length >= 2) {
                                  setShowCityResults(true);
                                } else {
                                  setShowCityResults(false);
                                }
                              }}
                              onFocus={() => {
                                setUserInteractedWithCity(true);
                                setShowCityResults(false);
                              }}
                              onBlur={() => {
                                setTimeout(() => setShowCityResults(false), 200);
                              }}
                              placeholder="Start typing your city..."
                              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                            {searchingCity && (
                              <div className="absolute right-3 top-12 text-gray-400">
                                <span className="animate-spin">⏳</span>
                              </div>
                            )}
                            
                            {showCityResults && citySearchResults.length > 0 && formData.locationCity.length >= 2 && (
                              <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                                {citySearchResults.map((feature, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      selectCity(feature);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition flex items-start gap-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                  >
                                    <span className="text-2xl">📍</span>
                                    <div className="flex-1">
                                      <div className="font-semibold text-gray-900 dark:text-white">{feature.text}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">{feature.place_name}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Area Input */}
                          <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Area/District/Neighborhood
                            </label>
                            <input
                              type="text"
                              value={formData.locationArea}
                              onChange={(e) => {
                                setUserInteractedWithArea(true);
                                setFormData({ ...formData, locationArea: e.target.value });
                                if (e.target.value.length >= 2) {
                                  setShowAreaResults(true);
                                } else {
                                  setShowAreaResults(false);
                                }
                              }}
                              onFocus={() => {
                                setUserInteractedWithArea(true);
                                setShowAreaResults(false);
                              }}
                              onBlur={() => {
                                setTimeout(() => setShowAreaResults(false), 200);
                              }}
                              disabled={!formData.locationCity || formData.locationLat === 0}
                              placeholder={formData.locationCity ? "Start typing area name..." : "Select a city first"}
                              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            {searchingArea && (
                              <div className="absolute right-3 top-12 text-gray-400">
                                <span className="animate-spin">⏳</span>
                              </div>
                            )}
                            
                            {showAreaResults && areaSearchResults.length > 0 && formData.locationArea.length >= 2 && (
                              <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                                {areaSearchResults.map((feature, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      selectArea(feature);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition flex items-start gap-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                  >
                                    <span className="text-2xl">📍</span>
                                    <div className="flex-1">
                                      <div className="font-semibold text-gray-900 dark:text-white">{feature.text}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">{feature.place_name}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {formData.locationLat !== 0 && formData.locationLng !== 0 && (
                          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 rounded-xl">
                            <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2 font-medium">
                              <CheckCircle className="w-5 h-5" />
                              <span>
                                Location confirmed: {formData.locationCity}
                                {formData.locationArea && `, ${formData.locationArea}`}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Service Coverage Area */}
                      <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 rounded-2xl p-6 border-2 border-teal-100 dark:border-teal-800">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                          <span>🚗</span>
                          <span>Service Coverage Area</span>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          How far are you willing to travel to serve customers?
                        </p>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Service Radius: <span className="text-teal-600 dark:text-teal-400 text-xl font-bold">{formData.serviceAreaRadius} km</span>
                          </label>
                          <input
                            type="range"
                            min="5"
                            max="50"
                            step="5"
                            value={formData.serviceAreaRadius}
                            onChange={(e) => setFormData({ ...formData, serviceAreaRadius: parseInt(e.target.value) })}
                            className="w-full h-3 bg-gradient-to-r from-teal-200 to-green-200 dark:from-teal-800 dark:to-green-800 rounded-full appearance-none cursor-pointer accent-teal-600"
                          />
                          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
                            <span>5 km</span>
                            <span>25 km</span>
                            <span>50 km</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-4 flex items-center gap-2">
                          <span>💡</span>
                          <span>You'll appear in search results for customers within this radius</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Portfolio Tab */}
                {activeTab === 'portfolio' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                        Portfolio Gallery
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">Showcase your best work to attract customers</p>
                    </div>

                    {/* Upload Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-100 dark:border-purple-800 max-w-3xl">
                      <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Add New Portfolio Items</h3>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                            <input
                              type="text"
                              value={portfolioForm.title}
                              onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                              placeholder="e.g., Kitchen Renovation"
                              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <select
                              value={portfolioForm.category}
                              onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value as ServiceCategory })}
                              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                            >
                              {Object.values(ServiceCategory).map(cat => (
                                <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                          <textarea
                            rows={3}
                            value={portfolioForm.description}
                            onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                            placeholder="Describe this project..."
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                          />
                        </div>

                        <ImageUpload
                          multiple
                          maxFiles={10}
                          label="📸 Upload Portfolio Photos"
                          onUpload={handlePortfolioUpload}
                        />
                      </div>
                    </div>

                    {/* Portfolio Grid */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Your Portfolio ({portfolio.length} items)
                        </h3>
                        {portfolio.length >= 3 && (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Complete
                          </span>
                        )}
                      </div>
                      
                      {portfolio.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                          <div className="text-6xl mb-4">📸</div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No portfolio items yet</h3>
                          <p className="text-gray-600 dark:text-gray-400">Upload photos of your work to showcase your skills!</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {portfolio.map((item: any) => (
                            <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all hover:shadow-2xl">
                              <img
                                src={getImageUrl(item.imageUrl) || item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                  <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                  <p className="text-white/80 text-xs mb-3 line-clamp-2">{item.description}</p>
                                  <button
                                    onClick={() => deletePortfolioItem(item.id)}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Certifications Tab - Placeholder */}
                {activeTab === 'certifications' && (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Certifications Tab</h3>
                    <p className="text-gray-600 dark:text-gray-400">Coming soon - Add your professional certifications and licenses</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
