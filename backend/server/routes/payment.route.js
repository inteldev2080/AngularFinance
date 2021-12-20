import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import paymentCtrl from '../controllers/payment.controller';
import auth from '../services/Permissions/index';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/payments - Get pending payments */
  .get(passport.authenticate('jwt', { session: false }), auth.can('Access Payments', 'GET_/api/payments'), validate(paramValidation.getPayments), paymentCtrl.list);

router.route('/count')
/** GET /api/payments/count - Get pending payments count */
  .get(passport.authenticate('jwt', { session: false }), auth.can('Access Payments', 'GET_/api/payments/count'), paymentCtrl.getPaymentsCount);

router.route('/:paymentId')
/** GET /api/payments - Get pending payments */
  .get(passport.authenticate('jwt', { session: false }), auth.can('Access Payments', 'GET_/api/payments'), validate(paramValidation.acceptOrRejectPayment), paymentCtrl.get);

router.route('/:paymentId/reject')
/** PUT /api/payments/:paymentId/reject - Reject payments */
  .put(passport.authenticate('jwt', { session: false }), auth.can('Access Payments', 'PUT_/api/payments/:paymentId/reject'), validate(paramValidation.acceptOrRejectPayment), paymentCtrl.rejectPayment);

router.route('/:paymentId/accept')
/** PUT /api/payments/:paymentId/accept - Accept payments */
  .put(passport.authenticate('jwt', { session: false }), auth.can('Access Payments', 'PUT_/api/payments/:paymentId/accept'), validate(paramValidation.acceptOrRejectPayment), paymentCtrl.acceptPayment);

/** Load transaction when API with transactionId route parameter is hit */
router.param('paymentId', paymentCtrl.load);

export default router;
