import moment from 'moment';

export default class SupplierAccountProfileCtrl {
    constructor(SupplierService, UserService, NgMap, $translate, Upload,
                AppConstants, $base64, $rootScope, CustomerService) {
        const controller = this;
        this._SupplierService = SupplierService;
        this._UserService = UserService;
        this._$translate = $translate;
        this.photoloading = false;
        this.base64ImageIsLoading = false;
        this.placeChanged = function () {
            NgMap.getMap('map').then((map) => {
                this.map = map;
                this.place = this.getPlace();
                controller.supplier.location
                    .coordinates = [this.place.geometry.location.lat(),
                        this.place.geometry.location.lng()];
                // controller.supplier.address =
                // this.map.setCenter(this.place.geometry.location);
            });
        };
        this.markerDragEnd = function (event) {
            controller.supplier.location.coordinates = [event.latLng.lat(), event.latLng.lng()];
            controller.geocodeLatLng(event.latLng.lat(), event.latLng.lng());
        };
        this.Upload = Upload;
        this.UPLOAD_URL = AppConstants.UPLOAD_URL;
        this.$base64 = $base64;
        this.$rootScope = $rootScope;
        this.base64FileToShow = null;
        this._CustomerService = CustomerService;
    }

    $onInit() {
        this.dateMethod = 'Hijri';
        $.Pages.init(); // eslint-disable-line
        moment.locale('en');
        this.getProfileInfo();
        this.load = true;
        this.isUploadPhoto = false;

        angular.element('#commercialRegisterExpireDateIslamic').calendarsPicker({
            calendar: $.calendars.instance('islamic'),
            monthsToShow: [1, 1],
            maxDate: '+5Y',
            showOtherMonths: false,
            dateFormat: 'yyyy-mmm-dd',
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

        // document.getElementById('commercialRegisterExpireDateIslamic').setAttribute('max', this.writeHijri());
        // document.getElementById('commercialRegisterExpireDate').setAttribute('max', this.writeGregorian());
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

    getProfileInfo() {
        this.profileIsloading = true;
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.supplier = res.data.data;
                this.coverPhoto = this.supplier.coverPhoto;
                // image id
                this.supplier.coverPhoto = this.supplier.coverPhoto.split('/')[4];
                if(this.supplier.commercialRegisterExpireDate !== null) {
                    this.supplier.commercialRegisterExpireDate = new Date(moment(
                        new Date(this.supplier.commercialRegisterExpireDate)).format('YYYY-MM-DD'));
                }
                if(this.supplier.commercialRegisterExpireDateIslamic !== null) {
                    
                    this.supplier.commercialRegisterExpireDateIslamic = new Date(moment(
                        new Date(this.supplier.commercialRegisterExpireDateIslamic)).format('YYYY-MM-DD'));
                }
                this.commercialRegisterPhoto = this.supplier.commercialRegisterPhoto.split('/')[6];
                // this.supplier.commercialRegisterPhoto = this.supplier.commercialRegisterPhoto.split('/')[6];
                // this.supplier.VATRegisterPhoto = this.supplier.VATRegisterPhoto.split('/')[6];
                this.VATPhoto = this.supplier.VATRegisterPhoto.split('/')[6];
                this.base64FileToShow = this.supplier.commercialRegisterPhoto;
            } else {
                this.profilLoadingIsFailure = true;
                this.message = 'supplier.account.profile.message.failure';
            }
        };
        
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._SupplierService.getProfileInfo()
            .then(_onSuccess, _onError)
            .catch(() => {
                this.profilLoadingIsFailure = true;
                this.message = 'supplier.account.profile.message.failure';
            })
            .finally(() => {
                this.profileIsloading = false;
                if (!this.supplier.location.address) {
                    this.message = 'supplier.account.profile.message.address_missing';
                    this.notify(this.message, 'warning', 7000);
                }
            });
    }

    updateMyProfile(profileForm) {
        if (profileForm.$invalid) return;
        this.profileFormIsFailure = false;
        this.profileFormIsSuccess = false;
        this.profileFormIsLoading = true;
        // this.supplier.commercialRegisterPhoto = this.commercialRegisterPhoto;
        // this.supplier.VATRegisterPhoto = this.VATPhoto;
        if (moment(
            new Date(this.supplier.commercialRegisterExpireDate)).format('YYYY') <= 1970) {
            this.supplier.commercialRegisterExpireDate = null;
        }
        if (moment(
            new Date(this.supplier.commercialRegisterExpireDateIslamic)).format('YYYY') === 1970) {
            this.supplier.commercialRegisterExpireDateIslamic = null;
        }
        const _onSuccess = (res) => {
            if (res.status === 200) {
                // this._UserService.current = res.data.data;
                this.supplier = res.data.data;
                // this.supplier.commercialRegisterExpireDate = new Date(moment(
                //         new Date(this.supplier.commercialRegisterExpireDate)).format('YYYY-MM-DD'));
                // this.$rootScope.$broadcast('profileUpdated', { firstName: this.customer.user.firstName, lastName: this.customer.user.lastName });
                this._UserService.updateUser(this.supplier.user.firstName, this.supplier.user.lastName);
                this.profileFormIsSuccess = true;
                this.message = 'supplier.account.profile.message.profile_update_successfully';
                this.notify(this.message, 'success', 500);
            } else if (res.data.errorCode === 3) {
                this.profileFormIsFailure = true;
                this.message = 'supplier.account.profile.message.duplicate-data';
                this.notify(this.message, 'danger', 5000);
            } else {
                this.profileFormIsFailure = true;
                this.message = 'supplier.account.profile.message.failure';
                this.notify(this.message, 'danger', 5000);
            }
        };
        const _onError = (err) => {
            if (err.data.errorCode === 20) {
                this.profileFormIsFailure = true;
                this.message = 'supplier.account.profile.message.expireDate_exceed';
                this.notify(this.message, 'danger', 7000);
            } else if (err.data.errorCode === 21) {
                this.profileFormIsFailure = true;
                this.message = 'supplier.account.profile.message.expireDate_todayOrLess';
                this.notify(this.message, 'danger', 7000);
            } else if (err.data.errorCode === 22) {
                this.profileFormIsFailure = true;
                this.message = 'supplier.account.profile.message.expireDateHijri_exceed';
                this.notify(this.message, 'danger', 7000);
            } else if (err.data.errorCode === 23) {
                this.profileFormIsFailure = true;
                this.message = 'supplier.account.profile.message.expireDateHijri_todayOrLess';
                this.notify(this.message, 'danger', 7000);
            } else {
                this.profileFormIsFailure = true;
                this.message = 'supplier.account.profile.message.failure';
                this.errors = err.data.data;
            }
        };
        this._SupplierService.updateSupplier(this.supplier)
            .then(_onSuccess, _onError)
            .catch(() => {
                this.profileFormIsFailure = true;
                this.message = 'supplier.account.profile.message.failure';
                this.notify(this.message, 'danger', 5000);
            })
            .finally(() => {
                this.profileFormIsLoading = false;
                this.getProfileInfo();
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

    resetPassword(resetForm) {
        if (resetForm.$invalid) return;
        this.resetFormIsLoading = true;
        this.resetFormIsSuccess = false;
        this.resetFormIsFailure = false;
        const _onSuccess = (res) => {
            this.resetFormIsSuccess = true;
            this.message = 'supplier.account.profile.message.password_update_successfully';
            this.notify(this.message, 'success', 5000);
        };
        const _onError = (err) => {
            this.isError = true;
            if (err.data.errorCode === 15) {
                this.resetFormIsFailure = true;
                this.message = 'supplier.account.profile.message.old_password_incorrect';
            } else {
                this.message = 'supplier.account.profile.message.failure';
                this.errors = err.data.data;
            }
            this.notify(this.message, 'danger', 5000);
        };
        this._UserService.changePassword(this.oldPassword, this.newPassword)
            .then(_onSuccess, _onError)
            .catch(() => {
                this.resetFormIsFailure = true;
                this.message = 'supplier.account.profile.message.failure';
                this.notify(this.message, 'danger', 5000);
            })
            .finally(() => {
                this.resetFormIsLoading = false;
            });
    }

    uploadFile(file, errFiles, imgFor) {
        if (file) {
        switch (imgFor) {
            case 'coverPhoto' : {
                this.supplier.coverPhoto = null;
                this.profileFormIsLoading = true;
                this.isUploadPhoto = true;
                break;
            }
            case 'commercialRegisterPhoto' : {
                this.supplier.commercialRegisterPhoto = null;
                break;
            }
            default:
        }
        const ctrl = this;
        this.errFile = errFiles && errFiles[0];
        this.base64ImageIsLoading = true;

          /*  if (imgFor === 'commercialRegisterPhoto') {
                this.filename = file.name;
                this.base64ImageIsLoading = true;
                this.Upload.base64DataUrl(file).then((base64Urls) => {
                    ctrl.supplier.commercialRegisterPhoto = base64Urls;
                    ctrl.base64FileToShow = base64Urls;
                    ctrl.commercialRegisterPhoto = base64Urls;
                    ctrl.base64ImageIsLoading = false;
                });
                //  this.customer.commercialRegisterPhoto = this.$base64.encode(file);
            } else {*/
            file.upload = this.Upload.upload({
                url: ctrl.UPLOAD_URL,
                data: { image: file },
                disableProgress: true,
                headers: { Accept: 'application/json' }
            });
            file.upload.then((response) => {
                switch (imgFor) {
                    case 'coverPhoto' : {
                        ctrl.supplier.coverPhoto = response.data.data.filename;
                        ctrl.coverPhoto = response.data.data.path;
                        ctrl.isUploadPhoto = false;
                        ctrl.profileFormIsLoading = false;
                        ctrl.$rootScope.$digest();
                        break;
                    }
                    case 'commercialRegisterPhoto' : {
                        this.filename = file.name;
                        ctrl.supplier.commercialRegisterPhoto = response.data.data.path;
                        ctrl.commercialRegisterPhoto = response.data.data.path;
                        ctrl.base64ImageIsLoading = false;
                        break;
                    }
                    case 'VATRegisterPhoto' : {
                        this.VATPhoto = file.name;
                        this.supplier.VATRegisterPhoto = response.data.data.path;
                        ctrl.base64ImageIsLoading = false;
                        break;
                    }
                    default:
                }
            }, (response) => {
                if (response.status > 0) {
                    this.errorMsg = `${response.status}: ${response.data}`;
                    this.profileFormIsLoading = false;
                    this.isUploadPhoto = false;
                }
            }, (evt) => {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        } else {
            switch (imgFor) {
                case 'coverPhoto' : {
                    this.supplier.coverPhoto = null;
                    this.profileFormIsLoading = true;
                    this.isUploadPhoto = true;
                    break;
                }
                case 'VATRegisterPhoto' : {
                    this.VATPhoto = false;
                    this.supplier.VATRegisterPhoto = null;
                    break;
                }
                default:
            }
            this.noFileSelected = true;
            this.base64ImageIsLoading = false;
        }
    }

    getCommercialRegisterPhoto() {
        this._SupplierService.getCommercialRegisterPhoto(this.supplier.commercialRegisterPhoto)
            .then((res) => {
            console.log('success');
        },
            (err) => {
                console.log('error');
            });
    }
    getVATRegisterPhoto(){
        this._SupplierService.getCommercialRegisterPhoto(this.supplier.VATRegisterPhoto)
            .then((res) => {
                console.log('success');
            },
            (err) => {
                console.log('error');
            });
    }
    geocodeLatLng(lat, lng) {
        const geocoder = new google.maps.Geocoder();
        const ctrl = this;
        const latlng = { lat, lng };
        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    ctrl.supplier.location.address = results[0].formatted_address;
                    ctrl.$rootScope.$digest();
                } else {
                    // window.alert('No results found');
                }
            } else {
                // window.alert(`Geocoder failed due to: ${status}`);
            }
        });
    }
}

SupplierAccountProfileCtrl.$inject = ['SupplierService', 'UserService', 'NgMap', '$translate', 'Upload',
    'AppConstants', '$base64', '$rootScope', 'CustomerService'];
