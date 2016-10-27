(function () {
    angular.module('app.auth.signup')
        .config(Signup);

    function Signup($stateProvider) {
        $stateProvider
            .state('signup', {
                url: '/signup',
                templateUrl: 'app/components/auth/signup/signup.html',
                controller: 'SignupController',
                controllerAs: 'vm'
            });
    }
})();
