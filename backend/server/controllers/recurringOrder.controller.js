import httpStatus from 'http-status';
import async from 'async';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
import RecurringOrder from '../models/recurringOrder.model';
import Customer from '../models/customer.model';
import Order from '../models/order.model';
import OrderProduct from '../models/orderProduct.model';
import CustomerProductPrice from '../models/customerProductPrice.model';
import Credit from '../models/credit.model';
import CustomerInvite from '../models/customerInvite.model';
import Response from '../services/response.service';
import UserService from '../services/user.service';
import Supplier from '../models/supplier.model';
import EmailHandler from '../../config/emailHandler';
import ExportService from './exportFileService';
import notificationCtrl from '../controllers/notification.controller';
import CartProduct from '../models/cartProduct.model';
import Product from '../models/product.model';
import User from '../models/user.model';
import Transaction from '../models/transaction.model';
import Branches from '../models/branch.model';

/**
 * Get recurring order
 * @returns {RecurringOrder}
 */
// TODO: Performance Complexity Enhance TRY Aggregate
// TODO: Review this option logic for enhancing performance
function get(req, res) {
  const customerUserId = req.recurringOrder.customer.user._id;
  const customerStaffId = req.recurringOrder.customer.staff;

  if (customerUserId.toString() === req.user._id.toString() || customerStaffId.indexOf(req.user._id) >= 0) {
    req.recurringOrder.customer.coverPhoto = `${appSettings.imagesUrl}${req.recurringOrder.customer.coverPhoto}`;
    req.recurringOrder.supplier.coverPhoto = `${appSettings.imagesUrl}${req.recurringOrder.supplier.coverPhoto}`;
    const supplierObject = {
      _id: req.recurringOrder.supplier._id,
      representativeName: req.recurringOrder.supplier.representativeName,
      user: {
        _id: req.recurringOrder.supplier.staff[0]._id,
        email: req.recurringOrder.supplier.staff[0].email,
        mobileNumber: req.recurringOrder.supplier.staff[0].mobileNumber,
        firstName: req.recurringOrder.supplier.staff[0].firstName,
        lastName: req.recurringOrder.supplier.staff[0].lastName
      },
      coverPhoto: req.recurringOrder.supplier.coverPhoto,
      location: req.recurringOrder.supplier.location
    };
    const orderTotal = req.recurringOrder.products.map(c => c.price * c.quantity)
      .reduce((sum, value) => sum + value, 0);
    const VAT = req.recurringOrder.supplier.VATRegisterNumber > 0 ?
      orderTotal * appSettings.VATPercent : 0;
    const recurringOrderObject = {
      _id: req.recurringOrder._id,
      orderId: req.recurringOrder.orderId,
      orderIntervalType: req.recurringOrder.orderIntervalType,
      orderFrequency: req.recurringOrder.orderFrequency,
      customer: req.recurringOrder.customer,
      supplier: supplierObject,
      days: req.recurringOrder.days,
      createdAt: req.recurringOrder.createdAt,
      status: req.recurringOrder.status,
      startDate: req.recurringOrder.startDate,
      products: req.recurringOrder.products.slice(0, req.query.limit),
      count: req.recurringOrder.products.length,
      total: orderTotal,
      VAT
    };
    res.json(Response.success(recurringOrderObject));
  } else {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
  }
}


function orderPurchase(req, res) {
  const recurringOrder = req.recurringOrder;
  if (req.user.type === 'Customer') {
    const orderTotal = recurringOrder.products.map(c => c.price * c.quantity)
      .reduce((sum, value) => sum + value, 0);
    const resultObject = {
      _id: recurringOrder._id,
      orderId: recurringOrder.orderId,
      customer: recurringOrder.customer,
      supplier: recurringOrder.supplier,
      price: orderTotal,
      createdAt: recurringOrder.createdAt,
      updatedAt: recurringOrder.updatedAt,
      products: recurringOrder.products,
      VAT: recurringOrder.supplier.VATRegisterNumber > 0 ?
        orderTotal * appSettings.VATPercent : 0
    };
    if (req.query.export) {
      if (req.user.language === 'en') {
        ExportService.exportReceiptFile('report_template/main_header/english_header.html',
          'report_template/orders/orders-body-english.html', { order: resultObject },
          'Order Invoice', '', req.query.export, res);
        // res.download('report.pdf', 'OrderInvoice.pdf');
      } else {
        ExportService.exportReceiptFile('report_template/main_header/arabic_header.html',
          'report_template/orders/orders-body-arabic.html', resultObject,
          'فاتورة الطلب', '', req.query.export, res);
        // res.download('report.pdf', 'OrderInvoice.pdf');
      }
    } else {
      res.json(Response.success(resultObject));
    }
  }
}

