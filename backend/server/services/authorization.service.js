import async from 'async';
import httpStatus from 'http-status';
import Role from '../models/role.model';
import Permission from '../models/permission.model';
import Response from './response.service';

/**
 * Check if the user has access to the requested end point.
 */

function hasAccess(req, res, next) {
  const endPoint = `${req.method}_${req.originalUrl}`;
  async.waterfall([
    function passParameters(callback) {
      callback(null, req.user.role, endPoint);
    },
    getPermissions,
    endPointAccessAllowed
  ],
    (err, allowedToAccess) => {
      if (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(Response.failure(err));
      } else if (!allowedToAccess) {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
      }
      return next();
    });
}

/**
 * Get the permissions of the user.
 * @param {Permission []} roleId - The Id of the role of the user.
 */
function getPermissions(roleId, endpoint, callback) {
  Role.findById(roleId)
    .populate('permissions')
    .then((role) => {
      // debug(`permissions: ${role}`);
      callback(null, role.permissions, endpoint);
    })
    .catch(e => callback(e, null));
}

/**
 * Check that the end point is in one of the permissions above
 * @param {Permission []} permissions - The permissions of the user.
 * @param {String} endpoint - The end point the user is trying to access.
 */
function endPointAccessAllowed(permissions, accessedEndPoint, callback) {
  let canAccess = false;
  for (let permissionIndex = 0; permissionIndex < permissions.length; permissionIndex += 1) {
    const endPoints = permissions[permissionIndex].allowedEndPoints;
    for (let endPointIndex = 0; endPointIndex < endPoints.length; endPointIndex += 1) {
      const endPoint = endPoints[endPointIndex];
      if (accessedEndPoint.includes(endPoint) > -1) {
        canAccess = true;
        break;
      }
    }
  }
  callback(null, canAccess);
}

/**
 * Checks if the permissions and roles exist in the DB, and adds them if they don't.
 */
function checkPermissionsAndRoles() {
  Permission.count({})
    .then((permissionCount) => {
      if (permissionCount === 0) {
        addPermissionsAndDefaultRoles();
      }
    });
}

/**
 * Check if the permissions and default roles exist, and create them if they don't exist.
 */
