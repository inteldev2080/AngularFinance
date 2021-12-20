export default class UserService {
    constructor(
        AppConstants,
        JwtService,
        $state,
        $q,
        $window,
        RetryRequest,
        PermPermissionStore,
        $rootScope,
        $translate,
        $timeout,
        $sessionStorage,
        $stateParams
    ) {
        this._AppConstants = AppConstants;
        this._JwtService = JwtService;
        this._$state = $state;
        this._$q = $q;
        this.$window = $window;
        this.retryRequest = RetryRequest;
        this.currentUser = null;
        this.role = { ADMIN: false, SUPPLIER: false, CUSTOMER: false };
        this.permissions = [];
        this.PermPermissionStore = PermPermissionStore;
        this.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
        this.$rootScope = $rootScope;
        this.$translate = $translate;
        this.$timeout = $timeout;
        this.$sessionStorage = $sessionStorage;
        this.$stateParams = $stateParams;
    }

    login(credentials) {
        this.$rootScope.logout = false;
        const request = {
            url: `${this._AppConstants.api}/auth/login`,
            method: 'POST',
            data: credentials
        };
        const defer = this._$q.defer();
        this.retryRequest(request)
            .then(
                // on Success
                (res) => {
                    // Store the user's info for easy lookup
                    this.currentUser = res.data;
                    // set JWT
                    this._JwtService.save(res.data);
                    this.$sessionStorage.put('token', res.data.token, 10);
                    defer.resolve(res);
                },
                // on Error
                (err) => {
                    defer.reject(err);
                }
            );
        return defer.promise;
    }

    logout() {
        this.$rootScope.message = { type: 'success', text: this.$translate.instant('auth.logged_out') };
       /* this._$state.go('app.auth.login', null).then(() => {
            // Get in a spaceship and fly to Jupiter, or whatever your callback does.
        });*/
        this.$rootScope.logout = true;
        this._$state.go('app.auth.login', {}, { reload: true });
        this.$timeout(() => {
            window.location.reload(true);
            this._JwtService.destroy();
            this.$window.localStorage.clear();
            this.PermPermissionStore.clearStore();
            this.currentUser = null;
        }, 200);

    }
    changePassword(oldPassword, newPassword) {
        const request = {};
        request.url = `${this._AppConstants.api}/auth/changePassword`;
        request.method = 'PUT';
        request.data = { oldPassword, newPassword };
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
        return this.retryRequest(request);
    }

    resetPassword(userId, newPassword) {
        const request = {};
        request.url = `${this._AppConstants.api}/auth/resetPassword`;
        request.method = 'PUT';
        request.data = { userId, newPassword };
        request.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._JwtService.get()}`
        };
        return this.retryRequest(request);
    }

    updateUser(firstName, lastName) {
        const user = JSON.parse(this.$window.localStorage.getItem('user'));
        user.firstName = firstName;
        user.lastName = lastName;
        this.$window.localStorage.setItem('user', JSON.stringify(user));
        this.paintAvatar(`${firstName} ${lastName}`);
    }

    paintAvatar(name) {
        const colours = ['#c5ed9d', '#c0cbfd', '#ddebf5', '#e3f4c0', '#8af9ff', '#fae6a2', '#b9ffef'];

        const nameSplit = name.split(' ');
        const initials = nameSplit[0].charAt(0)
                .toUpperCase() + nameSplit[1].charAt(0)
                .toUpperCase();

        const charIndex = initials.charCodeAt(0) - 65;
        const colourIndex = charIndex % 19;

        const canvas = document.getElementById('user-icon');
        const context = canvas.getContext('2d');

        const canvasWidth = $(canvas).attr('width');
        const canvasHeight = $(canvas).attr('height');
        const canvasCssWidth = canvasWidth;
        const canvasCssHeight = canvasHeight;

        if (window.devicePixelRatio) {
            $(canvas)
                .attr('width', canvasWidth * window.devicePixelRatio);
            $(canvas)
                .attr('height', canvasHeight * window.devicePixelRatio);
            $(canvas)
                .css('width', canvasCssWidth);
            $(canvas)
                .css('height', canvasCssHeight);
            context.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        context.fillStyle = colours[colourIndex];
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = '16px Arial';
        context.textAlign = 'center';
        context.fillStyle = '#FFF';
        context.fillText(initials, canvasCssWidth / 2, canvasCssHeight / 1.5);
    }

    getCurrentUser() {
        return JSON.parse(this.$window.localStorage.getItem('user'));
    }

    setCurrentUser(user) {
        this.currentUser = user;
    }

    getUserRoles() {
        return this.getCurrentUser().type || 'Guest';
    }

    getUserPermissions() {
        let permissions = [];
        if (this.getCurrentUser()) {
            permissions = this.getCurrentUser().permissions;
        }

        return permissions;
    }

    checkSession() {
        const defer = this._$q.defer();
        if (this._JwtService.get()) {
            const request = {
                url: `${this._AppConstants.api}/auth/checkToken`,
                method: 'GET',
                headers: this.headers
            };
            this.retryRequest(request)
                .then(
                    // on Success
                    (res) => {
                        if (!res.data.data.expired) { defer.resolve(true); } else {
                            defer.reject(false);
                        }
                    },
                    // on Error
                    (err) => {
                        defer.reject(false);
                    }
                );
        } else {
            defer.reject(false);
        }
        return defer.promise;
    }
    changeUserLanguage() {
        this.$rootScope.showChangeLangBtn = false;
        const request = {
            url: `${this._AppConstants.api}/auth/changeLanguage`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._JwtService.get()}`
            }
        };
        return this.retryRequest(request).then((res) => {
            if (this.$rootScope.currentLanguage === this.$rootScope.siteLanguage.english) {
                this.$rootScope.currentLanguage = this.$rootScope.siteLanguage.arabic;
            } else {
                this.$rootScope.currentLanguage = this.$rootScope.siteLanguage.english;
            }
            const user = JSON.parse(this.$window.localStorage.getItem('user'));
            user.language = res.data.data.language;
            this.$window.localStorage.setItem('user', JSON.stringify(user));

            this.$translate.use(this.$rootScope.currentLanguage.language);
            this.$rootScope.rtl = (this.$rootScope.currentLanguage.dir === 'rtl');
            this._$state.transitionTo(this._$state.current, this.$stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        }, () => { console.log('faild to cahnge language'); }).finally(() => { this.$rootScope.showChangeLangBtn = true; });
    }
    redirect() {
        if (this.getCurrentUser()) {
            const user = this.getCurrentUser();
            if (user.type === 'Admin') {
                const adminPermissions = this.PermPermissionStore.getStore() || {};
                if (adminPermissions.manageOrdersReports) {
                    this._$state.transitionTo('app.admin.report.orders', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else if (adminPermissions.manageTransactionsReports) {
                    this._$state.transitionTo('app.admin.report.transactions', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else {
                    this._$state.transitionTo('app.admin.profile', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                }
            } else if (user.type === 'Supplier') {
                const supplierPermission = this.PermPermissionStore.getStore() || {};

                if (supplierPermission.manageOrderOverview) {
                    this._$state.transitionTo('app.supplier.order.list.overview', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else if (supplierPermission.manageNewOrders) {
                    this._$state.transitionTo('app.supplier.order.list.new', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else if (supplierPermission.manageOrderPreparation) {
                    this._$state.transitionTo('app.supplier.order.list.preparation', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else if (supplierPermission.manageOrderDelivery) {
                    this._$state.transitionTo('app.supplier.order.list.delivery', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else if (supplierPermission.manageOrderFailed) {
                    this._$state.transitionTo('app.supplier.order.list.failed', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else if (supplierPermission.manageOrderReviews) {
                    this._$state.transitionTo('app.supplier.order.list.review', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                } else {
                    this._$state.transitionTo('app.supplier.profile', this.$stateParams, {
                        reload: true,
                        notify: true
                    });
                }
            } else if (user.type === 'Customer') {
                this._$state.transitionTo('app.customer.account.profile', {}, {
                    reload: true,
                    notify: true
                });
            }
        }
    }
    checkSessionOn() {
        const defer = this._$q.defer();
        if (this._JwtService.get()) {
            this.headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this._JwtService.get()}`
            };
            const request = {
                url: `${this._AppConstants.api}/auth/checkToken`,
                method: 'GET',
                headers: this.headers
            };
            this.retryRequest(request)
                .then(
                    // on Success
                    (res) => {
                        if (!res.data.data.expired) { defer.resolve(true); } else {
                            defer.reject(false);
                        }
                    },
                    // on Error
                    (err) => {
                        if (this._JwtService.get()) {
                            this.$rootScope.message = {
                                type: 'success',
                                text: this.$translate.instant('auth.logged_out')
                            };
                            this.$rootScope.logout = true;
                            this._$state.go('app.auth.login', {}, {reload: true});
                            this.$timeout(() => {
                                window.location.reload(true);
                                this._JwtService.destroy();
                                this.$window.localStorage.clear();
                                this.PermPermissionStore.clearStore();
                                this.currentUser = null;
                            }, 200);
                        }
                        defer.reject(false);
                    }
                );
        } else {
            defer.reject(false);
        }
        return defer.promise;
    }

}
UserService.$inject = ['AppConstants', 'JwtService', '$state', '$q', '$window', 'RetryRequest', 'PermPermissionStore', '$rootScope', '$translate', '$timeout', '$sessionStorage', '$stateParams'];

