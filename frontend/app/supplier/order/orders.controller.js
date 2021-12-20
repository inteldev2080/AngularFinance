export default class OrdersCtrl {
    constructor($state, OrderService, PermPermissionStore) {
        this._$state = $state;
        this._OrderService = OrderService;
        this.PermPermissionStore = PermPermissionStore;
    }
    $onInit() {
        this.permissions = this.PermPermissionStore.getStore() || {};
        this.getStatistics();
        this.redirect();
    }

    redirect() {
        if (this._$state.is('app.supplier.order')) {
            if (this.permissions.manageOrderOverview) {
                this._$state.go('app.supplier.order.list.overview');
            } else if (this.permissions.manageNewOrders) {
                this._$state.go('app.supplier.order.list.new');
            }
            else if (this.permissions.manageOrderPreparation) {
                this._$state.go('app.supplier.order.list.preparation');
            }
            else if (this.permissions.manageOrderDelivery) {
                this._$state.go('app.supplier.order.list.delivery');
            }
            else if (this.permissions.manageNewOrders) {
                this._$state.go('app.supplier.order.list.new');
            }
            else if (this.permissions.manageOrderFailed) {
                this._$state.go('app.supplier.order.list.failed');
            }
            else if (this.permissions.manageOrderReviews) {
                this._$state.go('app.supplier.order.list.review');
            }
        }
    }

    getStatistics() {
        const _onSuccess = (res) => {
            if (res.data) { this.ordersCount = res.data.data; }
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = (err) => {
            this.ordersCountIsLoaded = true;
        };
        this._OrderService.getStatistics().then(_onSuccess, _onError).finally(_onFinal);
    }

}
OrdersCtrl.$inject = ['$state', 'OrderService', 'PermPermissionStore'];
