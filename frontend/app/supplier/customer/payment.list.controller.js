import moment from "moment/moment";

export default class SupplierCustomerPaymentListCtrl {
    constructor(PaymentService, TransactionsService, $scope, $rootScope, $translate) {
        this._PaymentService = PaymentService;
        this._TransactionsService = TransactionsService;
        this._$scope = $scope;
        this.$rootScope = $rootScope;
        this.$translate = $translate;
    }
    $onInit() {
        this.status = ['Pending', 'Approved', 'Rejected'];
        $.Pages.init();
        this.currentPage = 1;
        this.searchCriteria = { skip: 0, limit: 10, status: ['Pending'], customerName: '' };
        this.getPayments(this.searchCriteria);

        const ctrl = this;
        this._$scope.$watch(this.searchCriteria, () => {
            ctrl.getPayments(ctrl.searchCriteria);
        });
        this._$scope.$on('getPayments', (event, data) => {
            ctrl.getPayments(ctrl.searchCriteria);
        });
        this._$scope.$on('acceptPayment', (event, paymentId) => {
            ctrl.getPayments(ctrl.searchCriteria);
        });
        this._$scope.$on('rejectPayment', (event, paymentId) => {
            ctrl.getPayments(ctrl.searchCriteria);
        });
    }
    getPayments(searchCriteria) {
        this.paymentsIsLoaded = false;
        const _onSuccess = (res) => {
            this.payments = res.data.data.payments;
            this.totalPages = Math.ceil(res.data.data.count / searchCriteria.limit);
        };

        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = () => {
            this.paymentsIsLoaded = true;
        };
        return this._PaymentService.getPayments(searchCriteria)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }
    openRecordPayment() {
        $('#payment').modal('show');
    }
    getPayment(id) {
        this.$rootScope.$broadcast('getPayment', id);
    }
    addPayment(payment) {
        $('#payment').modal('hide');
        this.addPaymendFinal = false;
        const _onSuccess = (res) => {
            this.notify('supplier.customers.payments.message.add.success', 'success', 1000);
            this.getPayments(this.searchCriteria);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
            this.notify('supplier.customers.payments.message.add.failure', 'danger', 1000);
        };
        const _onFinal = () => {
            this.addPaymendFinal = true;
        };
        return this._TransactionsService.addPayment(payment)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }
    getPage(pageNumber) {
        this.currentPage = pageNumber;
        this.searchCriteria.skip = (pageNumber - 1) * this.searchCriteria.limit;
        this.getPayments(this.searchCriteria);
    }
    onChange() {
        this.getPayments(this.searchCriteria);
    }
    check(value, checked) {
        const idx = this.searchCriteria.status.indexOf(value);
        if (idx >= 0 && !checked) {
            this.searchCriteria.status.splice(idx, 1);
        }
        if (idx < 0 && checked) {
            this.searchCriteria.status.push(value);
        }
        this.getPage(1);
    }
    notify(message, type, timeout) {
        this.$translate(message).then((translation) => {
            $('body').pgNotification({
                style: 'bar',
                message: translation,
                position: 'top',
                timeout,
                type
            }).show();
        });
    }
}

SupplierCustomerPaymentListCtrl.$inject = ['PaymentService', 'TransactionsService', '$scope', '$rootScope', '$translate'];
