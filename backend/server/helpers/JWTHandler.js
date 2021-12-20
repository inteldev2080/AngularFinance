import jwt from 'jsonwebtoken';
import config from '../../config/config';

const expiresIn = '10d';
const expiresInObject = { frequency: 10, interval: 'days' };

module.exports.generate = (userId, callback) => {
  if (config.jwtSecret) {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn }, (err, token) => {
      callback(err, token, expiresInObject);
    });
  }
  return callback(new Error('Internal Error'), null);
};

module.exports.verify = (token, callback) => {
  if (config.jwtSecret) {
    return jwt.verify(token, config.jwtSecret, (err, user) => callback(err, user, expiresInObject));
  }
  return callback(new Error('Internal Error'), null);
};

module.exports.verifyToken = expiresInObject;
