class EditReceiptFormCtrl {
    constructor(InventoryService, $translate, $rootScope, $state, $timeout) {
        this._InventoryService = InventoryService;
        this._$translate = $translate;
        this.$rootScope = $rootScope;
        this._$state = $state;
        this.$timeout = $timeout;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        const ctrl = this;

        this.unitItems = [
            {name: 'ML'}, {name: 'L'}, {name: 'G'}, {name: 'KG'}
        ];

        this.$rootScope.$on('loadRecipeItem', (evt, data) => {
            this.recipeData = data;
            this.renderCode(this.recipeData);
            this.ingredientsAreLoaded = true;
        });
    }

    renderCode(dataRecipe) {
        setTimeout(() => {
            dataRecipe.addIngredients.forEach((item) => {

                JsBarcode(`#barcodes${item.ingredientId.barcode}`, item.ingredientId.barcode, {
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

    openSelectIngredientForm() {
        $('#editReceiptModal').modal('hide');

        const stateGo = this._$state,
            root = this.$rootScope,
            recipeData = this.recipeData;

        this.$timeout(() => {
            stateGo.go('app.admin.inventories.select', {obj: recipeData});
        }, 500);
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
        this._InventoryService.deleteIngredient(item.ingredientId._id, item._id)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }


    openEditIngredientForm(item) {
        $('#editReceiptModal').modal('hide');
        $('#editIngredientModal').modal('show');
        this.$rootScope.$broadcast('editIngredientModal', item);
    }

}

EditReceiptFormCtrl.$inject = [
    'InventoryService',
    '$translate',
    '$rootScope',
    '$state',
    '$timeout'
];

const editReceiptFormComponent = {
    bindings: {},
    templateUrl:
        'app/admin/inventories/receipt-form/edit-receipt-form.component.html',
    controller: EditReceiptFormCtrl,
};
export default editReceiptFormComponent;
