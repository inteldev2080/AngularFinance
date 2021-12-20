import suppliesOnHelper from '../supplieson.helper';

export default class SupplierService {
    constructor(AppConstants, JwtService, RetryRequest) {
        this._AppConstants = AppConstants;
        this.current = null;
        this._JwtService = JwtService;
        this.retryRequest = RetryRequest;
        this._request = {};
        this._request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
    }

    createSupplier(supplier, isAdmin) {
        const request = {
            url: `${this._AppConstants.api}/suppliers`,
            method: 'POST',
            data: supplier
        };
        request.headers = {
            'Content-Type': 'application/json',
        };
        if (isAdmin) {
            request.url = `${request.url}?admin=true`;
        }
        return this.retryRequest(request);
    }

    getSuppliers(searchCriteria) {
        const request = {};
        request.url = `${this._AppConstants.api}/Suppliers?`;
        request.method = 'GET';
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
        if (searchCriteria) {
            if (searchCriteria.skip || searchCriteria.skip === 0) {
                request.url = request.url.concat(`skip=${searchCriteria.skip}&`);
            }
            if (searchCriteria.limit) {
                request.url = request.url.concat(`limit=${searchCriteria.limit}&`);
            }
            if (searchCriteria.supplierName) {
                request.url = request.url.concat(`supplierName=${searchCriteria.supplierName}&`);
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
                request.url = request.url.concat(`status=${status}`);
            }
            if (searchCriteria.payingSoon) {
                request.url = `${request.url}&payingSoon=${searchCriteria.payingSoon}`;
            }
            if (searchCriteria.missedPayment) {
                request.url = `${request.url}&missedPayment=${searchCriteria.missedPayment}`;
            }
        }
        return this.retryRequest(request);
    }

    getBranches() {
        const request = {};
        request.url = `${this._AppConstants.api}/branches`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getBranchesByCustomerId(id){
        const request = {};
        request.url = `${this._AppConstants.api}/suppliers/reports/branches?customerId=`+id;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }
    getSupplier(supplierId) {
        const request = {
            url: `${this._AppConstants.api}/suppliers/${supplierId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._JwtService.get()}`
            }
        };
        return this.retryRequest(request);
    }

