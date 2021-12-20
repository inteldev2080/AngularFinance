import httpStatus from 'http-status';
import async from 'async';
import moment from 'moment-timezone';
import EmailHandler from '../../config/emailHandler';
import appSettings from '../../appSettings';
import Order from '../models/order.model';
import OrderProduct from '../models/orderProduct.model';
import Customer from '../models/customer.model';
import Product from '../models/product.model';
import User from '../models/user.model';
import Supplier from '../models/supplier.model';
import OrderReview from '../models/orderReview.model';
import OrderLog from '../models/orderLog.model';
import Transaction from '../models/transaction.model';
import Response from '../services/response.service';
import UserService from '../services/user.service';
import ExportService from './exportFileService';
import notificationCtrl from './notification.controller';
import CustomerProductPrice from '../models/customerProductPrice.model';
import CustomerInvite from '../models/customerInvite.model';
import Recipes from '../models/recipes.model';
import Ingredients from '../models/ingredients.model';
import Branches from '../models/branch.model';
import mongoose from 'mongoose';

const debug = require('debug')('app:order.controller');

// const moment = require('moment-timezone');

/**
 * Get order
 * @returns {Order}
 */
// TODO: Performance Complexity Enhancement
function get(req, res) {
  const isSupplier = checkUserInSupplier(req.order.supplier, req.user._id);
  async.waterfall([
      // Function that passes the parameters to the second function.
      function passParamters(callback) {
        callback(null, req.user._id, req.order._id);
      },
      // Gets the customer.
      isSupplier ? disableOrderCanceling : getCustomer,
      function passParameter(customer, orderId, callback) {
        callback(null, customer, orderId, req.query.skip, req.query.limit);
      },
      // // Gets the order.
      getOrder,
      // Adds the order products to the order.
      getOrderProducts
    ],
    (err, result) => {
      result.order.customer.coverPhoto = `${appSettings.imagesUrl}${result.order.customer.coverPhoto}`;
      result.order.supplier.coverPhoto = `${appSettings.imagesUrl}${result.order.supplier.coverPhoto}`;
      const supplierObject = {
        _id: result.order.supplier._id,
        representativeName: result.order.supplier.representativeName,
        user: {
          _id: result.order.supplier.staff[0]._id,
          email: result.order.supplier.staff[0].email,
          mobileNumber: result.order.supplier.staff[0].mobileNumber,
          firstName: result.order.supplier.staff[0].firstName,
          lastName: result.order.supplier.staff[0].lastName
        },
        coverPhoto: result.order.supplier.coverPhoto,
        location: result.order.supplier.location
      };
      const resultObject = {
        _id: result.order._id,
        orderId: result.order.orderId,
        customer: result.order.customer,
        supplier: supplierObject,
        price: result.order.price,
        isRecurring: result.order.isReccuring,
        canBeCanceled: result.order.canBeCanceled,
        status: result.order.status,
        createdAt: result.order.createdAt,
        updatedAt: result.order.updatedAt,
        products: result.products,
        review: result.order.review,
        message: result.order.message,
        driver: result.order.driver,
        count: result.count,
        VAT: result.order.VAT,
        branchName: result.order.branchName,
        branch: result.order.branch,
        deliveryDate: result.order.deliveryDate,
        deliveryDateIslamic: result.order.deliveryDateIslamic,
        deliveryImage: result.order.deliveryImage
      };
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        res.json(Response.success(resultObject));
      }
    });
}

function deliveryNote(req, res) {
  const orders = req.body.orders;
  const orderDriver = req.body.driver;
  const ordersArr = [];
  orders.forEach((orderId) => {
    Order.findById(orderId)
      .populate({
        path: 'supplier',
        select: '_id representativeName adminFees staff commercialRegister location VATRegisterNumber',
        populate: {
          path: 'staff',
          select: '_id email'
        }
      })
      .populate({
        path: 'customer',
        select: '_id representativeName user coverPhoto commercialRegister location branch',
        populate: {
          path: 'user branch',
          select: '_id email mobileNumber firstName lastName language _id branchName location '
        }
      })
      .populate({
        path: 'driver',
        select: '_id firstName lastName mobileNumber'
      })
      .populate({
        path: 'branch'
      })
      .then((order) => {
        // Check if the user is the admin or in the staff list.
        const respond = checkUserInSupplier(order.supplier, req.user._id);
        if (respond.includes(true)) {
          if (order.status === 'ReadyForDelivery' || order.status === 'FailedToDeliver') {
            const prevStatus = order.status;
            order.status = 'OutForDelivery';
            User.findOne({ _id: req.body.driver })
              .then((user) => {
                Supplier.findOne({
                  $and: [{ _id: order.supplier._id },
                    { staff: { $in: [req.body.driver] } }]
                })
                  .then((supplier) => {
                    if (supplier) {
                      order.driver = user;
                      const log = new OrderLog({
                        order: order._id,
                        status: order.status,
                        userName: `${order.supplier.representativeName}`,
                        userType: 'Supplier',
                        message: `${req.body.message} .`,
                        createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
                      });
                      log.save();
                      order.save()
                        .then((savedOrder) => {
                          OrderProduct.find({ order: savedOrder, stats: 'Accepted'})
                            .select('_id order product price quantity status')
                            .populate({
                              path: 'product',
                              select: '_id arabicName englishName sku store shelf unit deleted status',
                              populate: {
                                path: 'unit'
                              }
                            })
                            .then((products) => {
                              savedOrder.customer.coverPhoto = `${appSettings.imagesUrl}${savedOrder.customer.coverPhoto}`;
                              order.VAT = parseFloat(order.VAT.toString(2));
                              ordersArr.push({
                                order,
                                products,
                                user,
                                date: moment().tz(appSettings.timeZone).format('DD-MM-YYYY'),
                                total: order.price + order.VAT,
                                VATNumber: order.supplier.VATRegisterNumber
                              });
                              if (ordersArr.length === orders.length) {
                                if (req.query.export) {
                                  if (req.user.language === 'en') {
                                    ExportService.exportReceiptFile('report_template/main_header/english_header_out_delivery.html',
                                      'report_template/orders/delivery-orders-body-english.html', {
                                        order: ordersArr[0].order,
                                        ordersArr
                                      },
                                      'Delivery Note', `${moment().tz(appSettings.timeZone).format('DD-MM-YYYY')}`, 'pdf', res);
                                    // res.download('report.pdf', 'SUPReport.pdf');
                                  } else {
                                    ExportService.exportReceiptFile('report_template/main_header/arabic_header_out_delivery.html',
                                      'report_template/orders/delivery-orders-body-arabic.html', {
                                        order: ordersArr[0].order,
                                        ordersArr
                                      },
                                      'فاتورة التوصيل', `${moment().tz(appSettings.timeZone).format('DD-MM-YYYY')}`, 'pdf', res);
                                    // res.download('report.pdf', 'SUPReport.pdf');
                                  }
                                } else {
                                  res.json(Response.success(ordersArr));
                                }
                              }

                              if (appSettings.emailSwitch) {
                                const content = {
                                  recipientName: UserService.toTitleCase(order.customer.representativeName),
                                  orderId: order.orderId,
                                  prevStatus: order.customer.user.language === 'en' ? appSettings.Status[prevStatus].en : appSettings.Status[prevStatus].ar,
                                  currentStatus: order.customer.user.language === 'en' ? appSettings.Status[order.status].en : appSettings.Status[order.status].ar,
                                  orderPageUrl: `<a href=\'${appSettings.mainUrl}/customer/order/normalOrder/${order._id}\'>${appSettings.mainUrl}/customer/order/normalOrder/${order._id}</a>`, // eslint-disable-line no-useless-escape
                                  loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                                  productName: products[0].product.englishName
                                };
                                // order.customer.user.email
                                EmailHandler.sendEmail(order.customer.user.email, content, 'ORDERSTATUS', order.customer.user.language);
                              }
                              // res.json(Response.success({
                              //   _id: savedOrder._id,
                              //   orderId: savedOrder.orderId,
                              //   customer: savedOrder.customer,
                              //   price: savedOrder.price,
                              //   isRecurring: savedOrder.isReccuring,
                              //   canBeCanceled: savedOrder.canBeCanceled,
                              //   status: savedOrder.status,
                              //   createdAt: savedOrder.createdAt,
                              //   updatedAt: savedOrder.updatedAt,
                              //   review: savedOrder.review,
                              //   message: savedOrder.message,
                              //   driver: savedOrder.driver,
                              //   products
                              // }));
                            });
                        })
                        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR)
                          .json(Response.failure(e)));
                    } else {
                      res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
                    }
                  });
              });
          } else {
            res.status(httpStatus.BAD_REQUEST).json(Response.failure(10));
          }
        } else if (order.driver.toString === req.user._id.toString) {
          if (order.status === 'ReadyForDelivery' || order.status === 'FailedToDeliver') {
            User.findOne({ _id: req.user._id })
              .then((user) => {
                const prevStatus = order.status;
                order.status = 'OutForDelivery';
                const log = new OrderLog({
                  order: order._id,
                  status: order.status,
                  userName: `${order.supplier.representativeName}`,
                  userType: 'Supplier',
                  message: `${req.body.message} .`,
                  createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
                });
                log.save();
                order.save()
                  .then((savedOrder) => {
                    OrderProduct.find({ order: savedOrder, stats: 'Accepted'})
                      .select('_id order product price quantity status')
                      .populate({
                        path: 'product',
                        select: '_id arabicName englishName sku store shelf unit deleted status',
                        populate: {
                          path: 'unit'
                        }
                      })
                      .then((products) => {
                        savedOrder.customer.coverPhoto = `${appSettings.imagesUrl}${savedOrder.customer.coverPhoto}`;
                        ordersArr.push({
                          order,
                          products,
                          user,
                          date: moment().tz(appSettings.timeZone).format('DD-MM-YYYY'),
                          total: order.price + order.VAT,
                          VATNumber: order.supplier.VATRegisterNumber
                        });
                        if (ordersArr.length === orders.length) {
                          if (req.query.export) {
                            if (req.user.language === 'en') {
                              ExportService.exportReceiptFile('report_template/main_header/english_header_out_delivery.html',
                                'report_template/orders/delivery-orders-body-english.html', {
                                  order: ordersArr[0].order,
                                  ordersArr
                                },
                                'Delivery Note', `${moment().tz(appSettings.timeZone).format('DD-MM-YYYY')}`, 'pdf', res);
                              // res.download('report.pdf', 'SUPReport.pdf');
                            } else {
                              ExportService.exportReceiptFile('report_template/main_header/arabic_header_out_delivery.html',
                                'report_template/orders/delivery-orders-body-arabic.html', {
                                  order: ordersArr[0].order,
                                  ordersArr
                                },
                                'فاتورة التوصيل', `${moment().tz(appSettings.timeZone).format('DD-MM-YYYY')}`, 'pdf', res);
                              // res.download('report.pdf', 'SUPReport.pdf');
                            }
                          } else {
                            res.json(Response.success(ordersArr));
                          }
                        }

                        if (appSettings.emailSwitch) {
                          const content = {
                            recipientName: UserService.toTitleCase(order.customer.representativeName),
                            orderId: order.orderId,
                            prevStatus: order.customer.user.language === 'en' ? appSettings.Status[prevStatus].en : appSettings.Status[prevStatus].ar,
                            currentStatus: order.customer.user.language === 'en' ? appSettings.Status[order.status].en : appSettings.Status[order.status].ar,
                            orderPageUrl: `<a href=\'${appSettings.mainUrl}/customer/order/normalOrder/${order._id}\'>${appSettings.mainUrl}/customer/order/normalOrder/${order._id}</a>`, // eslint-disable-line no-useless-escape
                            loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                            productName: products[0].product.englishName
                          };
                          // order.customer.user.email
                          EmailHandler.sendEmail(order.customer.user.email, content, 'ORDERSTATUS', order.customer.user.language);
                        }
                        // res.json(Response.success({
                        //   _id: savedOrder._id,
                        //   orderId: savedOrder.orderId,
                        //   customer: savedOrder.customer,
                        //   price: savedOrder.price,
                        //   isRecurring: savedOrder.isReccuring,
                        //   canBeCanceled: savedOrder.canBeCanceled,
                        //   status: savedOrder.status,
                        //   createdAt: savedOrder.createdAt,
                        //   updatedAt: savedOrder.updatedAt,
                        //   review: savedOrder.review,
                        //   message: savedOrder.message,
                        //   driver: savedOrder.driver,
                        //   products
                        // }));
                      });
                  })
                  .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR)
                    .json(Response.failure(e)));
              });
          }
        } else {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
        }
      });
  });
}

function orderPurchase(req, res) {
  const order = req.order;

  OrderProduct.find({ order })
    .select('_id order product price quantity status branchName')
    .populate({
      path: 'product',
      select: '_id arabicName englishName sku store shelf unit deleted status',
      populate: {
        path: 'unit'
      }
    })
    .then((products) => {
      if (req.query.export) {
        if (req.user.type === 'Supplier' || req.user.type === 'Admin') {
          if (order.status === 'Pending') {
            if (req.user.language === 'en') {
              ExportService.exportReceiptFile('report_template/main_header/english_header.html',
                'report_template/orders/prepare-orders-body-english.html', { order, products },
                'Order Request', `${moment(order.createdAt).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, 'pdf', res);
              // res.download('report.pdf', 'SUPReport.pdf');
            } else {
              ExportService.exportReceiptFile('report_template/main_header/arabic_header.html',
                'report_template/orders/prepare-orders-body-arabic.html', { order, products },
                'طلب قيد التجهيز', `${moment(order.createdAt).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, 'pdf', res);
              // res.download('report.pdf', 'SUPReport.pdf');
            }
          } else if (req.user.language === 'en') {
            ExportService.exportReceiptFile('report_template/main_header/english_header.html',
              'report_template/orders/accepted-orders-body-english.html', { order, products },
              `Order ${appSettings.Status[order.status].en}`, `${moment(order.createdAt).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, 'pdf', res);
            // res.download('report.pdf', 'SUPReport.pdf');
          } else {
            ExportService.exportReceiptFile('report_template/main_header/arabic_header.html',
              'report_template/orders/accepted-orders-body-arabic.html', { order, products },
              ` طلب ${appSettings.Status[order.status].ar}`, `${moment(order.createdAt).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, 'pdf', res);
            // res.download('report.pdf', 'SUPReport.pdf');
          }
        }
        if (req.user.type === 'Customer') {
          const resultObject = {
            _id: order._id,
            orderId: order.orderId,
            customer: order.customer,
            supplier: order.supplier,
            price: order.price,
            isRecurring: order.isReccuring,
            canBeCanceled: order.canBeCanceled,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            products,
            review: order.review,
            message: order.message,
            driver: order.driver,
            VAT: order.VAT,
            total: order.VAT + order.price
          };

          if (req.user.language === 'en') {
            ExportService.exportReceiptFile('report_template/main_header/english_header.html',
              'report_template/orders/orders-body-english.html', {
                order: resultObject,
                products
              },
              'Order Invoice', '', req.query.export, res);
            // res.download('report.pdf', 'OrderInvoice.pdf');
          } else {
            ExportService.exportReceiptFile('report_template/main_header/arabic_header.html',
              'report_template/orders/orders-body-arabic.html', { order: resultObject, products },
              'فاتورة الطلب', '', req.query.export, res);
            // res.download('report.pdf', 'OrderInvoice.pdf');
          }

        }
      } else {
        res.json(Response.success(products));
      }
    });
}

/**
 * Get order overview
 * @returns {Product}
 */
function getOverview(req, res) {
  if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser,
      getSupplierProducts,
      getOrderOverview
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        res.json(Response.success(result));
      }
    });
  }
}

/**
 * Get order history
 * @returns {Order}
 */
function getHistory(req, res) {
  const match = {};

  if (req.query.orderId) {
    if (req.query.orderId.length) {
      match.orderId = req.query.orderId;
    }
  }
  if (req.query.supplierId) {
    // match = { supplier: supplierId };
    match.supplier = req.query.supplierId;
  }
  Order.find({ $and: [match] })
    .sort({
      updatedAt: -1
    })
    .skip(Number(req.query.skip))
    .limit(Number(req.query.limit))
    .then((orders) => {
      const ordersArr = [];
      orders.forEach((obj) => {
        OrderProduct.aggregate([
          {
            $match: { order: obj._id, status: 'Accepted' }
          },
          {
            $group: {
              _id: '$order',
              items: { $sum: '$quantity' },
              total: { $sum: { $multiply: ['$quantity', '$price'] } }
            }
          }
        ], (error, orderProducts) => {
          const orderProductTotal = orderProducts.map(c => c.total);
          const orderProductItems = orderProducts.map(c => c.items);
          const orderObj = {
            _id: obj._id,
            supplier: obj.supplier,
            customer: obj.customer,
            total: orderProductTotal[0],
            isRecurring: obj.isReccuring,
            canBeCanceled: obj.canBeCanceled,
            deleted: obj.deleted,
            date: obj.createdAt,
            status: obj.status,
            VAT: obj.VAT,
            orderId: obj.orderId,
            items: orderProductItems[0]
          };
          ordersArr.push(orderObj);
          if (ordersArr.length === orders.length) {
            Order.find({ $and: [match] })
              .sort({
                createdAt: -1
              })
              .then((ordersCount) => {
                const ordersHistory = {
                  ordersArr,
                  count: ordersCount.length
                };
                res.json(Response.success(ordersHistory));
              });
          }
        });
      });
    });
}

/**
 * Get order status counts
 * @returns {Object}
 */
