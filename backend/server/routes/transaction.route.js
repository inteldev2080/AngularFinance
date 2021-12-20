import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import transactionCtrl from '../controllers/transaction.controller';
import auth from '../services/Permissions/index';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/transactions - Get list of transactions. */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Transactions', 'GET_/api/transactions'), transactionCtrl.list);

router.route('/declare')
  /** POST /api/transactions/declare - Declare new transaction */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Transactions', 'POST_/api/transactions/declare'), validate(paramValidation.declarePayment), transactionCtrl.declarePayment);

router.route('/add')
  /** POST /api/transactions/add - Create new transaction */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Transactions', 'POST_/api/transactions/add'), validate(paramValidation.addPayment), transactionCtrl.addPayment);

router.route('/:transactionId')
  /** GET /api/transactions/:transactionId- Get transaction by Id */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Transactions', 'GET_/api/transactions'), validate(paramValidation.getTransaction), transactionCtrl.get);

/** Load transaction when API with transactionId route parameter is hit */
router.param('transactionId', transactionCtrl.load);

export default router;
