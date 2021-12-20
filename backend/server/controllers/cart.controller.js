import httpStatus from 'http-status';
import async from 'async';
import moment from 'moment-timezone';
import userService from '../services/user.service';
import EmailHandler from '../../config/emailHandler';
import appSettings from '../../appSettings';
import Cart from '../models/cart.model';
import Product from '../models/product.model';
import CartProduct from '../models/cartProduct.model';
import Customer from '../models/customer.model';
import Order from '../models/order.model';
import OrderLog from '../models/orderLog.model';
import RecurringOrder from '../models/recurringOrder.model';
import OrderProduct from '../models/orderProduct.model';
import CustomerInvite from '../models/customerInvite.model';
import CustomerProductPrice from '../models/customerProductPrice.model';
import Response from '../services/response.service';
import Transaction from '../models/transaction.model';
import User from '../models/user.model';
import Supplier from '../models/supplier.model';
import ExportService from './exportFileService';
import notificationCtrl from '../controllers/notification.controller';
import Branch from '../models/branch.model';

/**
 * Add product to cart:
 * if there is no product in the cart, create one.
 * if there is a product in the cart, add to it.
 * @property {string} req.body.product - The product that is getting added to the cart.
 * @property {int} req.body.quantity - The quantity of the product added to the cart.
 * @returns {Cart}
 */
function addToCart(req, res) {
  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParamters(callback) {
      callback(null, req.user.email, req.body.product, req.user._id, req.body.quantity);
    },
      // Gets the product and customer in parallel.
    getProductAndCustomer,
      // Gets the cart based on the customer and supplier.
    getCart,
      // Set the product's special price
    setProductCustomPrice,
      // Adds the product to cart, or increment its quantity if it's added.
    addProductToCart,
    function passParameter(currentCart, callback) {
      callback(null, currentCart, null, null);
    },
    getBalanceDetails
  ],
    (err, result) => {
      if (err) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
      } else {
        let totalPrice = 0;
        result.cart.products.forEach((productObj) => {
          totalPrice += productObj.price * productObj.quantity;
        });
        result.cart.products.sort((a, b) => // eslint-disable-line no-confusing-arrow
          (a.createdAt < b.createdAt) ? -1 : // eslint-disable-line no-nested-ternary
            ((a.createdAt > b.createdAt) ? 1 : 0)); // eslint-disable-line no-nested-ternary
        Customer.findOne({ _id: result.cart.customer })
          .select('_id representativeName')
          .then((custObj) => {
            const resultObject = {
              balanceDetails: result.balanceDetails,
              cart: {
                _id: result.cart._id,
                customer: custObj,
                supplier: result.cart.supplier,
                isRecurring: result.cart.isReccuring,
                createdAt: result.cart.createdAt,
                products: result.cart.products
              },
              items: result.cart.products.map(c => c.quantity)
                .reduce((sum, value) => sum + value, 0),
              total: result.cart.supplier.VATRegisterNumber > 0 ? totalPrice * appSettings.VAT : totalPrice,
              vat: result.cart.supplier.VATRegisterNumber > 0 ? totalPrice * appSettings.VATPercent : 0
            };
            res.json(Response.success(resultObject));
          });
      }
    });
}

/**
 * Get cart list.
 * @returns {Cart[]}
 */
