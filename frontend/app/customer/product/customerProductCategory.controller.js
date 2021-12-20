export default class CustomerProductCategoryCtrl {
    constructor(CategoryService, $stateParams, $rootScope, $state, $element) {
        this._CategoryService = CategoryService;
        this._$stateParams = $stateParams;
        this._$rootScope = $rootScope;
        this._$state = $state;
        this.$element = $element;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.supplierId = this._$stateParams.supplierId || this._$rootScope.supplierId;
        if (!this.supplierId) {
            if (this._$rootScope.supplierId) {
                const supplier = {supplierId: this._$rootScope.supplierId};
                if (this._$state.is('app.customer.product.list.category')) {
                    this._$state.go('app.customer.product.list.category', supplier);
                }
            } else {

            }
        }
        this.requestAllCategories = false;
        this.categoryCurrentPage = 1;
        this.categoryQuery = {
            skip: 0,
            limit: 10,
            supplierId: this.supplierId,
            all: false
        };
        this.getCategories(this.categoryQuery);
    }

    setPageCategories(pageNumber) {
        this.categoryCurrentPage = pageNumber;
        this.categoryQuery.skip = (pageNumber - 1) * this.categoryQuery.limit;
        this.getCategories(this.categoryQuery);
    }

    requestCategories() {
        this.requestAllCategories = this.categoryQuery.all;
        this.getCategories(this.categoryQuery);
    }

    getCategories(query) {
        this.categoriesLoaded = false;
        const _onSuccess = (res) => {
            this.categories = [];
            this.categories = res.data.data.categories;
            /*   for (let i = 0; i < this.categoriesData.length; i += 1) {
                   if (this.categoriesData[i].childCategory) {
                       for (let indxChild = 0; indxChild < this.categoriesData[i].childCategory.length; indxChild += 1) {
                           if (this.categoriesData[i].childCategory[indxChild].products.length > 0) {
                               if (!this.categories.find(cat => this.categoriesData[i]._id === cat._id)) {
                                   this.categories.push(this.categoriesData[i]);
                               }
                           }
                       }
                   }
               }*/

            this.categoriesTotalPages = Math.ceil(
                res.data.data.count / this.categoryQuery.limit);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = (err) => {
            this.categoriesLoaded = true;
        };
        this._CategoryService.getCategories(query).then(_onSuccess, _onError).finally(_onFinal);
    }
}
CustomerProductCategoryCtrl.$inject = ['CategoryService', '$stateParams', '$rootScope', '$state', '$element'];
