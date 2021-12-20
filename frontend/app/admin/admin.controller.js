export default class AdminCtrl {
    constructor(
        JwtService,
        $translatePartialLoader,
        $translate,
        $rootScope,
        $state,
        $window,
        UserService,
        PermPermissionStore
    ) {
        this._translatePartialLoader = $translatePartialLoader;
        this._translate = $translate;
        this.$rootScope = $rootScope;
        this._$state = $state;
        this.JwtService = JwtService;
        this.$window = $window;
        this.UserService = UserService;
        this.PermPermissionStore = PermPermissionStore;
    }

    $onInit() {
        this.permissions = this.PermPermissionStore.getStore() || {};

        this.user = this.JwtService.getCurrentUser();
        this.paintAvatar(`${this.user.firstName} ${this.user.lastName}`);
        this._translatePartialLoader.addPart('admin');
        this.$rootScope.setLang(this.user.language);
        this._translate.refresh();

        this.redirect();
        this.$rootScope.$on(
            '$stateChangeSuccess',
            (event, toState, toParams, fromState, fromParams) => {
                if (toState.name === 'app.admin.account') {
                    this._$state.go('app.admin.account.user');
                } else if (toState.name === 'app.admin.supplier') {
                    if (this.permissions.manageSuppliers) {
                        this._$state.go('app.admin.supplier.list');
                    } else if (this.permissions.managePayments) {
                        this._$state.go('app.admin.supplier.payment');
                    } else if (this.permissions.manageCustomers){
                        this._$state.go('app.admin.supplier.customer');
                    }
                } else if (toState.name === 'app.admin.report') {
                    if (this.permissions.manageOrdersReports) {
                        this._$state.go('app.admin.report.orders');
                    } else if (this.permissions.manageTransactionsReports) {
                        this._$state.go('app.admin.report.transactions');
                    }
                } else if (toState.name === 'app.admin.product') {
                    this._$state.go('app.admin.product.category');
                } else if (toState.name === 'app.admin.inventory') {
                    this._$state.go('app.admin.inventory');
                } else if (toState.name === 'app.admin.inventories') {
                    this._$state.go('app.admin.inventories.recipes');
                } else if (toState.name === 'app.admin.settings') {
                    this._$state.go('app.admin.settings.units');
                }
            }
        );
    }

    redirect() {
        if (this._$state.is('app.admin.account')) {
            this._$state.go('app.admin.account.user');
        } else if (this._$state.is('app.admin.supplier')) {
            if (this.permissions.manageSuppliers) {
                this._$state.go('app.admin.supplier.list');
            } else if (this.permissions.managePayments) {
                this._$state.go('app.admin.supplier.payment');
            } else if (this.permissions.manageCustomers) {
                this._$state.go('app.admin.supplier.customer');
            }
        } else if (this._$state.is('app.admin.report')) {
            if (this.permissions.manageOrdersReports) {
                this._$state.go('app.admin.report.orders');
            } else if (this.permissions.manageTransactionsReports) {
                this._$state.go('app.admin.report.transactions');
            }
        } else if (this._$state.is('app.admin.product')) {
            this._$state.go('app.admin.product.category');
        } else if (this._$state.is('app.admin.inventory')) {
            this._$state.go('app.admin.inventory');
        } else if (this._$state.is('app.admin.inventories')) {
            this._$state.go('app.admin.inventories.recipes');
        } else if (this._$state.is('app.admin.settings')) {
            this._$state.go('app.admin.settings.units');
        }
    }

    logout() {
        this.UserService.logout();
    }

    paintAvatar(name) {
        const colours = [
            '#c5ed9d',
            '#c0cbfd',
            '#ddebf5',
            '#e3f4c0',
            '#8af9ff',
            '#fae6a2',
            '#b9ffef',
        ];

        let nameSplit = name.split(' '),
            initials =
                nameSplit[0].charAt(0).toUpperCase() +
                nameSplit[1].charAt(0).toUpperCase();

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

AdminCtrl.$inject = [
    'JwtService',
    '$translatePartialLoader',
    '$translate',
    '$rootScope',
    '$state',
    '$window',
    'UserService',
    'PermPermissionStore',
];
