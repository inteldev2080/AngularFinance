import moment from 'moment';

export default class AdminReportTransactionsCtrl {
    constructor(TransactionsService, SupplierService, AdminService, $state) {
        this._TransactionsService = TransactionsService;
        this._SupplierService = SupplierService;
        this._AdminService = AdminService;
        this._$state = $state;
    }
    $onInit() {
        moment.locale('en');
        $.Pages.init();
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
        this.getSuppliersLookup();
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

    getSuppliersLookup() {
        this.supSearchCriteria = {
            skip: 0,
            limit: 50,
            supplierName: ''
        };
        const _onSuccess = (res) => {
            this.suppliers = res.data.data.suppliers;
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._SupplierService.getSuppliers(this.supSearchCriteria)
            .then(_onSuccess, _onError);
    }
    openReportDetails(transactionsDetails) {
/*        $('#payment').modal('show');
        this.transactionsDetails = transactionsDetails;
        this.transactionsDetails.date = new Date(this.transactionsDetails.date);*/
        this.billItem = transactionsDetails;
        $('#view-payment').modal('show');
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
        this._AdminService.exportFile(type, 'transactions', this.searchCriteria);
    }

    selected(item) {
        if (item.type === 'debit') {
                const order = { id: item.orderId };
                this._$state.go('app.admin.report.ordersDetails', order);
        } else {
            this.openReportDetails(item);
        }
    }
}

AdminReportTransactionsCtrl.$inject = ['TransactionsService', 'SupplierService', 'AdminService', '$state'];
