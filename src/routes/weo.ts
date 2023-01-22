import express from "express";
import { model } from "mongoose";
import { get, post, put, remove, getDocument } from '../models/obj';

// call openai api to sumaraize the text
// = require("openai");
import { Configuration, OpenAIApi } from "openai";

// const welcome = require('../welcome/welcome');

const router = express.Router();


const config= {
  model: "text-davinci-003",
  prompt: 'This is a test prompt',
  temperature: 0.9,
  max_tokens: 2000,
}

router.get('/', function (req, res, next) {

  const text = req.query.text;
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(configuration);
  const completion = openai.createCompletion(config).then((completion: { data: any; }) => {
    const defaultJSON = {
      completion: completion.data,
      config
    }
    console.log(defaultJSON);
    res.send(defaultJSON);
  }).catch((err: any) => {
    console.log(err);
    res.send('Sorry! Something went wrong.');
  })


})

router.post('/', function (req, res, next) {
  // const defaultJSON = {
  //   // completion: completion.data,
  //   config
  // }
  const echo = req.body

  const config = req.body.config
  config.prompt= config.prompt;

  const text = req.query.text;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });

  const openai = new OpenAIApi(configuration);



  const completion = openai.createCompletion(config).then((completion: { data: any; }) => {
    const defaultJSON = {
      completion: completion.data,
      config
    }
    // console.log(defaultJSON);
    res.send(defaultJSON);
  }).catch((err: any) => {
    // console.log(err);
    res.send('Sorry! Something went wrong.');
  })

  // res.send(echo);
  // await post(req.params.collection, req.body)
});

// router.post('/completeTask', function (req, res, next) {
//   console.log("I am in the PUT method")

// });

// router.post('/deleteTask', function (req, res, next) {

// });

export default router;