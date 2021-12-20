import httpStatus from 'http-status';
import Recipes from '../models/recipes.model';
import Ingredients from '../models/ingredients.model';
import Response from '../services/response.service';
import moment from 'moment-timezone';
import appSettings from '../../appSettings';
import { JsBarcode } from 'jsbarcode';
import { canvas } from 'canvas';
import { _ } from 'lodash';
import async from 'async';
import Product from '../models/product.model';
import Supplier from '../models/supplier.model';

/**
 * Get Recipes list.
 * @property {number} req.query.skip - Number of recipes to be skipped.
 * @property {number} req.query.limit - Limit number of crecipes  to be returned.
 * @returns {Recipes[]}
 */

function list(req, res) {
  let inventoriesObject = {};

  let offset = parseInt(req.query.skip, 10),
    limit = parseInt(req.query.limit, 10);

  offset *= limit;

  Recipes.find({
    deleted: false,
    supplierId: req.user._id
  })
    .populate({
      path: 'addIngredients.ingredientId',
      match: {
        deleted: false
      }
    }).sort({
      createdAt: -1
    }).skip(offset)
    .limit(limit)
    .then((recipes) => {
      inventoriesObject = {
        recipes
      };
      return Recipes.count({
        deleted: false,
        supplierId: req.user._id
      });
    }).then((recipesCount) => {
      inventoriesObject.count = recipesCount;
      res.json(Response.success(inventoriesObject));
    }).catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
    });
}

function add(req, res) {
  try {
    const recipesObject = {
      sku: req.body.recipeSku,
      barcode: req.body.barCode,
      barcodeImage: '',
      arabicName: req.body.arabicName || '',
      englishName: req.body.englishName,
      type: req.body.typeMethod === 'Recipe' ? 1 : 2,
      createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
      supplierId: req.user._id
    };

    recipesObject.barcodeImage = '';

    const recipes = new Recipes(recipesObject);

    Recipes.findOne({
      deleted: false,
      $or: [{
        englishName: recipesObject.englishName
      }, {
        sku: recipesObject.sku
      }, {
        barcode: recipesObject.barcode
      }]
    }).then((checkExists) => {
      if (checkExists && checkExists.englishName === recipesObject.englishName) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(21));
      } else if (checkExists && checkExists.sku === recipesObject.sku) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(22));
      } else if (checkExists && checkExists.barcode === recipesObject.barcode) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(23));
      } else {
        return recipes.save();
      }
    }).then(savedRecipes => res.json(Response.success(savedRecipes)))
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
      });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
  }
}

function remove(req, res) {
  const recipeId = req.params.Id;

  Recipes.update({
    _id: recipeId
  }, {
    $set: {
      deleted: true
    }
  }).then(deletedInventory => res.json(Response.success(deletedInventory)))
    .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

function getSingle(req, res) {
  const recipeId = req.params.recipeId;

  let inventoriesObject = {};

  Recipes.find({
    deleted: false,
    _id: recipeId
  })
    .populate({
      path: 'Ingredients',
      match: {
        deleted: false
      }
    })
    .then((recipes) => {
      inventoriesObject = {
        recipes
      };
      res.json(Response.success(inventoriesObject));
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}


function ingredientAdd(req, res) {
  try {
    const recipeItemId = req.body.recipeItemId;

    const ingredientObject = {
      sku: req.body.sku,
      barcode: req.body.barCode,
      barcodeImage: '',
      arabicName: req.body.arabicName || '',
      englishName: req.body.englishName,
      quantity: req.body.quantity,
      threshold: req.body.threshold,
      unit: req.body.unit.name,
      createdAt: moment().tz(appSettings.timeZone).format(appSettings.momentFormat),
      supplierId: req.user._id
    };

    ingredientObject.barcodeImage = '';

    const ingredientsModel = new Ingredients(ingredientObject);

    Ingredients.findOne({
      deleted: false,
      $or: [{
        englishName: ingredientObject.englishName
      }, {
        sku: ingredientObject.sku
      }, {
        barcode: ingredientObject.barcode
      }]
    }).then((checkExists) => {
      if (checkExists && checkExists.englishName === ingredientObject.englishName) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(21));
      } else if (checkExists && checkExists.sku === ingredientObject.sku) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(22));
      } else if (checkExists && checkExists.barcode === ingredientObject.barcode) {
        res.status(httpStatus.BAD_REQUEST).json(Response.failure(23));
      } else {
        return ingredientsModel.save();
      }
    }).then((savedIngredient) => {
      savedIngredient = JSON.parse(JSON.stringify(savedIngredient));

      if (recipeItemId) {
        Recipes.update({
          _id: recipeItemId
        }, {
          $push: {
            ingredients: savedIngredient._id
          }
        }).exec();
      }

      res.json(Response.success(savedIngredient));
    }).catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
    });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
  }
}

function ingredientRemove(req, res) {
  const InventoryId = req.params.InventoryId;

  Recipes.findOne({
    'addIngredients._id': InventoryId
  }).then(recipeData => Recipes.update({
    _id: recipeData._id,
    'addIngredients._id': InventoryId
  }, {
    $pull: {
      addIngredients: {
        _id: InventoryId
      }
    }
  }).exec()).then(deletedInventory => res.json(Response.success(deletedInventory)))
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
    });
}


