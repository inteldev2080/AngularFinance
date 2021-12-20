function ResetPasswordCtrl(UserService, $translate) {
    const ctrl = this;
    ctrl.resetPassword = (resetPasswordForm) => {
        if (resetPasswordForm.$invalid) return;
        this.Load = true;
       // ctrl.onReset({ newPassword: ctrl.newPassword });
        const _onSuccess = (res) => {
            ctrl.notify('admin.account.users.message.change_password_success', 'success', 5000);
            ctrl.notify('customer.account.users.message.change_password_success', 'success', 5000);
            ctrl.notify('supplier.account.users.message.change_password_success', 'success', 5000);
        };
        const _onError = (err) => {
            ctrl.notify('admin.account.users.message.failure', 'danger', 5000);
            ctrl.notify('customer.account.users.message.change_password_failure', 'danger', 5000);
            ctrl.notify('supplier.account.users.message.change_password_failure', 'danger', 5000);
        };
        UserService.resetPassword(this.userId, ctrl.newPassword)
            .then(_onSuccess, _onError)
            .catch(() => {
                ctrl.notify('admin.account.users.message.failure', 'danger', 5000);
                ctrl.notify('customer.account.users.message.change_password_failure', 'danger', 5000);
                ctrl.notify('supplier.account.users.message.change_password_failure', 'danger', 5000);
            })
            .finally(() => {
                this.Load = false;
                $('#resetPasswordModal').modal('hide');
                ctrl.resetForm(resetPasswordForm);
            });
    };
    ctrl.resetForm = (resetPasswordForm) => {
        ctrl.newPassword = null;
        ctrl.confirmPassword = null;
        // resetPasswordForm.$setValidity();
        resetPasswordForm.$setPristine();
        resetPasswordForm.$setUntouched();
    };
    ctrl.notify = (message, type, timeout) => {
        $translate(message).then((translation) => {
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
    };
}
ResetPasswordCtrl.$inject = ['UserService', '$translate'];

const ResetPassword = {
    bindings: {
        userId: '<',
    },
    controller: ResetPasswordCtrl,
    templateUrl: 'app/components/reset-password/reset-password.component.html'
};

export default ResetPassword;
