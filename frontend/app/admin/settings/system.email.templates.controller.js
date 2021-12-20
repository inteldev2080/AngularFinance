/* eslint-disable no-unused-vars,no-param-reassign */
export default class EmailTemplatesCtrl {
    constructor($scope, SystemService) {
        this._SystemService = SystemService;
        this._$scope = $scope;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.summernote_options = {
            height: 200,
            onfocus(e) {
                $('body').addClass('overlay-disabled');
            },
            onblur(e) {
                $('body').removeClass('overlay-disabled');
            },
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                // ['insert', ['link', 'hr']],
                    ['view', ['codeview']],
            ],
        };
        this.summernote_options_arabic = {
            height: 200,
            dialogsInBody: true,
            onfocus(e) {
                $('body').addClass('overlay-disabled');
            },
            onblur(e) {
                $('body').removeClass('overlay-disabled');
            },
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                // ['insert', ['link', 'hr']],
                ['view', ['codeview']],
            ],
            direction: 'rtl'
        };
        this.getEmailTemplateList();
    }

    getEmailTemplateList() {
        const _onSuccess = (res) => {
            this.templates = res.data.data;
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
            }
        };
        const _onFinal = (err) => {
            this.templatesIsLoaded = true;
        };
        this._SystemService.getEmailTemplateList()
            .then(_onSuccess, _onError).finally(_onFinal);
    }


    save(title, obj) {
        const newTemplate = {
            type: title,
            arabicTitle: obj.template.ar.title,
            arabicBody: obj.template.ar.body,
            englishTitle: obj.template.en.title,
            englishBody: obj.template.en.body,
        };
        const _onSuccess = (res) => {
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
        this._SystemService.updateEmailTemplate(newTemplate)
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    reset(title, obj) {
        const _onSuccess = (res) => {
            $('body').pgNotification({
                style: 'bar',
                message: 'Done!',
                position: 'top', // 'bottom'
                timeout: 500,
                type: 'success'
            }).show();
           this.getEmailTemplateList();
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
        this._SystemService.resetEmailTemplate({ title })
            .then(_onSuccess, _onError).finally(_onFinal);
    }


}

EmailTemplatesCtrl.$inject = ['$scope', 'SystemService'];

