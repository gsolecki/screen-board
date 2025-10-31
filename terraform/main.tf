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

