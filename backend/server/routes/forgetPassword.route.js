import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import forgetCtrl from '../controllers/forgetPassword.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/forget')
/** POST /api/forgetPassword/forget - Post email for forgetting password */
  .post(validate(paramValidation.forgetPassword), forgetCtrl.forgetPass);

router.route('/reset')
/** PUT /api/forgetPassword/reset - resets password */
  .put(validate(paramValidation.resetPassword), forgetCtrl.resetPass);

router.route('/send')
/** POST /api/forgetPassword/send */
  .post(validate(paramValidation.forgetPassword), forgetCtrl.sendEmail);

export default router;
