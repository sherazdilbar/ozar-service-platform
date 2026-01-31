# DigitalOcean Deployment Guide for ozar.hu

## Prerequisites Completed ✅
- GitHub Repository: https://github.com/sherazdilbar/ozar-service-platform
- Mapbox Token: Ready
- Admin Account: Ready
- Domain: ozar.hu (Sybell)

---

## STEP 1: Activate DigitalOcean Credit (5 minutes)

1. Go to: https://education.github.com/pack
2. Login with your GitHub account (sherazdilbar)
3. Find "DigitalOcean" in the list
4. Click "Get access to DigitalOcean"
5. Follow the link to activate $200 credit
6. Create DigitalOcean account with: sheraz.jutt9080@gmail.com

---

## STEP 2: Create PostgreSQL Database (10 minutes)

1. Login to DigitalOcean: https://cloud.digitalocean.com
2. Click "Create" → "Databases"
3. Choose:
   - **Database Engine**: PostgreSQL 15
   - **Datacenter**: Frankfurt (closest to Budapest)
   - **Plan**: Basic ($15/month - covered by credit)
   - **Name**: ozar-db
4. Click "Create Database Cluster"
5. Wait 3-5 minutes for database to be ready
6. **SAVE** the connection details:
   - Host
   - Port
   - Username
   - Password
   - Database name

---

## STEP 3: Deploy Backend API (20 minutes)

1. Click "Create" → "Apps"
2. Choose "GitHub" as source
3. Authorize DigitalOcean to access your GitHub
4. Select repository: `sherazdilbar/ozar-service-platform`
5. Configure:
   - **Branch**: main
   - **Source Directory**: `/apps/backend`
   - **Autodeploy**: Yes (auto-deploy on git push)
6. Click "Next"
7. Configure App:
   - **Name**: ozar-backend
   - **Region**: Frankfurt
   - **Plan**: Basic ($12/month - covered by credit)
   - **Build Command**: `npm install && npm run build`
   - **Run Command**: `npm run start:prod`
8. Add Environment Variables (click "Edit" next to Environment Variables):

```
NODE_ENV=production
PORT=8080
DATABASE_URL=<paste from Step 2>
JWT_SECRET=<generate below>
SESSION_SECRET=<generate below>
MAPBOX_TOKEN=pk.eyJ1Ijoic2hlcmF6ZHgiLCJhIjoiY21qbGcxOGY5MjRvODNlcXp2ZTRtNnFmeCJ9.xGKn0xxUlMtDg0rdkkH7aA
FRONTEND_URL=https://ozar.hu
CORS_ORIGIN=https://ozar.hu,https://www.ozar.hu
```

**Generate Secrets** (run these commands locally and copy the output):
```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Session Secret  
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

9. Click "Next" → "Create Resources"
10. Wait 5-10 minutes for deployment
11. **SAVE** the backend URL (e.g., `ozar-backend-xxxxx.ondigitalocean.app`)

---

## STEP 4: Run Database Migrations (5 minutes)

1. In DigitalOcean App Platform, go to your backend app
2. Click "Console" tab
3. Run these commands:

```bash
npx prisma migrate deploy
npx prisma db seed
```

4. This will:
   - Create all database tables
   - Seed categories and Budapest districts
   - Create your admin account

---

## STEP 5: Deploy Frontend (15 minutes)

1. Click "Create" → "Apps" again
2. Choose same GitHub repository
3. Configure:
   - **Branch**: main
   - **Source Directory**: `/apps/web`
   - **Autodeploy**: Yes
4. Click "Next"
5. Configure App:
   - **Name**: ozar-frontend
   - **Region**: Frankfurt
   - **Plan**: Basic ($12/month - covered by credit)
   - **Build Command**: `npm install && npm run build`
   - **Run Command**: `npm start`
6. Add Environment Variables:

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=<backend URL from Step 3>
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoic2hlcmF6ZHgiLCJhIjoiY21qbGcxOGY5MjRvODNlcXp2ZTRtNnFmeCJ9.xGKn0xxUlMtDg0rdkkH7aA
NEXT_PUBLIC_SOCKET_URL=<backend URL from Step 3>
```

7. Click "Next" → "Create Resources"
8. Wait 5-10 minutes for deployment
9. **SAVE** the frontend URL (e.g., `ozar-frontend-xxxxx.ondigitalocean.app`)

---

## STEP 6: Configure DNS at Sybell (15 minutes)

1. Login to Sybell: https://center.sybell.hu/index.php/login
   - Email: sheraz.jutt9080@gmail.com
   - Password: Alternate@123

2. Find your domain "ozar.hu" and click "Manage DNS"

3. Add these DNS records:

**For Frontend (ozar.hu):**
- Type: `CNAME`
- Name: `@` (or leave blank)
- Value: `<your-frontend-url>.ondigitalocean.app`
- TTL: 3600

**For Frontend (www.ozar.hu):**
- Type: `CNAME`
- Name: `www`
- Value: `<your-frontend-url>.ondigitalocean.app`
- TTL: 3600

