import angular from 'angular';
import supplierConfig from './supplier.route';
import SupplierCtrl from './supplier.controller';
import CategoryCtrl from './product/category.controller';
import OrdersCtrl from './order/orders.controller';
import OrdersOverviewCtrl from './order/orders.overview.controller';
import NewOrdersCtrl from './order/orders.new.controller';
import PreparationOrdersCtrl from './order/orders.preparation.controller';
import DeliveryOrdersCtrl from './order/orders.delivery.controller';
import FailedOrdersCtrl from './order/orders.failed.controller';
import ReviewedOrdersCtrl from './order/orders.reviewed.controller';
import OrderDetailsCtrl from './order/order.details.controller';
import SupplierReportOrdersCtrl from './reports/orders/supplierReportOrders.controller';
import SupplierReportOrderDetailsCtrl from './reports/orders/order-detail/supplierOrderReportDetails.controller';
import SupplierReportTransactionsCtrl from './reports/transactions/supplierReportTransaction.controller';
import SupplierReportInvoicesCtrl from './reports/invoices/supplierReportInvoice.controller';
import SupplierReportInvoiceDetailsCtrl from './reports/invoices/invoice-detail/supplierReportInvoiceDetails.controller';
import SupplierAccountProfileCtrl from './account/profile/supplierAccountProfile.controller';
import SupplierAccountPaymentsCtrl from './account/payments/supplierAccountPayments.controller';
import SupplierAccountRolesCtrl from './account/role/supplierAccountRoles.controller';
import SupplierAccountUerCtrl from './account/user/supplierAccountUser.controller';
import SupplierCustomerCtrl from './customer/supplierCustomer.controller';
import SupplierCustomerListCtrl from './customer/customers.list.controller';
import SupplierCustomerDetailCtrl from './customer/customer.details.controller';
import SupplierCustomerPaymentListCtrl from './customer/payment.list.controller';
import SupplierCustomerPaymentDetailCtrl from './customer/payment/payment-detail/payment-detail.controller';
import ProductListCtrl from './product/product.list.controller';
import NewProductCtrl from './product/new-product.controller';
import ViewProductCtrl from './product/view-product.controller';
import EditProductCtrl from './product/edit-product.controller';
import SupplierRecipesListCtrl from './inventories/recipes-items-list/recipesList.controller';
import SupplierIngredientsListCtrl from './inventories/ingredients-items-list/ingredientItemsList.contoller';
import SupplierSelectIngredientsListCtrl from './inventories/ingredients-items-list/selectIngredientList.controller';
import SupplierInventoriesCtrl from './inventories/adminInventories.controller';
import SupplierRecipesItemDetailCtrl from './inventories/recipes-items-detail/recipesItemsDetail.controller';
import ReceiptFormComponent from './inventories/receipt-form/receipt-form.component';
import ingredientFormComponent from './inventories/ingredient-form/ingredient-form.component';
import editIngredientFormComponent from './inventories/ingredient-form/edit-ingredient-form.component';
import editReceiptFormComponent from './inventories/receipt-form/edit-receipt-form.component';
import selectIngredientFormComponent from './inventories/ingredient-form/select-ingredient-form.component';
import supplierCustomerListBranchesCtrl from './customer/branches/branches.supplier.controller';
import addIngredientQuantityComponent from './inventories/ingredients-items-list/addIngredientQuantity.controller';
import editIngredientListingFormComponent from './inventories/ingredient-form/ingredient-lising-edit-form.component';
import supplierDetailedReportsCtrl from './reports/detailed/reports.controller';
import supplierSummaryReportsCtrl from './reports/summary/reports.controller';

const supplierModule = angular.module('app.supplierModule', []);

supplierModule.config(supplierConfig);

