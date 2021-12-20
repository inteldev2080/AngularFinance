export default class DeliveryOrdersCtrl {
    constructor(OrderService, $translate, SupplierService) {
        this._OrderService = OrderService;
        this._$translate = $translate;
        this.ordersStatus = 'ReadyForDelivery';
        this.selected = {
            orders: []
        };
        this._SupplierService = SupplierService;
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
        this.getReadyForDeliveryOrders(this.query);
        this.getOutForDeliveryOrders(this.query2);
        this.readyForDeliveryOrdersCurrentPage = 1;
        this.outForDeliveryOrdersCurrentPage = 1;
        this.getSupplierDrivers({ skip: 0, limit: 100 });
    }

    getReadyForDeliveryOrders(query) {
        const _onSuccess = (res) => {
            if (res.data) {
                this.readyForDeliveryOrderList = res.data.data;
                this.readyForDeliveryOrdersTotalPages = Math.ceil(
                    this.readyForDeliveryOrderList.count / this.query.limit
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
            this.readyForDeliveryOrdersIsLoaded = true;
        };
        this._OrderService.getReadyForDeliveryOrders(query)
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    setReadyForDeliveryOrdersCurrentPage(pageNumber) {
        this.readyForDeliveryOrdersCurrentPage = pageNumber;
        this.query.skip = (pageNumber - 1) * this.query.limit;
        this.getReadyForDeliveryOrders(this.query);
    }

    getOutForDeliveryOrders(query2) {
        const _onSuccess = (res) => {
            if (res.data) {
                this.outForDeliveryOrderList = res.data.data;
                this.outForDeliveryOrdersTotalPages = Math.ceil(
                    this.outForDeliveryOrderList.count / query2.limit
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
            this.outForDeliveryOrdersIsLoaded = true;
        };
        this._OrderService.getOutForDeliveryOrders(query2)
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    setOutForDeliveryOrdersCurrentPage(pageNumber) {
        this.outForDeliveryOrdersCurrentPage = pageNumber;
        this.query2.skip = (pageNumber - 1) * this.query2.limit;
        this.getOutForDeliveryOrders(this.query2);
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
               // this.orderCard = res.data.data;
                this.notify('supplier.order.view.actions.outOfDelivery', 'success', 1500);
                this.chooseDriver = false;
                this.getReadyForDeliveryOrders(this.query);
                this.getOutForDeliveryOrders(this.query2);
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
    notify(message, type, timeout) {
        this._$translate(message).then((translation) => {
            $('body')
                .pgNotification({
                    style: 'bar',
                    message: translation,
                    position: 'top',
                    timeout,
                    type
                })
                .show();
        });
    }
}
DeliveryOrdersCtrl.$inject = ['OrderService', '$translate', 'SupplierService'];
