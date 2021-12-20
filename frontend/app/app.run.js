/* eslint-disable no-param-reassign */

RunConfig.$inject = ['$rootScope', '$translate', 'UserService', 'PermRoleStore', 'PermPermissionStore', 'amMoment'];
export default function RunConfig(
    $rootScope,
    $translate,
    UserService,
    PermRoleStore,
    PermPermissionStore,
    amMoment
) {
    $rootScope.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAVyrPpRVpBYwmDTYzZk0v0hp7B3KuhKpc';
    $rootScope.app = {
        name: '',
        description: '',
        layout: {
            menuPin: true,
            menuBehind: false,
            theme: 'pages/css/pages.css'
        },
        author: 'indielabs'
    };
    $rootScope.suppliesOn = {
        regex: {
            name: '/^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z-_\\.]*$/',
            email: '/^(([^<>()\\[\\]\\.,;:\\s@\\"]+(\\.[^<>()\\[\\]\\.,;:\\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\\]\\.,;:\\s@\\"]+\\.)+[^<>()[\\]\\.,;:\\s@\\"]{2,})$/i',
            password: '/[a-zA-Z\u0600-\u06FF@#_-]+[0-9]+[a-zA-Z\u0600-\u06FF0-9@#_-]*|[0-9]+[a-zA-Z\u0600-\u06FF@#_-][a-zA-Z\u0600-\u06FF0-9@#_-]*/',
            mobile: '/^9665[0-9]{8}$$/',
            cr_number: '/^\\d{10}$$/',
            number: /^\d+$/
        }
    };
    amMoment.changeLocale($translate.use());
    $rootScope.siteLanguage = {
        english: {
            language: 'en',
            dir: 'ltr'
        },
        arabic: {
            language: 'ar',
            dir: 'rtl'
        }
    };
    if (!$rootScope.currentLanguage) {
        $rootScope.currentLanguage = $rootScope.siteLanguage.english;
    }
    $rootScope.showChangeLangBtn = true;
    $rootScope.changeLang = () => {
        UserService.changeUserLanguage().then(() => {
            amMoment.changeLocale($translate.use());
            // location.reload();
        });
    };
    $rootScope.setLang = (lang) => {
        if (lang === $rootScope.siteLanguage.arabic.language) {
            $rootScope.currentLanguage = $rootScope.siteLanguage.arabic;
        } else {
            $rootScope.currentLanguage = $rootScope.siteLanguage.english;
        }

        $translate.use($rootScope.currentLanguage.language);
        $rootScope.rtl = ($rootScope.currentLanguage.dir === 'rtl');
    };
    $rootScope.suppliesOnNotify = () => {

    };
    $rootScope.$on('$stateChangePermissionAccepted', () => {
        $rootScope.message = '';
    });
    PermRoleStore.defineRole('Guest', [], () => {
        if (UserService.getUserRoles() === 'Guest') return true;
        return false;
    });
    PermRoleStore.defineRole('Admin', [], () => {
        if (UserService.getUserRoles() === 'Admin') return true;
        return false;
    });
    PermRoleStore.defineRole('Supplier', [], () => {
        if (UserService.getUserRoles() === 'Supplier') return true;
        return false;
    });
    PermRoleStore.defineRole('Customer', [], () => {
        if (UserService.getUserRoles() === 'Supplier') return true;
        return false;
    });
    PermPermissionStore.definePermission('hasValidSession', () => UserService.checkSession());
    PermPermissionStore.definePermission('admin', () => {
        if (UserService.getUserRoles() === 'Admin') return true;
        return false;
    });
    PermPermissionStore.definePermission('customer', () => {
        if (UserService.getUserRoles() === 'Customer') return true;
        return false;
    });
    PermPermissionStore.definePermission('supplier', () => {
        if (UserService.getUserRoles() === 'Supplier') return true;
        return false;
    });
    const permissions = UserService.getUserPermissions();
    PermPermissionStore.defineManyPermissions(permissions,
            permissionName => permissions.includes(permissionName));
    $rootScope.$on('$stateChangeSuccess', (evt, toState) => {
        console.log(evt);
    });
    $rootScope.$on('$stateChangeStart', (e, toState, toParams, fromState, fromParams) => {
        console.log('state name', toState.name);
        if (toState.name === 'app.auth.login' && UserService.getCurrentUser() && !$rootScope.logout) {
            e.preventDefault();
            UserService.redirect();
        } else if (toState.name === 'app.customer.product.list.category'){
            $rootScope.returnToState = toState.url;
     		$rootScope.returnToStateParams = toParams.supplierId;
        }

        // if (fromState.name === 'app.auth.logout') {

        // }
    });
}
