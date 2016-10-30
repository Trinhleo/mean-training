(function () {
    angular.module('app.core')
        .controller('CoreController', CoreController);
    CoreController.$inject = ['$location', '$rootScope', '$localStorage']
    function CoreController($location, $rootScope, $localStorage) {
        var vm = this;
        vm.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
        var vm = this;
        $rootScope.user = $localStorage.user;
        $rootScope.userInfo = $localStorage.userInfo;
        var socket = io.connect('http://localhost:3000');
        socket.on('connect', function () {
            socket.emit('authenticate', { token: $localStorage.token });
        });
        // $('.page-wraper').css('height', window.innnerHeight - 50);
    }
})();

