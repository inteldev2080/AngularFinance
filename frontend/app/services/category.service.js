export default class CategoryService {
    constructor(AppConstants, JwtService, RetryRequest) {
        this._AppConstants = AppConstants;
        this._JwtService = JwtService;
        this.retryRequest = RetryRequest;
        this._request = { headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        } };
    }
    createCategory(data) {
        const request = {};
        request.url = `${this._AppConstants.api}/categories`;
        request.method = 'POST';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getCategories(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/categories?`;
        if (query.skip || query.skip === 0) {
            request.url = `${request.url}skip=${query.skip}`;
        }
        if (query.limit) {
            request.url = `${request.url}&limit=${query.limit}`;
        }
        if (query.supplierId) {
            request.url = `${request.url}&supplierId=${query.supplierId}`;
        }
        request.url = `${request.url}&all=${query.all}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getCategory(id, supplierId, isAll) {
        const request = {};
        request.url = `${this._AppConstants.api}/categories/${id}`;
        if (supplierId) {
            request.url = `${request.url}?supplierId=${supplierId}`;
        }
        if (isAll) {
            request.url = `${request.url}&all=${isAll}`;
        }
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    updateCategory(id, data) {
        const request = {};
        request.url = `${this._AppConstants.api}/categories/${id}`;
        request.method = 'PUT';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    deleteCategory(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/categories/${id}`;
        request.method = 'DELETE';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

}
CategoryService.$inject = ['AppConstants', 'JwtService', 'RetryRequest'];