function list(req, res) {
  async.waterfall([
    function passParamters(callback) {
      callback(null, req.user._id);
    },
    getCustomer,
    getCustomerCarts
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
 * Get cart
 * @returns {Cart}
 */
function get(req, res) {
  // Check if the customer owns this cart
  if (typeof req.cart.length === 'undefined') {
    if (req.cart.customer.user.equals(req.user._id.toString())) {
      const totalPrice = req.cart.products.map(c => c.price * c.quantity)
        .reduce((sum, value) => sum + value, 0);
      res.json(Response.success({
        cart: req.cart,
        total: req.cart.supplier.VATRegisterNumber > 0 ? totalPrice * appSettings.VAT : totalPrice,
        vat: req.cart.supplier.VATRegisterNumber > 0 ? totalPrice * appSettings.VATPercent : 0
      }));
    } else {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
    }
  } else {
    const toDate = moment()// eslint-disable-line no-unused-vars
      .tz(appSettings.timeZone)
      .format(appSettings.momentFormat);
    const fromDate = ''; // eslint-disable-line no-unused-vars
    const cart = req.cart.map(c => c)
      .filter(c => c.customer.user.toString() === req.user._id.toString());
    if (cart.length > 0) {
      const totalPrice = cart[0].products.map(c => c.price * c.quantity)
        .reduce((sum, value) => sum + value, 0);
      const items = cart[0].products.map(c => c.quantity)
        .reduce((sum, value) => sum + value, 0);

      let customerObject = null;
      let inviteObject = null;

      Customer.findOne({ user: req.user._id }).populate('user').then((customerObjects) => {
        if (customerObjects.type === 'Staff') {
          return Customer.findOne({ _id: customerObjects.customer }).populate('user');
        }
        return customerObjects;
      }).then((customerObjects) => {
        customerObject = customerObjects;
        return CustomerInvite.findOne({
          customerEmail: customerObject.user ? customerObject.user.email : '',
          supplier: cart[0].supplier
        });
      }).then((inviteObjects) => {
        inviteObject = inviteObjects;
        return Transaction.find({
          customer: customerObject,
          supplier: cart[0].supplier,
          createdAt: { $gt: moment().startOf('month').tz(appSettings.timeZone).format(appSettings.momentFormat) }
        }).sort({
          createdAt: -1
        });
      }).then((customerTransaction) => {
        let customerBalance = '';
        if (customerTransaction.length > 0) {
          customerBalance = customerTransaction[0].close;
        } else {
          customerBalance = 0;
        }
        // const startPaymentDueDate = moment(inviteObject.nextPaymentDueDate).subtract(Number(frequency), interval).startOf('day');
        const customerMonthCredit = customerTransaction.map(c => c).filter(c => c.type === 'debit' && (moment(c.createdAt) >= moment(inviteObject.startPaymentDate).tz(appSettings.timeZone).startOf('day') && moment(c.createdAt) <= moment(inviteObject.nextPaymentDueDate).tz(appSettings.timeZone).endOf('day')))
          .map(c => c.amount).reduce((sum, value) => sum + value, 0);
        Order.find({ $and: [{ supplier: cart[0].supplier }, { customer: customerObject }, { status: { $ne: 'Delivered' } }, { status: { $ne: 'Canceled' } }, { status: { $ne: 'CanceledByCustomer' } }, { status: { $ne: 'Rejected' } }, { status: { $ne: 'FailedToDeliver' } }] })
          .then((orders) => {
            const reservedBalance = orders.map(c => c.price + c.VAT)
              .reduce((sum, value) => sum + value, 0);
            const balanceDetails = {
              balance: customerBalance, // + (customerBalance * appSettings.VATPercent),
              monthCredit: (Math.abs(customerMonthCredit) + reservedBalance),
              payment: {
                interval: inviteObject.paymentInterval,
                frequency: inviteObject.paymentFrequency
              },
              days: inviteObject.days,
              creditLimit: inviteObject.creditLimit,
              exceedCreditLimit: inviteObject.exceedCreditLimit,
              exceedPaymentDate: inviteObject.exceedPaymentDate,
              canOrder: ((inviteObject.creditLimit - customerMonthCredit) > 0
                || inviteObject.exceedCreditLimit)
            };
            cart[0].supplier.coverPhoto = `${appSettings.imagesUrl}${cart[0].supplier.coverPhoto}`;
            const cartObject = {
              balanceDetails,
              cart: {
                _id: cart[0]._id,
                supplier: cart[0].supplier,
                customer: {
                  _id: cart[0].customer._id,
                  representativeName: cart[0].customer.representativeName,
                  coverPhoto: `${appSettings.imagesUrl}${cart[0].customer.coverPhoto}`,
                  location: cart[0].customer.location,
                },
                VAT: cart[0].supplier.VATRegisterNumber,
                createdAt: cart[0].createdAt,
                products: cart[0].products
              },
              items,
              total: cart[0].supplier.VATRegisterNumber > 0 ? totalPrice * appSettings.VAT : totalPrice,
              vat: cart[0].supplier.VATRegisterNumber > 0 ? totalPrice * appSettings.VATPercent : 0
            };
            res.json(Response.success(cartObject));
          });
      });
    } else {
      let customerObject = null;
      let inviteObject = null;
      let supplierObject = null;

      Customer.findOne({ user: req.user._id }).populate('user').then((customerObjects) => {
        if (customerObjects.type === 'Staff') {
          return Customer.findOne({ _id: customerObjects.customer }).populate('user');
        }
        return customerObjects;
      }).then((customerObjects) => {
        customerObject = customerObjects;
        return CustomerInvite.findOne({
          customerEmail: customerObject.user ? customerObject.user.email : '',
          supplier: req.params.supplierId
        });
      }).then((inviteObjects) => {
        inviteObject = inviteObjects;

        return Supplier.findOne({ _id: req.params.supplierId })
          .select('_id representativeName location coverPhoto');
      }).then((supplierObjects) => {
        supplierObject = supplierObjects;
        return Transaction.find({
          customer: customerObject,
          supplier: supplierObject,
          createdAt: { $gt: moment().startOf('month').tz(appSettings.timeZone).format(appSettings.momentFormat) }
        }).sort({
          createdAt: -1
        });
      }).then((customerTransaction) => {
        let customerBalance = '';
        if (customerTransaction.length > 0) {
          customerBalance = customerTransaction[0].close;
        } else {
          customerBalance = 0;
        }
        // const startPaymentDueDate = moment(inviteObject.nextPaymentDueDate).subtract(Number(frequency), interval).startOf('day');
        const customerMonthCredit = customerTransaction.map(c => c).filter(c => c.type === 'debit' && (moment(c.createdAt) >= moment(inviteObject.startPaymentDate).tz(appSettings.timeZone).startOf('day') && moment(c.createdAt) <= moment(inviteObject.nextPaymentDueDate).tz(appSettings.timeZone).endOf('day')))
          .map(c => c.amount).reduce((sum, value) => sum + value, 0);
        Order.find({ $and: [{ supplier: supplierObject }, { customer: customerObject }, { $and: [{ status: { $ne: 'Delivered' } }, { status: { $ne: 'Canceled' } }, { status: { $ne: 'CanceledByCustomer' } }, { status: { $ne: 'Rejected' } }, { status: { $ne: 'FailedToDeliver' } }] }] })
          .then((orders) => {
            const reservedBalance = orders.map(c => c.price + c.VAT)
              .reduce((sum, value) => sum + value, 0);
            const balanceDetails = {
              balance: customerBalance, // + (customerBalance * appSettings.VATPercent),
              monthCredit: (Math.abs(customerMonthCredit) + reservedBalance),
              payment: {
                interval: inviteObject.paymentInterval,
                frequency: inviteObject.paymentFrequency
              },
              days: inviteObject.days,
              creditLimit: inviteObject.creditLimit,
              exceedCreditLimit: inviteObject.exceedCreditLimit,
              exceedPaymentDate: inviteObject.exceedPaymentDate,
              canOrder: ((inviteObject.creditLimit - customerMonthCredit) > 0
                || inviteObject.exceedCreditLimit)
            };
            supplierObject.coverPhoto = `${appSettings.imagesUrl}${supplierObject.coverPhoto}`;
            const cartObject = {
              balanceDetails,
              cart: {
                _id: null,
                supplier: supplierObject,
                customer: {
                  _id: customerObject._id,
                  representativeName: customerObject.representativeName,
                  coverPhoto: `${appSettings.imagesUrl}${customerObject.coverPhoto}`,
                  location: customerObject.location,
                },
                VAT: 0,
                createdAt: null,
                products: []
              },
              items: 0,
              total: 0,
              vat: 0
            };
            res.json(Response.success(cartObject));
          });
      });
    }
  }
}

/**
 * Delete cart.
 * @returns {Cart}
 */
function remove(req, res) {
  const cart = req.cart;
  // Check if the customer owns this cart
  if (cart.customer.user.equals(req.user._id) || cart.customer.staff.indexOf(req.user._id) >= 0) {
    cart.remove()
      .then(deletedCart => res.json(Response.success(deletedCart)))
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  } else {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
  }
}

/**
 * Checkout cart.
 * @property {string} req.body.orderIntervalType - The interval of the recurring order type (D/W/M).
 * @property {int} req.body.orderFrequency - The frequency of the recurring order.
 * @property {Date} req.body.startDate - The date the recurring order starts.
 * @returns {Cart}
 */
function checkout(req, res) {
  const cart = req.cart;
  // Check that the user is the logged in the customer
  if (cart.customer.user.equals(req.user._id) || cart.customer.staff.indexOf(req.user._id) >= 0) {
    // Check if cart is empty
    if (cart.products.length > 0) {
      // Checking if order is recurring
      if (req.body !== null && typeof req.body.orderIntervalType === 'string') {
        const currDate = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
        let nextDate = '';
        if (req.body.orderIntervalType.toString() === 'Month') {
          nextDate = moment().add(req.body.orderFrequency, 'M').tz(appSettings.timeZone).format(appSettings.momentFormat);
        }
        if (req.body.orderIntervalType.toString() === 'Day') {
          nextDate = moment().add(req.body.orderFrequency, 'days').tz(appSettings.timeZone).format(appSettings.momentFormat);
        }
        if (req.body.orderIntervalType.toString() === 'Week') {
          nextDate = moment().add(req.body.orderFrequency, 'week').tz(appSettings.timeZone).format(appSettings.momentFormat);
        }

        async.waterfall([
          function passParamters(callback) {
            let customerEmail = '';
            Customer.findOne({ user: req.user._id })
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
                callback(null, customerEmail, req.cart);
              });
          },
          checkCreditLimitWithOrder,
          function passParameter(cartData, orderPrice, callback) {
            Branch.findOne({ _id: req.query.branchId })
              .then((branch) => {
                callback(null, cartData, orderPrice, branch, branch.branchName, req.body);
              });
          },
          createOrder,
          function passParameter(currentCart, order, products, callback) {
            callback(null, currentCart, order, products);
          },
          getBalanceDetails
        ], (err, result) => {
          if (err) {
            res.status(httpStatus.BAD_REQUEST).json(err);
          } else if (result) {
            result.order.isReccuring = true;
            result.order.save()
              .then((savedOrder) => {
                const recurringOrderObject = {
                  orderId: savedOrder.orderId,
                  products: cart.products,
                  orderIntervalType: req.body.orderIntervalType,
                  orderFrequency: req.body.orderFrequency,
                  customer: cart.customer,
                  supplier: cart.supplier,
                  branch: req.query.branchId,
                  createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
                  updatedAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
                  days: moment(nextDate).tz(appSettings.timeZone).diff(moment(currDate), 'days')
                };

                recurringOrderObject.startDate = moment().tz(appSettings.timeZone).add(recurringOrderObject.days * recurringOrderObject.orderFrequency, 'days').format(appSettings.momentFormat);

                const recurringOrder = new RecurringOrder(recurringOrderObject);

                recurringOrder.save()
                  .then((savedRecurOrder) => {
                    // Delete the cart after recurring order creation is successful
                    cart.remove();
                    if (appSettings.emailSwitch) {
                      let content = {
                        recipientName: userService.toTitleCase(cart.customer.representativeName),
                        orderId: savedRecurOrder.orderId,
                        orderPageUrl: `<a href=\'${appSettings.mainUrl}/supplier/orders/view/details/${result.order._id}\'>${appSettings.mainUrl}/supplier/orders/view/details/${result.order._id}</a>` // eslint-disable-line no-useless-escape
                      };
                      EmailHandler.sendEmail(req.user.email, content, 'CHECKOUTCART', req.user.language);

                      content = {
                        recipientName: userService.toTitleCase(cart.supplier.representativeName),
                        orderId: savedRecurOrder.orderId,
                        orderPageUrl: `<a href=\'${appSettings.mainUrl}/supplier/orders/view/details/${result.order._id}\'>${appSettings.mainUrl}/supplier/orders/view/details/${result.order._id}</a>` // eslint-disable-line no-useless-escape
                      };
                      EmailHandler.sendEmail(cart.supplier.staff[0].email, content, 'NEWSUPPLIERORDER', req.user.language);
                    }
                    const resultCart = {
                      _id: null,
                      customer: cart.customer,
                      supplier: cart.supplier,
                      VAT: 0,
                      isReccuring: false,
                      products: []
                    };
                    const notification = {
                      refObjectId: savedRecurOrder,
                      level: 'success',
                      user: cart.supplier.staff[0],
                      userType: 'Supplier',
                      key: 'newOrder',
                      stateParams: 'order'
                    };
                    notificationCtrl.createNotification('order', notification, null, null, null, savedRecurOrder._id);
                    res.json(Response.success({
                      balanceDetails: result.balanceDetails,
                      cart: resultCart
                    }));// eslint-disable-line max-len
                  })
                  .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e))); // eslint-disable-line max-len
              });
          }
        });
      } else {
        async.waterfall([
            // Function that passes the parameters to the second function.
          function passParamters(callback) {
            let customerEmail = '';
            Customer.findOne({ user: req.user._id })
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
                  callback(null, customerEmail, req.cart);
                });
          },
          checkCreditLimitWithOrder,
          function passParameter(cart, orderPrice, callback) {
            Branch.findOne({ _id: req.query.branchId })
                .then((branch) => {
                  callback(null, cart, orderPrice, branch, branch.branchName, req.body);
                });
          },
          createOrder,
          function passParameter(currentCart, order, products, callback) {
            callback(null, currentCart, order, products);
          },
          getBalanceDetails
        ],
          (err, result) => {
            if (err) {
              res.status(httpStatus.BAD_REQUEST).json(err);
            } else if (result.order) {
              if (req.query.export) {
                if (req.user.language === 'en') {
                  ExportService.exportReceiptFile('report_template/main_header/english_header.html',
                    'report_template/orders/orders-body-english.html', {
                      order: result.order,
                      products: result.products
                    },
                    'Purchase Order', `${moment().tz(appSettings.timeZone).format('DD-MM-YYYY')}`, 'pdf', res);
                  // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                } else {
                  ExportService.exportReceiptFile('report_template/main_header/arabic_header.html',
                    'report_template/orders/orders-body-arabic.html', {
                      order: result.order,
                      products: result.products
                    },
                    'فاتورة الطلب', `${moment().tz(appSettings.timeZone).format('DD-MM-YYYY')}`, 'pdf', res);
                  // res.download(`report.${req.query.export}`, `SUPReport.${req.query.export}`);
                }
              } else if (appSettings.emailSwitch) {
                let content = {
                  recipientName: userService.toTitleCase(cart.customer.representativeName),
                  orderId: result.order.orderId,
                  orderPageUrl: `<a href=\'${appSettings.mainUrl}/supplier/orders/view/details/${result.order._id}\'>${appSettings.mainUrl}/supplier/orders/view/details/${result.order._id}</a>` // eslint-disable-line no-useless-escape
                };
                EmailHandler.sendEmail(req.user.email, content, 'CHECKOUTCART', req.user.language);

                content = {
                  recipientName: userService.toTitleCase(cart.supplier.representativeName),
                  orderId: result.order.orderId,
                  orderPageUrl: `<a href=\'${appSettings.mainUrl}/supplier/orders/view/details/${result.order._id}\'>${appSettings.mainUrl}/supplier/orders/view/details/${result.order._id}</a>` // eslint-disable-line no-useless-escape
                };
                EmailHandler.sendEmail(cart.supplier.staff[0].email, content, 'NEWSUPPLIERORDER', req.user.language);
              }
              const resultCart = {
                _id: null,
                customer: cart.customer,
                supplier: cart.supplier,
                VAT: 0,
                isReccuring: false,
                products: []
              };
              const notification = {
                refObjectId: result.order,
                level: 'success',
                user: cart.supplier.staff[0],
                userType: 'Supplier',
                key: 'newOrder',
                stateParams: 'order'
              };
              notificationCtrl.createNotification('order', notification, null, null, null, result.order._id);
              res.json(Response.success({
                balanceDetails: result.balanceDetails,
                cart: resultCart
              }));
            }
          });
      }
    } else {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(5));
    }
  } else {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
  }
}

