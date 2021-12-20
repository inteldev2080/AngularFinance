/* eslint-disable no-param-reassign */
import moment from 'moment';


export default class CustomerAccountProfileCtrl {
    constructor(CustomerService, UserService, NgMap, $translate,
                Upload, AppConstants, $base64, $rootScope, BranchService) {
        this._AppConstants = AppConstants;
        const controller = this;
        this._$translate = $translate;
        this._CustomerService = CustomerService;
        this._UserService = UserService;
        this.photoloading = false;
        this.placeChanged = function () {
            NgMap.getMap('map').then((map) => {
                this.map = map;
                this.place = this.getPlace();
                controller.customer.location
                    .coordinates = [this.place.geometry.location.lat(),
                        this.place.geometry.location.lng()];
                // this.map.setCenter(this.place.geometry.location);
            });
        };
        this.markerDragEnd = function (event) {
            controller.geocodeLatLng(event.latLng.lat(), event.latLng.lng());
            controller.customer.location.coordinates = [event.latLng.lat(), event.latLng.lng()];
        };
        this.Upload = Upload;
        this.UPLOAD_URL = AppConstants.UPLOAD_URL;
        this.$base64 = $base64;
        this.$rootScope = $rootScope;
        this._BranchService = BranchService;
        this.branchData = {
            branchName: '',
            location: {
                type: 'point',
                coordinates: [],
                address: ''
            }
        };
        this.base64FileToShow = null;
        this.base64ImageIsLoading = false;
    }

    $onInit() {
        this.dateMethod = 'Hijri';
        $.Pages.init(); // eslint-disable-line
        moment.locale('en');
        this.getProfileInfo();
        this.load = true;
        this.isUploadPhoto = false;
        this.branchInput = false;
        this.mode = 'edit';
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

    onChange() {
        if (this.branchId) {
            this.mode = 'edit';
            const currentBranch = this.branchId;
            const branch = this.branches.filter(branch => branch._id === currentBranch);
            this.branchName = branch[0].branchName;
            this.customer.location.coordinates = branch[0].location.coordinates;
            this.customer.location.address = branch[0].location.address;
        }
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

    cancelEdit() {
        if (this.branchId) {
            const currentBranch = this.branchId;
            const branch = this.branches.filter(branch => branch._id === currentBranch);
            this.branchName = branch[0].branchName;
            this.mode = 'edit';
        }
    }

    getProfileInfo() {
        this.profileIsloading = true;
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.customer = res.data.data;
                this.coverPhoto = this.customer.coverPhoto;
                this.originCoverPhoto = this.customer.coverPhoto;
                // image id
                this.customer.coverPhoto = this.customer.coverPhoto.split('/')[4];
                if (this.customer.commercialRegisterExpireDate !== null) {
                    this.customer.commercialRegisterExpireDate = new Date(moment(
                        new Date(this.customer.commercialRegisterExpireDate)).format('YYYY-MM-DD'));
                }
                if (this.customer.commercialRegisterExpireDateIslamic !== null) {
                    this.customer.commercialRegisterExpireDateIslamic = new Date(moment(
                        new Date(this.customer.commercialRegisterExpireDateIslamic)).format('YYYY-MM-DD'));
                }
                this.commercialRegisterPhoto = this.customer.commercialRegisterPhoto;
                this.originCRPhoto = this.customer.commercialRegisterPhoto;
                this.customer.commercialRegisterPhoto = this.customer.commercialRegisterPhoto.split('/')[6];
                this.branchId = this.customer.branch._id ? this.customer.branch._id : (this.branches && this.branches.length ? this.branches[0]._id : '');
                this.base64FileToShow = this.customer.commercialRegisterPhoto;
            } else {
                this.profilLoadingIsFailure = true;
                this.message = 'customer.account.profile.message.failure';
            }
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._CustomerService.getCurrentCustomer()
            .then(_onSuccess, _onError)
            .catch(() => {
                this.profilLoadingIsFailure = true;
                this.message = 'customer.account.profile.message.failure';
            })
            .finally(() => {
                this.profileIsloading = false;
                this.getBranches(this.customer);
            });
    }

    uploadCommercialRegisterPhoto(photo) {
        const ctrl = this;
        ctrl.isUploadPhoto = true;
        // this.profileFormIsLoading = true;
        this.base64ImageIsLoading = true;

        if (photo) {
            this.filename = photo.name;
            this._CustomerService.uploadCommercialRegisterPhoto(photo)
                .then((response) => {
                  //  ctrl.customer.coverPhoto = response.data.data.filename;
                    ctrl.customer.commercialRegisterPhoto = response.data.data.filename;
                    console.log(`${this._AppConstants.UPLOAD_URL}/${response.data.data.filename}`);
                    ctrl.commercialRegisterPhoto = response.data.data.path;
                    ctrl.base64FileToShow = response.data.data.path;
                    this.base64ImageIsLoading = false;
                }, (response) => {
                    if (response.status > 0) {
                        this.errorMsg = `${response.status}: ${response.data}`;
                    }
                });
        } else {
            ctrl.commercialRegisterPhoto = this.originCRPhoto;
            ctrl.base64FileToShow = this.originCRPhoto;
            this.base64ImageIsLoading = false;
        }
    }

    updateMyProfile(profileForm) {
        if (profileForm.$invalid) return;
        this.profileFormIsFailure = false;
        this.profileFormIsSuccess = false;
        this.profileFormIsLoading = true;
        this.customer.commercialRegisterPhoto = `${this.commercialRegisterPhoto}`;
        if (moment(
            new Date(this.customer.commercialRegisterExpireDate)).format('YYYY') <= 1970) {
            this.customer.commercialRegisterExpireDate = null;
        }
        if (moment(
            new Date(this.customer.commercialRegisterExpireDateIslamic)).format('YYYY') === 1970) {
            this.customer.commercialRegisterExpireDateIslamic = null;
        }
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.customer = res.data.data;
                this.coverPhoto = this.customer.coverPhoto;
                this.originCoverPhoto = this.customer.coverPhoto;
                // this.customer.commercialRegisterExpireDate = new Date(moment(
                //     new Date(this.customer.commercialRegisterExpireDate)).format('YYYY-MM-DD'));
                // this.$rootScope.$broadcast('profileUpdated', { firstName: this.customer.user.firstName, lastName: this.customer.user.lastName });
                this._UserService.updateUser(this.customer.user.firstName, this.customer.user.lastName);
                this.profileFormIsSuccess = true;
                this.message = 'customer.account.profile.message.profile_update_successfully';
                this.notify(this.message, 'success', 500);
            } else if (res.data.errorCode === 3) {
                this.profileFormIsFailure = true;
                this.message = 'customer.account.profile.message.duplicate-data';
                this.notify(this.message, 'danger', 5000);
            } else {
                this.profileFormIsFailure = true;
                this.message = 'customer.account.profile.message.failure';
                this.notify(this.message, 'danger', 5000);
            }
        };