/**
 * Get recurring Order history
 * @returns {RescurringOrder}
 */
function getHistory(req, res) {
  if (req.user.type === 'Customer') {
    const match = {};
    if (req.query.supplierId) {
      // match = { supplier: supplierId };
      match.supplier = req.query.supplierId;
    }
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id, null, null);
      },
      getCustomer
    ], (err, result) => {
      match.customer = result;
      RecurringOrder.find(match)
        .populate({
          path: 'supplier',
          select: '_id representativeName location coverPhoto staff VATRegisterNumber',
          populate: {
            path: 'staff',
            select: '_id firstName lastName mobileNumber email',
          }
        })
        .sort({
          orderId: -1
        })
        .skip(Number(req.query.skip))
        .limit(Number(req.query.limit))
        .then((recurOrders) => {
          if (recurOrders.length > 0) {
            const recurOrdersArr = [];
            recurOrders.forEach((recurOrdersObj) => {
              const recurOrderProductTotal = recurOrdersObj.products.map(c => c.price * c.quantity)
                .reduce((sum, value) => sum + value, 0);
              const recurOrderProductItems = recurOrdersObj.products.map(c => c.quantity)
                .reduce((sum, value) => sum + value, 0);
              const VAT = recurOrdersObj.supplier.VATRegisterNumber > 0 ?
                recurOrderProductTotal * appSettings.VATPercent : 0;
              const recurOrderObject = {
                _id: recurOrdersObj._id,
                supplier: recurOrdersObj.supplier,
                customer: recurOrdersObj.customer,
                date: recurOrdersObj.createdAt,
                total: recurOrderProductTotal,
                repetition: {
                  interval: recurOrdersObj.orderIntervalType,
                  frequency: recurOrdersObj.orderFrequency
                },
                items: recurOrderProductItems,
                VAT
              };
              recurOrdersArr.push(recurOrderObject);
              if (recurOrdersArr.length === recurOrders.length) {
                RecurringOrder.find(match)
                  .sort({
                    orderId: -1
                  })
                  .then((recurringOrdersCount) => {
                    const recurringOrder = {
                      recurOrdersArr,
                      count: recurringOrdersCount.length
                    };
                    res.json(Response.success(recurringOrder));
                  });
              }
            });
          } else {
            const recurringOrder = {};
            res.json(Response.success(recurringOrder));
          }
        });
    });
  } else if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ], (err, result) => {
      if (err) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
      } else {
        RecurringOrder.find({ supplier: result })
          .populate({
            path: 'supplier',
            select: '_id representativeName location coverPhoto staff VATRegisterNumber',
            populate: {
              path: 'staff',
              select: '_id firstName lastName mobileNumber email',
            }
          })
          .sort({
            orderId: -1
          })
          .skip(Number(req.query.skip))
          .limit(Number(req.query.limit))
          .then((recurOrders) => {
            if (recurOrders.length > 0) {
              const recurOrdersArr = [];
              recurOrders.forEach((recurOrdersObj) => {
                const recurOrderProductTotal = recurOrdersObj.products
                  .map(c => c.price * c.quantity)
                  .reduce((sum, value) => sum + value, 0);
                const recurOrderProductItems = recurOrdersObj.products.map(c => c.quantity)
                  .reduce((sum, value) => sum + value, 0);
                const VAT = recurOrdersObj.supplier.VATRegisterNumber > 0 ?
                  recurOrderProductTotal * appSettings.VATPercent : 0;
                const recurOrderObject = {
                  _id: recurOrdersObj._id,
                  supplier: recurOrdersObj.supplier,
                  customer: recurOrdersObj.customer,
                  date: recurOrdersObj.createdAt,
                  total: recurOrderProductTotal,
                  repetition: {
                    interval: recurOrdersObj.orderIntervalType,
                    frequency: recurOrdersObj.orderFrequency
                  },
                  items: recurOrderProductItems,
                  VAT
                };
                recurOrdersArr.push(recurOrderObject);
                if (recurOrdersArr.length === recurOrders.length) {
                  RecurringOrder.find({ supplier: result })
                    .sort({
                      orderId: -1
                    })
                    .then((recurringOrdersCount) => {
                      const recurringOrder = {
                        recurOrdersArr,
                        count: recurringOrdersCount.length
                      };
                      res.json(Response.success(recurringOrder));
                    });
                }
              });
            } else {
              const recurringOrder = {};
              res.json(Response.success(recurringOrder));
            }
          });
      }
    });
  }
}

