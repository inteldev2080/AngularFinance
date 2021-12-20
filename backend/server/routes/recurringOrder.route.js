import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import recurringOrderCtrl from '../controllers/recurringOrder.controller';
import auth from '../services/Permissions/index';
import orderCtrl from '../controllers/order.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/recurringOrders - Get list of recurringOrders */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access RecurringOrder', 'GET_/api/recurringOrders'), recurringOrderCtrl.list);

router.route('/history')
  /** GET /api/recurringOrders/history - Get history of recurringOrders */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access RecurringOrder', 'GET_/api/recurringOrders/history'), recurringOrderCtrl.getHistory);

router.route('/:recurringOrderId/cancel')
  /** PUT /api/recurringOrders/:recurringOrderId/cancel - Update recurringOrder */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access RecurringOrder', 'PUT_/api/recurringOrders'), validate(paramValidation.getOrCancelRecurringOrder), recurringOrderCtrl.cancel);

router.route('/:recurringOrderId')
  /** GET /api/recurringOrders/:recurringOrderId - Get recurringOrder */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access RecurringOrder', 'GET_/api/recurringOrders'), validate(paramValidation.getOrCancelRecurringOrder), recurringOrderCtrl.get)

  /** PUT /api/recurringOrders/:recurringOrderId - Update recurringOrder */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access RecurringOrder', 'PUT_/api/recurringOrders'), validate(paramValidation.updateRecurringOrder), recurringOrderCtrl.update);

router.route('/orderPurchase/:recurringOrderId')
  /** GET /api/orders/deliveryNote/:orderId - Cancel order */
  .get(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.getProductOrder), recurringOrderCtrl.orderPurchase);

router.route('/orderProduct/add/:recurringOrderId')
  /** POST /api/recurringOrders/orderProduct/add/:recurringOrderId */
  .post(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.addProductToRecurringOrder), recurringOrderCtrl.addProductToOrder);

router.route('/orderProduct/update/:recurringOrderId')
  /** PUT /api/recurringOrders/orderProduct/update/:recurringOrderId*/
  .put(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.addProductToRecurringOrder), recurringOrderCtrl.updateProductInOrder);

router.route('/orderProduct/delete/:recurringOrderId')
  /** Delete /api/recurringOrders/orderProduct/delete/:recurringOrderId*/
  .delete(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.removeProductFromRecurringOrder), recurringOrderCtrl.deleteProductFromOrder);

/** Load recurringOrder when API with recurringOrderId route parameter is hit */
router.param('recurringOrderId', recurringOrderCtrl.load);

export default router;
