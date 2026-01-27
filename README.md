# Ozar Service Platform

A comprehensive service marketplace platform connecting customers with professional service providers. Built with modern technologies for web and mobile.

## 🎉 Latest Updates (January 27, 2026)

### Backend Enhancements
- ✅ Availability & Schedule Management System
- ✅ Certifications & Badges System
- ✅ Response Templates & Quick Messages
- ✅ Service Area Management with Travel Fee Calculator
- ✅ Global Exception Filter & Performance Interceptor
- ✅ Health Check Endpoints (basic & detailed)

### Mobile Pro Features (Complete)
- ✅ Availability Calendar with Time-Off Management
- ✅ Portfolio Management with Multi-Image Upload
- ✅ Reviews Management with Response Templates
- ✅ Service Area Management
- ✅ Certifications & Badges Display
- ✅ Quick Messages for Fast Communication
- ✅ Booking Quick Actions (Start, Complete, Reschedule)
- ✅ Customer Relationship Management
- ✅ Analytics Dashboard
- ✅ Service Management

## 🏗️ Project Structure

```
ozar/
├── apps/
│   ├── backend/          # NestJS API server
│   ├── web/              # Next.js web application
│   └── mobile/           # React Native (Expo) mobile app
├── packages/
│   └── shared/           # Shared types and utilities
└── instructions/         # Development documentation
```

## 🚀 Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Real-time**: Socket.io
- **Email**: Nodemailer with custom templates

### Web Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL
- **State Management**: React Context
- **i18n**: Multi-language support (EN/HU)

### Mobile App
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router
- **Maps**: React Native Maps
- **Real-time**: Socket.io client

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn
- Expo CLI (for mobile development)

## 🔧 Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ozar
```

### 2. Install dependencies
```bash
npm install
```

### 3. Backend Setup
```bash
cd apps/backend

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials and API keys

# Run database migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start the backend
npm run start:dev
```

### 4. Web App Setup
```bash
cd apps/web

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your API URL and Mapbox token

# Start the development server
npm run dev
```

### 5. Mobile App Setup
```bash
cd apps/mobile

# Copy environment file
cp .env.example .env

# Edit .env with your API URL and Mapbox token

# Start Expo
npx expo start
```

## 🔑 Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/ozar"
JWT_SECRET="your-secret-key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Web (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

### Mobile (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

## 📱 Features

### For Customers
- Browse and search service providers
- Filter by location, category, and price
- Real-time chat with providers
- Book services with calendar integration
- Rate and review completed services
- Multi-language support

### For Service Providers
- Professional profile management
- Service listing and pricing
- Availability calendar
- Booking request management
- Portfolio showcase
- Real-time notifications

### Admin Features
- User management
- Service category management
- Dispute resolution
- Platform analytics

## 🗺️ Key Integrations

- **Mapbox**: Interactive maps and location services
- **Socket.io**: Real-time chat and notifications
- **Prisma**: Type-safe database access
- **JWT**: Secure authentication

## 📚 Documentation

Detailed documentation is available in the `/instructions` folder:
- API Contract
- Testing Guides
- Feature Implementation Summaries
- Security Setup

## 🧪 Testing

```bash
# Backend tests
cd apps/backend
npm run test

# Web tests
cd apps/web
npm run test

# Mobile tests
cd apps/mobile
npm run test
```

## 🚀 Deployment

### Backend
- Deploy to services like Railway, Render, or AWS
- Ensure PostgreSQL database is accessible
- Set all environment variables

### Web
- Deploy to Vercel or Netlify
- Configure environment variables
- Set up custom domain

### Mobile
- Build with EAS Build
- Submit to App Store and Google Play

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 👥 Team

Developed with ❤️ by the Ozar team

## 📞 Support

For support, email support@ozar.com or join our Slack channel.
