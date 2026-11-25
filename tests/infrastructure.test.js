const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const path = require('node:path');

// Compile the actual checked-in Bicep, not a hand-maintained expected template.
// This is an offline contract check, NOT Azure deployment/connectivity validation.
const root = path.resolve(__dirname, '..');
const template = JSON.parse(execFileSync(process.env.BICEP_BIN || 'bicep',
  ['build', path.join(root, 'infra/main.bicep'), '--stdout'], { encoding: 'utf8' }));
function moduleTemplate(t) {
  return t.resources.find(r => r.type === 'Microsoft.Resources/deployments').properties.template;
}
function one(t, type) {
  const resources = moduleTemplate(t).resources.filter(r => r.type === type);
  assert.equal(resources.length, 1, type);
  return resources[0];
}
function contract(t) {
  const m = moduleTemplate(t);
  const text = JSON.stringify(t);
  assert.doesNotMatch(text, /databaseAccounts|mongodbDatabases|listKeys|EnableServerless|privatelink\.mongo\.cosmos/i);
  for (const scope of [t, m]) {
    assert.equal(scope.parameters.documentDbAdministratorPassword.type, 'securestring');
    assert.ok(!('defaultValue' in scope.parameters.documentDbAdministratorPassword));
    assert.doesNotMatch(JSON.stringify(scope.outputs), /password|listConfigurations|listConnectionStrings|listKeys|\.connectionString/i);
  }
  const cluster = one(t, 'Microsoft.DocumentDB/mongoClusters');
  assert.equal(cluster.apiVersion, '2024-07-01');
  assert.match(cluster.name, /docdb-/);
  assert.deepEqual(cluster.properties, {
    administrator: { userName: "[parameters('documentDbAdministratorLogin')]", password: "[parameters('documentDbAdministratorPassword')]" },
    createMode: 'Default', serverVersion: '8.0', compute: { tier: 'M30' }, storage: { sizeGb: 128 },
    sharding: { shardCount: 1 }, highAvailability: { targetMode: 'Disabled' }, publicNetworkAccess: 'Disabled'
  });
  const pe = m.resources.find(r => r.type === 'Microsoft.Network/privateEndpoints' && r.name.includes('-db-privateEndpoint'));
  assert.ok(pe, 'database private endpoint');
  assert.match(pe.properties.subnet.id, /database-subnet/);
  const connection = pe.properties.privateLinkServiceConnections[0].properties;
  assert.deepEqual(connection.groupIds, ['MongoCluster']);
  assert.match(connection.privateLinkServiceId, /resourceId\('Microsoft.DocumentDB\/mongoClusters', format\('docdb-/);
  const dns = 'privatelink.mongocluster.cosmos.azure.com';
  assert.ok(m.resources.some(r => r.type === 'Microsoft.Network/privateDnsZones' && r.name === dns));
  assert.ok(m.resources.some(r => r.type.endsWith('/virtualNetworkLinks') && r.name.includes(dns) && r.properties.virtualNetwork.id.includes('Microsoft.Network/virtualNetworks') && r.properties.registrationEnabled === false));
  assert.ok(m.resources.some(r => r.type.endsWith('/privateDnsZoneGroups') && r.name.includes('-db-privateEndpoint') && r.properties.privateDnsZoneConfigs[0].properties.privateDnsZoneId.includes(dns)));
  const vault = one(t, 'Microsoft.KeyVault/vaults');
  assert.equal(vault.properties.enableRbacAuthorization, true);
  assert.equal(vault.properties.publicNetworkAccess, 'Disabled');
  const secret = one(t, 'Microsoft.KeyVault/vaults/secrets');
  assert.match(secret.properties.value, /reference\(resourceId\('Microsoft.DocumentDB\/mongoClusters'/);
  assert.match(secret.properties.value, /'2024-07-01'\)\.connectionString/);
  assert.match(secret.properties.value, /'<user>', uriComponent\(parameters\('documentDbAdministratorLogin'\)\)/);
  assert.match(secret.properties.value, /'<password>', uriComponent\(parameters\('documentDbAdministratorPassword'\)\)/);
  const web = one(t, 'Microsoft.Web/sites');
  assert.equal(web.identity.type, 'SystemAssigned');
  assert.equal(web.properties.siteConfig.linuxFxVersion, 'NODE|24-lts');
  assert.equal(web.properties.siteConfig.vnetRouteAllEnabled, true);
  assert.ok(!web.properties.siteConfig.appSettings, 'one coordinated appsettings writer');
  const config = m.resources.find(r => r.type === 'Microsoft.Web/sites/config' && r.name.includes('appsettings'));
  assert.ok(config);
  const settings = config.properties;
  assert.match(settings.AZURE_DOCUMENTDB_CONNECTIONSTRING || '', /@Microsoft.KeyVault\(SecretUri=/);
  assert.equal(settings.AZURE_DOCUMENTDB_DATABASE, 'todolist');
  assert.equal(settings.SCM_DO_BUILD_DURING_DEPLOYMENT, 'true');
  assert.ok(config.dependsOn.some(x => x.includes('roleAssignments')));
  assert.ok(config.dependsOn.some(x => x.includes('networkConfig')));
  assert.equal(config.dependsOn.filter(x => x.includes('privateDnsZoneGroups')).length, 2);
  assert.doesNotMatch(JSON.stringify(settings), /documentDbAdministratorPassword/);
  const role = one(t, 'Microsoft.Authorization/roleAssignments');
  assert.match(role.scope, /Microsoft.KeyVault\/vaults/);
  assert.match(role.properties.roleDefinitionId, /4633458b-17de-408a-b874-0445c86b69e6/);
  assert.match(role.properties.principalId, /Microsoft.Web\/sites.*\.identity.principalId/);
  assert.equal(role.properties.principalType, 'ServicePrincipal');
  assert.ok(m.resources.some(r => r.type === 'Microsoft.Web/sites/networkConfig' && r.properties.subnetResourceId.includes('webapp-subnet')));
  assert.ok(m.resources.some(r => r.type === 'Microsoft.Cache/redisEnterprise' && r.apiVersion === '2026-05-01-preview'));
  const linker = one(t, 'Microsoft.ServiceLinker/linkers');
  assert.match(linker.properties.targetService.id, /Microsoft.Cache\/redisEnterprise\/databases/);
  assert.ok(linker.dependsOn.some(x => x.includes('roleAssignments')));
  assert.ok(linker.dependsOn.some(x => x.includes('appsettings')));
}
test('compiled deployment uses private DocumentDB and secret references', () => contract(template));
test('azd parameter mapping leaves secure password to native prompt', () => {
  const parameters = JSON.parse(readFileSync(path.join(root, 'infra/main.parameters.json'))).parameters;
  assert.deepEqual(parameters, { name: { value: '${AZURE_ENV_NAME}' }, location: { value: '${AZURE_LOCATION}' } });
  for (const key of Object.keys(parameters)) assert.ok(key in template.parameters);
});
const mutations = {
  'RU resource regression': t => moduleTemplate(t).resources.push({ type: 'Microsoft.DocumentDB/databaseAccounts' }),
  'secret output': t => { t.outputs.password = { type: 'string', value: "[parameters('documentDbAdministratorPassword')]" }; },
  'plaintext password parameter': t => { t.parameters.documentDbAdministratorPassword.type = 'string'; },
  'missing database private endpoint': t => { moduleTemplate(t).resources = moduleTemplate(t).resources.filter(r => !(r.type === 'Microsoft.Network/privateEndpoints' && r.name.includes('-db-privateEndpoint'))); },
  'wrong private link group': t => { moduleTemplate(t).resources.find(r => r.type === 'Microsoft.Network/privateEndpoints' && r.name.includes('-db-privateEndpoint')).properties.privateLinkServiceConnections[0].properties.groupIds = ['MongoDB']; },
  'missing DNS zone': t => { moduleTemplate(t).resources = moduleTemplate(t).resources.filter(r => r.name !== 'privatelink.mongocluster.cosmos.azure.com'); },
  'missing vault permission': t => { moduleTemplate(t).resources = moduleTemplate(t).resources.filter(r => r.type !== 'Microsoft.Authorization/roleAssignments'); },
  'wrong application setting': t => { delete moduleTemplate(t).resources.find(r => r.type === 'Microsoft.Web/sites/config' && r.name.includes('appsettings')).properties.AZURE_DOCUMENTDB_CONNECTIONSTRING; },
  'unencoded password': t => { one(t, 'Microsoft.KeyVault/vaults/secrets').properties.value = "[parameters('documentDbAdministratorPassword')]"; },
  'missing DNS endpoint group': t => { moduleTemplate(t).resources = moduleTemplate(t).resources.filter(r => !(r.type.endsWith('/privateDnsZoneGroups') && r.name.includes('-db-privateEndpoint'))); },
  'secret appsetting': t => { moduleTemplate(t).resources.find(r => r.type === 'Microsoft.Web/sites/config' && r.name.includes('appsettings')).properties.AZURE_DOCUMENTDB_CONNECTIONSTRING = "[parameters('documentDbAdministratorPassword')]"; },
  'public database': t => { one(t, 'Microsoft.DocumentDB/mongoClusters').properties.publicNetworkAccess = 'Enabled'; }
};
for (const [name, mutate] of Object.entries(mutations)) test(`rejects ${name}`, () => {
  const broken = structuredClone(template); mutate(broken); assert.throws(() => contract(broken));
});

test('compiled secret expression encodes credentials independently and preserves the service URI', () => {
  // Evaluate the expression from the actual compiler output for the four supported
  // string functions. This is a local semantics test, not an ARM service execution.
  const expression = one(template, 'Microsoft.KeyVault/vaults/secrets').properties.value;
  const user = 'dummy@user:/?#%$[] ü';
  const password = 'Dummy@:/?#%$[] 密码';
  const serviceUri = 'mongodb+srv://<user>:<password>@cluster.global.invalid/?tls=true&authSource=admin&retryWrites=false';
  const tokens = expression.slice(1, -1).match(/'(?:''|[^'])*'|[A-Za-z][A-Za-z0-9]*|[().,]/g);
  let i = 0;
  function value() {
    let token = tokens[i++];
    if (token.startsWith("'")) return token.slice(1, -1).replaceAll("''", "'");
    assert.equal(tokens[i++], '(');
    const args = [];
    if (tokens[i] !== ')') do { args.push(value()); } while (tokens[i] === ',' && ++i);
    assert.equal(tokens[i++], ')');
    const functions = {
      parameters: key => ({ documentDbAdministratorLogin: user, documentDbAdministratorPassword: password, resourceToken: 'synthetic' })[key],
      format: (text, arg) => text.replace('{0}', arg),
      resourceId: () => 'synthetic-resource-id',
      reference: () => ({ connectionString: serviceUri }),
      uriComponent: encodeURIComponent,
      replace: (text, search, replacement) => text.replaceAll(search, replacement)
    };
    assert.ok(token in functions, `unhandled expression function ${token}`);
    let result = functions[token](...args);
    if (tokens[i] === '.') { i++; result = result[tokens[i++]]; }
    return result;
  }
  const hydrated = value();
  assert.equal(i, tokens.length);
  const parsed = new URL(hydrated);
  assert.equal(decodeURIComponent(parsed.username), user);
  assert.equal(decodeURIComponent(parsed.password), password);
  assert.equal(parsed.host, 'cluster.global.invalid');
  assert.equal(parsed.search, '?tls=true&authSource=admin&retryWrites=false');
  assert.ok(!hydrated.includes('<user>') && !hydrated.includes('<password>'));
});