    getProfileInfo() {
        const request = {
            url: `${this._AppConstants.api}/suppliers/profile`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._JwtService.get()}`
            }
        };
        return this.retryRequest(request);
    }

    updateSupplier(supplier) {
        const request = {};
        request.url = `${this._AppConstants.api}/suppliers/${supplier._id}`;
        request.method = 'PUT';
        request.headers = this._request.headers;
        request.data = supplier;
        return this.retryRequest(request);
    }

    adminUpdateSupplier(supplier) {
        const request = {};
        request.url = `${this._AppConstants.api}/suppliers/supplier/${supplier._id}`;
        request.method = 'PUT';
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
        request.data = supplier;
        return this.retryRequest(request);
    }

    blockSupplier(supplierId) {
        const request = {
            url: `${this._AppConstants.api}/suppliers/block/${supplierId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._JwtService.get()}`
            },
        };
        return this.retryRequest(request);
    }

    unblockSupplier(supplierId) {
        const request = {
            url: `${this._AppConstants.api}/suppliers/unblock/${supplierId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._JwtService.get()}`
            }
        };
        return this.retryRequest(request);
    }

    deleteSupplier(supplierId) {
        const request = {
            url: `${this._AppConstants.api}/suppliers/${supplierId}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._JwtService.get()}`
            }
        };
        return this.retryRequest(request);
    }

    updateSupplierRelation(supplierId, details) {
        const request = {};
        request.url = `${this._AppConstants.api}/suppliers/admin/${supplierId}`;
        request.method = 'PUT';
        request.headers = this._request.headers;
        request.data = details;
        return this.retryRequest(request);
    }

    deleteSupplier(supplierId, supplier) {
        const request = {};
        request.url = `${this._AppConstants.api}/suppliers/${supplierId}`;
        request.method = 'DELETE';
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
        request.data = supplier;
        return this.retryRequest(request);
    }

    createSupplierStaffMember(staffMember) {
        const request = {};
        request.url = `${this._AppConstants.api}/suppliers/staff`;
        request.method = 'POST';
        request.data = staffMember;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getSupplierDrivers(searchCriteria) {
        const request = {};
        request.url = `${this._AppConstants.api}/suppliers/drivers?skip=${searchCriteria.skip}&limit=${searchCriteria.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getSupplierStaff(searchCriteria) {
        const request = {};
        request.url = `${this._AppConstants.api}/suppliers/staff?skip=${searchCriteria.skip}&limit=${searchCriteria.limit}`;
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
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    updateSupplierStaffMember(user) {
        const request = {};
        request.url = `${this._AppConstants.api}/suppliers/staff/${user._id}`;
        request.method = 'PUT';
        request.data = user;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    deleteSupplierStaffMember(staffMemberId, staffMember) {
        const request = {};
        request.url = `${this._AppConstants.api}/suppliers/staff?staffId=${staffMemberId}`;
        request.method = 'PUT';
        request.data = staffMember;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getOrdersReport(searchCriteria) {
        const request = {};
        request.method = 'GET';
        request.headers = this._request.headers;
        request.url = `${this._AppConstants.api}/suppliers/`;
        request.url = request.url.concat('reports/orders?');
        request.url = request.url.concat(`skip=${searchCriteria.skip}`);
        request.url = request.url.concat(`&limit=${searchCriteria.limit}`);
        request.url = request.url.concat(`&startDate=${searchCriteria.startDate}`);
        request.url = request.url.concat(`&endDate=${searchCriteria.endDate}`);
        if (searchCriteria.customerId) {
            if (searchCriteria.customerId !== 'All') {
                request.url = request.url.concat(`&customerId=${searchCriteria.customerId}`);
            }
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

    getTransactionsReports(startDate, endData) {
        const request = {};
        request.url = `${this._AppConstants.api}/suppliers/reports/transactions?startDate=${startDate}&endDate=${endData}`;
        request.method = 'GET';
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `${this._JwtService.get()}`
        };
        return this.retryRequest(request);
    }

    approveSupplier(supplierId) {
        const request = {
            url: `${this._AppConstants.api}/suppliers/approve/${supplierId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._JwtService.get()}`
            },
        };
        return this.retryRequest(request);
    }

    getBillingHistory(query) {
        let url = `${this._AppConstants.api}/suppliers/billingHistory`;
        const request = {};
        if (query) {
            if (query.supplierId) {
                url = `${url}/${query.supplierId}`;
            }
            url = `${url}?skip=${query.skip}&limit=${query.limit}`;
        }
        request.url = url;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getSupplierPaymentClaims(query) {
        let url = `${this._AppConstants.api}/payments?`;
        const request = {};
        if (query) {
            if (query.supplierId) {
                url = `${url}&supplierId=${query.supplierId}`;
            }
            if (query.isAdminFees) {
                url = `${url}&isAdminFees=${query.isAdminFees}`;
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

    exportSupplierList(type, searchCriteria) {
        let url = `${this._AppConstants.api}/suppliers`;
        if (type === 'pdf') {
            url = `${url}?export=${type}`;
        } else {
            url = `${url}?export=${type}`;
        }
        url = `${url}&skip=${searchCriteria.skip}`;
        url = `${url}&limit=${searchCriteria.limit}`;
        if (searchCriteria.supplierName) {
            url = `${url}&supplierName=${searchCriteria.supplierName}`;
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

    printFile(orderId, query) {
        let url = `${this._AppConstants.api}/orders/orderPurchase`;
        if (orderId) {
            url = url.concat(`/${orderId}`);
        }
        if (query) {
            url = url.concat(`?skip=0&limit=10&export=${query}`);
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

    getCommercialRegisterPhoto(photoId) {
        // const request = {};
        const url = `${photoId}`;
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

    getDeliveryImagePhone(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            if (this.status == 200) {

                var myBlob = this.response;
                // myBlob is now the blob that the object URL pointed to.
                const file = new Blob([myBlob], {type: 'image/png'});
                const fileURL = URL.createObjectURL(file);
                window.open(url, '_blank', 'Download');
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.style = 'display: none';
                a.href = fileURL;  // For chrome,firefox,opera and safari
                const extension = file.type.split('/')[1];
                a.download = `image.${extension}`;
                a.click();

                return;
            }
        };
        xhr.send();
    }
}
SupplierService.$inject = ['AppConstants', 'JwtService', 'RetryRequest'];

