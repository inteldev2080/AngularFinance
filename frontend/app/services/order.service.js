import suppliesOnHelper from '../supplieson.helper';

export default class OrderService {
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

    getStatistics() {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/count/`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getOrder(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/${query.orderId}?skip=${query.skip}&limit=${query.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getRecurringOrder(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/recurringOrders/${query.orderId}?skip=${query.skip}&limit=${query.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getOrderLog(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/log/${query.orderId}?skip=${query.skip}&limit=${query.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getOrders(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders`;
        request.url = `${request.url}?skipOrderHistory=${query.skipOrderHistory}`;
        request.url = `${request.url}&limitOrderHistory=${query.limitOrderHistory}`;
        request.url = `${request.url}&skipRecurringOrder=${query.skipRecurringOrder}`;
        request.url = `${request.url}&limitRecurringOrder=${query.limitRecurringOrder}`;
        request.url = `${request.url}&&skip=0&limit=10`;
        if (query.supplierId) {
            request.url = `${request.url}&supplierId=${query.supplierId}`;
        }
        request.method = 'GET';
        request.headers = this._request.headers;

        return this.retryRequest(request);
    }

    getOrdersHistory(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders?skip=${query.skip}&limit=${query.limit}`;
        if (query.orderId !== '') {
            request.url = `${request.url}&filterQuery=${query.orderId}`;
        }
        if (query.supplierId) {
            request.url = `${request.url}&supplierId=${query.supplierId}`;
        }
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getRecurringOrders(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/recurringOrders?supplierId=${query.supplierId}&skip=${query.skip}&limit=${query.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    cancelRecurringOrder(id) {
        const request = {
            url: `${this._AppConstants.api}/recurringOrders/${id}/cancel`,
            method: 'PUT',
            headers: this._request.headers
        };
        return this.retryRequest(request);
    }

    reOrder(id) {
        const request = {
            url: `${this._AppConstants.api}/orders/${id}/reOrder`,
            method: 'POST',
            headers: this._request.headers
        };
        return this.retryRequest(request);
    }

    getOrdersOverview() {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/overview`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getNewOrders(query, productId) {
        const request = {};
        if (query.city) {
            request.url = `${this._AppConstants.api}/orders/?status=["pending"]&skip=${query.skip}&limit=${query.limit}&city=${query.city}`;
        } else {
            request.url = `${this._AppConstants.api}/orders/?status=["pending"]&skip=${query.skip}&limit=${query.limit}`;
        }

        if (query.startDate && query.endDate) {
            request.url = `${request.url}&startDate=${query.startDate}&endDate=${query.endDate}`;
        }

        if (productId) {
            request.url = `${request.url}&productId=${productId}`;
        }
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }//
    getAcceptedOrders(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/?status=["accepted"]&skip=${query.skip}&limit=${query.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getReadyForDeliveryOrders(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/?status=["readyfordelivery"]&skip=${query.skip}&limit=${query.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getOutForDeliveryOrders(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/?status=["outfordelivery"]&skip=${query.skip}&limit=${query.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getFailedToDeliverOrders(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/?status=["FailedToDeliver"]&skip=${query.skip}&limit=${query.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getFailedOrders(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/?status=["Rejected","Canceled","CanceledByCustomer"]&skip=${query.skip}&limit=${query.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    getReviewedOrders(query) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/reviews/?skip=${query.skip}&limit=${query.limit}`;
        request.method = 'GET';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    reviewOrder(id, data) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/review/${id}`;
        request.method = 'POST';
        request.headers = this._request.headers;
        request.data = data;
        return this.retryRequest(request);
    }

    rejectOrder(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/reject/${id}`;
        request.method = 'PUT';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    cancelOrder(id, data) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/cancel/${id}`;
        request.method = 'PUT';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    acceptOrder(id, data) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/accept/${id}`;
        request.method = 'PUT';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    prepareOrder(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/prepare/${id}`;
        request.method = 'PUT';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    readyForDeliveryOrder(id) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/readyForDelivery/${id}`;
        request.method = 'PUT';
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    outForDeliveryOrder(id, data) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/outForDelivery/${id}`;
        request.method = 'PUT';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    deliveredOrder(id, data = null) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/delivered/${id}`;
        request.method = 'PUT';
        request.headers = this._request.headers;
        if (data) {
            request.data = data;
        }
        const request1 = {};
        request1.url = `${this._AppConstants.api}/invoices/create/${id}`;
        request1.method = 'GET';
        request1.headers = this._request.headers;
        this.retryRequest(request1).then(
            (result) => {
                let url =  `${this._AppConstants.api}/invoices/getInvoice?id=${result.data.data._id}&export=pdf`;
                const request2 = {
                    url,
                    headers: this._request.headers,
                    responseType: 'arraybuffer',
                    method: 'GET',
                };
                this.retryRequest(request2).then(
                    (result1) => {
                        suppliesOnHelper.createBlob(result1, 'SupOn-Report', 'pdf');
                    }
                );
            }
        );
        return this.retryRequest(request);
    }

    failOrder(id, data) {
        const request = {};
        request.url = `${this._AppConstants.api}/orders/fail/${id}`;
        request.method = 'PUT';
        request.data = data;
        request.headers = this._request.headers;
        return this.retryRequest(request);
    }

    exportFile(type, searchCriteria) {
        let url = `${this._AppConstants.api}/orders/orderPurchase/${searchCriteria.orderId}`;
        if (type === 'pdf') {
            url = `${url}?export=${type}`;
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

    exportRecurringOrderDetailsFile(type, searchCriteria) {
        let url = `${this._AppConstants.api}/recurringOrders/orderPurchase/${searchCriteria.orderId}`;
        if (type === 'pdf') {
            url = `${url}?export=${type}`;
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

    outForDeliveryAndPrint(orders, driver) {
        const url = `${this._AppConstants.api}/orders/deliveryNote?export=pdf`;
        const request = {
            url,
            headers: this._request.headers,
            responseType: 'arraybuffer',
            method: 'POST',
            data: {
                orders,
                driver
            }
        };

        return this.retryRequest(request).then(
            (result) => {
                suppliesOnHelper.createBlob(result, 'SupOn-Report', 'pdf');
            }
        );
    }

    addProductToOrder(orderId, productId, quantity) {
        if (orderId && productId && quantity) {
            const url = `${this._AppConstants.api}/orders/orderProduct/add/${orderId}`;
            const request = {
                url,
                headers: this._request.headers,
                method: 'POST',
                data: {productId, quantity}
            };
            return this.retryRequest(request);
        }
    }

    addProductToRecurringOrder(orderId, productId, quantity) {
        if (orderId && productId && quantity) {
            const url = `${this._AppConstants.api}/recurringOrders/orderProduct/add/${orderId}`;
            const request = {
                url,
                headers: this._request.headers,
                method: 'POST',
                data: {productId, quantity}
            };
            return this.retryRequest(request);
        }
    }

    editProductInRecurringOrder(productId, quantity, orderId) {
        if (productId && quantity) {
            const url = `${this._AppConstants.api}/recurringOrders/orderProduct/update/${orderId}`;
            const request = {
                url,
                headers: this._request.headers,
                method: 'PUT',
                data: {quantity, productId}
            };
            return this.retryRequest(request);
        }
    }

    deleteProductInRecurringOrder(orderId, productId) {
        if (orderId && productId) {
            const url = `${this._AppConstants.api}/recurringOrders/orderProduct/delete/${orderId}`;
            const request = {
                url,
                headers: this._request.headers,
                data: {productId},
                method: 'DELETE',
            };
            return this.retryRequest(request);
        }
    }

    editProductInOrder(productIdInOrder, quantity) {
        if (productIdInOrder && quantity) {
            const url = `${this._AppConstants.api}/orders/orderProduct/update/${productIdInOrder}`;
            const request = {
                url,
                headers: this._request.headers,
                method: 'PUT',
                data: {quantity}
            };
            return this.retryRequest(request);
        }
    }

    deleteProductInOrder(productIdInOrder) {
        if (productIdInOrder) {
            const url = `${this._AppConstants.api}/orders/orderProduct/delete/${productIdInOrder}`;
            const request = {
                url,
                headers: this._request.headers,
                method: 'DELETE',
            };
            return this.retryRequest(request);
        }
    }

}

OrderService.$inject = ['AppConstants', 'JwtService', 'RetryRequest'];
