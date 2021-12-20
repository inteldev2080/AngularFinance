import async from 'async';
import httpStatus from 'http-status';
import momentHijri from 'moment-hijri';
import EmailHandler from '../../config/emailHandler';
import appSettings from '../../appSettings';
import Supplier from '../models/supplier.model';
import User from '../models/user.model';
import Customer from '../models/customer.model';
import CustomerInvite from '../models/customerInvite.model';
import Order from '../models/order.model';
import Transaction from '../models/transaction.model';
import UserService from '../services/user.service';
import Response from '../services/response.service';
import Role from '../models/role.model';
import Permission from '../models/permission.model';
import Invoice from '../models/invoice.model';
import ExportService from '../controllers/exportFileService';
import notificationCtrl from '../controllers/notification.controller';
import Branches from '../models/branch.model';
import OrderProduct from '../models/orderProduct.model';

// const debug = require('debug')('app:supplier');
const moment = require('moment-timezone');


/**
 * Get supplier
 * @returns {Supplier}
 */
function get(req, res) {
  // Check if the user is a customer and has access to this supplier, or an admin or current user.
  if (req.user.type === 'Customer') {
    CustomerInvite.findOne()
      .where('customerEmail').equals(req.user.email)
      .where('supplier').equals(req.supplier._id)
      .then((customerInvite) => {
        if (customerInvite) {
          const resultObject = {
            _id: req.supplier._id,
            representativeName: req.supplier.representativeName,
            commercialRegister: req.supplier.commercialRegister,
            commercialRegisterPhoto: req.supplier.commercialRegisterPhoto,
            commercialRegisterExpireDate: req.supplier.commercialRegisterExpireDate,
            photo: req.supplier.photo,
            coverPhoto: req.supplier.coverPhoto,
            status: req.supplier.status,
            location: req.supplier.location,
            user: req.supplier.staff[0]
          };
          res.json(Response.success(resultObject));
        } else {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
        }
      })
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  } else if (req.user.type === 'Admin' ||
    (req.user.type === 'Supplier' && checkUserInSupplier(req.supplier, req.user._id))) {
    const resultObject = {
      _id: req.supplier._id,
      representativeName: req.supplier.representativeName,
      commercialRegister: req.supplier.commercialRegister,
      commercialRegisterPhoto: req.supplier.commercialRegisterPhoto,
      commercialRegisterExpireDate: req.supplier.commercialRegisterExpireDate,
      photo: req.supplier.photo,
      coverPhoto: req.supplier.coverPhoto,
      status: req.supplier.status,
      location: req.supplier.location,
      user: req.supplier.staff[0],
      VATRegisterNumber: req.supplier.VATRegisterNumber,
      VATRegisterPhoto: req.supplier.VATRegisterPhoto
    };
    res.json(Response.success(resultObject));
  }
}

/**
 * Get current supplier profile
 * @returns {Supplier}
 */
function profile(req, res) {
  Supplier.findOne().select({
    representativeName: 1,
    commercialRegister: 1,
    commercialRegisterPhoto: 1,
    commercialRegisterExpireDate: 1,
    commercialRegisterExpireDateIslamic: 1,
    VATRegisterNumber: 1,
    VATRegisterPhoto: 1,
    location: 1,
    photo: 1,
    coverPhoto: 1,
    address: 1,
    staff: 1
  })
    .populate({
      path: 'staff',
      select: '_id role email mobileNumber firstName lastName language status',
      match: { _id: req.user._id }
    })
    .where('staff').in([req.user._id])
    .then((supplier) => {
      const resultObject = {
        _id: supplier._id,
        representativeName: supplier.representativeName,
        commercialRegister: supplier.commercialRegister,
        commercialRegisterPhoto: supplier.commercialRegisterPhoto,
        VATRegisterNumber: supplier.VATRegisterNumber,
        VATRegisterPhoto: supplier.VATRegisterPhoto,
        commercialRegisterExpireDate: supplier.commercialRegisterExpireDate,
        commercialRegisterExpireDateIslamic: supplier.commercialRegisterExpireDateIslamic,
        photo: `${appSettings.imagesUrl}${supplier.photo}`,
        coverPhoto: `${appSettings.imagesUrl}${supplier.coverPhoto}`,
        status: supplier.status,
        location: supplier.location,
        user: supplier.staff[0]
      };
      res.json(Response.success(resultObject));
    });
}

/**
 * Create new supplier
 * @property {string} req.body.representativeName - The representativeName of supplier.
 * @property {string} req.body.commercialRegister - The commercial register of supplier.
 * @property {string} req.body.commercialRegisterPhoto - The commercial register photo of supplier.
 * @property {string} req.body.userEmail - The supplier admin user's email.
 * @property {string} req.body.userMobilePhone - The supplier admin user's mobile phone.
 * @property {string} req.body.userFirstName - The supplier admin user's first name.
 * @property {string} req.body.userLastName - The supplier admin user's last name.
 * @property {string} req.body.userPassword - The supplier admin user's password.
 * @returns {Supplier}
 */
