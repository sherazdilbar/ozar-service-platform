# Budapest Districts Implementation - Complete Guide

## ✅ What Has Been Implemented

### 1. Database Schema Updates
- Added `locationDistrict` field to `User` model (optional)
- Added `locationDistrict` field to `ProProfile` model (their base district)
- Added `serviceAreaDistricts` array field to `ProProfile` model (districts they serve)
- Migration created and applied: `20260130150312_add_budapest_districts`

### 2. Budapest Districts Constants
Created `packages/shared/budapestDistricts.ts` with:
- All 23 Budapest districts (I-XXIII) with Hungarian and English names
- District zones (central, buda-hills, north-buda, etc.)
- Helper functions:
  - `getDistrictDisplayName()` - Get formatted district name
  - `getDistrictsInZone()` - Get all districts in a zone
  - `isBudapest()` - Check if city is Budapest
  - `getZoneForDistrict()` - Get zone for a district

### 3. Backend API Updates

#### Pros Service (`apps/backend/src/pros/pros.service.ts`)
- Updated `findAll()` to support district filtering:
  - Filter by single district: `?city=Budapest&district=V`
  - Filter by multiple districts: `?city=Budapest&districts=V,VI,VII`
  - Auto-extract district from search query
- Updated `create()` to initialize empty districts array
- Updated `updateMyProfile()` to handle:
  - `locationDistrict` - Pro's base district
  - `serviceAreaDistricts` - Array of districts they serve

#### DTOs (`apps/backend/src/pros/dto/index.ts`)
- Added `district` field to `GetProsDto` (single district filter)
- Added `districts` field to `GetProsDto` (multiple districts filter)
- Added `locationDistrict` field to `UpdateProDto`
- Added `serviceAreaDistricts` array field to `UpdateProDto`

### 4. Shared Package
- Exported budapestDistricts module in `packages/shared/index.ts`
- Added export in `packages/shared/package.json`

## 📋 What Still Needs to Be Done

### 1. Frontend Components

#### Web App (`apps/web`)

