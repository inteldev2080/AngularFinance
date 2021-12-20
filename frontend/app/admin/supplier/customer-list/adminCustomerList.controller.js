export default class adminCustomerListCtrl {
    constructor(CustomerService, SupplierService, $rootScope, $translate) {
        this._CustomerService = CustomerService;
        this._SupplierService = SupplierService;
        this.$rootScope = $rootScope;
        this.$translate = $translate;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        const ctrl = this;
        this.status = ['Active', 'Suspended', 'Blocked', 'Deleted'];
        this.searchCriteria = {
            skip: 0,
            limit: 15,
            payingSoon: false,
            missedPayment: false,
            supplierId: ''
        };
        this.currentPage = 1;
        this.getSuppliers();
        this.getCustomers(this.searchCriteria);
        this.$rootScope.$on('getCustomers', () => {
            ctrl.getCustomers(ctrl.searchCriteria);
        });
    }
    onFilterChange(searchCriteria) {
        this.currentPage = 1;
        this.searchCriteria.skip = 0;
        this.getCustomers(searchCriteria);
    }
    
    getCustomers(searchCriteria){
        const _onSuccess = (res) => {
            this.customers = res.data.data.customers;
            this.totalPages = Math.ceil(res.data.data.count / searchCriteria.limit);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = () => {
            this.customersAreLoaded = true;
        };
        this._CustomerService.getCustomers(searchCriteria)
            .then(_onSuccess, _onError).finally(_onFinal);
    }
    getSuppliers() {
        this.cusSearchCriteria = {
            skip: 0,
            limit: 100,
            customerName: '',
            nameOnly: true
        };
        const _onSuccess = (res) => {
            this.suppliers = res.data.data.suppliers;

        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        
        this._SupplierService.getSuppliers(this.cusSearchCriteria).then(_onSuccess, _onError);
    }

    setPage(pageNumber) {
        this.currentPage = pageNumber;
        this.searchCriteria.skip = (pageNumber - 1) * this.searchCriteria.limit;
        this.getCustomers(this.searchCriteria);
    }

    check(value, checked) {
        this.currentPage = 1;
        this.searchCriteria.skip = 0;
        const idx = this.searchCriteria.status.indexOf(value);
        if (idx >= 0 && !checked) {
            this.searchCriteria.status.splice(idx, 1);
        }
        if (idx < 0 && checked) {
            this.searchCriteria.status.push(value);
        }
        this.getCustomers(this.searchCriteria);
    }

    checkPayment() {
        this.getCustomers(this.searchCriteria);
    }

    openCustomerFormPoup() {
        this.formData = {};
        this.mode = 'new';
        $('#customerFormModal').modal('show');
        $.Pages.init();
    }

    exportCustomerList(type) {
        this._CustomerService.exportCustomerList(type, this.searchCriteria);
    }
}
adminCustomerListCtrl.$inject = ['CustomerService', 'SupplierService', '$rootScope', '$translate'];
