@echo off
REM Screen Board - Infrastructure Verification Script
REM Run this script to verify all Azure resources are working correctly

echo ========================================
echo Screen Board - Infrastructure Verification
echo ========================================
echo.

echo Checking Azure CLI authentication...
az account show --query "[name, user.name]" -o table
if %errorlevel% neq 0 (
    echo ERROR: Not logged into Azure CLI
    echo Run: az login
    exit /b 1
)
echo.

echo ========================================
echo 1. Resource Group Status
echo ========================================
az group show --name screenboard-rg --query "[name, location, properties.provisioningState]" -o table
echo.

echo ========================================
echo 2. Storage Account Status
echo ========================================
az storage account show --name screenboardstorage --resource-group screenboard-rg --query "[name, location, sku.name, properties.minimumTlsVersion]" -o table
echo.

echo ========================================
echo 3. Storage Tables
echo ========================================
az storage table list --account-name screenboardstorage --auth-mode login --output table
echo.

echo ========================================
echo 4. Static Web App Status
echo ========================================
az staticwebapp show --name screenboard --resource-group screenboard-rg --query "[name, location, defaultHostname, sku.tier]" -o table
echo.

echo ========================================
echo 5. Static Web App Settings
echo ========================================
az staticwebapp appsettings list --name screenboard --resource-group screenboard-rg
echo.

echo ========================================
echo 6. Terraform State
echo ========================================
cd terraform
terraform state list
cd ..
echo.

echo ========================================
echo Verification Complete!
echo ========================================
echo.
echo Your infrastructure is ready to use:
echo - Production URL: https://chiqchic.com
echo - Azure URL: https://icy-hill-08e9aec10.3.azurestaticapps.net
echo - Admin Panel: https://chiqchic.com/admin/kcc/standings
echo.
echo To deploy your application:
echo   1. npm run build
echo   2. cd terraform ^&^& terraform output -raw static_web_app_api_key
echo   3. npx @azure/static-web-apps-cli deploy ./dist --deployment-token ^<TOKEN^> --env production
echo.

pause

