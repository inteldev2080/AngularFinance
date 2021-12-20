function Custom404Controller(UserService, $state, $window) {
    const ctrl = this;
    ctrl.UserService = UserService;
    ctrl._$state = $state;
    ctrl.showDiv = false;
    ctrl.$window = $window;
    ctrl.$onInit = () => {
        if (ctrl.UserService.getCurrentUser() === null) {
            this._$state.go('app.auth.login');
        } else {
            ctrl.showDiv = true;
        }
    };
    ctrl.$onChanges = (changes) => {
        if (ctrl.UserService.getCurrentUser() === null) {
            this._$state.go('app.auth.login');
        } else {
            ctrl.showDiv = true;
        }
    };
}

Custom404Controller.$inject = ['UserService', '$state', '$window'];
const Custom404Component = {
    bindings: {},
    templateUrl: './app/components/404/custom404.component.html',
    controller: Custom404Controller,
    controllerAs: '$ctrl'
};
export default Custom404Component;
