(function () {
    angular.module('app.user')
        .controller('UserController', UserController);

    UserController.$inject = ['$rootScope', 'UserService', '$state', 'appConfigs'];

    function UserController($rootScope, UserService, $state, appConfigs) {
        var vm = this;
        vm.userInfo = "";
        getUserInfo();
        function getUserInfo() {
            UserService.getUserInfo().then(function (res) {
                vm.userInfo = res;
            }, function (err) {
                $rootScope.alert = err.data.message;
                $state.go('index.dashboard');
            });
        }
    };
})();