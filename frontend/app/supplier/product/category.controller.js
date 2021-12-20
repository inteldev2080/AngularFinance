
export default class CategoryCtrl {
    constructor(CategoryService, $translate, $state, $rootScope) {
        this._CategoryService = CategoryService;
        this._$translate = $translate;
        this._$rootScope = $rootScope;
        this._$state = $state;
    }

    $onInit() {
        this.firstLoad = true;
        this.searchCriteria = { skip: 0, limit: 100 };
        this._$rootScope.activeCategory = this._$state.params.categoryId;
        this.getCategories(this.searchCriteria);
    }

    getCategories(searchCriteria) {
        const ctrl = this;
        const _onSuccess = (res) => {
            this.categories = res.data.data.categories;
            angular.forEach(this.categories, (mainCategories) => {
                angular.forEach(mainCategories.childCategory, (categories) => {
                    if (categories._id === ctrl._$state.params.categoryId) {
                        ctrl._$rootScope.activeParentCategory = mainCategories._id;
                        ctrl._$rootScope.categoryName = ctrl._$translate.use() === 'en' ? mainCategories.englishName : mainCategories.arabicName;
                        ctrl._$rootScope.subCategoryName = ctrl._$translate.use() === 'en' ? categories.englishName : categories.arabicName;
                    }
                });
            });
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = () => {
            this.categoriesLoaded = true;
        };
        this._CategoryService.getCategories(searchCriteria).then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    setCategoryName(categoryName, subCategoryName) {
        this._$rootScope.categoryName = categoryName;
        this._$rootScope.subCategoryName = subCategoryName;
    }

}
CategoryCtrl.$inject = ['CategoryService', '$translate', '$state', '$rootScope'];