/**
 * Cancel active recurring order
 * @returns {RecurringOrder}
 */
function cancel(req, res) {
  const recurringOrder = req.recurringOrder;
  const customerUserId = req.recurringOrder.customer.user._id;
  const customerStaffId = req.recurringOrder.customer.staff;

  recurringOrder.status = 'Inactive';

  recurringOrder.save()
    .then(savedRecurringOrder => res.json(Response.success(savedRecurringOrder)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));

}

/** Update recurring Order.
 * @returns {RecurringOrder}
 */
function update(req, res) {
  const recurringOrder = req.recurringOrder;
  const customerUserId = req.recurringOrder.customer.user._id;
  const customerStaffId = req.recurringOrder.customer.staff;
  if (customerUserId.toString() === req.user._id.toString() || customerStaffId.indexOf(req.user._id) >= 0) {
    recurringOrder.orderFrequency = req.body.orderFrequency;
    recurringOrder.orderIntervalType = req.body.orderIntervalType;
    const date = moment(req.body.startDate).tz(appSettings.timeZone);
    recurringOrder.startDate = date;
    let nextDate = '';
    if (req.body.orderIntervalType === 'Week') {
      nextDate = moment(date).tz(appSettings.timeZone).add(Number(req.body.orderFrequency) * 7, 'days');
    } else if (req.body.orderIntervalType === 'Month') {
      nextDate = moment(date).tz(appSettings.timeZone).add(Number(req.body.orderFrequency), 'M');
    } else {
      nextDate = moment(date).tz(appSettings.timeZone).add(Number(req.body.orderFrequency), 'days');
    }
    recurringOrder.days = nextDate.diff(date, 'days');

    recurringOrder.save()
      .then(savedRecurringOrder => res.json(Response.success(savedRecurringOrder)))
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  } else {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
  }
}

/**
 * Get recurringOrder list.
 * @property {number} req.query.skip - Number of recurring orders to be skipped.
 * @property {number} req.query.limit - Limit number of recurring orders to be returned.
 * @returns {RecurringOrder[]}
 */
function list(req, res) {
  async.waterfall([
      function passParamters(callback) {
        callback(null, req.user._id, req.query.skip, req.query.limit);
      },
      getBranchesArray,
      function passParameter(branches, skip, limit, callback) {
        callback(null, branches, skip, limit, req.query.supplierId);
      },
      getRecurringOrders
    ],
    (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        const cartsArr = [];
        result.recurringOrders.forEach((recurringOrdersObject) => {
          const totalPrice = recurringOrdersObject.products
            .map(c => c.price * c.quantity)
            .reduce((sum, value) => sum + value, 0);
          const VAT = recurringOrdersObject.supplier.VATRegisterNumber > 0 ?
            totalPrice * appSettings.VATPercent : 0;
          const object = {
            _id: recurringOrdersObject._id,
            branchName: recurringOrdersObject.branch.branchName,
            orderId: recurringOrdersObject.orderId,
            orderIntervalType: recurringOrdersObject.orderIntervalType,
            orderFrequency: recurringOrdersObject.orderFrequency,
            customer: recurringOrdersObject.customer,
            supplier: recurringOrdersObject.supplier,
            createdAt: recurringOrdersObject.createdAt,
            status: recurringOrdersObject.status,
            startDate: recurringOrdersObject.startDate,
            products: recurringOrdersObject.products,
            items: recurringOrdersObject.products.length,
            total: totalPrice,
            VAT
          };
          cartsArr.push(object);
        });
        const recurringOrdersObject = {
          recurringOrders: cartsArr,
          count: result.count
        };
        res.json(Response.success(recurringOrdersObject));
      }
    });
}

/**
 * Create order from recurring order
 * @returns {RecurringOrder}
 */
function create(req, res) {
  async.waterfall([
      // Function that passes the parameters to the second function.
      function passParamters(callback) {
        callback(null, req.recurringOrder);
      },
      getCustomerSpecialPrices,
      checkCreditLimitWithRecurringOrder,
      createOrder
    ],
    (err, result) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        res.json(Response.success(result));
      }
    });
}

