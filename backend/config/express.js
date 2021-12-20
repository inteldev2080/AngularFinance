import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import glob from 'glob';
// import Raven from 'raven';
import winstonInstance from './winston';
import routes from '../server/routes/index.route';
import config from './config';
import APIError from '../server/helpers/APIError';
import passport from './passport';
import Response from '../server/services/response.service';
import swaggerSpec from '../server/docs/swagger.js';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const routePath = './server/docs/routes/*.json';

const app = express();

// Raven.config('https://780f8081db784dd5b4a64761d41d4b9d@sentry.io/1193753').install();

if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));

app.use(passport.initialize());

// app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

let origin = '*';

// CORS middleware
const allowCrossDomain = function (req, res, next) {
  const allowedOrigins = [
    'https://supplieson.com',
    'https://www.supplieson.com',
    'http://localhost:3000',
    'http://192.168.107.183:3000'
  ];
  origin = req.headers.origin;

  if (allowedOrigins.indexOf(origin) > -1) {
    origin = req.headers.origin;
  } else {
    origin = '*';
  }

  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Access-Control-Allow-Headers, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
};

app.use(allowCrossDomain);

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const headers = {};
    // IE8 does not allow domains to be specified, just the *
    // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers['Access-Control-Allow-Origin'] = origin;
    // headers["Access-Control-Allow-Origin"] = "*";
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE';
    headers['Access-Control-Allow-Credentials'] = true;
    headers['Access-Control-Allow-Headers'] = 'Content-Type, X-Requested-With, Access-Control-Allow-Headers, Authorization';
    headers['Cache-Control'] = 'private, no-cache, no-store, must-revalidate';
    res.writeHead(200, headers);
    res.end();
  } else {
    return next();
  }
});

app.use(cookieParser());

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

glob.sync(routePath).forEach(function (file) {
  let JSONLoaded = require('../.' + file);
  swaggerSpec.paths = {
    ...swaggerSpec.paths,
    ...JSONLoaded.paths
  };
  swaggerSpec.components.schemas = {
    ...swaggerSpec.components.schemas,
    ...JSONLoaded.schemas
  };
});

let data = JSON.stringify(swaggerSpec);
fs.writeFileSync('api-docs.json', data);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// mount all routes on /api path
app.use('/api', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    return res.status(httpStatus.BAD_REQUEST).json(Response.validationFailure(err.errors));
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
);

export default app;
