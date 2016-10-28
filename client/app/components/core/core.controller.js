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
        // $('.page-wraper').css('height', window.innnerHeight - 50);
    }
})();

