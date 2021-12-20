export default class PaymentService {
    constructor(AppConstants, JwtService, RetryRequest) {
        this._AppConstants = AppConstants;
        this._JwtService = JwtService;
        this.retryRequest = RetryRequest;
        this.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
    }
    getPayments(searchCriteria) {
        const request = {};
        request.url = `${this._AppConstants.api}/payments?skip=${searchCriteria.skip}&limit=${searchCriteria.limit}`;
        request.method = 'GET';
        request.headers = this.headers;
        if (searchCriteria.supplierName && searchCriteria.supplierName !== '') {
            request.url = `${request.url}&supplierName=${searchCriteria.supplierName}`;
        }
        if (searchCriteria.customerName && searchCriteria.customerName !== '') {
            request.url = `${request.url}&customerName=${searchCriteria.customerName}`;
        }
        if (searchCriteria.isAdminFees) {
            request.url = `${request.url}&isAdminFees=${searchCriteria.isAdminFees}`;
        }
        if (searchCriteria.status && searchCriteria.status !== 'All' && searchCriteria.status.length > 0) {
            let status = '[';
            for (let i = 0; i < searchCriteria.status.length; i += 1) {
                if (i < searchCriteria.status.length - 1) {
                    status = status.concat(`"${searchCriteria.status[i]}",`);
                } else {
                    status = status.concat(`"${searchCriteria.status[i]}"`);
                }
            }
            status = status.concat(']');
            request.url = request.url.concat(`&status=${status}`);
        }
        return this.retryRequest(request);
    }
    getPayment(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/payments/${id}`;
        request.method = 'GET';
        request.headers = this.headers;
        return this.retryRequest(request);
    }
    getPendingPaymentsCount() {
        const request = {};
        request.url = `${this._AppConstants.api}/payments/count`;
        request.method = 'GET';
        request.headers = this.headers;
        return this.retryRequest(request);
    }
    acceptPayment(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/payments/${id}/accept`;
        request.method = 'PUT';
        request.headers = this.headers;
        return this.retryRequest(request);
    }
    rejectPayment(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/payments/${id}/reject`;
        request.method = 'PUT';
        request.headers = this.headers;
        return this.retryRequest(request);
    }
    paymentDetails(id, searchCriteria) {
        const request = {
            url: `${this._AppConstants.api}/payments/pending/${id}?skip=${searchCriteria.skip}&limit=${searchCriteria.limit}`,
            method: 'GET',
            headers: this.headers
        };
        return this.retryRequest(request);
    }
}

PaymentService.$inject = ['AppConstants', 'JwtService', 'RetryRequest'];
