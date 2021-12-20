export default class ForgotPasswordCtrl {
    constructor(ForgetPasswordService) {
        this.ForgetPasswordService = ForgetPasswordService;
    }
    $onInit() {
        this.init();
    }
    forgotPassword() {
        this.loading = true;
        this.isSuccess = false;
        this.isFailure = false;
        this.ForgetPasswordService.forgetPassword(this.formData)
      .then(
        // on success
        (res) => {
            if (res.status === 200) {
                this.isSuccess = true;
                this.hideForm = false;
            } else {
                this.isFailure = true;
            }
        },
        // on error
        (err) => {
            this.isError = true;
            this.errors = err.data.data;
        }
        )
      .catch(() => {
          this.isFailure = true;
      })
      .finally(() => {
          this.loading = false;
      });
    }

    init() {
        this.loading = false;
        this.isSuccess = false;
        this.hideForm = true;
        this.formData = { email: '' };
    }
}
ForgotPasswordCtrl.$inject = ['ForgetPasswordService'];
