import moment from 'moment';

class editIngredientListingFormCtrl {


    constructor(InventoryService, $translate, $rootScope) {
        this._InventoryService = InventoryService;
        this._$translate = $translate;
        this.$rootScope = $rootScope;
    }

    $onInit() {
        const ctrl = this;
        moment.locale('en');
        this.formData = {};
        this.registerLoading = false;
        this.regexSKU = '^[a-zA-Z0-9\\_\\-]{4,8}$';
        this.regexBar = '^[a-zA-Z0-9\\_\\-]{3,48}$';
        $.Pages.init();
        this.unitItems = [
            'ML', 'L', 'G', 'KG'
        ];

        this.$rootScope.$on('editIngredientListingModal', (evt, data) => {
            this.formData = {};
            this.itemData = data;
            this.formData = this.itemData;
            this.ingredientsAreLoaded = true;
        });
    }

    editIngredient(ingredientForm) {
        if (ingredientForm.$invalid) return;
        this.isFailure = false;
        this.isSuccess = false;
        this.registerLoading = true;
        this.loading = true;
        this._InventoryService
            .updateIngredientSingle(this.formData, true)
            .then(
                (res) => {
                    console.log('success');
                    this.isSuccess = true;
                    this.message = 'supplier.ingredients.create-ingredient.message.success_updated';
                    this.notify(this.message, 'success', 3000);
                    this.$rootScope.$broadcast('getIngredients');
                    $('#editIngredientListingModal').modal('hide');
                    this.resetForm(ingredientForm);
                },
                (err) => {
                    if (err.code === 500) {
                        this.hasError = true;
                        $('#ingredientModal').modal('hide');
                    } else if (err.code === 501) {
                        this.noInternetConnection = true;
                        $('#ingredientModal').modal('hide');
                    }
                    if (err.data) {
                        if (err.data.errorCode === 21) {
                            this.isFailure = true;
                            this.message = 'Name already exists.';
                            this.notify(this.message, 'danger', 7000);
                            $('#ingredientModal').modal('hide');
                        } else {
                            this.message =
                                'supplier.recipes.create-recipe.message.failed_creation';
                            this.isFailure = true;
                            this.notify(this.message, 'danger', 5000);
                            $('#ingredientModal').modal('hide');
                        }
                    }

                    this.isError = true;
                    this.errors = err.data.data;
                }
            )
            .catch(() => {
                this.isFailure = true;
                this.message = 'supplier.recipes.create-recipe.message.failed_creation';
                this.notify(this.message, 'danger', 5000);
            })
            .finally(() => {
                // this.resetForm(ingredientForm);
                this.loading = false;
                this.registerLoading = false;
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
                    type,
                })
                .show();
        });
    }

    resetForm(ingredientForm) {
        this.formData = {};
        if (ingredientForm) {
            ingredientForm.$setPristine();
            ingredientForm.$setUntouched();
        }
    }
}

editIngredientListingFormCtrl.$inject = [
    'InventoryService',
    '$translate',
    '$rootScope'
];

const editIngredientListingFormComponent = {
    bindings: {},
    templateUrl:
        'app/supplier/inventories/ingredient-form/ingredient-listing-edit-form.html',
    controller: editIngredientListingFormCtrl,
};
export default editIngredientListingFormComponent;
