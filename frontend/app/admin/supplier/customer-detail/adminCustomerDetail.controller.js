export default class adminCustomerDetailCtrl {
    constructor(CustomerService, TransactionsService, $stateParams, $translate, $rootScope, PermPermissionStore) {
        this._CustomerService = CustomerService;
        this._TransactionsService = TransactionsService;
        this.$stateParams = $stateParams;
        this._$rootScope = $rootScope;
        this.$translate = $translate;
        this.PermPermissionStore = PermPermissionStore;
    }
    $onInit() {
        $.Pages.init(); // eslint-disable-line
        const permissions = this.PermPermissionStore.getStore() || {};
        this.periods = [
            { interval: 'Month', frequency: 1 },
            { interval: 'Month', frequency: 2 },
            { interval: 'Month', frequency: 3 },
            { interval: 'Month', frequency: 4 },
            { interval: 'Month', frequency: 5 },
            { interval: 'Month', frequency: 6 },
            { interval: 'Month', frequency: 7 },
            { interval: 'Month', frequency: 8 },
            { interval: 'Month', frequency: 9 },
            { interval: 'Month', frequency: 10 },
            { interval: 'Month', frequency: 11 },
            { interval: 'Month', frequency: 12 }
        ];

        this.selectPeriod = { interval: 'Month', frequency: 1 };

        this.getCustomer(this.$stateParams.customerId);
        // this.customerId = this.$stateParams.customerId;
        // this.billingHistoryQuery = {
        //     customerId: this.$stateParams.customerId,
        //     skip: 0,
        //     limit: 10,
        //     currentPage: 1,
        //     totalPages: 1
        // };
        // this.customerPaymentClaimsQuery = {
        //     customerId: this.$stateParams.customerId,
        //     status: ['pending', 'rejected'],
        //     skip: 0,
        //     limit: 10,
        //     currentPage: 1,
        //     totalPages: 1,
        //     isAdminFees: true
        // };
        // this.getBillingHistory(this.billingHistoryQuery);
        // if (permissions.managePayments) {
        //     this.getCustomerPaymentClaims(this.customerPaymentClaimsQuery);
        // }
        // this._$rootScope.$on('acceptPayment', (evt, data) => {
        //     this.getBillingHistory(this.billingHistoryQuery);
        //     this.getCustomerPaymentClaims(this.customerPaymentClaimsQuery);
        // });
        // this._$rootScope.$on('rejectPayment', (evt, data) => {
        //     this.getBillingHistory(this.billingHistoryQuery);
        //     this.getCustomerPaymentClaims(this.customerPaymentClaimsQuery);
        // });
    }
    getCustomer(id) {
        const _onSuccess = (res) => {
            this.customer = res.data.data;
            this.representativeName = this.customer.representativeName;
            this.userName = `${this.customer.user.firstName} ${this.customer.user.lastName}`;
            this.phoneNumberUpdated = this.customer.user.mobileNumber;
            this.emailUpdated = this.customer.user.email;
            switch (this.customer.status) {
                case 'Suspended':
                    this.statusOptions = ['Approve', 'Delete'];
                    break;
                case 'Active':
                    this.statusOptions = ['Block', 'Delete'];
                    break;
                case 'Blocked':
                    this.statusOptions = ['Unblock', 'Delete'];
                    break;
                default: this.statusOptions = ['Approve'];
            }
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = (err) => {
            this.customerIsLoaded = true;
        };
        this._CustomerService.getCustomer(id).then(_onSuccess, _onError).finally(_onFinal);
    }
    getBillingHistory(query) {
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.billingHistroy = res.data.data.billingHistory.transactions;
                this.balanceDetails = res.data.data.balanceDetails;
                this.selectPeriod.frequency = this.balanceDetails.payment.frequency;
                this.selectPeriod.interval = this.balanceDetails.payment.interval;
                this.billingHistoryQuery.totalPages = Math.ceil(
                    res.data.data.billingHistory.count
                    / this.billingHistoryQuery.limit);
                this._$rootScope.$apply();
            }
        };
        const _onError = (err) => {
            this.errors = err.data;
        };
        const _onFinal = (err) => {
            this.billingHistoryIsLoaded = true;
        };
        this._CustomerService.getBillingHistory(query).then(_onSuccess, _onError).finally(_onFinal);
    }
    setBillingHistoryPage(pageNumber) {
        this.billingHistoryQuery.currentPage = pageNumber;
        this.billingHistoryQuery.skip = (pageNumber - 1) * this.billingHistoryQuery.limit;
        this.getBillingHistory(this.billingHistoryQuery);
    }
    getCustomerPaymentClaims(query) {
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.paymentsClaims = res.data.data.payments;
                this.customerPaymentClaimsQuery.totalPages = Math.ceil(
                    res.data.data.count
                    / this.customerPaymentClaimsQuery.limit);
            }
        };
        const _onError = (err) => {
            this.errors = err.data;
        };
        const _onFinal = (err) => {
            this.paymentsClaimsIsLoaded = true;
        };
        this._CustomerService.getCustomerPaymentClaims(query)
            .then(_onSuccess, _onError).finally(_onFinal);
    }
    setPaymentClaimsPage(pageNumber) {
        this.customerPaymentClaimsQuery.currentPage = pageNumber;
        this.customerPaymentClaimsQuery.skip = (pageNumber - 1) *
            this.customerPaymentClaimsQuery.limit;
        this.getCustomerPaymentClaims(this.customerPaymentClaimsQuery);
    }
    getInvoiceSum(transactions) {
        let sum = 0;
        angular.forEach(transactions, (transaction) => {
            sum += parseFloat(transaction.amount);
        });
        sum += (sum * transactions[0].PVAT);
        return sum;
    }
    openRecordPayment() {
        this.disableRecordPaymentForm = false;
        this.paymentItem = null;
        $('#payment').modal('show');
    }
    openShowDetails(paymentId, payment) {
        this.disableRecordPaymentForm = true;
        this.paymentItem = payment;
        this._$rootScope.$broadcast('onPaymentChanged', payment, this.disableRecordPaymentForm);
        $('#payment').modal('show');
    }
    openBillingShowDetails(paymentId, billItem) {
        this.billItem = billItem;
        $('#view-payment').modal('show');
    }

    blockCustomer(id) {
        const _onSuccess = (res) => {
      // this.customer = res.data.data;
            this.customer.status = 'Blocked';
            this.statusOptions = ['Unblock'];
            this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._CustomerService.blockCustomer(id).then(_onSuccess, _onError);
    }
    unblockCustomer(id) {
        const _onSuccess = (res) => {
      // this.customer = res.data.data;
            this.customer.status = 'Active';
            this.statusOptions = ['Block'];
            this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._CustomerService.unblockCustomer(id).then(_onSuccess, _onError);
    }
    approveCustomer(id) {
        const _onSuccess = (res) => {
      // this.customer = res.data.data;
            this.customer.status = 'Active';
            this.statusOptions = ['Block'];
            this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._CustomerService.approveCustomer(id).then(_onSuccess, _onError);
    }
    deleteCustomer(id) {
        const _onSuccess = (res) => {
      // this.customer = res.data.data;
            this.customer.status = 'Deleted';
            this.statusOptions = ['Approve'];
            this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._CustomerService.deleteCustomer(id).then(_onSuccess, _onError);
    }
    changeCustomerInfo() {
        this.customer.representativeName = this.representativeName;
        if (this.userName) {
            this.customer.user.firstName = this.userName.split(' ')[0] || '';
            this.customer.user.lastName = this.userName.split(' ')[1] ? this.userName.split(' ')[1] : '';
        }

        if (this.phoneNumberUpdated) {
            this.customer.user.mobileNumber = this.phoneNumberUpdated;
        }

        if (this.emailUpdated) {
            this.customer.user.email = this.emailUpdated;
        }
        const _onSuccess = (res) => {
      // this.customer = res.data.data;
            this.notify('admin.customers.customer.customer_updated', 'success', 3000);

            this.getCustomer(this.customerId);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
            // this.getCustomer(this.customerId);
            if (err.data.errorCode === 29) {
                this.notify('admin.customers.customer.customer_email_exists', 'danger', 8000);
            } else if (err.data.errorCode === 30) {
                this.notify('admin.customers.customer.customer_mobilePhone_exists', 'danger', 8000);
            }
        };
        this._CustomerService.adminUpdateCustomer(this.customer).then(_onSuccess, _onError);
    }
    changeCustomerStatus(customerId, toStatus) {
        if (toStatus === 'Approve') {
            this.approveCustomer(customerId);
        } else if (toStatus === 'Block') {
            this.blockCustomer(customerId);
        } else if (toStatus === 'Unblock') {
            this.unblockCustomer(customerId);
        } else if (toStatus === 'Delete') {
            this.deleteCustomer(customerId);
        }
    }

    addPayment(payment) {
        payment.customerId = this.$stateParams.customerId;
        $('#payment').modal('hide');
        this.addPaymendFinal = false;
        const _onSuccess = (res) => {
            this.notify('admin.customers.payment.message.add.success', 'success', 1000);
            this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
            this.notify('admin.customers.payment.message.add.failure', 'danger', 1000);
        };
        const _onFinal = () => {
            this.addPaymendFinal = true;
        };
        return this._TransactionsService.addPayment(payment)
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
    updateBalanceDetails() {
        this.updatePacket = {
            status: this.customer.status,
            creditLimit: this.balanceDetails.creditLimit,
            exceedCreditLimit: this.balanceDetails.exceedCreditLimit,
            exceedPaymentDate: this.balanceDetails.exceedPaymentDate,
            paymentFrequency: this.selectPeriod.frequency,
            paymentInterval: this.selectPeriod.interval
        };
        const _onSuccess = (res) => {
            this.notify('admin.customers.payment.updateInfo', 'success', 1000);
            this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        this._CustomerService.updateCustomerRelation(this.customerId, this.updatePacket)
            .then(_onSuccess, _onError);
    }

    changeStatus(status) {
        this.customer.status = status;
        this.updateBalanceDetails();
    }
    customOp(item) {
        return this.$translate.instant('admin.customers.payment.every')
            + this.$translate.instant(`admin.customers.payment.${item.interval}`, { value: item.frequency });
    }
    openPhoto(url){
        window.open(url, '_blank', 'Download');
    }

}
adminCustomerDetailCtrl.$inject = ['CustomerService', 'TransactionsService', '$stateParams', '$translate', '$rootScope', 'PermPermissionStore'];
