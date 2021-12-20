import moment from 'moment';

export default class SupplierSummaryReportsCtrl {
    constructor($state, $rootScope, customersResolve, BranchService, CustomerService) {
        this.customersResolve = customersResolve;
        this._$state = $state;
        this._$rootScope = $rootScope;
        this._BranchService = BranchService;
        this._CustomerService = CustomerService;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        moment.locale('en');
        this.branches = null;
        this.currentPage = 1;
        this.searchCriteria = {
            skip: 0,
            limit: 15,
            type: 'All',
            customerId: null,
            startDate: moment()
                .subtract(1, 'months')
                .format('YYYY-MM-DD'),
            endDate: moment()
                .add(1, 'day')
                .format('YYYY-MM-DD'),
            branchId: null,
            summaryReport: true,
            detailedReport: false,
            userId: null
        };
        this.date = moment().format('dddd, MMM DD');
        $('#daterangepicker')
            .daterangepicker({
                timePicker: true,
                timePickerIncrement: 30,
                format: 'YYYY-MM-DD',
                startDate: moment()
                    .subtract(1, 'months')
                    .format('YYYY-MM-DD'),
                endDate: moment()
                    .add(1, 'day')
                    .format('YYYY-MM-DD')
            }, (start, end, label) => {
            });
        $('#daterangepicker')
            .on('apply.daterangepicker', (ev, picker) => {
                this.searchCriteria.startDate = picker.startDate.format('YYYY-MM-DD');
                this.searchCriteria.endDate = picker.endDate.format('YYYY-MM-DD');
                // this.listTransactions(this.searchCriteria);
            });
        this.customers = this.customersResolve.data.data.customers;
    }

    selectCustomer() {
        this.branches = null;
        this.searchCriteria.branchId;
        if (this.searchCriteria.userId != 'All') {
            const _onSuccess = (res) => {
                this.branches = res.data.data.branches;
            };
            const _onError = (err) => {
                this.errors = err.data.data;
            };
            const _onFinal = () => {
            };

            this._BranchService.getCustomersBranchesList(this.searchCriteria)
                .then(_onSuccess, _onError)
                .finally(_onFinal);
        }

    }

    exportFile(type) {
        if (this.searchCriteria.customerId == null || this.searchCriteria.customerId === 'All') {
            this.searchCriteria.userId = null;
            this.searchCriteria.customerId = null;
        } else {
            this.searchCriteria.userId = this.customers.find((cus) => {
                if (cus._id.toString() === this.searchCriteria.customerId.toString()) {
                    return cus.userId;
                }
            });
            this.searchCriteria.userId = this.searchCriteria.userId.userId;
        }

        this._CustomerService.exportFile(type, 'transactions', this.searchCriteria);
    }

}

SupplierSummaryReportsCtrl.$inject = ['$state', '$rootScope', 'customersResolve', 'BranchService', 'CustomerService'];
