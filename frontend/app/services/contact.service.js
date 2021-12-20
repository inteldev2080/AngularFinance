export default class ContactService {
    constructor(AppConstants, JwtService, $q, RetryRequest) {
        this._AppConstants = AppConstants;
        this._JwtService = JwtService;
        this.$q = $q;
        this.retryRequest = RetryRequest;
        this._request = {};
        this._request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
    }

    query() {
        const request = {};
        request.url = `${this._AppConstants.api}/contacts/`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    get(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/contacts/${id}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    save(data) {
        const request = {};
        request.url = `${this._AppConstants.api}/contacts`;
        request.method = 'POST';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    update(id, data) {
        const request = {};
        request.url = `${this._AppConstants.api}/contacts/${id}`;
        request.method = 'PUT';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    reply(id, data) {
        const request = {};
        request.url = `${this._AppConstants.api}/contacts/reply/${id}`;
        request.method = 'PUT';
        request.data = data;
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
        return this.retryRequest(request);
    }

    remove(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/contacts/${id}`;
        request.method = 'DELETE';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
}

ContactService.$inject = ['AppConstants', 'JwtService', '$q', 'RetryRequest'];
