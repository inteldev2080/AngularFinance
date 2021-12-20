export default class RoleService {
    constructor(AppConstants, JwtService, RetryRequest) {
        this.retryRequest = RetryRequest;
        this._AppConstants = AppConstants;
        this._JwtService = JwtService;
        this._request = {};
        this._request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
    }
    getRoles(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/roles`;
        if (query.limit || query.skip) {
            request.url = `${request.url}?skip=${query.skip}&limit=${query.limit}`;
        }
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getAllRoles(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/roles`;
        if (query.limit || query.skip) {
            request.url = `${request.url}?skip=${query.skip}&limit=${query.limit}`;
        }
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getAllUsersRoles(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/roles`;
        if (query.limit || query.skip) {
            request.url = `${request.url}?skip=${query.skip}&limit=${query.limit}&all=true`;
        }
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    createRole(role) {
        const request = {
            url: `${this._AppConstants.api}/roles`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._JwtService.get()}`
            },
            data: role
        };
        return this.retryRequest(request);
    }
    getPermissions() {
        const request = {
            url: `${this._AppConstants.api}/roles/permissions`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._JwtService.get()}`
            }
        };
        return this.retryRequest(request);
    }
    updateRole(roleId, role) {
        const request = {
            url: `${this._AppConstants.api}/roles/${roleId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._JwtService.get()}`
            },
            data: role
        };
        return this.retryRequest(request);
    }
    deleteRole(roleIdToBeDeleted, alternativeRoleId) {
        const request = {
            url: `${this._AppConstants.api}/roles/${roleIdToBeDeleted}`,
            method: 'DELETE',
            data: { alternativeRoleId },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._JwtService.get()}`
            }
        };
        return this.retryRequest(request);
    }
}
RoleService.$inject = ['AppConstants', 'JwtService', 'RetryRequest'];
