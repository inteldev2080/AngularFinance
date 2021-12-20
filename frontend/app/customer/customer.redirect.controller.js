export default class CustomerRedirectCtrl {
    constructor($state, $rootScope) {
        this._$state = $state;
        this._$rootScope = $rootScope;
    }

    $onInit() {
        this.redirect();

        this._$rootScope.$on('$stateChangeSuccess',
            (event, toState, toParams, fromState, fromParams) => {
                // do something
                const supplier = { supplierId: this._$rootScope.supplier._id };
                if (toState.name === 'app.customer.product') {
                    this._$state.go('app.customer.product.list.category', supplier);
                } else if (toState.name === 'app.customer.payments') {
                    this._$state.go('app.customer.payments.list.suppliers', supplier);
                } else if (toState.name === 'app.customer.orders') {
                    this._$state.go('app.customer.orders.list.orders', supplier);
                }
            });
    }

    redirect() {
      /*  if (this._$rootScope.supplier.status === 'Blocked') {
            this._$state.go('app.customer.payments');
        }*/
        const supplier = { supplierId: this._$rootScope.supplier._id };
        if (this._$state.is('app.customer.product')) {
            this._$state.go('app.customer.product.list.category', supplier);
        } else if (this._$state.is('app.customer.payments')) {
            this._$state.go('app.customer.payments.list.suppliers', supplier);
        } else if (this._$state.is('app.customer.orders')) {
            this._$state.go('app.customer.orders.list.orders', supplier);
        }
    }

}
CustomerRedirectCtrl.$inject = ['$state', '$rootScope'];

