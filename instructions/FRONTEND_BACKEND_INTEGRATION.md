# Frontend-Backend Integration Guide

## Overview
Your Ozar app now has a real backend API connected to PostgreSQL. Here's how everything works together.

## Architecture

```
Frontend (Next.js)  →  API Client  →  Backend (NestJS)  →  Database (PostgreSQL)
```

## What's Running

1. **Backend API**: `http://localhost:4000/api/v1`
   - NestJS server with REST endpoints
   - JWT authentication
   - Connected to PostgreSQL

2. **Prisma Studio**: `http://localhost:5555`
   - Visual database browser
   - View/edit all data

3. **Frontend**: `http://localhost:3000` (when you start it)
   - Next.js web app
   - Now connects to real backend

## User Flow

### 1. Sign Up (New User)

**Customer Sign Up:**
```
1. Visit http://localhost:3000/auth/signup
2. Select "Customer" role
3. Fill in: name, email, phone, password
4. Click "Sign Up"
5. → Backend creates user in database
6. → Returns JWT tokens
7. → Redirected to home page (logged in)
```

**Professional Sign Up:**
```
1. Visit http://localhost:3000/auth/signup
2. Select "Professional" role
3. Fill in: name, email, phone, password
4. Click "Sign Up"
5. → Backend creates user with PRO role
6. → Redirected to /pro/onboarding
7. → Complete pro profile (business name, categories, location, services)
```

### 2. Log In (Existing User)

```
1. Visit http://localhost:3000/auth/login
2. Enter email + password
3. Click "Log In"
4. → Backend validates credentials
5. → Returns JWT tokens + user data
6. → Redirected based on role:
   - Customer → home page
   - Pro → /pro/dashboard
   - Admin → /admin
```

### 3. Browse Professionals (Customer)

```
1. Home page loads
2. Select city/area
3. Filter by category (electrician, plumber, etc.)
4. → Frontend calls: GET /api/v1/pros?category=ELECTRICIAN&city=Karachi
5. → Backend queries database with filters
6. → Returns list of pros
7. → Display pro cards with ratings, prices, distance
```

### 4. Create Booking (Customer)

```
1. Click on a pro card
2. View pro profile + services
3. Select a service
4. Choose date/time or "ASAP"
5. Add description + photos
6. Confirm location
7. Click "Request Booking"
8. → Frontend calls: POST /api/v1/bookings
9. → Backend:
   - Checks availability (no overlaps)
   - Creates booking with status REQUESTED
   - Locks time slot
   - Creates audit log entry
10. → Returns booking details
11. → Redirected to booking confirmation
```

### 5. Accept/Decline Booking (Pro)

```
1. Pro logs in → dashboard
2. See "Pending Requests" section
3. Click on a booking request
4. View customer details + job info
5. Click "Accept" or "Decline"
6. → Frontend calls: POST /api/v1/bookings/:id/accept
7. → Backend:
   - Validates state transition (REQUESTED → ACCEPTED)
   - Updates booking status
   - Creates audit log entry
8. → Booking moves to "Scheduled"
```

## API Endpoints Available

### Auth
- `POST /auth/register` - Create new user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh access token

### Pros
- `GET /pros` - List professionals (with filters)
- `GET /pros/:id` - Get pro profile
- `POST /pros` - Create pro profile
- `PUT /pros/:id` - Update pro profile
- `GET /pros/:id/reviews` - Get pro reviews

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings` - List user's bookings
- `GET /bookings/:id` - Get booking details
- `PUT /bookings/:id/status` - Update booking status
- `POST /bookings/:id/accept` - Pro accepts booking
- `POST /bookings/:id/decline` - Pro declines booking
- `GET /bookings/available-slots/:proId` - Get available time slots

### Services
- `GET /services` - List services
- `POST /services` - Create service (pro only)

### Categories
- `GET /categories` - List all service categories

## Database Tables

View in Prisma Studio (`http://localhost:5555`):

- **users** - All users (customers, pros, admins)
- **pro_profiles** - Professional profiles
- **services** - Services offered by pros
- **bookings** - All bookings
- **booking_events** - Audit log of status changes
- **reviews** - Customer reviews
- **refresh_tokens** - JWT refresh tokens

## Testing the Integration

### 1. Create a Test Pro Account

```bash
# Option 1: Use Prisma Studio
1. Open http://localhost:5555
2. Go to "users" table
3. Click "Add record"
4. Fill in:
   - email: pro@test.com
   - password: (hash with bcrypt)
   - firstName: John
   - lastName: Smith
   - phone: +92 300 1234567
   - role: PRO
5. Save

# Option 2: Use signup page
1. Go to http://localhost:3000/auth/signup
2. Select "Professional"
3. Fill form and submit
```

### 2. Create a Pro Profile

```bash
# After signing up as PRO, complete onboarding:
1. Business name: "John's Electrical Services"
2. Categories: Electrician
3. Location: Karachi, Saddar
4. Services: Add at least one service
5. Submit
```

### 3. Create a Test Customer

```bash
1. Go to http://localhost:3000/auth/signup
2. Select "Customer"
3. Fill form and submit
```

### 4. Test Booking Flow

```bash
1. Log in as customer
2. Browse pros
3. Click on a pro
4. Select service
5. Create booking
6. Log out
7. Log in as pro
8. See booking request
9. Accept it
10. Check Prisma Studio → bookings table
11. Check booking_events table for audit log
```

## Environment Variables

Make sure these are set in `apps/backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ozar?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"
```

## Next Steps

### Milestone 2B - Connect More Features
- [ ] Update pro discovery to use real API
- [ ] Connect booking list page to real API
- [ ] Connect pro dashboard to real API
- [ ] Add real-time updates (WebSocket)

### Milestone 3 - Payments
- [ ] Integrate Stripe or local payment gateway
- [ ] Payment authorization on booking
- [ ] Payment capture on completion
- [ ] Refunds on cancellation

### Milestone 4 - Chat & Notifications
- [ ] WebSocket chat implementation
- [ ] Push notifications (FCM)
- [ ] Email notifications

### Milestone 5 - Production Ready
- [ ] Deploy backend (Railway, Render, AWS)
- [ ] Deploy frontend (Vercel)
- [ ] Set up production database
- [ ] Configure domain + SSL
- [ ] Add monitoring (Sentry)

## Troubleshooting

### Backend won't start
```bash
cd apps/backend
npm install
npx prisma generate
npm run start:dev
```

### Database connection error
```bash
# Make sure PostgreSQL is running
# Check DATABASE_URL in .env
# Try: npx prisma migrate reset
```

### Frontend can't connect to backend
```bash
# Check backend is running on port 4000
# Check CORS settings in backend
# Check API_BASE_URL in apiClient.ts
```

### JWT token errors
```bash
# Clear localStorage in browser
# Log out and log in again
# Check JWT_SECRET matches in backend
```

## Current Status

✅ Backend API running with all endpoints
✅ Database created and migrated
✅ State machine for bookings implemented
✅ Availability service with slot locking
✅ Audit logging (booking_events)
✅ Auth pages (signup/login) created
✅ API client created
✅ Auth context for managing user state

🔄 Next: Connect existing pages to real API
