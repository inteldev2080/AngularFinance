import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import productCtrl from '../controllers/product.controller';
import auth from '../services/Permissions/index';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/products - Get list of products */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Products', 'GET_/api/products'), productCtrl.list)

  /** POST /api/products - Create new product */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Products', 'POST_/api/products'), validate(paramValidation.createProduct), productCtrl.create);

router.route('/supplier/:supplier')
/** GET /api/products - Get list of products for customer*/
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Products', 'GET_/api/products/supplier'), validate(paramValidation.getSupplierProducts), productCtrl.listForCustomer);

router.route('/:productId')
/** GET /api/products/:productId - Get product */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Products', 'GET_/api/products'), validate(paramValidation.getOrDeleteProduct), productCtrl.get)

  /** PUT /api/products/:productId - Update product */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Products', 'PUT_/api/products'), validate(paramValidation.updateProduct), productCtrl.update)

  /** DELETE /api/products/:productId - Delete product */
  .delete(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Products', 'DELETE_/api/products'), validate(paramValidation.getOrDeleteProduct), productCtrl.remove);

router.route('/requestSpecialPrice/:productId')
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'POST_/api/products/requestSpecialPrice'), validate(paramValidation.getOrDeleteProduct), productCtrl.requestSpecialPrice);

/** Load product when API with productId route parameter is hit */
router.param('productId', productCtrl.load);

export default router;
