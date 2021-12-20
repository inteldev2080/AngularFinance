export default class SystemCMSCtrl {
    constructor(SystemService, $translate) {
        this._SystemService = SystemService;
        this.$translate = $translate;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.addItem = {};
        this.STATUS_LIST = {
            placeholder: { ar: 'اختر الحاله', en: 'Select Status' },
            data: [
                { key: 'PUBLISHED', ar: 'منشور', en: 'PUBLISHED' },
                { key: 'APPROVED', ar: 'موافق عليه', en: 'APPROVED' }
            ]
        };
        this.newContent = {};
        this.selectedStatus = this.STATUS_LIST.data[0];
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
            direction: 'ltr'
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
        this.getCMSContentList();
    }

    showModal() {
        $('#addNewAppModal')
            .modal('show');
    }

    editModal(item, index) {
        this.selectedIndex = index;
        this.original = angular.copy(item);
        this.item = item;
        this.selectedStatus = this.STATUS_LIST.data.find(i => i.key === this.item.status);
        $('#EditModel')
            .modal('show');
    }

    getCMSContentList() {
        this.unitListIsLoaded = false;
        const _onSuccess = (res) => {
            this.cmsList = res.data.data;
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
            }
        };
        const _onFinal = (err) => {
            this.unitListIsLoaded = true;
        };
        this._SystemService.getCMSContentList()
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    add(cmsForm) {
        if (cmsForm.$invalid) return;
        this.newContent.user = 'Admin';
        this.newContent.status = this.selectedStatus.key;
        $('#addNewAppModal')
            .modal('hide');
        const _onSuccess = (res) => {
            this.notify('admin.settings.message.success', 'success', 2000);
            this.getCMSContentList();
        };
        const _onError = (err) => {
            this.notify('admin.settings.message.error', 'danger', 2000);
        };
        const _onFinal = (err) => {
            this.newContent = {};
        };
        this._SystemService.addCMSContent(this.newContent)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    reset() {
        this.newContent = {};
        this.newContent.status = this.STATUS_LIST.data[0];
    }

    delete() {
        this._SystemService.removeCMSContent(this.item.key).then((response) => {
            this.notify('admin.settings.message.success', 'success', 2000);
            $('#deleteModal').modal('hide');
            this.getCMSContentList();
        }, (err) => {
            this.notify('admin.settings.message.error', 'danger', 2000);
        });
    }

    revert() {
        this.content[this.selectedIndex] = this.original;
        if (this.$root.$$phase != '$apply' && this.$root.$$phase != '$digest') {
            this.$apply();
        }
    }

    save() {
        $('#EditModel').modal('hide');
        this.item.status = this.selectedStatus.key;

        this._SystemService.updateCMSContent(this.item.key, this.item).then((response) => {
            this.notify('admin.settings.message.success', 'success', 2000);
            this.getCMSContentList();
        }, (err) => {
            this.notify('admin.settings.message.error', 'danger', 2000);
            this.getCMSContentList();
        });
    }

    showDeleteModal(item) {
        $('#deleteModal').modal('show');
        this.item = item;
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
    translateStatus(key) {
        const item = this.STATUS_LIST.data.find(obj => obj.key === key);
        return this.$translate.use() === 'ar' ? item.ar : item.en;
    }
}

SystemCMSCtrl.$inject = ['SystemService', '$translate'];
