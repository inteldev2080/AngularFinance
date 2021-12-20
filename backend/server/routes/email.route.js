import express from 'express';
// import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import emailCtrl from '../controllers/email.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(emailCtrl.list)
  .post(validate(paramValidation.createEmail), emailCtrl.create)
  .put(validate(paramValidation.updateEmail), emailCtrl.update);

router.route('/:emailId')
  .get(validate(paramValidation.getEmailById), emailCtrl.get);
router.route('/reset')
  .put(validate(paramValidation.resetEmail), emailCtrl.reset);

router.param('emailId', emailCtrl.load);

export default router;
