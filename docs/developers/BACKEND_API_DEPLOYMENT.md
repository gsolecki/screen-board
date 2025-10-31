# 🌐 Backend API Deployment - Multi-Device Support

## ⚠️ CRITICAL: localStorage is NOT Enough!

**The Problem with localStorage:**
- ❌ Data only stored in ONE browser
- ❌ Admin on laptop A can't share with display on laptop B
- ❌ Different networks can't see the same data
- ❌ No real-time updates across devices

**The Solution: Azure Functions + Table Storage**
- ✅ Centralized cloud storage
- ✅ All devices see the same data
- ✅ Real-time updates across networks
- ✅ Admin anywhere can update
- ✅ Display anywhere shows updates

---

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Admin     │────────▶│  Azure Functions │◀────────│   Display   │
│  (Laptop)   │  POST   │      (API)       │  GET    │   (Screen)  │
└─────────────┘         └──────────────────┘         └─────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │Azure Table   │
                        │Storage       │
                        │(Cloud DB)    │
                        └──────────────┘
```

---

## 📁 Project Structure

```
screen-board/
├── api/                          # ← NEW: Backend API
│   ├── package.json
│   ├── host.json
│   ├── GetMatchData/
│   │   ├── function.json
│   │   └── index.js            # GET /api/matches
│   └── UpdateMatch/
│       ├── function.json
│       └── index.js            # POST /api/matches
├── src/                          # Frontend (existing)
└── staticwebapp.config.json      # Updated with API config
```

---

## 🚀 Deployment Steps

### Step 1: Install Azure Functions Core Tools

**Windows:**
```bash
npm install -g azure-functions-core-tools@4
```

**Verify Installation:**
```bash
func --version
# Should show: 4.x.x
```

### Step 2: Configure Azure Static Web App

Your Azure Static Web App needs to be configured to support the API:

```bash
# Login to Azure
az login

# Update your Static Web App to include API
az staticwebapp create \
  --name screenboard \
  --resource-group screenboard-rg \
  --source https://github.com/yourusername/screen-board \
  --location "East US 2" \
  --branch main \
  --app-location "/" \
  --api-location "api" \
  --output-location "dist"
```

### Step 3: Create Azure Storage Account (for Table Storage)

```bash
# Create storage account
az storage account create \
  --name screenboardstorage \
  --resource-group screenboard-rg \
  --location "East US 2" \
  --sku Standard_LRS

# Get connection string
az storage account show-connection-string \
  --name screenboardstorage \
  --resource-group screenboard-rg \
  --query connectionString \
  --output tsv
```

**Save this connection string!** You'll need it for configuration.

### Step 4: Configure Application Settings

```bash
# Add the storage connection string to your Static Web App
az staticwebapp appsettings set \
  --name screenboard \
  --resource-group screenboard-rg \
  --setting-names AzureWebJobsStorage="<YOUR_CONNECTION_STRING>"
```

Replace `<YOUR_CONNECTION_STRING>` with the value from Step 3.

### Step 5: Deploy with GitHub Actions

Update `.github/workflows/azure-static-web-apps.yml`:

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
          
      - name: Install frontend dependencies
        run: npm ci
        
      - name: Build frontend
        run: npm run build
        
      - name: Install API dependencies
        run: cd api && npm install
        
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: "api"
          output_location: "dist"

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

### Step 6: Test Locally (Optional)

```bash
# Terminal 1: Start API
cd api
npm install
func start

# Terminal 2: Start Frontend
npm run dev
```

The API will run at `http://localhost:7071/api/`

---

## 🔧 Frontend Integration

I'll now update the admin panel to use the API instead of localStorage...

---

## 📊 API Endpoints

### GET /api/matches
**Get all match results**

Response:
```json
[
  {
    "division": "12U Boy",
    "group": "A",
    "matchIndex": 0,
    "homeScore": 2,
    "awayScore": 1,
    "matchPlayed": "Y",
    "date": "2025-10-25",
    "time": "09:00",
    "field": "1",
    "lastUpdated": "2025-10-31T15:30:00Z"
  }
]
```

### POST /api/matches
**Update a match result**

Request:
```json
{
  "division": "12U Boy",
  "group": "A",
  "matchIndex": 0,
  "homeScore": 2,
  "awayScore": 1,
  "matchPlayed": "Y",
  "date": "2025-10-25",
  "time": "09:00",
  "field": "1"
}
```

Response:
```json
{
  "success": true,
  "entity": { ... }
}
```

---

## ✅ Testing Checklist

After deployment:

- [ ] API accessible at `https://chiqchic.com/api/matches`
- [ ] Admin can POST match results
- [ ] Display can GET match results
- [ ] Different devices see same data
- [ ] Updates appear in real-time (refresh)
- [ ] No CORS errors
- [ ] Table Storage contains data

---

## 💰 Cost Estimate

**Azure Static Web Apps**: Free tier (first 100GB bandwidth)
**Azure Functions**: Free tier (first 1M executions/month)
**Azure Table Storage**: ~$0.05/GB/month

**Total Estimated Cost**: $0-5/month for typical tournament use

---

## 🔐 Security (Optional - Add Later)

For production, consider adding:

1. **API Key Authentication**:
```javascript
// In Azure Functions
if (request.headers.get('x-api-key') !== process.env.API_KEY) {
  return { status: 401, body: 'Unauthorized' };
}
```

2. **Admin Role Protection**:
```json
// In staticwebapp.config.json
{
  "routes": [
    {
      "route": "/admin/*",
      "allowedRoles": ["admin"]
    }
  ]
}
```

3. **Rate Limiting**: Built into Azure Functions

---

## 🆘 Troubleshooting

### API not found (404)
- Check `staticwebapp.config.json` has `api_location: "api"`
- Verify GitHub Actions deployed successfully
- Check Azure Portal → Static Web App → Functions

### CORS errors
- Ensure `Access-Control-Allow-Origin: *` in function responses
- Check `staticwebapp.config.json` CSP includes API domain

### Data not saving
- Check Azure Portal → Storage Account → Tables
- Verify `kccMatches` table exists
- Check function logs in Azure Portal

### Connection string error
- Verify `AzureWebJobsStorage` is set in App Settings
- Check connection string format is correct

---

## 📞 Next Steps

1. **Deploy the API** (push to GitHub with updated workflow)
2. **Update frontend** to use API instead of localStorage
3. **Test cross-device** functionality
4. **Train admin** on new system

**Would you like me to now update the frontend components to use the API?**

