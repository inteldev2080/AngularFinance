import async from 'async';
import bcrypt from 'bcryptjs';
import Promise from 'bluebird';
import httpStatus from 'http-status';
import momentHijri from 'moment-hijri';
import EmailHandler from '../../config/emailHandler';
import appSettings from '../../appSettings';
import Supplier from '../models/supplier.model';
import Credit from '../models/credit.model';
import User from '../models/user.model';
import UserService from '../services/user.service';
import Response from '../services/response.service';
import Role from '../models/role.model';
import notificationCtrl from '../controllers/notification.controller';
import Customer from '../models/customer.model';
import CustomerInvite from '../models/customerInvite.model';
import Guest from '../models/guestCustomer.model';
import Branch from '../models/branch.model';
import JWTHandler from '../helpers/JWTHandler';
import uuid from 'node-uuid';
import ResetPassword from '../models/resetPassword.model';
const sgMail = require('@sendgrid/mail');
// const debug = require('debug')('app:supplier');
const moment = require('moment-timezone');

/**
 * Create new supplier
 * @property {string} req.query.representativeName - The representativeName of supplier.
 * @property {string} req.query.commercialRegister - The commercial register of supplier.
 * @property {string} req.query.commercialRegisterPhoto - The commercial register photo of supplier.
 * @property {string} req.query.userEmail - The supplier admin user's email.
 * @property {string} req.query.userMobilePhone - The supplier admin user's mobile phone.
 * @property {string} req.query.userFirstName - The supplier admin user's first name.
 * @property {string} req.query.userLastName - The supplier admin user's last name.
 * @property {string} req.query.userPassword - The supplier admin user's password.
 * @returns {Supplier}
 */
