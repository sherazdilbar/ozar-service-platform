# Testing the Completion & Review Flow

## How to Test

### 1. Create a Booking (as Customer)
1. Login as a customer
2. Search for a pro
3. Click on a pro profile
4. Click "Book Now"
5. Fill in booking details
6. Submit booking → Status: `REQUESTED`

### 2. Accept Booking (as Pro)
1. Login as the pro
2. Go to Pro Dashboard (`/pro/dashboard`)
3. See the booking in "Pending Requests"
4. Click "Accept" → Status: `ACCEPTED` → `SCHEDULED`

### 3. Start Job (as Pro)
1. Go to booking detail page (`/bookings/[id]`)
2. Click "▶️ Start Job" button
3. Confirm action
4. Status changes to `IN_PROGRESS`
5. Customer receives notification

### 4. Complete Job (as Pro)
1. On booking detail page
2. Click "✓ Mark as Completed" button
3. Confirm completion
4. Status changes to `COMPLETED`
5. Pro's `jobsCompleted` count increments
6. Customer receives notification to review

### 5. Leave Review (as Customer)
1. Go to booking detail page
2. Click "⭐ Leave a Review" button
3. Select star rating (1-5)
4. Write review comment
5. Click "Submit Review"
6. Review is saved
7. Pro's rating and review count update
8. Pro receives notification

### 6. Verify Updates
1. Check pro profile page
   - `jobsCompleted` should be incremented
   - New review should appear in Reviews tab
   - Average rating should be updated
   - Review count should be updated

2. Check pro dashboard
   - Stats should reflect new completion
   - Earnings should include completed job

## Expected Behavior

### Status Transitions
```
REQUESTED → ACCEPTED → SCHEDULED → IN_PROGRESS → COMPLETED
```

### Pro Stats Updates
- ✅ `jobsCompleted` +1 when job marked complete
- ✅ `rating` recalculated when review submitted
- ✅ `reviewCount` +1 when review submitted

### Notifications Sent
- ✅ Customer notified when job starts
- ✅ Customer notified when job completes
- ✅ Pro notified when review received

### UI Elements

#### For Pro (on booking detail):
- `SCHEDULED` → Show "▶️ Start Job" button
- `IN_PROGRESS` → Show "✓ Mark as Completed" button
- `COMPLETED` → No action buttons

#### For Customer (on booking detail):
- `COMPLETED` + no review → Show "⭐ Leave a Review" button
- `COMPLETED` + has review → Show submitted review
- Before `COMPLETED` → Show "Cancel Booking" button

## API Endpoints to Test

### Start Job
```bash
POST /api/v1/bookings/:id/start
Authorization: Bearer <pro_token>
```

### Complete Job
```bash
POST /api/v1/bookings/:id/complete
Authorization: Bearer <pro_token>
```

### Submit Review
```bash
POST /api/v1/bookings/:id/review
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great service!"
}
```

## Edge Cases to Test

### 1. Duplicate Review Prevention
- Try to submit review twice on same booking
- Expected: Error "Booking already has a review"

### 2. Wrong User Role
- Customer tries to start/complete job
- Expected: Error or button not shown

### 3. Invalid Status Transition
- Try to complete job without starting it
- Expected: Error from state machine

### 4. Rating Validation
- Try rating < 1 or > 5
- Expected: Error "Rating must be between 1 and 5"

### 5. Empty Review Comment
- Try to submit review without comment
- Expected: Validation error

## Database Verification

After completing a job and submitting review, check:

```sql
-- Check booking status
SELECT id, status, completedAt FROM bookings WHERE id = '<booking_id>';

-- Check pro stats
SELECT jobsCompleted, rating, reviewCount FROM pro_profiles WHERE id = '<pro_id>';

-- Check review
SELECT * FROM reviews WHERE bookingId = '<booking_id>';

-- Check notifications
SELECT * FROM notifications WHERE userId IN ('<customer_id>', '<pro_user_id>') ORDER BY createdAt DESC LIMIT 5;
```

## Success Criteria

✅ Pro can start job from scheduled status
✅ Pro can complete job from in-progress status
✅ Pro's jobsCompleted increments on completion
✅ Customer receives notification on completion
✅ Customer can submit review with rating and comment
✅ Pro's rating recalculates correctly
✅ Pro's reviewCount increments
✅ Pro receives notification on new review
✅ Review appears on pro profile
✅ Cannot submit duplicate reviews
✅ State machine enforces valid transitions
✅ UI shows correct buttons based on role and status
