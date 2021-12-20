function CreateRoleCtrl($rootScope, RoleService, $translate) {
    const ctrl = this;
    ctrl.$onInit = () => {
        // $rootScope.$on('$translateChangeSuccess', function () {
        ctrl.role = {
            permissions: [],
            arabicName: '',
            englishName: ''
        };
    };
    ctrl.submit = (newRoleForm) => {
        if (newRoleForm.$invalid) return;
        $('#myModal').modal('hide');
        ctrl.createRole(ctrl.role);
        // ctrl.onSave({ role: this.role });
        newRoleForm.$setPristine();
        newRoleForm.$setUntouched();
    };
    ctrl.createRole = (role) => {
        const _onSuccess = (res) => {
            if (res.status === 200) {
                ctrl.notify('component.create-role.message.add-success', 'success', 500);
                $rootScope.$broadcast('addRole', res.data.data);
            } else {
                ctrl.notify('component.create-role.message.failure', 'danger', 5000);
            }
        };
        const _onError = (err) => {
            ctrl.notify('component.create-role.message.error', 'danger', 5000);
        };
        RoleService.createRole(role).then(_onSuccess, _onError)
            .catch((e) => {
                ctrl.notify('component.create-role.message.add.failure', 'danger');
            })
            .finally(() => {
                this.Load = false;
                ctrl.role = {
                    permissions: [],
                    arabicName: '',
                    englishName: ''
                };
            });
    };
    ctrl.resetForm = (newRoleForm) => {
        ctrl.role = {
            permissions: [],
            arabicName: '',
            englishName: ''
        };
        newRoleForm.$setPristine();
        newRoleForm.$setUntouched();
    };
    ctrl.notify = (message, type, timeout) => {
        $('body')
            .pgNotification({
                style: 'bar',
                message: $translate.instant(message),
                position: 'top',
                timeout,
                type
            })
            .show();
    };
}
CreateRoleCtrl.$inject = ['$rootScope', 'RoleService', '$translate'];
const CreateRole = {
    bindings: {
        getRoles: '&'
    },
    controller: CreateRoleCtrl,
    templateUrl: 'app/components/create-role/create-role.component.html'
};

export default CreateRole;
