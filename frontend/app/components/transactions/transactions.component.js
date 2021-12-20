import moment from 'moment';

function TransactionsCtrl(TransactionsService, $scope, $translate) {
    const ctrl = this;
    ctrl.$onInit = () => {
        moment.locale('en');
        ctrl.transactionsQuery = {
            isAdminFees: ctrl.isAdminFees,
            customerId: ctrl.customer,
            supplierId: ctrl.supplier,
            skip: 0,
            limit: 20,
            startDate: moment().format('YYYY-MM-01'),
            endDate: moment().format('YYYY-MM-DD'),
            currentPage: 1,
            totalPages: 1,
        };
        ctrl.getTransactions(ctrl.transactionsQuery);
        $scope.$watch('transactionsQuery', (newVal, oldVal) => {
            ctrl.getTransactions(ctrl.transactionsQuery);
        });
    };

    ctrl.getTransactions = (query) => {
        ctrl.transactionsIsLoaded = false;
        const _onSuccess = (res) => {
            if (res.status === 200) {
                ctrl.transactions = res.data.data.transactions;
                ctrl.transactionsQuery.totalPages = Math.ceil(
                    res.data.data.count
                    / ctrl.transactionsQuery.limit);
            }
        };
        const _onError = (err) => {
            this.errors = err.data;
        };
        const _onFinal = (err) => {
            ctrl.transactionsIsLoaded = true;
        };
        TransactionsService.getTransactions(query)
            .then(_onSuccess, _onError).finally(_onFinal);
    };

    ctrl.setTransactionsPage = (pageNumber) => {
        this.transactionsQuery.currentPage = pageNumber;
        this.transactionsQuery.skip = (pageNumber - 1) *
            this.transactionsQuery.limit;
        this.getTransactions(this.transactionsQuery);
    };

    ctrl.exportFile = (type) => {
        TransactionsService.exportFile(type, this.transactionsQuery);
    };

    ctrl.close = () => {
        $('#payment').modal('hide');
    };
}
TransactionsCtrl.$inject = ['TransactionsService', '$scope', '$translate'];

const TransactionsComponent = {
    bindings: {
        isAdminFees: '<',
        supplier: '<',
        customer: '<',
    },
    controller: TransactionsCtrl,
    controllerAs: '$ctrl',
    templateUrl: 'app/components/transactions/transactions.component.html'
};
export default TransactionsComponent;
