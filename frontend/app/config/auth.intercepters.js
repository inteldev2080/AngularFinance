authInterceptor.$inject = ['AppConstants', 'JwtService', '$window', '$q'];
export default function authInterceptor(AppConstants, JwtService, $window, $q) {
    return {
        // automatically attach Authorization header
        request(config) {
            if (config.url.indexOf(AppConstants.api) === 0 && JwtService.get()) {
        config.headers.Authorization = `Bearer ${JwtService.get()}`; // eslint-disable-line
            }
            return config;
        },

        // Handle 401
        responseError(rejection) {
            if (rejection.status === 401) {
                // clear any JWT token being stored
                JwtService.destroy();
                // do a hard page refresh
                $window.location.reload();
            }
            return $q.reject(rejection);
        }

    };
}
