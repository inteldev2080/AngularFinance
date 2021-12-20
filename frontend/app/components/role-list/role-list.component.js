 class RoleListCtrl {
     constructor(RoleService, $translate, $scope) {
         this._RoleService = RoleService;
         this.$translate = $translate;
         this.$scope = $scope;
     }
     $onInit() {
        $.Pages.init(); // eslint-disable-line
         this.currentPage = 1;
         this.searchCriteria = { skip: 0, limit: 5 };
         this.getRoles();
         this.getPermissions();
         const ctrl = this;
         this.totalPages = 0;
         this.blockRolesAdd = true;
         this.$scope.$on('addRole', (event, data) => {
             ctrl.getRoles();
             ctrl.getPermissions();
         });
     }
     getRoles() {
         this.isLoading = true;
         const _onSuccess = (res) => {
             this.roles = res.data.data.roles;
             this.totalPages = Math.ceil(res.data.data.count / this.searchCriteria.limit);
             this.blockRolesAdd = res.data.data.blockRolesAdd;
         };
         const _onError = (err) => {
             this.errors = err.data.data;
         };
         this._RoleService.getRoles(this.searchCriteria).then(_onSuccess, _onError)
            .finally(() => {
                this.isLoading = false;
            });
     }
     getPermissions() {
         const _onSuccess = (res) => {
             this.permissions = res.data.data;
         };
         const _onError = (err) => {
             this.errors = err.data.data;
         };
         this._RoleService.getPermissions().then(_onSuccess, _onError)
            .finally(() => {
                // this.isLoading = false;
            });
     }
     updateRole(roleId, role) {
         this.isLoading = true;
         const _onSuccess = (res) => {
             if (res.status === 200) {
                 this.notify('component.role-list.message.updateRole.success', 'success', 1000);
             } else {
                 this.notify('component.role-list.message.updateRole.failure', 'danger', 1000);
             }
         };
         const _onError = (err) => {
             this.errors = err.data;
             this.notify('component.role-list.message.updateRole.failure', 'danger', 1000);
         };
         this._RoleService.updateRole(roleId, role).then(_onSuccess, _onError)
            .finally(() => {
                this.isLoading = false;
            });
     }
     check(role, permission, checked) {
         const idx = role.permissions.indexOf(permission._id);
         if (idx >= 0 && !checked) {
             role.permissions.splice(idx, 1);
         }
         if (idx < 0 && checked) {
             role.permissions.push(permission._id);
         }
         this.updatedRole = {
             permissions: role.permissions,
             arabicName: role.arabicName,
             englishName: role.englishName
         };
         this.updateRole(role._id, this.updatedRole);
     }
     setPage(pageNumber) {
         this.currentPage = pageNumber;
         this.searchCriteria.skip = (pageNumber - 1) * this.searchCriteria.limit;
         this.getRoles();
     }
     notify(message, type, timeout) {
         $('body')
            .pgNotification({
                style: 'bar',
                message: this.$translate.instant(message),
                position: 'top',
                timeout,
                type
            })
            .show();
     }
     openChangeRoleModal(roleId) {
         if (this.roles.length === 1) {
             this.notify('component.role-list.message.deleteRole.deleteLastRole', 'danger', 5000);
         } else {
             this.alternativeRoleId = this.roles[0]._id;
             this.roleIdToByDeleted = roleId;
             $('#changeRoleModal').modal('show');
         }
     }

     deleteRole() {
         $('#changeRoleModal').modal('hide');
         if (!this.alternativeRoleId) {
             this.notify('component.role-list.message.deleteRole.selectalternativeRole', 'success', 1000);
             return;
         }
         this._RoleService.deleteRole(this.roleIdToByDeleted, this.alternativeRoleId).then(
            (res) => {
                this.notify('component.role-list.message.deleteRole.success', 'success', 1000);
                this.getRoles();
            },
            (err) => {
                this.notify('component.role-list.message.deleteRole.failure', 'danger', 5000);
            }
        );
     }
}
 RoleListCtrl.$inject = ['RoleService', '$translate', '$scope'];
 const RoleListComponent = {
     controller: RoleListCtrl,
     controllerAs: '$ctrl',
     templateUrl: 'app/components/role-list/role-list.component.html'
 };
 export default RoleListComponent;
