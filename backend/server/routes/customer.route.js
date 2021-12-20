import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import customerCtrl from '../controllers/customer.controller';
import auth from '../services/Permissions/index';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/customers - Get list of customers */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'GET_/api/customers'), validate(paramValidation.customerList), customerCtrl.list)

  /** POST /api/customers - Create new user */
  .post(validate(paramValidation.createCustomer), customerCtrl.create)

  /** PUT /api/customers/:customerId - Update customer */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'PUT_/api/customers'), validate(paramValidation.updateCustomer), customerCtrl.update);

router.route('/invite')
  /** POST /api/customers/invite - Invite customer */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Customers', 'POST_/api/customers/invite'), validate(paramValidation.inviteCustomer), customerCtrl.invite);

router.route('/supplier/:customerId')
  /** PUT /api/customers/:customerId/supplier - Update supplier's relation to customer */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Customers', 'PUT_/api/customers/supplier/:customerId'), validate(paramValidation.updateSupplierRelation), customerCtrl.updateRelation);

router.route('/current')
  /** GET /api/customers/current- Get current customer */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'GET_/api/customers/current'), customerCtrl.getCurrent);

router.route('/billingHistory')
  /** GET /api/customers/billingHistory - Get current customer's billing history */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'GET_/api/customers/billingHistory'), validate(paramValidation.getList), customerCtrl.getBillingHistory);

router.route('/specialPrices/:customerId')
  /** GET /api/customers/specialPrices/:customerId - Get customers special prices */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'GET_/api/customers/specialPrices'), validate(paramValidation.specialPricesList), customerCtrl.getSpecialPrices);

router.route('/billingHistory/:customerId')
  /** GET /api/customers/billingHistory/:customerId - Get customer's billing history */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'GET_/api/customers/billingHistory'), validate(paramValidation.getList), customerCtrl.getBillingHistory);

router.route('/block/:customerId')
  /** PUT /api/customers/block/:customerId - block customer.*/
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Customers', 'PUT_/api/customers/block'), validate(paramValidation.getCustomer), customerCtrl.block);

router.route('/unblock/:customerId')
  /** PUT /api/customers/unblock/:customerId - unblock customer.*/
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Customers', 'PUT_/api/customers/unblock'), validate(paramValidation.getCustomer), customerCtrl.unblock);

router.route('/specialPrices')
  /** GET /api/customers/specialPrices/:customerId - get special prices of customer*/
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'GET_/api/customers/specialPrices'), validate(paramValidation.getProductPriceList), customerCtrl.getSpecialPrices)
  /** POST /api/customers/specialPrices - create special prices for customer */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Customers', 'POST_/api/customers/specialPrices'), validate(paramValidation.createProductPrice), customerCtrl.createSpecialPrices);

router.route('/specialPrices/:productId')
  /** PUT /api/customers/specialPrices/:productId */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Customers', 'PUT_/api/customers/specialPrices'), validate(paramValidation.updateProductPrice), customerCtrl.updateSpecialPrices)
  /** DELETE /api/customers/specialPrices/:productId */
  .delete(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Customers', 'DELETE_/api/customers/specialPrices'), validate(paramValidation.getOrDeleteProduct), customerCtrl.deleteSpecialPrices);

router.route('/download/specialPrices')
  /** POST /api/customers/download/specialPrices - Download special prices file */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Customers', 'POST_/api/customers/download/specialPrices'), customerCtrl.downloadProductPricing);

router.route('/upload/specialPrices/:customerId')
  /** PUT /api/customers/upload/specialPrices - Upload special prices file */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Customers', 'PUT_/api/customers/upload/specialPrices/:customerId'), validate(paramValidation.getCustomer), customerCtrl.uploadProductPricing);

router.route('/staff')
  /** GET /api/customers/staff/ - Get the staff members of a customers*/
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'GET_/api/customers/staff'), validate(paramValidation.supplierStaffList), customerCtrl.getStaff)

  /** POST /api/customers/staff/ - Create new customer staff */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'POST_/api/customers/staff'), validate(paramValidation.createSupplierStaff), customerCtrl.addStaff);

router.route('/staff/:staffId')
  /** PUT /api/customers/staff/:staffId - Update customer staff */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'PUT_/api/customers/staff'), validate(paramValidation.updateStaff), customerCtrl.updateStaff)
  /** DELETE /api/suppliers/staff/:staffId - Remove staff from supplier */
  .delete(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'DELETE_/api/customers/staff'), validate(paramValidation.deleteSupplierStaff), customerCtrl.removeStaff);

router.route('/:customerId')
  /** GET /api/customers/:customerId - Get user */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Access Customers', 'GET_/api/customers/:customerId'), validate(paramValidation.getCustomer), customerCtrl.get);

// fixing Customers
router.route('/fix/customer/staff')
  .get(customerCtrl.fixCustomerStaff);

router.route('/excel')
  .post(passport.authenticate('jwt', {
    session: false
  }),validate(paramValidation.inviteCustomerExcel), customerCtrl.inviteExcel);

router.route('/city/update/:customerId')
  /** PUT /customer/city/update- Update customer */
  .put(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.updateCustomerCity), customerCtrl.updateCustomerCity);

router.route('/address/update/:customerId')
  /** PUT /customer/address/update- Update customer */
  .put(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.updateCustomerAddress), customerCtrl.updateCustomerAddress);

/** Load user when API with customerId route parameter is hit */
router.param('customerId', customerCtrl.load);

/** Load product when API with productId route parameter is hit */
router.param('productId', customerCtrl.loadByProductId);

export default router;
