export default class AdminSupplierPaymentDetailCtrl {
    constructor(PaymentService, $stateParams) {
        this._PaymentService = PaymentService;
        this.$stateParams = $stateParams;
    }

    $onInit() {
        $.Pages.init();
        this.currentPage = 1;
        this.searchCriteria = { skip: 0, limit: 2 };
        this.paymentDetails(this.$stateParams.id);
    }

    paymentDetails(id) {
        const _onSuccess = (res) => {
            this.details = res.data;
            this.totalPages = Math.ceil(res.data.count / this.searchCriteria.limit);
        };

        const _onError = (err) => {
            this.errors = err.data.data;
        };

        return this._PaymentService.paymentDetails(id, this.searchCriteria).then(_onSuccess, _onError);
    }

    setPage(pageNumber) {
        this.currentPage = pageNumber;
        this.searchCriteria.skip = (pageNumber - 1) * this.searchCriteria.limit;
        this.paymentDetails(this.$stateParams.id);
    }
}

AdminSupplierPaymentDetailCtrl.$inject = ['PaymentService', '$stateParams'];
