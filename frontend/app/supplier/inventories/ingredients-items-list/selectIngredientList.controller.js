import SupplierRecipesListCtrl from "../recipes-items-list/recipesList.controller";

export default class SupplierSelectIngredientsListCtrl {
    constructor($rootScope, $translate, InventoryService, $state) {
        this._InventoryService = InventoryService;
        this.$rootScope = $rootScope;
        this._$translate = $translate;
        this._$state = $state;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        const ctrl = this;

        this.checkedData = [];

        this.searchCriteria = {
            skip: 0,
            limit: 10,
            id: '',
        };
        this.currentPage = 1;

        this.limitRegex = '^[1-9]+[0-9]*$';

        this.recipeData = this._$state.params.obj;
        if (!this.recipeData) {
            this._$state.go('app.supplier.inventories.recipes');
        } else {
            this.ingredientsData = [];
            this.searchCriteria.id = this.recipeData._id;
            this.loadIngredients(this.searchCriteria);
            this.ingredientsAreLoaded = true;
        }
    }

    loadIngredients(data) {
        const _onSuccess = (res) => {
            this.ingredientsData = res.data.data.ingredients;
            this.renderCode(this.ingredientsData);
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
        this._InventoryService.getIngredientsForSelect(data)
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

    saveSelections() {
        const _onSuccess = (res) => {
            this._$state.go('app.supplier.inventories.recipes');
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = () => {
            this.recipesAreLoaded = true;
        };
        this._InventoryService.saveIngredientsForSelect({ _id: this.recipeData._id, ingredients: this.checkedData })
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    checked(item, flag) {
        if (this.recipeData.type === 2 && this.checkedData.length === 1 && flag) {

        } else {
            item.selected = flag;
            if (flag) {
                item.quantityAdd = 1;
                this.checkedData.push(item);
            } else {
                const newCheckedData = [];
                this.checkedData.forEach((ite) => {
                    if (ite._id.toString() != item._id.toString()) {
                        newCheckedData.push(ite);
                    }
                });
                this.checkedData = newCheckedData;
            }
        }
    }

    notify(message, type, timeout) {
        this._$translate(message).then((translation) => {
            $('body')
                .pgNotification({
                    style: 'bar',
                    message: translation,
                    position: 'top',
                    timeout,
                    type,
                })
                .show();
        });
    }
}

SupplierSelectIngredientsListCtrl.$inject = ['$rootScope', '$translate', 'InventoryService', '$state'];
