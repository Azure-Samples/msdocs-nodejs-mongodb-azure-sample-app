const { test } = require('node:test');
const assert = require('node:assert/strict');
const { databaseConfig } = require('../config/database');

test('DocumentDB setting takes precedence and selects the application database', () => {
  const uri = 'mongodb+srv://dummy:dummy@cluster.invalid/?tls=true&authSource=admin';
  assert.deepEqual(databaseConfig({ AZURE_DOCUMENTDB_CONNECTIONSTRING: uri, AZURE_COSMOS_CONNECTIONSTRING: 'legacy', MONGODB_URI: 'local' }), { uri, options: { dbName: 'todolist' } });
  assert.equal(databaseConfig({ AZURE_DOCUMENTDB_CONNECTIONSTRING: uri, AZURE_DOCUMENTDB_DATABASE: 'custom' }).options.dbName, 'custom');
});
test('legacy Cosmos and local URIs preserve their database selection', () => {
  assert.deepEqual(databaseConfig({ AZURE_COSMOS_CONNECTIONSTRING: 'legacy', MONGODB_URI: 'local' }), { uri: 'legacy', options: {} });
  assert.deepEqual(databaseConfig({ MONGODB_URI: 'mongodb://localhost:27017/local' }), { uri: 'mongodb://localhost:27017/local', options: {} });
});
test('missing config or unresolved Key Vault reference fails without revealing values', () => {
  assert.throws(() => databaseConfig({}), /not configured/);
  assert.throws(() => databaseConfig({ AZURE_DOCUMENTDB_CONNECTIONSTRING: '@Microsoft.KeyVault(SecretUri=synthetic)' }), /not configured/);
});

test('real app passes selected configuration to mongoose without leaking connection errors', async () => {
  const fs = require('node:fs');
  const vm = require('node:vm');
  const path = require('node:path');
  const rawUser = 'dummy@user:/?#%$[] ü';
  const rawPassword = 'Dummy@:/?#%$[] 密码';
  const uri = `mongodb+srv://${encodeURIComponent(rawUser)}:${encodeURIComponent(rawPassword)}@cluster.invalid/?tls=true&authSource=admin`;
  const calls = [];
  const errors = [];
  const app = { set() {}, use() {}, locals: {} };
  const express = Object.assign(() => app, { json() {}, urlencoded() {}, static() {} });
  const dependencies = {
    'http-errors': () => ({}), express,
    mongoose: { connect: (...args) => { calls.push(args); return Promise.reject(new Error(uri)); } },
    path, 'cookie-parser': () => {}, morgan: () => {},
    'date-fns': { format() {} }, './routes/index': {},
    './config/database': { databaseConfig: () => databaseConfig({ AZURE_DOCUMENTDB_CONNECTIONSTRING: uri, AZURE_COSMOS_CONNECTIONSTRING: 'wrong', MONGODB_URI: 'wrong' }) }
  };
  const context = {
    require: name => { assert.ok(name in dependencies, `unexpected dependency: ${name}`); return dependencies[name]; },
    module: { exports: {} }, __dirname: path.resolve(__dirname, '..'),
    process: { env: {} }, console: { log() {}, error: (...args) => errors.push(args.join(' ')) }
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8'), context);
  await context.module.exports.getApp();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls[0][0], uri);
  assert.equal(calls[0][1].dbName, 'todolist');
  const parsed = new URL(calls[0][0]);
  assert.equal(decodeURIComponent(parsed.username), rawUser);
  assert.equal(decodeURIComponent(parsed.password), rawPassword);
  assert.equal(parsed.searchParams.get('authSource'), 'admin');
  assert.equal(errors.length, 1);
  assert.ok(!errors[0].includes(rawPassword));
  assert.ok(!errors[0].includes(encodeURIComponent(rawPassword)));
  assert.ok(!errors[0].includes(uri));
});
