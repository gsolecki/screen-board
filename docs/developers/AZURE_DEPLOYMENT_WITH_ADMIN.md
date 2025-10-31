# Azure Static Web Apps Deployment Guide - With Admin Panel

## Overview

This guide covers deploying the Screen Board application with the KCC Admin Panel to Azure Static Web Apps. The application now includes routing and requires special configuration.

## Prerequisites

- ✅ Azure account with active subscription
- ✅ Azure CLI installed
- ✅ Node.js 18+ installed
- ✅ Application built successfully (`npm run build`)

## Important: Admin Panel Deployment Considerations

### How the Admin Panel Works in Production

1. **Data Storage**: Uses browser localStorage (client-side only)
2. **Data File**: Original data is served from `/data/kcc-pool.json`
3. **Routing**: Uses React Router with client-side routing
4. **Single Page App**: All routes must resolve to `index.html`

### Key Files for Deployment

```
dist/
├── index.html                    # Main SPA entry point
├── staticwebapp.config.json      # Azure SWA configuration
├── data/
│   └── kcc-pool.json            # Original tournament data
└── assets/
    ├── *.js                      # Bundled JavaScript
    ├── *.css                     # Bundled CSS
    └── *.png                     # Images
```

## Build Process

### 1. Build the Application

```bash
npm run build
```

This will:
- Build the React application
- Copy `kcc-pool.json` to `dist/data/`
- Copy `staticwebapp.config.json` to `dist/`

### 2. Verify Build Output

```bash
# Check dist folder structure
ls -la dist/

# Should see:
# - index.html
# - staticwebapp.config.json
# - data/ folder
# - assets/ folder
```

### 3. Test Locally

```bash
npm run preview
```

Then test:
- Main display: `http://localhost:4173/`
- Admin panel: `http://localhost:4173/admin/kcc/standings`

## Azure Deployment

### Option 1: Azure CLI Deployment

```bash
# 1. Login to Azure
az login

# 2. Get deployment token
az staticwebapp secrets list \
  --name screenboard \
  --resource-group screenboard-rg \
  --query "properties.apiKey" -o tsv

# 3. Deploy using SWA CLI
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token <YOUR_TOKEN> \
  --env production
```

### Option 2: GitHub Actions (Recommended)

Create `.github/workflows/azure-static-web-apps.yml`:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "dist"
          skip_app_build: true

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

## Post-Deployment Configuration

### 1. Verify Routing Works

After deployment, test these URLs:

```
✅ https://your-site.azurestaticapps.net/
✅ https://your-site.azurestaticapps.net/admin/kcc/standings
```

Both should load without 404 errors.

### 2. Test Admin Panel Functionality

1. Navigate to `/admin/kcc/standings`
2. Select a division and group
3. Mark a match as played
4. Enter test scores
5. Click "Back to Display"
6. Verify standings show the test data

### 3. Test Data Persistence

1. Enter some match results
2. Close browser tab
3. Reopen admin panel
4. Verify data persists

## Configuration Files Explained