function getCounts(req, res) {
  async.waterfall([
      function passParamters(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ],
    (err, result) => {
      Order.aggregate([
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
      ], (error, resultArr) => {
        Order.find({ $and: [{ supplier: result }, { review: { $ne: null } }] })
          .then((orders) => {
            const resultObject = {
              pending: 0,
              canceled: 0,
              rejected: 0,
              accepted: 0,
              failedToDeliver: 0,
              readyForDelivery: 0,
              outForDelivery: 0,
              delivered: 0,
              canceledByCustomer: 0
            };

            if (resultArr) {
              resultArr.forEach((resultObj) => {
                switch (resultObj.status[0]) {
                  case 'Pending':
                    resultObject.pending = resultObj.count;
                    break;
                  case 'Canceled':
                    resultObject.canceled = resultObj.count;
                    break;
                  case 'Rejected':
                    resultObject.rejected = resultObj.count;
                    break;
                  case 'Accepted':
                    resultObject.accepted = resultObj.count;
                    break;
                  case 'FailedToDeliver':
                    resultObject.failedToDeliver = resultObj.count;
                    break;
                  case 'ReadyForDelivery':
                    resultObject.readyForDelivery = resultObj.count;
                    break;
                  case 'OutForDelivery':
                    resultObject.outForDelivery = resultObj.count;
                    break;
                  case 'Delivered':
                    resultObject.delivered = resultObj.count;
                    break;
                  case 'CanceledByCustomer':
                    resultObject.canceledByCustomer = resultObj.count;
                    break;
                  default:
                    break;
                }
              });
            }

            if (error) {
              res.json(error);
            }
            resultObject.review = orders.length;
            res.json(Response.success(resultObject));
          });
      });
    }
  );
}

/**
 * Get order log
 * @returns {Object}
 */
function getLog(req, res) {
  OrderLog.find({ order: req.order })
    .sort({
      createdAt: -1
    })
    .then((log) => {
      if (log.length > 0) {
        res.json(Response.success(log));
      } else {
        res.status(httpStatus.NOT_FOUND).json(Response.failure(21));
      }
    });
}

/**
 * Get order list.
 * @property {number} req.query.skip - Number of orders to be skipped.
 * @property {number} req.query.limit - Limit number of orders to be returned.
 * @returns {Order[]}
 */
function list(req, res) {
  const match = {};


  if (req.query.status) {
    req.query.status = JSON.parse(JSON.stringify(req.query.status));
    if (req.query.status.length) {
      req.query.status.forEach((opt) => {
        req.query.status.push(new RegExp(opt, 'i'));
      });
      match.status = { $in: req.query.status };
    }
  }
  if (req.query.driverId) {
    if (req.query.status) {
      if (req.query.status.length === 2 && req.query.status.includes('outfordelivery')) {
        match.driver = req.query.driverId;
      }
    }
  }

  if (req.query.startDate) {
    const startDate = new Date(req.query.startDate.toString());
    const endDate = new Date(req.query.endDate.toString());

    match.createdAt = { $gte: startDate, $lte: endDate };
  }


  if (req.user.type === 'Admin') {
    const supplierMatch = {};
    if (req.query.supplierId) {
      supplierMatch.supplier = req.query.supplierId;
    }
    Order.find({ $and: [match, supplierMatch] })
      .sort({
        createdAt: -1
      })
      .skip(Number(req.query.skip))
      .limit(Number(req.query.limit))
      .then((orders) => {
        const ordersObject = {
          orders,
          count: orders.length
        };
        res.json(Response.success(ordersObject));
      })
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  } else if (req.user.type === 'Supplier') {
    async.waterfall([
        function passParamters(callback) {
          callback(null, req.user._id);
        },
        getSupplierFromUser
      ],
      (err, result) => {
        if (err) {
          res.status(httpStatus.NOT_FOUND).json(Response.failure(err));
        } else if (result) {
          match.supplier = mongoose.Types.ObjectId(result);

          let ordersAggregate = [
              {
                $match: match
              }
              , {
                $lookup: {
                  from: 'customers',
                  localField: 'customer',
                  foreignField: '_id',
                  as: 'customer'
                }
              }
              , {
                $unwind: '$customer'
              }, {
                $lookup: {
                  from: 'branches',
                  localField: 'branch',
                  foreignField: '_id',
                  as: 'branch'
                }
              }, {
                $unwind: '$branch'
              }, {
                $project: {
                  _id: '$_id',
                  orderId: '$orderId',
                  supplier: '$supplierId',
                  customer: '$customer',
                  price: '$price',
                  updatedAt: '$updatedAt',
                  createdAt: '$createdAt',
                  message: '$message',
                  rejectedProductsFlag: '$rejectedProductsFlag',
                  isReccuring: '$isReccuring',
                  canBeCanceled: '$canBeCanceled',
                  deleted: '$deleted',
                  status: '$status',
                  VAT: '$VAT',
                  branchName: '$branchName',
                  branch: '$branch',
                  cityId: '$branch.location.cityId'
                }
              }],
            ordersCount = 0;

          if (req.query.city) {
            ordersAggregate.push({
              $match: {
                cityId: mongoose.Types.ObjectId(req.query.city)
              }
            });
          }

          Order.aggregate(ordersAggregate).then(orderCount => {
            ordersCount = orderCount;

            ordersAggregate.push({
              $skip: Number(req.query.skip)
            });

            ordersAggregate.push({
              $limit: Number(req.query.limit)
            });

            return Order.aggregate(ordersAggregate);
          }).then((ordersArr) => {
            if (ordersArr.length > 0) {
              const orders = [];
              ordersArr.forEach((orderObj) => {
                const newOrder = {
                  order: '',
                  products: ''
                };
                OrderProduct.find({
                  order: orderObj._id,
                  status: { $in: ['Accepted', 'Pending', 'Rejected'] }
                })
                  .populate({
                    path: 'product',
                    select: '_id arabicName englishName status'
                  })
                  .then((products) => {
                    const orderProducts = [];
                    if (req.query.productId) {
                      const filteredProducts = products.map(c => c).filter(c => c.product._id.toString() === req.query.productId.toString());
                      if (filteredProducts.length > 0) {
                        products.forEach((productObj) => {
                          orderProducts.push(productObj);
                        });
                      }
                    } else {
                      products.forEach((productObj) => {
                        orderProducts.push(productObj);
                      });
                    }
                    const orderCustomer = {
                      representativeName: orderObj.customer.representativeName,
                      coverPhoto: `${appSettings.imagesUrl}${orderObj.customer.coverPhoto}`
                    };
                    const orderObject = {
                      _id: orderObj._id,
                      orderId: orderObj.orderId,
                      VAT: orderObj.VAT,
                      customer: orderCustomer,
                      price: orderObj.price,
                      driver: orderObj.driver,
                      createdAt: orderObj.createdAt,
                      updatedAt: orderObj.updatedAt,
                      updatedAtDay: moment(orderObj.updatedAt).tz(appSettings.timeZone).format('YYYY-MM-DD'),
                      status: orderObj.status,
                      branchName: orderObj.branchName,
                      city: orderObj.branch && orderObj.branch.location ? orderObj.branch.location.city : ''
                    };
                    newOrder.order = orderObject;
                    newOrder.products = orderProducts;
                    orders.push(newOrder);
                    if (orders.length === ordersArr.length) {
                      orders.sort((a, b) => (a.order.createdAt < b.order.createdAt) ? 1 : ((a.order.createdAt > b.order.createdAt) ? -1 : 0)); // eslint-disable-line no-nested-ternary
                      const filteredOrders = orders.map(c => c).filter(c => c.products.length > 0);
                      // const ordersResultArr = filteredOrders.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > filteredOrders.length ? (filteredOrders.length)
                      //   : (Number(req.query.limit) + Number(req.query.skip))));
                      Order.find(match)
                        .then((ordersCount) => {
                          if (req.query.productId) {
                            const ordersObject = {
                              orders: filteredOrders,
                              count: ordersCount.length
                            };
                            res.json(Response.success(ordersObject));
                          } else {
                            const ordersObject = {
                              orders: filteredOrders,
                              count: ordersCount.length
                            };
                            res.json(Response.success(ordersObject));
                          }
                        });
                    }
                  });
              });
            } else {
              const ordersObject = {
                ordersArr,
                count: ordersCount
              };
              res.json(Response.success(ordersObject));
            }
          })
            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
        } else {
          Order.find({ driver: req.user._id })
            .select('_id orderId customer createdAt status updatedAt VAT branchName branch')
            .populate({
              path: 'customer',
              select: '_id representativeName coverPhoto'
            }).populate({
            path: 'branch',
            select: 'location'
          })
            .then((orders) => {
              if (orders.length > 0) {
                const ordersArr = [];
                orders.forEach((orderObj) => {
                  const newOrder = {
                    order: '',
                    products: ''
                  };
                  OrderProduct.find({
                    order: orderObj,
                    status: { $in: ['Accepted', 'Pending', 'Rejected'] }
                  })
                    .populate({
                      path: 'product',
                      select: '_id arabicName englishName status'
                    })
                    .then((products) => {
                      const orderProducts = [];
                      products.forEach((productObj) => {
                        orderProducts.push(productObj);
                      });
                      const orderCustomer = {
                        representativeName: orderObj.customer.representativeName,
                        coverPhoto: `${appSettings.imagesUrl}${orderObj.customer.coverPhoto}`
                      };
                      const orderObject = {
                        _id: orderObj._id,
                        createdAt: orderObj.createdAt,
                        updatedAt: orderObj.updatedAt,
                        updatedAtDay: moment(orderObj.updatedAt).tz(appSettings.timeZone).format('YYYY-MM-DD'),
                        orderId: orderObj.orderId,
                        VAT: orderObj.VAT,
                        supplier: orderObj.supplier,
                        customer: orderCustomer,
                        rejectedProductsFlag: orderObj.rejectedProductsFlag,
                        isRecurring: orderObj.isRecurring,
                        canBeCanceled: orderObj.canBeCanceled,
                        status: orderObj.status,
                        products: orderProducts.map(c => c.product),
                        total: orderProducts.map(c => c.price * c.quantity)
                          .reduce((sum, value) => sum + value, 0),
                        items: orderProducts.map(c => c.product).length > 0 ? orderProducts.map(c => c.product).length : 0,
                        branchName: orderObj.branchName,
                        city: orderObj.branch && orderObj.branch.location ? orderObj.branch.location.city : ''
                      };
                      newOrder.order = orderObject;
                      newOrder.products = orderProducts;
                      ordersArr.push(newOrder);
                      if (ordersArr.length === orders.length) {
                        ordersArr.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : ((a.createdAt > b.createdAt) ? -1 : 0)); // eslint-disable-line no-nested-ternary
                        const ordersResultArr = ordersArr.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > ordersArr.length ? (ordersArr.length)
                          : (Number(req.query.limit) + Number(req.query.skip))));
                        const ordersObject = {
                          orders: ordersResultArr,
                          count: orders.length
                        };
                        res.json(Response.success(ordersObject));
                      }
                    });
                });
              } else {
                const ordersObject = {
                  orders: [],
                  count: 0
                };
                res.json(Response.success(ordersObject));
              }
            });
        }
      });
  } else if (req.user.type === 'Customer') {
    const supplierMatch = {};
    let filterQuery = {};

    if (req.query.supplierId) {
      supplierMatch.supplier = req.query.supplierId;
    }
    if (req.query.filterQuery) {
      filterQuery = { $or: ([{ orderId: new RegExp(`.*${req.query.filterQuery.trim()}.*`, 'i') }, { branchName: new RegExp(`.*${req.query.filterQuery.trim()}.*`, 'i') }]) };
      // supplierMatch.orderId = new RegExp(`.*${req.query.orderId.trim()}.*`, 'i');
    }
    async.waterfall([
        function passParamters(callback) {
          callback(null, req.user._id, null);
        }, getBranchesArray
      ],
      (error, result) => {
        supplierMatch.branch = { $in: result };
        if (error) {
          res.status(httpStatus.NOT_FOUND).json(Response.failure(error));
        } else {
          Order.find({ $and: [supplierMatch, filterQuery] })
            .then((orders) => {
              if (orders.length > 0) {
                const ordersArr = [];
                orders.forEach((orderObj) => {
                  OrderProduct.find({ order: orderObj, status: { $in: ['Accepted', 'Pending'] } })
                    .populate('product')
                    .then((orderProducts) => {
                      let orderObject = {};
                      if (orderProducts.length > 0) {
                        orderObject = {
                          _id: orderObj._id,
                          createdAt: orderObj.createdAt,
                          updatedAt: orderObj.updatedAt,
                          updatedAtDay: moment(orderObj.updatedAt).tz(appSettings.timeZone).format('YYYY-MM-DD'),
                          orderId: orderObj.orderId,
                          VAT: orderObj.VAT,
                          supplier: orderObj.supplier,
                          customer: orderObj.customer,
                          rejectedProductsFlag: orderObj.rejectedProductsFlag,
                          isRecurring: orderObj.isRecurring,
                          canBeCanceled: orderObj.canBeCanceled,
                          status: orderObj.status,
                          products: orderProducts.map(c => c.product),
                          total: orderProducts.map(c => c.price * c.quantity)
                            .reduce((sum, value) => sum + value, 0),
                          items: orderProducts.map(c => c.product).length > 0 ? orderProducts.map(c => c.product).length : 0,
                          branchName: orderObj.branchName
                        };
                      } else {
                        orderObject = {
                          _id: orderObj._id,
                          createdAt: orderObj.createdAt,
                          updatedAt: orderObj.updatedAt,
                          updatedAtDay: moment(orderObj.updatedAt).tz(appSettings.timeZone).format('YYYY-MM-DD'),
                          orderId: orderObj.orderId,
                          VAT: 0,
                          supplier: orderObj.supplier,
                          customer: orderObj.customer,
                          rejectedProductsFlag: orderObj.rejectedProductsFlag,
                          isRecurring: orderObj.isRecurring,
                          canBeCanceled: orderObj.canBeCanceled,
                          status: orderObj.status,
                          products: orderProducts.map(c => c.product),
                          total: orderProducts.map(c => c.price * c.quantity)
                            .reduce((sum, value) => sum + value, 0),
                          items: orderProducts.map(c => c.product).length > 0 ? orderProducts.map(c => c.product).length : 0,
                          branchName: orderObj.branchName
                        };
                      }
                      ordersArr.push(orderObject);
                      if (ordersArr.length === orders.length) {
                        ordersArr.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : ((a.createdAt > b.createdAt) ? -1 : 0)); // eslint-disable-line no-nested-ternary
                        const ordersResultArr = ordersArr.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > ordersArr.length ? (ordersArr.length)
                          : (Number(req.query.limit) + Number(req.query.skip))));
                        Order.find({ $and: [supplierMatch, filterQuery] })
                          .then((ordersCount) => {
                            const ordersRevenue = ordersCount.map(c => c).filter(c => c.status === 'Delivered').map(c => c.price + c.VAT).reduce((sum, value) => sum + value, 0);
                            const ordersObject = {
                              orders: ordersResultArr,
                              count: ordersCount.length,
                              ordersRevenue
                            };
                            res.json(Response.success(ordersObject));
                          });
                      }
                    });
                });
              } else {
                const ordersObject = {
                  orders: [],
                  count: 0
                };
                res.json(Response.success(ordersObject));
              }
            })
            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
        }
      });
  }
}