function addProductToOrder(req, res) {
  const recurringOrder = req.recurringOrder;
  const orderPrice = req.recurringOrder.products.map(c => c.price * c.quantity)
    .reduce((sum, value) => sum + value, 0);
  const orderTotal = recurringOrder.supplier.VATRegisterNumber > 0 ?
    orderPrice * appSettings.VATPercent : orderPrice;
  recurringOrder.products.forEach((productObj) => {
    CustomerProductPrice.findOne({
      customer: recurringOrder.customer,
      supplier: recurringOrder.supplier,
      product: productObj.product
    })
      .then((customerSpecialPrices) => {
        if (customerSpecialPrices) {
          const productIndex = getIndexOfProductInRecurringOrder(recurringOrder, productObj.product);
          if (productIndex !== -1) {
            const newRecurringOrderProduct = new CartProduct.Model({
              product: productObj.product,
              quantity: productObj.quantity,
              price: customerSpecialPrices.price
            });
            recurringOrder.products.pull(recurringOrder.products[productIndex]._id);
            recurringOrder.products.addToSet(newRecurringOrderProduct);
            recurringOrder.save();
          }
        }
      });
  });
  Product.findOne({ _id: req.body.productId })
    .then((product) => {
      const newRecurringOrderProduct = new CartProduct.Model({
        product,
        quantity: req.body.quantity,
        price: product.price
      });
      CustomerProductPrice.findOne({
        customer: recurringOrder.customer,
        supplier: recurringOrder.supplier,
        product: req.body.productId
      })
        .then((customerProductSpeicalPrice) => {
          if (customerProductSpeicalPrice) {
            newRecurringOrderProduct.price = customerProductSpeicalPrice.price;
          }
          const productIndex = getIndexOfProductInRecurringOrder(recurringOrder, product._id);
          if (productIndex !== -1) {
            recurringOrder.products[productIndex].price = newRecurringOrderProduct.price;
            recurringOrder.products[productIndex].quantity += newRecurringOrderProduct.quantity;
            async.waterfall([
              function passParameter(callback) {
                Customer.findOne({ user: req.user._id })
                  .then((customer) => {
                    if (customer.type === 'Staff') {
                      return Customer.findOne({ _id: customer.customer });
                    }
                    return customer;
                  }).then((customer) => {
                  callback(null, req.user.email, recurringOrder, customer, orderTotal);
                });
              },
              checkCreditLimitWithOrder
            ], (err, result) => {
              if (err) {
                res.status(httpStatus.UNAUTHORIZED).json(Response.failure(err));
              } else {
                recurringOrder.save()
                  .then((savedRecurringOrder => res.json(Response.success(savedRecurringOrder))));
              }
            });
          } else {
            async.waterfall([
              function passParameter(callback) {
                Customer.findOne({ user: req.user._id })
                  .then((customer) => {
                    if (customer.type === 'Staff') {
                      return Customer.findOne({ _id: customer.customer });
                    }
                    return customer;
                  }).then((customer) => {
                  callback(null, req.user.email, recurringOrder, customer, orderTotal);
                });
              },
              checkCreditLimitWithOrder
            ], (err, result) => {
              if (err) {
                res.status(httpStatus.UNAUTHORIZED).json(Response.failure(err));
              } else {
                recurringOrder.products.addToSet(newRecurringOrderProduct);
                recurringOrder.save()
                  .then((savedRecurringOrder => res.json(Response.success(savedRecurringOrder))));
              }
            });
          }
        });
    });
}

