export default class SupplierAccountUerCtrl {
    constructor(UserService, SupplierService, RoleService, $translate) {
        this._UserService = UserService;
        this._SupplierService = SupplierService;
        this._RoleService = RoleService;
        this._$translate = $translate;
        this.supplierUsers = [];
        this.errors = [];
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.searchCriteria = {
            skip: 0,
            limit: 5,
            staffQuery: '',
            roleId: 'All',
            status: 'All'
        };
        this.status = {
            placeholder: { ar: 'اختر الحاله', en: 'Select Status' },
            data: [
                { key: 'All', ar: 'الكل', en: 'All' },
                { key: 'Active', ar: 'نشط', en: 'Active' },
                { key: 'Blocked', ar: 'محظور', en: 'Blocked' }
            ]
        };
        this.roles = {
            placeholder: { ar: 'اختر الوظيفة', en: 'Select Role' },
            data: [
                { _id: 'All', arabicName: 'الكل', englishName: 'All' },
            ]
        };
        this.selectedStatus = this.status.data[0];
        this.selectedRole = this.roles.data[0];
        this.getSupplierStaff(this.searchCriteria, 1);
        this.getRoles();
    }
    getSupplierStaff(searchCriteria) {
        this.usersIsLoading = true;
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.supplierUsers = res.data.data.staff;
                this.totalPages = Math.ceil(res.data.data.count / this.searchCriteria.limit);
            }
        };
        const _onError = (err) => {
            this.errors = err.data;
        };
        this._SupplierService.getSupplierStaff(searchCriteria)
            .then(_onSuccess, _onError)
            .catch((e) => {
            })
            .finally(() => {
                this.usersIsLoading = false;
            });
    }
    getRoles() {
        const _onSuccess = (res) => {
            if (res.data.data.roles.length > 0) {
                Array.prototype.push.apply(this.roles.data, res.data.data.roles);
            }
        };
        const _onError = (err) => {
            this.errors = err.data;
        };
        this._RoleService.getRoles({ skip: 0, limit: 1000 }).then(_onSuccess, _onError);
    }
    createSupplierStaffMember(user) {
        this.isLoad = true;

        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.user = res.data.data;
                this.getSupplierStaff(this.searchCriteria);
                $('#userModal').modal('hide');
                $('body')
                    .pgNotification({
                        style: 'bar',
                        message: this._$translate.instant('supplier.account.users.message.success.add'),
                        position: 'top',
                        timeout: 500,
                        type: 'success'
                    })
                    .show();
            }  else {
                $('body')
                    .pgNotification({
                        style: 'bar',
                        message: this._$translate.instant('supplier.account.users.message.failure'),
                        position: 'top',
                        timeout: 5000,
                        type: 'danger'
                    })
                    .show();
            }
        };

        const _onError = (err) => {            
            if (err.data.errorCode === 31) {
                $('body')
                .pgNotification({
                    style: 'bar',
                    message: this._$translate.instant('supplier.account.users.message.existFailure'),
                    position: 'top',
                    timeout: 5000,
                    type: 'danger'
                })
                .show();
            } else {
                $('body')
                .pgNotification({
                    style: 'bar',
                    message: this._$translate.instant('supplier.account.users.message.failure'),
                    position: 'top',
                    timeout: 5000,
                    type: 'danger'
                })
                .show();
            this.errors = err.data;
            }
        };
        if (user.role._id) {
            user.role = user.role._id;
        }
        if (user.status.key) {
            user.status = user.status.key;
        }
        this._SupplierService.createSupplierStaffMember(user)
            .then(_onSuccess, _onError)
            .catch((e) => {
            })
            .finally(() => {
                this.isLoad = false;
                $('#userModal').modal('hide');                
                user = {};
            });
    }
    updateUser(updateUser) {
        $('#userModal').modal('hide');
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.getSupplierStaff(this.searchCriteria);
                $('body')
                    .pgNotification({
                        style: 'bar',
                        message: this._$translate.instant('supplier.account.users.message.success.update'),
                        position: 'top',
                        timeout: 500,
                        type: 'success'
                    })
                    .show();
            } else if (res.data.errorCode === -1 || 31) {
                $('body')
                    .pgNotification({
                        style: 'bar',
                        message: this._$translate.instant('admin.account.user.message.failure'),
                        position: 'top',
                        timeout: 5000,
                        type: 'danger'
                    })
                    .show();
            } else {
                $('body')
                    .pgNotification({
                        style: 'bar',
                        message: this._$translate.instant('admin.account.users.message.failure'),
                        position: 'top',
                        timeout: 5000,
                        type: 'danger'
                    })
                    .show();
            }
        };
        const _onError = (err) => {
            this.errors = err.data;
        };
        // update user to get id's of roles and status only
        if (updateUser.role._id) {
            updateUser.role = updateUser.role._id;
        }
        if (updateUser.status.key) {
            updateUser.status = updateUser.status.key;
        }
        this._SupplierService.updateSupplierStaffMember(updateUser)
            .then(_onSuccess, _onError)
            .catch((e) => {
                $('body')
                    .pgNotification({
                        style: 'bar',
                        message: this._$translate.instant('admin.account.users.message.failure'),
                        position: 'top',
                        timeout: 5000,
                        type: 'danger'
                    })
                    .show();
            })
            .finally(() => {
                this.usersIsLoading = false;
                updateUser = {};
            });
    }
    onFilterChange() {
        this.searchCriteria.status = this.selectedStatus.key;
        this.searchCriteria.roleId = this.selectedRole._id;
        this.currentPage = 1;
        this.searchCriteria.skip = 0;
        this.getSupplierStaff(this.searchCriteria);
    }
    openEditUserPopup(user) {
        this.userId = user._id;
        this.user = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            mobileNumber: user.mobileNumber,
            email: user.email,
            role: user.role._id,
            status: user.status
        };
        this.mode = 'Update';
        $('#userModal').modal('show');
    }
    openNewUserPopup() {
        this.user = {};
        this.mode = 'Save';
        $('#userModal').modal('show');
    }
    openResetPasswordPopup(userId) {
        this.userId = userId;
        $('#resetPasswordModal').modal('show');
    }
    setPage(pageNumber) {
        this.currentPage = pageNumber;
        this.searchCriteria.skip = (pageNumber - 1) * this.searchCriteria.limit;
        this.getSupplierStaff(this.searchCriteria, pageNumber);
    }
    translateStatus(key) {
        const item = this.status.data.find(obj => obj.key === key);
        return this._$translate.use() === 'ar' ? item.ar : item.en;
    }
    translateRole(item) {
        return this._$translate.use() === 'ar' ? item.arabicName : item.englishName;
    }
}

SupplierAccountUerCtrl.$inject = ['UserService', 'SupplierService', 'RoleService', '$translate'];