function addPermissionsAndDefaultRoles() {
  // Admin permissions
  const adminUserEndPoints = new Permission({
    arabicName: 'ادارة الملف الشخصي',
    englishName: 'Manage Profile',
    key: 'manageProfile',
    type: 'Admin',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/admins', 'GET_/api/admins/profile', 'PUT_/api/admins', 'PUT_/api/auth/changePassword', 'PUT_/api/auth/changeLanguage']
  });
  adminUserEndPoints.save();

  const adminCategoryEndPoints = new Permission({
    arabicName: 'إدارة التصنيفات',
    englishName: 'Manage Category',
    key: 'manageCategories',
    type: 'Admin',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'POST_/api/categories', 'PUT_/api/categories', 'DELETE_/api/categories', 'GET_/api/categories']
  });
  adminCategoryEndPoints.save();

  const adminStaffEndPoints = new Permission({
    arabicName: 'إدارة الموظفين',
    englishName: 'Manage Staff',
    key: 'manageStaff',
    type: 'Admin',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'POST_/api/admins', 'PUT_/api/admins/:adminId', 'DELETE_/api/admins', 'GET_/api/admins',
      'PUT_/api/auth/changePassword', 'PUT_/api/auth/resetPassword',
      'POST_/api/roles', 'PUT_/api/roles', 'DELETE_/api/roles', 'GET_/api/roles', 'GET_/api/roles/permissions', 'GET_/api/admins/otherUsers',
      'PUT_/api/admins/otherUsers/:userId']
  });
  adminStaffEndPoints.save();

  const adminInventoryEndPoints = new Permission({
    arabicName: 'إدارة المخزون',
    englishName: 'Manage Inventory',
    key: 'manageInventory',
    type: 'Admin',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/inventory/recipes', 'POST_/api/inventory/recipes', 'DELETE_/api/inventory/recipes', 'GET_/api/inventory/:recipeId', 'GET_/api/inventory/ingredient/create', 'GET_/api/inventory/ingredient/update', 'DELETE_/api/inventory/ingredients/:Id', 'GET_/api/inventory/ingredient/list', 'GET_/api/inventory/ingredient/list', 'GET_/api/inventory/ingredient/update', 'GET_/api/inventory/ingredient/update', 'DELETE_/api/inventory/ingredients/:IngredientId']
  });
  adminInventoryEndPoints.save();

  const adminContentsEndPoints = new Permission({
    arabicName: 'إدارة المحتوى',
    englishName: 'Manage Contents',
    key: 'manageContents',
    type: 'Admin',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'POST_/api/contents', 'PUT_/api/contents', 'DELETE_/api/contents', 'GET_/api/contents']
  });
  adminContentsEndPoints.save();

  const adminSettingsEndPoints = new Permission({
    arabicName: 'إدارة الاعدادات',
    englishName: 'Manage Settings',
    key: 'manageSettings',
    type: 'Admin',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'POST_/api/email', 'PUT_/api/email', 'DELETE_/api/email', 'GET_/api/email',
      'POST_/api/systemVariables', 'PUT_/api/systemVariables', 'DELETE_/api/systemVariables',
      'GET_/api/systemVariables', 'POST_/api/systemUnits', 'PUT_/api/systemUnits', 'DELETE_/api/systemUnits',
      'POST_/api/contents', 'PUT_/api/contents', 'DELETE_/api/contents', 'GET_/api/contents', 'GET_/api/systemUnits']
  });
  adminSettingsEndPoints.save();

  const adminContactsEndPoints = new Permission({
    arabicName: 'إدارة الرسائل',
    englishName: 'Manage Messages',
    key: 'manageMessages',
    type: 'Admin',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'POST_/api/contacts', 'PUT_/api/contacts', 'DELETE_/api/contacts', 'GET_/api/contacts',
      'PUT_/api/contacts/reply']
  });
  adminContactsEndPoints.save();

  const adminSupplierEndPoints = new Permission({
    arabicName: 'إداراة المزودين',
    englishName: 'Manage Suppliers',
    key: 'manageSuppliers',
    type: 'Admin',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'POST_/api/suppliers', 'PUT_/api/suppliers', 'PUT_/api/suppliers/approve', 'PUT_/api/suppliers/block',
      'PUT_/api/suppliers/unblock', 'GET_/api/suppliers', 'GET_/api/suppliers/billingHistory', 'GET_/api/payments/count', 
      'GET_/api/transactions','GET_/api/suppliers/reports/invoices']

  });
  adminSupplierEndPoints.save();

  const adminTransactionEndPoints = new Permission({
    arabicName: 'إدارة المدفوعات',
    englishName: 'Manage Payments',
    key: 'managePayments',
    type: 'Admin',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'POST_/api/transactions/add', 'GET_/api/transactions', 'PUT_/api/transactions',
      'POST_/api/invoice', 'GET_/api/invoice', 'GET_/api/payments/count', 'POST_/api/transactions/declare',
      'GET_/api/suppliers/reports/transactions', 'GET_/api/payments', 'PUT_/api/payments/:paymentId/reject',
      'PUT_/api/payments/:paymentId/accept']
  });
  adminTransactionEndPoints.save();

  // const adminReportsEndPoints = new Permission({
  //   arabicName: 'إدارة التقارير',
  //   englishName: 'Manage Reports',
  //   key: 'manageReports',
  //   type: 'Admin',
  //   allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/admins/reports/orders', 'GET_/api/suppliers/reports/orders', 'GET_/api/orders',
  //     'GET_/api/orders/history', 'GET_/api/suppliers/reports/transactions', 'GET_/api/customers', 'GET_/api/suppliers']
  // });
  // adminReportsEndPoints.save();

  const adminOrdersReportsEndPoints = new Permission({
    arabicName: 'إدارة تقارير الطلبات',
    englishName: 'Manage Orders Reports',
    key: 'manageOrdersReports',
    type: 'Admin',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/admins/reports/orders', 'GET_/api/suppliers/reports/orders', 'GET_/api/orders',
      'GET_/api/orders/history', 'GET_/api/customers', 'GET_/api/suppliers','GET_/api/suppliers/reports/invoices']
  });
  adminOrdersReportsEndPoints.save();

  const adminTransactionsReportsEndPoints = new Permission({
    arabicName: 'إدارة تقارير المدفوعات',
    englishName: 'Manage Transactions Reports',
    key: 'manageTransactionsReports',
    type: 'Admin',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/suppliers/reports/transactions', 'GET_/api/customers', 'GET_/api/suppliers']
  });
  adminTransactionsReportsEndPoints.save();

  const adminDeleteEndPoints = new Permission({
    arabicName: 'امكانية حذف',
    englishName: 'Can Delete',
    key: 'canDelete',
    type: 'Admin',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'DELETE_/api/categories', 'DELETE_/api/suppliers', 'DELETE_/api/suppliers/staff',
      'DELETE_/api/admins', 'DELETE_/api/products', 'DELETE_/api/roles', 'DELETE_/api/systemVariables', 'DELETE_/api/systemUnits']
  });
  adminDeleteEndPoints.save();

  // Create system admin role.
  const systemAdmin = new Role({
    userType: 'Admin',
    englishName: 'Super Admin',
    arabicName: 'مدير المنصة',
    permissions: [
      adminUserEndPoints,
      adminCategoryEndPoints,
      adminInventoryEndPoints,
      adminStaffEndPoints,
      adminContentsEndPoints,
      adminSettingsEndPoints,
      adminContactsEndPoints,
      adminSupplierEndPoints,
      adminTransactionEndPoints,
      // adminReportsEndPoints,
      adminOrdersReportsEndPoints,
      adminTransactionsReportsEndPoints,
      adminDeleteEndPoints
    ],
    isLocked: true });
  systemAdmin.save();

  // Customer permissions
  const customerEndPoints = new Permission({
    type: 'Customer',
    key: 'manageCustomers',
    arabicName: 'إدارة جميع العملاء',
    englishName: 'Manage Customers',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/carts', 'POST_/api/carts', 'POST_/api/carts/checkout', 'PUT_/api/carts', 'DELETE_/api/carts',
      'GET_/api/categories', 'GET_/api/categories/products/:categoryId', 'GET_/api/customers/current', 'PUT_/api/customers',
      'PUT_/api/auth/changePassword', 'PUT_/api/auth/resetPassword', 'POST_/api/orders/review',
      'GET_/api/orders', 'PUT_/api/orders/cancel', 'GET_/api/products', 'GET_/api/recurringOrders',
      'PUT_/api/recurringOrders', 'GET_/api/suppliers', 'POST_/api/transactions/declare',
      'GET_/api/customers/:customerId', 'PUT_/api/carts/product', 'DELETE_/api/carts/product',
      'GET_/api/carts/supplier', 'GET_/api/products/supplier', 'GET_/api/customers/billingHistory', 'GET_/api/payments',
      'GET_/api/suppliers/billingHistory', 'GET_/api/transactions', 'GET_/api/carts/supplier', 'GET_/api/orders/log',
      'GET_/api/customers/specialPrices', 'PUT_/api/auth/changeLanguage', 'GET_/api/branches', 'POST_/api/branches', 'GET_/api/branches/:offset/:limit', 'PUT_/api/branches',
      'DELETE_/api/branches', 'GET_/api/categories/otherProducts', 'POST_/api/products/requestSpecialPrice', 'POST_/api/customers/staff', 'PUT_/api/customers/staff', 'GET_/api/customers/staff',
      'DELETE_/api/customers/staff', 'POST_/api/roles', 'PUT_/api/roles',
      'GET_/api/roles', 'GET_/api/roles/permissions', 'DELETE_/api/roles']

  });
  customerEndPoints.save();

  const customerOrdersEndPoints = new Permission({
    key: 'manageOrders',
    englishName: 'Manage Orders',
    arabicName: 'ادارة الطلبات',
    type: 'Customer',
    allowedEndPoints: ['GET_/api/customers/current', 'PUT_/api/auth/changeLanguage', 'GET_/api/auth/checkToken', 'GET_/api/suppliers', 'GET_/api/carts', 'POST_/api/carts', 'POST_/api/carts/checkout', 'PUT_/api/carts', 'DELETE_/api/carts',
      'GET_/api/categories', 'GET_/api/categories/products/:categoryId', 'POST_/api/orders/review',
      'GET_/api/orders', 'PUT_/api/orders/cancel', 'GET_/api/products', 'GET_/api/recurringOrders',
      'PUT_/api/recurringOrders', 'PUT_/api/carts/product', 'DELETE_/api/carts/product',
      'GET_/api/carts/supplier', 'GET_/api/products/supplier', 'POST_/api/products/requestSpecialPrice', 'GET_/api/categories/otherProducts']
  });
  customerOrdersEndPoints.save();

  const customerAccountEndPoints = new Permission({
    key: 'manageAccount',
    englishName: 'Manage Account',
    arabicName: 'ادارة الحسابات',
    type: 'Customer',
    allowedEndPoints: ['GET_/api/customers/current', 'PUT_/api/auth/changeLanguage', 'GET_/api/auth/checkToken', 'POST_/api/customers/staff', 'PUT_/api/customers/staff', 'GET_/api/customers/staff',
      'DELETE_/api/customers/staff', 'PUT_/api/auth/changePassword', 'PUT_/api/auth/resetPassword', 'GET_/api/suppliers', 'POST_/api/roles', 'PUT_/api/roles',
      'GET_/api/roles', 'GET_/api/roles/permissions', 'DELETE_/api/roles', 'GET_/api/branches', 'GET_/api/branches/:offset/:limit', 'POST_/api/branches', 'PUT_/api/branches',
      'DELETE_/api/branches']
  });
  customerAccountEndPoints.save();

  const customerPaymentEndPoints = new Permission({
    key: 'managePayments',
    englishName: 'Manage Payments',
    arabicName: 'ادارة المدفوعات',
    type: 'Customer',
    allowedEndPoints: ['PUT_/api/auth/changeLanguage', 'GET_/api/auth/checkToken', 'GET_/api/suppliers', 'GET_/api/customers/billingHistory', 'GET_/api/payments',
      'GET_/api/suppliers/billingHistory', 'GET_/api/transactions', 'GET_/api/orders/log', 'GET_/api/customers/specialPrices', 'POST_/api/transactions/declare']
  });
  customerPaymentEndPoints.save();

  // Customer Role
  const customer = new Role({
    userType: 'Customer',
    englishName: 'Customer Admin',
    arabicName: 'عميل',
    permissions: [
      customerEndPoints,
      customerOrdersEndPoints,
      customerAccountEndPoints,
      customerPaymentEndPoints
    ],
    isLocked: true });
  customer.save();


  // Supplier permissions
  const supplierCustomerEndPoints = new Permission({
    arabicName: 'إدارة العملاء',
    englishName: 'Manage Customers',
    key: 'manageCustomers',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'POST_/api/customers/invite', 'PUT_/api/customers/supplier/:customerId', 'PUT_/api/customers/block',
      'PUT_/api/customers/unblock', 'GET_/api/customers/specialPrices', 'POST_/api/customers/specialPrices', 'PUT_/api/customers/specialPrices', 'GET_/api/transactions',
      'DELETE_/api/customers/specialPrices', 'GET_/api/customers/:customerId', 'GET_/api/customers', 'POST_/api/customers/download/specialPrices', 'PUT_/api/customers/upload/specialPrices/:customerId']
  });
  supplierCustomerEndPoints.save();

  const supplierStaffEndPoints = new Permission({
    key: 'manageStaff',
    englishName: 'Manage Staff',
    arabicName: 'إدارة الموظفين',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'POST_/api/suppliers/staff', 'PUT_/api/suppliers/staff', 'GET_/api/suppliers/staff',
      'DELETE_/api/suppliers/staff', 'PUT_/api/auth/changePassword', 'PUT_/api/auth/resetPassword']
  });
  supplierStaffEndPoints.save();

  const supplierInventoryEndPoints = new Permission({
    arabicName: 'إدارة المخزون',
    englishName: 'Manage Inventory',
    key: 'manageInventory',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/inventory/recipes', 'POST_/api/inventory/recipes', 'DELETE_/api/inventory/recipes', 'GET_/api/inventory/:recipeId', 'GET_/api/inventory/ingredient/create', 'GET_/api/inventory/ingredient/update', 'DELETE_/api/inventory/ingredients/:Id', 'GET_/api/inventory/ingredient/list', 'GET_/api/inventory/ingredient/list', 'GET_/api/inventory/ingredient/update', 'GET_/api/inventory/ingredient/update', 'DELETE_/api/inventory/ingredients/:IngredientId']
  });
  supplierInventoryEndPoints.save();

  const supplierAccountEndPoints = new Permission({
    key: 'manageAccount',
    englishName: 'Manage Account',
    arabicName: 'ادارة الحساب',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'POST_/api/roles', 'PUT_/api/roles', 'GET_/api/roles', 'GET_/api/roles/permissions', 'DELETE_/api/roles', 'GET_/api/suppliers/drivers']
  });
  supplierAccountEndPoints.save();

  const supplierProductEndPoints = new Permission({
    key: 'manageProducts',
    englishName: 'Manage Categories and Products',
    arabicName: ' إدارة المنتجات والتصنيفات',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/categories', 'GET_/api/categories/products/:categoryId', 'GET_/api/products',
      'POST_/api/products', 'PUT_/api/products', 'DELETE_/api/products', 'GET_/api/systemUnits']
  });
  supplierProductEndPoints.save();

  const supplierUserEndPoints = new Permission({
    arabicName: 'ادارة الملف الشخصي',
    englishName: 'Manage Profile',
    key: 'manageProfile',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/suppliers', 'GET_/api/suppliers/profile', 'PUT_/api/suppliers', 'GET_/api/customers/billingHistory', 'GET_/api/suppliers/billingHistory', 'PUT_/api/auth/changeLanguage']
  });
  supplierUserEndPoints.save();

  // const supplierOrderEndPoints = new Permission({
  //   arabicName: 'ادارة الطلبات',
  //   englishName: 'Manage Orders',
  //   key: 'manageOrders',
  //   type: 'Supplier',
  //   allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/orders', 'GET_/api/order/overview', 'GET_/api/orders/count', 'GET_/api/orders/log',
  //     'GET_/api/orders/orderPurchase', 'GET_/api/orders/deliveryNote', 'PUT_/api/orders/accept', 'PUT_/api/orders/outForDelivery',
  //     'PUT_/api/orders/delivered', 'PUT_/api/orders/readyForDelivery', 'PUT_/api/orders/rejectProducts', 'PUT_/api/orders/reject',
  //     'PUT_/api/orders/fail', 'PUT_/api/orders/cancel', 'GET_/api/orders/reviews', 'GET_/api/suppliers/reports/orders']
  // });
  // supplierOrderEndPoints.save();

  const supplierOrderOverviewEndPoints = new Permission({
    arabicName: 'نظرة عامة للطلبات',
    englishName: 'Manage Order Overview',
    key: 'manageOrderOverview',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/orders', 'GET_/api/order/overview', 'GET_/api/orders/count']
  });
  supplierOrderOverviewEndPoints.save();

  const supplierNewOrdersEndPoints = new Permission({
    arabicName: 'الطلبات الجديدة',
    englishName: 'Manage New Orders',
    key: 'manageNewOrders',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/orders', 'GET_/api/orders/count', 'GET_/api/order/overview', 'GET_/api/orders/log', 'GET_/api/orders/orderPurchase', 'GET_/api/orders/deliveryNote']
  });
  supplierNewOrdersEndPoints.save();

  const supplierOrderPreparationEndPoints = new Permission({
    arabicName: 'الطلبات المجهزة',
    englishName: 'Manage Orders Preparation',
    key: 'manageOrderPreparation',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/orders', 'GET_/api/orders/log', 'GET_/api/order/overview', 'GET_/api/orders/count', 'PUT_/api/orders/accept']
  });
  supplierOrderPreparationEndPoints.save();

  const supplierDeliveryOrdersEndPoints = new Permission({
    arabicName: 'طلبات قيد التوصيل',
    englishName: 'Manage Order Delivery',
    key: 'manageOrderDelivery',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/orders', 'GET_/api/order/overview', 'GET_/api/orders/log', 'GET_/api/orders/count',
      'PUT_/api/orders/outForDelivery', 'PUT_/api/orders/delivered', 'PUT_/api/orders/readyForDelivery', 'PUT_/api/orders/fail', 'PUT_/api/orders/cancel']
  });
  supplierDeliveryOrdersEndPoints.save();

  const supplierFailedOrdersEndPoints = new Permission({
    arabicName: 'طلبات لم ينجح توصيلها',
    englishName: 'Manage Orders Failed',
    key: 'manageOrderFailed',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/orders', 'GET_/api/order/overview', 'GET_/api/orders/log', 'GET_/api/orders/count',
      'PUT_/api/orders/rejectProducts', 'PUT_/api/orders/reject', 'PUT_/api/orders/fail', 'PUT_/api/orders/cancel']
  });
  supplierFailedOrdersEndPoints.save();

  const supplierReviewOrdersEndPoints = new Permission({
    arabicName: 'مراجعة الطلبات',
    englishName: 'Manage Orders Reviews',
    key: 'manageOrderReviews',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/orders', 'GET_/api/orders/reviews', 'GET_/api/orders/log', 'GET_/api/orders/count']
  });
  supplierReviewOrdersEndPoints.save();

  // const supplierReportEndPoints = new Permission({
  //   arabicName: 'ادارة التقارير',
  //   englishName: 'Manage Reports',
  //   key: 'manageReports',
  //   type: 'Supplier',
  //   allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/orders', 'GET_/api/suppliers/reports/orders', 'GET_/api/suppliers/reports/transactions']
  // });
  // supplierReportEndPoints.save();

  const supplierOrdersReportEndPoints = new Permission({
    arabicName: 'ادارة تقارير الطلبات',
    englishName: 'Manage Orders Reports',
    key: 'manageOrdersReports',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/orders', 'GET_/api/suppliers/reports/orders','GET_/api/suppliers/reports/invoices']
  });
  supplierOrdersReportEndPoints.save();

  // const supplierInvoiceReportEndPoints = new Permission({
  //   arabicName: 'ادارة تقارير الطلبات',
  //   englishName: 'Manage Invoice Reports',
  //   key: 'manageOrdersReports',
  //   type: 'Supplier',
  //   allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/suppliers/reports/invoices']
  // });
  // supplierInvoiceReportEndPoints.save();

  const supplierTransactionsReportEndPoints = new Permission({
    arabicName: 'ادارة تقارير المدفوعات',
    englishName: 'Manage Transactions Reports',
    key: 'manageTransactionsReports',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/suppliers/reports/transactions']
  });
  supplierTransactionsReportEndPoints.save();

  const supplierPaymentsEndPoints = new Permission({
    arabicName: 'إدارة المدفوعات',
    englishName: 'Manage Payments',
    key: 'managePayments',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'POST_/api/invoice', 'GET_/api/invoice', 'GET_/api/payments/count', 'GET_/api/payments',
      'PUT_/api/payments/:paymentId/reject', 'PUT_/api/payments/:paymentId/accept', 'POST_/api/transactions/declare',
      'POST_/api/transactions/add', 'GET_/api/suppliers/reports/transactions', 'GET_/api/transactions']
  });
  supplierPaymentsEndPoints.save();

  const supplierDeleteEndPoints = new Permission({
    arabicName: 'امكانية حذف',
    englishName: 'Can Delete',
    key: 'canDelete',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'DELETE_/api/carts/:cartId', 'DELETE_/api/customers/specialPrices', 'DELETE_/api/products',
      'DELETE_/api/suppliers/staff', 'DELETE_/api/roles']
  });
  supplierDeleteEndPoints.save();

