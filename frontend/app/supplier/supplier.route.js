import AuthorizationMethods from '../supplieson.helper';

supplierConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

export default function supplierConfig($stateProvider, $urlRouterProvider, $locationProvider) { // eslint-disable-line
    $stateProvider
        .state('app.supplier', {
            url: '/supplier',
            templateUrl: 'app/supplier/supplier.html',
            controller: 'SupplierCtrl as $ctrl',
            abstract: true,
            ncyBreadcrumb: {
                skip: true
            },
            data: {
                permissions: {
                    only: ['supplier'],
                    redirectTo: AuthorizationMethods.redirectToLogin()
                }
            },
            resolve: {
                deps: ['UserService', function (UserService) {
                    UserService.checkSessionOn();
                }]
            }
        })
        .state('app.supplier.profile', {
            url: '/profile',
            templateUrl: 'app/supplier/account/profile/profile.html',
            controller: 'SupplierAccountProfileCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.account.profile.breadcrumb.profile'
            }
        })
        // Order Mgt
        .state('app.supplier.order', {
            url: '/orders',
            template: '<ui-view/>',
            controller: 'OrdersCtrl as $ctrl'
        })
        .state('app.supplier.order.list', {
            templateUrl: 'app/supplier/order/orders.index.html',
            controller: 'OrdersCtrl as $ctrl',
            data: {
                permissions: {
                    only: ['manageOrderOverview', 'manageNewOrders', 'manageOrderPreparation', 'manageOrderDelivery', 'manageOrderFailed', 'manageOrderReviews'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.supplier.order.list.overview', {
            url: '/overview',
            templateUrl: 'app/supplier/order/orders.overview.html',
            controller: 'OrdersOverviewCtrl as $ctrl',
            data: {
                permissions: {
                    only: ['manageOrderOverview'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            },
            ncyBreadcrumb: {
                label: 'supplier.order.list.overview'
            }
        })
        .state('app.supplier.order.list.new', {
            url: '/new/:productId',
            templateUrl: 'app/supplier/order/orders.list.html',
            controller: 'NewOrdersCtrl as $ctrl',
            data: {
                permissions: {
                    only: ['manageNewOrders'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            },
            ncyBreadcrumb: {
                label: 'supplier.order.list.new'
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'switchery',
                        'select',
                        'moment',
                        'datepicker',
                        'daterangepicker'
                    ], {
                        insertBefore: '#lazyload_placeholder'
                    })
                        .then(() => true// $ocLazyLoad.load('assets/js/controllers/forms_elements.js');
                        );
                }]
            }
        })
        .state('app.supplier.order.list.preparation', {
            url: '/preparation',
            templateUrl: 'app/supplier/order/orders.list.html',
            controller: 'PreparationOrdersCtrl as $ctrl',
            data: {
                permissions: {
                    only: ['manageOrderPreparation'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            },
            ncyBreadcrumb: {
                label: 'supplier.order.list.preparation'
            }
        })
        .state('app.supplier.order.list.delivery', {
            url: '/delivery',
            templateUrl: 'app/supplier/order/orders.delivery.html',
            controller: 'DeliveryOrdersCtrl as $ctrl',
            data: {
                permissions: {
                    only: ['manageOrderDelivery'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            },
            ncyBreadcrumb: {
                label: 'supplier.order.list.delivery'
            }

        })
        .state('app.supplier.order.list.failed', {
            url: '/failed',
            templateUrl: 'app/supplier/order/orders.failed.html',
            controller: 'FailedOrdersCtrl as $ctrl',
            data: {
                permissions: {
                    only: ['manageOrderFailed'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            },
            ncyBreadcrumb: {
                label: 'supplier.order.list.failed'
            }
        })
        .state('app.supplier.order.list.review', {
            url: '/review',
            templateUrl: 'app/supplier/order/orders.list.html',
            controller: 'ReviewedOrdersCtrl as $ctrl',
            data: {
                permissions: {
                    only: ['manageOrderReviews'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            },
            ncyBreadcrumb: {
                label: 'supplier.order.list.review'
            }
        })
        .state('app.supplier.order.view', {
            url: '/view',
            templateUrl: 'app/supplier/order/order.index.html',
        })
        .state('app.supplier.order.view.details', {
            url: '/details/:orderId',
            templateUrl: 'app/supplier/order/order.details.html',
            controller: 'OrderDetailsCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.order.detail'
            }
        })
        .state('app.supplier.order.view.review_delivered', {
            url: '/review_delivered/:orderId',
            templateUrl: 'app/test.html',
            // controller: 'supplierOrderDeliveryCtrl'
        })
        .state('app.supplier.order.view.review_failed', {
            url: '/review_failed/:orderId',
            templateUrl: 'view/test.html',
        })
        .state('app.supplier.products', {
            url: '/products',
            templateUrl: 'app/supplier/product/index.html',
            controller: 'CategoryCtrl as $ctrl',
            data: {
                permissions: {
                    only: ['manageProducts'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.supplier.products.list', {
            url: '/categories/:categoryId',
            templateUrl: 'app/supplier/product/product.list.html',
            controller: 'ProductListCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.product.breadcrumb.productList'
            },
            data: {
                permissions: {
                    only: ['manageProducts'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.supplier.product', {
            url: '/product',
            template: '<ui-view/>',
            data: {
                permissions: {
                    only: ['manageProducts'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.supplier.product.add', {
            url: '/add',
            templateUrl: 'app/supplier/product/new-product.html',
            controller: 'NewProductCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.product.breadcrumb.addNewProduct'
            }
        })
        .state('app.supplier.product.edit', {
            url: '/edit/:productId',
            templateUrl: 'app/supplier/product/edit-product.html',
            controller: 'EditProductCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.product.breadcrumb.editProduct'
            }
        })
        .state('app.supplier.product.detail', {
            url: '/view/:productId',
            templateUrl: 'app/supplier/product/view-product.html',
            controller: 'ViewProductCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.product.breadcrumb.productDetail'
            },
            data: {
                permissions: {
                    only: ['manageProducts'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.supplier.report', {
            url: '/report',
            templateUrl: 'app/supplier/reports/index.html',
            data: {
                permissions: {
                    only: ['manageOrdersReports', 'manageTransactionsReports'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.supplier.report.orders', {
            url: '/orders',
            templateUrl: 'app/supplier/reports/orders/orders.html',
            controller: 'SupplierReportOrdersCtrl as $ctrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'switchery',
                        'select',
                        'moment',
                        'datepicker',
                        'daterangepicker'
                    ], {
                        insertBefore: '#lazyload_placeholder'
                    })
                        .then(() => true// $ocLazyLoad.load('assets/js/controllers/forms_elements.js');
                        );
                }]
            },
            data: {
                permissions: {
                    only: ['manageOrdersReports'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            },
            ncyBreadcrumb: {
                label: 'supplier.reports.breadcrumb.ordersReport'
            }
        })
        .state('app.supplier.report.ordersDetails', {
            url: '/orders/:id',
            templateUrl: 'app/supplier/reports/orders/order-detail/order-detail.html',
            controller: 'SupplierReportOrderDetailsCtrl as $ctrl',
            data: {
                permissions: {
                    only: ['manageTransactionsReports', 'manageOrdersReports'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            },
            ncyBreadcrumb: {
                label: 'supplier.reports.breadcrumb.ordersDetail'
            }
        })
        .state('app.supplier.report.transactions', {
            url: '/transactions',
            templateUrl: 'app/supplier/reports/transactions/transactions.html',
            controller: 'SupplierReportTransactionCtrl as $ctrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'switchery',
                        'select',
                        'moment',
                        'datepicker',
                        'daterangepicker'
                    ], {
                        insertBefore: '#lazyload_placeholder'
                    })
                        .then(() => true// $ocLazyLoad.load('assets/js/controllers/forms_elements.js');
                        );
                }]
            },
            data: {
                permissions: {
                    only: ['manageTransactionsReports'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            },
            ncyBreadcrumb: {
                label: 'supplier.reports.breadcrumb.transactionsReport'
            }
        })
        .state('app.supplier.report.invoices', {
            url: '/invoices',
            templateUrl: 'app/supplier/reports/invoices/invoices.html',
            controller: 'SupplierReportInvoicesCtrl as $ctrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'switchery',
                        'select',
                        'moment',
                        'datepicker',
                        'daterangepicker'
                    ], {
                        insertBefore: '#lazyload_placeholder'
                    })
                        .then(() => true// $ocLazyLoad.load('assets/js/controllers/forms_elements.js');
                        );
                }]
            },
            data: {
                permissions: {
                    only: ['manageTransactionsReports'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            },
            ncyBreadcrumb: {
                label: 'supplier.reports.breadcrumb.invoices'
            }
        })
        .state('app.supplier.report.invoiceDetails', {
            url: '/invoices/:id',
            templateUrl: 'app/supplier/reports/invoices/invoice-detail/invoice-detail.html',
            controller: 'SupplierReportInvoiceDetailsCtrl as $ctrl',
            data: {
                permissions: {
                    only: ['manageTransactionsReports'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            },
            ncyBreadcrumb: {
                label: 'supplier.reports.breadcrumb.invoiceDetail'
            }
        })
        .state('app.supplier.report.detailed', {
            url: '/detailed',
            templateUrl: 'app/supplier/reports/detailed/reports.html',
            controller: 'SupplierDetailedReportsCtrl as $ctrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'switchery',
                        'select',
                        'moment',
                        'datepicker',
                        'daterangepicker'
                    ], {
                        insertBefore: '#lazyload_placeholder'
                    }).then(() => true// $ocLazyLoad.load('assets/js/controllers/forms_elements.js');
                    );
                }],
                customersResolve: ['CustomerService', CustomerService => CustomerService.getCustomers({
                    skip: 0,
                    limit: 100,
                    customerName: '',
                    nameOnly: true
                })]
            },
            data: {
                permissions: {
                    only: ['manageTransactionsReports'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            },
            ncyBreadcrumb: {
                label: 'supplier.reports.breadcrumb.detailedReport'
            },

        })
        .state('app.supplier.report.summary', {
            url: '/summary',
            templateUrl: 'app/supplier/reports/summary/reports.html',
            controller: 'SupplierSummaryReportsCtrl as $ctrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'switchery',
                        'select',
                        'moment',
                        'datepicker',
                        'daterangepicker'
                    ], {
                        insertBefore: '#lazyload_placeholder'
                    }).then(() => true// $ocLazyLoad.load('assets/js/controllers/forms_elements.js');
                    );
                }],
                customersResolve: ['CustomerService', CustomerService => CustomerService.getCustomers({
                    skip: 0,
                    limit: 100,
                    customerName: '',
                    nameOnly: true
                })]
            },
            data: {
                permissions: {
                    only: ['manageTransactionsReports'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            },
            ncyBreadcrumb: {
                label: 'supplier.reports.breadcrumb.summaryReport'
            },

        })
        .state('app.supplier.customer', {
            url: '/customer',
            templateUrl: 'app/supplier/customer/index.html',
            ncyBreadcrumb: {
                label: 'supplier.menu.customers'
            },
            controller: 'SupplierCustomerCtrl as $ctrl',
            data: {
                permissions: {
                    only: ['manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.supplier.customer.list', {
            url: '/list',
            templateUrl: 'app/supplier/customer/customers.list.html',
            controller: 'SupplierCustomerListCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.menu.customersList'
            }
        })
        .state('app.supplier.customer.detail', {
            url: '/details/:customerId',
            templateUrl: 'app/supplier/customer/customer.details.html',
            controller: 'SupplierCustomerDetailCtrl as $ctrl',
            ncyBreadcrumb: {
                parent: 'app.supplier.customer.list',
                label: '{{$ctrl.customer.representativeName}}'
            },
            data: {
                permissions: {
                    only: ['manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectToLogin()
                }
            }
        })
        .state('app.supplier.customer.payments', {
            url: '/payments/list',
            templateUrl: 'app/supplier/customer/payment.list.html',
            controller: 'SupplierCustomerPaymentListCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.menu.paymentsClaims'
            },
            data: {
                permissions: {
                    only: ['managePayments'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.supplier.customer.payments-details', {
            url: '/payments-details/:paymentId',
            templateUrl: 'app/supplier/customer/payment/payment-detail/payment-detail.html',
            controller: 'SupplierCustomerPaymentDetailCtrl as $ctrl',
            params: {payment: null},
            data: {
                permissions: {
                    only: ['managePayments'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.supplier.account', {
            url: '/account',
            templateUrl: 'app/supplier/account/account.html',
            ncyBreadcrumb: {
                label: 'supplier.menu.account'
            },
            data: {
                permissions: {
                    only: ['managePayments', 'manageStaff'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.supplier.contact', {
            url: '/contact',
            templateUrl: 'app/supplier/account/contact.html',
            ncyBreadcrumb: {
                label: 'header.contactUS'
            }
        })
        .state('app.supplier.account.users', {
            url: '/users',
            templateUrl: 'app/supplier/account/user/users.html',
            controller: 'SupplierAccountUerCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.account.staff'
            }
        })
        .state('app.supplier.account.roles', {
            url: '/roles',
            templateUrl: 'app/supplier/account/role/roles.html',
            controller: 'SupplierAccountRolesCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.account.roles.title'
            }
        })
        .state('app.supplier.account.payments', {
            url: '/payments',
            templateUrl: 'app/supplier/account/payments/payments.html',
            controller: 'SupplierAccountPaymentsCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.account.billing'
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'switchery',
                        'select',
                        'moment',
                        'datepicker',
                        'daterangepicker'
                    ], {
                        insertBefore: '#lazyload_placeholder'
                    }).then(() => true);
                }]
            },
            data: {
                permissions: {
                    only: ['managePayments'],
                    redirectTo: {
                        manageStaff: AuthorizationMethods.redirectToStaff(),
                        default: AuthorizationMethods.redirectTo404()
                    }
                }
            }
        })
        .state('app.supplier.inventories', {
            url: '/inventories',
            templateUrl: 'app/supplier/inventories/index.html',
            controller: 'SupplierInventoriesCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.menu.Inventory',
            },
            data: {
                permissions: {
                    only: ['manageInventory'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
        })
        .state('app.supplier.inventories.recipes', {
            url: '/inventories/recipes',
            templateUrl: 'app/supplier/inventories/recipes-items-list/recipes.html',
            controller: 'SupplierRecipesListCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.menu.recipesItems',
            },
            data: {
                permissions: {
                    only: ['manageInventory'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
            resolve: {
                deps: [
                    '$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(
                                [
                                    'switchery',
                                    'select',
                                    'moment',
                                    'datepicker',
                                    'daterangepicker',
                                ],
                                {
                                    insertBefore: '#lazyload_placeholder',
                                }
                            )
                            .then(() => true);
                    },
                ],
            }
        })
        .state('app.supplier.inventories.ingredients', {
            url: '/inventories/ingredients',
            templateUrl: 'app/supplier/inventories/ingredients-items-list/ingredients.html',
            controller: 'SupplierIngredientsListCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.menu.ingredients',
            },
            data: {
                permissions: {
                    only: ['manageInventory'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
            resolve: {
                deps: [
                    '$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(
                                [
                                    'switchery',
                                    'select',
                                    'moment',
                                    'datepicker',
                                    'daterangepicker',
                                ],
                                {
                                    insertBefore: '#lazyload_placeholder',
                                }
                            )
                            .then(() => true);
                    },
                ],
            }
        })
        .state('app.supplier.inventories.select', {
            url: '/select',
            templateUrl: 'app/supplier/inventories/ingredients-items-list/selectIngredients.html',
            controller: 'SupplierSelectIngredientsListCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.menu.ingredients',
            },
            params: {
                obj: null
            },
            data: {
                permissions: {
                    only: ['manageInventory'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
            resolve: {
                deps: [
                    '$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(
                                [
                                    'switchery',
                                    'select',
                                    'moment',
                                    'datepicker',
                                    'daterangepicker',
                                ],
                                {
                                    insertBefore: '#lazyload_placeholder',
                                }
                            )
                            .then(() => true);
                    },
                ],
            }
        })
        .state('app.supplier.customer.branches', {
            url: '/branches/:customerId',
            templateUrl: 'app/supplier/customer/branches/branches.html',
            controller: 'SupplierCustomerListBranchesCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'supplier.customer.branch.label',
                skip: true // Never display this state in breadcrumb.
            },
            data: {
                permissions: {
                    only: ['manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        }).state('app.supplier.privacy', {
        url: '/privacy',
        templateUrl: 'app/supplier/privacy.html'
    });
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/login');
}
