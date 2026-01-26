# PRO Profile Edit & Requests Page - Fixed and Updated

## Issues Fixed

### 1. Edit Profile Button Error
**Problem:** The "Edit Profile" button in PRO profile was causing errors when clicked.

**Root Cause:**
- Profile edit page was trying to load profile data that might not exist for new PRO users
- Import errors with ImagePicker and MultiImagePicker components (using default imports instead of named imports)
- Wrong prop names for ImagePicker component

**Solution:**
- Updated `loadProfile()` to handle 404 errors gracefully for new PRO users
- Fixed imports to use named exports: `import { ImagePicker }` instead of `import ImagePicker`
- Updated ImagePicker props: `onImageSelected` instead of `onImageChange`, `currentImage` instead of `image`, `circular={true}` instead of `mode="circular"`
- Added better error handling with user-friendly messages

### 2. Requests Page Layout Update
**Problem:** The requests page layout didn't match the Figma design.

**Solution:** Completely redesigned the PRO requests view to match Figma specifications.

## New PRO Requests Layout (Matching Figma)

### Header
- Large title: "Booking Requests" (28px, bold)
- Subtitle: "X pending requests" (14px, gray)
- Clean white background

### Request Cards
Each card now displays:

**Top Row:**
- Blue timestamp: "Requested X min/hours/days ago"
- Chat icon (💬) on the right for quick messaging

**Customer Section:**
- Large purple avatar (56x56px) with customer initials
- Customer name (16px, bold)
- Star rating badge (⭐ 4.8)
- Service name below (14px)

**Description:**
- Gray text showing service details
- 3-line limit with ellipsis

**Details Section:**
- 📅 Date/time and duration
- 📍 Location address with distance
- 💰 Estimated price in HUF

**Action Buttons:**
- Decline button: Light red background (#FEE2E2), red text with ✕ icon
- Accept button: Green background (#10B981), white text with ✓ icon
- Both buttons show loading spinner when processing

### Design Specifications
- Card background: White
- Card radius: 16px
- Card shadow: Subtle (0, 2, 0.05, 8)
- Card spacing: 16px between cards
- Padding: 16px inside cards
- Primary color: #4F46E5 (Indigo)
- Avatar color: #A78BFA (Purple)
- Accept color: #10B981 (Green)
- Decline color: #DC2626 (Red)

### Empty State
- 📭 Empty mailbox icon (64px)
- "No Pending Requests" title (20px, bold)
- "New booking requests will appear here" subtitle (14px, gray)

## PRO Profile Edit Page Features

### Editable Fields:
1. **Profile Picture** - Circular image picker
2. **Business Name** - Text input (required, max 100 chars)
3. **Bio** - Multi-line text area (required, max 1000 chars with counter)
4. **Phone Number** - Display only (contact support to change)
5. **Years of Experience** - Numeric input (required)
6. **Service Categories** - Multi-select chips (up to 5 categories)
7. **Location:**
   - City (default: Budapest)
   - Area/District (required)
8. **Portfolio Images** - Multi-image picker (up to 10 images)

### Validation:
- Business name required
- Bio required
- At least one category required
- Years of experience must be valid number
- Area/district required

### UI Features:
- Back button to return to profile
- Character counter for bio (X/1000)
- Category chips with selection state
- Save button at bottom with loading state
- Success alert on save
- Error handling for API failures

## Files Modified

1. **apps/mobile/app/(tabs)/bookings.tsx**
   - Split into two views: PRO requests view and Customer bookings view
   - PRO view shows only REQUESTED status bookings
   - New card layout matching Figma design
   - Added `getTimeAgo()` function for relative timestamps
   - Improved empty states
   - Better loading states

2. **apps/mobile/app/pro/profile-edit.tsx**
   - Fixed import statements (named exports)
   - Fixed ImagePicker props
   - Improved error handling for new PRO users
   - Better user feedback messages

3. **apps/mobile/components/ProProfile.tsx**
   - Already working correctly (no changes needed)

## Testing

### Test Edit Profile:
1. Login as PRO user (electrician@ozar.com / test123)
2. Go to Profile tab
3. Tap "Edit Profile"
4. Should load without errors (even for new PROs)
5. Fill in all required fields
6. Upload profile picture and portfolio images
7. Select categories
8. Tap "Save Changes"
9. Should show success message and return to profile

### Test Requests Page:
1. Login as PRO user
2. Go to Requests tab (bell icon)
3. Should see clean layout matching Figma
4. Each request card shows:
   - Timestamp in blue
   - Customer avatar and name
   - Rating badge
   - Service details
   - Date, location, price
   - Accept/Decline buttons
5. Tap Accept or Decline
6. Should show loading spinner
7. Should show success message
8. List should refresh

## API Endpoints Used

- `GET /pros/me/profile` - Load PRO profile
- `PUT /pros/me/profile` - Update PRO profile
- `GET /bookings` - Get all bookings
- `POST /bookings/:id/accept` - Accept booking request
- `POST /bookings/:id/decline` - Decline booking request

## Status
✅ **COMPLETE** - Both issues fixed and tested
- Edit profile button works for all PRO users (new and existing)
- Requests page matches Figma design exactly
- All error handling in place
- Loading states working
- API integration complete
