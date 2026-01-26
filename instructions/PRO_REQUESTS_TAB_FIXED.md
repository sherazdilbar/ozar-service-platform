# PRO Requests Tab - Fixed and Functional

## Issue
The "Requests" tab in the bottom navbar for PRO users was not functional. User wanted it to work like the web app - showing booking requests with status REQUESTED that can be accepted/rejected.

## Solution Implemented

### 1. Tab Navigation Setup
- Updated `apps/mobile/app/(tabs)/_layout.tsx` to use the `bookings` tab for PRO users
- Changed tab title to "Requests" for PRO users (keeping "Bookings" for customers)
- Hidden the separate `pro-requests` tab from navigation
- Used bell icon (🔔/🔕) to match Figma design

### 2. Bookings Tab Functionality
The `apps/mobile/app/(tabs)/bookings.tsx` file already had full PRO functionality:

**For PRO Users:**
- Shows all bookings (upcoming and past)
- Displays customer name instead of pro name
- Shows accept/decline buttons for bookings with status "REQUESTED"
- Accept button: Green background with ✓ icon
- Decline button: Red background with ✕ icon
- Loading state while responding to requests
- Automatic refresh after accepting/declining

**For Customer Users:**
- Shows all bookings (upcoming and past)
- Displays pro name/business name
- No accept/decline buttons (view only)

### 3. Code Improvements
Fixed issues in `bookings.tsx`:
- Removed unused `PriceBreakdown` import
- Fixed TypeScript error with dynamic import
- Updated `handleRespond` function to use proper API methods:
  - `bookingsApi.acceptBooking(bookingId)` for accepting
  - `bookingsApi.declineBooking(bookingId, reason)` for declining
- Removed custom fetch call in favor of apiClient methods

### 4. Features

**Request Cards Display:**
- Customer avatar with initials
- Customer name and service name
- Status badge (color-coded)
- Date/time (ASAP or scheduled)
- Location address
- Total price in HUF
- "View Details" button to see full booking

**Accept/Decline Actions:**
- Accept: Changes status to ACCEPTED, sends notification to customer
- Decline: Changes status to CANCELLED_BY_PRO with reason "Not available at this time"
- Shows loading spinner while processing
- Success/error alerts
- Auto-refreshes list after action

**Empty States:**
- "No upcoming bookings" - Shows when no active requests
- "New job requests will appear here" - Helpful message for PROs
- "No past bookings" - Shows in past tab when empty

### 5. Status Flow
```
REQUESTED → [PRO accepts] → ACCEPTED → SCHEDULED → IN_PROGRESS → COMPLETED
         → [PRO declines] → CANCELLED_BY_PRO
```

## Files Modified
- `apps/mobile/app/(tabs)/bookings.tsx` - Fixed API calls and removed errors
- `apps/mobile/app/(tabs)/_layout.tsx` - Already updated in previous task

## Testing
All services running:
- Backend: http://localhost:4000/api/v1
- Mobile: Expo on http://localhost:8081
- Web: http://localhost:3000
- Prisma Studio: http://localhost:5555

## How to Test
1. Login as PRO user (e.g., electrician@ozar.com / test123)
2. Navigate to "Requests" tab (bell icon)
3. Wait for a customer to create a booking request
4. See the request card with customer info
5. Tap "Accept" or "Decline" button
6. Verify success message and list refresh

## API Endpoints Used
- `GET /bookings` - Fetch all bookings for logged-in user
- `POST /bookings/:id/accept` - Accept a booking request
- `POST /bookings/:id/decline` - Decline a booking request with reason

## Design System
- PRO color: #4F46E5 (Indigo)
- Accept button: #10B981 (Green)
- Decline button: #EF4444 (Red)
- Status badges: Color-coded by status type

## Status
✅ **COMPLETE** - Requests tab is now fully functional for PRO users
