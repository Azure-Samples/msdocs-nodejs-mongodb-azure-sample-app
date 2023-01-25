require('./middleware/refundsCron');
require('./middleware/withdrawalCron');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { format } = require('date-fns');
const clientRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const paymentRoutes = require('./routes/payment');
const refundRoutes = require('./routes/refund');
const pickUpload = require('./routes/pickUpload');
const account = require('./routes/withdrawal');
const profile = require('./routes/profile');
const writingTask = require('./routes/writingTask');

// 1st party dependencies
var configData = require('./config/connection');

async function getApp() {
  // Database
  var connectionInfo = await configData.getConnectionInfo();
  mongoose.connect(connectionInfo.DATABASE_URL);

  var app = express();

  var port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  // Extended: https://swagger.io/specification/#infoObject
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: '1.0.0',
        title: 'Grandeur API',
        description: ' API Information',
        contact: {
          name: 'Grandeur Team',
        },
        servers: ['https://grandeur-api.azurewebsites.net'],
      },
    },
    // ['.routes/*.js']
    apis: ['app.js'],
  };
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.locals.format = format;

  app.get('/', async (req, res) => {
    res.json({ message: 'Please visit /users to view all the users' });
  });
  app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
  app.use(
    '/css',
    express.static(__dirname + '/node_modules/bootstrap/dist/css')
  ); // redirect CSS bootstrap
//Routes
/**
 * @swagger
 * /users:
 *  get:
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */
  app.use('/users', clientRoutes);
  app.use('/uploads', uploadRoutes);
  app.use('/payments', paymentRoutes);
  app.use('/refunds', refundRoutes);
  app.use('/pick-upload', pickUpload);
  app.use('/account', account);
  app.use('/profile', profile);
  app.use('/writing-task', writingTask);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
}
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

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
module.exports = {
  getApp,
};
