# Ozar Backend API

NestJS + Prisma + PostgreSQL backend for Ozar marketplace.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (if not installed)
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Create database
createdb ozar
```

**Option B: Docker**
```bash
docker run --name ozar-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ozar \
  -p 5432:5432 \
  -d postgres:15
```

**Option C: Cloud (Recommended for production)**
- Supabase (free tier)
- Railway
- Render
- AWS RDS

### 3. Configure Environment
Update `.env` with your database URL:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ozar?schema=public"
```

### 4. Run Migrations
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Start Server
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Server runs on: **http://localhost:4000/api/v1**

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout

### Pros
- `GET /api/v1/pros` - List professionals (with filters)
- `GET /api/v1/pros/:id` - Get pro profile
- `POST /api/v1/pros` - Create pro profile (auth required)
- `PUT /api/v1/pros/:id` - Update pro profile (auth required)
- `GET /api/v1/pros/:id/reviews` - Get pro reviews

### Categories
- `GET /api/v1/categories` - List all categories

### Services
- `GET /api/v1/services` - List services
- `POST /api/v1/services` - Create service (pro only)

### Bookings
- `POST /api/v1/bookings` - Create booking (auth required)
- `GET /api/v1/bookings` - List bookings (auth required)
- `GET /api/v1/bookings/:id` - Get booking details (auth required)
- `PUT /api/v1/bookings/:id/status` - Update booking status (auth required)
- `POST /api/v1/bookings/:id/accept` - Accept booking (pro only)
- `POST /api/v1/bookings/:id/decline` - Decline booking (pro only)

## Database Schema

See `prisma/schema.prisma` for complete schema.

**Main Tables:**
- `users` - All users (customers, pros, admins)
- `refresh_tokens` - JWT refresh tokens
- `pro_profiles` - Professional profiles
- `services` - Services offered by pros
- `portfolio_items` - Pro portfolio items
- `bookings` - Service bookings
- `booking_events` - Booking status history
- `reviews` - Customer reviews

## Development Tools

### Prisma Studio
Visual database browser:
```bash
npm run prisma:studio
```

### Generate Prisma Client
After schema changes:
```bash
npm run prisma:generate
```

### Create Migration
```bash
npm run prisma:migrate
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "CUSTOMER"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Pros (with filters)
```bash
curl "http://localhost:4000/api/v1/pros?city=Karachi&categoryId=ELECTRICIAN&availableNow=true&radiusKm=10"
```

## Next Steps

1. ✅ Auth + JWT
2. ✅ Pros CRUD
3. ✅ Bookings with state machine
4. ⏳ Payment integration (Stripe/Local)
5. ⏳ WebSocket chat
6. ⏳ Push notifications
7. ⏳ File uploads (S3/CloudFlare R2)
8. ⏳ Email notifications
9. ⏳ Admin dashboard endpoints

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN="7d"

# App
PORT=4000
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"
```

## Production Deployment

### Vercel/Railway/Render
1. Connect GitHub repo
2. Set environment variables
3. Deploy automatically

### Manual
```bash
npm run build
npm run start:prod
```

## License

Private - All rights reserved
