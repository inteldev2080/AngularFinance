import async from 'async';
import httpStatus from 'http-status';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
import EmailHandler from '../../config/emailHandler';
import JWTHandler from '../helpers/JWTHandler';
import UserService from '../services/user.service';
import Response from '../services/response.service';
import Supplier from '../models/supplier.model';
import User from '../models/user.model';
import SMSHandler from '../../config/smsHandler';
import Customer from '../models/customer.model';

// const moment = require('moment-timezone');

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // after passport check the username and password
  // generate and return JWT
  JWTHandler.generate(req.user._id, (err, jwt, expiresIn) => {
    if (err) {
      return next(err);
    }
    const permssionsArr = [];
    for (let i = 0; i < req.user.role.permissions.length; i += 1) {
      permssionsArr.push(req.user.role.permissions[i].key);
    }
    const user = {
      _id: req.user._id,
      role: req.user.role,
      permissions: permssionsArr,
      email: req.user.email,
      mobileNumber: req.user.mobileNumber,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      type: req.user.type,
      language: req.user.language,
      token: jwt,
      tokenExpiresIn: moment().tz(appSettings.timeZone).add(expiresIn.frequency, expiresIn.interval)
    };
    return res.json(user);
  });
}

/**
 * Change user current password.
 * @property {String} req.body.oldPassword
 * @property {String} req.body.newPassword
 * @return {User}
 */
function changeCurrentUserPassword(req, res) {
  const admin = req.user;
  admin.password = req.body.newPassword;
  async.waterfall([
    function passParameters(callback) {
      callback(null, admin, req.body.oldPassword);
    },
    UserService.isSavedPasswordMatch,
    UserService.isEmailMobileNumberDuplicate,
    admin.password ? UserService.hashPasswordAndSave : UserService.update
  ],
    (err, user) => {
      if (err) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
      } else if (user) {
        user.password = undefined;
        res.json(Response.success(user));
      } else {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(15));
      }
    });
}

/**
 * Reset user password.
 * @property {String} req.body.userId
 * @property {String} req.body.newPassword
 * @return {User}
 */