function supplierCreate(req, res) {
  
  const user = new User({
    email: req.query.userEmail.toLowerCase(),
    mobileNumber: req.query.userMobilePhone,
    password: req.query.userPassword,
    firstName: req.query.userFirstName.toLowerCase(),
    lastName: req.query.userLastName.toLowerCase(),
    language: req.query.language,
    type: 'Supplier',
    createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  });
  const todayDate = moment().tz(appSettings.timeZone);
  let futureDate = '';
  let days = 0;
  if (req.query.paymentInterval) {
    if (req.query.paymentInterval === 'Month') {
      futureDate = moment(todayDate).tz(appSettings.timeZone).add(Number(req.query.paymentFrequency), 'M');
    } else if (req.query.paymentInterval === 'Week') {
      futureDate = moment(todayDate).tz(appSettings.timeZone).add(Number(req.query.paymentFrequency) * 7, 'days');
    } else {
      futureDate = moment(todayDate).tz(appSettings.timeZone).add(Number(req.query.paymentFrequency), 'days');
    }
    days = futureDate.diff(todayDate, 'days');
  } else {
    days = moment().tz(appSettings.timeZone).add(1, 'M').diff(moment(), 'days');
  }

  let supplierStatus = '';
  if (req.query.admin) {
    supplierStatus = 'Active';
    user.status = 'Active';
  } else {
    supplierStatus = 'Suspended';
    user.status = 'Suspended';
  }
  const supplier = new Supplier({
    photo: req.query.photo,
    coverPhoto: req.query.coverPhoto,
    representativeName: req.query.representativeName.toLowerCase(),
    location: {
      // coordinates: [req.query.latitude, req.query.longitude]
      coordinates: req.query.coordinates,
      address: req.query.address
    },
    commercialRegister: req.query.commercialRegister,
    commercialRegisterPhoto: req.query.commercialRegisterPhoto,
    commercialRegisterExpireDate: req.query.commercialRegisterExpireDate ? moment(req.query.commercialRegisterExpireDate) : '',
    commercialRegisterExpireDateIslamic: req.query.commercialRegisterExpireDateIslamic ? momentHijri(req.query.commercialRegisterExpireDateIslamic) : '',
    staff: [user._id],
    paymentFrequency: req.query.paymentFrequency,
    paymentInterval: req.query.paymentInterval,
    address: req.query.address,
    days,
    status: supplierStatus,
    createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
    startPaymentDate: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
    VATRegisterNumber: req.query.VATRegisterNumber ? Number(req.query.VATRegisterNumber) : 0,
    VATRegisterPhoto: req.query.VATRegisterPhoto ? req.query.VATRegisterPhoto : null
  });
  if (req.query.commercialRegisterExpireDate && (moment(req.query.commercialRegisterExpireDate).diff(moment(), 'days') > appSettings.dateExpireValidation)) {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(20));
  } else if (req.query.commercialRegisterExpireDate && (moment(req.query.commercialRegisterExpireDate).diff(moment(), 'days') <= 0)) {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(21));
  } else if (req.query.commercialRegisterExpireDateIslamic && (momentHijri(req.query.commercialRegisterExpireDateIslamic).diff(momentHijri().format('YYYY-M-D'), 'days') > appSettings.dateExpireValidation)) {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(22));
  } else if (req.query.commercialRegisterExpireDateIslamic && (momentHijri(req.query.commercialRegisterExpireDateIslamic).diff(momentHijri().format('YYYY-M-D'), 'days') <= 0)) {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(23));
  } else {
    // Find the supplier admin role and assign it to user.
    Role.findOne()
      .where('englishName').equals('Supplier Admin')
      .then((mainRole) => {
        const role = new Role({
          userType: 'Supplier',
          permissions: mainRole.permissions,
          arabicName: mainRole.arabicName,
          englishName: mainRole.englishName
        });
        async.waterfall([
          function passParameter(callback) {
            callback(null, supplier, user, role);
          },
          createSupplier,
          createRole,
          createUser // (supplier, user, callback)
        ],
          (err, result, user) => {
            if (err) {
              console.log(err);
              res.status(httpStatus.NOT_FOUND).json(Response.failure(err));
            } else {
              result.photo = `${appSettings.imagesUrl}${result.photo}`;
              result.coverPhoto = `${appSettings.imagesUrl}${result.coverPhoto}`;
              if (appSettings.emailSwitch) {
                if (req.query.admin) {
                  const content = {
                    recipientName: UserService.toTitleCase(req.query.userFirstName),
                    loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                    userName: req.query.userEmail,
                    password: req.query.userPassword
                  };
                  EmailHandler.sendEmail(req.query.userEmail, content, 'INVITESUPPLIER', req.query.language);
                } else {
                  const content = {
                    recipientName: UserService.toTitleCase(result.representativeName),
                    loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                    userName: req.query.userEmail,
                    password: req.query.userPassword
                  };
                  // EmailHandler.sendEmail(req.query.userEmail, content, 'NEWUSER', req.query.language);
                  User.findOne({ email: appSettings.superAdmin })
                    .then((superAdmin) => {
                      const notification = {
                        refObjectId: user,
                        level: 'info',
                        user: superAdmin,
                        userType: 'Admin',
                        key: 'newSupplierRequest',
                        stateParams: 'supplier'
                      };
                      notificationCtrl.createNotification('user', notification, null, null, null, result._id);
                    });
                }
              }
              res.json(Response.success(result));
            }
          });
      });
  }
}

/**
 * Helper Function
 * Creates the user
 * @property {User} user - The user.
 * @returns {User}
 */
function createUser(supplier, user, role, callback) {
  if (role === null) {
    user.role = user.role;
  } else {
    user.role = role._id;
  }
  async.waterfall([
    function passParameters(outerCallback) {
      outerCallback(null, supplier, user);
    },
    roleEligible,
    function passParameters(supplierData, userData, innerCallback) {
      innerCallback(null, userData);
    },
    UserService.isEmailMobileNumberDuplicate,
    UserService.hashPasswordAndSave
  ],
    (err, savedUser) => {
      if (err) {
        supplier.remove();
      }
      callback(err, supplier, savedUser);
    });
}
/**
 * Helper Function
 * Creates supplier's role
 * @property {Supplier} supplier - The supplier.
 * @property {Role} role - supplier's role.
 * @returns {Supplier}
 */
 function createRole(supplier, user, role, callback) {
  role.supplier = supplier._id;
  role.save()
    .then(savedRole => callback(null, supplier, user, savedRole));
}

