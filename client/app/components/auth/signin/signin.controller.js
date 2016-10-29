(function () {
    angular.module('app.signin')
        .controller('SigninController', SigninController);

    SigninController.$inject = ['AuthService', '$localStorage', '$state', '$rootScope'];

    function SigninController(AuthService, $localStorage, $state, $rootScope) {
        vm = this;
        vm.signin = signin;
        vm.user = {
            username: "",
            password: ""
        };
        vm.alert = $rootScope.alert || "";

        function signin() {
            AuthService.signin(vm.user).then(function (res) {
                console.log(res);
                $localStorage.token = res.access_token;
                $localStorage.user = res.name;
                $localStorage.userInfo = res.userInfo;
                $state.go('index.events');
            }, function (err) {
                console.log(err)
                vm.alert = err.data.message || err.message;
            });
        };
    };
})();