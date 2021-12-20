
export default class PageCtrl {
    constructor($scope, SystemService) {
        this._SystemService = SystemService;
        this._$scope = $scope;
    }

    $onInit() {
        this.getCMSContent();
    }

    getCMSContent() {
        const _onSuccess = (res) => {
            this.content = res.data.data;
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
            }
        };
        const _onFinal = (err) => {
            this.contentIsLoaded = true;
        };
        this._SystemService.getCMSContent('5a9d65bb7ecdfb3600191888')
                .then(_onSuccess, _onError).finally(_onFinal);
    }
}

PageCtrl.$inject = ['$scope', 'SystemService'];

