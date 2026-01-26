# 🧪 Testing & Bug Fixes Guide - Ozar Platform

## 📋 TESTING CHECKLIST

### Phase 1: Setup & Preparation

#### 1.1 Environment Check
```bash
# Verify all services are running
cd apps/backend
npm run start:dev

cd apps/web
npm run dev

cd apps/mobile
npm start
```

#### 1.2 Database Check
```bash
# Check database connection
cd apps/backend
npx prisma studio

# Verify seed data exists
# Should see: Users, Professionals, Services, Bookings
```

#### 1.3 Test Accounts Setup
Create these test accounts for comprehensive testing:

**Customer Account:**
- Email: customer@test.com
- Password: Test123!
- Role: CUSTOMER

**Professional Account:**
- Email: pro@test.com
- Password: Test123!
- Role: PRO

**Admin Account:**
- Email: admin@test.com
- Password: Test123!
- Role: ADMIN

---

## 🎯 CRITICAL USER JOURNEYS TO TEST

### Journey 1: Customer Booking Flow (HIGH PRIORITY)

#### Step 1: Registration & Login
- [ ] Open web app → Sign up as customer
- [ ] Verify email validation works
- [ ] Check password strength requirements
- [ ] Test login with correct credentials
- [ ] Test login with wrong credentials
- [ ] Test "Forgot Password" flow

**Expected Result:** User successfully registered and logged in

**Common Issues to Check:**
- Email format validation
- Password requirements clear
- Error messages helpful
- Redirect after login works

---

#### Step 2: Search for Professional
- [ ] Search by service category (e.g., "Plumbing")
- [ ] Search by keyword (e.g., "fix sink")
- [ ] Filter by price range
- [ ] Filter by rating
- [ ] Filter by availability
- [ ] Sort results (rating, price, availability)

**Expected Result:** Relevant professionals displayed

**Common Issues to Check:**
- Empty search results handled gracefully
- Filters work correctly
- Sorting updates results
- Loading states show properly

---

#### Step 3: View Professional Profile
- [ ] Click on a professional
- [ ] View services offered
- [ ] View portfolio (if available)
- [ ] View reviews and ratings
- [ ] Check contact information
- [ ] Test "Share" button
- [ ] Test "Favorite" button

**Expected Result:** All information displays correctly

**Common Issues to Check:**
- Images load properly
- Reviews display correctly
- Portfolio gallery works
- Share functionality works

---

#### Step 4: Create Booking
- [ ] Select a service
- [ ] Choose date and time (or ASAP)
- [ ] Enter location details
- [ ] Add description
- [ ] Review price breakdown
- [ ] Submit booking

**Expected Result:** Booking created successfully

**Common Issues to Check:**
- Date picker works
- Location autocomplete works
- Price calculation correct
- Validation messages clear
- Success confirmation shows

---

#### Step 5: Chat with Professional
- [ ] Open chat from booking
- [ ] Send text message
- [ ] Send emoji
- [ ] See typing indicator
- [ ] Receive response
- [ ] Check message timestamps

**Expected Result:** Real-time chat works smoothly

**Common Issues to Check:**
- Messages send instantly
- Typing indicator shows
- Timestamps correct
- Scroll to bottom on new message
- Unread count updates

---

#### Step 6: Track Booking Status
- [ ] View booking in "My Bookings"
- [ ] Check status updates
- [ ] Receive notifications
- [ ] View booking details
- [ ] Contact professional

**Expected Result:** Booking status clear and up-to-date

**Common Issues to Check:**
- Status badges correct color
- Notifications arrive
- Details accurate
- Actions available based on status

---

### Journey 2: Professional Workflow (HIGH PRIORITY)

#### Step 1: Professional Registration
- [ ] Sign up as professional
- [ ] Complete profile setup
- [ ] Add business information
- [ ] Select service categories
- [ ] Set location and service area
- [ ] Add years of experience

**Expected Result:** Professional profile created

**Common Issues to Check:**
- All required fields validated
- Location detection works
- Category selection clear
- Profile preview accurate

---

#### Step 2: Add Services
- [ ] Navigate to "My Services"
- [ ] Add new service
- [ ] Set pricing (fixed/hourly)
- [ ] Set duration
- [ ] Add description
- [ ] Save service

**Expected Result:** Service added successfully

**Common Issues to Check:**
- Form validation works
- Price input accepts numbers only
- Duration in correct format
- Service appears in list

---

#### Step 3: Manage Portfolio
- [ ] Upload portfolio images
- [ ] Add titles and descriptions
- [ ] Reorder images
- [ ] Delete images
- [ ] View portfolio on profile