/**
 * Update quantity of product in cart.
 * @property {string} req.params.product - The id of the product.
 * @property {int} req.body.quantity - The new quantity of the product.
 * @returns {Cart}
 */
function updateProductQuantity(req, res) {
  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParamters(callback) {
      callback(null, req.user.email, req.params.product, req.user._id, req.query.quantity);
    },
      // Gets the product and customer in parallel.
    getProductAndCustomer,
      // Gets the cart based on the customer and supplier.
    getCart,
      // Updates product quantity in cart.
    updateProductQuantityInCart,
    function passParameter(currentCart, callback) {
      callback(null, currentCart, null, null);
    },
    getBalanceDetails
  ],
    (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        let totalPrice = 0;
        let resultObject = {};
        Customer.findOne({ _id: result.cart.customer })
          .select('_id representativeName')
          .then((customerObj) => {
            if (result.cart.products.length > 0) {
              result.cart.products.forEach((productObj) => {
                totalPrice += productObj.price * productObj.quantity;
              });
              result.cart.products.sort((a, b) => // eslint-disable-line no-confusing-arrow
                (a.createdAt < b.createdAt) ? -1 : // eslint-disable-line no-nested-ternary
                  ((a.createdAt > b.createdAt) ? 1 : 0)); // eslint-disable-line no-nested-ternary
              resultObject = {
                balanceDetails: result.balanceDetails,
                cart: {
                  _id: result.cart._id,
                  customer: customerObj,
                  supplier: result.cart.supplier,
                  isRecurring: result.cart.isReccuring,
                  createdAt: result.cart.createdAt,
                  products: result.cart.products,
                },
                items: result.cart.products.map(c => c.quantity)
                  .reduce((sum, value) => sum + value, 0),
                total: result.cart.supplier.VATRegisterNumber > 0 ? totalPrice * appSettings.VAT : totalPrice,
                vat: result.cart.supplier.VATRegisterNumber > 0 ? totalPrice * appSettings.VATPercent : 0
              };
            } else {
              result.cart.products.sort((a, b) => // eslint-disable-line no-confusing-arrow
                (a.createdAt < b.createdAt) ? -1 : // eslint-disable-line no-nested-ternary
                  ((a.createdAt > b.createdAt) ? 1 : 0)); // eslint-disable-line no-nested-ternary
              resultObject = {
                balanceDetails: result.balanceDetails,
                cart: {
                  _id: result.cart._id,
                  customer: customerObj,
                  supplier: result.cart.supplier,
                  isRecurring: result.cart.isReccuring,
                  createdAt: result.cart.createdAt,
                  products: result.cart.products,
                },
                items: 0,
                total: 0,
                vat: result.cart.supplier.VATRegisterNumber > 0 ? totalPrice * appSettings.VATPercent : 0
              };
            }
            res.json(Response.success(resultObject));
          });
      }
    });
}

