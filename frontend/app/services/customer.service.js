import suppliesOnHelper from '../supplieson.helper';

export default class CustomerService {
    constructor(AppConstants, JwtService, RetryRequest, Upload) {
        this._AppConstants = AppConstants;
        this._JwtService = JwtService;
        this.retryRequest = RetryRequest;
        this.Upload = Upload;
        this._request = {};
        this.url = `${this._AppConstants.api}/customers`;
        this._request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
    }

    createCustomer(data) {
        const request = {};
        request.url = `${this.url}`;
        request.method = 'POST';
        request.data = data;
        request.headers = {
            'Content-Type': 'application/json',
        };
        return this.retryRequest(request);
    }

    getCustomerStaff(searchCriteria) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/staff?skip=${searchCriteria.skip}&limit=${searchCriteria.limit}`;
        if (searchCriteria.staffQuery && searchCriteria.staffQuery !== '') {
            request.url = `${request.url}&staffQuery=${searchCriteria.staffQuery}`;
        }
        if (searchCriteria.roleId !== 'All') {
            request.url = request.url.concat(`&roleId=${searchCriteria.roleId}`);
        }
        if (searchCriteria.status && searchCriteria.status !== 'All') {
            request.url = `${request.url}&status=["${searchCriteria.status}"]`;
        }
        request.method = 'GET';
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
        return this.retryRequest(request);
    }

    updateCustomerStaffMember(user) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/staff/${user._id}`;
        request.method = 'PUT';
        request.data = user;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    createCustomerStaffMember(staffMember) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/staff`;
        request.method = 'POST';
        request.data = staffMember;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    inviteCustomerWithExcel(inviteList){
        const request = {};
        request.url = `${this._AppConstants.api}/customers/excel`;
        request.method = 'POST';
        request.data = inviteList;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }


    getCustomers(query) {
        let url = `${this._AppConstants.api}/customers`;
        const request = {};
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
        request.method = 'GET';
        if (query) {
            url = `${url}?skip=${query.skip}&limit=${query.limit}`;
            if (query.customerName && query.customerName !== '') {
                url = `${url}&customerName=${query.customerName}`;
            }
            if (query.supplierId && query.supplierId !== '') {
                url = `${url}&supplierId=${query.supplierId}`;
            }
            if (query.status && query.status.length > 0) {
                let status = '[';
                for (let i = 0; i < query.status.length; i += 1) {
                    if (i < query.status.length - 1) {
                        status = status.concat(`"${query.status[i]}",`);
                    } else {
                        status = status.concat(`"${query.status[i]}"`);
                    }
                }
                status = status.concat(']');
                url = `${url}&status=${status}`;
            }
            if (query.payingSoon) {
                url = `${url}&payingSoon=${query.payingSoon}`;
            }
            if (query.missedPayment) {
                url = `${url}&missedPayment=${query.missedPayment}`;
            }
            if (query.nameOnly) {
                url = `${url}&nameOnly=${query.nameOnly}`;
            }
            if (query.city) {
                url = `${url}&city=${query.city}`;
            }
        }
        request.url = url;
        return this.retryRequest(request);
    }

    getCustomer(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/${id}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    updateCustomer(data) {
        debugger;
        const request = {};
        request.url = `${this._AppConstants.api}/customers`;
        request.method = 'PUT';
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
        request.data = data;
        return this.retryRequest(request);
    }

    inviteCustomer(data) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/invite`;
        request.method = 'POST';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getCustomerBillingHistory(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/billingHistory?skip=${query.skip}&limit=${query.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getSupplierCustomerBillingHistory(id, query) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/billingHistory/${id}?skip=${query.skip}&limit=${query.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getCustomerPaymentClaims(query) {
        let url = `${this._AppConstants.api}/payments?`;
        const request = {};
        if (query) {
            if (query.customerId) {
                url = `${url}&customerId=${query.customerId}`;
            }

            if (query.status && query.status.length > 0) {
                let status = '[';
                for (let i = 0; i < query.status.length; i += 1) {
                    if (i < query.status.length - 1) {
                        status = status.concat(`"${query.status[i]}",`);
                    } else {
                        status = status.concat(`"${query.status[i]}"`);
                    }
                }
                status = status.concat(']');
                url = url.concat(`&status=${status}`);
            }
            url = `${url}&skip=${query.skip}&limit=${query.limit}`;
        }
        request.url = url;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getCustomerSpecialPrices(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/specialPrices?skip=${query.skip}&limit=${query.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getSupplierCustomerSpecialPrices(id, query) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/specialPrices?customerId=${id}&skip=${query.skip}&limit=${query.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getCustomerSupplierSpecialPrices(id, query, type) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/specialPrices?supplierId=${id}&skip=${query.skip}&limit=${query.limit}`;
        if (type === 'pdf') {
            request.url = `${request.url}&export=${type}`;
        } else if (type === 'xls') {
            request.url = `${request.url}&export=${type}`;
        }
        request.method = 'GET';
        request.headers = this._request.headers;
        const res = this.retryRequest(request);
        if (type) {
            return res.then(
                (result) => {
                    suppliesOnHelper.createBlob(result, 'SupOn-Report', type);
                }
            );
        }
        return res;
    }

    addCustomerSpecialPrices(details) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/specialPrices`;
        request.method = 'POST';
        this._request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
        request.headers = this._request.headers;
        request.data = details;
        return this.retryRequest(request);
    }

    updateCustomerRelation(customerId, details) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/supplier/${customerId}`;
        request.method = 'PUT';
        request.headers = this._request.headers;
        request.data = details;
        return this.retryRequest(request);
    }

    updateCustomerCity(customerId, details) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/city/update/${customerId}`;
        request.method = 'PUT';
        request.headers = this._request.headers;
        request.data = details;
        return this.retryRequest(request);
    }

    updateCustomerAddress(customerId, details) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/address/update/${customerId}`;
        request.method = 'PUT';
        request.headers = this._request.headers;
        request.data = details;
        return this.retryRequest(request);
    }

    getCurrentCustomer() {
        const request = {};
        request.method = 'GET';
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
        request.url = `${this._AppConstants.api}/customers/current`;
        return this.retryRequest(request);
    }

    exportCustomerList(type, searchCriteria) {
        let url = `${this._AppConstants.api}/customers`;
        if (type === 'pdf') {
            url = `${url}?export=${type}`;
        } else {
            url = `${url}?export=${type}`;
        }
        url = `${url}&skip=${searchCriteria.skip}`;
        url = `${url}&limit=${searchCriteria.limit}`;
        if (searchCriteria.customerName) {
            url = `${url}&customerName=${searchCriteria.customerName}`;
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
            url = `${url}&status=${status}`;
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

    updateCustomerSpecialPrices(productId, customer, priceTotal) {
        const request = {
            url: `${this._AppConstants.api}/customers/specialPrices/${productId}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._JwtService.get()}`
            },
            method: 'PUT',
            data: {'customerId': customer, 'price': priceTotal}
        };
        return this.retryRequest(request);
    }

    deleteCustomerSpecialPrices(productId, customerId) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/specialPrices/${productId}?customerId=${customerId}`;
        request.method = 'DELETE';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    downloadSpecialPrices(customerId) {
        const request = {
            url: `${this._AppConstants.api}/customers/download/specialPrices`,
            headers: this._request.headers,
            responseType: 'arraybuffer',
            method: 'POST',
            data: {customerId}
        };
        return this.retryRequest(request).then(
            (result) => {
                suppliesOnHelper.createBlob(result, `specialPrice_${customerId}`, 'xlsx');
            }
        );
    }

    uploadSpecialPrices(customerId, file) {
        const upload = this.Upload.upload({
            method: 'PUT',
            url: `${this._AppConstants.api}/customers/upload/specialPrices/${customerId}`,
            data: {file},
            disableProgress: true,
            headers: this._request.headers
        });
        return upload;
    }

    exportSupplierCustomerSpecialPricesList(type, id, query) {
        const request = {};
        request.url = `${this._AppConstants.api}/customers/specialPrices?customerId=${id}&skip=${query.skip}&limit=${query.limit}&export=${type}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        const res = this.retryRequest(request);
        if (type) {
            return res.then(
                (result) => {
                    suppliesOnHelper.createBlob(result, 'SupOn-Report', type);
                }
            );
        }
        return res;
    }

    uploadCoverPhoto(photo) {
        const upload = this.Upload.upload({
            url: this._AppConstants.UPLOAD_URL,
            data: {image: photo},
            disableProgress: true,
            headers: {Accept: 'application/json'}
        });
        return upload;
    }

    uploadCommercialRegisterPhoto(photo) {
        const upload = this.Upload.upload({
            url: this._AppConstants.UPLOAD_URL,
            data: {image: photo},
            disableProgress: true,
            headers: {Accept: 'application/json'}
        });
        return upload;
    }

    getCommercialRegisterPhoto(photoId) {
        // const request = {};
        const url = `${this._AppConstants.UPLOAD_URL}/${photoId}`;
        // request.url = `${this._AppConstants.UPLOAD_URL}/${photoId}`;
        // request.method = 'GET';
        // return this.retryRequest(request).then(
        // (result) => {
        // const file = new Blob([result], { type: result.headers('content-type') });
        // const fileURL = URL.createObjectURL(file);
        window.open(url, '_blank', 'Download');
        // const a = document.createElement('a');
        // document.body.appendChild(a);
        // a.style = 'display: none';
        // a.href = fileURL;  // For chrome,firefox,opera and safari
        // const extension = file.type.split('/')[1];
        // a.download = `${photoId}.${extension}`;
        // a.click();
        // }
        //  );
    }

    exportFile(type, reportType, searchCriteria) {
        let url = `${this._AppConstants.api}/orders/reports`;
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

        if (searchCriteria.branchId) {
            if (searchCriteria.branchId !== 'All') {
                url = url.concat(`&branchId=${searchCriteria.branchId}`);
            }
        }

        if (searchCriteria.customerId) {
            if (searchCriteria.customerId !== 'All') {
                url = url.concat(`&customerId=${searchCriteria.customerId}`);
            }
        }

        if (searchCriteria.userId) {
            url = url.concat(`&userId=${searchCriteria.userId}`);
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

        if (searchCriteria.summaryReport) {
            url = url.concat(`&summaryReport=${searchCriteria.summaryReport}`);
        }

        if (searchCriteria.detailedReport) {
            url = url.concat(`&detailedReport=${searchCriteria.detailedReport}`);
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

}
CustomerService.$inject = ['AppConstants', 'JwtService', 'RetryRequest', 'Upload'];

