function CreateUserCtrl($rootScope, $translate, RoleService) {
    const ctrl = this;
    ctrl.$translate = $translate;
    ctrl.$onInit = () => {
        $.Pages.init();
        ctrl.status = {
            placeholder: { ar: 'اختر الحاله', en: 'Select Status' },
            data: [
                { key: 'Active', ar: 'نشط', en: 'Active' },
                { key: 'Blocked', ar: 'محظور', en: 'Blocked' }
            ]
        };
        ctrl.roles = {
            placeholder: { ar: 'اختر الوظيفة', en: 'Select Role' },
            data: [
            ]
        };
        this.getRoles();
    };
    ctrl.onSubmit = (userForm) => {
        this.user.language = $rootScope.currentLanguage.language;        
        if (userForm.$invalid) return;

        if (ctrl.mode === 'Save') {
            ctrl.onSave({ user: this.user });
        } else if (ctrl.mode === 'Update') {
            ctrl.onUpdate({ user: this.user });
        }
        ctrl.resetForm(userForm);
    };
    ctrl.$onChanges = (changes) => {
        if (changes.user) {
            if (changes.user.currentValue) {
                ctrl.user = changes.user.currentValue;
                const idxStatus = ctrl.status.data.findIndex(obj => obj.key === ctrl.user.status);
                const idxRole = ctrl.roles.data.findIndex(obj => obj._id === ctrl.user.role);
                ctrl.user.status = ctrl.status.data[idxStatus];
                ctrl.user.role = ctrl.roles.data[idxRole];
            }
        }
    };
    ctrl.resetForm = (userForm) => {
        ctrl.user = {};
        ctrl.user.password = '';
        ctrl.confirmPassword = '';
        ctrl.user.status = 0;
        ctrl.user.role = 0;
        userForm.$setPristine();
        userForm.$setUntouched();
    };
    ctrl.translateStatus = (key) => {
        const item = ctrl.status.data.find(obj => obj.key === key);
        return $translate.use() === 'ar' ? item.ar : item.en;
    };
    ctrl.translateRole = role => $translate.use() === 'ar' ? role.arabicName : role.englishName;
    ctrl.getRoles = () => {
        const _onSuccess = (res) => {
            if (res.data.data.roles.length > 0) {
                Array.prototype.push.apply(ctrl.roles.data, res.data.data.roles);
            }
        };
        const _onError = (err) => {
            this.errors = err.data;
        };
        RoleService.getAllRoles({ skip: 0, limit: 1000 }).then(_onSuccess, _onError);
    };
}
CreateUserCtrl.$inject = ['$rootScope', '$translate', 'RoleService'];

const CreateUser = {
    bindings: {
        onSave: '&',
        onUpdate: '&',
        roles: '<',
        user: '<',
        mode: '<'
    },
    controller: CreateUserCtrl,
    controllerAs: '$ctrl',
    templateUrl: 'app/components/create-user/create-user.component.html',
};

export default CreateUser;

