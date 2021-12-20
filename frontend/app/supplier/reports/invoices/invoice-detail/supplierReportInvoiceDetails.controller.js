export default class SupplierReportInvoiceDetailsCtrl {
    constructor(TransactionsService, $stateParams, SupplierService) {
        this.$stateParams = $stateParams;
        this._SupplierService = SupplierService;
        this._TransactionsService = TransactionsService;
    }
    $onInit() {
        $.Pages.init();
        this.searchCriteria = { id: this.$stateParams.id };
        this.getInvoice(this.searchCriteria);
    }

    getInvoice(searchCriteria) {
        const _onSuccess = (res) => {
            this.invoice = res.data.data;
        };

        const _onError = (err) => {
            this.errors = err.data.data;
        };

        this._TransactionsService.getInvoice(searchCriteria).then(_onSuccess, _onError);
    }
    exportFile() {
        this._TransactionsService.exportInvoiceDetailsFile(this.searchCriteria);
    }
    printFile(query) {
        this._SupplierService.printFile(this.$stateParams.id, query);
    }
}

SupplierReportInvoiceDetailsCtrl.$inject = ['TransactionsService', '$stateParams', 'SupplierService'];
