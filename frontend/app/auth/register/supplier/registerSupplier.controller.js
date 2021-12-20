import moment from 'moment';

export default class RegisterSupplierCtrl {
    constructor($scope, $state, SupplierService, $rootScope, $translate, Upload, AppConstants, $compile) {
        this.$state = $state;
        this.$scope = $scope;
        this.Upload = Upload;
        this.UPLOAD_URL = AppConstants.UPLOAD_URL;
        this._$translate = $translate;
        this.$rootScope = $rootScope;
        this._SupplierService = SupplierService;
        this.privacyAccept = false;
        this.formData = {};
        this.$compile = $compile;
    }

    $onInit() {
        this.dateMethod = 'Hijri';
        this.$rootScope.enlargePanel = true;
        this.loading = false;
        this.lang = 'en';
        this.$rootScope.$on('languageChangedInApp', (event, data) => {
            if (this._$translate.use() === 'en') {
                this.lang = 'ar';
            } else {
                this.lang = 'en-GB';
            }
            this.$state.reload();
            this.initCalender();
            this.$state.reload();
        });
        if (this._$translate.use() === 'en') {
            this.lang = 'en-GB';
        } else {
            this.lang = 'ar';
        }
        this.initCalender();
    }

    initCalender() {
        angular.element('#commercialRegisterExpireDateIslamic').calendarsPicker({
            calendar: $.calendars.instance('islamic', this.lang),
            monthsToShow: [1, 1],
            maxDate: '+5Y',
            showOtherMonths: false,
            dateFormat: 'yyyy-mmm-dd',
            onSelect(date) {
                document.getElementById('commercialRegisterExpireDateIslamic').value = date;
            }
        });

        angular.element('#commercialRegisterExpireDate').calendarsPicker({
            calendar: $.calendars.instance('gregorian', this.lang),
            monthsToShow: [1, 1],
            maxDate: '+5Y',
            showOtherMonths: false,
            onSelect(date) {
                document.getElementById('commercialRegisterExpireDate').value = date;
            }
        });

        document.getElementById('commercialRegisterExpireDateIslamic').setAttribute('max', this.writeHijri());
        document.getElementById('commercialRegisterExpireDate').setAttribute('max', this.writeGregorian());
    }

    writeHijri() {
        const date = new Date();
        const options = {
            year: 'numeric', month: 'numeric', day: 'numeric'
        };
        return new moment(date.toLocaleString('en' + '-u-ca-islamic', options)).add('Year', 5).format('YYYY-MM-DD').replace(/[\u0660-\u0669\u06f0-\u06f9]/g, c => c.charCodeAt(0) & 0xf);
    }

    writeGregorian() {
        const dateString = new moment().add('Year', 5).format('YYYY-MM-DD');
        return dateString.trim().replace(/[\u0660-\u0669\u06f0-\u06f9]/g, c => c.charCodeAt(0) & 0xf);
    }

    checkFormVat(form) {
        if (!this.formData.VATRegisterPhoto) {
            $('#confirmRegisterSupplier').modal('show');
        } else {
            this.register(form, false);
        }
    }

    register(form, hide) {
        if (hide === true) $('#confirmRegisterSupplier').modal('hide');
        this.form = form;
        this.isFailure = false;
        this.isSuccess = false;
        this.loading = true;
        if (form.$invalid) return;
        this.formData.language = this.$rootScope.currentLanguage.language;
        if (!this.formData.commercialRegisterPhoto) {
            this.notify('auth.register.customer.field.cr_photo.required', 'warning', 5000);
            return;
        }

        this.registerLoading = true;
        this._SupplierService.createSupplier(this.formData)
            .then(
                (res) => {
                    this.isSuccess = true;
                    this.registerLoading = false;
                    if (res.data.data.status === 'Suspended') {
                        this.message = 'auth.register.supplier.message.success_need_approval';
                        this.notify(this.message, 'success', 7000);
                    } else {
                        this.message = 'auth.register.supplier.message.success_creation';
                        this.notify(this.message, 'success', 7000);
                    }
                    this.$rootScope.message = {type: 'success', text: this._$translate.instant(this.message)};
                    this.$state.go('app.auth.login');
                }
                ,
                (err) => {
                    this.registerLoading = false;
                    if (err.code === 500) {
                        this.hasError = true;
                    } else if (err.code === 501) {
                        this.noInternetConnection = true;
                    }
                    if (err.data) {
                        if (err.data.errorCode === 20) {
                            this.isFailure = true;
                            this.message = 'auth.register.supplier.message.expireDate_exceed';
                            // this.notify(this.message, 'danger', 7000);
                        } else if (err.data.errorCode === 21) {
                            this.isFailure = true;
                            this.message = 'auth.register.supplier.message.expireDate_todayOrLess';
                            // this.notify(this.message, 'danger', 7000);
                        } else if (err.data.errorCode === 22) {
                            this.isFailure = true;
                            this.message = 'auth.register.supplier.message.expireDateHijri_exceed';
                            // this.notify(this.message, 'danger', 7000);
                        } else if (err.data.errorCode === 23) {
                            this.isFailure = true;
                            this.message = 'auth.register.supplier.message.expireDateHijri_todayOrLess';
                            // this.notify(this.message, 'danger', 7000);
                        } else if (err.data.errorCode === 3) {
                            // alert('already have account');
                            this.isFailure = true;
                            this.message = 'auth.register.supplier.message.already_have_account';
                            // this.notify(this.message, 'danger', 7000);
                        } else if (err.data.errorCode === 14) {
                            // Only images are allowed (Formats supported: png, jpg, jpeg).
                            this.message = 'auth.register.supplier.message.message.invalidFile';
                            this.isFailure = true;
                            // this.notify(this.message, 'danger', 7000);
                        } else if (err.data.errorCode === 32) {
                            // "errorCode":32,"data":"Commercial Register is duplicate"
                            this.message = 'auth.register.supplier.message.commercialRegisterIsDuplicate';
                            this.isFailure = true;
                            // this.notify(this.message, 'danger', 7000);
                        } else if (err.data.errorCode === 31) {
                            // "errorCode":31,"data":"Email or MobilePhone is duplicate"
                            this.message = 'auth.register.supplier.message.emailOrMobilePhoneIsDuplicate';
                            this.isFailure = true;
                            // this.notify(this.message, 'danger', 7000);
                        } else {
                            this.message = 'auth.register.supplier.message.failed_creation';
                            this.isFailure = true;
                            // this.notify(this.message, 'danger', 7000);
                        }
                    }

                    this.isError = true;
                    this.errors = err.data.data;
                }
            )
            .catch(() => {
                this.isFailure = true;
                this.message = 'auth.register.customer.message.failed_creation';
            })
            .finally(() => {
                this.loading = false;
                // $('#confirmRegisterSupplier').modal('hide');
            });
    }


