export default class CustomerAccountUerCtrl {
    constructor(UserService, CustomerService, RoleService, $translate) {
        this._UserService = UserService;
        this._CustomerService = CustomerService;
        this._RoleService = RoleService;
        this._$translate = $translate;
        this.customerUsers = [];
        this.errors = [];
        this.totalPages = 0;
        this.isStaff = false;
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
        this.getCustomerStaff(this.searchCriteria, 1);
        this.getRoles();
    }
    getCustomerStaff(searchCriteria) {
        this.usersIsLoading = true;
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.customerUsers = res.data.data.staff;
                this.totalPages = Math.ceil(res.data.data.count / this.searchCriteria.limit);
                this.isStaff = res.data.data.isStaff;
            }
        };
        const _onError = (err) => {
            this.errors = err.data;
        };
        this._CustomerService.getCustomerStaff(searchCriteria)
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
    createCustomerStaffMember(user) {
        this.isLoad = true;
        $('#userModal').modal('hide');

        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.user = res.data.data;
                this.getCustomerStaff(this.searchCriteria);
                // $('#userModal').modal('hide');
                this.notify('customer.account.users.message.success.add', 'success', 1000);
            } else if (res.data.errorCode === -1 || 31) {
                this.notify('customer.account.users.message.failure', 'danger', 5000);
            } else {
                this.notify('customer.account.users.message.unexpected_failure', 'danger', 5000);
            }
        };

        const _onError = (err) => {
            if (err.data.errorCode === -1 || 31) {
                this.notify('customer.account.users.message.failure', 'danger', 5000);
            } else {
                this.notify('customer.account.users.message.unexpected_failure', 'danger', 5000);
            }
            this.errors = err.data;
        };
        if (user.role._id) {
            user.role = user.role._id;
        }
        if (user.status.key) {
            user.status = user.status.key;
        }
        this._CustomerService.createCustomerStaffMember(user)
            .then(_onSuccess, _onError)
            .catch((e) => {
            })
            .finally(() => {
                this.isLoad = false;
                user = {};
            });
    }
    updateUser(updateUser) {
        $('#userModal').modal('hide');
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.getCustomerStaff(this.searchCriteria);
                this.notify('customer.account.users.message.success.update', 'success', 1000);
            } else if (res.data.errorCode === -1 || 31) {
                this.notify('customer.account.users.message.failure', 'danger', 5000);
            } else {
                this.notify('customer.account.users.message.unexpected_failure', 'danger', 5000);
            }
        };
        const _onError = (err) => {
            if (err.data.errorCode === -1 || 31) {
                this.notify('customer.account.users.message.failure', 'danger', 5000);
            } else {
                this.notify('customer.account.users.message.unexpected_failure', 'danger', 5000);
            }
            this.errors = err.data;
        };
        // update user to get id's of roles and status only
        if (updateUser.role._id) {
            updateUser.role = updateUser.role._id;
        }
        if (updateUser.status.key) {
            updateUser.status = updateUser.status.key;
        }
        this._CustomerService.updateCustomerStaffMember(updateUser)
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
        this.getCustomerStaff(this.searchCriteria);
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
        this.getCustomerStaff(this.searchCriteria, pageNumber);
    }
    translateStatus(key) {
        const item = this.status.data.find(obj => obj.key === key);
        return this._$translate.use() === 'ar' ? item.ar : item.en;
    }
    translateRole(item) {
        return this._$translate.use() === 'ar' ? item.arabicName : item.englishName;
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
}

CustomerAccountUerCtrl.$inject = ['UserService', 'CustomerService', 'RoleService', '$translate'];
