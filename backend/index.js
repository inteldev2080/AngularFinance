import mongoose from 'mongoose';
import util from 'util';
// import XLSX from 'xlsx';
// import fs from 'fs';
import cron from 'node-cron';
// import moment from 'moment';

// config should be imported before importing any other file
import config from './config/config';
import app from './config/express';

import authorization from './server/services/authorization.service';
import userService from './server/services/user.service';
import emailTemplate from './config/emailTemplate';
import EmailTemplateModel from './server/models/emailTemplate.model';
import exportFileTemplate from './config/exportFileTemplate';
import ReportTemplateModel from './server/models/exportFile.model';
import EmailHandler from './config/emailHandler';
import Supplier from './server/models/supplier.model';
// import Payment from './server/models/pendingPayment.model';
import CustomerInvite from './server/models/customerInvite.model';
import User from './server/models/user.model';
import appSettings from './appSettings';
import Invoice from './server/models/invoice.model';
import Customer from './server/models/customer.model';
import Transaction from './server/models/transaction.model';
import notificationCtrl from './server/controllers/notification.controller';
import recurringCtrl from './server/controllers/recurringOrder.controller';
import recurringModel from './server/models/recurringOrder.model';
import SMSHandler from './config/smsHandler';
import smsConfig from './config/smsConfig';

const debug = require('debug')('app:index');
const moment = require('moment-timezone');
const jsreport = require('jsreport-core')();
const express = require('express');

// const workbook = XLSX.readFile('test2.csv');
// const sheetNameList = workbook.SheetNames;
// console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]));

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

authorization.checkPermissionsAndRoles();
userService.checkDefaultAdmin();

EmailTemplateModel.find()
  .then((templates) => {
    if (templates <= 0) {
      EmailTemplateModel.insertMany(emailTemplate.defaultTemplate, (err) => {
        if (!err) {
          console.log('> Email Templates has been added to db'); // eslint-disable-line no-console
        }
      });
    }
  });

ReportTemplateModel.find()
  .then((templates) => {
    if (templates <= 0) {
      ReportTemplateModel.insertMany(exportFileTemplate.defaultTemplate, (err) => {
        if (!err) {
          console.log('> Reports Templates has been added to db'); // eslint-disable-line no-console
        }
      });
    }
  });

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
const reportingApp = express();
app.use('/reporting', reportingApp);
jsreport.use(require('jsreport-express')({ app: reportingApp }));
jsreport.use(require('jsreport-phantom-pdf')());
jsreport.use(require('jsreport-jsrender')());
jsreport.use(require('jsreport-templates')());
jsreport.use(require('jsreport-html-to-xlsx')());

// let server;
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}
// server.setTimeout();
/**
 * Missed Payments Cron Job
 */
