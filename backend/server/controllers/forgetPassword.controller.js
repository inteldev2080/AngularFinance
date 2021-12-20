import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import Promise from 'bluebird';
import moment from 'moment-timezone';
import uuid from 'node-uuid';
import Response from '../services/response.service';
import UserService from '../services/user.service';
import User from '../models/user.model';
import EmailHandler from '../../config/emailHandler';
import ResetPassword from '../models/resetPassword.model';
import appSettings from '../../appSettings';

const sgMail = require('@sendgrid/mail');
const debug = require('debug')('app:forgetPassword.controller');


const hash = Promise.promisify(bcrypt.hash);
const HASH_SALT_ROUNDS = 10;

function forgetPass(req) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: req.body.email,
    from: 'sender@example.org',
    subject: 'Hello world',
    text: 'Hello plain world!',
    html: '<p>Hello HTML world!</p>',
  };
  sgMail.send(msg)
    .then(() => {
      debug('Mail Sent......');
    })
    .catch((error) => {
      // Log friendly error
      debug(error.toString());
    });
}

function resetPass(req, res) {
  const userCode = req.body.code;
  if (req.body.password === req.body.confirmPassword) { debug('Password Check', true); } else { debug('Password Check', false); }
  ResetPassword.findOne({ status: 'New' })
    .populate('user')
    .where('code').equals(userCode)
    .then((reset) => {
      if (reset) {
        const userData = reset.user.email;
        if (moment(reset.expireDate).tz(appSettings.timeZone).diff(moment().tz(appSettings.timeZone), 'days') >= 0) {
          User.findOne({ email: userData })
        .then((user) => {
          hash(req.body.password, HASH_SALT_ROUNDS)
            .then((hashedPassword) => {
              bcrypt.compare(req.body.password, hashedPassword, (err, res) => {
                if (res) {
                  console.log('Match');
                } else {
                  console.log('Dont Match');
                }
              });
              user.password = hashedPassword;
              user.save((err, userSaved) => {
                if (err) {
                  res.status(httpStatus.NOT_FOUND).json(Response.failure(err));
                } else {
                  reset.status = 'Used';
                  reset.save();
                  res.json(Response.success(userSaved));
                }
              });
            });
        });
        } else {
          res.status(httpStatus.NOT_FOUND).json(Response.failure(4));
        }
      } else {
        res.status(httpStatus.NOT_FOUND).json(Response.failure(4));
      }
    });
}

function sendEmail(req, res) {
  const resetPassUId = uuid.v4();
  User.findOne({ email: req.body.email.toLowerCase() })
    .then((user) => {
      if (user) {
        const userId = user._id;
        ResetPassword.findOne({ user: userId, status: 'New' })
          .then((exist) => {
            if (exist) {
              exist.status = 'Canceled';
              exist.save();
            }
            const resetPassword = new ResetPassword({
              user,
              status: 'New',
              code: resetPassUId,
              createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
              expireDate: moment().add(1, 'days').tz(appSettings.timeZone).format(appSettings.momentFormat)
            });
            resetPassword.save();
            if (appSettings.emailSwitch) {
              const content = {
                recipientName: UserService.toTitleCase(user.firstName),
                resetLink: `<a href='${appSettings.mainUrl}/auth/resetPassword/${resetPassUId}'>${user.language === 'en' ? 'Link' : 'الرابط'}</a>`,
                resetFullLink: `<a href='${appSettings.mainUrl}/auth/resetPassword/${resetPassUId}'>${appSettings.mainUrl}/auth/resetPassword/${resetPassUId}</a>`,
              };
              const response = EmailHandler.sendEmail(req.body.email, content, 'RESETPASSWORD', user.language); // , 'RESETPASSWORD', 'English'
              res.json(Response.success(response));
            }
          });
      } else {
        res.json(Response.success());
      }
    });
}

module.exports = {
  forgetPass,
  resetPass,
  sendEmail
};

