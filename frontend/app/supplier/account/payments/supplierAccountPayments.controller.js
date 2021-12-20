import moment from 'moment';

export default class SupplierAccountPaymentsCtrl {
    constructor(SupplierService, TransactionsService, $scope, $translate, $rootScope) {
        this._SupplierService = SupplierService;
        this._TransactionsService = TransactionsService;
        this._$scope = $scope;
        this._$rootScope = $rootScope;
        this.$translate = $translate;
    }

    $onInit() {
        moment.locale('en');
        $.Pages.init();
        this.query2 = {
            skip: 0,
            limit: 10,
            isAdminFees: true
        };
        this.billingHistoryQuery = {
            isAdminFees: true,
            skip: 0,
            limit: 10,
            currentPage: 1,
            totalPages: 1
        };
        this.supplierPaymentClaimsQuery = {
            isAdminFees: true,
            status: ['pending', 'rejected'],
            skip: 0,
            limit: 10,
            currentPage: 1,
            totalPages: 1,
        };

        this.getBillingHistory(this.billingHistoryQuery);
        this.getSupplierPaymentClaims(this.supplierPaymentClaimsQuery);
    }

    getBillingHistory(query) {
        const _onSuccess = (res) => {
            if (res.data) {
                this.billingHistory = res.data.data.billingHistory.transactions;
                this.balanceDetails = res.data.data.balanceDetails;
                this.billingHistoryQuery.totalPages = Math.ceil(
                    res.data.data.billingHistory.count
                    / this.billingHistoryQuery.limit);
            }
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = (err) => {
            this.supplierIsLoaded = true;
            this.billingHistoryIsLoaded = true;
        };
        this._SupplierService.getBillingHistory(query).then(_onSuccess, _onError).finally(_onFinal);
    }

    setBillingHistoryPage(pageNumber) {
        this.billingHistoryQuery.currentPage = pageNumber;
        this.billingHistoryQuery.skip = (pageNumber - 1) * this.billingHistoryQuery.limit;
        this.getBillingHistory(this.billingHistoryQuery);
    }

    getSupplierPaymentClaims(query) {
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.paymentsClaims = res.data.data.payments;
                this.supplierPaymentClaimsQuery.totalPages = Math.ceil(
                    res.data.data.count
                    / this.supplierPaymentClaimsQuery.limit);
            }
        };
        const _onError = (err) => {
            this.errors = err.data;
        };
        const _onFinal = (err) => {
            this.paymentsClaimsIsLoaded = true;
        };
        this._SupplierService.getSupplierPaymentClaims(query)
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    setPaymentClaimsPage(pageNumber) {
        this.supplierPaymentClaimsQuery.currentPage = pageNumber;
        this.supplierPaymentClaimsQuery.skip = (pageNumber - 1) *
            this.supplierPaymentClaimsQuery.limit;
        this.getSupplierPaymentClaims(this.supplierPaymentClaimsQuery);
    }


    openShowDetails(paymentId, payment) {
        this.disableRecordPaymentForm = true;
        this.paymentItem = payment;
        this._$rootScope.$broadcast('onPaymentChanged', payment, this.disableRecordPaymentForm);
        $('#payment').modal('show');
    }
    openRecordPaymentPopup() {
        this.disableRecordPaymentForm = false;
        this.paymentItem = null;
        $('#payment').modal('show');
    }
    openBillingShowDetails(paymentId, billItem) {
        this.billItem = billItem;
        $('#view-payment').modal('show');
    }

    showTransactions() {
        $('#transactions').modal('show');
    }

    addPayment(payment) {
        $('#payment').modal('hide');
        this.addPaymendFinal = false;
        const _onSuccess = (res) => {
            this.notify('supplier.account.payment.payment_added', 'success', 3000);
            this.getSupplierPaymentClaims(this.supplierPaymentClaimsQuery);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
            this.notify('supplier.account.payment.payment_failed', 'danger', 5000);
        };
        const _onFinal = () => {
            this.addPaymendFinal = true;
        };
        return this._TransactionsService.declarePayment(payment)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
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

    getInvoiceSum(transactions) {
        let sum = 0;
        angular.forEach(transactions, (transaction) => {
            sum += parseFloat(transaction.amount);
        });
        return sum;
    }
}
SupplierAccountPaymentsCtrl.$inject = ['SupplierService', 'TransactionsService', '$scope', '$translate', '$rootScope'];
