import httpStatus from 'http-status';
import async from 'async';
import moment from 'moment-timezone';
import Category from '../models/category.model';
import Supplier from '../models/supplier.model';
import Customer from '../models/customer.model';
import CustomerProductSpecialPrice from '../models/customerProductPrice.model';
import Response from '../services/response.service';
import appSettings from '../../appSettings';

/**
 * Load category and append to req.
 */
function load(req, res, next, id) {
  Category.findById(id)
    .populate({
      path: 'childCategory',
      populate: {
        path: 'products',
        select: '_id englishName arabicName supplier status deleted coverPhoto images'
      }
    })
    .populate({
      path: 'products',
      select: '_id englishName arabicName supplier status deleted coverPhoto images'
    })
    .then((category) => {
      if (category) {
        req.category = category;
        req.category.products = req.category.products.sort(compare);
        return next();
      }
      return res.status(httpStatus.BAD_REQUEST).json(Response.failure(2));
    })
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Get category
 * @returns {Category}
 */
function get(req, res) {
  if (req.user.type === 'Admin') {
    res.json(Response.success(req.category));
  } else if (req.category.status === 'Active') {
    const category = req.category;
    if (req.user.type === 'Customer') {
      // category.childCategory.forEach((childCategoryObject) => {
      //   if (childCategoryObject.products.length > 0) {
      //     childCategoryObject.products = childCategoryObject.products
      //       .map(c => c)
      //       .filter(c => c.supplier.toString() === req.query.supplierId.toString());
      //   }
      // });
      // category.childCategory = category.childCategory
      //   .map(c => c)
      //   .filter(c => c.products.length > 0);
      Supplier.findOne({ _id: req.query.supplierId })
        .then((supplier) => {
          Category.findOne({ _id: category._id })
            .populate({
              path: 'childCategory',
              match: { $and: [{ deleted: false }, { status: { $ne: 'Hidden' } }] },
              populate: {
                path: 'products',
                match: { $and: [{ supplier }, { deleted: false }] },
              }
            })
            .then((cat) => {
              cat.childCategory = cat.childCategory.map(c => c).filter(c => c.products.length > 0);
              res.json(Response.success(cat));
            });
        });
    }
    if (req.user.type === 'Supplier') {
      res.json(Response.success(category));
    }
  } else {
    res.json(Response.failure(4));
  }
}

/**
 * Get category list of products
 */
function getProducts(req, res) {
  if (req.user.type === 'Supplier') {
    async.waterfall([
      function passParameter(callback) {
        callback(null, req.user._id);
      },
      getSupplierFromUser
    ], (err, result) => {
      Category.findOne({ _id: req.params.categoryId.toString() })
        .populate({
          path: 'childCategory',
          match: { $and: [{ deleted: false }, { status: { $ne: 'Hidden' } }] },
          populate: {
            path: 'products',
            match: { $and: [{ supplier: result }, { deleted: false }] },
            populate: [{
              path: 'categories',
              select: '_id arabicName englishName parentCategory',
              populate: {
                path: 'parentCategory',
                select: '_id arabicName englishName'
              }
            },
            {
              path: 'unit',
              select: '_id arabicName englishName'
            }]
          }
        })
        .populate({
          path: 'products',
          match: { $and: [{ supplier: result }, { deleted: false }] },
          options: {
            limit: Number(req.query.limit),
            skip: Number(req.query.skip)
          },
          populate: [{
            path: 'categories',
            select: '_id arabicName englishName parentCategory',
            populate: {
              path: 'parentCategory',
              select: '_id arabicName englishName'
            }
          },
          {
            path: 'unit',
            select: '_id arabicName englishName'
          }]
        })
        .then((cat) => {
          const products = [];
          if (cat.childCategory.length > 0) {
            cat.childCategory.forEach((childCatObj) => {
              childCatObj.products.forEach((childCatProducts) => {
                childCatProducts.coverPhoto = `${appSettings.imagesUrl}${childCatProducts.coverPhoto}`;
                let i;
                for (i = 0; i < childCatProducts.images.length; i += 1) {
                  childCatProducts.images[i] = `${appSettings.imagesUrl}${childCatProducts.images[i]}`;
                }
                products.push(childCatProducts);
              });
            });
          } else if (cat.products.length > 0) {
            cat.products.forEach((childCatProducts) => {
              childCatProducts.coverPhoto = `${appSettings.imagesUrl}${childCatProducts.coverPhoto}`;
              let i;
              for (i = 0; i < childCatProducts.images.length; i += 1) {
                childCatProducts.images[i] = `${appSettings.imagesUrl}${childCatProducts.images[i]}`;
              }
              products.push(childCatProducts);
            });
          }
          Category.findOne({ _id: req.params.categoryId.toString() })
            .populate({
              path: 'childCategory',
              match: { $and: [{ deleted: false }, { status: { $ne: 'Hidden' } }] },
              populate: {
                path: 'products',
                match: { supplier: result, deleted: false }
              }
            })
            .populate({
              path: 'products',
              match: { supplier: result, deleted: false }
            })
            .then((category) => {
              if (category.childCategory.length > 0) {
                let productsCount = 0;
                category.childCategory.forEach((childCat) => {
                  const catProducts = childCat.products;
                  productsCount += catProducts.length;
                });
                const prod = products.slice(Number(req.query.skip), ((Number(req.query.limit)
                  + Number(req.query.skip)) > products.length ?
                  (products.length)
                  : (Number(req.query.limit) + Number(req.query.skip))));
                const resultObj = {
                  products: prod,
                  count: productsCount
                };
                res.json(Response.success(resultObj));
              } else {
                const catProducts = category.products;
                const resultObj = {
                  products,
                  count: catProducts.length
                };
                res.json(Response.success(resultObj));
              }
            });
        });
    });
  } else {
    let productIndex = 0;
    let categoryIndex = 0;
    if (req.query.all === 'true') {
      Category.findOne({ _id: req.params.categoryId.toString() })
        .populate({
          path: 'childCategory',
          match: { $and: [{ deleted: false }, { status: { $ne: 'Hidden' } }] },
          populate: {
            path: 'products',
            match: { supplier: req.query.supplierId, deleted: false, status: { $ne: 'Hidden' } },
            populate: [{
              path: 'categories',
              select: '_id arabicName englishName parentCategory',
              populate: {
                path: 'parentCategory',
                select: '_id arabicName englishName'
              }
            },
            {
              path: 'unit',
              select: '_id arabicName englishName'
            }]
          }
        })
        .populate({
          path: 'products',
          match: { supplier: req.query.supplierId, deleted: false, status: { $ne: 'Hidden' } },
          options: {
            limit: Number(req.query.limit),
            skip: Number(req.query.skip)
          },
          populate: [{
            path: 'categories',
            select: '_id arabicName englishName parentCategory',
            populate: {
              path: 'parentCategory',
              select: '_id arabicName englishName'
            }
          },
          {
            path: 'unit',
            select: '_id arabicName englishName'
          }]
        })
        .then((cat) => {
          const products = [];
          if (cat.childCategory.length > 0) {
            cat.childCategory.forEach((childCatObj) => {
              childCatObj.products = childCatObj.products.sort(compare);
              childCatObj.products.forEach((childCatProducts) => {
                async.waterfall([
                  function passParameter(callback) {
                    callback(null, childCatProducts, req.query.supplierId, req.user._id);
                  },
                  getProductWithSpecialPrice
                ], (err, result) => {
                  childCatProducts.price = result;
                  childCatProducts.coverPhoto = `${appSettings.imagesUrl}${childCatProducts.coverPhoto}`;
                  let i;
                  for (i = 0; i < childCatProducts.images.length; i += 1) {
                    childCatProducts.images[i] = `${appSettings.imagesUrl}${childCatProducts.images[i]}`;
                  }

                  if (childCatProducts.price !== null) {
                    products.push(childCatProducts);
                    productIndex += 1;
                  } else {
                    productIndex += 1;
                  }
                  if (productIndex === childCatObj.products.length) {
                    categoryIndex += 1;
                    productIndex = 0;
                    if (categoryIndex === cat.childCategory.length) {
                      let prod = products.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > products.length ? (products.length) : (Number(req.query.limit) + Number(req.query.skip)))); // eslint-disable-line max-len
                      prod = prod.sort(compare);
                      const resultObj = {
                        products: prod,
                        count: products.length
                      };
                      res.json(Response.success(resultObj));
                    }
                  }
                });
              });
            });
          } else if (cat.products.length > 0) {
            cat.products.forEach((childCatProducts) => {
              async.waterfall([
                function passParameter(callback) {
                  callback(null, childCatProducts, req.query.supplierId, req.user._id);
                },
                getProductWithSpecialPrice
              ], (err, result) => {
                childCatProducts.price = result;
                childCatProducts.coverPhoto = `${appSettings.imagesUrl}${childCatProducts.coverPhoto}`;
                let i;
                for (i = 0; i < childCatProducts.images.length; i += 1) {
                  childCatProducts.images[i] = `${appSettings.imagesUrl}${childCatProducts.images[i]}`;
                }
                if (childCatProducts.price !== null) {
                  products.push(childCatProducts);
                  productIndex += 1;
                } else {
                  productIndex += 1;
                }
                if (productIndex === cat.products.length) {
                  let prod = products.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > products.length ? (products.length)
                    : (Number(req.query.limit) + Number(req.query.skip))));
                  prod = prod.sort(compare);
                  const resultObj = {
                    products: prod,
                    count: products.length
                  };
                  res.json(Response.success(resultObj));
                }
              });
            });
          }
        });
    } else {
      Category.findOne({ _id: req.params.categoryId.toString() })
        .populate({
          path: 'childCategory',
          match: { $and: [{ deleted: false }, { status: { $ne: 'Hidden' } }] },
          populate: {
            path: 'products',
            match: { supplier: req.query.supplierId, deleted: false, status: { $ne: 'Hidden' } },
            populate: [{
              path: 'categories',
              select: '_id arabicName englishName parentCategory',
              populate: {
                path: 'parentCategory',
                select: '_id arabicName englishName'
              }
            },
            {
              path: 'unit',
              select: '_id arabicName englishName'
            }]
          }
        })
        .populate({
          path: 'products',
          match: { supplier: req.query.supplierId, deleted: false, status: { $ne: 'Hidden' } },
          options: {
            limit: Number(req.query.limit),
            skip: Number(req.query.skip)
          },
          populate: [{
            path: 'categories',
            select: '_id arabicName englishName parentCategory',
            populate: {
              path: 'parentCategory',
              select: '_id arabicName englishName'
            }
          },
          {
            path: 'unit',
            select: '_id arabicName englishName'
          }]
        })
        .then((cat) => {
          let products = [];
          if (cat.childCategory.length > 0) {
            cat.childCategory.forEach((childCatObj) => {
              if (childCatObj.products.length > 0) {
                childCatObj.products.forEach((childCatProducts) => {
                  async.waterfall([
                    function passParameter(callback) {
                      callback(null, childCatProducts, req.query.supplierId, req.user._id);
                    },
                    getProductWithSpecialPrice
                  ], (err, result) => {
                    childCatProducts.price = result;
                    childCatProducts.coverPhoto = `${appSettings.imagesUrl}${childCatProducts.coverPhoto}`;
                    let i;
                    for (i = 0; i < childCatProducts.images.length; i += 1) {
                      childCatProducts.images[i] = `${appSettings.imagesUrl}${childCatProducts.images[i]}`;
                    }

                    if (childCatProducts.price !== null) {
                      products.push(childCatProducts);
                      productIndex += 1;
                    } else {
                      productIndex += 1;
                    }
                    if (productIndex === childCatObj.products.length) {
                      categoryIndex += 1;
                      productIndex = 0;
                      if (categoryIndex === cat.childCategory.length) {
                        products = products.sort(compare);
                        const prod = products.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > products.length ? (products.length) : (Number(req.query.limit) + Number(req.query.skip)))); // eslint-disable-line max-len
                        const resultObj = {
                          products: prod,
                          count: products.length
                        };
                        res.json(Response.success(resultObj));
                      }
                    }
                  });
                });
              } else {
                categoryIndex += 1;
                if (categoryIndex === cat.childCategory.length) {
                  const resultObj = {
                    products: [],
                    count: 0
                  };
                  res.json(Response.success(resultObj));
                }
              }
            });
          } else if (cat.products.length > 0) {
            cat.products.forEach((childCatProducts) => {
              async.waterfall([
                function passParameter(callback) {
                  callback(null, childCatProducts, req.query.supplierId, req.user._id);
                },
                getProductWithSpecialPrice
              ], (err, result) => {
                childCatProducts.price = result;
                childCatProducts.coverPhoto = `${appSettings.imagesUrl}${childCatProducts.coverPhoto}`;
                let i;
                for (i = 0; i < childCatProducts.images.length; i += 1) {
                  childCatProducts.images[i] = `${appSettings.imagesUrl}${childCatProducts.images[i]}`;
                }
                if (childCatProducts.price !== null) {
                  products.push(childCatProducts);
                  productIndex += 1;
                } else {
                  productIndex += 1;
                }
                if (productIndex === cat.products.length) {
                  products = products.sort(compare);
                  const prod = products.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > products.length ? (products.length)
                    : (Number(req.query.limit) + Number(req.query.skip))));
                  const resultObj = {
                    products: prod,
                    count: products.length
                  };
                  res.json(Response.success(resultObj));
                }
              });
            });
          }
        });
    }
  }
}

