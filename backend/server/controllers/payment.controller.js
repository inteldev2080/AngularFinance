import httpStatus from 'http-status';
import async from 'async';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
import Supplier from '../models/supplier.model';
import Customer from '../models/customer.model';
import Transaction from '../models/transaction.model';
import PendingPayment from '../models/pendingPayment.model';
import Response from '../services/response.service';
import EmailHandler from '../../config/emailHandler';
import UserService from '../services/user.service';
// import ExportService from '../controllers/exportFileService';
import notificationCtrl from '../controllers/notification.controller';
import CustomerInvite from '../models/customerInvite.model';


// const moment = require('moment-timezone');

/**
 * Admin/Supplier accepts the payment of a supplier/customer.
 */
function acceptPayment(req, res) {
  const payment = req.payment;
  if (req.user.type === 'Admin') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, payment.supplier, null, payment.amount,
            payment.transactionId, payment.accountNumber, payment.accountName, payment.bankName,
            payment.paymentMethod, payment.date, payment.recipientName,
            payment.chequeNumber);
      },
      createCreditTransaction
    ],
      (error, result) => {
        if (error) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(error));
        } else {
          const prevStatus = payment.status;
          payment.status = 'Approved';
          payment.updateAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
          payment.save()
            .then((savedPayment) => {
              if (appSettings.emailSwitch) {
                const content = {
                  recipientName: UserService.toTitleCase(payment.supplier.representativeName),
                  paymentId: payment.paymentId,
                  prevStatus,
                  currentStatus: savedPayment.status
                };
                EmailHandler.sendEmail(payment.supplier.staff[0].email, content, 'PAYMENTSTATUS', payment.supplier.staff[0].language);
              }
              const notification = {
                refObjectId: payment,
                level: 'success',
                user: payment.supplier.staff[0],
                userType: 'Supplier',
                key: 'paymentStatus',
                stateParams: null
              };
              notificationCtrl.createNotification('payment', notification, prevStatus, savedPayment.status, null, null);
              res.json(Response.success(result));
            })
            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
        }
      });
  } else if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, payment.supplier, payment.customer, payment.amount,
            payment.transactionId, payment.accountNumber, payment.accountName, payment.bankName,
            payment.paymentMethod, payment.date, payment.recipientName,
            payment.chequeNumber);
      },
      createCreditTransaction
    ],
      (error, result) => {
        if (error) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(error));
        } else {
          const prevStatus = payment.status;
          payment.status = 'Approved';
          payment.updateAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
          payment.save()
            .then((savedPayment) => {
              if (appSettings.emailSwitch) {
                const content = {
                  recipientName: UserService.toTitleCase(payment.customer.representativeName),
                  paymentId: payment.paymentId,
                  prevStatus,
                  currentStatus: savedPayment.status
                };
                EmailHandler.sendEmail(payment.customer.user.email, content, 'PAYMENTSTATUS', payment.customer.user.language);
              }
              const notification = {
                refObjectId: payment,
                level: 'success',
                user: payment.customer.user,
                userType: 'Customer',
                key: 'paymentStatus',
                stateParams: 'supplier'
              };
              notificationCtrl.createNotification('payment', notification, prevStatus, savedPayment.status, null, payment.supplier._id);
              res.json(Response.success(result));
            })
            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
        }
      });
  }
}

/**
 * Admin/Supplier rejects the payment of a supplier/customer.
 */
