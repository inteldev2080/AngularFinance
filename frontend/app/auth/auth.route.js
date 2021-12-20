authConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

function authConfig($stateProvider, $urlRouterProvider) {
    // $urlRouterProvider.when('/auth/register/customer', '/auth/register/supplier');
    $urlRouterProvider.otherwise('/auth/register/supplier');
    // Define the routes
    $stateProvider
        .state('app.auth', {
            url: '/auth',
            templateUrl: 'app/auth/index.html',
            controller: 'AuthCtrl as $ctrl',
            abstract: true/* ,
          resolve: {
              auth: () => UserService.redirect()
          }*/
        })
        .state('app.auth.login', {
            url: '/login',
            templateUrl: 'app/auth/login/login.html',
            controller: 'LoginCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'auth.login.text.account_signin'
            }
        })
        .state('app.auth.register', {
            url: '/register',
            templateUrl: 'app/auth/register/register.html',
            abstract: true,
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'datepicker',
                        'daterangepicker',
                        'timepicker',
                        'inputMask',
                        'autonumeric',
                        'switchery',
                        'select'
                    ], {
                        insertBefore: '#lazyload_placeholder'
                    }).then(() => true// $ocLazyLoad.load('assets/js/controllers/forms_elements.js');
                    );
                }]
            }
        })
        .state('app.auth.register.customer', {
            url: '/customer',
            templateUrl: 'app/auth/register/customer/register_customer.html',
            controller: 'RegisterCustomerCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'auth.register.customer.create_account_title'
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'switchery',
                        'select',
                    ], {
                        insertBefore: '#lazyload_placeholder'
                    })
                        .then(() => true// $ocLazyLoad.load('assets/js/controllers/forms_elements.js');
                        );
                }]
            }
        })
        .state('app.auth.register.supplier', {
            url: '/supplier',
            templateUrl: 'app/auth/register/supplier/register_supplier.html',
            controller: 'RegisterSupplierCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'auth.register.supplier.text.create_account_title'
            }
        })
        .state('app.auth.forgotPassword', {
            url: '/forgotPassword',
            templateUrl: 'app/auth/forgotPassword/forgotPassword.html',
            controller: 'ForgotPasswordCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'auth.login.link.forget_password'
            }
        })
        .state('app.auth.resetPassword', {
            url: '/resetPassword/:code',
            templateUrl: 'app/auth/resetPassword/resetPassword.html',
            controller: 'ResetPasswordCtrl as $ctrl',
            ncyBreadcrumb: {
                label: 'auth.reset_password.button.reset_password'
            }
        })
        .state('app.auth.logout', {
            controller: ['JwtService', '$window', 'PermPermissionStore', '$state', (JwtService, $window, PermPermissionStore, $state) => {
                // window.location.reload(true);
                JwtService.destroy();
                $window.localStorage.clear();
                PermPermissionStore.clearStore();
                $state.go('app.auth.login', {}, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            }]
        });
}

export default authConfig;
