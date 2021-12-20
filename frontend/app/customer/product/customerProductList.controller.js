import { Customer } from '../customer.class';

export default class CustomerProductListCtrl {
    constructor($stateParams,
                CategoryService,
                ProductService,
                CartService,
                SupplierService,
                $rootScope,
                $scope,
                $translate,
                $state) {
        this.customer = new Customer(SupplierService, $stateParams, CartService, $rootScope, $translate);
        this._$stateParams = $stateParams;
        this._CategoryService = CategoryService;
        this._ProductService = ProductService;
        this._CartService = CartService;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.quantity = '';
        this._$translate = $translate;
        this.$state = $state;
        this.products = [];
        this.otherProducts = [];
    }
    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.supplierId = this._$stateParams.supplierId || this.$rootScope.supplierId;
        this.isAllRequest = this._$stateParams.isAll;
        this.quantity = 1;
        this.productCurrentPage = 1;
        this.otherProductCurrentPage = 1;
        this.getCategory(this._$stateParams.categoryId, this.supplierId, this.isAllRequest);
        this.productsQuery = {
            categoryId: this._$stateParams.categoryId,
            supplierId: this.supplierId,
            skip: 0,
            limit: 9
        };

        this.otherProductsQuery = {
            categoryId: this._$stateParams.categoryId,
            supplierId: this.supplierId,
            skip: 0,
            limit: 9
        };

        this.getProducts(this._$stateParams.categoryId);
        // this.getOtherProducts(this._$stateParams.categoryId);
        this.$scope.$watchCollection(() => this.$rootScope.cart, () => {
            if (this.$rootScope.cart) {
                this.checkProductsInCart(this.$rootScope.cart.products);
            }
        });
        this.$scope.$watchCollection(() => this.products, () => {
            if (this.$rootScope.cart) {
                this.checkProductsInCart(this.$rootScope.cart.products);
            }
        });
        this.$scope.$on('deleteProductFromCart', (event, productId) => {
            this.products.forEach((p) => {
                if (p._id === productId) {
                    p.isInCart = false;
                }
            });
        });
    }
    getCategory(categoryId, supplierId, isAllRequest) {
        const ctrl = this;
        const _onSuccess = (res) => {
            this.category = res.data.data;
            ctrl.$rootScope.categoryName = (ctrl._$translate.use() === 'ar') ? ctrl.category.arabicName : ctrl.category.englishName;
            this.$rootScope.$on('$translateChangeSuccess', (event, current, previous) => {
                ctrl.$rootScope.categoryName = (ctrl._$translate.use() === 'ar') ? ctrl.category.arabicName : ctrl.category.englishName;
            });
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = (res) => {
            this.categoriesAreLoaded = true;
        };
        this._CategoryService.getCategory(categoryId, supplierId, isAllRequest)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }
    getProducts(categoryId) {
        this.productsAreLoaded = false;
        this.productsQuery.categoryId = categoryId;
        const _onSuccess = (res) => {
            this.products = res.data.data.products;
            this.otherProducts = res.data.data.otherProducts;
            this.productsAreLoaded = true;
            this.productsTotalPages = Math.ceil(res.data.data.count / this.productsQuery.limit);
        };
        const _onError = (err) => {
            this.hasError = true;
            this.errors = err;
        };
        const _onFinal = (res) => {
            this.getOtherProducts(categoryId);
        };
        this._ProductService.getProducts(this.productsQuery)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    getOtherProducts(categoryId) {
        this.otherproductsAreLoaded = false;
        this.otherProductsQuery.categoryId = categoryId;
        const _onSuccess = (res) => {
            this.otherProducts = res.data.data.otherProducts;
            this.otherProductsTotalPages = Math.ceil(res.data.data.count / this.otherProductsQuery.limit);
            this.otherproductsAreLoaded = true;
        };
        const _onError = (err) => {
            this.hasError = true;
            this.errors = err;
        };
        const _onFinal = (res) => {
            // this.otherproductsAreLoaded = true;
        };
        this._ProductService.getOtherProducts(this.otherProductsQuery)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    addToCart(product) {
        const item = {
            product: product._id,
            quantity: product.quantity
        };
        if (product.quantity > 10000) {
            this.notify('customer.product.message.maxQuantity', 'danger', 5000);
            return;
        }
        const _onSuccess = (res) => {
            if (res.status === 200) {
              //  this.$rootScope.supplierId = this._$stateParams.supplierId;
                this.$rootScope.supplierId = this.$rootScope.supplierId || this._$stateParams.supplierId;
                product.isInCart = true;
                this.notify('customer.product.message.addToCardSuccess', 'success', 5000);
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
    setProductsCurrentPage(pageNumber) {
        this.productCurrentPage = pageNumber;
        this.productsQuery.skip = (pageNumber - 1) * this.productsQuery.limit;
        this.getProducts(this._$stateParams.categoryId);
    }

    setOtherProductsCurrentPage(pageNumber) {
        this.otherProductCurrentPage = pageNumber;
        this.otherProductsQuery.skip = (pageNumber - 1) * this.otherProductsQuery.limit;
        this.getOtherProducts(this._$stateParams.categoryId);
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
    checkProductsInCart(cProducts) {
        if (cProducts.length === 0) {
            this.products.forEach((p) => { p.isInCart = false; });
        } else {
            cProducts.forEach((cp) => {
                this.products.forEach((p) => {
                    if (cp.product._id === p._id) {
                        p.isInCart = true;
                    }
                });
            });
        }
    }
}
CustomerProductListCtrl.$inject = ['$stateParams', 'CategoryService', 'ProductService', 'CartService', 'SupplierService', '$rootScope', '$scope', '$translate', '$state'];
