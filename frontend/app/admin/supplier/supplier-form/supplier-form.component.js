import moment from 'moment';

class SupplierFormCtrl {
    constructor(SupplierService, $translate, $rootScope, Upload,
    AppConstants) {
        this._SupplierService = SupplierService;
        this._$translate = $translate;
        this.$rootScope = $rootScope;
        this.Upload = Upload;
        this.UPLOAD_URL = AppConstants.UPLOAD_URL;
    }
    $onInit() {
        const ctrl = this;
        this.dateMethod = 'Hijri';
        moment.locale('en');
        this.formData = {};
        this.imageValitation = false;
        this.registerLoading = false;
        $.Pages.init();
        this.formData.commercialRegisterExpireDate = null;
        this.formData.commercialRegisterExpireDateIslamic = null;
        // new Date(moment().format('YYYY-MM-DD'));
        // $('#supplierFormModal').on('hide.bs.modal', () => {
        //     ctrl.resetForm();
        // });
        angular.element('#commercialRegisterExpireDateIslamic').calendarsPicker({
            calendar: $.calendars.instance('islamic'),
            monthsToShow: [1, 1],
            maxDate: '+5Y',
            showOtherMonths: false,
            dateFormat:'yyyy-mmm-dd',
            onSelect(date) {
                document.getElementById('commercialRegisterExpireDateIslamic').value = date;
            }
        });

        angular.element('#commercialRegisterExpireDate').calendarsPicker({
            calendar: $.calendars.instance('gregorian'),
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
    createSupplier(supplierForm) {
        if (supplierForm.$invalid) return;
        this.isFailure = false;
        this.isSuccess = false;
        this.registerLoading = true;
        this.loading = true;
        this.formData.language = this.$rootScope.currentLanguage.language;
       // this.formData.commercialRegisterExpireDate = moment(this.formData.commercialRegisterExpireDate).format('YYYY-MM-DD');
        this._SupplierService.createSupplier(this.formData, true)
            .then(
                (res) => {
                    this.isSuccess = true;
                    this.message = 'admin.suppliers.create-supplier.message.success_creation';
                    this.notify(this.message, 'success', 3000);
                    this.$rootScope.$broadcast('getSuppliers');
                    $('#supplierFormModal').modal('hide');
                    this.resetForm(supplierForm);
                },
                (err) => {
                    if (err.code === 500) {
                        this.hasError = true;
                        $('#supplierFormModal').modal('hide');
                    } else if (err.code === 501) {
                        this.noInternetConnection = true;
                        $('#supplierFormModal').modal('hide');
                    }
                    if (err.data) {
                        if (err.data.errorCode === 20) {
                            this.isFailure = true;
                            this.message = 'admin.suppliers.create-supplier.message.expireDate_exceed';
                            this.notify(this.message, 'danger', 7000);
                        } else if (err.data.errorCode === 21) {
                            this.isFailure = true;
                            this.message = 'admin.suppliers.create-supplier.message.expireDate_todayOrLess';
                            this.notify(this.message, 'danger', 7000);
                        } else if (err.data.errorCode === 22) {
                            this.isFailure = true;
                            this.message = 'admin.suppliers.create-supplier.message.expireDateHijri_exceed';
                            this.notify(this.message, 'danger', 7000);
                        } else if (err.data.errorCode === 23) {
                            this.isFailure = true;
                            this.message = 'admin.suppliers.create-supplier.message.expireDateHijri_todayOrLess';
                            this.notify(this.message, 'danger', 7000);
                        } else if (err.data.errorCode === 3) {
                        // alert('already have account');
                            this.isFailure = true;
                            this.message = 'admin.suppliers.create-supplier.message.already_have_account';
                            this.notify(this.message, 'danger', 5000);
                            $('#supplierFormModal').modal('hide');
                        } else if (err.data.errorCode === 14) {
                        // Only images are allowed (Formats supported: png, jpg, jpeg).
                            this.message = 'admin.suppliers.create-supplier.message.invalidFile';
                            this.isFailure = true;
                            this.notify(this.message, 'danger', 5000);
                        } else if (err.data.errorCode === 32) {
                            // "errorCode":32,"data":"Commercial Register is duplicate"
                            this.message = 'admin.suppliers.create-supplier.message.commercialRegisterIsDuplicate';
                            this.isFailure = true;
                            this.notify(this.message, 'danger', 5000);
                            $('#supplierFormModal').modal('hide');
                        } else if (err.data.errorCode === 31) {
                            // "errorCode":31,"data":"Email or MobilePhone is duplicate"
                            this.message = 'admin.suppliers.create-supplier.message.emailOrMobilePhoneIsDuplicate';
                            this.isFailure = true;
                            this.notify(this.message, 'danger', 5000);
                            $('#supplierFormModal').modal('hide');
                        } else {
                            this.message = 'admin.suppliers.create-supplier.message.failed_creation';
                            this.isFailure = true;
                            this.notify(this.message, 'danger', 5000);
                            $('#supplierFormModal').modal('hide');
                        }
                    }

                    this.isError = true;
                    this.errors = err.data.data;
                }
            )
            .catch(() => {
                this.isFailure = true;
                this.message = 'admin.suppliers.create-supplier.message.failed_creation';
                this.notify(this.message, 'danger', 5000);
            })
            .finally(() => {
                // this.resetForm(supplierForm);
                this.loading = false;
                this.registerLoading = false;
            });
    }
    //  this.formData.commercialRegisterPhoto = res.data.data.filename;
    uploadCommercialRegisterPhoto(file) {
        const ctrl = this;
        if (file) {
            this.commercialPhoto = file.name;
            this.Upload.base64DataUrl(file).then((base64Urls) => {
                ctrl.formData.commercialRegisterPhoto = base64Urls;
                ctrl.commercialRegisterPhoto = file;
            });
        }
    }

    uploadFile(file, errFiles, imgFor) {
        if (file) {
        const idxDot = file.name.lastIndexOf('.') + 1;
        const extFile = file.name.substr(idxDot, file.name.length).toLowerCase();
        this.registerLoading = true;
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
                    this.registerLoading = false;
                    break;
                }
                case 'VATRegisterPhoto' : {
                    this.formData.VATRegisterPhoto = null;
                    this.VATRegisterPhoto = null;
                    this.registerLoading = false;
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
                    this.registerLoading = false;
                    break;
                }
                case 'VATRegisterPhoto' : {
                    this.formData.VATRegisterPhoto = null;
                    this.VATRegisterPhoto = null;
                    this.registerLoading = false;
                    break;
                }
                default:
            }
            return;
        }
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
                            this.formData.coverPhoto = response.data.data.filename;
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
                        this.errorMsg = `${response.status}: ${response.data}`;
                    }
                }, (evt) => {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
        } else {
            switch (imgFor) {
                case 'coverPhoto' : {
                    this.formData.coverPhoto = null;
                    break;
                }
                case 'commercialRegisterPhoto' : {
                    this.formData.commercialRegisterPhoto = null;
                    this.commercialPhoto = null;
                    this.registerLoading = false;
                    break;
                }
                case 'VATRegisterPhoto' : {
                    this.formData.VATRegisterPhoto = null;
                    this.VATPhoto = null;
                    this.registerLoading = false;
                    break;
                }
                default:
            }
            this.noFileSelected = true;
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
    resetForm(supplierForm) {
        this.formData = {};
        this.formData.commercialRegisterExpireDate =
            new Date(moment().format('YYYY-MM-DD'));
        // userForm.$setValidity();
        this.commercialPhoto = null;
        this.VATPhoto = null;
        this.formData.commercialRegisterPhoto = null;
        this.commercialRegisterPhoto = null;
        this.formData.VATRegisterPhoto = null;
        this.VATRegisterPhoto = null;
        if (supplierForm) {
            supplierForm.$setPristine();
            supplierForm.$setUntouched();
        }
    }
}
SupplierFormCtrl.$inject = ['SupplierService', '$translate', '$rootScope', 'Upload',
    'AppConstants'];


const SupplierFormComponent = {
    bindings: {
    },
    templateUrl: 'app/admin/supplier/supplier-form/supplier-form.component.html',
    controller: SupplierFormCtrl
};
export default SupplierFormComponent;

