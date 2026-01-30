'use client';

import { useState, useEffect } from 'react';
import { 
  BUDAPEST_DISTRICTS, 
  DISTRICT_ZONES, 
  getDistrictDisplayName,
  BudapestDistrict,
  DistrictZone,
  BUDAPEST_DISTRICT_COORDINATES, 
  getDistrictCoordinates,
  findNearestDistrict,
  isWithinBudapest,
  BUDAPEST_CENTER
} from '@ozar/shared';

interface BudapestLocationSelectorProps {
  selectedDistrict: string;
  onDistrictChange: (district: string, lat: number, lng: number) => void;
  language?: 'en' | 'hu';
  showCurrentLocation?: boolean;
}

export default function BudapestLocationSelector({
  selectedDistrict,
  onDistrictChange,
  language = 'en',
  showCurrentLocation = true,
}: BudapestLocationSelectorProps) {
  const [gettingLocation, setGettingLocation] = useState(false);
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  const handleDistrictSelect = (district: string) => {
    const coords = getDistrictCoordinates(district);
    if (coords) {
      onDistrictChange(district, coords.lat, coords.lng);
    }
  };

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        alert(language === 'hu' 
          ? 'A böngésző nem támogatja a helymeghatározást' 
          : 'Geolocation is not supported by your browser');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Check if within Budapest
          if (isWithinBudapest(latitude, longitude)) {
            const nearestDistrict = findNearestDistrict(latitude, longitude);
            if (nearestDistrict) {
              onDistrictChange(nearestDistrict, latitude, longitude);
              alert(language === 'hu'
                ? `Helyzet meghatározva: ${nearestDistrict}. kerület`
                : `Location detected: District ${nearestDistrict}`);
            }
          } else {
            // Not in Budapest, default to city center (District V)
            const coords = getDistrictCoordinates('V');
            if (coords) {
              onDistrictChange('V', coords.lat, coords.lng);
              alert(language === 'hu'
                ? 'Nem vagy Budapesten. Alapértelmezett: V. kerület (Belváros)'
                : 'You are not in Budapest. Defaulting to District V (City Center)');
            }
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert(language === 'hu'
            ? 'Nem sikerült meghatározni a helyzetet'
            : 'Failed to get your location');
        }
      );
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setGettingLocation(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Location Button */}
      {showCurrentLocation && (
        <button
          onClick={getCurrentLocation}
          disabled={gettingLocation}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-md disabled:opacity-50"
        >
          {gettingLocation ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span className="font-medium">
                {language === 'hu' ? 'Helyzet meghatározása...' : 'Detecting location...'}
              </span>
            </>
          ) : (
            <>
              <span className="text-xl">📍</span>
              <span className="font-medium">
                {language === 'hu' ? 'Jelenlegi helyzetem használata' : 'Use My Current Location'}
              </span>
            </>
          )}
        </button>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-500">
          {language === 'hu' ? 'vagy válassz kerületet' : 'or select district'}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* District Selection by Zone */}
      <div className="space-y-3">
        {Object.entries(DISTRICT_ZONES).map(([zoneKey, zone]) => {
          const isExpanded = expandedZone === zoneKey;
          const isSelected = zone.districts.includes(selectedDistrict as any);

          return (
            <div key={zoneKey} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              {/* Zone Header */}
              <button
                onClick={() => setExpandedZone(isExpanded ? null : zoneKey)}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  isSelected ? 'bg-cyan-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {zoneKey === 'central' ? '🏛️' : 
                     zoneKey === 'buda-hills' ? '⛰️' :
                     zoneKey === 'north-buda' ? '🏘️' :
                     zoneKey === 'north-pest' ? '🏙️' :
                     zoneKey === 'mid-pest' ? '🏢' :
                     zoneKey === 'south-buda' ? '🌳' :
                     zoneKey === 'south-pest' ? '🏭' :
                     '🏘️'}
                  </span>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">
                      {language === 'hu' ? zone.nameHu : zone.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {zone.districts.length} {language === 'hu' ? 'kerület' : 'districts'}
                    </p>
                  </div>
                </div>
                <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Districts Grid */}
              {isExpanded && (
                <div className="p-4 pt-0 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {zone.districts.map((district) => {
                    const isDistrictSelected = selectedDistrict === district;
                    const districtData = BUDAPEST_DISTRICTS[district as BudapestDistrict];

                    return (
                      <button
                        key={district}
                        onClick={() => handleDistrictSelect(district)}
                        className={`p-3 rounded-lg border-2 transition-all text-center hover:shadow-md ${
                          isDistrictSelected
                            ? 'border-cyan-600 bg-cyan-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="font-bold text-xl text-gray-900">{district}.</div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {language === 'hu' ? districtData.name : districtData.nameEn}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected District Display */}
      {selectedDistrict && (
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <div className="text-sm font-medium text-cyan-900">
                {language === 'hu' ? 'Kiválasztott kerület:' : 'Selected District:'}
              </div>
              <div className="text-lg font-bold text-cyan-900">
                {getDistrictDisplayName(selectedDistrict as BudapestDistrict, language)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
