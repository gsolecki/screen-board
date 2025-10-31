# ✅ DEPLOYMENT CHECKLIST - Screen Board with Admin Panel

## Pre-Deployment Verification

### 1. Local Build Test
```bash
# Clean build
rm -rf dist node_modules/.vite
npm run build

# Verify build output
ls -la dist/
ls -la dist/data/

# Expected files:
# ✓ dist/index.html
# ✓ dist/staticwebapp.config.json  
# ✓ dist/data/concessions.json
# ✓ dist/data/kcc-pool.json
# ✓ dist/assets/*.js
# ✓ dist/assets/*.css
# ✓ dist/assets/*.png
```

### 2. Local Preview Test
```bash
npm run preview
```

**Test URLs:**
- [ ] http://localhost:4173/ - Main display loads
- [ ] http://localhost:4173/admin/kcc/standings - Admin panel loads

**Test Slides:**
- [ ] Concessions slide displays menu
- [ ] KCC Standings slide displays standings
- [ ] KCC Schedule slide displays matches
- [ ] Navigation works (arrow keys, space)
- [ ] Auto-rotation works

**Test Admin:**
- [ ] Division and group selection works
- [ ] Can mark match as played
- [ ] Can enter scores
- [ ] Data saves automatically
- [ ] "Back to Display" works
- [ ] Export data works
- [ ] Reset data works

**Test Data Flow:**
- [ ] Enter test score in admin
- [ ] Navigate back to display
- [ ] Wait for standings slide
- [ ] Verify test score shows in standings
- [ ] Clear test data

### 3. File Verification
```bash
# Check file sizes (approximate)
du -h dist/data/concessions.json    # ~1.6 KB
du -h dist/data/kcc-pool.json       # ~12.7 KB
du -h dist/index.html                # ~0.7 KB
du -h dist/staticwebapp.config.json  # ~0.6 KB

# Check data files are valid JSON
cat dist/data/concessions.json | jq . > /dev/null && echo "✓ Valid JSON"
cat dist/data/kcc-pool.json | jq . > /dev/null && echo "✓ Valid JSON"
```

## Azure Deployment

### Method 1: Azure CLI (Quick)

```bash
# 1. Login to Azure
az login

# 2. Get deployment token
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
  --name screenboard \
  --resource-group screenboard-rg \
  --query "properties.apiKey" -o tsv)

# 3. Deploy
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token $DEPLOYMENT_TOKEN \
  --env production

# 4. Wait for deployment (usually 1-2 minutes)
# Check output for deployment URL
```

### Method 2: GitHub Actions (Recommended for CI/CD)

**Already configured in `.github/workflows/azure-static-web-apps.yml`**

```bash
# Just push to main branch
git add .
git commit -m "Admin panel with production fixes"
git push origin main

# GitHub Actions will automatically:
# 1. Build the app
# 2. Deploy to Azure
# 3. Update production site
```

## Post-Deployment Verification

### 1. Production URL Access
```bash
# Replace with your actual URL
PROD_URL="https://chiqchic.com"
# or
PROD_URL="https://icy-hill-08e9aec10.3.azurestaticapps.net"
```

### 2. Test Data Files
```bash
curl -I $PROD_URL/data/concessions.json
# Expected: HTTP/2 200

curl -I $PROD_URL/data/kcc-pool.json  
# Expected: HTTP/2 200

# Test JSON validity
curl -s $PROD_URL/data/concessions.json | jq . > /dev/null && echo "✓ Valid"
curl -s $PROD_URL/data/kcc-pool.json | jq . > /dev/null && echo "✓ Valid"
```

### 3. Test Main Display
- [ ] Visit: `$PROD_URL/`
- [ ] Page loads without errors
- [ ] Concessions slide displays
- [ ] KCC Standings slide displays
- [ ] KCC Schedule slide displays
- [ ] Auto-rotation works
- [ ] Keyboard navigation works
- [ ] No console errors (F12)

### 4. Test Admin Panel
- [ ] Visit: `$PROD_URL/admin/kcc/standings`
- [ ] Admin panel loads
- [ ] Can select division/group
- [ ] Can view teams
- [ ] Can mark matches as played
- [ ] Can enter scores
- [ ] Data saves to localStorage
- [ ] Gear icon appears on main display
- [ ] "Back to Display" button works
- [ ] No console errors

### 5. Test End-to-End Flow
1. [ ] Open admin in one tab: `$PROD_URL/admin/kcc/standings`
2. [ ] Open display in another tab: `$PROD_URL/`
3. [ ] In admin: Select "12U Boy" → "Group A"
4. [ ] Mark first match as played
5. [ ] Enter test scores (e.g., 2-1)
6. [ ] Click "Back to Display"
7. [ ] Wait for KCC Standings slide
8. [ ] Verify scores appear correctly
9. [ ] Refresh admin tab
10. [ ] Verify scores persisted
11. [ ] Clear test data

