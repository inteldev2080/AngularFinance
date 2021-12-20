websiteConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

export default function websiteConfig($stateProvider, $urlRouterProvider, $locationProvider) { // eslint-disable-line


    $stateProvider
        .state('app.website', {
            url: '/website',
            templateUrl: 'app/website/index.html',
            controller: 'SlidesCtrl as $ctrl',
            ncyBreadcrumb: {
                skip: true
            }
        })

        .state('app.pages', {
            url: '/pages',
            templateUrl: 'app/website/pages.html',
            controller: 'SupplierCtrl as $ctrl',
            abstract: true,
            ncyBreadcrumb: {
                skip: true
            }
        })

        .state('app.pages.terms', {
            url: '/terms',
            templateUrl: 'app/website/website.page.html',
            controller: 'PageCtrl as $ctrl'

        })

        .state('app.pages.privacy', {
            url: '/privacy',
            templateUrl: 'app/website/website.page.html',
            controller: 'PageCtrl as $ctrl'
        })

        .state('app.pages.feedback', {
            url: '/feedback',
            templateUrl: 'app/website/website.feedback.html',
            controller: 'FeedbackCtrl as $ctrl'
        });

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/login');
}
