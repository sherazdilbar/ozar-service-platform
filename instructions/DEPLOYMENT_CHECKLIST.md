# 🚀 Production Deployment Checklist

**Last Updated:** January 27, 2026

This comprehensive checklist ensures a smooth and secure deployment to production.

## 📋 Pre-Deployment Checklist

### 1. Code Quality & Testing

#### Backend
- [ ] All unit tests passing (`npm run test`)
- [ ] All integration tests passing
- [ ] No TypeScript errors (`npm run build`)
- [ ] Code linted and formatted
- [ ] No console.log statements in production code
- [ ] Error handling implemented for all endpoints
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured

#### Frontend (Web)
- [ ] All components render without errors
- [ ] No TypeScript errors (`npm run build`)
- [ ] All pages load correctly
- [ ] Forms validate properly
- [ ] Error boundaries implemented
- [ ] Loading states implemented
- [ ] Empty states implemented
- [ ] Responsive design tested (mobile/tablet/desktop)

#### Mobile App
- [ ] App builds successfully (iOS & Android)
- [ ] No crashes on startup
- [ ] All screens accessible
- [ ] Navigation works correctly
- [ ] Deep linking configured
- [ ] Push notifications tested
- [ ] Offline handling implemented

### 2. Security Audit

#### Authentication & Authorization
- [ ] JWT secrets are strong and unique
- [ ] Refresh token rotation implemented
- [ ] Password hashing with bcrypt (salt rounds >= 10)
- [ ] Protected routes require authentication
- [ ] Role-based access control enforced
- [ ] Session timeout configured
- [ ] CORS configured correctly
- [ ] XSS protection enabled
- [ ] CSRF protection enabled (if applicable)

#### Data Security
- [ ] SQL injection prevention (using Prisma)
- [ ] Input sanitization implemented
- [ ] File upload validation (type, size, content)
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced everywhere
- [ ] API keys not exposed in client code
- [ ] Environment variables secured
- [ ] Database credentials secured

#### API Security
- [ ] Rate limiting per endpoint
- [ ] Request size limits configured
- [ ] API versioning implemented
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't include sensitive data
- [ ] OWASP Top 10 vulnerabilities addressed

### 3. Performance Optimization

#### Backend
- [ ] Database queries optimized
- [ ] Indexes added to frequently queried fields
- [ ] N+1 query problems resolved
- [ ] Connection pooling configured
- [ ] Caching strategy implemented (Redis)
- [ ] Response compression enabled
- [ ] Pagination implemented for large datasets
- [ ] Background jobs for heavy tasks

#### Frontend
- [ ] Images optimized and lazy loaded
- [ ] Code splitting implemented
- [ ] Bundle size analyzed and optimized
- [ ] Unused dependencies removed
- [ ] CDN configured for static assets
- [ ] Service worker for offline support (PWA)
- [ ] Critical CSS inlined
- [ ] Fonts optimized

#### Database
- [ ] Indexes on foreign keys
- [ ] Indexes on frequently filtered fields
- [ ] Query performance analyzed
- [ ] Database backup strategy
- [ ] Connection pool size optimized

### 4. Environment Configuration

