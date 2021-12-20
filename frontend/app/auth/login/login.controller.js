export default class LoginCtrl {
    constructor(
        $state,
        UserService,
        $translatePartialLoader,
        $translate,
        $rootScope,
        $stateParams,
        PermPermissionStore,
        $window
    ) {
        this._translatePartialLoader = $translatePartialLoader;
        this._translate = $translate;
        this.$rootScope = $rootScope;
        this.$stateParams = $stateParams;
        this._UserService = UserService;
        this._$state = $state;
        this.title = $state.current.title;
        this.backgroundImageIndex = Math.floor((Math.random() * 10) + 1);
        this.formData = {};
        this.PermPermissionStore = PermPermissionStore;
        this.window = $window;
    }

    $onInit() {
        this.redirect();
        this.error = 'Invalid email or Password';
        this.isAuthorized = true;
        this.loading = false;
        this.rtl = false;
        this.$rootScope.enlargePanel = false;
        this._translatePartialLoader.addPart('auth');
        this._translate.refresh();
        if (this.window.localStorage.getItem('landingLang') !== null) {
            this._translate.use('ar');
            this.$rootScope.rtl = true;
        }
    }

    signIn() {
        this.isAuthorized = true;
        this.loading = true;
        this._UserService.login(this.formData).then(
            // callback for success
            (res) => {
                this.user = res.data;
                this.PermPermissionStore.definePermission('hasValidSession', () => this._UserService.checkSession());
                const permissions = this._UserService.getUserPermissions();

                this.PermPermissionStore.defineManyPermissions(permissions,
                    permissionName => permissions.includes(permissionName)
                );
                /*   if (this._translate.use() !== this.user.language) {
                       this.$rootScope.changeLang();
                   }*/
                this.$rootScope.userType = this.user.type;
                if (this.user.type === 'Admin') {
                    const adminPermissions = this.PermPermissionStore.getStore() || {};
                    if (adminPermissions.manageOrdersReports) {
                        this._$state.transitionTo('app.admin.report.orders', this.$stateParams, {
                            reload: true,
                            notify: true
                        });
                    } else if (adminPermissions.manageTransactionsReports) {
                        this._$state.transitionTo('app.admin.report.transactions', this.$stateParams, {
                            reload: true,
                            notify: true
                        });
                    } else {
                        this._$state.transitionTo('app.admin.profile', this.$stateParams, {
                            reload: true,
                            notify: true
                        });
                    }
                } else if (this.user.type === 'Supplier') {
                    const supplierPermission = this.PermPermissionStore.getStore() || {};

                    if (supplierPermission.manageOrderOverview) {
                        this._$state.transitionTo('app.supplier.order.list.overview', this.$stateParams, {
                            reload: true,
                            notify: true
                        });
                    } else if (supplierPermission.manageNewOrders) {
                        this._$state.transitionTo('app.supplier.order.list.new', this.$stateParams, {
                            reload: true,
                            notify: true
                        });
                    } else if (supplierPermission.manageOrderPreparation) {
                        this._$state.transitionTo('app.supplier.order.list.preparation', this.$stateParams, {
                            reload: true,
                            notify: true
                        });
                    } else if (supplierPermission.manageOrderDelivery) {
                        this._$state.transitionTo('app.supplier.order.list.delivery', this.$stateParams, {
                            reload: true,
                            notify: true
                        });
                    } else if (supplierPermission.manageOrderFailed) {
                        this._$state.transitionTo('app.supplier.order.list.failed', this.$stateParams, {
                            reload: true,
                            notify: true
                        });
                    } else if (supplierPermission.manageOrderReviews) {
                        this._$state.transitionTo('app.supplier.order.list.review', this.$stateParams, {
                            reload: true,
                            notify: true
                        });
                    } else {
                        this._$state.transitionTo('app.supplier.profile', this.$stateParams, {
                            reload: true,
                            notify: true
                        });
                    }
                    /*  this._$state.go('app.supplier.order', {}, { reload: true });*/
                } else if (this.user.type === 'Customer') {
                    const custPermissions = this.PermPermissionStore.getStore() || {};
                    /* this._$state.go('app.customer.product', { reload: true });*/
                    if (this.$rootScope.returnToState === '/category/:supplierId') {
                        this._$state.go('app.customer.product.list.category', {supplierId: this.$rootScope.returnToStateParams});
                    } else if (custPermissions.managePayments) {
                        this._$state.transitionTo('app.customer.payments', this.$stateParams, {
                            reload: true,
                            notify: true
                        });
                    } else if (custPermissions.manageOrders) {
                        this._$state.transitionTo('app.customer.orders.list.orders', this.$stateParams, {
                            reload: true,
                            notify: true
                        });
                    } else {
                        const custPermissions = this.PermPermissionStore.getStore() || {};
                        if (custPermissions.managePayments) {
                            this._$state.transitionTo('app.customer.payments', this.$stateParams, {
                                reload: true,
                                notify: true
                            });
                        } else if (custPermissions.manageOrders) {
                            this._$state.transitionTo('app.customer.orders.list.orders', this.$stateParams, {
                                reload: true,
                                notify: true
                            });
                        } else {
                            this._$state.transitionTo('app.customer.account.profile', this.$stateParams, {
                                reload: true,
                                notify: true
                            });
                        }             //     this._$state.transitionTo('app.customer.account.profile', this.$stateParams, {
                        //     reload: true,
                        //     notify: true
                        // });
                    }
                }
                this.window.localStorage.removeItem('landingLang');
            },
            (err) => {
                this.loading = false;
                this.isAuthorized = false;
            }
        );
    }

    redirect() {
        if (this._UserService.getCurrentUser()) {
            const user = this._UserService.getCurrentUser();
            if (user.type === 'Admin') {
                const adminPermissions = this.PermPermissionStore.getStore() || {};
                if (adminPermissions.manageOrdersReports) {
                    this._$state.transitionTo('app.admin.report.orders', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else if (adminPermissions.manageTransactionsReports) {
                    this._$state.transitionTo('app.admin.report.transactions', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else {
                    this._$state.transitionTo('app.admin.profile', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                }
            } else if (user.type === 'Supplier') {
                const supplierPermission = this.PermPermissionStore.getStore() || {};

                if (supplierPermission.manageOrderOverview) {
                    this._$state.transitionTo('app.supplier.order.list.overview', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else if (supplierPermission.manageNewOrders) {
                    this._$state.transitionTo('app.supplier.order.list.new', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else if (supplierPermission.manageOrderPreparation) {
                    this._$state.transitionTo('app.supplier.order.list.preparation', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else if (supplierPermission.manageOrderDelivery) {
                    this._$state.transitionTo('app.supplier.order.list.delivery', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else if (supplierPermission.manageOrderFailed) {
                    this._$state.transitionTo('app.supplier.order.list.failed', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else if (supplierPermission.manageOrderReviews) {
                    this._$state.transitionTo('app.supplier.order.list.review', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else {
                    this._$state.transitionTo('app.supplier.profile', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                }
            } else if (user.type === 'Customer') {
                this._$state.transitionTo('app.customer.account.profile', this.$stateParams, {
                    reload: true,
                    notify: true
                });
            }
        }
    }
}
LoginCtrl.$inject = ['$state', 'UserService', '$translatePartialLoader', '$translate', '$rootScope', '$stateParams', 'PermPermissionStore', '$window'];
