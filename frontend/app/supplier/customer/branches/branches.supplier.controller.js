export default class SupplierCustomerListBranchesCtrl {
    constructor($translate, BranchService, SystemService, $stateParams) {
        this._$translate = $translate;
        this.customerUsers = [];
        this.errors = [];
        this.totalPages = 0;
        this.isStaff = false;
        this.staffs = [];
        this.cityList = [];
        this._SystemService = SystemService;
        this._BranchService = BranchService;
        this._$stateParams = $stateParams;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.searchCriteria = {
            skip: 0,
            limit: 5,
            customerId: this._$stateParams.customerId
        };
        this.getBranches(this.searchCriteria);
    }

    getBranches(searchCriteria) {
        const _onSuccess = (res) => {
            this.branches = res.data.data.branches;
            this.totalPages = Math.ceil(res.data.data.count / this.searchCriteria.limit);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = () => {
        };

        this._BranchService.getCustomersBranchesList(searchCriteria)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    setPage(pageNumber) {
        this.currentPage = pageNumber;
        this.searchCriteria.skip = (pageNumber - 1) * this.searchCriteria.limit;
        this.getBranches(this.searchCriteria);
    }

    notify(message, type, timeout) {
        this._$translate(message).then((translation) => {
            $('body')
                .pgNotification({
                    style: 'bar',
                    message: translation,
                    position: 'top',
                    timeout,
                    type
                })
                .show();
        });
    }
}

SupplierCustomerListBranchesCtrl.$inject = ['$translate', 'BranchService', 'SystemService', '$stateParams'];