function rejectPayment(req, res) {
  if (req.user.type === 'Admin') {
    const payment = req.payment;
    const prevStatus = payment.status;
    payment.status = 'Rejected';
    payment.updateAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
    payment.save()
      .then((savedPayment) => {
        if (appSettings.emailSwitch) {
          const content = {
            recipientName: UserService.toTitleCase(payment.supplier.representativeName),
            paymentId: payment.paymentId,
            prevStatus,
            currentStatus: savedPayment.status
          };
          EmailHandler.sendEmail(payment.supplier.staff[0].email, content, 'PAYMENTSTATUS', payment.supplier.staff[0].language);
        }
        const notification = {
          refObjectId: payment,
          level: 'danger',
          user: payment.supplier.staff[0],
          userType: 'Supplier',
          key: 'paymentStatus',
          stateParams: null
        };
        notificationCtrl.createNotification('payment', notification, prevStatus, savedPayment.status, null, null);
        res.json(Response.success(savedPayment));
      })
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  }
  if (req.user.type === 'Supplier') {
    const payment = req.payment;
    const prevStatus = payment.status;
    payment.status = 'Rejected';
    payment.updateAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat); // appSettings.momentFormat
    payment.save()
      .then((savedPayment) => {
        if (appSettings.emailSwitch) {
          const content = {
            recipientName: UserService.toTitleCase(payment.customer.representativeName),
            paymentId: payment.paymentId,
            prevStatus,
            currentStatus: savedPayment.status
          };
          EmailHandler.sendEmail(payment.customer.user.email, content, 'PAYMENTSTATUS', payment.customer.user.language);
        }
        const notification = {
          refObjectId: payment,
          level: 'danger',
          user: payment.customer.user,
          userType: 'Customer',
          key: 'paymentStatus',
          stateParams: 'supplier'
        };
        notificationCtrl.createNotification('payment', notification, prevStatus, savedPayment.status, null, payment.supplier._id);
        res.json(Response.success(savedPayment));
      })
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  }
}

/**
 * Gets the admin/supplier's pending transactions.
 */