function getOtherProducts(req, res) {
  if (req.user.type === 'Customer') {
    let allProducts = [];
    let supplierProducts = [];
    const cat = req.category;
    if (cat.products.length > 0) {
      let index = 0;
      cat.products.forEach((productObj) => {
        async.waterfall([
          function passParameter(callback) {
            callback(null, productObj, req.query.supplierId, req.user._id);
          },
          getProductWithSpecialPrice
        ], (err, result) => {
          if (result === null) {
            productObj.coverPhoto = `${appSettings.imagesUrl}${productObj.coverPhoto}`;
            let i;
            for (i = 0; i < productObj.images.length; i += 1) {
              productObj.images[i] = `${appSettings.imagesUrl}${productObj.images[i]}`;
            }
            if (productObj.supplier.toString() === req.query.supplierId.toString() && productObj.status.toString() !== 'Hidden' && productObj.deleted === false) {
              allProducts.push(productObj);
            }
          }
          index += 1;
          if (index === cat.products.length) {
            allProducts = allProducts.sort(compare);
            const otherProducts = allProducts.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > allProducts.length ? (allProducts.length) : (Number(req.query.limit) + Number(req.query.skip)))); // eslint-disable-line max-len
            const resultObj = {
              otherProducts,
              count: allProducts.length
            };
            res.json(Response.success(resultObj));
          }
        });
      });
    } else {
      const childCategories = cat.childCategory.map(c => c);
      childCategories.forEach((childCategorieObj) => {
        if (childCategorieObj.products.length > 0) {
          childCategorieObj.products = childCategorieObj.products.sort(compare);
          childCategorieObj.products.forEach((productObj) => {
            if (productObj.supplier.toString() === req.query.supplierId.toString() && productObj.status.toString() !== 'Hidden' && productObj.deleted === false) {
              allProducts.push(productObj);
            }
          });
        }
      });
      let index = 0;
      if (allProducts.length > 0) {
        allProducts = allProducts.sort(compare);
        allProducts.forEach((productObj) => {
          async.waterfall([
            function passParameter(callback) {
              callback(null, productObj, req.query.supplierId, req.user._id);
            },
            getProductWithSpecialPrice
          ], (err, result) => {
            if (result === null) {
              productObj.coverPhoto = `${appSettings.imagesUrl}${productObj.coverPhoto}`;
              let i;
              for (i = 0; i < productObj.images.length; i += 1) {
                productObj.images[i] = `${appSettings.imagesUrl}${productObj.images[i]}`;
              }
              supplierProducts.push(productObj);
            }
            supplierProducts = supplierProducts.sort(compare);
            index += 1;
            if (index === allProducts.length) {
              const otherProducts = supplierProducts.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > supplierProducts.length ? (supplierProducts.length) : (Number(req.query.limit) + Number(req.query.skip)))); // eslint-disable-line max-len
              const resultObj = {
                otherProducts,
                count: supplierProducts.length
              };
              res.json(Response.success(resultObj));
            }
          });
        });
      } else {
        const resultObj = {
          otherProducts: [],
          count: 0
        };
        res.json(Response.success(resultObj));
      }
    }
  } else {
    res.status(httpStatus.UNAUTHORIZED).json(Response.failure(4));
  }
}

