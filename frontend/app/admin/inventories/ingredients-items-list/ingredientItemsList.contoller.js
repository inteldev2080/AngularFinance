export default class AdminIngredientsListCtrl {
    constructor($rootScope, $translate, InventoryService) {
        this._InventoryService = InventoryService;
        this.$rootScope = $rootScope;
        this.$translate = $translate;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        const ctrl = this;

        this.searchCriteria = {
            skip: 0,
            limit: 10,
            name: '',
        };
        this.currentPage = 1;
        this.getIngredients(this.searchCriteria);
        this.$rootScope.$on('getIngredients', () => {
            ctrl.getIngredients(ctrl.searchCriteria);
        });
    }

    getIngredients(searchCriteria) {
        const _onSuccess = (res) => {
            this.ingredientsItems = res.data.data.ingredients;
            const itemData = this.ingredientsItems;
            setTimeout(() => {
                itemData.forEach((item) => {
                    JsBarcode(`#barcodeIngredient${item.barcode}`, item.barcode, {
                        lineColor: '#00000',
                        width: 3,
                        height: 50,
                        displayValue: true,
                        margin: 10
                    });
                });
            }, 100);


            this.totalPages = Math.ceil(
                res.data.data.count / this.searchCriteria.limit
            );
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = () => {
            this.recipesAreLoaded = true;
        };
        this._InventoryService
            .getIngredients(searchCriteria)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    deleteIngredientItem(item) {
        const _onSuccess = (res) => {
            this.getIngredients(this.searchCriteria);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = () => {
            this.recipesAreLoaded = true;
        };
        this._InventoryService.deleteIngredient(item._id)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    openAddIngredientForm() {
        $('#ingredientModal').modal('show');
    }

    openEditIngredientForm(item) {
        $('#editIngredientListingModal').modal('show');
        this.$rootScope.$broadcast('editIngredientListingModal', item);
    }
}

AdminIngredientsListCtrl.$inject = ['$rootScope', '$translate', 'InventoryService'];
