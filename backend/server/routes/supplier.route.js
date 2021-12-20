import express from 'express';
import passport from 'passport';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import supplierCtrl from '../controllers/supplier.controller';
import auth from '../services/Permissions/index';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/suppliers - Get list of suppliers */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'GET_/api/suppliers'), validate(paramValidation.supplierList), supplierCtrl.list)

  /** POST /api/suppliers - Create new supplier */
  .post(validate(paramValidation.createSupplier), supplierCtrl.create);

router.route('/admin/:supplierId')
  /** PUT /api/suppliers/admin/:supplierId */
  .put(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.updateSupplierRelationValidation), supplierCtrl.updateRelation);

router.route('/drivers')
  /** GET /api/suppliers/drivers/ - Get the staff members of a suppliers*/
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'GET_/api/suppliers/drivers'), validate(paramValidation.supplierStaffList), supplierCtrl.getDrivers);

router.route('/staff')
  /** GET /api/suppliers/staff/ - Get the staff members of a suppliers*/
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'GET_/api/suppliers/staff'), validate(paramValidation.supplierStaffList), supplierCtrl.getStaff)

  /** POST /api/suppliers/staff/ - Create new supplier staff */
  .post(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'POST_/api/suppliers/staff'), validate(paramValidation.createSupplierStaff), supplierCtrl.addStaff);

router.route('/staff/:staffId')
  /** PUT /api/suppliers/staff/:staffId - Update supplier staff */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'PUT_/api/suppliers/staff'), validate(paramValidation.updateStaff), supplierCtrl.updateStaff)

  /** DELETE /api/suppliers/staff/:staffId - Remove staff from supplier */
  .delete(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'DELETE_/api/suppliers/staff'), validate(paramValidation.deleteSupplierStaff), supplierCtrl.removeStaff);

router.route('/profile')
  /** GET /api/suppliers/profile - get supplier's profile data */
  .get(passport.authenticate('jwt', {
    session: false
  }), supplierCtrl.profile);

router.route('/reports/orders')
  /** GET /api/suppliers/reports/orders - Get a report of supplier orders and revenue */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'GET_/api/suppliers/reports/orders'), validate(paramValidation.getReport), supplierCtrl.getReport);

router.route('/reports/invoices')
  /** GET /api/suppliers/reports/orders - Get a report of supplier orders and revenue */
  .get(passport.authenticate('jwt', {
    session: false
  // }), auth.can('Manage Suppliers', 'GET_/api/suppliers/reports/invoices'), validate(paramValidation.getInvoiceReport), supplierCtrl.getInvoices);
  }), validate(paramValidation.getInvoiceReport), supplierCtrl.getInvoices);

router.route('/reports/branches')
  /** GET /api/suppliers/reports/orders - Get a report of supplier orders and revenue */
  .get(passport.authenticate('jwt', {
    session: false
  // }), auth.can('Manage Suppliers', 'GET_/api/suppliers/reports/invoices'), validate(paramValidation.getInvoiceReport), supplierCtrl.getInvoices);
  }), validate(paramValidation.getBranches), supplierCtrl.getBranches);


router.route('/reports/invoice/:invoiceId')
  /** GET /api/suppliers/reports/orders - Get a report of supplier orders and revenue */
  .get(passport.authenticate('jwt', {
    session: false
  // }), auth.can('Manage Suppliers', 'GET_/api/suppliers/reports/selectInvoice'), validate(paramValidation.getReport), supplierCtrl.selectInvoice);
  }), supplierCtrl.getInvoiceHistory);


router.route('/reports/transactions')
  /** GET /api/suppliers/reports/transactions - Get a report of supplier orders and revenue */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'GET_/api/suppliers/reports/transactions'), validate(paramValidation.getTransactionReport), supplierCtrl.getTransactionsReport);

router.route('/supplier/:supplierId')
  /** PUT /api/suppliers/supplier/:supplierId - Update supplier name */
  .put(passport.authenticate('jwt', {
    session: false
  }), validate(paramValidation.updateName), supplierCtrl.updateName);

router.route('/block/:supplierId')
  /** PUT /api/suppliers/block/:supplierId - Block supplier */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'PUT_/api/suppliers/block'), supplierCtrl.block);

router.route('/unblock/:supplierId')
  /** PUT /api/suppliers/unblock/:supplierId - Unblock supplier */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'PUT_/api/suppliers/unblock'), supplierCtrl.unblock);

router.route('/approve/:supplierId')
  /** PUT /api/suppliers/approve/:supplierId - Update supplier status to Active */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'PUT_/api/suppliers/approve'), supplierCtrl.approve);

router.route('/billingHistory')
  /** GET /api/suppliers/billingHistory - Get current supplier's billing history */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'GET_/api/suppliers/billingHistory'), validate(paramValidation.getSupplierBillingHistory), supplierCtrl.getBillingHistory);

router.route('/billingHistory/:supplierId')
  /** GET /api/suppliers/billingHistory/:supplierId - Get supplier's billing history */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'GET_/api/suppliers/billingHistory'), validate(paramValidation.getListSupplier), supplierCtrl.getBillingHistory);

router.route('/:supplierId')
  /** GET /api/suppliers/:supplierId - Get supplier */
  .get(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'GET_/api/suppliers'), validate(paramValidation.getDeleteOrBlockSupplier), supplierCtrl.get)

  /** DELETE /api/suppliers/:supplierId - Delete supplier */
  .delete(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'DELETE_/api/suppliers'), validate(paramValidation.getDeleteOrBlockSupplier), supplierCtrl.remove)

  /** PUT /api/suppliers/:supplierId - Update supplier */
  .put(passport.authenticate('jwt', {
    session: false
  }), auth.can('Manage Suppliers', 'PUT_/api/suppliers'), validate(paramValidation.updateSupplier), supplierCtrl.update);


/** Load supplier when API with supplierId route parameter is hit */
router.param('supplierId', supplierCtrl.load);

export default router;
