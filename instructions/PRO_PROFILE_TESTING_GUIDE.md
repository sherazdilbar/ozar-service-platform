# PRO Profile - Quick Testing Guide

## Access the New Profile Page

1. **Start the backend:**
   ```bash
   cd apps/backend
   npm run start:dev
   ```

2. **Start the web app:**
   ```bash
   cd apps/web
   npm run dev
   ```

3. **Login as a PRO user:**
   - Go to http://localhost:3000/auth/login
   - Use PRO credentials from your database

4. **Navigate to profile:**
   - Click "Edit Profile" from PRO Dashboard
   - Or go directly to: http://localhost:3000/pro/profile

## Quick Test Scenarios

### Scenario 1: New PRO Profile Setup (0% → 100%)
**Goal:** Complete profile from scratch

1. **Check initial state:**
   - Should show 0% or low completion percentage
   - Action items should list missing requirements

2. **Add profile photo:**
   - Click camera icon on profile picture
   - Upload and crop a photo
   - ✓ Completion should increase

3. **Fill Basic Info:**
   - Enter business name: "John's Plumbing Services"
   - Write bio (50+ characters): "Professional plumber with 10 years of experience..."
   - Enter phone: "+36 20 123 4567"
   - Select years: 10 years
   - Set availability: Available Now
   - Click Save
   - ✓ Completion should increase

4. **Select Categories:**
   - Go to Categories tab
   - Click on "Plumber" category
   - Click on "Electrician" category
   - Click on "Handyman" category
   - ✓ Should see 3 selected in highlighted section
   - Click Save
   - ✓ Completion should increase

5. **Set Location:**
   - Go to Location tab
   - Click "Auto-Detect" OR type city manually
   - Type city: "Budapest"
   - Select from dropdown
   - Type area: "District V"
   - Select from dropdown
   - ✓ Should see green confirmation badge
   - Adjust service radius: 25 km
   - Click Save
   - ✓ Completion should increase

6. **Add Portfolio:**
   - Go to Portfolio tab
   - Enter title: "Kitchen Renovation"
   - Select category: "Kitchen/Bathroom Remodeling"
   - Enter description: "Complete kitchen renovation with modern appliances"
   - Upload 3 images
   - ✓ Should see images in grid
   - Repeat 2 more times for different projects
   - ✓ Should see "Complete" badge when 3+ items
   - ✓ Completion should reach 100%

### Scenario 2: Edit Existing Profile
**Goal:** Update profile information

1. **Update availability:**
   - Go to Basic Info tab
   - Change status to "Busy"
   - Click Save
   - ✓ Should see success toast

2. **Add more categories:**
   - Go to Categories tab
   - Add 2 more categories
   - Click Save
   - ✓ Selected section should update

3. **Change service radius:**
   - Go to Location tab
   - Drag slider to 50 km
   - Click Save
   - ✓ Should save successfully

4. **Delete portfolio item:**
   - Go to Portfolio tab
   - Hover over an image
   - Click Delete button
   - Confirm deletion
   - ✓ Item should disappear
   - ✓ Count should update

### Scenario 3: Profile Completion Tracking
**Goal:** Verify dynamic completion calculation

1. **Start with incomplete profile:**
   - Note current completion percentage

2. **Remove profile photo:**
   - Delete avatar
   - ✓ Completion should decrease
   - ✓ "Add profile photo" should appear in action items

3. **Clear bio:**
   - Go to Basic Info
   - Delete bio text
   - Click Save
   - ✓ Completion should decrease

4. **Re-add items:**
   - Add photo back
   - Add bio back
   - ✓ Completion should increase back

### Scenario 4: Location Search
**Goal:** Test Mapbox integration

1. **Test city autocomplete:**
   - Go to Location tab
   - Type "Bud" in city field
   - ✓ Should see dropdown with Budapest options
   - Select "Budapest, Hungary"
   - ✓ City field should populate
   - ✓ Area field should enable

2. **Test area autocomplete:**
   - Type "Dist" in area field
   - ✓ Should see dropdown with district options
   - Select a district
   - ✓ Green confirmation should appear

