export default class AdminAccountProfileCtrl {
    constructor(UserService, AdminService, JwtService, $translate) {
        this._UserService = UserService;
        this._AdminService = AdminService;
        this.JwtService = JwtService;
        this.$translate = $translate;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.user = this.JwtService.getCurrentUser();
    }

    updateMyProfile(form) {
        if (form.$invalid) {
            return;
        }
        this.isProfielFailure = false;
        this.isProfielSuccess = false;
        this.isProfielLoading = true;

        const user = {
            email: this.user.email,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            mobileNumber: this.user.mobileNumber
        };
        this.user = user;
        const _onSuccess = (res) => {
            if (res.status !== 200) {
                if (res.data.errorCode === 3) {
                    this.isProfielFailure = true;
                    this.message = 'admin.account.profile.message.duplicate-data';
                    this.notify(this.message, 'danger', 5000);
                }
            } else {
                this._UserService.current = res.data.data;
                this.JwtService.save(res.data.data);
                this.isProfielSuccess = true;
                this.message = 'admin.account.profile.message.profile_update_successfully';
                this.notify(this.message, 'success', 500);
            }
        };
        const _onError = (err) => {
            this.isError = true;
            this.message = 'admin.account.profile.message.failure';
            this.notify(this.message, 'danger', 5000);
            this.errors = err.data.data;
        };
        this._AdminService.updateMyProfile(this.user)
            .then(_onSuccess, _onError)
            .catch(() => {
                this.isProfielFailure = true;
                this.message = 'admin.account.profile.message.failure';
                this.notify(this.message, 'danger', 5000);
            })
            .finally(() => {
                this.isProfielLoading = false;
            });
    }

    changePassword(form) {
        if (form.$invalid) {
            return;
        }
        this.isFailure = false;
        this.isSuccess = false;
        this.loading = true;
        const _onSuccess = (res) => {
            this.isSuccess = true;
            this.message = 'admin.account.profile.message.password_update_successfully';
            this.notify(this.message, 'success', 500);
            this.oldPassword = '';
            this.newPassword = '';
        };
        const _onError = (err) => {
            this.isError = true;
            if (err.data.errorCode === 15) {
                this.isFailure = true;
                this.message = 'admin.account.profile.message.old_password_incorrect';
                this.notify(this.message, 'danger', 5000);
            } else {
                this.message = 'admin.account.profile.message.failure';
                this.notify(this.message, 'danger', 5000);
                this.errors = err.data.data;
            }
        };
        this._UserService.changePassword(this.oldPassword, this.newPassword)
            .then(_onSuccess, _onError)
            .catch(() => {
                this.isFailure = true;
                this.message = 'admin.account.profile.message.failure';
                this.notify(this.message, 'danger', 5000);
            })
            .finally(() => {
                this.loading = false;
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

}

AdminAccountProfileCtrl.$inject = ['UserService', 'AdminService', 'JwtService', '$translate'];