function resetUserPassword(req, res) {
  if (req.user.type === 'Admin') {
    async.waterfall([
      function passParameters(callback) {
        callback(null, req.user._id, req.body.userId, req.user.type, req.body.newPassword);
      },
      isAuthorizedToReset,
      getUserFromSupplier,
      updateUserPassword
    ],
      (err, user) => {
        if (err) {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
        } else if (user) {
          if (appSettings.emailSwitch) {
            const content = {
              recipientName: UserService.toTitleCase(user.firstName),
              newPassword: req.body.newPassword,
              loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>` // eslint-disable-line no-useless-escape
            };
            EmailHandler.sendEmail(user.email, content, 'RESETUSERPASSWORD', user.language);
          }
          res.json(Response.success(user));
        } else {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
        }
      });
  } else if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameters(callback) {
        callback(null, req.user._id, req.body.userId, req.user.type, req.body.newPassword);
      },
      isAuthorizedToReset,
      getUserFromSupplier,
      updateUserPassword
    ],
      (err, user) => {
        if (err) {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
        } else if (user) {
          if (appSettings.emailSwitch) {
            const content = {
              recipientName: UserService.toTitleCase(user.firstName),
              newPassword: req.body.newPassword,
              loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>` // eslint-disable-line no-useless-escape
            };
            EmailHandler.sendEmail(user.email, content, 'RESETUSERPASSWORD', user.language);
          }
          res.json(Response.success(user));
        } else {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
        }
      });
  } else if (req.user.type === 'Customer') {
    async.waterfall([
      function passParameters(callback) {
        callback(null, req.user._id, req.body.userId, req.user.type, req.body.newPassword);
      },
      isAuthorizedToReset,
      getUserFromSupplier,
      updateUserPassword
    ],
      (err, user) => {
        if (err) {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
        } else if (user) {
          if (appSettings.emailSwitch) {
            const content = {
              recipientName: UserService.toTitleCase(user.firstName),
              newPassword: req.body.newPassword,
              loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>` // eslint-disable-line no-useless-escape
            };
            EmailHandler.sendEmail(user.email, content, 'RESETUSERPASSWORD', user.language);
          }
          res.json(Response.success(user));
        } else {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
        }
      });
  }
}

function checkToken(req, res) {
  const expiresIn = JWTHandler.verifyToken;
  if (moment().tz(appSettings.timeZone) > moment()
      .tz(appSettings.timeZone).add(expiresIn.frequency, expiresIn.interval)) {
    res.json(Response.success({ user: req.user, expired: true }));
  } else {
    res.json(Response.success({ user: req.user, expired: false }));
  }
}

function changeLanguage(req, res) {
  const user = req.user;
  if (user.language === 'en') {
    user.language = 'ar';
  } else {
    user.language = 'en';
  }
  user.save()
    .then(savedUser => res.json(Response.success(savedUser)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

function testSMS(req, res) {
  const sms = SMSHandler.sendSms('hi');
  return res.json(Response.success(sms));
}

/**
 * Helper Function
 * Get supplier using the userId.
 * @property {string} loggedUserId - The id of logged user.
 * @returns {string} supplierId
 */
// function getSupplierFromUser(loggedUserId, userId, userType, password, callback) {
//   if (userType === 'Supplier') {
//     Supplier.findOne()
//       .where('staff').in([loggedUserId])
//       .exec((err, supplier) => callback(err, supplier._id, userId, userType, password));
//   } else {
//     callback(null, loggedUserId, userId, userType, password);
//   }
// }

/**
 * Helper Function
 * Check if logged in User is authorized to reset provided user Id.
 * @param {string} userId - The id of the supplier user.
 * @param {string} supplierId
 * @param {string} password
 * @param {string} userType - The type of userId (Admin, Supplier/Staff, Customer).
 * @returns {string} userId.
 */
function isAuthorizedToReset(userId, supplierId, userType, password, callback) {
  if (userType === 'Admin') {
    User.findOne({ _id: supplierId })
      .then((user) => {
        if (user) {
          callback(null, userId, user, password);
        } else {
          Supplier.findOne({ _id: supplierId })
            .then((supplier) => {
              if (supplier) {
                callback(null, userId, supplier._id, password);
              } else {
                callback(null, false, false, password);
              }
            });
        }
      });
  } else if (userType === 'Supplier') {
    Supplier.findOne({ staff: { $in: [supplierId] } })
      .then((supplier) => {
        if (supplier) {
          callback(null, userId, supplierId, password);
        } else {
          callback(null, false, false, password);
        }
      });
  } else if (userType === 'Customer') {
    const staffId = supplierId;
    Customer.findOne({ staff: { $in: [staffId] } })
      .then((customer) => {
        if (customer) {
          callback(null, userId, staffId, password);
        } else {
          callback(null, false, false, password);
        }
      });
  }
}

/**
 * Helper Function
 * Get user using supplier or customer id.
 * @param {string} password
 * @param {string} userId - The id of the supplier user.
 * @returns {User}
 */
function getUserFromSupplier(userId, supplierId, password, callback) {
  if (userId) {
    let foundUserId = '';
    Supplier.findOne({ _id: supplierId })
      .then((sup) => {
        if (sup) {
          foundUserId = sup.staff[0];
          User.findOne({ _id: foundUserId })
            .exec((err, user) => callback(err, user, password));
        } else {
          const staffId = supplierId;
          User.findOne({ _id: staffId })
            .exec((err, user) => callback(err, user, password));
        }
      });
  } else {
    callback(null, false, password);
  }
}

/**
 * Helper Function
 * update user password.
 * @param {User} user.
 * @param {String} req.body.newPassword.
 * @return {User}
 */
function updateUserPassword(user, password, cb) {
  if (user) {
    user.password = password;
    async.waterfall([
      function passParameters(callback) {
        callback(null, user);
      },
      user.password ? UserService.hashPasswordAndSave : UserService.update
    ],
      (err, result) => {
        if (err) {
          cb(err, false);
        } else if (result) {
          result.password = undefined;
          cb(null, result);
        } else {
          cb(null, false);
        }
      });
  } else {
    cb(null, false);
  }
}

export default {
  login,
  changeCurrentUserPassword,
  resetUserPassword,
  checkToken,
  changeLanguage,
  testSMS
};
