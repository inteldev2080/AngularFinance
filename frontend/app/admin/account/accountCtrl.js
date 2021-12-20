export default class AccountCtrl {
    constructor($translatePartialLoader, $translate, $rootScope) {
        this._translatePartialLoader = $translatePartialLoader;
        this._translate = $translate;
        this._rootScope = $rootScope;
    }

    $onInit() {
        $.Pages.init(); // eslint-disable-line
        this._translatePartialLoader.addPart('account');
        // this._translate.use('ar');
        this._translate.refresh();
        this.rtl = false;
    }

    changeLang() {
        this._translatePartialLoader.addPart('account');

        if (this._translate.use() === 'en') {
            this._translate.use('ar');
            // this._translate.refresh();
            this._rootScope.rtl = true;
        }

        if (this._translate.use() === 'ar') {
            this._translate.use('en');
            // this._translate.refresh();
            this._rootScope.rtl = false;
        }
    }
}

AccountCtrl.$inject = ['$translatePartialLoader', '$translate', '$rootScope'];
