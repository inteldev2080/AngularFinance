import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import orderCtrl from '../controllers/order.controller';
import authorization from '../services/authorization.service';
import auth from '../services/Permissions/index';
import supplierCtrl from '../controllers/supplier.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/orders - Get list of orders */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Orders', 'GET_/api/orders'), validate(paramValidation.ordersList), orderCtrl.list);

router.route('/reports')
  .get(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.getOrderReport), orderCtrl.getReport);

router.route('/overview')
  /** GET /api/order/overview - Get list of Products with number of orders and total weight.*/
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Orders', 'GET_/api/order/overview'), orderCtrl.getOverview);

router.route('/reviews')
  /** GET /api/orders/reviews - Gets the reviews of the supplier */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Orders', 'GET_/api/orders/reviews'), orderCtrl.getReviews);

router.route('/history')
  /** GET /api/orders/history - Gets the history of the supplier */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Orders', 'GET_/api/orders/history'), validate(paramValidation.getOrderHistory), orderCtrl.getHistory);

router.route('/count')
  /** GET /api/orders/count - Gets the count of orders status */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Orders', 'GET_/api/orders/count'), orderCtrl.getCounts);

router.route('/orderProduct/add/:orderId')
  /** POST /api/orderProduct/add/:orderId */
  .post(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.addProductToOrder), orderCtrl.addProductToOrder);

router.route('/orderProduct/update/:orderProductId')
  /** PUT /api/orderProduct/update/:orderProductId*/
  .put(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.updateProductOrder), orderCtrl.updateProductInOrder);

router.route('/orderProduct/delete/:orderProductId')
  /** Delete /api/orderProduct/delete/:orderProductId*/
  .delete(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.deleteProductOrder), orderCtrl.deleteProductFromOrder);

router.route('/log/:orderId')
  /** GET /api/orders/log/:orderId - Gets the log of orders. */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Orders', 'GET_/api/orders/log'), orderCtrl.getLog);

router.route('/rejectProducts/:orderId')
  /** PUT /api/orders/rejectProducts - reject certain products from order. */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Orders', 'PUT_/api/orders/rejectProducts'), validate(paramValidation.rejectProducts), orderCtrl.rejectProducts);

router.route('/accept/:orderId')
  /** PUT /api/orders/accept/:orderId - Accept order */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Orders', 'PUT_/api/orders/accept'), validate(paramValidation.acceptOrder), orderCtrl.accept);

router.route('/reject/:orderId')
  /** PUT /api/orders/reject/:orderId - Reject order */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Orders', 'PUT_/api/orders/reject'), validate(paramValidation.rejectOrder), orderCtrl.reject);

router.route('/fail/:orderId')
  /** PUT /api/orders/fail/:orderId - Fail order */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Orders', 'PUT_/api/orders/fail'), validate(paramValidation.rejectOrder), orderCtrl.fail);

router.route('/cancel/:orderId')
  /** PUT /api/orders/cancel/:orderId - Cancel order */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Orders', 'PUT_/api/orders/cancel'), validate(paramValidation.cancelOrReject), orderCtrl.cancel);

router.route('/prepare/:orderId')
  /** PUT /api/orders/prepare/:orderId - Cancel order */
  .put(passport.authenticate('jwt', {
    session: false
  }), authorization.hasAccess, validate(paramValidation.prepareOrder), orderCtrl.prepare);

router.route('/readyForDelivery/:orderId')
  /** PUT /api/orders/readyForDelivery/:orderId - Cancel order */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Orders', 'PUT_/api/orders/readyForDelivery'), validate(paramValidation.prepareOrder), orderCtrl.readyForDelivery);

router.route('/outForDelivery/:orderId')
  /** PUT /api/orders/outForDelivery/:orderId - Cancel order */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Orders', 'PUT_/api/orders/outForDelivery'), validate(paramValidation.orderOutForDelivery), orderCtrl.outForDelivery);

router.route('/delivered/:orderId')
  /** PUT /api/orders/delivered/:orderId - Cancel order */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Orders', 'PUT_/api/orders/delivered'), validate(paramValidation.delivered), orderCtrl.delivered);

router.route('/deliveryNote')
  .post(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.deliveryNote), orderCtrl.deliveryNote);

router.route('/orderPurchase/:orderId')
  .get(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.orderPurchase), orderCtrl.orderPurchase);

router.route('/review/:orderId')
  /** POST /api/orders/review/:orderId - Create order review */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Orders', 'POST_/api/orders/review'), validate(paramValidation.createReview), orderCtrl.review);

router.route('/:orderId')
  /** GET /api/orders/:orderId - Get order */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Orders', 'GET_/api/orders'), validate(paramValidation.getOrderOrUpdateOrderStatus), orderCtrl.get);

router.route('/:orderId/reOrder')
  /** POST /api/:orderId/reORder - re-order a specific order */
  .post(passport.authenticate('jwt', {
    session: false
  }), orderCtrl.reOrder);

/** Load order when API with orderId route parameter is hit */
router.param('orderId', orderCtrl.load);

/** Load orderProduct when API with orderProductId route parameter is hit */
router.param('orderProductId', orderCtrl.loadOrderProduct);


export default router;
