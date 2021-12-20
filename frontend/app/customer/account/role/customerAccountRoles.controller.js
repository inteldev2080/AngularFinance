export default class CustomerAccountRolesCtrl {
    constructor(RoleService) {
        this._RoleService = RoleService;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this.currentPage = 1;
        this.searchCriteria = {skip: 0, limit: 2};
        this.totalPages = 0;
        this.blockRolesAdd = true;
        this.getRoles();
    }

    getRoles() {
        const _onSuccess = (res) => {
            this.roles = res.data.data.roles;
            this.totalPages = Math.ceil(res.data.data.count / this.searchCriteria.limit);
            this.blockRolesAdd = res.data.data.blockRolesAdd;
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._RoleService.getRoles(this.searchCriteria).then(_onSuccess, _onError);
    }

}

CustomerAccountRolesCtrl.$inject = ['RoleService'];
