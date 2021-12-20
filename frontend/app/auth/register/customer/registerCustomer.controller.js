import moment from 'moment/moment';

export default class RegisterCustomerCtrl {
    constructor($scope, $state, CustomerService, NgMap, AppConstants, $rootScope, $translate, Upload, SystemService) {
        const controller = this;
        this._$translate = $translate;
        this.$state = $state;
        this.Upload = Upload;
        this.UPLOAD_URL = AppConstants.UPLOAD_URL;
        this.$scope = $scope;
        this.latlng = [40.741, -74.181];
        this.radius = 3500;
        this._CustomerService = CustomerService;
        this.ngMap = NgMap;
        this.map = {};
        this.googleMapsUrl = AppConstants.googleMapsUrl;
        this.types = "['establishment']";
        this.customer = {
            coordinates: [23.8859, 45.0792]
        };
        this.privacyAccept = false;
        this.options = {
            enableHighAccuracy: true
        };
        this.place = null;
        this.$rootScope = $rootScope;
        this.selectedCity = null;
        this.placeChanged = function () {
            NgMap.getMap('map').then((map) => {
                this.map = map;
                this.place = this.getPlace();
                controller.customer
                    .coordinates = [this.place.geometry.location.lat(), this.place.geometry.location.lng()];
                // this.map.setCenter(this.place.geometry.location);
            });
        };
        this.markerDragEnd = function (event) {
            controller.customer.coordinates = [event.latLng.lat(), event.latLng.lng()];
            controller.geocodeLatLng(event.latLng.lat(), event.latLng.lng());
        };
        this.geocoder = new google.maps.Geocoder();
        this.getpos = function (event) {
            controller.latlng = [this.position.lat(), this.position.lng()];
            controller.customer.coordinates = [this.position.lat(), this.position.lng()];
            controller.geocodeLatLng(this.position.lat(), this.position.lng());
        };
        controller.geocodeLatLng(23.8859, 45.0792);
        this._SystemService = SystemService;
    }

    $onInit() {
        this.dateMethod = 'Hijri';
        this.$rootScope.enlargePanel = true;
        this.loading = false;
        // this.getCurrentPos();
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

        this.getSystemCities();

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

    geocodeLatLng(lat, lng) {
        const ctrl = this;
        const latlng = {lat, lng};
        this.geocoder.geocode({
            location: latlng
        }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    ctrl.customer.address = results[0].formatted_address;
                    ctrl.$rootScope.$digest();
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert(`Geocoder failed due to: ${status}`);
            }
        });
    }

    getCurrentPos() {
        const ctrl = this;
        navigator.geolocation.getCurrentPosition((pos) => {
            this.position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            ctrl.customer.coordinates[0] = pos.coords.latitude;
            ctrl.customer.coordinates[1] = pos.coords.longitude;
            ctrl.geocodeLatLng(pos.coords.latitude, pos.coords.longitude);
        }, (error) => {

        }, this.options);
    }

    register(customerForm) {
        if (customerForm.$invalid) return;

        this.registerLoading = true;
        if (!this.customer.commercialRegisterPhoto) {
            this.notify('auth.register.customer.field.cr_photo.required', 'warning', 1000);
            this.registerLoading = false;
            return;
        }
        this.isFailure = false;
        this.isSuccess = false;
        this.loading = true;
        this.customer.language = this.$rootScope.currentLanguage.language;

        this._CustomerService.createCustomer(this.customer)
            .then(
                (res) => {
                    this.isSuccess = true;
                    this.notify('auth.register.customer.message.success_creation', 'success', 1000);
                    this.$state.go('app.auth.login');
                    this.$rootScope.message = {
                        type: 'success',
                        text: this._$translate.instant('auth.register.customer.message.success_creation')
                    };
                    this.$state.go('app.auth.login');
                },
                (err) => {
                    if (err.data.errorCode === 20) {
                        this.isFailure = true;
                        this.message = 'auth.register.customer.message.expireDate_exceed';
                    } else if (err.data.errorCode === 21) {
                        this.isFailure = true;
                        this.message = 'auth.register.customer.message.expireDate_todayOrLess';
                    } else if (err.data.errorCode === 22) {
                        this.isFailure = true;
                        this.message = 'auth.register.customer.message.expireDateHijri_exceed';
                    } else if (err.data.errorCode === 23) {
                        this.isFailure = true;
                        this.message = 'auth.register.customer.message.expireDateHijri_todayOrLess';
                    } else if (err.data.errorCode === 8) {
                        // alert('No supplier invites for this email');
                        this.isSuccess = true;
                        this.message = 'auth.register.customer.message.not_invited';
                    } else if (err.data.errorCode === 3) {
                        // alert('already have account');
                        this.isFailure = true;
                        this.notify('auth.register.customer.message.already_have_account', 'warning', 5000);
                    } else {
                        this.notify('auth.register.customer.message.failed_creation', 'warning', 5000);
                        this.isFailure = true;
                    }
                    this.isError = true;
                    this.errors = err.data.data;
                }
            )
            .catch(() => {
                this.isFailure = true;
                this.notify('auth.register.customer.message.failed_creation', 'warning', 5000);
            })
            .finally(() => {
                this.loading = false;
                this.registerLoading = false;
            });
    }

    uploadFile(file, errFiles, imgFor) {
        const idxDot = file.name.lastIndexOf('.') + 1;
        const extFile = file.name.substr(idxDot, file.name.length).toLowerCase();
        if (extFile !== 'jpg' && extFile !== 'jpeg' && extFile !== 'png' && extFile !== 'gif' && extFile !== 'pdf') {
            this.notify('auth.register.customer.message.invalidFile', 'warning', 5000);
            switch (imgFor) {
                case 'coverPhoto' : {
                    this.customer.coverPhoto = null;
                    break;
                }
                case 'commercialRegisterPhoto' : {
                    this.customer.commercialRegisterPhoto = null;
                    this.commercialRegisterPhoto = null;
                    break;
                }
                default:
            }
            return;
        }

        this.registerLoading = true;
        const ctrl = this;
        this.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = this.Upload.upload({
                url: ctrl.UPLOAD_URL,
                data: {image: file},
                disableProgress: true,
                headers: {Accept: 'application/json'}
            });
            file.upload.then((response) => {
                switch (imgFor) {
                    case 'coverPhoto' : {
                        this.customer.coverPhoto = response.data.data.filename;
                        break;
                    }
                    case 'commercialRegisterPhoto' : {
                        this.commercialPhoto = file.name;
                        this.customer.commercialRegisterPhoto = response.data.data.path;
                        this.registerLoading = false;
                        break;
                    }
                    default:
                }
            }, (response) => {
                if (response.status > 0) {
                    this.errorMsg = `${response.status}: ${response.data}`;
                }
            }, (evt) => {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
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

    getSystemCities() {
        const _onSuccess = (res) => {
            this.cityList = res.data.data;
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
            }
        };
        const _onFinal = (err) => {

        };
        this._SystemService.getSystemCities()
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    onChangeCity() {
        this.customer.coordinates = this.selectedCity.coordinates;
        this.customer.address = this.selectedCity.address;
        this.customer.cityId = this.selectedCity._id;
    }


}
RegisterCustomerCtrl.$inject = ['$scope', '$state', 'CustomerService',
    'NgMap', 'AppConstants', '$rootScope', '$translate', 'Upload', 'SystemService'];
