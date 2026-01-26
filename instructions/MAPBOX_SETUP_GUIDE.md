# Mapbox Setup Guide - Quick Start

## The map is currently using a demo token with limited functionality.

To get full map functionality, follow these steps:

### Step 1: Get Your Free Mapbox Token (2 minutes)

1. Go to: **https://account.mapbox.com/auth/signup/**
2. Sign up with your email (it's free!)
3. After signing up, you'll be redirected to your account page
4. Click on "Access tokens" in the left sidebar
5. You'll see a "Default public token" - **copy this token**

### Step 2: Add Token to Your Project

1. Open the file: `apps/web/.env.local`
2. Replace the line:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```
   With:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV4YW1wbGUifQ.your_actual_token
   ```
   (Paste your actual token from step 1)

3. Save the file

### Step 3: Restart the Development Server

1. Stop the current server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   cd apps/web
   npm run dev
   ```

### Step 4: Test the Map

1. Go to: http://localhost:3001
2. Click the "🗺️ Map" button
3. You should now see a fully functional interactive map!

## What You Get with Your Token:

✅ **Free Tier Includes:**
- 50,000 map loads per month
- 50,000 geocoding requests per month
- 100,000 directions requests per month
- No credit card required!

## Troubleshooting

### Map shows but is gray/blank:
- Check browser console (F12) for errors
- Verify your token is correct in `.env.local`
- Make sure you restarted the dev server after adding the token

### "Unauthorized" error:
- Your token might be invalid
- Go back to https://account.mapbox.com/access-tokens/
- Create a new token or copy the default one again

### Map not loading at all:
- Check browser console for errors
- Make sure `NEXT_PUBLIC_` prefix is in the env variable name
- Verify the file is named `.env.local` (not `.env`)

## Current Status

The map is using a **demo token** which has:
- ⚠️ Limited requests
- ⚠️ May stop working if quota exceeded
- ⚠️ Shared by many users

**Get your own token for reliable, unlimited access!**

## Need Help?

Check the browser console (F12 → Console tab) for any error messages.
Common errors and solutions are in the troubleshooting section above.
