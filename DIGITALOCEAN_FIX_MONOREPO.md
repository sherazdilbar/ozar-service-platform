# Fix DigitalOcean Monorepo Build

## Problem
The backend can't find `@ozar/shared` package because DigitalOcean is only deploying `/apps/backend` directory.

## Solution
Change the source directory to root and update build commands.

---

## Steps to Fix:

### 1. Go to Your Backend App Settings

1. Open your backend app in DigitalOcean
2. Click **"Settings"** tab
3. Scroll to **"App Spec"** section
4. Click **"Edit"**

### 2. Update the Source Directory

Find the section that says:
```yaml
source_dir: /apps/backend
```

**Change it to:**
```yaml
source_dir: /
```

### 3. Update Build Command

Find:
```yaml
build_command: npm install && npm run build
```

**Change it to:**
```yaml
build_command: npm install && cd apps/backend && npm install && npm run build
```

### 4. Update Run Command

Find:
```yaml
run_command: npm run start:prod
```

**Change it to:**
```yaml
run_command: cd apps/backend && npm run start:prod
```

### 5. Save and Redeploy

1. Click **"Save"**
2. DigitalOcean will automatically redeploy
3. Wait 5-10 minutes for the build

---

## Alternative: Edit App Spec Directly

If you prefer to edit the YAML directly:

1. Go to Settings → App Spec
2. Click "Edit" 
3. Find your backend component
4. Update these fields:

```yaml
- name: ozar-backend
  source_dir: /
  build_command: npm install && cd apps/backend && npm install && npm run build
  run_command: cd apps/backend && npm run start:prod
```

5. Save and redeploy

---

## What This Does:

- **source_dir: /**  
  Deploys the entire repository (including `packages/shared`)

- **npm install** (at root)  
  Installs root dependencies and sets up the monorepo

- **cd apps/backend && npm install**  
  Installs backend-specific dependencies

- **npm run build**  
  Builds the backend (can now access @ozar/shared)

- **cd apps/backend && npm run start:prod**  
  Runs the backend from the correct directory

---

## After This Fix:

The build should succeed because:
- ✅ Backend can access `packages/shared`
- ✅ All monorepo dependencies are available
- ✅ TypeScript can resolve `@ozar/shared` imports

---

Let me know when you've made these changes and I'll help you verify the deployment!
