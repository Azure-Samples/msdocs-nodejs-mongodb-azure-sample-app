// The caller reads settings after site creation, outside this writer deployment.
param webAppName string

@secure()
@description('Existing settings read by the caller; may contain plaintext secrets.')
param existingSettings object

@secure()
@description('Settings owned by this template; these override existing values.')
param newSettings object

// Do not list/reference this config in its own PUT: ARM detects a circular
// dependency even when resourceId is a string. Never output either dictionary.
resource appsettings 'Microsoft.Web/sites/config@2022-09-01' = {
  name: '${webAppName}/appsettings'
  properties: union(existingSettings, newSettings)
}
