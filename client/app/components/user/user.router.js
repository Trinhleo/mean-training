(function () {
    angular.module('app.user')
        .config(UserRouter);
    function UserRouter($stateProvider) {
        $stateProvider
            .state('index.user', {
                url: "/me",
                templateUrl: 'app/components/user/user.html',
                controller: 'UserController',
                controllerAs: 'vm'
            });
    };
})();