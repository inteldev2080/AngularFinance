import moment from 'moment';

class editIngredientFormCtrl {


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

        this.$rootScope.$on('editIngredientModal', (evt, data) => {
            this.formData = {};
            this.itemData = data;
            this.formData = this.itemData;
            this.formData.oldQuantity = this.formData.quantity;
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
            .updateIngredient(this.formData, true)
            .then(
                (res) => {
                    this.isSuccess = true;
                    this.message = 'admin.ingredients.create-ingredient.message.success_updated';
                    this.notify(this.message, 'success', 3000);
                    if (this.recipeData && this.recipeData._id) {
                        this.$rootScope.$broadcast('getInventories');
                    } else {
                        this.$rootScope.$broadcast('getIngredients');
                    }
                    $('#editIngredientModal').modal('hide');
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
                                'admin.recipes.create-recipe.message.failed_creation';
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
                this.message = 'admin.recipes.create-recipe.message.failed_creation';
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

editIngredientFormCtrl.$inject = [
    'InventoryService',
    '$translate',
    '$rootScope'
];

const editIngredientFormComponent = {
    bindings: {},
    templateUrl:
        'app/admin/inventories/ingredient-form/edit-ingredient-form.html',
    controller: editIngredientFormCtrl,
};
export default editIngredientFormComponent;
