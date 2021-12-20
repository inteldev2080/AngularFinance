export default class AdminAccountRolesCtrl {
    constructor(RoleService, $translate) {
        this._RoleService = RoleService;
        this._$translate = $translate;
    }
    $onInit() {
    $.Pages.init(); // eslint-disable-line
        this.currentPage = 1;
        this.searchCriteria = { skip: 0, limit: 5 };
        this.getRoles();
    }
    getRoles() {
        this.isLoading = true;
        const _onSuccess = (res) => {
            this.roles = res.data.data.roles;
            this.totalPages = Math.ceil(res.data.data.count / this.searchCriteria.limit);
        };
        const _onError = (err) => {
            this.errors = err.data.data;
        };
        this._RoleService.getRoles(this.searchCriteria).then(_onSuccess, _onError)
            .finally(() => {
                this.isLoading = false;
            });
    }
}
AdminAccountRolesCtrl.$inject = ['RoleService', '$translate'];