/**
 * Remove product from cart
 * @property {string} req.params.product - The id of the product.
 * @returns {Cart}
 */
function removeProduct(req, res) {
  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParamters(callback) {
      callback(null, req.user.email, req.params.product, req.user._id, 0);
    },
      // Gets the product and customer in parallel.
    getProductAndCustomer,
      // Gets the cart based on the customer and supplier.
    getCart,
      // Removes product from cart.
    removeProductFromCart,
    function passParameter(currentCart, callback) {
      callback(null, currentCart, null, null);
    },
    getBalanceDetails
  ],
    (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        let totalPrice = 0;
        let resultObject = {};
        Customer.findOne({ _id: result.cart.customer })
          .select('_id representativeName')
          .then((customerObj) => {
            if (result.cart.products.length > 0) {
              result.cart.products.forEach((productObj) => {
                totalPrice += productObj.price * productObj.quantity;
              });
              result.cart.products.sort((a, b) => // eslint-disable-line no-confusing-arrow
                (a.createdAt < b.createdAt) ? -1 : // eslint-disable-line no-nested-ternary
                  ((a.createdAt > b.createdAt) ? 1 : 0)); // eslint-disable-line no-nested-ternary
              Cart.findOne({ _id: result.cart._id })
                .populate({
                  path: 'products.product'
                  // populate: 'products.product.unit'
                })
                .then((cartResult) => {
                  resultObject = {
                    balanceDetails: result.balanceDetails,
                    cart: {
                      _id: result.cart._id,
                      customer: customerObj,
                      supplier: result.cart.supplier,
                      isRecurring: result.cart.isReccuring,
                      createdAt: result.cart.createdAt,
                      products: cartResult.products
                    },
                    items: result.cart.products.map(c => c.quantity)
                      .reduce((sum, value) => sum + value, 0),
                    total: result.cart.supplier.VATRegisterNumber > 0 ? totalPrice * appSettings.VAT : totalPrice,
                    vat: result.cart.supplier.VATRegisterNumber > 0 ? totalPrice * appSettings.VATPercent : 0
                  };
                  res.json(Response.success(resultObject));
                });
            } else {
              result.cart.products.sort((a, b) => // eslint-disable-line no-confusing-arrow
                (a.createdAt < b.createdAt) ? -1 : // eslint-disable-line no-nested-ternary
                  ((a.createdAt > b.createdAt) ? 1 : 0)); // eslint-disable-line no-nested-ternary
              Cart.findOne({ _id: result.cart._id })
                .populate({
                  path: 'products.product',
                  populate: 'products.product.unit'
                })
                .then((cartResult) => {
                  resultObject = {
                    balanceDetails: result.balanceDetails,
                    cart: {
                      _id: result.cart._id,
                      customer: customerObj,
                      supplier: result.cart.supplier,
                      isRecurring: result.cart.isReccuring,
                      createdAt: result.cart.createdAt,
                      products: cartResult.products
                    },
                    items: 0,
                    total: 0,
                    vat: result.cart.supplier.VATRegisterNumber > 0 ? totalPrice * appSettings.VATPercent : 0
                  };
                  res.json(Response.success(resultObject));
                });
            }
            // res.json(Response.success(resultObject));
          });
      }
    });
}