3. **Test auto-detect:**
   - Click "Auto-Detect" button
   - Allow location access
   - ✓ Should populate city and area
   - ✓ Should show confirmation

### Scenario 5: Navigation & UI
**Goal:** Test user interface elements

1. **Test tab switching:**
   - Click each tab in sidebar
   - ✓ Content should change
   - ✓ Active state should highlight
   - ✓ Completion indicators should show

2. **Test top bar buttons:**
   - Click "Back to Dashboard"
   - ✓ Should navigate to dashboard
   - Return to profile
   - Click "Preview Profile"
   - ✓ Should open public profile view
   - Return to edit mode
   - Click "Save Changes"
   - ✓ Should save and show toast

3. **Test responsive design:**
   - Resize browser window
   - ✓ Layout should adapt
   - ✓ Sidebar should stack on mobile
   - ✓ Grids should adjust columns

4. **Test dark mode:**
   - Toggle dark mode
   - ✓ All colors should adapt
   - ✓ Text should remain readable
   - ✓ Borders should be visible

## Expected Results

### Profile Completion Calculation
- **0%:** Nothing filled
- **14%:** Profile photo only (1/7)
- **29%:** Photo + business name (2/7)
- **43%:** Photo + name + bio (3/7)
- **57%:** Photo + name + bio + categories (4/7)
- **71%:** Photo + name + bio + categories + location (5/7)
- **86%:** Photo + name + bio + categories + location + experience (6/7)
- **100%:** All 7 criteria met

### Visual Indicators
- ✅ Green checkmark = Section complete
- ⚠️ Orange alert = Section incomplete
- 🟢 Available Now = Green dot
- 🟡 Available Soon = Yellow dot
- 🔴 Busy = Red dot
- ⚫ Offline = Gray dot

### Save Behavior
- Success toast: "Profile updated successfully!"
- Error toast: "Failed to update profile"
- Loading state on Save button
- Form data persists after save

## Common Issues & Solutions

### Issue: Mapbox not working
**Solution:** Check environment variable
```bash
# In .env.local
NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
```

### Issue: Images not displaying
**Solution:** Check API URL
```bash
# In .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### Issue: Profile not loading
**Solution:** 
1. Check if user is logged in
2. Check if user role is 'PRO'
3. Check backend is running
4. Check browser console for errors

### Issue: Save not working
**Solution:**
1. Check network tab for API errors
2. Verify all required fields are filled
3. Check backend logs
4. Verify JWT token is valid

### Issue: Completion percentage wrong
**Solution:**
1. Refresh the page
2. Check if all data is loaded
3. Verify calculation logic matches criteria
4. Check portfolio count is correct

## Performance Checks

### Load Time
- Initial page load: < 2 seconds
- Tab switching: Instant
- Save operation: < 1 second
- Image upload: < 3 seconds per image

### API Calls
- Profile load: 1 call on mount
- Portfolio load: 1 call on mount
- City search: Debounced (300ms)
- Area search: Debounced (300ms)
- Save: 1 call per save action

### Memory Usage
- No memory leaks on tab switching
- Images properly garbage collected
- Search results cleared appropriately

## Browser Testing

### Desktop
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Safari 17+
- ✅ Edge 120+

### Mobile
- ✅ iOS Safari
- ✅ Chrome Mobile
- ✅ Samsung Internet

## Accessibility Testing

### Keyboard Navigation
- Tab through all inputs
- Enter to submit forms
- Escape to close dropdowns
- Arrow keys in selects

### Screen Reader
- All images have alt text
- Form labels are associated
- Buttons have descriptive text
- Status messages announced

## Security Testing

### Input Validation
- XSS prevention in text inputs
- File type validation on uploads
- File size limits enforced
- SQL injection prevention

### Authentication
- Requires PRO role
- JWT token validation
- Redirects if not authenticated
- Secure API calls

## Final Checklist

Before marking as complete:
- [ ] All tabs functional
- [ ] Profile completion accurate
- [ ] Location search working
- [ ] Portfolio upload/delete working
- [ ] Save functionality working
- [ ] Responsive on all devices
- [ ] Dark mode working
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Performance acceptable
- [ ] Accessibility compliant

---

**Happy Testing! 🚀**
