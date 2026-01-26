# Ozar - Local Services Marketplace

A two-sided marketplace connecting customers with skilled local professionals (electricians, plumbers, locksmiths, AC technicians, etc.). Built with a frontend-first approach using mock data.

## 🏗️ Architecture

This is a **monorepo** containing:

- **apps/web** - Next.js web application
- **apps/mobile** - React Native (Expo) mobile application  
- **packages/shared** - Shared TypeScript types, mock data, and API layer

## 🛠️ Tech Stack

### Web
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

### Mobile
- React Native (Expo)
- Expo Router
- TypeScript

### Shared
- TypeScript types
- Mock data generators
- Mock API wrapper (simulates async backend calls)

## 📦 Installation

```bash
# Install dependencies for all packages
npm install

# Or install for specific apps
cd apps/web && npm install
cd apps/mobile && npm install
cd packages/shared && npm install
```

## 🚀 Running the Apps

### Web App
```bash
npm run dev:web
# or
cd apps/web && npm run dev
```

Visit http://localhost:3000

### Mobile App
```bash
npm run dev:mobile
# or
cd apps/mobile && npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## 📱 Features

### Customer Experience
- **Home/Discovery** - Browse professionals by category, location, availability
- **Pro Profile** - View detailed profiles with services, portfolio, reviews
- **Booking Flow** - Multi-step booking (service selection, scheduling, details, payment)
- **Bookings Management** - View upcoming and past bookings
- **Chat** - Message professionals about bookings
- **Map View** - Toggle between list and map view (UI placeholder)

### Pro Experience
- **Dashboard** - View pending requests, today's schedule, earnings
- **Onboarding** - Multi-step registration (categories, services, area, portfolio, verification)
- **Request Management** - Accept/decline booking requests
- **Availability** - Manage weekly availability schedule

### Admin
- **Verification** - Approve/reject pro applications
- **Disputes** - Handle booking disputes (UI only)

## 🎨 Design Philosophy

- **Trustworthy & Human** - People-first design
- **Premium but Simple** - Clean, calm interface
- **Light Background** - Rounded cards, soft shadows
- **Professional Portfolios** - Upwork-style depth
- **Local Discovery** - Uber/Wolt-style feed

## 📊 Data Models

### Core Entities
- **User** - Customer or Pro user
- **ProProfile** - Professional profile with services, portfolio, ratings
- **Service** - Individual service offering with pricing
- **Booking** - Service booking with full state machine
- **Review** - Customer reviews with ratings
- **Conversation** - Chat conversations
- **Message** - Individual chat messages

### Booking State Machine
```
DRAFT → REQUESTED → OFFERED → ACCEPTED → PAYMENT_AUTHORIZED → 
SCHEDULED → IN_PROGRESS → COMPLETED → CAPTURED

Alternative flows:
- CANCELLED_BY_CUSTOMER
- CANCELLED_BY_PRO
- NO_SHOW
- DISPUTED
- REFUNDED
```

## 🔌 Mock API

All data access goes through `packages/shared/api.ts`:

```typescript
// Examples
await getPros({ category: 'ELECTRICIAN', availableNow: true })
await getProById('pro_001')
await createBooking({ ... })
await getBookings('cust_001')
await sendMessage('conv_001', 'user_001', 'Hello')
```

The API simulates network delays and returns realistic mock data.

## 🗂️ Project Structure

```
ozar/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/              # Next.js pages
│   │   │   │   ├── page.tsx      # Home/Discovery
│   │   │   │   ├── pros/[id]/    # Pro profile
│   │   │   │   ├── booking/      # Booking flow
│   │   │   │   ├── bookings/     # Bookings list
│   │   │   │   ├── chat/         # Messaging
│   │   │   │   ├── pro/          # Pro dashboard & onboarding
│   │   │   │   └── admin/        # Admin panel
│   │   │   └── components/       # Shared components
│   │   └── package.json
│   └── mobile/
│       ├── app/
│       │   ├── (tabs)/           # Tab navigation
│       │   │   ├── index.tsx     # Home
│       │   │   ├── bookings.tsx  # Bookings
│       │   │   ├── chat.tsx      # Messages
│       │   │   └── profile.tsx   # Profile
│       │   └── _layout.tsx
│       └── package.json
└── packages/
    └── shared/
        ├── types.ts              # All TypeScript types
        ├── mockData.ts           # Mock data generators
        ├── api.ts                # Mock API functions
        ├── constants.ts          # App constants
        └── index.ts              # Exports
```

## 🎯 Key Pages

### Web
- `/` - Home/Discovery feed
- `/pros/[id]` - Professional profile
- `/booking/new?proId=xxx` - New booking flow
- `/bookings` - Bookings list
- `/bookings/[id]` - Booking details
- `/chat` - Conversations list
- `/chat/[id]` - Chat thread
- `/pro/dashboard` - Pro dashboard
- `/pro/onboarding` - Pro registration
- `/admin` - Admin panel

### Mobile
- Home tab - Discovery feed
- Bookings tab - Bookings list
- Chat tab - Messages
- Profile tab - User profile

## 🚧 Backend Integration (Future)

The app is structured for easy backend integration:

1. Replace mock API functions in `packages/shared/api.ts` with real HTTP calls
2. Add authentication/authorization
3. Implement real payment processing
4. Add real-time features (WebSocket for chat, live tracking)
5. Integrate actual map services (Google Maps, Mapbox)

## 📝 Notes

- All data is **mock data** - no real backend
- Images use placeholder services (pravatar.cc, unsplash.com)
- Payment flow is simulated
- Map view is UI placeholder only
- No authentication implemented (uses hardcoded user IDs)

## 🎨 Color Scheme

- **Primary**: `#00BCD4` (Teal) - Main brand color
- **Accent**: `#FF6B35` (Orange) - CTAs and highlights  
- **Background**: `#f5f5f5` (Light Gray)
- **Cards**: White with subtle shadows
- **Text**: Gray scale for hierarchy
- **Ratings**: Orange stars

## 🌍 Localization

- **Cities**: Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad
- **Currency**: PKR (Pakistani Rupee)
- **Areas**: Saddar, Clifton, DHA, Gulshan, North Nazimabad, Korangi, Malir, Landhi, Bahria Town
- **Logo**: اوزار (Urdu) + Ozar (English)

## 📄 License

Private - All rights reserved
