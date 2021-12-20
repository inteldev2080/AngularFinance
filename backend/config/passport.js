import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../server/models/user.model';
import config from './config';

const debug = require('debug')('app:passport');

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, (username, password, done) => {
  // Check if the username is an email or a phone number, then login using the appropriate method.
  const criteria = (username.indexOf('@') === -1) ? { mobileNumber: username } : { email: username.toLowerCase() };
  User.findOne(criteria)
    .populate({
      path: 'role',
      select: '_id arabicName englishName permissions',
      populate: {
        path: 'permissions',
        select: 'key'
      }
    })
  .select('+password')
  .where('status').equals('Active')
  .then((user) => {
    if (user && user.role.permissions.length !== 0) {
      return bcrypt.compare(password, user.password, (err, res) => {
        if (err) { return done(err); }
        if (res) {
          return done(null, user);
        }
        return done(null, false);
      });
    }
    return done(null, false);
  }, err => done(err));
}));

passport.use(new JwtStrategy({
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, (credentials, done) => {
  debug(`JwtStrategy userId: ${credentials.userId}`);

  User.findById(credentials.userId)
    .populate({
      path: 'role',
      select: '_id arabicName englishName permissions',
      populate: {
        path: 'permissions',
        select: '_id englishName allowedEndPoints'
      }
    })
    .then((user) => {
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    }, err => done(err));
}));

module.exports = passport;
