import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-partial';
import 'messageformat';
import 'angular-translate-interpolation-messageformat';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';
import 'angular-cookies';
import 'angular-translate-handler-log';


const config = ($translateProvider,
                $translatePartialLoaderProvider, indielabsTransErrorHandler) => {
    $translateProvider.useMessageFormatInterpolation();
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '/app/{part}/{part}.translate.{lang}.json',
        loadFailureHandler: 'indielabsTransErrorHandler'
    });
    // $translateProvider.usePostCompiling(true);
    $translateProvider.useLoaderCache(true);
    $translateProvider.useLocalStorage();
    $translateProvider.preferredLanguage('en');
   // $translateProvider.useMissingTranslationHandlerLog();
    $translateProvider.fallbackLanguage('en');
    // $translateProvider.useSanitizeValueStrategy('escapeParameters');
};
config.$inject = ['$translateProvider', '$translatePartialLoaderProvider'];

const translateModule = angular.module('app.translateModule', ['pascalprecht.translate', 'ngCookies'])
    .config(config);
translateModule.controller('TranslateController', ['$translate', '$scope', ($translate, $scope) => {
    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };
}]);
translateModule.run(['$rootScope', '$translate', function ($rootScope, $translate) {
    $rootScope.$on('$translatePartialLoaderStructureChanged', () => {
        $translate.refresh();
    });
}]);
translateModule
    .factory('indielabsTransErrorHandler', ['$q', '$log', function ($q, $log) {
        return function (part, lang, response) {
          //  $log.error(`The "${part}/${lang}" part was not loaded.`);
            return $q.when({});
        };
    }]);
export default translateModule;