if (appSettings.cronSwitch) {
  cron.schedule('15 0 * * *', () => {
    Supplier.find()
      .populate('staff')
      .then((suppliers) => {
        let interval = ''; // eslint-disable-line no-unused-vars
        let frequency = ''; // eslint-disable-line no-unused-vars
        suppliers.forEach((supplierObj) => {
          if (supplierObj.paymentInterval === 'Month') {
            interval = 'M';
            frequency = supplierObj.paymentFrequency;
          } else if (supplierObj.paymentInterval === 'Week') {
            interval = 'days';
            frequency = supplierObj.paymentFrequency * 7;
          } else {
            interval = 'days';
            frequency = supplierObj.paymentFrequency;
          }
          const duePaymentDate = moment(supplierObj.nextPaymentDueDate).tz(appSettings.timeZone);
          // Payment.find({ $and: [{ status: 'Pending' }, { createdAt: { $gte: supplierObj.createdAt,
          //   $lte: duePaymentDate } }, { supplier: supplierObj }] })
          //   .then((payments) => {
          //     if (payments.length > 0 && moment()
          //         .tz(appSettings.timeZone).diff(duePaymentDate) > 0) {
          //       if (appSettings.smsSwitch) {
          //         SMSHandler.sendSms(supplierObj.staff[0].language === 'en' ? `You have ${payments.length} late payments` : `لديك ${payments.length} مدفوعات متأخرة`, '966598741277');
          //       }
          //       supplierObj.dueDateMissed = true;
          //       supplierObj.save()
          //         .then(savedSupplier =>
          //           console.log(savedSupplier)); // eslint-disable-line no-console
          //     } else {
          //       supplierObj.dueDateMissed = false;
          //       supplierObj.save()
          //         .then(savedSupplier =>
          //           console.log(savedSupplier)); // eslint-disable-line no-console
          //     }
          //   });
          Transaction.find({ $and: [{ createdAt: { $gte: supplierObj.createdAt,
            $lte: duePaymentDate } }, { supplier: supplierObj }] })
            .then((transactions) => {
              if (transactions.length > 0 && moment()
                .tz(appSettings.timeZone).diff(duePaymentDate, 'days') > 0) {
                if (appSettings.smsSwitch) {
                  const lang = supplierObj.staff && supplierObj.staff[0] && supplierObj.staff[0].language ? supplierObj.staff[0].language : 'en';
                  SMSHandler.sendSms(lang === 'en' ? `You have ${transactions.length} late payments` : `لديك ${transactions.length} مدفوعات متأخرة`, smsConfig.to, lang);
                }
                supplierObj.dueDateMissed = true;
                supplierObj.save()
                  .then(savedSupplier =>
                    console.log(savedSupplier)); // eslint-disable-line no-console
              } else {
                supplierObj.dueDateMissed = false;
                supplierObj.save()
                  .then(savedSupplier =>
                    console.log(savedSupplier)); // eslint-disable-line no-console
              }
            });
        });
      });
    CustomerInvite.find()
      .then((customerInvites) => {
        let interval = ''; // eslint-disable-line no-unused-vars
        let frequency = ''; // eslint-disable-line no-unused-vars
        customerInvites.forEach((customerInviteObj) => {
          if (customerInviteObj.paymentInterval === 'Month') {
            interval = 'M';
            frequency = customerInviteObj.paymentFrequency;
          } else if (customerInviteObj.paymentInterval === 'Week') {
            interval = 'days';
            frequency = customerInviteObj.paymentFrequency * 7;
          } else {
            interval = 'days';
            frequency = customerInviteObj.paymentFrequency;
          }
          const duePaymentDate = moment(customerInviteObj.nextPaymentDueDate)
            .tz(appSettings.timeZone);
          User.findOne({ email: customerInviteObj.customerEmail })
            .then((user) => {
              Customer.findOne({ user })
                .then((customer) => {
                  Transaction.find({ $and: [{ createdAt: { $gte: customerInviteObj.createdAt,
                    $lte: duePaymentDate } }, { customer }] })
                    .then((transactions) => {
                      if (transactions.length > 0 && moment().tz(appSettings.timeZone)
                        .diff(duePaymentDate, 'days') > 0) {
                        if (appSettings.smsSwitch) {
                          SMSHandler.sendSms(user.language === 'en' ? `You have ${payments.length} late payments` : `لديك ${payments.length} مدفوعات متأخرة`, smsConfig.to, user.language);
                        }
                        customer.dueDateMissed = true;
                        customerInviteObj.dueDateMissed = true;
                      } else {
                        customer.dueDateMissed = false;
                        customerInviteObj.dueDateMissed = false;
                        customerInviteObj.canOrder = true;
                      }
                      customer.save()
                        .then(savedCustomer => // eslint-disable-line max-len
                          console.log(savedCustomer)); // eslint-disable-line no-console
                      customerInviteObj.save()
                        .then(savedCustomerRelation => // eslint-disable-line max-len
                          console.log(savedCustomerRelation)); // eslint-disable-line no-console
                    });
                });
            });
        });
      });
  });
}

/**
 * Paying Soon Cron Job
 */