#### Backend Environment Variables
```bash
# Production .env template
NODE_ENV=production
PORT=4000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/ozar_prod
DATABASE_POOL_SIZE=20

# JWT
JWT_SECRET=<strong-random-secret-64-chars>
JWT_REFRESH_SECRET=<strong-random-secret-64-chars>
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@ozar.com
SMTP_PASS=<app-password>
SMTP_FROM=Ozar <noreply@ozar.com>

# Frontend
FRONTEND_URL=https://ozar.com

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/www/uploads

# Redis (if using)
REDIS_URL=redis://localhost:6379

# Monitoring
SENTRY_DSN=<your-sentry-dsn>

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

#### Web Environment Variables
```bash
# Production .env.local template
NEXT_PUBLIC_API_URL=https://api.ozar.com/api/v1
NEXT_PUBLIC_MAPBOX_TOKEN=<your-mapbox-token>
NEXT_PUBLIC_SOCKET_URL=https://api.ozar.com
NEXT_PUBLIC_SENTRY_DSN=<your-sentry-dsn>
```

#### Mobile Environment Variables
```bash
# Production .env template
EXPO_PUBLIC_API_URL=https://api.ozar.com/api/v1
EXPO_PUBLIC_MAPBOX_TOKEN=<your-mapbox-token>
EXPO_PUBLIC_SOCKET_URL=https://api.ozar.com
```

### 5. Infrastructure Setup

#### Domain & DNS
- [ ] Domain purchased and configured
- [ ] DNS records configured:
  - [ ] A record for main domain
  - [ ] A record for API subdomain
  - [ ] CNAME for www
  - [ ] MX records for email
  - [ ] TXT records for SPF/DKIM
- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] SSL certificate auto-renewal configured

#### Server Setup
- [ ] Production server provisioned
- [ ] Firewall configured (only necessary ports open)
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Automatic security updates enabled
- [ ] Monitoring agent installed
- [ ] Backup agent installed
- [ ] Log rotation configured

#### Database
- [ ] Production database created
- [ ] Database user with limited permissions
- [ ] Database backups automated (daily)
- [ ] Backup restoration tested
- [ ] Point-in-time recovery enabled
- [ ] Database monitoring configured
- [ ] Connection pooling configured

#### File Storage
- [ ] File storage solution chosen (S3, DO Spaces, etc.)
- [ ] Bucket created and configured
- [ ] CDN configured for file delivery
- [ ] Backup strategy for uploaded files
- [ ] File retention policy defined

### 6. Third-Party Services

#### Email Service
- [ ] Email service configured (SendGrid, AWS SES, etc.)
- [ ] Email templates tested
- [ ] SPF/DKIM records configured
- [ ] Bounce handling configured
- [ ] Unsubscribe links working
- [ ] Email sending limits understood

#### Maps Service
- [ ] Mapbox account created
- [ ] Production API key obtained
- [ ] Usage limits understood
- [ ] Billing alerts configured

#### Payment Gateway (if applicable)
- [ ] Payment provider account created
- [ ] Production API keys obtained
- [ ] Webhook endpoints configured
- [ ] Test transactions completed
- [ ] Refund process tested
- [ ] Dispute handling process defined

#### Monitoring & Analytics
- [ ] Error tracking (Sentry, Rollbar)
- [ ] Application monitoring (New Relic, DataDog)
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Analytics (Google Analytics, Mixpanel)
- [ ] Log aggregation (Loggly, Papertrail)

### 7. Legal & Compliance

#### Documentation
- [ ] Terms of Service written and published
- [ ] Privacy Policy written and published
- [ ] Cookie Policy written and published
- [ ] GDPR compliance verified (if EU users)
- [ ] Data retention policy defined
- [ ] Data deletion process implemented

#### Business
- [ ] Business entity registered
- [ ] Business bank account opened
- [ ] Payment processing agreement signed
- [ ] Insurance obtained (if required)
- [ ] Tax registration completed
- [ ] Accounting system setup

### 8. Deployment Process

#### Database Migration
```bash
# 1. Backup production database
pg_dump -U user -d ozar_prod > backup_$(date +%Y%m%d).sql

# 2. Test migration on staging
cd apps/backend
npx prisma migrate deploy --preview-feature

# 3. Run migration on production
npx prisma migrate deploy
```

#### Backend Deployment
```bash
# 1. Build application
cd apps/backend
npm run build

# 2. Upload to server
rsync -avz dist/ user@server:/var/www/api/

# 3. Install dependencies (production only)
ssh user@server "cd /var/www/api && npm ci --production"

# 4. Restart application
ssh user@server "pm2 restart ozar-api"

# 5. Verify deployment
curl https://api.ozar.com/api/v1/health
```

#### Web Deployment (Vercel)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
cd apps/web
vercel --prod

# 4. Verify deployment
curl https://ozar.com
```

#### Mobile Deployment

**iOS (App Store)**
```bash
# 1. Build for iOS
cd apps/mobile
eas build --platform ios --profile production

# 2. Download IPA
eas build:download --platform ios

# 3. Upload to App Store Connect
# Use Transporter app or Xcode

# 4. Submit for review
# Through App Store Connect
```

**Android (Google Play)**
```bash
# 1. Build for Android
cd apps/mobile
eas build --platform android --profile production

# 2. Download AAB
eas build:download --platform android

# 3. Upload to Google Play Console
# Through Google Play Console

# 4. Submit for review
# Through Google Play Console
```

### 9. Post-Deployment Verification

#### Smoke Tests
- [ ] Homepage loads
- [ ] User can sign up
- [ ] User can login
- [ ] User can browse professionals
- [ ] User can create booking
- [ ] Professional can accept booking
- [ ] Chat works
- [ ] Notifications work
- [ ] Email notifications sent
- [ ] Payment processing works (if applicable)
- [ ] Mobile app connects to API
- [ ] Push notifications work (mobile)

#### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Database query time < 100ms
- [ ] Time to first byte < 200ms
- [ ] Lighthouse score > 90

#### Security Tests
- [ ] SSL certificate valid
- [ ] HTTPS redirect working
- [ ] Security headers present
- [ ] No exposed secrets in client code
- [ ] Rate limiting working
- [ ] Authentication required for protected routes

### 10. Monitoring & Alerts

#### Application Monitoring
- [ ] Error rate alerts configured
- [ ] Response time alerts configured
- [ ] CPU usage alerts configured
- [ ] Memory usage alerts configured
- [ ] Disk space alerts configured
- [ ] Database connection alerts configured

