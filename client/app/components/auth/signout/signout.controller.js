(function () {
    angular.module('app.auth.signout')
        .controller('SignoutController', SignoutController);

    SignoutController.$inject = ['$rootScope', '$state', '$localStorage', 'AuthService'];

    function SignoutController($rootScope, $state, $localStorage, AuthService) {

        AuthService.signout().then(function (res) {
            delete $localStorage.user;
            delete $localStorage.token;
            delete $localStorage.userInfo;
            $state.go('index.dashboard');
        }, function (err) {
            $rootScope.alert = err.data.message;
        });
    }
})();