function addProductToOrder(req, res) {
  let orderProduct = '';
  const order = req.order;
  if (order.status === 'Pending') {
    if (req.user.type === 'Customer') {
      async.waterfall([
        function passParameter(callback) {
          callback(null, req.user._id);
        },
        function getCustomerFromUser(userId, callback) {
          let customerEmail = '';
          Customer.findOne({ user: userId })
            .populate('user')
            .then((customer) => {
              if (customer.type === 'Staff') {
                return Customer.findOne({ _id: customer.customer })
                  .populate('user');
              }
              return customer;
            }).then((customer) => {
            if (customer) {
              customerEmail = customer.user.email;
            } else {
              customerEmail = req.user.email;
            }
            Product.findOne({ _id: req.body.productId })
              .then((product) => {
                const orderTotal = order.supplier.VATRegisterNumber > 0 ?
                  order.price + (order.price * appSettings.VATPercent) + product.price :
                  order.price + product.price;
                callback(null, customerEmail, order, customer, orderTotal);
              });
          });
        },
        checkCreditLimitWithOrder
      ], (err, result) => {
        if (err) {
          res.status(httpStatus.UNAUTHORIZED).json(err);
        } else if (result) {
          Product.findOne({ _id: req.body.productId })
            .then((product) => {
              OrderProduct.find({ order: order._id })
                .then((orderProducts) => {
                  if (orderProducts.length > 0) {
                    const productIds = orderProducts.map(c => c.product.toString());
                    if (productIds.includes(product._id.toString())) {
                      OrderProduct.findOne({ product, order: order._id })
                        .then((updatedOrderProduct) => {
                          updatedOrderProduct.quantity += req.body.quantity;
                          updatedOrderProduct.save()
                            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                        });
                    } else {
                      orderProduct = new OrderProduct({
                        product,
                        price: product.price,
                        order,
                        quantity: req.body.quantity,
                        status: 'Pending'
                      });
                      orderProduct.save()
                        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                    }
                    orderProducts.forEach((orderProductObj) => {
                      CustomerProductPrice.findOne({
                        product: orderProductObj.product,
                        customer: result,
                        supplier: order.supplier
                      })
                        .then((productSpecialPrice) => {
                          if (productSpecialPrice) {
                            orderProductObj.price = productSpecialPrice.price;
                          }
                          orderProductObj.save()
                            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                        });
                    });
                    Order.findOne({ _id: order._id })
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
                        select: '_id representativeName user coverPhoto location',
                        populate: {
                          path: 'user',
                          select: '_id email mobileNumber firstName lastName'
                        }
                      })
                      .then((requiredOrder) => {
                        const customerObject = requiredOrder.customer;
                        customerObject.coverPhoto = `${appSettings.imagesUrl}${customerObject.coverPhoto}`;
                        const supplierObject = {
                          _id: requiredOrder.supplier._id,
                          representativeName: requiredOrder.supplier.representativeName,
                          user: requiredOrder.supplier.staff[0],
                          coverPhoto: `${appSettings.imagesUrl}${requiredOrder.supplier.coverPhoto}`,
                          location: requiredOrder.supplier.location
                        };
                        OrderProduct.find({ order: requiredOrder })
                          .populate({
                            path: 'product',
                            select: '_id englishName arabicName price unit status',
                            populate: {
                              path: 'unit',
                              select: '_id englishName arabicName'
                            }
                          })
                          .then((requiredOrderProducts) => {
                            const requiredOrderProductsArr = requiredOrderProducts.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > requiredOrderProducts.length ? (requiredOrderProducts.length)
                              : (Number(req.query.limit) + Number(req.query.skip))));
                            const totalPrice = requiredOrderProducts.map(c => c.price * c.quantity)
                              .reduce((sum, value) => sum + value, 0);
                            // Supplier.findOne({ _id: requiredOrder.supplier._id })
                            //   .then((supplier) => {
                            //     supplier.reservedBalance -= (order.price + order.VAT) * order.supplier.adminFees;
                            //     supplier.reservedBalance += (totalPrice + (totalPrice * appSettings.VATPercent)) * requiredOrder.supplier.adminFees;
                            //     supplier.save();
                            //   });
                            // CustomerInvite.findOne({ customerEmail: requiredOrder.customer.user.email, supplier: requiredOrder.supplier })
                            //   .then((customerInvite) => {
                            //     customerInvite.reservedBalance -= (order.price + order.VAT);
                            //     customerInvite.reservedBalance += (totalPrice + (totalPrice * appSettings.VATPercent));
                            //     customerInvite.save();
                            //   });
                            requiredOrder.price = totalPrice;
                            requiredOrder.VAT = requiredOrder.supplier.VATRegisterNumber > 0 ?
                              totalPrice * appSettings.VATPercent : 0;
                            requiredOrder.save()
                              .then((savedOrder) => {
                                const resultObject = {
                                  _id: savedOrder._id,
                                  orderId: savedOrder.orderId,
                                  customer: customerObject,
                                  supplier: supplierObject,
                                  price: savedOrder.price,
                                  isRecurring: savedOrder.isReccuring,
                                  canBeCanceled: savedOrder.canBeCanceled,
                                  status: savedOrder.status,
                                  createdAt: savedOrder.createdAt,
                                  updatedAt: savedOrder.updatedAt,
                                  products: requiredOrderProductsArr,
                                  review: savedOrder.review,
                                  message: savedOrder.message,
                                  driver: savedOrder.driver,
                                  count: requiredOrderProducts.length,
                                  VAT: savedOrder.VAT
                                };
                                res.json(Response.success(resultObject));
                              });
                          });
                      });
                  } else {
                    orderProduct = new OrderProduct({
                      product,
                      price: product.price,
                      order,
                      quantity: req.body.quantity,
                      status: 'Pending'
                    });
                    orderProduct.save()
                      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                    orderProducts.forEach((orderProductObj) => {
                      CustomerProductPrice.findOne({
                        product: orderProductObj.product,
                        customer: result,
                        supplier: order.supplier
                      })
                        .then((productSpecialPrice) => {
                          if (productSpecialPrice) {
                            orderProductObj.price = productSpecialPrice.price;
                          }
                          orderProductObj.save()
                            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                        });
                    });
                    Order.findOne({ _id: order._id })
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
                        select: '_id representativeName user coverPhoto location',
                        populate: {
                          path: 'user',
                          select: '_id email mobileNumber firstName lastName'
                        }
                      })
                      .then((requiredOrder) => {
                        const customerObject = requiredOrder.customer;
                        customerObject.coverPhoto = `${appSettings.imagesUrl}${customerObject.coverPhoto}`;
                        const supplierObject = {
                          _id: requiredOrder.supplier._id,
                          representativeName: requiredOrder.supplier.representativeName,
                          user: requiredOrder.supplier.staff[0],
                          coverPhoto: `${appSettings.imagesUrl}${requiredOrder.supplier.coverPhoto}`,
                          location: requiredOrder.supplier.location
                        };
                        OrderProduct.find({ order: requiredOrder })
                          .populate({
                            path: 'product',
                            select: '_id englishName arabicName price unit status',
                            populate: {
                              path: 'unit',
                              select: '_id englishName arabicName'
                            }
                          })
                          .then((requiredOrderProducts) => {
                            const requiredOrderProductsArr = requiredOrderProducts.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > requiredOrderProducts.length ? (requiredOrderProducts.length)
                              : (Number(req.query.limit) + Number(req.query.skip))));
                            const totalPrice = requiredOrderProducts.map(c => c.price * c.quantity)
                              .reduce((sum, value) => sum + value, 0);
                            requiredOrder.price = totalPrice;
                            requiredOrder.VAT = requiredOrder.supplier.VATRegisterNumber > 0 ?
                              totalPrice * appSettings.VATPercent : 0;
                            requiredOrder.save()
                              .then((savedOrder) => {
                                const resultObject = {
                                  _id: savedOrder._id,
                                  orderId: savedOrder.orderId,
                                  customer: customerObject,
                                  supplier: supplierObject,
                                  price: savedOrder.price,
                                  isRecurring: savedOrder.isReccuring,
                                  canBeCanceled: savedOrder.canBeCanceled,
                                  status: savedOrder.status,
                                  createdAt: savedOrder.createdAt,
                                  updatedAt: savedOrder.updatedAt,
                                  products: requiredOrderProductsArr,
                                  review: savedOrder.review,
                                  message: savedOrder.message,
                                  driver: savedOrder.driver,
                                  count: requiredOrderProducts.length,
                                  VAT: savedOrder.VAT
                                };
                                res.json(Response.success(resultObject));
                              });
                          });
                      });
                  }
                });
            });
        } else {
          res.status(httpStatus.BAD_REQUEST).json({ message: 'error in returning customer' });
        }
      });
    } else if (req.user.type === 'Supplier') {
      async.waterfall([
        function passParameter(callback) {
          callback(null, req.user._id);
        },
        function getCustomerFrom(userId, callback) {
          Supplier.findOne()
            .where('staff').in([userId])
            .then((supplier) => {
              callback(null, supplier);
            });
        }
      ], (err, result) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else {
          Product.findOne({ _id: req.body.productId })
            .then((product) => {
              OrderProduct.find({ order: order._id })
                .then((orderProducts) => {
                  if (orderProducts.length > 0) {
                    const productIds = orderProducts.map(c => c.product.toString());

                    if (productIds.includes(product._id.toString())) {
                      OrderProduct.findOne({ product, order: order._id })
                        .then((updatedOrderProduct) => {
                          updatedOrderProduct.quantity += req.body.quantity;
                          updatedOrderProduct.save()
                            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                        });
                    } else {
                      orderProduct = new OrderProduct({
                        product,
                        price: product.price,
                        order,
                        quantity: req.body.quantity,
                        status: 'Pending'
                      });
                      orderProduct.save()
                        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                    }
                    orderProducts.forEach((orderProductObj) => {
                      CustomerProductPrice.findOne({
                        product: orderProductObj.product,
                        customer: order.customer,
                        supplier: result
                      })
                        .then((productSpecialPrice) => {
                          if (productSpecialPrice) {
                            orderProductObj.price = productSpecialPrice.price;
                          }
                          orderProductObj.save()
                            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                        });
                    });
                    Order.findOne({ _id: order._id })
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
                        select: '_id representativeName user coverPhoto location',
                        populate: {
                          path: 'user',
                          select: '_id email mobileNumber firstName lastName'
                        }
                      })
                      .then((requiredOrder) => {
                        const customerObject = requiredOrder.customer;
                        customerObject.coverPhoto = `${appSettings.imagesUrl}${customerObject.coverPhoto}`;
                        const supplierObject = {
                          _id: requiredOrder.supplier._id,
                          representativeName: requiredOrder.supplier.representativeName,
                          user: requiredOrder.supplier.staff[0],
                          coverPhoto: `${appSettings.imagesUrl}${requiredOrder.supplier.coverPhoto}`,
                          location: requiredOrder.supplier.location
                        };
                        OrderProduct.find({ order: requiredOrder })
                          .populate({
                            path: 'product',
                            select: '_id englishName arabicName price unit status',
                            populate: {
                              path: 'unit',
                              select: '_id englishName arabicName'
                            }
                          })
                          .then((requiredOrderProducts) => {
                            const requiredOrderProductsArr = requiredOrderProducts.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > requiredOrderProducts.length ? (requiredOrderProducts.length)
                              : (Number(req.query.limit) + Number(req.query.skip))));
                            const totalPrice = requiredOrderProducts.map(c => c.price * c.quantity)
                              .reduce((sum, value) => sum + value, 0);
                            // Supplier.findOne({ _id: requiredOrder.supplier._id })
                            //   .then((supplier) => {
                            //     supplier.reservedBalance -= (order.price + order.VAT) * order.supplier.adminFees;
                            //     supplier.reservedBalance += (totalPrice + (totalPrice * appSettings.VATPercent)) * requiredOrder.supplier.adminFees;
                            //     supplier.save();
                            //   });
                            // CustomerInvite.findOne({ customerEmail: requiredOrder.customer.user.email, supplier: requiredOrder.supplier })
                            //   .then((customerInvite) => {
                            //     customerInvite.reservedBalance -= (order.price + order.VAT);
                            //     customerInvite.reservedBalance += (totalPrice + (totalPrice * appSettings.VATPercent));
                            //     customerInvite.save();
                            //   });
                            requiredOrder.price = totalPrice;
                            requiredOrder.VAT = requiredOrder.supplier.VATRegisterNumber > 0 ?
                              totalPrice * appSettings.VATPercent : 0;
                            requiredOrder.save()
                              .then((savedOrder) => {
                                const resultObject = {
                                  _id: savedOrder._id,
                                  orderId: savedOrder.orderId,
                                  customer: customerObject,
                                  supplier: supplierObject,
                                  price: savedOrder.price,
                                  isRecurring: savedOrder.isReccuring,
                                  canBeCanceled: savedOrder.canBeCanceled,
                                  status: savedOrder.status,
                                  createdAt: savedOrder.createdAt,
                                  updatedAt: savedOrder.updatedAt,
                                  products: requiredOrderProductsArr,
                                  review: savedOrder.review,
                                  message: savedOrder.message,
                                  driver: savedOrder.driver,
                                  count: requiredOrderProducts.length,
                                  VAT: savedOrder.VAT
                                };
                                res.json(Response.success(resultObject));
                              });
                          });
                      });
                  } else {
                    orderProduct = new OrderProduct({
                      product,
                      price: product.price,
                      order,
                      quantity: req.body.quantity,
                      status: 'Pending'
                    });
                    orderProduct.save()
                      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                    orderProducts.forEach((orderProductObj) => {
                      CustomerProductPrice.findOne({
                        product: orderProductObj.product,
                        customer: order.customer,
                        supplier: result
                      })
                        .then((productSpecialPrice) => {
                          if (productSpecialPrice) {
                            orderProductObj.price = productSpecialPrice.price;
                          }
                          orderProductObj.save()
                            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                        });
                    });
                    Order.findOne({ _id: order._id })
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
                        select: '_id representativeName user coverPhoto location',
                        populate: {
                          path: 'user',
                          select: '_id email mobileNumber firstName lastName'
                        }
                      })
                      .then((requiredOrder) => {
                        const customerObject = requiredOrder.customer;
                        customerObject.coverPhoto = `${appSettings.imagesUrl}${customerObject.coverPhoto}`;
                        const supplierObject = {
                          _id: requiredOrder.supplier._id,
                          representativeName: requiredOrder.supplier.representativeName,
                          user: requiredOrder.supplier.staff[0],
                          coverPhoto: `${appSettings.imagesUrl}${requiredOrder.supplier.coverPhoto}`,
                          location: requiredOrder.supplier.location
                        };
                        OrderProduct.find({ order: requiredOrder })
                          .populate({
                            path: 'product',
                            select: '_id englishName arabicName price unit status',
                            populate: {
                              path: 'unit',
                              select: '_id englishName arabicName'
                            }
                          })
                          .then((requiredOrderProducts) => {
                            const requiredOrderProductsArr = requiredOrderProducts.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > requiredOrderProducts.length ? (requiredOrderProducts.length)
                              : (Number(req.query.limit) + Number(req.query.skip))));
                            const totalPrice = requiredOrderProducts.map(c => c.price * c.quantity)
                              .reduce((sum, value) => sum + value, 0);
                            // Supplier.findOne({ _id: requiredOrder.supplier._id })
                            //   .then((supplier) => {
                            //     supplier.reservedBalance -= (order.price + order.VAT) * order.supplier.adminFees;
                            //     supplier.reservedBalance += (totalPrice + (totalPrice * appSettings.VATPercent)) * requiredOrder.supplier.adminFees;
                            //     supplier.save();
                            //   });
                            // CustomerInvite.findOne({ customerEmail: requiredOrder.customer.user.email, supplier: requiredOrder.supplier })
                            //   .then((customerInvite) => {
                            //     customerInvite.reservedBalance -= (order.price + order.VAT);
                            //     customerInvite.reservedBalance += (totalPrice + (totalPrice * appSettings.VATPercent));
                            //     customerInvite.save();
                            //   });
                            requiredOrder.price = totalPrice;
                            requiredOrder.VAT = requiredOrder.supplier.VATRegisterNumber > 0 ?
                              totalPrice * appSettings.VATPercent : 0;
                            requiredOrder.save()
                              .then((savedOrder) => {
                                const resultObject = {
                                  _id: savedOrder._id,
                                  orderId: savedOrder.orderId,
                                  customer: customerObject,
                                  supplier: supplierObject,
                                  price: savedOrder.price,
                                  isRecurring: savedOrder.isReccuring,
                                  canBeCanceled: savedOrder.canBeCanceled,
                                  status: savedOrder.status,
                                  createdAt: savedOrder.createdAt,
                                  updatedAt: savedOrder.updatedAt,
                                  products: requiredOrderProductsArr,
                                  review: savedOrder.review,
                                  message: savedOrder.message,
                                  driver: savedOrder.driver,
                                  count: requiredOrderProducts.length,
                                  VAT: savedOrder.VAT
                                };
                                res.json(Response.success(resultObject));
                              });
                          });
                      });
                  }
                });
            });
        }
      });
    }
  } else {
    res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
  }
}

function updateProductInOrder(req, res) {
  const orderProduct = req.orderProduct;
  if (orderProduct.status === 'Pending') {
    if (req.user.type === 'Customer') {
      async.waterfall([
        function passParameter(callback) {
          callback(null, req.user.id);
        },
        function getCustomerFromUser(userId, callback) {
          let customerEmail = '';
          Customer.findOne({ user: userId })
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
            const orderTotal = orderProduct.order.price + orderProduct.order.VAT + (orderProduct.price * Number(req.body.quantity));
            callback(null, customerEmail, orderProduct.order, customer, orderTotal);
          });
        },
        checkCreditLimitWithOrder
      ], (err, result) => {
        if (err) {
          res.status(httpStatus.BAD_REQUEST).json(err);
        } else if (result) {
          orderProduct.quantity = req.body.quantity;
          orderProduct.save()
            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
          OrderProduct.find({ order: orderProduct.order._id })
            .then((orderProducts) => {
              if (orderProducts.length > 0) {
                orderProducts.forEach((orderProductObj) => {
                  CustomerProductPrice.findOne({
                    product: orderProductObj.product,
                    customer: result,
                    supplier: orderProduct.order.supplier
                  })
                    .then((productSpecialPrice) => {
                      if (productSpecialPrice) {
                        orderProductObj.price = productSpecialPrice.price;
                      }
                      orderProductObj.save()
                        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                    });
                });
                Order.findOne({ _id: orderProduct.order._id })
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
                    select: '_id representativeName user coverPhoto location',
                    populate: {
                      path: 'user',
                      select: '_id email mobileNumber firstName lastName'
                    }
                  })
                  .then((requiredOrder) => {
                    const customerObject = requiredOrder.customer;
                    customerObject.coverPhoto = `${appSettings.imagesUrl}${customerObject.coverPhoto}`;
                    const supplierObject = {
                      _id: requiredOrder.supplier._id,
                      representativeName: requiredOrder.supplier.representativeName,
                      user: requiredOrder.supplier.staff[0],
                      coverPhoto: `${appSettings.imagesUrl}${requiredOrder.supplier.coverPhoto}`,
                      location: requiredOrder.supplier.location
                    };
                    OrderProduct.find({ order: requiredOrder })
                      .populate({
                        path: 'product',
                        select: '_id englishName arabicName price unit status',
                        populate: {
                          path: 'unit',
                          select: '_id englishName arabicName'
                        }
                      })
                      .then((requiredOrderProducts) => {
                        const requiredOrderProductsArr = requiredOrderProducts.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > requiredOrderProducts.length ? (requiredOrderProducts.length)
                          : (Number(req.query.limit) + Number(req.query.skip))));
                        const totalPrice = requiredOrderProducts.map(c => c.price * c.quantity)
                          .reduce((sum, value) => sum + value, 0);
                        // Supplier.findOne({ _id: requiredOrder.supplier._id })
                        //   .then((supplier) => {
                        //     supplier.reservedBalance -= (requiredOrder.price + requiredOrder.VAT) * requiredOrder.supplier.adminFees;
                        //     supplier.reservedBalance += (totalPrice + (totalPrice * appSettings.VATPercent)) * requiredOrder.supplier.adminFees;
                        //     supplier.save();
                        //   });
                        // CustomerInvite.findOne({ customerEmail: requiredOrder.customer.user.email, supplier: requiredOrder.supplier })
                        //   .then((customerInvite) => {
                        //     customerInvite.reservedBalance -= (requiredOrder.price + requiredOrder.VAT);
                        //     customerInvite.reservedBalance += (totalPrice + (totalPrice * appSettings.VATPercent));
                        //     customerInvite.save();
                        //   });
                        requiredOrder.price = totalPrice;
                        requiredOrder.VAT = requiredOrder.supplier.VATRegisterNumber > 0 ?
                          totalPrice * appSettings.VATPercent : 0;
                        requiredOrder.save()
                          .then((savedOrder) => {
                            const resultObject = {
                              _id: savedOrder._id,
                              orderId: savedOrder.orderId,
                              customer: customerObject,
                              supplier: supplierObject,
                              price: savedOrder.price,
                              isRecurring: savedOrder.isReccuring,
                              canBeCanceled: savedOrder.canBeCanceled,
                              status: savedOrder.status,
                              createdAt: savedOrder.createdAt,
                              updatedAt: savedOrder.updatedAt,
                              products: requiredOrderProductsArr,
                              review: savedOrder.review,
                              message: savedOrder.message,
                              driver: savedOrder.driver,
                              count: requiredOrderProducts.length,
                              VAT: savedOrder.VAT
                            };
                            res.json(Response.success(resultObject));
                          });
                      });
                  });
              } else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(4));
              }
            });
          // } else {
          //   res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
          // }
        } else {
          res.status(httpStatus.BAD_REQUEST).json({ message: 'error in returning customer' });
        }
      });
    } else if (req.user.type === 'Supplier') {
      async.waterfall([
        function passParameter(callback) {
          callback(null, req.user.id);
        },
        function getCustomerFromUser(userId, callback) {
          Supplier.findOne()
            .where('staff').in([userId])
            .then((supplier) => {
              callback(null, supplier);
            });
        }
      ], (err, result) => {
        if (orderProduct.order.supplier.toString() === result._id.toString()) {
          orderProduct.quantity = req.body.quantity;
          orderProduct.save()
            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
          OrderProduct.find({ order: orderProduct.order._id })
            .then((orderProducts) => {
              if (orderProducts.length > 0) {
                orderProducts.forEach((orderProductObj) => {
                  CustomerProductPrice.findOne({
                    product: orderProductObj.product,
                    customer: orderProduct.order.customer,
                    supplier: result
                  })
                    .then((productSpecialPrice) => {
                      if (productSpecialPrice) {
                        orderProductObj.price = productSpecialPrice.price;
                      }
                      orderProductObj.save()
                        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                    });
                });
                Order.findOne({ _id: orderProduct.order._id })
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
                    select: '_id representativeName user coverPhoto location',
                    populate: {
                      path: 'user',
                      select: '_id email mobileNumber firstName lastName'
                    }
                  })
                  .then((requiredOrder) => {
                    const customerObject = requiredOrder.customer;
                    customerObject.coverPhoto = `${appSettings.imagesUrl}${customerObject.coverPhoto}`;
                    const supplierObject = {
                      _id: requiredOrder.supplier._id,
                      representativeName: requiredOrder.supplier.representativeName,
                      user: requiredOrder.supplier.staff[0],
                      coverPhoto: `${appSettings.imagesUrl}${requiredOrder.supplier.coverPhoto}`,
                      location: requiredOrder.supplier.location
                    };
                    OrderProduct.find({ order: requiredOrder })
                      .populate({
                        path: 'product',
                        select: '_id englishName arabicName price unit status',
                        populate: {
                          path: 'unit',
                          select: '_id englishName arabicName'
                        }
                      })
                      .then((requiredOrderProducts) => {
                        const requiredOrderProductsArr = requiredOrderProducts.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > requiredOrderProducts.length ? (requiredOrderProducts.length)
                          : (Number(req.query.limit) + Number(req.query.skip))));
                        const totalPrice = requiredOrderProducts.map(c => c.price * c.quantity)
                          .reduce((sum, value) => sum + value, 0);
                        // Supplier.findOne({ _id: requiredOrder.supplier._id })
                        //   .then((supplier) => {
                        //     supplier.reservedBalance -= (requiredOrder.price + requiredOrder.VAT) * requiredOrder.supplier.adminFees;
                        //     supplier.reservedBalance += (totalPrice + (totalPrice * appSettings.VATPercent)) * requiredOrder.supplier.adminFees;
                        //     supplier.save();
                        //   });
                        // CustomerInvite.findOne({ customerEmail: requiredOrder.customer.user.email, supplier: requiredOrder.supplier })
                        //   .then((customerInvite) => {
                        //     customerInvite.reservedBalance -= (requiredOrder.price + requiredOrder.VAT);
                        //     customerInvite.reservedBalance += (totalPrice + (totalPrice * appSettings.VATPercent));
                        //     customerInvite.save();
                        //   });
                        requiredOrder.price = totalPrice;
                        requiredOrder.VAT = requiredOrder.supplier.VATRegisterNumber > 0 ?
                          totalPrice * appSettings.VATPercent : 0;
                        requiredOrder.save()
                          .then((savedOrder) => {
                            const resultObject = {
                              _id: savedOrder._id,
                              orderId: savedOrder.orderId,
                              customer: customerObject,
                              supplier: supplierObject,
                              price: savedOrder.price,
                              isRecurring: savedOrder.isReccuring,
                              canBeCanceled: savedOrder.canBeCanceled,
                              status: savedOrder.status,
                              createdAt: savedOrder.createdAt,
                              updatedAt: savedOrder.updatedAt,
                              products: requiredOrderProductsArr,
                              review: savedOrder.review,
                              message: savedOrder.message,
                              driver: savedOrder.driver,
                              count: requiredOrderProducts.length,
                              VAT: savedOrder.VAT
                            };
                            res.json(Response.success(resultObject));
                          });
                      });
                  });
              } else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(4));
              }
            });
        } else {
          res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
        }
      });
    }
  } else {
    res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
  }
}

