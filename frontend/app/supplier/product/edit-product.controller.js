export default class EditProductCtrl {
    constructor(ProductService,
                $translate,
                $stateParams,
                CategoryService,
                $window,
                SystemService,
                Upload,
                AppConstants) {
        this._ProductService = ProductService;
        this._$translate = $translate;
        this._$stateParams = $stateParams;
        this._CategoryService = CategoryService;
        this.$window = $window;
        this.SystemService = SystemService;
        this.Upload = Upload;
        this.isUploadPhoto = false;
        this.UPLOAD_URL = AppConstants.UPLOAD_URL;
    }

    $onInit() {
        this.product = {
            categories: [],
            images: ['', '', '']
        };
        const productId = this._$stateParams.productId;
        this.getProduct(productId);
        this.getStatus();
        this.getUnits();
        this.getCategories({});
        this.isUploadPhoto = false;
    }

    getProduct(productId) {
        this.isLoading = true;
        const _onSuccess = (res) => {
            this.product = res.data.data;
            this.productCategoryId = this.product.categories[0]._id;
            this.product.unit = this.product.unit._id;
            this.coverPhoto = this.product.coverPhoto;
            this.image1 = this.product.images[0];
            this.image2 = this.product.images[1];
            this.image3 = this.product.images[2];
            $.Pages.init();
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

    getCategories(searchCriteria) {
        this.isLoading = true;
        const _onSuccess = (res) => {
            this.categories = res.data.data.categories;
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
        this._CategoryService.getCategories(searchCriteria).then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    getUnits() {
        this.units = [];
        const _onSuccess = (res) => {
            this.units = res.data.data;
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
        this.SystemService.getSystemUnits()
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    getStatus() {
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

    resetForm(form) {
        this.product = {
            categories: [this.productCategoryId],
            status: this.status[0]._id,

        };
        form.$setPristine();
        form.$setUntouched();
        // form.$setValidity();
    }

    updateProduct(productForm) {
        if (!this.product.coverPhoto) {
            this.notify('supplier.product.message.coverPhoto', 'warning', 10000);
            return;
        }
        if (productForm.$invalid || !this.productCategoryId) return;
        this.isLoading = true;
        this.product.categories = [this.productCategoryId];
        this.isLoading = true;
        const _onSuccess = (res) => {
            this.product = {};
            this.res = res;
            this.notify('supplier.product.message.productUpdateSuccess', 'success', 10000);
            this.$window.history.back();
        };
        const _onError = (err) => {

            if (err.status === 400 && err.data.errorCode === 115) {
                this.hasError = true;
                this.notify('supplier.product.message.skuError', 'error', 10000);
            }

            if (err.code === 500) {
                this.hasError = true;
            } else if (err.code === 115) {
                this.hasError = true;
            } else if (err.code === 501) {
                this.noInternetConnection = true;
            }
        };
        const _onFinal = () => {
            this.isLoading = false;
        };
        this._ProductService.updateProduct(this.product)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    uploadFile(file, errFiles, imgFor) {
        switch (imgFor) {
            case 'coverPhoto' : {
                this.product.coverPhoto = null;
                this.isUploadPhoto = true;
                break;
            }
            case 'image1' : {
                this.product.images[0] = '';
                break;
            }
            case 'image2' : {
                this.product.images[1] = '';
                break;
            }
            case 'image3' : {
                this.product.images[2] = '';
                break;
            }
            default:
                this.product.images = [];
        }
        const ctrl = this;
        this.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = this.Upload.upload({
                url: ctrl.UPLOAD_URL,
                data: {image: file},
                disableProgress: true,
                headers: {Accept: 'application/json'}
            });
            file.upload.then((response) => {
                switch (imgFor) {
                    case 'coverPhoto' : {
                        ctrl.product.coverPhoto = response.data.data.filename;
                        ctrl.coverPhoto = response.data.data.path;
                        this.isUploadPhoto = false;
                        break;
                    }
                    case 'image1' : {
                        ctrl.product.images[0] = response.data.data.filename;
                        ctrl.image1 = response.data.data.path;
                        break;
                    }
                    case 'image2' : {
                        ctrl.product.images[1] = response.data.data.filename;
                        ctrl.image2 = response.data.data.path;
                        break;
                    }
                    case 'image3' : {
                        ctrl.product.images[2] = response.data.data.filename;
                        ctrl.image3 = response.data.data.path;
                        break;
                    }
                    default:
                        this.product.images = [];
                }
            }, (response) => {
                if (response.status > 0) {
                    this.errorMsg = `${response.status}: ${response.data}`;
                    this.isUploadPhoto = false;
                }
            }, (evt) => {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        } else {
            this.coverPhoto = 'assets/img/pattern/pattern1.png';
            this.isUploadPhoto = false;
        }
    }
}
EditProductCtrl.$inject = ['ProductService', '$translate', '$stateParams', 'CategoryService', '$window', 'SystemService', 'Upload',
    'AppConstants'];
