import async from 'async';
import fs from 'fs';
import httpStatus from 'http-status';
import moment from 'moment-timezone';
import momentHijri from 'moment-hijri';
import XLSX from 'xlsx';
import multer from 'multer';
import EmailHandler from '../../config/emailHandler';
import appSettings from '../../appSettings';
import Product from '../models/product.model';
import Customer from '../models/customer.model';
import User from '../models/user.model';
import Transaction from '../models/transaction.model';
import CustomerInvite from '../models/customerInvite.model';
import Guest from '../models/guestCustomer.model';
import Supplier from '../models/supplier.model';
import Credit from '../models/credit.model';
import CustomerProductPrice from '../models/customerProductPrice.model';
import UserService from '../services/user.service';
import Response from '../services/response.service';
import Role from '../models/role.model';
import Invoice from '../models/invoice.model';
import ExportService from '../controllers/exportFileService';
import notificationCtrl from '../controllers/notification.controller';
import Order from '../models/order.model';
import Branch from '../models/branch.model';

const upload = multer({
  dest: 'images/',
  limits: {
    fileSize: 1024 * 1024 * 12, // 4 MB
    files: 1
  },
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(xls|xlsx)$/i)) {
      callback(14, false);
    } else {
      callback(null, true);
    }
  }
}).single('file');

function inviteExcel(req, res){
  const data = req.body;
  for (const [key, sheet] of Object.entries(data)) {
    sheet.forEach(element => {
      async.waterfall([
        // Function that passes the parameters to the second function.
      function passParamters(callback) {
        callback(null, req.user._id, element.EMAIL, null, null, null);
      },
        // Gets the logged in supplier
      getSupplierFromUser,
        // Gets the customer with this email
      getCustomerFromEmail,
        // Creates the supplier relationship and credit.
      initalizeSupplierRelation
    ],
      (err, result) => {
        if (err) {
          console.log(err);
          // err.code
          // res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else {
          User.findOne({
            email: element.EMAIL
          })
            .then((user) => {
              Supplier.findOne({
                _id: result.supplier
              })
                .then((supplier) => {
                  if (supplier) {
                    if (user) {
                      const notification = {
                        refObjectId: user,
                        level: 'info',
                        user,
                        userType: 'Customer',
                        key: 'inviteCustomer',
                        stateParams: null
                      };
                      notificationCtrl.createNotification('user', notification, null, null, supplier.representativeName, null);
                      if (appSettings.emailSwitch) {
                        Customer.findOne({
                          user
                        })
                          .then((ci) => {
                            const content = {
                              recipientName: UserService.toTitleCase(ci.representativeName),
                              supplier: supplier.representativeName,
                              loginPageUrl: `<a href=\'${appSettings.mainUrl}/customer/product/category/${supplier._id}\'>${appSettings.mainUrl}/customer/product/category/${supplier._id}</a>`, // eslint-disable-line no-useless-escape
                            };
                            EmailHandler.sendEmail(element.EMAIL, content, 'INVITATION', user.language);
                          });
                      }
                    } else if (appSettings.emailSwitch) {
                      const content = {
                        recipientName: UserService.toTitleCase(element.EMAIL),
                        supplier: supplier.representativeName,
                        landingPageUrl: `<a href=\'${appSettings.mainUrl}\'>${req.user.language === 'en' ? 'Landing Page' : 'الصفحة الرئيسية'}</a>`, // eslint-disable-line no-useless-escape
                        signUpPage: `<a href=\'${appSettings.mainUrl}/auth/register/customer\'>${appSettings.mainUrl}/auth/register/customer</a>`, // eslint-disable-line no-useless-escape
                        userEmail: element.EMAIL
                      };
                      EmailHandler.sendEmail(element.EMAIL, content, 'INVITECUSTOMER', req.user.language);
                    }
                  }
                });
            });
          // res.json(Response.success(result));
        }
      });
    });
  }
  // data.forEach((sheet) => {
  //   sheet.forEach(element => {
  //     console.log(element.EMAIL);
  //   });
  // });
  
}
// const moment = require('moment-timezone');

/**
 * Get customer
 * @returns {Customer}
 */
function get(req, res) {
  console.log(req.user);
  // Check if the user is a supplier and has access to this customer, or an admin or current user.
  if (req.user.type === 'Supplier') {
    async.waterfall([
        // Function that passes the parameters to the second function.
      function passParamters(callback) {
        callback(null, req.user._id, null, null, null, null);
      },
        // Gets the logged in supplier
      getSupplierFromUser
    ],
      (err, supplier) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else {
          CustomerInvite.findOne()
            .where('customerEmail').equals(req.customer.user.email)
            .where('supplier').equals(supplier._id)
            .then((customerInvite) => {
              if (customerInvite) {
                req.customer.photo = `${appSettings.imagesUrl}${req.customer.photo}`;
                req.customer.coverPhoto = `${appSettings.imagesUrl}${req.customer.coverPhoto}`;
                res.json(Response.success(req.customer));
              } else {
                res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
              }
            });
        }
      });
  } else if (req.user.type === 'Admin') {
    const resultObject = {
      _id: req.customer._id,
      representativeName: req.customer.representativeName,
      commercialRegister: req.customer.commercialRegister,
      commercialRegisterPhoto: req.customer.commercialRegisterPhoto,
      commercialRegisterExpireDate: req.customer.commercialRegisterExpireDate,
      photo: req.customer.photo,
      coverPhoto: req.customer.coverPhoto,
      status: req.customer.status,
      location: req.customer.location,
      user: req.customer.user,
      VATRegisterNumber: req.customer.VATRegisterNumber,
      VATRegisterPhoto: req.customer.VATRegisterPhoto
    };
    res.json(Response.success(resultObject));
  } else if (req.customer.user._id.toString() === req.user._id.toString()) {
    const resultObject = {
      _id: req.customer._id,
      representativeName: req.customer.representativeName,
      commercialRegister: req.customer.commercialRegister,
      commercialRegisterPhoto: `${req.customer.commercialRegisterPhoto}`,
      commercialRegisterExpireDate: req.customer.commercialRegisterExpireDate,
      user: {
        _id: req.customer.user._id,
        email: req.customer.user.email,
        mobileNumber: req.customer.user.mobileNumber,
        firstName: req.customer.user.firstName,
        lastName: req.customer.user.lastName,
        type: req.customer.user.type,
        language: req.customer.user.language,
        status: req.customer.user.status
      },
      branch: req.customer.branch,
      coverPhoto: `${appSettings.imagesUrl}${req.customer.coverPhoto}`,
      location: {
        address: req.customer.location.address,
        coordinates: req.customer.location.coordinates,
        type: req.customer.location.type
      },
      status: req.customer.status,
      photo: `${appSettings.imagesUrl}${req.customer.photo}`
    };
    res.json(Response.success(resultObject));
  } else {
    res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
  }
}

/**
 * Get current customer
 * @returns {Customer}
 */
function getCurrent(req, res) {
  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id, null);
    },
    getCustomerFromUser
  ],
    (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        res.json(Response.success(result));
      }
    });
}

/**
 * Create new customer
 * @property {string} req.body.photo - The photo of customer.
 * @property {string} req.body.status - The status of customer.
 * @property {string} req.body.longitude - The longitude of customer.
 * @property {string} req.body.latitude - The latitude of customer.
 * @property {string} req.body.representativeName - The status of customer.
 * @property {string} req.body.representativePhone - The user Id of customer.
 * @property {string} req.body.representativeEmail - The user Id of customer.
 * @property {string} req.body.userEmail - The customer user's email.
 * @property {string} req.body.userMobilePhone - The customer user's mobile phone.
 * @property {string} req.body.userFirstName - The customer user's first name.
 * @property {string} req.body.userLastName - The customer user's last name.
 * @property {string} req.body.userPassword - The customer user's password.
 * @returns {Customer}
 */
function create(req, res) {
  const user = new User({
    email: req.body.userEmail.toLowerCase(),
    mobileNumber: req.body.userMobilePhone,
    password: req.body.userPassword,
    firstName: req.body.userFirstName.toLowerCase(),
    lastName: req.body.userLastName ? req.body.userLastName.toLowerCase() : req.body.userFirstName.toLowerCase(),
    language: req.body.language,
    type: 'Customer',
    createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  });

  const customer = new Customer({
    photo: req.body.photo,
    coverPhoto: req.body.coverPhoto,
    representativeName: req.body.representativeName.toLowerCase(),
    representativePhone: req.body.representativePhone,
    representativeEmail: req.body.representativeEmail,
    commercialRegister: req.body.commercialRegister,
    commercialRegisterPhoto: req.body.commercialRegisterPhoto,
    commercialRegisterExpireDate: req.body.commercialRegisterExpireDate ? moment(req.body.commercialRegisterExpireDate) : '',
    commercialRegisterExpireDateIslamic: req.body.commercialRegisterExpireDateIslamic ? momentHijri(req.body.commercialRegisterExpireDateIslamic) : '',
    user: user._id,
    location: {
      coordinates: req.body.coordinates,
      address: req.body.address,
      city: req.body.cityId
    },
    createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  });

  if (req.body.commercialRegisterExpireDate && (moment(req.body.commercialRegisterExpireDate).diff(moment(), 'days') > appSettings.dateExpireValidation)) {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(20));
  } else if (req.body.commercialRegisterExpireDate && (moment(req.body.commercialRegisterExpireDate).diff(moment(), 'days') <= 0)) {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(21));
  } else if (req.body.commercialRegisterExpireDateIslamic && (momentHijri(req.body.commercialRegisterExpireDateIslamic).diff(momentHijri().format('iYYYY/iM/iD'), 'days') > appSettings.dateExpireValidation)) {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(22));
  } else if (req.body.commercialRegisterExpireDateIslamic && (momentHijri(req.body.commercialRegisterExpireDateIslamic).diff(momentHijri().format('iYYYY/iM/iD'), 'days') <= 0)) {
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
              userName: req.body.userEmail.toLowerCase(),
              password: req.body.userPassword
            };
            EmailHandler.sendEmail(req.body.userEmail, content, 'NEWUSER', req.body.language);
          }
          res.json(Response.success(result));
        }
      });
  }
}

/**
 * Update existing user
 * @property {string} req.body.photo - The photo of customer.
 * @property {string} req.body.status - The status of customer.
 * @property {string} req.body.longitude - The longitude of customer.
 * @property {string} req.body.latitude - The latitude of customer.
 * @property {string} req.body.representativeName - The status of customer.
 * @property {string} req.body.representativePhone - The user Id of customer.
 * @property {string} req.body.representativeEmail - The user Id of customer.
 * @property {string} req.body.userEmail - The customer user's email.
 * @property {string} req.body.userMobilePhone - The customer user's mobile phone.
 * @property {string} req.body.userFirstName - The customer user's first name.
 * @property {string} req.body.userLastName - The customer user's last name.
 * @returns {Customer}
 */