/* Helper Functions */


/**
 * Load cart by cartId append to req.
 */
function loadByCartId(req, res, next, id) {
  Cart.findById(id)
    .populate({
      path: 'customer',
      select: '_id representativeName user staff',
      populate: {
        path: 'user',
        select: '_id email'
      }
    })
    .populate({
      path: 'supplier',
      select: '_id representativeName location coverPhoto staff VATRegisterNumber',
      populate: {
        path: 'staff',
        select: '_id email'
      }
    })
    .populate({
      path: 'products.product',
      select: '_id englishName arabicName supplier price unit',
      populate: {
        path: 'unit',
        select: '_id arabicName englishName'
      }
    })
    .then((cart) => {
      if (cart) {
        // Remove the product's prices from the cart
        cart.products.forEach(cp => cp.product.price = undefined);

        req.cart = cart;
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
}

/**
 * Load cart by supplierId append to req.
 */
function loadBySupplierId(req, res, next, id) {
  Supplier.findOne({ _id: id })
    .then((supplierId) => {
      Cart.find({ supplier: supplierId })
        .populate({
          path: 'customer',
          select: '_id representativeName user staff'
        })
        .populate({
          path: 'supplier',
          select: '_id representativeName location coverPhoto staff VATRegisterNumber',
          populate: {
            path: 'staff',
            select: '_id email'
          }
        })
        .populate({
          path: 'products.product',
          select: '_id englishName arabicName supplier price unit',
          populate: {
            path: 'unit',
            select: '_id arabicName englishName'
          }
        })
        .then((cart) => {
          if (cart) {
            // Remove the product's prices from the cart
            // cart.products.forEach(cp => cp.product.price = undefined);

            req.cart = cart;
            return next();
          }
          return res.status(httpStatus.NOT_FOUND).json({
            status: 'Failure',
            data: 'No Carts for the supplier'
          });
        })
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e));
    });
}

/**
 * Helper Function
 * Get details of product and customer.
 * @property {string} productId - The id of the product.
 * @property {string} userId - The id of the customer user.
 * @returns {Product, Customer}
 */
function getProductAndCustomer(customerEmail, productId, userId, quantity, callback) {
  async.parallel({
    customer: (parallelCallback) => {
      Customer.findOne({ user: userId })
          .select('_id representativeName type customer')
          .populate('user')
          .exec((err, customer) => parallelCallback(err, customer));
    },
    product: (parallelCallback) => {
      Product.findById(productId)
          .select('_id englishName arabicName supplier price unit')
          .populate({
            path: 'supplier',
            select: '_id representativeName VATRegisterNumber'
          })
          .exec((err, product) => {
            if (err) {
              parallelCallback(err);
            }
            if (!product) {
              parallelCallback(2, null);
            }
            parallelCallback(null, product);
          });
    }
  },
    (err, result) => {
      if (err) {
        throw callback(err);
      } else {
        // Get the customer-supplier relationship.
        let custEmail = '';
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
              custEmail = customer.user.email;
            } else {
              custEmail = customerEmail;
            }
            CustomerInvite.findOne()
            .where('supplier').equals(result.product.supplier)
            .where('customerEmail').equals(custEmail)
            .where('status').equals('Active')
            .exec((e, ci) => {
              if (e) {
                callback(e);
              }
              // Check the customer-supplier relationship.
              if (ci) {
                callback(null, result.product, result.customer, quantity, ci);
              } else {
                callback(4, null);
              }
            });
          });
      }
    });
}

/**
 * Helper Function
 * Get the customer's cart with the product's supplier.
 * @property {Product} product - The id of the product.
 * @property {Customer} customer - The id of the customer user.
 * @returns {Cart, Product}
 */
function getCart(product, customer, quantity, customerInvite, callback) {
  Cart.findOne()
    .populate({
      path: 'products.product',
      populate: 'unit'
    })
    .populate({
      path: 'customer',
      select: '_id representativeName',
      populate: {
        path: 'user',
        select: '_id firstName lastName email'
      }
    })
    .populate('supplier', '_id representativeName coverPhoto location VATRegisterNumber')
    .where('supplier').equals(product.supplier)
    .where('customer').equals(customer._id)
    .exec((err, cart) => {
      if (err) {
        throw callback(err);
      }

      // Remove the product's prices from the cart
      if (cart) {
        cart.products.forEach(cp => cp.product.price = undefined);
      }
      callback(null, cart, product, quantity, customer, customerInvite);
    });
}

/**
 * Set the price of the product added to cart to special price if it exists.
 */
