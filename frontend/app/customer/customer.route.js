import AuthorizationMethods from '../supplieson.helper';

customerConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
export default function customerConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    //= =================Customer Module Route==============
    $stateProvider
        .state('app.customer', {
            url: '/customer',
            templateUrl: 'app/customer/customer.html',
            controller: 'CustomerCtrl as $ctrl',
            abstract: true,
            ncyBreadcrumb: {
                skip: true // Never display this state in breadcrumb.
            },
            resolve: {
                deps: ['UserService', function (UserService) {
                    UserService.checkSessionOn();
                }],
                suppliersResolve: ['SupplierService', SupplierService => SupplierService.getSuppliers({
                    skip: 0,
                    limit: 10,
                    status: ['Active', 'Blocked'],
                    supplierName: ''
                })]
            },
            data: {
                permissions: {
                    only: ['customer'],
                    redirectTo: AuthorizationMethods.redirectToLogin
                }
            }
        })
        .state('app.customer.payments', {
            url: '/payments',
            template: '<ui-view/>',
            controller: 'CustomerRedirectCtrl',
            ncyBreadcrumb: {
                skip: true // Never display this state in breadcrumb.
            },
            data: {
                permissions: {
                    only: ['managePayments', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.orders', {
            url: '/order',
            template: '<ui-view/>',
            controller: 'CustomerRedirectCtrl',
            ncyBreadcrumb: {
                skip: true // Never display this state in breadcrumb.
            },
            data: {
                permissions: {
                    only: ['manageOrders', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.product', {
            url: '/product',
            template: '<ui-view/>',
            controller: 'CustomerRedirectCtrl',
            ncyBreadcrumb: {
                skip: true // Never display this state in breadcrumb.
            },
            data: {
                permissions: {
                    only: ['manageOrders', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.payments.list', {
            templateUrl: 'app/customer/customer.index.html',
            abstract: true,
            ncyBreadcrumb: {
                skip: true // Never display this state in breadcrumb.
            },
            data: {
                permissions: {
                    only: ['managePayments', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.orders.list', {
            templateUrl: 'app/customer/customer.index.html',
            abstract: true,
            ncyBreadcrumb: {
                skip: true // Never display this state in breadcrumb.
            },
            data: {
                permissions: {
                    only: ['manageOrders', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.product.list', {
            templateUrl: 'app/customer/customer.index.html',
            abstract: true,
            ncyBreadcrumb: {
                label: 'customer.menu.product'
            },
            data: {
                permissions: {
                    only: ['manageOrders', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.product.view', {
            templateUrl: 'app/customer/customer.details.html',
            abstract: true,
            ncyBreadcrumb: {
                label: 'customer.menu.product'
            },
            data: {
                permissions: {
                    only: ['manageOrders', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.account', {
            url: '/account',
            templateUrl: 'app/customer/account/account.html',
            ncyBreadcrumb: {
                label: 'customer.menu.account',
                skip: true // Never display this state in breadcrumb.
            }
        })
        .state('app.customer.account.users', {
            url: '/users',
            templateUrl: 'app/customer/account/user/users.html',
            controller: 'CustomerAccountUerCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'customer.account.staff',
                skip: true // Never display this state in breadcrumb.
            },
            data: {
                permissions: {
                    only: ['manageAccount', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.account.roles', {
            url: '/roles',
            templateUrl: 'app/customer/account/role/roles.html',
            controller: 'CustomerAccountRolesCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'customer.account.roles.title',
                skip: true // Never display this state in breadcrumb.
            },
            data: {
                permissions: {
                    only: ['manageAccount', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.contact', {
            url: '/contact',
            templateUrl: 'app/customer/account/contact.html',
            ncyBreadcrumb: {
                label: 'header.contactUS'
            }
        })
        .state('app.customer.account.profile', {
            url: '/profile',
            templateUrl: 'app/customer/account/profile/profile.html',
            controller: 'CustomerAccountProfileCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'customer.account.profile.breadcrumb.profile'
            }
        })
        .state('app.customer.payments.list.suppliers', {
            url: '/supplier/:supplierId',
            templateUrl: 'app/customer/suppliers/supplier.html',
            controller: 'SuppliersCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'customer.payments.breadcrumb.payments'
            },
            data: {
                permissions: {
                    only: ['managePayments', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.orders.list.orders', {
            url: '/history/:supplierId',
            templateUrl: 'app/customer/order/order-list/order-list.html',
            controller: 'CustomerOrderListCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'customer.order.breadcrumb.orders'
            },
            data: {
                permissions: {
                    only: ['manageOrders', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.orders.detail', {
            url: '/:type/:orderId',
            templateUrl: 'app/customer/order/order-detail/order.details.html',
            controller: 'CustomerOrderDetailCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'customer.order.breadcrumb.orderDetail'
            },
            data: {
                permissions: {
                    only: ['manageOrders', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.order.review', {
            url: '/:orderId/review',
            templateUrl: 'app/customer/order/order_detail_review.html',
            data: {
                permissions: {
                    only: ['manageOrders', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.product.list.category', {
            url: '/category/:supplierId',
            templateUrl: 'app/customer/product/category.list.html',
            controller: 'CustomerProductCategoryCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'customer.product.breadcrumb.categories'
            },
            data: {
                permissions: {
                    only: ['manageOrders', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.product.view.products', {
            url: '/list/:categoryId/:supplierId?:isAll',
            templateUrl: 'app/customer/product/product.list.html',
            controller: 'CustomerProductListCtrl as $ctrl',
            ncyBreadcrumb: {
                label: '{{categoryName}}',
                parent: 'app.customer.product.list.category'
            },
            data: {
                permissions: {
                    only: ['manageOrders', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.product.view.product', {
            url: '/view/:productId',
            templateUrl: 'app/customer/product/product.view.html',
            controller: 'CustomerProductDetailCtrl as $ctrl',
            ncyBreadcrumb: {
                parent: 'app.customer.product.view.products',
                label: '{{productName}}'
            },
            data: {
                permissions: {
                    only: ['manageOrders', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.reports', {
            url: '/reports',
            templateUrl: 'app/customer/reports/index.html',
            controller: 'ReportRedirectCtrl',
            ncyBreadcrumb: {
                skip: true // Never display this state in breadcrumb.
            },
            data: {
                permissions: {
                    only: ['managePayments', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.reports.transactions', {
            templateUrl: 'app/customer/reports/reports.html',
            controller: 'CustomerReportsCtrl as $ctrl',
            ncyBreadcrumb: {
                label: '{{categoryName}}',
                parent: 'app.customer.product.list.category'
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
                    }).then(() => true// $ocLazyLoad.load('assets/js/controllers/forms_elements.js');
                    );
                }],
                suppliersResolve: ['SupplierService', SupplierService => SupplierService.getSuppliers({
                    skip: 0,
                    limit: 50,
                    status: ['Active', 'Blocked'],
                    supplierName: ''
                })],
                branchesResolve: ['BranchService', BranchService => BranchService.getBranchesList({
                    skip: 0,
                    limit: 100,
                    staffQuery: '',
                    status: 'All'
                })]
            },
            data: {
                permissions: {
                    only: ['managePayments', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        })
        .state('app.customer.privacy', {
            url: '/privacy',
            templateUrl: 'app/customer/privacy.html'
        })
        .state('app.customer.account.branches', {
            url: '/branches',
            templateUrl: 'app/customer/account/branches/branches.html',
            controller: 'CustomerListBranchesCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'customer.account.branches.branch',
                skip: true // Never display this state in breadcrumb.
            },
            data: {
                permissions: {
                    only: ['manageAccount', 'manageCustomers'],
                    redirectTo: AuthorizationMethods.redirectTo404()
                }
            }
        });
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/login');
}
