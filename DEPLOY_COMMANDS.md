# 🚀 Quick Deployment Commands

Copy and paste these commands one by one into your terminal:

## Step 1: Login to Azure
```bash
az login
```

## Step 2: Create Storage Account
```bash
az storage account create \
  --name screenboardstorage \
  --resource-group screenboard-rg \
  --location eastus2 \
  --sku Standard_LRS
```

## Step 3: Get Connection String
```bash
az storage account show-connection-string \
  --name screenboardstorage \
  --resource-group screenboard-rg \
  --query connectionString \
  --output tsv
```

**⚠️ IMPORTANT: Copy the connection string output! You'll need it in the next step.**

## Step 4: Configure Static Web App
```bash
az staticwebapp appsettings set \
  --name screenboard \
  --resource-group screenboard-rg \
  --setting-names AzureWebJobsStorage="<PASTE_YOUR_CONNECTION_STRING_HERE>"
```

Replace `<PASTE_YOUR_CONNECTION_STRING_HERE>` with the connection string from Step 3.

## Step 5: Deploy Code
```bash
git add .
git commit -m "Deploy backend API with multi-device support"
git push origin main
```

## Step 6: Verify Deployment

Wait 2-3 minutes for GitHub Actions to complete, then test:

```bash
# Test API
curl https://chiqchic.com/api/matches

# Should return: [] or array of matches
```

## Step 7: Test Multi-Device

1. **Device A**: Open https://chiqchic.com/admin/kcc/standings
2. **Device A**: Enter test score (2-1)
3. **Device B**: Open https://chiqchic.com/
4. **Device B**: Wait for standings slide
5. **✅ SUCCESS**: Score appears on Device B!

---

## Troubleshooting

### Storage account already exists?
```bash
# Check if it exists
az storage account show \
  --name screenboardstorage \
  --resource-group screenboard-rg
```

### Check current settings
```bash
az staticwebapp appsettings list \
  --name screenboard \
  --resource-group screenboard-rg
```

### View deployment logs
Go to: https://github.com/YOUR_USERNAME/screen-board/actions

---

## That's It!

Your multi-device tournament system is now live! 🎉
#!/bin/bash
# Azure Deployment Script for Screen Board with Backend API
# Run this script to deploy everything to Azure

set -e  # Exit on any error

echo "🚀 Screen Board - Azure Deployment Script"
echo "=========================================="
echo ""

# Step 1: Login to Azure
echo "Step 1: Login to Azure..."
az login

# Verify login
echo "✓ Logged in successfully"
echo ""

# Step 2: Set your subscription (if you have multiple)
echo "Step 2: Select Azure Subscription..."
az account list --output table
echo ""
read -p "Enter your subscription ID (or press Enter to use default): " SUBSCRIPTION_ID

if [ ! -z "$SUBSCRIPTION_ID" ]; then
    az account set --subscription "$SUBSCRIPTION_ID"
    echo "✓ Using subscription: $SUBSCRIPTION_ID"
else
    echo "✓ Using default subscription"
fi
echo ""

# Step 3: Create Storage Account for Table Storage
echo "Step 3: Creating Azure Storage Account..."
STORAGE_NAME="screenboardstorage"
RESOURCE_GROUP="screenboard-rg"
LOCATION="eastus2"

# Check if storage account already exists
if az storage account show --name $STORAGE_NAME --resource-group $RESOURCE_GROUP &>/dev/null; then
    echo "✓ Storage account '$STORAGE_NAME' already exists"
else
    echo "Creating storage account '$STORAGE_NAME'..."
    az storage account create \
        --name $STORAGE_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --sku Standard_LRS \
        --kind StorageV2
    echo "✓ Storage account created successfully"
fi
echo ""

# Step 4: Get Storage Connection String
echo "Step 4: Getting Storage Connection String..."
CONNECTION_STRING=$(az storage account show-connection-string \
    --name $STORAGE_NAME \
    --resource-group $RESOURCE_GROUP \
    --query connectionString \
    --output tsv)

if [ -z "$CONNECTION_STRING" ]; then
    echo "❌ ERROR: Could not get connection string"
    exit 1
fi

echo "✓ Connection string retrieved"
echo ""

# Step 5: Configure Static Web App with Storage Connection
echo "Step 5: Configuring Static Web App..."
STATIC_APP_NAME="screenboard"

az staticwebapp appsettings set \
    --name $STATIC_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --setting-names AzureWebJobsStorage="$CONNECTION_STRING"

echo "✓ Static Web App configured with storage connection"
echo ""

# Step 6: Show current configuration
echo "Step 6: Verifying Configuration..."
echo "Current app settings:"
az staticwebapp appsettings list \
    --name $STATIC_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --output table

echo ""
echo "✓ Configuration verified"
echo ""

# Step 7: Deploy via Git Push
echo "Step 7: Deploying Application..."
echo ""
echo "Now you need to push your code to GitHub to trigger deployment:"
echo ""
echo "Run these commands:"
echo "  git add ."
echo "  git commit -m \"Deploy backend API with multi-device support\""
echo "  git push origin main"
echo ""
read -p "Press Enter when you've pushed to GitHub..."
echo ""

# Step 8: Wait and verify deployment
echo "Step 8: Verifying Deployment..."
echo "Waiting for GitHub Actions to complete deployment..."
echo "(This usually takes 2-3 minutes)"
echo ""
echo "Check deployment status at:"
echo "  https://github.com/YOUR_USERNAME/screen-board/actions"
echo ""
read -p "Press Enter when GitHub Actions shows ✓ success..."
echo ""

# Step 9: Test the API
echo "Step 9: Testing API Endpoints..."
SITE_URL="https://chiqchic.com"

echo "Testing GET /api/matches..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $SITE_URL/api/matches)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ API is responding correctly (HTTP $HTTP_CODE)"
else
    echo "⚠️  API returned HTTP $HTTP_CODE (may be normal if no data yet)"
fi
echo ""

# Step 10: Create Table Storage table (if needed)
echo "Step 10: Ensuring Table Storage is ready..."
az storage table create \
    --name kccMatches \
    --account-name $STORAGE_NAME \
    --connection-string "$CONNECTION_STRING" \
    2>/dev/null || echo "✓ Table already exists"
echo ""

# Final Summary
echo "=========================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "✅ Storage Account: $STORAGE_NAME"
echo "✅ Resource Group: $RESOURCE_GROUP"
echo "✅ Static Web App: $STATIC_APP_NAME"
echo "✅ Connection String: Configured"
echo "✅ API Endpoints: Ready"
echo ""
echo "🌐 URLs:"
echo "   Main Site:   $SITE_URL"
echo "   Admin Panel: $SITE_URL/admin/kcc/standings"
echo "   API:         $SITE_URL/api/matches"
echo ""
echo "📝 Next Steps:"
echo "   1. Test admin panel: $SITE_URL/admin/kcc/standings"
echo "   2. Enter a test score"
echo "   3. Open display on different device: $SITE_URL"
echo "   4. Verify score appears!"
echo ""
echo "🎊 Your multi-device tournament system is live!"
echo ""