function updateProductInOrder(req, res) {
  const recurringOrder = req.recurringOrder;
  const orderPrice = req.recurringOrder.products.map(c => c.price * c.quantity)
    .reduce((sum, value) => sum + value, 0);
  const orderTotal = recurringOrder.supplier.VATRegisterNumbe == 0 ?
    orderPrice * appSettings.VATPercent : orderPrice;
  recurringOrder.products.forEach((productObj) => {
    CustomerProductPrice.findOne({
      customer: recurringOrder.customer,
      supplier: recurringOrder.supplier,
      product: productObj.product
    })
      .then((customerSpecialPrices) => {
        if (customerSpecialPrices) {
          const productIndex = getIndexOfProductInRecurringOrder(recurringOrder, productObj._id);
          if (productIndex !== -1) {
            const newRecurringOrderProduct = new CartProduct.Model({
              product: productObj.product,
              quantity: productObj.quantity,
              price: customerSpecialPrices.price
            });
            recurringOrder.products.pull(recurringOrder.products[productIndex]._id);
            recurringOrder.products.addToSet(newRecurringOrderProduct);
            recurringOrder.save();
          }
        }
      });
  });
  const productIndex = getIndexOfProductInRecurringOrder(recurringOrder, req.body.productId);
  if (productIndex !== -1) {
    const newRecurringOrderProduct = new CartProduct.Model({
      product: recurringOrder.products[productIndex].product,
      quantity: req.body.quantity,
      price: recurringOrder.products[productIndex].product.price
    });
    CustomerProductPrice.findOne({
      customer: recurringOrder.customer,
      supplier: recurringOrder.supplier,
      product: recurringOrder.products[productIndex].product._id
    })
      .then((customerProductSpeicalPrice) => {
        if (customerProductSpeicalPrice) {
          newRecurringOrderProduct.price = customerProductSpeicalPrice.price;
        }
        async.waterfall([
          function passParameter(callback) {
            Customer.findOne({ user: req.user._id })
              .then((customer) => {
                if (customer.type === 'Staff') {
                  return Customer.findOne({ _id: customer.customer });
                }
                return customer;
              }).then((customer) => {
              callback(null, customer.user.email, recurringOrder, customer, orderTotal);
            });
          },
          checkCreditLimitWithOrder
        ], (err, result) => {
          if (err) {
            res.status(httpStatus.BAD_REQUEST).json(err);
          } else {
            recurringOrder.products.pull(recurringOrder.products[productIndex]._id);
            recurringOrder.products.addToSet(newRecurringOrderProduct);
            recurringOrder.save()
              .then((savedRecurringOrder => res.json(Response.success(savedRecurringOrder))));
          }
        });
      });
  }
}

function deleteProductFromOrder(req, res) {
  const recurringOrder = req.recurringOrder;
  const productIndex = getIndexOfProductInRecurringOrder(recurringOrder, req.body.productId);
  if (productIndex !== -1) {
    recurringOrder.products.splice(productIndex, 1);
    recurringOrder.save()
      .then((savedRecurringOrder => res.json(Response.success(savedRecurringOrder))));
  } else {
    res.status(httpStatus.NOT_FOUND).json(Response.failure(6));
  }
}

/* Helper Functions */


/**
 * Load recurring order and append to req.
 */