// */3 * * * *
// 0 0 * * *
if (appSettings.cronSwitch) {
  cron.schedule('0 0 * * *', () => {
    Supplier.find()
      .then((suppliers) => {
        let interval = '';
        let frequency = '';
        suppliers.forEach((supplierObj) => {
          if (supplierObj.paymentInterval === 'Month') {
            interval = 'M';
            frequency = supplierObj.paymentFrequency;
          } else if (supplierObj.paymentInterval === 'Week') {
            interval = 'days';
            frequency = supplierObj.paymentFrequency * 7;
          } else {
            interval = 'days';
            frequency = supplierObj.paymentFrequency;
          }
          const dueWarningDate = moment(supplierObj.nextPaymentDueDate).tz(appSettings.timeZone).subtract(7, 'days');
          Transaction.find({ $and: [{
            createdAt: {
              $gte: supplierObj.createdAt,
              $lte: dueWarningDate
            }
          }, { supplier: supplierObj }] })
            .then((transactions) => {
              if (moment().tz(appSettings.timeZone).diff(supplierObj.nextPaymentDueDate, 'days') > 0) {
                supplierObj.startPaymentDate = supplierObj.nextPaymentDueDate;
                supplierObj.nextPaymentDueDate = moment(supplierObj.nextPaymentDueDate)
                  .tz(appSettings.timeZone).add(frequency, interval);
              }
              if (transactions.length > 0 && moment().tz(appSettings.timeZone)
                .diff(dueWarningDate, 'days') === 0) {
                supplierObj.payingSoon = true;
                supplierObj.save()
                  .then(savedSupplier =>
                    console.log(savedSupplier)); // eslint-disable-line no-console
              } else {
                supplierObj.payingSoon = false;
                supplierObj.save()
                  .then(savedSupplier =>
                    console.log(savedSupplier)); // eslint-disable-line no-console
              }
            });
        });
      });
    CustomerInvite.find()
      .then((customerInvites) => {
        let interval = '';
        let frequency = '';
        customerInvites.forEach((customerInviteObj) => {
          if (customerInviteObj.paymentInterval === 'Month') {
            interval = 'M';
            frequency = customerInviteObj.paymentFrequency;
          } else if (customerInviteObj.paymentInterval === 'Week') {
            interval = 'days';
            frequency = customerInviteObj.paymentFrequency * 7;
          } else {
            interval = 'days';
            frequency = customerInviteObj.paymentFrequency;
          }
          const dueWarningDate = moment(customerInviteObj.nextPaymentDueDate).tz(appSettings.timeZone).subtract(7, 'days');
          User.findOne({ email: customerInviteObj.customerEmail })
            .then((user) => {
              Customer.findOne({ user })
                .then((customer) => {
                  Transaction.find({ $and: [{ createdAt: { $gte: customerInviteObj.createdAt,
                    $lte: dueWarningDate } }, { customer }] })
                    .then((transactions) => {
                      if (moment().tz(appSettings.timeZone).diff(customer.nextPaymentDueDate, 'days') > 0) {
                        customerInviteObj.startPaymentDate = customerInviteObj.nextPaymentDueDate;
                        customerInviteObj.nextPaymentDueDate = moment(customerInviteObj.nextPaymentDueDate)
                          .tz(appSettings.timeZone).add(frequency, interval);
                        customer.startPaymentDate = customer.nextPaymentDueDate;
                        customer.nextPaymentDueDate = moment(customer.nextPaymentDueDate)
                          .tz(appSettings.timeZone).add(frequency, interval);
                      }
                      if (transactions.length > 0 && moment().tz(appSettings.timeZone)
                        .diff(dueWarningDate, 'days') === 0) {
                        customer.payingSoon = true;
                        customerInviteObj.payingSoon = true;
                      } else {
                        customer.payingSoon = false;
                        customerInviteObj.payingSoon = false;
                      }
                      customer.save()
                        .then(savedCustomer =>
                          console.log(savedCustomer)); // eslint-disable-line no-console
                      customerInviteObj.save()
                        .then(savedCustomerRelation =>
                          console.log(savedCustomerRelation)); // eslint-disable-line no-console
                    });
                });
            });
        });
      });
  });
}

/**
 * Invoice Cron Job
 * Generate Invoice for supplier and customer
 */
