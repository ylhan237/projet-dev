provider "azurerm" {
  features {}
}

module "networking" {
  source              = "../../modules/networking"
  resource_group_name = "rg-agenthub-production"
  location            = "francecentral"
}

module "registry" {
  source              = "../../modules/registry"
  acr_name            = "agenthubprodacr"
  resource_group_name = module.networking.resource_group_name
  location            = "francecentral"
}