// TODO: Needs Optimization and Complexity Enhance
function getPayments(req, res) {
  const match = {};
  let idMatch = {};
  if (req.query.status) {
    if (req.query.status.length) {
      req.query.status.forEach((opt) => {
        req.query.status.push(new RegExp(opt, 'i'));
      });
      match.status = { $in: req.query.status };
    }
  }
  if (req.query.isAdminFees) {
    if (req.query.isAdminFees.length) {
      match.isAdminFees = req.query.isAdminFees;
    }
  } else {
    match.isAdminFees = false;
  }
  if (req.query.supplierId) {
    if (req.query.supplierId.length) {
      idMatch = { customer: null, supplier: req.query.supplierId };
    }
  }
  if (req.user.type === 'Admin') {
    // TODO: Performance Complexity Enhancement
    PendingPayment.find({ $and: [match, idMatch] })
      .populate({
        path: 'supplier',
        select: 'representativeName'
      })
      .populate({
        path: 'customer',
        select: '_id representativeName'
      })
      .then((pendingPayments) => {
        let supplierPendingPayments = [];
        pendingPayments.forEach((pendingPaymentsObj) => {
          const supplierPendingPaymentsObj = {
            _id: pendingPaymentsObj._id,
            supplier: pendingPaymentsObj.supplier,
            customer: pendingPaymentsObj.customer,
            amount: pendingPaymentsObj.amount,
            paymentMethod: pendingPaymentsObj.paymentMethod,
            transactionId: pendingPaymentsObj.transactionId,
            accountNumber: pendingPaymentsObj.accountNumber,
            accountName: pendingPaymentsObj.accountName,
            bankName: pendingPaymentsObj.bankName,
            chequeNumber: pendingPaymentsObj.chequeNumber,
            recipientName: pendingPaymentsObj.recipientName,
            status: pendingPaymentsObj.status,
            date: pendingPaymentsObj.createdAt,
            isAdminFees: pendingPaymentsObj.isAdminFees
          };
          supplierPendingPayments.push(supplierPendingPaymentsObj);
        });
        // Calculate count for each payments and transactions to get total count of payments
        PendingPayment.find({ $and: [match, idMatch] }).count()
          .then((paymentsCount) => {
            supplierPendingPayments = supplierPendingPayments
              .sort((a, b) => {
                if (a.updateAt > b.updateAt) {
                  return 1;
                } else if (a.updateAt < b.updateAt) {
                  return -1;
                }
                return 0;
              });
            supplierPendingPayments = supplierPendingPayments
              .slice(Number(req.query.skip),
                ((Number(req.query.limit)
                  + Number(req.query.skip)) > supplierPendingPayments.length ?
                  (supplierPendingPayments.length)
                  : (Number(req.query.limit) + Number(req.query.skip))));
            res.json(Response.success({
              payments: supplierPendingPayments,
              count: paymentsCount
            }));
          });
      })
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  } else if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParamters(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ],
      (err, supplierId) => {
        if (req.query.customerId) {
          if (req.query.customerId.length) {
            idMatch = { customer: req.query.customerId, supplier: supplierId };
          }
        } else {
          idMatch = { supplier: supplierId };
        }
        // TODO: Performance Complexity Enhancement
        PendingPayment.find({ $and: [match, idMatch] })
          .populate({
            path: 'supplier',
            select: 'representativeName'
          })
          .populate({
            path: 'customer',
            select: '_id representativeName'
          })
          .then((pendingPayments) => {
            let supplierPendingPayments = [];
            pendingPayments.forEach((pendingPaymentsObj) => {
              const supplierPendingPaymentsObj = {
                _id: pendingPaymentsObj._id,
                supplier: pendingPaymentsObj.supplier,
                customer: pendingPaymentsObj.customer,
                amount: pendingPaymentsObj.amount,
                paymentMethod: pendingPaymentsObj.paymentMethod,
                transactionId: pendingPaymentsObj.transactionId,
                accountNumber: pendingPaymentsObj.accountNumber,
                accountName: pendingPaymentsObj.accountName,
                bankName: pendingPaymentsObj.bankName,
                chequeNumber: pendingPaymentsObj.chequeNumber,
                recipientName: pendingPaymentsObj.recipientName,
                status: pendingPaymentsObj.status,
                date: pendingPaymentsObj.createdAt,
                isAdminFees: pendingPaymentsObj.isAdminFees
              };
              supplierPendingPayments.push(supplierPendingPaymentsObj);
            });
            PendingPayment.find({ $and: [match, idMatch] }).count()
              .then((paymentsCount) => {
                supplierPendingPayments = supplierPendingPayments
                  .sort((a, b) => {
                    if (a.updateAt > b.updateAt) {
                      return 1;
                    } else if (a.updateAt < b.updateAt) {
                      return -1;
                    }
                    return 0;
                  });
                supplierPendingPayments = supplierPendingPayments
                  .slice(Number(req.query.skip),
                    ((Number(req.query.limit)
                      + Number(req.query.skip)) > supplierPendingPayments.length ?
                      (supplierPendingPayments.length)
                      : (Number(req.query.limit) + Number(req.query.skip))));
                res.json(Response.success({
                  payments: supplierPendingPayments,
                  count: paymentsCount
                }));
              });
          })
          .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
      });
  } else {
    async.waterfall([
      function passParameters(callback) {
        callback(null, req.user._id);
      },
      getCustomerFromUser
    ],
      (err, customerId) => {
        if (req.query.supplierId) {
          if (req.query.supplierId.length) {
            idMatch = { supplier: req.query.supplierId, customer: customerId };
          }
        } else {
          idMatch = { customer: customerId };
        }
        // TODO: Performance Complexity Enhancement
        PendingPayment.find({ $and: [match, idMatch] })
          .populate({
            path: 'supplier',
            select: 'representativeName'
          })
          .populate({
            path: 'customer',
            select: '_id representativeName'
          })
          .then((pendingPayments) => {
            let customerPendingPayments = [];
            pendingPayments.forEach((pendingPaymentsObj) => {
              const customerPendingPaymentsObj = {
                _id: pendingPaymentsObj._id,
                supplier: pendingPaymentsObj.supplier,
                customer: pendingPaymentsObj.customer,
                amount: pendingPaymentsObj.amount,
                paymentMethod: pendingPaymentsObj.paymentMethod,
                transactionId: pendingPaymentsObj.transactionId,
                accountNumber: pendingPaymentsObj.accountNumber,
                accountName: pendingPaymentsObj.accountName,
                bankName: pendingPaymentsObj.bankName,
                chequeNumber: pendingPaymentsObj.chequeNumber,
                recipientName: pendingPaymentsObj.recipientName,
                status: pendingPaymentsObj.status,
                date: pendingPaymentsObj.createdAt,
                isAdminFees: pendingPaymentsObj.isAdminFees
              };
              customerPendingPayments.push(customerPendingPaymentsObj);
            });
            // Calculate count for each payments and transactions to get total count of payments
            PendingPayment.find({ $and: [match, idMatch] }).count()
              .then((paymentsCount) => {
                customerPendingPayments = customerPendingPayments
                  .sort((a, b) => {
                    if (a.updateAt > b.updateAt) {
                      return 1;
                    } else if (a.updateAt < b.updateAt) {
                      return -1;
                    }
                    return 0;
                  });
                customerPendingPayments = customerPendingPayments
                  .slice(Number(req.query.skip),
                    ((Number(req.query.limit)
                      + Number(req.query.skip)) > customerPendingPayments.length ?
                      (customerPendingPayments.length)
                      : (Number(req.query.limit) + Number(req.query.skip))));
                res.json(Response.success({
                  payments: customerPendingPayments,
                  count: paymentsCount
                }));
              });
          })
          .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
      });
  }
}

