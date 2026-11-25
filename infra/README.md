# Infrastructure: App Service with Azure DocumentDB

This directory is used by `azd provision`; the application does not execute Bicep.
Both this template and the companion Node.js template use the same resource contract.

## New environments only

**This is a backend replacement, not a data migration. Do not run this template against
an existing Cosmos DB RU-based azd environment/resource group.** Create a new, uniquely
named azd environment and resource group. Keep the existing deployment and data until
you have separately planned, backed up, migrated, validated, and cut over your workload.
Changing a resource type does not transfer documents, users, indexes, or settings.
Incremental deployments can leave the old RU account orphaned and billed; complete
deployments, deployment-stack cleanup, or resource-group deletion can remove old data.
The new cluster uses a separate `docdb-<resourceToken>` name.

Default database resources are a paid Azure DocumentDB `Microsoft.DocumentDB/mongoClusters`
cluster (`2024-07-01` stable API), MongoDB 8.0, M30, one shard, 128 GiB storage, and HA
disabled. This is a sample configuration, **not free/serverless or a production HA
recommendation**. Review [compute/storage](https://learn.microsoft.com/azure/documentdb/compute-storage),
[limitations](https://learn.microsoft.com/azure/documentdb/limitations), regional
availability, subscription quota, and current pricing before deployment. App Service,
Managed Redis, private endpoints, and logging also incur charges.

## Credentials and application contract

- `documentDbAdministratorLogin` defaults to `documentdbadmin` (a username, not a secret).
- `documentDbAdministratorPassword` is a required `@secure()` parameter with no default.
  The parameters file deliberately does not map it to an environment variable. Use
  azd's native secure-parameter prompt. Use a strong, unique password meeting the
  service requirements, 8–128 characters with uppercase, lowercase, numeric, and
  special characters. Do not put it in `azd env set`, `.env`, command-line arguments,
  committed parameter files, screenshots, or logs. Protect azd's local secret/config
  storage and do not share `.azure` directories. Secure ARM parameters are not a
  guarantee that an operator's local machine or automation logs are protected.
  For automation, use an existing Key Vault secret reference in an ARM parameter
  file and appropriately scoped deployment permissions rather than plaintext values.
- The cluster's **service-returned** `properties.connectionString` supplies the SRV host
  and options. The template substitutes `<user>` and `<password>` with separately
  URI-encoded credentials; it does not guess hostnames, retrieve an RU account key,
  or output a credential-bearing URI. The completed URI is written directly to a
  Key Vault secret. See the [stable GET contract](https://learn.microsoft.com/rest/api/document-db/mongo-clusters/get?view=rest-document-db-2024-07-01)
  and [Azure Verified Module implementation](https://github.com/Azure/bicep-registry-modules/tree/main/avm/res/document-db/mongo-cluster).
- App Service gets `AZURE_DOCUMENTDB_CONNECTIONSTRING` as a versionless Key Vault
  reference and `AZURE_DOCUMENTDB_DATABASE=todolist`. Application code must read the
  first setting and use the second as the database name (for Mongoose, `dbName`).
  Preserve the returned URI's authentication options. MongoDB creates application
  collections on first write; there is no RU `mongodbDatabases` ARM child resource.
- The app's system-assigned identity has **Key Vault Secrets User** on this vault.
  **This is managed-identity access to secrets, not passwordless database access.**
  The database connection still uses native administrator credentials. For production,
  design and provision an appropriately scoped application user separately.
- The deployment principal needs resource deployment and role-assignment permissions.
  The existing Managed Redis Service Connector remains for Redis only. No DocumentDB
  Service Connector support is assumed. A single explicit appsettings resource runs
  after RBAC/network setup, then the Redis connector is ordered after it. Repeat
  provisioning must verify the connector reapplies its settings; do not treat static
  ordering as runtime proof. The hook lists the explicit database setting
  names only; inspect Service Connector for the Redis settings it manages.

## Private networking and rotation

The database denies public network access. Its private endpoint targets the cluster's
resource ID with group `MongoCluster`; the zone
`privatelink.mongocluster.cosmos.azure.com` is linked to the app's VNet and endpoint.
Key Vault and Managed Redis retain their private endpoints. The Linux app retains
VNet integration and route-all configuration. See
[DocumentDB Private Link](https://learn.microsoft.com/azure/documentdb/how-to-private-link).
Local development should use local MongoDB; a public laptop cannot directly access
this private cluster without an authorized network path.

Rotate the native administrator password **and** update the Key Vault connection-string
secret together through a controlled deployment/secret-management process. Merely
updating Key Vault does not rotate the database password. Changing the database first
can interrupt existing/new connections until the secret is updated and reread. Protect
the replacement password exactly as on initial deployment. The versionless reference
allows newer secret versions, but App Service caches references for up to 24 hours;
perform the documented [reference refresh](https://learn.microsoft.com/azure/app-service/app-service-key-vault-references#understand-rotation)
or a configuration restart and verify reconnection. Do not diagnose failures by logging
full connection strings or dumping environment variables. RBAC propagation and initial
Key Vault reference resolution can require time and a reference refresh.

## Local checks and cloud acceptance

With Node.js and the Bicep CLI installed:

```shell
bicep build infra/main.bicep --stdout > /tmp/documentdb-template.json
node --test tests/*.test.js
# If bicep is not on PATH, set BICEP_BIN to its executable path for the tests.
```

The tests compile the real template and check resource types, secure parameters,
private endpoint/DNS links, app identity and vault role, secret references, environment
names, and absence of RU resources/secret outputs. Negative fixtures deliberately break
those contracts. **Compilation and unit tests do not prove Azure deployment or connectivity.**

Before treating a deployment as validated, use a separately authorized disposable new
environment. Verify deployment succeeds, the cluster private endpoint is Approved,
public access is disabled, SRV/A records resolve privately from App Service, the vault
reference resolves, and the sample can create/read/complete/delete a synthetic task.
Check Redis connectivity/settings separately and test a repeat deployment and credential
rotation without logging secrets. Confirm no existing RU environment is touched.

## Cleanup

After backing up anything you need, confirm the selected **new** environment and resource
group, then run `azd down` only for that disposable deployment. It deletes resources and
data; never point it at the old RU environment or a resource group containing unrelated
resources. Retain the old environment until migration/cutover and rollback decisions
are complete. Review any soft-deleted Key Vault resources separately rather than purging
unrelated vaults.
