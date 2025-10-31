# Outputs for Screen Board Azure Infrastructure

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_id" {
  description = "ID of the resource group"
  value       = azurerm_resource_group.main.id
}

output "storage_account_name" {
  description = "Name of the storage account"
  value       = azurerm_storage_account.main.name
}

output "storage_account_primary_connection_string" {
  description = "Primary connection string for storage account"
  value       = azurerm_storage_account.main.primary_connection_string
  sensitive   = true
}

output "storage_table_name" {
  description = "Name of the KCC matches storage table"
  value       = azurerm_storage_table.kcc_matches.name
}

output "static_web_app_name" {
  description = "Name of the Static Web App"
  value       = azurerm_static_web_app.main.name
}

output "static_web_app_id" {
  description = "ID of the Static Web App"
  value       = azurerm_static_web_app.main.id
}

output "static_web_app_default_hostname" {
  description = "Default hostname of the Static Web App"
  value       = azurerm_static_web_app.main.default_host_name
}

output "static_web_app_api_key" {
  description = "API key for deploying to Static Web App"
  value       = azurerm_static_web_app.main.api_key
  sensitive   = true
}

output "deployment_instructions" {
  description = "Instructions for deploying the application"
  sensitive   = true
  value       = <<-EOT

  ========================================
  🚀 Screen Board - Deployment Ready!
  ========================================

  1. Configure the Static Web App with Storage Connection:
     az staticwebapp appsettings set \
       --name ${azurerm_static_web_app.main.name} \
       --resource-group ${azurerm_resource_group.main.name} \
       --setting-names "AzureWebJobsStorage=${azurerm_storage_account.main.primary_connection_string}"

  2. Build your application:
     npm run build

  3. Deploy using Azure Static Web Apps CLI:
     npx @azure/static-web-apps-cli deploy ./dist \
       --deployment-token <API_KEY> \
       --env production

  4. Access your application at:
     https://${azurerm_static_web_app.main.default_host_name}

  Note: Use 'terraform output -raw static_web_app_api_key' to get the deployment token

  EOT
}