/**
 * Helper Function
 * Checks that the user's role is appropriate
 * @param {User} user - The updated user
 * @param {Supplier} supplier - The supplier of the user
 */
 function roleEligible(supplier, user, callback) {
  Role.findById(user.role)
    .then((role) => {
      if (role) {
        // Check if the role is for suppliers and is general or added by this supplier.
        if (role.userType === 'Supplier' && (role.supplier.toString() === supplier._id.toString())) {
          callback(null, supplier, user);
        } else {
          callback(13, null);
        }
      } else {
        callback(13, null);
      }
    })
    .catch(e => callback(e, null));
}

/**
 * Helper Function
 * Creates the supplier
 * @property {Supplier} supplier - The supplier.
 * @returns {Supplier}
 */
 function createSupplier(supplier, user, role, callback) {
  async.waterfall([
    function passParameters(innerCallback) {
      innerCallback(null, supplier, null);
    },
    UserService.isCommercialRegisterDuplicate
  ],
    (err, createdSupplier) => {
      if (err) {
        callback(32, null);
      } else {
        createdSupplier.save()
          .then((savedSupplier) => {
            const newDriverRole = new Role({
              userType: 'Supplier',
              permissions: [],
              arabicName: 'سائق مورد',
              englishName: 'SupplierDriver',
              supplier: savedSupplier
            });
            newDriverRole.save()
              .catch(e => callback(null, e));
            callback(null, savedSupplier, user, role);
          })
          .catch(e => callback(e, null));
      }
    });
  // supplier.save()
  // .then(savedSupplier => callback(null, savedSupplier, user, role))
  // .catch(e => callback(e, null));
}

/**
 * Load supplier and append to req.
 */
