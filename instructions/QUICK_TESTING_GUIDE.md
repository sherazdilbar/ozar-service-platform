# 🚀 Quick Testing Guide - Ozar Platform

## ✅ SETUP COMPLETE

All servers are running:
- **Backend API:** http://localhost:4000/api/v1
- **Web App:** http://localhost:3000
- **Mobile App:** Metro Bundler running (scan QR code with Expo Go app)

---

## 🔑 TEST ACCOUNTS

Use these accounts for testing (from seed data):

### Admin Account
- **Email:** admin@ozar.com
- **Password:** Admin123!
- **Role:** ADMIN
- **Use for:** Admin panel testing, user management, disputes

### Professional Accounts (Examples)
The seed file creates professionals for each category. Examples:
- **Email:** electrician0@ozar.com
- **Email:** plumber0@ozar.com
- **Email:** home_cleaning0@ozar.com
- **Password:** (Check seed file - likely Admin123! or similar)

### Customer Accounts
You'll need to create customer accounts through the signup flow.

**Recommended Test Customer:**
- **Email:** customer.test@gmail.com
- **Password:** Test123!
- **Name:** Test Customer
- **Role:** CUSTOMER

---

## 🎯 CRITICAL TESTS TO RUN NOW

### Test 1: Mobile App - New Filter Feature (5 min)
**Priority:** HIGH - Just implemented!

1. Open mobile app
2. Search for a service or select a category
3. Click the "🔧 Filters" button
4. Test each filter:
   - Set price range (e.g., 5000-15000 HUF)
   - Select minimum rating (e.g., 4+)
   - Toggle "Available Now"
   - Toggle "Verified Only"
5. Click "Apply Filters"
6. Verify results are filtered correctly
7. Check that filter badge (•) appears on button
8. Click "Clear All" and verify filters reset

**Expected Result:** Filters work smoothly, results update correctly

---

### Test 2: Professional Profile - New Features (5 min)
**Priority:** HIGH - Just implemented!

1. Open mobile app
2. Search for a professional
3. Click on a professional card
4. Test new features:
   - **Tabs:** Switch between Services/Portfolio/Reviews
   - **Share:** Click share button (📤)
   - **Favorite:** Click heart button (🤍/❤️)
   - **Portfolio:** View portfolio gallery (if available)
   - **Reviews:** View reviews list

**Expected Result:** All tabs work, share/favorite buttons respond

---

### Test 3: Booking Accept/Decline (Pro) (5 min)
**Priority:** HIGH - Just implemented!

1. Login as professional (use electrician0@ozar.com)
2. Go to Bookings tab
3. Find a booking with "REQUESTED" status
4. Test actions:
   - Click "✓ Accept" button
   - Verify loading state shows
   - Verify status changes to "ACCEPTED"
   - Verify customer receives notification

**Expected Result:** Accept/decline works, status updates immediately

---

### Test 4: Price Breakdown (5 min)
**Priority:** MEDIUM

1. Create a new booking as customer
2. View booking details
3. Check price breakdown shows:
   - Service price
   - Platform fee
   - Total
   - Currency (HUF)

**Expected Result:** Price breakdown displays correctly

---

### Test 5: Authentication Flow (10 min)
**Priority:** HIGH - Core functionality

#### Web App:
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create customer account
4. Verify email validation
5. Login with new account
6. Logout
7. Verify redirects to login page (not welcome)

#### Mobile App:
1. Open mobile app
2. Complete onboarding (3 slides)
3. Click "Get Started"
4. Sign up as customer
5. Test 3-step signup flow
6. Login with new account
7. Logout
8. Verify redirects to login page

**Expected Result:** Signup and login work on both platforms

---

### Test 6: Search & Discovery (10 min)
**Priority:** HIGH - Core functionality

1. **Homepage:**
   - Verify shows only 2 professionals
   - Click "See All" button
   - Verify shows all professionals

2. **Search:**
   - Search for "plumbing"
   - Verify results appear
   - Check search history saves
   - Clear search
   - Verify returns to homepage

3. **Categories:**
   - Click a category (e.g., Electrical)
   - Verify filtered results
   - Click same category again
   - Verify deselects and shows all

