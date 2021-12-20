export default class CustomerProductDetailCtrl {
    constructor(CartService, ProductService, $stateParams, $translate, $rootScope) {
        this._CartService = CartService;
        this._ProductService = ProductService;
        this._$stateParams = $stateParams;
        this._$translate = $translate;
        this.$rootScope = $rootScope;
    }
    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.quantity = 1;
        this.getProduct(this._$stateParams.productId);
    }
    getProduct(id) {
        const ctrl = this;
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.product = res.data.data;
                this.product.quantity = 1;
                this.$rootScope.categoryName = (this._$translate.use() === 'ar') ? this.product.categories[0].arabicName : this.product.categories[0].englishName;
                this.$rootScope.productName = (this._$translate.use() === 'ar') ? this.product.arabicName : this.product.englishName;
                this.$rootScope.$on('$translateChangeSuccess', (event, current, previous) => {
                    ctrl.$rootScope.categoryName = (ctrl._$translate.use() === 'ar') ? ctrl.product.categories[0].arabicName : ctrl.product.categories[0].englishName;
                    ctrl.$rootScope.productName = (ctrl._$translate.use() === 'ar') ? ctrl.product.arabicName : ctrl.product.englishName;
                });
            }
        };
        const _onError = err => err;
        this._ProductService.getProduct(id).then(_onSuccess, _onError);
    }
    addToCart() {
        const item = {
            product: this.product._id,
            quantity: this.product.quantity
        };
        if (this.product.quantity > 10000) {
            this.notify('customer.product.message.maxQuantity', 'danger', 5000);
            return;
        }
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.$rootScope.supplierId = this.$rootScope.supplierId || null;
                this.notify('customer.product.message.addToCardSuccess', 'success', 500);
                this.$rootScope.$broadcast('addToCart', this.$rootScope.supplierId);
            }
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            } else if (err.data.errorCode === 7) {
                this.notify('customer.product.message.exceedLimit', 'info', 5000);
            } else if (err.data.errorCode === 6) {
                this.notify('customer.product.message.maxQuantity', 'info', 5000);
            } else if (err.data.errorCode === 4) {
                this.notify('customer.product.message.unAuthorized', 'info', 5000);
            }
        };
        this._CartService.addToCart(item)
            .then(_onSuccess, _onError)
            .catch((ex) => {
                this.notify('customer.product.message.addToCardFailure', 'danger', 5000);
            })
            .finally(() => {
                this.quantity = 1;
            });
    }

    requestProduct() {
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.notify('customer.product.message.requestProductSuccess', 'success', 5000);
            }
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        this._CartService.requestProduct(this.product._id)
            .then(_onSuccess, _onError)
            .catch((ex) => {
                this.notify('customer.product.message.requestProductFailure', 'danger', 5000);
            })
            .finally(() => {
            });
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
CustomerProductDetailCtrl.$inject = ['CartService', 'ProductService', '$stateParams', '$translate', '$rootScope'];