function setProductCustomPrice(cart, product, quantity, customer, customerInvite, callback) {
  // Check if the customer has a special price for the product

  let customerId = customer._id;

  if (customer.type === 'Staff') {
    customerId = customer.customer;
  }

  CustomerProductPrice.findOne()
    .where('customer').equals(customerId)
    .where('product').equals(product._id)
    .then((productPrice) => {
      // Update the product's price for the customer if they have a special price.
      if (productPrice) {
        product.price = productPrice.price;
      }
      callback(null, cart, product, quantity, customer, customerInvite);
    })
    .catch(e => callback(e, null));
}

/**
 * Helper Function
 * Adds the product to the cart, or increments its quantity if it already exists.
 * @property {Cart} cart - The cart of the customer.
 * @property {Product} product - The product that will added to the cart.
 * @property {int} productQuantity - The quantity of the product needed
 * @property {string} customerId - The Id of the customer with the cart.
 * @returns {Cart}
 */
function addProductToCart(cart, product, quantity, customer, customerInvite, callback) {
  if (Number(quantity) > 10000) {
    const error = {
      status: 'Failure',
      errorCode: 6,
      data: `Product can't be added to Cart` // eslint-disable-line quotes
    };
    callback(error, null);
  } else {
    // Check if the cart exists.
    const newCartProduct = new CartProduct.Model({
      product,
      quantity,
      price: product.price
    });
    if (customerInvite.canOrder === true) {
      if (cart) {
        const productIndex = getIndexOfProductInCart(cart, product._id);
        // Check if the product is in cart
        if (productIndex !== -1) {
          if ((cart.products[productIndex].quantity + quantity) > 10000) {
            const error = {
              status: 'Failure',
              errorCode: 6,
              data: `Product can't be added to Cart` // eslint-disable-line quotes
            };
            callback(error, null);
          } else {
            const cartProduct = new CartProduct.Model({
              product,
              quantity: cart.products[productIndex].quantity + quantity,
              price: product.price
            });
            // Remove the old cart product and add the new one
            cart.products.pull(cart.products[productIndex]._id);
            cart.products.addToSet(cartProduct);
            cart.VAT = cart.supplier.VATRegisterNumber > 0 ?
              cart.products.map(c => c.price * c.quantity)
                .reduce((sum, value) => sum + value, 0) * appSettings.VATPercent : 0;
            cart.save()
              .then(savedCart => callback(null, savedCart))
              .catch(err => callback(err, null));
          }
        } else {
          // Add the new product to cart
          cart.products.addToSet(newCartProduct);
          cart.VAT = cart.supplier.VATRegisterNumber > 0 ?
            cart.products.map(c => c.price * c.quantity)
              .reduce((sum, value) => sum + value, 0) * appSettings.VATPercent : 0;
          cart.save()
            .then(savedCart => callback(null, savedCart))
            .catch(err => callback(err, null));
        }
      } else {
        // Create the cart product and create a cart with it
        const newCart = new Cart({
          customer: {
            _id: customer._id,
            representativeName: customer.representativeName,
            user: customer.user
          },
          supplier: product.supplier,
          products: [newCartProduct]
        });
        newCart.VAT = product.supplier.VATRegisterNumber > 0 ?
          newCart.products.map(c => c.price * c.quantity)
            .reduce((sum, value) => sum + value, 0) * appSettings.VATPercent : 0;
        newCart.createdAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
        newCart.save()
          .then(savedCart => callback(null, savedCart))
          .catch(err => callback(err, null));
      }
    } else {
      const error = {
        status: 'Failure',
        errorCode: 7,
        data: `Sorry....can't order for the time being..Ask the supplier for this` // eslint-disable-line quotes
      };
      callback(error, null);
    }
  }
}

/**
 * Helper Function
 * Removes product from cart
 * @property {Cart} cart - The cart of the customer.
 * @property {Product} product - The product that will added to the cart.
 * @property {int} productQuantity - The new quantity of the product.
 * @returns {Cart}
 */
function updateProductQuantityInCart(cart, product, quantity, customerId, customerInvite, callback) { // eslint-disable-line max-len
                                                                                                      // Check if the cart exists.
  if (cart) {
    if (Number(quantity) > 10000) {
      const error = {
        status: 'Failure',
        errorCode: 6,
        data: `Product can't be added to Cart` // eslint-disable-line quotes
      };
      callback(error, null);
    } else {
      const productIndex = getIndexOfProductInCart(cart, product._id);

      // // Check if the product is in cart
      if (productIndex !== -1) {
        //   // Remove product
        //   const cartProduct = new CartProduct.Model({
        //     product,
        //     price: cart.products[productIndex].price,
        //     quantity
        //   });
        //     // Remove the old cart product and add the new one
        //   cart.products.pull(cart.products[productIndex]._id);
        //   cart.products.addToSet(cartProduct);
        cart.products[productIndex].quantity = quantity;
        cart.VAT = cart.supplier.VATRegisterNumber > 0 ?
          cart.products.map(c => c.price * c.quantity)
            .reduce((sum, value) => sum + value, 0) * appSettings.VATPercent : 0;
        cart.save()
          .then(savedCart => callback(null, savedCart))
          .catch(err => callback(err, null));
      } else {
        callback(6, null);
      }
    }
  } else {
    callback(2, null);
  }
}

/**
 * Helper Function
 * Removes product from cart
 * @property {Cart} cart - The cart of the customer.
 * @property {Product} product - The product that will added to the cart.
 * @returns {Cart}
 */
function removeProductFromCart(cart, product, quantity, customerId, customerInvite, callback) {
  // Check if the cart exists.
  if (cart) {
    const productIndex = getIndexOfProductInCart(cart, product._id);
    // Check if the product is in cart
    if (productIndex !== -1) {
      // Remove product
      cart.products.splice(productIndex, 1);
      cart.VAT = cart.supplier.VATRegisterNumber > 0 ?
        cart.products.map(c => c.price * c.quantity)
          .reduce((sum, value) => sum + value, 0) * appSettings.VATPercent : 0;
      cart.save()
        .then(savedCart => callback(null, savedCart))
        .catch(err => callback(err, null));
    } else {
      callback(6, null);
    }
  } else {
    callback(2, null);
  }
}

/**
 * Helper Function
 * Gets the index of the product in cart, -1 if it doesn't exist.
 * @property {Cart} cart - The cart of the customer.
 * @property {string} productId - The id of the product added.
 * @returns {int}
 */
function getIndexOfProductInCart(cart, productId) {
  let index = -1;
  for (let i = 0; i < cart.products.length; i += 1) {
    if (productId.equals(cart.products[i].product._id)) {
      index = i;
      break;
    }
  }
  return index;
}