    uploadFile(file, errFiles, imgFor) {
        if (file) {
        const idxDot = file.name.lastIndexOf('.') + 1;
        const extFile = file.name.substr(idxDot, file.name.length).toLowerCase();
        if (extFile !== 'jpg' && extFile !== 'jpeg' && extFile !== 'png' && extFile !== 'gif' && extFile !== 'pdf') {
            this.notify('auth.register.supplier.message.invalidFile', 'warning', 7000);
            switch (imgFor) {
                case 'coverPhoto' : {
                    this.formData.coverPhoto = null;
                    break;
                }
                case 'commercialRegisterPhoto' : {
                    this.formData.commercialRegisterPhoto = null;
                    this.commercialRegisterPhoto = null;
                    this.isUploadPhoto = true;
                    break;
                }
                case 'VATRegisterPhoto' : {
                    this.formData.VATRegisterPhoto = null;
                    this.VATRegisterPhoto = null;
                    this.isUploadPhoto = true;
                    break;
                }
                default:
            }
            return;
        } else if ((((file.size) / 1024 / 1024) > 12)) {
            this.notify('auth.register.supplier.message.invalidFileSize', 'warning', 7000);
            switch (imgFor) {
                case 'coverPhoto' : {
                    this.formData.coverPhoto = null;
                    break;
                }
                case 'commercialRegisterPhoto' : {
                    this.formData.commercialRegisterPhoto = null;
                    this.commercialRegisterPhoto = null;
                    this.isUploadPhoto = true;
                    break;
                }
                case 'VATRegisterPhoto' : {
                    this.formData.VATRegisterPhoto = null;
                    this.VATRegisterPhoto = null;
                    this.isUploadPhoto = true;
                    break;
                }
                default:
            }
            return;
        }

        this.registerLoading = true;
        const ctrl = this;
        this.errFile = errFiles && errFiles[0];

                file.upload = this.Upload.upload({
                    url: ctrl.UPLOAD_URL,
                    data: {image: file},
                    disableProgress: true,
                    headers: {Accept: 'application/json'}
                });
                file.upload.then((response) => {
                    switch (imgFor) {
                        case 'coverPhoto' : {
                            this.formData.coverPhoto = response.data.data.path;
                            this.registerLoading = false;
                            break;
                        }
                        case 'commercialRegisterPhoto' : {
                            this.commercialPhoto = file.name;                            
                            this.formData.commercialRegisterPhoto = response.data.data.path;
                            this.registerLoading = false;
                            break;
                        }
                        case 'VATRegisterPhoto' : {
                            this.VATPhoto = file.name;
                            this.formData.VATRegisterPhoto = response.data.data.path;
                            this.registerLoading = false;
                            break;
                        }
                        default:
                    }
                }, (response) => {
                    if (response.status > 0) {
                        this.registerLoading = false;
                        this.noFileSelected = true;
                        this.errorMsg = `${response.status}: ${response.data}`;
                    }
                }, (evt) => {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
        } else {
            switch (imgFor) {
                case 'commercialRegisterPhoto' : {
                    this.formData.commercialRegisterPhoto = null;
                    this.commercialRegisterPhoto = null;
                    this.commercialPhoto = false;
                    this.isUploadPhoto = true;
                    break;
                }
                case 'VATRegisterPhoto' : {
                    this.formData.VATRegisterPhoto = null;
                    this.VATRegisterPhoto = null;
                    this.VATPhoto = false;
                    this.isUploadPhoto = true;
                    break;
                }
                default:
            }
            this.noFileSelected = true;
            // this.formData.commercialRegisterPhoto.$pristine = true;
        }
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
RegisterSupplierCtrl.$inject = ['$scope', '$state', 'SupplierService', '$rootScope', '$translate', 'Upload', 'AppConstants', '$compile'];
