import moment from 'moment';

class SupplierReceiptFormCtrl {
    constructor(RecipeService, InventoryService, $translate, $rootScope, Upload, AppConstants) {
        this._RecipeService = RecipeService;
        this._InventoryService = InventoryService;
        this._$translate = $translate;
        this.$rootScope = $rootScope;
        this.Upload = Upload;
        this.UPLOAD_URL = AppConstants.UPLOAD_URL;
    }

    $onInit() {
        const ctrl = this;
        this.regexSKU = '^[a-zA-Z0-9\\_\\-]{4,8}$';
        this.regexBar = '^[a-zA-Z0-9\\_\\-]{3,48}$';
        this.skuArray = [];
        moment.locale('en');
        this.formData = {};
        this.registerLoading = false;
        this.loadingProductSKU();
        $.Pages.init();
    }

    createRecipe(receiptForm) {
        if (receiptForm.$invalid) return;

        this.isFailure = false;
        this.isSuccess = false;
        this.registerLoading = true;
        this.loading = true;
        this._RecipeService
            .createRecipe(this.formData, true)
            .then(
                (res) => {
                    this.isSuccess = true;
                    this.message = 'supplier.recipes.create-recipe.message.success_creation';
                    this.notify(this.message, 'success', 3000);
                    this.$rootScope.$broadcast('getInventories');
                    $('#supplierReceiptModal').modal('hide');
                    this.resetForm(receiptForm);
                },
                (err) => {
                    if (err.code === 500) {
                        this.hasError = true;
                        $('#receiptModal').modal('hide');
                    } else if (err.code === 501) {
                        this.noInternetConnection = true;
                        $('#receiptModal').modal('hide');
                    }
                    if (err.data) {
                        if (err.data.errorCode === 21) {
                            this.isFailure = true;
                            this.message = 'Name already exists.';
                            this.notify(this.message, 'danger', 7000);
                        } else if (err.data.errorCode === 22) {
                            this.isFailure = true;
                            this.message = 'SKU already exists.';
                            this.notify(this.message, 'danger', 7000);
                        } else if (err.data.errorCode === 23) {
                            this.isFailure = true;
                            this.message = 'barcode already exists.';
                            this.notify(this.message, 'danger', 7000);
                        } else {
                            this.message =
                                'supplier.recipes.create-recipe.message.failed_creation';
                            this.isFailure = true;
                            this.notify(this.message, 'danger', 5000);
                            $('#receiptModal').modal('hide');
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
                // this.resetForm(receiptForm);
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

    resetForm(receiptForm) {
        this.formData = {};
        if (receiptForm) {
            receiptForm.$setPristine();
            receiptForm.$setUntouched();
        }
    }

    loadingProductSKU() {
        const _onSuccess = (res) => {
            this.skuArray = res.data.data;
        };

        const _onError = (err) => {
            this.errors = err.data.data;
        };

        const _onFinal = () => {
        };

        this._InventoryService.getAllSupplierSKU()
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }
}

SupplierReceiptFormCtrl.$inject = [
    'RecipeService',
    'InventoryService',
    '$translate',
    '$rootScope',
    'Upload',
    'AppConstants',
];

const supplierReceiptFormComponent = {
    bindings: {},
    templateUrl: 'app/supplier/inventories/receipt-form/receipt-form.component.html',
    controller: SupplierReceiptFormCtrl,
};
export default supplierReceiptFormComponent;

