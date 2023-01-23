import express from "express";
import { model } from "mongoose";
import { get, post, put, remove, getDocument, upsert } from '../models/obj';

import { Configuration, OpenAIApi } from "openai";

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
  const echo = req.body

  const config = req.body.config

  let from = config.from
  if (!from) from = 'anonymous'
  delete config.from

  const text = req.query.text;
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });

  const openai = new OpenAIApi(configuration);



  console.dir('config: ',config)
  const completion = openai.createCompletion(config).then((completion: { data: any; }) => {
    const defaultJSON = {
      history: {
        completion: completion.data,
        config,
        from
      },
      name: from
    }
console.dir('defaultJSON: ',defaultJSON)
    upsert('histories', 'history', defaultJSON).then((result: any) => {
      console.log(result)
    }).catch((err: any) => {
      console.log(err)
    })

    res.send(defaultJSON);
  }).catch((err: any) => {

    res.send('Sorry! Something went wrong.');
  })

});

export default router;