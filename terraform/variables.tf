# Variables for Screen Board Azure Infrastructure

variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
  default     = "screenboard-rg"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "eastus"
}

variable "static_web_app_location" {
  description = "Azure region for Static Web App (limited availability)"
  type        = string
  default     = "centralus"
}

variable "storage_account_name" {
  description = "Name of the Azure Storage Account (must be globally unique, 3-24 chars, lowercase/numbers only)"
  type        = string
  default     = "screenboardstorage"
}

variable "static_web_app_name" {
  description = "Name of the Azure Static Web App"
  type        = string
  default     = "screenboard"
}

variable "static_web_app_sku_tier" {
  description = "SKU tier for Static Web App"
  type        = string
  default     = "Free"

  validation {
    condition     = contains(["Free", "Standard"], var.static_web_app_sku_tier)
    error_message = "SKU tier must be either 'Free' or 'Standard'."
  }
}

variable "static_web_app_sku_size" {
  description = "SKU size for Static Web App"
  type        = string
  default     = "Free"

  validation {
    condition     = contains(["Free", "Standard"], var.static_web_app_sku_size)
    error_message = "SKU size must be either 'Free' or 'Standard'."
  }
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"
}

