provider "azurerm" {
  features {}
}

module "networking" {
  source              = "../../modules/networking"
  resource_group_name = "rg-agenthub-staging"
  location            = "francecentral"
}

module "registry" {
  source              = "../../modules/registry"
  acr_name            = "agenthubstagingacr"
  resource_group_name = module.networking.resource_group_name
  location            = "francecentral"
}
