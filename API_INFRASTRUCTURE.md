# 📡 API Infrastructure Guide - Screen Board

## Overview

Your Screen Board application uses **Azure Static Web Apps** with integrated **Azure Functions** to provide the backend API that `KCCStandingsAdmin.jsx` depends on.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Azure Static Web App                        │
│                 (screenboard)                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   Frontend       │         │   API Functions  │         │
│  │   (React App)    │◄────────┤   (Node.js)      │         │
│  │                  │         │                  │         │
│  │  /               │         │  /api/matches    │         │
│  │  /admin/...      │         │  GET & POST      │         │
│  └──────────────────┘         └──────────────────┘         │
│                                        │                    │
└────────────────────────────────────────┼────────────────────┘
                                         │
                                         │ Reads/Writes
                                         ▼
                        ┌────────────────────────────┐
                        │  Azure Table Storage       │
                        │  (screenboardstorage)      │
                        │                            │
                        │  Table: kccMatches         │
                        │  - Division                │
                        │  - Group                   │
                        │  - Match Index             │
                        │  - Scores & Status         │
                        └────────────────────────────┘
```

---

## 🔌 API Endpoints

### 1. **GET /api/matches**
Retrieves all match data from Azure Table Storage.

**Used by:** `KCCStandingsAdmin.jsx` on component load (line 24)

**Example Request:**
```javascript
const response = await fetch('/api/matches');
const matches = await response.json();
```

**Response:**
```json
[
  {
    "division": "12U Boy",
    "group": "A",
    "matchIndex": 0,
    "homeScore": 3,
    "awayScore": 1,
    "matchPlayed": "Y",
    "date": "2024-06-15",
    "time": "10:00",
    "field": "Field 1",
    "lastUpdated": "2024-06-15T14:30:00Z"
  }
]
```

### 2. **POST /api/matches**
Updates or creates match data in Azure Table Storage.

**Used by:** `KCCStandingsAdmin.jsx` in `saveData()` function (line 95)

**Example Request:**
```javascript
await fetch('/api/matches', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    division: "12U Boy",
    group: "A",
    matchIndex: 0,
    homeScore: 3,
    awayScore: 1,
    matchPlayed: "Y",
    date: "2024-06-15",
    time: "10:00",
    field: "Field 1"
  })
});
```

**Response:**
```json
{
  "success": true,
  "entity": { /* saved entity data */ }
}
```

---

## 📂 API Files Structure

```
api/
├── package.json                 # API dependencies
├── host.json                    # Azure Functions host config
├── GetMatchData/
│   ├── function.json           # GET endpoint config
│   └── index.js                # GET handler implementation
└── UpdateMatch/
    ├── function.json           # POST endpoint config
    └── index.js                # POST handler implementation
