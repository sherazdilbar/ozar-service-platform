# PRO Location System - Quick Reference Card

## 🎯 What It Does
Allows PRO users to set their location and service coverage area during onboarding.

---

## 📍 Location in Flow
```
Phone → LOCATION (NEW!) → Categories → Complete
```

---

## 🎨 UI Components

| Component | Description | Required |
|-----------|-------------|----------|
| Auto-Detect Button | Blue gradient button with MapPin icon | No |
| City Input | Text field for city name | ✅ Yes |
| Area Input | Text field for area/district | ✅ Yes |
| Radius Slider | Range 5-100 km, step 5 | No (default 20) |
| Quick Buttons | 5, 10, 20, 50, 100 km presets | No |
| Confirmation Card | Teal card showing location summary | Auto |

---

## 🔄 User Actions

### Auto-Detect
1. Click "Auto-Detect My Location"
2. Allow browser location access
3. Wait for detection
4. ✓ City & Area filled automatically

### Manual Entry
1. Type city name (e.g., "Budapest")
2. Type area name (e.g., "District V")
3. ✓ Both fields filled

### Set Radius
1. Drag slider OR click quick button
2. See value update in real-time
3. ✓ Radius selected

### Continue
1. Verify both city and area are filled
2. Click "Continue" button
3. ✓ Data saved to backend
4. ✓ Navigate to categories step

---

## 💾 Data Saved

```typescript
{
  location: {
    city: "Budapest",
    area: "District V",
    lat: 47.4979,
    lng: 19.0402
  },
  serviceArea: {
    city: "Budapest",
    radiusKm: 20
  }
}
```

---

## ✅ Validation

- ✅ City must not be empty
- ✅ Area must not be empty
- ✅ Continue button disabled until both filled
- ✅ Radius defaults to 20 km if not changed

---

## 🔧 Technical Details

**Frontend File:** `apps/web/src/app/pro/onboarding/page.tsx`
**Backend DTO:** `apps/backend/src/pros/dto/index.ts`
**Backend Service:** `apps/backend/src/pros/pros.service.ts`
**API Endpoint:** `PUT /pros/me/profile`

**External APIs:**
- Browser Geolocation API (for auto-detect)
- Mapbox Geocoding API (for reverse geocoding)

**Environment Variable:**
```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Auto-detect not working | Check Mapbox token, enable location permission |
| Continue button disabled | Fill both city AND area fields |
| Location not saved | Check backend is running, verify API call |
| Mapbox errors | Verify token is valid and has geocoding permissions |

---

## 📊 Testing Checklist

- [ ] Auto-detect button works
- [ ] Manual entry accepts input
- [ ] Radius slider works
- [ ] Quick buttons highlight
- [ ] Validation prevents empty submissions
- [ ] Data saves to backend
- [ ] Location persists after refresh
- [ ] Can complete full onboarding
- [ ] Redirects to dashboard

---

## 📚 Documentation

- **Full Docs:** `PRO_LOCATION_SYSTEM_COMPLETE.md`
- **Testing Guide:** `LOCATION_TESTING_GUIDE.md`
- **Visual Summary:** `LOCATION_FEATURE_SUMMARY.md`
- **Context Transfer:** `CONTEXT_TRANSFER_COMPLETE.md`

---

## 🚀 Quick Test

```bash
# 1. Start servers
cd apps/backend && npm run start:dev
cd apps/web && npm run dev

# 2. Test flow
# - Go to http://localhost:3000/auth/signup
# - Sign up as PRO
# - Complete steps until location
# - Test auto-detect or manual entry
# - Set radius
# - Click Continue
# - Verify data saved

# 3. Check database
# SELECT locationCity, locationArea, locationLat, locationLng, 
#        serviceAreaCity, serviceAreaRadius 
# FROM "ProProfile" 
# WHERE userId = 'your-user-id';
```

---

## 🎉 Status

✅ **COMPLETE** - Ready for testing and production use

---

**Need Help?** See `LOCATION_TESTING_GUIDE.md` for detailed instructions.
