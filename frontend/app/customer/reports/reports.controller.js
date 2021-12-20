import moment from 'moment';

export default class CustomerReportsCtrl {
    constructor(CustomerService, $state, $rootScope, suppliersResolve, branchesResolve) {
        this._CustomerService = CustomerService;
        this.suppliersResolve = suppliersResolve;
        this.branchesResolve = branchesResolve;
        this._$state = $state;
        this._$rootScope = $rootScope;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        moment.locale('en');

        this.currentPage = 1;
        this.searchCriteria = {
            skip: 0,
            limit: 15,
            type: 'All',
            supplierId: null,
            startDate: moment()
                .subtract(1, 'months')
                .format('YYYY-MM-DD'),
            endDate: moment()
                .add(1, 'day')
                .format('YYYY-MM-DD'),
            branchId: null
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
        this.customers = this.suppliersResolve.data.data.suppliers;
        this.branches = this.branchesResolve.data.data.branches;
    }


    exportFile(type) {
        this._CustomerService.exportFile(type, 'transactions', this.searchCriteria);
    }

}

CustomerReportsCtrl.$inject = ['CustomerService', '$state', '$rootScope', 'suppliersResolve', 'branchesResolve'];
