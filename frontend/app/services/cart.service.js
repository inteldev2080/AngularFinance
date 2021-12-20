export default class CartService {
    constructor(AppConstants, JwtService, RetryRequest) {
        this._AppConstants = AppConstants;
        this._JwtService = JwtService;
        this.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
        this.retryRequest = RetryRequest;
    }
    addToCart(item) {
        const request = {};
        request.method = 'POST';
        request.data = item;
        request.url = `${this._AppConstants.api}/carts`;
        request.headers = this.headers;
        return this.retryRequest(request);
    }

    requestProduct(id) {
        const request = {};
        request.method = 'POST';
        request.url = `${this._AppConstants.api}/products/requestSpecialPrice/${id}`;
        request.headers = this.headers;
        return this.retryRequest(request);
    }

    getCartBySupplier(id) {
        const request = {};
        request.method = 'GET';
        request.url = `${this._AppConstants.api}/carts/supplier/${id}`;
        request.headers = this.headers;
        return this.retryRequest(request);
    }
    checkoutCart(cartId, branchId, recurringBody = null) {
        const url = `${this._AppConstants.api}/carts/checkout/${cartId}?branchId=${branchId}`;
        const request = {};
        request.url = url;
        request.method = 'POST';
        if (recurringBody) {
            request.data = recurringBody;
        }
        request.headers = this.headers;
        return this.retryRequest(request);
    }
    deleteProductFromCart(productId) {
        const url = `${this._AppConstants.api}/carts/product/${productId}`;
        const request = {};
        request.url = url;
        request.method = 'DELETE';
        request.headers = this.headers;
        return this.retryRequest(request);
    }
    updateProductQuantity(productId, newQuantity) {
        const url = `${this._AppConstants.api}/carts/product/${productId}?quantity=${newQuantity}`;
        const request = {};
        request.url = url;
        request.method = 'PUT';
        request.headers = this.headers;
        return this.retryRequest(request);
    }
}
CartService.$inject = ['AppConstants', 'JwtService', 'RetryRequest'];
