export default class SuppliersCtrl {
    constructor(SupplierService, $stateParams, TransactionsService, $rootScope, $state, $translate, CustomerService) {
        this._$stateParams = $stateParams;
        this._SupplierService = SupplierService;
        this._CustomerService = CustomerService;
        this._TransactionsService = TransactionsService;
        this._$rootScope = $rootScope;
        this._$state = $state;
        this.$translate = $translate;
    }
    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.paymentType = 'CS';
        this.supplierId = this._$stateParams.supplierId;
        if (!this.supplierId) {
            if (this._$rootScope.supplierId) {
                const supplier = { supplierId: this._$rootScope.supplierId };
                if (this._$state.is('app.customer.payments.list.suppliers')) {
                    this._$state.go('app.customer.payments.list.suppliers', supplier);
                }
            } else {

            }
        }

        this.billingHistoryQuery = {
            supplierId: this._$stateParams.supplierId,
            skip: 0,
            limit: 10,
            currentPage: 1,
            totalPages: 1
        };
        this.supplierPaymentClaimsQuery = {
            supplierId: this._$stateParams.supplierId,
            status: ['pending', 'rejected'],
            skip: 0,
            limit: 10,
            currentPage: 1,
            totalPages: 1
        };

        this.customerSpecialPricesQuery = {
            supplierId: this._$stateParams.supplierId,
            skip: 0,
            limit: 10,
            currentPage: 1,
            totalPages: 1,
        };

        this.getBillingHistory(this.billingHistoryQuery);
        this.getSupplierPaymentClaims(this.supplierPaymentClaimsQuery);
        if (this._$rootScope.supplier.status === 'Active') {
            this.getCustomerSpecialPrices(this.customerSpecialPricesQuery);
        }

        this._$rootScope.$on('checkoutCartUpdated', (event, data) => {
            this.getBillingHistory(this.billingHistoryQuery);
        });
    }
    getBillingHistory(query) {
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.billingHistroy = res.data.data.billingHistory.transactions;
                this.balanceDetails = res.data.data.balanceDetails;
                this.billingHistoryQuery.totalPages = Math.ceil(
                    res.data.data.billingHistory.count
                    / this.billingHistoryQuery.limit);
            }
        };
        const _onError = (err) => {
            this.errors = err.data;
        };
        const _onFinal = (err) => {
            this.billingHistroyIsLoaded = true;
            this.supplierIsLoaded = true;
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
    getCustomerSpecialPrices(query) {
        const _onSuccess = (res) => {
            if (res.data) {
                this.specialPrices = res.data.data.products;
                this.customerSpecialPricesQuery.totalPages = Math.ceil(
                    res.data.data.count
                    / this.customerSpecialPricesQuery.limit);
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
            this.specialPricesIsLoaded = true;
        };
        this._CustomerService.getCustomerSupplierSpecialPrices(query.supplierId, query)
            .then(_onSuccess, _onError).finally(_onFinal);
    }
    export(type) {
        this._CustomerService.getCustomerSupplierSpecialPrices(this.customerSpecialPricesQuery.supplierId, this.customerSpecialPricesQuery, type);
    }
    setSpecialPricesPage(pageNumber) {
        this.customerSpecialPricesQuery.currentPage = pageNumber;
        this.customerSpecialPricesQuery.skip = (pageNumber - 1) *
            this.customerSpecialPricesQuery.limit;
        this.getCustomerSpecialPrices(this.customerSpecialPricesQuery);
    }
    getInvoiceSum(transactions) {
        let sum = 0;
        angular.forEach(transactions, (transaction) => {
            sum += parseFloat(transaction.amount);
        });
        return sum;
    }
    openBillingShowDetails(paymentId, billItem) {
        this.billItem = billItem;
        $('#view-payment').modal('show');
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
    addPayment(payment) {
        payment.supplierId = this._$stateParams.supplierId;
        $('#payment').modal('hide');
        this.addPaymendFinal = false;
        const _onSuccess = (res) => {
            this.notify('customer.payments.message.add.success', 'success', 1000);
            this.getSupplierPaymentClaims(this.supplierPaymentClaimsQuery);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
            this.notify('customer.payments.message.add.failure', 'danger', 1000);
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


}
SuppliersCtrl.$inject = ['SupplierService', '$stateParams', 'TransactionsService', '$rootScope', '$state', '$translate', 'CustomerService'];