function load(req, res, next, id) {
  Supplier.findById(id)
    .select('_id representativeName commercialRegister commercialRegisterPhoto commercialRegisterExpireDate VATRegisterNumber VATRegisterPhoto coverPhoto location status photo staff')
    .populate({
      path: 'staff',
      select: '_id email mobileNumber firstName lastName language status'
    })
    .then((supplier) => {
      if (supplier) {
        supplier.photo = `${appSettings.imagesUrl}${supplier.photo}`;
        supplier.coverPhoto = `${appSettings.imagesUrl}${supplier.coverPhoto}`;
        req.supplier = supplier;
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}


/**
 * Create new customer
 * @property {string} req.query.photo - The photo of customer.
 * @property {string} req.query.status - The status of customer.
 * @property {string} req.query.longitude - The longitude of customer.
 * @property {string} req.query.latitude - The latitude of customer.
 * @property {string} req.query.representativeName - The status of customer.
 * @property {string} req.query.representativePhone - The user Id of customer.
 * @property {string} req.query.representativeEmail - The user Id of customer.
 * @property {string} req.query.userEmail - The customer user's email.
 * @property {string} req.query.userMobilePhone - The customer user's mobile phone.
 * @property {string} req.query.userFirstName - The customer user's first name.
 * @property {string} req.query.userPassword - The customer user's password.
 * @returns {Customer}
 */
 function customerCreate(req, res) {
  const user = new User({
    email: req.query.userEmail.toLowerCase(),
    mobileNumber: req.query.userMobilePhone,
    password: req.query.userPassword,
    firstName: req.query.userFirstName.toLowerCase(),
    // lastName: req.query.userLastName ? req.query.userLastName.toLowerCase() : req.query.userFirstName.toLowerCase(),
    language: req.query.language,
    type: 'Customer',
    createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  });

  const customer = new Customer({
    photo: req.query.photo,
    coverPhoto: req.query.coverPhoto,
    representativeName: req.query.representativeName.toLowerCase(),
    representativePhone: req.query.representativePhone,
    representativeEmail: req.query.representativeEmail,
    commercialRegister: req.query.commercialRegister,
    commercialRegisterPhoto: req.query.commercialRegisterPhoto,
    commercialRegisterExpireDate: req.query.commercialRegisterExpireDate ? moment(req.query.commercialRegisterExpireDate) : '',
    commercialRegisterExpireDateIslamic: req.query.commercialRegisterExpireDateIslamic ? momentHijri(req.query.commercialRegisterExpireDateIslamic) : '',
    user: user._id,
    location: {
      coordinates: req.query.coordinates,
      address: req.query.address,
      city: req.query.cityId
    },
    createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  });

  if (req.query.commercialRegisterExpireDate && (moment(req.query.commercialRegisterExpireDate).diff(moment(), 'days') > appSettings.dateExpireValidation)) {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(20));
  } else if (req.query.commercialRegisterExpireDate && (moment(req.query.commercialRegisterExpireDate).diff(moment(), 'days') <= 0)) {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(21));
  } else if (req.query.commercialRegisterExpireDateIslamic && (momentHijri(req.query.commercialRegisterExpireDateIslamic).diff(momentHijri().format('iYYYY/iM/iD'), 'days') > appSettings.dateExpireValidation)) {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(22));
  } else if (req.query.commercialRegisterExpireDateIslamic && (momentHijri(req.query.commercialRegisterExpireDateIslamic).diff(momentHijri().format('iYYYY/iM/iD'), 'days') <= 0)) {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(23));
  } else {
    async.waterfall([
        // Function that passes the parameters to the second function.
      function passParamters(callback) {
        callback(null, customer, user);
      },
      verifySupplierInvite,
      setCustomerRole,
      createUserAndCustomer
    ],
      (err, result) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else {
          if (appSettings.emailSwitch) {
            const content = {
              recipientName: UserService.toTitleCase(result.representativeName),
              loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
              userName: req.query.userEmail.toLowerCase(),
              password: req.query.userPassword
            };
            EmailHandler.sendEmail(req.query.userEmail, content, 'NEWUSER', req.query.language);
          }
          res.json(Response.success(result));
        }
      });
  }
}

/**
 * Helper Function
 * Creates the user and customer
 * @property {User} user - The user.
 * @property {Customer} customer - The customer.
 * @returns {User, Customer}
 */
 function createUserAndCustomer(customer, user, callback) {
  async.waterfall([
    function passParameters(innerCallback) {
      innerCallback(null, user, customer);
    },
    customerCreateUser,
    createCustomer
  ],
    (err, savedCustomer) => callback(err, savedCustomer));
}

/**
 * Helper Function
 * Creates the customer
 * @property {Customer} customer - The customer.
 * @returns {Customer}
 */
 function createCustomer(customer, callback) {
  async.waterfall([
    function passParameters(innerCallback) {
      innerCallback(null, null, customer);
    },
    UserService.isCommercialRegisterDuplicate
  ],
    (err, createdCustomer) => {
      if (err) {
        console.log(err);
        callback(3, null);
      } else {
        createdCustomer.save()
          .then((savedCustomer) => {
            Customer.findOne({
              _id: savedCustomer._id
            }).populate({
              path: 'location.city',
              select: 'englishName'
            }).then((customerFound) => {
              savedCustomer = JSON.parse(JSON.stringify(savedCustomer));
              savedCustomer.location.city = customerFound.location.city.englishName;
              savedCustomer.location.cityId = customerFound.location.city._id;

              const branch = new Branch({
                status: 'Active',
                customer: savedCustomer,
                branchName: savedCustomer.representativeName,
                location: savedCustomer.location,
                createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
              });
              branch.save().then((savedBranch) => {
                customerFound.branch = savedBranch;
                customerFound.save().then(saved => callback(null, saved));
              });
            });
          })
          .catch(e => callback(e, null));
      }
    });
}
/**
 * Helper Function
 * Creates the user
 * @property {User} user - The user.
 * @returns {User}
 */
 function customerCreateUser(user, customer, callback) {
  async.waterfall([
    function passParameters(innerCallback) {
      innerCallback(null, user);
    },
    UserService.isEmailMobileNumberDuplicate,
    UserService.hashPasswordAndSave
  ],
  err => callback(err, customer));
}
/**
 * Helper Function
 * Sets the customer role
 * @returns {ObjectId}
 */
 function setCustomerRole(customer, user, callback) {
  Role.findOne()
    .where('userType').equals('Customer')
    .where('isLocked').equals(true)
    .then((role) => {
      const newRole = new Role({
        customer,
        userType: 'Customer',
        permissions: role.permissions,
        isLocked: false,
        createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
        arabicName: 'عميل',
        englishName: 'Customer',
        isDeleted: false
      });
      newRole.save().then((savedRole) => {
        user.role = savedRole;
        callback(null, customer, user);
      });
    })
    .catch(e => callback(e, null));
}

