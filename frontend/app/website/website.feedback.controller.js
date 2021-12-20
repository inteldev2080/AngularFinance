
export default class FeedbackCtrl {
    constructor($scope, ContactService, $translate) {
        this._ContactService = ContactService;
        this._$translate = $translate;
        this._$scope = $scope;
    }

    $onInit() {
        this.selectedCategory = 'Inquiries';
    }

    sendFeedback(form) {
        if (form.$invalid) {
            return;
        }
        this.feedback.status = 'Open';
        this.feedback.category = this.selectedCategory;
        this.isFailure = false;
        this.isSuccess = false;
        this.loading = true;
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.isSuccess = true;
                this.message = 'admin.account.profile.message.password_update_successfully';
                this.notify(this.message, 'success', 500);
            }
        };
        const _onError = (err) => {
            this.isError = true;
            this.message = 'admin.account.profile.message.failure';
            this.notify(this.message, 'danger', 5000);
            this.errors = err.data.data;
        };
        this._ContactService.save(this.feedback)
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

FeedbackCtrl.$inject = ['$scope', 'ContactService', '$translate'];

