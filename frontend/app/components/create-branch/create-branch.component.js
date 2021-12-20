function CreateBranchCtrl($rootScope, $translate, NgMap, $scope) {
    const ctrl = this;

    ctrl.types = "['establishment']";

    ctrl.$translate = $translate;

    ctrl.$scope = $scope;
    ctrl.$onInit = () => {
        $.Pages.init();

        ctrl.branchForm = {};

        ctrl.status = {
            placeholder: {ar: 'اختر الحاله', en: 'Select Status'},
            data: [
                {key: 'Active', ar: 'نشط', en: 'Active'},
                {key: 'InActive', ar: 'محظور', en: 'InActive'}
            ]
        };

        ctrl.$scope.$on('StatusUpdate', (evt, data) => {
            ctrl.branch.selectedStatus = data;
        });
    };

    ctrl.translateStatus = function (key) {
        const item = ctrl.status.data.find(obj => obj.key === key);
        return $translate.use() === 'ar' ? item.ar : item.en;
    };

    ctrl.placeChanged = function () {
        NgMap.getMap('map').then((map) => {
            this.map = map;
            ctrl.place = this.getPlace();
            ctrl.branch.location
                .coordinates = [ctrl.place.geometry.location.lat(),
                ctrl.place.geometry.location.lng()];
        });
    };

    ctrl.markerDragEnd = function (event) {
        ctrl.geocodeLatLng(event.latLng.lat(), event.latLng.lng());
        ctrl.branch.location.coordinates = [event.latLng.lat(), event.latLng.lng()];
    };

    ctrl.onSubmit = (branchForm) => {
        if (branchForm.$invalid) return;

        if (ctrl.mode === 'Save') {
            ctrl.onSave({branch: ctrl.branch});
        } else if (ctrl.mode === 'Update') {
            ctrl.onUpdate({branch: ctrl.branch});
            ctrl.resetForm(branchForm);
        }
        $('#branchModal').modal('hide');
        if (ctrl.mode === 'Save') {
            setTimeout(() => {
                ctrl.resetForm(branchForm);
            }, 2000);
        }
    };

    ctrl.resetForm = (branchForm) => {
        if (ctrl.mode === 'Save') {
            branchForm.$setPristine();
            branchForm.$setUntouched();
        } else {
            ctrl.branch = {};
        }
    };

    ctrl.geocodeLatLng = (lat, lng) => {
        const geocoder = new google.maps.Geocoder();
        const latlng = {lat, lng};
        geocoder.geocode({location: latlng}, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    ctrl.branch.location.address = results[0].formatted_address;

                    if (results[0] && results[0].address_components) {
                        results[0].address_components.forEach((address) => {
                            if (address.types.includes('locality')) {
                                ctrl.branch.location.city = address.long_name;
                            }
                        });
                    }

                    $rootScope.$digest();
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert(`Geocoder failed due to: ${status}`);
            }
        });
    };
}

CreateBranchCtrl.$inject = ['$rootScope', '$translate', 'NgMap', '$scope'];

const CreateBranch = {
    bindings: {
        onSave: '&',
        onUpdate: '&',
        branch: '=',
        mode: '<',
        location: '=',
        staff: '=',
        citylist: '='
    },
    controller: CreateBranchCtrl,
    controllerAs: '$ctrl',
    templateUrl: 'app/components/create-branch/create-branch.component.html',
};

export default CreateBranch;

