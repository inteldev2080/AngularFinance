import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import categoryCtrl from '../controllers/category.controller';
import auth from '../services/Permissions/index';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/categories - Get list of categories */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Categories', 'GET_/api/categories'), categoryCtrl.list)

  /** POST /api/categories - Create new category */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Categories', 'POST_/api/categories'), validate(paramValidation.createCategory), categoryCtrl.create);

router.route('/otherProducts/:categoryId')
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'GET_/api/categories/otherProducts'), categoryCtrl.getOtherProducts);

router.route('/products/:categoryId')
/** GET /api/categories/products/:categoryId - get list of products for category */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Categories', 'GET_/api/categories/products/:categoryId'), validate(paramValidation.getCategoryProducts), categoryCtrl.getProducts);

router.route('/:categoryId')
/** GET /api/categories/:categoryId - Get category */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Categories', 'GET_/api/categories'), validate(paramValidation.getCategory), categoryCtrl.get)

  /** PUT /api/categories/:categoryId - Update category */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Categories', 'PUT_/api/categories'), validate(paramValidation.updateCategory), categoryCtrl.update)

  /** DELETE /api/categories/:categoryId - Delete category */
  .delete(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Categories', 'DELETE_/api/categories'), validate(paramValidation.deleteCategory), categoryCtrl.remove);

/** Load category when API with categoryId route parameter is hit */
router.param('categoryId', categoryCtrl.load);

export default router;
