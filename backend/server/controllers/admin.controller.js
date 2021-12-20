import async from 'async';
import httpStatus from 'http-status';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
import EmailHandler from '../../config/emailHandler';
import UserService from '../services/user.service';
import User from '../models/user.model';
import Response from '../services/response.service';
import Role from '../models/role.model';
import Order from '../models/order.model';
import ExportService from '../controllers/exportFileService';
import notificationCtrl from '../controllers/notification.controller';

// const debug = require('debug')('app:supplier');
// const moment = require('moment-timezone');


/**
 * Load admin and append to req.
 */
function load(req, res, next, id) {
  User.findById(id)
  .where('type').equals('Admin')
  .then((admin) => {
    if (admin) {
      req.admin = admin;
      return next();
    }
    return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
  })
  .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Load user and append to req.
 */
function loadUser(req, res, next, id) {
  User.findById(id)
  .then((userStaff) => {
    if (userStaff) {
      req.userStaff = userStaff;
      return next();
    }
    return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
  })
  .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Get admin
 * @returns {Admin}
 */
function get(req, res) {
  return res.json(Response.success(req.admin));
}

/**
 * Get Current Admin.
 * @returns {Admin}
 */
function getCurrent(req, res) {
  res.json(Response.success(req.user));
}

/**
 * Create new admin
 * @property {string} req.body.userEmail - The admin user's email.
 * @property {string} req.body.mobileNumber - The admin user's mobile phone.
 * @property {string} req.body.firstName - The admin user's first name.
 * @property {string} req.body.lastName - The admin user's last name.
 * @property {string} req.body.password - The admin user's password.
 * @property {string} req.body.role - The admin user's role.
 * @property {string} req.body.status - The admin user's status.
 * @returns {Admin}
 */
function create(req, res) {
  const admin = new User({
    email: req.body.email.toLowerCase(),
    mobileNumber: req.body.mobileNumber,
    firstName: req.body.firstName.toLowerCase(),
    lastName: req.body.lastName.toLowerCase(),
    password: req.body.password,
    role: req.body.role,
    status: req.body.status,
    language: req.body.language,
    type: 'Admin'
  });

  async.waterfall([
    function passParameters(callback) {
      callback(null, admin);
    },
    roleEligible,
    UserService.isEmailMobileNumberDuplicate,
    UserService.hashPasswordAndSave
  ],
  (err, user) => {
    if (err) {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
    } else {
      user.password = undefined;
      if (appSettings.emailSwitch) {
        const content = {
          recipientName: UserService.toTitleCase(user.firstName),
          loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
          userName: req.body.email,
          password: req.body.password
        };
        EmailHandler.sendEmail(req.body.email, content, 'NEWUSER', req.body.language);
      }
      res.json(Response.success(user));
    }
  });
}

/**
 * Delete Admin.
 * @returns {Object}
 */
function remove(req, res) {
  const admin = req.admin;
  admin.remove()
    .then((deletedAdmin) => {
      if (appSettings.emailSwitch) {
        const content = {
          recipientName: UserService.toTitleCase(admin.firstName)
        };
        EmailHandler.sendEmail(req.admin.email, content, 'REMOVEUSER', admin.language);
      }
      res.json(Response.success(deletedAdmin));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Update existing admin
 * @property {string} req.body.email - The admin user's email.
 * @property {string} req.body.mobilePhone - The admin user's mobile phone.
 * @property {string} req.body.firstName - The admin user's first name.
 * @property {string} req.body.lastName - The admin user's last name.
 * @property {string} req.body.password - The admin user's password.
 * @property {string} req.body.status - The admin user's password.
 * @property {string} req.body.role - The admin user's role.
 * @returns {User}
 */
function update(req, res) {
  const admin = req.admin;
  admin.email = req.body.email.toLowerCase();
  admin.mobileNumber = req.body.mobileNumber;
  admin.firstName = req.body.firstName.toLowerCase();
  admin.lastName = req.body.lastName.toLowerCase();
  admin.status = req.body.status;
  admin.role = req.body.role;
  admin.language = req.body.language;

  async.waterfall([
    function passParameters(callback) {
      callback(null, admin);
    },
    roleEligible,
    UserService.isEmailMobileNumberDuplicate,
    admin.password ? UserService.hashPasswordAndSave : UserService.update
  ],
  (err, user) => {
    if (err) {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
    } else {
      if (appSettings.emailSwitch) {
        const content = {
          recipientName: UserService.toTitleCase(admin.firstName),
          loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>` // eslint-disable-line no-useless-escape
        };
        EmailHandler.sendEmail(req.admin.email, content, 'UPDATEUSER', admin.language);
      }
      const notification = {
        refObjectId: user,
        level: 'info',
        user,
        userType: 'Admin',
        key: 'updateStaffAccount',
        stateParams: null
      };
      notificationCtrl.createNotification('user', notification, null, null, null, null);
      user.password = undefined;
      res.json(Response.success(user));
    }
  });
}

/**
 * Update existing user
 * @property {string} req.body.email - The admin user's email.
 * @property {string} req.body.mobilePhone - The admin user's mobile phone.
 * @property {string} req.body.firstName - The admin user's first name.
 * @property {string} req.body.lastName - The admin user's last name.
 * @property {string} req.body.password - The admin user's password.
 * @property {string} req.body.status - The admin user's password.
 * @property {string} req.body.role - The admin user's role.
 * @returns {User}
 */
function updateUsers(req, res) {
  const userStaff = req.userStaff;
  userStaff.email = req.body.email.toLowerCase();
  userStaff.mobileNumber = req.body.mobileNumber;
  userStaff.firstName = req.body.firstName.toLowerCase();
  userStaff.lastName = req.body.lastName.toLowerCase();
  userStaff.status = req.body.status;
  userStaff.role = req.body.role;
  userStaff.language = req.body.language;

  async.waterfall([
    function passParameters(callback) {
      callback(null, userStaff);
    },
    UserService.isEmailMobileNumberDuplicate,
    userStaff.password ? UserService.hashPasswordAndSave : UserService.update
  ],
  (err, user) => {
    if (err) {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
    } else {
      if (appSettings.emailSwitch) {
        const content = {
          recipientName: UserService.toTitleCase(userStaff.firstName),
          loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>` // eslint-disable-line no-useless-escape
        };
        EmailHandler.sendEmail(req.userStaff.email, content, 'UPDATEUSER', userStaff.language);
        const notification = {
          refObjectId: user,
          level: 'info',
          user,
          userType: 'Admin',
          key: 'updateStaffAccount',
          stateParams: null
        };
        notificationCtrl.createNotification('user', notification, null, null, null, null);
        user.password = undefined;
        res.json(Response.success(user));
      } else {
        const notification = {
          refObjectId: user,
          level: 'info',
          user,
          userType: 'Admin',
          key: 'updateStaffAccount',
          stateParams: null
        };
        notificationCtrl.createNotification('user', notification, null, null, null, null);
        user.password = undefined;
        res.json(Response.success(user));
      }
    }
  });
}

/**
 * Update logged in admin
 * @property {string} req.body.email - The admin user's email.
 * @property {string} req.body.mobilePhone - The admin user's mobile phone.
 * @property {string} req.body.firstName - The admin user's first name.
 * @property {string} req.body.lastName - The admin user's last name.
 * @property {string} req.body.password - The admin user's password.
 * @returns {User}
 */
function updateCurrentAdmin(req, res) {
  const admin = req.user;
  admin.email = req.body.email.toLowerCase();
  admin.mobileNumber = req.body.mobileNumber;
  admin.firstName = req.body.firstName.toLowerCase();
  admin.lastName = req.body.lastName.toLowerCase();
  admin.language = req.body.language;

  async.waterfall([
    function passParameters(callback) {
      callback(null, admin);
    },
    UserService.isEmailMobileNumberDuplicate,
    admin.password ? UserService.hashPasswordAndSave : UserService.update
  ],
  (err, user) => {
    if (err) {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
    } else {
      user.password = undefined;
      res.json(Response.success(user));
    }
  });
}

/**
 * Get admin list.
 * @property {number} req.query.skip - Number of admins to be skipped.
 * @property {number} req.query.limit - Limit number of admins to be returned.
 * @property {string} req.query.role
 * @property {string} req.query.adminQuery
 * @returns {Admin[]}
 */
function list(req, res) {
  let adminQueryMatch = {};
  let match = {};
  if (typeof req.query.adminQuery === 'undefined' && typeof req.query.roleId === 'undefined' && typeof req.query.status === 'undefined') {
    match = {};
  } else {
    if (req.query.roleId) {
      if (req.query.roleId.length) {
        match.role = req.query.roleId;
      }
    }
    if (req.query.status) {
      if (req.query.status.length) {
        req.query.status.forEach((opt) => {
          req.query.status.push(new RegExp(opt, 'i'));
        });
        match.status = { $in: req.query.status };
      }
    }
    if (req.query.adminQuery) {
      adminQueryMatch = { $or: ([{ firstName: new RegExp(`.*${req.query.adminQuery.toLowerCase().trim()}.*`, 'i') }, { email: new RegExp(`.*${req.query.adminQuery.toLowerCase()}.*`) }]) };
    }
  }
// TODO: Performance Complexity Enhancement

  // User.aggregate([
  //   {
  //     $match: { $and: [adminQueryMatch, match, { type: 'Admin' }] }
  //   },
  //   {
  //     $lookup: {
  //       from: 'roles',
  //       localField: 'role',
  //       foreignField: '_id',
  //       as: 'role'
  //     }
  //   },
  //   {
  //     $unwind: '$role',
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       email: 1,
  //       mobileNumber: 1,
  //       firstName: 1,
  //       lastName: 1,
  //       status: 1,
  //       'role._id': 1,
  //       'role.englishName': 1,
  //       'role.arabicName': 1,
  //       'role.userType': 1,
  //       'role.isLocked': 1,
  //       'role.permissions': 1
  //     }
  //   },
  //   {
  //     $lookup: {
  //       from: 'permissions',
  //       localField: 'role.permissions',
  //       foreignField: '_id',
  //       as: 'role.permissions'
  //     }
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       email: 1,
  //       mobileNumber: 1,
  //       firstName: 1,
  //       lastName: 1,
  //       status: 1,
  //       'role._id': 1,
  //       'role.englishName': 1,
  //       'role.arabicName': 1,
  //       'role.userType': 1,
  //       'role.isLocked': 1,
  //       'role.permissions._id': 1,
  //       'role.permissions.englishName': 1,
  //       'role.permissions.arabicName': 1,
  //       'role.permissions.allowedEndPoints': 1
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: '$_id',
  //       email: { $first: '$email' },
  //       mobileNumber: { $first: '$mobileNumber' },
  //       firstName: { $first: '$firstName' },
  //       lastName: { $first: '$lastName' },
  //       status: { $first: '$status' },
  //       role: { $first: '$role' },
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       admins: { $push: '$$ROOT' },
  //       total: { $sum: 1 }
  //     }
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       admins: { $slice: ['$admins', req.query.skip, req.query.limit] },
  //       total: 1
  //     }
  //   }
  // ], (err, admins) => {
  //   if (err) {
  //     res.json(err);
  //   }
  //   res.json(Response.success(admins));
  // });

  User.find({ $and: [adminQueryMatch, match, { _id: { $ne: req.user._id } }] })
  .select({
    _id: 1,
    email: 1,
    mobileNumber: 1,
    firstName: 1,
    lastName: 1,
    status: 1,
    role: 1,
    language: 1 })
  .where('type').equals('Admin')
    .populate({
      path: 'role',
      select: '_id arabicName englishName permissions',
      populate: {
        path: 'permissions',
        select: '_id arabicName englishName'
      }
    })
  .sort({
    createdAt: -1
  })
  .skip(Number(req.query.skip))
  .limit(Number(req.query.limit))
  .then((admins) => {
    User.count({ $and: [adminQueryMatch, match, { _id: { $ne: req.user._id } }] })
      .where('type').equals('Admin')
      .then((userCount) => {
        const adminsObject = {
          admins,
          count: userCount
        };
        res.json(Response.success(adminsObject));
      });
  })
  .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Get admin orders report
 * @property {String} req.params.supplierId
 * @property {date} req.query.startDate
 * @property {date} req.query.endDate
 * @return {Report Object}
 */
function getOrdersReport(req, res) {
  // Orders Report Object
  const adminOrderReport = {
    adminId: '',
    numberOfOrders: 0,
    totalRevenue: 0,
    avgDailyNumberOfOrders: 0,
    avgDailyRevenue: 0,
    orders: [],
    count: 0
  };

  // Calculate Number of Days Between Two Dates
  const startDate = new Date(req.query.startDate.toString());
  const endDate = new Date(req.query.endDate.toString());
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

  async.waterfall([
    function passParameters(callback) {
      // Public query condition Object for orders report - getOrderReports
      const queryCond = {};
      queryCond.createdAt = { $gte: startDate, $lte: endDate };
      if (req.query.supplierId) {
        if (req.query.supplierId.length) {
          queryCond.supplier = req.query.supplierId;
        }
      }
      if (req.query.customerId) {
        if (req.query.customerId.length) {
          queryCond.customer = req.query.customerId;
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

      callback(null, req.user._id, queryCond, adminOrderReport,
        diff, req.query.skip, req.query.limit);
    },
    getNumberOrders,
    getTotalRevenew,
    getAvgNumberOrdersAndRevenue,
    getOrderList
  ],
    (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else if (req.query.export) {
        if (req.user.language === 'en') {
          ExportService.exportFile(`report_template/main-header/english-header.html`,
            `report_template/order/${req.query.export}-order-report-body-english.html`, result.orders,
            'Orders Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
          // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
        } else {
          ExportService.exportFile(`report_template/order/${req.query.export}-order-report-header-arabic.html`,
            `report_template/order/${req.query.export}-order-report-body-arabic.html`, result.orders,
            'تقرير الطلبات', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
          // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
        }
      } else {
        res.json(Response.success(result));
      }
    });
}

/**
 * Get all supplier's and customer's staff
 * @return {User Object}
 */
function getAllUsers(req, res) {
  let adminQueryMatch = {};
  let match = {};
  if (typeof req.query.adminQuery === 'undefined' && typeof req.query.roleId === 'undefined' && typeof req.query.status === 'undefined') {
    match = {};
  } else {
    if (req.query.roleId) {
      if (req.query.roleId.length) {
        match.role = req.query.roleId;
      }
    }
    if (req.query.status) {
      if (req.query.status.length) {
        req.query.status.forEach((opt) => {
          req.query.status.push(new RegExp(opt, 'i'));
        });
        match.status = { $in: req.query.status };
      }
    }
    if (req.query.adminQuery) {
      adminQueryMatch = { $or: ([{ firstName: new RegExp(`.*${req.query.adminQuery.toLowerCase().trim()}.*`, 'i') }, { email: new RegExp(`.*${req.query.adminQuery.toLowerCase()}.*`) }]) };
    }
  }

  User.find({ $and: [adminQueryMatch, match, { _id: { $ne: req.user._id } }] })
  .select({
    _id: 1,
    email: 1,
    mobileNumber: 1,
    firstName: 1,
    lastName: 1,
    status: 1,
    role: 1,
    language: 1 })
    .populate({
      path: 'role',
      select: '_id arabicName englishName permissions',
      populate: {
        path: 'permissions',
        select: '_id arabicName englishName'
      }
    })
  .sort({
    createdAt: -1
  })
  .skip(Number(req.query.skip))
  .limit(Number(req.query.limit))
  .then((users) => {
    User.count({ $and: [adminQueryMatch, match, { _id: { $ne: req.user._id } }] })
      .then((userCount) => {
        const usersObject = {
          users,
          count: userCount
        };
        res.json(Response.success(usersObject));
      });
  })
  .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Helper Function
 * Checks that the user's role is appropriate
 * @param {ObjectId} roleId - The role to be added to the user
 */
function roleEligible(admin, callback) {
  Role.findById(admin.role)
  .then((role) => {
    if (role) {
      if (role.userType === 'Admin') {
        callback(null, admin);
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
 * Get number of Orders
 * @property {Object} queryCond
 * @property {Object} adminOrderReport
 * @return {Object} adminOrderReport, orderList
 */
function getNumberOrders(userId, queryCond1, adminOrderReport, diff, skip, limit, callback) {
  Order.count(queryCond1)
    .then((ordersCount) => {
      adminOrderReport.count = ordersCount;
      adminOrderReport.numberOfOrders = ordersCount;
    });
  Order.find(queryCond1)
    .populate('supplier')
    .populate('customer')
    .skip(Number(skip))
    .limit(Number(limit))
    .then((orderList) => {
      if (orderList.length !== 0) {
        const supplierId = orderList.map(c => c.supplier);
        queryCond1.supplier = supplierId[0]._id;
        const customerId = orderList.map(c => c.customer);
        queryCond1.customer = customerId[0]._id;
      }
      adminOrderReport.adminId = userId;
      callback(null, adminOrderReport, queryCond1, diff, orderList);
    });
}

/**
 * Helper Function
 * Get total revenue
 * @property {Object} orderList
 * @property {Object} adminOrderReport
 * @return {Object} adminOrderReport, orderList
 */
function getTotalRevenew(adminOrderReport, queryCond2, diff, orderList, callback) {
  const revenew = orderList
    .map(orderPrice => orderPrice.price + orderPrice.VAT)
    .reduce((sum, value) => sum + value, 0);
  adminOrderReport.totalRevenue = revenew;
  callback(null, adminOrderReport, queryCond2, diff, orderList);
}

/**
 * Helper Function
 * Get average orders and revenue
 * @property {Object} adminOrderReport
 * @property {Number} diff - number of days in date range
 * @return {Object} adminOrderReport, orderList
 */
function getAvgNumberOrdersAndRevenue(adminOrderReport, queryCond3, diff, orderList, callback) {
  Order.aggregate([
    {
      $match: { $and: [queryCond3] }
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' }, year: { $year: '$createdAt' } },
        count: { $sum: 1 },
        total: { $sum: '$price' }
      }
    }
  ], (err, suppliersOrders) => {
    if (err) {
      callback(err, null, null);
    } else {
      const sumOrders = suppliersOrders
        .map(m => m.count)
        .reduce((sum, value) => sum + value, 0);
      const sumRevenue = suppliersOrders
        .map(m => m.total)
        .reduce((sum, value) => sum + value, 0);
      adminOrderReport.avgDailyNumberOfOrders = sumOrders / diff;
      adminOrderReport.avgDailyRevenue = sumRevenue / diff;
      callback(null, adminOrderReport, orderList);
    }
  });
}

/**
 * Helper Function
 * Get orders list
 * @property {Object} adminOrderReport, orderList
 * @return {Object} adminOrderReport
 */
function getOrderList(adminOrderReport, orderList, callback) {
  if (orderList.length !== 0) {
    let index = 1;
    orderList.forEach((obj) => {
      if (index < orderList.length) {
        adminOrderReport.orders.push({
          orderId: obj._id,
          date: obj.createdAt,
          customerName: obj.customer.representativeName,
          supplierName: obj.supplier.representativeName,
          orderNumber: obj.orderId,
          orderStatus: obj.status,
          totalPrice: obj.price + obj.VAT
        });
        index += 1;
      } else {
        adminOrderReport.orders.push({
          orderId: obj._id,
          date: obj.createdAt,
          customerName: obj.customer.representativeName,
          supplierName: obj.supplier.representativeName,
          orderNumber: obj.orderId,
          orderStatus: obj.status,
          totalPrice: obj.price + obj.VAT
        });
        callback(null, adminOrderReport);
      }
    });
  } else {
    callback(null, adminOrderReport);
  }
}

export default {
  load,
  loadUser,
  get,
  getCurrent,
  create,
  update,
  remove,
  updateCurrentAdmin,
  list,
  getOrdersReport,
  getAllUsers,
  updateUsers
};
