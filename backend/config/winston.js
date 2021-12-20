import winston from 'winston';
import fs from 'fs';

const httpLogdir = './logs';
const httpLogfileName = '/http.log';

// Check if dir exist if not creat dir and file
if (!fs.existsSync(httpLogdir)) {
  fs.mkdirSync(httpLogdir);
  fs.open(httpLogdir + httpLogfileName, 'w', (err) => {
    throw new Error(err);
  });
}

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new (winston.transports.File)({ filename: httpLogdir + httpLogfileName })
    // new (winston.transports.MongoDB)({
    //   db: 'mongodb://localhost/express-mongoose-es6-rest-api-development',
    //   collection: 'logs',
    //   level: 'info'
    // })
  ]
});

export default logger;
