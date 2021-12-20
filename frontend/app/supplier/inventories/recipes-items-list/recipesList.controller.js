export default class SupplierRecipesListCtrl {
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
        this.getInventories(this.searchCriteria);
        this.$rootScope.$on('getInventories', () => {
            ctrl.getInventories(ctrl.searchCriteria);
        });
    }

    getInventories(searchCriteria) {
        const _onSuccess = (res) => {
            this.recipesItems = res.data.data.recipes;
            const itemData = this.recipesItems;
            setTimeout(() => {
                itemData.forEach((item) => {
                    JsBarcode(`#barcode${item.barcode}`, item.barcode, {
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
            .getInventories(searchCriteria)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    openReceiptFormPoup() {
        this.formData = {};
        this.mode = 'new';
        $('#supplierReceiptModal').modal('show');
        $.Pages.init();
    }

    setPage(page) {
        this.searchCriteria.skip = Number(page - 1);
        this.searchCriteria.limit = 10;
        this.getInventories(this.searchCriteria);
    }

    openEditRecipeFormPoup(item) {
        this.formData = {};
        this.mode = 'new';
        $('#editReceiptModal').modal('show');
        this.$rootScope.$broadcast('loadRecipeItem', item);
        $.Pages.init();
    }

    deleteRecipeItem(item) {
        const _onSuccess = (res) => {
            this.getInventories(this.searchCriteria);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = () => {
            this.recipesAreLoaded = true;
        };
        this._InventoryService.deleteInventoryItem(item._id)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }
}

SupplierRecipesListCtrl.$inject = ['$rootScope', '$translate', 'InventoryService'];
