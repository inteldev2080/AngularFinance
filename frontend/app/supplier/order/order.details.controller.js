export default class OrderDetailsCtrl {
    constructor(OrderService, SupplierService, $translate, $location, $stateParams, $window, ProductService, Upload,
                AppConstants) {
        this._OrderService = OrderService;
        this._SupplierService = SupplierService;
        this._$translate = $translate;
        this._$location = $location;
        this._$stateParams = $stateParams;
        this.orderCard = null;
        this.orderId = null;
        this.cancelOrderMessage = null;
        this.selected = {
            products: []
        };
        this.noFileSelected = false;
        this.base64ImageIsLoading = false;
        this.deliveryImagePhoto = null;
        this.deliveryImageName = null;
        this.isAllChecked = false;
        this.hasError = false;
        this.$window = $window;
        this._ProductService = ProductService;
        this.Upload = Upload;
        this.UPLOAD_URL = AppConstants.UPLOAD_URL;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        if (this._$stateParams.orderId) {
            this.orderId = this._$stateParams.orderId;
            this.orderQuery = {
                orderId: this.orderId,
                skip: 0,
                limit: 10
            };
            this.getOrder(this.orderQuery);
            this.getOrderLog(this.orderQuery);
        } else {
        }

        this.searchCriteria = {
            skip: 0,
            limit: 10
        };
        this.getSupplierDrivers(this.searchCriteria, 1);
        this.getProducts();
        this.productViewMode = 'viewMode';
    }

    getOrder(orderQuery) {
        const _onSuccess = (res) => {
            if (res.data) {
                this.orderCard = res.data.data;
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
            this.orderIsLoaded = true;
        };
        this._OrderService.getOrder(orderQuery).then(_onSuccess, _onError).finally(_onFinal);
    }

    getOrderLog(orderQuery) {
        const _onSuccess = (res) => {
            if (res.data) {
                this.orderLog = res.data.data;
            }
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasErrorLog = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = (err) => {
            this.orderLogIsLoaded = true;
        };
        this._OrderService.getOrderLog(orderQuery).then(_onSuccess, _onError).finally(_onFinal);
    }

    markerClicked(coordinates) {
        const url = `https://www.google.com/maps/?q=${coordinates.latLng.lat()},${coordinates.latLng.lng()}`;
        window.open(url, '_blank');
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

    cancelOrder() {
        if (this.cancelOrderMessage) {
            if (this.orderId) {
                $('#cancelModal').modal('hide');
                const _onSuccess = (res) => {
                    this.orderCard = res.data.data;
                    this.notify('supplier.order.view.actions.canceled', 'warning', 5000);
                    this.getOrderLog(this.orderQuery);
                    this.cancelOrderMessage = '';
                    this.$window.history.back();
                };
                const _onError = (err) => {
                    this.hasError = true;
                    if (err.data) {
                        this.errors = err.data.data;
                    }
                    this.notify('supplier.order.view.actions.unexpectedError', 'danger', 5000);
                };
                const _onFinal = (err) => {
                    // $('#cancelModal').modal('hide');
                };
                const data = {message: this.cancelOrderMessage};
                this._OrderService.cancelOrder(this.orderId, data)
                    .then(_onSuccess, _onError).finally(_onFinal);
            }
        }
    }

    rejectOrder() {
        if (this.orderId) {
            $('#rejectModal').modal('hide');
            const _onSuccess = (res) => {
                this.orderCard = res.data.data;
                this.notify('supplier.order.view.actions.reject', 'warning', 5000);
                $('#rejectModal').modal('hide');
                this.$window.history.back();
            };
            const _onError = (err) => {
                this.hasError = true;
                if (err.data) {
                    this.errors = err.data.data;
                }
                this.notify('supplier.order.view.actions.unexpectedError', 'danger', 5000);
                $('#rejectModal').modal('hide');
                this.$window.history.back();
            };
            const _onFinal = (err) => {
                $('#rejectModal').modal('hide');
            };
            const data = {message: this.rejectOrderMessage};
            this._OrderService.rejectOrder(this.orderId, data)
                .then(_onSuccess, _onError).finally(_onFinal);
        }
    }

    checkAll() {
        const ctrl = this;
        this.isAllChecked = !this.isAllChecked;
        if (this.isAllChecked) {
            angular.forEach(this.orderCard.products, (itm) => {
                ctrl.selected.products.push(itm._id);
            });
        } else {
            this.selected.products = [];
        }
// this.orderCard
    }

    acceptOrder() {
        if (this.selected.products.length === 0) {
            const ctrl = this;
            angular.forEach(this.orderCard.products, (itm) => {
                ctrl.selected.products.push(itm._id);
            });
        }

        if (this.orderId) {
            const _onSuccess = (res) => {
                this.orderCard = res.data.data;
                this.notify('supplier.order.view.actions.acceptOrder', 'success', 1500);
                this.getOrderLog(this.orderQuery);
                this.$window.history.back();
            };
            const _onError = (err) => {
                this.hasError = true;
                if (err.data) {
                    this.errors = err.data.data;
                }
                this.notify('supplier.order.view.actions.unexpectedError', 'danger', 5000);
            };
            const _onFinal = (err) => {

            };

            const data = {acceptedProducts: this.selected.products};
            this._OrderService.acceptOrder(this.orderId, data)
                .then(_onSuccess, _onError).finally(_onFinal);
        }
    }

    markReadyOrder() {
        if (this.orderId) {
            const _onSuccess = (res) => {
                this.orderCard = res.data.data;
                this.notify('supplier.order.view.actions.readyForDelivery', 'success', 1500);
                this.$window.history.back();
            };
            const _onError = (err) => {
                this.hasError = true;
                if (err.data) {
                    this.errors = err.data.data;
                }
                this.notify('supplier.order.view.actions.unexpectedError', 'danger', 5000);
            };
            const _onFinal = (err) => {
                // this.orderIsLoaded = true;
            };
            this._OrderService.readyForDeliveryOrder(this.orderId).then(_onSuccess, _onError);
        }
    }

    outForDeliveryOrder() {
        $('.modal').modal('hide'); // closes all active pop ups.
        $('.modal-backdrop').remove(); // removes the grey overlay.
        $('.modal-backdrop').remove(); // removes the grey overlay.
        if (this.orderId && this.driver) {
            const _onSuccess = (res) => {
                this.orderCard = res.data.data;
                this.notify('supplier.order.view.actions.outOfDelivery', 'success', 1500);
                this.$window.history.back();
            };
            const _onError = (err) => {
                this.hasError = true;
                if (err.data) {
                    this.errors = err.data.data;
                }
                this.notify('supplier.order.view.actions.unexpectedError', 'danger', 5000);
            };
            const _onFinal = (err) => {
                // $('#driverModal').modal('hide');
            };

            const data = {driverId: this.driver};
            this._OrderService.outForDeliveryOrder(this.orderId, data)
                .then(_onSuccess, _onError).finally(_onFinal);
        }
    }

    markDeliveredOrder() {
        if (this.orderId) {
            const _onSuccess = (res) => {
                this.orderCard = res.data.data;
                this.notify('supplier.order.view.actions.delivered', 'success', 1500);
                this.$window.history.back();
            };
            const _onError = (err) => {
                this.hasError = true;
                if (err.data) {
                    this.errors = err.data.data;
                }
                this.notify('supplier.order.view.actions.unexpectedError', 'danger', 5000);
            };
            const _onFinal = (err) => {
                // this.orderIsLoaded = true;
            };
            this._OrderService.deliveredOrder(this.orderId, {deliveryImage: this.deliveryImagePhoto}).then(_onSuccess, _onError);
        }
    }

    markFailOrderOrder() {
        if (this.orderId) {
            $('#failedModal').modal('hide');
            const _onSuccess = (res) => {
                this.orderCard = res.data.data;
                this.notify('supplier.order.view.actions.failed', 'warning', 5000);
                this.$window.history.back();
            };
            const _onError = (err) => {
                this.hasError = true;
                if (err.data) {
                    this.errors = err.data.data;
                }
                this.notify('supplier.order.view.actions.unexpectedError', 'danger', 5000);
            };
            const _onFinal = (err) => {
                //  $('#failedModal').modal('hide');
            };

            const data = {message: this.failedToDeliverOrderMessage};
            this._OrderService.failOrder(this.orderId, data)
                .then(_onSuccess, _onError).finally(_onFinal);
        }
    }

    printOrderDetails(type) {
        this._OrderService.exportFile(type, this.orderQuery);
    }

    getProducts() {
        this.productsAreLoaded = false;
        const _onSuccess = (res) => {
            this.products = res.data.data.products;
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = (res) => {
            this.productsAreLoaded = true;
        };
        this._ProductService.getSupplierProducts({
            skip: 0,
            limit: 1000
        }).then(_onSuccess, _onError)
            .finally(_onFinal);
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
                this.notify('supplier.order.message.success', 'success', 1000);
                this.setProductsViewMode('viewMode');
                this.getOrder(this.orderQuery);
                this.getOrderLog(this.orderQuery);
            };
            const _onError = (err) => {
                if (err.code === 500) {
                    this.hasError = true;
                } else if (err.code === 501) {
                    this.noInternetConnection = true;
                } else {
                    this.notify('supplier.order.message.error', 'warning', 3000);
                }
            };
            this._OrderService.addProductToOrder(this.orderId,
                this.selectedProduct._id, this.quantity)
                .then(_onSuccess, _onError);
        }
    }

    editProductInOrder(productIdInOrder, quantity) {
        if (productIdInOrder && quantity) {
            const _onSuccess = (res) => {
                this.notify('supplier.order.message.success', 'success', 1000);
                this.setProductsViewMode('viewMode');
                this.getOrder(this.orderQuery);
                this.getOrderLog(this.orderQuery);
            };
            const _onError = (err) => {
                if (err.code === 500) {
                    this.hasError = true;
                } else if (err.code === 501) {
                    this.noInternetConnection = true;
                } else {
                    this.notify('supplier.order.message.error', 'warning', 3000);
                }
            };
            this._OrderService.editProductInOrder(productIdInOrder, quantity).then(
                _onSuccess,
                _onError
            );
        }
    }

    deleteProductInOrder(productIdInOrder) {
        if (productIdInOrder) {
            const _onSuccess = (res) => {
                this.notify('supplier.order.message.success', 'success', 1000);
                this.setProductsViewMode('viewMode');
                this.getOrder(this.orderQuery);
                this.getOrderLog(this.orderQuery);
            };
            const _onError = (err) => {
                if (err.code === 500) {
                    this.hasError = true;
                } else if (err.code === 501) {
                    this.noInternetConnection = true;
                } else {
                    this.notify('supplier.order.message.error', 'warning', 3000);
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

    uploadFile(file, errFiles) {
        if (file) {
            this.deliveryImagePhoto = null;

            const ctrl = this;
            this.errFile = errFiles && errFiles[0];
            this.base64ImageIsLoading = true;

            file.upload = this.Upload.upload({
                url: ctrl.UPLOAD_URL,
                data: {image: file},
                disableProgress: true,
                headers: {Accept: 'application/json'}
            });
            file.upload.then((response) => {
                this.noFileSelected = false;
                this.base64ImageIsLoading = false;
                this.deliveryImagePhoto = response.data.data.path;
                this.deliveryImageName = response.data.data.filename;
            }, (response) => {
                if (response.status > 0) {
                    this.errorMsg = `${response.status}: ${response.data}`;
                    this.isUploadPhoto = false;
                }
            }, (evt) => {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        } else {
            this.deliveryImagePhoto = null;
            this.noFileSelected = true;
            this.base64ImageIsLoading = false;
            this.deliveryImageName = null;
        }
    }
}
OrderDetailsCtrl.$inject = ['OrderService', 'SupplierService', '$translate', '$location', '$stateParams', '$window', 'ProductService', 'Upload',
    'AppConstants'];
