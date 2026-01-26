# Backend Setup Guide

## ✅ What's Been Built

Complete NestJS backend with:
- **Auth Module**: JWT authentication with refresh tokens
- **Pros Module**: Professional profiles with distance calculation
- **Categories Module**: Service categories
- **Services Module**: Services offered by pros
- **Bookings Module**: Complete booking system with state machine
- **Prisma ORM**: PostgreSQL database with migrations
- **API Contract**: Frozen contract matching frontend

## 🚀 Quick Start

### 1. Install PostgreSQL

**Windows:**
```bash
# Download from postgresql.org and install
# Or use Docker:
docker run --name ozar-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ozar -p 5432:5432 -d postgres:15
```

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb ozar
```

**Linux:**
```bash
sudo apt-get install postgresql-15
sudo -u postgres createdb ozar
```

### 2. Setup Backend

```bash
cd apps/backend

# Install dependencies (if not done)
npm install

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start server
npm run start:dev
```

Server will run on: **http://localhost:4000/api/v1**

### 3. Test API

```bash
# Register a user
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "password123",
    "firstName": "Ahmed",
    "lastName": "Khan",
    "phone": "+923001234567",
    "role": "CUSTOMER"
  }'

# Login
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "password123"
  }'

# Get categories
curl http://localhost:4000/api/v1/categories

# Get pros (no auth needed)
curl "http://localhost:4000/api/v1/pros?city=Karachi&categoryId=ELECTRICIAN"
```

## 📁 Project Structure

```
apps/backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── auth/                  # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   ├── pros/                  # Professionals module
│   │   ├── pros.controller.ts
│   │   ├── pros.service.ts
│   │   └── dto/
│   ├── categories/            # Categories module
│   ├── services/              # Services module
│   ├── bookings/              # Bookings module
│   │   ├── bookings.controller.ts
│   │   ├── bookings.service.ts
│   │   └── dto/
│   ├── users/                 # Users module
│   ├── prisma/                # Prisma service
│   ├── app.module.ts
│   └── main.ts
├── .env                       # Environment variables
├── package.json
└── tsconfig.json
```

## 🔌 Connect Frontend to Backend

### Option 1: Update API Wrapper (Recommended)

In `packages/shared/api.ts`, add environment variable:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Replace mock functions with real HTTP calls
export async function getPros(filters: GetProsFilters): Promise<ProProfile[]> {
  const params = new URLSearchParams();
  if (filters.city) params.append('city', filters.city);
  if (filters.category) params.append('categoryId', filters.category);
  // ... add other params

  const response = await fetch(`${API_URL}/pros?${params}`);
  const data = await response.json();
  return data.data; // Backend returns { data, pagination }
}
```

### Option 2: Gradual Migration

Keep mock API, add real API calls one by one:

```typescript
// In api.ts
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true';

export async function getPros(filters: GetProsFilters): Promise<ProProfile[]> {
  if (USE_REAL_API) {
    // Real API call
    const response = await fetch(`${API_URL}/pros?...`);
    return response.json();
  } else {
    // Mock data (existing code)
    return mockProProfiles.filter(...);
  }
}
```

## 🗄️ Database Management

### View Database
```bash
npm run prisma:studio
```
Opens visual database browser at http://localhost:5555

### Create Migration
```bash
npm run prisma:migrate
```

### Reset Database
```bash
npx prisma migrate reset
```

## 🔐 Authentication Flow

1. **Register/Login** → Get `accessToken` + `refreshToken`
2. **Store tokens** in localStorage/cookies
3. **Add to requests**: `Authorization: Bearer <accessToken>`
4. **Refresh when expired**: Call `/auth/refresh` with `refreshToken`

## 📊 Booking State Machine

```
REQUESTED → ACCEPTED → PAYMENT_AUTHORIZED → SCHEDULED → 
IN_PROGRESS → COMPLETED → CAPTURED

Alternative flows:
- CANCELLED_BY_CUSTOMER
- CANCELLED_BY_PRO
- NO_SHOW
- DISPUTED → REFUNDED
```

## 🎯 Next Steps

### Immediate:
1. ✅ Test all endpoints with Postman/cURL
2. ✅ Seed database with test data
3. ✅ Connect one frontend endpoint (e.g., getPros)
4. ✅ Test end-to-end flow

### Phase 2:
- [ ] Add file upload (S3/CloudFlare R2)
- [ ] Payment integration (Stripe)
- [ ] WebSocket for chat
- [ ] Push notifications (FCM)
- [ ] Email notifications (SendGrid/Resend)

### Phase 3:
- [ ] Admin endpoints
- [ ] Analytics
- [ ] Rate limiting
- [ ] Caching (Redis)
- [ ] Full-text search (Elasticsearch)

## 🐛 Troubleshooting

### Database connection error
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string in .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ozar?schema=public"
```

### Prisma errors
```bash
# Regenerate client
npm run prisma:generate

# Reset and migrate
npx prisma migrate reset
npm run prisma:migrate
```

### Port already in use
```bash
# Change PORT in .env
PORT=4001
```

## 📝 API Documentation

Full API contract: See `API_CONTRACT.md`

Test with Postman collection (coming soon) or use cURL examples in `apps/backend/README.md`

---

**Backend is ready!** Start the server and begin connecting your frontend. 🚀
