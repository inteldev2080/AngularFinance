export default class BranchService {
    constructor(AppConstants, JwtService, RetryRequest) {
        this._AppConstants = AppConstants;
        this._JwtService = JwtService;
        this.retryRequest = RetryRequest;
        this._request = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._JwtService.get()}`
            }
        };
    }

    getBranch(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/branches/${id}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getBranches() {
        const request = {};
        request.url = `${this._AppConstants.api}/branches`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    createBranch(data) {
        const request = {};
        request.url = `${this._AppConstants.api}/branches`;
        request.method = 'POST';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    updateBranch(id, data) {
        const request = {};
        request.url = `${this._AppConstants.api}/branches/${id}`;
        request.method = 'PUT';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    deleteBranch(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/branches/${id}`;
        request.method = 'DELETE';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getBranchesList(searchCriteria) {
        const request = {};

        if (searchCriteria.staffQuery) {
            request.url = `${this._AppConstants.api}/branches/${searchCriteria.skip}/${searchCriteria.limit}?searchText=${searchCriteria.staffQuery}`;
        } else {
            request.url = `${this._AppConstants.api}/branches/${searchCriteria.skip}/${searchCriteria.limit}`;
        }

        if (searchCriteria.status) {
            request.url = `${request.url}?status=${searchCriteria.status}`;
        }

        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getCustomersBranchesList(searchCriteria) {
        const request = {};

        request.url = `${this._AppConstants.api}/branches/${searchCriteria.customerId}/${searchCriteria.skip}/${searchCriteria.limit}`;

        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

}
BranchService.$inject = ['AppConstants', 'JwtService', 'RetryRequest'];