4. **Sorting:**
   - Sort by "Available Now"
   - Sort by "Top Rated"
   - Sort by "Price: Low to Hi"
   - Verify results reorder correctly

**Expected Result:** Search, filters, and sorting work smoothly

---

### Test 7: Booking Flow (15 min)
**Priority:** HIGH - Core functionality

1. **Create Booking (Customer):**
   - Search for a professional
   - Click on professional
   - Select a service
   - Click "Book Now"
   - Fill in booking details:
     - Date/time or ASAP
     - Location (Budapest address)
     - Description
   - Review price
   - Submit booking

2. **Accept Booking (Professional):**
   - Login as pro
   - Go to Bookings
   - Find new booking
   - Click "Accept"

3. **Chat:**
   - Open chat from booking
   - Send message
   - Verify real-time delivery
   - Check typing indicator

4. **Complete Booking:**
   - Mark as "In Progress"
   - Mark as "Completed"
   - Request review

**Expected Result:** Full booking flow works end-to-end

---

### Test 8: Real-time Features (10 min)
**Priority:** HIGH - Core functionality

1. **Chat:**
   - Open chat on web and mobile simultaneously
   - Send message from web
   - Verify appears on mobile instantly
   - Test typing indicator
   - Test message timestamps

2. **Notifications:**
   - Create a booking
   - Verify notification appears
   - Check notification count updates
   - Click notification
   - Verify navigates to correct page

**Expected Result:** Real-time updates work across platforms

---

## 🐛 COMMON ISSUES TO CHECK

### Mobile App
- [ ] Back button clears search (not router.back())
- [ ] Logout redirects to login (not welcome screen)
- [ ] Notification bell shows unread count
- [ ] Filter modal opens and closes smoothly
- [ ] Portfolio gallery swipes work
- [ ] Reviews can be submitted

### Web App
- [ ] Responsive design works on mobile
- [ ] All pages load without errors
- [ ] Forms validate properly
- [ ] Images load correctly
- [ ] Language switcher works (EN/HU)

### Backend
- [ ] API responses are fast (< 500ms)
- [ ] Error messages are helpful
- [ ] Authentication works
- [ ] File uploads work
- [ ] Database queries efficient

---

## 📊 TESTING CHECKLIST

Use this quick checklist while testing:

**For Each Feature:**
- [ ] Works as expected
- [ ] Error handling works
- [ ] Loading states show
- [ ] Success messages display
- [ ] No console errors

**For Each Page:**
- [ ] Loads without errors
- [ ] UI looks good
- [ ] Navigation works
- [ ] Data displays correctly
- [ ] Actions work

---

## 🚨 BUG REPORTING

If you find a bug, document it with:

1. **Title:** Brief description
2. **Severity:** Critical / High / Medium / Low
3. **Steps to Reproduce:** Numbered list
4. **Expected:** What should happen
5. **Actual:** What actually happens
6. **Screenshots:** If applicable
7. **Environment:** Browser/device, OS

**Example:**
```
Title: Filter modal doesn't close on mobile
Severity: Medium
Steps:
1. Open mobile app
2. Search for service
3. Open filter modal
4. Click X button
Expected: Modal closes
Actual: Modal stays open
Environment: iOS 17, iPhone 14
```

---

## ✅ QUICK WIN TESTS (30 minutes total)

If you only have 30 minutes, test these in order:

1. **Mobile Filter Feature** (5 min) - NEW!
2. **Professional Profile Tabs** (5 min) - NEW!
3. **Authentication Flow** (10 min)
4. **Search & Discovery** (10 min)

This covers the most critical new features and core functionality.

---

## 🎉 SUCCESS CRITERIA

The app is ready for beta launch when:

- [ ] All critical user journeys work
- [ ] No critical bugs
- [ ] Performance is good (< 3s load time)
- [ ] Real-time features work
- [ ] Mobile and web apps work
- [ ] Authentication is secure
- [ ] Data persists correctly

---

## 📞 NEXT STEPS AFTER TESTING

1. **Document all bugs found**
2. **Prioritize bugs** (Critical → High → Medium → Low)
3. **Fix critical bugs first**
4. **Re-test fixed bugs**
5. **Prepare for beta launch**

---

**Happy Testing! 🚀**

Remember: The goal is to find bugs now so users don't find them later!
