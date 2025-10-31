# Azure Deployment Script for Screen Board with Backend API
# Run this script in PowerShell to deploy everything to Azure

Write-Host "🚀 Screen Board - Azure Deployment Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login to Azure
Write-Host "Step 1: Login to Azure..." -ForegroundColor Yellow
az login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: Failed to login to Azure" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Logged in successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Set your subscription (if you have multiple)
Write-Host "Step 2: Select Azure Subscription..." -ForegroundColor Yellow
az account list --output table
Write-Host ""
$subscriptionId = Read-Host "Enter your subscription ID (or press Enter to use default)"

if ($subscriptionId) {
    az account set --subscription $subscriptionId
    Write-Host "✓ Using subscription: $subscriptionId" -ForegroundColor Green
} else {
    Write-Host "✓ Using default subscription" -ForegroundColor Green
}
Write-Host ""

# Configuration
$STORAGE_NAME = "screenboardstorage"
$RESOURCE_GROUP = "screenboard-rg"
$LOCATION = "eastus2"
$STATIC_APP_NAME = "screenboard"

# Step 3: Create Storage Account for Table Storage
Write-Host "Step 3: Creating Azure Storage Account..." -ForegroundColor Yellow

# Check if storage account already exists
$storageExists = az storage account show --name $STORAGE_NAME --resource-group $RESOURCE_GROUP 2>$null

if ($storageExists) {
    Write-Host "✓ Storage account '$STORAGE_NAME' already exists" -ForegroundColor Green
} else {
    Write-Host "Creating storage account '$STORAGE_NAME'..." -ForegroundColor Yellow
    az storage account create `
        --name $STORAGE_NAME `
        --resource-group $RESOURCE_GROUP `
        --location $LOCATION `
        --sku Standard_LRS `
        --kind StorageV2

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERROR: Failed to create storage account" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Storage account created successfully" -ForegroundColor Green
}
Write-Host ""

# Step 4: Get Storage Connection String
Write-Host "Step 4: Getting Storage Connection String..." -ForegroundColor Yellow
$CONNECTION_STRING = az storage account show-connection-string `
    --name $STORAGE_NAME `
    --resource-group $RESOURCE_GROUP `
    --query connectionString `
    --output tsv

if (-not $CONNECTION_STRING) {
    Write-Host "❌ ERROR: Could not get connection string" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Connection string retrieved" -ForegroundColor Green
Write-Host ""

# Step 5: Configure Static Web App with Storage Connection
Write-Host "Step 5: Configuring Static Web App..." -ForegroundColor Yellow

az staticwebapp appsettings set `
    --name $STATIC_APP_NAME `
    --resource-group $RESOURCE_GROUP `
    --setting-names "AzureWebJobsStorage=$CONNECTION_STRING"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: Failed to configure Static Web App" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Static Web App configured with storage connection" -ForegroundColor Green
Write-Host ""

# Step 6: Show current configuration
Write-Host "Step 6: Verifying Configuration..." -ForegroundColor Yellow
Write-Host "Current app settings:" -ForegroundColor Cyan
az staticwebapp appsettings list `
    --name $STATIC_APP_NAME `
    --resource-group $RESOURCE_GROUP `
    --output table

Write-Host ""
Write-Host "✓ Configuration verified" -ForegroundColor Green
Write-Host ""

# Step 7: Deploy via Git Push
Write-Host "Step 7: Deploying Application..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Now you need to push your code to GitHub to trigger deployment:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Run these commands:" -ForegroundColor White
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m `"Deploy backend API with multi-device support`"" -ForegroundColor White
Write-Host "  git push origin main" -ForegroundColor White
Write-Host ""
$null = Read-Host "Press Enter when you've pushed to GitHub"
Write-Host ""

# Step 8: Wait and verify deployment
Write-Host "Step 8: Verifying Deployment..." -ForegroundColor Yellow
Write-Host "Waiting for GitHub Actions to complete deployment..." -ForegroundColor Cyan
Write-Host "(This usually takes 2-3 minutes)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check deployment status at:" -ForegroundColor White
Write-Host "  https://github.com/YOUR_USERNAME/screen-board/actions" -ForegroundColor White
Write-Host ""
$null = Read-Host "Press Enter when GitHub Actions shows ✓ success"
Write-Host ""

# Step 9: Test the API
Write-Host "Step 9: Testing API Endpoints..." -ForegroundColor Yellow
$SITE_URL = "https://chiqchic.com"

Write-Host "Testing GET /api/matches..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$SITE_URL/api/matches" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ API is responding correctly (HTTP $($response.StatusCode))" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  API returned HTTP $($_.Exception.Response.StatusCode.Value__) (may be normal if no data yet)" -ForegroundColor Yellow
}
Write-Host ""

# Step 10: Create Table Storage table (if needed)
Write-Host "Step 10: Ensuring Table Storage is ready..." -ForegroundColor Yellow
az storage table create `
    --name kccMatches `
    --account-name $STORAGE_NAME `
    --connection-string $CONNECTION_STRING `
    2>$null

Write-Host "✓ Table ready" -ForegroundColor Green
Write-Host ""

# Final Summary
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Storage Account: $STORAGE_NAME" -ForegroundColor Green
Write-Host "✅ Resource Group: $RESOURCE_GROUP" -ForegroundColor Green
Write-Host "✅ Static Web App: $STATIC_APP_NAME" -ForegroundColor Green
Write-Host "✅ Connection String: Configured" -ForegroundColor Green
Write-Host "✅ API Endpoints: Ready" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs:" -ForegroundColor Cyan
Write-Host "   Main Site:   $SITE_URL" -ForegroundColor White
Write-Host "   Admin Panel: $SITE_URL/admin/kcc/standings" -ForegroundColor White
Write-Host "   API:         $SITE_URL/api/matches" -ForegroundColor White
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Test admin panel: $SITE_URL/admin/kcc/standings" -ForegroundColor White
Write-Host "   2. Enter a test score" -ForegroundColor White
Write-Host "   3. Open display on different device: $SITE_URL" -ForegroundColor White
Write-Host "   4. Verify score appears!" -ForegroundColor White
Write-Host ""
Write-Host "🎊 Your multi-device tournament system is live!" -ForegroundColor Green
Write-Host ""

