# Deployment Checklist for ozar.hu

## Required Information

Please provide the following information to proceed with deployment:

### 1. Domain & DNS Configuration
- [ ] **Sybell Account Access**
  - Login URL: https://center.sybell.hu/index.php/login
  - Username/Email: sheraz.jutt9080@gmail.com
  - Password: Alternate@123
  - (We need access to configure DNS records for ozar.hu)

### 2. GitHub Repository
- [ ] **GitHub Information**
  - GitHub Username: sherazdilbar 
  - Repository URL: https://github.com/sherazdilbar/ozar-service-platform
  - Repository is public or you'll grant access to deployment platform

### 3. Hosting Platform Selection
Choose ONE from your GitHub Student Pack:

**Option A: DigitalOcean ($200 credit) - RECOMMENDED**
- [ ] DigitalOcean account created and GitHub Student Pack credit activated
- [ ] Account email: sheraz.jutt9080@gmail.com

**Option B: Heroku**
- [ ] Heroku account created and GitHub Student Pack credit activated
- [ ] Account email: _________________

**Option C: Azure**
- [ ] Azure account created and GitHub Student Pack credit activated
- [ ] Account email: _________________

**Option D: Other platform from Student Pack**
- [ ] Platform name: _________________
- [ ] Account email: _________________

### 4. Mapbox Configuration (Required for Maps)
- [ ] **Mapbox Account**
  - Create account at: https://account.mapbox.com/auth/signup/
  - Public Access Token:
   pk.eyJ1Ijoic2hlcmF6ZHgiLCJhIjoiY21qbGcxOGY5MjRvODNlcXp2ZTRtNnFmeCJ9.xGKn0xxUlMtDg0rdkkH7aA
  - (Free tier: 50,000 map loads/month)

### 5. Database
- [ ] Will use hosting platform's PostgreSQL database (recommended)
- OR
- [ ] External database provider: _________________

### 6. Email Service (Optional but Recommended)
**Option A: SendGrid (Free tier: 100 emails/day)**
- [ ] SendGrid account created
- [ ] API Key: _________________

**Option B: Skip for now**
- [ ] Will set up later (emails won't work until configured)

### 7. Admin Account Information
- [ ] **Admin User Details**
  - Full Name: Sheraz Dilbar        
  - Email: sheraz.jutt9080@gmail.com        
  - Phone: +36705681248
  - Password: Alternate@123 (min 8 characters)

### 8. Environment Configuration
- [ ] **JWT Secret** (we'll generate a secure random string)
- [ ] **Session Secret** (we'll generate a secure random string)

---

## Deployment Steps (After Information Provided)

### Phase 1: Platform Setup (30 minutes)
1. Activate GitHub Student Pack credits
2. Create hosting platform account
3. Create Mapbox account and get token
4. Create SendGrid account (optional)

### Phase 2: Application Deployment (1 hour)
1. Connect GitHub repository to hosting platform
2. Create PostgreSQL database
3. Deploy backend application
4. Deploy frontend application
5. Configure environment variables

### Phase 3: DNS Configuration (30 minutes)
1. Get deployment URLs from hosting platform
2. Configure DNS records in Sybell:
   - A record for ozar.hu → Frontend IP
   - A record for api.ozar.hu → Backend IP
   - SSL certificate setup (automatic)

### Phase 4: Database Setup (15 minutes)
1. Run database migrations
2. Seed initial data (categories, districts)
3. Create admin account

### Phase 5: Testing (30 minutes)
1. Test all major features
2. Verify email delivery (if configured)
3. Test payment flow
4. Check mobile app connectivity

---

## Estimated Timeline
- **Information Gathering**: 1-2 hours (your part)
- **Deployment Process**: 2-3 hours (our part)
- **Total**: 3-5 hours

---

## What Happens After Deployment?

### Making Changes
1. Make changes in your local code
2. Commit: `git add . && git commit -m "your message"`
3. Push: `git push origin main`
4. Platform auto-deploys (2-5 minutes)

### Monitoring
- Platform dashboard shows logs and metrics
- Email notifications for deployment status
- Uptime monitoring included

### Costs
- **DigitalOcean**: $0 for first few months (using $200 credit)
  - After credit: ~$25-35/month for both apps + database
- **Mapbox**: Free (50k loads/month)
- **SendGrid**: Free (100 emails/day)
- **Domain**: Already paid to Sybell

---

## Next Steps

1. Fill out all the information above
2. Activate your GitHub Student Pack credits at: https://education.github.com/pack
3. Let me know when ready, and we'll proceed with deployment

---

## Questions?

- **Q: Can I test before going live?**
  - A: Yes! We'll deploy to a test URL first, then switch DNS when ready

- **Q: What if something breaks?**
  - A: Easy rollback to previous version via platform dashboard

- **Q: Can I use a different hosting platform?**
  - A: Yes! Any platform that supports Node.js and PostgreSQL works

- **Q: Do I need all of this now?**
  - A: Minimum required: Hosting platform, GitHub repo, Mapbox token
  - Optional: SendGrid (emails), can add later