// Driver permissions
  const canDeliverEndPoints = new Permission({
    arabicName: 'إمكانية التوصيل',
    englishName: 'Can Deliver',
    key: 'canDeliver',
    type: 'Supplier',
    allowedEndPoints: ['GET_/api/auth/checkToken', 'GET_/api/orders', 'GET_/api/order/overview', 'GET_/api/orders/log', 'GET_/api/orders/count',
      'PUT_/api/orders/outForDelivery', 'PUT_/api/orders/delivered', 'PUT_/api/orders/readyForDelivery', 'PUT_/api/orders/fail', 'PUT_/api/orders/cancel', 'GET_/api/suppliers/drivers']
  });
  canDeliverEndPoints.save();

// Driver Roles
  const driver = new Role({
    userType: 'Supplier',
    englishName: 'SupplierDriver',
    arabicName: 'سائق مورد',
    permissions: [
      canDeliverEndPoints
    ],
    isLocked: true });
  driver.save();

  // Create supplier admin role
  const supplierAdmin = new Role({
    userType: 'Supplier',
    englishName: 'Supplier Admin',
    arabicName: 'إداري مزود',
    permissions: [
      supplierInventoryEndPoints,
      supplierCustomerEndPoints,
      supplierStaffEndPoints,
      supplierProductEndPoints,
      supplierUserEndPoints,
      supplierAccountEndPoints,
      // supplierOrderEndPoints,
      supplierOrderOverviewEndPoints,
      supplierNewOrdersEndPoints,
      supplierOrderPreparationEndPoints,
      supplierDeliveryOrdersEndPoints,
      supplierFailedOrdersEndPoints,
      supplierReviewOrdersEndPoints,
      // supplierReportEndPoints,
      supplierOrdersReportEndPoints,
      supplierTransactionsReportEndPoints,
      supplierPaymentsEndPoints,
      supplierDeleteEndPoints,
      canDeliverEndPoints
      // ,
      // supplierInvoiceReportEndPoints
    ],
    isLocked: true });
  supplierAdmin.save();
}


export default {
  hasAccess,
  checkPermissionsAndRoles
};