/**
 * Gets the admin/supplier's pending transactions.
 */
function list(req, res) {
  const match = {};
  let supplierMatch = {};
  let customerMatch = {};
  let idMatch = {};
  if (req.query.status) {
    if (req.query.status.length) {
      req.query.status.forEach((opt) => {
        req.query.status.push(new RegExp(opt, 'i'));
      });
      match.status = { $in: req.query.status };
    }
  }
  if (req.query.isAdminFees) {
    if (req.query.isAdminFees.length) {
      match.isAdminFees = req.query.isAdminFees;
    }
  } else {
    match.isAdminFees = false;
  }
  if (req.query.supplierId) {
    if (req.query.supplierId.length) {
      idMatch = { customer: null, supplier: req.query.supplierId };
    }
  }
  if (req.query.customerId) {
    if (req.query.customerId.length) {
      idMatch = { customer: req.query.customerId };
    }
  }
  if (req.query.supplierName) {
    if (req.query.supplierName.length) {
      // nameMatch.representativeName = new RegExp(`.*${req.query.supplierName.trim()}.*`, 'i');
      const arabic = req.query.supplierName.replace('[^\u0600-\u06FF\\s]+', '').trim();
      supplierMatch = { $or: [{ representativeName: new RegExp(`.*${req.query.supplierName.trim()}.*`, 'i') }, { representativeName: new RegExp(`.*${arabic}.*`, 'i') }] };
    }
  }
  if (req.query.customerName) {
    if (req.query.customerName.length) {
      const arabic = req.query.customerName.replace('[^\u0600-\u06FF\\s]+', '').trim();
      customerMatch = { $or: [{ representativeName: new RegExp(`.*${req.query.customerName.trim()}.*`, 'i') }, { representativeName: new RegExp(`.*${arabic}.*`, 'i') }] };
    }
  }
  if (req.user.type === 'Admin') {
    // TODO: Performance Complexity Enhancement
    PendingPayment.find({ $and: [match, idMatch] })
      .populate({
        path: 'supplier',
        select: 'representativeName',
        match: supplierMatch
      })
      .populate({
        path: 'customer',
        select: '_id representativeName',
        match: customerMatch
      })
      .then((pendingPayments) => {
        const payments = pendingPayments.map(c => c).filter(c => c.supplier !== null && (!c.customer || c.customer === null));
        if (payments.length > 0) {
          PendingPayment.find({ $and: [match, idMatch] })
            .populate({
              path: 'supplier',
              select: 'representativeName'
            })
            .populate({
              path: 'customer',
              select: '_id representativeName'
            })
            .then((pendingPaymentsCount) => {
              const resultPaymentsArr = payments
                .sort((a, b) => {
                  if (a.updateAt > b.updateAt) {
                    return -1;
                  } else if (a.updateAt < b.updateAt) {
                    return 1;
                  }
                  return 0;
                });
              const resultPayments = resultPaymentsArr.slice(Number(req.query.skip),
                (Number(req.query.limit) + Number(req.query.skip)) > resultPaymentsArr.length
                  ? (resultPaymentsArr.length)
                  : (Number(req.query.limit) + Number(req.query.skip)));
              res.json(Response.success({
                payments: resultPayments,
                count: pendingPaymentsCount.length
              }));
            });
        } else {
          res.json(Response.success({
            payments: [],
            count: 0
          }));
        }
      });
  } else if (req.user.type === 'Supplier') {
    // TODO: Performance Complexity Enhancement
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
      } else {
        idMatch.supplier = result;
        PendingPayment.find({ $and: [match, idMatch] })
          .populate({
            path: 'supplier',
            select: 'representativeName'
          })
          .populate({
            path: 'customer',
            select: '_id representativeName',
            match: customerMatch
          })
          .then((pendingPayments) => {
            const payments = pendingPayments.map(c => c).filter(c => c.customer !== null);
            if (payments.length > 0) {
              PendingPayment.find({ $and: [match, idMatch] })
                .populate({
                  path: 'supplier',
                  select: 'representativeName'
                })
                .populate({
                  path: 'customer',
                  select: '_id representativeName'
                })
                .then((pendingPaymentsCount) => {
                  const resultPaymentsArr = payments
                    .sort((a, b) => {
                      if (a.updateAt > b.updateAt) {
                        return -1;
                      } else if (a.updateAt < b.updateAt) {
                        return 1;
                      }
                      return 0;
                    });
                  const resultPayments = resultPaymentsArr.slice(Number(req.query.skip),
                    (Number(req.query.limit) + Number(req.query.skip)) > resultPaymentsArr.length
                      ? (resultPaymentsArr.length)
                      : (Number(req.query.limit) + Number(req.query.skip)));
                  res.json(Response.success({
                    payments: resultPayments,
                    count: pendingPaymentsCount.length
                  }));
                });
            } else {
              res.json(Response.success({
                payments: [],
                count: 0
              }));
            }
          });
      }
    });
  } else {
    // TODO: Performance Complexity Enhancement
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id);
      },
      getCustomerFromUser
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
      } else {
        idMatch.customer = result;
        PendingPayment.find({ $and: [match, idMatch] })
          .populate({
            path: 'supplier',
            select: 'representativeName',
            match: supplierMatch
          })
          .populate({
            path: 'customer',
            select: '_id representativeName'
          })
          .then((pendingPayments) => {
            const payments = pendingPayments.map(c => c).filter(c => c.supplier !== null);
            if (payments.length > 0) {
              PendingPayment.find({ $and: [match, idMatch] })
                .populate({
                  path: 'supplier',
                  select: 'representativeName'
                })
                .populate({
                  path: 'customer',
                  select: '_id representativeName'
                })
                .then((pendingPaymentsCount) => {
                  const resultPaymentsArr = payments
                    .sort((a, b) => {
                      if (a.updateAt > b.updateAt) {
                        return -1;
                      } else if (a.updateAt < b.updateAt) {
                        return 1;
                      }
                      return 0;
                    });
                  const resultPayments = resultPaymentsArr.slice(Number(req.query.skip),
                    (Number(req.query.limit) + Number(req.query.skip)) > resultPaymentsArr.length
                      ? (resultPaymentsArr.length)
                      : (Number(req.query.limit) + Number(req.query.skip)));
                  res.json(Response.success({
                    payments: resultPayments,
                    count: pendingPaymentsCount.length
                  }));
                });
            } else {
              res.json(Response.success({
                payments: [],
                count: 0
              }));
            }
          });
      }
    });
  }
}

