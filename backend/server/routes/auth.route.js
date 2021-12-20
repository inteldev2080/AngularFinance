import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import authCtrl from '../controllers/auth.controller';
import authorization from '../services/authorization.service';
import auth from '../services/Permissions/index';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), passport.authenticate('local', { session: false }), authCtrl.login);

router.route('/checkToken')
  /** GET /api/checkToken - Returns false if token expires. */
  .get(passport.authenticate('jwt', { session: false }), authCtrl.checkToken);

router.route('/changePassword')
/** PUT /api/auth/changePassword - Update current logged in user password */
  .put(passport.authenticate('jwt', { session: false }), authorization.hasAccess, validate(paramValidation.userChangePassword), authCtrl.changeCurrentUserPassword);


router.route('/resetPassword')
/** PUT /api/auth/resetPassword - Reset user's password */
  .put(passport.authenticate('jwt', { session: false }), authorization.hasAccess, validate(paramValidation.userResetPassword), authCtrl.resetUserPassword);

router.route('/changeLanguage')
/** PUT /api/auth/changeLanguage - Reset user's password */
  .put(passport.authenticate('jwt', { session: false }), authorization.hasAccess, authCtrl.changeLanguage);

router.route('/test')
  .post(authCtrl.testSMS);

export default router;
