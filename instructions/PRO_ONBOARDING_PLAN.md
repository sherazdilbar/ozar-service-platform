# PRO Onboarding Feature - Implementation Plan

## Overview
Modern, beautiful onboarding flow for new professional users to set up their profile and start receiving bookings.

## Design Inspiration
Based on the provided welcome screen with:
- Clean, minimal design
- Teal/cyan accent color (#00BCD4)
- Light gradient background
- Card-based layout
- Modern icons
- Smooth animations

## Database Changes

### Schema Update (✅ DONE)
Added to `ProProfile` model:
```prisma
onboardingCompleted   Boolean   @default(false)
onboardingStep        String?   // Current step: 'welcome', 'business', 'categories', 'location', 'services', 'portfolio', 'complete'
onboardingStartedAt   DateTime?
onboardingCompletedAt DateTime?
```

### Migration Needed
```bash
cd apps/backend
npx prisma migrate dev --name add_onboarding_tracking
```

## Onboarding Flow Steps

### 1. Welcome Screen (Initial Design Provided)
**Design:**
- Centered layout with gradient background
- Ozar logo/icon at top
- "Welcome to Ozar" heading
- Subtitle: "Let's set up your professional profile and get you connected with customers in just a few minutes!"
- 3 feature cards:
  - 🏢 Business Info - "Tell us about your services"
  - 📍 Service Area - "Where you operate"
  - 📸 Portfolio - "Showcase your work"
- "Let's Get Started" button (teal)
- "Takes about 5-7 minutes to complete" text

**Features:**
- Animated entrance
- Hover effects on cards
- Smooth button transitions

### 2. Business Information
**Fields:**
- Profile photo upload (with preview)
- Business name *
- Professional bio * (textarea, min 50 chars)
- Years of experience (0, 1, 3, 5, 10, 15, 20, 25+)
- Phone number *
- Availability status (Available Now, Available Soon, Busy, Offline)

**Design:**
- Progress bar at top
- Step indicator
- Form with modern inputs
- Character counter for bio
- Experience selector with cards
- Next/Back buttons

### 3. Service Categories
**Content:**
- "What services do you offer?"
- Grid of all 70+ categories organized by groups
- Multi-select with checkboxes
- Selected categories highlighted with teal border
- Minimum 1 category required

**Design:**
- Category cards with icons
- Hover effects
- Selected state with checkmark
- Group headers
- Search/filter option

### 4. Location & Service Area
**Fields:**
- City * (autocomplete with Mapbox)
- Area/District (autocomplete)
- Service radius (5-50 km slider)
- Auto-detect location button
- Map preview

**Design:**
- Interactive map
- Radius circle visualization
- Location cards
- Smooth animations

### 5. Add Your First Service
**Fields:**
- Service name *
- Description *
- Category (dropdown from selected categories)
- Pricing model (Hourly/Fixed/Inspection)
- Price * (in HUF)
- Duration (minutes)

**Design:**
- Form with validation
- Price input with currency
- Duration selector
- Preview card
- "Add More Later" skip option

### 6. Portfolio (Optional)
**Content:**
- "Showcase your best work"
- Multi-image upload
- Drag & drop
- Image preview grid
- Title and description for each
- "Skip for Now" option

**Design:**
- Upload zone with drag & drop
- Image grid with delete option
- Smooth upload animations
- Progress indicators

### 7. Complete!
**Content:**
- Success animation (confetti/checkmark)
- "You're all set!" message
- Profile completion percentage
- Quick stats preview
- "Go to Dashboard" button
- "Complete Your Profile" link (for optional items)

**Design:**
- Celebration animation
- Completion badge
- Stats cards
- CTA buttons

## Technical Implementation

### Frontend (`apps/web/src/app/pro/onboarding/page.tsx`)
```typescript
- Multi-step wizard component
- State management for form data
- Progress tracking
- API integration
- Form validation
- Image upload handling
- Mapbox integration
- Smooth transitions between steps
- Mobile responsive
```

### Backend Endpoints Needed

#### 1. Check Onboarding Status
```
GET /api/v1/pros/me/onboarding-status
Response: { completed: boolean, currentStep: string, startedAt: Date }
```

#### 2. Update Onboarding Step
```
PUT /api/v1/pros/me/onboarding-step
Body: { step: string }
Response: { success: boolean }
```

#### 3. Complete Onboarding
```
POST /api/v1/pros/me/complete-onboarding
Response: { success: boolean, profile: ProProfile }
```

#### 4. Existing Endpoints to Use
- `POST /api/v1/pros` - Create profile
- `PUT /api/v1/pros/me/profile` - Update profile
- `POST /api/v1/services` - Create service
- `POST /api/v1/pros/:id/portfolio` - Add portfolio

### Routing Logic

#### After Signup (PRO role)
```typescript
// In signup success handler
if (user.role === 'PRO') {
  router.push('/pro/onboarding');
}
```

#### Dashboard Protection
```typescript
// In /pro/dashboard page
useEffect(() => {
  const checkOnboarding = async () => {
    const status = await prosApi.getOnboardingStatus();
    if (!status.completed) {
      router.push('/pro/onboarding');
    }
  };
  checkOnboarding();
}, []);
```

#### Onboarding Page Logic
```typescript
// In /pro/onboarding page
useEffect(() => {
  const checkStatus = async () => {
    const status = await prosApi.getOnboardingStatus();
    if (status.completed) {
      router.push('/pro/dashboard');
    } else if (status.currentStep) {
      setCurrentStep(status.currentStep);
    }
  };
  checkStatus();
}, []);
```

## Design System

### Colors
- **Primary**: Teal/Cyan (#00BCD4)
- **Background**: Light gradient (from-gray-50 via-white to-cyan-50)
- **Cards**: White with subtle shadow
- **Text**: Gray-900 (dark), Gray-600 (secondary)
- **Success**: Green-500
- **Borders**: Gray-200

### Typography
- **Headings**: font-bold, text-2xl to text-4xl
- **Body**: font-normal, text-base
- **Labels**: font-semibold, text-sm
- **Hints**: font-normal, text-xs, text-gray-500

### Spacing
- **Container**: max-w-4xl mx-auto
- **Padding**: p-8 to p-12
- **Gaps**: gap-6 to gap-8
- **Margins**: mb-6 to mb-8

### Components
- **Buttons**: rounded-xl, px-6 py-3, shadow-lg, hover:scale-105
- **Inputs**: rounded-xl, border-2, focus:ring-2
- **Cards**: rounded-2xl, shadow-sm, hover:shadow-md
- **Progress Bar**: h-2, rounded-full, gradient

### Animations
- **Transitions**: transition-all duration-300
- **Hover**: hover:scale-105, hover:shadow-lg
- **Entrance**: animate-fade-in, animate-slide-up
- **Success**: animate-bounce, confetti effect

## User Experience

### Progress Saving
- Auto-save after each step
- "Save & Continue Later" option
- Resume from last step on return

### Validation
- Real-time validation
- Clear error messages
- Required field indicators
- Helpful hints and examples

### Mobile Responsive
- Stack layout on mobile
- Touch-friendly buttons
- Optimized image upload
- Simplified navigation

### Accessibility
- Keyboard navigation
- Screen reader support
- Focus indicators
- ARIA labels
- High contrast mode

## Success Metrics

### Completion Rate
- Track % of users who complete onboarding
- Identify drop-off points
- A/B test improvements

### Time to Complete
- Average time per step
- Total onboarding time
- Optimize slow steps

### Profile Quality
- % with complete profiles
- % with portfolio
- % with multiple services

## Next Steps

1. ✅ Update database schema
2. ⏳ Run migration
3. ⏳ Create backend endpoints
4. ⏳ Build frontend onboarding flow
5. ⏳ Add routing logic
6. ⏳ Test complete flow
7. ⏳ Add analytics tracking

## Files to Create/Modify

### Backend
- `apps/backend/prisma/schema.prisma` (✅ DONE)
- `apps/backend/src/pros/pros.controller.ts` (add onboarding endpoints)
- `apps/backend/src/pros/pros.service.ts` (add onboarding logic)
- `apps/backend/src/pros/dto/index.ts` (add onboarding DTOs)

### Frontend
- `apps/web/src/app/pro/onboarding/page.tsx` (main onboarding component)
- `apps/web/src/app/auth/signup/page.tsx` (add redirect logic)
- `apps/web/src/app/pro/dashboard/page.tsx` (add onboarding check)
- `packages/shared/apiClient.ts` (add onboarding API methods)

### Localization
- `apps/web/src/locales/en.json` (add onboarding translations)
- `apps/web/src/locales/hu.json` (add Hungarian translations)

## Notes
- Keep design modern and clean
- Use smooth animations
- Make it feel quick and easy
- Celebrate completion
- Encourage profile completion
- Mobile-first approach
- Save progress automatically
