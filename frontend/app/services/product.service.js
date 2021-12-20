export default class ProductService {
    constructor(AppConstants, JwtService, RetryRequest) {
        this._AppConstants = AppConstants;
        this._JwtService = JwtService;
        this.retryRequest = RetryRequest;
        this._request = { headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        } };
    }
    createProduct(product) {
        const request = {};
        request.url = `${this._AppConstants.api}/products`;
        request.method = 'POST';
        request.data = product;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getProducts(query) {
        const request = {};
        let url = this._AppConstants.api;
        if (query.categoryId !== 'All') {
            url = `${url}/categories/products/${query.categoryId}?skip=${query.skip}&limit=${query.limit}`;
        } else {
            url = `${url}/products?skip=${query.skip}&limit=${query.limit}`;
        }
        if (query.supplierId) {
            url = `${url}&supplierId=${query.supplierId}`;
        }
        request.url = url;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getOtherProducts(query) {
        const request = {};
        let url = this._AppConstants.api;
        if (query.categoryId !== 'All') {
            url = `${url}/categories/otherProducts/${query.categoryId}?skip=${query.skip}&limit=${query.limit}`;
        } else {
            url = `${url}/otherProducts?skip=${query.skip}&limit=${query.limit}`;
        }
        if (query.supplierId) {
            url = `${url}&supplierId=${query.supplierId}`;
        }
        request.url = url;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getSupplierProducts(query) {
        const request = {};
        let url = this._AppConstants.api;
        url = `${url}/products?skip=${query.skip}&limit=${query.limit}`;
        request.url = url;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getProductsBySupplierId(supplierId, searchCriteria) {
        const request = {};
        request.url = `${this._AppConstants.api}/products/supplier/${supplierId}?skip=${searchCriteria.skip}&limit=${searchCriteria.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getProduct(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/products/${id}`;
        request.method = 'GET';
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
        return this.retryRequest(request);
    }
    updateProduct(product) {
        const request = {};
        request.url = `${this._AppConstants.api}/products/${product._id}`;
        request.method = 'PUT';
        request.data = product;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    deleteProduct(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/products/${id}`;
        request.method = 'DELETE';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
}
ProductService.$inject = ['AppConstants', 'JwtService', 'RetryRequest'];

