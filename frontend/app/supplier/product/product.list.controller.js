export default class ProductListCtrl {
    constructor(ProductService, $translate, $stateParams, $state, $rootScope) {
        this._ProductService = ProductService;
        this._$translate = $translate;
        this._$stateParams = $stateParams;
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.status = {
            active: {
                arabicName: 'مفعل',
                englishName: 'Active'
            },
            hidden: {
                arabicName: 'مخفي',
                englishName: 'Hidden'
            }
        };
    }

    $onInit() {
        this.productCurrentPage = 1;
        this.query = { skip: 0, limit: 10 };
        this.query.categoryId = this._$stateParams.categoryId; // if "All" get All products
        this.getProducts(this.query);
    }
    getProducts(query) {
        this.isLoading = true;
        const _onSuccess = (res) => {
            this.productList = res.data.data;
            this.productsTotalPages = Math.ceil(
                this.productList.count / this.query.limit);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = () => {
            this.isLoading = false;
        };
        this._ProductService.getProducts(query)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }
    setProductsCurrentPage(pageNumber) {
        this.productCurrentPage = pageNumber;
        this.query.skip = (pageNumber - 1) * this.query.limit;
        this.getProducts(this.query);
    }
    goToAddProductState() {
        if (!this._$stateParams.categoryId) return;
        this.$rootScope.categoryId = this._$stateParams.categoryId;
        this.$state.go('app.supplier.product.add');
    }
}
ProductListCtrl.$inject = ['ProductService', '$translate', '$stateParams', '$state', '$rootScope'];
