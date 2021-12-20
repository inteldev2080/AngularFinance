import async from 'async';
import httpStatus from 'http-status';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
import Product from '../models/product.model';
import Customer from '../models/customer.model';
import Category from '../models/category.model';
import Supplier from '../models/supplier.model';
import CustomerProductPrice from '../models/customerProductPrice.model';
import Response from '../services/response.service';
import EmailHandler from '../../config/emailHandler';
import notificationCtrl from './notification.controller';
import UserService from '../services/user.service';
import CustomerInvite from '../models/customerInvite.model';

/**
 * Create new product
 * @property {objectId []} req.body.categories - The categories of product.
 * @property {string} req.body.arabicName - The arabic name of product.
 * @property {string} req.body.englishName - The english name of product.
 * @property {string} req.body.arabicDescription - The arabic description of product.
 * @property {string} req.body.englishDescription - The english description of product.
 * @property {string} req.body.sku - The sku of product.
 * @property {string} req.body.store - The store of product.
 * @property {string} req.body.shelf - The shelf of product.
 * @property {number} req.body.price - The price of product.
 * @property {string} req.body.unit - The unit of product.
 * @property {string} req.body.status - The status of product.
 * @property {string []} req.body.images - The images of product.
 * @returns {Product}
 */
function create(req, res) {
  const product = new Product({
    categories: req.body.categories,
    arabicName: req.body.arabicName,
    englishName: req.body.englishName,
    arabicDescription: req.body.arabicDescription,
    englishDescription: req.body.englishDescription,
    sku: req.body.sku,
    store: req.body.store,
    shelf: req.body.shelf,
    price: req.body.price,
    unit: req.body.unit,
    status: req.body.status,
    images: req.body.images,
    coverPhoto: req.body.coverPhoto,
    createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  });

  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParameters(callback) {
      callback(null, req.user._id, product);
    },
    getSupplierFromUser,
    checkSKUAlreadyExists,
    createProduct
  ],
    (err, result) => {
      if (err) {
        if (err === 115) {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
        } else {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        }
      } else {
        res.json(Response.success(result));
      }
    });
}

/**
 * Update existing product
 * @property {objectId []} req.body.categories - The categories of product.
 * @property {string} req.body.arabicName - The arabic name of product.
 * @property {string} req.body.englishName - The english name of product.
 * @property {string} req.body.arabicDescription - The arabic description of product.
 * @property {string} req.body.englishDescription - The english description of product.
 * @property {string} req.body.sku - The sku of product.
 * @property {string} req.body.store - The store of product.
 * @property {string} req.body.shelf - The shelf of product.
 * @property {number} req.body.price - The price of product.
 * @property {string} req.body.unit - The unit of product.
 * @property {string} req.body.status - The status of product.
 * @property {string []} req.body.images - The images of product.
 * @returns {Product}
 */