if (appSettings.cronSwitch) {
// 30 23 28-31 * *
// 0 * * * *
// 0 0 1 * *
  // 20-35 * * * *
  cron.schedule('0 0 1 * *', () => {
    Transaction.aggregate([
      {
        $match: { $and: [{ type: 'debit' }, { invoice: null }] }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $project: {
          _id: 1,
          supplier: 1,
          customer: 1,
          close: 1,
          invoice: 1,
          createdAt: 1
        }
      },
      // {
      //   $lookup: {
      //     from: 'suppliers',
      //     localField: 'supplier',
      //     foreignField: '_id',
      //     as: 'supplier'
      //   }
      // },
      // {
      //   $unwind: '$supplier'
      // },
      // {
      //   $project: {
      //     _id: 1,
      //     'supplier._id': 1,
      //     'supplier.representativeName': 1,
      //     customer: 1,
      //     paymentMethod: 1,
      //     paymentId: 1
      //   }
      // },
      // {
      //   $lookup: {
      //     from: 'customers',
      //     localField: 'customer',
      //     foreignField: '_id',
      //     as: 'customer'
      //   }
      // },
      // {
      //   $unwind: '$customer'
      // },
      // {
      //   $project: {
      //     _id: 1,
      //     'supplier._id': 1,
      //     'supplier.representativeName': 1,
      //     'customer._id': 1,
      //     'customer.representativeName': 1,
      //     paymentMethod: 1,
      //     paymentId: 1
      //   }
      // }
      {
        $group: {
          _id: { supplier: '$supplier', customer: '$customer' },
          transactions: { $push: '$$ROOT' }
        }
      }
    ], (err, result) => {
      if (result.length > 0) {
        result.forEach((transactionResult) => {
          Invoice.findOne()
          .sort({ invoiceId: -1 })
          .then((invoiceObj) => {
            let nextInvoiceId = '';
            if (invoiceObj) {
              nextInvoiceId = Number(invoiceObj.invoiceId.slice(6)) + 1;
            } else {
              nextInvoiceId = appSettings.invoiceIdInit;
            }
            const invoiceObject = new Invoice({
              invoiceId: '',
              transactions: transactionResult.transactions,
              supplier: transactionResult._id.supplier,
              customer: transactionResult._id.customer,
              duDate: moment().tz(appSettings.timeZone).add(Number(appSettings.duePaymentDays), 'days').format(appSettings.momentFormat),
              total: transactionResult.transactions.map(c => c.close)
                .reduce((sum, value) => sum + value, 0),
              close: transactionResult.transactions[0].close
            });
            invoiceObject.save()
              .then((invoiceSaved) => {
                Invoice.findOne({ _id: invoiceSaved._id })
                .then((newInvoice) => {
                  newInvoice.invoiceId = `${appSettings.invoicePrefix}${nextInvoiceId}`;
                  newInvoice.save();
                });
                transactionResult.transactions.forEach((transactionObj) => {
                  Transaction.findOne(transactionObj._id)
                    .populate({
                      path: 'supplier',
                      select: '_id representativeName staff',
                      populate: {
                        path: 'staff',
                        select: '_id email language'
                      }
                    })
                    .populate({
                      path: 'customer',
                      select: '_id representativeName user',
                      populate: {
                        path: 'user',
                        select: '_id email language'
                      }
                    })
                    .then((transaction) => {
                      if (appSettings.emailSwitch) {
                        const month = moment(invoiceSaved.createdAt).tz(appSettings.timeZone).format('MMMM');
                        if (transaction.customer) {
                          const content = {
                            recipientName: transaction.customer.representativeName,
                            invoiceId: invoiceSaved.invoiceId,
                            month: (transaction.customer.user.language === 'en') ? appSettings.Month[month].en : appSettings.Month[month].ar,
                            dueDate: moment(invoiceSaved.dueDate).tz(appSettings.timeZone).format('YYYY-DD-MM')
                          };
                          EmailHandler.sendEmail(transaction.customer.user.email, content, 'NEWINVOICE', transaction.customer.user.language);
                        } else {
                          const content = {
                            recipientName: transaction.supplier.representativeName,
                            invoiceId: invoiceSaved.invoiceId,
                            month: (transaction.supplier.staff[0].language === 'en') ? appSettings.Month[month].en : appSettings.Month[month].ar,
                            dueDate: moment(invoiceSaved.dueDate).tz(appSettings.timeZone).format('YYYY-DD-MM')
                          };
                          EmailHandler.sendEmail(transaction.supplier.staff[0].email, content, 'NEWINVOICE', transaction.supplier.staff[0].language);
                        }
                      }
                      transaction.invoice = invoiceSaved._id;
                      transaction.save();
                    });
                });
                if (typeof invoiceSaved.customer === 'undefined') {
                  Supplier.findOne({ _id: invoiceSaved.supplier })
                    .populate('staff')
                    .then((supplier) => {
                      const notification = {
                        refObjectId: invoiceSaved,
                        level: 'success',
                        user: supplier.staff[0],
                        userType: 'Supplier',
                        key: 'newInvoice',
                        stateParams: null
                      };
                      notificationCtrl.createNotification('invoice', notification, null, null, null, null);
                    });
                  console.log('Invoice Generated (With Admin-Supplier):', invoiceSaved._id); // eslint-disable-line no-console
                } else {
                  Customer.findOne({ _id: invoiceSaved.customer })
                    .populate('user')
                    .then((customer) => {
                      const notification = {
                        refObjectId: invoiceSaved,
                        level: 'success',
                        user: customer.user,
                        userType: 'Customer',
                        key: 'newInvoice',
                        stateParams: 'supplier'
                      };
                      notificationCtrl.createNotification('invoice', notification, null, null, null, invoiceSaved.supplier);
                    });
                  console.log('Invoice Generated (With Supplier-Customer):', invoiceSaved._id); // eslint-disable-line no-console
                }
              });
            // .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
            nextInvoiceId += 1;
          });
        });
      }
    });
    console.log('Done'); // eslint-disable-line no-console
  });
}

