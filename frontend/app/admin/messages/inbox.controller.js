/* eslint-disable no-param-reassign */
export default class InboxCtrl {
    constructor($scope, $stateParams, $state, $timeout, $window, ContactService, $sce, JwtService, $translate) {
        this._ContactService = ContactService;
        this.JwtService = JwtService;
        this._$timeout = $timeout;
        this._$sce = $sce;
        this.$translate = $translate;
    }

    $onInit() {
        this.summernote_options = {
            height: 100,
            onfocus(e) {
                $('body').addClass('overlay-disabled');
            },
            onblur(e) {
                $('body').removeClass('overlay-disabled');
            },
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
            ],
        };
        this.user = this.JwtService.getCurrentUser();
        this.getContactList();
    }

    getContactList() {
        const _onSuccess = (res) => {
            this.emails = res.data.data;
            this.unitListIsLoaded = true;
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
            }
        };
        const _onFinal = (err) => {
            this.emailListisLoaded = true;
        };
        this._ContactService.query()
            .then(_onSuccess, _onError).finally(_onFinal);
    }


    showInbox() {
        this._$timeout(() => {
            if ($.Pages.isVisibleSm() || $.Pages.isVisibleXs()) {
                $('.split-list').toggleClass('slideLeft');
            }
        });
    }

    delete(message) {
        const _onSuccess = (res) => {
            this.emailContent = null;
            // $('body').pgNotification({
            //     style: 'bar',
            //     message: 'The message has been deleted successfully!',
            //     position: 'top', // 'bottom'
            //     timeout: 500,
            //     type: 'success'
            // }).show();
            this.message = 'admin.messages.deleted_successfully';
            this.notify(this.message, 'success', 500);
            this.getContactList();
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
            }
        };
        const _onFinal = (err) => {

        };
        this._ContactService.remove(message._id)
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    changeCategory(message, category) {
        message.category = category;

        const _onSuccess = (res) => {
            this.emailContent = null;
            $('body').pgNotification({
                style: 'bar',
                message: 'Done!',
                position: 'top', // 'bottom'
                timeout: 500,
                type: 'success'
            }).show();
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
                $('body').pgNotification({
                    style: 'bar',
                    message: 'error',
                    position: 'top', // 'bottom'
                    timeout: 3000,
                    type: 'error'
                }).show();
            }
        };
        const _onFinal = (err) => {

        };
        this._ContactService.update(message._id, message)
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    reopen(message) {
        message.status = 'Open';

        const _onSuccess = (res) => {
            this.emailContent = null;
            $('body').pgNotification({
                style: 'bar',
                message: 'Done!',
                position: 'top', // 'bottom'
                timeout: 500,
                type: 'success'
            }).show();
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
                $('body').pgNotification({
                    style: 'bar',
                    message: 'error',
                    position: 'top', // 'bottom'
                    timeout: 3000,
                    type: 'error'
                }).show();
            }
        };
        const _onFinal = (err) => {

        };
        this._ContactService.update(message._id, message)
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    solved(message) {
        message.status = 'Closed';

        const _onSuccess = (res) => {
            this.emailContent = null;
            $('body').pgNotification({
                style: 'bar',
                message: 'Done!',
                position: 'top', // 'bottom'
                timeout: 500,
                type: 'success'
            }).show();
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
                $('body').pgNotification({
                    style: 'bar',
                    message: 'error',
                    position: 'top', // 'bottom'
                    timeout: 3000,
                    type: 'error'
                }).show();
            }
        };
        const _onFinal = (err) => {

        };
        this._ContactService.update(message._id, message)
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    send(message, replyMessage) {
        const reply = {
            reply: `${replyMessage}`,
            user: `${this.emailContent.user.email}`,
            language: this.$translate.use()
        };
        this.replyMessage = '';
        message.replies.push(reply);
        const _onSuccess = (res) => {
            this.emailContent = null;
            $('body').pgNotification({
                style: 'bar',
                message: 'Done!',
                position: 'top', // 'bottom'
                timeout: 500,
                type: 'success'
            }).show();
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
                $('body').pgNotification({
                    style: 'bar',
                    message: 'error',
                    position: 'top', // 'bottom'
                    timeout: 3000,
                    type: 'error'
                }).show();
            }
        };
        const _onFinal = (err) => {

        };
        this._ContactService.reply(message._id, reply)
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    view(email) {
        this.emailContent = email;
        this.replyMessage = '';
        this.emailHTML = this._$sce.trustAsHtml(email.message.body);
        this._$timeout(() => {
            if ($.Pages.isVisibleSm() || $.Pages.isVisibleXs()) {
                $('.split-list').toggleClass('slideLeft');
            }
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

InboxCtrl.$inject = ['$scope', '$stateParams', '$state', '$timeout', '$window', 'ContactService', '$sce', 'JwtService', '$translate'];