function update(req, res) {
  const currentProductCategory = req.product.categories[0]._id;
  const product = req.product;
  product.categories = req.body.categories;
  product.arabicName = req.body.arabicName;
  product.englishName = req.body.englishName;
  product.arabicDescription = req.body.arabicDescription;
  product.englishDescription = req.body.englishDescription;
  product.sku = req.body.sku;
  product.store = req.body.store;
  product.shelf = req.body.shelf;
  product.price = req.body.price;
  product.unit = req.body.unit;
  product.status = req.body.status;
  product.images = req.body.images;
  product.coverPhoto = req.body.coverPhoto;

  if (product.coverPhoto.startsWith('http')) {
    const splitArrUrl = product.coverPhoto.split('/');
    product.coverPhoto = splitArrUrl[splitArrUrl.length - 1];
  }
  for (let i = 0; i < product.images.length; i += 1) {
    if (product.images[i].startsWith('http')) {
      const splitArrUrl = product.images[i].split('/');
      product.images[i] = splitArrUrl[splitArrUrl.length - 1];
    }
  }
  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParamters(callback) {
      callback(null, req.user._id, product);
    },
    getSupplierFromUser,
    // checkSKUAlreadyExists,
    function passParameter(supplier, updatedProduct, callback) {
      callback(null, supplier, updatedProduct, currentProductCategory);
    },
    updateProduct
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
 * Get product
 * @returns {Product}
 */
function get(req, res) {
  // Check if the user is a customer or a supplier, and if they have access to this product.
  if (req.user.type === 'Supplier') {
    async.waterfall([
        // Function that passes the parameters to the second function.
      function passParamters(callback) {
        callback(null, req.user._id, null);
      },
      getSupplierFromUser
    ],
      (err, supplierId) => {
        if (err) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
        }
        // Check if the product belongs to the supplier
        if (supplierId.equals(req.product.supplier._id)) {
          const product = req.product;
          product.coverPhoto = `${appSettings.imagesUrl}${product.coverPhoto}`;
          let i;
          for (i = 0; i < product.images.length; i += 1) {
            product.images[i] = `${appSettings.imagesUrl}${product.images[i]}`;
          }
          res.json(Response.success(product));
        } else {
          res.status(httpStatus.BAD_REQUEST).json(Response.failure(4));
        }
      });
  } else if (req.user.type === 'Customer') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id, null);
      },
      getCustomerFromUser,
      function passParameter(customerId, supplierId, callback) {
        supplierId = req.product.supplier;
        callback(null, customerId, supplierId);
      },
      getCustomerSpecialPrices
    ], (err, result) => {
      if (result.length > 0) {
        const resultProduct = result.map(c => c)
          .filter(c => c.product.toString() === req.product._id.toString());
        if (resultProduct.length > 0) {
          Product.findById(resultProduct[0].product)
            .populate('categories')
            .populate('unit')
            .then((product) => {
              if (appSettings.customerSpecialPricesSwitch) {
                product.price = resultProduct[0].price;
              }
              product.coverPhoto = `${appSettings.imagesUrl}${product.coverPhoto}`;
              let i;
              for (i = 0; i < product.images.length; i += 1) {
                product.images[i] = `${appSettings.imagesUrl}${product.images[i]}`;
              }
              res.json(Response.success(product));
            });
        } else {
          Product.findById(req.product._id)
            .populate('categories')
            .populate('unit')
            .then((product) => {
              product.coverPhoto = `${appSettings.imagesUrl}${product.coverPhoto}`;
              let i;
              for (i = 0; i < product.images.length; i += 1) {
                product.images[i] = `${appSettings.imagesUrl}${product.images[i]}`;
              }
              const resultObject = {
                _id: product._id,
                supplier: product.supplier,
                arabicName: product.arabicName,
                englishName: product.englishName,
                arabicDescription: product.arabicDescription,
                englishDescription: product.englishDescription,
                sku: product.sku,
                store: product.store,
                shelf: product.shelf,
                price: product.price,
                unit: product.unit,
                deleted: product.deleted,
                createdAt: product.createdAt,
                status: product.status,
                coverPhoto: product.coverPhoto,
                images: product.images,
                categories: product.categories,
                requestFeature: true
              };
              res.json(Response.success(resultObject));
            });
        }
      } else {
        Product.findById(req.product._id)
          .populate('categories')
          .populate('unit')
          .then((product) => {
            product.coverPhoto = `${appSettings.imagesUrl}${product.coverPhoto}`;
            let i;
            for (i = 0; i < product.images.length; i += 1) {
              product.images[i] = `${appSettings.imagesUrl}${product.images[i]}`;
            }
            const resultObject = {
              _id: product._id,
              supplier: product.supplier,
              arabicName: product.arabicName,
              englishName: product.englishName,
              arabicDescription: product.arabicDescription,
              englishDescription: product.englishDescription,
              sku: product.sku,
              store: product.store,
              shelf: product.shelf,
              price: product.price,
              unit: product.unit,
              deleted: product.deleted,
              createdAt: product.createdAt,
              status: product.status,
              coverPhoto: product.coverPhoto,
              images: product.images,
              categories: product.categories,
              requestFeature: true
            };
            res.json(Response.success(resultObject));
          });
      }
    });
  }
}

