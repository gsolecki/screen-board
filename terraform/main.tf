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
  location                 = "eastus2"  # Explicitly set to eastus2 to match existing
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"

  # Security settings
  https_traffic_only_enabled        = true
  min_tls_version                   = "TLS1_2"
  allow_nested_items_to_be_public   = false
  cross_tenant_replication_enabled  = false

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

# Service Plan for Function App
resource "azurerm_service_plan" "function_app" {
  name                = "${var.resource_group_name}-plan"
  resource_group_name = azurerm_resource_group.main.name
  location            = "westus2"  # Try different region due to quota limits
  os_type             = "Linux"
  sku_name            = "B1"  # Basic plan

  tags = {
    Environment = var.environment
    Project     = "screen-board"
    ManagedBy   = "Terraform"
  }
}

# Function App for API
resource "azurerm_linux_function_app" "api" {
  name                       = "${var.resource_group_name}-api"
  resource_group_name        = azurerm_resource_group.main.name
  location                   = "westus2"  # Match service plan location
  service_plan_id            = azurerm_service_plan.function_app.id
  storage_account_name       = azurerm_storage_account.main.name
  storage_account_access_key = azurerm_storage_account.main.primary_access_key

  site_config {
    application_stack {
      node_version = "18"
    }
    cors {
      allowed_origins = [
        "https://chiqchic.com",
        "https://${azurerm_static_web_app.main.default_host_name}",
        "http://localhost:5173",
        "http://localhost:4173"
      ]
      support_credentials = false
    }
  }

  app_settings = {
    "AzureWebJobsStorage"              = azurerm_storage_account.main.primary_connection_string
    "FUNCTIONS_WORKER_RUNTIME"         = "node"
    "WEBSITE_NODE_DEFAULT_VERSION"     = "~18"
    "FUNCTIONS_EXTENSION_VERSION"      = "~4"
  }

  tags = {
    Environment = var.environment
    Project     = "screen-board"
    ManagedBy   = "Terraform"
  }
}

