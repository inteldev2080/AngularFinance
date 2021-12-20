export default class NewProductCtrl {
    constructor(ProductService,
                $translate,
                $stateParams,
                CategoryService,
                SystemService,
                FileUploader,
                $rootScope,
                Upload,
                AppConstants,
                $window) {
        this._ProductService = ProductService;
        this._$translate = $translate;
        this._$stateParams = $stateParams;
        this._CategoryService = CategoryService;
        this.SystemService = SystemService;
        this.$rootScope = $rootScope;
        this.Upload = Upload;
        this.UPLOAD_URL = AppConstants.UPLOAD_URL;
        this.$window = $window;
    }

    $onInit() {
        this.coverPhoto = 'assets/img/pattern/pattern1.png';
        this.image1 = 'assets/img/pattern/pattern1.png';
        this.image2 = 'assets/img/pattern/pattern1.png';
        this.image3 = 'assets/img/pattern/pattern1.png';
        this.product = {
            categories: [],
            images: ['', '', '']
        };
        this.isUploadPhoto = false;
        this.getStatus();
        this.getUnits();
        this.getCategories({});
    }

    createProduct(productForm) {
        if (!this.product.coverPhoto) {
            this.notify('supplier.product.message.coverPhoto', 'warning', 10000);
            return;
        }
        if (productForm.$invalid || !this.productCategoryId) {
            this.notify('supplier.product.message.productCompleteFields', 'warning', 10000);
            return;
        }
        this.isLoading = true;
        this.product.categories = [this.productCategoryId];
        this.isLoading = true;
        const _onSuccess = (res) => {
            this.product = {};
            this.res = res;
            this.notify('supplier.product.message.productAddSuccess', 'success', 10000);
            this.$window.history.back();
        };
        const _onError = (err) => {
            if (err.status === 400 && err.data.errorCode === 115) {
                this.hasError = true;
                this.notify('supplier.product.message.skuError', 'error', 10000);
            }

            if (err.code === 500) {
                this.hasError = true;
                this.notify('supplier.product.message.productCompleteFields', 'danger', 10000);
            } else if (err.code === 501) {
                this.noInternetConnection = true;
                this.notify('supplier.product.message.productCompleteFields', 'danger', 10000);
            }
        };
        const _onFinal = () => {
            this.isLoading = false;
            this.resetForm(productForm);
        };
        this._ProductService.createProduct(this.product)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    getCategories(searchCriteria) {
        this.isLoading = true;
        const _onSuccess = (res) => {
            this.categories = res.data.data.categories;
            if (this.$rootScope.categoryId && this.$rootScope.categoryId !== 'All') {
                this.productCategoryId = this.$rootScope.categoryId;
            } else {
                let keepGoing = true;
                angular.forEach(this.categories, (mainCategories) => {
                    if (keepGoing) {
                        if (mainCategories.childCategory.length > 0) {
                            this.productCategoryId = mainCategories.childCategory[0]._id;
                            keepGoing = false;
                        }
                    }
                });
            }
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
        this._CategoryService.getCategories(searchCriteria)
            .then(_onSuccess, _onError)
            .finally(_onFinal);
    }

    getUnits() {
        this.units = [];
        const _onSuccess = (res) => {
            this.units = res.data.data;
            this.product.unit = this.units[0]._id;
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
        this.product.status = this.status[0]._id;
    }

    notify(message, type, timeout) {
        this._$translate(message)
            .then((translation) => {
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
        this.coverPhoto = 'assets/img/pattern/pattern1.png';
        this.image1 = 'assets/img/pattern/pattern1.png';
        this.image2 = 'assets/img/pattern/pattern1.png';
        this.image3 = 'assets/img/pattern/pattern1.png';
        this.product = {
            categories: [this.productCategoryId],
            status: this.status[0]._id,
            images: ['', '', '']
        };
        form.$setPristine();
        form.$setUntouched();
        // form.$setValidity();
    }

    uploadFile(file, errFiles, imgFor) {
        const ctrl = this;
        switch (imgFor) {
            case 'coverPhoto' : {
                ctrl.product.coverPhoto = null;
                this.isUploadPhoto = true;
                break;
            }
            case 'image1' : {
                ctrl.product.images[0] = '';
                break;
            }
            case 'image2' : {
                ctrl.product.images[1] = '';
                break;
            }
            case 'image3' : {
                ctrl.product.images[2] = '';
                break;
            }
            default:
                ctrl.product.images = ['', '', ''];
        }

        this.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = ctrl.Upload.upload({
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
                        ctrl.product.images = ['', '', ''];
                }
            }, (response) => {
                if (response.status > 0) {
                    ctrl.errorMsg = `${response.status}: ${response.data}`;
                }
                this.isUploadPhoto = false;
            }, (evt) => {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        } else {
            this.coverPhoto = 'assets/img/pattern/pattern1.png';
            this.isUploadPhoto = false;
        }
    }

}
NewProductCtrl.$inject = ['ProductService',
    '$translate',
    '$stateParams',
    'CategoryService',
    'SystemService',
    'FileUploader',
    '$rootScope',
    'Upload',
    'AppConstants',
    '$window'];
