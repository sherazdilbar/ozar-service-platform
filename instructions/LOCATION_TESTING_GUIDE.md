# PRO Location System - Testing Guide

## Quick Start

### 1. Start the Servers
```bash
# Terminal 1 - Backend
cd apps/backend
npm run start:dev

# Terminal 2 - Web App
cd apps/web
npm run dev
```

### 2. Test the Location Feature

#### A. Create New PRO Account
1. Go to http://localhost:3000/auth/signup
2. Select "I'm a Professional" (PRO role)
3. Fill in signup details
4. Complete onboarding steps:
   - Welcome → Photo → Business Name → Bio → Experience → Phone
5. **Location Step** (NEW!)
   - You should see the location step with:
     - "Auto-Detect My Location" button
     - City and Area input fields
     - Radius slider (5-100 km)
     - Quick radius buttons (5, 10, 20, 50, 100)

#### B. Test Auto-Detect
1. Click "Auto-Detect My Location"
2. Allow browser location access when prompted
3. Wait for location to be detected
4. Verify:
   - ✅ City field is filled
   - ✅ Area field is filled
   - ✅ Green confirmation card appears
   - ✅ Shows "Service Area Set" message

#### C. Test Manual Entry
1. Type city name: "Budapest"
2. Type area name: "District V"
3. Verify:
   - ✅ Both fields accept input
   - ✅ Confirmation card appears when both filled
   - ✅ Continue button becomes enabled

#### D. Test Radius Selection
1. **Slider Test:**
   - Drag slider left/right
   - Verify value updates in real-time (shown above slider)
   
2. **Quick Buttons Test:**
   - Click 5 km button → Should highlight with teal color
   - Click 20 km button → Should highlight, previous unhighlights
   - Click 100 km button → Should highlight
   - Verify selected button has teal background

#### E. Test Validation
1. Leave city empty → Continue button should be disabled
2. Leave area empty → Continue button should be disabled
3. Fill both fields → Continue button should be enabled
4. Click Continue → Should save and go to categories step

#### F. Verify Backend Save
1. Open browser DevTools → Network tab
2. Click Continue on location step
3. Look for PUT request to `/pros/me/profile`
4. Check request payload should include:
```json
{
  "location": {
    "city": "Budapest",
    "area": "District V",
    "lat": 47.4979,
    "lng": 19.0402
  },
  "serviceArea": {
    "city": "Budapest",
    "radiusKm": 20
  }
}
```
5. Check response - should return updated profile with location data

#### G. Complete Onboarding
1. Continue to Categories step
2. Select at least one service category
3. Click "Complete Setup"
4. Should redirect to PRO Dashboard

### 3. Verify Data Persistence

#### Check Database
```bash
# Connect to your database
# Check the proProfile table for the new PRO

SELECT 
  businessName,
  locationCity,
  locationArea,
  locationLat,
  locationLng,
  serviceAreaCity,
  serviceAreaRadius
FROM "ProProfile"
WHERE userId = 'your-user-id';
```

Expected result:
- locationCity: "Budapest"
- locationArea: "District V"
- locationLat: 47.4979 (or your detected location)
- locationLng: 19.0402 (or your detected location)
- serviceAreaCity: "Budapest"
- serviceAreaRadius: 20 (or your selected radius)

## Common Issues & Solutions

### Issue 1: Auto-Detect Not Working
**Symptoms:** Button doesn't do anything or shows error

**Solutions:**
1. Check browser console for errors
2. Verify NEXT_PUBLIC_MAPBOX_TOKEN is set in `.env.local`
3. Ensure browser has location permission enabled
4. Try in different browser (Chrome/Firefox work best)

### Issue 2: Continue Button Stays Disabled
**Symptoms:** Can't proceed even after filling fields

**Solutions:**
1. Verify both city AND area are filled
2. Check browser console for validation errors
3. Try typing at least 2 characters in each field

### Issue 3: Location Not Saved
**Symptoms:** Location resets after page refresh

**Solutions:**
1. Check backend logs for errors
2. Verify backend is running
3. Check Network tab for failed API calls
4. Ensure database connection is working

### Issue 4: Mapbox API Errors
**Symptoms:** "Failed to detect location" or geocoding errors

**Solutions:**
1. Verify Mapbox token is valid
2. Check token has geocoding permissions
3. Ensure token is not expired
4. Try regenerating token at mapbox.com

## Environment Variables

Make sure these are set in `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token_here
```

## Expected User Flow

```
1. Sign up as PRO
   ↓
2. Welcome screen
   ↓
3. Upload photo (optional)
   ↓
4. Enter business name
   ↓
5. Write bio (min 50 chars)
   ↓
6. Select years of experience
   ↓
7. Enter phone number
   ↓
8. 🆕 SET LOCATION (NEW STEP!)
   - Auto-detect or manual entry
   - Set service radius
   ↓
9. Select service categories
   ↓
10. Complete! → Dashboard
```

## Success Criteria

✅ Auto-detect button works and fills location
✅ Manual entry accepts city and area
✅ Radius slider works smoothly
✅ Quick radius buttons highlight correctly
✅ Validation prevents empty submissions
✅ Data saves to backend successfully
✅ Location persists after page refresh
✅ Can complete full onboarding flow
✅ PRO dashboard shows after completion

## Next Steps After Testing

Once location system is working:

1. **Add to Profile Edit**
   - Allow PROs to update location anytime
   - Show current location on map

2. **Display on Public Profile**
   - Show "Serves: City + X km radius"
   - Add map showing coverage area

3. **Use in Search**
   - Filter PROs by distance from customer
   - Show "X km away" on PRO cards

4. **Smart Matching**
   - Match customers with nearby PROs
   - Send notifications to PROs in range

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs for API errors
3. Verify environment variables are set
4. Ensure Mapbox token is valid
5. Try in incognito/private mode
6. Clear browser cache and cookies

## Files to Check

- Frontend: `apps/web/src/app/pro/onboarding/page.tsx`
- Backend DTO: `apps/backend/src/pros/dto/index.ts`
- Backend Service: `apps/backend/src/pros/pros.service.ts`
- API Client: `packages/shared/apiClient.ts`
