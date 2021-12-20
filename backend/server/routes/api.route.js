import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import apiCtrl from '../controllers/api.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/suppliers')
   /** POST /api/suppliers - Create new supplier */
  .post(validate(paramValidation.APIcreateSupplier), apiCtrl.supplierCreate);

router.route('/customers')
   /** POST /api/suppliers - Create new supplier */
  .post(validate(paramValidation.APIcreateCustomer), apiCtrl.customerCreate);

router.route('/login')
  .post(validate(paramValidation.APIlogin), passport.authenticate('local', { session: false }), apiCtrl.login);

router.route('/forget')
  /** POST /api/forgetPassword/forget - Post email for forgetting password */
    .post(validate(paramValidation.APIforgetPassword), apiCtrl.forgetPass);
  
router.route('/reset')
  /** PUT /api/forgetPassword/reset - resets password */
    .put(validate(paramValidation.resetPassword), apiCtrl.resetPass);
  
router.route('/send')
  /** POST /api/forgetPassword/send */
    .post(validate(paramValidation.APIforgetPassword), apiCtrl.sendEmail);
/** Load supplier when API with supplierId route parameter is hit */
router.param('supplierId', apiCtrl.load);



export default router;
