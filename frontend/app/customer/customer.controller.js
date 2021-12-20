import { Customer } from './customer.class';

export default class CustomerCtrl {
    constructor(
        SupplierService,
        CartService,
        JwtService,
        $translatePartialLoader,
        $translate,
        $rootScope,
        $state,
        $stateParams,
        $window,
        UserService,
        suppliersResolve,
        PermPermissionStore
    ) {
        this._translatePartialLoader = $translatePartialLoader;
        this._translate = $translate;
        this._$rootScope = $rootScope;
        this._$state = $state;
        this.$stateParams = $stateParams;
        this.suppliersResolve = suppliersResolve;
        this.customer = new Customer(SupplierService,
            $stateParams,
            CartService,
            $rootScope,
            $translate);
        this.PermPermissionStore = PermPermissionStore;
        this.JwtService = JwtService;
        this.selectedUser = {};
        this.selectedSupplierId = null;
        this.$window = $window;
        this.UserService = UserService;
    }
    $onInit() {
        this.supplierQuery = {
            skip: 0,
            limit: 10,
            status: ['Active', 'Blocked'],
            supplierName: ''
        };
        this.customer.suppliers = this.suppliersResolve.data.data.suppliers;
        // this._$rootScope.supplier = this.customer.suppliers[0].supplier;
        if (this.$stateParams.supplierId) {
            this._$rootScope.supplierId = this.$stateParams.supplierId;
        } else {
            this._$rootScope.supplierId = this.customer.suppliers[0].supplier._id;
           // this._$rootScope.supplier = this.customer.suppliers[0].supplier;
        }
        if (!this._$rootScope.supplier) {
            this._$rootScope.supplier = this.customer.suppliers[0].supplier;
            this._$rootScope.supplier.relationStatus = this.customer.suppliers[0].relationStatus;
        }
        this.user = this.JwtService.getCurrentUser();
        this.UserService.paintAvatar(`${this.user.firstName} ${this.user.lastName}`);
        this._translatePartialLoader.addPart('customer');
        this._$rootScope.setLang(this.user.language);
        this._translate.refresh();
        this.supplierId = this._$rootScope.supplierId;
        this.permissions = this.PermPermissionStore.getStore() || {};
        const ctrl = this;
        $('#cartModal').on('show.bs.modal', (e) => {
           // if (!data) return e.preventDefault() // stops modal from being shown
            ctrl.hideHorizontalMenu();
        });
    }

    logout() {
        this.UserService.logout();
    }

    selectSupplier(sup, relationStatus) {
        const supplier = { supplierId: sup._id };
        this._$rootScope.supplierId = sup._id;
        this._$rootScope.supplierName = sup.representativeName;
        this._$rootScope.supplier = sup;
        this._$rootScope.supplier.relationStatus = relationStatus;
        this.supplierId = sup._id;
        this.supplierName = sup.representativeName;
        if (sup.status === 'Blocked') {
            this._$state.go('app.customer.payments');
        } else if (this._$state.is('app.customer.product.list.category')) {
            this._$state.go('app.customer.product.list.category', supplier);
        } else if (this._$state.is('app.customer.orders.list.orders')) {
            this._$state.go('app.customer.orders.list.orders', supplier);
        } else if (this._$state.is('app.customer.payments.list.suppliers')) {
            this._$state.go('app.customer.payments.list.suppliers', supplier);
        }
    }

    navigate(state) {
        this.hideHorizontalMenu();
        this._$state.go(state);
    }

    showCart() {
      /*  $('#cartModal').show().on('shown', () => {
            // this.hideHorizontalMenu();
            $('#cartModal').modal('hide');
        });*/
        if (!$('#cartModal').hasClass('show')) {
            this.hideHorizontalMenu();
            $('#cartModal').modal('show');
        } /* else {
            $('body').removeClass('modal-open');
           // modal-open class is added on body so it has to be removed
            $('.modal-backdrop').remove();
            $('#cartModal').modal('hide');
        }*/
    }

    hideHorizontalMenu() {
        $('body').removeClass('horizontal-menu-open');
        $('.horizontal-menu-backdrop')
            .fadeOut('fast', function () {
                $(this).remove();
            });
        $('.menu-bar').removeClass('open');
    }
}
CustomerCtrl.$inject = ['SupplierService', 'CartService', 'JwtService',
    '$translatePartialLoader', '$translate', '$rootScope', '$state', '$stateParams', '$window', 'UserService', 'suppliersResolve','PermPermissionStore'];
