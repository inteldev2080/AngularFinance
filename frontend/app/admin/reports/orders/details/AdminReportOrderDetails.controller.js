export default class AdminReportOrderDetailsCtrl {

    constructor(OrderService, $stateParams, SupplierService) {
        this._OrderService = OrderService;
        this.$stateParams = $stateParams;
        this._SupplierService = SupplierService;
    }
    $onInit() {
        $.Pages.init();
        this.currentPage = 1;
        this.searchCriteria = { orderId: this.$stateParams.id, skip: 0, limit: 2 };
        this.getOrder(this.searchCriteria);
    }

    getOrder(searchCriteria) {
        const _onSuccess = (res) => {
            this.order = res.data.data;
            this.totalPages = Math.ceil(res.data.data.count / this.searchCriteria.limit);
        };

        const _onError = (err) => {
            this.errors = err.data.data;
        };

        this._OrderService.getOrder(searchCriteria).then(_onSuccess, _onError);
    }

    setPage(pageNumber) {
        this.currentPage = pageNumber;
        this.searchCriteria.skip = (pageNumber - 1) * this.searchCriteria.limit;
        this.getOrder(this.searchCriteria);
    }

    printPdf(query) {
        this._SupplierService.printFile(this.$stateParams.id, query);
    }
}

AdminReportOrderDetailsCtrl.$inject = ['OrderService', '$stateParams', 'SupplierService'];