/**
 * Get product list.
 * @property {number} req.query.skip - Number of products to be skipped.
 * @property {number} req.query.limit - Limit number of products to be returned.
 * @returns {Product[]}
 */
function list(req, res) {
  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParamters(callback) {
      callback(null, req.user._id, null);
    },
    getSupplierFromUser
  ],
    (err, supplierId) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      }

      Product.find({ deleted: false })
        .populate({
          path: 'categories',
          select: '_id arabicName englishName parentCategory status',
          match: { status: 'Active' },
          populate: {
            path: 'parentCategory',
            select: '_id arabicName englishName status'
          }
        })
        .populate({
          path: 'unit',
          select: '_id arabicName englishName'
        })
        .where('supplier').equals(supplierId)
        .sort({
          createdAt: -1
        })
        .then((productsArr) => {
          const skip = Number(req.query.skip);
          const limit = Number(req.query.limit);
          const resultProductsArr = productsArr.map(c => c).filter(c => c.categories.length > 0);
          let products = [];
          if (req.query.skip && req.query.limit) {
            products = resultProductsArr.slice(skip, (limit + skip) > resultProductsArr.length ? (resultProductsArr.length) // eslint-disable-line max-len
              : (limit + skip));
          } else {
            products = resultProductsArr;
          }
          products.forEach((productObj) => {
            productObj.coverPhoto = `${appSettings.imagesUrl}${productObj.coverPhoto}`;
            let i;
            for (i = 0; i < productObj.images.length; i += 1) {
              productObj.images[i] = `${appSettings.imagesUrl}${productObj.images[i]}`;
            }
          });
          const productsObject = {
            products,
            count: resultProductsArr.length
          };
          res.json(Response.success(productsObject));
        })
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
    });
}

/**
 * Get product list for customer
 * @property {ObjectId} req.params.supplier - Id of supplier
 * @property {number} req.query.skip - Number of products to be skipped.
 * @property {number} req.query.limit - Limit number of products to be returned.
 * @returns {Product[]}
 */