**For Backend (api.ozar.hu):**
- Type: `CNAME`
- Name: `api`
- Value: `<your-backend-url>.ondigitalocean.app`
- TTL: 3600

4. Save changes
5. Wait 10-30 minutes for DNS propagation

---

## STEP 7: Configure Custom Domains in DigitalOcean (10 minutes)

### Backend App:
1. Go to your backend app in DigitalOcean
2. Click "Settings" → "Domains"
3. Click "Add Domain"
4. Enter: `api.ozar.hu`
5. DigitalOcean will automatically provision SSL certificate

### Frontend App:
1. Go to your frontend app in DigitalOcean
2. Click "Settings" → "Domains"
3. Click "Add Domain"
4. Enter: `ozar.hu`
5. Click "Add Domain" again
6. Enter: `www.ozar.hu`
7. DigitalOcean will automatically provision SSL certificates

---

## STEP 8: Update Environment Variables with Custom Domains (5 minutes)

### Backend App:
Update these environment variables:
```
FRONTEND_URL=https://ozar.hu
CORS_ORIGIN=https://ozar.hu,https://www.ozar.hu
```

### Frontend App:
Update these environment variables:
```
NEXT_PUBLIC_API_URL=https://api.ozar.hu
NEXT_PUBLIC_SOCKET_URL=https://api.ozar.hu
```

Both apps will automatically redeploy after updating environment variables.

---

## STEP 9: Test Your Deployment (15 minutes)

1. **Wait for DNS propagation** (10-30 minutes after Step 6)
2. **Test the website**:
   - Visit: https://ozar.hu
   - Should see the homepage
3. **Test admin login**:
   - Go to: https://ozar.hu/auth/login
   - Email: sheraz.jutt9080@gmail.com
   - Password: Alternate@123
4. **Test features**:
   - Browse services
   - View map
   - Check if categories load
   - Test search functionality

---

## STEP 10: Configure Mobile App (5 minutes)

Update mobile app environment variables:

**File**: `apps/mobile/.env`
```
EXPO_PUBLIC_API_URL=https://api.ozar.hu
EXPO_PUBLIC_SOCKET_URL=https://api.ozar.hu
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoic2hlcmF6ZHgiLCJhIjoiY21qbGcxOGY5MjRvODNlcXp2ZTRtNnFmeCJ9.xGKn0xxUlMtDg0rdkkH7aA
```

Rebuild mobile app:
```bash
cd apps/mobile
npm run build
```

---

## Troubleshooting

### Backend not starting?
- Check logs in DigitalOcean console
- Verify DATABASE_URL is correct
- Ensure migrations ran successfully

### Frontend not loading?
- Check if NEXT_PUBLIC_API_URL is correct
- Verify backend is running
- Check browser console for errors

### DNS not working?
- Wait longer (can take up to 48 hours, usually 30 minutes)
- Check DNS propagation: https://dnschecker.org
- Verify CNAME records are correct in Sybell

### SSL certificate issues?
- DigitalOcean auto-provisions SSL (takes 5-10 minutes)
- Check "Domains" section in app settings
- Ensure DNS is pointing correctly

---

## Cost Breakdown (Monthly)

- Backend App: $12/month
- Frontend App: $12/month
- PostgreSQL Database: $15/month
- **Total**: $39/month
- **Your Cost**: $0 for first 5 months (using $200 credit)

---

## Post-Deployment Workflow

### Making Code Changes:
```bash
# 1. Make changes locally
# 2. Test locally
# 3. Commit and push
git add .
git commit -m "your changes"
git push origin main

# 4. DigitalOcean auto-deploys in 2-5 minutes
```

### Monitoring:
- DigitalOcean Dashboard: https://cloud.digitalocean.com
- View logs, metrics, and alerts
- Set up email notifications for deployments

### Scaling:
- Upgrade plans as traffic grows
- Add more database storage
- Enable CDN for faster loading

---

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Create test pro accounts
3. ✅ Create test customer accounts
4. ✅ Test booking flow end-to-end
5. ✅ Set up SendGrid for emails (optional)
6. ✅ Configure payment gateway (Stripe/PayPal)
7. ✅ Add Google Analytics
8. ✅ Set up monitoring (Sentry for errors)
9. ✅ Create backup strategy
10. ✅ Launch marketing campaign!

---

## Support

If you encounter any issues:
1. Check DigitalOcean logs
2. Check GitHub Actions (if enabled)
3. Contact DigitalOcean support (24/7 chat)
4. Check documentation: https://docs.digitalocean.com

---

## Summary

You now have:
- ✅ Production-ready backend API at api.ozar.hu
- ✅ Production-ready frontend at ozar.hu
- ✅ PostgreSQL database with all data
- ✅ SSL certificates (HTTPS)
- ✅ Auto-deployment on git push
- ✅ Admin account ready to use
- ✅ Mobile app configured

**Your platform is LIVE! 🎉**
