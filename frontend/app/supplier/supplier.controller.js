
export default class SupplierCtrl {
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
        $.Pages.init(); // eslint-disable-line
        this.permissions = this.PermPermissionStore.getStore() || {};
        this.user = this.JwtService.getCurrentUser();
        this.paintAvatar(`${this.user.firstName} ${this.user.lastName}`);
        this._translatePartialLoader.addPart('supplier');
        this.$rootScope.setLang(this.user.language);
        this._translate.refresh();
        this.redirect();
        this.$rootScope.$on('$stateChangeSuccess',
            (event, toState, toParams, fromState, fromParams) => {
                if (toState.name === 'app.supplier.account') {
                    if (this.permissions.managePayments) {
                        this._$state.go('app.supplier.account.payments');
                    } else if (this.permissions.manageStaff) {
                        this._$state.go('app.supplier.account.users');
                    }
                } else if (toState.name === 'app.supplier.report') {
                    if (this.permissions.manageOrdersReports) {
                        this._$state.go('app.supplier.report.orders');
                    } else if (this.permissions.manageTransactionsReports) {
                        this._$state.go('app.supplier.report.transactions');
                    }
                } else if (toState.name === 'app.supplier.customer') {
                    if (this.permissions.manageCustomers) {
                        this._$state.go('app.supplier.customer.list');
                    } else if (this.permissions.managePayments) {
                        this._$state.go('app.supplier.customer.payments');
                    }
                } else if (toState.name === 'app.supplier.products') {
                    this._$state.go('app.supplier.products.list', { categoryId: 'All' });
                } else if (toState.name === 'app.admin.settings') {
                    this._$state.go('app.admin.settings.units');
                } else if (toState.name === 'app.supplier.inventory') {
                    this._$state.go('app.supplier.inventory');
                } else if (toState.name === 'app.supplier.inventories') {
                    this._$state.go('app.supplier.inventories.recipes');
                }
            });
    }

    redirect() {
        if (this._$state.is('app.supplier.account')) {
            if (this.permissions.managePayments) {
                this._$state.go('app.supplier.account.payments');
            } else if (this.permissions.manageStaff) {
                this._$state.go('app.supplier.account.users');
            }
        } else if (this._$state.is('app.supplier.report')) {
            if (this.permissions.manageOrdersReports) {
                this._$state.go('app.supplier.report.orders');
            } else if (this.permissions.manageTransactionsReports) {
                this._$state.go('app.supplier.report.transactions');
            }
        } else if (this._$state.is('app.supplier.customer')) {
            if (this.permissions.manageCustomers) {
                this._$state.go('app.supplier.customer.list');
            } else if (this.permissions.managePayments) {
                this._$state.go('app.supplier.customer.payments');
            }
        } else if (this._$state.is('app.supplier.products')) {
            this._$state.go('app.supplier.products.list', { categoryId: 'All' });
        } else if (this._$state.is('app.supplier.inventory')) {
            this._$state.go('app.supplier.inventory');
        } else if (this._$state.is('app.supplier.inventories')) {
            this._$state.go('app.supplier.inventories.recipes');
        } else if (this._$state.is('app.admin.settings')) {
            this._$state.go('app.admin.settings.units');
        }
    }

    logout() {
        this.UserService.logout();
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

SupplierCtrl.$inject = ['JwtService', '$translatePartialLoader', '$translate', '$rootScope', '$state', '$window', 'UserService', 'PermPermissionStore'];
