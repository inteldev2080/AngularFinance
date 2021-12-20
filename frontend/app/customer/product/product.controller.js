export default class CustomerProductCtrl {
    constructor($state, $rootScope) {
        this._$state = $state;
        this.$rootScope = $rootScope;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.redirect();
    }

    redirect() {
      /*  if (this.$rootScope.supplier) {
            if (this.$rootScope.supplier.status === 'Blocked') {
                this._$state.go('app.customer.payment');
            }
        } else*/
        if (this._$state.is('app.customer.product')) {
            this._$state.go('app.customer.product.list.category');
        }
    }

}
CustomerProductCtrl.$inject = ['$state', '$rootScope'];

