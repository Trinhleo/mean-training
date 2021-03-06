(function () {
    angular.module('app.signup')
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