#### Business Monitoring
- [ ] New user signups tracked
- [ ] Booking creation tracked
- [ ] Payment success/failure tracked
- [ ] User retention tracked
- [ ] Revenue tracked

#### Uptime Monitoring
- [ ] Homepage monitored (1-minute intervals)
- [ ] API health endpoint monitored
- [ ] Database connectivity monitored
- [ ] Alert contacts configured
- [ ] Escalation policy defined

### 11. Backup & Disaster Recovery

#### Backup Strategy
- [ ] Database backed up daily
- [ ] Uploaded files backed up daily
- [ ] Configuration files backed up
- [ ] Backup retention policy (30 days)
- [ ] Backups stored off-site
- [ ] Backup encryption enabled

#### Disaster Recovery
- [ ] Recovery Time Objective (RTO) defined
- [ ] Recovery Point Objective (RPO) defined
- [ ] Disaster recovery plan documented
- [ ] Recovery process tested
- [ ] Failover process documented
- [ ] Team trained on recovery procedures

### 12. Documentation

#### Technical Documentation
- [ ] API documentation published
- [ ] Architecture diagram created
- [ ] Database schema documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide created
- [ ] Runbook for common issues

#### User Documentation
- [ ] User guide created
- [ ] FAQ page published
- [ ] Video tutorials created (optional)
- [ ] Help center setup
- [ ] Contact support page

### 13. Team Preparation

#### Access & Permissions
- [ ] Production access limited to necessary personnel
- [ ] SSH keys distributed
- [ ] Database access credentials secured
- [ ] Third-party service access shared
- [ ] On-call rotation defined

#### Training
- [ ] Team trained on deployment process
- [ ] Team trained on monitoring tools
- [ ] Team trained on incident response
- [ ] Team trained on customer support

### 14. Launch Plan

#### Pre-Launch (1 week before)
- [ ] All checklist items completed
- [ ] Staging environment matches production
- [ ] Load testing completed
- [ ] Security audit completed
- [ ] Backup and recovery tested
- [ ] Team briefed on launch plan

#### Launch Day
- [ ] Deploy during low-traffic hours
- [ ] Monitor error rates closely
- [ ] Monitor performance metrics
- [ ] Monitor user feedback
- [ ] Have rollback plan ready
- [ ] Team on standby for issues

#### Post-Launch (1 week after)
- [ ] Monitor error rates daily
- [ ] Monitor performance daily
- [ ] Collect user feedback
- [ ] Fix critical bugs immediately
- [ ] Plan for improvements
- [ ] Celebrate success! 🎉

## 🚨 Rollback Plan

If something goes wrong:

### Backend Rollback
```bash
# 1. Stop current version
pm2 stop ozar-api

# 2. Restore previous version
rsync -avz backup/dist/ /var/www/api/

# 3. Rollback database (if needed)
psql -U user -d ozar_prod < backup_previous.sql

# 4. Start previous version
pm2 start ozar-api

# 5. Verify
curl https://api.ozar.com/api/v1/health
```

### Web Rollback (Vercel)
```bash
# Vercel keeps previous deployments
# Rollback through Vercel dashboard or CLI
vercel rollback
```

### Mobile Rollback
- Cannot rollback mobile apps instantly
- Fix critical bugs and release hotfix
- Or remove app from stores temporarily

## 📊 Success Metrics

Track these metrics post-launch:

### Technical Metrics
- Uptime: > 99.9%
- Error rate: < 0.1%
- API response time: < 500ms
- Page load time: < 3s

### Business Metrics
- Daily active users
- Booking completion rate
- User retention rate
- Revenue growth

### User Satisfaction
- App store rating: > 4.5 stars
- Customer support tickets
- Net Promoter Score (NPS)
- User feedback sentiment

## 🎯 Post-Launch Priorities

### Week 1
- Monitor everything closely
- Fix critical bugs immediately
- Respond to user feedback
- Optimize performance bottlenecks

### Month 1
- Analyze user behavior
- Identify improvement areas
- Plan feature enhancements
- Optimize conversion funnel

### Month 3
- Scale infrastructure if needed
- Implement user-requested features
- Expand to new markets
- Improve marketing

## ✅ Final Checklist

Before going live:

- [ ] All items in this checklist completed
- [ ] Staging environment tested thoroughly
- [ ] Team trained and ready
- [ ] Monitoring and alerts configured
- [ ] Backup and recovery tested
- [ ] Legal documents published
- [ ] Customer support ready
- [ ] Marketing materials ready
- [ ] Launch announcement prepared
- [ ] Celebration planned! 🎉

---

**Good luck with your launch!** 🚀

Remember: It's better to delay launch and get it right than to rush and face major issues.

For questions or issues, refer to:
- `instructions/TROUBLESHOOTING_GUIDE.md`
- `instructions/API_CONTRACT.md`
- `instructions/COMPLETE_SYSTEM_SUMMARY.md`
