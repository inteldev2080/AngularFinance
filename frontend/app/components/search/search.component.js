function SearchCtrl() {
    const ctrl = this;
    ctrl.$onInit = () => {
        $.Pages.init();
        ctrl.status = [
      { key: 'Active', arabicName: 'نشط', englishName: 'Active' },
      { key: 'Blocked', arabicName: 'محظور', englishName: 'Blocked' }
        ];
    };
    ctrl.onSubmit = () => {
        if (ctrl.mode === 'Save') {
            ctrl.onSave({ user: this.user });
        } else if (ctrl.mode === 'Update') {
            ctrl.onUpdate({ user: this.user });
        }
        this.user = null;
    };
    ctrl.$onChanges = (changes) => {
        if (changes.user) {
            if (changes.user.currentValue) {
                ctrl.user = changes.user.currentValue;
                const idxStatus = ctrl.status.findIndex(obj => obj.key === ctrl.user.status);
                const idxRole = ctrl.roles.findIndex(obj => obj._id === ctrl.user.role);
                ctrl.user.status = ctrl.status[idxStatus];
                ctrl.user.role = ctrl.roles[idxRole];
            }
        }
    };
}
SearchCtrl.$inject = [];

const CreateUser = {
    bindings: {
        onSave: '&',
        onUpdate: '&',
        roles: '<',
        user: '<',
        mode: '<'
    },
    controller: SearchCtrl,
    controllerAs: '$ctrl',
    templateUrl: 'app/components/search/search.component.html',
};

export default CreateUser;

