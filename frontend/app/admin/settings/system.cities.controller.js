export default class SystemCityCtrl {


    constructor(SystemService, $translate, NgMap, $rootScope) {
        this._SystemService = SystemService;
        this._$translate = $translate;
        this.NgMap = NgMap;
        this._$rootScope = $rootScope;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.getSystemCities();
        this.types = "['establishment']";
        this.location = {
            coordinates: [24.7255553, 46.5423373]
        };
    }

    getSystemCities() {
        const _onSuccess = (res) => {
            this.cityList = res.data.data;
            this.cityListIsLoaded = true;
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


    add() {
        const item = {
            englishName: this.addEnglishCity,
            arabicName: this.addEnglishCity,
            coordinates: this.location.coordinates,
            address: this.address
        };

        const _onSuccess = (res) => {
            $('body').pgNotification({
                style: 'bar',
                message: 'Done!',
                position: 'top', // 'bottom'
                timeout: 500,
                type: 'success'
            }).show();
            this.getSystemCities();
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
            $('#addNewCityModal').modal('hide');
        };

        this._SystemService.addSystemCity(item)
            .then(_onSuccess, _onError).finally(_onFinal);
    }


    delete() {
        const _onSuccess = (res) => {
            this.notify('admin.settings.cities.success', 'success', 1000);
            this.getSystemCities();
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
                if (err.data.errorCode === 22) {
                    this.notify('admin.settings.cities.failure', 'danger', 5000);
                } else {
                    this.notify('admin.settings.cities.unexpectedFailure', 'danger', 5000);
                }
            }
        };
        const _onFinal = (err) => {
            $('#deleteModal').modal('hide');
        };
        this._SystemService.removeSystemCity(this.city._id)
            .then(_onSuccess, _onError).finally(_onFinal);
    }

    showModal() {
        $('#addNewCityModal').modal('show');
    }

    showDeleteModal(city) {
        $('#deleteModal').modal('show');
        this.city = city;
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

    placeChanged(event, ctrl) {
        ctrl.NgMap.getMap('map').then((map) => {
            ctrl.map = map;
            ctrl.place = this.getPlace();
            ctrl.location
                .coordinates = [ctrl.place.geometry.location.lat(),
                ctrl.place.geometry.location.lng()];
            ctrl.getCodeLatLng(ctrl.place.geometry.location.lat(),
                ctrl.place.geometry.location.lng());
        });
    }

    getCodeLatLng(lat, lng) {
        const geocoder = new google.maps.Geocoder();
        const latlng = {lat, lng};
        geocoder.geocode({location: latlng}, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    this.address = results[0].formatted_address;

                    if (results[0] && results[0].address_components) {
                        results[0].address_components.forEach((address) => {
                            if (address.types.includes('locality')) {
                                this.addEnglishCity = address.long_name;
                            }
                        });
                    }

                    this._$rootScope.$digest();
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert(`Geocoder failed due to: ${status}`);
            }
        });
    }


    markerDragEnd(event, ctrl) {
        ctrl.getCodeLatLng(event.latLng.lat(), event.latLng.lng());
        ctrl.location.coordinates = [event.latLng.lat(), event.latLng.lng()];
    }

}

SystemCityCtrl.$inject = ['SystemService', '$translate', 'NgMap', '$rootScope'];