/**
 * Get payment by Id.
 */
function get(req, res) {
  if (req.user.type === 'Admin') {
    PendingPayment.findById(req.payment._id)
      .populate({
        path: 'supplier',
        select: '_id representativeName'
      })
      .then((payment) => {
        res.json(Response.success(payment));
      })
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  } else if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        PendingPayment.findById({ _id: req.payment._id, supplier: result })
          .populate({
            path: 'customer',
            select: '_id representativeName'
          })
          .then((payment) => {
            if (payment) {
              res.json(Response.success(payment));
            } else {
              res.status(httpStatus.NOT_FOUND).json(Response.failure(4));
            }
          })
          .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
      }
    });
  } else {
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id);
      },
      getCustomerFromUser
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        PendingPayment.findById({
          $and: [{ _id: req.payment._id },
            { customer: result }, { isAdminFees: false }]
        })
          .populate({
            path: 'supplier',
            select: '_id representativeName'
          })
          .then((payment) => {
            if (payment) {
              res.json(Response.success(payment));
            } else {
              res.status(httpStatus.NOT_FOUND).json(Response.failure(4));
            }
          })
          .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
      }
    });
  }
}

/**
 * Get payments count.
 */
function getPaymentsCount(req, res) {
  if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParamters(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ],
      (err, result) => {
        PendingPayment.aggregate([
          {
            $match: {
              supplier: result
            }
          },
          {
            $group: {
              _id: '$status',
              status: { $push: '$status' },
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              status: 1,
              count: 1
            }
          }
        ], (error, payments) => {
          const resultObject = {
            count: 0,
            rejected: 0
          };

          if (payments) {
            payments.forEach((resultObj) => {
              switch (resultObj.status[0]) {
                case 'Pending':
                  resultObject.count = resultObj.count;
                  break;
                case 'Rejected':
                  resultObject.rejected = resultObj.count;
                  break;
                default:
                  break;
              }
            });
          }

          if (err) {
            res.json(err);
          }
          res.json(Response.success(resultObject));
        });
      }
    );
  }
  if (req.user.type === 'Admin') {
    PendingPayment.aggregate([
      {
        $match: {
          isAdminFees: true
        }
      },
      {
        $group: {
          _id: '$status',
          status: { $push: '$status' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          status: 1,
          count: 1
        }
      }
    ], (error, payments) => {
      const resultObject = {
        count: 0,
        rejected: 0
      };

      if (payments) {
        payments.forEach((resultObj) => {
          switch (resultObj.status[0]) {
            case 'Pending':
              resultObject.count = resultObj.count;
              break;
            case 'Rejected':
              resultObject.rejected = resultObj.count;
              break;
            default:
              break;
          }
        });
      }

      if (error) {
        res.json(error);
      }
      console.log(resultObject);
      // res.json(Response.success(resultObject));
    });
  }
}

