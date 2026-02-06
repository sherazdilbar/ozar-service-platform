# Pro Onboarding Implementation - Detailed Plan

## Architecture & Component Placement Analysis

### 1. File Structure

```
apps/web/src/
├── app/
│   ├── pro/
│   │   ├── onboarding/
│   │   │   ├── page.tsx                    # Main onboarding wizard
│   │   │   └── layout.tsx                  # Clean layout (no sidebar)
│   │   ├── welcome/
│   │   │   └── page.tsx                    # Welcome screen after signup
│   │   ├── pending/
│   │   │   └── page.tsx                    # Pending approval page
│   │   └── dashboard/
│   │       └── page-listeo.tsx             # Enhanced with completion widget
│   └── auth/
│       └── signup/
│           └── page.tsx                    # Enhanced with pro flow
├── components/
│   ├── onboarding/
│   │   ├── OnboardingWizard.tsx           # Main wizard container
│   │   ├── ProgressBar.tsx                # Step progress indicator
│   │   ├── StepNavigation.tsx             # Back/Next buttons
│   │   ├── steps/
│   │   │   ├── Step1_BasicInfo.tsx
│   │   │   ├── Step2_Categories.tsx
│   │   │   ├── Step3_ServiceArea.tsx
│   │   │   ├── Step4_Services.tsx
│   │   │   ├── Step5_Availability.tsx
│   │   │   ├── Step6_Portfolio.tsx
│   │   │   ├── Step7_Verification.tsx
│   │   │   └── Step8_Review.tsx
│   │   └── FormField.tsx                  # Reusable form field with tooltip
│   ├── verification/
│   │   ├── VerificationBadge.tsx          # Badge display component
│   │   ├── DocumentUpload.tsx             # Document upload component
│   │   └── VerificationStatus.tsx         # Status tracker
│   ├── profile/
│   │   ├── ProfileCompletionWidget.tsx    # Circular progress widget
│   │   └── OnboardingChecklist.tsx        # Checklist component
│   └── shared/
│       ├── ImageUpload.tsx                # Reusable image upload
│       └── Tooltip.tsx                    # Helpful tooltips
└── hooks/
    ├── useOnboarding.ts                   # Onboarding state management
    ├── useAutoSave.ts                     # Auto-save functionality
    └── useProfileCompletion.ts            # Profile completion calculation
```

---

## Component Breakdown & Placement

### 1. Onboarding Wizard (`/pro/onboarding`)

**When to Show**:
- After pro signs up and verifies email
- When pro has `onboardingCompleted: false`
- Redirect from any pro page if onboarding incomplete

**Layout**:
- Full-screen, no sidebar
- Clean, focused design
- Progress bar at top
- Step content in center
- Navigation buttons at bottom

**Features**:
- 8 steps with validation
- Auto-save every 30 seconds
- Can save and continue later
- Mobile responsive
- Helpful tooltips on every field

---

### 2. Welcome Page (`/pro/welcome`)

**When to Show**:
- Immediately after email verification
- First time pro logs in
- Before onboarding wizard

**Purpose**:
- Get pro excited
- Explain benefits
- Set expectations
- Show estimated time (15 min)

**Content**:
- Hero section with welcome message
- 3-4 key benefits
- "How it works" steps
- Success stories (optional)
- "Let's Get Started" CTA → `/pro/onboarding`

**Layout**:
- Full-width hero
- Centered content
- Large, clear CTA
- Skip option (saves as draft)

---

### 3. Pending Approval Page (`/pro/pending`)

**When to Show**:
- After onboarding submission
- When `verificationStatus: PENDING` or `UNDER_REVIEW`
- Redirect from dashboard if not approved

**Purpose**:
- Show approval status
- Keep pro engaged
- Provide next steps
- Offer optional tasks

**Content**:
- Status tracker (visual timeline)
- Estimated approval time
- What happens next
- Optional tasks:
  - Add more portfolio items
  - Set up quick messages
  - Watch tutorials
  - Read tips
- Contact support option

**Layout**:
- Centered card design
- Status timeline
- Task cards below
- Progress indicators

---

### 4. Profile Completion Widget

**Where to Display**:
- Dashboard (top right or sidebar)
- Pro profile page (edit mode)
- Onboarding wizard (summary)

**Purpose**:
- Show completion percentage
- List incomplete items
- Provide quick links
- Motivate completion

**Design**:
- Circular progress indicator
- Percentage in center
- List of items below
- Green checkmarks for complete
- Orange dots for incomplete
- Click to complete

**Calculation**:
```typescript
Profile Photo: 10%
Bio: 10%
Services (min 3): 20%
Portfolio (min 3): 15%
Availability: 10%
Service Area: 10%
Verification: 25%
Total: 100%
```

---

