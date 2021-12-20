export default class OrdersOverviewCtrl {
    constructor(OrderService, $translate) {
        this._$translate = $translate;
        this._OrderService = OrderService;
    }
    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.getOrdersOverview();
    }

    getOrdersOverview() {
        const _onSuccess = (res) => {
            if (res.data) { this.productsList = res.data.data; }
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = (err) => {
            this.overviewIsLoaded = true;
        };
        this._OrderService.getOrdersOverview().then(_onSuccess, _onError).finally(_onFinal);
    }
}
OrdersOverviewCtrl.$inject = ['OrderService', '$translate'];
