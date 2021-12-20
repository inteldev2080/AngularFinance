import moment from 'moment';

class ingredientFormCtrl {


    constructor(InventoryService, $translate, $rootScope, SystemService) {
        this._InventoryService = InventoryService;
        this._SystemService = SystemService;
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

        this.unitItems = [];

        this._SystemService.getSystemUnits().then(
            (res) => {
                res.data.data.forEach((item) => {
                    this.unitItems.push({ name: item.englishName });
                });
            },
            (err) => {
                console.log(err);
            }
        ).catch((e) => {
            console.log(e);
        });

        this.$rootScope.$on('cameFromEdit', (evt, data) => {
            this.recipeData = data;
        });
    }

    createIngredient(ingredientForm) {
        if (ingredientForm.$invalid) return;
        this.isFailure = false;
        this.isSuccess = false;
        this.registerLoading = true;
        this.loading = true;
        if (this.recipeData && this.recipeData._id) {
            this.formData.recipeItemId = this.recipeData._id;
        }
        this._InventoryService
            .createIngredient(this.formData, true)
            .then(
                (res) => {
                    this.isSuccess = true;
                    this.message = 'supplier.ingredients.create-ingredient.message.success_creation';
                    this.notify(this.message, 'success', 3000);
                    if (this.recipeData && this.recipeData._id) {
                        this.$rootScope.$broadcast('getInventories');
                    } else {
                        this.$rootScope.$broadcast('getIngredients');
                    }
                    $('#ingredientModal').modal('hide');
                    this.resetForm(ingredientForm);
                },
                (err) => {
                    console.log(err);
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
                        } else if (err.data.errorCode === 22) {
                            this.isFailure = true;
                            this.message = 'SKU already exists.';
                            this.notify(this.message, 'danger', 7000);
                            $('#ingredientModal').modal('hide');
                        } else if (err.data.errorCode === 23) {
                            this.isFailure = true;
                            this.message = 'barcode already exists.';
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
            .catch((e) => {
                console.log(e);
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

ingredientFormCtrl.$inject = [
    'InventoryService',
    '$translate',
    '$rootScope',
    'SystemService'
];

const supplierIngredientFormComponent = {
    bindings: {},
    templateUrl:
        'app/supplier/inventories/ingredient-form/ingredient-form.component.html',
    controller: ingredientFormCtrl,
};
export default supplierIngredientFormComponent;
