import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import adminCtrl from '../controllers/admin.controller';
import auth from '../services/Permissions/index';


const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/admins - Get list of admins */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Admins', 'GET_/api/admins'), validate(paramValidation.adminsList), adminCtrl.list)

  /** PUT /api/admins - Update logged in admin */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Admins', 'PUT_/api/admins'), validate(paramValidation.updateCurrentAdmin), adminCtrl.updateCurrentAdmin)

  /** POST /api/admins - Create new admin */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Admins', 'POST_/api/admins'), validate(paramValidation.createAdmin), adminCtrl.create);

router.route('/reports/orders')
  /** GET /api/admins/reports/orders - Get supplier's orders report */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Admins', 'GET_/api/admins/reports/orders'), validate(paramValidation.adminGetOrdersReport), adminCtrl.getOrdersReport);

router.route('/profile')
  /** GET /api/admins/profile - Get Current Admin Data. */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Admins', 'GET_/api/admins/profile'), adminCtrl.getCurrent);

router.route('/otherUsers')
  /** GET /api/admins/otherUsers - Get All Users Data*/
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Admins', 'GET_/api/admins/otherUsers'), validate(paramValidation.adminsList), adminCtrl.getAllUsers);

router.route('/otherUsers/:userId')
  /** PUT /api/admins/otherUsers/:userId - Update User */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Admins', 'PUT_/api/admins/otherUsers/:userId'), validate(paramValidation.updateUsers), adminCtrl.updateUsers);

router.route('/:adminId')
  /** PUT /api/admins/:adminId - Update admin */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Admins', 'PUT_/api/admins/:adminId'), validate(paramValidation.updateAdmin), adminCtrl.update)

  /** GET /api/admins/:adminId - Get admin */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Admins', 'GET_/api/admins'), validate(paramValidation.getAdmin), adminCtrl.get)

  /** DELETE /api/admins/:adminId - Delete admin */
  .delete(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Admins', 'DELETE_/api/admins'), validate(paramValidation.getAdmin), adminCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', adminCtrl.loadUser);
/** Load user when API with adminId route parameter is hit */
router.param('adminId', adminCtrl.load);

export default router;
