# Pro Onboarding - Build Summary

## What We're Building

A complete professional onboarding system with 8 steps, verification, and profile completion tracking.

## Files to Create (20+ files)

### Core Pages (4 files)
1. `apps/web/src/app/pro/welcome/page.tsx` - Welcome screen
2. `apps/web/src/app/pro/onboarding/page.tsx` - Main wizard
3. `apps/web/src/app/pro/onboarding/layout.tsx` - Clean layout
4. `apps/web/src/app/pro/pending/page.tsx` - Pending approval (UPDATE existing)

### Onboarding Components (12 files)
1. `apps/web/src/components/onboarding/ProgressBar.tsx`
2. `apps/web/src/components/onboarding/StepNavigation.tsx`
3. `apps/web/src/components/onboarding/FormField.tsx`
4. `apps/web/src/components/onboarding/steps/Step1_BasicInfo.tsx`
5. `apps/web/src/components/onboarding/steps/Step2_Categories.tsx`
6. `apps/web/src/components/onboarding/steps/Step3_ServiceArea.tsx`
7. `apps/web/src/components/onboarding/steps/Step4_Services.tsx`
8. `apps/web/src/components/onboarding/steps/Step5_Availability.tsx`
9. `apps/web/src/components/onboarding/steps/Step6_Portfolio.tsx`
10. `apps/web/src/components/onboarding/steps/Step7_Verification.tsx`
11. `apps/web/src/components/onboarding/steps/Step8_Review.tsx`
12. `apps/web/src/components/onboarding/Tooltip.tsx`

### Profile & Verification Components (5 files)
1. `apps/web/src/components/profile/ProfileCompletionWidget.tsx`
2. `apps/web/src/components/profile/OnboardingChecklist.tsx`
3. `apps/web/src/components/verification/VerificationBadge.tsx`
4. `apps/web/src/components/verification/DocumentUpload.tsx`
5. `apps/web/src/components/verification/VerificationStatus.tsx`

### Hooks (3 files)
1. `apps/web/src/hooks/useOnboarding.ts`
2. `apps/web/src/hooks/useAutoSave.ts`
3. `apps/web/src/hooks/useProfileCompletion.ts`

### Updates to Existing Files (3 files)
1. `apps/web/src/app/pro/dashboard/page-listeo.tsx` - Add completion widget
2. `apps/web/src/app/pros/[id]/page-listeo.tsx` - Add verification badges
3. `apps/web/src/app/search/page.tsx` - Add verification badges to cards

## Implementation Approach

Given the size, I'll create:
1. **Foundation files first** (hooks, shared components)
2. **Core wizard structure** (progress bar, navigation, layout)
3. **Individual steps** (8 step components)
4. **Profile completion** (widget, checklist)
5. **Verification system** (badges, upload, status)
6. **Integration** (update existing pages)

## Estimated Lines of Code
- ~3000-4000 lines total
- Each step: ~150-250 lines
- Shared components: ~100-150 lines each
- Hooks: ~50-100 lines each

## Time Estimate
- Foundation: 30 minutes
- Core wizard: 1 hour
- Steps 1-8: 2-3 hours
- Profile/Verification: 1 hour
- Integration: 30 minutes
- **Total: 5-6 hours of focused work**

## Next Steps

I'll start building in this order:
1. Hooks (foundation)
2. Shared components (ProgressBar, Navigation, FormField, Tooltip)
3. Welcome page
4. Onboarding wizard container
5. Steps 1-8
6. Profile completion widget
7. Verification components
8. Update existing pages

Ready to proceed?
