import moment from 'moment';

export default class AdminReportOrdersCtrl {
    constructor(AdminService, CustomerService, SupplierService, $http, $scope, $translate) {
        this._AdminService = AdminService;
        this._CustomerService = CustomerService;
        this._SupplierService = SupplierService;
        this._$http = $http;
        this._$scope = $scope;
        this._$translate = $translate;
    }

    $onInit() {
        moment.locale('en');
        $.Pages.init(); // eslint-disable-line
        this.mstatus = 'Pending';
        this.statusList = {
            placeholder: { ar: 'اختر الحالة', en: 'Select Status' },
            data: [
                { _id: 'All', arabicName: 'الكل', englishName: 'All' },
                { _id: 'Accepted', arabicName: 'الموافق عليها', englishName: 'Accepted' },
                { _id: 'Pending', arabicName: 'قيد الانتظار', englishName: 'Pending' },
                { _id: 'Rejected', arabicName: 'المرفوضة', englishName: 'Rejected' },
                { _id: 'Canceled', arabicName: 'الملغيه', englishName: 'Canceled' },
                { _id: 'FailedToDeliver', arabicName: 'الفاشلة', englishName: 'Failed To Deliver' },
                { _id: 'ReadyForDelivery', arabicName: 'الجاهزه للتوصيل', englishName: 'Ready For Delivery' },
                { _id: 'OutForDelivery', arabicName: 'الخارجه للتوصيل', englishName: 'Out For Delivery' },
                { _id: 'Delivered', arabicName: 'تم التسليم', englishName: 'Delivered' },
                { _id: 'CanceledByCustomer', arabicName: 'تم الغائها من العميل', englishName: 'Canceled By Customer' },
            ]
        };
        this.selectedStatus = [this.statusList.data[0]];
        this.customers = {
            placeholder: { ar: 'اختر العميل', en: 'Select Customer' },
            data: [
                { _id: 'All', representativeName: this._$translate.use() === 'ar' ? 'الكل' : 'All' }
            ]
        };
        this.suppliers = {
            placeholder: { ar: 'اختر المورد', en: 'Select Supplier' },
            data: [
                { _id: 'All', supplier: { _id: 'All', representativeName: this._$translate.use() === 'ar' ? 'الكل' : 'All' } }
            ]
        };
        this.selectedSupplier = this.suppliers.data[0];
        this.selectedCustomer = this.customers.data[0];

        this.currentPage = 1;
        this.searchCriteria = {
            skip: 0,
            limit: 15,
            status: [],
            supplierId: '',
            customerId: '',
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
              this.getOrdersReport(this.searchCriteria);
          });
        this.getOrdersReport(this.searchCriteria);
        this.getCustomersLookup();
        this.getSuppliersLookup();

        const ctrl = this;
        this._$scope.$watch(this.searchCriteria, () => {
            ctrl.getOrdersReport(ctrl.searchCriteria);
        });
    }

    getOrdersReport(searchCriteria) {
        const _onSuccess = (res) => {
            this.report = res.data.data;
            this.totalPages = Math.ceil(res.data.data.count / this.searchCriteria.limit);
        };
        const _onError = (err) => {
            this.error = err.data.data;
        };
        const _onFinal = (err) => {
            this.reportIsLoaded = true;
        };
        this._AdminService.getOrdersReport(searchCriteria)
      .then(_onSuccess, _onError).finally(_onFinal);
    }

    getCustomersLookup() {
        this.cusSearchCriteria = {
            skip: 0,
            limit: 50,
            customerName: ''
        };
        const _onSuccess = (res) => {
            if (res.data.data.customers.length > 0) {
                Array.prototype.push.apply(this.customers.data, res.data.data.customers);
            }
            this.customersLoaded = true;
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._CustomerService.getCustomers(this.cusSearchCriteria)
      .then(_onSuccess, _onError);
    }

    getSuppliersLookup() {
        this.supSearchCriteria = {
            skip: 0,
            limit: 50,
            supplierName: ''
        };
        const _onSuccess = (res) => {
            if (res.data.data.suppliers.length > 0) {
                Array.prototype.push.apply(this.suppliers.data, res.data.data.suppliers);
            }
            this.suppliersLoaded = true;
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._SupplierService.getSuppliers(this.supSearchCriteria)
      .then(_onSuccess, _onError);
    }

    onChange() {
        if (!this.selectedStatus || this.selectedStatus.find(s => s._id === 'All')) {
            this.searchCriteria.status = 'All';
        } else {
            this.searchCriteria.status = [];
            for (const item of this.selectedStatus) {
                this.searchCriteria.status.push(item._id);
            }
        }

        this.searchCriteria.supplierId = this.selectedSupplier.supplier._id;
        this.searchCriteria.customerId = this.selectedCustomer._id;
        this.getOrdersReport(this.searchCriteria);
    }
    setPage(pageNumber) {
        this.currentPage = pageNumber;
        this.searchCriteria.skip = (pageNumber - 1) * this.searchCriteria.limit;
        this.getOrdersReport(this.searchCriteria);
    }

    exportFile(type) {
        this._AdminService.exportFile(type, 'orders', this.searchCriteria);
    }
    translateStatus(_id) {
        const item = this.statusList.data.find(obj => obj._id === _id);
        return this._$translate.use() === 'ar' ? item.arabicName : item.englishName;
    }
}
AdminReportOrdersCtrl.$inject = ['AdminService', 'CustomerService', 'SupplierService', '$http', '$scope', '$translate'];
