import angular from 'angular';
import customerConfig from './customer.route';
import SuppliersCtrl from './suppliers/suppliers.controller';
import CustomerAccountProfileCtrl from './account/profile/customerAccountProfile.controller';
import CustomerOrderCtrl from './order/customerOrder.controller';
import CustomerRedirectCtrl from './customer.redirect.controller';
import CustomerProductCategoryCtrl from './product/customerProductCategory.controller';
import CustomerProductListCtrl from './product/customerProductList.controller';
import CustomerProductDetailCtrl from './product/customerProductDetail.controller';
import CustomerOrderListCtrl from './order/order-list/order-list.controller';
import CustomerAccountUserCtrl from './account/user/customerAccountUser.controller';
import CustomerAccountRolesCtrl from './account/role/customerAccountRoles.controller';
import CustomerReportsCtrl from './reports/reports.controller';
import ReportRedirectCtrl from './reports/index.controller';
import CustomerListBranchesCtrl from './account/branches/branches.controller';
// import CustomerOrderDetailCtrl from './order/order-detail/order-detail.controller';
import CartComponent from './cart/cart.component';
import CustomerCtrl from './customer.controller';
import CustomerOrderDetailCtrl from './order/order-detail/order.details.controller';


const customerModule = angular.module('app.customerModule', ['ui.router', 'ipCookie', 'ngResource', 'oc.lazyLoad']);
customerModule.config(customerConfig)
    .controller('CustomerCtrl', CustomerCtrl)
    .controller('SuppliersCtrl', SuppliersCtrl)
    .controller('CustomerAccountProfileCtrl', CustomerAccountProfileCtrl)
    .controller('CustomerOrderCtrl', CustomerOrderCtrl)
    .controller('CustomerRedirectCtrl', CustomerRedirectCtrl)
    .controller('CustomerProductCategoryCtrl', CustomerProductCategoryCtrl)
    .controller('CustomerProductListCtrl', CustomerProductListCtrl)
    .controller('CustomerProductDetailCtrl', CustomerProductDetailCtrl)
    .controller('CustomerOrderListCtrl', CustomerOrderListCtrl)
    .controller('CustomerOrderDetailCtrl', CustomerOrderDetailCtrl)
    .controller('CustomerAccountUerCtrl', CustomerAccountUserCtrl)
    .controller('CustomerAccountRolesCtrl', CustomerAccountRolesCtrl)
    .controller('CustomerReportsCtrl', CustomerReportsCtrl)
    .controller('ReportRedirectCtrl', ReportRedirectCtrl)
    .controller('CustomerListBranchesCtrl', CustomerListBranchesCtrl)

    // .controller('OrderDetailsCtrl', OrderDetailsCtrl)
    .component('cartComponent', CartComponent);

export default customerModule;