function update(req, res) {
  // Update the customer user.
  const user = req.user;
  user.firstName = req.body.user.firstName.toLowerCase();
  user.lastName = req.body.user.lastName.toLowerCase();
  user.language = req.body.user.language;
  user.save();

  async.waterfall([
      // updatedUser: parallelCallback => updateUser(user, parallelCallback),
      // customer: parallelCallback => getCustomer(user._id, parallelCallback)
    function passParameters(callback) {
      callback(null, req.user._id);
    },
    getCustomer
  ],
    (err, result) => {
      if (err) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
      } else {
        const customer = result;
        customer.representativeName = req.body.representativeName.toLowerCase();
        customer.location.address = req.body.location.address;
        customer.location.coordinates = req.body.location.coordinates;
        customer.commercialRegister = req.body.commercialRegister;
        customer.commercialRegisterPhoto = req.body.commercialRegisterPhoto;
        customer.commercialRegisterExpireDate = req.body.commercialRegisterExpireDate ? moment(req.body.commercialRegisterExpireDate) : '';
        customer.commercialRegisterExpireDateIslamic = req.body.commercialRegisterExpireDateIslamic ? momentHijri(req.body.commercialRegisterExpireDateIslamic) : '';
        customer.photo = req.body.photo;
        customer.branch = req.body.branchId ? req.body.branchId : customer.branch;
        customer.coverPhoto = req.body.coverPhoto;
        if (req.body.commercialRegisterExpireDate && (moment(req.body.commercialRegisterExpireDate).diff(moment(), 'days') > appSettings.dateExpireValidation)) {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(20));
        } else if (req.body.commercialRegisterExpireDate && (moment(req.body.commercialRegisterExpireDate).isSameOrBefore(moment()))) {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(21));
        } else if (req.body.commercialRegisterExpireDateIslamic && (momentHijri(req.body.commercialRegisterExpireDateIslamic).diff(momentHijri().format('iYYYY/iM/iD'), 'days') > appSettings.dateExpireValidation)) {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(22));
        } else if (req.body.commercialRegisterExpireDateIslamic && (momentHijri(req.body.commercialRegisterExpireDateIslamic).isSameOrBefore(momentHijri().format('iYYYY/iM/iD')))) {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(23));
        } else {
          customer.save()
            .then((updatedCustomer) => {
              const resultObject = {
                _id: updatedCustomer._id,
                representativeName: updatedCustomer.representativeName.toLowerCase(),
                commercialRegister: updatedCustomer.commercialRegister,
                commercialRegisterPhoto: `${updatedCustomer.commercialRegisterPhoto}`,
                commercialRegisterExpireDate: updatedCustomer.commercialRegisterExpireDate,
                commercialRegisterExpireDateIslamic: updatedCustomer.commercialRegisterExpireDateIslamic,
                user: {
                  _id: updatedCustomer.user._id,
                  email: updatedCustomer.user.email.toLowerCase(),
                  mobileNumber: updatedCustomer.user.mobileNumber,
                  firstName: updatedCustomer.user.firstName.toLowerCase(),
                  lastName: updatedCustomer.user.lastName.toLowerCase(),
                  type: updatedCustomer.user.type,
                  language: updatedCustomer.user.language,
                  status: updatedCustomer.user.status
                },
                branch: updatedCustomer.branch,
                coverPhoto: `${appSettings.imagesUrl}${updatedCustomer.coverPhoto}`,
                location: {
                  address: updatedCustomer.location.address,
                  coordinates: updatedCustomer.location.coordinates,
                  type: updatedCustomer.location.type
                },
                status: updatedCustomer.status,
                photo: `${appSettings.imagesUrl}${updatedCustomer.photo}`,
              };
              if (appSettings.emailSwitch) {
                const content = {
                  recipientName: UserService.toTitleCase(updatedCustomer.representativeName),
                  loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>` // eslint-disable-line no-useless-escape
                };
                EmailHandler.sendEmail(updatedCustomer.user.email, content, 'UPDATEUSER', updatedCustomer.user.language);
              }
              res.json(Response.success(resultObject));
            })
            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
        }
      }
    });
}


// TODO: Performance Complexity needs Enhance
/**
 * Get customer list.
 * @property {number} req.query.skip - Number of customers to be skipped.
 * @property {number} req.query.limit - Limit number of customers to be returned.
 * @property {array} req.query.status - customer's status.
 * @property {string} req.query.customerName - customer's Name.
 * @returns {Customer[]}
 */
function list(req, res) {
  let match = {};
  const statusMatch = {};
  const paymentMatch = {};
  let nameMatch = {};
  const nameOnly = req.query.nameOnly || false;

  if (req.query.city && req.user && req.user.type === 'Admin') {
    match = {
      location: {
        city: req.query.city
      }
    };
  }

  if (req.query.status) {
    if (req.query.status.length) {
      req.query.status.forEach((opt) => {
        req.query.status.push(new RegExp(opt, 'i'));
      });
      statusMatch.status = {
        $in: req.query.status
      };
      match.status = {
        $in: req.query.status
      };
    }
  }
  if (req.query.missedPayment) {
    match.dueDateMissed = req.query.missedPayment;
  }
  if (req.query.customerName) {
    if (req.query.customerName.length) {
      nameMatch = {
        representativeName: new RegExp(`.*${req.query.customerName.trim()}.*`, 'i')
      };
      match.representativeName = RegExp(`.*${req.query.customerName.trim()}.*`, 'i');
    }
  }

  if (req.query.payingSoon) {
    // paymentMatch.createdAt = { $gte: moment().subtract(7, 'days')
    // .utc().format(appSettings.momentFormat), $lte: moment().utc()
    // .format(appSettings.momentFormat) };
    match.payingSoon = req.query.payingSoon;
  }

  if (req.user && req.user.type === 'Admin') {
    match.type = "Customer";
    if(req.query.supplierId && req.query.supplierId != "All"){
      CustomerInvite.find({
        supplier: req.query.supplierId,
        status : 'Active'
      }).select('customerEmail')
        .then((customerInvites) => {
          const customerInvitesArr = customerInvites.map(c => c.customerEmail);
          User.find()
            .where('email').in(customerInvitesArr)
            .then((users) => {
              const usersArr = users.map(c => c._id.toString());
              Customer.find({
                type: "Customer"
              })
                .populate('user')
                .where('user').in(usersArr)
                .then((customers) => {
                  if (customers.length <= 0) {
                    res.json(Response.failure("No record exist"));
                  }else {
                    customers.forEach((customerArrObj) => {
                      customerArrObj.photo = `${appSettings.imagesUrl}${customerArrObj.photo}`;
                      customerArrObj.coverPhoto = `${appSettings.imagesUrl}${customerArrObj.coverPhoto}`;
                    });
                    Customer.count()
                      .where('user').in(usersArr)
                      .then((customerCount) => {
                        const customersObject = {
                          customers: customers,
                          count: customerCount
                        };
                        if (req.query.export) {
                          if (req.user.language === 'en') {
                            ExportService.exportFile(`report_template/customer/${req.query.export}-customer-report-header-english.html`,
                              `report_template/customer/${req.query.export}-customer-report-body-english.html`, customersArr,
                              'Customers Report', '', req.query.export, res);
                            // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                          } else {
                            ExportService.exportFile(`report_template/customer/${req.query.export}-customer-report-header-arabic.html`,
                              `report_template/customer/${req.query.export}-customer-report-body-arabic.html`, customersArr,
                              'تقرير العملاء', '', req.query.export, res);
                            // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                          }
                        } else {
                          res.json(Response.success(customersObject));
                        }
                      });
                  }
                });
            });
        });
    }else{
      Customer.find(match)
      .populate('user')
      .sort({
        createdAt: -1
      })
      .skip(Number(req.query.skip))
      .limit(Number(req.query.limit))
      .then((customersArr) => {
        customersArr.forEach((customerArrObj) => {
          customerArrObj.photo = `${appSettings.imagesUrl}${customerArrObj.photo}`;
          customerArrObj.coverPhoto = `${appSettings.imagesUrl}${customerArrObj.coverPhoto}`;
        });
        Customer.count(match)
          .then((customerCount) => {
            const customersObject = {
              customers: customersArr,
              count: customerCount
            };
            if (req.query.export) {
              if (req.user.language === 'en') {
                ExportService.exportFile(`report_template/customer/${req.query.export}-customer-report-header-english.html`,
                  `report_template/customer/${req.query.export}-customer-report-body-english.html`, customersArr,
                  'Customers Report', '', req.query.export, res);
                // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
              } else {
                ExportService.exportFile(`report_template/customer/${req.query.export}-customer-report-header-arabic.html`,
                  `report_template/customer/${req.query.export}-customer-report-body-arabic.html`, customersArr,
                  'تقرير العملاء', '', req.query.export, res);
                // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
              }
            } else {
              res.json(Response.success(customersObject));
            }
          });
      })
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
    }
    
  }
  if (req.user && req.user.type === 'Supplier') {
    if (req.query.city) {
      nameMatch['location.city'] = req.query.city;
    }

    async.waterfall([
        // Function that passes the parameters to the second function.
      function passParamters(callback) {
        callback(null, req.user._id, null, null, req.query.skip, req.query.limit);
      },
        // Gets the logged in supplier
      getSupplierFromUser,
      function passParameter(supplier, customerEmail, supplierRelation, skip, limit, callback) {
        callback(null, supplier, null, null, skip, limit, match, nameMatch,
            paymentMatch, req.query.payingSoon, statusMatch);
      },
      getSupplierCustomerInvites,
      getSupplierCustomers
    ],
      (err, customers) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else if (req.query.export) {
          if (req.user.language === 'en') {
            ExportService.exportFile(`report_template/customer/${req.query.export}-customer-report-header-english.html`,
              `report_template/customer/${req.query.export}-customer-report-body-english.html`, { customers: customers.customers },
              'Customers Report', '', req.query.export, res);
            // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
          } else {
            ExportService.exportFile(`report_template/customer/${req.query.export}-customer-report-header-arabic.html`,
              `report_template/customer/${req.query.export}-customer-report-body-arabic.html`, { customers: customers.customers },
              'تقرير العملاء', '', req.query.export, res);
            // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
          }
        } else {
          if (nameOnly) {
            const customerNameOnly = [];
            customers.customers.forEach((cus) => {
              customerNameOnly.push({
                _id: cus._id,
                representativeName: cus.representativeName,
                userId: cus.user._id
              });
            });
            customers.customers = customerNameOnly;
          }

          res.json(Response.success(customers));
        }
      });
  }
}

/**
 * Supplier invites/adds a customer to be able to order.
 * @property {string} req.body.customerEmail - The email of the customer to be invited/added.
 * @returns {CustomerInvite}
 */
function invite(req, res) {
  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParamters(callback) {
      callback(null, req.user._id, req.body.customerEmail, null, null, null);
    },
      // Gets the logged in supplier
    getSupplierFromUser,
      // Gets the customer with this email
    getCustomerFromEmail,
      // Creates the supplier relationship and credit.
    initalizeSupplierRelation
  ],
    (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        User.findOne({
          email: req.body.customerEmail
        })
          .then((user) => {
            Supplier.findOne({
              _id: result.supplier
            })
              .then((supplier) => {
                if (supplier) {
                  if (user) {
                    const notification = {
                      refObjectId: user,
                      level: 'info',
                      user,
                      userType: 'Customer',
                      key: 'inviteCustomer',
                      stateParams: null
                    };
                    notificationCtrl.createNotification('user', notification, null, null, supplier.representativeName, null);
                    if (appSettings.emailSwitch) {
                      Customer.findOne({
                        user
                      })
                        .then((ci) => {
                          const content = {
                            recipientName: UserService.toTitleCase(ci.representativeName),
                            supplier: supplier.representativeName,
                            loginPageUrl: `<a href=\'${appSettings.mainUrl}/customer/product/category/${supplier._id}\'>${appSettings.mainUrl}/customer/product/category/${supplier._id}</a>`, // eslint-disable-line no-useless-escape
                          };
                          EmailHandler.sendEmail(req.body.customerEmail, content, 'INVITATION', user.language);
                        });
                    }
                  } else if (appSettings.emailSwitch) {
                    const content = {
                      recipientName: UserService.toTitleCase(req.body.customerEmail),
                      supplier: supplier.representativeName,
                      landingPageUrl: `<a href=\'${appSettings.mainUrl}\'>${req.user.language === 'en' ? 'Landing Page' : 'الصفحة الرئيسية'}</a>`, // eslint-disable-line no-useless-escape
                      signUpPage: `<a href=\'${appSettings.mainUrl}/auth/register/customer\'>${appSettings.mainUrl}/auth/register/customer</a>`, // eslint-disable-line no-useless-escape
                      userEmail: req.body.customerEmail
                    };
                    EmailHandler.sendEmail(req.body.customerEmail, content, 'INVITECUSTOMER', req.user.language);
                  }
                }
              });
          });
        res.json(Response.success(result));
      }
    });
}

