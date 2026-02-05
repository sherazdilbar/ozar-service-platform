'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ProLayout from '@/components/ProLayout';
import BudapestDistrictSelector from '@/components/BudapestDistrictSelector';
import { prosApi } from '@ozar/shared/apiClient';
import { isBudapest } from '@ozar/shared/budapestDistricts';
import { MapPin, Save, Navigation } from 'lucide-react';

export default function ProServiceAreaPageListeo() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serviceArea, setServiceArea] = useState({
    city: 'Budapest',
    radiusKm: 20,
    lat: 47.4979,
    lng: 19.0402,
  });
  const [serviceAreaDistricts, setServiceAreaDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
      return;
    }
    loadServiceArea();
  }, [isAuthenticated, user]);

  const loadServiceArea = async () => {
    try {
      const profile = await prosApi.getMyProfile();
      
      const city = profile.locationCity || profile.serviceArea?.city || 'Budapest';
      
      setServiceArea({
        city: city,
        radiusKm: profile.serviceArea?.radiusKm || 20,
        lat: profile.locationLat || 47.4979,
        lng: profile.locationLng || 19.0402,
      });
      
      if (profile.serviceAreaDistricts && profile.serviceAreaDistricts.length > 0) {
        setServiceAreaDistricts(profile.serviceAreaDistricts);
      }
      
      console.log('Loaded service area:', {
        city,
        districts: profile.serviceAreaDistricts,
        location: { lat: profile.locationLat, lng: profile.locationLng }
      });
    } catch (error) {
      console.error('Failed to load service area:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveServiceArea = async () => {
    setSaving(true);
    try {
      const updateData: any = {
        serviceArea: {
          city: serviceArea.city,
          radiusKm: serviceArea.radiusKm,
        },
        location: {
          city: serviceArea.city,
          area: serviceArea.city,
          lat: serviceArea.lat,
          lng: serviceArea.lng,
        },
      };

      if (isBudapest(serviceArea.city)) {
        updateData.serviceAreaDistricts = serviceAreaDistricts;
      }

      await prosApi.updateProfile(updateData);
      alert('Service area saved successfully!');
    } catch (error) {
      console.error('Failed to save service area:', error);
      alert('Failed to save service area');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
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
            Service Area
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Define where you provide your services in Budapest
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* City Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Base City
              </h3>
              <input
                type="text"
                value={serviceArea.city}
                disabled
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg font-semibold cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Currently serving Budapest only
              </p>
            </div>

            {/* Summary Card */}
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-6 border border-teal-200 dark:border-teal-800 shadow-sm">
              <h3 className="text-lg font-bold text-teal-900 dark:text-teal-100 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Coverage Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-700 dark:text-teal-300">City:</span>
                  <span className="text-sm font-bold text-teal-900 dark:text-teal-100">{serviceArea.city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-700 dark:text-teal-300">Districts:</span>
                  <span className="text-sm font-bold text-teal-900 dark:text-teal-100">
                    {serviceAreaDistricts.length} selected
                  </span>
                </div>
                {serviceAreaDistricts.length > 0 && (
                  <div className="pt-3 border-t border-teal-200 dark:border-teal-700">
                    <p className="text-xs text-teal-700 dark:text-teal-300 mb-2">Serving:</p>
                    <div className="flex flex-wrap gap-1">
                      {serviceAreaDistricts.sort().map(d => (
                        <span key={d} className="px-2 py-1 bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 rounded-lg text-xs font-semibold">
                          {d}.
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveServiceArea}
              disabled={saving || serviceAreaDistricts.length === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Service Area
                </>
              )}
            </button>
          </div>

          {/* Right Column - District Selector */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm h-full">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === 'hu' ? 'Budapest Térkép' : 'Budapest Map'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'hu' 
                    ? 'Kattints a térképre a kerületek kiválasztásához'
                    : 'Click on the map to select districts you serve'}
                </p>
              </div>
              
              <BudapestDistrictSelector
                selectedDistricts={serviceAreaDistricts}
                onChange={setServiceAreaDistricts}
                language={language as 'en' | 'hu'}
                mode="multiple"
              />
            </div>
          </div>
        </div>
      </div>
    </ProLayout>
  );
}
