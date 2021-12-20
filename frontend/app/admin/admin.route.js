import AuthorizationMethods from '../supplieson.helper';

adminConfig.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
];

export default function adminConfig(
    $stateProvider,
    $urlRouterProvider,
    $locationProvider
) {
    //= ====================Admin Module Route===========================================
    $stateProvider
        .state('app.admin', {
            url: '/admin',
            templateUrl: 'app/admin/admin.html',
            controller: 'AdminCtrl as $ctrl',
            abstract: true,
            ncyBreadcrumb: {
                skip: true, // Never display this state in breadcrumb.
            },
            data: {
                permissions: {
                    only: ['hasValidSession', 'admin'],
                    redirectTo: AuthorizationMethods.redirectToLogin(),
                },
            },
        })
        .state('app.admin.profile', {
            url: '/profile',
            templateUrl: 'app/admin/account/profile/profile.html',
            controller: 'AdminAccountProfileCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'admin.account.profile.breadcrumb.profile',
            },
        })
        .state('app.admin.account', {
            url: '/account',
            templateUrl: 'app/admin/account/account.html',
            ncyBreadcrumb: {
                label: 'admin.account.profile.breadcrumb.admin',
            },
            data: {
                permissions: {
                    only: ['manageStaff'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
        })
        .state('app.admin.account.role', {
            url: '/role',
            templateUrl: 'app/admin/account/role/roles.html',
            controller: 'AdminAccountRolesCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'admin.account.roles.title',
            },
        })
        .state('app.admin.account.user', {
            url: '/user',
            templateUrl: 'app/admin/account/user/users.html',
            controller: 'AdminAccountUserCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'admin.account.users.title',
            },
        })
        .state('app.admin.account.otherUsers', {
            url: '/others',
            templateUrl: 'app/admin/account/others/otherUsers.html',
            controller: 'AdminAccountOthersCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'admin.account.otherUsers.title',
            },
        })
        .state('app.admin.product', {
            url: '/product',
            templateUrl: 'app/admin/product/index.html',
            controller: 'AdminProductCategoryCtrl as $ctrl',
            data: {
                permissions: {
                    only: ['manageCategories'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
        })
        .state('app.admin.inventories', {
            url: '/inventories',
            templateUrl: 'app/admin/inventories/index.html',
            controller: 'AdminInventoriesCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'm.inventory',
            },
            data: {
                permissions: {
                    only: ['manageInventory'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
        })
        .state('app.admin.inventories.recipes', {
            url: '/recipes',
            templateUrl: 'app/admin/inventories/recipes-items-list/recipes.html',
            controller: 'AdminRecipesListCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'm.recipesItems',
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
        .state('app.admin.inventories.ingredients', {
            url: '/ingredients',
            templateUrl: 'app/admin/inventories/ingredients-items-list/ingredients.html',
            controller: 'AdminIngredientsListCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'm.ingredients',
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
        .state('app.admin.inventories.select', {
            url: '/select',
            templateUrl: 'app/admin/inventories/ingredients-items-list/selectIngredients.html',
            controller: 'AdminSelectIngredientsListCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'm.select_ingredients',
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
        .state('app.admin.product.category', {
            url: '/category',
            templateUrl: 'app/admin/product/category.html',
            ncyBreadcrumb: {
                label: 'admin.categories.title',
            },
        })
        .state('app.admin.supplier', {
            url: '/supplier',
            templateUrl: 'app/admin/supplier/index.html',
            controller: 'AdminSupplierCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'm.suppliers',
            },
            data: {
                permissions: {
                    only: ['manageSuppliers', 'managePayments', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
        })
        .state('app.admin.supplier.list', {
            url: '/list',
            templateUrl: 'app/admin/supplier/supplier-list/suppliers.html',
            controller: 'adminSupplierListCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'm.suppliersList',
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
            },
        })
        .state('app.admin.supplier.customer', {
            url: '/customer',
            templateUrl: 'app/admin/supplier/customer-list/customers.html',
            controller: 'adminCustomerListCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'm.customersList',
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
            },
        })
        .state('app.admin.supplier.detail', {
            url: '/detail/:supplierId',
            templateUrl: 'app/admin/supplier/supplier-detail/supplier.html',
            controller: 'adminSupplierDetailCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'admin.suppliers.breadcrumb.supplierDetails',
            },
        })
        .state('app.admin.supplier.customer-detail', {
            url: '/customer-detail/:customerId',
            templateUrl: 'app/admin/supplier/customer-detail/customer.html',
            controller: 'adminCustomerDetailCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'admin.customers.breadcrumb.customerDetails',
            },
        })
        .state('app.admin.supplier.payment', {
            url: '/payments',
            templateUrl: 'app/admin/supplier/payment/payment-list/payments.html',
            controller: 'AdminSupplierPaymentListCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'm.paymentsClaims',
            },
            data: {
                permissions: {
                    only: ['managePayments'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
        })
        .state('app.admin.supplier.payment.detail', {
            url: '/:id',
            templateUrl:
                'app/admin/supplier/payment/payment-detail/payment-detail.html',
            controller: 'AdminSupplierPaymentDetailCtrl as $ctrl',
        })
        .state('app.admin.report', {
            url: '/report',
            templateUrl: 'app/admin/reports/index.html',
            ncyBreadcrumb: {
                label: 'admin.reports.index.reports',
            },
            data: {
                permissions: {
                    only: ['manageTransactionsReports', 'manageOrdersReports'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
        })
        .state('app.admin.report.orders', {
            url: '/orders',
            templateUrl: 'app/admin/reports/orders/order.list.html',
            controller: 'AdminReportOrdersCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'admin.reports.orders.stats.ordersReport',
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
            },
            data: {
                permissions: {
                    only: ['manageOrdersReports'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
        })
        .state('app.admin.report.ordersDetails', {
            url: '/orders/:id',
            templateUrl: 'app/admin/reports/orders/details/order.details.html',
            controller: 'AdminReportOrderDetailsCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'admin.reports.orders.stats.orderDetails',
            },
            data: {
                permissions: {
                    only: ['manageOrdersReports'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
        })
        .state('app.admin.report.transactions', {
            url: '/transactions',
            templateUrl: 'app/admin/reports/transactions/transaction.list.html',
            controller: 'AdminReportTransactionsCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'admin.reports.transactions.stats.transactionReports',
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
            },
            data: {
                permissions: {
                    only: ['manageTransactionsReports'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
        })
        .state('app.admin.settings', {
            url: '/settings',
            templateUrl: 'app/admin/settings/index.html',
            ncyBreadcrumb: {
                label: 'm.settings',
            },
            data: {
                permissions: {
                    only: ['manageSettings'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
        })
        .state('app.admin.settings.units', {
            url: '/units',
            templateUrl: 'app/admin/settings/system.units.html',
            controller: 'SystemUnitsCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'admin.settings.units.systemUnits',
            },
        })
        .state('app.admin.settings.cities', {
            url: '/cities',
            templateUrl: 'app/admin/settings/system.cities.html',
            controller: 'SystemCityCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'admin.settings.cities.label',
            }
        })
        .state('app.admin.settings.templates', {
            url: '/templates',
            templateUrl: 'app/admin/settings/system.email.templates.html',
            controller: 'EmailTemplatesCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'admin.settings.templates.emailTemplates',
            },
            resolve: {
                deps: [
                    '$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(
                            [
                                'menuclipper',
                                'moment',
                                'switchery',
                                'select',
                                'wysihtml5',
                                'summernote',
                            ],
                            {
                                insertBefore: '#lazyload_placeholder',
                            }
                            )
                            .then(() => {
                                /* return $ocLazyLoad.load([
                                                'app/admin/messages/message.js'
                                            ])*/
                            });
                    },
                ],
            },
        })
        .state('app.admin.settings.config', {
            url: '/config',
            templateUrl: 'app/admin/settings/system.config.html',
            controller: 'SystemConfigCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'admin.settings.config.systemConfig',
            },
        })
        .state('app.admin.settings.cms', {
            url: '/cms',
            templateUrl: 'app/admin/settings/system.cms.html',
            controller: 'SystemCMSCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'admin.settings.cms.cms',
            },
            resolve: {
                deps: [
                    '$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(
                            [
                                'menuclipper',
                                'moment',
                                'switchery',
                                'select',
                                'wysihtml5',
                                'summernote',
                            ],
                            {
                                insertBefore: '#lazyload_placeholder',
                            }
                            )
                            .then(() => {
                                /* return $ocLazyLoad.load([
                                                'app/admin/messages/message.js'
                                            ])*/
                            });
                    },
                ],
            },
        })
        .state('app.admin.messages', {
            url: '/messages',
            templateUrl: 'app/admin/messages/inbox.html',
            controller: 'InboxCtrl as $ctrl',
            resolve: {
                deps: [
                    '$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(
                            [
                                'menuclipper',
                                'moment',
                                'switchery',
                                'select',
                                'wysihtml5',
                                'summernote',
                            ],
                            {
                                insertBefore: '#lazyload_placeholder',
                            }
                            )
                            .then(() => {
                                /* return $ocLazyLoad.load([
                                                'app/admin/messages/message.js'
                                            ])*/
                            });
                    },
                ],
            },
            data: {
                permissions: {
                    only: ['manageMessages'],
                    redirectTo: AuthorizationMethods.redirectTo404(),
                },
            },
            ncyBreadcrumb: {
                label: 'admin.messages.title',
            },
        })
        .state('app.admin.privacy', {
            url: '/privacy',
            templateUrl: 'app/admin/privacy.html',
        });
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/login');
}
