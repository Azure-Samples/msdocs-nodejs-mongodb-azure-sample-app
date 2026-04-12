require('dotenv').config();

var createError = require("http-errors");
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { format } = require("date-fns");

var indexRouter = require("./routes/index");

async function getApp() {

  const mongoUri =
    process.env.AZURE_COSMOS_CONNECTIONSTRING ||
    process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("Mongo URI is NOT defined");
    process.exit(1);
  }

  console.log("Mongo URI:", mongoUri);

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to database");
  } catch (err) {
    console.error("Error connecting to database:", err);
  }

  var app = express();

  var port = normalizePort(process.env.PORT || "3000");
  app.set("port", port);

  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "pug");

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.locals.format = format;

  app.use("/", indexRouter);
  app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
  app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

  app.use(function (req, res, next) {
    next(createError(404));
  });

  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
  });

  return app;
}

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) return val;
  if (port >= 0) return port;

  return false;
}

module.exports = {
  getApp,
};