import suppliesOnHelper from '../supplieson.helper';

export default class AdminService {
    constructor(AppConstants, JwtService, $q, RetryRequest) {
        this._AppConstants = AppConstants;
        this._JwtService = JwtService;
        this.$q = $q;
        this.retryRequest = RetryRequest;
        this.url = `${this._AppConstants.api}/admins`;
        this._request = {};
        this._request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
    }
    createAdmin(admin) {
        const request = {};
        request.url = `${this._AppConstants.api}/admins`;
        request.method = 'POST';
        request.data = admin;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    updateMyProfile(admin) {
        const request = {};
        request.url = `${this._AppConstants.api}/admins`;
        request.method = 'PUT';
        request.data = admin;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getAdmins(searchCriteria) {
        const request = {};
        request.url = `${this.url}?skip=${searchCriteria.skip}&limit=${searchCriteria.limit}`;
        if (searchCriteria.adminQuery !== '') {
            request.url = request.url.concat(`&adminQuery=${searchCriteria.adminQuery}`);
        }
        if (searchCriteria.roleId !== 'All') {
            request.url = request.url.concat(`&roleId=${searchCriteria.roleId}`);
        }
        if (searchCriteria.status && searchCriteria.status !== 'All') {
            request.url = `${request.url}&status=["${searchCriteria.status}"]`;
        }
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getUsers(searchCriteria) {
        const request = {};
        request.url = `${this.url}/otherUsers?skip=${searchCriteria.skip}&limit=${searchCriteria.limit}`;
        if (searchCriteria.adminQuery !== '') {
            request.url = request.url.concat(`&adminQuery=${searchCriteria.adminQuery}`);
        }
        if (searchCriteria.roleId !== 'All') {
            request.url = request.url.concat(`&roleId=${searchCriteria.roleId}`);
        }
        if (searchCriteria.supplierId !== 'All') {
            request.url = request.url.concat(`&supplierId=${searchCriteria.supplierId}`);
        }
        if (searchCriteria.status && searchCriteria.status !== 'All') {
            request.url = `${request.url}&status=["${searchCriteria.status}"]`;
        }
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getAdmin(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/admins/${id}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    updateUser(user) {
        const request = {};
        request.url = `${this._AppConstants.api}/admins/${user._id}`;
        request.method = 'PUT';
        request.headers = this._request.headers;
        request.data = user;
        return this.retryRequest(request);
    }

    getOrdersReport(searchCriteria) {
        const request = {};
        request.method = 'GET';
        request.headers = this._request.headers;
        request.url = `${this._AppConstants.api}/admins/reports/orders?skip=${searchCriteria.skip}&limit=${searchCriteria.limit}`;
        request.url = request.url.concat(`&startDate=${searchCriteria.startDate}`);
        request.url = request.url.concat(`&endDate=${searchCriteria.endDate}`);
        if (searchCriteria.customerId && searchCriteria.customerId !== 'All') {
            request.url = request.url.concat(`&customerId=${searchCriteria.customerId}`);
        }
        if (searchCriteria.supplierId && searchCriteria.supplierId !== 'All') {
            request.url = request.url.concat(`&supplierId=${searchCriteria.supplierId}`);
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

    exportFile(type, reportType, searchCriteria) {
        let url = `${this._AppConstants.api}/suppliers/reports/${reportType}`;
        if (type === 'pdf') {
            url = `${url}?export=${type}`;
        } else {
            url = `${url}?export=${type}`;
        }
        url = url.concat(`&skip=${searchCriteria.skip}`);
        url = url.concat(`&limit=${searchCriteria.limit}`);
        url = url.concat(`&startDate=${searchCriteria.startDate}`);
        url = url.concat(`&endDate=${searchCriteria.endDate}`);
        if (searchCriteria.supplierId) {
            if (searchCriteria.supplierId !== 'All') {
                url = url.concat(`&supplierId=${searchCriteria.supplierId}`);
            }
        }
        if (searchCriteria.customerId) {
            if (searchCriteria.customerId !== 'All') {
                url = url.concat(`&customerId=${searchCriteria.customerId}`);
            }
        }
        if (searchCriteria.status && searchCriteria.status.length > 0) {
            let status = '[';
            for (let i = 0; i < searchCriteria.status.length; i += 1) {
                if (i < searchCriteria.status.length - 1) {
                    status = status.concat(`"${searchCriteria.status[i]}",`);
                } else {
                    status = status.concat(`"${searchCriteria.status[i]}"`);
                }
            }
            status = status.concat(']');
            url = url.concat(`&status=${status}`);
        }
        if (searchCriteria.type) {
            url = url.concat(`&type=${searchCriteria.type}`);
        }
        const request = {
            url,
            headers: this._request.headers,
            responseType: 'arraybuffer',
            method: 'GET',
        };

        this.retryRequest(request).then(
            (result) => {
                suppliesOnHelper.createBlob(result, 'SupOn-Report', type);
            }
        );
    }

    printFile(orderId) {
        let url = `${this._AppConstants.api}/exportFile`;
        url = `${url}/print?`;
        if (orderId) {
            url = url.concat(`orderId=${orderId}`);
        }
        const request = {
            url,
            headers: this._request.headers,
            responseType: 'arraybuffer',
            method: 'GET',
        };

        this.retryRequest(request).then(
            (result) => {
                suppliesOnHelper.createBlob(result, 'SupOn-Report', 'pdf');
            }
        );
    }
}
AdminService.$inject = ['AppConstants', 'JwtService', '$q', 'RetryRequest'];