/**
 * Helper Function
 * Get details of customer.
 * @property {string} userId - The id of the customer user.
 * @returns {Customer}
 */
function getCustomer(userId, callback) {
  Customer.findOne()
    .where('user').equals(userId)
    .exec((err, customer) => callback(err, customer));
}

/**
 * Helper Function
 * Get carts of customer.
 * @property {string} customerId - The id of the customer.
 * @returns {Cart []}
 */
function getCustomerCarts(customer, callback) {
  const cartArr = [];

  Cart.find()
    .where('customer').equals(customer._id)
    .populate('products.product')
    .populate({
      path: 'supplier',
      select: '_id representativeName location coverPhoto staff VATRegisterNumber',
      populate: {
        path: 'staff',
        select: '_id email'
      }
    })
    .sort({
      createdAt: -1
    })
    .exec((err, carts) => {
      if (err) {
        callback(err);
      }
      // Remove the product's prices from the carts
      carts.forEach((cartObj) => {
        const cartObject = {
          cart: cartObj,
          items: cartObj.products.map(c => c.quantity)
            .reduce((sum, value) => sum + value, 0),
          total: cartObj.supplier.VATRegisterNumber > 0 ?
            cartObj.products.map(c => c.price * c.quantity)
              .reduce((sum, value) => sum + value, 0) * appSettings.VAT : 0,
          VAT: cartObj.supplier.VATRegisterNumber > 0 ?
            cartObj.products.map(c => c.price * c.quantity)
              .reduce((sum, value) => sum + value, 0) * appSettings.VATPercent :
            0
        };
        cartArr.push(cartObject);
      });
      callback(null, cartArr);
    });
}

/**
 * Check that the customer's credit limit would not be reached with this order.
 */
function checkCreditLimitWithOrder(customerEmail, cart, callback) {
  // Get the credit and credit limit of the customer in parallel.
  async.parallel({
    creditLimit: (parallelCallback) => {
      CustomerInvite.findOne()
          .where('customerEmail').equals(customerEmail)
          .where('supplier').equals(cart.supplier)
          .then((ci) => {
            parallelCallback(null, ci);
          })
          .catch((e) => {
            parallelCallback(e, null);
          });
    },
    supplierCreditLimit: (parallelCallback) => {
      Supplier.findOne({ _id: cart.supplier._id })
          .then((ci) => {
            parallelCallback(null, ci);
          })
          .catch((e) => {
            parallelCallback(e, null);
          });
    }
  },
    (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        // Calculate the total price of the order.
        const orderPrice = cart.products
          .map(cartProduct => cartProduct.quantity * cartProduct.price)
          .reduce((sum, value) => sum + value, 0);
        if (result.supplierCreditLimit.inDebit) {
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
          // Delete the cart after checkout is successful
          cart.remove();
          callback(outOfCreditLimit, null);
          // Check if the credit after the order would be less than the credit limit
        } else if (result.creditLimit.exceedCreditLimit) {
          callback(null, cart, orderPrice);
        } else {
          // const currentDate = moment();
          // TODO: Get startDate and the latest endDate before today's date
          let fromDate = ''; // eslint-disable-line no-unused-vars
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
                      supplier: cart.supplier,
                      createdAt: { $gt: moment().startOf('month').tz(appSettings.timeZone).format(appSettings.momentFormat) }
                    })
                    .sort({
                      createdAt: -1
                    })
                    .then((customerTransaction) => {
                      let customerMonthCredit = 0;
                      let creditAfterOrderPrice = cart.supplier.VATRegisterNumber > 0 ?
                        orderPrice + (orderPrice * appSettings.VATPercent) : orderPrice;
                      if (customerTransaction.length > 0) {
                        // const startPaymentDueDate = moment(result.creditLimit.nextPaymentDueDate).subtract(Number(frequency), interval).startOf('day');
                        customerMonthCredit = customerTransaction.map(c => c).filter(c => c.type === 'debit' && (moment(c.createdAt) >= moment(result.creditLimit.startPaymentDate).tz(appSettings.timeZone).startOf('day') && moment(c.createdAt) <= moment(result.creditLimit.nextPaymentDueDate).tz(appSettings.timeZone).endOf('day')))
                          .map(c => c.amount).reduce((sum, value) => sum + value, 0);
                        Order.find({ $and: [{ supplier: cart.supplier }, { customer }, { $and: [{ status: { $ne: 'Delivered' } }, { status: { $ne: 'Canceled' } }, { status: { $ne: 'CanceledByCustomer' } }, { status: { $ne: 'Rejected' } }, { status: { $ne: 'FailedToDeliver' } }] }] })
                          .then((orders) => {
                            const reservedBalance = orders.map(c => c.price + c.VAT).reduce((sum, value) => sum + value, 0); // eslint-disable-line max-len
                            creditAfterOrderPrice = cart.supplier.VATRegisterNumber > 0 ?
                              orderPrice + (orderPrice * appSettings.VATPercent) + reservedBalance + customerMonthCredit :
                              orderPrice + reservedBalance + customerMonthCredit;
                            if (creditAfterOrderPrice <= result.creditLimit.creditLimit) { // eslint-disable-line max-len
                              if (!customer.dueDateMissed) {
                                callback(null, cart, orderPrice);
                              } else {
                                const outOfCreditLimit = {
                                  status: 'Failure',
                                  errorCode: 7,
                                  data: 'There are missed payment in the previous interval'
                                };
                                result.creditLimit.canOrder = false;
                                result.creditLimit.save()
                                  .catch(e => callback(e, null));
                                // Delete the cart after checkout is successful
                                // cart.remove();
                                callback(outOfCreditLimit, null);
                              }
                              // callback(null, cart, orderPrice);
                            } else {
                              const outOfCreditLimit = {
                                status: 'Failure',
                                errorCode: 7,
                                data: 'Credit limit will be reached if order is placed'
                              };
                              result.creditLimit.canOrder = ((result.creditLimit.creditLimit - customerMonthCredit) > 0 || result.creditLimit.exceedCreditLimit);// eslint-disable-line max-len
                              result.creditLimit.save()
                                .catch(e => callback(e, null));
                              // Delete the cart after checkout is successful
                              // cart.remove();
                              callback(outOfCreditLimit, null);
                            }
                          });
                      } else if (creditAfterOrderPrice <=
                        result.creditLimit.creditLimit) {
                        if (!customer.dueDateMissed) {
                          callback(null, cart, orderPrice);
                        } else {
                          const outOfCreditLimit = {
                            status: 'Failure',
                            errorCode: 7,
                            data: 'There are missed payment in the previous interval'
                          };
                          result.creditLimit.canOrder = false;
                          result.creditLimit.save()
                            .catch(e => callback(e, null));
                          // Delete the cart after checkout is successful
                          // cart.remove();
                          callback(outOfCreditLimit, null);
                        }
                        // callback(null, cart, orderPrice);
                      } else {
                        const outOfCreditLimit = {
                          status: 'Failure',
                          errorCode: 7,
                          data: 'Credit limit will be reached if order is placed'
                        };
                        result.creditLimit.canOrder = ((result.creditLimit.creditLimit - customerMonthCredit) > 0 || result.creditLimit.exceedCreditLimit); // eslint-disable-line max-len
                        result.creditLimit.save()
                          .catch(e => callback(e, null));
                        // Delete the cart after checkout is successful
                        // cart.remove();
                        callback(outOfCreditLimit, null);
                      }
                    });
                });
            });
        }
      }
    });
}