/**
 * Helper Function
 * Verifies that the customer that is about to be created is invited.
 * @property {User} user - The user.
 * @property {Customer} customer - The customer.
 * @returns {User, Customer}
 */
 function verifySupplierInvite(customer, user, callback) {
  CustomerInvite.find()
    .where('customerEmail').equals(user.email)
    .exec((err, customerInvites) => {
      if (customerInvites.length === 0) {
        Guest.findOne({
          email: user.email
        })
          .then((guestExist) => {
            if (guestExist) {
              callback(8, null);
            } else {
              const guest = new Guest({
                email: user.email,
                mobileNumber: user.mobileNumber,
                firstName: user.firstName,
                lastName: user.lastName
              });
              guest.save();
              callback(8, null);
            }
          });
      } else {
        for (let index = 0; index < customerInvites.length; index += 1) {
          const customerInvite = customerInvites[index];
          customerInvite.status = 'Active';
          customerInvite.save()
            .then((ci) => {
              const credit = new Credit({
                supplier: ci.supplier,
                customer: customer._id
              });
              credit.save();
            });
        }
        callback(null, customer, user);
      }
    });
}

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

const hash = Promise.promisify(bcrypt.hash);
const HASH_SALT_ROUNDS = 10;

function forgetPass(req) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: req.query.email,
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
  const userCode = req.query.code;
  if (req.query.password === req.query.confirmPassword) { debug('Password Check', true); } else { debug('Password Check', false); }
  ResetPassword.findOne({ status: 'New' })
    .populate('user')
    .where('code').equals(userCode)
    .then((reset) => {
      if (reset) {
        const userData = reset.user.email;
        if (moment(reset.expireDate).tz(appSettings.timeZone).diff(moment().tz(appSettings.timeZone), 'days') >= 0) {
          User.findOne({ email: userData })
        .then((user) => {
          hash(req.query.password, HASH_SALT_ROUNDS)
            .then((hashedPassword) => {
              bcrypt.compare(req.query.password, hashedPassword, (err, res) => {
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
  User.findOne({ email: req.query.email.toLowerCase() })
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
                resetLink: `<a href='${appSettings.mainUrl}/api/v1/reset/${resetPassUId}'>${user.language === 'en' ? 'Link' : 'الرابط'}</a>`,
                resetFullLink: `<a href='${appSettings.mainUrl}/api/v1/reset/${resetPassUId}'>${appSettings.mainUrl}/auth/resetPassword/${resetPassUId}</a>`,
              };
              const response = EmailHandler.sendEmail(req.query.email, content, 'RESETPASSWORD', user.language); // , 'RESETPASSWORD', 'English'
              res.json(Response.success(response));
            }
          });
      } else {
        res.json(Response.failure({"msg":"User Not Exist"}));
      }
    });
}


export default {
  load,
  supplierCreate,
  customerCreate,
  login,
  sendEmail,
  resetPass,
  forgetPass
};
