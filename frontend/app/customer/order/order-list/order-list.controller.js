export default class CustomerOrderListCtrl {
    constructor(SupplierService, OrderService, $stateParams, $rootScope, $state, $translate) {
        this._OrderService = OrderService;
        this._SupplierService = SupplierService;
        this._$stateParams = $stateParams;
        this._$rootScope = $rootScope;
        this._$state = $state;
        this.$translate = $translate;
    }
    $onInit() {
        this.orderHistoryQuery = {
            skip: 0,
            limit: 10,
            supplierId: '',
            orderId: ''
        };
        this.recurringOrderQuery = {
            skip: 0,
            limit: 10,
            supplierId: ''
        };
        this.supplierId = this._$stateParams.supplierId;
        if (!this.supplierId) {
            if (this._$rootScope.supplier) {
                const supplier = { supplierId: this._$rootScope.supplier._id };
                if (this._$state.is('app.customer.orders.list.orders')) {
                    this._$state.go('app.customer.orders.list.orders', supplier);
                }
            } else {

            }
        } else {
            this.orderHistoryQuery.supplierId = this.supplierId;
        }
        this.recurringOrdersCurrentPage = 1;
        this.ordersHistoryCurrentPage = 1;
        this.totalOrders = 0;
        this.ordersRevenue = 0;
        this.orderHistoryQuery.supplierId = this._$stateParams.supplierId;
        this.recurringOrderQuery.supplierId = this._$stateParams.supplierId;
        this.getOrdersHistory(this.orderHistoryQuery);
        this.getRecurringOrders(this.recurringOrderQuery);
    }
    getOrdersHistory(query) {
        this.noOrdersFound = false;
        const _onSuccess = (res) => {
            this.orders = res.data.data.orders;
            this.totalOrders = res.data.data.count;
            this.ordersRevenue = !res.data.data.ordersRevenue ? 0 : res.data.data.ordersRevenue;
            if (this.orders.length === 0) { this.noOrdersFound = true; }
            this.ordersHistoryTotalPages = Math.ceil(
                res.data.data.count / this.orderHistoryQuery.limit);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = (err) => {
            this.ordersHistoryIsLoaded = true;
        };
        this._OrderService.getOrdersHistory(query)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }
    getRecurringOrders(query) {
        this.noRecurringOrdersFound = false;
        const _onSuccess = (res) => {
            this.recurringOrders = res.data.data.recurringOrders;
            if (this.recurringOrders.length === 0) {
                this.noRecurringOrdersFound = true;
            }
            this.recurringOrdersTotalPages = Math.ceil(
                res.data.data.count / this.recurringOrderQuery.limit
            );
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = (err) => {
            this.recurOrdersAreLoaded = true;
        };
        this._OrderService.getRecurringOrders(query).then(_onSuccess, _onError).finally(_onFinal);
    }
    setPageOrdersHistory(pageNumber) {
        this.ordersHistoryCurrentPage = pageNumber;
        this.orderHistoryQuery.skip = (pageNumber - 1) * this.orderHistoryQuery.limit;
        this.getOrdersHistory(this.orderHistoryQuery);
    }
    setPageRecurringOrders(pageNumber) {
        this.recurringOrdersCurrentPage = pageNumber;
        this.recurringOrderQuery.skip = (pageNumber - 1) * this.recurringOrderQuery.limit;
        this.getRecurringOrders(this.recurringOrderQuery);
    }
    cancelRecurringOrder(id) {
        this._OrderService.cancelRecurringOrder(id).then(
        // on success
        (res) => {
            this.getRecurringOrders(this.recurringOrderQuery);
            this.notify('customer.order.message.cancelRecurringOrderSuccess', 'success', 500);
        },
        // on error
        (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }

            this.notify('customer.order.message.cancelRecurringOrderFailure', 'danger', 5000);
        }
    );
    }
    reOrder(id) {
        this._OrderService.reOrder(id).then(
            // on success
            (res) => {
                this.getOrdersHistory(this.orderHistoryQuery);
                this.notify('customer.order.message.reOrderSuccess', 'success', 500);
            },
            // on error
            (err) => {
                if (err.code === 500) {
                    this.hasError = true;
                } else if (err.code === 501) {
                    this.noInternetConnection = true;
                }
    
                this.notify('customer.order.message.reOrderFailure', 'danger', 5000);
            }
        );
    }
    confirmDelete() {
        $('#cancelRecurringModal').modal('hide');
        this.cancelRecurringOrder(this.orderToBeCancel);
    }
    confirmReOrder() {
        $('#reOrderModal').modal('hide');
        this.reOrder(this.orderToBeOrdered);
    }
    openConfirmMessage(e, id) {
        e.stopPropagation();
        this.orderToBeCancel = id;
        $('#cancelRecurringModal').modal('show');
    }
    openReOrderConfirmMessage(e, id) {
        e.stopPropagation();
        this.orderToBeOrdered = id;
        $('#reOrderModal').modal('show');
    }
    notify(message, type, timeout) {
        this.$translate(message).then((translation) => {
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
CustomerOrderListCtrl.$inject = ['SupplierService', 'OrderService', '$stateParams', '$rootScope', '$state', '$translate'];

