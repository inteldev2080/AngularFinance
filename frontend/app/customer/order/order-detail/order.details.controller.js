export default class CustomerOrderDetailCtrl {
    constructor(OrderService, SupplierService, $translate, $stateParams, $rootScope, ProductService, $window) {
        this._OrderService = OrderService;
        this._SupplierService = SupplierService;
        this._$translate = $translate;
        this._$stateParams = $stateParams;
        this.order = null;
        this.orderId = null;
        this.cancelOrderMessage = null;
        this.selected = {
            products: []
        };
        this.isAllChecked = false;
        this.hasError = false;
        this.$window = $window;
        this.$rootScope = $rootScope;
        this._ProductService = ProductService;
        this.progressMarkerStatus = null;
    }

    $onInit() {
        $.Pages.init();
        this.currentPage = 1;
        this.progressMarkerStatus = {
            Accepted: {
                style: 'progress-step',
                createdAt: '',
            },
            Pending: {
                style: 'progress-step',
                createdAt: '',
            },
            Rejected: {
                style: 'progress-step',
                createdAt: '',
            },
            Canceled: {
                style: 'progress-step',
                createdAt: '',
            },
            FailedToDeliver: {
                style: 'progress-step',
                createdAt: '',
            },
            ReadyForDelivery: {
                style: 'progress-step',
                createdAt: '',
            },
            OutForDelivery: {
                style: 'progress-step',
                createdAt: '',
            },
            Delivered: {
                style: 'progress-step',
                createdAt: '',
            },
        };
        this.review = {
            overall: 0,
            itemCondition: 0,
            delivery: 0,
            notes: ''
        };
        if (this._$stateParams.orderId) {
            this.orderId = this._$stateParams.orderId;
            this.orderQuery = {
                orderId: this.orderId,
                skip: 0,
                limit: 10
            };
            if (this._$stateParams.type === 'recurOrder') {
                this.getRecurringOrder(this.orderQuery);
            } else {
                this.getOrder(this.orderQuery);
                //  this.getReviewedOrders(this.orderQuery);
            }
        } else {
        }
        this.productViewMode = 'viewMode';
        this.getProducts();
    }

    getOrder(query) {
        this.orderIsLoaded = false;
        const _onSuccess = (res) => {
            if (res.data) {
                this.order = res.data.data;
                if (this.order.review) {
                    this.review = this.order.review;
                }
                this.totalPages = Math.ceil(
                    res.data.data.count / this.orderQuery.limit);
            }
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = () => {
            this.orderIsLoaded = true;
            this.getOrderLog(this.orderQuery);
        };
        this._OrderService.getOrder(query).then(_onSuccess, _onError).finally(_onFinal);
    }

    getOrderLog(query) {
        const _onSuccess = (res) => {
            if (res.data) {
                this.orderLog = res.data.data;
                const sortedOrderLogArr = this.orderLog.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1);
                const orderLogStatus = sortedOrderLogArr.map(object => object.status);
                const orderLogStatusDates = sortedOrderLogArr.map(object => object.createdAt);
                for (let i = 0; i < orderLogStatus.length; i += 1) {
                    this.progressMarkerStatus[orderLogStatus[i]].style = 'progress-step is-complete';
                    this.progressMarkerStatus[orderLogStatus[i]].createdAt = orderLogStatusDates[i];
                    if (orderLogStatus[i] === this.order.status) {
                        break;
                    }
                }
            }
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasErrorLog = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = () => {
            this.orderLogIsLoaded = true;
        };
        this._OrderService.getOrderLog(query).then(_onSuccess, _onError).finally(_onFinal);
    }

    cancelRecurringOrder() {
        const ctrl = this;
        if (this.orderId) {
            const _onSuccess = (res) => {
                this.order = res.data.data;
                this.notify('customer.order.view.actions.canceled', 'warning', 5000);
                $('#deleteProductFromOrder').modal('hide');
                $('#cancelOrderModal').modal('hide');
                $('#cancelOrderModal').on('hidden.bs.modal', () => {
                    ctrl.$window.history.back();
                });
                // this.setProductsViewMode('viewMode');
                // this.$window.history.back();
            };
            const _onError = (err) => {
                this.hasError = true;
                if (err.data) {
                    this.errors = err.data.data;
                }
                $('#deleteProductFromOrder').modal('hide');
                $('#cancelOrderModal').modal('hide');
                this.notify('customer.order.view.unexpectedError', 'warning', 5000);
            };
            const _onFinal = () => {
                // this.cancelOrderComplete = true;
            };
            const data = {message: ''};
            this._OrderService.cancelRecurringOrder(this.orderId, data)
                .then(_onSuccess, _onError)
                .finally(_onFinal);
        }
    }

    cancelOrder() {
        const ctrl = this;
        if (this.orderId) {
            const _onSuccess = (res) => {
                this.order = res.data.data;
                this.notify('customer.order.view.actions.canceled', 'warning', 5000);
                $('#deleteProductFromOrder').modal('hide');
                $('#cancelOrderModal').modal('hide');
                $('#cancelOrderModal').on('hidden.bs.modal', () => {
                    ctrl.$window.history.back();
                });
            };
            const _onError = (err) => {
                this.hasError = true;
                $('#deleteProductFromOrder').modal('hide');
                $('#cancelOrderModal').modal('hide');
                if (err.data) {
                    this.errors = err.data.data;
                }
                this.notify('customer.order.view.unexpectedError', 'warning', 5000);
            };
            const _onFinal = () => {
                // this.cancelOrderComplete = true;
            };
            const data = {message: ''};
            this._OrderService.cancelOrder(this.orderId, data)
                .then(_onSuccess, _onError)
                .finally(_onFinal);
        }
    }

    getRecurringOrder(query) {
        const _onSuccess = (res) => {
            this.order = res.data.data;
            this.totalPages = Math.ceil(
                res.data.data.count / this.orderQuery.limit);
            this.translateOrderInterval();
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = () => {
            this.orderIsLoaded = true;
        };
        this._OrderService.getRecurringOrder(query)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    reviewOrder() {
        if (this.review) {
            if (this.orderId) {
                const _onSuccess = (res) => {
                    this.order = res.data.data;
                    if (this.order.review) {
                        this.review = this.order.review;
                    }
                    this.notify('customer.order.view.actions.review', 'success', 1000);
                };
                const _onError = (err) => {
                    this.hasError = true;
                    if (err.data) {
                        this.errors = err.data.data;
                    }
                    this.notify('customer.order.view.unexpectedError', 'danger', 1000);
                };
                const _onFinal = () => {
                    this.isReviewed = true;
                };
                const data = this.review;
                this._OrderService.reviewOrder(this.orderId, data)
                    .then(_onSuccess, _onError)
                    .finally(_onFinal);
            }
        }
    }

    setItemConditionRating(rate) {
        this.review.itemCondition = rate;
    }

    setDeliveryRating(rate) {
        this.review.delivery = rate;
    }

    setOverallRating(rate) {
        this.review.overall = rate;
    }

    getPage(pageNumber) {
        this.currentPage = pageNumber;
        this.orderQuery.skip = (pageNumber - 1) * this.orderQuery.limit;
        if (this._$stateParams.type === 'recurOrder') {
            this.getRecurringOrder(this.orderQuery);
        } else {
            this.getOrder(this.orderQuery);
            this.getOrderLog(this.orderQuery);
        }
    }

    translateOrderInterval() {
        const ctrl = this;
        if (ctrl.order.orderIntervalType === 'Day') {
            ctrl.interval = ctrl._$translate.instant('customer.cart.intervalType.day');
        } else if (this.order.orderIntervalType === 'Week') {
            ctrl.interval = ctrl._$translate.instant('customer.cart.intervalType.week');
        } else if (ctrl.order.orderIntervalType === 'Month') {
            ctrl.interval = ctrl._$translate.instant('customer.cart.intervalType.month');
        }

        this.$rootScope.$on('$translateChangeSuccess', (event, current, previous) => {
            if (ctrl.order.orderIntervalType === 'Day') {
                ctrl.interval = ctrl._$translate.instant('customer.cart.intervalType.day');
            } else if (this.order.orderIntervalType === 'Week') {
                ctrl.interval = ctrl._$translate.instant('customer.cart.intervalType.week');
            } else if (ctrl.order.orderIntervalType === 'Month') {
                ctrl.interval = ctrl._$translate.instant('customer.cart.intervalType.month');
            }
        });
    }

    printOrderDetails(type) {
        if (this._$stateParams.type === 'recurOrder') {
            this._OrderService.exportRecurringOrderDetailsFile(type, this.orderQuery);
        } else {
            this._OrderService.exportFile(type, this.orderQuery);
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

    addProductToOrder() {
        if (this.orderId && this.selectedProduct._id && this.quantity) {
            const _onSuccess = (res) => {
                this.notify('customer.order.message.success', 'success', 1000);
                this.setProductsViewMode('viewMode');
                this.getOrder(this.orderQuery);
                // this.getOrderLog(this.orderQuery);
            };
            const _onError = (err) => {
                if (err.code === 500) {
                    this.hasError = true;
                } else if (err.code === 501) {
                    this.noInternetConnection = true;
                } else {
                    this.notify('customer.order.message.error', 'warning', 3000);
                }
            };
            this._OrderService.addProductToOrder(this.orderId,
                this.selectedProduct._id, this.quantity)
                .then(_onSuccess, _onError);
        }
    }

    addProductToRecurringOrder() {
        if (this.quantity > 10000) {
            this.notify('customer.product.message.maxQuantity', 'danger', 5000);
        } else if (this.orderId && this.selectedProduct._id && this.quantity) {
            const _onSuccess = (res) => {
                this.notify('customer.order.message.success', 'success', 1000);
                this.setProductsViewMode('viewMode');
                this.getRecurringOrder(this.orderQuery);
                // this.getOrderLog(this.orderQuery);
            };
            const _onError = (err) => {
                if (err.code === 500) {
                    this.hasError = true;
                } else if (err.code === 501) {
                    this.noInternetConnection = true;
                } else {
                    this.notify('customer.order.message.error', 'warning', 3000);
                }
            };
            this._OrderService.addProductToRecurringOrder(this.orderId,
                this.selectedProduct._id, this.quantity)
                .then(_onSuccess, _onError);
        }
    }

    editProductInRecurringOrder(productIdInOrder, quantity, orderId) {
        if (quantity > 10000) {
            this.notify('customer.product.message.maxQuantity', 'danger', 5000);
        } else if (productIdInOrder && quantity) {
            const _onSuccess = (res) => {
                this.notify('customer.order.message.success', 'success', 1000);
                this.setProductsViewMode('viewMode');
                this.getRecurringOrder(this.orderQuery);
                // this.getOrderLog(this.orderQuery);
            };
            const _onError = (err) => {
                if (err.code === 500) {
                    this.hasError = true;
                } else if (err.code === 501) {
                    this.noInternetConnection = true;
                } else {
                    this.notify('customer.order.message.error', 'warning', 3000);
                }
            };
            this._OrderService.editProductInRecurringOrder(productIdInOrder, quantity, orderId).then(
                _onSuccess,
                _onError
            );
        }
    }

    deleteProductInRecurringOrder(orderId, productIdInOrder) {
        if (orderId && productIdInOrder) {
            const _onSuccess = (res) => {
                this.notify('customer.order.message.success', 'success', 1000);
                this.setProductsViewMode('viewMode');
                this.getRecurringOrder(this.orderQuery);
                // this.getOrderLog(this.orderQuery);
            };
            const _onError = (err) => {
                if (err.code === 500) {
                    this.hasError = true;
                } else if (err.code === 501) {
                    this.noInternetConnection = true;
                } else {
                    this.notify('customer.order.message.error', 'warning', 3000);
                }
            };
            this._OrderService.deleteProductInRecurringOrder(orderId, productIdInOrder).then(_onSuccess, _onError);
        }
    }

    editProductInOrder(productIdInOrder, quantity) {
        if (productIdInOrder && quantity) {
            const _onSuccess = (res) => {
                this.notify('customer.order.message.success', 'success', 1000);
                this.setProductsViewMode('viewMode');
                this.getOrder(this.orderQuery);
                // this.getOrderLog(this.orderQuery);
            };
            const _onError = (err) => {
                if (err.code === 500) {
                    this.hasError = true;
                } else if (err.code === 501) {
                    this.noInternetConnection = true;
                } else {
                    this.notify('customer.order.message.error', 'warning', 3000);
                }
            };
            this._OrderService.editProductInOrder(productIdInOrder, quantity).then(
                _onSuccess,
                _onError
            );
        }
    }

    markerClicked(coordinates) {
        const url = `https://www.google.com/maps/?q=${coordinates.latLng.lat()},${coordinates.latLng.lng()}`;
        window.open(url, '_blank');
    }

    checkProductForDelete(order, item) {
        order.products.length === 1 ? $('#deleteProductFromOrder').modal('show') : (order.status === 'Pending' ? this.deleteProductInOrder(item._id) : this.deleteProductInRecurringOrder(order._id, item._id));
    }

    deleteProductInOrder(productIdInOrder) {
        if (productIdInOrder) {
            const _onSuccess = (res) => {
                this.notify('customer.order.message.success', 'success', 1000);
                this.setProductsViewMode('viewMode');
                this.getOrder(this.orderQuery);
                // this.getOrderLog(this.orderQuery);
            };
            const _onError = (err) => {
                if (err.code === 500) {
                    this.hasError = true;
                } else if (err.code === 501) {
                    this.noInternetConnection = true;
                } else {
                    this.notify('customer.order.message.error', 'warning', 3000);
                }
            };
            this._OrderService.deleteProductInOrder(productIdInOrder).then(_onSuccess, _onError);
        }
    }

    setProductsViewMode(mode) {
        this.productViewMode = mode;
    }

    cancelEditProduct() {
        this.setProductsViewMode('viewMode');
        this.getOrder(this.orderQuery);
        this.getOrderLog(this.orderQuery);
    }

    getProducts() {
        this.productsAreLoaded = false;
        const _onSuccess = (res) => {
            this.products = res.data.data.products;
            this.selectedProduct = this.products[0];
            $.Pages.init(); // eslint-disable-line
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = (res) => {
            this.productsAreLoaded = true;
        };
        this._ProductService.getProductsBySupplierId(this.$rootScope.supplierId, {
            skip: 0,
            limit: 1000
        }).then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    doDownload(url) {
        this._SupplierService.getDeliveryImagePhone(url).then((res) => {

            },
            (err) => {
            console.log(err);
                console.log('error');
            });
    }
}
CustomerOrderDetailCtrl.$inject = ['OrderService', 'SupplierService', '$translate', '$stateParams', '$rootScope', 'ProductService', '$window', '$http', 'CustomerService'];
