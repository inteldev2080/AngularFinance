import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import cartCtrl from '../controllers/cart.controller';
import auth from '../services/Permissions/index';


const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/carts - Get list of carts */
  .get(passport.authenticate('jwt', { session: false }), auth.can('Access Carts', 'GET_/api/carts'), cartCtrl.list)

  /** POST /api/carts - Add product to cart */
  .post(passport.authenticate('jwt', { session: false }), auth.can('Manage Carts', 'POST_/api/carts'), validate(paramValidation.addToCart), cartCtrl.addToCart);

router.route('/product/:product')
  /** PUT /api/carts/product/:product - Update product quantity in cart*/
  .put(passport.authenticate('jwt', { session: false }), auth.can('Manage Carts', 'PUT_/api/carts'), validate(paramValidation.updateCartProductQuantity), cartCtrl.updateProductQuantity)

  /** DELETE /api/carts/product/:product - Remove a product from cart*/
  .delete(passport.authenticate('jwt', { session: false }), auth.can('Manage Carts', 'DELETE_/api/carts/product'), validate(paramValidation.removeCartProduct), cartCtrl.removeProduct);

router.route('/checkout/:cartId')
  /** POST /api/carts/checkout/:cartId - Checkout cart */
  .post(passport.authenticate('jwt', { session: false }), auth.can('Manage Carts', 'POST_/api/carts/checkout'), validate(paramValidation.checkoutCart), cartCtrl.checkout);

router.route('/supplier/:supplierId')
/** GET /api/carts/supplier/:supplierId - Get cart by supplierId */
  .get(passport.authenticate('jwt', { session: false }), auth.can('Access Carts', 'GET_/api/carts/supplier'), validate(paramValidation.getBySupplierId), cartCtrl.get);

router.route('/:cartId')
  /** GET /api/carts/:cartId - Get cart by cartId*/
  .get(passport.authenticate('jwt', { session: false }), auth.can('Access Carts', 'GET_/api/carts'), validate(paramValidation.getByCartId), cartCtrl.get)

  /** DELETE /api/carts/:cartId - Reset cart */
  .delete(passport.authenticate('jwt', { session: false }), auth.can('Manage Carts', 'DELETE_/api/carts'), validate(paramValidation.resetCart), cartCtrl.remove);

router.param('cartId', cartCtrl.loadByCartId);

router.param('supplierId', cartCtrl.loadBySupplierId);

export default router;
