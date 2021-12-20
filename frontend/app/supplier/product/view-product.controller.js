export default class ViewProductCtrl {
    constructor(ProductService, $translate, $stateParams, $window) {
        this._ProductService = ProductService;
        this._$translate = $translate;
        this._$stateParams = $stateParams;
        this.$window = $window;
    }
    $onInit() {
        this.status = [
            {
                _id: 'Active',
                arabicName: 'مفعل',
                englishName: 'Active'
            },
            {
                _id: 'Hidden',
                arabicName: 'مخفي',
                englishName: 'Hidden'
            }
        ];
        this.product = {};
        const productId = this._$stateParams.productId;
        this.getProduct(productId);
    }
    getProduct(productId) {
        this.isLoading = true;
        const _onSuccess = (res) => {
            this.product = res.data.data;
            if (this.product.status === 'Active') this.product.status = this.status[0];
            else if (this.product.status === 'Hidden') this.product.status = this.status[1];
        };
        const _onError = (err) => {
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = () => {
            this.isLoading = false;
        };
        this._ProductService.getProduct(productId)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }
    deleteProduct() {
        const ctrl = this;
        if (!this.product._id) { this.notify('supplier.product.message.productDeleteFailure', 'danger', 5000); return; }
        this.isLoading = true;
        const _onSuccess = (res) => {
            if (res.status === 200) {
                this.res = res;
                this.notify('supplier.product.message.productDeleteSuccess', 'success', 500);
                $('#deleteModal').modal('hide');
                $('#deleteModal').on('hidden.bs.modal', () => {
                    ctrl.$window.history.back();
                });
            } else {
                this.notify('supplier.product.message.productDeleteFailure', 'danger', 5000);
                $('#deleteModal').modal('hide');
            }
        };
        const _onError = (err) => {
            $('#deleteModal').modal('hide');
            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
            this.notify('supplier.product.message.productDeleteFailure', 'danger', 5000);
        };
        const _onFinal = () => {
            this.isLoading = false;
        };
        this._ProductService.deleteProduct(this.product._id)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }
    notify(message, type, timeout) {
        this._$translate(message).then((translation) => {
            $('body')
                .pgNotification({
                    style: 'bar',
                    message: translation,
                    position: 'top',
                    timeout,
                    type
                })
                .show();
        });
    }
    openConfirmMessage(id) {
        $('#deleteModal').modal('show');
    }
}
ViewProductCtrl.$inject = ['ProductService', '$translate', '$stateParams', '$window'];