supplierModule.controller('SupplierCtrl', SupplierCtrl);
supplierModule.controller('CategoryCtrl', CategoryCtrl);
supplierModule.controller('ProductListCtrl', ProductListCtrl);
supplierModule.controller('OrdersCtrl', OrdersCtrl);
supplierModule.controller('OrdersOverviewCtrl', OrdersOverviewCtrl);
supplierModule.controller('NewOrdersCtrl', NewOrdersCtrl);
supplierModule.controller('PreparationOrdersCtrl', PreparationOrdersCtrl);
supplierModule.controller('DeliveryOrdersCtrl', DeliveryOrdersCtrl);
supplierModule.controller('FailedOrdersCtrl', FailedOrdersCtrl);
supplierModule.controller('ReviewedOrdersCtrl', ReviewedOrdersCtrl);
supplierModule.controller('OrderDetailsCtrl', OrderDetailsCtrl);
supplierModule.controller('SupplierReportOrdersCtrl', SupplierReportOrdersCtrl);
supplierModule.controller('SupplierReportOrderDetailsCtrl', SupplierReportOrderDetailsCtrl);
supplierModule.controller('SupplierReportTransactionCtrl', SupplierReportTransactionsCtrl);
supplierModule.controller('SupplierReportTransactionCtrl', SupplierReportTransactionsCtrl);
supplierModule.controller('SupplierAccountProfileCtrl', SupplierAccountProfileCtrl);
supplierModule.controller('SupplierAccountPaymentsCtrl', SupplierAccountPaymentsCtrl);
supplierModule.controller('SupplierAccountRolesCtrl', SupplierAccountRolesCtrl);
supplierModule.controller('SupplierAccountUerCtrl', SupplierAccountUerCtrl);
supplierModule.controller('SupplierCustomerCtrl', SupplierCustomerCtrl);
supplierModule.controller('SupplierCustomerPaymentListCtrl', SupplierCustomerPaymentListCtrl);
supplierModule.controller('SupplierCustomerPaymentDetailCtrl', SupplierCustomerPaymentDetailCtrl);
supplierModule.controller('SupplierCustomerListCtrl', SupplierCustomerListCtrl);
supplierModule.controller('SupplierCustomerDetailCtrl', SupplierCustomerDetailCtrl);
supplierModule.controller('NewProductCtrl', NewProductCtrl);
supplierModule.controller('ViewProductCtrl', ViewProductCtrl);
supplierModule.controller('EditProductCtrl', EditProductCtrl);

supplierModule.controller('SupplierRecipesListCtrl', SupplierRecipesListCtrl);
supplierModule.controller('SupplierIngredientsListCtrl', SupplierIngredientsListCtrl);
supplierModule.controller('SupplierSelectIngredientsListCtrl', SupplierSelectIngredientsListCtrl);
supplierModule.controller('SupplierInventoriesCtrl', SupplierInventoriesCtrl);
supplierModule.controller(
    'SupplierRecipesItemDetailCtrl',
    SupplierRecipesItemDetailCtrl
);
supplierModule.controller('SupplierCustomerListBranchesCtrl', supplierCustomerListBranchesCtrl);
supplierModule.controller('SupplierDetailedReportsCtrl', supplierDetailedReportsCtrl);
supplierModule.controller('SupplierSummaryReportsCtrl', supplierSummaryReportsCtrl);
supplierModule.controller('SupplierReportInvoicesCtrl', SupplierReportInvoicesCtrl);
supplierModule.controller('SupplierReportInvoiceDetailsCtrl', SupplierReportInvoiceDetailsCtrl);

supplierModule.component('supplierReceiptFormComponent', ReceiptFormComponent);
supplierModule.component('supplierIngredientFormComponent', ingredientFormComponent);
supplierModule.component('supplierEditIngredientFormComponent', editIngredientFormComponent);
supplierModule.component('supplierEditRecipeFormComponent', editReceiptFormComponent);
supplierModule.component('supplierSelectIngredientForm', selectIngredientFormComponent);
supplierModule.component('supplierAddIngredientQuantity', addIngredientQuantityComponent);
supplierModule.component('supplierEditIngredientListingForm', editIngredientListingFormComponent);


export default supplierModule;