function deleteProductFromOrder(req, res) {
  const orderProduct = req.orderProduct;
  if (orderProduct.status === 'Pending') {
    if (req.user.type === 'Customer') {
      async.waterfall([
        function passParameter(callback) {
          callback(null, req.user.id);
        },
        function getCustomerFromUser(userId, callback) {
          Customer.findOne({ user: userId })
            .then((customer) => {
              callback(null, customer);
            });
        }
      ], (err, result) => {
        const requiredToRemove = orderProduct;
        if (orderProduct.order.customer.toString() === result._id.toString()) {
          orderProduct.remove();
          OrderProduct.find({ order: orderProduct.order._id })
            .then((orderProducts) => {
              if (orderProducts.length > 0) {
                orderProducts.forEach((orderProductObj) => {
                  CustomerProductPrice.findOne({
                    product: orderProductObj.product,
                    customer: result,
                    supplier: orderProduct.order.supplier
                  })
                    .then((productSpecialPrice) => {
                      if (productSpecialPrice) {
                        orderProductObj.price = productSpecialPrice.price;
                      }
                      orderProductObj.save()
                        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                    });
                });
                Order.findOne({ _id: orderProduct.order._id })
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
                    select: '_id representativeName user coverPhoto location',
                    populate: {
                      path: 'user',
                      select: '_id email mobileNumber firstName lastName'
                    }
                  })
                  .then((requiredOrder) => {
                    const customerObject = requiredOrder.customer;
                    customerObject.coverPhoto = `${appSettings.imagesUrl}${customerObject.coverPhoto}`;
                    const supplierObject = {
                      _id: requiredOrder.supplier._id,
                      representativeName: requiredOrder.supplier.representativeName,
                      user: requiredOrder.supplier.staff[0],
                      coverPhoto: `${appSettings.imagesUrl}${requiredOrder.supplier.coverPhoto}`,
                      location: requiredOrder.supplier.location
                    };
                    OrderProduct.find({ order: requiredOrder })
                      .populate({
                        path: 'product',
                        select: '_id englishName arabicName price unit status',
                        populate: {
                          path: 'unit',
                          select: '_id englishName arabicName'
                        }
                      })
                      .then((requiredOrderProducts) => {
                        const requiredOrderProductsArr = requiredOrderProducts.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > requiredOrderProducts.length ? (requiredOrderProducts.length)
                          : (Number(req.query.limit) + Number(req.query.skip))));
                        const totalPrice = requiredOrderProducts.map(c => c.price * c.quantity)
                          .reduce((sum, value) => sum + value, 0);
                        requiredOrder.price = totalPrice;
                        requiredOrder.VAT = requiredOrder.supplier.VATRegisterNumber > 0 ?
                          totalPrice * appSettings.VATPercent : 0;
                        requiredOrder.save()
                          .then((savedOrder) => {
                            const resultObject = {
                              _id: savedOrder._id,
                              orderId: savedOrder.orderId,
                              customer: customerObject,
                              supplier: supplierObject,
                              price: savedOrder.price,
                              isRecurring: savedOrder.isReccuring,
                              canBeCanceled: savedOrder.canBeCanceled,
                              status: savedOrder.status,
                              createdAt: savedOrder.createdAt,
                              updatedAt: savedOrder.updatedAt,
                              products: requiredOrderProductsArr,
                              review: savedOrder.review,
                              message: savedOrder.message,
                              driver: savedOrder.driver,
                              count: requiredOrderProducts.length,
                              VAT: savedOrder.VAT
                            };
                            res.json(Response.success(resultObject));
                          });
                      });
                  });
              } else {
                Order.findOne({ _id: requiredToRemove.order._id })
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
                    select: '_id representativeName user coverPhoto location',
                    populate: {
                      path: 'user',
                      select: '_id email mobileNumber firstName lastName'
                    }
                  })
                  .then((requiredOrder) => {
                    const customerObject = requiredOrder.customer;
                    customerObject.coverPhoto = `${appSettings.imagesUrl}${customerObject.coverPhoto}`;
                    const supplierObject = {
                      _id: requiredOrder.supplier._id,
                      representativeName: requiredOrder.supplier.representativeName,
                      user: requiredOrder.supplier.staff[0],
                      coverPhoto: `${appSettings.imagesUrl}${requiredOrder.supplier.coverPhoto}`,
                      location: requiredOrder.supplier.location
                    };
                    OrderProduct.find({ order: requiredOrder })
                      .populate({
                        path: 'product',
                        select: '_id englishName arabicName price unit status',
                        populate: {
                          path: 'unit',
                          select: '_id englishName arabicName'
                        }
                      })
                      .then((requiredOrderProducts) => {
                        const requiredOrderProductsArr = [];
                        const totalPrice = 0;
                        requiredOrder.price = totalPrice;
                        requiredOrder.VAT = requiredOrder.supplier.VATRegisterNumber > 0 ?
                          totalPrice * appSettings.VATPercent : 0;
                        requiredOrder.save()
                          .then((savedOrder) => {
                            const resultObject = {
                              _id: savedOrder._id,
                              orderId: savedOrder.orderId,
                              customer: customerObject,
                              supplier: supplierObject,
                              price: savedOrder.price,
                              isRecurring: savedOrder.isReccuring,
                              canBeCanceled: savedOrder.canBeCanceled,
                              status: savedOrder.status,
                              createdAt: savedOrder.createdAt,
                              updatedAt: savedOrder.updatedAt,
                              products: requiredOrderProductsArr,
                              review: savedOrder.review,
                              message: savedOrder.message,
                              driver: savedOrder.driver,
                              count: requiredOrderProducts.length,
                              VAT: savedOrder.VAT
                            };
                            res.json(Response.success(resultObject));
                          });
                      });
                  });
              }
            });
        } else {
          res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
        }
      });
    } else if (req.user.type === 'Supplier') {
      async.waterfall([
        function passParameter(callback) {
          callback(null, req.user.id);
        },
        function getCustomerFromUser(userId, callback) {
          Supplier.findOne()
            .where('staff').in([userId])
            .then((supplier) => {
              callback(null, supplier);
            });
        }
      ], (err, result) => {
        const requiredToRemove = orderProduct;
        if (orderProduct.order.supplier.toString() === result._id.toString()) {
          orderProduct.remove();
          OrderProduct.find({ order: orderProduct.order._id })
            .then((orderProducts) => {
              if (orderProducts.length > 0) {
                orderProducts.forEach((orderProductObj) => {
                  CustomerProductPrice.findOne({
                    product: orderProductObj.product,
                    customer: orderProduct.order.customer,
                    supplier: result
                  })
                    .then((productSpecialPrice) => {
                      if (productSpecialPrice) {
                        orderProductObj.price = productSpecialPrice.price;
                      }
                      orderProductObj.save()
                        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                    });
                });
                Order.findOne({ _id: orderProduct.order._id })
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
                    select: '_id representativeName user coverPhoto location',
                    populate: {
                      path: 'user',
                      select: '_id email mobileNumber firstName lastName'
                    }
                  })
                  .then((requiredOrder) => {
                    const customerObject = requiredOrder.customer;
                    customerObject.coverPhoto = `${appSettings.imagesUrl}${customerObject.coverPhoto}`;
                    const supplierObject = {
                      _id: requiredOrder.supplier._id,
                      representativeName: requiredOrder.supplier.representativeName,
                      user: requiredOrder.supplier.staff[0],
                      coverPhoto: `${appSettings.imagesUrl}${requiredOrder.supplier.coverPhoto}`,
                      location: requiredOrder.supplier.location
                    };
                    OrderProduct.find({ order: requiredOrder })
                      .populate({
                        path: 'product',
                        select: '_id englishName arabicName price unit status',
                        populate: {
                          path: 'unit',
                          select: '_id englishName arabicName'
                        }
                      })
                      .then((requiredOrderProducts) => {
                        const requiredOrderProductsArr = requiredOrderProducts.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > requiredOrderProducts.length ? (requiredOrderProducts.length)
                          : (Number(req.query.limit) + Number(req.query.skip))));
                        const totalPrice = requiredOrderProducts.map(c => c.price * c.quantity)
                          .reduce((sum, value) => sum + value, 0);
                        const oldPrice = requiredOrder.price + requiredOrder.VAT;
                        // Supplier.findOne({ _id: requiredOrder.supplier._id })
                        //   .then((supplier) => {
                        //     supplier.reservedBalance -= oldPrice * requiredOrder.supplier.adminFees;
                        //     supplier.reservedBalance += (totalPrice + (totalPrice * appSettings.VATPercent)) * requiredOrder.supplier.adminFees;
                        //     supplier.save();
                        //   });
                        // CustomerInvite.findOne({ customerEmail: requiredOrder.customer.user.email, supplier: requiredOrder.supplier })
                        //   .then((customerInvite) => {
                        //     customerInvite.reservedBalance -= oldPrice;
                        //     customerInvite.reservedBalance += (totalPrice + (totalPrice * appSettings.VATPercent));
                        //     customerInvite.save();
                        //   });
                        requiredOrder.price = totalPrice;
                        requiredOrder.VAT = requiredOrder.supplier.VATRegisterNumber > 0 ?
                          totalPrice * appSettings.VATPercent : 0;
                        requiredOrder.save()
                          .then((savedOrder) => {
                            const resultObject = {
                              _id: savedOrder._id,
                              orderId: savedOrder.orderId,
                              customer: customerObject,
                              supplier: supplierObject,
                              price: savedOrder.price,
                              isRecurring: savedOrder.isReccuring,
                              canBeCanceled: savedOrder.canBeCanceled,
                              status: savedOrder.status,
                              createdAt: savedOrder.createdAt,
                              updatedAt: savedOrder.updatedAt,
                              products: requiredOrderProductsArr,
                              review: savedOrder.review,
                              message: savedOrder.message,
                              driver: savedOrder.driver,
                              count: requiredOrderProducts.length,
                              VAT: savedOrder.VAT
                            };
                            res.json(Response.success(resultObject));
                          });
                      });
                  });
              } else {
                Order.findOne({ _id: requiredToRemove.order._id })
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
                    select: '_id representativeName user coverPhoto location',
                    populate: {
                      path: 'user',
                      select: '_id email mobileNumber firstName lastName'
                    }
                  })
                  .then((requiredOrder) => {
                    const customerObject = requiredOrder.customer;
                    customerObject.coverPhoto = `${appSettings.imagesUrl}${customerObject.coverPhoto}`;
                    const supplierObject = {
                      _id: requiredOrder.supplier._id,
                      representativeName: requiredOrder.supplier.representativeName,
                      user: requiredOrder.supplier.staff[0],
                      coverPhoto: `${appSettings.imagesUrl}${requiredOrder.supplier.coverPhoto}`,
                      location: requiredOrder.supplier.location
                    };
                    OrderProduct.find({ order: requiredOrder })
                      .populate({
                        path: 'product',
                        select: '_id englishName arabicName price unit status',
                        populate: {
                          path: 'unit',
                          select: '_id englishName arabicName'
                        }
                      })
                      .then((requiredOrderProducts) => {
                        const requiredOrderProductsArr = [];
                        const totalPrice = 0;
                        requiredOrder.price = totalPrice;
                        requiredOrder.VAT = requiredOrder.supplier.VATRegisterNumber > 0 ?
                          totalPrice * appSettings.VATPercent : 0;
                        requiredOrder.save()
                          .then((savedOrder) => {
                            const resultObject = {
                              _id: savedOrder._id,
                              orderId: savedOrder.orderId,
                              customer: customerObject,
                              supplier: supplierObject,
                              price: savedOrder.price,
                              isRecurring: savedOrder.isReccuring,
                              canBeCanceled: savedOrder.canBeCanceled,
                              status: savedOrder.status,
                              createdAt: savedOrder.createdAt,
                              updatedAt: savedOrder.updatedAt,
                              products: requiredOrderProductsArr,
                              review: savedOrder.review,
                              message: savedOrder.message,
                              driver: savedOrder.driver,
                              count: requiredOrderProducts.length,
                              VAT: savedOrder.VAT
                            };
                            res.json(Response.success(resultObject));
                          });
                      });
                  });
              }
            });
        } else {
          res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
        }
      });
    }
  } else {
    res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
  }
}

/**
 * Cancels an order.
 * @returns {Order}
 */
function cancel(req, res) {
  const order = req.order;
  // Check if the order can be canceled
  if (req.user.type === 'Supplier') {
    async.waterfall([
        function passParamters(callback) {
          callback(null, req.user._id);
        },
        getSupplierFromUser
      ],
      (err, supplierId) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else if (order.supplier.equals(supplierId) || (order.driver._id.toString() === req.user._id.toString())) {
          const prevStatus = order.status;
          order.status = 'Canceled';
          order.updatedAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
          order.message = req.body.message;
          const log = new OrderLog({
            order: order._id,
            status: order.status,
            userName: `${order.supplier.representativeName}`,
            userType: 'Supplier',
            message: req.body.message,
            createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
          });
          log.save();
          order.save()
            .then((canceledOrder) => {
              OrderProduct.find({ order: canceledOrder })
                .select('_id order product price quantity status')
                .populate({
                  path: 'product',
                  select: '_id arabicName englishName sku store shelf unit deleted status'
                })
                .then((products) => {
                  products.forEach((productObj) => {
                    productObj.status = 'Rejected';
                    productObj.save();
                  });
                  canceledOrder.customer.coverPhoto = `${appSettings.imagesUrl}${canceledOrder.customer.coverPhoto}`;
                  if (appSettings.emailSwitch) {
                    const content = {
                      recipientName: UserService.toTitleCase(order.customer.representativeName),
                      orderId: order.orderId,
                      prevStatus: order.customer.user.language === 'en' ? appSettings.Status[prevStatus].en : appSettings.Status[prevStatus].ar,
                      currentStatus: order.customer.user.language === 'en' ? appSettings.Status[order.status].en : appSettings.Status[order.status].ar,
                      orderPageUrl: `<a href=\'${appSettings.mainUrl}/customer/order/normalOrder/${order._id}\'>${appSettings.mainUrl}/customer/order/normalOrder/${order._id}</a>`, // eslint-disable-line no-useless-escape
                      loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                      rejectionReason: req.body.message,
                      productName: products[0].product.englishName
                    };
                    // order.customer.user.email
                    EmailHandler.sendEmail(order.customer.user.email, content, 'ORDERSTATUSREJECTION', order.customer.user.language);
                  }
                  const notification = {
                    refObjectId: order,
                    level: 'success',
                    user: order.customer.user,
                    userType: 'Customer',
                    key: 'orderStatus',
                    stateParams: 'order'
                  };
                  notificationCtrl.createNotification('order', notification, prevStatus, canceledOrder.status, null, canceledOrder._id);
                  res.json(Response.success({
                    _id: canceledOrder._id,
                    orderId: canceledOrder.orderId,
                    customer: canceledOrder.customer,
                    price: canceledOrder.price,
                    isRecurring: canceledOrder.isReccuring,
                    canBeCanceled: canceledOrder.canBeCanceled,
                    status: canceledOrder.status,
                    createdAt: canceledOrder.createdAt,
                    updatedAt: canceledOrder.updatedAt,
                    review: canceledOrder.review,
                    message: canceledOrder.message,
                    products
                  }));
                });
              // res.json(Response.success(canceledOrder));
            })
            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
        } else {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
        }
      });
  } else if (req.user.type === 'Customer') {
    if (order.status === 'Pending') {
      async.waterfall([
          function passParamters(callback) {
            callback(null, req.user._id, null);
          },
          getCustomer
        ],
        (err, customer) => {
          if (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
          } else if (order.customer.equals(customer._id) || order.customer.equals(customer.customer)) {
            const prevStatus = order.status;
            order.status = 'CanceledByCustomer';
            order.message = req.body.message;
            order.updatedAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
            const log = new OrderLog({
              order: order._id,
              status: order.status,
              userName: `${order.customer.user.firstName} ${order.customer.user.lastName}`,
              userType: 'Customer',
              message: req.body.message,
              createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
            });
            log.save();
            order.save()
              .then((canceledOrder) => {
                // Supplier.findOne({ _id: canceledOrder.supplier })
                //   .then((supplier) => {
                //     supplier.reservedBalance -= (canceledOrder.price + canceledOrder.VAT) * supplier.adminFees;
                //     if (supplier.reservedBalance < 0) {
                //       supplier.reservedBalance = 0;
                //     }
                //     supplier.save();
                //   });
                // CustomerInvite.findOne({ customerEmail: order.customer.user.email, supplier: canceledOrder.supplier })
                //   .then((customerInvite) => {
                //     customerInvite.reservedBalance -= (canceledOrder.price + canceledOrder.VAT);
                //     if (customerInvite.reservedBalance < 0) {
                //       customerInvite.reservedBalance = 0;
                //     }
                //     customerInvite.save();
                //   });
                OrderProduct.find({ order: canceledOrder })
                  .select('_id order product price quantity status')
                  .populate({
                    path: 'product',
                    select: '_id arabicName englishName sku store shelf unit deleted status'
                  })
                  .then((products) => {
                    products.forEach((productObj) => {
                      productObj.status = 'Rejected';
                      productObj.save();
                    });
                    canceledOrder.customer.coverPhoto = `${appSettings.imagesUrl}${canceledOrder.customer.coverPhoto}`;
                    if (appSettings.emailSwitch) {
                      const content = {
                        recipientName: UserService.toTitleCase(order.customer.representativeName),
                        orderId: order.orderId,
                        prevStatus: order.customer.user.language === 'en' ? appSettings.Status[prevStatus].en : appSettings.Status[prevStatus].ar,
                        currentStatus: order.customer.user.language === 'en' ? appSettings.Status[order.status].en : appSettings.Status[order.status].ar,
                        orderPageUrl: `<a href=\'${appSettings.mainUrl}/customer/order/normalOrder/${order._id}\'>${appSettings.mainUrl}/customer/order/normalOrder/${order._id}</a>`, // eslint-disable-line no-useless-escape
                        loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                        rejectionReason: req.body.message,
                        productName: products[0].product.englishName
                      };
                      // order.customer.user.email
                      EmailHandler.sendEmail(order.customer.user.email, content, 'ORDERSTATUSREJECTION', order.customer.user.language);
                    }
                    const notification = {
                      refObjectId: order,
                      level: 'warning',
                      user: order.supplier,
                      userType: 'Supplier',
                      key: 'orderStatus',
                      stateParams: 'order'
                    };
                    notificationCtrl.createNotification('order', notification, prevStatus, canceledOrder.status, null, canceledOrder._id);
                    res.json(Response.success({
                      _id: canceledOrder._id,
                      orderId: canceledOrder.orderId,
                      customer: canceledOrder.customer,
                      isRecurring: canceledOrder.isReccuring,
                      canBeCanceled: canceledOrder.canBeCanceled,
                      status: canceledOrder.status,
                      createdAt: canceledOrder.createdAt,
                      updatedAt: canceledOrder.updatedAt,
                      review: canceledOrder.review,
                      message: canceledOrder.message,
                      products
                    }));
                  });
              })
              .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
          } else {
            res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
          }
        });
    } else {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(9));
    }
  }
}

