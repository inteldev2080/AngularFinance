export default class adminSupplierDetailCtrl {
    constructor(SupplierService, TransactionsService, $stateParams, $translate, $rootScope, PermPermissionStore) {
        this._SupplierService = SupplierService;
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

        this.getSupplier(this.$stateParams.supplierId);
        this.supplierId = this.$stateParams.supplierId;
        this.billingHistoryQuery = {
            supplierId: this.$stateParams.supplierId,
            skip: 0,
            limit: 10,
            currentPage: 1,
            totalPages: 1
        };
        this.supplierPaymentClaimsQuery = {
            supplierId: this.$stateParams.supplierId,
            status: ['pending', 'rejected'],
            skip: 0,
            limit: 10,
            currentPage: 1,
            totalPages: 1,
            isAdminFees: true
        };
        this.getBillingHistory(this.billingHistoryQuery);
        if (permissions.managePayments) {
            this.getSupplierPaymentClaims(this.supplierPaymentClaimsQuery);
        }
        this._$rootScope.$on('acceptPayment', (evt, data) => {
            this.getBillingHistory(this.billingHistoryQuery);
            this.getSupplierPaymentClaims(this.supplierPaymentClaimsQuery);
        });
        this._$rootScope.$on('rejectPayment', (evt, data) => {
            this.getBillingHistory(this.billingHistoryQuery);
            this.getSupplierPaymentClaims(this.supplierPaymentClaimsQuery);
        });
    }
    getSupplier(id) {
        const _onSuccess = (res) => {
            this.supplier = res.data.data;
            this.representativeName = this.supplier.representativeName;
            this.userName = `${this.supplier.user.firstName} ${this.supplier.user.lastName}`;
            this.phoneNumberUpdated = this.supplier.user.mobileNumber;
            this.emailUpdated = this.supplier.user.email;
            switch (this.supplier.status) {
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
            this.supplierIsLoaded = true;
        };
        this._SupplierService.getSupplier(id).then(_onSuccess, _onError).finally(_onFinal);
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

    blockSupplier(id) {
        const _onSuccess = (res) => {
      // this.supplier = res.data.data;
            this.supplier.status = 'Blocked';
            this.statusOptions = ['Unblock'];
            this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._SupplierService.blockSupplier(id).then(_onSuccess, _onError);
    }
    unblockSupplier(id) {
        const _onSuccess = (res) => {
      // this.supplier = res.data.data;
            this.supplier.status = 'Active';
            this.statusOptions = ['Block'];
            this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._SupplierService.unblockSupplier(id).then(_onSuccess, _onError);
    }
    approveSupplier(id) {
        const _onSuccess = (res) => {
      // this.supplier = res.data.data;
            this.supplier.status = 'Active';
            this.statusOptions = ['Block'];
            this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._SupplierService.approveSupplier(id).then(_onSuccess, _onError);
    }
    deleteSupplier(id) {
        const _onSuccess = (res) => {
      // this.supplier = res.data.data;
            this.supplier.status = 'Deleted';
            this.statusOptions = ['Approve'];
            this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._SupplierService.deleteSupplier(id).then(_onSuccess, _onError);
    }
    changeSupplierInfo() {
        this.supplier.representativeName = this.representativeName;
        if (this.userName) {
            this.supplier.user.firstName = this.userName.split(' ')[0] || '';
            this.supplier.user.lastName = this.userName.split(' ')[1] ? this.userName.split(' ')[1] : '';
        }

        if (this.phoneNumberUpdated) {
            this.supplier.user.mobileNumber = this.phoneNumberUpdated;
        }

        if (this.emailUpdated) {
            this.supplier.user.email = this.emailUpdated;
        }
        const _onSuccess = (res) => {
      // this.supplier = res.data.data;
            this.notify('admin.suppliers.supplier.supplier_updated', 'success', 3000);

            this.getSupplier(this.supplierId);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
            // this.getSupplier(this.supplierId);
            if (err.data.errorCode === 29) {
                this.notify('admin.suppliers.supplier.supplier_email_exists', 'danger', 8000);
            } else if (err.data.errorCode === 30) {
                this.notify('admin.suppliers.supplier.supplier_mobilePhone_exists', 'danger', 8000);
            }
        };
        this._SupplierService.adminUpdateSupplier(this.supplier).then(_onSuccess, _onError);
    }
    changeSupplierStatus(supplierId, toStatus) {
        if (toStatus === 'Approve') {
            this.approveSupplier(supplierId);
        } else if (toStatus === 'Block') {
            this.blockSupplier(supplierId);
        } else if (toStatus === 'Unblock') {
            this.unblockSupplier(supplierId);
        } else if (toStatus === 'Delete') {
            this.deleteSupplier(supplierId);
        }
    }

    addPayment(payment) {
        payment.supplierId = this.$stateParams.supplierId;
        $('#payment').modal('hide');
        this.addPaymendFinal = false;
        const _onSuccess = (res) => {
            this.notify('admin.suppliers.payment.message.add.success', 'success', 1000);
            this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
            this.notify('admin.suppliers.payment.message.add.failure', 'danger', 1000);
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
            status: this.supplier.status,
            creditLimit: this.balanceDetails.creditLimit,
            exceedCreditLimit: this.balanceDetails.exceedCreditLimit,
            exceedPaymentDate: this.balanceDetails.exceedPaymentDate,
            paymentFrequency: this.selectPeriod.frequency,
            paymentInterval: this.selectPeriod.interval
        };
        const _onSuccess = (res) => {
            this.notify('admin.suppliers.payment.updateInfo', 'success', 1000);
            this.getBillingHistory(this.billingHistoryQuery);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        this._SupplierService.updateSupplierRelation(this.supplierId, this.updatePacket)
            .then(_onSuccess, _onError);
    }

    changeStatus(status) {
        this.supplier.status = status;
        this.updateBalanceDetails();
    }
    customOp(item) {
        return this.$translate.instant('admin.suppliers.payment.every')
            + this.$translate.instant(`admin.suppliers.payment.${item.interval}`, { value: item.frequency });
    }
    openPhoto(url){
        window.open(url, '_blank', 'Download');
    }

}
adminSupplierDetailCtrl.$inject = ['SupplierService', 'TransactionsService', '$stateParams', '$translate', '$rootScope', 'PermPermissionStore'];
