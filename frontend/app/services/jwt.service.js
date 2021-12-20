export default class JwtService {
    constructor(AppConstants, $window) {
        this._AppConstants = AppConstants;
        this._$window = $window;
    }
    save(user) {
        if (user.token) { this._$window.localStorage[this._AppConstants.JwtKey] = user.token; }
        this._$window.localStorage.setItem('user', JSON.stringify(user));
    }
    get() {
        return this._$window.localStorage[this._AppConstants.JwtKey];
    }
    destroy() {
        this._$window.localStorage.removeItem(this._AppConstants.JwtKey);
        this._$window.localStorage.clear();
    }
    getCurrentUser() {
        return JSON.parse(this._$window.localStorage.getItem('user'));
    }
}
JwtService.$inject = ['AppConstants', '$window'];
