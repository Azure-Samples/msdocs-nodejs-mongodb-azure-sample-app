// The caller must wait for site creation before entering this deployment.
param webAppName string

@secure()
@description('Settings owned by this template; these override existing values.')
param newSettings object

// Do not output existing settings: list() may return plaintext secrets. Keeping
// this read inside the ordered module prevents evaluating it before site creation.
// A string resourceId (not a reference to the resource being written) avoids a
// self-dependency. New sites have an empty settings dictionary.
var currentSettings = list(resourceId('Microsoft.Web/sites/config', webAppName, 'appsettings'), '2022-09-01').properties

resource appsettings 'Microsoft.Web/sites/config@2022-09-01' = {
  name: '${webAppName}/appsettings'
  properties: union(currentSettings, newSettings)
}