**Expected Result:** Portfolio updated

**Common Issues to Check:**
- Image upload works
- File size limits enforced
- Images display correctly
- Delete confirmation works

---

#### Step 4: Receive & Accept Booking
- [ ] Receive booking notification
- [ ] View booking request
- [ ] Check customer details
- [ ] Review service requested
- [ ] Accept or decline booking
- [ ] Send message to customer

**Expected Result:** Booking accepted/declined

**Common Issues to Check:**
- Notification arrives promptly
- All details visible
- Accept/decline buttons work
- Status updates immediately
- Customer notified

---

#### Step 5: Complete Job
- [ ] Mark booking as "In Progress"
- [ ] Update customer via chat
- [ ] Mark booking as "Completed"
- [ ] Request review
- [ ] View earnings

**Expected Result:** Job completed, payment processed

**Common Issues to Check:**
- Status transitions work
- Earnings calculated correctly
- Review request sent
- Dashboard updates

---

### Journey 3: Admin Functions (MEDIUM PRIORITY)

#### Admin Dashboard
- [ ] View all users
- [ ] View all bookings
- [ ] View revenue statistics
- [ ] Manage disputes
- [ ] Verify professionals
- [ ] Ban/unban users

**Expected Result:** Admin has full control

**Common Issues to Check:**
- All data loads
- Actions work correctly
- Permissions enforced
- Audit logs created

---

## 🐛 COMMON BUGS TO CHECK

### Authentication Issues
- [ ] Token expiration handled
- [ ] Refresh token works
- [ ] Logout clears session
- [ ] Protected routes redirect
- [ ] Role-based access works

### API Issues
- [ ] Error responses formatted correctly
- [ ] Loading states show
- [ ] Timeout handling
- [ ] Rate limiting works
- [ ] CORS configured properly

### UI/UX Issues
- [ ] Mobile responsive
- [ ] Dark mode works (if implemented)
- [ ] Forms validate properly
- [ ] Error messages helpful
- [ ] Success messages show
- [ ] Loading spinners appear
- [ ] Empty states handled

### Real-time Issues
- [ ] Socket connection stable
- [ ] Reconnection works
- [ ] Messages don't duplicate
- [ ] Typing indicator accurate
- [ ] Notifications arrive

### Data Issues
- [ ] Dates display correctly
- [ ] Timezones handled
- [ ] Currency formatting
- [ ] Number formatting
- [ ] Text truncation works

---

## 🔍 AUTOMATED TESTING

### Backend Tests

Create test file: `apps/backend/test/e2e/booking.e2e-spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Booking Flow (e2e)', () => {
  let app: INestApplication;
  let customerToken: string;
  let proToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login as customer
    const customerLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'customer@test.com', password: 'Test123!' });
    customerToken = customerLogin.body.accessToken;

    // Login as pro
    const proLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'pro@test.com', password: 'Test123!' });
    proToken = proLogin.body.accessToken;
  });

  it('Customer can create booking', async () => {
    const response = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        proId: 'pro-id-here',
        serviceId: 'service-id-here',
        scheduledFor: new Date(),
        location: {
          address: 'Test Address',
          city: 'Budapest',
          lat: 47.4979,
          lng: 19.0402,
        },
        description: 'Test booking',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toBe('REQUESTED');
  });

  it('Pro can accept booking', async () => {
    // Create booking first
    const booking = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        proId: 'pro-id-here',
        serviceId: 'service-id-here',
        scheduledFor: new Date(),
        location: {
          address: 'Test Address',
          city: 'Budapest',
          lat: 47.4979,
          lng: 19.0402,
        },
      });

    // Accept booking
    const response = await request(app.getHttpServer())
      .post(`/bookings/${booking.body.id}/respond`)
      .set('Authorization', `Bearer ${proToken}`)
      .send({ action: 'accept' })
      .expect(200);

    expect(response.body.status).toBe('ACCEPTED');
  });

  afterAll(async () => {
    await app.close();
  });
});
```

Run tests:
```bash
cd apps/backend
npm run test:e2e
```

---

### Frontend Tests

Create test file: `apps/web/src/app/page.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('renders search bar', () => {
    render(<HomePage />);
    const searchInput = screen.getByPlaceholderText(/search for services/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('displays categories', () => {
    render(<HomePage />);
    expect(screen.getByText(/plumbing/i)).toBeInTheDocument();
    expect(screen.getByText(/electrical/i)).toBeInTheDocument();
  });

  it('filters professionals by category', async () => {
    render(<HomePage />);
    const plumbingButton = screen.getByText(/plumbing/i);
    
    fireEvent.click(plumbingButton);
    
    await waitFor(() => {
      expect(screen.getByText(/plumbing/i)).toHaveClass('selected');
    });
  });
});
```