/**
 * Supplier invites/adds a customer to be able to order.
 * @property {string} req.body.creditLimit- The credit the supplier set for the customer.
 * @property {string} req.body.paymentInterval- The interval of the payment.
 * @property {string} req.body.status- The status of the relationship.
 * @property {string} req.body.productPrices- The product's special prices for tthis customer.
 * @returns {CustomerInvite}
 */
function updateRelation(req, res) {
  const supplierRelation = {
    creditLimit: req.body.creditLimit,
    paymentInterval: req.body.paymentInterval,
    status: req.body.status,
    paymentFrequency: req.body.paymentFrequency,
    exceedCreditLimit: req.body.exceedCreditLimit,
    exceedPaymentDate: req.body.exceedPaymentDate
  };
  // supplierRelation.nextPaymentDueDate = moment().tz(appSettings.timeZone).startOf('month').add((supplierRelation.paymentFrequency), supplierRelation.paymentInterval).format(appSettings.momentFormat);
  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParamters(callback) {
      callback(null, req.user._id, req.customer.user.email, supplierRelation, null, null);
    },
      // Gets the logged in supplier
    getSupplierFromUser,
      // Gets the customer with this email
    getCustomerFromEmail,
      // Update the relation between the customer and supplier
    updateSupplierRelation
  ],
    (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        User.findOne({
          email: result.savedCustomerInvite.customerEmail
        })
          .then((user) => {
            if (user) {
              if (appSettings.emailSwitch) {
                const content = {
                  recipientName: UserService.toTitleCase(result.customer.representativeName)
                };
                EmailHandler.sendEmail(result.savedCustomerInvite.customerEmail, content, 'BLOCK', result.customer.user.language);
              }
              const notification = {
                refObjectId: user,
                level: 'info',
                user,
                userType: 'Customer',
                key: 'relationUpdate',
                stateParams: 'supplier'
              };
              notificationCtrl.createNotification('user', notification, null, null, null, result.savedCustomerInvite.supplier);
            }
          });
        res.json(Response.success(result));
      }
    });
}

/**
 *  Get Customer's Billing History
 * @returns {Transactions Object}
 */
function getBillingHistory(req, res) {
  if (req.user.type === 'Admin') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, null, req.params.customerId, req.query.skip, req.query.limit);
      },
      getCustomerTransactions,
      getCustomerDetails
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        res.json(Response.success({
          balanceDetails: result.balanceDetails,
          billingHistory: result.billingHistory
        }));
      }
    });
  } else if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameter(callback) {
        if (typeof req.params.customerId === 'undefined') {
          callback(-1, null);
        } else {
          callback(null, req.user._id, req.params.customerId, null,
            req.query.skip, req.query.limit);
        }
      },
      getSupplierFromUser,
      function passParameter(supplierId, customerId, relation, skip, limit, callback) {
        callback(null, supplierId, customerId, skip, limit);
      },
      getCustomerTransactions,
      getCustomerDetails
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        res.json(Response.success({
          balanceDetails: result.balanceDetails,
          billingHistory: result.billingHistory
        }));
      }
    });
  } else {
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id, null);
      },
      getCustomerFromUser,
      function passParameter(customerId, supplierId, callback) {
        callback(null, supplierId, customerId, req.query.skip, req.query.limit);
      },
      getCustomerTransactions,
      getCustomerDetails
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        res.json(Response.success({
          balanceDetails: result.balanceDetails,
          billingHistory: result.billingHistory
        }));
      }
    });
  }
}

/**
 * Adds a staff user to the supplier
 * @property {string} req.body.userEmail - The supplier user's email.
 * @property {string} req.body.userMobilePhone - The supplier user's mobile phone.
 * @property {string} req.body.userFirstName - The supplier user's first name.
 * @property {string} req.body.userLastName - The supplier user's last name.
 * @property {string} req.body.userPassword - The supplier user's password.
 * @property {string} req.body.role - The supplier user's role.
 * @returns {User}
 */
function addStaff(req, res) {
  let invitedBy = true,
    isStaff = true;

  if (req.user.invitesByCustomer && req.user.invitedBy) {
    invitedBy = false;
  }

  const user = new User({
    email: req.body.email.toLowerCase(),
    mobileNumber: req.body.mobileNumber,
    password: req.body.password,
    firstName: req.body.firstName.toLowerCase(),
    lastName: req.body.lastName.toLowerCase(),
    language: req.body.language,
    type: 'Customer',
    role: req.body.role,
    status: req.body.status,
    invitedBy: req.user._id,
    invitesByCustomer: invitedBy,
    isStaff
  });
  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id, null);
    },
    getCustomerFromUser,
    function passParameter(customer, supplierId, callback) {
      callback(null, customer, user);
    },
    createUserAndAddToCustomer
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
    } else {
      const resultObject = {
        _id: result.staff._id,
        email: result.staff.email,
        mobileNumber: result.staff.mobileNumber,
        firstName: result.staff.firstName,
        lastName: result.staff.lastName,
        role: result.staff.role,
        language: result.staff.language,
        status: result.staff.status
      };
      if (appSettings.emailSwitch) {
        const content = {
          recipientName: UserService.toTitleCase(result.staff.firstName),
          representativeName: req.user.firstName,
          loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
          userName: result.staff.email,
          password: req.body.password
        };
        EmailHandler.sendEmail(req.body.email, content, 'INVITESTAFF', req.user.language);
      }
      res.json(Response.success(resultObject));
    }
  });
}

/**
 * Gets the staff of a supplier
 * @returns {User []}
 */
function getStaff(req, res) {
  let staffQueryMatch = {};
  let roleMatch = {};
  if (typeof req.query.staffQuery === 'undefined' && typeof req.query.roleId === 'undefined' && typeof req.query.status === 'undefined') {
    roleMatch = {};
  } else {
    if (req.query.roleId) {
      if (req.query.roleId.length) {
        roleMatch.role = req.query.roleId;
      }
    }
    if (req.query.status) {
      if (req.query.status.length) {
        req.query.status.forEach((opt) => {
          req.query.status.push(new RegExp(opt, 'i'));
        });
        roleMatch.status = {
          $in: req.query.status
        };
      }
    }
    if (req.query.staffQuery) {
      staffQueryMatch = {
        $or: ([{
          firstName: new RegExp(`.*${req.query.staffQuery.trim()}.*`, 'i')
        }, {
          email: new RegExp(`.*${req.query.staffQuery}.*`, 'i')
        }])
      };
    }
  }
  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParameters(callback) {
      callback(null, req.user._id, req.query.skip, req.query.limit, staffQueryMatch, roleMatch);
    },
      // Gets the logged in customer
    getCustomerFromUserForStaff,
    getCustomerStaff
  ],
    (err, result) => {
      if (err) {
        res.status(httpStatus.BAD_REQUEST).json(err);
      } else {
        res.json(Response.success(result));
      }
    });
}

/**
 * Update a staff user
 * @property {string} req.params.staffId - The id of the user to be removed.
 * @property {string} req.body.email - The staff user's email.
 * @property {string} req.body.mobilePhone - The staff user's mobile phone.
 * @property {string} req.body.firstName - The staff user's first name.
 * @property {string} req.body.lastName - The staff user's last name.
 * @property {string} req.body.password - The staff user's password.
 * @property {string} req.body.role - The staff user's role.
 * @returns {User}
 */
