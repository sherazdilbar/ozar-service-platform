# Milestone 5: Admin Panel & Verification System

## Goal
Supply-side trust and control - ensure platform safety and quality

## Features to Implement

### 1. Verification System ✅ (Already in schema)
- [x] Verification states: PENDING, APPROVED, REJECTED (already in ProProfile)
- [ ] Document upload for pros
- [ ] Admin review workflow
- [ ] Only APPROVED pros visible to customers

### 2. Admin Panel
- [ ] Admin role and authentication
- [ ] Dashboard with stats
- [ ] Approve/reject pros
- [ ] Manage categories
- [ ] View all bookings
- [ ] Handle disputes

### 3. Dispute Management
- [ ] Dispute model in database
- [ ] Customers can raise disputes
- [ ] Pros can respond
- [ ] Admin can resolve
- [ ] Refund handling

### 4. Cancellation Policies
- [ ] Cancellation rules by time
- [ ] Penalty fees
- [ ] Refund calculations
- [ ] Cancellation reasons

## Implementation Steps

1. Add Admin role to User model
2. Create Admin module with endpoints
3. Add Dispute model to schema
4. Implement cancellation logic
5. Build admin frontend panel
6. Add verification workflow

## Database Changes Needed

```prisma
// Add to User model
enum UserRole {
  CUSTOMER
  PRO
  ADMIN  // NEW
}

// New Dispute model
model Dispute {
  id          String   @id @default(cuid())
  bookingId   String
  booking     Booking  @relation(fields: [bookingId], references: [id])
  raisedBy    String   // userId
  raisedByUser User    @relation(fields: [raisedBy], references: [id])
  reason      String
  description String
  status      DisputeStatus @default(OPEN)
  resolution  String?
  resolvedBy  String?  // admin userId
  resolvedAt  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum DisputeStatus {
  OPEN
  UNDER_REVIEW
  RESOLVED
  CLOSED
}

// Add to Booking model
cancellationReason String?
cancelledBy        String?
cancellationFee    Float?
refundAmount       Float?
```

## API Endpoints to Add

### Admin Endpoints
- GET /admin/stats - Dashboard statistics
- GET /admin/pros - List all pros with filters
- PUT /admin/pros/:id/verify - Approve/reject pro
- GET /admin/bookings - All bookings
- GET /admin/disputes - All disputes
- PUT /admin/disputes/:id/resolve - Resolve dispute

### Dispute Endpoints
- POST /disputes - Create dispute
- GET /disputes - Get user's disputes
- GET /disputes/:id - Get dispute details
- PUT /disputes/:id/respond - Pro responds to dispute

### Cancellation Endpoints
- POST /bookings/:id/cancel - Cancel booking with reason
- GET /bookings/:id/cancellation-fee - Calculate cancellation fee

## Frontend Pages to Add

1. `/admin` - Admin dashboard
2. `/admin/pros` - Manage pros
3. `/admin/disputes` - Handle disputes
4. `/disputes` - User dispute list
5. `/disputes/new/:bookingId` - Create dispute

## Success Criteria

- ✅ Only approved pros visible to customers
- ✅ Admin can approve/reject pros
- ✅ Customers can raise disputes
- ✅ Cancellation fees calculated correctly
- ✅ Admin has full platform oversight
