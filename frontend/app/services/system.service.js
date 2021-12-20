export default class SystemService {
    constructor(AppConstants, JwtService, RetryRequest) {
        this._AppConstants = AppConstants;
        this._JwtService = JwtService;
        this.retryRequest = RetryRequest;
        this._request = {};
        this._request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
    }
    getSystemUnits() {
        const request = {};
        request.url = `${this._AppConstants.api}/systemUnits/`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    addSystemUnit(data) {
        const request = {};
        request.url = `${this._AppConstants.api}/systemUnits/`;
        request.method = 'POST';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    updateSystemUnit(id, data) {
        const request = {};
        request.url = `${this._AppConstants.api}/systemUnits/${id}`;
        request.method = 'PUT';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    removeSystemUnit(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/systemUnits/${id}`;
        request.method = 'DELETE';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getCMSContentList() {
        const request = {};
        request.url = `${this._AppConstants.api}/contents/`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getCMSContent(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/contents/${id}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    addCMSContent(data) {
        const request = {};
        request.url = `${this._AppConstants.api}/contents/`;
        request.method = 'POST';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    updateCMSContent(id, data) {
        const request = {};
        request.url = `${this._AppConstants.api}/contents/${id}`;
        request.method = 'PUT';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    removeCMSContent(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/contents/${id}`;
        request.method = 'DELETE';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getSystemConfigList() {
        const request = {};
        request.url = `${this._AppConstants.api}/systemVariables/`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    addSystemConfig(data) {
        const request = {};
        request.url = `${this._AppConstants.api}/systemVariables/`;
        request.method = 'POST';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    updateSystemConfig(id, data) {
        const request = {};
        request.url = `${this._AppConstants.api}/systemVariables/${id}`;
        request.method = 'PUT';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    removeSystemConfig(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/systemVariables/${id}`;
        request.method = 'DELETE';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getEmailTemplateList() {
        const request = {};
        request.url = `${this._AppConstants.api}/email/`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    updateEmailTemplate(data) {
        const request = {};
        request.url = `${this._AppConstants.api}/email/`;
        request.method = 'PUT';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    resetEmailTemplate(data) {
        const request = {};
        request.url = `${this._AppConstants.api}/email/reset/`;
        request.method = 'PUT';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getContacts() {
        const request = {};
        request.url = `${this._AppConstants.api}/contacts`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getContact(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/contacts/${id}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    addContact(data) {
        const request = {};
        request.url = `${this._AppConstants.api}/contacts`;
        request.method = 'POST';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    updateContact(id, data) {
        const request = {};
        request.url = `${this._AppConstants.api}/contacts/${id}`;
        request.method = 'PUT';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    removeContact(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/contacts/${id}`;
        request.method = 'DELETE';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getPrivacy() {
        const request = {};
        request.url = `${this._AppConstants.api}/contents/privacy`;
        request.method = 'GET';
        return this.retryRequest(request);
    }
    getSystemCities() {
        const request = {};
        request.url = `${this._AppConstants.api}/systemCities/`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    addSystemCity(data) {
        const request = {};
        request.url = `${this._AppConstants.api}/systemCities/`;
        request.method = 'POST';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    removeSystemCity(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/systemCities/${id}`;
        request.method = 'DELETE';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
}

SystemService.$inject = ['AppConstants', 'JwtService', 'RetryRequest'];