function listForCustomer(req, res) {
  async.waterfall([
      // Function that passes the parameters to the second function.
    function passParamters(callback) {
      callback(null, req.user, req.params.supplier, req.query.limit, req.query.skip);
    },
    verifyCustomerInvite,
    getCustomer,
    getSupplierProductsForCustomer
  ],
    (err, products) => {
      if (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else {
        res.json(Response.success(products));
      }
    });
}

/**
 * Delete product.
 * @returns {Product}
 */
function remove(req, res) {
  const product = req.product;
  product.deleted = true;
  // product.status = 'Hidden';

  product.save()
    .then(deletedProduct => res.json(Response.success(deletedProduct)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

function requestSpecialPrice(req, res) {
  const product = req.product;
  Customer.findOne({ user: req.user._id })
    .select('_id representativeName branch')
    .populate('branch')
    .then((customer) => {
      if (appSettings.emailSwitch) {
        const content = {
          recipientName: UserService.toTitleCase(product.supplier.representativeName),
          productName: `${product.supplier.staff[0].language === 'en' ? product.englishName : product.arabicName}`,
          customerName: customer.representativeName
        };
        EmailHandler.sendEmail(product.supplier.staff[0].email, content, 'REQUESTSPECIALPRICE', product.supplier.staff[0].language);
      }
      const notification = {
        refObjectId: product._id,
        level: 'success',
        user: product.supplier.staff[0]._id,
        userType: 'Supplier',
        key: 'specialPriceRequest',
        stateParams: 'product'
      };
      notificationCtrl.createNotification('product', notification, null, null, null, product._id);
      res.json(Response.success(product));
    });
}


/* Helper Functions */

/**
 * Load product and append to req.
 */
function load(req, res, next, id) {
  Product.findById(id)
    .populate({
      path: 'supplier',
      select: '_id representativeName staff',
      populate: {
        path: 'staff',
        select: '_id firstName lastName email language'
      }
    })
    .populate({
      path: 'categories',
      select: '_id arabicName englishName parentCategory',
      populate: {
        path: 'parentCategory',
        select: '_id arabicName englishName'
      }
    })
    .populate('unit')
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
 * Helper Function
 * Get supplier using the user is.
 * @property {string} userId - The id of the supplier user.
 * @property {string} customerEmail - The email of the customer to be invited
 * @returns {Supplier}
 */
function getSupplierFromUser(userId, product, callback) {
  Supplier.findOne()
    .where('staff').in([userId])
    .exec((err, supplier) => callback(err, supplier._id, product));
}

/**
 * Helper Function
 * Creates the product.
 * @property {Product} product - The product.
 * @property {Supplier} supplier - The logged on supplier
 * @returns {Product}
 */
function createProduct(supplierId, product, callback) {
  const newProduct = product;
  newProduct.supplier = supplierId;

  newProduct.save()
    .then((savedProduct) => {
      Category.findByIdAndUpdate(
        { _id: savedProduct.categories[0] },
        { $push: { products: savedProduct._id } }).exec();
      callback(null, savedProduct);
    })
    .catch(e => callback(e, null));
}

/**
 * Helper Function
 * Updates the product.
 * @property {Product} product - The updated product
 * @property {Supplier} supplier - The logged on supplier
 * @returns {Product}
 */
function updateProduct(supplierId, updatedProduct, currentProductCategory, callback) {
  // Check that the owner of the product is the same as the user updating it.
  if (updatedProduct.categories[0].toString() !== currentProductCategory.toString()) {
    Category.findById(currentProductCategory)
      .then((category) => {
        category.products.remove(updatedProduct._id);
        category.save();
        Category.findByIdAndUpdate(
          { _id: updatedProduct.categories[0] },
          { $push: { products: updatedProduct._id } }).exec();
      });
  }
  if (supplierId.equals(updatedProduct.supplier._id)) {
    updatedProduct.save()
      .then(savedProduct => callback(null, savedProduct))
      .catch(e => callback(e, null));
  } else {
    callback(4, null);
  }
}

/**
 * Helper Function
 * Checks whether the customer is active with the supplier.
 * @property {User} customerUser - The customer user.
 * @property {ObjectId} supplierId - The id of the supplier user.
 * @returns {ObjectId, User}
 */
function verifyCustomerInvite(customerUser, supplierId, limit, skip, callback) {
  const customerId = customerUser._id;
  Customer.findOne({ user: customerId })
    .populate('user')
    .then((customer) => {
      if (customer.type === 'Staff') {
        return Customer.findOne({ _id: customer.customer })
          .populate('user');
      }
      return customer;
    }).then((customer) => {
      let customerEmail = '';
      if (customer) {
        customerEmail = customer.user.email;
      } else {
        customerEmail = customerUser.email;
      }
      CustomerInvite.findOne()
      .where('supplier').equals(supplierId)
      .where('customerEmail').equals(customerEmail)
      .where('status').equals('Active')
      .then((customerInvite) => {
        if (customerInvite) {
          callback(null, customerUser._id, supplierId, limit, skip);
        } else {
          callback(4, null);
        }
      });
    });
}

/**
 * Helper Function
 * Get details of customer.
 * @property {string} userId - The id of the customer user.
 * @returns {Customer}
 */
function getCustomer(userId, supplierId, limit, skip, callback) {
  Customer.findOne({ user: userId }).then((customer) => {
    if (customer.type === 'Staff') {
      return Customer.findOne({ _id: customer.customer });
    }
    return customer;
  }).then((customer) => {
    callback(null, customer._id, supplierId, limit, skip);
  });
}

/**
 * Helper Function
 * Get customer using the user.
 * @property {string} userId - The id of the customer user.
 * @returns {Customer}
 */
function getCustomerFromUser(userId, supplierId, callback) {
  Customer.findOne({ user: userId })
    .populate('user')
    .then((customer) => {
      if (customer.type === 'Staff') {
        return Customer.findOne({ _id: customer.customer })
          .populate('user');
      }
      return customer;
    }).then((customer) => {
      callback(null, customer, supplierId);
    }).catch((err) => {
      callback(err, null, null);
    });
}

/**
 * Helper Function
 * Gets the active products and special product prices for a customer in parallel.
 * @property {ObjectId} customerId - The id of the customer user.
 * @property {ObjectId} supplierId - The id of the supplier user.
 * @returns {ObjectId, User}
 */
function getSupplierProductsForCustomer(customerId, supplierId, limit, skip, callback) {
  async.parallel({
    products: parallelCallback => getActiveProducts(supplierId, limit, skip, parallelCallback),
    prices: parallelCallback => getCustomerSpecialPrices(customerId, supplierId, parallelCallback)
  },
    (err, result) => {
      if (err) {
        callback(err);
      }
      const productsWithSpecialPrices = [];
      // Update the supplier's products with the special pricing if it exists.
      for (let productIndex = 0; productIndex < result.products.length; productIndex += 1) {
        const product = result.products[productIndex];
        for (let priceIndex = 0; priceIndex < result.prices.length; priceIndex += 1) {
          const specialPrice = result.prices[priceIndex];
          if (specialPrice.product.toString() === product._id.toString()) {
            productsWithSpecialPrices.push(product);
            product.price = specialPrice.price;
            break;
          }
        }
      }
      Product.find()
        .where('supplier').equals(supplierId)
        .where('status').equals('Active')
        .sort({ createdAt: -1 })
        .then((productsCount) => {
          if (productsWithSpecialPrices.length >= 0 && appSettings.customerSpecialPricesSwitch) {
            const productsObject = {
              products: productsWithSpecialPrices,
              count: productsWithSpecialPrices.length
            };
            callback(null, productsObject);
          } else {
            const productsObject = {
              products: result.products,
              count: productsCount.length
            };
            callback(null, productsObject);
          }
        });
    });
}

/**
 * Helper Function
 * Gets the supplier's active products.
 * @property {ObjectId} supplierId - The id of the supplier user.
 * @returns {ObjectId, User}
 */
function getActiveProducts(supplierId, limit, skip, callback) {
  Product.find({ deleted: false })
    .populate({
      path: 'categories',
      select: '_id arabicName englishName parentCategory',
      populate: {
        path: 'parentCategory',
        select: '_id arabicName englishName'
      }
    })
    .populate({
      path: 'unit',
      select: '_id arabicName englishName'
    })
    .where('supplier').equals(supplierId)
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .then((products) => {
      products.forEach((productObj) => {
        productObj.coverPhoto = `${appSettings.imagesUrl}${productObj.coverPhoto}`;
        let i;
        for (i = 0; i < productObj.images.length; i += 1) {
          productObj.images[i] = `${appSettings.imagesUrl}${productObj.images[i]}`;
        }
      });
      callback(null, products);
    })
    .catch(e => callback(e, null));
}

/**
 * Helper Function
 * Get's the customer's special priced products.
 * @property {ObjectId} supplierId - The id of the supplier user.
 * @returns {ObjectId}
 */
function getCustomerSpecialPrices(customerId, supplierId, callback) {
  CustomerProductPrice.find()
    .where('customer').equals(customerId)
    .where('supplier').equals(supplierId)
    .then(customerSpecialPrices => callback(null, customerSpecialPrices))
    .catch(e => callback(e, null));
}

/**
 * Helper Function
 * Check the unique SKU.
 */
function checkSKUAlreadyExists(supplierId, product, callback) {
  Product.findOne({ supplier: supplierId, sku: product.sku }).then((productFound) => {
    if (productFound) {
      callback(115, null);
    } else {
      callback(null, supplierId, product);
    }
  }).catch(e => callback(e, null));
}

export default {
  load,
  get,
  create,
  update,
  list,
  remove,
  listForCustomer,
  requestSpecialPrice
};
