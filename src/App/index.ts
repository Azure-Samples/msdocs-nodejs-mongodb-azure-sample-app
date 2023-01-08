// let createError = require("http-errors");
import HttpError from "http-errors";
import express from "express";
// let path = require("path");
import path from "path";
// let cookieParser = require("cookie-parser");
import cookieParser from "cookie-parser";
// let logger = require("morgan");
import logger from "morgan";
// const { format } = require("date-fns");
import { format } from "date-fns";
// const welcome = require("./lib/welcome");
import { welcome } from "../welcome/welcome";
import { Schema, model, connect } from 'mongoose';


// 1st party dependencies
// let configData = require("./config/connection");
import { getConnectionInfo } from "../config/connection";

// const indexRouter = require("../routes/index");
import indexRouter from "../routes/index";

export async function getApp() {
  const root = await getAppPath()
  console.log(welcome+root)
  // Database
  const connectionInfo = await getConnectionInfo();
  connect(connectionInfo.DATABASE_URL);

  const app = express();

  const port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);
  // create a route for static html files
  app.use("/ai", express.static(root + "/ai"));

  // view engine setup
  // app.use("/ai", express.static(root + "/ai"));
  app.set("views", path.join(root, "/views"));
  app.set("view engine", "pug");

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(root, "/public")));

  app.locals.format = format;

  app.use("/", indexRouter);
  app.use("/js", express.static(root + "/node_modules/bootstrap/dist/js")); // redirect bootstrap JS
  app.use(
    "/css",
    express.static(root + "/node_modules/bootstrap/dist/css")
  ); // redirect CSS bootstrap

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(HttpError[404]);
  });

  // error handler
  app.use(function (err: { message: any; status: any; }, req: { app: { get: (arg0: string) => string; }; }, res: { locals: { message: any; error: any; }; status: (arg0: any) => void; render: (arg0: string) => void; }, next: any) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });

  return app;
}
/**
 * Normalize a port into a number, string, or false.
 */

 function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

async function getAppPath() {
  const { dirname } = require('path');
  const { constants, promises: { access } } = require('fs');

  for (const path of module.paths) {
    try {
      await access(path, constants.F_OK);
      return dirname(path);
    } catch (e) {
      // Just move on to next path
    }
  }
}