### 6. Test on Multiple Devices
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Desktop Edge/Safari
- [ ] Mobile Chrome
- [ ] Mobile Safari
- [ ] Tablet (landscape mode)

### 7. Test Persistence
```bash
# In browser console (F12)
localStorage.getItem('kcc-pool-data')
# Should show saved data or null

# Test export
# Click "Export Data" in admin
# Verify JSON file downloads
# Check file has correct structure
```

## Tournament Day Setup

### 1. Before Tournament
```bash
# Export clean starting data
# 1. Visit: $PROD_URL/admin/kcc/standings
# 2. Click "Export Data"
# 3. Save as: kcc-pool-clean-2025-10-31.json
# 4. Keep in safe location
```

### 2. Device Setup
- [ ] Laptop/tablet fully charged
- [ ] Connected to reliable WiFi/power
- [ ] Bookmark admin URL
- [ ] Bookmark main display URL
- [ ] Test on actual display screen
- [ ] Train backup admin person
- [ ] Prepare paper score sheets

### 3. Display Setup
```bash
# Open on big screen/TV
$PROD_URL/

# Press F11 for fullscreen
# Let slides auto-rotate
# Keep open all day
```

### 4. Admin Setup
```bash
# Open on admin laptop/tablet
$PROD_URL/admin/kcc/standings

# Keep tab open all day
# Export data every hour as backup
```

## Monitoring

### Check Application Health
```bash
# Test responsiveness
curl -I $PROD_URL
# Should return: HTTP/2 200

# Check deployment status
az staticwebapp show \
  --name screenboard \
  --resource-group screenboard-rg \
  --query "{status:defaultHostname,location:location}"
```

### Check Azure Portal
- [ ] Login to portal.azure.com
- [ ] Navigate to "Static Web Apps"
- [ ] Select "screenboard"
- [ ] Check "Overview" for status
- [ ] Check "Environment" for deployment history
- [ ] Check "Custom domains" for SSL status

## Rollback Plan

### If Something Goes Wrong

**Option 1: Revert via Git**
```bash
# Find last working commit
git log --oneline

# Revert to previous version
git revert <commit-hash>
git push

# Wait for auto-deploy (if using GitHub Actions)
```

**Option 2: Redeploy Previous Build**
```bash
# If you have previous dist folder
npx @azure/static-web-apps-cli deploy ./dist-backup \
  --deployment-token $DEPLOYMENT_TOKEN \
  --env production
```

**Option 3: Manual Fix**
```bash
# Fix issue locally
npm run build

# Test thoroughly
npm run preview

# Deploy fixed version
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token $DEPLOYMENT_TOKEN \
  --env production
```

## Support Contacts

**During Tournament:**
- Technical Admin: [Name/Phone]
- Backup Admin: [Name/Phone]
- Tournament Director: [Name/Phone]

**Azure Support:**
- Portal: https://portal.azure.com
- Support: https://azure.microsoft.com/support

## Emergency Procedures

### Display Not Updating
1. Refresh browser (F5)
2. Check WiFi connection
3. Check browser console (F12) for errors
4. Restart browser
5. Use backup device

### Admin Panel Not Saving
1. Check browser console for errors
2. Verify localStorage is enabled
3. Try different browser
4. Export current data immediately
5. Use paper backup

### Site Down
1. Check Azure portal for service status
2. Verify DNS/domain settings
3. Test Azure default URL
4. Contact Azure support
5. Use printed materials as backup

## Success Metrics

### Deployment Success
- ✅ Build completes without errors
- ✅ All files present in dist/
- ✅ Deployment completes successfully
- ✅ Production URL accessible
- ✅ All routes work correctly

### Functionality Success  
- ✅ Main display loads and rotates
- ✅ Admin panel loads and functions
- ✅ Data persists correctly
- ✅ Export/import works
- ✅ No console errors

### Tournament Success
- ✅ Scores entered throughout day
- ✅ Standings update correctly
- ✅ No data loss
- ✅ Display visible to all
- ✅ Admin workflow smooth

## Final Checklist

- [ ] All pre-deployment tests pass
- [ ] Production deployment successful
- [ ] All post-deployment tests pass
- [ ] Admin trained on system
- [ ] Backup admin trained
- [ ] Emergency contacts documented
- [ ] Paper backup prepared
- [ ] Export clean starting data
- [ ] Test on tournament equipment
- [ ] Verify on tournament WiFi
- [ ] Everything ready for tournament day! 🎉

---

**Deployment Date:** _________________

**Deployed By:** _________________

**Production URL:** _________________

**Status:** _________________

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

