
export default class SlidesCtrl {
    constructor($rootScope, SystemService) {
        this._SystemService = SystemService;
        this._$rootScope = $rootScope;
    }

    $onInit() {
        this._$rootScope.isSlides = true;
    }

    getSystemConfigList() {
        const _onSuccess = (res) => {
            this.systemConfigList = res.data.data;
        };
        const _onError = (err) => {
            this.hasError = true;
            if (err.data) {
                this.errors = err.data.data;
            }
        };
        const _onFinal = (err) => {
            this.configListIsLoaded = true;
        };
        this._SystemService.getSystemConfigList()
                .then(_onSuccess, _onError).finally(_onFinal);
    }
}

SlidesCtrl.$inject = ['$rootScope', 'SystemService'];