### staticwebapp.config.json

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/data/*", "/assets/*", "*.{css,scss,js,png,gif,ico,jpg,svg,json}"]
  },
  "routes": [
    {
      "route": "/data/*",
      "headers": {
        "Cache-Control": "public, max-age=3600"
      }
    }
  ],
  "mimeTypes": {
    ".json": "application/json"
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html",
      "statusCode": 200
    }
  }
}
```

**What this does:**
- **navigationFallback**: Routes all non-asset requests to index.html (SPA routing)
- **routes**: Sets cache headers for data files
- **mimeTypes**: Ensures JSON files are served correctly
- **responseOverrides**: Handles 404s by serving index.html with 200 status

### vite.config.js

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/', // ⚠️ IMPORTANT: Must be '/' for Azure SWA
  // ... other config
})
```

**Why `base: '/'`?**
- Azure Static Web Apps expects absolute paths
- `base: './'` breaks routing and data fetching

## Troubleshooting

### Issue: Admin panel shows 404

**Solution:**
- Verify `staticwebapp.config.json` is in dist folder
- Check `base: '/'` in vite.config.js
- Redeploy after fixing

### Issue: Data file not loading

**Symptoms:**
- Blank screen
- Console error: "Cannot convert undefined or null to object"

**Solution:**
1. Check dist/data/kcc-pool.json exists
2. Verify build process: `npm run build`
3. Check browser network tab for 404 on /data/kcc-pool.json

### Issue: Routing doesn't work after refresh

**Solution:**
- Verify `navigationFallback` in staticwebapp.config.json
- Ensure config file is deployed to dist folder

### Issue: localStorage data lost

**Explanation:**
- localStorage is browser-specific and client-side only
- Data doesn't sync across devices or browsers
- Data is lost if user clears browser cache

**For Production:**
Consider implementing a backend API if you need:
- Multi-device sync
- Multi-admin support
- Data backup and recovery
- Audit trail

## Data Management in Production

### Current Approach (localStorage)

✅ **Pros:**
- No backend required
- Fast and simple
- Works offline
- Free (no database costs)

❌ **Cons:**
- Browser-specific (no sync)
- Lost on cache clear
- No backup/recovery
- Single admin only

### Recommended for Production: Backend API

For a production tournament with multiple administrators:

1. **Create Azure Function App** for API
2. **Add Cosmos DB** for data storage
3. **Implement API endpoints:**
   - GET /api/matches
   - POST /api/matches/:id
   - GET /api/standings
4. **Update admin panel** to use API instead of localStorage

## Custom Domain Setup

If using custom domain (e.g., chiqchic.com):

```bash
# Add custom domain
az staticwebapp hostname set \
  --name screenboard \
  --resource-group screenboard-rg \
  --hostname chiqchic.com

# Verify DNS records
# Add CNAME: chiqchic.com -> your-swa.azurestaticapps.net
```

## Security Considerations

### ⚠️ Admin Panel is Public

**Current State:**
- No authentication
- Anyone with the URL can edit scores

**For Production, Add:**
1. **Authentication** (Azure AD, Auth0, etc.)
2. **Access control** (admin roles)
3. **Audit logging** (who changed what, when)
4. **Rate limiting** (prevent abuse)

### Quick Security Fix

Add to `staticwebapp.config.json`:

```json
{
  "routes": [
    {
      "route": "/admin/*",
      "allowedRoles": ["admin"]
    }
  ],
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "clientIdSettingName": "AAD_CLIENT_ID"
        }
      }
    }
  }
}
```

## Monitoring and Maintenance

### Check Application Health

```bash
# View deployment logs
az staticwebapp show \
  --name screenboard \
  --resource-group screenboard-rg

# View custom domains
az staticwebapp hostname list \
  --name screenboard \
  --resource-group screenboard-rg
```

### Regular Maintenance

- **Export data regularly** via admin panel
- **Monitor Azure costs** (should be minimal/free tier)
- **Test before tournaments** to ensure working
- **Keep backup** of exported JSON files

## Deployment Checklist

- [ ] Run `npm run build`
- [ ] Verify dist/staticwebapp.config.json exists
- [ ] Verify dist/data/kcc-pool.json exists
- [ ] Test locally with `npm run preview`
- [ ] Test both routes (/ and /admin/kcc/standings)
- [ ] Deploy to Azure
- [ ] Test production URLs
- [ ] Test admin panel in production
- [ ] Enter test match result
- [ ] Verify standings update
- [ ] Clear test data
- [ ] Document admin URL for tournament staff
- [ ] Train backup admin
- [ ] Export clean data as starting point

## Support

For deployment issues:
- Check Azure Portal for deployment logs
- Review staticwebapp.config.json syntax
- Verify vite.config.js base setting
- Test build locally first
- Check browser console for errors

## Summary

The admin panel will work in Azure Static Web Apps as long as:
1. ✅ `base: '/'` in vite.config.js
2. ✅ `staticwebapp.config.json` with proper routing
3. ✅ `/data/kcc-pool.json` is accessible
4. ✅ Build includes all necessary files

The app uses client-side localStorage for data persistence, which works great for single-device tournament management but should be upgraded to a backend API for multi-device or multi-admin scenarios.