```

---

## 🚀 How It Works

### 1. **Integrated Deployment**

Azure Static Web Apps automatically deploys both:
- **Frontend** (React app) from `/dist` folder
- **API Functions** from `/api` folder

They are deployed together as a single unit, which is why the API calls work without CORS issues.

### 2. **Automatic Routing**

The `staticwebapp.config.json` file configures routing:

```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "platform": {
    "apiRuntime": "node:18"
  }
}
```

Any request to `/api/*` is automatically routed to the Azure Functions.

### 3. **Storage Connection**

The API functions connect to Azure Table Storage using the `AzureWebJobsStorage` environment variable:

```javascript
const connectionString = process.env.AzureWebJobsStorage;
const tableClient = TableClient.fromConnectionString(
    connectionString,
    'kccMatches'
);
```

This connection string was configured by Terraform (✅ already done).

---

## ✅ Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Azure Static Web App** | ✅ Created | screenboard (Central US) |
| **Storage Account** | ✅ Created | screenboardstorage (East US 2) |
| **Storage Table** | ✅ Created | kccMatches |
| **Storage Connection** | ✅ Configured | AzureWebJobsStorage set |
| **API Functions** | ⚠️ Not Deployed | Need to deploy with frontend |
| **API package.json** | ✅ Created | Dependencies defined |
| **API Dependencies** | ✅ Installed | node_modules present |

---

## 🔧 Deployment Steps

### Option 1: Using Deployment Script (Recommended)

**Windows:**
```cmd
deploy-with-api.bat
```

**Mac/Linux:**
```bash
chmod +x deploy-with-api.sh
./deploy-with-api.sh
```

This script will:
1. Install all dependencies (frontend + API)
2. Build the frontend
3. Get the deployment token from Terraform
4. Deploy both frontend and API to Azure

### Option 2: Manual Deployment

```bash
# 1. Build frontend
npm run build

# 2. Install API dependencies (if not done)
cd api && npm install && cd ..

# 3. Get deployment token
cd terraform
DEPLOYMENT_TOKEN=$(terraform output -raw static_web_app_api_key)
cd ..

# 4. Deploy with API
npx @azure/static-web-apps-cli deploy \
    ./dist \
    --api-location ./api \
    --deployment-token $DEPLOYMENT_TOKEN \
    --env production
```

**Key Parameter:** `--api-location ./api` tells the CLI to include the API functions.

---

## 🧪 Testing the API

### 1. **After Deployment**

Wait 1-2 minutes for deployment to complete, then test:

```bash
# Test GET endpoint
curl https://chiqchic.com/api/matches

# Test POST endpoint (create a test match)
curl -X POST https://chiqchic.com/api/matches \
  -H "Content-Type: application/json" \
  -d '{
    "division": "12U Boy",
    "group": "A",
    "matchIndex": 0,
    "homeScore": 2,
    "awayScore": 1,
    "matchPlayed": "Y",
    "date": "2024-06-15",
    "time": "10:00",
    "field": "Field 1"
  }'
```

### 2. **From Admin Panel**

1. Navigate to: https://chiqchic.com/admin/kcc/standings
2. Select a division and group
3. Mark a match as "Played"
4. Enter scores
5. Check browser console for API calls
6. Refresh the page - data should persist

---

## 🔍 Troubleshooting

### API Returns 404

**Problem:** API functions not deployed

**Solution:**
```bash
# Deploy with API included
npx @azure/static-web-apps-cli deploy ./dist --api-location ./api --deployment-token <TOKEN> --env production
```

### API Returns 500

**Problem:** Storage connection not configured or table doesn't exist

**Check:**
```bash
# Verify storage connection
az staticwebapp appsettings list --name screenboard --resource-group screenboard-rg

# Verify table exists
az storage table list --account-name screenboardstorage --auth-mode login
```

### CORS Errors

**Problem:** API and frontend on different origins

**Solution:** This shouldn't happen with Azure Static Web Apps since they're deployed together. If you see this, ensure you're using `/api/matches` (relative path) not `https://different-domain.com/api/matches`.

### Data Not Persisting

**Problem:** API not saving to storage

**Check:**
1. Verify `AzureWebJobsStorage` is set in app settings
2. Check API function logs in Azure Portal
3. Verify table has correct permissions

---

## 📊 Monitoring

### View API Logs

**Azure Portal:**
1. Go to: https://portal.azure.com
2. Navigate to: screenboard-rg → screenboard → Functions
3. Select a function → Monitor → Logs

**Azure CLI:**
```bash
az monitor app-insights query \
  --app <app-insights-id> \
  --analytics-query "traces | where cloud_RoleName == 'screenboard' | order by timestamp desc | take 50"
```

---

## 🔐 Security

### Authentication

Currently set to `anonymous` for easy access. For production, consider:

1. **API Keys:**
```javascript
app.http('GetMatchData', {
    authLevel: 'function',  // Requires API key
    // ...
});
```

2. **Azure AD Authentication:**
Configure in `staticwebapp.config.json`:
```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    }
  ]
}
```

### Connection String

The storage connection string is:
- ✅ Stored in Azure app settings (encrypted)
- ✅ Not in source code
- ✅ Accessed via environment variable

---

## 📚 Additional Resources

- [Azure Static Web Apps - API Support](https://learn.microsoft.com/en-us/azure/static-web-apps/apis-overview)
- [Azure Functions - Node.js](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node)
- [Azure Table Storage - Client Library](https://learn.microsoft.com/en-us/javascript/api/overview/azure/data-tables-readme)

---

## ✨ Next Steps

1. **Deploy the API** - Run `deploy-with-api.bat` or `deploy-with-api.sh`
2. **Test the endpoints** - Use curl or browser dev tools
3. **Use the admin panel** - Update match scores and verify persistence
4. **Set up monitoring** - Enable Application Insights for logs

---

**Last Updated:** October 31, 2025  
**Status:** Infrastructure ready, API needs deployment

