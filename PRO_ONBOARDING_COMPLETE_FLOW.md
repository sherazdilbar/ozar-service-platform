# Professional Onboarding & Setup - Complete Flow

## Overview
Complete end-to-end professional onboarding inspired by UrbanClap/Thumbtack, ensuring pros can easily sign up, set up their profile, and start receiving bookings.

---

## Current State Analysis

### ✅ What We Have
1. **Authentication**
   - Sign up with role selection (Customer/Pro)
   - Login/Logout functionality
   - Email verification system

2. **Pro Dashboard (Listeo Style)**
   - Dashboard with stats
   - My Services management
   - Profile editing
   - Portfolio management
   - Reviews display
   - Customers list
   - Analytics
   - Availability settings
   - Service area selection
   - Quick messages templates
   - Available Jobs (bookings)
   - Chat system

3. **Customer-Facing**
   - Pro listing page (Listeo style)
   - Search and filters
   - Booking flow
   - Reviews system

### ❌ What's Missing

1. **Guided Onboarding Flow**
   - Step-by-step setup wizard
   - Progress tracking
   - Profile completion percentage
   - Mandatory vs optional fields

2. **Profile Verification**
   - Document upload (ID, certifications)
   - Background check integration
   - Verification status tracking
   - Badge display

3. **Service Setup Wizard**
   - Guided service creation
   - Pricing recommendations
   - Category-specific questions

4. **Business Information**
   - Business license upload
   - Insurance information
   - Tax details

5. **Onboarding Checklist**
   - Visual progress indicator
   - Incomplete items reminder
   - Go-live requirements

---

## Proposed Complete Flow

### Phase 1: Sign Up & Basic Info (5 minutes)
**Goal**: Get pro registered and excited

**Steps**:
1. **Sign Up Page** (`/auth/signup`)
   - Email, password, name
   - Role selection: "I'm a Professional"
   - Phone number (required for pros)
   - Accept terms & conditions

2. **Email Verification**
   - Send verification email
   - Verify email before proceeding

3. **Welcome Screen** (`/pro/welcome`)
   - Welcome message
   - Brief overview of benefits
   - "Let's Get Started" CTA

### Phase 2: Profile Setup Wizard (10-15 minutes)
**Goal**: Complete essential profile information

**Multi-Step Wizard** (`/pro/onboarding`)

#### Step 1: Professional Details
- Profile photo upload
- Business name (optional)
- Bio/About me (150-500 characters)
- Years of experience
- Languages spoken

#### Step 2: Service Categories
- Select primary categories (1-3)
- Brief description per category
- Specializations within categories

#### Step 3: Service Area
- Budapest district selection (multiple)
- Service radius (5km, 10km, 20km, 50km)
- Willing to travel? (Yes/No)
- Travel fee (optional)

#### Step 4: Services & Pricing
- Add at least 3 services
- For each service:
  - Service name
  - Description
  - Duration
  - Pricing model (Fixed/Hourly/Inspection)
  - Price
  - Category

#### Step 5: Availability
- Set weekly schedule
- Available now toggle
- Response time commitment
- Booking lead time

#### Step 6: Portfolio (Optional but Recommended)
- Upload 3-10 work photos
- Add titles and descriptions
- Skip option available

#### Step 7: Verification Documents (Required for Approval)
- ID/Passport upload
- Business license (if applicable)
- Certifications (if applicable)
- Insurance proof (optional)

#### Step 8: Payment Setup
- Bank account details
- Tax information
- Payment preferences

#### Step 9: Review & Submit
- Review all information
- Edit any section
- Submit for approval
- Estimated approval time: 24-48 hours

### Phase 3: Pending Approval (`/pro/pending`)
**Goal**: Keep pro engaged while waiting

**Features**:
- Approval status tracker
- Estimated time remaining
- What happens next
- Tips for getting approved faster
- Complete optional sections:
  - Add more portfolio items
  - Set up quick message templates
  - Watch tutorial videos
  - Read success stories

### Phase 4: Approved & Active (`/pro/dashboard`)
**Goal**: Start receiving bookings

