const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const util = require('node:util');

// Real route source and real registered handlers; only Express/model are stubbed.
function loadRoutes(rejection) {
  const handlers = {}, logs = [], calls = [], responses = [];
  const tasks = [{ taskName: 'current', completed: false }, { taskName: 'done', completed: true }];
  const result = value => rejection ? Promise.reject(rejection) : Promise.resolve(value);
  function Task(fields) { calls.push(['new', fields]); this.save = () => { calls.push(['save']); return result(); }; }
  Task.find = (...args) => { calls.push(['find', ...args]); return result(tasks); };
  Task.findByIdAndUpdate = (...args) => { calls.push(['update', ...args]); return result(); };
  Task.findByIdAndDelete = (...args) => { calls.push(['delete', ...args]); return result(); };
  const router = {
    get: (route, handler) => { handlers[`GET ${route}`] = handler; },
    post: (route, handler) => { handlers[`POST ${route}`] = handler; }
  };
  const dependencies = { express: { Router: () => router }, '../models/task': Task };
  const capture = level => (...args) => logs.push([level, util.format(...args)]);
  const context = {
    module: { exports: {} }, Date: { now: () => 123456 },
    console: Object.fromEntries(['log', 'error', 'warn', 'info', 'debug'].map(level => [level, capture(level)])),
    require: name => { assert.ok(name in dependencies); return dependencies[name]; }
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../routes/index.js'), 'utf8'), context);
  assert.equal(context.module.exports, router);
  assert.deepEqual(Object.keys(handlers).sort(), ['GET /', 'POST /addTask', 'POST /completeTask', 'POST /deleteTask']);
  return {
    logs, calls, responses,
    async invoke(route) {
      handlers[route]({ body: { taskName: 'synthetic-task', _id: 'synthetic-id' } }, {
        send: body => responses.push(['send', body]),
        redirect: to => responses.push(['redirect', to]),
        render: (view, data) => responses.push(['render', view, data])
      }, () => assert.fail('unexpected next()'));
      await new Promise(resolve => setImmediate(resolve));
    }
  };
}
const routes = {
  'GET /': 'Database error reading tasks.',
  'POST /addTask': 'Database error adding a task.',
  'POST /completeTask': 'Database error completing a task.',
  'POST /deleteTask': 'Database error deleting a task.'
};
for (const [route, message] of Object.entries(routes)) {
  test(`${route} suppresses all raw/encoded credentials and URI from driver rejection`, async () => {
    const user = 'Synthetic@:/?#%$[] ü', password = 'SyntheticSecret@:/?#%$[] 密码';
    const uri = `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@synthetic.invalid/?authSource=admin`;
    const secrets = [user, password, encodeURIComponent(user), encodeURIComponent(password), uri];
    const rejection = new Error(secrets.join(' '));
    rejection.cause = { uri }; // dumping the object/stack must not bypass suppression
    const app = loadRoutes(rejection);
    await app.invoke(route);
    const entireLogs = JSON.stringify(app.logs);
    for (const secret of secrets) assert.ok(!entireLogs.includes(secret), 'no driver credential in any console channel');
    assert.deepEqual(app.logs.filter(([level]) => level === 'error'), [['error', message]]);
    assert.deepEqual(app.responses, [['send', 'Sorry! Something went wrong.']]);
  });
  test(`${route} retains normal CRUD inputs and response behavior`, async () => {
    const app = loadRoutes(); await app.invoke(route);
    const calls = JSON.parse(JSON.stringify(app.calls));
    const responses = JSON.parse(JSON.stringify(app.responses));
    if (route === 'GET /') {
      assert.deepEqual(calls, [['find']]);
      assert.deepEqual(responses, [['render', 'index', { currentTasks: [{ taskName: 'current', completed: false }], completedTasks: [{ taskName: 'done', completed: true }] }]]);
    } else {
      assert.deepEqual(responses, [['redirect', '/']]);
      if (route === 'POST /addTask') assert.deepEqual(calls, [['new', { taskName: 'synthetic-task', createDate: 123456 }], ['save']]);
      if (route === 'POST /completeTask') assert.deepEqual(calls, [['update', 'synthetic-id', { completed: true, completedDate: 123456 }]]);
      if (route === 'POST /deleteTask') assert.deepEqual(calls, [['delete', 'synthetic-id']]);
    }
    assert.equal(app.logs.filter(([level]) => level === 'error').length, 0);
  });
}
