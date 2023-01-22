var express = require('express');
var Task = require('../models/task');

//call openai api to sumaraize the text
const { Configuration, OpenAIApi } = require("openai");

const welcome = require('../welcome/welcome');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  Task.find()
    .then((tasks) => {
      const currentTasks = tasks.filter(task => !task.completed);
      const completedTasks = tasks.filter(task => task.completed === true);
      console.log(`Total tasks: ${tasks.length}   Current tasks: ${currentTasks.length}    Completed tasks:  ${completedTasks.length}`)
      res.render('index', { currentTasks: currentTasks, completedTasks: completedTasks, welcome: welcome.welcome });
    })
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
});

// return simple text
router.get('/summarize', function (req, res, next) {
// get the text from the request query parameter
  const text = req.query.text;

  //process.env.OPENAI_API_KEY
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });

  const openai = new OpenAIApi(configuration);

  const completion = openai.createCompletion({
    model: "text-davinci-003",
    prompt: text,
    temperature: 0.9,
    max_tokens: 2000,
  }).then((completion) => {
    console.log(completion.data);
    res.send(completion.data);
  }).catch((err) => {
    console.log(err);
    res.send('Sorry! Something went wrong.');
  })
})

router.post('/addTask', function (req, res, next) {
  const taskName = req.body.taskName;
  const createDate = Date.now();

  var task = new Task({
    taskName: taskName,
    createDate: createDate
  });
  console.log(`Adding a new task ${taskName} - createDate ${createDate}`)

  task.save()
    .then(() => {
      console.log(`Added new task ${taskName} - createDate ${createDate}`)
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
});

router.post('/completeTask', function (req, res, next) {
  console.log("I am in the PUT method")
  const taskId = req.body._id;
  const completedDate = Date.now();

  Task.findByIdAndUpdate(taskId, { completed: true, completedDate: Date.now() })
    .then(() => {
      console.log(`Completed task ${taskId}`)
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
});

router.post('/deleteTask', function (req, res, next) {
  const taskId = req.body._id;
  const completedDate = Date.now();
  Task.findByIdAndDelete(taskId)
    .then(() => {
      console.log(`Deleted task $(taskId)`)
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
});

module.exports = router;