/**
 * Rejects an order.
 * @param {String} req.body.rejectionReason - The rejection reason of the order.
 * @returns {Order}
 */
function reject(req, res) {
  const order = req.order;
  // Check if the user is the admin or in the staff list.
  if (checkUserInSupplier(order.supplier, req.user._id)) {
    if (order.status === 'Pending') {
      order.rejectionReason = req.body.rejectionReason;
      const prevStatus = order.status;
      order.status = 'Rejected';
      order.rejectedProductsFlag = true;
      order.updatedAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
      order.message = req.body.message;
      const log = new OrderLog({
        order: order._id,
        status: order.status,
        userName: `${order.supplier.representativeName}`,
        userType: 'Supplier',
        message: req.body.message,
        createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
      });
      log.save();
      order.save()
        .then((rejectedOrder) => {
          // Supplier.findOne({ _id: rejectedOrder.supplier })
          //   .then((supplier) => {
          //     supplier.reservedBalance -= (rejectedOrder.price + rejectedOrder.VAT) * supplier.adminFees;
          //     if (supplier.reservedBalance < 0) {
          //       supplier.reservedBalance = 0;
          //     }
          //     supplier.save();
          //   });
          // CustomerInvite.findOne({ customerEmail: order.customer.user.email, supplier: rejectedOrder.supplier })
          //   .then((customerInvite) => {
          //     customerInvite.reservedBalance -= (rejectedOrder.price + rejectedOrder.VAT);
          //     if (customerInvite.reservedBalance < 0) {
          //       customerInvite.reservedBalance = 0;
          //     }
          //     customerInvite.save();
          //   });
          OrderProduct.find({ order: rejectedOrder })
            .select('_id order product price quantity status')
            .populate({
              path: 'product',
              select: '_id arabicName englishName sku store shelf unit deleted status'
            })
            .then((products) => {
              products.forEach((productObj) => {
                productObj.status = 'Rejected';
                productObj.save();
              });
              rejectedOrder.customer.coverPhoto = `${appSettings.imagesUrl}${rejectedOrder.customer.coverPhoto}`;
              if (appSettings.emailSwitch) {
                const content = {
                  recipientName: UserService.toTitleCase(order.customer.representativeName),
                  orderId: order.orderId,
                  prevStatus: order.customer.user.language === 'en' ? appSettings.Status[prevStatus].en : appSettings.Status[prevStatus].ar,
                  currentStatus: order.customer.user.language === 'en' ? appSettings.Status[order.status].en : appSettings.Status[order.status].ar,
                  orderPageUrl: `<a href=\'${appSettings.mainUrl}/customer/order/normalOrder/${order._id}\'>${appSettings.mainUrl}/customer/order/normalOrder/${order._id}</a>`, // eslint-disable-line no-useless-escape
                  loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                  rejectionReason: req.body.message,
                  productName: products[0].product.englishName
                };
                // order.customer.user.email
                EmailHandler.sendEmail(order.customer.user.email, content, 'ORDERSTATUSREJECTION', order.customer.user.language);
              }
              const notification = {
                refObjectId: order,
                level: 'danger',
                user: order.customer.user,
                userType: 'Customer',
                key: 'orderStatus',
                stateParams: 'order'
              };
              notificationCtrl.createNotification('order', notification, prevStatus, rejectedOrder.status, null, rejectedOrder._id);
              res.json(Response.success({
                _id: rejectedOrder._id,
                orderId: rejectedOrder.orderId,
                customer: rejectedOrder.customer,
                isRecurring: rejectedOrder.isReccuring,
                canBeCanceled: rejectedOrder.canBeCanceled,
                status: rejectedOrder.status,
                createdAt: rejectedOrder.createdAt,
                updatedAt: rejectedOrder.updatedAt,
                review: rejectedOrder.review,
                message: rejectedOrder.message,
                products
              }));
            });
        })
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
    }
  } else {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
  }
}

/**
 * Rejects an order.
 * @param {String} req.body.rejectionReason - The rejection reason of the order.
 * @returns {Order}
 */
function fail(req, res) {
  const order = req.order;
  // Check if the user is the admin or in the staff list.
  if (checkUserInSupplier(order.supplier, req.user._id) || (order.driver._id.toString() === req.user._id.toString())) {
    if (order.status === 'OutForDelivery') {
      order.rejectionReason = req.body.rejectionReason;
      const prevStatus = order.status;
      order.status = 'FailedToDeliver';
      order.updatedAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
      order.message = req.body.message;
      const log = new OrderLog({
        order: order._id,
        status: order.status,
        userName: `${order.supplier.representativeName}`,
        userType: 'Supplier',
        message: req.body.message,
        createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
      });
      log.save();
      order.save()
        .then((failedOrder) => {
          OrderProduct.find({ order: failedOrder })
            .select('_id order product price quantity status')
            .populate({
              path: 'product',
              select: '_id arabicName englishName sku store shelf unit deleted status'
            })
            .then((products) => {
              failedOrder.customer.coverPhoto = `${appSettings.imagesUrl}${failedOrder.customer.coverPhoto}`;
              if (appSettings.emailSwitch) {
                const content = {
                  recipientName: UserService.toTitleCase(order.customer.representativeName),
                  orderId: order.orderId,
                  prevStatus: order.customer.user.language === 'en' ? appSettings.Status[prevStatus].en : appSettings.Status[prevStatus].ar,
                  currentStatus: order.customer.user.language === 'en' ? appSettings.Status[order.status].en : appSettings.Status[order.status].ar,
                  orderPageUrl: `<a href=\'${appSettings.mainUrl}/customer/order/normalOrder/${order._id}\'>${appSettings.mainUrl}/customer/order/normalOrder/${order._id}</a>`, // eslint-disable-line no-useless-escape
                  loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                  rejectionReason: req.body.message,
                  productName: products[0].product.englishName
                };
                // order.customer.user.email
                EmailHandler.sendEmail(order.customer.user.email, content, 'ORDERSTATUSREJECTION', order.customer.user.language);
              }
              const notification = {
                refObjectId: order,
                level: 'danger',
                user: order.customer.user,
                userType: 'Customer',
                key: 'orderStatus',
                stateParams: 'order'
              };
              notificationCtrl.createNotification('order', notification, prevStatus, failedOrder.status, null, failedOrder._id);
              res.json(Response.success({
                _id: failedOrder._id,
                orderId: failedOrder.orderId,
                customer: failedOrder.customer,
                isRecurring: failedOrder.isReccuring,
                canBeCanceled: failedOrder.canBeCanceled,
                status: failedOrder.status,
                createdAt: failedOrder.createdAt,
                updatedAt: failedOrder.updatedAt,
                review: failedOrder.review,
                message: failedOrder.message,
                products
              }));
            });
        })
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
    }
  } else {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
  }
}

/**
 * Rejects order Products
 * @param {Array} req.body.orderProducts.
 * @returns {Object} OrderProducts
 */
function rejectProducts(req, res) {
  const order = req.order;
  if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
      } else if (req.order.supplier._id.toString() === result.toString()) {
        const orderProducts = [];
        OrderProduct.find({ $and: [{ order: req.order }, { product: { $in: req.body.products } }] })
          .then((orderProductArr) => {
            orderProductArr.forEach((orderProductArrObj) => {
              orderProductArrObj.status = 'Rejected';
              orderProductArrObj.save()
                .then((rejectedOrderProduct) => {
                  orderProducts.push(rejectedOrderProduct);
                  if (orderProducts.length === orderProductArr.length) {
                    order.rejectedProductsFlag = true;
                    const newOrderPrice = rejectedOrderProduct.price * rejectedOrderProduct.quantity;
                    order.price -= newOrderPrice;
                    order.VAT = order.supplier.VATRegisterNumber > 0 ?
                      newOrderPrice * appSettings.VATPercent : 0;
                    order.updatedAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
                    order.save()
                      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR)
                        .json(Response.failure(e)));
                    if (appSettings.emailSwitch) {
                      const content = {
                        recipientName: UserService.toTitleCase(order.customer.representativeName),
                        orderId: order.orderId,
                        prevStatus: order.customer.user.language === 'en' ? appSettings.Status[order.status].en : appSettings.Status[order.status].ar,
                        currentStatus: order.customer.user.language === 'en' ? appSettings.Status[order.status].en : appSettings.Status[order.status].ar,
                        orderPageUrl: `<a href=\'${appSettings.mainUrl}/customer/order/normalOrder/${order._id}\'>${appSettings.mainUrl}/customer/order/normalOrder/${order._id}</a>`, // eslint-disable-line no-useless-escape
                        loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                        productName: orderProductArrObj.product.englishName
                      };
                      // order.customer.user.email
                      // EmailHandler.sendEmail(order.customer.user.email, content, 'ORDERSTATUS', order.customer.user.language);
                    }
                    res.json(Response.success(orderProducts));
                  }
                })
                .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
            });
          });
      } else {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
      }
    });
  }
}

/**
 * Accepts an order.
 * @param {String} req.body.acceptedProducts - The products that are accepted.
 * @returns {Order}
 */
function accept(req, res) {
  const order = req.order;
  // Check if the user is the admin or in the staff list.
  if (checkUserInSupplier(order.supplier, req.user._id)) {
    if (order.status === 'Pending' || order.status === 'Canceled' || order.status === 'Rejected') {
      // Check if all products are accepted.
      OrderProduct.find()
        .where('order').equals(order._id)
        .then((orderProducts) => {
          // if (orderProducts.length > 0) {
          //   order.rejectedProductsFlag = true;
          // }
          // Update the statuses of order products, status and price of the order.
          const prevStatus = order.status;
          order.status = 'Accepted';
          order.price = acceptOrderProducts(orderProducts, order, req.body.acceptedProducts);
          order.updatedAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
          // Update the customer's credit with the order's price
          // updateCustomerCredit(order.price, order.customer, order.supplier._id);

          // Update the supplier's credit with the fees
          // updateSupplierCredit(order.price, order.supplier._id);
          const log = new OrderLog({
            order: order._id,
            status: order.status,
            userName: `${order.supplier.representativeName}`,
            userType: 'Supplier',
            message: req.body.message,
            createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
          });
          log.save();
          order.save()
            .then((acceptedOrder) => {
              OrderProduct.find({ order: acceptedOrder })
                .select('_id order product price quantity status')
                .populate({
                  path: 'product',
                  select: '_id arabicName englishName sku store shelf unit deleted status'
                })
                .then((products) => {
                  acceptedOrder.customer.coverPhoto = `${appSettings.imagesUrl}${acceptedOrder.customer.coverPhoto}`;
                  if (appSettings.emailSwitch) {
                    const content = {
                      recipientName: UserService.toTitleCase(order.customer.representativeName),
                      orderId: order.orderId,
                      prevStatus: order.customer.user.language === 'en' ? appSettings.Status[prevStatus].en : appSettings.Status[prevStatus].ar,
                      currentStatus: order.customer.user.language === 'en' ? appSettings.Status[order.status].en : appSettings.Status[order.status].ar,
                      orderPageUrl: `<a href=\'${appSettings.mainUrl}/customer/order/normalOrder/${order._id}\'>${appSettings.mainUrl}/customer/order/normalOrder/${order._id}</a>`, // eslint-disable-line no-useless-escape
                      loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                      productName: products[0].product.englishName
                    };
                    // order.customer.user.email
                    EmailHandler.sendEmail(order.customer.user.email, content, 'ORDERSTATUS', order.customer.user.language);
                  }
                  const notification = {
                    refObjectId: order,
                    level: 'success',
                    user: order.customer.user,
                    userType: 'Customer',
                    key: 'orderStatus',
                    stateParams: 'order'
                  };
                  notificationCtrl.createNotification('order', notification, prevStatus, acceptedOrder.status, null, acceptedOrder._id);
                  res.json(Response.success({
                    _id: acceptedOrder._id,
                    orderId: acceptedOrder.orderId,
                    customer: acceptedOrder.customer,
                    isRecurring: acceptedOrder.isReccuring,
                    canBeCanceled: acceptedOrder.canBeCanceled,
                    status: acceptedOrder.status,
                    createdAt: acceptedOrder.createdAt,
                    updatedAt: acceptedOrder.updatedAt,
                    review: acceptedOrder.review,
                    message: acceptedOrder.message,
                    products
                  }));
                });
            })
            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
        });
    } else {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(10));
    }
  } else {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
  }
}

/**
 * Changes the order status to preparing.
 * @returns {Order}
 */
function prepare(req, res) {
  const order = req.order;
  // Check if the user is the admin or in the staff list.
  if (checkUserInSupplier(order.supplier, req.user._id)) {
    if (order.status === 'Accepted') {
      order.status = 'Preparing';

      order.save()
        .then(savedOrder => res.json(Response.success(savedOrder)))
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
    } else {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(10));
    }
  } else {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
  }
}

/**
 * Changes the order status to ready for delivery.
 * @returns {Order}
 */
function readyForDelivery(req, res) {
  const order = req.order;
  // Check if the user is the admin or in the staff list.
  if (checkUserInSupplier(order.supplier, req.user._id)) {
    if (order.status === 'Accepted' || order.status === 'FailedToDeliver') {
      const prevStatus = order.status;
      order.status = 'ReadyForDelivery';
      order.updatedAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
      const log = new OrderLog({
        order: order._id,
        status: order.status,
        userName: `${order.supplier.representativeName}`,
        userType: 'Supplier',
        message: req.body.message,
        createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
      });
      log.save();
      order.save()
        .then((savedOrder) => {
          OrderProduct.find({ order: savedOrder })
            .select('_id order product price quantity status')
            .populate({
              path: 'product',
              select: '_id arabicName englishName sku store shelf unit deleted status'
            })
            .then((products) => {
              savedOrder.customer.coverPhoto = `${appSettings.imagesUrl}${savedOrder.customer.coverPhoto}`;
              if (appSettings.emailSwitch) {
                const content = {
                  recipientName: UserService.toTitleCase(order.customer.representativeName),
                  orderId: order.orderId,
                  prevStatus: order.customer.user.language === 'en' ? appSettings.Status[prevStatus].en : appSettings.Status[prevStatus].ar,
                  currentStatus: order.customer.user.language === 'en' ? appSettings.Status[order.status].en : appSettings.Status[order.status].ar,
                  orderPageUrl: `<a href=\'${appSettings.mainUrl}/customer/order/normalOrder/${order._id}\'>${appSettings.mainUrl}/customer/order/normalOrder/${order._id}</a>`, // eslint-disable-line no-useless-escape
                  loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                  productName: products[0].product.englishName
                };
                // order.customer.user.email
                // EmailHandler.sendEmail(order.customer.user.email, content, 'ORDERSTATUS', order.customer.user.language);
              }
              const notification = {
                refObjectId: order,
                level: 'success',
                user: order.customer.user,
                userType: 'Customer',
                key: 'orderStatus',
                stateParams: 'order'
              };
              notificationCtrl.createNotification('order', notification, prevStatus, savedOrder.status, null, savedOrder._id);
              res.json(Response.success({
                _id: savedOrder._id,
                orderId: savedOrder.orderId,
                customer: savedOrder.customer,
                price: savedOrder.price,
                isRecurring: savedOrder.isReccuring,
                canBeCanceled: savedOrder.canBeCanceled,
                status: savedOrder.status,
                createdAt: savedOrder.createdAt,
                updatedAt: savedOrder.updatedAt,
                review: savedOrder.review,
                message: savedOrder.message,
                products
              }));
            });
        })
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
    } else {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(10));
    }
  } else {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
  }
}

/**
 * Changes the order status to out for delivery.
 * @returns {Order}
 */
function outForDelivery(req, res) {
  const order = req.order;
  // Check if the user is the admin or in the staff list.
  const respond = checkUserInSupplier(order.supplier, req.user._id);
  if (respond.includes(true)) {
    if (order.status === 'ReadyForDelivery') {
      const prevStatus = order.status;
      order.status = 'OutForDelivery';
      order.updatedAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
      User.findOne({ _id: req.body.driverId })
        .then((user) => {
          Supplier.findOne({
            $and: [{ _id: order.supplier._id },
              { staff: { $in: [req.body.driverId] } }]
          })
            .then((supplier) => {
              if (supplier) {
                order.driver = user;
                const log = new OrderLog({
                  order: order._id,
                  status: order.status,
                  userName: `${order.supplier.representativeName}`,
                  userType: 'Supplier',
                  message: req.body.message,
                  createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
                });
                log.save();
                order.save()
                  .then((savedOrder) => {
                    OrderProduct.find({ order: savedOrder })
                      .select('_id order product price quantity status')
                      .populate({
                        path: 'product',
                        select: '_id arabicName englishName sku store shelf unit deleted status'
                      })
                      .then((products) => {
                        savedOrder.customer.coverPhoto = `${appSettings.imagesUrl}${savedOrder.customer.coverPhoto}`;
                        if (appSettings.emailSwitch) {
                          const content = {
                            recipientName: UserService.toTitleCase(order.customer.representativeName),
                            orderId: order.orderId,
                            prevStatus: order.customer.user.language === 'en' ? appSettings.Status[prevStatus].en : appSettings.Status[prevStatus].ar,
                            currentStatus: order.customer.user.language === 'en' ? appSettings.Status[order.status].en : appSettings.Status[order.status].ar,
                            orderPageUrl: `<a href=\'${appSettings.mainUrl}/customer/order/normalOrder/${order._id}\'>${appSettings.mainUrl}/customer/order/normalOrder/${order._id}</a>`, // eslint-disable-line no-useless-escape
                            loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                            productName: products[0].product.englishName
                          };
                          // order.customer.user.email
                          // EmailHandler.sendEmail(order.customer.user.email, content, 'ORDERSTATUS', order.customer.user.language);
                        }
                        const notification = {
                          refObjectId: order,
                          level: 'success',
                          user: order.customer.user,
                          userType: 'Customer',
                          key: 'orderStatus',
                          stateParams: 'order'
                        };
                        notificationCtrl.createNotification('order', notification, prevStatus, savedOrder.status, null, savedOrder._id);
                        res.json(Response.success({
                          _id: savedOrder._id,
                          orderId: savedOrder.orderId,
                          customer: savedOrder.customer,
                          price: savedOrder.price,
                          isRecurring: savedOrder.isReccuring,
                          canBeCanceled: savedOrder.canBeCanceled,
                          status: savedOrder.status,
                          createdAt: savedOrder.createdAt,
                          updatedAt: savedOrder.updatedAt,
                          review: savedOrder.review,
                          message: savedOrder.message,
                          driver: savedOrder.driver,
                          products
                        }));
                      });
                  })
                  .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR)
                    .json(Response.failure(e)));
              } else {
                res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
              }
            });
        });
    } else {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(10));
    }
  } else if (order.driver._id.toString() === req.user._id.toString()) {
    const prevStatus = order.status;
    order.status = 'OutForDelivery';
    order.updatedAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
    const log = new OrderLog({
      order: order._id,
      status: order.status,
      userName: `${order.supplier.representativeName}`,
      userType: 'Supplier',
      message: req.body.message,
      createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
    });
    log.save();
    order.save()
      .then((savedOrder) => {
        OrderProduct.find({ order: savedOrder })
          .select('_id order product price quantity status')
          .populate({
            path: 'product',
            select: '_id arabicName englishName sku store shelf unit deleted status'
          })
          .then((products) => {
            savedOrder.customer.coverPhoto = `${appSettings.imagesUrl}${savedOrder.customer.coverPhoto}`;
            if (appSettings.emailSwitch) {
              const content = {
                recipientName: UserService.toTitleCase(order.customer.representativeName),
                orderId: order.orderId,
                prevStatus: order.customer.user.language === 'en' ? appSettings.Status[prevStatus].en : appSettings.Status[prevStatus].ar,
                currentStatus: order.customer.user.language === 'en' ? appSettings.Status[order.status].en : appSettings.Status[order.status].ar,
                orderPageUrl: `<a href=\'${appSettings.mainUrl}/customer/order/normalOrder/${order._id}\'>${appSettings.mainUrl}/customer/order/normalOrder/${order._id}</a>`, // eslint-disable-line no-useless-escape
                loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                productName: products[0].product.englishName
              };
              // order.customer.user.email
              EmailHandler.sendEmail(order.customer.user.email, content, 'ORDERSTATUS', order.customer.user.language);
            }
            const notification = {
              refObjectId: order,
              level: 'success',
              user: order.customer.user,
              userType: 'Customer',
              key: 'orderStatus',
              stateParams: 'order'
            };
            notificationCtrl.createNotification('order', notification, prevStatus, savedOrder.status, null, savedOrder._id);
            res.json(Response.success({
              _id: savedOrder._id,
              orderId: savedOrder.orderId,
              customer: savedOrder.customer,
              price: savedOrder.price,
              isRecurring: savedOrder.isReccuring,
              canBeCanceled: savedOrder.canBeCanceled,
              status: savedOrder.status,
              createdAt: savedOrder.createdAt,
              updatedAt: savedOrder.updatedAt,
              review: savedOrder.review,
              message: savedOrder.message,
              driver: savedOrder.driver,
              products
            }));
          });
      })
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(Response.failure(e)));
  } else {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
  }
}