/**
 * Load transaction and append to req.
 */
function load(req, res, next, id) {
  PendingPayment.findById(id)
    .populate({
      path: 'supplier',
      select: '_id representativeName staff adminFees installment reservedBalance',
      populate: {
        path: 'staff',
        select: '_id language email'
      }
    })
    .populate({
      path: 'customer',
      select: '_id representativeName user',
      populate: {
        path: 'user',
        select: '_id language email'
      }
    })
    .then((payment) => {
      if (payment) {
        req.payment = payment;
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/* Helper Functions */

/**
 * Helper Function
 * Get supplier using the user.
 * @property {string} userId - The id of the supplier user.
 * @returns {Supplier}
 */
function getSupplierFromUser(userId, callback) {
  Supplier.findOne()
    .where('staff').in([userId])
    .exec((err, supplier) => callback(null, supplier._id));
}

function getCustomerFromUser(userId, callback) {
  Customer.findOne({ user: userId })
    .populate('user')
    .then((customer) => {
      if (customer.type === 'Staff') {
        return Customer.findOne({ _id: customer.customer }).populate('user');
      }
      return customer;
    }).then((customer) => {
      callback(null, customer);
    }).catch(err => callback(err, null));
}

/**
 * Helper Function
 * Create a credit transaction with the order.
 * @params {string} supplierId - The id of the supplier.
 * @params {string} customerEmail - The email of the customer user.
 */
function createCreditTransaction(supplierId, customerId, price,
                                 transactionId, accountNumber, accountName, bankName,
                                 paymentMethod, date, recipientName, chequeNumber, callback) {
  Transaction.findOne()
    .sort({ createdAt: -1 })
    .then((transObj) => {
      let nextTransId = '';
      if (customerId === null) {
        if (transObj) {
          nextTransId = Number(transObj.transId.slice(6)) + 1;
        } else {
          nextTransId = appSettings.transactionSUPIdInit;
        }
      } else if (transObj) {
        nextTransId = Number(transObj.transId.slice(6)) + 1;
      } else {
        nextTransId = appSettings.transactionSUPCUSTIdInit;
      }
      if (customerId === null) {
        Transaction.findOne({ $and: [{ supplier: supplierId }, { customer: null }] })
          .sort({ transId: -1 })
          .then((trans) => {
            let transaction = '';
            if (trans) {
              transaction = new Transaction({
                transId: '',
                supplier: supplierId,
                amount: price,
                status: 'Approved',
                type: 'credit',
                transactionId,
                accountNumber,
                accountName,
                bankName,
                recipientName: recipientName || appSettings.systemTitle,
                chequeNumber,
                paymentMethod,
                open: trans.close,
                close: trans.close + price,
                date: moment(date).tz(appSettings.timeZone).format(appSettings.momentFormat),
                isAdminFees: true,
                createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
              });
              transaction.save()
                .then((savedTransaction) => {
                  Transaction.findOne({ _id: savedTransaction._id })
                    .then((newTransaction) => {
                      newTransaction.transId = `${appSettings.transactionPrefix}${nextTransId}`;
                      newTransaction.save();
                    });
                  callback(null, savedTransaction);
                })
                .catch(e => callback(e, null));
              Transaction.find({ $and: [{ supplier: supplierId }, { customer: null }, { type: 'debit' }, { isPaid: false }] })
                .then((debitTransactions) => {
                  if (debitTransactions) {
                    let balance = price + supplierId.installment;
                    debitTransactions.forEach((debitTransactionsObject) => {
                      if ((debitTransactionsObject.amount + (debitTransactionsObject.amount * appSettings.VATPercent)) <= balance) {
                        debitTransactionsObject.isPaid = true;
                        debitTransactionsObject.save().catch(e => callback(e, null));
                        balance -= debitTransactionsObject.amount;
                      }
                    });
                    if (balance === 0) {
                      supplierId.installment = balance;
                    } else {
                      supplierId.installment += balance;
                    }
                    supplierId.save();
                  }
                });
            } else {
              transaction = new Transaction({
                transId: '',
                supplier: supplierId,
                amount: price,
                status: 'Approved',
                type: 'credit',
                transactionId,
                accountNumber,
                accountName,
                bankName,
                recipientName: recipientName || appSettings.systemTitle,
                chequeNumber,
                paymentMethod,
                open: 0,
                close: price,
                date: moment(date).tz(appSettings.timeZone).format(appSettings.momentFormat),
                isAdminFees: true,
                createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
              });
              transaction.save()
                .then((savedTransaction) => {
                  Transaction.findOne({ _id: savedTransaction._id })
                    .then((newTransaction) => {
                      newTransaction.transId = `${appSettings.transactionPrefix}${nextTransId}`;
                      newTransaction.save();
                    });
                  callback(null, savedTransaction);
                })
                .catch(e => callback(e, null));
            }
          });
      } else {
        Transaction.findOne({ supplier: supplierId, customer: customerId })
          .sort({ transId: -1 })
          .then((trans) => {
            let transaction = '';
            if (trans) {
              transaction = new Transaction({
                transId: '',
                supplier: supplierId,
                customer: customerId,
                amount: price,
                status: 'Approved',
                type: 'credit',
                transactionId,
                accountNumber,
                accountName,
                bankName,
                recipientName: recipientName || supplierId.representativeName,
                chequeNumber,
                paymentMethod,
                open: trans.close,
                close: trans.close + price,
                date: moment(date).tz(appSettings.timeZone).format(appSettings.momentFormat),
                isAdminFees: false,
                createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
              });
              transaction.save()
                .then((savedTransaction) => {
                  Transaction.findOne({ _id: savedTransaction._id })
                    .then((newTransaction) => {
                      newTransaction.transId = `${appSettings.transactionPrefix}${nextTransId}`;
                      newTransaction.save();
                    });
                  callback(null, savedTransaction);
                })
                .catch(e => callback(e, null));
              Transaction.find({
                $and: [{
                  supplier: supplierId,
                  customer: customerId
                }, { type: 'debit' }, { isPaid: false }]
              })
                .then((debitTransactions) => {
                  if (debitTransactions) {
                    CustomerInvite.findOne({
                      customerEmail: customerId.user.email,
                      supplier: supplierId
                    })
                      .then((customerInvite) => {
                        let balance = price + customerInvite.installment;
                        debitTransactions.forEach((debitTransactionsObject) => {
                          if (debitTransactionsObject.amount <= balance) {
                            debitTransactionsObject.isPaid = true;
                            debitTransactionsObject.save().catch(e => callback(e, null));
                            balance -= debitTransactionsObject.amount;
                          }
                        });
                        if (balance === 0) {
                          customerInvite.installment = balance;
                        } else {
                          customerInvite.installment += balance;
                        }
                        customerInvite.save();
                      });
                  }
                });
            } else {
              transaction = new Transaction({
                transId: '',
                supplier: supplierId,
                customer: customerId,
                amount: price,
                status: 'Approved',
                type: 'credit',
                transactionId,
                accountNumber,
                accountName,
                bankName,
                recipientName: recipientName || supplierId.representativeName,
                chequeNumber,
                paymentMethod,
                open: 0,
                close: price,
                date: moment(date).tz(appSettings.timeZone).format(appSettings.momentFormat),
                isAdminFees: false,
                createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
              });
              transaction.save()
                .then((savedTransaction) => {
                  Transaction.findOne({ _id: savedTransaction._id })
                    .then((newTransaction) => {
                      newTransaction.transId = `${appSettings.transactionPrefix}${nextTransId}`;
                      newTransaction.save();
                    });
                  callback(null, savedTransaction);
                })
                .catch(e => callback(e, null));
            }
          });
      }
    });
}

export default {
  load,
  list,
  acceptPayment,
  rejectPayment,
  getPayments,
  get,
  getPaymentsCount
};
