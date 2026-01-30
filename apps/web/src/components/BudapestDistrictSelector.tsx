'use client';

import { useState } from 'react';
import { BUDAPEST_DISTRICTS, DISTRICT_ZONES, getDistrictDisplayName, BudapestDistrict, DistrictZone } from '@ozar/shared/budapestDistricts';

interface BudapestDistrictSelectorProps {
  selectedDistricts: string[];
  onChange: (districts: string[]) => void;
  language?: 'en' | 'hu';
  mode?: 'single' | 'multiple';
}

export default function BudapestDistrictSelector({
  selectedDistricts,
  onChange,
  language = 'en',
  mode = 'multiple',
}: BudapestDistrictSelectorProps) {
  const toggleDistrict = (district: string) => {
    if (mode === 'single') {
      onChange([district]);
    } else {
      if (selectedDistricts.includes(district)) {
        onChange(selectedDistricts.filter(d => d !== district));
      } else {
        onChange([...selectedDistricts, district]);
      }
    }
  };

  const toggleZone = (zone: DistrictZone) => {
    const zoneDistricts = DISTRICT_ZONES[zone].districts;
    const allSelected = zoneDistricts.every(d => selectedDistricts.includes(d));
    
    if (allSelected) {
      onChange(selectedDistricts.filter(d => !zoneDistricts.includes(d as any)));
    } else {
      const newDistricts = [...new Set([...selectedDistricts, ...zoneDistricts])];
      onChange(newDistricts);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {language === 'hu' ? 'Válassz kerületeket' : 'Select Districts'}
        </h3>
        {selectedDistricts.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            {language === 'hu' ? 'Törlés' : 'Clear All'}
          </button>
        )}
      </div>

      {Object.entries(DISTRICT_ZONES).map(([zoneKey, zone]) => {
        const zoneDistricts = zone.districts;
        const allSelected = zoneDistricts.every(d => selectedDistricts.includes(d));
        const someSelected = zoneDistricts.some(d => selectedDistricts.includes(d));

        return (
          <div key={zoneKey} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {language === 'hu' ? zone.nameHu : zone.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{zone.description}</p>
              </div>
              <button
                onClick={() => toggleZone(zoneKey as DistrictZone)}
                className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                  allSelected
                    ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                    : someSelected
                    ? 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {allSelected
                  ? language === 'hu' ? 'Mind kijelölve' : 'All Selected'
                  : language === 'hu' ? 'Mind kijelölése' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {zoneDistricts.map((district) => {
                const isSelected = selectedDistricts.includes(district);
                const districtData = BUDAPEST_DISTRICTS[district as BudapestDistrict];

                return (
                  <button
                    key={district}
                    onClick={() => toggleDistrict(district)}
                    className={`p-3 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                      isSelected
                        ? 'border-cyan-600 bg-cyan-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-lg text-gray-900">{district}.</div>
                    <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {language === 'hu' ? districtData.name : districtData.nameEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {selectedDistricts.length > 0 && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
          <div className="text-sm font-semibold text-cyan-900 mb-3">
            {language === 'hu' ? 'Kiválasztott kerületek:' : 'Selected Districts:'} ({selectedDistricts.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedDistricts.map((district) => (
              <span
                key={district}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-cyan-300 rounded-full text-sm font-medium text-cyan-900 shadow-sm"
              >
                {getDistrictDisplayName(district as BudapestDistrict, language)}
                <button
                  onClick={() => toggleDistrict(district)}
                  className="text-cyan-600 hover:text-cyan-800 font-bold text-lg leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
