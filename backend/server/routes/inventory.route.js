import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import inventoryCtrl from '../controllers/inventory.controller';
import auth from '../services/Permissions/index';
import productCtrl from '../controllers/product.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/recipes/items')
  /** GET /api/inventory/recipes- Get list of recipes */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Inventory', 'GET_/api/inventory/recipes'), validate(paramValidation.recipesList), inventoryCtrl.list)
  /** POST /api/inventories/recipes/items - Create new Recipes Items */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Inventory', 'GET_/api/inventory/recipes'), validate(paramValidation.createInventoryRecipesItems), inventoryCtrl.add);

/** DELETE /api/recipes/items/:Id - Delete receipe/item */
router.route('/recipes/items/:Id')
  .delete(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.deleteRecipe), inventoryCtrl.remove);

router.route('/:recipeId')
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Inventory', 'GET_/api/inventory/:recipeId'), validate(paramValidation.getSingle), inventoryCtrl.getSingle);

router.route('/ingredient/create')
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Inventory', 'GET_/api/inventory/ingredient/create'), validate(paramValidation.createIngredientsItems), inventoryCtrl.ingredientAdd);

router.route('/ingredient/update')
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Inventory', 'GET_/api/inventory/ingredient/update'), validate(paramValidation.updateIngredientsItems), inventoryCtrl.ingredientUpdate);


router.route('/ingredient/:Id/:InventoryId')
  .delete(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Inventory', 'DELETE_/api/inventory/ingredients/:Id'), validate(paramValidation.deleteInventory), inventoryCtrl.ingredientRemove);

router.route('/ingredient/list')
  /** GET /api/inventory/recipes- Get list of recipes */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Inventory', 'GET_/api/inventory/ingredient/list'), validate(paramValidation.recipesList), inventoryCtrl.ingredientList);


router.route('/ingredient/list')
  /** GET /api/inventory/recipes- Get list of recipes */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Inventory', 'GET_/api/inventory/ingredient/list'), inventoryCtrl.ingredientListWithOutSome);


router.route('/ingredient/update')
  /** GET /api/inventory/recipes- Get list of recipes */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Inventory', 'GET_/api/inventory/ingredient/update'), validate(paramValidation.updateIngredientsInBulk), inventoryCtrl.ingredientUpdateBulk);


router.route('/ingredient/update/single')
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Inventory', 'GET_/api/inventory/ingredient/update'), validate(paramValidation.updateIngredientsListingItems), inventoryCtrl.ingredientUpdateListing);

router.route('/ingredient/:IngredientId')
  .delete(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Inventory', 'DELETE_/api/inventory/ingredients/:IngredientId'), validate(paramValidation.deleteIngredient), inventoryCtrl.deleteIngredient);

router.route('/products/loadSku')
  .get(passport.authenticate('jwt', {
    session: false
  }), inventoryCtrl.loadSKU);

export default router;
