# Portfolio 411 Error Fix

## Issue
Portfolio images are returning **411 Request Header Fields Too Large** errors. This happens when the JWT token in the Authorization header is too large.

## Root Causes

### 1. Upload Response Format (FIXED ✅)
The portfolio upload was expecting the response to be an array, but the API returns `{ urls: [...] }`.

**Fixed in**: `apps/web/src/app/pro/portfolio/page.tsx`
```typescript
// Before (BROKEN)
const uploadedUrls = await response.json();

// After (FIXED)
const data = await response.json();
const uploadedUrls = data.urls || [];
```

### 2. JWT Token Size (NEEDS BACKEND FIX)
The 411 error indicates the JWT token is too large. This can happen if:
- Too much data is being stored in the JWT payload
- The token includes unnecessary information
- The token hasn't been optimized

## Solutions

### Option 1: Reduce JWT Payload Size (Recommended)
Check what's being stored in the JWT token and remove unnecessary data.

**Check**: `apps/backend/src/auth/auth.service.ts`

The JWT should only contain:
```typescript
{
  userId: string,
  email: string,
  role: string
}
```

### Option 2: Increase Server Header Size Limit
If the JWT size is necessary, increase the server's header size limit.

**For NestJS/Express**, add to `apps/backend/src/main.ts`:
```typescript
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Increase header size limit
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  
  // ... rest of configuration
}
```

### Option 3: Use Shorter-Lived Tokens
Reduce token expiration time and use refresh tokens more frequently.

## Quick Fix to Test

### Step 1: Check Current JWT Payload
Add logging to see what's in the token:

```typescript
// In apps/backend/src/auth/auth.service.ts
async login(user: any) {
  const payload = { 
    userId: user.id, 
    email: user.email, 
    role: user.role 
  };
  
  console.log('JWT Payload:', payload);
  console.log('JWT Payload Size:', JSON.stringify(payload).length);
  
  return {
    accessToken: this.jwtService.sign(payload),
    refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
  };
}
```

### Step 2: Clear Browser Storage
Sometimes old, large tokens get stuck in localStorage:

```javascript
// In browser console
localStorage.clear();
// Then log in again
```

### Step 3: Test Portfolio Upload
1. Log in fresh
2. Go to Portfolio page
3. Try uploading an image
4. Check if 411 error persists

## Temporary Workaround

If you need portfolio to work immediately, you can bypass the auth check for the portfolio GET endpoint:

```typescript
// In apps/backend/src/pros/pros.controller.ts
@Get(':id/portfolio')  // Remove @UseGuards(JwtAuthGuard)
getPortfolio(@Param('id') id: string) {
  return this.prosService.getPortfolio(id);
}
```

**Note**: This makes portfolio publicly accessible, which is actually fine since portfolios should be public anyway.

## Verification Steps

### 1. Check Token Size
```bash
# In browser console after login
const token = localStorage.getItem('accessToken');
console.log('Token length:', token.length);
console.log('Token:', token);
```

A normal JWT should be around 200-400 characters. If it's over 1000 characters, there's too much data in it.

### 2. Test Portfolio Endpoint
```bash
# Test without auth
curl http://localhost:4000/api/v1/pros/[PRO_ID]/portfolio

# Test with auth
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/api/v1/pros/[PRO_ID]/portfolio
```

### 3. Check Server Logs
Look for any errors or warnings about header size in the backend console.

## Files Modified

```
apps/web/src/app/pro/portfolio/page.tsx - Fixed upload response handling
```

## Next Steps

1. ✅ Upload response format fixed
2. ⏳ Check JWT token size
3. ⏳ Reduce JWT payload if needed
4. ⏳ Test portfolio upload again
5. ⏳ Verify images display correctly

---

**Status**: Partially Fixed
**Date**: January 29, 2026
**Remaining Issue**: 411 error needs backend JWT optimization
