 function MapCtrl(NgMap) {
     const vm = this;
     vm.types = "['establishment']";
     vm.placeChanged = () => {
         vm.place = this.getPlace();
         vm.map.setCenter(vm.place.geometry.location);
     };
     NgMap.getMap().then((map) => {
         vm.map = map;
     });
 }
 MapCtrl.$inject = ['NgMap'];

 const mapComponent = {
     bindings: {
     },
     controller: MapCtrl,
     controllerAs: '$ctrl',
     templateUrl: 'app/components/create-user/create-user.component.html',
 };

 export default mapComponent;
