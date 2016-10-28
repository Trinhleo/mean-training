(function () {
    angular
        .module('app', [
            'ui.router',
            'ui.bootstrap',
            'ngAnimate',
            'ngStorage',
            'ngFileUpload',
            'angularFileUpload',
            'ui.bootstrap.datetimepicker',
            'geolocation',
            'app.config',
            'app.routes',
            'app.core',
            'app.services',
            'app.signup',
            'app.signin',
            'app.signout',
            'app.user',
            'app.user.setting',
            'app.events'
        ])
        .run(function ($rootScope, $state, $localStorage) {

            // Check authentication before changing state
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (toState.name != "signin" && toState.name != "signup" && toState.name != "index") {
                    if (!$localStorage.token && !$localStorage.user) {
                        event.preventDefault();
                        $state.go('signin')
                    }
                }
            });

        });
})();