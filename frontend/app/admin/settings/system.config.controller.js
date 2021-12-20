export default class SystemConfigCtrl {
    constructor($scope, SystemService, $translate) {
        this._SystemService = SystemService;
        this.$translate = $translate;
    }
    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.typeList = ['STRING', 'BOOLEAN', 'NUMBER', 'HTML'];
        this.new = {};
        this.config = {};
        this.config.type = this.typeList[0];
        this.getSystemConfigList();
    }
    getSystemConfigList() {
        this.hasError = false;
        const _onSuccess = (res) => {
            this.systemConfigList = res.data.data;
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
            }
        };
        const _onFinal = (err) => {
            this.configListIsLoaded = true;
        };
        this._SystemService.getSystemConfigList()
                .then(_onSuccess, _onError).finally(_onFinal);
    }
    showModal() {
        this.config = {};
        this.config.type = this.typeList[0];
        $('#addNewAppModal').modal('show');
    }
    editModal(item) {
        this.item = item;
        $('#EditModel').modal('show');
    }
    add(configForm) {
        if (configForm.$invalid) return;
        this.config.isSerializable = true;
        this.config.isHidden = false;
        $('#addNewAppModal').modal('hide');
        const _onSuccess = (res) => {
            this.notify('admin.settings.message.success', 'success', 2000);
            this.config = {};
            this.getSystemConfigList();
        };
        const _onError = (err) => {
            this.errors = err.data.data;
            this.notify('admin.settings.message.error', 'danger', 2000);
        };
        const _onFinal = (err) => {
        };
        this._SystemService.addSystemConfig(this.config)
            .then(_onSuccess, _onError).finally(_onFinal);
    }
    delete(item) {
        const _onSuccess = (res) => {
            this.notify('admin.settings.message.success', 'success', 2000);
            this.getSystemConfigList();
        };
        const _onError = (err) => {
            this.notify('admin.settings.message.error', 'success', 2000);
        };
        const _onFinal = (err) => {
        };
        this._SystemService.removeSystemConfig(item._id)
            .then(_onSuccess, _onError).finally(_onFinal);
    }
    save() {
        $('#EditModel').modal('hide');
        const _onSuccess = (res) => {
            this.notify('admin.settings.message.success', 'success', 2000);
            this.getSystemConfigList();
            /* const index = this.systemConfigList.indexOf(item);
            this.systemConfigList.splice(index, 1);*/
        };
        const _onError = (err) => {
            this.errors = err.data.data;
            this.notify('admin.settings.message.error', 'success', 2000);
        };
        const _onFinal = (err) => {
        };
        this._SystemService.updateSystemConfig(this.item._id, this.item)
            .then(_onSuccess, _onError).finally(_onFinal);
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
    resetModal() {
        this.config = {};
        this.config.type = this.typeList[0];
    }
    confirmDelete() {
        $('#deleteModal').modal('hide');
        this.delete(this.item);
    }
    openDeleteConfirmMessage(item) {
        this.item = item;
        $('#deleteModal').modal('show');
    }
}

SystemConfigCtrl.$inject = ['$scope', 'SystemService', '$translate'];
