export default class AdminSupplierPaymentListCtrl {
    constructor(PaymentService,
                TransactionsService,
                SupplierService,
                $scope,
                $rootScope,
                $translate) {
        this._PaymentService = PaymentService;
        this._TransactionsService = TransactionsService;
        this._SupplierService = SupplierService;
        this._$scope = $scope;
        this.$rootScope = $rootScope;
        this.$translate = $translate;
    }
    $onInit() {
        this.status = {
            placeholder: { ar: 'اختر الحالة', en: 'Select Status' },
            data: [
                { _id: 'All', arabicName: 'الكل', englishName: 'All' },
                { _id: 'Pending', arabicName: 'قيد الانتظار', englishName: 'Pending' },
                { _id: 'Approved', arabicName: 'الموافق عليها', englishName: 'Approved' },
                { _id: 'Rejected', arabicName: 'المرفوضة', englishName: 'Rejected' }
            ]
        };
        this.selectedStatus = this.status.data[0];
        $.Pages.init();
        this.currentPage = 1;
        this.searchCriteria = { skip: 0, limit: 10, isAdminFees: true, supplierName: '', status: [] };
        this.getPayments(this.searchCriteria);
        const ctrl = this;
        this._$scope.$watch(this.searchCriteria, () => {
            ctrl.getPayments(ctrl.searchCriteria);
        });
        this.$rootScope.$on('getPayments', (ev, paymentId) => {
            this.getPayments(this.searchCriteria);
        });
        this.$rootScope.$on('acceptPayment', (ev, paymentId) => {
            this.getPayments(this.searchCriteria);
        });
        this.$rootScope.$on('rejectPayment', (ev, paymentId) => {
            this.getPayments(this.searchCriteria);
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
            this.notify('admin.suppliers.payment.message.add.success', 'success', 1000);
            this.getPayments(this.searchCriteria);
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
    getPage(pageNumber) {
        this.currentPage = pageNumber;
        this.searchCriteria.skip = (pageNumber - 1) * this.searchCriteria.limit;
        this.getPayments(this.searchCriteria);
    }
    onChange() {
        if (this.selectedStatus._id === 'All') {
            this.searchCriteria.status = 'All';
        } else {
            this.searchCriteria.status = [];
            this.searchCriteria.status.push(this.selectedStatus._id);
        }
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
        this.getPayments(this.searchCriteria);
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
    translateStatus(_id) {
        const item = this.status.data.find(obj => obj._id === _id);
        return this.$translate.use() === 'ar' ? item.arabicName : item.englishName;
    }
}

AdminSupplierPaymentListCtrl.$inject = ['PaymentService', 'TransactionsService', 'SupplierService', '$scope', '$rootScope', '$translate'];