### 5. Verification Badges

**Where to Display**:
- Pro profile page (public view)
- Search results (pro cards)
- Dashboard (header)
- Pro listing page

**Badge Types**:
1. **Identity Verified** ✓
   - Green checkmark
   - "Identity Verified"
   - Tooltip: "ID confirmed"

2. **Background Checked** ✓✓
   - Double checkmark
   - "Background Checked"
   - Tooltip: "Passed background check"

3. **Elite Pro** ⭐
   - Star badge
   - "Elite Pro"
   - Tooltip: "Top-rated professional"

**Design**:
- Small badge icon
- Hover tooltip with details
- Color-coded (green, blue, gold)
- Positioned near name/avatar

---

### 6. Document Upload Component

**Where to Use**:
- Onboarding wizard (Step 7)
- Pro profile page (verification section)
- Pending approval page (resubmit)

**Features**:
- Drag & drop
- File type validation (jpg, png, pdf)
- Size limit (5MB)
- Preview before upload
- Progress indicator
- Multiple files
- Delete uploaded files

**Design**:
- Dashed border upload area
- Upload icon
- "Drag & drop or click to upload"
- File list with previews
- Status indicators

---

### 7. Onboarding Checklist

**Where to Display**:
- Dashboard (first-time users)
- Profile page
- Pending approval page

**Items**:
- ✅ Profile complete
- ✅ Services added (min 3)
- ✅ Portfolio added (min 3)
- ✅ Verification submitted
- ⬜ First booking received
- ⬜ First review received
- ⬜ 10 portfolio items

**Design**:
- Card with list
- Checkmarks for complete
- Progress bar
- Celebrate milestones
- Confetti animation on completion

---

## User Flow Analysis

### Flow 1: New Pro Signup

```
1. Sign Up Page
   ↓ (Select "I'm a Professional")
2. Email Verification
   ↓ (Click verification link)
3. Welcome Page (/pro/welcome)
   ↓ (Click "Let's Get Started")
4. Onboarding Wizard (/pro/onboarding)
   ↓ (Complete 8 steps)
5. Pending Approval (/pro/pending)
   ↓ (Wait for admin approval)
6. Dashboard (/pro/dashboard)
   ↓ (Start receiving bookings)
```

### Flow 2: Incomplete Onboarding

```
1. Pro logs in
   ↓ (Check onboardingCompleted)
2. If false → Redirect to /pro/onboarding
   ↓ (Resume from saved step)
3. Complete remaining steps
   ↓
4. Submit for approval
```

### Flow 3: Pending Approval

```
1. Pro logs in
   ↓ (Check verificationStatus)
2. If PENDING → Redirect to /pro/pending
   ↓ (Show status)
3. Complete optional tasks
   ↓ (Wait for approval)
4. Email notification when approved
   ↓
5. Access full dashboard
```

### Flow 4: Profile Completion

```
1. Pro on dashboard
   ↓ (See completion widget: 75%)
2. Click "Complete Profile"
   ↓ (See incomplete items)
3. Click item to complete
   ↓ (Navigate to relevant page)
4. Complete item
   ↓ (Return to dashboard)
5. See updated percentage
```

---

## State Management

### Onboarding State

```typescript
interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  formData: {
    step1: BasicInfoData;
    step2: CategoriesData;
    step3: ServiceAreaData;
    step4: ServicesData;
    step5: AvailabilityData;
    step6: PortfolioData;
    step7: VerificationData;
  };
  isDraft: boolean;
  lastSaved: Date;
  isSubmitting: boolean;
}
```

### Profile Completion State

```typescript
interface ProfileCompletionState {
  percentage: number;
  items: {
    profilePhoto: boolean;
    bio: boolean;
    services: boolean;
    portfolio: boolean;
    availability: boolean;
    serviceArea: boolean;
    verification: boolean;
  };
  incompleteItems: string[];
}
```

---

## Auto-Save Implementation

```typescript
// useAutoSave.ts
export function useAutoSave(data: any, saveFunction: Function) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        await saveFunction(data);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [data]);

  return { lastSaved, isSaving };
}
```

---

## Validation Rules

### Step 1: Basic Info
- Profile photo: Optional but recommended
- Business name: Optional
- Bio: 150-500 characters (required)
- Years of experience: 0-50 (required)
- Languages: At least 1 (required)

### Step 2: Categories
- Select 1-3 categories (required)
- Description per category: 50-200 characters

### Step 3: Service Area
- Select at least 1 Budapest district (required)
- Service radius: 5-50km (required)
- Travel fee: Optional

### Step 4: Services
- Add at least 3 services (required)
- Each service:
  - Name: 5-100 characters (required)
  - Description: 50-500 characters (required)
  - Duration: 15-480 minutes (required)
  - Price: > 0 (required)

