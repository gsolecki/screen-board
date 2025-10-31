# Screen Board - Terraform Infrastructure

This directory contains Terraform configuration files for deploying the Screen Board application infrastructure to Azure.

## 📋 Infrastructure Components

- **Resource Group**: Container for all Azure resources
- **Storage Account**: Azure Storage with Table Storage for backend API data
- **Storage Table**: `kccMatches` table for Knox County Cup match data
- **Static Web App**: Hosts the React frontend and Azure Functions API

## 🚀 Quick Start

### Prerequisites

1. **Install Terraform** (version 1.0+)
   - Download from: https://www.terraform.io/downloads
   - Verify: `terraform version`

2. **Install Azure CLI**
   - Download from: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli
   - Verify: `az --version`

3. **Login to Azure**
   ```bash
   az login
   ```

### Deployment Steps

1. **Initialize Terraform**
   ```bash
   cd terraform
   terraform init
   ```

2. **Review the Plan**
   ```bash
   terraform plan
   ```

3. **Apply the Configuration**
   ```bash
   terraform apply
   ```
   
   Type `yes` when prompted to confirm.

4. **View Outputs**
   ```bash
   terraform output
   ```

5. **Get Deployment Token (for app deployment)**
   ```bash
   terraform output -raw static_web_app_api_key
   ```

## 📝 Configuration

Edit `terraform.tfvars` to customize your deployment:

```hcl
resource_group_name      = "screenboard-rg"
location                 = "eastus2"
storage_account_name     = "screenboardstorage"  # Must be globally unique
static_web_app_name      = "screenboard"
static_web_app_sku_tier  = "Free"                # or "Standard"
environment              = "production"
```

## 🔧 Post-Deployment Steps

### 1. Configure Static Web App Settings

After Terraform creates the infrastructure, configure the app settings:

```bash
# Get the storage connection string
STORAGE_CONNECTION=$(terraform output -raw storage_account_primary_connection_string)

# Set app settings
az staticwebapp appsettings set \
  --name screenboard \
  --resource-group screenboard-rg \
  --setting-names "AzureWebJobsStorage=$STORAGE_CONNECTION"
```

### 2. Build and Deploy Your Application

```bash
# Build the app
cd ..
npm run build

# Get deployment token
DEPLOYMENT_TOKEN=$(terraform output -raw static_web_app_api_key)

# Deploy
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token $DEPLOYMENT_TOKEN \
  --env production
```

### 3. Verify Deployment

```bash
# Get your app URL
terraform output static_web_app_default_hostname
```

Visit the URL to see your deployed application!

## 📊 Useful Commands

```bash
# View current state
terraform show

# List all resources
terraform state list

# View specific output
terraform output static_web_app_default_hostname

# View sensitive output
terraform output -raw static_web_app_api_key

# Refresh state
terraform refresh

# Destroy infrastructure (careful!)
terraform destroy
```

## 🔄 Updating Infrastructure

1. Modify the `.tf` files or `terraform.tfvars`
2. Review changes: `terraform plan`
3. Apply changes: `terraform apply`

## 🗑️ Cleaning Up

To remove all created resources:

```bash
terraform destroy
```

Type `yes` when prompted.

## 📂 File Structure

```
terraform/
├── main.tf           # Main infrastructure definition
├── variables.tf      # Input variables
├── outputs.tf        # Output values
├── terraform.tfvars  # Variable values (customize this)
├── .gitignore        # Git ignore for Terraform files
└── README.md         # This file
```

## 🔐 Security Notes

- The `.gitignore` file prevents sensitive files from being committed
- API keys and connection strings are marked as sensitive in outputs
- Use `terraform output -raw <name>` to view sensitive values
- Never commit `terraform.tfstate` or `*.tfvars.json` files

## 🆘 Troubleshooting

### Storage Account Name Already Exists
If you get an error about the storage account name being taken, change it in `terraform.tfvars`:
```hcl
storage_account_name = "screenboardstorage2024"  # Make it unique
```

### Region Not Available
If Static Web Apps aren't available in your region, try:
```hcl
static_web_app_location = "centralus"  # or "westus2", "westeurope"
```

### Authentication Issues
```bash
az login
az account show
az account list --output table
az account set --subscription <subscription-id>
```

## 📚 Additional Resources

- [Terraform Azure Provider Documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Static Web Apps Documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Table Storage Documentation](https://learn.microsoft.com/en-us/azure/storage/tables/)
# Screen Board - Azure Infrastructure
# Terraform configuration for deploying the application to Azure

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = var.environment
    Project     = "screen-board"
    ManagedBy   = "Terraform"
  }
}

# Storage Account for Table Storage (API backend)
resource "azurerm_storage_account" "main" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"

  # Enable Table Storage
  enable_https_traffic_only = true
  min_tls_version          = "TLS1_2"

  tags = {
    Environment = var.environment
    Project     = "screen-board"
    ManagedBy   = "Terraform"
  }
}

# Storage Table for KCC Match Data
resource "azurerm_storage_table" "kcc_matches" {
  name                 = "kccMatches"
  storage_account_name = azurerm_storage_account.main.name
}

# Azure Static Web App
resource "azurerm_static_web_app" "main" {
  name                = var.static_web_app_name
  resource_group_name = azurerm_resource_group.main.name
  location            = var.static_web_app_location
  sku_tier            = var.static_web_app_sku_tier
  sku_size            = var.static_web_app_sku_size

  tags = {
    Environment = var.environment
    Project     = "screen-board"
    ManagedBy   = "Terraform"
  }
}

# Configure Static Web App Settings
resource "azurerm_static_web_app_function_app_registration" "main" {
  static_web_app_id = azurerm_static_web_app.main.id
  function_app_id   = azurerm_static_web_app.main.id
}