/**
 * Create the order
 */
function createOrder(cart, orderPrice, branch, branchName, bodyData, callback) {
  Order.count()
    .then((orderObj) => {
      let nextOrderId = '';
      nextOrderId = moment().tz(appSettings.timeZone).format('x');
      const order = new Order({
        orderId: `${appSettings.orderPrefix}${nextOrderId}`,
        supplier: cart.supplier,
        customer: cart.customer,
        price: orderPrice,
        VAT: cart.VAT,
        branch,
        branchName,
        createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
        updatedAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
        deliveryDate: bodyData && bodyData.deliveryDate ? bodyData.deliveryDate : null,
        deliveryDateIslamic: bodyData && bodyData.deliveryDateIslamic ? bodyData.deliveryDateIslamic : null
      });
      // Create the order products based on the cart products.
      cart.products
        .map(cartProduct => new OrderProduct({
          order: order._id,
          product: cartProduct.product._id,
          price: cartProduct.price,
          quantity: cartProduct.quantity
        }))
        .forEach(orderProduct => orderProduct.save());

      order.save()
        .then((savedOrder) => {
          // Delete the cart after checkout is successful
          cart.remove();
          Order.findById(savedOrder._id)
            .populate({
              path: 'customer',
              select: '_id user representativeName',
              populate: {
                path: 'user',
                select: '_id firstName lastName email'
              }
            })
            .then((savedOrderObject) => {
              const log = new OrderLog({
                order: savedOrderObject._id,
                status: savedOrderObject.status,
                userName: `${savedOrderObject.customer.user.firstName} ${savedOrderObject.customer.user.lastName}`,
                userType: 'Customer',
                message: '',
                createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
              });
              log.save()
                .catch(e => callback(e, null));
              callback(null, cart, savedOrderObject, cart.products);
            });
        })
        .catch(e => callback(e, null));
    });
}

function getBalanceDetails(cart, order, products, callback) {
  let customer = null;

  Customer.findOne({ $or: [{ _id: cart.customer._id }, { _id: cart.customer }] })
    .populate('user')
    .then((customers) => {
      if (customers.type === 'Staff') {
        return Customer.findOne({ _id: customers.customer })
          .populate('user');
      }
      return customers;
    }).then((customers) => {
      customer = customers;
      return CustomerInvite.findOne({ customerEmail: customer.user.email, supplier: cart.supplier });
    }).then((customerInvite) => {
      let interval = '';
      let intervalPeriod = '';
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
      const nextPaymentDate = moment.max(moment(customerInvite.createdAt)
      .tz(appSettings.timeZone), moment(customer.createdAt)).tz(appSettings.timeZone)
      .endOf(intervalPeriod).add(Number(frequency) - 1, interval);
      Transaction.find({
        customer,
        supplier: cart.supplier,
        createdAt: { $gt: moment().startOf('month').tz(appSettings.timeZone).format(appSettings.momentFormat) }
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
        // const startPaymentDueDate = moment(customerInvite.nextPaymentDueDate).subtract(Number(frequency), interval).startOf('day');
        const customerMonthCredit = customerTransaction.map(c => c).filter(c => c.type === 'debit' && (moment(c.createdAt) >= moment(customerInvite.startPaymentDate).tz(appSettings.timeZone).startOf('day') && moment(c.createdAt) <= moment(customerInvite.nextPaymentDueDate).tz(appSettings.timeZone).endOf('day')))
          .map(c => c.amount).reduce((sum, value) => sum + value, 0);
        Order.find({ $and: [{ supplier: cart.supplier }, { customer }, { $and: [{ status: { $ne: 'Delivered' } }, { status: { $ne: 'Canceled' } }, { status: { $ne: 'CanceledByCustomer' } }, { status: { $ne: 'Rejected' } }, { status: { $ne: 'FailedToDeliver' } }] }] })
          .then((orders) => {
            const reservedBalance = orders.map(c => c.price + c.VAT).reduce((sum, value) => sum + value, 0); // eslint-disable-line max-len
            const balanceDetails = {
              balance: customerBalance,
              monthCredit: (Math.abs(customerMonthCredit) + reservedBalance),
              payment: {
                interval: customerInvite.paymentInterval,
                frequency: customerInvite.paymentFrequency
              },
              nextPaymentDate,
              nextInvoiceDate: moment().tz(appSettings.timeZone).endOf('month').format(appSettings.momentFormat),
              creditLimit: customerInvite.creditLimit,
              exceedCreditLimit: customerInvite.exceedCreditLimit,
              exceedPaymentDate: customerInvite.exceedPaymentDate,
              canOrder: ((customerInvite.creditLimit - customerMonthCredit) > 0 || customerInvite.exceedCreditLimit) // eslint-disable-line max-len
            };
            callback(null, { balanceDetails, cart, order, products });
          });
      });
    });
}

export default {
  addToCart,
  list,
  get,
  remove,
  checkout,
  updateProductQuantity,
  removeProduct,
  loadByCartId,
  loadBySupplierId
};
