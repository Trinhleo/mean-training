(function () {
    angular.module('app.user')
        .controller('UserController', UserController);

    UserController.$inject = ['$rootScope', 'UserService', 'GalleryService', 'EventService', '$state', 'appConfigs', '$localStorage'];

    function UserController($rootScope, UserService, GalleryService, EventService, $state, appConfigs, $localStorage) {
        var vm = this;
        vm.userInfo = "";
        vm.userId = $state.params.userId;
        vm.isMe = vm.userId && (vm.userId === $localStorage.userInfo._id) || !vm.userId;
        vm.images = [];
        vm.events = [];
        if (!vm.isMe) {
            getUserInfo();
            getImages(vm.userId);
            getEvents(vm.userId);
        } else {
            getMyUserInfo();
            getImages($localStorage.userInfo._id);
            getMyEvents();
        };

        function getMyUserInfo() {
            UserService.getMyUserInfo().then(function (res) {
                vm.userInfo = res;
            }, function (err) {
                $rootScope.alert = err.data.message;
                $state.go('index.signin');
            });
        };

        function getUserInfo() {
            UserService.getUserInfo(vm.userId).then(function (res) {
                vm.userInfo = res;
            }, function (err) {
                $rootScope.alert = err.data.message;
                $state.go('index.signin');
            });
        };

        function getImages(userId) {
            GalleryService.getImagesByUserId(userId).then(function (res) {
                vm.images = res;
            }, function (err) {
                $rootScope.alert = err.data.message;
                $state.go('index.signin');
            });
        };

        function getEvents(userId) {
            UserService.loadEventsByUserId(userId)
                .then(function (res) {
                    vm.events = res;
                }, function (err) {
                    $rootScope.alert = err.data.message;
                    $state.go('index.signin');
                });
        };

        function getMyEvents() {
            EventService.loadMyEvents()
                .then(function (res) {
                    vm.events = res;
                }, function (err) {
                    $rootScope.alert = err.data.message;
                    $state.go('index.signin');
                });
        };

    };
})();