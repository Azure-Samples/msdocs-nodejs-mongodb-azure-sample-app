targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name which is used to generate a short unique hash for each resource')
param name string

@minLength(1)
@description('Primary location for all resources')
param location string

var resourceToken = toLower(uniqueString(subscription().id, name, location))

resource resourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: '${name}_group'
  location: location
  tags: { 'azd-env-name': name }
}

module resources 'resources.bicep' = {
  name: 'resources'
  scope: resourceGroup
  params: {
    name: name
    location: location
    resourceToken: resourceToken
  }
}

output AZURE_LOCATION string = location
output WEB_URI string = resources.outputs.WEB_URI
output CONNECTION_SETTINGS array = resources.outputs.CONNECTION_SETTINGS
output WEB_APP_LOG_STREAM string = resources.outputs.WEB_APP_LOG_STREAM
output WEB_APP_SSH string = resources.outputs.WEB_APP_SSH
output WEB_APP_CONFIG string = resources.outputs.WEB_APP_CONFIG
