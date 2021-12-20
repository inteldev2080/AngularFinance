export default class FailedOrdersCtrl {
    constructor(OrderService, $translate, SupplierService) {
        this._OrderService = OrderService;
        this._$translate = $translate;
        this._SupplierService = SupplierService;
        this.ordersStatus = 'ReadyForDelivery';
        this.selected = {
            orders: []
        };
    }
    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.query = {
            skip: 0,
            limit: 15
        };
        this.query2 = {
            skip: 0,
            limit: 15
        };
        this.getFailedToDeliverOrders(this.query);
        this.getFailedOrders(this.query2);
        this.failedToDeliverOrdersCurrentPage = 1;
        this.failedOrdersCurrentPage = 1;
        this.getSupplierDrivers({ skip: 0, limit: 100 });
    }

    getFailedToDeliverOrders(query) {
        const _onSuccess = (res) => {
            if (res.data) {
                this.failedToDeliverorderList = res.data.data;
                this.failedToDeliverOrdersTotalPages = Math.ceil(
                    this.failedToDeliverorderList.count / query.limit
                );
            }
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.failedToDeliverOrdersHasError = true;
            } else if (err.code === 501) {
                this.failedToDeliverOrdersNoInternetConnection = true;
            }
        };
        const _onFinal = (err) => {
            this.failedToDeliverOrdersIsLoaded = true;
        };
        this._OrderService.getFailedToDeliverOrders(query)
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    setFailedToDeliverOrdersCurrentPage(pageNumber) {
        this.failedToDeliverOrdersCurrentPage = pageNumber;
        this.query.skip = (pageNumber - 1) * this.query.limit;
        this.getFailedToDeliverOrders(this.query);
    }

    getFailedOrders(query2) {
        const _onSuccess = (res) => {
            if (res.data) {
                this.failedOrderList = res.data.data;
                this.failedOrdersTotalPages = Math.ceil(
                    this.failedOrderList.count / query2.limit
                );
            }
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.failedOrderHasError = true;
            } else if (err.code === 501) {
                this.failedOrderNoInternetConnection = true;
            }
        };
        const _onFinal = (err) => {
            this.failedOrdersIsLoaded = true;
        };
        this._OrderService.getFailedOrders(query2)
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    setFailedOrdersCurrentPage(pageNumber) {
        this.failedOrdersCurrentPage = pageNumber;
        this.query.skip = (pageNumber - 1) * this.query.limit;
        this.getFailedOrders(this.query);
    }
    getSupplierDrivers(searchCriteria) {
        const _onSuccess = (res) => {
            if (res.data) {
                this.staff = res.data.data.staff;
                this.driver = this.staff[0]._id;
                $.Pages.init();
            }
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasErrorDriver = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = (err) => {
            this.driverListIsLoaded = true;
        };
        this._SupplierService.getSupplierDrivers(searchCriteria)
            .then(_onSuccess, _onError).finally(_onFinal);
    }
    outForDeliveryOrder() {
        this.chooseDriver = true;
        if (this.driver) {
            const _onSuccess = (res) => {
                this.orderCard = res.data.data;
                this.getFailedToDeliverOrders(this.query);
                this.getFailedOrders(this.query2);
                this.notify('supplier.order.view.actions.outOfDelivery', 'success', 1500);
                this.chooseDriver = false;
                this.getFailedToDeliverOrders(this.query);
            };
            const _onError = (err) => {
                this.hasError = true;
                if (err.data) {
                    this.errors = err.data.data;
                }
                this.notify('supplier.order.view.unexpectedError', 'danger', 5000);
            };
            const _onFinal = (err) => {
                $('#driverModal').modal('hide');
                this.chooseDriver = false;
            };

            this._OrderService.outForDeliveryAndPrint(this.selected.orders, this.driver)
                .then(_onSuccess, _onError).finally(_onFinal);
        }
    }
}
FailedOrdersCtrl.$inject = ['OrderService', '$translate', 'SupplierService'];