function ingredientList(req, res) {
  let ingredientObject = {};

  let offset = parseInt(req.query.skip, 10),
    limit = parseInt(req.query.limit, 10);

  offset *= limit;

  Ingredients.find({
    deleted: false,
    supplierId: req.user._id
  })
    .sort({
      createdAt: -1
    }).skip(offset)
    .limit(limit)
    .then((ingredients) => {
      ingredientObject = {
        ingredients
      };
      return Ingredients.count({
        deleted: false,
        supplierId: req.user._id
      });
    }).then((ingredientsCount) => {
      ingredientObject.count = ingredientsCount;
      res.json(Response.success(ingredientObject));
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e)));
}

function ingredientUpdate(req, res) {
  try {
    const ingredientObject = {
      quantity: parseInt(req.body.oldQuantity) - parseInt(req.body.quantity)
    };

    Recipes.update({
      'addIngredients._id': req.body._id
    }, {
      $set: {
        'addIngredients.$.quantity': req.body.quantity
      }
    }).exec();

    Ingredients.update({
      _id: req.body._id
    }, {
      $inc: ingredientObject
    }).then((savedIngredient) => {
      savedIngredient = JSON.parse(JSON.stringify(savedIngredient));

      res.json(Response.success(savedIngredient));
    }).catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
    });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
  }
}


function ingredientListWithOutSome(req, res) {
  let ingredientObject = {},
    excludeIngredients = [];


  Recipes.findOne({
    _id: req.body.id
  }, {
    addIngredients: 1
  }).lean().then((recipe) => {
    excludeIngredients = _.map(recipe.addIngredients, 'ingredientId');

    return Ingredients.find({
      deleted: false,
      _id: {
        $nin: excludeIngredients
      },
      supplierId: req.user._id
    }).skip(Number(req.body.skip))
      .limit(Number(req.body.limit))
      .sort({
        createdAt: -1
      }).lean();
  }).then((ingredients) => {
    ingredients.forEach((ing) => {
      ing.selected = false;
    });

    ingredientObject = {
      ingredients
    };
    return Ingredients.count({
      supplierId: req.user._id,
      deleted: false,
      _id: {
        $nin: excludeIngredients
      }
    });
  }).then((countData) => {
    ingredientObject.count = countData;
    res.json(Response.success(ingredientObject));
  }).catch((e) => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
  });
}


function ingredientUpdateBulk(req, res) {
  try {
    let ingredients = req.body.ingredients,
      arrayToPush = [];

    ingredients.forEach((ing) => {
      arrayToPush.push({
        ingredientId: ing._id,
        quantity: ing.quantityAdd
      });
      Ingredients.update({
        _id: ing._id
      }, {
        $inc: {
          quantity: (parseInt(ing.quantityAdd) * -1)
        }
      }).exec();
    });

    Recipes.update({
      _id: req.body._id
    }, {
      $pushAll: {
        addIngredients: arrayToPush
      }
    }).then((savedIngredient) => {
      savedIngredient = JSON.parse(JSON.stringify(savedIngredient));

      res.json(Response.success(savedIngredient));
    }).catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
    });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
  }
}


function ingredientUpdateListing(req, res) {
  try {
    const ingredientObject = {
      quantity: req.body.quantity,
      threshold: req.body.threshold,
      unit: req.body.unit
    };

    Ingredients.update({
      _id: req.body._id
    }, {
      $set: ingredientObject
    }).then((savedIngredient) => {
      savedIngredient = JSON.parse(JSON.stringify(savedIngredient));

      res.json(Response.success(savedIngredient));
    }).catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
    });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
  }
}

function deleteIngredient(req, res) {
  const IngredientId = req.params.IngredientId;

  Ingredients.update({
    _id: IngredientId
  }, {
    $set: {
      deleted: true
    }
  }).exec().then(deletedInventory => res.json(Response.success(deletedInventory)))
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(e));
    });
}

/**
 * Helper Function
 * Products SKU function
 */
function productSKUload(supplierId, callback) {
  Product.distinct('sku', { supplier: supplierId }).then((products) => {
    callback(null, products);
  }).catch(e => callback(e, null));
}

/**
 * Helper Function
 * Get supplier using the user is.
 * @property {string} userId - The id of the supplier user.
 * @returns {Supplier}
 */
function getSupplierFromUser(userId, callback) {
  Supplier.findOne()
    .where('staff').in([userId])
    .exec((err, supplier) => callback(err, supplier._id));
}

/**
 * Load Suppliers SKU's
 */
function loadSKU(req, res) {
  async.waterfall([
    function passParameters(callback) {
      callback(null, req.user._id);
    },
    getSupplierFromUser,
    productSKUload
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


export default {
  list,
  add,
  remove,
  getSingle,
  ingredientAdd,
  ingredientRemove,
  ingredientList,
  ingredientUpdate,
  ingredientListWithOutSome,
  ingredientUpdateBulk,
  ingredientUpdateListing,
  deleteIngredient,
  loadSKU
};
