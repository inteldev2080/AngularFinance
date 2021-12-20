// import authInterceptor from './config/auth.intercepters';

appConfig.$inject = [
    '$httpProvider',
    '$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
    '$breadcrumbProvider'
];

export default function appConfig(
        $httpProvider,
        $stateProvider,
        $locationProvider,
        $urlRouterProvider,
        $breadcrumbProvider
    ) {
    $stateProvider
        .state('app', {
            abstract: true,
            templateUrl: 'app/index.html',
            ncyBreadcrumb: {
                skip: true // Never display this state in breadcrumb.
            }
        })
        .state('app.page', {
            abstract: true,
            templateUrl: 'app/index.html',
            ncyBreadcrumb: {
                skip: true // Never display this state in breadcrumb.
            }
        })
        .state('app.privacy', {
            url: '/privacy',
            templateUrl: 'app/privacy.html'
        })
        .state('app.404', {
            templateUrl: 'app/custom_404.html',
            ncyBreadcrumb: {
                skip: true // Never display this state in breadcrumb.
            }
        })
        .state('website', {
            templateUrl: 'website/index.html',
            resolve: {
                check($location) {
                    window.location.href = '/website/index.html';
                }
            }
        });
    $breadcrumbProvider.setOptions({
        templateUrl: 'app/breadcrumb.html',
        includeAbstract: true
    });
    $urlRouterProvider.otherwise(($injector) => {
        const $state = $injector.get('$state');
        $state.go('website');
    });
    $locationProvider.html5Mode(true).hashPrefix('!');
}

