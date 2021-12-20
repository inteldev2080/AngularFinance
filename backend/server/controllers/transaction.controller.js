import httpStatus from 'http-status';
import async from 'async';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
import Customer from '../models/customer.model';
import User from '../models/user.model';
import Supplier from '../models/supplier.model';
import Transaction from '../models/transaction.model';
import PendingPayment from '../models/pendingPayment.model';
import Response from '../services/response.service';
import UserService from '../services/user.service';
import EmailHandler from '../../config/emailHandler';
import ExportService from '../controllers/exportFileService';
import notificationCtrl from './notification.controller';
import CustomerInvite from '../models/customerInvite.model';

// const moment = require('moment-timezone');

function get(req, res) {
  const transaction = req.transaction;
  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id);
    },
    getSupplierFromUser
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
    } else if (transaction.supplier._id.toString() === result.toString()) {
      if (req.query.export) {
        if (req.user.language === 'en') {
          ExportService.exportReceiptFile('report_template/main_header/english_header.html',
            'report_template/receipt/receipt-body-english.html', transaction,
            'Receipt', `${moment().tz(appSettings.timeZone).format('DD-MM-YYYY')}`, 'pdf', res);
          // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
        } else {
          ExportService.exportReceiptFile('report_template/main_header/arabic_header.html',
            'report_template/receipt/receipt-body-arabic.html', transaction,
            'وصل دفع', `${moment().tz(appSettings.timeZone).format('DD-MM-YYYY')}`, 'pdf', res);
          // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
        }
      } else {
        res.json(Response.success(transaction));
      }
    } else {
      res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
    }
  });
}

/**
 * Gets the admin/supplier's - supplier/customer's transactions.
 */
