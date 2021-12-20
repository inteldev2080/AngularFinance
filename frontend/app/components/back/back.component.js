function BackCtrl($window, $translate) {
    this._$translate = $translate;
    const ctrl = this;
    ctrl.back = () => {
        $window.history.back();
    };
}
BackCtrl.$inject = ['$window', '$translate'];

const back = {
    controller: BackCtrl,
    templateUrl: './app/components/back/back.component.html'
};
export default back;