**First-Time Dashboard**:
- Congratulations message
- Profile completion percentage
- Onboarding checklist:
  - ✅ Profile complete
  - ✅ Services added
  - ✅ Verified
  - ⬜ First booking received
  - ⬜ First review received
  - ⬜ Portfolio complete (10 items)

**Dashboard Features**:
- Pending booking requests
- Today's schedule
- Quick stats
- Action items
- Tips for success

---

## Implementation Plan

### 1. Create Onboarding Wizard Component

**File**: `apps/web/src/app/pro/onboarding/page.tsx`

**Features**:
- Multi-step form with progress bar
- Save progress (draft mode)
- Back/Next navigation
- Field validation
- Image upload with preview
- Budapest district selector
- Service builder
- Availability calendar

**Design**:
- Clean, minimal Listeo style
- Progress indicator at top
- Large, clear CTAs
- Helpful tooltips
- Example images/text
- Mobile responsive

### 2. Create Welcome Page

**File**: `apps/web/src/app/pro/welcome/page.tsx`

**Content**:
- Hero section with benefits
- How it works (3-4 steps)
- Success stories
- "Start Setup" CTA
- Estimated time: 15 minutes

### 3. Create Pending Approval Page

**File**: `apps/web/src/app/pro/pending/page.tsx`

**Features**:
- Status tracker (Submitted → Under Review → Approved)
- Estimated time
- What to do while waiting
- Optional tasks checklist
- Contact support option

### 4. Enhance Dashboard

**File**: `apps/web/src/app/pro/dashboard/page-listeo.tsx`

**Add**:
- Profile completion widget
- Onboarding checklist
- First-time user tips
- Quick actions for incomplete items

### 5. Add Verification System

**Backend**:
- Document upload endpoints
- Verification status management
- Admin approval workflow

**Frontend**:
- Document upload component
- Verification status display
- Verification badge on profile

### 6. Profile Completion Tracker

**Component**: `ProfileCompletionWidget`

**Tracks**:
- Profile photo (10%)
- Bio (10%)
- Services (20%)
- Portfolio (15%)
- Availability (10%)
- Service area (10%)
- Verification (25%)

**Display**:
- Circular progress bar
- Percentage
- List of incomplete items
- Quick links to complete

---

## User Experience Enhancements

### 1. Smart Defaults
- Pre-fill common services based on category
- Suggest pricing based on market rates
- Default availability: Mon-Fri 9am-6pm

### 2. Helpful Guidance
- Tooltips on every field
- Example text for descriptions
- Character counters
- Image size/format requirements
- Pricing recommendations

### 3. Progress Saving
- Auto-save draft every 30 seconds
- "Save & Continue Later" option
- Resume from where you left off

### 4. Validation & Feedback
- Real-time field validation
- Clear error messages
- Success confirmations
- Helpful suggestions

### 5. Mobile Optimization
- Fully responsive wizard
- Touch-friendly inputs
- Camera integration for photos
- Simplified navigation

---

## Verification & Approval Process

### Documents Required
1. **Identity Verification** (Required)
   - Government-issued ID
   - Selfie with ID

2. **Professional Credentials** (Category-dependent)
   - Electrician: License number
   - Plumber: Certification
   - Beauty: Cosmetology license
   - etc.

3. **Business Information** (Optional)
   - Business registration
   - Tax ID
   - Insurance certificate

### Approval Workflow
1. Pro submits profile
2. Status: "Pending Review"
3. Admin reviews documents
4. Admin can:
   - Approve → Pro goes live
   - Request more info → Pro gets notification
   - Reject → Pro gets reason & can resubmit
5. Approved pros get verification badge

### Verification Badge Levels
- ✓ **Identity Verified**: ID confirmed
- ✓✓ **Background Checked**: Passed background check
- ✓✓✓ **Elite Pro**: High ratings + many jobs + verified

---

## Success Metrics

### Onboarding Completion Rate
- Target: 80% complete onboarding
- Track drop-off at each step
- Optimize problematic steps

### Time to First Booking
- Target: Within 7 days of approval
- Measure from approval to first booking
- Identify barriers

### Profile Quality Score
- Complete profile: 100%
- Incomplete: Show percentage
- Encourage completion with incentives

---

## Additional Features (Nice to Have)

