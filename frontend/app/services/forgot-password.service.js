export default class ForgetPasswordService {
    constructor(AppConstants, JwtService, RetryRequest) {
        this._AppConstants = AppConstants;
        this._JwtService = JwtService;
        this.url = `${this._AppConstants.api}/forgetPassword`;
        this.retryRequest = RetryRequest;
        this.headers = {
            'Content-Type': 'application/json'
        };
    }
    forgetPassword(data) {
        const request = {};
        request.url = `${this.url}/send`;
        request.method = 'POST';
        request.data = data;
        request.headers = this.headers;
        return this.retryRequest(request);
    }
    resetPassword(data) {
        const request = {};
        request.url = `${this.url}/reset`;
        request.method = 'PUT';
        request.data = data;
        request.headers = this.headers;
        return this.retryRequest(request);
    }
}
ForgetPasswordService.$inject = ['AppConstants', 'JwtService', 'RetryRequest'];
