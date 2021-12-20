import * as XLSX from 'xlsx';

export default class SupplierCustomerListCtrl {
    constructor(CustomerService, $translate, notifications, SystemService) {
        this._CustomerService = CustomerService;
        this.$translate = $translate;
        this.notifications = notifications;
        this._SystemService = SystemService;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        // this.status = ['Active', 'Suspended', 'Blocked'];
        this.status = ['Active', 'Blocked'];
        this.currentPage = 1;
        this.excelData = "";
        this.customerQuery = {
            skip: 0,
            limit: 100,
            status: ['Active', 'Blocked'],
            customerName: '',
            payingSoon: false,
            missedPayment: false,
            city: null
        };
        this.getCustomers(this.customerQuery);
        this.cityList = [{ _id: 'All', englishName: 'All', arabicName: 'All' }];
        this.getSystemCities();
        this.citySelect = {};
    }
    inviteExcel(){
        this._CustomerService.inviteCustomerWithExcel(this.excelData).then((res)=> {

        },
        (err) => {
            
        });
    }
    getCustomers(query) {
        this._CustomerService.getCustomers(query).then(
            // on Success
            (res) => {
                if (res.status === 200) {
                    this.customers = res.data.data.customers;
                    this.totalPages = Math.ceil(res.data.data.count / this.customerQuery.limit);
                }
            },
            // on Error
            (err) => {
                this.errors = err.data;
            });
    }

    setPage(pageNumber) {
        this.currentPage = pageNumber;
        this.customerQuery.skip = (pageNumber - 1) * this.customerQuery.limit;
        this.getCustomers(this.customerQuery);
    }

    check(value, checked) {
        this.currentPage = 1;
        this.customerQuery.skip = 0;
        const idx = this.customerQuery.status.indexOf(value);
        if (idx >= 0 && !checked) {
            this.customerQuery.status.splice(idx, 1);
        }
        if (idx < 0 && checked) {
            this.customerQuery.status.push(value);
        }
        this.getCustomers(this.customerQuery);
    }

    checkPayment() {
        this.getCustomers(this.customerQuery);
    }

    inviteCustomer(inviteForm) {
        if (inviteForm.$invalid) return;
        const onSuccess = (res) => {
            if (res.status === 200) {
                this.notify('supplier.customers.invite-customer.message.success', 'success', 500);
            } else if (res.data.errorCode === 12) {
                this.notify('supplier.customers.invite-customer.message.alreadyInvited', 'danger', 5000);
            }
        };
        const onError = (err) => {
            if (err.data.errorCode === 12) {
                this.notify('supplier.customers.invite-customer.message.alreadyInvited', 'danger', 5000);
            } else {
                this.notify('supplier.customers.invite-customer.message.failure', 'danger', 5000);
            }
        };
        this._CustomerService.inviteCustomer({ customerEmail: this.customerEmail })
            .then(onSuccess, onError)
            .catch(() => {
                this.notify('supplier.customers.invite-customer.message.failure', 'danger', 5000);
            })
            .finally(() => {
                $('#inviteCustomerModal').modal('hide');
            });
    }

    notify(message, type, timeout) {
        this.$translate(message).then((translation) => {
            $('body')
                .pgNotification({
                    style: 'bar',
                    message: translation,
                    position: 'top',
                    timeout,
                    type
                })
                .show();
        });
    }

    exportCustomerList(type) {
        this._CustomerService.exportCustomerList(type, this.customerQuery);
    }

    getSystemCities() {
        const _onSuccess = (res) => {
            this.cityList = [...this.cityList, ...res.data.data];
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
    onFileChange(ev){
        let workBook = null;
        let jsonData = null;
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = reader.result;
            workBook = XLSX.read(data, { type: 'binary' });
            jsonData = workBook.SheetNames.reduce((initial, name) => {
                const sheet = workBook.Sheets[name];
                initial[name] = XLSX.utils.sheet_to_json(sheet);
                return initial;
            }, {});
            this.excelData = JSON.stringify(jsonData);
        }
        reader.readAsBinaryString(ev);
    }

    onChangeCity() {
        this.currentPage = 1;
        this.customerQuery.skip = 0;
        if (this.citySelect._id == 'All') {
            this.customerQuery.city = null;
        } else {
            this.customerQuery.city = this.citySelect._id;
        }

        this.getCustomers(this.customerQuery);
    }

}
SupplierCustomerListCtrl.$inject = ['CustomerService', '$translate', 'notifications', 'SystemService'];