### 1. Video Introduction
- 30-60 second video
- Introduce yourself
- Show your work
- Build trust

### 2. Certifications Showcase
- Upload certificates
- Display on profile
- Verify authenticity

### 3. Insurance Integration
- Partner with insurance providers
- Offer insurance options
- Display coverage on profile

### 4. Background Check
- Integrate with background check service
- Display badge on profile
- Required for certain categories

### 5. Training & Resources
- Video tutorials
- Best practices guide
- Success tips
- Community forum

### 6. Referral Program
- Refer other pros
- Earn bonuses
- Track referrals

---

## Technical Implementation

### Database Schema Updates

```prisma
model ProProfile {
  // ... existing fields
  
  // Onboarding
  onboardingCompleted    Boolean   @default(false)
  onboardingStep         Int       @default(0)
  profileCompleteness    Int       @default(0)
  
  // Verification
  verificationStatus     VerificationStatus @default(PENDING)
  verificationDocuments  VerificationDocument[]
  verifiedAt             DateTime?
  verificationNotes      String?
  
  // Business
  businessLicense        String?
  taxId                  String?
  insuranceProvider      String?
  insurancePolicyNumber  String?
  insuranceExpiryDate    DateTime?
}

enum VerificationStatus {
  PENDING
  UNDER_REVIEW
  APPROVED
  REJECTED
  REQUIRES_INFO
}

model VerificationDocument {
  id          String   @id @default(cuid())
  proId       String
  pro         ProProfile @relation(fields: [proId], references: [id])
  type        DocumentType
  fileUrl     String
  status      DocumentStatus @default(PENDING)
  uploadedAt  DateTime @default(now())
  reviewedAt  DateTime?
  reviewNotes String?
}

enum DocumentType {
  ID_FRONT
  ID_BACK
  SELFIE_WITH_ID
  BUSINESS_LICENSE
  CERTIFICATION
  INSURANCE
  TAX_DOCUMENT
}

enum DocumentStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### API Endpoints Needed

```typescript
// Onboarding
POST   /api/pros/onboarding/start
PUT    /api/pros/onboarding/step/:step
GET    /api/pros/onboarding/progress
POST   /api/pros/onboarding/submit

// Verification
POST   /api/pros/verification/upload
GET    /api/pros/verification/status
PUT    /api/pros/verification/resubmit

// Profile Completion
GET    /api/pros/profile/completeness
GET    /api/pros/profile/checklist
```

---

## Next Steps

### Priority 1 (Must Have)
1. ✅ Create onboarding wizard UI
2. ✅ Implement step-by-step flow
3. ✅ Add document upload
4. ✅ Create pending approval page
5. ✅ Add profile completion tracker

### Priority 2 (Should Have)
1. ⬜ Verification workflow (admin side)
2. ⬜ Email notifications for each step
3. ⬜ SMS notifications for approval
4. ⬜ Welcome email with tips
5. ⬜ First booking celebration

### Priority 3 (Nice to Have)
1. ⬜ Video introduction
2. ⬜ Background check integration
3. ⬜ Insurance options
4. ⬜ Training resources
5. ⬜ Referral program

---

## Inspiration from UrbanClap/Thumbtack

### UrbanClap Strengths
- Simple, guided onboarding
- Clear verification process
- Profile completion percentage
- Category-specific questions
- Mobile-first design

### Thumbtack Strengths
- Detailed service setup
- Pricing guidance
- Customer preferences
- Lead generation
- Pro education

### Our Approach
- Combine best of both
- Budapest-specific features
- Listeo design aesthetic
- Fast, efficient flow
- Clear value proposition

---

## Timeline Estimate

- **Onboarding Wizard**: 3-4 days
- **Verification System**: 2-3 days
- **Profile Completion**: 1-2 days
- **Testing & Polish**: 2-3 days

**Total**: ~2 weeks for complete implementation

---

## Success Criteria

✅ Pro can complete onboarding in < 20 minutes
✅ 80%+ onboarding completion rate
✅ Clear verification status at all times
✅ Profile completion visible and actionable
✅ Mobile-friendly throughout
✅ Helpful guidance at every step
✅ Professional, trustworthy appearance

---

Ready to implement? Let me know which part you'd like to start with!