/**
 * Changes the order status to delivered.
 * @returns {Order}
 */
function delivered(req, res) {
  const order = req.order;
  // Check if the user is the admin or in the staff list.
  if (checkUserInSupplier(order.supplier, req.user._id) || order.driver._id.toString() === req.user._id.toString()) {
    if (order.status === 'OutForDelivery') {
      const prevStatus = order.status;
      order.status = 'Delivered';
      order.updatedAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
      order.deliveryImage = req.body.deliveryImage || '';
      async.waterfall([
          function passParameter(callback) {
            callback(null, order.supplier, order.customer, order, order.VAT);
          },
          getUserFromCustomer,
          createDebitTransaction
        ],
        (err, result) => {
          if (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
          } else {
            debug('transaction', result);
          }
        });
      const log = new OrderLog({
        order: order._id,
        status: order.status,
        userName: `${order.supplier.representativeName}`,
        userType: 'Supplier',
        message: `${req.body.message} ..`,
        createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
      });
      log.save();
      order.save()
        .then((savedOrder) => {
          deductingFromInventory(order._id, req.user._id);
          // Supplier.findOne({ _id: savedOrder.supplier })
          //   .then((supplier) => {
          //     supplier.reservedBalance -= (savedOrder.price + savedOrder.VAT) * supplier.adminFees;
          //     console.log('supplier.reservedBalance', supplier.reservedBalance);
          //     if (supplier.reservedBalance < 0) {
          //       supplier.reservedBalance = 0;
          //     }
          //     supplier.save();
          //   });
          // CustomerInvite.findOne({ customerEmail: order.customer.user.email, supplier: savedOrder.supplier })
          //   .then((customerInvite) => {
          //     console.log('savedOrder.price + savedOrder.VAT', savedOrder.price + savedOrder.VAT);
          //     console.log('customerInvite.reservedBalance', customerInvite.reservedBalance);
          //     customerInvite.reservedBalance -= (savedOrder.price + savedOrder.VAT);
          //     console.log('customerInvite.reservedBalance', customerInvite.reservedBalance);
          //     if (customerInvite.reservedBalance < 0) {
          //       customerInvite.reservedBalance = 0;
          //     }
          //     customerInvite.save();
          //   });
          OrderProduct.find({ order: savedOrder })
            .select('_id order product price quantity status')
            .populate({
              path: 'product',
              select: '_id arabicName englishName sku store shelf unit deleted status'
            })
            .then((products) => {
              savedOrder.customer.coverPhoto = `${appSettings.imagesUrl}${savedOrder.customer.coverPhoto}`;
              if (appSettings.emailSwitch) {
                const content = {
                  recipientName: UserService.toTitleCase(order.customer.representativeName),
                  orderId: order.orderId,
                  prevStatus: order.customer.user.language === 'en' ? appSettings.Status[prevStatus].en : appSettings.Status[prevStatus].ar,
                  currentStatus: order.customer.user.language === 'en' ? appSettings.Status[order.status].en : appSettings.Status[order.status].ar,
                  orderPageUrl: `<a href=\'${appSettings.mainUrl}/customer/order/normalOrder/${order._id}\'>${appSettings.mainUrl}/customer/order/normalOrder/${order._id}</a>`, // eslint-disable-line no-useless-escape
                  loginPageUrl: `<a href=\'${appSettings.mainUrl}/auth/login\'>${appSettings.mainUrl}/auth/login</a>`, // eslint-disable-line no-useless-escape
                  productName: products[0].product.englishName
                };
                // order.customer.user.email
                // EmailHandler.sendEmail(order.customer.user.email, content, 'ORDERSTATUS', order.customer.user.language);
              }
              const notification = {
                refObjectId: order,
                level: 'success',
                user: order.customer.user,
                userType: 'Customer',
                key: 'orderStatus',
                stateParams: 'order'
              };
              notificationCtrl.createNotification('order', notification, prevStatus, savedOrder.status, null, savedOrder._id);
              res.json(Response.success({
                _id: savedOrder._id,
                orderId: savedOrder.orderId,
                customer: savedOrder.customer,
                price: savedOrder.price,
                isRecurring: savedOrder.isReccuring,
                canBeCanceled: savedOrder.canBeCanceled,
                status: savedOrder.status,
                createdAt: savedOrder.createdAt,
                updatedAt: savedOrder.updatedAt,
                review: savedOrder.review,
                message: savedOrder.message,
                products
              }));
            });
        })
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
    } else {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(10));
    }
  } else {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
  }
}

/**
 * Review an order.
 * @property {Number} req.body.overall - Overall rating.
 * @property {Number} req.body.itemCondition - Item condition rating.
 * @property {Number} req.body.delivery - Delivery rating.
 * @property {String} req.body.notes - The comment body of the review.
 * @returns {OrderReview}
 */
function review(req, res) {
  const order = req.order;
  async.waterfall([
      function passParamters(callback) {
        callback(null, req.user._id, null);
      },
      getCustomer
    ],
    (err, customer) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else if (order.customer.equals(customer._id) || order.customer.equals(customer.customer)) {
        // Check if the order is delivered
        if (order.status === 'Delivered') {
          const orderReview = new OrderReview({
            order: order._id,
            itemCondition: req.body.itemCondition,
            delivery: req.body.delivery,
            overall: req.body.overall,
            notes: req.body.notes,
            createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
          });

          orderReview.save()
            .then((savedReview) => {
              order.review = savedReview;
              order.save((savedOrder) => {
                Order.findById(order._id)
                  .populate({
                    path: 'customer',
                    select: '_id representativeName location coverPhoto user',
                    populate: {
                      path: 'user',
                      select: 'firstName lastName mobileNumber email',
                    }
                  })
                  .populate({
                    path: 'supplier',
                    select: '_id representativeName location coverPhoto staff',
                    populate: {
                      path: 'staff',
                      select: 'firstName lastName mobileNumber email',
                    }
                  })
                  .populate({
                    path: 'review',
                    select: 'itemCondition delivery overall notes createdAt'
                  })
                  .populate({
                    path: 'driver',
                    select: '_id firstName lastName email mobileNumber type'
                  })
                  .then((resultOrder) => {
                    if (appSettings.emailSwitch) {
                      const content = {
                        recipientName: UserService.toTitleCase(order.customer.representativeName),
                        orderReviewLink: `<a href=\'${appSettings.mainUrl}/supplier/orders/view/details/${order._id}\'>${appSettings.mainUrl}/supplier/orders/view/details/${order._id}</a>` // eslint-disable-line no-useless-escape
                      };
                      // order.customer.user.email
                      // EmailHandler.sendEmail(order.customer.user.email, content, 'ORDERREVIEW', order.customer.user.language);
                    }
                    const notification = {
                      refObjectId: resultOrder,
                      level: 'info',
                      user: resultOrder.supplier.staff[0],
                      userType: 'Supplier',
                      key: 'newOrderReview',
                      stateParams: 'order'
                    };
                    notificationCtrl.createNotification('order', notification, null, null, null, resultOrder._id);
                    OrderProduct.find()
                      .populate({
                        path: 'product',
                        populate: {
                          path: 'unit'
                        },
                        select: '_id arabicName englishName store sku shelf deleted quantity price status unit'
                      })
                      .where('order').equals(resultOrder._id)
                      .skip(Number(req.query.skip))
                      .limit(Number(req.query.limit))
                      .then((orderProducts) => {
                        OrderProduct.find()
                          .populate('product')
                          .where('order').equals(order._id)
                          .then((orderCount) => {
                            resultOrder.customer.coverPhoto = `${appSettings.imagesUrl}${resultOrder.customer.coverPhoto}`;
                            resultOrder.supplier.coverPhoto = `${appSettings.imagesUrl}${resultOrder.supplier.coverPhoto}`;
                            const supplierObject = {
                              _id: resultOrder.supplier._id,
                              representativeName: resultOrder.supplier.representativeName,
                              user: {
                                _id: resultOrder.supplier.staff[0]._id,
                                email: resultOrder.supplier.staff[0].email,
                                mobileNumber: resultOrder.supplier.staff[0].mobileNumber,
                                firstName: resultOrder.supplier.staff[0].firstName,
                                lastName: resultOrder.supplier.staff[0].lastName
                              },
                              coverPhoto: resultOrder.supplier.coverPhoto,
                              location: resultOrder.supplier.location
                            };
                            const resultObject = {
                              _id: resultOrder._id,
                              orderId: resultOrder.orderId,
                              customer: resultOrder.customer,
                              supplier: supplierObject,
                              price: resultOrder.price,
                              isRecurring: resultOrder.isReccuring,
                              canBeCanceled: resultOrder.canBeCanceled,
                              status: resultOrder.status,
                              createdAt: resultOrder.createdAt,
                              updatedAt: resultOrder.updatedAt,
                              products: orderProducts,
                              review: resultOrder.review,
                              message: resultOrder.message,
                              driver: resultOrder.driver,
                              count: orderCount.length,
                              VAT: resultOrder.VAT
                            };
                            res.json(Response.success(resultObject));
                          });
                      });
                  });
              })
                .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
            })
            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
        } else {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(10));
        }
      } else {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
      }
    });
}

/**
 * Get the reviews of a supplier.
 * @returns {OrderReview []}
 */
function getReviews(req, res) {
  async.waterfall([
      function passParamters(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser,
      getSupplierDeliveredOrders,
      function passParameter(deliveredOrders, callback) {
        callback(null, deliveredOrders, Number(req.query.skip), Number(req.query.limit));
      },
      getReviewsForOrders
    ],
    (err, orderReviews, skip, limit) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else if (orderReviews.length > 0) {
        const orderReviewsArr = [];
        orderReviews.forEach((orderReviewsObj) => {
          const orderCustomer = {
            _id: orderReviewsObj.order.customer._id,
            representativeName: orderReviewsObj.order.customer.representativeName,
            coverPhoto: `${appSettings.imagesUrl}${orderReviewsObj.order.customer.coverPhoto}`,
            firstName: orderReviewsObj.order.customer.user.firstName,
            lastName: orderReviewsObj.order.customer.user.lastName
          };
          const orderObject = {
            _id: orderReviewsObj.order._id,
            orderId: orderReviewsObj.order.orderId,
            customer: orderCustomer,
            price: orderReviewsObj.order.price,
            status: orderReviewsObj.order.status,
            createdAt: orderReviewsObj.order.createdAt,
            updatedAt: orderReviewsObj.order.updatedAt,
            updatedAtDay: moment(orderReviewsObj.order.updatedAt).tz(appSettings.timeZone).format('YYYY-MM-DD')
          };
          OrderProduct.find({ order: orderReviewsObj.order })
            .populate({
              path: 'product',
              select: '_id arabicName englishName status'
            })
            .then((orderProductsArr) => {
              const orderReviewsObject = {
                _id: '',
                order: '',
                products: [],
                itemCondition: '',
                delivery: '',
                overall: '',
                notes: '',
                createdAt: ''
              };
              orderReviewsObject._id = orderReviewsObj._id;
              orderReviewsObject.order = orderObject;
              orderReviewsObject.products = orderProductsArr;
              orderReviewsObject.itemCondition = orderReviewsObj.itemCondition;
              orderReviewsObject.delivery = orderReviewsObj.delivery;
              orderReviewsObject.overall = orderReviewsObj.overall;
              orderReviewsObject.notes = orderReviewsObj.notes;
              orderReviewsObject.createdAt = orderReviewsObj.createdAt;
              orderReviewsArr.push(orderReviewsObject);
              if (orderReviewsArr.length === orderReviews.length) {
                // const orderReviewsArrSkipLimit = orderReviewsArr.slice(skip, ((limit + skip) > orderReviewsArr.length ? (orderReviewsArr.length)
                //   : (limit + skip)));
                res.json(Response.success({
                  orders: orderReviewsArr,
                  count: orderReviewsArr.length
                }));
              }
            });
        });
      } else {
        res.json(Response.success({
          orders: [],
          count: 0
        }));
      }
    });
}

function reOrder(req, res) {
  const order = req.order;
  async.waterfall([
    function passParameter(callback) {
      callback(null, req.user._id);
    },
    function getCustomerFromUser(userId, callback) {
      let customerEmail = '';
      Customer.findOne({ user: userId })
        .populate('user')
        .then((customer) => {
          if (customer.type === 'Staff') {
            return Customer.findOne({ _id: customer.customer })
              .populate('user');
          }
          return customer;
        }).then((customer) => {
        if (customer) {
          customerEmail = customer.user.email;
        } else {
          customerEmail = req.user.email;
        }
        const orderTotal = order.total;
        callback(null, customerEmail, order, customer, orderTotal);
      });
    },
    checkCreditLimitWithOrder
  ], (err, result) => {
    if (err) {
      res.status(httpStatus.UNAUTHORIZED).json(err);
    } else if (result) {
      OrderProduct.find({ order: order._id })
        .then((orderProducts) => {
          if (orderProducts.length > 0) {
            Order.findOne({ _id: order._id })
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
                select: '_id representativeName user coverPhoto location',
                populate: {
                  path: 'user',
                  select: '_id email mobileNumber firstName lastName'
                }
              })
              .then((requiredOrder) => {
                let nextOrderId = '';
                nextOrderId = moment().tz(appSettings.timeZone).format('x');
                const newOrder = new Order({
                  orderId: `${appSettings.orderPrefix}${nextOrderId}`,
                  supplier: requiredOrder.supplier,
                  customer: requiredOrder.customer,
                  price: requiredOrder.price,
                  VAT: requiredOrder.VAT,
                  branch: requiredOrder.branch,
                  branchName: requiredOrder.branchName,
                  createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
                  updatedAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
                });
                const customerObject = requiredOrder.customer;
                customerObject.coverPhoto = `${appSettings.imagesUrl}${customerObject.coverPhoto}`;
                const supplierObject = {
                  _id: requiredOrder.supplier._id,
                  representativeName: requiredOrder.supplier.representativeName,
                  user: requiredOrder.supplier.staff[0],
                  coverPhoto: `${appSettings.imagesUrl}${requiredOrder.supplier.coverPhoto}`,
                  location: requiredOrder.supplier.location
                };
                OrderProduct.find({ order: requiredOrder })
                  .populate({
                    path: 'product',
                    select: '_id englishName arabicName price unit status',
                    populate: {
                      path: 'unit',
                      select: '_id englishName arabicName'
                    }
                  })
                  .then((requiredOrderProducts) => {
                    const requiredOrderProductsArr = requiredOrderProducts.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > requiredOrderProducts.length ? (requiredOrderProducts.length)
                      : (Number(req.query.limit) + Number(req.query.skip))));
                    const totalPrice = requiredOrderProducts.map(c => c.price * c.quantity)
                      .reduce((sum, value) => sum + value, 0);
                    // requiredOrder.price = totalPrice;
                    // requiredOrder.VAT = requiredOrder.supplier.VATRegisterNumber == 0 ?
                    // totalPrice * appSettings.VATPercent : 0;
                    newOrder.price = totalPrice;
                    newOrder.VAT = newOrder.supplier.VATRegisterNumber > 0 ?
                      totalPrice * appSettings.VATPercent : 0;

                    newOrder.save()
                      .then((savedOrder) => {
                        orderProducts.forEach((orderProductObj) => {
                          const orderProduct = new OrderProduct({
                            product: orderProductObj.product,
                            price: orderProductObj.price,
                            order: savedOrder,
                            quantity: orderProductObj.quantity,
                            status: 'Pending'
                          });
                          orderProduct.save()
                            .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));


                          // CustomerProductPrice.findOne({ product: orderProduct.product, customer: result, supplier: order.supplier })
                          //   .then((productSpecialPrice) => {
                          //     if (productSpecialPrice) {
                          //       orderProduct.price = productSpecialPrice.price;
                          //     }
                          //     orderProduct.save()
                          //       .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
                          //   });
                        });

                        const resultObject = {
                          _id: savedOrder._id,
                          orderId: savedOrder.orderId,
                          customer: customerObject,
                          supplier: supplierObject,
                          price: savedOrder.price,
                          isRecurring: savedOrder.isReccuring,
                          canBeCanceled: savedOrder.canBeCanceled,
                          status: savedOrder.status,
                          createdAt: savedOrder.createdAt,
                          updatedAt: savedOrder.updatedAt,
                          products: requiredOrderProductsArr,
                          review: savedOrder.review,
                          message: savedOrder.message,
                          driver: savedOrder.driver,
                          count: requiredOrderProducts.length,
                          VAT: savedOrder.VAT
                        };
                        res.json(Response.success(resultObject));
                      });
                  });
              });
          }
        });
    } else {
      res.status(httpStatus.BAD_REQUEST).json({ message: 'error in returning customer' });
    }
  });
}


/* Helper Functions */


/**
 * Helper Function
 * Load order and append to req.
 */
