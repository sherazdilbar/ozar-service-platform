# 🚀 Quick Start Development Guide

**Last Updated:** January 27, 2026

This guide will get you up and running with the Ozar platform in under 10 minutes.

## Prerequisites Checklist

Before starting, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ PostgreSQL 14+ installed and running
- ✅ Git installed
- ✅ A code editor (VS Code recommended)
- ✅ Terminal/Command Prompt access

## 🎯 5-Minute Setup

### Step 1: Database Setup (2 minutes)

```bash
# Create PostgreSQL database
createdb ozar_dev

# Or using psql:
psql -U postgres
CREATE DATABASE ozar_dev;
\q
```

### Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd apps/backend

# Install dependencies (if not already done)
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://postgres:password@localhost:5432/ozar_dev"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FRONTEND_URL="http://localhost:3000"
EOF

# Run migrations
npx prisma migrate dev

# Seed database with test data
npx prisma db seed

# Start backend
npm run start:dev
```

Backend should now be running on `http://localhost:4000`

### Step 3: Web App Setup (1 minute)

```bash
# Open new terminal
cd apps/web

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token-here
EOF

# Start web app
npm run dev
```

Web app should now be running on `http://localhost:3000`

### Step 4: Test It! (30 seconds)

1. Open browser: `http://localhost:3000`
2. Click "Sign In"
3. Use test account:
   - Email: `customer@demo.com`
   - Password: `password123`
4. Browse professionals and test booking flow!

## 🎉 You're Ready!

The platform is now running with:
- ✅ Backend API on port 4000
- ✅ Web app on port 3000
- ✅ Database with seed data
- ✅ Test accounts ready to use

## 📱 Mobile App Setup (Optional)

If you want to run the mobile app:

```bash
# Open new terminal
cd apps/mobile

# Create .env file
cat > .env << EOF
EXPO_PUBLIC_API_URL=http://10.0.2.2:4000/api/v1
EXPO_PUBLIC_MAPBOX_TOKEN=your-mapbox-token-here
EOF

# Start Expo
npx expo start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app on physical device

## 🔑 Test Accounts

All test accounts use password: `password123`

### Customers
- `customer@demo.com`

### Professionals
- `ali.electrician@demo.com` (Electrician - Riyadh)
- `hamza.plumber@demo.com` (Plumber - Riyadh)
- `usman.ac@demo.com` (AC Technician - Riyadh)

### Admin
- `admin@ozar.com`

## 🛠️ Common Commands

### Backend
```bash
cd apps/backend

# Start development server
npm run start:dev

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Run tests
npm run test
```

### Web App
```bash
cd apps/web

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Mobile App
```bash
cd apps/mobile

# Start Expo
npx expo start

# Clear cache and restart
npx expo start -c

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if PostgreSQL is running
pg_isready

# Check if port 4000 is available
lsof -i :4000  # Mac/Linux
netstat -ano | findstr :4000  # Windows

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database connection error
```bash
# Verify DATABASE_URL in .env
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Test connection
psql -U postgres -d ozar_dev

# Reset database if corrupted
npx prisma migrate reset
```

### Web app won't start
```bash
# Check if port 3000 is available
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Mobile app connection issues
```bash
# For Android emulator, use 10.0.2.2 instead of localhost
EXPO_PUBLIC_API_URL=http://10.0.2.2:4000/api/v1

# For iOS simulator, use localhost
EXPO_PUBLIC_API_URL=http://localhost:4000/api/v1

# For physical device, use your computer's IP
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:4000/api/v1
```

## 📊 Verify Everything Works

### 1. Backend Health Check
```bash
curl http://localhost:4000/api/v1/health
# Should return: {"status":"ok"}
```

### 2. Database Check
```bash
npx prisma studio
# Opens GUI at http://localhost:5555
# Verify tables exist and have seed data
```

### 3. Web App Check
- Open `http://localhost:3000`
- Should see homepage with professionals
- Login should work
- Booking flow should work

### 4. API Check
```bash
# Test login endpoint
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@demo.com","password":"password123"}'

# Should return access_token and user data
```

## 🎯 Next Steps

Now that you're set up:

1. **Explore the codebase**
   - Backend: `apps/backend/src/`
   - Web: `apps/web/src/`
   - Mobile: `apps/mobile/app/`

2. **Read the documentation**
   - `instructions/API_CONTRACT.md` - API endpoints
   - `instructions/TESTING_GUIDE.md` - Testing instructions
   - `instructions/COMPLETE_SYSTEM_SUMMARY.md` - System overview

3. **Make your first change**
   - Try modifying a component
   - Add a new feature
   - Fix a bug from BUG_TRACKER.md

4. **Run tests**
   - Backend: `cd apps/backend && npm run test`
   - Web: `cd apps/web && npm run test`

## 🔥 Pro Tips

### Development Workflow
1. Keep 3 terminals open:
   - Terminal 1: Backend (`npm run start:dev`)
   - Terminal 2: Web (`npm run dev`)
   - Terminal 3: Commands (git, prisma, etc.)

2. Use Prisma Studio for database inspection:
   ```bash
   npx prisma studio
   ```

3. Enable hot reload for faster development:
   - Backend: Already enabled with `start:dev`
   - Web: Already enabled with Next.js
   - Mobile: Shake device or press `r` to reload

### Debugging
1. **Backend logs**: Check terminal running `npm run start:dev`
2. **Web logs**: Check browser console (F12)
3. **Mobile logs**: Check Expo terminal or device logs
4. **Database**: Use Prisma Studio or `psql`

### Code Quality
```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check

# Run all checks
npm run validate
```

## 📚 Additional Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **NestJS Docs**: https://docs.nestjs.com
- **Next.js Docs**: https://nextjs.org/docs
- **Expo Docs**: https://docs.expo.dev
- **Mapbox Docs**: https://docs.mapbox.com

## 🆘 Getting Help

1. Check `instructions/BUG_TRACKER.md` for known issues
2. Search existing documentation in `instructions/`
3. Check console logs for error messages
4. Review API responses in Network tab
5. Ask team members or create an issue

## ✅ Setup Verification Checklist

Before starting development, verify:

- [ ] Backend starts without errors
- [ ] Web app loads in browser
- [ ] Can login with test account
- [ ] Can view professionals list
- [ ] Can create a booking
- [ ] Database has seed data
- [ ] Prisma Studio opens
- [ ] No TypeScript errors
- [ ] Hot reload works
- [ ] API endpoints respond

If all checked, you're ready to develop! 🚀

---

**Happy Coding!** 🎉

For more detailed information, see:
- `README.md` - Project overview
- `instructions/COMPLETE_SYSTEM_SUMMARY.md` - Full system documentation
- `instructions/API_CONTRACT.md` - API reference