Run tests:
```bash
cd apps/web
npm run test
```

---

## 🔧 MANUAL TESTING CHECKLIST

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (iPad)
- [ ] Mobile (iPhone 12/13/14)
- [ ] Mobile (Android - various sizes)

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Images optimized
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] No layout shifts

### Security Testing
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting works
- [ ] Input sanitization
- [ ] File upload restrictions
- [ ] Authentication secure
- [ ] Authorization enforced

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] ARIA labels present

---

## 📊 BUG TRACKING

### Bug Report Template

```markdown
## Bug Title
Brief description of the issue

## Severity
- [ ] Critical (app crashes, data loss)
- [ ] High (major feature broken)
- [ ] Medium (feature partially works)
- [ ] Low (cosmetic issue)

## Steps to Reproduce
1. Go to...
2. Click on...
3. Enter...
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
[Attach screenshots]

## Environment
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop
- User Role: Customer

## Additional Context
Any other relevant information
```

---

## 🎯 PRIORITY BUG FIXES

### Critical (Fix Immediately)
1. **Authentication failures** - Users can't login
2. **Payment processing errors** - Money not processed
3. **Data loss** - Bookings disappear
4. **Security vulnerabilities** - User data exposed
5. **App crashes** - Complete failure

### High (Fix This Week)
1. **Booking creation fails** - Core feature broken
2. **Chat not working** - Communication blocked
3. **Notifications not sending** - Users miss updates
4. **Search returns no results** - Discovery broken
5. **Profile updates don't save** - Data integrity

### Medium (Fix This Month)
1. **UI glitches** - Visual issues
2. **Slow performance** - User experience degraded
3. **Minor feature bugs** - Non-critical features
4. **Validation issues** - Forms accept invalid data
5. **Responsive design issues** - Mobile layout problems

### Low (Fix When Possible)
1. **Cosmetic issues** - Colors, spacing
2. **Typos** - Text corrections
3. **Minor UX improvements** - Nice-to-haves
4. **Edge case bugs** - Rare scenarios
5. **Documentation updates** - Help text

---

## 🚀 TESTING TOOLS

### Recommended Tools

**Backend Testing:**
- Jest (unit tests)
- Supertest (API tests)
- Postman (manual API testing)

**Frontend Testing:**
- Jest + React Testing Library
- Cypress (E2E tests)
- Playwright (E2E tests)

**Mobile Testing:**
- Jest (unit tests)
- Detox (E2E tests)
- TestFlight (iOS beta)
- Google Play Console (Android beta)

**Performance:**
- Lighthouse (web performance)
- React DevTools Profiler
- Chrome DevTools

**Security:**
- OWASP ZAP
- Snyk (dependency scanning)
- npm audit

---

## 📝 TESTING SCHEDULE

### Week 1: Core Functionality
- Day 1-2: Authentication & Authorization
- Day 3-4: Booking Flow (Customer)
- Day 5: Booking Flow (Professional)

### Week 2: Features & Integration
- Day 1-2: Chat & Notifications
- Day 3: Search & Filters
- Day 4: Reviews & Ratings
- Day 5: Admin Functions

### Week 3: Polish & Edge Cases
- Day 1-2: Cross-browser testing
- Day 3: Mobile testing
- Day 4: Performance optimization
- Day 5: Security audit

---

## ✅ DEFINITION OF DONE

A feature is "done" when:
- [ ] All acceptance criteria met
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] No critical bugs
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Stakeholder approved

---

## 🎉 READY FOR PRODUCTION CHECKLIST

- [ ] All critical bugs fixed
- [ ] All high-priority bugs fixed
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Accessibility standards met
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness confirmed
- [ ] Load testing completed
- [ ] Backup and recovery tested
- [ ] Monitoring and alerts configured
- [ ] Error tracking setup (Sentry)
- [ ] Analytics configured
- [ ] Documentation complete
- [ ] Support team trained
- [ ] Rollback plan ready

---

## 📞 NEED HELP?

If you find bugs or need assistance:
1. Document the bug using the template above
2. Check if it's a known issue
3. Try to reproduce consistently
4. Gather all relevant information
5. Create a detailed bug report

**Remember:** Good testing now = fewer problems later! 🚀
