export default class ReportRedirectCtrl {
    constructor($state, $rootScope) {
        this._$state = $state;
        this._$rootScope = $rootScope;
    }

    $onInit() {
        this.redirect();
        const supplier = { supplierId: this._$rootScope.supplier._id };
        this._$state.go('app.customer.reports.transactions', supplier);
    }

    redirect() {
        const supplier = { supplierId: this._$rootScope.supplier._id };

        this._$state.go('app.customer.reports.transactions', supplier);
    }

}
ReportRedirectCtrl.$inject = ['$state', '$rootScope'];