function load(req, res, next, id) {
  RecurringOrder.findById(id)
    .populate({
      path: 'customer',
      select: '_id representativeName location coverPhoto user staff',
      populate: {
        path: 'user',
        select: 'firstName lastName mobileNumber email',
      }
    })
    .populate({
      path: 'supplier',
      select: '_id representativeName location coverPhoto staff VATRegisterNumber',
      populate: {
        path: 'staff',
        select: '_id firstName lastName mobileNumber email',
      }
    })
    .populate({
      path: 'products.product',
      populate: {
        path: 'unit'
      }
    })
    .populate('branch')
    .then((recurringOrder) => {
      if (recurringOrder) {
        req.recurringOrder = recurringOrder;
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Gets the special prices of the customer.
 */
function getCustomerSpecialPrices(recurringOrder, callback) {
  CustomerProductPrice.find()
    .populate('product')
    .where('customer').equals(recurringOrder.customer._id)
    .then(productPrices => callback(null, recurringOrder, productPrices == null ?
      productPrices : productPrices.filter(p => p.product.supplier.equals(recurringOrder.supplier))))
    .catch(e => callback(e, null));
}

/**
 * Check that the customer's credit limit would not be reached with this order.
 */
function checkCreditLimitWithRecurringOrder(recurringOrder, productPrices, callback) {
  // Get the credit and credit limit of the customer in parallel.
  async.parallel({
      creditBalance: (parallelCallback) => {
        Credit.findOne()
          .where('customer').equals(recurringOrder.customer._id)
          .where('supplier').equals(recurringOrder.supplier)
          .then(credit => parallelCallback(null, credit.balance))
          .catch(e => parallelCallback(e, null));
      },
      creditLimit: (parallelCallback) => {
        CustomerInvite.findOne()
          .where('customerEmail').equals(recurringOrder.customer.user.email)
          .where('supplier').equals(recurringOrder.supplier)
          .then(ci => parallelCallback(null, ci.creditLimit))
          .catch(e => parallelCallback(e, null));
      }
    },
    (err, result) => {
      if (err) {
        callback(err, null);
      }
      const orderProducts = updatePrices(productPrices, recurringOrder.products);

      // Calculate the total price of the order.
      const orderPrice = orderProducts.map(op => op.quantity * op.product.price)
        .reduce((sum, value) => sum + value, 0);

      const balanceAfterOrder = result.creditBalance - orderPrice;

      // Check if the credit after the order would be less than the credit limit
      if (balanceAfterOrder < -result.creditLimit) {
        recurringOrder.products = orderProducts;
        callback(null, recurringOrder, orderPrice);
      }
    });
}

/**
 * Creates the order from the recurring order.
 */
function createOrder(recurringOrder, orderPrice, callback) {
  Order.findOne()
    .sort({ orderId: -1 })
    .then((orderObj) => {
      let nextOrderId = '';
      if (orderObj) {
        nextOrderId = Number(orderObj.orderId.slice(6)) + 1;
      } else {
        nextOrderId = appSettings.orderIdInit;
      }
      const order = new Order({
        orderId: `${appSettings.orderPrefix}${nextOrderId}`,
        supplier: recurringOrder.supplier,
        customer: recurringOrder.customer._id,
        price: orderPrice
      });

      // Create the order products based on the recurring order products.
      recurringOrder.products.map(orderProduct => new OrderProduct({
        order: order._id,
        product: orderProduct.product._id,
        price: orderProduct.product.price,
        quantity: orderProduct.quantity
      }))
        .forEach(orderProduct => orderProduct.save());

      order.save()
        .then(savedOrder => callback(null, savedOrder))
        .catch(e => callback(e, null));
    });
}

/**
 * Helper Function
 * Get details of customer.
 * @property {string} userId - The id of the customer user.
 * @returns {Customer}
 */
function getCustomer(userId, skip, limit, callback) {
  Customer.findOne({ user: userId })
    .populate('user')
    .then((customer) => {
      if (customer.type === 'Staff') {
        return Customer.findOne({ user: userId })
          .populate('user');
      }
      return customer;
    })
    .then(customer => callback(null, customer._id, skip, limit));
}

/**
 * Helper Function
 * Get branches of customer and staff.
 * @property {string} userId - The id of the customer user.
 * @returns {Customer}
 */
function getBranchesArray(userId, skip, limit, callback) {
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
    callback(null, branches, skip, limit);
  }).catch((err) => {
    callback(err, null, null);
  });
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
    .exec((err, supplier) => callback(err, supplier._id));
}

/**
 * Helper Function
 * Gets the index of the product in cart, -1 if it doesn't exist.
 * @property {Cart} cart - The cart of the customer.
 * @property {string} productId - The id of the product added.
 * @returns {int}
 */
function getIndexOfProductInRecurringOrder(recurringOrder, productId) {
  let index = -1;
  for (let i = 0; i < recurringOrder.products.length; i += 1) {
    if (productId.toString() === recurringOrder.products[i]._id.toString() || productId.toString() === recurringOrder.products[i].product._id.toString()) {
      index = i;
      break;
    }
  }
  return index;
}

/**
 * Helper Function
 * Get recurring orders of customer.
 * @property {string} customerId - The id of the customer.
 * @property {int} skip - The number of recurring orders to be skipped.
 * @property {int} limit - The number of recurring orders to return.
 * @returns {RecurringOrder []}
 */
function getRecurringOrders(branches, skip, limit, supplierId, callback) {
  RecurringOrder.find({ status: 'Active', branch: { $in: branches } })
    .where('supplier').equals(supplierId)
    .populate({
      path: 'supplier',
      select: '_id representativeName adminFees staff VATRegisterNumber',
      populate: {
        path: 'staff',
        select: '_id email'
      }
    })
    .populate({
      path: 'products.product'
    })
    .populate({
      path: 'branch'
    })
    .sort({
      orderId: -1
    })
    .skip(Number(skip))
    .limit(Number(limit))
    .exec((err, recurringOrders) => {
      RecurringOrder.find({ status: 'Active', branch: { $in: branches } })
        .where('supplier').equals(supplierId)
        .populate('products.product')
        .sort({
          orderId: -1
        })
        .then((recurringOrdersCount) => {
          callback(null, { recurringOrders, count: recurringOrdersCount.length });
        });
    });
}

/**
 * Replaces the prices of products with the special prices.
 */
function updatePrices(specialPrices, orderProducts) {
  for (let priceIndex = 0; priceIndex < specialPrices.length; priceIndex += 1) {
    const specialPrice = specialPrices[priceIndex];
    for (let productIndex = 0; productIndex < orderProducts.length; productIndex += 1) {
      const orderProduct = orderProducts[productIndex];
      if (orderProduct.product.equals(specialPrice.product)) {
        orderProduct.price = specialPrice.price;
        break;
      }
    }
  }
  return orderProducts;
}

/**
 * Helper Function
 * Cron Job Order recurring orders of customer.
 * @property {Object} recurringOrder
 * @property {Number} orderPrice
 * @property {Number} number of days
 */
function orderRecurringOrder(recurringOrder, orderPrice, nextOrderId) {
  async.waterfall([
    function createNewOrder(callback) {
      const order = new Order({
        supplier: recurringOrder.supplier,
        customer: recurringOrder.customer,
        branch: recurringOrder.branch._id,
        branchName: recurringOrder.branch.branchName,
        price: orderPrice,
        VAT: recurringOrder.supplier.VATRegisterNumber > 0 ?
          orderPrice * appSettings.VATPercent : 0,
        orderId: `${appSettings.orderPrefix}${nextOrderId}`,
        createdAt: recurringOrder.startDate,
        updatedAt: recurringOrder.startDate
      });

      order.save()
        .then((savedOrder) => {
          if (savedOrder) {
            // Create the order products based on the recurring order products.
            recurringOrder.products.map(orderProduct => new OrderProduct({
              order: savedOrder._id,
              customer: savedOrder.customer,
              product: orderProduct.product,
              price: orderProduct.price,
              quantity: orderProduct.quantity,
            }))
              .forEach((orderProduct) => {
                CustomerProductPrice.findOne({
                  $and: [{ customer: order.customer },
                    { product: orderProduct.product }]
                })
                  .then((CustomerProductPriceObj) => {
                    if (CustomerProductPriceObj) {
                      orderProduct.price = CustomerProductPriceObj.price;
                      let index = -1;
                      for (let i = 0; i < recurringOrder.products.length; i += 1) {
                        if (orderProduct.product.equals(recurringOrder.products[i].product)) {
                          index = i;
                          break;
                        }
                      }
                      recurringOrder.products[index].price = CustomerProductPriceObj.price;
                      recurringOrder.save();
                      orderProduct.save()
                        .then((savedOrderProduct) => {
                          if (savedOrderProduct) {
                            console.log('Order Products Saved Successfully....', savedOrderProduct._id);
                          } else {
                            console.log('Error in saving order products');
                          }
                        });
                    } else {
                      orderProduct.save()
                        .then((savedOrderProduct) => {
                          if (savedOrderProduct) {
                            console.log('Order Products Saved Successfully....', savedOrderProduct._id);
                          } else {
                            console.log('Error in saving order products');
                          }
                        });
                    }
                  });
              });
            let notification = {
              refObjectId: savedOrder,
              level: 'success',
              user: recurringOrder.supplier.staff[0],
              userType: 'Supplier',
              key: 'newOrder',
              stateParams: 'order'
            };
            notificationCtrl.createNotification('order', notification, null, null, null, savedOrder._id);

            if (appSettings.emailSwitch) {
              const content = {
                recipientName: UserService.toTitleCase(recurringOrder.supplier.representativeName),
                orderId: `${appSettings.orderPrefix}${nextOrderId}`,
                orderPageUrl: `<a href=\'${appSettings.mainUrl}/supplier/orders/view/details/${savedOrder._id}\'>${appSettings.mainUrl}/supplier/orders/view/details/${savedOrder._id}</a>` // eslint-disable-line no-useless-escape
              };
              EmailHandler.sendEmail(recurringOrder.supplier.staff[0].email, content, 'NEWSUPPLIERORDER', recurringOrder.supplier.staff[0].language);
            }

            notification = {
              refObjectId: savedOrder,
              level: 'success',
              user: recurringOrder.customer.user,
              userType: 'Customer',
              key: 'newRecurringOrder',
              stateParams: 'order'
            };
            notificationCtrl.createNotification('order', notification, null, null, null, recurringOrder._id);
            console.log('Order Created Successfully....', savedOrder._id);
            callback(null, savedOrder);
          } else {
            console.log('Error While Creating Order....');
          }
        })
        .catch(e => console.log(e)); // eslint-disable-line no-console
    },
    function updateRecurringOrder(savedOrder, callback) {
      // Update startDate of recurring order according to the interval
      RecurringOrder.findOne({ _id: recurringOrder._id }, (err, obj) => {
        obj.startDate = moment(recurringOrder.startDate).add(recurringOrder.days * recurringOrder.orderFrequency, 'days').format(appSettings.momentFormat);
        obj.updatedAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
        obj.orderId = `${appSettings.orderPrefix}${nextOrderId}`;
        obj.save()
          .then((objSaved) => {
            if (objSaved) {
              callback(null, objSaved);
            } else {
              console.log('Error While Creating RecurringOrder....');
            }
          });
      });
    }
  ], (err, result) => {
    if (result) {
      console.log('Recurring Order Created Successfully....', result._id);
    }
  });
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
        Supplier.findOne({ _id: order.supplier._id })
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
                    let customerMonthCredit = 0;
                    if (customerTransaction.length > 0) {
                      // const startPaymentDueDate = moment(result.creditLimit.nextPaymentDueDate).subtract(Number(frequency), interval).startOf('day');
                      customerMonthCredit = customerTransaction.map(c => c).filter(c => c.type === 'debit' && (moment(c.createdAt) >= moment(result.creditLimit.startPaymentDate).tz(appSettings.timeZone).startOf('day') && moment(c.createdAt) <= moment(result.creditLimit.nextPaymentDueDate).tz(appSettings.timeZone).endOf('day')))
                        .map(c => c.amount).reduce((sum, value) => sum + value, 0);
                      Order.find({ $and: [{ supplier: result.supplierCreditLimit }, { customer }, { $and: [{ status: { $ne: 'Delivered' } }, { status: { $ne: 'Canceled' } }, { status: { $ne: 'CanceledByCustomer' } }, { status: { $ne: 'Rejected' } }, { status: { $ne: 'FailedToDeliver' } }] }] })
                        .then((orders) => {
                          const reservedBalance = orders.map(c => c.price + c.VAT).reduce((sum, value) => sum + value, 0); // eslint-disable-line max-len
                          if (orderTotal + reservedBalance + customerMonthCredit <= result.creditLimit.creditLimit) {
                            if (!customer.dueDateMissed) {
                              callback(null, customer);
                            } else {
                              const outOfCreditLimit = {
                                status: 'Failure',
                                errorCode: 7,
                                data: 'There are missed payment in the previous interval'
                              };
                              result.creditLimit.canOrder = false;
                              result.creditLimit.save()
                                .catch(e => callback(e, null));
                              callback(outOfCreditLimit, null);
                            }
                          } else {
                            const outOfCreditLimit = {
                              status: 'Failure',
                              errorCode: 7,
                              data: 'Credit limit will be reached if order is placed'
                            };
                            result.creditLimit.canOrder = ((result.creditLimit.creditLimit - customerMonthCredit) > 0 || result.creditLimit.exceedCreditLimit);
                            result.creditLimit.save()
                              .catch(e => callback(e, null));
                            callback(outOfCreditLimit, null);
                          }
                        });
                    } else if (orderTotal <= result.creditLimit.creditLimit) {
                      if (!customer.dueDateMissed) {
                        callback(null, customer);
                      } else {
                        const outOfCreditLimit = {
                          status: 'Failure',
                          errorCode: 7,
                          data: 'There are missed payment in the previous interval'
                        };
                        result.creditLimit.canOrder = false;
                        result.creditLimit.save()
                          .catch(e => callback(e, null));
                        callback(outOfCreditLimit, null);
                      }
                    } else {
                      const outOfCreditLimit = {
                        status: 'Failure',
                        errorCode: 7,
                        data: 'Credit limit will be reached if order is placed'
                      };
                      result.creditLimit.canOrder = ((result.creditLimit.creditLimit - customerMonthCredit) > 0 || result.creditLimit.exceedCreditLimit);
                      result.creditLimit.save()
                        .catch(e => callback(e, null));
                      callback(outOfCreditLimit, null);
                    }
                  });
              });
          });
      }
    });
}

export default {
  load,
  get,
  getHistory,
  cancel,
  update,
  list,
  create,
  orderRecurringOrder,
  orderPurchase,
  addProductToOrder,
  updateProductInOrder,
  deleteProductFromOrder
};
