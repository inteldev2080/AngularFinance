
export default class SupplierCtrl {
    constructor(JwtService, $translatePartialLoader, $translate, $rootScope, $state) {
        this._translatePartialLoader = $translatePartialLoader;
        this._translate = $translate;
        this.$rootScope = $rootScope;
        this._$state = $state;
        this.JwtService = JwtService;
    }
    $onInit() {
        this.user = this.JwtService.getCurrentUser();
        this.paintAvatar(`${this.user.firstName} ${this.user.lastName}`);
        this._translatePartialLoader.addPart('website');
        if (this._translate.use() !== this.user.language) {
            this.$rootScope.changeLang();
        }
        this._translate.refresh();
        this.redirect();
        this.$rootScope.$on('$stateChangeSuccess',
            (event, toState, toParams, fromState, fromParams) => {
                if (toState.name === 'app.supplier.account') {
                    this._$state.go('app.supplier.account.payments');
                } else if (toState.name === 'app.supplier.report') {
                    this._$state.go('app.supplier.report.orders');
                } else if (toState.name === 'app.supplier.customer') {
                    this._$state.go('app.supplier.customer.list');
                } else if (toState.name === 'app.supplier.products') {
                    this._$state.go('app.supplier.products.list', { categoryId: 'All' });
                } else if (toState.name === 'app.admin.settings') {
                    this._$state.go('app.admin.settings.units');
                }
            });
    }

    redirect() {
        if (this._$state.is('app.supplier.account')) {
            this._$state.go('app.supplier.account.payments');
        } else if (this._$state.is('app.supplier.report')) {
            this._$state.go('app.supplier.report.orders');
        } else if (this._$state.is('app.supplier.customer')) {
            this._$state.go('app.supplier.customer.list');
        } else if (this._$state.is('app.supplier.products')) {
            this._$state.go('app.supplier.products.list', { categoryId: 'All' });
        } else if (this._$state.is('app.admin.settings')) {
            this._$state.go('app.admin.settings.units');
        }
    }

    logout() {
        this.$rootScope.message = { type: 'success', text: this._translate.instant('auth.logged_out') };
        this.JwtService.destroy();
        this._$state.go('app.auth.login');
    }

    paintAvatar(name) {
        const colours = ['#c5ed9d', '#c0cbfd', '#ddebf5', '#e3f4c0', '#8af9ff', '#fae6a2', '#b9ffef'];

        let nameSplit = name.split(' '),
            initials = nameSplit[0].charAt(0).toUpperCase() + nameSplit[1].charAt(0).toUpperCase();

        let charIndex = initials.charCodeAt(0) - 65,
            colourIndex = charIndex % 19;

        const canvas = document.getElementById('user-icon');
        const context = canvas.getContext('2d');

        let canvasWidth = $(canvas).attr('width'),
            canvasHeight = $(canvas).attr('height'),
            canvasCssWidth = canvasWidth,
            canvasCssHeight = canvasHeight;

        if (window.devicePixelRatio) {
            $(canvas).attr('width', canvasWidth * window.devicePixelRatio);
            $(canvas).attr('height', canvasHeight * window.devicePixelRatio);
            $(canvas).css('width', canvasCssWidth);
            $(canvas).css('height', canvasCssHeight);
            context.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        context.fillStyle = colours[colourIndex];
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = '16px Arial';
        context.textAlign = 'center';
        context.fillStyle = '#FFF';
        context.fillText(initials, canvasCssWidth / 2, canvasCssHeight / 1.5);
    }
}

SupplierCtrl.$inject = ['JwtService', '$translatePartialLoader', '$translate', '$rootScope', '$state'];
