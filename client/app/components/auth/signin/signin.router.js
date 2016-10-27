(function () {
    angular.module('app.auth.signin')
        .config(Signin);

    function Signin($stateProvider) {
        $stateProvider
            .state('signin', {
                url: '/signin',
                templateUrl: 'app/components/auth/signin/signin.html',
                controller: 'SigninController',
                controllerAs: 'vm'
            })
    }
})();