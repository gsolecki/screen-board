@echo off
REM Screen Board - Complete Deployment Script with API
REM This script builds the frontend and deploys both frontend + API to Azure Static Web Apps

echo ==========================================
echo Screen Board - Full Deployment with API
echo ==========================================
echo.

REM Step 1: Check prerequisites
echo Step 1: Checking prerequisites...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed
    exit /b 1
)

where terraform >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Terraform is not installed
    exit /b 1
)

echo OK: All prerequisites installed
echo.

REM Step 2: Install dependencies
echo Step 2: Installing dependencies...

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 exit /b %errorlevel%

echo Installing API dependencies...
cd api
call npm install
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..

echo OK: Dependencies installed
echo.

REM Step 3: Build frontend
echo Step 3: Building frontend...
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%
echo OK: Frontend built successfully
echo.

REM Step 4: Get deployment token
echo Step 4: Getting deployment token from Terraform...
cd terraform
for /f "delims=" %%i in ('terraform output -raw static_web_app_api_key') do set DEPLOYMENT_TOKEN=%%i
cd ..

if "%DEPLOYMENT_TOKEN%"=="" (
    echo ERROR: Failed to get deployment token
    exit /b 1
)

echo OK: Deployment token retrieved
echo.

REM Step 5: Deploy to Azure
echo Step 5: Deploying to Azure Static Web Apps...
echo This will deploy both frontend and API functions...
echo.

call npx @azure/static-web-apps-cli deploy ./dist --api-location ./api --deployment-token %DEPLOYMENT_TOKEN% --env production

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Deployment failed
    exit /b %errorlevel%
)

echo.
echo ==========================================
echo SUCCESS: Deployment Complete!
echo ==========================================
echo.
echo Your application is now live at:
echo   Production: https://chiqchic.com
echo   Azure: https://icy-hill-08e9aec10.3.azurestaticapps.net
echo   Admin: https://chiqchic.com/admin/kcc/standings
echo.
echo API Endpoints:
echo   GET  /api/matches - Get all match data
echo   POST /api/matches - Update match data
echo.
echo Note: It may take 1-2 minutes for the deployment to propagate.
echo.

pause
#!/bin/bash

# Screen Board - Complete Deployment Script with API
# This script builds the frontend and deploys both frontend + API to Azure Static Web Apps

set -e  # Exit on error

echo "=========================================="
echo "Screen Board - Full Deployment with API"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

if ! command -v terraform &> /dev/null; then
    echo -e "${RED}❌ Terraform is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites installed${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"

echo "Installing frontend dependencies..."
npm install

echo "Installing API dependencies..."
cd api
npm install
cd ..

echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Build frontend
echo -e "${YELLOW}Step 3: Building frontend...${NC}"
npm run build
echo -e "${GREEN}✓ Frontend built successfully${NC}"
echo ""

# Step 4: Get deployment token
echo -e "${YELLOW}Step 4: Getting deployment token from Terraform...${NC}"
cd terraform
DEPLOYMENT_TOKEN=$(terraform output -raw static_web_app_api_key)
cd ..

if [ -z "$DEPLOYMENT_TOKEN" ]; then
    echo -e "${RED}❌ Failed to get deployment token${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Deployment token retrieved${NC}"
echo ""

# Step 5: Deploy to Azure
echo -e "${YELLOW}Step 5: Deploying to Azure Static Web Apps...${NC}"
echo "This will deploy both frontend and API functions..."
echo ""

npx @azure/static-web-apps-cli deploy \
    ./dist \
    --api-location ./api \
    --deployment-token "$DEPLOYMENT_TOKEN" \
    --env production

echo ""
echo -e "${GREEN}=========================================="
echo -e "✅ Deployment Complete!"
echo -e "==========================================${NC}"
echo ""
echo "Your application is now live at:"
echo "  🌐 Production: https://chiqchic.com"
echo "  🌐 Azure: https://icy-hill-08e9aec10.3.azurestaticapps.net"
echo "  ⚙️  Admin: https://chiqchic.com/admin/kcc/standings"
echo ""
echo "API Endpoints:"
echo "  GET  /api/matches - Get all match data"
echo "  POST /api/matches - Update match data"
echo ""
echo -e "${YELLOW}Note: It may take 1-2 minutes for the deployment to propagate.${NC}"
echo ""

