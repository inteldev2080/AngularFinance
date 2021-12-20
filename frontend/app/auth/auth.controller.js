export default class AuthCtrl {
    constructor($state, $translatePartialLoader, $translate, $rootScope, UserService, PermPermissionStore) {
        this._translatePartialLoader = $translatePartialLoader;
        this._translate = $translate;
        this.$rootScope = $rootScope;
        this.title = $state.current.title;
        this.backgroundImageIndex = Math.floor((Math.random() * 10) + 1);
        this.formData = {};
        this._UserService = UserService;
        this._$state = $state;
        this.PermPermissionStore = PermPermissionStore;
    }
    $onInit() {
        this.redirect();
        this.isAuthorized = true;
        this.loading = false;
        this.rtl = false;
        this.$rootScope.enlargePanel = false;

        this._translatePartialLoader.addPart('auth');
    // this._translate.use('ar');
        this._translate.refresh();
    }


    reset() {
        this.formData = {};
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
                this._$state.transitionTo('app.customer.product', {}, {
                    reload: true,
                    notify: true
                });
            }
        }
    }
    changeLanguage() {
        if (this.$rootScope.currentLanguage === this.$rootScope.siteLanguage.english) {
            this.$rootScope.currentLanguage = this.$rootScope.siteLanguage.arabic;
        } else {
            this.$rootScope.currentLanguage = this.$rootScope.siteLanguage.english;
        }
        this._translate.use(this.$rootScope.currentLanguage.language);
        this.$rootScope.rtl = (this.$rootScope.currentLanguage.dir === 'rtl');
        this.$rootScope.$broadcast('languageChangedInApp');
    }
}
AuthCtrl.$inject = ['$state', '$translatePartialLoader', '$translate', '$rootScope', 'UserService', 'PermPermissionStore'];