### Step 5: Availability
- Set at least 3 days (required)
- At least 4 hours per day (required)
- Response time: 15-120 minutes (required)

### Step 6: Portfolio
- At least 3 images (recommended, not required)
- Each image:
  - Title: 5-100 characters
  - Description: Optional
  - Max size: 5MB
  - Format: jpg, png

### Step 7: Verification
- ID upload: Required
- Selfie with ID: Required
- Business license: Optional
- Certifications: Optional

---

## Mobile Optimization

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile-Specific Features
1. **Simplified Navigation**
   - Bottom navigation bar
   - Swipe between steps
   - Larger touch targets

2. **Camera Integration**
   - Direct camera access for photos
   - Photo editing before upload
   - Compress images automatically

3. **Form Optimization**
   - One field per screen on mobile
   - Large input fields
   - Native date/time pickers
   - Autocomplete where possible

4. **Progress Saving**
   - More frequent auto-save (15 seconds)
   - Clear "Save & Exit" button
   - Resume notification

---

## Smart Defaults & Suggestions

### Pricing Suggestions
```typescript
// Based on category and location
const pricingSuggestions = {
  ELECTRICIAN: {
    min: 8000,
    avg: 12000,
    max: 20000,
    unit: 'HUF/hour'
  },
  PLUMBER: {
    min: 7000,
    avg: 10000,
    max: 15000,
    unit: 'HUF/hour'
  },
  // ... more categories
};
```

### Service Templates
```typescript
// Pre-filled service templates by category
const serviceTemplates = {
  ELECTRICIAN: [
    {
      name: 'Electrical Repair',
      description: 'Fix electrical issues, replace outlets, switches',
      duration: 60,
      pricingModel: 'HOURLY'
    },
    {
      name: 'Lighting Installation',
      description: 'Install new lights, chandeliers, fixtures',
      duration: 90,
      pricingModel: 'FIXED'
    }
  ]
};
```

### Availability Defaults
```typescript
const defaultAvailability = {
  monday: { start: '09:00', end: '18:00', enabled: true },
  tuesday: { start: '09:00', end: '18:00', enabled: true },
  wednesday: { start: '09:00', end: '18:00', enabled: true },
  thursday: { start: '09:00', end: '18:00', enabled: true },
  friday: { start: '09:00', end: '18:00', enabled: true },
  saturday: { start: '10:00', end: '16:00', enabled: false },
  sunday: { start: '10:00', end: '16:00', enabled: false }
};
```

---

## Tooltips & Help Text

### Tooltip Placement
- Next to field labels
- Hover or click to show
- Mobile: Tap to show
- Auto-hide after 5 seconds

### Example Tooltips
```typescript
const tooltips = {
  bio: "Tell customers about your experience and what makes you special. Be friendly and professional!",
  yearsExperience: "How many years have you been working in this field?",
  serviceRadius: "How far are you willing to travel for jobs?",
  pricing: "Set competitive prices. You can always adjust later.",
  portfolio: "Show your best work! Photos help customers trust you.",
  verification: "We verify all pros to keep customers safe. This usually takes 24-48 hours."
};
```

---

## Error Handling

### Validation Errors
- Show inline below field
- Red border on invalid field
- Clear error message
- Prevent next step until fixed

### Upload Errors
- File too large
- Invalid format
- Upload failed
- Network error

### Save Errors
- Auto-save failed
- Manual save failed
- Show retry option
- Don't lose data

---

## Success States

### Completion Celebrations
1. **Step Completed**
   - Green checkmark animation
   - "Great job!" message
   - Auto-advance to next step

2. **Onboarding Submitted**
   - Confetti animation
   - Success message
   - "What's next" information
   - Redirect to pending page

3. **Profile 100% Complete**
   - Badge unlock animation
   - Congratulations message
   - Share achievement option

---

## Implementation Priority

### Phase 1: Core Wizard (Week 1)
1. ✅ Onboarding wizard structure
2. ✅ Progress bar component
3. ✅ Step 1-4 (Basic info, Categories, Service Area, Services)
4. ✅ Form validation
5. ✅ Navigation (Back/Next)

### Phase 2: Advanced Features (Week 1-2)
1. ✅ Step 5-8 (Availability, Portfolio, Verification, Review)
2. ✅ Document upload component
3. ✅ Auto-save functionality
4. ✅ Welcome page
5. ✅ Pending approval page

### Phase 3: Polish & Optimization (Week 2)
1. ✅ Profile completion widget
2. ✅ Verification badges
3. ✅ Tooltips & help text
4. ✅ Mobile optimization
5. ✅ Smart defaults
6. ✅ Error handling
7. ✅ Success animations

---

Ready to start implementation? I'll begin with the core components!
