class Customer {
    constructor(SupplierService, $stateParams, CartService, $rootScope, $translate) {
        this._SupplierService = SupplierService;
        this._$stateParams = $stateParams;
        this._CartService = CartService;
        this._$rootScope = $rootScope;
        this.$translate = $translate;
        this.suppliers = [];
        this.branches = [];
        this.branchId = '';
        this.customer = {};
        this.orders = {};
        this.cart = {};
        this.balanceDetails = {};
    }
    getSuppliers(query) {
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.suppliers = res.data.data.suppliers;
                if (this._$stateParams.supplierId) {
                    this._$rootScope.supplierId = this._$stateParams.supplierId;
                } else {
                    this._$rootScope.supplierId = this.suppliers[0].supplier._id;
                    if (!this._$rootScope.supplier) {
                        this._$rootScope.supplier = this.suppliers[0].supplier;
                    }
                }
            }
        };
        const _onError = (err) => {
            if (err.code === 100) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = () => {
            this.suppliersIsLoaded = true;
        };
        this._SupplierService.getSuppliers(query).then(_onSuccess, _onError).finally(_onFinal);
    }

    getBranches() {
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.branches = res.data.data;
                this.branchId = this.branches[0] ? this.branches[0]._id : '';
            }
        };
        const _onError = (err) => {
            if (err.code === 100) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = () => {
            this.branchIsLoaded = true;
        };
        this._SupplierService.getBranches().then(_onSuccess, _onError).finally(_onFinal);
    }

    checkoutCart(cartId, branchId, recurringBody = null) {
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.cart = res.data.data.cart;
                this.cart.total = res.data.data.total;
                this.cart.vat = res.data.data.vat;
                this.balanceDetails = res.data.data.balanceDetails;
                this._$rootScope.cartItems = res.data.data.items;
            }
        };
        const _onError = (err) => {
            if (err.code === 100) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
            this.notify('customer.cart.message.checkoutCartFailure', 'danger', 5000);
        };
        const _onFinal = () => {
            this.isLoaded = true;
        };
        this._CartService.checkoutCart(cartId, branchId, recurringBody).then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    deleteProductFromCart(productId, supplierId) {
        const _onSuccess = (res) => {
            this.getCartBySupplier(supplierId);
            this.notify('customer.cart.message.deleteProductSuccess', 'success', 100);
            this._$rootScope.$broadcast('deleteProductFromCart', productId);
            // this.cart = res.data.data.cart;
            // this.cart.total = res.data.data.total;
            // this.cart.vat = res.data.data.vat;
            // this.balanceDetails = res.data.data.balanceDetails;
            // this._$rootScope.cartItems = res.data.data.items;
            // this._$rootScope.cart = this.cart;
            // this.notify('customer.cart.message.deleteProductSuccess', 'success', 100);
            // this._$rootScope.$broadcast('deleteProductFromCart', productId);
        };
        const _onError = (err) => {
            if (err.code === 100) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
            this.notify('customer.cart.message.deleteProductFailure', 'danger', 5000);
        };
        const _onFinal = () => {
            this.isLoaded = true;
        };
        this._CartService.deleteProductFromCart(productId)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }
    getCartBySupplier(id) {
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.cart = res.data.data.cart;
                this.cart.total = res.data.data.total;
                this.cart.vat = res.data.data.vat;
                this._$rootScope.cartItems = res.data.data.items;
                this.balanceDetails = res.data.data.balanceDetails;
                this._$rootScope.supplierName = res.data.data.cart.supplier.representativeName;
                this._$rootScope.$broadcast('checkProductInCart', this.cart.products);
                this._$rootScope.cart = this.cart;
            }
        };
        const _onError = (err) => {
            if (err.code === 100) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
            this.cart.products = [];
        };
        const _onFinal = () => {
            this.isLoaded = true;
        };
        this._CartService.getCartBySupplier(id)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }
    updateProductQuantity(productId, newQuantity, supplierId) {
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.getCartBySupplier(supplierId);
                // this.cart = res.data.data.cart;
                // this.cart.total = res.data.data.total;
                // this.cart.vat = res.data.data.vat;
                // this.balanceDetails = res.data.data.balanceDetails;
                // this._$rootScope.cartItems = res.data.data.items;
                this.notify('customer.cart.message.updateProductQuantitySuccess', 'success', 500);
            }
        };
        const _onError = (err) => {
            if (err.code === 100) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            } else if (err.data.errorCode === 7) {
                this.notify('customer.product.message.exceedLimit', 'info', 5000);
            } else if (err.data.errorCode === 6) {
                this.notify('customer.product.message.maxQuantity', 'info', 5000);
            } else {
                this.notify('customer.cart.message.updateProductQuantityFailure', 'danger', 5000);
            }
        };
        const _onFinal = () => {
            this.isLoaded = true;
        };
        this._CartService.updateProductQuantity(productId, newQuantity)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
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

Customer.$inject = ['SupplierService', '$stateParams', 'CartService', '$rootScope', '$translate'];
module.exports = { Customer };