function updateStaff(req, res) {
  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParamters(callback) {
      callback(null, req.params.staffId);
    },
      // Gets the logged in supplier
    getCustomerWithStaffFromUser
  ],
    (err, customer) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        // Check that the staff member exists for supplier

        const user = customer.user;
        if (user) {
          user.email = req.body.email;
          user.mobileNumber = req.body.mobileNumber;
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName;
          user.role = req.body.role;
          user.status = req.body.status;
          user.language = req.body.language;

          if (req.body.password) {
            user.password = req.body.password;
          }

          async.waterfall([
            function passParameters(callback) {
              callback(null, customer, user);
            },
            roleEligible,
            function passParameter(customerData, userData, callback) {
              callback(null, userData);
            },
            UserService.isEmailMobileNumberDuplicate,
            user.password ? UserService.hashPasswordAndSave : UserService.update
          ],
            (e, updatedUser) => {
              if (e) {
                res.status(httpStatus.BAD_REQUEST).json(Response.failure(e));
              } else {
                updatedUser.password = undefined;
                if (appSettings.emailSwitch) {
                  const content = {
                    recipientName: UserService.toTitleCase(updatedUser.firstName),
                    loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>` // eslint-disable-line no-useless-escape
                  };
                  EmailHandler.sendEmail(updatedUser.email, content, 'UPDATEUSER', updatedUser.language);
                }
                const notification = {
                  refObjectId: updatedUser,
                  level: 'info',
                  user: updatedUser,
                  userType: 'Supplier',
                  key: 'updateStaffAccount',
                  stateParams: null
                };
                notificationCtrl.createNotification('user', notification, null, null, null, null);
                res.json(Response.success(updatedUser));
              }
            });
        } else {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
        }
      }
    });
}

/**
 * Remove a staff user to the customer
 * @property {string} req.params.staffId - The id of the user to be removed.
 * @returns {User}
 */
function removeStaff(req, res) {
  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParamters(callback) {
      callback(null, req.user._id, null);
    },
      // Gets the logged in customer
    getCustomerFromUser
  ],
    (err, customer) => {
      // Check that the staff member exists for supplier
      const indexOfStaff = customer.staff.indexOf(req.params.staffId);
      if (indexOfStaff !== -1) {
        customer.staff.splice(indexOfStaff, 1);

        // Prevent the user from accessing the system after they're removed.
        User.findById(req.params.staffId)
          .then((user) => {
            user.remove()
              .then((removedUser) => {
                if (appSettings.emailSwitch) {
                  const content = {
                    recipientName: UserService.toTitleCase(removedUser.firstName)
                  };
                  EmailHandler.sendEmail(removedUser.email, content, 'REMOVEUSER', removedUser.language);
                }
              });
          });

        customer.save()
          .then(savedSupplier => res.json(Response.success(savedSupplier)))
          .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
      } else {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
      }
    });
}

/**
 * Block Customer
 */
function block(req, res) {
  async.waterfall([
    function passParameters(callback) {
      callback(null, req.user._id, null, null, null, null);
    },
    getSupplierFromUser,
    function passParameters(supplier, customerEmail, supplierRelation, skip, limit, callback) {
      callback(null, supplier, customerEmail);
    },
    function getSupplierInvites(supplier, customerEmail, callback) {
      CustomerInvite.find()
        .where('supplier').equals(supplier._id)
        .then(customerInvites => callback(null, customerInvites))
        .catch(e => callback(e, null));
    },
    function getSupplierCustomer(customerInvites, callback) {
      Customer.findOne({
        _id: req.params.customerId
      })
        .populate('user')
        .select('user representativeName')
        .then((customer) => {
          const customerInvite = customerInvites.map(c => c)
            .filter(c => c.customerEmail === customer.user.email);
          callback(null, {
            customerInvite: customerInvite[0],
            customer
          });
        });
    }
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else if (result) {
      result.customerInvite.status = 'Blocked';
      result.customerInvite.save()
        .then((savedCustomerInvite) => {
          // User.findOne({ email: savedCustomerInvite.customerEmail })
          //   .then((user) => {
          //     user.status = 'Blocked';
          //     user.save()
          //       .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
          //   });
          if (appSettings.emailSwitch) {
            const content = {
              recipientName: UserService.toTitleCase(result.customer.representativeName)
            };
            EmailHandler.sendEmail(savedCustomerInvite.customerEmail, content, 'BLOCK', result.customer.user.language);
          }
          res.json(Response.success(savedCustomerInvite));
        });
    } else {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
    }
  });
}

/**
 * UnBlock Customer
 */
function unblock(req, res) {
  async.waterfall([
    function passParameters(callback) {
      callback(null, req.user._id, null, null, null, null);
    },
    getSupplierFromUser,
    function passParameters(supplier, customerEmail, supplierRelation, skip, limit, callback) {
      callback(null, supplier, customerEmail);
    },
    function getSupplierInvites(supplier, customerEmail, callback) {
      CustomerInvite.find()
        .where('supplier').equals(supplier._id)
        .then(customerInvites => callback(null, customerInvites))
        .catch(e => callback(e, null));
    },
    function getSupplierCustomer(customerInvites, callback) {
      Customer.findOne({
        _id: req.params.customerId
      })
        .populate('user')
        .select('user representativeName')
        .then((customer) => {
          const customerInvite = customerInvites.map(c => c)
            .filter(c => c.customerEmail === customer.user.email);
          callback(null, {
            customerInvite: customerInvite[0],
            customer
          });
        });
    }
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else if (result) {
      result.customerInvite.status = 'Active';
      result.customerInvite.save()
        .then((savedCustomerInvite) => {
          User.findOne({
            email: savedCustomerInvite.customerEmail
          })
            .then((user) => {
              user.status = 'Active';
              user.save()
                .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
            });
          if (appSettings.emailSwitch) {
            const content = {
              recipientName: UserService.toTitleCase(result.customer.representativeName)
            };
            EmailHandler.sendEmail(result.customerInvite.customerEmail, content, 'UNBLOCK', result.customer.user.language);
          }
          res.json(Response.success(savedCustomerInvite));
        });
    } else {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
    }
  });
}

/**
 * Get customer special prices
 *  * @returns {Object} CustomerProductPrice
 */
function getSpecialPrices(req, res) {
  if (req.user.type === 'Customer') {
    if (req.query.supplierId) {
      if (req.query.supplierId.length) {
        async.waterfall([
          function passParameters(callback) {
            callback(null, req.user._id, req.query.supplierId);
          },
          getCustomerFromUser,
          function passParameter(customer, supplierId, callback) {
            callback(null, customer, supplierId, req.query.skip, req.query.limit);
          },
          getCustomerSpecialPrices
        ], (err, result) => {
          if (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
          } else if (result.products.length >= 0) {
            if (req.query.export) {
              if (req.user.language === 'en') {
                ExportService.exportFile(`report_template/specialPrices/${req.query.export}-specialPrices-report-header-english.html`,
                  `report_template/specialPrices/${req.query.export}-specialPrices-report-body1-english.html`, result.products,
                  'Special Prices', '', req.query.export, res);
                // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
              } else {
                ExportService.exportFile(`report_template/specialPrices/${req.query.export}-specialPrices-report-header-arabic.html`,
                  `report_template/specialPrices/${req.query.export}-specialPrices-report-body1-arabic.html`, result.products,
                  'الاسعار الخاصة', '', req.query.export, res);
                // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
              }
            } else {
              res.json(Response.success({
                products: result.products,
                count: result.count
              }));
            }
          } else {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(4));
          }
        });
      }
    } else {
      const skip = Number(req.query.skip);
      const limit = Number(req.query.limit);
      async.waterfall([
        function passParameters(callback) {
          callback(null, req.user._id, req.query.supplierId);
        },
        getCustomerFromUser
      ], (err, result) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else {
          CustomerProductPrice.find({
            customer: result
          })
            .populate({
              path: 'product',
              select: '_id englishName arabicName price deleted'
            })
            .populate({
              path: 'customer',
              select: '_id representativeName'
            })
            .populate({
              path: 'supplier',
              select: '_id representativeName'
            })
            .sort({
              updatedAt: -1
            })
            .then((customerProductPrice) => {
              const products = customerProductPrice.map(c => c).filter(c => c.product.deleted === false || c.product.status === 'Active');
              const resultProducts = products.slice(skip, (limit + skip) > products.length ? (products.length) // eslint-disable-line max-len
                :
                (limit + skip));
              if (req.query.export) {
                if (req.user.language === 'en') {
                  ExportService.exportFile(`report_template/specialPrices/${req.query.export}-specialPrices-report-header-english.html`,
                    `report_template/specialPrices/${req.query.export}-specialPrices-report-body1-english.html`, customerProductPrice,
                    'Special Prices', '', req.query.export, res);
                  // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                } else {
                  ExportService.exportFile(`report_template/specialPrices/${req.query.export}-specialPrices-report-header-arabic.html`,
                    `report_template/specialPrices/${req.query.export}-specialPrices-report-body1-arabic.html`, customerProductPrice,
                    'الاسعار الخاصة', '', req.query.export, res);
                  // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                }
              } else {
                res.json(Response.success(resultProducts));
              }
            });
        }
      });
    }
  } else if (req.user.type === 'Supplier') {
    const match = {};
    const skip = Number(req.query.skip);
    const limit = Number(req.query.limit);
    if (req.query.customerId) {
      if (req.query.customerId.length) {
        match.customer = req.query.customerId;
        async.waterfall([
          function passParameters(callback) {
            callback(null, req.user._id, null, null, null, null);
          },
          getSupplierFromUser,
          function passParameter(supplierId, customerEmail,
            supplierRelation, skip, limit, callback) {
            callback(null, supplierId, req.query.customerId);
          },
          function verifySupplierCustomer(supplierId, customerId, callback) {
            CustomerInvite.find({
              supplier: supplierId
            })
              .select('customerEmail')
              .then((customerInvites) => {
                const customerInvitesArr = customerInvites.map(c => c.customerEmail);
                User.find()
                  .where('email').in(customerInvitesArr)
                  .then((users) => {
                    const usersArr = users.map(c => c._id.toString());
                    Customer.find({
                      _id: customerId
                    })
                      .where('user').in(usersArr)
                      .then((customer) => {
                        if (customer) {
                          callback(null, {
                            customer,
                            supplierId
                          });
                        } else {
                          callback(4, null);
                        }
                      });
                  });
              });
          }
        ], (err, result) => {
          if (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
          } else if (result.customer.length > 0) {
            match.supplier = result.supplierId;
            CustomerProductPrice.find(match)
              .populate({
                path: 'product',
                select: '_id englishName arabicName price status deleted'
              })
              .populate({
                path: 'customer',
                select: '_id representativeName'
              })
              .populate({
                path: 'supplier',
                select: '_id representativeName'
              })
              .then((customerProductPrice) => {
                const products = customerProductPrice.map(c => c).filter(c => c.product.deleted === false && c.product.status === 'Active');
                const resultProducts = products.slice(skip, (limit + skip) > products.length ? (products.length) // eslint-disable-line max-len
                  :
                  (limit + skip));
                if (customerProductPrice) {
                  if (req.query.export) {
                    if (req.user.language === 'en') {
                      ExportService.exportFile(`report_template/specialPrices/${req.query.export}-specialPrices-report-header-english.html`,
                        `report_template/specialPrices/${req.query.export}-specialPrices-report-body1-english.html`, customerProductPrice,
                        'Special Prices', '', req.query.export, res);
                    } else {
                      ExportService.exportFile(`report_template/specialPrices/${req.query.export}-specialPrices-report-header-arabic.html`,
                        `report_template/specialPrices/${req.query.export}-specialPrices-report-body1-arabic.html`, customerProductPrice,
                        'الاسعار الخاصة', '', req.query.export, res);
                    }
                  } else {
                    res.json(Response.success({
                      products: resultProducts,
                      count: customerProductPrice.length
                    }));
                  }
                }
              });
          } else {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(4));
          }
        });
      }
    } else {
      async.waterfall([
        function passParameters(callback) {
          callback(null, req.user._id, null, null, null, null);
        },
        getSupplierFromUser,
      ], (err, result) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else {
          match.supplier = result;
          CustomerProductPrice.find(match)
            .populate('product')
            .skip(req.body.skip)
            .limit(req.body.limit)
            .then((customerProductPrice) => {
              if (req.query.export) {
                if (req.user.language === 'en') {
                  ExportService.exportFile(`report_template/specialPrices/${req.query.export}-specialPrices-report-header-english.html`,
                    `report_template/specialPrices/${req.query.export}-specialPrices-report-body1-english.html`, customerProductPrice,
                    'Special Prices', '', req.query.export, res);
                  // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                } else {
                  ExportService.exportFile(`report_template/specialPrices/${req.query.export}-specialPrices-report-header-arabic.html`,
                    `report_template/specialPrices/${req.query.export}-specialPrices-report-body1-arabic.html`, customerProductPrice,
                    'الاسعار الخاصة', '', req.query.export, res);
                  // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                }
              } else {
                res.json(Response.success(customerProductPrice));
              }
            });
        }
      });
    }
  }
}

/**
 * Create customer special prices
 *  * @returns {Object} CustomerProductPrice
 */
function createSpecialPrices(req, res) {
  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id, null, null, null, null);
    },
    getSupplierFromUser,
    function passParameter(supplierId, customerEmail,
      supplierRelation, skip, limit, callback) {
      callback(null, supplierId, req.body.customerId, req.body.productId, 'new');
    },
    verifySupplierCustomerAndProduct
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else if (result.product) {
      const productPrice = new CustomerProductPrice({
        customer: req.body.customerId,
        supplier: result.supplierId._id,
        product: result.product,
        price: req.body.price
      });
      productPrice.save()
        .then((savedProductPrice) => {
          if (appSettings.emailSwitch) {
            const content = {
              recipientName: UserService.toTitleCase(result.customer.representativeName),
              productName: result.customer.user.language === 'en' ? result.product.englishName : result.product.arabicName
            };
            EmailHandler.sendEmail(result.customer.user.email, content, 'SPECIALPRICES', result.customer.user.language);
          }
          Customer.findById(req.body.customerId)
            .populate('user')
            .then((customer) => {
              const notification = {
                refObjectId: result.product,
                level: 'info',
                user: customer.user,
                userType: 'Customer',
                key: 'productSpecialPrice',
                stateParams: 'supplier'
              };
              notificationCtrl.createNotification('product', notification, null, null, null, result.supplierId._id);
            });
          res.json(Response.success(savedProductPrice));
        })
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(4));
    }
  });
}

/**
 * Update customer special prices
 * @returns {Object} CustomerProductPrice
 */
function updateSpecialPrices(req, res) {
  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id, null, null, null, null);
    },
    getSupplierFromUser,
    function passParameter(supplierId, customerEmail,
      supplierRelation, skip, limit, callback) {
      callback(null, supplierId, req.body.customerId, req.product._id, null);
    },
    verifySupplierCustomerAndProduct
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else if (result.product) {
      CustomerProductPrice.findOne({
        $and: [{
          product: req.product._id
        }, {
          customer: req.body.customerId
        }, {
          supplier: result.supplierId
        }]
      })
        .then((customerProductPrice) => {
          customerProductPrice.customerId = req.body.customerId;
          customerProductPrice.price = req.body.price;
          customerProductPrice.save()
            .then((savedProductPrice) => {
              if (appSettings.emailSwitch) {
                const content = {
                  recipientName: UserService.toTitleCase(result.customer.representativeName),
                  productName: result.customer.user.language === 'en' ? result.product.englishName : result.product.arabicName
                };
                EmailHandler.sendEmail(result.customer.user.email, content, 'SPECIALPRICES', result.customer.user.language);
              }
              Customer.findById(req.body.customerId)
                .populate('user')
                .then((customer) => {
                  const notification = {
                    refObjectId: result.product,
                    level: 'info',
                    user: customer.user,
                    userType: 'Customer',
                    key: 'productSpecialPrice',
                    stateParams: 'supplier'
                  };
                  notificationCtrl.createNotification('product', notification, null, null, null, result.supplierId._id);
                });
              res.json(Response.success(savedProductPrice));
            })
            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
        });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(4));
    }
  });
}

/**
 * Delete customer special prices
 * @returns {Object} CustomerProductPrice
 */
function deleteSpecialPrices(req, res) {
  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id, null, null, null, null);
    },
    getSupplierFromUser,
    function passParameter(supplierId, customerEmail,
      supplierRelation, skip, limit, callback) {
      callback(null, supplierId, req.query.customerId, req.product._id, null);
    },
    verifySupplierCustomerAndProduct
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else if (result.product) {
      CustomerProductPrice.findOne({
        product: result.product
      })
        .where('supplier').equals(result.supplierId)
        .then((customerProductPrice) => {
          if (customerProductPrice) {
            customerProductPrice.remove()
              .then(deletedCustomerProductPrice =>
                res.json(Response.success(deletedCustomerProductPrice)))
              .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
          } else {
            res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
          }
        });
    } else {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
    }
  });
}

function downloadProductPricing(req, res) {
  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id, null, null, null, null);
    },
    getSupplierFromUser
  ], (err, result) => {
    const objArr = [];
    Product.find({
      $and: [{
        supplier: result
      }, {
        status: 'Active'
      }, {
        deleted: false
      }]
    })
      .select('_id englishName arabicName price')
      .then((products) => {
        let newProductObject = {};
        let index = 0;
        products.forEach((CustomerProductPrices) => {
          CustomerProductPrice.findOne({
            customer: req.body.customerId,
            supplier: result,
            product: CustomerProductPrices
          }) // eslint-disable-line max-len
            .then((custProductSpecialPrices) => {
              if (appSettings.specialPriceSwitch) {
                if (custProductSpecialPrices) {
                  newProductObject = {
                    _id: CustomerProductPrices._id.toString(),
                    englishName: CustomerProductPrices.englishName,
                    arabicName: CustomerProductPrices.arabicName,
                    price: CustomerProductPrices.price,
                    specialPrice: custProductSpecialPrices.price
                  };
                  index += 1;
                  objArr.push(newProductObject);
                } else {
                  index += 1;
                }
              } else if (custProductSpecialPrices) {
                newProductObject = {
                  _id: CustomerProductPrices._id.toString(),
                  englishName: CustomerProductPrices.englishName,
                  arabicName: CustomerProductPrices.arabicName,
                  price: CustomerProductPrices.price,
                  specialPrice: custProductSpecialPrices.price
                };
                index += 1;
                objArr.push(newProductObject);
              } else {
                newProductObject = {
                  _id: CustomerProductPrices._id.toString(),
                  englishName: CustomerProductPrices.englishName,
                  arabicName: CustomerProductPrices.arabicName,
                  price: CustomerProductPrices.price,
                  specialPrice: ''
                };
                index += 1;
                objArr.push(newProductObject);
              }
              if (index === products.length) {
                /* make the worksheet */
                const ws = XLSX.utils.json_to_sheet(objArr);
                /* add to workbook */
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws);
                fs.unlink('t.xlsx');
                XLSX.writeFile(wb, 't.xlsx');
                const fileToSend = fs.readFileSync('t.xlsx');
                res.send(fileToSend);
              }
            });
        });
      });
  });
}

function uploadProductPricing(req, res) {
  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id, null, null, null, null);
    },
    getSupplierFromUser
  ], (err, result) => {
    upload(req, res, (err) => { // eslint-disable-line no-shadow
      if (req.file === null) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
      } else {
        /** Read the Excel file*/
        const workbook = XLSX.readFile(`images/${req.file.filename}`);
        const sheetName = workbook.SheetNames;
        /** Convert Sheet to Json*/
        const sheetsListContent = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName[0]]);
        fs.unlink(`images/${req.file.filename}`);
        // fs.unlink(`images/${req.file.filename}`);
        const failedProducts = [];
        const successProducts = [];
        const unchangedProducts = [];

        let failedCount = 0;
        let successCount = 0;
        let unchangedCount = 0;
        let index = 1;
        const resultObj = {};
        const productList = [];
        sheetsListContent.forEach((obj) => {
          if (obj._id) {
            resultObj[obj._id.toString()] = {
              _id: obj._id.toString(),
              englishName: obj.englishName,
              arabicName: obj.arabicName,
              price: obj.price,
              specialPrice: obj.specialPrice
            };
          } else {
            failedCount += 1;
            failedProducts.push(obj);
            if (index === productList.length) {
              res.json(Response.success({
                Success: {
                  Products: successProducts,
                  count: successCount
                },
                Failed: {
                  Products: failedProducts,
                  count: failedCount
                },
                Unchanged: {
                  Products: unchangedProducts,
                  count: unchangedCount
                }
              }));
            }
          }
        });
        for (const object in resultObj) { // eslint-disable-line guard-for-in, no-restricted-syntax
          const productItem = {
            _id: object,
            data: resultObj[object]
          };
          productList.push(productItem);
        }
        CustomerProductPrice.find({
          supplier: result,
          customer: req.params.customerId
        })
          .then((productSpecialPrice) => {
            productSpecialPrice.forEach((productSpecialPriceObj) => {
              productSpecialPriceObj.remove()
                .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
            });
          });
        Customer.findOne({
          _id: req.params.customerId
        })
          .then((customer) => {
            productList.forEach((obj) => {
              if (obj.data._id) {
                Product.findById(obj.data._id)
                  .then((product) => {
                    if (product) {
                      if ((obj.data.specialPrice === '') || !(obj.data.specialPrice)) {
                        unchangedCount += 1;
                        unchangedProducts.push(obj);
                        if (index === productList.length) {
                          res.json(Response.success({
                            Success: {
                              Products: successProducts,
                              count: successCount
                            },
                            Failed: {
                              Products: failedProducts,
                              count: failedCount
                            },
                            Unchanged: {
                              Products: unchangedProducts,
                              count: unchangedCount
                            }
                          }));
                        }
                      } else if ((String(Number(obj.data.specialPrice)) === 'NaN') || (Number(obj.data.specialPrice) < 0)) { // eslint-disable-line eqeqeq
                        failedCount += 1;
                        failedProducts.push(obj);
                        if (index === productList.length) {
                          res.json(Response.success({
                            Success: {
                              Products: successProducts,
                              count: successCount
                            },
                            Failed: {
                              Products: failedProducts,
                              count: failedCount
                            },
                            Unchanged: {
                              Products: unchangedProducts,
                              count: unchangedCount
                            }
                          }));
                        }
                      } else {
                        const customerNewSpecialPrice = new CustomerProductPrice({
                          customer,
                          supplier: result,
                          product: obj._id,
                          price: Number(obj.data.specialPrice)
                        });
                        successProducts.push(obj);
                        successCount += 1;
                        customerNewSpecialPrice.save();
                        if (index === productList.length) {
                          res.json(Response.success({
                            Success: {
                              Products: successProducts,
                              count: successCount
                            },
                            Failed: {
                              Products: failedProducts,
                              count: failedCount
                            },
                            Unchanged: {
                              Products: unchangedProducts,
                              count: unchangedCount
                            }
                          }));
                        }
                      }
                    } else {
                      failedCount += 1;
                      failedProducts.push(obj);
                      if (index === productList.length) {
                        res.json(Response.success({
                          Success: {
                            Products: successProducts,
                            count: successCount
                          },
                          Failed: {
                            Products: failedProducts,
                            count: failedCount
                          },
                          Unchanged: {
                            Products: unchangedProducts,
                            count: unchangedCount
                          }
                        }));
                      }
                    }
                    index += 1;
                  });
              } else {
                failedCount += 1;
                failedProducts.push(obj);
                if (index === productList.length) {
                  res.json(Response.success({
                    Success: {
                      Products: successProducts,
                      count: successCount
                    },
                    Failed: {
                      Products: failedProducts,
                      count: failedCount
                    },
                    Unchanged: {
                      Products: unchangedProducts,
                      count: unchangedCount
                    }
                  }));
                }
              }
            });
          });
      }
    });
  });
}

/* Helper Functions */


/**
 * Load customer and append to req.
 */
function loadByProductId(req, res, next, id) {
  Product.findById(id)
    .then((product) => {
      if (product) {
        req.product = product;
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Load customer and append to req.
 */
function load(req, res, next, id) {
  Customer.findById(id)
    .select('_id representativeName commercialRegister commercialRegisterPhoto commercialRegisterExpireDate coverPhoto location status photo user branch')
    .populate({
      path: 'user',
      select: 'email mobileNumber firstName lastName language status'
    })
    .populate('branch').lean()
    .then((customer) => {
      if (customer) {
        Branch.count({
          customer: customer._id
        }).then((branchCount) => {
          req.customer = customer;
          req.customer.branchCount = branchCount;
          return next();
        });
      } else {
        return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
      }
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Helper Function
 * Checks that the user's role is appropriate
 * @param {User} user - The updated user
 * @param {Customer} customer - The customer of the user
 */
function roleEligible(customer, user, callback) {
  Role.findById(user.role)
    .then((role) => {
      if (role) {
        let filter = true;
        if (customer.type === 'Customer') {
          filter = role.customer.toString() === customer._id.toString();
        } else {
          filter = role.customer.toString() === customer.customer.toString();
        }
        if (role.userType === 'Customer' && filter) {
          callback(null, customer, user);
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
    createUser,
    createCustomer
  ],
    (err, savedCustomer) => callback(err, savedCustomer));
}

/**
 * Helper Function
 * Creates the user
 * @property {User} user - The user.
 * @returns {User}
 */
function createUser(user, customer, callback) {
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
 * Get supplier using the user is.
 * @property {string} userId - The id of the supplier user.
 * @property {string} customerEmail - The email of the customer to be invited
 * @returns {Supplier}
 */
function getSupplierFromUser(userId, customerEmail, supplierRelation, skip, limit, callback) {
  Supplier.findOne()
    .where('staff').in([userId])
    .exec((err, supplier) => {
      callback(err, supplier, customerEmail, supplierRelation, skip, limit);
    });
}

/**
 * Helper Function
 * Get customer using the user.
 * @property {string} userId - The id of the customer user.
 * @returns {Supplier}
 */
function getCustomerFromUser(userId, supplierId, callback) {
  Customer.findOne({
    $or: [{
      user: userId
    }]
  })
    .select('_id representativeName commercialRegister commercialRegisterPhoto commercialRegisterExpireDate commercialRegisterExpireDateIslamic VATRegisterNumber coverPhoto location status photo user branch staff type')
    .populate({
      path: 'user',
      select: 'email mobileNumber firstName lastName language status'
    })
    .populate('branch')
    .exec((err, customer) => {
      if (customer) {
        customer.photo = `${appSettings.imagesUrl}${customer && customer.photo ? customer.photo : ''}`;
        customer.coverPhoto = `${appSettings.imagesUrl}${customer.coverPhoto}`;
      }
      // callback(err, customer._id, supplierId);
      callback(err, customer, supplierId);
    });
}

/**
 * Helper Function
 * Get customer using the userId
 * @returns {Customer}
 */
function getCustomer(userId, callback) {
  Customer.findOne()
    .populate('user')
    .where('user').equals(userId)
    .then(customer => callback(null, customer))
    .catch(e => callback(e, null));
}

/**
 * Helper Function
 * Get the customer using the email of the invited user
 * @property {string} userId - The id of the supplier user.
 * @returns {Supplier}
 */
function getCustomerFromEmail(supplier, customerEmail, supplierRelation, skip, limit, callback) {
  if (supplier.status === 'Active') {
    User.findOne()
      .where('email').equals(customerEmail)
      .then((user) => {
        // Check if the user exists
        if (user) {
          Customer.findOne()
            .populate('user')
            .where('user').equals(user._id)
            .then(customer => callback(null, customerEmail, customer, supplier, supplierRelation));
        } else {
          callback(null, customerEmail, null, supplier, supplierRelation);
        }
      })
      .catch(e => callback(e, null));
  } else {
    callback(4, null);
  }
}

/**
 * Helper Function
 * Create the credit record if the customer exists
 * @property {string} userId - The id of the supplier user.
 * @returns {Supplier}
 */
function initalizeSupplierRelation(customerEmail, customer, supplier, supplierRelation, callback) {
  CustomerInvite.findOne()
    .where('supplier').equals(supplier._id)
    .where('customerEmail').equals(customerEmail.toLowerCase())
    .then((ci) => {
      // Check if the customer is already invited
      if (ci) {
        callback(12, null);
      } else {
        if (customer) {
          const credit = new Credit({
            supplier: supplier._id,
            customer: customer._id
          });
          credit.save();
        } else {
          // Send an invitation to the customer
        }
        const customerInvite = new CustomerInvite({
          supplier: supplier._id,
          customerEmail: customerEmail.toLowerCase(),
          status: customer ? 'Active' : 'Invited',
          createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
          startPaymentDate: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
        });

        customerInvite.save()
          .then(savedCustomerInvite => callback(null, savedCustomerInvite));
      }
    })
    .catch(e => callback(e, null));
}

/**
 * Helper Function
 * Update the supplier relation
 * @property {string} customerEmail - The customer email.
 * @property {string} customer - The customer user.
 * @property {string} supplier - The supplier user.
 * @property {string} supplierRelation - The supplier/customer relation data.
 * @returns {CustomerInvite}
 */
function updateSupplierRelation(customerEmail, customer, supplier, supplierRelation, callback) {
  CustomerInvite.findOne()
    .where('customerEmail').equals(customerEmail)
    .where('supplier').equals(supplier._id)
    .then((ci) => {
      ci.status = supplierRelation.status;
      ci.creditLimit = supplierRelation.creditLimit;
      ci.paymentInterval = supplierRelation.paymentInterval;
      ci.paymentFrequency = supplierRelation.paymentFrequency;
      ci.exceedCreditLimit = supplierRelation.exceedCreditLimit;
      ci.exceedPaymentDate = supplierRelation.exceedPaymentDate;
      ci.nextPaymentDueDate = moment(ci.startPaymentDate).tz(appSettings.timeZone).add((supplierRelation.paymentFrequency), supplierRelation.paymentInterval).endOf('month').format(appSettings.momentFormat);
      ci.save()
        .then(savedCustomerInvite => callback(null, {
          savedCustomerInvite,
          customer
        }));
    })
    .catch(e => callback(e, null));
}

/**
 * Helper Function
 * Get the supplier's customers
 * @property {string} supplier - The id of the customer user.
 * @returns {CustomerInvite}
 */
function getSupplierCustomerInvites(supplier, customerEmail, supplierRelation,
  skip, limit, match, nameMatch, paymentMatch,
  payingSoon, statusMatch, callback) {
  if (limit === 100) {
    limit = 1000;
  }
  CustomerInvite.find()
    .where('supplier').equals(supplier._id)
    .select('customerEmail')
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({
      createdAt: -1
    })
    .then(customerInvites => callback(null, customerInvites, match, nameMatch,
      paymentMatch, payingSoon, supplier, statusMatch))
    .catch(e => callback(e, null));
}

/**
 * Helper Function
 * Get the supplier's customers full details
 * @property {CustomerInvite []} customerInvites - The id of the customer user.
 * @returns {Customer []}
 */
function getSupplierCustomers(customerInvites, match, nameMatch, paymentMatch,
  payingSoon, supplier, statusMatch, callback) {
  const customerObject = [];
  let index = 0;
  customerInvites.forEach((inviteObj) => {
    User.findOne({
      email: inviteObj.customerEmail
    })
      .then((user) => {
        Customer.findOne({
          user,
          type: 'Customer'
        })
          .then((customer) => {
            Order.find({
              $and: [{
                status: {
                  $ne: 'Delivered'
                }
              }, {
                status: {
                  $ne: 'Canceled'
                }
              }, {
                status: {
                  $ne: 'CanceledByCustomer'
                }
              }, {
                status: {
                  $ne: 'Rejected'
                }
              }, {
                status: {
                  $ne: 'FailedToDeliver'
                }
              }],
              supplier,
              customer
            })
              .then((orders) => {
                const reservedBalance = orders.map(c => c.price + c.VAT).reduce((sum, value) => sum + value, 0); // eslint-disable-line max-len
                inviteObj.reservedBalance = reservedBalance;
                inviteObj.save();
              });
          });
      });
  });
  if (customerInvites.length > 0) {
    User.find()
      .where('email').in(customerInvites.map(ci => ci.customerEmail)).sort({
        createdAt: -1
      })
      .then((users) => {
        users.forEach((userObj) => {
          Customer.findOne({
            $and: [nameMatch, {
              user: userObj,
              type: 'Customer'
            }]
          })
            .populate('user').populate('location.city')
            .then((customerObj) => {
              if (customerObj) {
                customerObj.coverPhoto = `${appSettings.imagesUrl}${customerObj.coverPhoto}`;
                customerObj.photo = `${appSettings.imagesUrl}${customerObj.photo}`;
                CustomerInvite.findOne({
                  $and: [{
                    customerEmail: userObj.email
                  }, {
                    supplier: supplier._id
                  }, statusMatch, match]
                }) // eslint-disable-line max-len
                  .then((obj) => {
                    if (obj) {
                      let createdAtDate = '';
                      let interval = '';
                      let frequency = '';
                      if (obj.paymentInterval === 'Month') {
                        interval = 'M';
                        frequency = obj.paymentFrequency;
                      } else if (obj.paymentInterval === 'Week') {
                        interval = 'days';
                        frequency = obj.paymentFrequency * 7;
                      } else {
                        interval = 'days';
                        frequency = obj.paymentFrequency;
                      }
                      for (createdAtDate = moment(obj.createdAt).tz(appSettings.timeZone); moment().tz(appSettings.timeZone).diff(createdAtDate, 'days') > 0; // eslint-disable-line max-len
                        createdAtDate = createdAtDate.add(Number(frequency), interval)) {
                        // fromDate = createdAtDate.utc().format(appSettings.momentFormat);
                      }
                      Transaction.find({
                        customer: customerObj,
                        supplier,
                        createdAt: {
                          $gt: moment().startOf('month').tz(appSettings.timeZone).format(appSettings.momentFormat)
                        }
                      })
                        .populate({
                          path: 'order',
                          select: '_id price VAT status'
                        })
                        .sort({
                          createdAt: -1
                        })
                        .then((customerTransaction) => {
                          if (customerTransaction.length > 0) {
                            const customerArrObj = {
                              _id: customerObj._id,
                              representativePhone: customerObj.representativePhone,
                              representativeEmail: customerObj.representativeEmail,
                              commercialRegister: customerObj.commercialRegister,
                              // commercialRegisterPhoto: customerObj.commercialRegisterPhoto,
                              commercialRegisterExpireDate: customerObj.commercialRegisterExpireDate, // eslint-disable-line max-len
                              representativeName: customerObj.representativeName,
                              user: customerObj.user,
                              coverPhoto: customerObj.coverPhoto,
                              location: customerObj.location,
                              status: obj.status,
                              photo: customerObj.photo,
                              balance: customerTransaction[0].close,
                              remainingTillLimit: Math.min(obj.creditLimit, obj.creditLimit - customerTransaction.map(c => c).filter(c => c.type === 'debit').map(c => c.amount).reduce((sum, value) => sum + value, 0) - obj.reservedBalance), // (obj.reservedBalance +(obj.reservedBalance * appSettings.VATPercent))),
                              paymentDue: createdAtDate.tz(appSettings.timeZone).format(appSettings.momentFormat), // eslint-disable-line max-len
                              dueDateMissed: customerObj.dueDateMissed,
                              payingSoon: customerObj.payingSoon,
                              nextPaymentDueDate: obj.nextPaymentDueDate,
                              createdAt: customerObj.createdAt
                            };
                            customerObject.push(customerArrObj);
                            index += 1;
                          } else {
                            const customerArrObj = {
                              _id: customerObj._id,
                              representativePhone: customerObj.representativePhone,
                              representativeEmail: customerObj.representativeEmail,
                              commercialRegister: customerObj.commercialRegister,
                              // commercialRegisterPhoto: customerObj.commercialRegisterPhoto,
                              commercialRegisterExpireDate: customerObj.commercialRegisterExpireDate, // eslint-disable-line max-len
                              representativeName: customerObj.representativeName,
                              user: customerObj.user,
                              coverPhoto: customerObj.coverPhoto,
                              location: customerObj.location,
                              status: obj.status,
                              photo: customerObj.photo,
                              balance: 0,
                              remainingTillLimit: obj.creditLimit - obj.reservedBalance, // eslint-disable-line max-len
                              paymentDue: createdAtDate.tz(appSettings.timeZone).format(appSettings.momentFormat), // eslint-disable-line max-len
                              dueDateMissed: customerObj.dueDateMissed,
                              nextPaymentDueDate: obj.nextPaymentDueDate,
                              createdAt: customerObj.createdAt
                            };
                            customerObject.push(customerArrObj);
                            index += 1;
                          }
                          if (index >= users.length) {
                            const respondObject = {
                              customers: customerObject.sort((a, b) => b.createdAt - a.createdAt),
                              count: customerObject.length
                            };
                            callback(null, respondObject);
                          }
                        });
                    } else {
                      index += 1;
                      if (index >= users.length) {
                        const respondObject = {
                          customers: customerObject.sort((a, b) => b.createdAt - a.createdAt),
                          count: customerObject.length
                        };
                        callback(null, respondObject);
                      }
                    }
                  });
              } else {
                index += 1;
                if (index >= users.length) {
                  const respondObject = {
                    customers: customerObject,
                    count: customerObject.length
                  };
                  callback(null, respondObject);
                }
              }
            });
        });
      })
      .catch(e => callback(e, null));
  } else {
    const respondObject = {
      customers: customerObject,
      count: customerObject.length
    };
    callback(null, respondObject);
  }
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
 * get customer's billing transaction
 * @returns {Object} - Transaction
 */
function getCustomerTransactions(supplierId, customerId, skip, limit, callback) {
  let match = '';
  if (supplierId === null) {
    match = {
      customer: customerId
    };
  } else {
    match = {
      $and: [{
        supplier: supplierId
      }, {
        customer: customerId
      }]
    };
  }
  const transactions = [];
  Transaction.find(match)
    .where('type').equals('credit')
    .populate({
      path: 'supplier',
      select: '_id representativeName'
    })
    .populate({
      path: 'customer',
      select: '_id representativeName'
    })
    .select('_id supplier customer amount type paymentMethod close createdAt transId recipientName chequeNumber transactionId accountNumber accountName PVAT')
    .then((trans) => {
      Invoice.find(match)
        .populate({
          path: 'supplier',
          select: '_id representativeName'
        })
        .populate({
          path: 'customer',
          select: '_id representativeName'
        })
        .populate({
          path: 'transactions',
          select: '_id order open close createdAt amount transId supplier customer isPaid PVAT',
          populate: {
            path: 'order supplier customer',
            select: '_id price VAT  supplier customer _id representativeName _id representativeName',
            populate: {
              path: 'supplier customer',
              select: '_id representativeName _id representativeName'
            }
          }
        })
        .then((invoices) => {
          invoices.forEach((invoiceObj) => {
            const transactionsOrderTotal = invoiceObj.transactions.map(c => c.order.price);
            let subTotal = 0;
            transactionsOrderTotal.forEach((value) => {
              subTotal += (value);
            });
            const invoiceTotal = subTotal + (subTotal * appSettings.VATPercent);
            const invoiceTransactions = [];
            invoiceObj.transactions.forEach((transactionObj) => {
              invoiceTransactions.push({
                _id: transactionObj._id,
                order: transactionObj.order,
                open: transactionObj.open,
                close: transactionObj.close,
                createdAt: transactionObj.createdAt,
                amount: transactionObj.amount,
                transId: transactionObj.transId,
                supplier: transactionObj.supplier,
                customer: transactionObj.customer,
                isPaid: transactionObj.isPaid,
                PVAT: transactionObj.PVAT,
                transactionAmount: transactionObj.order.price
              });
            });
            const invoice = {
              _id: invoiceObj._id,
              invoiceId: invoiceObj.invoiceId,
              transactions: invoiceObj.transactions,
              supplier: invoiceObj.supplier,
              customer: invoiceObj.customer,
              payments: invoiceObj.payments,
              createdAt: invoiceObj.createdAt,
              dueDate: invoiceObj.dueDate,
              type: 'invoice',
              total: invoiceTotal,
              subTotal,
              VAT: subTotal * appSettings.VATPercent
            };
            transactions.push(invoice);
          });
          trans.forEach((transactionObj) => {
            const transaction = {
              _id: transactionObj._id,
              supplier: transactionObj.supplier,
              customer: transactionObj.customer,
              amount: transactionObj.amount,
              transId: transactionObj.transId,
              type: transactionObj.type,
              from: transactionObj.customer.representativeName,
              to: transactionObj.supplier.representativeName,
              recipientName: transactionObj.recipientName,
              chequeNumber: transactionObj.chequeNumber,
              transactionId: transactionObj.transactionId,
              accountNumber: transactionObj.accountNumber,
              accountName: transactionObj.accountName,
              paymentMethod: transactionObj.paymentMethod,
              close: transactionObj.close,
              createdAt: transactionObj.createdAt
            };
            transactions.push(transaction);
          });
          let transactionsObject = transactions.slice(skip, (limit + skip) > transactions.length ? (transactions.length) // eslint-disable-line max-len
            :
            (limit + skip));
          transactionsObject = transactionsObject.sort((a, b) => b.createdAt - a.createdAt);
          callback(null, {
            transactions: transactionsObject,
            count: trans.length + invoices.length
          }, customerId, supplierId); // eslint-disable-line max-len
        });
    });
}

/**
 * Helper Function
 * Returns customer's Details.
 * @param {Object} billingHistory.
 * @param {Customer} customerId - The customer of the user.
 * return {Object} customer profile details.
 */
function getCustomerDetails(billingHistory, customerId, supplierId, callback) {
  const toDate = moment().tz(appSettings.timeZone).format(appSettings.momentFormat); // eslint-disable-line no-unused-vars
  let fromDate = ''; // eslint-disable-line no-unused-vars
  Customer.findOne({
    _id: customerId
  })
    .populate('user')
    .then((customer) => {
      CustomerInvite.findOne({
        customerEmail: customer.user.email,
        supplier: supplierId
      })
        .then((customerInvite) => {
          let createdAtDate = '';
          let interval = '';
          let intervalPeriod = ''; // eslint-disable-line no-unused-vars
          let frequency = '';
          if (customerInvite.paymentInterval === 'Month') {
            interval = 'M';
            intervalPeriod = 'month';
            frequency = customerInvite.paymentFrequency;
          } else if (customerInvite.paymentInterval === 'Week') {
            interval = 'days';
            intervalPeriod = 'week';
            frequency = customerInvite.paymentFrequency * 7;
          } else {
            interval = 'days';
            intervalPeriod = 'day';
            frequency = customerInvite.paymentFrequency;
          }
          const nextPaymentDate = moment(customerInvite.nextPaymentDueDate).tz(appSettings.timeZone); // eslint-disable-line max-len
          for (createdAtDate = moment(customerInvite.createdAt).tz(appSettings.timeZone); moment().tz(appSettings.timeZone).diff(createdAtDate, 'days') > 0; createdAtDate = createdAtDate.add(Number(frequency), interval)) {
            fromDate = createdAtDate.tz(appSettings.timeZone).format(appSettings.momentFormat);
          }
          customerInvite.days = createdAtDate.diff(moment(), 'days');
          customerInvite.save()
            .then((savedCustomerInvite) => {
              Transaction.find({
                customer: customerId,
                supplier: supplierId,
                createdAt: {
                  $gt: moment().startOf('month').tz(appSettings.timeZone).format(appSettings.momentFormat)
                }
              })
                .sort({
                  createdAt: -1
                })
                .then((customerTransaction) => {
                  let customerBalance = '';
                  if (customerTransaction.length > 0) {
                    customerBalance = customerTransaction[0].close;
                  } else {
                    customerBalance = 0;
                  }
                  // const startPaymentDueDate = moment(savedCustomerInvite.nextPaymentDueDate).subtract(Number(frequency), interval).startOf('day');
                  const customerMonthCredit = customerTransaction.map(c => c).filter(c => c.type === 'debit' && (moment(c.createdAt) >= moment(savedCustomerInvite.startPaymentDate).tz(appSettings.timeZone).startOf('day') && moment(c.createdAt) <= moment(savedCustomerInvite.nextPaymentDueDate).tz(appSettings.timeZone).endOf('day')))
                    .map(c => c.amount).reduce((sum, value) => sum + value, 0);
                  Order.find({
                    $and: [{
                      supplier: supplierId
                    }, {
                      customer
                    }, {
                      $and: [{
                        status: {
                          $ne: 'Delivered'
                        }
                      }, {
                        status: {
                          $ne: 'Canceled'
                        }
                      }, {
                        status: {
                          $ne: 'CanceledByCustomer'
                        }
                      }, {
                        status: {
                          $ne: 'Rejected'
                        }
                      }, {
                        status: {
                          $ne: 'FailedToDeliver'
                        }
                      }]
                    }]
                  })
                    .then((orders) => {
                      const reservedBalance = orders.map(c => c.price + c.VAT).reduce((sum, value) => sum + value, 0); // eslint-disable-line max-len
                      const balanceDetails = {
                        balance: customerBalance,
                        monthCredit: (Math.abs(customerMonthCredit) + reservedBalance),
                        payment: {
                          interval: savedCustomerInvite.paymentInterval,
                          frequency: savedCustomerInvite.paymentFrequency
                        },
                        days: savedCustomerInvite.days,
                        nextPaymentDate,
                        nextInvoiceDate: moment().tz(appSettings.timeZone).endOf('month').format(appSettings.momentFormat),
                        creditLimit: savedCustomerInvite.creditLimit,
                        exceedCreditLimit: savedCustomerInvite.exceedCreditLimit,
                        exceedPaymentDate: savedCustomerInvite.exceedPaymentDate,
                        status: savedCustomerInvite.status
                      };
                      callback(null, {
                        balanceDetails,
                        billingHistory
                      });
                    });
                });
            });
        });
    });
}

/**
 * Helper Function
 * Returns customer's Special Prices.
 * @param {Supplier} supplierId.
 * @param {Customer} customer - The customer of the user.
 * return {Object} customer special prices details.
 */
function getCustomerSpecialPrices(customer, supplierId, skip, limit, callback) {
  CustomerProductPrice.find({
    supplier: supplierId
  })
    .sort({
      updatedAt: -1
    })
    .populate({
      path: 'product',
      select: '_id englishName arabicName price status deleted'
    })
    .populate({
      path: 'customer',
      select: '_id representativeName'
    })
    .populate({
      path: 'supplier',
      select: '_id representativeName'
    })
    .where('customer').equals(customer)
    .then((productPrice) => {
      const products = productPrice.map(c => c).filter(c => c.product.deleted === false && c.product.status === 'Active');
      const resultProducts = products.slice(skip, (limit + skip) > products.length ? (products.length) // eslint-disable-line max-len
        :
        (limit + skip));
      callback(null, {
        products: resultProducts,
        count: productPrice.length
      });
    });
}

function verifySupplierCustomerAndProduct(supplierId, customerId, productId,
  newSpecialPrice, callback) {
  CustomerInvite.find({
    supplier: supplierId
  })
    .select('customerEmail')
    .then((customerInvites) => {
      const customerInvitesArr = customerInvites.map(c => c.customerEmail);
      User.find()
        .where('email').in(customerInvitesArr)
        .then((users) => {
          const usersArr = users.map(c => c._id.toString());
          Customer.findOne({
            _id: customerId
          })
            .populate('user')
            .where('user').in(usersArr)
            .then((customer) => {
              if (customer.length <= 0) {
                callback(4, null);
              } else if (newSpecialPrice !== null) {
                CustomerProductPrice.findOne({
                  $and: [{
                    supplier: supplierId
                  },
                  {
                    customer: customerId
                  }, {
                    product: productId
                  }
                  ]
                })
                  .then((customerPrice) => {
                    if (customerPrice) {
                      callback(19, null);
                    } else {
                      Product.findOne({
                        $and: [{
                          _id: productId
                        },
                        {
                          supplier: supplierId
                        }
                        ]
                      })
                        .then((product) => {
                          callback(null, {
                            product,
                            supplierId,
                            customer
                          });
                        });
                    }
                  });
              } else {
                Product.findOne({
                  $and: [{
                    _id: productId
                  },
                  {
                    supplier: supplierId
                  }
                  ]
                })
                  .then((product) => {
                    callback(null, {
                      product,
                      supplierId,
                      customer
                    });
                  });
              }
            });
        });
    });
}

function createUserAndAddToCustomer(customer, user, callback) {
  async.parallel({
    staff: parallelCallback => createStaffUser(customer, user, null, parallelCallback),
    customer: parallelCallback => addStaffToCustomer(user, customer, parallelCallback)
  },
    (err, result) => {
      callback(err, {
        customer,
        staff: result.staff[result.staff.length - 1]
      });
    });
}

/**
 * Helper Function
 * Creates the user
 * @property {User} user - The user.
 * @returns {User}
 */
function createStaffUser(customer, user, role, callback) {
  async.waterfall([
    function passParameters(outerCallback) {
      outerCallback(null, customer, user);
    },
    roleEligible,
    function passParameters(customerData, userData, innerCallback) {
      innerCallback(null, userData);
    },
    UserService.isEmailMobileNumberDuplicate,
    UserService.hashPasswordAndSave
  ],
    (err, savedUser) => {
      if (err) {
        // supplier.remove();
        callback(err, null, null);
      } else {
        callback(null, customer, savedUser);
      }
    });
}

/**
 * Helper Function
 * Adds the staff member to the supplier
 * @property {User} user - The user.
 * @property {Supplier} supplier - The supplier.
 * @returns {Supplier}
 */
let addStaffToCustomer = (user, customer, callback) => {
  // customer.staff.addToSet(user._id);

  const createStaff = new Customer({
    user: user._id,
    type: 'Staff',
    customer: customer._id,
    status: 'Active',
    representativeName: `${user.firstName} ${user.lastName}`,
    representativePhone: user.mobileNumber,
    representativeEmail: user.email
  });

  createStaff.save()
    .then(savedUser => callback(null, savedUser))
    .catch(e => callback(e, null));

  // Customer.update({ _id: customer._id }, { $push: { staff: user._id } })
  //   .then(savedCustomer => callback(null, savedCustomer))
  //   .catch(e => callback(e, null));
};


/**
 * Helper Function
 * Get supplier using the user.
 * @property {string} userId - The id of the supplier user.
 * @returns {Supplier}
 */
function getCustomerFromUserForStaff(userId, skip, limit, staffQueryMatch, roleMatch, callback) {
  Customer.findOne({
    user: userId
  })
    .populate('user')
    .exec((err, customer) => {
      callback(err, customer, userId, skip, limit, staffQueryMatch, roleMatch);
    });
}

/**
 * Helper Function
 * Get supplier's staff.
 * @property {User} user - The new staff user.
 * @property {Supplier} supplier - The supplier user.
 * @returns {User []}
 */
function getCustomerStaff(customer, userId, skip, limit, staffQueryMatch, roleMatch, callback) {
  let isStaff = false,
    filter = {
      customer: customer._id,
      type: 'Staff'
    };

  if (customer.type === 'Staff') {
    isStaff = true;
    filter = {
      customer: customer.customer,
      type: 'Staff'
    };
  }

  Customer.find(filter)
    .populate({
      path: 'user',
      select: '_id email mobileNumber firstName lastName status role invitedBy',
      // match: { $and: [staffQueryMatch, roleMatch, { _id: { $ne: userId } }, { invitedBy: userId }] },
      match: {
        $and: [staffQueryMatch, roleMatch]
      },
      options: {
        limit: Number(limit),
        skip: Number(skip)
      },
      populate: {
        path: 'role',
        select: '_id arabicName englishName'
      }
    })
    .select('user')
    .exec((err, cust) => {
      const staff = cust;

      if (staff && staff.length === 0) {
        Customer.find(filter)
          .populate({
            path: 'user',
            select: '_id email mobileNumber firstName lastName role',
            match: {
              $and: [staffQueryMatch, roleMatch]
            },
            populate: {
              path: 'role',
              select: '_id arabicName englishName'
            }
          })
          .select('user')
          .then((staffCount) => {
            const customerStaffObject = {
              staff: staffCount,
              count: staffCount.length,
              isStaff
            };
            callback(err, customerStaffObject);
          });
      } else {
        const customerStaffObject = {
          staff,
          count: staff.length,
          isStaff
        };
        callback(err, customerStaffObject);
      }
    });
}

/**
 * Helper Function
 * Get supplier with their staff using the user.
 * @property {string} userId - The id of the supplier user.
 * @returns {Supplier}
 */
function getCustomerWithStaffFromUser(userId, callback) {
  Customer.findOne({
    user: userId
  })
    .populate('user')
    .exec((err, customer) => callback(err, customer));
}

function fixCustomerStaff() {
  Customer.update({}, {
    $set: {
      type: 'Customer'
    }
  }, {
    multi: true
  }).then(updated => Customer.find({
    type: 'Customer'
  }).populate({
    path: 'staff'
  }).lean()).then((customers) => {
    async.eachOfSeries(customers, (cus, key, callback) => {
      async.eachOfSeries(cus.staff, (staff, key2, callback2) => {
        const createStaff = new Customer({
          user: staff._id,
          type: 'Staff',
          customer: cus._id,
          status: 'Active',
          representativeName: `${staff.firstName} ${staff.lastName}`,
          representativePhone: staff.mobileNumber,
          representativeEmail: staff.email
        });

        createStaff.save().then(() => {
          callback2();
        }).catch((err) => {
          callback2();
        });
      }, () => {
        callback();
      });
    }, () => {
      console.log('done');
    });
  });
}

/**
 * Helper Function
 * Update Customer City.
 * @property {string} customerId - The id of the customer.
 * @returns {Customer}
 */
function updateCustomerCity(req, res) {
  Customer.findOneAndUpdate({
    _id: req.params.customerId
  }, {
    $set: {
      'location.city': req.body.cityId
    }
  }).then((customer) => {
    res.json(Response.success(customer));
  });
}

/**
 * Helper Function
 * Update Customer Address.
 * @property {string} customerId - The id of the customer.
 * @returns {Customer}
 */
function updateCustomerAddress(req, res) {
  Customer.findOneAndUpdate({
    _id: req.params.customerId
  }, {
    $set: {
      'location.address': req.body.address,
      'location.coordinates': req.body.coordinates
    }
  }).then((customer) => {
    res.json(Response.success(customer));
  });
}

export default {
  load,
  loadByProductId,
  get,
  getCurrent,
  create,
  update,
  list,
  invite,
  updateRelation,
  getBillingHistory,
  unblock,
  block,
  addStaff,
  getStaff,
  updateStaff,
  removeStaff,
  getSpecialPrices,
  createSpecialPrices,
  updateSpecialPrices,
  downloadProductPricing,
  uploadProductPricing,
  deleteSpecialPrices,
  fixCustomerStaff,
  updateCustomerCity,
  updateCustomerAddress,
  inviteExcel
};