        const _onError = (err) => {
            if (err.data.errorCode === 20) {
                this.profileFormIsFailure = true;
                this.message = 'customer.account.profile.message.expireDate_exceed';
                this.notify(this.message, 'danger', 7000);
            } else if (err.data.errorCode === 21) {
                this.profileFormIsFailure = true;
                this.message = 'customer.account.profile.message.expireDate_todayOrLess';
                this.notify(this.message, 'danger', 7000);
            } else if (err.data.errorCode === 22) {
                this.profileFormIsFailure = true;
                this.message = 'customer.account.profile.message.expireDateHijri_exceed';
                this.notify(this.message, 'danger', 7000);
            } else if (err.data.errorCode === 23) {
                this.profileFormIsFailure = true;
                this.message = 'customer.account.profile.message.expireDateHijri_todayOrLess';
                this.notify(this.message, 'danger', 7000);
            } else {
                this.profileFormIsFailure = true;
                this.message = 'customer.account.profile.message.failure';
                this.errors = err.data.data;
                this.notify('customer.account.profile.message.failure', 'danger', 5000);
            }
        };
        this._CustomerService.updateCustomer(this.customer)
            .then(_onSuccess, _onError)
            .catch((e) => {
                this.profileFormIsFailure = true;
                this.message = 'customer.account.profile.message.failure';
                this.notify('customer.account.profile.message.failure', 'danger', 5000);
            })
            .finally(() => {
                this.profileFormIsLoading = false;
            });
    }

    resetPassword(resetForm) {
        if (resetForm.$invalid) return;
        this.resetFormIsLoading = true;
        this.resetFormIsSuccess = false;
        this.resetFormIsFailure = false;
        const _onSuccess = (res) => {
            this.resetFormIsSuccess = true;
            this.message = 'customer.account.profile.message.password_update_successfully';
            this.notify(this.message, 'success', 500);
        };
        const _onError = (err) => {
            if (err.data.errorCode === 15) {
                this.resetFormIsFailure = true;
                this.message = 'customer.account.profile.message.old_password_incorrect';
                this.notify(this.message, 'danger', 5000);
            } else {
                this.isError = true;
                this.message = 'customer.account.profile.message.failure';
                this.errors = err.data.data;
                this.notify(this.message, 'danger', 5000);
            }
        };
        this._UserService.changePassword(this.oldPassword, this.newPassword)
            .then(_onSuccess, _onError)
            .catch(() => {
                this.resetFormIsFailure = true;
                this.message = 'customer.account.profile.message.failure';
            })
            .finally(() => {
                this.resetFormIsLoading = false;
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

    openConfirmMessage(e) {
        e.stopPropagation();
        $('#deleteBranchModel').modal('show');
    }
    geocodeLatLng(lat, lng) {
        const geocoder = new google.maps.Geocoder();
        const ctrl = this;
        const latlng = { lat, lng };
        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    ctrl.customer.location.address = results[0].formatted_address;
                    ctrl.$rootScope.$digest();
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert(`Geocoder failed due to: ${status}`);
            }
        });
    }

    uploadCoverPhoto(photo) {
        const ctrl = this;
        ctrl.isUploadPhoto = true;
        this.profileFormIsLoading = true;
        if (photo) {
            this._CustomerService.uploadCoverPhoto(photo)
                .then((response) => {
                    ctrl.customer.coverPhoto = response.data.data.filename;
                    ctrl.coverPhoto = response.data.data.path;
                    ctrl.isUploadPhoto = false;
                    ctrl.profileFormIsLoading = false;
                }, (response) => {
                    if (response.status > 0) {
                        this.errorMsg = `${response.status}: ${response.data}`;
                        ctrl.isUploadPhoto = false;
                        ctrl.profileFormIsLoading = false;
                    }
                });
        } else {
            this.coverPhoto = this.originCoverPhoto;
        }
    }

    getBranches(customer) {
        const _onSuccess = (res) => {
            this.branches = res.data.data;
            this.branchId = this.branches[0]._id;
            this.branchName = this.branches[0].branchName;
            this.customer.location.coordinates = this.branches[0].location.coordinates;
            this.customer.location.address = this.branches[0].location.address;

        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        const _onFinal = () => {
        };
        this._BranchService.getBranches()
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    createBranch() {
        this.branchData.location.coordinates = this.customer.location.coordinates;
        this.branchData.location.address = this.customer.location.address;
        this.branchData.branchName = this.branchName;
        const _onSuccess = (res) => {
            // if (res.status === 200) {
            this.notify('customer.account.profile.message.branch_added', 'success', 1000);
            this.getBranches();
            this.$rootScope.$broadcast('addBranch');
            // }
            // else {
            //     this.notify('customer.account.profile.message.failure', 'danger', 5000);
            // }
            this.mode = 'edit';
        };
        const _onError = (err) => {
            this.errors = err.data.data;
            this.notify('customer.account.profile.message.failure', 'danger', 5000);
        };
        const _onFinal = () => {
            this.branchInput = false;
        };
        this._BranchService.createBranch(this.branchData)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    deleteBranch() {
        if (this.branches.length === 1) {
            $('#deleteBranchModel').modal('hide');
            this.notify('customer.account.profile.message.branch_delete_error', 'danger', 5000);
        } else {
            const _onSuccess = (res) => {
                this.getBranches(this.customer);
                this.notify('customer.account.profile.message.branch_deleted', 'success', 1000);
                this.$rootScope.$broadcast('addBranch');
            };
            const _onError = (err) => {
                this.errors = err.data.data;
                this.notify('customer.account.profile.message.failure', 'danger', 5000);
            };
            const _onFinal = () => {
                $('#deleteBranchModel').modal('hide');
            };
            this._BranchService.deleteBranch(this.branchId)
                .then(_onSuccess, _onError)
                .finally(_onFinal);
        }
    }

    updateBranch() {
        this.branchData.location.coordinates = this.customer.location.coordinates;
        this.branchData.location.address = this.customer.location.address;
        this.branchData.branchName = this.branchName;
        const _onSuccess = (res) => {
            this.getBranches();
            this.notify('customer.account.profile.message.branch_updated', 'success', 1000);
            this.$rootScope.$broadcast('addBranch');
        };
        const _onError = (err) => {
            this.errors = err.data.data;
            this.notify('customer.account.profile.message.failure', 'danger', 5000);
        };
        const _onFinal = () => {
            this.branchInput = false;
        };
        this._BranchService.updateBranch(this.branchId, this.branchData)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }
    getCommercialRegisterPhoto(){
        this._CustomerService.getCommercialRegisterPhoto(this.customer.commercialRegisterPhoto).then( (res) => {
            console.log("success");
        },
        (err) => {
            console.log('error');
        });
    }
}

CustomerAccountProfileCtrl.$inject = ['CustomerService', 'UserService', 'NgMap', '$translate', 'Upload',
    'AppConstants', '$base64', '$rootScope', 'BranchService'];
