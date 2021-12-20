export default class SystemUnitsCtrl {
    constructor(SystemService, $translate) {
        this._SystemService = SystemService;
        this._$translate = $translate;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.getSystemUnits();
    }

    getSystemUnits() {
        const _onSuccess = (res) => {
            this.unitList = res.data.data;
            this.unitListIsLoaded = true;
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
            }
        };
        const _onFinal = (err) => {

        };
        this._SystemService.getSystemUnits()
            .then(_onSuccess, _onError).finally(_onFinal);
    }


    add() {
        const item = {
            arabicName: this.addArabicUnit,
            englishName: this.addEnglishUnit
        };
        const _onSuccess = (res) => {
            $('body').pgNotification({
                style: 'bar',
                message: 'Done!',
                position: 'top', // 'bottom'
                timeout: 500,
                type: 'success'
            }).show();
            this.getSystemUnits();
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
                $('body').pgNotification({
                    style: 'bar',
                    message: `${err.data.data} :(`,
                    position: 'top', // 'bottom'
                    timeout: 5000,
                    type: 'error'
                }).show();
            }
        };
        const _onFinal = (err) => {
            $('#addNewAppModal').modal('hide');
        };
        this._SystemService.addSystemUnit(item)
            .then(_onSuccess, _onError).finally(_onFinal);
    }


    delete() {
        const _onSuccess = (res) => {
            this.notify('admin.settings.units.success', 'success', 1000);
            this.getSystemUnits();
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
                if (err.data.errorCode === 22) {
                    this.notify('admin.settings.units.failure', 'danger', 5000);
                } else {
                    this.notify('admin.settings.units.unexpectedFailure', 'danger', 5000);
                }
            }
        };
        const _onFinal = (err) => {
            $('#deleteModal').modal('hide');
        };
        this._SystemService.removeSystemUnit(this.unit._id)
            .then(_onSuccess, _onError).finally(_onFinal);
    }


    save() {
        const _onSuccess = (res) => {
            this.getSystemUnits();
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
                this.revert();
                $('body').pgNotification({
                    style: 'bar',
                    message: `${err.data.data} :(`,
                    position: 'top', // 'bottom'
                    timeout: 5000,
                    type: 'error'
                }).show();
            }
        };
        const _onFinal = (err) => {
            $('#EditModel').modal('hide');
        };
        this._SystemService.updateSystemUnit(this.item._id, this.item)
            .then(_onSuccess, _onError).finally(_onFinal);
    }


    revert() {
        this.unitList[this.selectedIndex] = this.original;
        if (this.$root.$$phase !== '$apply' && this.$root.$$phase !== '$digest') {
            this.$apply();
        }
    }


    showModal() {
        $('#addNewAppModal').modal('show');
    }

    showDeleteModal(unit) {
        $('#deleteModal').modal('show');
        this.unit = unit;
    }


    editModal(item, index) {
        this.selectedIndex = index;
        this.original = angular.copy(item);
        this.item = item;
        $('#EditModel').modal('show');
    }

    resetForm(form) {
        this.addArabicUnit = '';
        this.addEnglishUnit = '';
        form.$setPristine();
        form.$setUntouched();
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

SystemUnitsCtrl.$inject = ['SystemService', '$translate'];