function list(req, res) {
  const startDate = new Date(req.query.startDate.toString());
  const endDate = new Date(req.query.endDate.toString());
  endDate.setDate(endDate.getDate() + 1);
  const match = {};
  if (typeof req.query.customerId !== 'undefined') {
    match.customer = req.query.customerId;
  }
  if (typeof req.query.supplierId !== 'undefined') {
    match.supplier = req.query.supplierId;
  }
  match.isAdminFees = req.query.isAdminFees;
  if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.NOT_FOUND).json(Response.failure(err));
      } else {
        Transaction.find({
          $and: [match, { supplier: result }, {
            createdAt: {
              $gte: startDate,
              $lte: endDate
            }
          }]
        })
          .populate({
            path: 'invoice',
            select: '_id invoiceId isPaid',
          })
          .populate({
            path: 'supplier',
            select: '_id representativeName staff coverPhoto location adminFees VATRegisterNumber',
            populate: {
              path: 'staff',
              select: '_id email mobileNumber firstName lastName'
            }
          })
          .populate({
            path: 'customer',
            select: '_id representativeName user coverPhoto location branch',
            populate: {
              path: 'user branch',
              select: '_id email mobileNumber firstName lastName branchName'
            }
          })
          .populate({
            path: 'order',
            select: '_id orderId createdAt customer supplier price VAT',
            populate: {
              path: 'customer supplier',
              select: '_id representativeName _id representativeName'
            }
          })
          .sort({
            createdAt: -1
          })
          .then((transactionsArr) => {
            let orderObject = null;
            if (transactionsArr.length > 0) {
              const firstTransaction = transactionsArr[0];
              firstTransaction.order.supplier = firstTransaction.supplier;
              firstTransaction.order.customer = firstTransaction.customer;
              orderObject = firstTransaction.order;
              if (req.query.export) {
                if (req.query.customerId) {
                  if (req.user.language === 'en') {
                    ExportService.exportFile('report_template/main_header/english_header.html',
                      `report_template/transactions/${req.query.export}-transaction-body-english.html`, {
                        order: orderObject,
                        transactionsArr
                      },
                      'Transactions', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                    // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                  } else {
                    ExportService.exportFile('report_template/main_header/arabic_header.html',
                      `report_template/transactions/${req.query.export}-transaction-body-arabic.html`, {
                        order: orderObject,
                        transactionsArr
                      },
                      'المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                    // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                  }
                } else if (req.user.language === 'en') {
                  ExportService.exportFile(`report_template/transactions/${req.query.export}-transaction-header-english.html`,
                    `report_template/transactions/${req.query.export}-transaction-body-english.html`, {
                      order: null,
                      transactionsArr
                    },
                    'Transactions', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                  // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                } else {
                  ExportService.exportFile(`report_template/transactions/${req.query.export}-transaction-header-arabic.html`,
                    `report_template/transactions/${req.query.export}-transaction-body-arabic.html`, {
                      order: null,
                      transactionsArr
                    },
                    'المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                  // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                }
              } else {
                const transactions = transactionsArr.slice(Number(req.query.skip),
                  (Number(req.query.limit) + Number(req.query.skip)) > transactionsArr.length
                    ? (transactionsArr.length)
                    : (Number(req.query.limit) + Number(req.query.skip)));
                const resultObject = {
                  transactions,
                  count: transactionsArr.length
                };
                res.json(Response.success(resultObject));
              }
            } else if (req.query.export) {
              if (req.query.customerId) {
                if (req.user.language === 'en') {
                  ExportService.exportFile('report_template/main_header/english_header.html',
                    `report_template/transactions/${req.query.export}-transaction-body-english.html`, {
                      order: null,
                      transactionsArr
                    },
                    'Transactions', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                  // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                } else {
                  ExportService.exportFile('report_template/main_header/arabic_header.html',
                    `report_template/transactions/${req.query.export}-transaction-body-arabic.html`, {
                      order: null,
                      transactionsArr
                    },
                    'المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                  // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                }
              } else if (req.user.language === 'en') {
                ExportService.exportFile(`report_template/transactions/${req.query.export}-transaction-header-english.html`,
                  `report_template/transactions/${req.query.export}-transaction-body-english.html`, {
                    order: null,
                    transactionsArr
                  },
                  'Transactions', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
              } else {
                ExportService.exportFile(`report_template/transactions/${req.query.export}-transaction-header-arabic.html`,
                  `report_template/transactions/${req.query.export}-transaction-body-arabic.html`, {
                    order: null,
                    transactionsArr
                  },
                  'المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
              }
            } else {
              const resultObject = {
                transactions: [],
                count: transactionsArr.length
              };
              res.json(Response.success(resultObject));
            }
          });
      }
    });
  } else if (req.user.type === 'Customer') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id, null);
      },
      getCustomerFromUser
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.NOT_FOUND).json(Response.failure(err));
      } else {
        Transaction.find({
          $and: [match, { customer: result }, {
            createdAt: {
              $gte: startDate,
              $lte: endDate
            }
          }]
        }).populate({
          path: 'invoice',
          select: '_id invoiceId isPaid',
        })
          .populate({
            path: 'supplier',
            select: '_id representativeName staff coverPhoto location adminFees VATRegisterNumber',
            populate: {
              path: 'staff',
              select: '_id email mobileNumber firstName lastName'
            }
          })
          .populate({
            path: 'customer',
            select: '_id representativeName user coverPhoto location branch',
            populate: {
              path: 'user branch',
              select: '_id email mobileNumber firstName lastName branchName'
            }
          })
          .populate({
            path: 'order',
            select: '_id orderId createdAt customer supplier price VAT',
            populate: {
              path: 'customer supplier',
              select: '_id representativeName _id representativeName'
            }
          })
          .sort({
            createdAt: -1
          })
          .then((transactionsArr) => {
            let orderObject = null;
            if (transactionsArr.length > 0) {
              const firstTransaction = transactionsArr[0];
              firstTransaction.order.supplier = firstTransaction.supplier;
              firstTransaction.order.customer = firstTransaction.customer;
              orderObject = firstTransaction.order;

              if (req.query.export) {
                if (req.query.supplierId) {
                  if (req.user.language === 'en') {
                    ExportService.exportFile('report_template/main_header/english_header.html',
                      `report_template/transactions/${req.query.export}-transaction-body-english.html`, {
                        order: orderObject,
                        transactionsArr
                      },
                      'Transactions', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                    // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                  } else {
                    ExportService.exportFile('report_template/main_header/arabic_header.html',
                      `report_template/transactions/${req.query.export}-transaction-body-arabic.html`, {
                        order: orderObject,
                        transactionsArr
                      },
                      'المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                    // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                  }
                } else if (req.user.language === 'en') {
                  ExportService.exportFile(`report_template/transactions/${req.query.export}-transaction-header-english.html`,
                    `report_template/transactions/${req.query.export}-transaction-body-english.html`, {
                      order: null,
                      transactionsArr
                    },
                    'Transactions', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                  // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                } else {
                  ExportService.exportFile(`report_template/transactions/${req.query.export}-transaction-header-arabic.html`,
                    `report_template/transactions/${req.query.export}-transaction-body-english.html`, {
                      order: null,
                      transactionsArr
                    },
                    'Transactions', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                  // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                }
              } else {
                const transactions = transactionsArr.slice(Number(req.query.skip),
                  (Number(req.query.limit) + Number(req.query.skip)) > transactionsArr.length
                    ? (transactionsArr.length)
                    : (Number(req.query.limit) + Number(req.query.skip)));
                const resultObject = {
                  transactions,
                  count: transactionsArr.length
                };
                res.json(Response.success(resultObject));
              }
            } else if (req.query.export) {
              if (req.query.supplierId) {
                if (req.user.language === 'en') {
                  ExportService.exportFile('report_template/main_header/english_header.html',
                    `report_template/transactions/${req.query.export}-transaction-body-english.html`, {
                      order: null,
                      transactionsArr
                    },
                    'Transactions', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                  // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                } else {
                  ExportService.exportFile('report_template/main_header/arabic_header.html',
                    `report_template/transactions/${req.query.export}-transaction-body-arabic.html`, {
                      order: null,
                      transactionsArr
                    },
                    'المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                  // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                }
              } else if (req.user.language === 'en') {
                ExportService.exportFile(`report_template/transactions/${req.query.export}-transaction-header-english.html`,
                    `report_template/transactions/${req.query.export}-transaction-body-english.html`, {
                      order: null,
                      transactionsArr
                    },
                    'Transactions', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                  // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
              } else {
                ExportService.exportFile(`report_template/transactions/${req.query.export}-transaction-header-arabic.html`,
                    `report_template/transactions/${req.query.export}-transaction-body-english.html`, {
                      order: null,
                      transactionsArr
                    },
                    'Transactions', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
                  // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
              }
            } else {
              const resultObject = {
                transactions: [],
                count: transactionsArr.length
              };
              res.json(Response.success(resultObject));
            }
          });
      }
    });
  } else {
    Transaction.find({ $and: [match, { createdAt: { $gte: startDate, $lte: endDate } }] })
      .populate({
        path: 'invoice',
        select: '_id invoiceId isPaid',
      })
      .populate({
        path: 'supplier',
        select: '_id representativeName'
      })
      .populate({
        path: 'customer',
        select: '_id representativeName'
      })
      .populate({
        path: 'order',
        select: '_id orderId createdAt customer supplier price VAT',
        populate: {
          path: 'customer supplier',
          select: '_id representativeName _id representativeName'
        }
      })
      .sort({
        createdAt: -1
      })
      .then((transactionsArr) => {
        if (transactionsArr.length > 0) {
          if (req.query.export) {
            if (req.user.language === 'en') {
              ExportService.exportFile(`report_template/transactions/${req.query.export}-transaction-header-english.html`,
                `report_template/transactions/${req.query.export}-transaction-body-english.html`, {
                  order: null,
                  transactionsArr
                },
                'Transactions', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
              // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
            } else {
              ExportService.exportFile(`report_template/transactions/${req.query.export}-transaction-header-arabic.html`,
                `report_template/transactions/${req.query.export}-transaction-body-arabic.html`, {
                  order: null,
                  transactionsArr
                },
                'المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
              // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
            }
          } else {
            const transactions = transactionsArr.slice(Number(req.query.skip),
              (Number(req.query.limit) + Number(req.query.skip)) > transactionsArr.length
                ? (transactionsArr.length)
                : (Number(req.query.limit) + Number(req.query.skip)));
            const resultObject = {
              transactions,
              count: transactionsArr.length
            };
            res.json(Response.success(resultObject));
          }
        } else if (req.query.export) {
          if (req.user.language === 'en') {
            ExportService.exportFile(`report_template/transactions/${req.query.export}-transaction-header-english.html`,
              `report_template/transactions/${req.query.export}-transaction-body-english.html`, {
                order: null,
                transactionsArr
              },
              'Transactions', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
            // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
          } else {
            ExportService.exportFile(`report_template/transactions/${req.query.export}-transaction-header-arabic.html`,
              `report_template/transactions/${req.query.export}-transaction-body-arabic.html`, {
                order: null,
                transactionsArr
              },
              'المعاملات النقدية', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
            // // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
          }
        } else {
          const resultObject = {
            transactions: [],
            count: transactionsArr.length
          };
          res.json(Response.success(resultObject));
        }
      });
  }
}

/**
 * Customer/Supplier declares payment to supplier/admin.
 * @param {Number} req.body.amount - The amount paid.
 * @param {ObjectId} req.body.supplierId - The supplier a customer has paid.
 * @returns {Transaction}
 */
function declarePayment(req, res) {
  // Check whether the user is a supplier or a customer to create their transactions.
  if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParamters(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ],
      (err, supplierId, supplier) => {
        let payment = '';
        PendingPayment.findOne()
          .sort({ paymentId: -1 })
          .then((paymentObj) => {
            let nextPaymentId = '';
            if (paymentObj) {
              nextPaymentId = Number(paymentObj.paymentId.slice(6)) + 1;
            } else {
              nextPaymentId = appSettings.paymentIdInit;
            }
            payment = new PendingPayment({
              paymentId: '',
              supplier: supplierId,
              amount: Number(req.body.amount),
              status: 'Pending',
              transactionId: req.body.transactionId,
              accountNumber: req.body.accountNumber,
              accountName: req.body.accountName,
              bankName: req.body.bankName,
              recipientName: req.body.recipientName,
              chequeNumber: req.body.chequeNumber,
              paymentMethod: req.body.paymentMethod,
              date: moment(req.body.date).tz(appSettings.timeZone).format(appSettings.momentFormat),
              isAdminFees: true,
              createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
              updateAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
            });
            payment.save()
              .then((savedPayment) => {
                PendingPayment.findOne({ _id: savedPayment._id })
                  .then((newPayment) => {
                    newPayment.paymentId = `${appSettings.paymentPrefix}${nextPaymentId}`;
                    newPayment.save();
                  });
                if (appSettings.emailSwitch) {
                  const content = {
                    recipientName: 'SuppliesOn',
                    paymentId: `${appSettings.paymentPrefix}${nextPaymentId}`,
                    userName: supplier.representativeName
                  };
                  EmailHandler.sendEmail(appSettings.suppliesOnEmail, content, 'DECLAREPAYMENT', 'en');
                }
                User.findOne({ email: appSettings.superAdmin })
                  .then((user) => {
                    const notification = {
                      refObjectId: savedPayment,
                      level: 'success',
                      user,
                      userType: 'Admin',
                      key: 'newPaymentsClaim',
                      stateParams: null
                    };
                    notificationCtrl.createNotification('payment', notification, null, null, null, null);
                  });
                res.json(Response.success(savedPayment));
              })
              .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
          });
      });
  } else if (req.user.type === 'Customer') {
    async.waterfall([
      function passParamters(callback) {
        callback(null, req.user._id, req.body.supplierId);
      },
      getCustomerFromUser
    ],
      (err, customerId, supplierId, customer) => {
        let payment = '';
        PendingPayment.findOne()
          .sort({ paymentId: -1 })
          .then((paymentObj) => {
            let nextPaymentId = '';
            if (paymentObj) {
              nextPaymentId = Number(paymentObj.paymentId.slice(6)) + 1;
            } else {
              nextPaymentId = appSettings.paymentIdInit;
            }
            payment = new PendingPayment({
              paymentId: '',
              supplier: supplierId,
              customer: customerId,
              amount: Number(req.body.amount),
              status: 'Pending',
              transactionId: req.body.transactionId,
              accountNumber: req.body.accountNumber,
              accountName: req.body.accountName,
              bankName: req.body.bankName,
              recipientName: req.body.recipientName,
              chequeNumber: req.body.chequeNumber,
              paymentMethod: req.body.paymentMethod,
              date: moment(req.body.date).tz(appSettings.timeZone).format(appSettings.momentFormat),
              createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
              updateAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
            });
            payment.save()
              .then((savedPayment) => {
                PendingPayment.findOne({ _id: savedPayment._id })
                  .then((newPayment) => {
                    newPayment.paymentId = `${appSettings.paymentPrefix}${nextPaymentId}`;
                    newPayment.save();
                  });
                Supplier.findById(supplierId)
                  .populate('staff')
                  .then((userSupplier) => {
                    if (appSettings.emailSwitch) {
                      const content = {
                        recipientName: UserService.toTitleCase(userSupplier.representativeName),
                        paymentId: savedPayment.paymentId,
                        userName: customer.representativeName
                      };
                      EmailHandler.sendEmail(userSupplier.staff[0].email, content, 'DECLAREPAYMENT', userSupplier.staff[0].language);
                    }
                    const notification = {
                      refObjectId: savedPayment,
                      level: 'success',
                      user: userSupplier.staff[0],
                      userType: 'Supplier',
                      key: 'newPaymentsClaim',
                      stateParams: 'customer'
                    };
                    notificationCtrl.createNotification('payment', notification, null, null, null, customerId);
                  });
                res.json(Response.success(savedPayment));
              })
              .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
          });
      });
  }
}

/**
 * Admin/Supplier adds the payment of a supplier/customer.
 * @param {Number} req.body.amount - The amount paid.
 * @param {ObjectId} req.body.supplierId - The ID of the supplier.
 * @param {ObjectId} req.body.customerId - The ID of the customer.
 * @returns {Transaction}
 */
function addPayment(req, res) {
  // Check whether the user is an admin or a supplier to create their transactions.
  if (req.user.type === 'Admin') {
    async.waterfall([
      function passParameter(callback) {
        Supplier.findOne({ _id: req.body.supplierId })
            .then((supplier) => {
              callback(null, supplier, null, Number(req.body.amount),
                req.body.transactionId, req.body.accountNumber,
                req.body.accountName, req.body.bankName, req.body.paymentMethod,
                req.body.recipientName, req.body.chequeNumber, req.body.date);
            });
      },
      createCreditTransaction
    ],
      (err, result) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else {
          PendingPayment.findOne()
            .sort({ paymentId: -1 })
            .then((paymentObj) => {
              let nextPaymentId = '';
              if (paymentObj) {
                nextPaymentId = Number(paymentObj.paymentId.slice(6)) + 1;
              } else {
                nextPaymentId = appSettings.paymentIdInit;
              }
              const payment = new PendingPayment({
                supplier: result.supplier,
                amount: result.amount,
                status: result.status,
                transactionId: result.transactionId,
                accountNumber: result.accountNumber,
                accountName: result.accountName,
                bankName: result.bankName,
                chequeNumber: result.chequeNumber,
                paymentMethod: result.paymentMethod,
                recipientName: result.recipientName,
                isAdminFees: result.isAdminFees,
                createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
                updateAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
              });
              payment.save()
                .then((savedPayment) => {
                  PendingPayment.findOne({ _id: savedPayment._id })
                    .then((newPayment) => {
                      newPayment.paymentId = `${appSettings.paymentPrefix}${nextPaymentId}`;
                      newPayment.save();
                    });
                });
            });
          if (appSettings.emailSwitch) {
            const content = {
              recipientName: 'SuppliesOn',
              amount: result.amount
            };
            EmailHandler.sendEmail(appSettings.suppliesOnEmail, content, 'ADDPAYMENT', 'en');
          }
          res.json(Response.success(result));
        }
      });
  } else if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ],
      (err, supplierId, supplier) => {
        async.waterfall([
          function passParameter(callback) {
            Customer.findOne({ _id: req.body.customerId })
                .populate('user')
                .then((customer) => {
                  callback(null, supplier, customer, Number(req.body.amount),
                    req.body.transactionId, req.body.accountNumber,
                    req.body.accountName, req.body.bankName, req.body.paymentMethod,
                    req.body.recipientName, req.body.chequeNumber, req.body.date);
                });
          },
          createCreditTransaction
        ],
          (error, result) => {
            if (error) {
              res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
            } else {
              PendingPayment.findOne()
                .sort({ paymentId: -1 })
                .then((paymentObj) => {
                  let nextPaymentId = '';
                  if (paymentObj) {
                    nextPaymentId = Number(paymentObj.paymentId.slice(6)) + 1;
                  } else {
                    nextPaymentId = appSettings.paymentIdInit;
                  }
                  const payment = new PendingPayment({
                    supplier: result.supplier,
                    customer: result.customer,
                    amount: result.amount,
                    status: result.status,
                    transactionId: result.transactionId,
                    accountNumber: result.accountNumber,
                    accountName: result.accountName,
                    bankName: result.bankName,
                    chequeNumber: result.chequeNumber,
                    paymentMethod: result.paymentMethod,
                    recipientName: result.recipientName,
                    isAdminFees: result.isAdminFees,
                    createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
                    updateAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
                  });
                  payment.save()
                    .then((savedPayment) => {
                      PendingPayment.findOne({ _id: savedPayment._id })
                        .then((newPayment) => {
                          newPayment.paymentId = `${appSettings.paymentPrefix}${nextPaymentId}`;
                          newPayment.save();
                        });
                    });
                });
              Customer.findById(req.body.customerId)
                .populate('user')
                .then((customer) => {
                  if (appSettings.emailSwitch) {
                    const content = {
                      recipientName: UserService.toTitleCase(customer.representativeName),
                      amount: result.amount
                    };
                    EmailHandler.sendEmail(customer.user.email, content, 'ADDPAYMENT', customer.user.language);
                  }
                });
              res.json(Response.success(result));
            }
          });
      });
  }
}

/* Helper Functions */


/**
 * Load transaction and append to req.
 */
function load(req, res, next, id) {
  Transaction.findById(id)
    .populate({
      path: 'supplier',
      select: '_id representativeName'
    })
    .populate({
      path: 'customer',
      select: '_id representativeName'
    })
    .then((transaction) => {
      if (transaction) {
        req.transaction = transaction;
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Helper Function
 * Get supplier using the user.
 * @property {string} userId - The id of the supplier user.
 * @returns {Supplier}
 */
function getSupplierFromUser(userId, callback) {
  Supplier.findOne()
    .where('staff').in([userId])
    .exec((err, supplier) => callback(null, supplier._id, supplier));
}

/**
 * Helper Function
 * Get customer using the user.
 * @property {string} userId - The id of the customer user.
 * @returns {Supplier}
 */
function getCustomerFromUser(userId, supplierId, callback) {
  Customer.findOne({ user: userId })
    .populate('user')
    .then((customer) => {
      if (customer.type === 'Staff') {
        return Customer.findOne({ user: userId })
          .populate('user');
      }
      return customer;
    }).then((customer) => {
      callback(null, customer._id, supplierId, customer);
    });
}

/**
 * Helper Function
 * Get Customer's user details.
 * @property {string} customerId - The id of the customer.
 * @returns {User}
 */
function getUserFromCustomer(supplierId, customerId, price, callback) {
  Customer.findOne({ _id: customerId })
    .then((customer) => {
      User.findOne()
        .where('_id').equals(customer.user)
        .exec((err, user) => callback(err, supplierId, customerId, price, user));
    });
}

/**
 * Helper Function
 * Create a credit transaction with the order.
 * @params {string} supplierId - The id of the supplier.
 * @params {string} customerEmail - The email of the customer user.
 */
function createCreditTransaction(supplier, customer, price,
                                 transactionId, accountNumber, accountName, bankName,
                                 paymentMethod, recipientName, chequeNumber, date, callback) {
  Transaction.findOne()
    .sort({ transId: -1 })
    .then((transObj) => {
      let nextTransId = '';
      if (customer === null) {
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
      if (customer === null) {
        Transaction.findOne({ supplier, customer: null })
          .sort({ transId: -1 })
          .then((trans) => {
            let transaction = '';
            if (trans) {
              transaction = new Transaction({
                transId: '',
                supplier: supplier._id,
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
              Transaction.find({ $and: [{ supplier }, { customer: null }, { type: 'debit' }, { isPaid: false }] })
                .then((debitTransactions) => {
                  if (debitTransactions) {
                    let balance = price + supplier.installment;
                    debitTransactions.forEach((debitTransactionsObject) => {
                      if ((debitTransactionsObject.amount + (debitTransactionsObject.amount * appSettings.VATPercent)) <= balance) {
                        debitTransactionsObject.isPaid = true;
                        debitTransactionsObject.save().catch(e => callback(e, null));
                        balance -= debitTransactionsObject.amount;
                      }
                    });
                    if (balance === 0) {
                      supplier.installment = balance;
                    } else {
                      supplier.installment += balance;
                    }
                    supplier.save();
                  }
                });
            } else {
              transaction = new Transaction({
                transId: '',
                supplier: supplier._id,
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
        Transaction.findOne({ supplier, customer })
          .sort({ transId: -1 })
          .then((trans) => {
            let transaction = '';
            if (trans) {
              transaction = new Transaction({
                transId: '',
                supplier: supplier._id,
                customer: customer._id,
                amount: price,
                status: 'Approved',
                type: 'credit',
                transactionId,
                accountNumber,
                accountName,
                bankName,
                recipientName: recipientName || supplier.representativeName,
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
                  supplier,
                  customer
                }, { type: 'debit' }, { isPaid: false }]
              })
                .then((debitTransactions) => {
                  if (debitTransactions) {
                    CustomerInvite.findOne({ customerEmail: customer.user.email, supplier })
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
                supplier: supplier._id,
                customer: customer._id,
                amount: price,
                status: 'Approved',
                type: 'credit',
                transactionId,
                accountNumber,
                accountName,
                bankName,
                recipientName: recipientName || supplier.representativeName,
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
  get,
  list,
  declarePayment,
  addPayment
};
