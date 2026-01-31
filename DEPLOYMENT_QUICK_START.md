# Quick Start Deployment Guide

## Your Information (Ready to Use)
- ✅ GitHub: https://github.com/sherazdilbar/ozar-service-platform
- ✅ Mapbox Token: pk.eyJ1Ijoic2hlcmF6ZHgiLCJhIjoiY21qbGcxOGY5MjRvODNlcXp2ZTRtNnFmeCJ9.xGKn0xxUlMtDg0rdkkH7aA
- ✅ Admin Email: sheraz.jutt9080@gmail.com
- ✅ Admin Password: Alternate@123
- ✅ Sybell DNS: https://center.sybell.hu/index.php/login

## Generated Secrets (Copy These)
```
JWT_SECRET=8deb7a6a10f0c976694811736bb886c26d774c9ff9caea9fb633de68a0d97fc9c1b85b33edcac8b7bf4a44c2eaa13d77176782ac816cc9c86cd50dfd7b4219dd

SESSION_SECRET=d0d1291189afcdb1efe32e44103d651b7305a30474173bffb87f3d7e3dd92a5e09b39c59ba65fd003f8710640cb093fbd6c3aebc4621556e1871da08b452494f
```

---

## Step-by-Step (Follow in Order)

### 1️⃣ Activate DigitalOcean (5 min)
- Go to: https://education.github.com/pack
- Find DigitalOcean → Get $200 credit
- Create account with: sheraz.jutt9080@gmail.com

### 2️⃣ Create Database (10 min)
- Login: https://cloud.digitalocean.com
- Create → Databases → PostgreSQL 15
- Region: Frankfurt
- Plan: Basic ($15/month)
- Name: ozar-db
- **SAVE connection string**

### 3️⃣ Deploy Backend (20 min)
- Create → Apps → GitHub
- Repository: sherazdilbar/ozar-service-platform
- Source Directory: `/apps/backend`
- Region: Frankfurt
- Plan: Basic ($12/month)
- Build: `npm install && npm run build`
- Run: `npm run start:prod`

**Environment Variables:**
```
NODE_ENV=production
PORT=8080
DATABASE_URL=<from step 2>
JWT_SECRET=8deb7a6a10f0c976694811736bb886c26d774c9ff9caea9fb633de68a0d97fc9c1b85b33edcac8b7bf4a44c2eaa13d77176782ac816cc9c86cd50dfd7b4219dd
SESSION_SECRET=d0d1291189afcdb1efe32e44103d651b7305a30474173bffb87f3d7e3dd92a5e09b39c59ba65fd003f8710640cb093fbd6c3aebc4621556e1871da08b452494f
MAPBOX_TOKEN=pk.eyJ1Ijoic2hlcmF6ZHgiLCJhIjoiY21qbGcxOGY5MjRvODNlcXp2ZTRtNnFmeCJ9.xGKn0xxUlMtDg0rdkkH7aA
FRONTEND_URL=https://ozar.hu
CORS_ORIGIN=https://ozar.hu,https://www.ozar.hu
```

- **SAVE backend URL**

### 4️⃣ Run Migrations (5 min)
- Backend app → Console tab
- Run:
```bash
npx prisma migrate deploy
npx prisma db seed
```

### 5️⃣ Deploy Frontend (15 min)
- Create → Apps → GitHub (same repo)
- Source Directory: `/apps/web`
- Region: Frankfurt
- Plan: Basic ($12/month)
- Build: `npm install && npm run build`
- Run: `npm start`

**Environment Variables:**
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=<backend URL from step 3>
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoic2hlcmF6ZHgiLCJhIjoiY21qbGcxOGY5MjRvODNlcXp2ZTRtNnFmeCJ9.xGKn0xxUlMtDg0rdkkH7aA
NEXT_PUBLIC_SOCKET_URL=<backend URL from step 3>
```

- **SAVE frontend URL**

### 6️⃣ Configure DNS (15 min)
- Login Sybell: https://center.sybell.hu/index.php/login
- Manage DNS for ozar.hu
- Add CNAME records:
  - `@` → `<frontend-url>.ondigitalocean.app`
  - `www` → `<frontend-url>.ondigitalocean.app`
  - `api` → `<backend-url>.ondigitalocean.app`

### 7️⃣ Add Custom Domains (10 min)
- Backend app → Settings → Domains → Add `api.ozar.hu`
- Frontend app → Settings → Domains → Add `ozar.hu` and `www.ozar.hu`

### 8️⃣ Update URLs (5 min)
**Backend Environment Variables:**
```
FRONTEND_URL=https://ozar.hu
CORS_ORIGIN=https://ozar.hu,https://www.ozar.hu
```

**Frontend Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://api.ozar.hu
NEXT_PUBLIC_SOCKET_URL=https://api.ozar.hu
```

### 9️⃣ Test (15 min)
- Wait 30 minutes for DNS
- Visit: https://ozar.hu
- Login: sheraz.jutt9080@gmail.com / Alternate@123
- Test features

### 🔟 Update Mobile App (5 min)
Edit `apps/mobile/.env`:
```
EXPO_PUBLIC_API_URL=https://api.ozar.hu
EXPO_PUBLIC_SOCKET_URL=https://api.ozar.hu
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoic2hlcmF6ZHgiLCJhIjoiY21qbGcxOGY5MjRvODNlcXp2ZTRtNnFmeCJ9.xGKn0xxUlMtDg0rdkkH7aA
```

---

## Total Time: ~2 hours
## Total Cost: $0 (using $200 credit)

---

## After Deployment

**Make changes:**
```bash
git add .
git commit -m "changes"
git push origin main
# Auto-deploys in 2-5 minutes
```

**Access:**
- Website: https://ozar.hu
- Admin: https://ozar.hu/auth/login
- API: https://api.ozar.hu
- Dashboard: https://cloud.digitalocean.com

---

## Need Help?
- Full guide: See DIGITALOCEAN_DEPLOYMENT_GUIDE.md
- DigitalOcean support: 24/7 chat available
- Check logs in DigitalOcean console

---

## You're Ready! 🚀
Follow the steps above and your platform will be live on ozar.hu!
