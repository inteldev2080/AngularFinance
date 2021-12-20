export default class ResetPasswordCtrl {
    constructor(ForgetPasswordService, $state, $stateParams, $translate) {
        this.ForgetPasswordService = ForgetPasswordService;
        this.$state = $state;
        this._$stateParams = $stateParams;
        this.$translate = $translate;
    }
    $onInit() {
        this.loading = false;
        this.hideForm = true;
        this.formData = { password: '', confirmPassword: '', code: this._$stateParams.code };
    }

    notify(message, type, timeout) {
        this.$translate(message)
            .then((translation) => {
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
    resetPassword() {
        this.loading = true;
        this.isSuccess = false;
        this.isFailure = false;
        this.ForgetPasswordService.resetPassword(this.formData)
       .then(
            // on success
            (res) => {
                this.isSuccess = true;
                this.hideForm = false;
                this.email = res.data.data;
                this.message = 'auth.register.supplier.message.success_change_password';
                this.notify(this.message, 'success', 2000);
                this.$state.go('app.auth.login');
            },
            // on error
            (err) => {
                this.isError = true;
                this.errors = err.data.data;
                this.isFailure = true;
            }
          )
       .catch(() => {
           this.isFailure = true;
       })
       .finally(() => {
           this.loading = false;
       });
    }
}
ResetPasswordCtrl.$inject = ['ForgetPasswordService', '$state', '$stateParams', '$translate'];
