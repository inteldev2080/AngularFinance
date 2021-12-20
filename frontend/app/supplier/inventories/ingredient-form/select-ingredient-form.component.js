class SelectIngredientFormCtrl {
    constructor(InventoryService, $translate, $rootScope) {
        this._InventoryService = InventoryService;
        this._$translate = $translate;
        this.$rootScope = $rootScope;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        const ctrl = this;

        this.$rootScope.$on('selectIngredientModal', (evt, data) => {
            this.recipeData = data;
            this.ingredientsData = [];
            this.loadIngredients(this.recipeData._id);
            // this.renderCode(this.recipeData);
            this.ingredientsAreLoaded = true;
        });
    }

    loadIngredients(id) {
        const _onSuccess = (res) => {
            this.ingredientsData = res.data.data.ingredients;
            console.log(this.ingredientsData);
            this.renderCode(this.ingredientsData);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = () => {
            this.recipesAreLoaded = true;
        };
        this._InventoryService.getIngredientsForSelect(id)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    renderCode(dataRecipe) {
        setTimeout(() => {
            dataRecipe.forEach((item) => {
                JsBarcode(`#barcodeSelect${item.barcode}`, item.barcode, {
                    lineColor: '#00000',
                    width: 3,
                    height: 50,
                    displayValue: true,
                    margin: 10
                });
            });
        }, 100);
    }


    openAddIngredientForm() {
        $('#editReceiptModal').modal('hide');
        $('#ingredientModal').modal('show');
        this.$rootScope.$broadcast('cameFromEdit', this.recipeData);
    }

    deleteIngredientItem(item) {
        const _onSuccess = (res) => {
            this.$rootScope.$broadcast('getInventories');
            $('#editReceiptModal').modal('hide');
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


    openEditIngredientForm(item) {
        $('#editReceiptModal').modal('hide');
        $('#editIngredientModal').modal('show');
        this.$rootScope.$broadcast('editIngredientModal', item);
    }

}

SelectIngredientFormCtrl.$inject = [
    'InventoryService',
    '$translate',
    '$rootScope'
];

const selectIngredientFormComponent = {
    bindings: {},
    templateUrl:
        'app/supplier/inventories/ingredient-form/select-ingredient-form.html',
    controller: SelectIngredientFormCtrl,
};
export default selectIngredientFormComponent;
