export default class ReviewedOrdersCtrl {
    constructor(OrderService, $translate) {
        this._OrderService = OrderService;
        this._$translate = $translate;
        this.ordersStatus = 'Delivered';
    }
    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.query = {
            skip: 0,
            limit: 10
        };
        this.getReviewedOrders(this.query);
        this.ordersCurrentPage = 1;
    }
    getReviewedOrders(query) {
        const _onSuccess = (res) => {
            if (res.data) {
                this.orderList = res.data.data;
                this.ordersTotalPages = Math.ceil(
                    this.orderList.count / this.query.limit
                );
            }
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = (err) => {
            this.ordersIsLoaded = true;
        };
        this._OrderService.getReviewedOrders(query).then(_onSuccess, _onError).finally(_onFinal);
    }
    setOrdersCurrentPage(pageNumber) {
        this.ordersCurrentPage = pageNumber;
        this.query.skip = (pageNumber - 1) * this.query.limit;
        this.getReviewedOrders(this.query);
    }
}
ReviewedOrdersCtrl.$inject = ['OrderService', '$translate'];
