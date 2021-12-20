export default class CustomerListBranchesCtrl {
    constructor(UserService, CustomerService, RoleService, $translate, BranchService, SystemService, $scope) {
        this._UserService = UserService;
        this._CustomerService = CustomerService;
        this._BranchService = BranchService;
        this._$translate = $translate;
        this.customerUsers = [];
        this.errors = [];
        this.totalPages = 0;
        this.isStaff = false;
        this.staffs = [];
        this.cityList = [];
        this._SystemService = SystemService;
        this._$scope = $scope;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.searchCriteria = {
            skip: 0,
            limit: 5,
            staffQuery: '',
            status: 'All'
        };
        this.status = {
            placeholder: { ar: 'اختر الحاله', en: 'Select Status' },
            data: [
                { key: 'All', ar: 'الكل', en: 'All' },
                { key: 'Active', ar: 'نشط', en: 'Active' },
                { key: 'InActive', ar: 'محظور', en: 'InActive' }
            ]
        };
        this.selectedStatus = this.status.data[0];
        this.getSystemCities();
        this.getBranches(this.searchCriteria);
    }

    createBranch(branch) {
        const _onSuccess = (res) => {
            // if (res.status === 200) {
            this.notify('customer.account.branches.branch_added', 'success', 2000);
            this.searchCriteria.skip = 0;
            this.searchCriteria.limit = 5;
            this.getBranches(this.searchCriteria);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
            this.notify('customer.account.branches.branch_failure', 'danger', 5000);
        };
        const _onFinal = () => {

        };

        branch.location.cityId = branch.citySelected._id;
        branch.location.city = branch.citySelected.englishName;
        this._BranchService.createBranch(branch)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    getBranches(searchCriteria) {
        const _onSuccess = (res) => {
            this.branches = res.data.data.branches;
            this.totalPages = Math.ceil(res.data.data.count / this.searchCriteria.limit);
            this.location = this.branches[0].location;
            this.isStaff = res.data.data.isStaff;
            const defaultValue = [{ _id: null, representativeName: 'None' }];
            this.staffs = {
                placeholder: { ar: 'اختر الوظيفة', en: 'Select Role' },
                data: [...defaultValue, ...res.data.data.staff]
            };
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = () => {
        };

        this._BranchService.getBranchesList(searchCriteria)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    updateBranch(branch) {
        const _onSuccess = (res) => {
            this.notify('customer.account.branches.branch_updated', 'success', 2000);
            this.searchCriteria.skip = 0;
            this.searchCriteria.limit = 5;
            this.getBranches(this.searchCriteria);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
            this.notify('customer.account.branches.branch_failure', 'danger', 5000);
        };
        const _onFinal = () => {

        };

        branch.location.cityId = branch.citySelected._id;
        if (branch.citySelected.englishName) {
            branch.location.city = branch.citySelected.englishName;
        }
        branch.status = branch.selectedStatus.key;

        this._BranchService.updateBranch(branch._id, branch)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    onFilterChange() {
        this.searchCriteria.status = this.selectedStatus.key;
        this.currentPage = 1;
        this.searchCriteria.skip = 0;
        this.getBranches(this.searchCriteria);
    }

    setPage(pageNumber) {
        this.currentPage = pageNumber;
        this.searchCriteria.skip = (pageNumber - 1) * this.searchCriteria.limit;
        this.getBranches(this.searchCriteria);
    }

    translateStatus(key) {
        const item = this.status.data.find(obj => obj.key === key);
        return this._$translate.use() === 'ar' ? item.ar : item.en;
    }

    openNewBranchPopup() {
        this.mode = 'Save';
        this.branch = {
            branchName: '',
            location: {
                coordinates: [46.5423373, 24.7255553],
                city: '',
                cityId: null,
                address: ''
            },
            manager: '',
            citySelected: {}
        };
        $('#branchModal').modal('show');
    }

    openEditBranchPopup(branch) {
        branch.citySelected = {
            _id: branch.location.cityId
        };

        if (branch.status === 'Active') {
            branch.selectedStatus = { key: 'Active', ar: 'نشط', en: 'Active' };
        } else {
            branch.selectedStatus = { key: 'InActive', ar: 'محظور', en: 'Blocked' };
        }

        this._$scope.$broadcast('StatusUpdate', branch.selectedStatus);

        this.branch = branch;
        this.mode = 'Update';
        $('#branchModal').modal('show');
    }

    notify(message, type, timeout) {
        this._$translate(message).then((translation) => {
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

    onCityUpdate() {

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
}

CustomerListBranchesCtrl.$inject = ['UserService', 'CustomerService', 'RoleService', '$translate', 'BranchService', 'SystemService', '$scope'];
