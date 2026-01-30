'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import BudapestMapSelector from '@/components/BudapestMapSelector';
import { BUDAPEST_DISTRICTS, BUDAPEST_DISTRICT_COORDINATES, getAccessToken } from '@ozar/shared';
import { MapPin, Home, Check, ArrowRight } from 'lucide-react';

interface MapboxFeature {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  properties?: {
    address?: string;
  };
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function CustomerOnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuth();
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<MapboxFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const addressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user?.role !== 'CUSTOMER') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (addressRef.current && !addressRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search for addresses in selected district
  const searchAddress = async (query: string) => {
    if (query.length < 2 || !selectedDistrict) {
      setAddressSuggestions([]);
      return;
    }

    setSearchingAddress(true);
    try {
      const districtCoords = BUDAPEST_DISTRICT_COORDINATES[selectedDistrict as keyof typeof BUDAPEST_DISTRICT_COORDINATES];
      
      // Search for the address directly without adding district to query
      // This prevents Mapbox from returning city-level results
      const searchQuery = `${query} Budapest`;
      const proximity = `${districtCoords.lng},${districtCoords.lat}`;
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
        `country=HU&` +
        `proximity=${proximity}&` +
        `types=address&` +
        `language=hu&` +
        `access_token=${MAPBOX_TOKEN}&` +
        `limit=10`
      );
      
      const data = await response.json();
      
      console.log('Raw Mapbox response:', data);
      
      if (data.features) {
        // Filter to only show actual street addresses (not city names)
        // and results in Budapest
        const addressResults = data.features.filter((f: MapboxFeature) => {
          const placeName = f.place_name.toLowerCase();
          const text = f.text.toLowerCase();
          
          console.log('Checking feature:', { text, placeName, feature: f });
          
          // Must include budapest and text should not be just "budapest"
          return placeName.includes('budapest') && text !== 'budapest';
        });
        
        console.log('Filtered address results:', addressResults);
        setAddressSuggestions(addressResults);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error('Address search error:', err);
    } finally {
      setSearchingAddress(false);
    }
  };

  // Debounced address search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (streetAddress && selectedDistrict) {
        searchAddress(streetAddress);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [streetAddress, selectedDistrict]);

  const handleAddressSelect = (feature: MapboxFeature) => {
    // Mapbox place_name contains the full address
    // Example: "ráday utca 40, 2139, pest vármegye, magyarország"
    const fullAddress = feature.place_name;
    
    // Extract the first part which contains street + house number
    const parts = fullAddress.split(',');
    const streetWithNumber = parts[0].trim();
    
    console.log('Selected feature:', feature);
    console.log('Full address:', fullAddress);
    console.log('Street with number:', streetWithNumber);
    
    // Set the complete address with house number
    setStreetAddress(streetWithNumber);
    setSelectedCoordinates({
      lat: feature.center[1],
      lng: feature.center[0],
    });
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleNext = () => {
    if (!selectedDistrict) {
      setError(language === 'hu' ? 'Kérlek válassz kerületet' : 'Please select a district');
      return;
    }
    setStep(2);
    setError('');
  };

  const handleComplete = async () => {
    if (!streetAddress.trim()) {
      setError(language === 'hu' ? 'Kérlek add meg az utcacímet' : 'Please enter your street address');
      return;
    }

    setLoading(true);
    try {
      // Get token from storage
      const token = getAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Use selected coordinates from Mapbox, or fall back to district center
      const coords = selectedCoordinates || {
        lat: BUDAPEST_DISTRICT_COORDINATES[selectedDistrict as keyof typeof BUDAPEST_DISTRICT_COORDINATES].lat,
        lng: BUDAPEST_DISTRICT_COORDINATES[selectedDistrict as keyof typeof BUDAPEST_DISTRICT_COORDINATES].lng,
      };
      
      const updateData = {
        locationCity: 'Budapest',
        locationDistrict: selectedDistrict,
        locationArea: streetAddress.trim(),
        locationLat: coords.lat,
        locationLng: coords.lng,
      };
      
      console.log('Updating user with data:', updateData);
      
      // Update user location
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Failed to update location');
      }

      const updatedUser = await response.json();
      console.log('User updated successfully:', updatedUser);

      // Update the user in AuthContext so profile page shows the new address
      if (updateUser) {
        updateUser(updatedUser);
      }

      // Redirect to home
      router.push('/');
    } catch (err: any) {
      console.error('Onboarding error:', err);
      setError(err.message || (language === 'hu' ? 'Hiba történt. Próbáld újra.' : 'Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'CUSTOMER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 1 ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <div className={`h-1 w-20 ${step >= 2 ? 'bg-teal-600' : 'bg-gray-200'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            {language === 'hu' ? 'Lépés' : 'Step'} {step} {language === 'hu' ? '/' : 'of'} 2
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Step 1: District Selection */}
          {step === 1 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-teal-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === 'hu' ? 'Melyik kerületben laksz?' : 'Which district do you live in?'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'hu' 
                    ? 'Kattints a térképre a kerületed kiválasztásához'
                    : 'Click on the map to select your district'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Map Selector */}
              <div className="mb-6">
                <BudapestMapSelector
                  selectedDistricts={selectedDistrict ? [selectedDistrict] : []}
                  onChange={(districts) => {
                    setSelectedDistrict(districts[0] || '');
                    setStreetAddress('');
                    setSelectedCoordinates(null);
                    setError('');
                  }}
                  language={language as 'en' | 'hu'}
                  mode="single"
                />
              </div>

              <button
                onClick={handleNext}
                disabled={!selectedDistrict}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{language === 'hu' ? 'Tovább' : 'Continue'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </div>
          )}

          {/* Step 2: Street Address */}
          {step === 2 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-teal-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === 'hu' ? 'Mi a pontos címed?' : 'What\'s your street address?'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'hu' 
                    ? 'Add meg az utcacímedet a pontos szolgáltatásokhoz'
                    : 'Enter your street address for accurate service delivery'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-6" ref={addressRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'hu' ? 'Utca és házszám' : 'Street and house number'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => {
                      setStreetAddress(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => {
                      if (addressSuggestions.length > 0) setShowSuggestions(true);
                    }}
                    placeholder={language === 'hu' ? 'pl. Andrássy út 1.' : 'e.g. Andrássy út 1.'}
                    className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition text-lg"
                    autoFocus
                  />
                  {searchingAddress && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600" />
                    </div>
                  )}
                </div>

                {/* Address Suggestions */}
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-teal-500 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    {addressSuggestions.map((suggestion, index) => {
                      // Use the text field which contains the street name
                      const streetName = suggestion.text;
                      // Extract district/area info from place_name
                      const parts = suggestion.place_name.split(',').map(p => p.trim());
                      const locationInfo = parts.slice(1, 3).join(', ');
                      
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAddressSelect(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-teal-50 dark:hover:bg-teal-900/30 transition flex items-start gap-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {streetName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {locationInfo}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {language === 'hu' 
                    ? `Budapest, ${selectedDistrict}. kerület - Válassz utcát és add meg a házszámot`
                    : `Budapest, District ${selectedDistrict} - Select street and add house number`}
                </p>

                {selectedCoordinates && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {language === 'hu' 
                          ? '✓ Utca kiválasztva - Most add meg a házszámot (pl. 30)'
                          : '✓ Street selected - Now add the house number (e.g. 30)'}
                      </span>
                    </p>
                  </div>
                )}

                {!selectedCoordinates && streetAddress.length > 0 && (
                  <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      {language === 'hu' 
                        ? 'Válassz egy utcát a javaslatokból a pontos koordinátákhoz'
                        : 'Select a street from suggestions for accurate coordinates'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  {language === 'hu' ? 'Vissza' : 'Back'}
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading || !streetAddress.trim()}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>{language === 'hu' ? 'Mentés...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>{language === 'hu' ? 'Befejezés' : 'Complete'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          {language === 'hu' 
            ? 'Később bármikor megváltoztathatod a profilodban'
            : 'You can change this later in your profile settings'}
        </p>
      </div>
    </div>
  );
}