function load(req, res, next, id) {
  Order.findById(id)
    .populate({
      path: 'supplier',
      select: '_id representativeName adminFees staff commercialRegister location VATRegisterNumber',
      populate: {
        path: 'staff',
        select: '_id email'
      }
    })
    .populate({
      path: 'customer',
      select: '_id representativeName user coverPhoto commercialRegister location branch',
      populate: {
        path: 'user branch',
        select: '_id email mobileNumber firstName lastName language _id branchName location'
      }
    })
    .populate({
      path: 'driver',
      select: '_id firstName lastName mobileNumber'
    })
    .then((order) => {
      if (order) {
        req.order = order;
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.BAD_REQUEST).json(Response.failure(e)));
}

function loadOrderProduct(req, res, next, id) {
  OrderProduct.findById(id)
    .populate({
      path: 'product',
      select: '_id englishName arabicName price unit status',
      populate: 'unit'
    })
    .populate({
      path: 'order',
      select: '_id customer supplier status price VAT'
    })
    .then((orderProduct) => {
      if (orderProduct) {
        req.orderProduct = orderProduct;
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.BAD_REQUEST).json(Response.failure(e)));
}

/**
 * Helper Function
 * Get details of customer.
 * @property {string} userId - The id of the customer user.
 * @returns {Customer}
 */
function getCustomer(userId, orderId, callback) {
  Customer.findOne({ user: userId }).then(customer =>
    // if (customer.type === 'Staff') {
    //   return Customer.findOne({ _id: customer.customer });
    // }
    customer).then((customer) => {
    callback(null, customer, orderId);
  }).catch((err) => {
    callback(err, null, null);
  });
}

/**
 * Helper Function
 * Get branches of customer and staff.
 * @property {string} userId - The id of the customer user.
 * @returns {Customer}
 */
function getBranchesArray(userId, orderId, callback) {
  if (userId) {
    let customer = null;
    Customer.findOne({ user: userId }).then((cus) => {
      customer = cus;
      if (customer.type === 'Staff') {
        return Branches.find({ manager: customer._id }, { _id: 1 });
      }
      return Branches.find({ customer: customer._id }, { _id: 1 });
    }).then((branches) => {
      if (branches.length === 0 && customer.type === 'Staff') {
        return Branches.find({ customer: customer.customer }, { _id: 1 });
      }
      return branches;
    }).then((branches) => {
      branches = branches.map(branch => branch._id);
      callback(null, branches, orderId);
    }).catch((err) => {
      callback(err, null, null);
    });
  } else {
    callback(null, null, orderId);
  }
}

/**
 * Helper Function
 * Disable cancelling the order once the supplier views it
 * @property {string} userId - The id of the user.
 * @property {Order} orderId - The id of the order.
 * @returns {Order}
 */
function disableOrderCanceling(userId, orderId, callback) {
  Order.findByIdAndUpdate(orderId, { $set: { canBeCanceled: false } })
    .exec((err, order) => callback(err, order.customer, orderId));
}

/**
 * Helper Function
 * Get details of product and customer.
 * @property {string} orderId - The id of the order.
 * @property {string} customerId - The id of the customer user.
 * @returns {Order}
 */
function getOrder(customer, orderId, skip, limit, callback) {
  Order.findById(orderId)
    .populate({
      path: 'customer',
      select: '_id representativeName location coverPhoto user branch',
      populate: {
        path: 'user branch',
        select: 'firstName lastName mobileNumber email _id location branchName',
      }
    })
    .populate({
      path: 'supplier',
      select: '_id representativeName location coverPhoto staff VATRegisterNumber',
      populate: {
        path: 'staff',
        select: 'firstName lastName mobileNumber email',
      }
    })
    .populate({
      path: 'review',
      select: 'itemCondition delivery overall notes createdAt'
    })
    .populate({
      path: 'driver',
      select: '_id firstName lastName email mobileNumber type'
    })
    .populate('branch')
    .where('customer').equals(customer._id || customer)
    .exec((err, order) => callback(err, order, skip, limit));
}

/**
 * Helper Function
 * Get details of product and customer.
 * @property {string} order - The order.
 * @returns {Order}
 */
function getOrderProducts(order, skip, limit, callback) {
  OrderProduct.find()
    .populate({
      path: 'product',
      populate: {
        path: 'unit'
      },
      select: '_id arabicName englishName store sku shelf deleted quantity price status unit'
    })
    .where('order').equals(order._id)
    .then((orderProducts) => {
      OrderProduct.find()
        .populate('product')
        .where('order').equals(order._id)
        .then((orderCount) => {
          callback(null, { order, products: orderProducts, count: orderCount.length });
        });
    });
}

/**
 * Helper Function
 * Checks whether the user is a staff member of the supplier.
 * @property {Supplier} supplier - The supplier's details.
 * @property {string} userId - The id of the supplier user.
 * @returns {Supplier}
 */
function checkUserInSupplier(supplier, userId) {
  // Check if the user is in the staff list.
  const staffExists = supplier.staff.map((m) => {
    if (m._id.toString() === userId.toString()) {
      return true;
    }

    return false;
  });
  return staffExists;
}

/**
 * Helper Function
 * Sets the order products' status to accepted and rejected according.
 * @param {OrderProduct []} orderProducts - All the order's products.
 * @param {ObjectId []} acceptedProducts - The accepted products.
 * @returns {Number} price
 */
function acceptOrderProducts(orderProducts, order, acceptedProducts) {
  let acceptedProductPrice = 0;
  for (let index = 0; index < orderProducts.length; index += 1) {
    const orderProduct = orderProducts[index];
    // Accept the product if it's an accepted product, otherwise reject it.
    if (acceptedProducts.includes(orderProduct._id.toString())) {
      orderProduct.status = 'Accepted';
      acceptedProductPrice += orderProduct.price * orderProduct.quantity;
    } else {
      orderProduct.status = 'Rejected';
      order.rejectedProductsFlag = true;
      const newOrderPrice = order.price - orderProduct.price;
      order.price = newOrderPrice;
      order.VAT = order.supplier.VATRegisterNumber > 0 ?
        newOrderPrice * appSettings.VATPercent : 0;
      order.save();
    }
    orderProduct.save();
  }
  return acceptedProductPrice;
}

// /**
//  * Helper Function
//  * Adds the price of the order to the customer's credit balance.
//  * @param {Number} price - All the order's products.
//  * @param {ObjectId} customerId - The customer's Id.
//  * @param {ObjectId} supplierId - The supplier's Id.
//  */
// function updateCustomerCredit(price, customerId, supplierId) {
//   Credit.findOne()
//   .where('supplier').equals(supplierId)
//   .where('customer').equals(customerId)
//   .then((credit) => {
//     credit.balance += price;
//     credit.save();
//   });
// }
//
// /**
//  * Helper Function
//  * Adds the admin fees to the supplier's credit balance.
//  * @param {Number} price - All the order's products.
//  * @param {ObjectId} supplierId - The supplier's Id.
//  */
// function updateSupplierCredit(price, supplierId) {
//   Credit.findOne()
//   .where('supplier').equals(supplierId)
//   .where('isAdminFees').equals(true)
//   .then((credit) => {
//     let adminFees = price * appSettings.feePercentage;
//     adminFees = adminFees > appSettings.feeCap ? appSettings.feeCap : adminFees;
//     credit.balance += adminFees;
//
//     credit.save();
//   });
// }

/**
 * Helper Function
 * Get supplier using the user.
 * @property {string} userId - The id of the supplier user.
 * @returns {Supplier}
 */
function getSupplierFromUser(userId, callback) {
  Supplier.findOne()
    .populate('staff')
    .where('staff').in([userId])
    .exec((err, supplier) => callback(err, supplier._id));
}

/**
 * Helper Function
 * Get Customer's user details.
 * @property {string} customerId - The id of the customer.
 * @returns {User}
 */
function getUserFromCustomer(supplierId, customerId, order, vat, callback) {
  Customer.findOne({ _id: customerId })
    .then((customer) => {
      User.findOne()
        .where('_id').equals(customer.user)
        .exec(err => callback(err, supplierId, customerId, order, vat));
    });
}

/**
 * Helper Function
 * Create a debit transaction with the order.
 * @params {string} supplierId - The id of the supplier.
 * @params {string} customerEmail - The email of the customer user.
 */
function createDebitTransaction(supplierId, customerId, order, vat, callback) {
  Transaction.findOne()
    .sort({ createdAt: -1 })
    .then((transObj) => {
      let nextSUPCUSTTransId = '';
      let nextSUPTransId = '';
      if (transObj) {
        nextSUPCUSTTransId = Number(transObj.transId.slice(6)) + 1;
        nextSUPTransId = Number(transObj.transId.slice(6)) + 2;
      } else {
        nextSUPCUSTTransId = appSettings.transactionSUPCUSTIdInit;
        nextSUPTransId = appSettings.transactionSUPIdInit;
      }
      Transaction.findOne({ supplier: supplierId, customer: customerId })
        .sort({ transId: -1 })
        .then((trans) => {
          if (trans) {
            const customerTransaction = new Transaction({
              transId: '',
              order: order._id,
              supplier: supplierId,
              customer: customerId,
              amount: order.price + vat,
              type: 'debit',
              open: trans.close,
              close: trans.close - (order.price + vat),
              date: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
              createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
            });
            customerTransaction.save()
              .then((savedTransaction) => {
                Transaction.findOne({ _id: savedTransaction._id })
                  .then((newTransaction) => {
                    newTransaction.transId = `${appSettings.transactionPrefix}${nextSUPCUSTTransId}`;
                    newTransaction.save();
                  });
              })
              .catch(e => callback(e, null));
          } else {
            const customerTransaction = new Transaction({
              transId: '',
              order: order._id,
              supplier: supplierId,
              customer: customerId,
              amount: order.price + vat,
              type: 'debit',
              open: 0,
              close: 0 - (order.price + vat),
              date: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
              createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
            });
            customerTransaction.save()
              .then((savedTransaction) => {
                Transaction.findOne({ _id: savedTransaction._id })
                  .then((newTransaction) => {
                    newTransaction.transId = `${appSettings.transactionPrefix}${nextSUPCUSTTransId}`;
                    newTransaction.save();
                  });
              })
              .catch(e => callback(e, null));
          }
        });

      Transaction.findOne({ supplier: supplierId, customer: null })
        .sort({ transId: -1 })
        .then((supplierTrans) => {
          let transClose = '';
          if (supplierTrans) {
            transClose = supplierTrans.close - ((order.price + vat) * supplierId.adminFees);
            const supplierTransaction = new Transaction({
              transId: '',
              order: order._id,
              supplier: supplierId,
              amount: (order.price + vat) * supplierId.adminFees,
              type: 'debit',
              open: supplierTrans.close,
              close: transClose,
              date: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
              isAdminFees: true,
              createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
            });
            supplierTransaction.save()
              .then((savedTransaction) => {
                Transaction.findOne({ _id: savedTransaction._id })
                  .then((newTransaction) => {
                    newTransaction.transId = `${appSettings.transactionPrefix}${nextSUPTransId}`;
                    newTransaction.save();
                  });
                callback(null, savedTransaction);
              })
              .catch(e => callback(e, null));
          } else {
            transClose = 0 - ((order.price + vat) * supplierId.adminFees);
            const supplierTransaction = new Transaction({
              transId: '',
              order: order._id,
              supplier: supplierId,
              amount: (order.price + vat) * supplierId.adminFees,
              type: 'debit',
              open: 0,
              close: transClose,
              date: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
              isAdminFees: true,
              createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
            });
            supplierTransaction.save()
              .then((savedTransaction) => {
                Transaction.findOne({ _id: savedTransaction._id })
                  .then((newTransaction) => {
                    newTransaction.transId = `${appSettings.transactionPrefix}${nextSUPTransId}`;
                    newTransaction.save();
                  });
                callback(null, savedTransaction);
              })
              .catch(e => callback(e, null));
          }
          if ((supplierId.creditLimit + transClose) <= 0 && !supplierId.exceedCreditLimit) {
            supplierId.inDebit = true;
            supplierId.save();
          }
        });
    });
}

/**
 * Helper Function
 * Gets the delivered orders of the supplier
 */
function getSupplierDeliveredOrders(supplierId, callback) {
  Order.find()
    .where('supplier').equals(supplierId)
    .where('status').equals('Delivered')
    .then(deliveredOrders => callback(null, deliveredOrders))
    .catch(e => callback(e, null));
}

/**
 * Helper Function
 * Get the reviews of the orders
 */
function getReviewsForOrders(orders, skip, limit, callback) {
  // Get the IDs of supplier's delivered orders
  const orderIds = orders.map(order => order._id);
  // Get the order reviews.
  OrderReview.find()
    .sort({
      createdAt: -1
    })
    .populate({
      path: 'order',
      populate: {
        path: 'customer'
      }
    })
    .where('order').in(orderIds)
    .then(orderReviews => callback(null, orderReviews, skip, limit))
    .catch(e => callback(e, null));
}

/**
 * Helper Function
 * Get Supplier Products
 * @params {Object} supplierId
 * @returns {Array} Products
 */
function getSupplierProducts(supplierId, callback) {
  Product.find({ supplier: supplierId })
    .select('_id arabicName englishName images unit')
    .populate('unit')
    .then((productsArr) => {
      const supplierProducArr = [];
      if (productsArr.length > 0) {
        productsArr.forEach((productsArrObj) => {
          let i;
          for (i = 0; i < productsArrObj.images.length; i += 1) {
            productsArrObj.images[i] = `${appSettings.imagesUrl}${productsArrObj.images[i]}`;
          }
          supplierProducArr.push(productsArrObj);
        });
        callback(null, supplierProducArr);
      } else {
        callback(null, supplierProducArr);
      }
    });
}

/**
 * Helper Function
 * Get Supplier Order Overview
 * @params {Array} productArr
 * @returns {Array} Products
 */
function getOrderOverview(productArr, callback) {
  const products = [];
  let index = 1;
  if (productArr.length > 0) {
    productArr.forEach((productObj) => {
      const newProduct = {
        product: '',
        count: 0,
        weight: 0
      };
      newProduct.product = productObj;
      OrderProduct.find({ product: productObj, status: 'Pending' })
        .then((orderProducts) => {
          newProduct.count = orderProducts.length;
          orderProducts.forEach((orderProductsObj) => {
            newProduct.weight += orderProductsObj.quantity;
          });
          if (newProduct.count > 0) {
            products.push(newProduct);
          }
          if (index === productArr.length) {
            callback(null, products);
          }
          index += 1;
        });
    });
  } else {
    callback(null, products);
  }
}

function checkCreditLimitWithOrder(customerEmail, order, customer, orderTotal, callback) {
  // Get the credit and credit limit of the customer in parallel.
  async.parallel({
      creditLimit: (parallelCallback) => {
        CustomerInvite.findOne()
          .where('customerEmail').equals(customerEmail)
          .where('supplier').equals(order.supplier)
          .then(ci => parallelCallback(null, ci))
          .catch(e => parallelCallback(e, null));
      },
      supplierCreditLimit: (parallelCallback) => {
        Supplier.findOne({ _id: order.supplier })
          .then(ci => parallelCallback(null, ci))
          .catch(e => parallelCallback(e, null));
      }
    },
    (err, result) => {
      if (err) {
        callback(err, null);
      } else if (result.supplierCreditLimit.inDebit) {
        const outOfCreditLimit = {
          status: 'Failure',
          errorCode: 7,
          data: 'Orders are now suspended for the time being.....Try again later'
        };
        result.supplierCreditLimit.inDebit = true;
        result.supplierCreditLimit.save()
          .catch(e => callback(e, null));
        callback(outOfCreditLimit, null);
      } else if (typeof result.creditLimit.creditLimit === 'undefined') {
        const outOfCreditLimit = {
          status: 'Failure',
          errorCode: 7,
          data: 'Out of Credit'
        };
        result.creditLimit.canOrder = false;
        result.creditLimit.save()
          .catch(e => callback(e, null));
        callback(outOfCreditLimit, null);
        // Check if the credit after the order would be less than the credit limit
      } else if (result.creditLimit.exceedCreditLimit) {
        callback(null, customer);
      } else {
        // const currentDate = moment();
        // TODO: Get startDate and the latest endDate before today's date
        let fromDate = '';
        let interval = '';
        let frequency = '';
        if (result.creditLimit.paymentInterval === 'Month') {
          interval = 'M';
          frequency = result.creditLimit.paymentFrequency;
        } else if (result.creditLimit.paymentInterval === 'Week') {
          interval = 'days';
          frequency = result.creditLimit.paymentFrequency * 7;
        } else {
          interval = 'days';
          frequency = result.creditLimit.paymentFrequency;
        }
        for (let createdAtDate = moment(result.creditLimit.createdAt).tz(appSettings.timeZone);
             moment().tz(appSettings.timeZone).diff(createdAtDate) > 0;
             createdAtDate = createdAtDate.add(Number(frequency), interval)) {
          fromDate = createdAtDate.utc().format(appSettings.momentFormat);
        }
        User.findOne({ email: result.creditLimit.customerEmail })
          .then((userData) => {
            Customer.findOne({ user: userData })
              .populate({
                path: 'user'
              })
              .then((customer) => {
                const customerId = customer._id;
                // Check if in customer's interval have no payments suspended.
                Transaction.find(
                  {
                    customer: customerId,
                    supplier: order.supplier,
                    createdAt: { $gt: moment().startOf('month').tz(appSettings.timeZone).format(appSettings.momentFormat) }
                  })
                  .sort({
                    createdAt: -1
                  })
                  .then((customerTransaction) => {
                    const customerMonthCredit = 0;
                    callback(null, customer);
                    // if (customerTransaction.length > 0) {
                    //   // const startPaymentDueDate = moment(result.creditLimit.nextPaymentDueDate).subtract(Number(frequency), interval).startOf('day');
                    //   customerMonthCredit = customerTransaction.map(c => c).filter(c => c.type === 'debit' && (moment(c.createdAt) >= moment(result.creditLimit.startPaymentDate).tz(appSettings.timeZone).startOf('day') && moment(c.createdAt) <= moment(result.creditLimit.nextPaymentDueDate).tz(appSettings.timeZone).endOf('day')))
                    //     .map(c => c.amount).reduce((sum, value) => sum + value, 0);
                    //   Order.find({ $and: [{ supplier: result.supplierCreditLimit }, { customer }, { $and: [{ status: { $ne: 'Delivered' } }, { status: { $ne: 'Canceled' } }, { status: { $ne: 'CanceledByCustomer' } }, { status: { $ne: 'Rejected' } }, { status: { $ne: 'FailedToDeliver' } }] }] })
                    //     .then((orders) => {
                    //       const reservedBalance = orders.map(c => c.price + c.VAT).reduce((sum, value) => sum + value, 0); // eslint-disable-line max-len
                    //       if (orderTotal + reservedBalance + customerMonthCredit <= result.creditLimit.creditLimit) {
                    //         if (!customer.dueDateMissed) {
                    //           callback(null, customer);
                    //         } else {
                    //           const outOfCreditLimit = {
                    //             status: 'Failure',
                    //             errorCode: 7,
                    //             data: 'There are missed payment in the previous interval'
                    //           };
                    //           result.creditLimit.canOrder = false;
                    //           result.creditLimit.save()
                    //             .catch(e => callback(e, null));
                    //           callback(outOfCreditLimit, null);
                    //         }
                    //       } else {
                    //         const outOfCreditLimit = {
                    //           status: 'Failure',
                    //           errorCode: 7,
                    //           data: 'Credit limit will be reached if order is placed'
                    //         };
                    //         result.creditLimit.canOrder = ((result.creditLimit.creditLimit - customerMonthCredit) > 0 || result.creditLimit.exceedCreditLimit);
                    //         result.creditLimit.save()
                    //           .catch(e => callback(e, null));
                    //         callback(outOfCreditLimit, null);
                    //       }
                    //     });
                    // } else if (orderTotal <= result.creditLimit.creditLimit) {
                    //   if (!customer.dueDateMissed) {
                    //     callback(null, customer);
                    //   } else {
                    //     const outOfCreditLimit = {
                    //       status: 'Failure',
                    //       errorCode: 7,
                    //       data: 'There are missed payment in the previous interval'
                    //     };
                    //     result.creditLimit.canOrder = false;
                    //     result.creditLimit.save()
                    //       .catch(e => callback(e, null));
                    //     callback(outOfCreditLimit, null);
                    //   }
                    // } else {
                    //   const outOfCreditLimit = {
                    //     status: 'Failure',
                    //     errorCode: 7,
                    //     data: 'Credit limit will be reached if order is placed'
                    //   };
                    //   result.creditLimit.canOrder = ((result.creditLimit.creditLimit - customerMonthCredit) > 0 || result.creditLimit.exceedCreditLimit);
                    //   result.creditLimit.save()
                    //     .catch(e => callback(e, null));
                    //   callback(outOfCreditLimit, null);
                    // }
                  });
              });
          });
      }
    });
}


function deductingFromInventory(orderId, supplierId) {
  try {
    let ordersProducts = [],
      skuNumbers = [],
      completeData = [];

    OrderProduct.find({ order: orderId }, { product: 1, quantity: 1 }).then((orderPro) => {
      ordersProducts = orderPro;

      const productIds = ordersProducts.map(prod => prod.product);

      return Product.find({ _id: { $in: productIds } }, { sku: 1, _id: 1 });
    }).then((skuNumber) => {
      skuNumbers = skuNumber;
      const mappedSku = skuNumbers.map(prod => new RegExp(['^', prod.sku, '$'].join(''), 'i'));

      let filter = { supplierId, sku: { $in: mappedSku } };

      return Recipes.find(filter).lean();
    }).then((recipes) => {
      recipes.forEach((recipe) => {
        const findProductId = skuNumbers.find(element => element.sku.toString().toLowerCase() === recipe.sku.toString().toLowerCase());
        recipe.productId = findProductId._id;
        const findProductQuantity = ordersProducts.find(element => element.product.toString() === recipe.productId.toString());
        recipe.quantity = findProductQuantity.quantity;
        completeData.push(recipe);
      });

      async.eachOfSeries(completeData, (recipe, key, callback) => {
        recipe.addIngredients.forEach((ingId) => {
          console.log('ing', ingId);
          Ingredients.update({ _id: ingId.ingredientId }, { $inc: { quantity: parseInt(-1 * ingId.quantity * recipe.quantity) } }).exec();
        });

        callback();
      }, () => {
        return;
      });
    });
  } catch (err) {
    console.log(err);
  }
}


/**
 *  Get Orders Report
 * @property {Date} req.query.startDate
 * @property {Date} req.query.endDate
 * @returns {Report Object}
 */
function getReport(req, res) {
  // Orders Report Object
  const customerOrderReport = {
    supplierId: '',
    numberOfOrders: 0,
    totalCost: 0,
    vat: 0,
    orders: [],
    count: 0,
    branchId: ''
  };
  const supplierOrderReport = {
    supplierId: '',
    numberOfOrders: 0,
    totalCost: 0,
    vat: 0,
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

  if (req.query.export === 'pdf') {
    skip = 0;
    limit = 5000;
  }

  if (req.query.supplierId) {
    if (req.query.supplierId.length) {
      queryCond.supplier = mongoose.Types.ObjectId(req.query.supplierId);
    }
  }

  if (req.query.branchId) {
    if (req.query.branchId.length) {
      queryCond.branch = mongoose.Types.ObjectId(req.query.branchId);
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
      queryCond.customer = mongoose.Types.ObjectId(req.query.customerId);
    }
  }

  queryCond.status = 'Delivered';

  if (req.query.summaryReport) {
    async.waterfall([
        function passParamters(callback) {
          callback(null, req.query.userId, null);
        },
        getBranchesArray,
        // Get number of Orders
        function getNumberOrders(branches, orderId, callback) {
          if (!queryCond.branch && req.query.customerId && !req.query.branchId) {
            queryCond.branch = { $in: branches };
          }
          Supplier.findOne()
            .populate('staff')
            .where('staff').in([req.user._id])
            .exec((err, supplier) => {
              queryCond.supplier = supplier._id;
              const aggregatePipeLine = [{ $match: queryCond }, {
                $lookup: {
                  from: 'suppliers',
                  localField: 'supplier',
                  foreignField: '_id',
                  as: 'supplier'
                }
              }, {
                $project: {
                  orderId: 1,
                  createdAt: 1,
                  totalPrice: '$price',
                  supplierName: '$supplier.representativeName',
                  branchName: '$branchName',
                  branchId: '$branch',
                  customer: '$customer',
                  _id: 1
                }
              }, {
                $unwind: {
                  path: '$supplierName'
                }
              }, {
                $lookup: {
                  from: 'customers',
                  localField: 'customer',
                  foreignField: '_id',
                  as: 'customer'
                }
              }, {
                $unwind: {
                  path: '$customer'
                }
              }, {
                $lookup: {
                  from: 'orderproducts',
                  localField: '_id',
                  foreignField: 'order',
                  as: 'products'
                }
              }, {
                $unwind: {
                  path: '$products'
                }
              }, {
                $project: {
                  orderId: 1,
                  createdAt: 1,
                  totalPrice: '$totalPrice',
                  supplierName: '$supplierName',
                  _id: 1,
                  branchId: '$branchId',
                  productId: '$products.product',
                  productPrice: '$products.price',
                  branchName: '$branchName',
                  productQuantity: '$products.quantity',
                  customerName: '$customer.representativeName',
                  customer: '$customer._id'
                }
              }, {
                $lookup: {
                  from: 'products',
                  localField: 'productId',
                  foreignField: '_id',
                  as: 'productDetails'
                }
              }, {
                $unwind: {
                  path: '$productDetails'
                }
              }, {
                $project: {
                  orderId: 1,
                  createdAt: 1,
                  totalPrice: '$totalPrice',
                  supplierName: '$supplierName',
                  _id: 1,
                  productPrice: '$productPrice',
                  productQuantity: '$productQuantity',
                  arabicName: '$productDetails.arabicName',
                  englishName: '$productDetails.englishName',
                  branchName: '$branchName',
                  customerName: '$customerName',
                  customer: '$customer',
                  branchId: '$branchId',
                  productId: '$productId',
                }
              }, {
                $group: {
                  _id: { branchId: '$branchId', customer: '$customer' },
                  orderCount: { $sum: 1 },
                  orderId: { $first: '$orderId' },
                  // totalPrice: { $sum: { $multiply: ['$productPrice', '$productQuantity'] } },
                  orderData: { $push: '$$ROOT' }
                }
              }];

              const aggregatePipeLineVat = [{ $match: queryCond }, {
                $project: {
                  orderId: 1,
                  createdAt: 1,
                  totalPrice: '$price',
                  Vat: '$VAT',
                  branchId: '$branch',
                  customer: '$customer',
                  _id: 1
                }
              }, {
                $group: {
                  _id: { branchId: '$branchId', customer: '$customer' },
                  orderId: { $first: '$orderId' },
                  totalVat: { $sum: '$Vat' }
                }
              }];

              Order.aggregate(aggregatePipeLine)
                .then((ordersCount) => {
                  customerOrderReport.orders = ordersCount;
                  return Order.aggregate(aggregatePipeLineVat);
                }).then((orderVat) => {
                let merged = [];

                for (let i = 0; i < customerOrderReport.orders.length; i++) {
                  merged.push({
                      ...customerOrderReport.orders[i],
                      ...(orderVat.find((itmInner) => itmInner.orderId === customerOrderReport.orders[i].orderId))
                    }
                  );
                }
                customerOrderReport.orders = merged;
                callback(null);
              });
            });
        }
      ],
      (err, result) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else if (req.query.export) {
          let superTotal = 0,
            superVatTotal = 0;

          customerOrderReport.orders.forEach((upperData) => {
            superTotal += upperData.totalPrice;
            superVatTotal += upperData.totalVat;
            upperData.grandTotal = 0;
            upperData.totalPrice = 0;
            const orderData = [];
            let indexing = 0;

            upperData.orderData.forEach((order, index) => {
              const exists = orderData.findIndex(ord => ord.productId.toString() === order.productId.toString());
              if (exists === -1) {
                order.index = indexing;
                indexing++;
                order.unitTotal = parseFloat(order.productPrice * order.productQuantity).toFixed(2);
                upperData.totalPrice += (order.productPrice * order.productQuantity);
                orderData.push(order);
              } else {
                upperData.orderCount = upperData.orderCount - 1;
                orderData[exists].productQuantity = orderData[exists].productQuantity + order.productQuantity;
                upperData.totalPrice += (order.productPrice * order.productQuantity);
                orderData[exists].unitTotal = parseFloat(order.productPrice * orderData[exists].productQuantity).toFixed(2);
              }
            });
            upperData.grandTotal = parseFloat(upperData.totalPrice + upperData.totalVat).toFixed(2);
            upperData.totalPrice = parseFloat(upperData.totalPrice).toFixed(2);
            upperData.totalVat = parseFloat(upperData.totalVat).toFixed(2);
            upperData.orderData = orderData;
            upperData.startDate = moment(startDate).format('DD-MM-YYYY');
            upperData.endDate = moment(endDate).format('DD-MM-YYYY');
          });

          if (req.user.language === 'en') {
            ExportService.exportFile(`report_template/order/${req.query.export}-order-delivered-report-header-english.html`,
              `report_template/order/${req.query.export}-order-summary-report-body-english.html`, {
                orders: customerOrderReport.orders
              },
              'Orders Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
          } else {
            ExportService.exportFile(`report_template/order/${req.query.export}-order-delivered-report-header-arabic.html`,
              `report_template/order/${req.query.export}-order-summary-report-body-arabic.html`, {
                orders: customerOrderReport.orders
              },
              'تقرير الطلبات', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
          }
        } else {
          res.json(Response.success(result));
        }
      });
  } else if (req.query.detailedReport) {
    async.waterfall([
        function passParamters(callback) {
          callback(null, req.query.userId, null);
        },
        getBranchesArray,
        // Get number of Orders
        function getNumberOrders(branches, orderId, callback) {
          if (!queryCond.branch && req.query.customerId && !req.query.branchId) {
            queryCond.branch = { $in: branches };
          }
          Supplier.findOne()
            .populate('staff')
            .where('staff').in([req.user._id])
            .exec((err, supplier) => {
              queryCond.supplier = supplier._id;

              const aggregatePipeLine = [{ $match: queryCond }, {
                $lookup: {
                  from: 'suppliers',
                  localField: 'supplier',
                  foreignField: '_id',
                  as: 'supplier'
                }
              }, {
                $project: {
                  orderId: 1,
                  createdAt: 1,
                  totalPrice: '$price',
                  Vat: '$VAT',
                  supplierName: '$supplier.representativeName',
                  branchName: '$branchName',
                  _id: 1
                }
              }, {
                $unwind: {
                  path: '$supplierName'
                }
              }, {
                $lookup: {
                  from: 'orderproducts',
                  localField: '_id',
                  foreignField: 'order',
                  as: 'products'
                }
              }, {
                $unwind: {
                  path: '$products'
                }
              }, {
                $project: {
                  orderId: 1,
                  createdAt: 1,
                  totalPrice: '$totalPrice',
                  Vat: '$Vat',
                  supplierName: '$supplierName',
                  _id: 1,
                  productId: '$products.product',
                  productPrice: '$products.price',
                  branchName: '$branchName',
                  productQuantity: '$products.quantity'
                }
              }, {
                $lookup: {
                  from: 'products',
                  localField: 'productId',
                  foreignField: '_id',
                  as: 'productDetails'
                }
              }, {
                $unwind: {
                  path: '$productDetails'
                }
              }, {
                $project: {
                  orderId: 1,
                  createdAt: 1,
                  totalPrice: '$totalPrice',
                  Vat: '$Vat',
                  supplierName: '$supplierName',
                  _id: 1,
                  productPrice: '$productPrice',
                  productQuantity: '$productQuantity',
                  arabicName: '$productDetails.arabicName',
                  englishName: '$productDetails.englishName',
                  branchName: '$branchName',
                }
              }, {
                $group: {
                  _id: '$createdAt',
                  orderId: { $first: '$orderId' },
                  orderCount: { $sum: 1 },
                  totalVat: { $first: '$Vat' },
                  totalPrice: { $sum: { $multiply: ['$productPrice', '$productQuantity'] } },
                  orderData: { $push: '$$ROOT' }
                }
              }];

              Order.aggregate(aggregatePipeLine)
                .then((ordersCount) => {
                  customerOrderReport.orders = ordersCount;
                  callback(null);
                });
            });
        }
      ],
      (err, result) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else if (req.query.export) {
          let superTotal = 0,
            superVatTotal = 0;

          customerOrderReport.orders.forEach((upperData) => {
            superTotal += upperData.totalPrice;
            superVatTotal += upperData.totalVat;
            upperData.totalPrice = upperData.totalPrice ? upperData.totalPrice.toFixed(2) : 0;
            upperData.totalVat = upperData.totalVat ? upperData.totalVat.toFixed(2) : 0;
            upperData.orderData.forEach((order, index) => {
              order.index = index;
            });
          });

          superTotal = superTotal.toFixed(2);
          superVatTotal = superVatTotal.toFixed(2);

          if (req.user.language === 'en') {
            ExportService.exportFile(`report_template/order/${req.query.export}-order-delivered-report-header-english.html`,
              `report_template/order/${req.query.export}-order-delivered-report-body-english.html`, {
                orders: customerOrderReport.orders,
                superTotal,
                superVatTotal
              },
              'Orders Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
          } else {
            ExportService.exportFile(`report_template/order/${req.query.export}-order-delivered-report-header-arabic.html`,
              `report_template/order/${req.query.export}-order-delivered-report-body-arabic.html`, {
                orders: customerOrderReport.orders,
                superTotal,
                superVatTotal
              },
              'تقرير الطلبات', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
          }
        } else {
          res.json(Response.success(result));
        }
      });
  } else if (req.user.type === 'Supplier') {
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
            .filter(deliveredOrder => deliveredOrder.status === 'Delivered')
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
                  totalPrice: obj.price + obj.VAT
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
                  totalPrice: obj.price + obj.VAT
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
  } else if (req.user.type === 'Customer') {
    async.waterfall([
        function passParamters(callback) {
          callback(null, req.user._id, null);
        },
        getBranchesArray,
        // Get number of Orders
        function getNumberOrders(branches, orderId, callback) {
          if (!queryCond.branch) {
            queryCond.branch = { $in: branches };
          }
          const aggregatePipeLine = [{ $match: queryCond }, {
            $lookup: {
              from: 'suppliers',
              localField: 'supplier',
              foreignField: '_id',
              as: 'supplier'
            }
          }, {
            $project: {
              orderId: 1,
              createdAt: 1,
              totalPrice: '$price',
              Vat: '$VAT',
              supplierName: '$supplier.representativeName',
              branchName: '$branchName',
              _id: 1
            }
          }, {
            $unwind: {
              path: '$supplierName'
            }
          }, {
            $lookup: {
              from: 'orderproducts',
              localField: '_id',
              foreignField: 'order',
              as: 'products'
            }
          }, {
            $unwind: {
              path: '$products'
            }
          }, {
            $project: {
              orderId: 1,
              createdAt: 1,
              totalPrice: '$totalPrice',
              Vat: '$Vat',
              supplierName: '$supplierName',
              _id: 1,
              productId: '$products.product',
              productPrice: '$products.price',
              branchName: '$branchName',
              productQuantity: '$products.quantity'
            }
          }, {
            $lookup: {
              from: 'products',
              localField: 'productId',
              foreignField: '_id',
              as: 'productDetails'
            }
          }, {
            $unwind: {
              path: '$productDetails'
            }
          }, {
            $project: {
              orderId: 1,
              createdAt: 1,
              totalPrice: '$totalPrice',
              Vat: '$Vat',
              supplierName: '$supplierName',
              _id: 1,
              productPrice: '$productPrice',
              productQuantity: '$productQuantity',
              arabicName: '$productDetails.arabicName',
              englishName: '$productDetails.englishName',
              branchName: '$branchName',
            }
          }, {
            $group: {
              _id: '$createdAt',
              orderId: { $first: '$orderId' },
              orderCount: { $sum: 1 },
              totalVat: { $first: '$Vat' },
              totalPrice: { $sum: { $multiply: ['$productPrice', '$productQuantity'] } },
              orderData: { $push: '$$ROOT' }
            }
          }];

          Order.aggregate(aggregatePipeLine)
            .then((ordersCount) => {
              customerOrderReport.orders = ordersCount;
              callback(null);
            });
        }
      ],
      (err, result) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        } else if (req.query.export) {
          let superTotal = 0,
            superVatTotal = 0;

          customerOrderReport.orders.forEach((upperData) => {
            superTotal += upperData.totalPrice;
            superVatTotal += upperData.totalVat;
            upperData.totalPrice = upperData.totalPrice ? upperData.totalPrice.toFixed(2) : 0;
            upperData.totalVat = upperData.totalVat ? upperData.totalVat.toFixed(2) : 0;
            upperData.orderData.forEach((order, index) => {
              order.index = index;
            });
          });

          superTotal = superTotal.toFixed(2);
          superVatTotal = superVatTotal.toFixed(2);

          if (req.user.language === 'en') {
            ExportService.exportFile(`report_template/order/${req.query.export}-order-delivered-report-header-english.html`,
              `report_template/order/${req.query.export}-order-delivered-report-body-english.html`, {
                orders: customerOrderReport.orders,
                superTotal,
                superVatTotal
              },
              'Orders Report', `From: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} To: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
          } else {
            ExportService.exportFile(`report_template/order/${req.query.export}-order-delivered-report-header-arabic.html`,
              `report_template/order/${req.query.export}-order-delivered-report-body-arabic.html`, {
                orders: customerOrderReport.orders,
                superTotal,
                superVatTotal
              },
              'تقرير الطلبات', `من: ${moment(startDate).tz(appSettings.timeZone).format('DD-MM-YYYY')} إلى: ${moment(endDate).tz(appSettings.timeZone).format('DD-MM-YYYY')}`, req.query.export, res);
          }
        } else {
          res.json(Response.success(result));
        }
      });
  }
}

export default {
  load,
  loadOrderProduct,
  get,
  getOverview,
  getHistory,
  getCounts,
  getLog,
  list,
  addProductToOrder,
  updateProductInOrder,
  deleteProductFromOrder,
  cancel,
  reject,
  fail,
  rejectProducts,
  accept,
  prepare,
  readyForDelivery,
  outForDelivery,
  delivered,
  review,
  getReviews,
  deliveryNote,
  orderPurchase,
  reOrder,
  getReport
};