function create(req, res) {
  console.log(req.body);
  const user = new User({
    email: req.body.userEmail.toLowerCase(),
    mobileNumber: req.body.userMobilePhone,
    password: req.body.userPassword,
    firstName: req.body.userFirstName.toLowerCase(),
    lastName: req.body.userLastName.toLowerCase(),
    language: req.body.language,
    type: 'Supplier',
    createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  });

  const todayDate = moment().tz(appSettings.timeZone);
  let futureDate = '';
  let days = 0;
  if (req.body.paymentInterval) {
    if (req.body.paymentInterval === 'Month') {
      futureDate = moment(todayDate).tz(appSettings.timeZone).add(Number(req.body.paymentFrequency), 'M');
    } else if (req.body.paymentInterval === 'Week') {
      futureDate = moment(todayDate).tz(appSettings.timeZone).add(Number(req.body.paymentFrequency) * 7, 'days');
    } else {
      futureDate = moment(todayDate).tz(appSettings.timeZone).add(Number(req.body.paymentFrequency), 'days');
    }
    days = futureDate.diff(todayDate, 'days');
  } else {
    days = moment().tz(appSettings.timeZone).add(1, 'M').diff(moment(), 'days');
  }

  let supplierStatus = '';
  // if (req.user.type === 'Admin') {
  //   supplierStatus = 'Active';
  // } else {
  //   supplierStatus = 'Suspended';
  // }
  if (req.query.admin) {
    supplierStatus = 'Active';
    user.status = 'Active';
  } else {
    supplierStatus = 'Suspended';
    user.status = 'Suspended';
  }
  const supplier = new Supplier({
    photo: req.body.photo,
    coverPhoto: req.body.coverPhoto,
    representativeName: req.body.representativeName.toLowerCase(),
    location: {
      // coordinates: [req.body.latitude, req.body.longitude]
      coordinates: req.body.coordinates,
      address: req.body.address
    },
    commercialRegister: req.body.commercialRegister,
    commercialRegisterPhoto: req.body.commercialRegisterPhoto,
    commercialRegisterExpireDate: req.body.commercialRegisterExpireDate ? moment(req.body.commercialRegisterExpireDate) : '',
    commercialRegisterExpireDateIslamic: req.body.commercialRegisterExpireDateIslamic ? momentHijri(req.body.commercialRegisterExpireDateIslamic) : '',
    staff: [user._id],
    paymentFrequency: req.body.paymentFrequency,
    paymentInterval: req.body.paymentInterval,
    address: req.body.address,
    days,
    status: supplierStatus,
    createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
    startPaymentDate: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
    VATRegisterNumber: req.body.VATRegisterNumber ? Number(req.body.VATRegisterNumber) : 0,
    VATRegisterPhoto: req.body.VATRegisterPhoto ? req.body.VATRegisterPhoto : null
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
              res.status(httpStatus.NOT_FOUND).json(Response.failure(err));
            } else {
              result.photo = `${appSettings.imagesUrl}${result.photo}`;
              result.coverPhoto = `${appSettings.imagesUrl}${result.coverPhoto}`;
              if (appSettings.emailSwitch) {
                if (req.query.admin) {
                  const content = {
                    recipientName: UserService.toTitleCase(req.body.userFirstName),
                    loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                    userName: req.body.userEmail,
                    password: req.body.userPassword
                  };
                  EmailHandler.sendEmail(req.body.userEmail, content, 'INVITESUPPLIER', req.body.language);
                } else {
                  const content = {
                    recipientName: UserService.toTitleCase(result.representativeName),
                    loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                    userName: req.body.userEmail,
                    password: req.body.userPassword
                  };
                  EmailHandler.sendEmail(req.body.userEmail, content, 'NEWUSER', req.body.language);
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
 * Create new supplier
 * @property {string} req.query.supplierId
 * @returns {Supplier}
 */
function approve(req, res) {
  const supplier = req.supplier;
  supplier.status = 'Active';

  User.findById(supplier.staff[0]._id)
    .then((userSupplier) => {
      userSupplier.status = 'Active';
      userSupplier.save()
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
    });

  supplier.save()
    .then((savedSupplier) => {
      savedSupplier.photo = `${savedSupplier.photo}`;
      savedSupplier.coverPhoto = `${savedSupplier.coverPhoto}`;
      if (appSettings.emailSwitch) {
        const content = {
          recipientName: UserService.toTitleCase(savedSupplier.representativeName)
        };
        EmailHandler.sendEmail(supplier.staff[0].email, content, 'APPROVEUSER', supplier.staff[0].language);
      }
      res.json(Response.success(savedSupplier));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

function updateName(req, res) {
  const supplier = req.supplier;
  let emailFlag = false;
  let mobileNumberFlag = false;
  User.findOne({ email: req.body.user.email })
    .then((emailExist) => {
      emailFlag = emailExist !== null;
      User.findOne({ mobileNumber: req.body.user.mobileNumber })
        .then((mobileNumberExist) => {
          mobileNumberFlag = mobileNumberExist !== null;
          supplier.representativeName = req.body.representativeName;
          if (req.body.user.email.trim() === supplier.staff[0].email.trim() && req.body.user.mobileNumber.trim() === supplier.staff[0].mobileNumber.trim()) {
            User.findOne({ email: supplier.staff[0].email })
              .then((user) => {
                user.email = req.body.user.email;
                user.mobileNumber = req.body.user.mobileNumber;
                user.firstName = req.body.user.firstName;
                user.lastName = req.body.user.lastName;
                user.save()
                  .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
              });
          } else if ((emailFlag === true && req.body.user.email.trim() !== supplier.staff[0].email.trim())) {
            res.status(httpStatus.BAD_REQUEST).json(Response.failure(29));
          } else if (mobileNumberFlag === true && req.body.user.mobileNumber.trim() !== supplier.staff[0].mobileNumber.trim()) {
            res.status(httpStatus.BAD_REQUEST).json(Response.failure(30));
          } else {
            User.findOne({ email: supplier.staff[0].email })
              .then((user) => {
                user.email = req.body.user.email;
                user.mobileNumber = req.body.user.mobileNumber;
                user.firstName = req.body.user.firstName;
                user.lastName = req.body.user.lastName;
                user.save()
                  .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
              });
          }
          supplier.save()
            .then((savedSupplier) => {
              Supplier.findOne({ representativeName: savedSupplier.representativeName })
                .populate('staff')
                .then((requiredSupplier) => {
                  const resultObject = {
                    _id: requiredSupplier._id,
                    representativeName: requiredSupplier.representativeName,
                    commercialRegister: requiredSupplier.commercialRegister,
                    commercialRegisterPhoto: requiredSupplier.commercialRegisterPhoto,
                    commercialRegisterExpireDate: requiredSupplier.commercialRegisterExpireDate,
                    photo: requiredSupplier.photo,
                    coverPhoto: requiredSupplier.coverPhoto,
                    status: requiredSupplier.status,
                    location: requiredSupplier.location,
                    user: requiredSupplier.staff[0],
                    VATRegisterNumber: requiredSupplier.VATRegisterNumber,
                    VATRegisterPhoto: requiredSupplier.VATRegisterPhoto
                  };
                  res.json(Response.success(resultObject));
                });
            })
            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
        });
    });
}

/**
 * Update existing supplier
 * @property {string} req.body.representativeName - The representativeName of supplier.
 * @property {string} req.body.commercialRegister - The commercial register of supplier.
 * @property {string} req.body.commercialRegisterPhoto - The commercial register photo of supplier.
 * @returns {Supplier}
 */
function update(req, res) {
  const staffArray = req.supplier.staff.map(c => c);
  const staffIndex = staffArray.findIndex(c => c._id.toString() === req.user._id.toString());
  User.findOne({ _id: req.supplier.staff[staffIndex] })
    .then((user) => {
      user.firstName = req.body.user.firstName.toLowerCase();
      user.lastName = req.body.user.lastName.toLowerCase();
      user.mobileNumber = req.body.user.mobileNumber;
      user.language = req.body.user.language;
      user.save()
        .then((userSaved) => {
          const supplier = req.supplier;
          supplier.user = userSaved;
          // supplier.photo = req.body.photo;
          supplier.coverPhoto = req.body.coverPhoto;
          supplier.location = {
            // coordinates: [req.body.latitude, req.body.longitude]
            coordinates: req.body.location.coordinates,
            address: req.body.location.address,
            type: req.body.location.type
          };
          supplier.representativeName = req.body.representativeName.toLowerCase();
          supplier.commercialRegisterExpireDate = req.body.commercialRegisterExpireDate ? moment(req.body.commercialRegisterExpireDate) : '';
          supplier.commercialRegisterExpireDateIslamic = req.body.commercialRegisterExpireDateIslamic ? momentHijri(req.body.commercialRegisterExpireDateIslamic) : '';
          supplier.commercialRegister = req.body.commercialRegister;
          supplier.commercialRegisterPhoto = req.body.commercialRegisterPhoto;
          supplier.VATRegisterNumber = req.body.VATRegisterNumber ? Number(req.body.VATRegisterNumber) : 0;
          supplier.VATRegisterPhoto = req.body.VATRegisterPhoto ? req.body.VATRegisterPhoto : null;
          if (supplier.coverPhoto.startsWith('http')) {
            const splitArrUrl = supplier.coverPhoto.split('/');
            supplier.coverPhoto = splitArrUrl[splitArrUrl.length - 1];
          }
          if (req.body.commercialRegisterExpireDate && (moment(req.body.commercialRegisterExpireDate).diff(moment(), 'days') > appSettings.dateExpireValidation)) {
            res.status(httpStatus.BAD_REQUEST).json(Response.failure(20));
          } else if (req.body.commercialRegisterExpireDate && (moment(req.body.commercialRegisterExpireDate).isSameOrBefore(moment()))) {
            res.status(httpStatus.BAD_REQUEST).json(Response.failure(21));
          } else if (req.body.commercialRegisterExpireDateIslamic && (momentHijri(req.body.commercialRegisterExpireDateIslamic).diff(momentHijri().format('iYYYY/iM/iD'), 'days') > appSettings.dateExpireValidation)) {
            res.status(httpStatus.BAD_REQUEST).json(Response.failure(22));
          } else if (req.body.commercialRegisterExpireDateIslamic && (momentHijri(req.body.commercialRegisterExpireDateIslamic).isSameOrBefore(momentHijri().format('iYYYY/iM/iD')))) {
            res.status(httpStatus.BAD_REQUEST).json(Response.failure(23));
          } else {
            supplier.save()
              .then((savedSupplier) => {
                const resultObject = {
                  _id: savedSupplier._id,
                  representativeName: savedSupplier.representativeName,
                  commercialRegister: savedSupplier.commercialRegister,
                  commercialRegisterPhoto: savedSupplier.commercialRegisterPhoto,
                  commercialRegisterExpireDate: savedSupplier.commercialRegisterExpireDate,
                  commercialRegisterExpireDateIslamic: savedSupplier.commercialRegisterExpireDateIslamic,
                  VATRegisterNumber: savedSupplier.VATRegisterNumber,
                  VATRegisterPhoto: savedSupplier.VATRegisterPhoto,
                  photo: `${appSettings.imagesUrl}${savedSupplier.photo}`,
                  coverPhoto: `${appSettings.imagesUrl}${savedSupplier.coverPhoto}`,
                  status: savedSupplier.status,
                  location: savedSupplier.location,
                  user: userSaved
                };
                if (appSettings.emailSwitch) {
                  const content = {
                    recipientName: UserService.toTitleCase(savedSupplier.representativeName),
                    loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>` // eslint-disable-line no-useless-escape
                  };
                  EmailHandler.sendEmail(req.supplier.staff[staffIndex].email, content, 'UPDATEUSER', req.supplier.staff[staffIndex].language);
                }
                res.json(Response.success(resultObject));
              })
              .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
          }
        });
    });
}

function updateRelation(req, res) {
  if (req.user.type === 'Admin') {
    const adminRelation = {
      creditLimit: req.body.creditLimit,
      paymentInterval: req.body.paymentInterval,
      status: req.body.status,
      paymentFrequency: req.body.paymentFrequency,
      exceedCreditLimit: req.body.exceedCreditLimit,
      exceedPaymentDate: req.body.exceedPaymentDate
    };
    // adminRelation.nextPaymentDueDate = moment().tz(appSettings.timeZone).startOf('month').add(adminRelation.paymentFrequency, adminRelation.paymentInterval).format(appSettings.momentFormat);
    async.waterfall([
        // Function that passes the parameters to the second function.
      function passParameter(callback) {
        callback(null, req.params.supplierId, adminRelation);
      },
        // Update the relation between the customer and supplier
      updateAdminRelation
    ],
      (err, result) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else {
          Supplier.findById(req.params.supplierId)
            .populate('staff')
            .then((supplier) => {
              const notification = {
                refObjectId: supplier.staff[0],
                level: 'info',
                user: supplier.staff[0],
                userType: 'Supplier',
                key: 'relationUpdate',
                stateParams: 'user'
              };
              notificationCtrl.createNotification('user', notification, null, null, null, null);
            });
          res.json(Response.success(result));
        }
      });
  } else {
    res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
  }
}

/**
 * Get supplier list.
 * @property {number} req.query.skip - Number of suppliers to be skipped.
 * @property {number} req.query.limit - Limit number of suppliers to be returned.
 * @property {string} req.query.supplierName - filter by supplierName
 * @property {array} req.query.status - filter by supplier status
 * @returns {Supplier[]}
 */
function list(req, res) {
  // Get all if the user is an admin
  const match = {};
  let nameMatch = {};

  if (req.query.status) {
    if (req.query.status.length) {
      req.query.status.forEach((opt) => {
        req.query.status.push(new RegExp(opt, 'i'));
      });
      match.status = { $in: req.query.status };
    }
  }
  if (req.query.missedPayment) {
    match.dueDateMissed = req.query.missedPayment;
  }
  if (req.query.supplierName) {
    if (req.query.supplierName.length) {
      const arabic = req.query.supplierName.replace('[^\u0600-\u06FF\\s]+', '').trim();
      nameMatch = { $or: [{ representativeName: new RegExp(`.*${req.query.supplierName.trim()}.*`, 'i') }, { representativeName: new RegExp(`.*${arabic}.*`, 'i') }] };
    }
  }
  if (req.query.payingSoon) {
    // paymentMatch.createdAt = { $gte: moment().subtract(7, 'days')
    // .tz(appSettings.timeZone).format(appSettings.momentFormat), $lte: moment()
    // .tz(appSettings.timeZone).format(appSettings.momentFormat) };
    match.payingSoon = req.query.payingSoon;
  }

  if (req.user.type === 'Admin') {
    Supplier.find()
      .then((allSuppliers) => {
        allSuppliers.forEach((suppluerObj) => {
          Order.find({
            $and: [{ status: { $ne: 'Delivered' } }, { status: { $ne: 'Canceled' } }, { status: { $ne: 'CanceledByCustomer' } }, { status: { $ne: 'Rejected' } }, { status: { $ne: 'FailedToDeliver' } }],
            supplier: suppluerObj
          })
            .then((orders) => {
              const reservedBalance = orders.map(c => (c.price + c.VAT) * suppluerObj.adminFees).reduce((sum, value) => sum + value, 0);
              suppluerObj.reservedBalance = reservedBalance;
              suppluerObj.save();
            });
        });
      });
    Supplier.find({ $and: [match, nameMatch] })
      .populate('staff')
      .select({
        _id: 1,
        representativeName: 1,
        status: 1,
        creditLimit: 1,
        createdAt: 1,
        staff: 1,
        paymentInterval: 1,
        paymentFrequency: 1,
        exceedCreditLimit: 1,
        nextPaymentDueDate: 1,
        reservedBalance: 1,
        adminFees: 1
      })
      .sort({
        createdAt: -1
      })
      .skip(Number(req.query.skip))
      .limit(Number(req.query.limit))
      .then((suppliers) => {
        const supplierObject = [];
        let index = 0;
        if (suppliers.length > 0) {
          suppliers.forEach((obj) => {
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
            for (createdAtDate = moment(obj.createdAt).tz(appSettings.timeZone); moment().tz(appSettings.timeZone).diff(createdAtDate) > 0;
                 createdAtDate = createdAtDate.add(Number(frequency), interval)) {
              // fromDate = createdAtDate.tz(appSettings.timeZone).format(appsSettings.momentFormat);
            }
            Transaction.find({
              supplier: obj,
              createdAt: { $gt: moment().startOf('month').tz(appSettings.timeZone).format(appSettings.momentFormat) },
              isAdminFees: true
            })
              .populate({
                path: 'order',
                select: '_id price VAT status'
              })
              .sort({
                createdAt: -1
              })
              .then((supplierTransaction) => {
                if (supplierTransaction.length > 0) {
                  const debitTransactionTotal = supplierTransaction.map(c => c).filter(c => c.type === 'debit').map(c => c.amount).reduce((sum, value) => sum + value, 0);
                  supplierObject.push({
                    supplier: obj,
                    balance: supplierTransaction[0].close,
                    remainingTillLimit: Math.min(obj.creditLimit, obj.creditLimit - (debitTransactionTotal + (debitTransactionTotal * appSettings.VATPercent)) - obj.reservedBalance), // - (obj.reservedBalance +(obj.reservedBalance * appSettings.VATPercent))),
                    paymentDue: createdAtDate.tz(appSettings.timeZone).format(appSettings.momentFormat)
                  });
                  index += 1;
                } else {
                  supplierObject.push({
                    supplier: obj,
                    balance: 0,
                    remainingTillLimit: obj.creditLimit - obj.reservedBalance, // - (obj.reservedBalance +(obj.reservedBalance * appSettings.VATPercent)),
                    paymentDue: createdAtDate.tz(appSettings.timeZone).format(appSettings.momentFormat)
                  });
                  index += 1;
                }
                if (index === suppliers.length) {
                  Supplier.count({ $and: [match, nameMatch] })
                    .then((supCount) => {
                      const suppliersArr = supplierObject.sort((a, b) => (a.supplier.createdAt < b.supplier.createdAt) ? 1 : ((a.supplier.createdAt > b.supplier.createdAt) ? -1 : 0));
                      const respondObject = {
                        suppliers: suppliersArr,
                        count: supCount
                      };
                      if (req.query.export) {
                        if (req.user.language === 'en') {
                          ExportService.exportFile(`report_template/supplier/${req.query.export}-supplier-report-header-english.html`,
                            `report_template/supplier/${req.query.export}-supplier-report-body-english.html`, supplierObject,
                            'Suppliers Report', '', req.query.export, res);
                          // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                        } else {
                          ExportService.exportFile(`report_template/supplier/${req.query.export}-supplier-report-header-arabic.html`,
                            `report_template/supplier/${req.query.export}-supplier-report-body-arabic.html`, supplierObject,
                            'تقرير الموردين', '', req.query.export, res);
                          // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                        }
                      } else {
                        res.json(Response.success(respondObject));
                      }
                    });
                }
              });
          });
        } else {
          index += 1;
          if (index >= suppliers.length) {
            Supplier.count({ $and: [match, nameMatch] })
              .then((supCount) => {
                const respondObject = {
                  suppliers: supplierObject,
                  count: supCount
                };
                if (req.query.export) {
                  if (req.user.language === 'en') {
                    ExportService.exportFile(`report_template/supplier/${req.query.export}-supplier-report-header-english.html`,
                      `report_template/supplier/${req.query.export}-supplier-report-body-english.html`, supplierObject,
                      'Suppliers Report', '', req.query.export, res);
                    // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                  } else {
                    ExportService.exportFile(`report_template/supplier/${req.query.export}-supplier-report-header-arabic.html`,
                      `report_template/supplier/${req.query.export}-supplier-report-body-arabic.html`, supplierObject,
                      'تقرير الموردين', '', req.query.export, res);
                    // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                  }
                } else {
                  res.json(Response.success(respondObject));
                }
              });
          }
        }
      })
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  } else if (req.user.type === 'Customer') {
    // Get suppliers of customer.
    let customerEmail = '';
    Customer.findOne({ user: req.user._id })
      .populate('user')
      .then((customer) => {
        if (customer.type === 'Staff') {
          return Customer.findOne({ _id: customer.customer }).populate('user');
        }
        return customer;
      }).then((customer) => {
        if (customer) {
          customerEmail = customer.user.email;
        } else {
          customerEmail = req.user.email;
        }
        CustomerInvite.find({ customerEmail })
        .populate({
          path: 'supplier',
          match,
          populate: ({
            path: 'staff'
          }),
          select: '_id representativeName status creditLimit createdAt paymentInterval paymentFrequency staff'
        })
        .skip(Number(req.query.skip))
        .limit(Number(req.query.limit))
        .then((invites) => {
          const customerInvites = invites.map(c => c).filter(c => c.supplier !== null);
          const suppliers = customerInvites.map(ci => ci.supplier);
          const supplierObject = [];
          suppliers.forEach((obj) => {
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
            for (createdAtDate = moment(obj.createdAt).tz(appSettings.timeZone); moment().tz(appSettings.timeZone).diff(createdAtDate) > 0;
                 createdAtDate = createdAtDate.add(Number(frequency), interval)) {
              // fromDate = createdAtDate.tz(appSettings.timeZone).format(appSettings.momentFormat);
            }
            Transaction.find({
              supplier: obj,
              createdAt: { $gt: moment().startOf('month').tz(appSettings.timeZone).format(appSettings.momentFormat) },
              isAdminFees: false
            })
              .sort({
                createdAt: -1
              })
              .then((supplierTransaction) => {
                if (supplierTransaction.length > 0) {
                  const status = invites.map(c => c).filter(c => c.supplier._id.toString() === obj._id.toString()).map(c => c.status);
                  supplierObject.push({
                    supplier: obj,
                    balance: supplierTransaction[0].close,
                    remainingTillLimit: obj.creditLimit - supplierTransaction.map(c => c).filter(c => c.type === 'debit').map(c => c.amount).reduce((sum, value) => sum + value, 0),
                    paymentDue: createdAtDate.tz(appSettings.timeZone).format(appSettings.momentFormat),
                    relationStatus: status[0]
                  });
                } else {
                  const status = invites.map(c => c).filter(c => c.supplier._id.toString() === obj._id.toString()).map(c => c.status);
                  supplierObject.push({
                    supplier: obj,
                    balance: 0,
                    remainingTillLimit: obj.creditLimit,
                    paymentDue: createdAtDate.tz(appSettings.timeZone).format(appSettings.momentFormat),
                    relationStatus: status[0]
                  });
                }
                if (supplierObject.length === suppliers.length) {
                  CustomerInvite.find()
                    .populate({
                      path: 'supplier',
                      match,
                      populate: ({
                        path: 'staff'
                      }),
                      select: '_id representativeName status creditLimit createdAt paymentInterval paymentFrequency staff'
                    })
                    .where('customerEmail').equals(req.user.email)
                    .then((customerInvite) => {
                      const customerSuppliers = customerInvite.map(ci => ci)
                        .filter(c => c.supplier !== null);
                      const suppliersArr = supplierObject.sort((a, b) => (a.supplier.createdAt < b.supplier.createdAt) ? 1 : ((a.supplier.createdAt > b.supplier.createdAt) ? -1 : 0));
                      const respondObject = {
                        suppliers: suppliersArr,
                        count: customerSuppliers.length
                      };
                      if (req.query.export) {
                        if (req.user.language === 'en') {
                          ExportService.exportFile(`report_template/supplier/${req.query.export}-supplier-report-header-english.html`,
                            `report_template/supplier/${req.query.export}-supplier-report-body-english.html`, supplierObject,
                            'Suppliers Report', '', req.query.export, res);
                          // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                        } else {
                          ExportService.exportFile(`report_template/supplier/${req.query.export}-supplier-report-header-arabic.html`,
                            `report_template/supplier/${req.query.export}-supplier-report-body-arabic.html`, supplierObject,
                            'تقرير الموردين', '', req.query.export, res);
                          // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                        }
                      } else {
                        res.json(Response.success(respondObject));
                      }
                    });
                }
              });
          });
        })
        // TODO: Example on array filter with map
        // .then(customerInvites => res.json(Response.success(customerInvites
        //     .filter(ci => ci.supplier !== null)
        //     .map(ci => ci.supplier))))
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
      });
  }
}

/**
 * Delete supplier.
 * @returns {Supplier}
 */
function remove(req, res) {
  const supplier = req.supplier;
  supplier.deleted = true;
  supplier.status = 'Deleted';
  User.findById(req.supplier.staff[0]._id)
    .then((deletedUser) => {
      deletedUser.deleted = true;
      deletedUser.status = 'Deleted';
      deletedUser.save()
        .catch(e => res.json(e));
    })
    .catch(e => res.json(Response.failure(e)));
  supplier.save()
    .then((deletedSupplier) => {
      if (appSettings.emailSwitch) {
        const content = {
          recipientName: UserService.toTitleCase(supplier.representativeName)
        };
        EmailHandler.sendEmail(supplier.staff[0].email, content, 'REMOVEUSER', supplier.staff[0].language);
      }
      res.json(Response.success(deletedSupplier));
    })
    .catch(e => res.json(Response.failure(e)));
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
  const user = new User({
    email: req.body.email ? req.body.email.toLowerCase() : null,
    mobileNumber: req.body.mobileNumber,
    password: req.body.password,
    firstName: req.body.firstName.toLowerCase(),
    lastName: req.body.lastName.toLowerCase(),
    language: req.body.language,
    type: 'Supplier',
    role: req.body.role,
    status: req.body.status
  });

  async.waterfall([
      // Gets the logged in supplier
    function passParameter(callback) {
      callback(null, req.user._id, user);
    },
    getSupplierFromUser,
    roleEligible,
    createUserAndAddToSupplier
  ],
    (err, result) => {
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
        roleMatch.status = { $in: req.query.status };
      }
    }
    if (req.query.staffQuery) {
      staffQueryMatch = { $or: ([{ firstName: new RegExp(`.*${req.query.staffQuery.trim()}.*`, 'i') }, { email: new RegExp(`.*${req.query.staffQuery}.*`, 'i') }]) };
    }
  }
  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParamters(callback) {
      callback(null, req.user._id, req.query.skip, req.query.limit, staffQueryMatch, roleMatch);
    },
      // Gets the logged in supplier
    getSupplierFromUserForStaff,
    getSupplierStaff
  ],
    (err, result) => {
      if (err) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
      } else {
        res.json(Response.success(result));
      }
    });
}

/**
 * Gets the drivers of a supplier
 * @returns {User []}
 */
function getDrivers(req, res) {
  let staffQueryMatch = {};
  let roleMatch = {};
  if (typeof req.query.staffQuery === 'undefined' && typeof req.query.status === 'undefined') {
    roleMatch = {};
  } else {
    if (req.query.status) {
      if (req.query.status.length) {
        req.query.status.forEach((opt) => {
          req.query.status.push(new RegExp(opt, 'i'));
        });
        roleMatch.status = { $in: req.query.status };
      }
    }
    if (req.query.staffQuery) {
      staffQueryMatch = { $or: ([{ firstName: new RegExp(`.*${req.query.staffQuery.trim()}.*`, 'i') }, { email: new RegExp(`.*${req.query.staffQuery}.*`, 'i') }]) };
    }
  }
  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParamters(callback) {
      callback(null, req.user._id, req.query.skip, req.query.limit, staffQueryMatch, roleMatch);
    },
      // Gets the logged in supplier
    getSupplierFromUserForStaff,
    getSupplierDrivers
  ],
    (err, result) => {
      if (err) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
      } else {
        res.json(Response.success(result));
      }
    });
}

/**
 * Remove a staff user to the supplier
 * @property {string} req.params.staffId - The id of the user to be removed.
 * @returns {User}
 */
function removeStaff(req, res) {
  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParamters(callback) {
      callback(null, req.user._id, null);
    },
      // Gets the logged in supplier
    getSupplierFromUser
  ],
    (err, supplier) => {
      // Check that the staff member exists for supplier
      const indexOfStaff = supplier.staff.indexOf(req.params.staffId);
      if (indexOfStaff !== -1) {
        supplier.staff.splice(indexOfStaff, 1);

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

        supplier.save()
          .then(savedSupplier => res.json(Response.success(savedSupplier)))
          .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
      } else {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
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
      callback(null, req.user._id);
    },
      // Gets the logged in supplier
    getSupplierWithStaffFromUser
  ],
    (err, supplier) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        // Check that the staff member exists for supplier
        const user = supplier.staff.filter(u => u._id.equals(req.params.staffId))[0];
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
              callback(null, supplier, user);
            },
            roleEligible,
            function passParameter(supplierData, userData, callback) {
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
 * Blocks all the supplier users from accessing the platform.
 */
function block(req, res) {
  const supplierUsers = req.supplier.staff;

  User.find()
    .where('_id').in(supplierUsers)
    .where('status').equals('Active')
    .then((users) => {
      users.forEach((user) => {
        user.status = 'Blocked';
        user.save();
      });
    });
  //   res.json(Response.success(users));
  //   // res.json(Response.success(req.supplier));
  // })
  // .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));

  Supplier.findOne({ _id: req.supplier._id })
    .populate({
      path: 'staff',
      select: '_id email language'
    })
    .where('status').equals('Active')
    .then((supplier) => {
      supplier.status = 'Blocked';
      supplier.save()
        .then((savedSupplier) => {
          if (appSettings.emailSwitch) {
            const content = {
              recipientName: UserService.toTitleCase(savedSupplier.representativeName)
            };
            EmailHandler.sendEmail(savedSupplier.staff[0].email, content, 'BLOCK', savedSupplier.staff[0].language);
          }
        });
      res.json(Response.success(supplier));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Unblocks all blocked supplier users.
 */
function unblock(req, res) {
  const supplierUsers = req.supplier.staff;

  User.find()
    .where('_id').in(supplierUsers)
    .where('status').equals('Blocked')
    .then((users) => {
      users.forEach((user) => {
        user.status = 'Active';
        user.save();
      });
    });
  //   res.json(Response.success(users));
  //   // res.json(Response.success(req.supplier));
  // })
  // .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));

  Supplier.findOne({ _id: req.supplier._id })
    .populate({
      path: 'staff',
      select: '_id email language'
    })
    .where('status').equals('Blocked')
    .then((supplier) => {
      supplier.status = 'Active';
      supplier.save()
        .then((savedSupplier) => {
          if (appSettings.emailSwitch) {
            const content = {
              recipientName: UserService.toTitleCase(savedSupplier.representativeName)
            };
            EmailHandler.sendEmail(savedSupplier.staff[0].email, content, 'BLOCK', savedSupplier.staff[0].language);
          }
        });
      res.json(Response.success(supplier));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 *  Get Orders Report
 * @property {Date} req.query.startDate
 * @property {Date} req.query.endDate
 * @returns {Report Object}
 */
function getReport(req, res) {
  // Orders Report Object
  const supplierOrderReport = {
    supplierId: '',
    numberOfOrders: 0,
    totalRevenue: 0,
    avgDailyNumberOfOrders: 0,
    avgDailyRevenue: 0,
    orders: [],
    count: 0
  };

  let ordersTotalPrice = 0;
  // Calculate Number of Days Between Two Dates
  const startDate = new Date(req.query.startDate.toString());
  const endDate = new Date(req.query.endDate.toString());

  let skip = Number(req.query.skip),
    limit = Number(req.query.limit);

  endDate.setDate(endDate.getDate() + 1);
  // Get 1 day in milliseconds
  const oneday = 1000 * 60 * 60 * 24;
  // Convert both dates to milliseconds
  const date1ms = startDate.getTime();
  const date2ms = endDate.getTime();
  // Calculate the difference in milliseconds
  const differencems = date2ms - date1ms;
  // Convert back to days and return
  const diff = Math.round(differencems / oneday);

  // Public query condition Object for orders report - getReport
  const queryCond = {};

  queryCond.createdAt = { $gte: startDate, $lte: endDate };
  if (req.query.export === 'pdf' || req.query.export === 'xls') {
    skip = 0;
    limit = 5000;
  }

  if (req.query.supplierId) {
    if (req.query.supplierId.length) {
      queryCond.supplier = req.query.supplierId;
    }
  }
  if (req.query.status) {
    if (req.query.status.length) {
      req.query.status.forEach((opt) => {
        req.query.status.push(new RegExp(opt, 'i'));
      });
      queryCond.status = { $in: req.query.status };
    }
  }
  if (req.query.customerId) {
    if (req.query.customerId.length) {
      queryCond.customer = req.query.customerId;
    }
  }

  if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameters(callback) {
        callback(null, req.user._id, null);
      },
      getSupplierFromUser,
        // Get number of Orders
      function getNumberOrders(supplier, user, callback) {
        Order.find({ $and: [queryCond] })
            .where('supplier').equals(supplier)
            .then((ordersCount) => {
              supplierOrderReport.count = ordersCount.length;
              Order.find({ $and: [queryCond] })
                .populate('supplier')
                .populate('customer')
                .where('supplier').equals(supplier)
                .skip(skip)
                .limit(limit)
                .then((orderList) => {
                  if (orderList.length !== 0) {
                    const customerId = orderList.map(c => c.customer);
                    queryCond.customer = customerId[0]._id;
                  }

                  const deliveredQuery = {
                    status: 'Delivered',
                    createdAt: { $gte: startDate, $lte: endDate }
                  };

                  // if (req.query.export === 'pdf' || req.query.export === 'xls') {
                  //   delete deliveredQuery.createdAt;
                  // }

                  if (req.query.customerId) {
                    deliveredQuery.customer = req.query.customerId;
                  }

                  Order.find(deliveredQuery)
                    .where('supplier').equals(supplier)
                    .then((deliveredOrders) => {
                      supplierOrderReport.numberOfOrders = deliveredOrders.length;
                      supplierOrderReport.supplierId = supplier._id;
                      callback(null, supplierOrderReport, supplier, orderList, deliveredOrders, queryCond);
                    });
                });
            });
      },
        // Get total revenue
      function getRevenue(innerSupplierOrderReport, supplier, orderList, deliveredOrders, queryCond1, callback) {
        const revenue = deliveredOrders
            .filter(deliveredOrders => deliveredOrders.status === 'Delivered')
            .map(orderPrice => orderPrice.price + orderPrice.VAT)
            .reduce((sum, value) => sum + value, 0);
        innerSupplierOrderReport.totalRevenue = revenue;
        callback(null, innerSupplierOrderReport, supplier, orderList, deliveredOrders, queryCond1);
      },
        // Get average orders and revenue
      function getAvgNumberOrdersAndRevenue(nestedSupplierOrderReport,
                                              supplier, orderList, deliveredOrders, queryCond1, callback) {
        if (deliveredOrders.length !== 0) {
          queryCond1.supplier = supplier._id;

          const deliveredQuery = {
            status: 'Delivered',
            createdAt: { $gte: startDate, $lte: endDate }
          };

            // if (req.query.export === 'pdf' || req.query.export === 'xls') {
            //   delete deliveredQuery.createdAt;
            // }

          if (req.query.customerId) {
            deliveredQuery.customer = req.query.customerId;
          }

          Order.aggregate([
            {
              $match: deliveredQuery
            },
            {
              $group: {
                _id: {
                  month: { $month: '$createdAt' },
                  day: { $dayOfMonth: '$createdAt' },
                  year: { $year: '$createdAt' }
                },
                count: { $sum: 1 },
                total: { $sum: '$price' }
              }
            }
          ], (err, suppliersOrders) => {
            if (err) {
              res.json(err);
            } else {
              const sumOrders = suppliersOrders
                  .map(m => m.count)
                  .reduce((sum, value) => sum + value, 0);
              const sumRevenue = suppliersOrders
                  .map(m => m.total)
                  .reduce((sum, value) => sum + value, 0);
              nestedSupplierOrderReport.avgDailyNumberOfOrders = sumOrders / diff;
              nestedSupplierOrderReport.avgDailyRevenue = sumRevenue / diff;
              callback(null, nestedSupplierOrderReport, orderList);
            }
          });
        } else {
          callback(null, nestedSupplierOrderReport, orderList);
        }
      },
        // Get orders list
      function getOrdersList(lastSupplierOrderReport, orderList, callback) {
        if (orderList.length !== 0) {
          let index = 1;
          orderList.forEach((obj) => {
            if (index < orderList.length) {
              lastSupplierOrderReport.orders.push({
                orderId: obj._id,
                date: obj.createdAt,
                customer: obj.customer,
                customerName: obj.customer.representativeName,
                supplier: obj.supplier,
                supplierName: obj.supplier.representativeName,
                orderNumber: obj.orderId,
                orderStatus: obj.status,
                totalPrice: obj.price + obj.VAT,
                branchName: obj.branchName
              });
              index += 1;
            } else {
              lastSupplierOrderReport.orders.push({
                orderId: obj._id,
                date: obj.createdAt,
                customer: obj.customer,
                customerName: obj.customer.representativeName,
                supplier: obj.supplier,
                supplierName: obj.supplier.representativeName,
                orderNumber: obj.orderId,
                orderStatus: obj.status,
                totalPrice: obj.price + obj.VAT,
                branchName: obj.branchName
              });
              callback(null, lastSupplierOrderReport);
            }
          });
        } else {
          callback(null, lastSupplierOrderReport);
        }
      }
    ],
      (err, result) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else if (req.query.export) {
          result.orders.forEach((ord) => {
            ordersTotalPrice += (ord.totalPrice);
          });

          if (req.query.customerId) {
            const firstOrder = result.orders[0] ? result.orders[0] : null;
            const orderObject = firstOrder;
            if (req.user.language === 'en') {
              ExportService.exportFile('report_template/main_header/english_header.html',
                `report_template/order/${req.query.export}-order-report-body-english.html`, {
                  order: orderObject,
                  orders: result.orders,
                  ordersTotalPrice
                },
                //  'Orders Report', '', req.query.export, res);
                'Orders Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
              // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
            } else {
              ExportService.exportFile('report_template/main_header/arabic_header.html',
                `report_template/order/${req.query.export}-order-report-body-arabic.html`, {
                  order: orderObject,
                  orders: result.orders,
                  ordersTotalPrice
                },
                'تقرير الطلبات', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
              // 'تقرير الطلبات', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
              // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
            }
          } else if (req.user.language === 'en') {
            ExportService.exportFile(`report_template/order/${req.query.export}-order-report-header-english.html`,
              `report_template/order/${req.query.export}-order-report-body-english.html`, {
                order: null,
                orders: result.orders,
                ordersTotalPrice
              },
              // 'Orders Report', '', req.query.export, res);
              'Orders Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
            // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
          } else {
            ExportService.exportFile(`report_template/order/${req.query.export}-order-report-header-arabic.html`,
              `report_template/order/${req.query.export}-order-report-body-arabic.html`, {
                order: null,
                orders: result.orders,
                ordersTotalPrice
              },
              'تقرير الطلبات', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
            // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
          }
        } else {
          res.json(Response.success(result));
        }
      });
  } else if (req.user.type === 'Admin') {
    async.waterfall([
        // Get number of Orders
      function getNumberOrders(callback) {
        Order.count(queryCond)
            .then((ordersCount) => {
              supplierOrderReport.count = ordersCount;
              Order.find(queryCond)
                .populate('supplier')
                .populate('customer')
                .skip(skip)
                .limit(limit)
                .then((orderList) => {
                  if (orderList.length !== 0) {
                    const customerId = orderList.map(c => c.customer);
                    queryCond.customer = customerId[0]._id;
                  }
                  supplierOrderReport.numberOfOrders = ordersCount;
                  supplierOrderReport.supplierId = req.query.supplierId;
                  callback(null, supplierOrderReport, req.query.supplierId, orderList, queryCond);
                });
            });
      },
        // Get total revenue
      function getRevenue(innerSupplierOrderReport, supplier, orderList, queryCond1, callback) {
        const revenue = orderList
            .map(orderPrice => orderPrice.price)
            .reduce((sum, value) => sum + value, 0);
        innerSupplierOrderReport.totalRevenue = revenue;
        callback(null, innerSupplierOrderReport, supplier, orderList, queryCond1);
      },
        // Get average orders and revenue
      function getAvgNumberOrdersAndRevenue(nestedSupplierOrderReport,
                                              supplier, orderList, queryCond1, callback) {
        if (orderList.length !== 0) {
          Order.aggregate([
            {
              $match: { $and: [queryCond1] }
            },
            {
              $group: {
                _id: {
                  month: { $month: '$createdAt' },
                  day: { $dayOfMonth: '$createdAt' },
                  year: { $year: '$createdAt' }
                },
                count: { $sum: 1 },
                total: { $sum: '$price' }
              }
            }
          ], (err, suppliersOrders) => {
            if (err) {
              res.json(err);
            } else {
              const sumOrders = suppliersOrders
                  .map(m => m.count)
                  .reduce((sum, value) => sum + value, 0);
              const sumRevenue = suppliersOrders
                  .map(m => m.total)
                  .reduce((sum, value) => sum + value, 0);
              nestedSupplierOrderReport.avgDailyNumberOfOrders = sumOrders / diff;
              nestedSupplierOrderReport.avgDailyRevenue = sumRevenue / diff;
              callback(null, nestedSupplierOrderReport, orderList);
            }
          });
        } else {
          callback(null, nestedSupplierOrderReport, orderList);
        }
      },
        // Get orders list
      function getOrdersList(lastSupplierOrderReport, orderList, callback) {
        if (orderList.length !== 0) {
          let index = 1;
          orderList.forEach((obj) => {
            if (index < orderList.length) {
              lastSupplierOrderReport.orders.push({
                orderId: obj._id,
                date: obj.createdAt,
                customerName: obj.customer.representativeName,
                supplierName: obj.supplier.representativeName,
                orderNumber: obj.orderId,
                orderStatus: obj.status,
                totalPrice: obj.price
              });
              index += 1;
            } else {
              lastSupplierOrderReport.orders.push({
                orderId: obj._id,
                date: obj.createdAt,
                customerName: obj.customer.representativeName,
                supplierName: obj.supplier.representativeName,
                orderNumber: obj.orderId,
                orderStatus: obj.status,
                totalPrice: obj.price
              });
              callback(null, lastSupplierOrderReport);
            }
          });
        } else {
          callback(null, lastSupplierOrderReport);
        }
      }
    ],
      (err, result) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else if (req.query.export) {
          if (req.user.language === 'en') {
            ExportService.exportFile(`report_template/order/${req.query.export}-order-report-header-english.html`,
              `report_template/order/${req.query.export}-order-report-body-english.html`, { orders: result.orders },
              'Orders Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
            // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
          } else {
            ExportService.exportFile(`report_template/order/${req.query.export}-order-report-header-arabic.html`,
              `report_template/order/${req.query.export}-order-report-body-arabic.html`, { orders: result.orders },
              'تقرير الطلبات', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
            // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
          }
        } else {
          res.json(Response.success(result));
        }
      });
  }
}

/**
 *  Get Transactions Report
 * @property {Date} req.query.startDate
 * @property {Date} req.query.endDate
 * @returns {Report Object}
 */
function getTransactionsReport(req, res) {
  const startDate = new Date(req.query.startDate.toString());
  const endDate = new Date(req.query.endDate.toString());
  endDate.setDate(endDate.getDate() + 1);

  let idMatch = { createdAt: { $gte: startDate, $lte: endDate } };
  if (req.query.type) {
    if (req.query.type === 'All') {
      idMatch = {
        createdAt: { $gte: startDate, $lte: endDate },
        $or: [{ type: 'credit' }, { type: 'debit' }]
      };
    } else {
      idMatch = {
        createdAt: { $gte: startDate, $lte: endDate },
        type: req.query.type.toLowerCase()
      };
    }
  }

  if (req.query.supplierId) {
    if (req.query.supplierId.length) {
      if (req.query.type) {
        if (req.query.type === 'All') {
          idMatch = {
            supplier: req.query.supplierId,
            createdAt: { $gte: startDate, $lte: endDate },
            $or: [{ type: 'credit' }, { type: 'debit' }]
          };
        } else {
          idMatch = {
            supplier: req.query.supplierId,
            createdAt: { $gte: startDate, $lte: endDate },
            type: req.query.type.toLowerCase()
          };
        }
      }
    }
    if (req.query.customerId) {
      if (req.query.customerId.length) {
        if (req.query.type) {
          if (req.query.type === 'All') {
            idMatch = {
              customer: req.query.customerId,
              supplier: req.query.supplierId,
              createdAt: { $gte: startDate, $lte: endDate },
              $or: [{ type: 'credit' }, { type: 'debit' }]
            };
          } else {
            idMatch = {
              idMatch,
              type: req.query.type.toLowerCase()
            };
          }
        }
      }
    }
  } else if (req.query.customerId) {
    if (req.query.customerId.length) {
      if (req.query.type) {
        if (req.query.type === 'All') {
          idMatch = {
            customer: req.query.customerId,
            createdAt: { $gte: startDate, $lte: endDate },
            $or: [{ type: 'credit' }, { type: 'debit' }]
          };
        } else {
          idMatch = {
            customer: req.query.customerId,
            createdAt: { $gte: startDate, $lte: endDate },
            type: req.query.type.toLowerCase()
          };
        }
      }
    }
  }
  if (req.user.type === 'Admin') {
    const supplierTransactionReport = {
      supplierId: '',
      numberOfTransactions: '',
      totalBalance: '',
      totalCredit: '',
      transactions: []
    };
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.query.supplierId, supplierTransactionReport,
          req.query.skip, req.query.limit, idMatch);
      },
      getNumberTransactions,
      getTotalBalance
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else if (req.query.export) {
        if (req.user.language === 'en') {
          ExportService.exportFile(`report_template/transactionReport/${req.query.export}-transaction-report-header-english.html`,
            `report_template/transactionReport/${req.query.export}-transaction-report-body-english.html`, result.transactions,
            'Transaction Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res);
          // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
        } else {
          ExportService.exportFile(`report_template/transactionReport/${req.query.export}-transaction-report-header-arabic.html`,
            `report_template/transactionReport/${req.query.export}-transaction-report-body-arabic.html`, result.transactions,
            'تقرير المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res);
          // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
        }
      } else {
        res.json(Response.success(result));
      }
    });
  }
  if (req.user.type === 'Supplier') {
    const supplierTransactionReport = {
      supplierId: '',
      numberOfTransactions: '',
      totalBalance: '',
      totalCredit: '',
      transactions: []
    };
    async.waterfall([
      function passParameters(callback) {
        callback(null, req.user._id, null);
      },
      getSupplierFromUser,
      function passParameter(supplierId, user, callback) {
        let match = {};
        if (req.query.customerId) {
          if (req.query.customerId.length) {
            if (req.query.type) {
              if (req.query.type === 'All') {
                match = {
                  supplier: supplierId,
                  customer: req.query.customerId,
                  createdAt: { $gte: startDate, $lte: endDate },
                  $or: [{ type: 'credit' }, { type: 'debit' }]
                };
              } else {
                match = {
                  supplier: supplierId,
                  customer: req.query.customerId,
                  createdAt: { $gte: startDate, $lte: endDate },
                  type: req.query.type.toLowerCase()
                };
              }
            } else {
              match = {
                supplier: supplierId,
                customer: req.query.customerId,
                createdAt: { $gte: startDate, $lte: endDate }
              };
            }
          }
        } else if (req.query.type) {
          if (req.query.type === 'All') {
            match = {
              supplier: supplierId,
              createdAt: { $gte: startDate, $lte: endDate },
              $or: [{ type: 'credit' }, { type: 'debit' }],
              customer: { $ne: null }
            };
          } else {
            match = {
              supplier: supplierId,
              createdAt: { $gte: startDate, $lte: endDate },
              type: req.query.type.toLowerCase(),
              customer: { $ne: null }
            };
          }
        } else {
          match = {
            supplier: supplierId,
            createdAt: { $gte: startDate, $lte: endDate },
            customer: { $ne: null }
          };
        }
        callback(null, supplierId._id, supplierTransactionReport,
            req.query.skip, req.query.limit, match);
      },
      getNumberTransactions,
      getTotalBalance
    ],
      (err, result) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else if (req.query.export) {
          if (req.query.customerId) {
            const firstOrder = result.transactions[0] ? result.transactions[0].order : null;
            const orderObject = firstOrder;
            if (req.user.language === 'en') {
              ExportService.exportFile('report_template/main_header/english_header.html',
                `report_template/transactionReport/${req.query.export}-transaction-report-body-english.html`, {
                  order: orderObject,
                  transactions: result.transactions
                },
                'Transaction Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res);
              // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
            } else {
              ExportService.exportFile('report_template/main_header/arabic_header.html',
                `report_template/transactionReport/${req.query.export}-transaction-report-body-arabic.html`, {
                  order: orderObject,
                  transactions: result.transactions
                },
                'تقرير المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res);
              // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
            }
          } else if (req.user.language === 'en') {
            ExportService.exportFile(`report_template/transactionReport/${req.query.export}-transaction-report-header-english.html`,
              `report_template/transactionReport/${req.query.export}-transaction-report-body-english.html`, {
                order: null,
                transactions: result.transactions
              },
              'Transaction Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res);
            // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
          } else {
            ExportService.exportFile(`report_template/transactionReport/${req.query.export}-transaction-report-header-arabic.html`,
              `report_template/transactionReport/${req.query.export}-transaction-report-body-arabic.html`, {
                order: null,
                transactions: result.transactions
              },
              'تقرير المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res);
            // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
          }
        } else {
          res.json(Response.success(result));
        }
      });
  }
}

const handleOne = (model, param) => {
  return new Promise((resolve, reject) => {
    model.find({order: param.order._id}).populate('product')
    .then((orderProduct)=>{
      param.orderProduct = orderProduct;
      resolve(param)
    })
    .catch(err => {
      reject(err)
    })
  })
}

function getInvoiceHistory(req, res){
  const invoiceId = req.params.invoiceId;
  Invoice.findOne({_id : req.params.invoiceId})
  .populate('customer')
  .populate('supplier')
  .populate({
      path: 'transactions',
      select: '_id order open close createdAt amount transId supplier customer isPaid PVAT',
      populate: {
        path: 'order'
      }
    })
  .then( (invoiceDetail) => {
    var transactions = invoiceDetail.transactions;
    var totalPrice = 0;
    new Promise((resolve, reject) => {
      transactions.forEach((item, index)=>{
        OrderProduct.findOne({order: item.order._id}).populate('product').then((product) => {
          item['_doc']['orderProduct'] = product;
          totalPrice = totalPrice + item.order.price;
          if (index === transactions.length -1) resolve();
        });
        
      })
    }).then(() => {
        invoiceDetail['_doc']["totalPrice"] = totalPrice; 
        res.json(Response.success(invoiceDetail));
    });
  });
}

/**
 *  Get Supplier's Billing History
 * @returns {Transactions Object}
 */
function getBillingHistory(req, res) {
  // const startDate = new Date(req.query.startDate.toString());
  // const endDate = new Date(req.query.endDate.toString());
  // endDate.setDate(endDate.getDate() + 1);

  if (req.user.type === 'Admin') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, null, req.params.supplierId);
      },
      function passParameter(customerId, supplierId, callback) {
        callback(null, customerId, supplierId, req.query.skip, req.query.limit);
      },
      getSupplierTransactions,
      getSupplierDetails
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        res.json(Response.success({
          balanceDetails: result.balanceDetails, billingHistory: result.billingHistory
        }));
      }
    });
  } else if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id, null);
      },
      getSupplierFromUser,
      function passParameter(supplierId, customerId, callback) {
        callback(null, customerId, supplierId, req.query.skip, req.query.limit);
      },
      getSupplierTransactions,
      getSupplierDetails
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        // res.json(Response.success({ transactions: result.transactions, count: result.count }));
        res.json(Response.success({
          balanceDetails: result.balanceDetails, billingHistory: result.billingHistory
        }));
      }
    });
  } else {
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id, req.params.supplierId);
      },
      getCustomerFromUser,
      function passParameter(customerId, supplierId, callback) {
        callback(null, customerId, supplierId, req.query.skip, req.query.limit);
      },
      getSupplierTransactions,
      getSupplierDetails
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        res.json(Response.success({
          balanceDetails: result.balanceDetails, billingHistory: result.billingHistory
        }));
      }
    });
  }
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

/* Helper Functions */

function updateAdminRelation(supplierId, adminRelation, callback) {
  Supplier.findOne({ _id: supplierId })
    .then((supplierObj) => {
      supplierObj.status = adminRelation.status;
      supplierObj.creditLimit = adminRelation.creditLimit;
      supplierObj.paymentInterval = adminRelation.paymentInterval;
      supplierObj.paymentFrequency = adminRelation.paymentFrequency;
      supplierObj.exceedCreditLimit = adminRelation.exceedCreditLimit;
      supplierObj.exceedPaymentDate = adminRelation.exceedPaymentDate;
      supplierObj.nextPaymentDueDate = moment(supplierObj.startPaymentDate).tz(appSettings.timeZone).add((adminRelation.paymentFrequency), adminRelation.paymentInterval).endOf('month').format(appSettings.momentFormat);
      supplierObj.save()
        .then(savedSupplierRelation => callback(null, savedSupplierRelation));
    })
    .catch(e => callback(e, null));
}

function getNumberInvoices(query, req, supplierInvoiceReport,skip, limit, match, callback){
  let branchMatch = {};
  if(req.query.branchId){
    branchMatch = {_id : req.query.branchId};
  }else{
    branchMatch = {};
  }
  Invoice.find(query)
    .populate('supplier')
    .populate({
      path: 'customer',
      populate : {
        path: 'branch',
        match: branchMatch
      } 
    })
    .populate({
      path: 'transactions',
      populate: {
        path: 'order',
        match: { $and: [{status: 'Delivered'}, match] },
      }
    })
    .skip(Number(skip))
    .limit(Number(limit))
    .then((acceptedInvoices) => {
      if(acceptedInvoices){
        acceptedInvoices.forEach((acceptedInvoicesObj) => {
          let invoice = {};
          invoice = {
            invoice_id: acceptedInvoicesObj._id,
            invoiceId: acceptedInvoicesObj.invoiceId,
            supplier: acceptedInvoicesObj.supplier,
            customer: acceptedInvoicesObj.customer,
            transactions: acceptedInvoicesObj.transactions,
            isPaid: acceptedInvoicesObj.isPaid,
            total: acceptedInvoicesObj.total,
            close: acceptedInvoicesObj.close,
            createdAt: acceptedInvoicesObj.createdAt
          };
          supplierInvoiceReport.invoices.push(invoice);
        });
        supplierInvoiceReport.numberOfInvoices = supplierInvoiceReport.invoices.length;
        callback(null, supplierInvoiceReport);
      }else{
        supplierInvoiceReport.invoices = [];
        supplierInvoiceReport.numberOfInvoices = 0;
        callback(null, supplierInvoiceReport);
      }
    });
}

/**
 * Helper Function
 * Get Number of Transactions
 */
function getNumberTransactions(supplierData, supplierTransactionReport,
                               skip, limit, match, callback) {
  supplierTransactionReport.supplierId = supplierData;
  // match.customer = { $ne: null };
  Transaction.find(match)
    .populate('supplier')
    .populate('customer')
    .populate('order')
    .skip(Number(skip))
    .limit(Number(limit))
    .then((acceptedTransactions) => {
      console.log('trans', acceptedTransactions);
      if (acceptedTransactions) {
        acceptedTransactions.forEach((acceptedTransactionsObj) => {
          let transaction = {};
          if (typeof acceptedTransactionsObj.customer === 'undefined') {
            transaction = {
              transactionId: acceptedTransactionsObj._id,
              transId: acceptedTransactionsObj.transId,
              accountNumber: acceptedTransactionsObj.accountNumber,
              accountName: acceptedTransactionsObj.accountName,
              recipientName: acceptedTransactionsObj.recipientName,
              chequeNumber: acceptedTransactionsObj.chequeNumber,
              date: acceptedTransactionsObj.createdAt,
              paymentMethod: acceptedTransactionsObj.paymentMethod ? acceptedTransactionsObj.paymentMethod : '--',
              from: acceptedTransactionsObj.supplier.representativeName,
              to: appSettings.systemTitle,
              amount: acceptedTransactionsObj.amount,
              type: acceptedTransactionsObj.type,
              orderId: acceptedTransactionsObj.order._id,
              order: acceptedTransactionsObj.order
            };
          } else {
            transaction = {
              transactionId: acceptedTransactionsObj._id,
              transId: acceptedTransactionsObj.transId,
              accountNumber: acceptedTransactionsObj.accountNumber,
              accountName: acceptedTransactionsObj.accountName,
              recipientName: acceptedTransactionsObj.recipientName,
              chequeNumber: acceptedTransactionsObj.chequeNumber,
              date: acceptedTransactionsObj.createdAt,
              paymentMethod: acceptedTransactionsObj.paymentMethod ? acceptedTransactionsObj.paymentMethod : '--',
              from: acceptedTransactionsObj.customer.representativeName,
              to: acceptedTransactionsObj.supplier.representativeName,
              amount: acceptedTransactionsObj.amount,
              type: acceptedTransactionsObj.type,
              orderId: acceptedTransactionsObj.order._id,
              order: acceptedTransactionsObj.order
            };
          }

          supplierTransactionReport.transactions.push(transaction);
        });
        Transaction.find(match)
          .count()
          .then((transactionCount) => {
            // Get the supplier's transactionReport count
            supplierTransactionReport.numberOfTransactions = transactionCount;
            callback(null, supplierData, supplierTransactionReport, match);
          });
      } else {
        supplierTransactionReport.transactions = [];
        supplierTransactionReport.numberOfTransactions = 0;
        callback(null, supplierData, supplierTransactionReport, match);
      }
    });
}

/**
 * Helper Function
 * Get invoice detail
 */
function getInvoiceDetail(req, res) {

}
/**
 * Helper Function
 * Get Supplier's or Customer's total balance and credit
 */
function getTotalBalance(supplierId, supplierTransactionReport, match, callback) {
  if (supplierId) {
    Transaction.find(match)
      .then((supplierTransaction) => {
        if (supplierTransaction.length > 0) {
          supplierTransactionReport.totalBalance = Math.abs(supplierTransaction.map(c => c.amount).reduce((sum, value) => sum + value, 0));
          supplierTransactionReport.totalCredit = supplierTransaction.map(c => c).filter(c => c.type === 'credit').map(c => c.amount).reduce((sum, value) => sum + value, 0);
          // supplierTransaction.close - supplier.creditLimit;
          callback(null, supplierTransactionReport);
        } else {
          supplierTransactionReport.totalBalance = 0;
          supplierTransactionReport.totalCredit = 0;
          callback(null, supplierTransactionReport);
        }
      });
  } else {
    let total = 0;
    let totalCredit = 0;
    Supplier.find()
      .then((suppliers) => {
        let supplierIndex = 1;
        suppliers.forEach((supplierObj) => {
          Transaction.find(match)
            .then((supplierTransaction) => {
              if (supplierTransaction.length > 0) {
                total = Math.abs(supplierTransaction.map(c => c.amount).reduce((sum, value) => sum + value, 0));
                totalCredit = supplierTransaction.map(c => c).filter(c => c.type === 'credit').map(c => c.amount).reduce((sum, value) => sum + value, 0);
              } else {
                total = 0;
                totalCredit = 0;
              }
              if (supplierIndex >= suppliers.length) {
                supplierTransactionReport.totalBalance = Math.abs(total);
                supplierTransactionReport.totalCredit = totalCredit;
                callback(null, supplierTransactionReport);
              }
              supplierIndex += 1;
            });
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
 * Creates the user
 * @property {User} user - The user.
 * @returns {User}
 */
function createStaffUser(supplier, user, role, callback) {
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
        // supplier.remove();
        callback(err, null, null);
      } else {
        callback(null, supplier, savedUser);
      }
    });
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
 * Adds the staff member to the supplier
 * @property {User} user - The user.
 * @property {Supplier} supplier - The supplier.
 * @returns {Supplier}
 */
function addStaffToSupplier(user, supplier, callback) {
  supplier.staff.push(user._id);

  supplier.save()
    .then(savedSupplier => callback(null, savedSupplier))
    .catch(e => callback(e, null));
}

/**
 * Helper Function
 * Get details of supplier.
 * @property {Supplier} supplier - The supplier's details.
 * @property {string} userId - The id of the supplier user.
 * @returns {Supplier}
 */
function checkUserInSupplier(supplier, userId) {
  // Check if the user is the staff list.
  return supplier.staff.includes(userId);
}

/**
 * Helper Function
 * Get supplier with their staff using the user.
 * @property {string} userId - The id of the supplier user.
 * @returns {Supplier}
 */
function getSupplierWithStaffFromUser(userId, callback) {
  Supplier.findOne()
    .populate('staff')
    .where('staff').in([userId])
    .exec((err, supplier) => callback(err, supplier));
}

/**
 * Helper Function
 * Get supplier using the user.
 * @property {string} userId - The id of the supplier user.
 * @returns {Supplier}
 */
function getSupplierFromUser(userId, user, callback) {
  Supplier.findOne()
    .where('staff').in([userId])
    .exec((err, supplier) => callback(err, supplier, user));
}

/**
 * Helper Function
 * Get customer using the user.
 * @property {string} userId - The id of the customer user.
 * @returns {Supplier}
 */
function getCustomerFromUser(userId, supplierId, callback) {
  Customer.findOne({ user: userId })
    .then((customer) => {
      if (customer.type === 'Staff') {
        return Customer.findOne({ _id: customer.customer });
      }
      return customer;
    }).then((customer) => {
      callback(null, customer._id, supplierId);
    });
}

/**
 * Helper Function
 * Get supplier using the user.
 * @property {string} userId - The id of the supplier user.
 * @returns {Supplier}
 */
function getSupplierFromUserForStaff(userId, skip, limit, staffQueryMatch, roleMatch, callback) {
  Supplier.findOne()
    .populate('staff')
    .where('staff').in([userId])
    .exec((err, supplier) => callback(err, supplier, userId, skip, limit, staffQueryMatch, roleMatch));
}

/**
 * Helper Function
 * Creates the staff members and adds him to the supplier's staff.
 * @property {User} user - The new staff user.
 * @property {Supplier} supplier - The supplier user.
 * @returns {User []}
 */
function createUserAndAddToSupplier(supplier, user, callback) {
  async.parallel({
    staff: parallelCallback => createStaffUser(supplier, user, null, parallelCallback),
    supplier: parallelCallback => addStaffToSupplier(user, supplier, parallelCallback)
  },
    (err, result) => {
      callback(err, { supplier, staff: result.staff[1] });
    });
}

/**
 * Helper Function
 * Get supplier's staff.
 * @property {User} user - The new staff user.
 * @property {Supplier} supplier - The supplier user.
 * @returns {User []}
 */
function getSupplierStaff(supplier, userId, skip, limit, staffQueryMatch, roleMatch, callback) {
  Supplier.findOne({ _id: supplier._id })
    .populate({
      path: 'staff',
      select: '_id email mobileNumber firstName lastName status role',
      match: { $and: [staffQueryMatch, roleMatch, { _id: { $ne: userId.toString() } }] },
      options: {
        limit: Number(limit),
        skip: Number(skip)
      },
      populate: {
        path: 'role',
        select: '_id arabicName englishName'
      }
    })
    .select('staff')
    .exec((err, s) => {
      const staff = s.staff;
      Supplier.findOne({ _id: supplier._id })
        .populate({
          path: 'staff',
          select: '_id email mobileNumber firstName lastName role',
          match: { $and: [staffQueryMatch, roleMatch, { _id: { $ne: userId.toString() } }] },
          populate: {
            path: 'role',
            select: '_id arabicName englishName'
          }
        })
        .select('staff')
        .then((staffCount) => {
          const supplierStaffObject = {
            staff,
            count: staffCount.staff.length
          };
          callback(err, supplierStaffObject);
        });
    });
}

function getSupplierDrivers(supplier, userId, skip, limit, staffQueryMatch, roleMatch, callback) {
  Permission.findOne({ key: 'canDeliver' })
    .then((permission) => {
      Supplier.findOne({ _id: supplier._id })
        .populate({
          path: 'staff',
          select: '_id email mobileNumber firstName lastName status role',
          populate: {
            path: 'role',
            select: '_id arabicName englishName permissions'
          },
          match: { $and: [staffQueryMatch, roleMatch] }, // , { _id: { $ne: supplier.staff[0]._id.toString() } }
          options: {
            limit: Number(limit),
            skip: Number(skip)
          }
        })
        .exec((err, s) => {
          const staff = s.staff;
          const staffArr = [];
          staff.forEach((staffObject) => {
            if (staffObject.role.permissions.indexOf(permission._id.toString()) > -1) {
              staffArr.push(staffObject);
            }
          });
          const supplierStaffObject = {
            staff: staffArr,
            count: staffArr.length
          };
          callback(err, supplierStaffObject);
        });
    });
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
 * Returns supplier's billing transactions.
 * @param {Supplier} supplierId - The supplier id.
 * @param {Customer} customerId - The customer id.
 * @param {Number} skip.
 * @param {Number} limit.
 * return {Transaction} transactions for a supplier.
 */
function getSupplierTransactions(customerId, supplierId, skip, limit, callback) {
  let match = '';
  match = { $and: [{ supplier: supplierId }, { customer: customerId }] };
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
          select: '_id representativeName adminFees'
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
            select: '_id price VAT supplier customer _id representativeName _id representativeName',
            populate: {
              path: 'supplier customer',
              select: '_id representativeName _id representativeName'
            }
          }
        })
        .then((invoices) => {
          invoices.forEach((invoiceObj) => {
            const transactionSupplierFees = [];
            const transactionsOrderTotal = invoiceObj.transactions.map(c => c.order.price);
            let subTotal = 0;
            if (customerId === null) {
              transactionsOrderTotal.forEach((value) => {
                transactionSupplierFees.push(value * invoiceObj.supplier.adminFees);
                subTotal += (value * invoiceObj.supplier.adminFees);
              });
            } else {
              transactionsOrderTotal.forEach((value) => {
                subTotal += value;
              });
            }
            const invoiceTotal = subTotal + (subTotal * appSettings.VATPercent);
            const invoiceTransactions = [];
            let transactionIndex = 0;
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
                transactionSupplierFees: transactionSupplierFees[transactionIndex]
              });
              transactionIndex += 1;
            });
            const invoice = {
              _id: invoiceObj._id,
              invoiceId: invoiceObj.invoiceId,
              supplier: invoiceObj.supplier,
              customer: invoiceObj.customer,
              transactions: invoiceTransactions,
              createdAt: moment(invoiceObj.createdAt).tz(appSettings.timeZone).endOf('month').format(appSettings.momentFormat),
              dueDate: invoiceObj.dueDate,
              type: 'invoice',
              total: invoiceTotal,
              subTotal,
              VAT: subTotal * appSettings.VATPercent
            };
            transactions.push(invoice);
            transactionIndex = 0;
          });
          trans.forEach((transactionObj) => {
            const transaction = {
              _id: transactionObj._id,
              supplier: transactionObj.supplier,
              customer: transactionObj.customer,
              amount: transactionObj.amount,
              transId: transactionObj.transId,
              type: transactionObj.type,
              from: customerId ? transactionObj.customer.representativeName : transactionObj.supplier.representativeName,
              to: customerId ? transactionObj.supplier.representativeName : appSettings.systemTitle,
              recipientName: customerId ? transactionObj.recipientName : appSettings.systemTitle,
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
          const transactionsObject = transactions.sort((a, b) => b.createdAt - a.createdAt);
          const transactionResultObject = transactionsObject.slice(skip, (limit + skip) > transactionsObject.length ?
            (transactionsObject.length) : (limit + skip));
          callback(null, {
            transactions: transactionResultObject,
            count: trans.length + invoices.length
          }, supplierId, customerId);
        });
    });
}
/**
 * Helper Function
 * Returns supplier's billing transactions.
 * @param {Customer} customerId - The customer id. Optional
 * @param {Number} skip.
 * @param {Number} limit.
 * @param {date} startDate.
 * @param {date} endDate
 * return {Invoice} invoices for a supplier.
 */

 function getBranches(req, res){
    const customerId = req.query.customerId;
    const supplierId =req.user._id;
    if(customerId != "All"){
      async.waterfall([
        function passParamter(callback){
          callback(null, customerId, supplierId);
        },
        getBranchesArray
      ], (err, result)=> {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else if (req.query.export) {
          if (req.user.language === 'en') {
            ExportService.exportFile(`report_template/invoiceReport/${req.query.export}-invoice-report-header-english.html`,
              `report_template/invoiceReport/${req.query.export}-invoice-report-body-english.html`, result.invoices,
              'Invoice Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res
              );
            // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
          } else {
            ExportService.exportFile(`report_template/invoiceReport/${req.query.export}-invoice-report-header-arabic.html`,
              `report_template/invoiceReport/${req.query.export}-invoice-report-body-arabic.html`, result.invoices,
              'تقرير المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res);
            // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
          }
        } else {
          res.json(Response.success(result));
        }
      })
    }
    
 }
 function getInvoices(req, res){
  const startDate = new Date(req.query.startDate.toString());
  const endDate = new Date(req.query.endDate.toString());
  endDate.setDate(endDate.getDate() + 1);

  let idMatch = { updatedAt: { $gte: startDate, $lte: endDate } };
  let query = {};

  if( req.query.customerId && req.query.customerId != "All"){
    query = { $and: [{ supplier: req.user._id }, { customer: req.query.customerId }] };
  }else{
    query = { supplier: req.user._id };
  }

  const supplierInvoiceReport = {
    supplierId: '',
    numberOfInvoices: '',
    totalCredit: '',
    invoices: []
  };
  async.waterfall([
    function passParameter(callback) {
      callback(null, query,req, supplierInvoiceReport,
        req.query.skip, req.query.limit, idMatch);
    },
    getNumberInvoices
    // ,
    // getTotalBalance
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else if (req.query.export) {
      if (req.user.language === 'en') {
        ExportService.exportFile(`report_template/invoiceReport/${req.query.export}-invoice-report-header-english.html`,
          `report_template/invoiceReport/${req.query.export}-invoice-report-body-english.html`, result.invoices,
          'Invoice Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res
          );
        // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
      } else {
        ExportService.exportFile(`report_template/invoiceReport/${req.query.export}-invoice-report-header-arabic.html`,
          `report_template/invoiceReport/${req.query.export}-invoice-report-body-arabic.html`, result.invoices,
          'تقرير المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res);
        // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
      }
    } else {
      res.json(Response.success(result));
    }
  });
    
  // }
  // if (req.user.type === 'Supplier') {
  //   const supplierTransactionReport = {
  //     supplierId: '',
  //     numberOfTransactions: '',
  //     totalBalance: '',
  //     totalCredit: '',
  //     transactions: []
  //   };
  //   async.waterfall([
  //     function passParameters(callback) {
  //       callback(null, req.user._id, null);
  //     },
  //     getSupplierFromUser,
  //     function passParameter(supplierId, user, callback) {
  //       let match = {};
  //       if (req.query.customerId) {
  //         if (req.query.customerId.length) {
  //           if (req.query.type) {
  //             if (req.query.type === 'All') {
  //               match = {
  //                 supplier: supplierId,
  //                 customer: req.query.customerId,
  //                 createdAt: { $gte: startDate, $lte: endDate },
  //                 $or: [{ type: 'credit' }, { type: 'debit' }]
  //               };
  //             } else {
  //               match = {
  //                 supplier: supplierId,
  //                 customer: req.query.customerId,
  //                 createdAt: { $gte: startDate, $lte: endDate },
  //                 type: req.query.type.toLowerCase()
  //               };
  //             }
  //           } else {
  //             match = {
  //               supplier: supplierId,
  //               customer: req.query.customerId,
  //               createdAt: { $gte: startDate, $lte: endDate }
  //             };
  //           }
  //         }
  //       } else if (req.query.type) {
  //         if (req.query.type === 'All') {
  //           match = {
  //             supplier: supplierId,
  //             createdAt: { $gte: startDate, $lte: endDate },
  //             $or: [{ type: 'credit' }, { type: 'debit' }],
  //             customer: { $ne: null }
  //           };
  //         } else {
  //           match = {
  //             supplier: supplierId,
  //             createdAt: { $gte: startDate, $lte: endDate },
  //             type: req.query.type.toLowerCase(),
  //             customer: { $ne: null }
  //           };
  //         }
  //       } else {
  //         match = {
  //           supplier: supplierId,
  //           createdAt: { $gte: startDate, $lte: endDate },
  //           customer: { $ne: null }
  //         };
  //       }
  //       callback(null, supplierId._id, supplierTransactionReport,
  //           req.query.skip, req.query.limit, match);
  //     },
  //     getNumberTransactions,
  //     getTotalBalance
  //   ],
  //     (err, result) => {
  //       if (err) {
  //         res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
  //       } else if (req.query.export) {
  //         if (req.query.customerId) {
  //           const firstOrder = result.transactions[0] ? result.transactions[0].order : null;
  //           const orderObject = firstOrder;
  //           if (req.user.language === 'en') {
  //             ExportService.exportFile('report_template/main_header/english_header.html',
  //               `report_template/transactionReport/${req.query.export}-transaction-report-body-english.html`, {
  //                 order: orderObject,
  //                 transactions: result.transactions
  //               },
  //               'Transaction Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res);
  //             // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
  //           } else {
  //             ExportService.exportFile('report_template/main_header/arabic_header.html',
  //               `report_template/transactionReport/${req.query.export}-transaction-report-body-arabic.html`, {
  //                 order: orderObject,
  //                 transactions: result.transactions
  //               },
  //               'تقرير المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res);
  //             // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
  //           }
  //         } else if (req.user.language === 'en') {
  //           ExportService.exportFile(`report_template/transactionReport/${req.query.export}-transaction-report-header-english.html`,
  //             `report_template/transactionReport/${req.query.export}-transaction-report-body-english.html`, {
  //               order: null,
  //               transactions: result.transactions
  //             },
  //             'Transaction Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res);
  //           // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
  //         } else {
  //           ExportService.exportFile(`report_template/transactionReport/${req.query.export}-transaction-report-header-arabic.html`,
  //             `report_template/transactionReport/${req.query.export}-transaction-report-body-arabic.html`, {
  //               order: null,
  //               transactions: result.transactions
  //             },
  //             'تقرير المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).subtract(1, 'days').format('DD-MM-YYYY')}`, req.query.export, res);
  //           // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
  //         }
  //       } else {
  //         res.json(Response.success(result));
  //       }
  //     });
  // }
 }

/**
 * Helper Function
 * Returns supplier's Details.
 * @param {Object} billingHistory.
 * @param {Supplier} supplierId - The supplier of the user.
 * @param {Customer} customerId - The customer.
 * return {Object} supplier profile details.
 */
function getSupplierDetails(billingHistory, supplierId, customerId, callback) {
  const toDate = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
  let fromDate = '';
  let isAdminFees = {};
  if (customerId === null) {
    isAdminFees = { isAdminFees: true };
  } else {
    isAdminFees = { isAdminFees: false };
  }

  // const nextDate = moment().add(1, 'days').tz(appSettings.timeZone).format(appSettings.momentFormat);
  // { $gt: todayDate, $lt: nextDate }
  Supplier.findOne({ _id: supplierId })
    .then((supplier) => {
      let createdAtDate = '';
      let interval = '';
      let intervalPeriod = '';
      let frequency = '';
      if (supplier.paymentInterval === 'Month') {
        interval = 'M';
        intervalPeriod = 'month';
        frequency = supplier.paymentFrequency;
      } else if (supplier.paymentInterval === 'Week') {
        interval = 'days';
        intervalPeriod = 'week';
        frequency = supplier.paymentFrequency * 7;
      } else {
        interval = 'days';
        intervalPeriod = 'day';
        frequency = supplier.paymentFrequency;
      }
      const nextPaymentDate = moment(supplier.nextPaymentDueDate).tz(appSettings.timeZone);
      for (createdAtDate = moment(supplier.createdAt).tz(appSettings.timeZone);
           moment().tz(appSettings.timeZone).diff(createdAtDate) > 0;
           createdAtDate = createdAtDate.add(Number(frequency), interval)) {
        fromDate = createdAtDate.tz(appSettings.timeZone).format(appSettings.momentFormat);
      }
      supplier.days = createdAtDate.diff(moment(), 'days');
      supplier.save()
        .then((savedSupplier) => {
          Transaction.find({ $and: [{ supplier: savedSupplier }, { customer: customerId }, { createdAt: { $gt: moment().startOf('month').tz(appSettings.timeZone).format(appSettings.momentFormat) } }, isAdminFees] })
            .sort({
              createdAt: -1
            })
            .then((supplierTransaction) => {
              let supplierBalance = '';
              if (supplierTransaction.length > 0) {
                supplierBalance = supplierTransaction[0].close;
              } else {
                supplierBalance = 0;
              }
              // const supplierMonthCredit = savedSupplier.creditLimit - supplierBalance;
              // const startPaymentDueDate = moment(savedSupplier.nextPaymentDueDate).subtract(Number(frequency), interval).startOf('day');
              const supplierMonthCredit = supplierTransaction.map(c => c).filter(c => c.type === 'debit' && (moment(c.createdAt) >= moment(savedSupplier.startPaymentDate).tz(appSettings.timeZone).startOf('day') && moment(c.createdAt) <= moment(savedSupplier.nextPaymentDueDate).tz(appSettings.timeZone).endOf('day')))
                .map(c => c.amount).reduce((sum, value) => sum + value, 0);
              let payment = {};
              if (customerId === null) {
                payment = {
                  interval: savedSupplier.paymentInterval,
                  frequency: savedSupplier.paymentFrequency
                };
                Order.find({ $and: [{ supplier: savedSupplier }, { $and: [{ status: { $ne: 'Delivered' } }, { status: { $ne: 'Canceled' } }, { status: { $ne: 'CanceledByCustomer' } }, { status: { $ne: 'Rejected' } }, { status: { $ne: 'FailedToDeliver' } }] }] })
                  .then((orders) => {
                    const reservedBalance = orders.map(c => (c.price + c.VAT) * savedSupplier.adminFees).reduce((sum, value) => sum + value, 0);
                    const balanceDetails = {
                      balance: supplierBalance, // + (supplierBalance * appSettings.VATPercent),
                      monthCredit: (Math.abs(supplierMonthCredit) + reservedBalance),
                      payment,
                      days: savedSupplier.days,
                      nextPaymentDate,
                      nextInvoiceDate: moment().tz(appSettings.timeZone).endOf('month').format(appSettings.momentFormat),
                      creditLimit: savedSupplier.creditLimit,
                      exceedCreditLimit: savedSupplier.exceedCreditLimit,
                      exceedPaymentDate: savedSupplier.exceedPaymentDate,
                      canOrder: ((savedSupplier.creditLimit - supplierMonthCredit) > 0 || savedSupplier.exceedCreditLimit)
                    };
                    callback(null, { balanceDetails, billingHistory });
                  });
              } else {
                Customer.findOne({ _id: customerId })
                  .populate('user')
                  .then((customer) => {
                    if (customer.type === 'Staff') {
                      return Customer.findOne({ _id: customer.customer }).populate('user');
                    }
                    return customer;
                  }).then((customer) => {
                    CustomerInvite.findOne({
                      customerEmail: customer.user.email,
                      supplier: supplierId
                    })
                    .then((customerInvite) => {
                      payment = {
                        interval: customerInvite.paymentInterval,
                        frequency: customerInvite.paymentFrequency
                      };
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
                      // const startCustomerPaymentDueDate = moment(customerInvite.nextPaymentDueDate).subtract(Number(frequency), interval).startOf('day');
                      const supplierCustomerMonthCredit = supplierTransaction.map(c => c).filter(c => c.type === 'debit' && (moment(c.createdAt) >= moment(customerInvite.startPaymentDate).tz(appSettings.timeZone).startOf('day') && moment(c.createdAt) <= moment(customerInvite.nextPaymentDueDate).tz(appSettings.timeZone).endOf('day')))
                        .map(c => c.amount).reduce((sum, value) => sum + value, 0);
                      // nextPaymentDate = moment(customer.createdAt).tz(appSettings.timeZone).endOf(intervalPeriod).add(Number(frequency) - 1, interval);
                      Order.find({ $and: [{ supplier: savedSupplier }, { customer: customerId }, { $and: [{ status: { $ne: 'Delivered' } }, { status: { $ne: 'Canceled' } }, { status: { $ne: 'CanceledByCustomer' } }, { status: { $ne: 'Rejected' } }, { status: { $ne: 'FailedToDeliver' } }] }] })
                        .then((orders) => {
                          const reservedBalance = orders.map(c => c.price + c.VAT).reduce((sum, value) => sum + value, 0);
                          const balanceDetails = {
                            balance: supplierBalance,
                            monthCredit: (Math.abs(supplierCustomerMonthCredit) + reservedBalance),
                            payment,
                            days: savedSupplier.days,
                            nextPaymentDate: customerInvite.nextPaymentDueDate,
                            nextInvoiceDate: moment().tz(appSettings.timeZone).endOf('month').format(appSettings.momentFormat),
                            creditLimit: customerInvite.creditLimit,
                            exceedCreditLimit: customerInvite.exceedCreditLimit,
                            exceedPaymentDate: customerInvite.exceedPaymentDate,
                            canOrder: ((customerInvite.creditLimit - supplierCustomerMonthCredit) > 0 || customerInvite.exceedCreditLimit)
                          };
                          callback(null, { balanceDetails, billingHistory });
                        });
                    });
                  });
              }
            });
        });
    });
}

/**
 * Helper Function
 * Get branches of customer and staff.
 * @property {string} userId - The id of the customer user.
 * @returns {Customer}
 */
function getBranchesArray(userId, supplierId, callback) {
  let customer = null;
  // Customer.findOne({ user: userId }).then((cus) => {
  //   customer = cus;
  //   if (customer.type === 'Staff') {
  //     return Branches.find({ manager: customer._id }, { _id: 1 });
  //   }
  //   return Branches.find({ customer: customer._id }, { _id: 1 });
  // }).then((branches) => {
  //   console.log(branches);

  //   if (branches.length === 0 && customer.type === 'Staff') {
  //     return Branches.find({ customer: customer.customer }, { _id: 1 });
  //   }
  //   return branches;
  // })
  if(userId != "All"){
    Branches.find({ customer: userId })
    .then((branches) => {
      callback(null, branches, supplierId);
    }).catch((err) => {
      callback(err, null, null);
    });  
  }else{
    callback(null, [], supplierId);
  }
  
}

export default {
  load,
  get,
  profile,
  create,
  approve,
  update,
  updateName,
  list,
  updateRelation,
  remove,
  addStaff,
  updateStaff,
  removeStaff,
  getStaff,
  getDrivers,
  block,
  unblock,
  getReport,
  getTransactionsReport,
  getBillingHistory,
  getInvoices,
  getInvoiceHistory,
  getBranches
};
