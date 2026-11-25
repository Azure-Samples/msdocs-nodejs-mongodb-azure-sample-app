// Keep existing Cosmos DB deployments and local development working.
function databaseConfig(env = process.env) {
  const uri = env.AZURE_DOCUMENTDB_CONNECTIONSTRING ||
    env.AZURE_COSMOS_CONNECTIONSTRING || env.MONGODB_URI;
  if (!uri || uri.startsWith('@Microsoft.KeyVault(')) {
    throw new Error('Database connection is not configured. Check the database app setting and Key Vault reference status.');
  }
  return {
    uri,
    options: env.AZURE_DOCUMENTDB_CONNECTIONSTRING
      ? { dbName: env.AZURE_DOCUMENTDB_DATABASE || 'todolist' }
      : {}
  };
}

module.exports = { databaseConfig };
