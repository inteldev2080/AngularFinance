export default class SupplierCustomerDetailCtrl {
    constructor(
        CustomerService,
        SupplierService,
        $translate,
        $stateParams,
        TransactionsService,
        ProductService,
        $rootScope,
        PermPermissionStore,
        SystemService
    ) {
        this._CustomerService = CustomerService;
        this._SupplierService = SupplierService;
        this.$translate = $translate;
        this._$stateParams = $stateParams;
        this._TransactionsService = TransactionsService;
        this._ProductService = ProductService;
        this._$rootScope = $rootScope;
        this.PermPermissionStore = PermPermissionStore;
        this._SystemService = SystemService;
    }

    $onInit() {
        const permissions = this.PermPermissionStore.getStore() || {};
        this.searchCriteria = {
            skip: 0,
            limit: 10
        };
        this.disableUpdate = true;
        this.cityList = [];
        this.getSystemCities();
        this.periods = [
            {interval: 'Month', frequency: 1},
            {interval: 'Month', frequency: 2},
            {interval: 'Month', frequency: 3},
            {interval: 'Month', frequency: 4},
            {interval: 'Month', frequency: 5},
            {interval: 'Month', frequency: 6},
            {interval: 'Month', frequency: 7},
            {interval: 'Month', frequency: 8},
            {interval: 'Month', frequency: 9},
            {interval: 'Month', frequency: 10},
            {interval: 'Month', frequency: 11},
            {interval: 'Month', frequency: 12}
        ];

        this.selectPeriod = {interval: 'Month', frequency: 1};

        if (this._$stateParams.customerId) {
            this.customerId = this._$stateParams.customerId;
            this.getCustomer(this.customerId);
            this.billingHistoryQuery = {
                customerId: this._$stateParams.customerId,
                skip: 0,
                limit: 10,
                currentPage: 1,
                totalPages: 1
            };
            this.customerPaymentClaimsQuery = {
                customerId: this._$stateParams.customerId,
                skip: 0,
                limit: 10,
                currentPage: 1,
                totalPages: 1,
            };
            this.customerSpecialPricesQuery = {
                customerId: this._$stateParams.customerId,
                skip: 0,
                limit: 10,
                currentPage: 1,
                totalPages: 1,
            };

            this.productsQuery = {
                skip: 0,
                limit: 1000
            };

            this.getBillingHistory(this.billingHistoryQuery);
            if (permissions.managePayments) {
                this.getCustomerPaymentClaims(this.customerPaymentClaimsQuery);
            }
            this.getCustomerSpecialPrices(this.customerSpecialPricesQuery);
            this.getProducts();
        }

        this.specialPriceMode = 'viewMode';
        this._$rootScope.$on('acceptPayment', (evt, data) => {
            this.getBillingHistory(this.billingHistoryQuery);
            this.getCustomerPaymentClaims(this.customerPaymentClaimsQuery);
        });
        this._$rootScope.$on('rejectPayment', (evt, data) => {
            this.getBillingHistory(this.billingHistoryQuery);
            this.getCustomerPaymentClaims(this.customerPaymentClaimsQuery);
        });
    }

    getCustomer($customerId) {
        const _onSuccess = (res) => {
            if (res.data) {
                this.customer = res.data.data;
                this.customer.location.city = {
                    _id: this.customer.location.city
                };
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
            this.customerIsLoaded = true;
        };
        this._CustomerService.getCustomer($customerId).then(_onSuccess, _onError).finally(_onFinal);
    }

    getBillingHistory(query) {
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.billingHistory = res.data.data.billingHistory.transactions;
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

        this._CustomerService.getSupplierCustomerBillingHistory(query.customerId, query)
            .then(_onSuccess, _onError).finally(_onFinal);
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

    getProducts() {
        this.productsAreLoaded = false;
        const _onSuccess = (res) => {
            this.products = res.data.data.products;
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = (res) => {
            this.productsAreLoaded = true;
        };
        this._ProductService.getSupplierProducts(this.productsQuery)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
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
        this._CustomerService.getSupplierCustomerSpecialPrices(query.customerId, query)
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    setSpecialPricesPage(pageNumber) {
        this.customerSpecialPricesQuery.currentPage = pageNumber;
        this.customerSpecialPricesQuery.skip = (pageNumber - 1) *
            this.customerSpecialPricesQuery.limit;
        this.getCustomerSpecialPrices(this.customerSpecialPricesQuery);
    }

    addPayment(payment) {
        payment.customerId = this._$stateParams.customerId;
        $('#payment').modal('hide');
        this.addPaymendFinal = false;
        const _onSuccess = (res) => {
            this.notify('supplier.customers.payments.message.add.success', 'success', 1000);
            this.getBillingHistory(this.billingHistoryQuery);
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

    updateBalanceDetails() {
        this.updatePacket = {
            status: this.balanceDetails.status,
            creditLimit: this.balanceDetails.creditLimit,
            exceedCreditLimit: this.balanceDetails.exceedCreditLimit,
            exceedPaymentDate: this.balanceDetails.exceedPaymentDate,
            paymentFrequency: this.selectPeriod.frequency,
            paymentInterval: this.selectPeriod.interval
        };
        const _onSuccess = (res) => {
            this.notify('supplier.account.payment.updateInfo', 'success', 1000);
            this.getCustomer(this.customerId);
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
        this.balanceDetails.status = status;
        this.updateBalanceDetails();
    }

    customOp(item) {
        return this.$translate.instant('supplier.account.payment.every')
            + this.$translate.instant(`supplier.account.payment.${item.interval}`, {value: item.frequency});
    }

    addSpecialPrice() {
        this.updatePacket = {
            customerId: this.customerId,
            price: this.specialPrice,
            productId: this.selectedProduct._id
        };
        const _onSuccess = (res) => {
            this.notify('supplier.account.payment.specialPricesTable.added', 'success', 1000);
            this.specialPrice = '';
            this.getCustomerSpecialPrices(this.customerSpecialPricesQuery);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
            if (err.data.errorCode === 19) {
                this.notify('supplier.account.payment.specialPricesTable.duplicated', 'warning', 3000);
            }
        };
        this._CustomerService.addCustomerSpecialPrices(this.updatePacket)
            .then(_onSuccess, _onError);
    }

    updateSpecialPrice(item) {
        const _onSuccess = (res) => {
            this.notify('supplier.account.payment.specialPricesTable.updated', 'success', 1000);
            this.setSpecialPriceMode('viewMode');
            this.getCustomerSpecialPrices(this.customerSpecialPricesQuery);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            } else {
                this.notify('supplier.account.payment.specialPricesTable.error', 'warning', 3000);
            }
        };
        this._CustomerService
            .updateCustomerSpecialPrices(item.product._id, this.customerId, item.price)
            .then(_onSuccess, _onError);
    }

    setSpecialPriceMode(mode) {
        this.specialPriceMode = mode;
    }

    cancelEditSpecialPrice() {
        this.setSpecialPriceMode('viewMode');
        this.getCustomerSpecialPrices(this.customerSpecialPricesQuery);
    }

    deleteSpecialPrice(item) {
        const _onSuccess = (res) => {
            this.notify('supplier.account.payment.specialPricesTable.deleted', 'success', 1000);
            this.setSpecialPriceMode('viewMode');
            this.getCustomerSpecialPrices(this.customerSpecialPricesQuery);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            } else {
                this.notify('supplier.account.payment.specialPricesTable.error', 'warning', 3000);
            }
        };
        this._CustomerService.deleteCustomerSpecialPrices(item.product._id, this.customerId)
            .then(_onSuccess, _onError);
    }

    downloadSpecialPrices() {
        if (this.customerId) {
            this._CustomerService.downloadSpecialPrices(this.customerId);
        }
    }

    uploadSpecialPrices(file) {
        if (this.customerId && file) {
            this._CustomerService.uploadSpecialPrices(this.customerId, file).then(
                (res) => {
                    let message = '';
                    const successCount = res.data.data.Success.count;
                    const failedCount = res.data.data.Failed.count;
                    // this.notify('supplier.customer.message.uploadSpecialPriceSuccess', 'success', '5000');
                    if (this.$translate.use() === 'ar') {
                        message = `تم رفع الاسعار الخاصة بنجاح ${successCount}`;
                    } else {
                        message = `Success ${successCount} product uploaded & ${failedCount} failed`;
                    }
                    $('body').pgNotification({
                        style: 'bar',
                        message,
                        position: 'top',
                        timeout: 5000,
                        type: 'success'
                    }).show();
                    this.getCustomerSpecialPrices(this.customerSpecialPricesQuery);
                },
                (err) => {
                    this.notify('supplier.customer.message.uploadSpecialPriceFailure', 'warning', '5000');
                });
        }
    }

    exportSpecialPrices(type, query) {
        this._CustomerService.exportSupplierCustomerSpecialPricesList(type, query.customerId, query);
    }

    getSystemCities() {
        const _onSuccess = (res) => {
            this.cityList = res.data.data;
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
            }
        };
        const _onFinal = (err) => {

        };
        this._SystemService.getSystemCities()
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    onChangeCity() {
        this.updateCustomer = {
            cityId: this.customer.location.city._id
        };
        const _onSuccess = (res) => {
            this.notify('supplier.account.customer.cityUpdated', 'success', 1000);
            this.getCustomer(this.customerId);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        this._CustomerService.updateCustomerCity(this.customerId, this.updateCustomer)
            .then(_onSuccess, _onError);
    }

    onAddressUpdate() {
        this.updateCustomer = {
            address: this.customer.location.address,
            coordinates: this.customer.location.coordinates
        };
        const _onSuccess = (res) => {
            this.notify('supplier.account.customer.addressUpdated', 'success', 1000);
            this.getCustomer(this.customerId);
            this.disableUpdate = true;
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        this._CustomerService.updateCustomerAddress(this.customerId, this.updateCustomer)
            .then(_onSuccess, _onError);
    }

    geoCodeLatLng(lat, lng) {
        this.disableUpdate = false;
        const geocoder = new google.maps.Geocoder();
        const latlng = {lat, lng};
        geocoder.geocode({location: latlng}, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    this.customer.location.address = results[0].formatted_address;

                    this._$rootScope.$digest();
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert(`Geocoder failed due to: ${status}`);
            }
        });
    }

    markerDragEnd(event, ctrl) {
        ctrl.geoCodeLatLng(event.latLng.lat(), event.latLng.lng());
        ctrl.customer.location.coordinates = [event.latLng.lat(), event.latLng.lng()];
    }


}

SupplierCustomerDetailCtrl.$inject = ['CustomerService', 'SupplierService', '$translate', '$stateParams', 'TransactionsService', 'ProductService', '$rootScope', 'PermPermissionStore', 'SystemService'];
