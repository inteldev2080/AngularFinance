export default class AdminAccountOthersCtrl {
    constructor(SupplierService, UserService, AdminService, RoleService, $translate) {
        this._UserService = UserService;
        this._SupplierService = SupplierService;
        this._AdminService = AdminService;
        this._RoleService = RoleService;
        this._$translate = $translate;
        this.adminUsers = [];
        this.errors = [];
    }
    $onInit() {
    $.Pages.init(); // eslint-disable-line
        this.status = {
            placeholder: { ar: 'اختر الحاله', en: 'Select Status' },
            data: [
                { key: 'All', ar: 'الكل', en: 'All' },
                { key: 'Active', ar: 'نشط', en: 'Active' },
                { key: 'Blocked', ar: 'محظور', en: 'Blocked' }
            ]
        };
        this.suppliers = {
            placeholder: { ar: 'اختر الوظيفة', en: 'Select Role' },
            data: [
                {supplier: { _id: 'All', representativeName: '*', englishName: 'All' }},
            ]
        };
        this.selectedStatus = this.status.data[0];
        this.selectedRole = this.suppliers.data[0];
        this.currentPage = 1;
        this.searchCriteria = {
            skip: 0,
            limit: 10,
            adminQuery: '',
            roleId: 'All',
            status: 'All'
        };
        this.supplierCriteria = {
            skip: 0,
            limit: 100,
            status: ['Active', 'Suspended', 'Blocked', 'Deleted'],
            supplierName: '',
            payingSoon: false,
            missedPayment: false
        };
        this.usersIsLoading = true;
        this.getAllUsers(this.searchCriteria);
        this.getSuppliers(this.supplierCriteria);
    }

    getSuppliers(searchCriteria) {
        const _onSuccess = (res) => {
            if (res.data.data.suppliers.length > 0) {
                Array.prototype.push.apply(this.suppliers.data, res.data.data.suppliers);
            }
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = () => {
            this.suppliersAreLoaded = true;
        };
        this._SupplierService.getSuppliers(searchCriteria).then(_onSuccess, _onError).finally(_onFinal);
    }

    getAllUsers(searchCriteria) {
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.adminUsers = res.data.data.users;
                this.totalPages = Math.ceil(res.data.data.count / this.searchCriteria.limit);
            }
        };
        const _onError = (err) => {
            this.errors = err.data;
        };
        this._AdminService.getUsers(searchCriteria)
            .then(_onSuccess, _onError)
            .catch((e) => {
                this.messsage = 'failure';
            })
            .finally(() => {
                this.usersIsLoading = false;
            });
    }

    setPage(pageNumber) {
        this.currentPage = pageNumber;
        this.searchCriteria.skip = (pageNumber - 1) * this.searchCriteria.limit;
        this.getAllUsers(this.searchCriteria);
    }
    createUser(user) {
        this.isLoad = true;
        $('#userModal').modal('hide');
        const _onSuccess = (res) => {
            this.user = res.data.data;
            this.getAllUsers(this.searchCriteria);
            this.message = 'admin.account.users.New_user.validate_user_successfully';
            this.notify(this.message, 'success', 500);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
            if (err.data.errorCode === 31) {
                this.notify('admin.account.users.New_user.validate_user_failed', 'danger', 5000);
            } else if (err.data.errorCode === -1) {
                this.message = 'admin.account.users.New_user.validate_user_failed';
                this.notify(this.message, 'danger', 5000);
            } else {
                this.message = 'admin.account.users.message.failure';
                this.notify(this.message, 'danger', 5000);
            }
        };
        if (user.role._id) {
            user.role = user.role._id;
        }
        if (user.status.key) {
            user.status = user.status.key;
        }
        this._AdminService.createAdmin(user).then(_onSuccess, _onError)
            .catch(() => {
                this.message = 'admin.account.users.message.failure';
                this.notify(this.message, 'danger', 5000);
            })
            .finally(() => {
                this.isLoad = false;
            });
    }
    updateUser(updateUser) {
        $('#userModal').modal('hide');
        const _onSuccess = (res) => {
            this.getAllUsers(this.searchCriteria);
            this.message = 'admin.account.users.New_user.validate_updated_successfully';
            this.notify(this.message, 'success', 500);
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            } else if (err.data.errorCode === -1 || 31) {
                this.message = 'admin.account.users.New_user.validate_user_failed';
                this.notify(this.message, 'danger', 5000);
            } else {
                this.message = 'admin.account.users.message.failure';
                this.notify(this.message, 'danger', 5000);
            }
        };
    // update user to get id's of roles and status only
        if (updateUser.role._id) {
            updateUser.role = updateUser.role._id;
        }
        if (updateUser.status.key) {
            updateUser.status = updateUser.status.key;
        }
        this._AdminService.updateUser(updateUser).then(_onSuccess, _onError)
            .catch(() => {
                this.message = 'admin.account.users.message.failure';
                this.notify(this.message, 'danger', 5000);
            })
            .finally(() => {
                this.usersIsLoading = false;
            });
    }
    onFilterChange() {
        this.searchCriteria.status = this.selectedStatus.key;
        this.searchCriteria.supplierId = this.selectedRole.supplier._id;
        this.currentPage = 1;
        this.searchCriteria.skip = 0;
        this.getAllUsers(this.searchCriteria);
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
    translateStatus(key) {
        const item = this.status.data.find(obj => obj.key === key);
        return this._$translate.use() === 'ar' ? item.ar : item.en;
    }
    translateSupplier(item) {
        return item.supplier.representativeName;
    }
}
AdminAccountOthersCtrl.$inject = ['SupplierService', 'UserService', 'AdminService', 'RoleService', '$translate'];
