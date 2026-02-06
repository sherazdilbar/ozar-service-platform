# Frontend Deployment - Detailed Steps

## Prerequisites
✅ Backend deployed: https://ozar-app-g4w6h.ondigitalocean.app/api/v1
✅ Database seeded with 65+ pros
✅ Admin account created

---

## Step 1: Create New App on DigitalOcean

1. Go to: https://cloud.digitalocean.com/apps
2. Click the **"Create"** button (top right)
3. Select **"Apps"** from the dropdown

---

## Step 2: Connect GitHub Repository

1. **Source**: Select **"GitHub"**
2. If not connected, click **"Manage Access"** and authorize DigitalOcean
3. **Repository**: Select `sherazdilbar/ozar-service-platform`
4. **Branch**: Select `main` (or your default branch)
5. Click **"Next"**

---

## Step 3: Configure Resources

### Edit Web Service Settings:

1. DigitalOcean will auto-detect your apps. Find the one for **web** or click **"Edit Plan"**

2. **Resource Name**: Change to `ozar-web` (or keep default)

3. **Source Directory**: 
   - Click **"Edit"** next to Source Directory
   - Change from `/apps/backend` to: `/apps/web`
   - Click **"Save"**

4. **Build Command**:
   - Click **"Edit"** next to Build Command
   - Enter: `npm install && npm run build`
   - Click **"Save"**

5. **Run Command**:
   - Click **"Edit"** next to Run Command  
   - Enter: `npm start`
   - Click **"Save"**

6. **HTTP Port**: Should be `3000` (auto-detected)

7. **HTTP Request Routes**: `/` (default, keep as is)

---

## Step 4: Configure Environment Variables

1. Scroll down to **"Environment Variables"** section
2. Click **"Edit"** or **"Add Variable"**
3. Add these variables one by one:

### Variable 1:
- **Key**: `NODE_ENV`
- **Value**: `production`
- **Encrypt**: No

### Variable 2:
- **Key**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://ozar-app-g4w6h.ondigitalocean.app/api/v1`
- **Encrypt**: No

### Variable 3:
- **Key**: `NEXT_PUBLIC_MAPBOX_TOKEN`
- **Value**: `pk.eyJ1Ijoic2hlcmF6ZHgiLCJhIjoiY21qbGcxOGY5MjRvODNlcXp2ZTRtNnFmeCJ9.xGKn0xxUlMtDg0rdkkH7aA`
- **Encrypt**: No

### Variable 4:
- **Key**: `NEXT_PUBLIC_SOCKET_URL`
- **Value**: `https://ozar-app-g4w6h.ondigitalocean.app`
- **Encrypt**: No

4. Click **"Save"** after adding all variables

---

## Step 5: Select Region

1. **Region**: Select **"Frankfurt - FRA1"** (same as backend)
2. This ensures low latency between frontend and backend

---

## Step 6: Choose Plan

1. **Plan Type**: Select **"Basic"**
2. **Size**: Select **"Basic ($12/month)**
   - 1 GB RAM
   - 1 vCPU
   - Sufficient for Next.js app

---

## Step 7: Name Your App

1. **App Name**: Enter `ozar-web` (or your preferred name)
2. This will create URL: `ozar-web-xxxxx.ondigitalocean.app`

---

## Step 8: Review and Create

1. Review all settings:
   - ✅ Source Directory: `/apps/web`
   - ✅ Build Command: `npm install && npm run build`
   - ✅ Run Command: `npm start`
   - ✅ Environment Variables: 4 variables added
   - ✅ Region: Frankfurt
   - ✅ Plan: Basic $12/month

2. Click **"Create Resources"** button at the bottom

---

## Step 9: Wait for Deployment

1. DigitalOcean will now:
   - Clone your repository
   - Install dependencies
   - Build the Next.js app
   - Deploy to production

2. **Expected time**: 5-10 minutes

3. **Watch the build logs**:
   - Click on the app name
   - Go to **"Activity"** tab
   - Watch real-time logs

---

## Step 10: Verify Deployment

Once deployment completes:

1. **Get your frontend URL**: 
   - Should be something like: `https://ozar-web-xxxxx.ondigitalocean.app`

2. **Test the website**:
   - Visit the URL in your browser
   - You should see the Ozar homepage
   - Try searching for services
   - Test login with: admin@ozar.com / admin123

---

## Common Issues & Solutions

### Issue 1: Build Fails
**Solution**: Check build logs for errors. Common fixes:
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors
- Verify environment variables are set

### Issue 2: App Shows 404
**Solution**: 
- Verify Run Command is `npm start` (not `npm run dev`)
- Check HTTP Port is `3000`

### Issue 3: Can't Connect to Backend
**Solution**:
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running and healthy
- Test backend URL directly: `https://ozar-app-g4w6h.ondigitalocean.app/api/v1/health`

---

## After Successful Deployment

### Update Backend CORS Settings

1. Go to your **backend app** in DigitalOcean
2. Go to **Settings** → **App-Level Environment Variables**
3. Find `CORS_ORIGIN` variable
4. Update value to include your new frontend URL:
   ```
   https://ozar-web-xxxxx.ondigitalocean.app
   ```
5. Click **"Save"**
6. Backend will automatically redeploy

---

## Next Steps After Frontend is Live

1. ✅ Test all features on the live site
2. ✅ Configure custom domain (ozar.hu)
3. ✅ Set up DNS at Sybell
4. ✅ Add SSL certificate (automatic with custom domain)
5. ✅ Update mobile app environment variables

---

## Quick Reference

**Backend URL**: `https://ozar-app-g4w6h.ondigitalocean.app/api/v1`
**Frontend URL**: `https://ozar-web-xxxxx.ondigitalocean.app` (you'll get this after deployment)

**Admin Login**:
- Email: admin@ozar.com
- Password: admin123

**Test Pro Login** (any category):
- Email: electrician0@ozar.com (or any category)
- Password: test123

---

## Need Help?

If you encounter any issues:
1. Check the build logs in DigitalOcean Activity tab
2. Verify all environment variables are correct
3. Test backend health endpoint
4. Check that source directory is `/apps/web`

Let me know at which step you need help!