/**
 * Recurring Orders Cron Job
 * Recurring Orders
 */
// */3 * * * * 20 0 * * *
if (appSettings.cronSwitch) {
  cron.schedule('20 0 * * *', () => {
    const todayDate = moment().tz(appSettings.timeZone).startOf('day').format(appSettings.momentFormat);
    const nextDate = moment().tz(appSettings.timeZone).endOf('day').format(appSettings.momentFormat);
    recurringModel.find({ startDate: { $gt: todayDate, $lt: nextDate } })
    .populate({
      path: 'customer',
      select: '_id representativeName user',
      populate: {
        path: 'user',
        select: '_id email language'
      }
    }).populate({
      path: 'supplier',
      select: '_id representativeName staff VATRegisterNumber',
      populate: {
        path: 'staff',
        select: '_id email language'
      }
    })
      .populate({
        path: 'branch',
        select: '_id branchName'
      })
      .where('status').equals('Active')
    .then((orders) => {
      console.log('ordersLength', orders.length);
      if (orders.length > 0) {
        orders.forEach((obj) => {
          const previousDate = moment(obj.startDate).tz(appSettings.timeZone).subtract(1, 'd');
          if (previousDate.diff(moment().tz(appSettings.timeZone), 'days') === 0) {
            if (appSettings.emailSwitch) {
              const content = {
                recipientName: obj.customer.representativeName,
                orderId: obj.orderId,
                orderPageUrl: `<a href=\'${appSettings.mainUrl}/customer/order/recurOrder/${obj._id}\'>${appSettings.mainUrl}/customer/order/recurOrder/${obj._id}</a>` // eslint-disable-line no-useless-escape
              };
              EmailHandler.sendEmail(obj.customer.user.email, content, 'RECURRINGORDERREMINDER', obj.customer.user.language);
            }
          }
          const orderPrice = obj.products
            .map(m => m.quantity * m.price)
            .reduce((sum, value) => sum + value, 0);
          const nextOrderId = moment().tz(appSettings.timeZone).format('x');
          recurringCtrl.orderRecurringOrder(obj, orderPrice, nextOrderId);
        });
      } else {
        console.log('No Recurring.....'); // eslint-disable-line no-console
      }
    });
  });
}

export default app;
