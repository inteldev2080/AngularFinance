import moment from 'moment';

export default class SupplierReportTransactionsCtrl {
    constructor(TransactionsService, CustomerService, SupplierService, $state, $rootScope) {
        this._TransactionsService = TransactionsService;
        this._CustomerService = CustomerService;
        this._SupplierService = SupplierService;
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
            startDate: moment()
                .subtract(1, 'months')
                .format('YYYY-MM-DD'),
            endDate: moment()
                .add(1, 'day')
                .format('YYYY-MM-DD')
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
                this.listTransactions(this.searchCriteria);
            });
        this.listTransactions(this.searchCriteria);
        this.getCustomersLookup();
    }

    listTransactions(searchCriteria) {
        const _onSuccess = (res) => {
            this.transaction = res.data.data;
            this.totalPages = Math.ceil(this.transaction.numberOfTransactions / this.searchCriteria.limit);
        };
        const _onError = (err) => {
            this.error = err.data.data;
        };
        this._TransactionsService.listTransactions(searchCriteria).then(_onSuccess, _onError);
    }

    getCustomersLookup() {
        this.cusSearchCriteria = {
            skip: 0,
            limit: 100,
            customerName: '',
            nameOnly: true
        };
        const _onSuccess = (res) => {
            this.customers = res.data.data.customers;
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._CustomerService.getCustomers(this.cusSearchCriteria)
            .then(_onSuccess, _onError);
    }

    openReportDetails(transactionsDetails) {
        /* $('#payment').modal('show');
        this.transactionsDetails = transactionsDetails;
        this.transactionsDetails.date = new Date(this.transactionsDetails.date);*/
        this.billItem = transactionsDetails;
        $('#view-payment').modal('show');
        this._$rootScope.$broadcast('paymentEventPopupModal', this.billItem);
    }

    onFilterChange(searchCriteria) {
        this.currentPage = 1;
        this.searchCriteria.skip = 0;
        this.listTransactions(searchCriteria);
    }

    setPage(pageNumber) {
        this.currentPage = pageNumber;
        this.searchCriteria.skip = (pageNumber - 1) * this.searchCriteria.limit;
        this.listTransactions(this.searchCriteria);
    }

    exportFile(type) {
        this._SupplierService.exportFile(type, 'transactions', this.searchCriteria);
    }
    selected(item) {
        if (item.type === 'debit') {
            const order = { id: item.orderId };
            this._$state.go('app.supplier.report.ordersDetails', order);
        } else {
            this.openReportDetails(item);
        }
    }
}

SupplierReportTransactionsCtrl.$inject = ['TransactionsService', 'CustomerService', 'SupplierService', '$state', '$rootScope'];
