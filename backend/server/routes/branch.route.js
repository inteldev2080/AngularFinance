import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import branchCtrl from '../controllers/branch.controller';
import auth from '../services/Permissions/index';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(passport.authenticate('jwt', {
    session: false
  }), branchCtrl.list)

  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'POST_/api/branches'), validate(paramValidation.createBranch), branchCtrl.create);

router.route('/:offset/:limit')
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'GET_/api/branches/:offset/:limit'), validate(paramValidation.listBranches), branchCtrl.listBranches);

router.route('/:customerId/:offset/:limit')
  .get(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.listCustomerBranches), branchCtrl.listCustomerBranches);

router.route('/:branchId')
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'PUT_/api/branches'), validate(paramValidation.updateBranch), branchCtrl.update)
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'GET_/api/branches'), validate(paramValidation.getBranch), branchCtrl.get)
  .delete(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'DELETE_/api/branches'), validate(paramValidation.getBranch), branchCtrl.remove);

router.param('branchId', branchCtrl.load);

export default router;
