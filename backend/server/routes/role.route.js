import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import roleCtrl from '../controllers/role.controller';
import auth from '../services/Permissions/index';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/roles - Get list of roles */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Roles', 'GET_/api/roles'), validate(paramValidation.roleList), roleCtrl.list)

  /** POST /api/roles - Create role */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Roles', 'POST_/api/roles'), validate(paramValidation.createRole), roleCtrl.create);

router.route('/permissions')
  /** GET /api/roles/permissions - Get list of permissions */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Roles', 'GET_/api/roles/permissions'), roleCtrl.getPermissions);

router.route('/:roleId')
  /** PUT /api/roles/:roleId - Update */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Roles', 'PUT_/api/roles'), validate(paramValidation.updateRole), roleCtrl.update)

  /** DELETE /api/roles/:roleId - Delete role */
  .delete(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Roles', 'DELETE_/api/roles'), validate(paramValidation.removeRole), roleCtrl.remove);

router.param('roleId', roleCtrl.load);

export default router;