**Create Budapest District Selector Component:**
```typescript
// apps/web/src/components/BudapestDistrictSelector.tsx
'use client';

import { useState } from 'react';
import { BUDAPEST_DISTRICTS, DISTRICT_ZONES, getDistrictDisplayName } from '@ozar/shared/budapestDistricts';

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

  const toggleZone = (zone: keyof typeof DISTRICT_ZONES) => {
    const zoneDistricts = DISTRICT_ZONES[zone].districts;
    const allSelected = zoneDistricts.every(d => selectedDistricts.includes(d));
    
    if (allSelected) {
      onChange(selectedDistricts.filter(d => !zoneDistricts.includes(d)));
    } else {
      const newDistricts = [...new Set([...selectedDistricts, ...zoneDistricts])];
      onChange(newDistricts);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {language === 'hu' ? 'Válassz kerületeket' : 'Select Districts'}
        </h3>
        {selectedDistricts.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="text-sm text-red-600 hover:text-red-700"
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
          <div key={zoneKey} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">
                {language === 'hu' ? zone.nameHu : zone.name}
              </h4>
              <button
                onClick={() => toggleZone(zoneKey as keyof typeof DISTRICT_ZONES)}
                className={`text-sm px-3 py-1 rounded ${
                  allSelected
                    ? 'bg-cyan-600 text-white'
                    : someSelected
                    ? 'bg-cyan-100 text-cyan-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {allSelected
                  ? language === 'hu' ? 'Mind kijelölve' : 'All Selected'
                  : language === 'hu' ? 'Mind kijelölése' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {zoneDistricts.map((district) => {
                const isSelected = selectedDistricts.includes(district);
                const districtData = BUDAPEST_DISTRICTS[district as keyof typeof BUDAPEST_DISTRICTS];

                return (
                  <button
                    key={district}
                    onClick={() => toggleDistrict(district)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-cyan-600 bg-cyan-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-bold text-lg">{district}.</div>
                    <div className="text-xs text-gray-600 mt-1">
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
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <div className="text-sm font-medium text-cyan-900 mb-2">
            {language === 'hu' ? 'Kiválasztott kerületek:' : 'Selected Districts:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedDistricts.map((district) => (
              <span
                key={district}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-cyan-300 rounded-full text-sm"
              >
                {getDistrictDisplayName(district as any, language)}
                <button
                  onClick={() => toggleDistrict(district)}
                  className="text-cyan-600 hover:text-cyan-800"
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
```

**Update Pro Service Area Page:**
```typescript
// apps/web/src/app/pro/service-area/page.tsx
// Add Budapest district selector when city is Budapest

import BudapestDistrictSelector from '@/components/BudapestDistrictSelector';
import { isBudapest } from '@ozar/shared/budapestDistricts';

// In the component:
{isBudapest(serviceAreaCity) && (
  <div className="mt-6">
    <BudapestDistrictSelector
      selectedDistricts={serviceAreaDistricts}
      onChange={setServiceAreaDistricts}
      language={language}
      mode="multiple"
    />
  </div>
)}
```

**Update Search Page:**
```typescript
// apps/web/src/app/search/page.tsx
// Add district filter when searching in Budapest

{city === 'Budapest' && (
  <div className="mb-6">
    <BudapestDistrictSelector
      selectedDistricts={selectedDistricts}
      onChange={setSelectedDistricts}
      language={language}
      mode="multiple"
    />
  </div>
)}

// Update search API call:
const params = {
  city,
  districts: selectedDistricts.join(','),
  category,
  // ... other params
};
```

#### Mobile App (`apps/mobile`)

**Create Budapest District Selector Component:**
```typescript
// apps/mobile/components/BudapestDistrictSelector.tsx
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { BUDAPEST_DISTRICTS, DISTRICT_ZONES, getDistrictDisplayName } from '@ozar/shared/budapestDistricts';

// Similar implementation to web but with React Native components
```

**Update Pro Service Area Screen:**
```typescript
// apps/mobile/app/pro/service-area.tsx
// Add Budapest district selector when city is Budapest
```

**Update Search/Home Screen:**
```typescript
// apps/mobile/app/(tabs)/index.tsx
// Add district filter when searching in Budapest
```

### 2. Hungarian Translations

**Add to `apps/web/src/locales/hu.json`:**
```json
{
  "districts": {
    "title": "Kerületek",
    "selectDistricts": "Válassz kerületeket",
    "selectedDistricts": "Kiválasztott kerületek",
    "clearAll": "Törlés",
    "selectAll": "Mind kijelölése",
    "allSelected": "Mind kijelölve",
    "zones": {
      "central": "Központi Budapest",
      "buda-hills": "Budai hegyek",
      "north-buda": "Észak-Buda",
      "north-pest": "Észak-Pest",
      "mid-pest": "Közép-Pest",
      "south-buda": "Dél-Buda",
      "south-pest": "Dél-Pest",
      "outer-pest": "Külső-Pest"
    }
  },
  "pro": {
    "serviceArea": {
      "districts": "Szolgáltatási kerületek",
      "selectDistrictsYouServe": "Válaszd ki azokat a kerületeket, ahol szolgáltatást nyújtasz"
    }
  }
}
```

**Add to `apps/mobile/locales/hu.json`:**
```json
{
  "districts": {
    // Same as web
  }
}
```

### 3. Default City to Budapest

**Update Location Selectors:**
```typescript
// Set default city to Budapest for Hungarian users
const [city, setCity] = useState(language === 'hu' ? 'Budapest' : '');
```

**Update Pro Onboarding:**
```typescript
// Default to Budapest in onboarding flow
const defaultCity = language === 'hu' ? 'Budapest' : '';
```

### 4. Seed Data Update

**Update `apps/backend/prisma/seed.ts`:**
```typescript
// Add Budapest districts to existing pros
const budapestDistricts = ['V', 'VI', 'VII', 'XIII']; // Central districts

// When creating pros in Budapest:
locationCity: 'Budapest',
locationDistrict: 'V', // or random from central districts
serviceAreaCity: 'Budapest',
serviceAreaDistricts: budapestDistricts,
```

### 5. API Documentation

**Document new endpoints:**
```
GET /pros?city=Budapest&district=V
GET /pros?city=Budapest&districts=V,VI,VII
PUT /pros/me/profile
  Body: {
    locationDistrict: "V",
    serviceAreaDistricts: ["V", "VI", "VII", "XIII"]
  }
```

## 🚀 Quick Implementation Steps

### Step 1: Create Web Components (30 min)
1. Create `BudapestDistrictSelector.tsx` component
2. Update pro service area page
3. Update search page with district filter

### Step 2: Create Mobile Components (30 min)
1. Create mobile `BudapestDistrictSelector.tsx`
2. Update pro service area screen
3. Update search/home screen

### Step 3: Add Translations (15 min)
1. Add Hungarian translations for districts
2. Add English translations for districts

### Step 4: Update Defaults (10 min)
1. Set default city to Budapest for Hungarian users
2. Update onboarding flow

### Step 5: Update Seed Data (15 min)
1. Add Budapest districts to seed data
2. Run seed script to populate test data

### Step 6: Testing (30 min)
1. Test district selection in pro onboarding
2. Test district filtering in search
3. Test with Hungarian language
4. Test API endpoints

## 📊 Testing Checklist

- [ ] Pro can select multiple districts during onboarding
- [ ] Pro can update districts in service area page
- [ ] Search filters by district correctly
- [ ] District names display in Hungarian when language is HU
- [ ] District names display in English when language is EN
- [ ] API returns pros serving selected district(s)
- [ ] Mobile district selector works on iOS/Android
- [ ] District selection persists after save
- [ ] Zone "Select All" button works correctly
- [ ] Clear all button works correctly

## 🎯 Launch Recommendations

### Phase 1: Soft Launch (Week 1-2)
- Focus on central districts: V, VI, VII, XIII
- Recruit 20-30 pros in these districts
- Test with real users
- Gather feedback

### Phase 2: Expansion (Week 3-4)
- Add Buda Hills: II, XII
- Add popular residential: XI, XIV
- Recruit 50+ more pros
- Scale marketing

### Phase 3: Full Coverage (Month 2)
- Cover all 23 districts
- 200+ active pros
- Full marketing push

## 💡 Pro Tips

1. **District Pricing**: Consider different pricing for central vs outer districts
2. **Travel Fees**: Pros can charge extra for outer districts
3. **District Analytics**: Track which districts have most demand
4. **Pro Recommendations**: Suggest nearby districts to pros
5. **Customer Preferences**: Save customer's preferred district
6. **Smart Matching**: Match customers with pros in same/nearby districts
7. **District Badges**: Award badges for pros serving multiple districts
8. **Zone Promotions**: Run promotions for specific zones

## 🔗 Related Files

- `packages/shared/budapestDistricts.ts` - District constants
- `apps/backend/prisma/schema.prisma` - Database schema
- `apps/backend/src/pros/pros.service.ts` - Pro service with district filtering
- `apps/backend/src/pros/dto/index.ts` - DTOs with district fields
- `BUDAPEST_LAUNCH_STRATEGY.md` - Complete launch strategy

---

**Status**: Backend implementation complete ✅  
**Next**: Frontend components and translations 🚧  
**Timeline**: 2-3 hours for complete implementation
