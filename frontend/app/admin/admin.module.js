import angular from 'angular';
import adminConfig from './admin.route';
import AdminCtrl from './admin.controller';
import AdminProductCategoryCtrl from './product/adminProductCategory.controller';
import AdminInventoriesCtrl from './inventories/adminInventories.controller';
import AdminRecipesListCtrl from './inventories/recipes-items-list/recipesList.controller';
import ReceiptFormComponent from './inventories/receipt-form/receipt-form.component';
import adminRecipesItemDetailCtrl from './inventories/recipes-items-detail/recipesItemsDetail.controller';
import ingredientFormComponent from './inventories/ingredient-form/ingredient-form.component';
import editIngredientFormComponent from './inventories/ingredient-form/edit-ingredient-form.component';
import editReceiptFormComponent from './inventories/receipt-form/edit-receipt-form.component';
import AdminIngredientsListCtrl from './inventories/ingredients-items-list/ingredientItemsList.contoller';
import AdminSelectIngredientsListCtrl from './inventories/ingredients-items-list/selectIngredientList.controller';
import selectIngredientFormComponent from './inventories/ingredient-form/select-ingredient-form.component';
import addIngredientQuantityComponent from './inventories/ingredients-items-list/addIngredientQuantity.controller';
import editIngredientListingFormComponent from './inventories/ingredient-form/ingredient-lising-edit-form.component';

import AdminSupplierCtrl from './supplier/adminSupplier.controller';
import AdminReportOrdersCtrl from './reports/orders/adminReportOrders.controller';
import AdminReportTransactionsCtrl from './reports/transactions/adminReportTransaction.controller';
import AdminAccountProfileCtrl from './account/profile/adminAccountProfile.controller';
import AdminAccountRolesCtrl from './account/role/adminAccountRoles.controller';
import AdminAccountUserCtrl from './account/user/adminAccountUser.controller';
import AdminAccountOthersCtrl from './account/others/adminAccountOthers.controller';
import adminSupplierListCtrl from './supplier/supplier-list/adminSupplierList.controller';
import adminCustomerListCtrl from './supplier/customer-list/adminCustomerList.controller';
import adminSupplierDetailCtrl from './supplier/supplier-detail/adminSupplierDetail.controller';
import adminCustomerDetailCtrl from './supplier/customer-detail/adminCustomerDetail.controller';
import supplierFormComponent from './supplier/supplier-form/supplier-form.component';
import customerFormComponent from './supplier/customer-form/customer-form.component';
import AdminReportOrderDetailsCtrl from './reports/orders/details/AdminReportOrderDetails.controller';
import AdminSupplierPaymentDetailCtrl from './supplier/payment/payment-detail/adminSupplierPaymentDetail.controller';
import AdminSupplierPaymentListCtrl from './supplier/payment/payment-list/adminSupplierPaymentList.controller';
import InboxCtrl from './messages/inbox.controller';
import EmailTemplatesCtrl from './settings/system.email.templates.controller';
import SystemUnitsCtrl from './settings/system.units.controller';
import SystemCMSCtrl from './settings/system.cms.controller';
import SystemConfigCtrl from './settings/system.config.controller';
import SystemCityCtrl from './settings/system.cities.controller';
/* 'ui.router', 'ipCookie', 'ngResource', 'oc.lazyLoad', 'ui.select'*/

const adminModule = angular.module('app.adminModule', []);
adminModule.config(adminConfig);
adminModule.controller('AdminCtrl', AdminCtrl);
adminModule.controller('AdminProductCategoryCtrl', AdminProductCategoryCtrl);
adminModule.controller('AdminRecipesListCtrl', AdminRecipesListCtrl);
adminModule.controller('AdminIngredientsListCtrl', AdminIngredientsListCtrl);
adminModule.controller('AdminSelectIngredientsListCtrl', AdminSelectIngredientsListCtrl);
adminModule.controller('AdminInventoriesCtrl', AdminInventoriesCtrl);
adminModule.controller(
    'adminRecipesItemDetailCtrl',
    adminRecipesItemDetailCtrl
);

adminModule.controller('AdminSupplierCtrl', AdminSupplierCtrl);
adminModule.controller('adminSupplierListCtrl', adminSupplierListCtrl);
adminModule.controller('adminCustomerListCtrl', adminCustomerListCtrl);
adminModule.controller('adminSupplierDetailCtrl', adminSupplierDetailCtrl);
adminModule.controller('adminCustomerDetailCtrl', adminCustomerDetailCtrl);
adminModule.controller(
    'AdminSupplierPaymentListCtrl',
    AdminSupplierPaymentListCtrl
);
adminModule.controller('AdminReportOrdersCtrl', AdminReportOrdersCtrl);
adminModule.controller(
    'AdminReportTransactionsCtrl',
    AdminReportTransactionsCtrl
);
adminModule.controller('AdminAccountProfileCtrl', AdminAccountProfileCtrl);
adminModule.controller('AdminAccountRolesCtrl', AdminAccountRolesCtrl);
adminModule.controller('AdminAccountUserCtrl', AdminAccountUserCtrl);
adminModule.controller('AdminAccountOthersCtrl', AdminAccountOthersCtrl);
adminModule.controller(
    'AdminReportOrderDetailsCtrl',
    AdminReportOrderDetailsCtrl
);
adminModule.controller(
    'AdminSupplierPaymentDetailCtrl',
    AdminSupplierPaymentDetailCtrl
);
adminModule.component('supplierForm', supplierFormComponent);
adminModule.component('customerForm', customerFormComponent);
adminModule.component('receiptForm', ReceiptFormComponent);
adminModule.component('ingredientForm', ingredientFormComponent);
adminModule.component('editIngredientForm', editIngredientFormComponent);
adminModule.component('editRecipeForm', editReceiptFormComponent);
adminModule.component('selectIngredientForm', selectIngredientFormComponent);
adminModule.component('addIngredientQuantity', addIngredientQuantityComponent);
adminModule.component('editIngredientListingForm', editIngredientListingFormComponent);
adminModule.controller('InboxCtrl', InboxCtrl);

adminModule.controller('EmailTemplatesCtrl', EmailTemplatesCtrl);
adminModule.controller('SystemUnitsCtrl', SystemUnitsCtrl);
adminModule.controller('SystemCMSCtrl', SystemCMSCtrl);
adminModule.controller('SystemConfigCtrl', SystemConfigCtrl);
adminModule.controller('SystemCityCtrl', SystemCityCtrl);

export default adminModule;
