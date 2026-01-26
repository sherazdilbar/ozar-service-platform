# Ozar API Contract

**Version:** 1.0.0  
**Last Updated:** 2025-12-24

This document defines the frozen API contract between frontend and backend. All endpoints, types, and enums are locked and should not change without versioning.

---

## Base URL
```
Development: http://localhost:4000/api/v1
Production: https://api.ozar.app/v1
```

---

## Authentication

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### JWT Payload
```typescript
{
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'PRO' | 'ADMIN';
  iat: number;
  exp: number;
}
```

---

## 1. AUTH MODULE

### POST /auth/register
**Request:**
```typescript
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'CUSTOMER' | 'PRO';
}
```

**Response:**
```typescript
{
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CUSTOMER' | 'PRO' | 'ADMIN';
  };
  accessToken: string;
  refreshToken: string;
}
```

### POST /auth/login
**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:** Same as register

### POST /auth/refresh
**Request:**
```typescript
{
  refreshToken: string;
}
```

**Response:**
```typescript
{
  accessToken: string;
  refreshToken: string;
}
```

### POST /auth/logout
**Headers:** Authorization required  
**Response:** 204 No Content

---

## 2. PROS MODULE

### GET /pros
**Query Params:**
```typescript
{
  city?: string;
  categoryId?: ServiceCategory;
  availableNow?: boolean;
  radiusKm?: number;
  lat?: number;
  lng?: number;
  query?: string;
  page?: number;
  limit?: number;
}
```

**Response:**
```typescript
{
  data: ProProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### GET /pros/:id
**Response:**
```typescript
ProProfile
```

### POST /pros (Pro only)
**Request:**
```typescript
{
  businessName: string;
  bio: string;
  categories: ServiceCategory[];
  serviceArea: {
    city: string;
    radiusKm: number;
  };
  location: {
    city: string;
    area: string;
    lat: number;
    lng: number;
  };
}
```

**Response:**
```typescript
ProProfile
```

### PUT /pros/:id (Pro only)
**Request:** Partial ProProfile  
**Response:** ProProfile

### GET /pros/:id/reviews
**Query:** `?page=1&limit=10`  
**Response:**
```typescript
{
  data: Review[];
  pagination: { ... };
}
```

---

## 3. CATEGORIES MODULE

### GET /categories
**Response:**
```typescript
{
  id: ServiceCategory;
  label: string;
  icon: string;
}[]
```

---

## 4. BOOKINGS MODULE

### POST /bookings
**Request:**
```typescript
{
  proId: string;
  serviceId: string;
  scheduledFor?: string; // ISO 8601
  isASAP: boolean;
  description: string;
  images?: string[];
  location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  };
}
```

**Response:**
```typescript
Booking
```

### GET /bookings
**Query:** `?status=REQUESTED&page=1&limit=10`  
**Response:**
```typescript
{
  data: Booking[];
  pagination: { ... };
}
```

### GET /bookings/:id
**Response:**
```typescript
Booking
```

### PUT /bookings/:id/status
**Request:**
```typescript
{
  status: BookingStatus;
  reason?: string; // Required for cancellations
}
```

**Response:**
```typescript
Booking
```

### POST /bookings/:id/accept (Pro only)
**Response:** Booking with status ACCEPTED

### POST /bookings/:id/decline (Pro only)
**Request:**
```typescript
{
  reason: string;
}
```

**Response:** Booking with status CANCELLED_BY_PRO

---

## 5. SERVICES MODULE

### GET /services
**Query:** `?proId=xxx&categoryId=ELECTRICIAN`  
**Response:**
```typescript
Service[]
```

### POST /services (Pro only)
**Request:**
```typescript
{
  name: string;
  description: string;
  category: ServiceCategory;
  pricingModel: 'HOURLY' | 'FIXED' | 'INSPECTION';
  price: number;
  duration: number;
  currency: string;
}
```

**Response:**
```typescript
Service
```

---

## Core Types (Frozen)

### UserRole
```typescript
enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PRO = 'PRO',
  ADMIN = 'ADMIN'
}
```

### ServiceCategory
```typescript
enum ServiceCategory {
  ELECTRICIAN = 'ELECTRICIAN',
  PLUMBER = 'PLUMBER',
  LOCKSMITH = 'LOCKSMITH',
  GAS_HEATER = 'GAS_HEATER',
  AC_TECHNICIAN = 'AC_TECHNICIAN',
  CARPENTER = 'CARPENTER',
  PAINTER = 'PAINTER',
  CLEANER = 'CLEANER'
}
```

### BookingStatus (State Machine)
```typescript
enum BookingStatus {
  DRAFT = 'DRAFT',
  REQUESTED = 'REQUESTED',
  OFFERED = 'OFFERED',
  ACCEPTED = 'ACCEPTED',
  PAYMENT_AUTHORIZED = 'PAYMENT_AUTHORIZED',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CAPTURED = 'CAPTURED',
  CANCELLED_BY_CUSTOMER = 'CANCELLED_BY_CUSTOMER',
  CANCELLED_BY_PRO = 'CANCELLED_BY_PRO',
  NO_SHOW = 'NO_SHOW',
  DISPUTED = 'DISPUTED',
  REFUNDED = 'REFUNDED'
}
```

**Valid Transitions:**
```
DRAFT → REQUESTED
REQUESTED → ACCEPTED | CANCELLED_BY_PRO
ACCEPTED → PAYMENT_AUTHORIZED
PAYMENT_AUTHORIZED → SCHEDULED
SCHEDULED → IN_PROGRESS | CANCELLED_BY_CUSTOMER | NO_SHOW
IN_PROGRESS → COMPLETED
COMPLETED → CAPTURED | DISPUTED
DISPUTED → REFUNDED | CAPTURED
```

### VerificationStatus
```typescript
enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}
```

### AvailabilityStatus
```typescript
enum AvailabilityStatus {
  AVAILABLE_NOW = 'AVAILABLE_NOW',
  AVAILABLE_SOON = 'AVAILABLE_SOON',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE'
}
```

### PricingModel
```typescript
enum PricingModel {
  HOURLY = 'HOURLY',
  FIXED = 'FIXED',
  INSPECTION = 'INSPECTION'
}
```

---

## Error Responses

All errors follow this format:
```typescript
{
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}
```

**Common Status Codes:**
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (e.g., duplicate email)
- 500: Internal Server Error

---

## Pagination

All list endpoints support:
```typescript
?page=1&limit=10&sortBy=createdAt&order=DESC
```

Response includes:
```typescript
{
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## Field Naming Conventions

- Use camelCase for all fields
- IDs end with `Id` (e.g., `userId`, `proId`, `bookingId`)
- Timestamps are ISO 8601 strings
- Coordinates: `lat` (latitude), `lng` (longitude)
- Currency codes: ISO 4217 (e.g., "USD", "PKR", "SAR")

---

## Notes for Backend Implementation

1. **Authentication:** Use JWT with 15min access token, 7d refresh token
2. **Validation:** Use class-validator decorators
3. **Database:** PostgreSQL recommended
4. **File Upload:** Use S3/CloudFlare R2 for images
5. **Distance Calculation:** Use PostGIS or Haversine formula
6. **Rate Limiting:** 100 req/min per IP for public endpoints
7. **CORS:** Allow frontend domains only
8. **Logging:** Log all state transitions for bookings
9. **Webhooks:** Prepare for payment gateway webhooks (future)
10. **WebSocket:** Prepare namespace for chat (future)
