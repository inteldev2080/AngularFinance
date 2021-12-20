function PrivacyController(SystemService) {
    const ctrl = this;
    ctrl.$onInit = () => {
        ctrl.isApp = ctrl.appFlag;
        SystemService.getPrivacy().then((res) => {
            ctrl.content = res.data.data.body.arabic;
        });
    };
}
PrivacyController.$inject = ['SystemService'];

const PrivacyComponent = {
    controller: PrivacyController,
    controllerAs: '$ctrl',
    templateUrl: 'app/components/privacy/privacy.component.html',
    bindings: {
        appFlag: '<',
    }
};
export default PrivacyComponent;