/**
 * Create new category
 * @property {objectId} req.body.parentCategory - The parent category of category.
 * @property {string} req.body.arabicName - The arabic name of category.
 * @property {string} req.body.englishName - The english name of category.
 * @property {string} req.body.status - The status of category.
 * @returns {Category}
 */
function create(req, res) {
  const category = new Category({
    parentCategory: req.body.parentCategory,
    arabicName: req.body.arabicName,
    englishName: req.body.englishName,
    status: req.body.status,
    createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat)
  });
  if (category.parentCategory) {
    Category.findOne({ _id: category.parentCategory }, (err, cat) => {
      cat.childCategory.push(category._id);
      cat.save();
    });
  }
  category.save()
    .then(savedCategory => res.json(Response.success(savedCategory)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Update existing category
 * @property {objectId} req.body.parentCategory - The parent category of category.
 * @property {string} req.body.arabicName - The arabic name of category.
 * @property {string} req.body.englishName - The english name of category.
 * @property {string} req.body.status - The status of category.
 * @returns {Category}
 */
function update(req, res) {
  const category = req.category;
  category.arabicName = req.body.arabicName;
  category.englishName = req.body.englishName;
  category.status = req.body.status;

  category.save()
    .then(updatedCategory => res.json(Response.success(updatedCategory)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

/**
 * Get category list.
 * @property {number} req.query.skip - Number of categorys to be skipped.
 * @property {number} req.query.limit - Limit number of categorys to be returned.
 * @returns {Category[]}
 */
function list(req, res) {
  if (req.user.type === 'Admin') {
    Category.find({ $and: [{ parentCategory: null }, { deleted: false }] })
      .populate({
        path: 'childCategory',
        match: { deleted: false }
      })
      .sort({
        createdAt: -1
      })
      .skip(Number(req.query.skip))
      .limit(Number(req.query.limit))
      .then((categories) => {
        const categoriesObject = {
          categories,
          count: categories.length
        };
        res.json(Response.success(categoriesObject));
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
      });
  } else if (req.user.type === 'Supplier') {
    Category.find({ $and: [{ parentCategory: null }, { deleted: false }, { status: { $ne: 'Hidden' } }] })
      .populate({
        path: 'childCategory',
        match: { $and: [{ deleted: false }, { status: { $ne: 'Hidden' } }] },
        populate: {
          path: 'products',
          populate: {
            path: 'unit',
            select: '_id arabicName englishName'
          },
          match: { deleted: false }
        }
      })
      .sort({
        createdAt: -1
      })
      .then((resultCategoriesArr) => {
        const resultCategories = [];
        resultCategoriesArr.forEach((catObj) => {
          if (catObj.childCategory.length > 0) {
            resultCategories.push(catObj);
          }
        });
        let categories = [];
        if (req.query.skip && req.query.limit) {
          categories = resultCategories.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > resultCategories.length ? (resultCategories.length)
            : (Number(req.query.limit) + Number(req.query.skip))));
        } else {
          categories = resultCategories;
        }
        const categoriesObject = {
          categories,
          count: resultCategories.length
        };
        res.json(Response.success(categoriesObject));
      })
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  } else {
    Customer.findOne({ user: req.user._id })
      .then((customer) => {
        if (customer.type === 'Staff') {
          return Customer.findOne({ _id: customer.customer });
        }
        return customer;
      }).then((customer) => {
        CustomerProductSpecialPrice.find({ supplier: req.query.supplierId, customer: customer._id })
        .then((productsWithSpecialPrices) => {
          const productsWithSpecialPricesIds = productsWithSpecialPrices.map(c => c.product);
          if (appSettings.customerSpecialPricesSwitch && req.query.all === 'false') {
            Category.find({ $and: [{ parentCategory: null }, { deleted: false }] })
              .populate({
                path: 'childCategory',
                match: { $and: [{ deleted: false }, { status: { $ne: 'Hidden' } }, { products: { $gt: [] } }] },
                populate: {
                  path: 'products',
                  populate: {
                    path: 'unit',
                    select: '_id arabicName englishName'
                  },
                  match: {
                    supplier: req.query.supplierId,
                    deleted: false,
                    _id: { $in: productsWithSpecialPricesIds }
                  }
                }
              })
              .where('status').equals('Active')
              .sort({
                createdAt: -1
              })
              .then((categoriesArr) => {
                categoriesArr.forEach((catObj) => {
                  catObj.childCategory = catObj.childCategory.map(c => c).filter(c => c.products.length > 0);
                });
                const resultCategories = categoriesArr.map(c => c)
                  .filter(c => c.childCategory.length > 0);
                const resultCategoriesArr = resultCategories.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > resultCategories.length ? (resultCategories.length)
                  : (Number(req.query.limit) + Number(req.query.skip))));
                const resultObject = {
                  categories: resultCategoriesArr,
                  count: resultCategories.length
                };
                res.json(Response.success(resultObject));
              });
          } else {
            Category.find({ $and: [{ parentCategory: null }, { deleted: false }, { childCategory: { $gt: [] } }] })
              .populate({
                path: 'childCategory',
                match: { $and: [{ deleted: false }, { status: { $ne: 'Hidden' } }, { products: { $gt: [] } }] },
                populate: {
                  path: 'products',
                  populate: {
                    path: 'unit',
                    select: '_id arabicName englishName'
                  },
                  match: { supplier: req.query.supplierId, deleted: false }
                }
              })
              .where('status').equals('Active')
              .sort({
                createdAt: -1
              })
              .then((categoriesArr) => {
                const resultCategoriesArr = categoriesArr.slice(Number(req.query.skip), ((Number(req.query.limit) + Number(req.query.skip)) > categoriesArr.length ? (categoriesArr.length)
                  : (Number(req.query.limit) + Number(req.query.skip))));
                const resultObject = {
                  categories: resultCategoriesArr,
                  count: categoriesArr.length
                };
                res.json(Response.success(resultObject));
              });
          }
        });
      });
  }
}


/**
 * Delete category.
 * @returns {Category}
 */
function remove(req, res) {
  const category = req.category;
  if (typeof category.parentCategory === 'undefined') {
    if (category.childCategory.length > 0 || category.products.length > 0) {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(17)); // { message: 'Main Category contains SubCategories you must delete them first.' }
    } else {
      category.remove()
        .then(deletedCategory => res.json(Response.success(deletedCategory)))
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
    }
  } else if (category.products.length > 0) {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(18)); // { message: 'SubCategory contains Products you must delete them first.' }
  } else {
    category.remove()
      .then(deletedCategory => res.json(Response.success(deletedCategory)))
      .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  }
  // if (category.childCategory.length > 0) {
  //   category.childCategory.forEach((subCategoriesObj) => {
  //     subCategoriesObj.status = 'Hidden';
  //     subCategoriesObj.save();
  //   });
  //   category.status = 'Hidden';
  //   category.save()
  //     .then(deletedCategory => res.json(Response.success(deletedCategory)))
  //     .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
  // }
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
    .exec((err, supplier) => callback(err, supplier));
}

function getProductWithSpecialPrice(product, supplierId, userId, callback) {
  Customer.findOne({ user: userId })
    .then((customer) => {
      if (customer.type === 'Staff') {
        return Customer.findOne({ _id: customer.customer });
      }
      return customer;
    }).then((customer) => {
      CustomerProductSpecialPrice.findOne({
        product: product._id,
        supplier: supplierId,
        customer: customer._id
      })
      .then((productSpecialPrice) => {
        if (appSettings.customerSpecialPricesSwitch) {
          if (productSpecialPrice) {
            callback(null, productSpecialPrice.price);
          } else {
            callback(null, null);
          }
        } else if (productSpecialPrice) {
          callback(null, productSpecialPrice.price);
        } else {
          callback(null, product.price);
        }
      });
    });
}

function compare(a, b) {
  if (a.englishName < b.englishName) {
    return -1;
  }
  if (a.englishName > b.englishName) {
    return 1;
  }
  return 0;
}

export default {
  load,
  get,
  getProducts,
  getOtherProducts,
  create,
  update,
  list,
  remove
};
