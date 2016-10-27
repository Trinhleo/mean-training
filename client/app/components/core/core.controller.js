(function () {
    angular.module('app.core')
        .controller('CoreController', CoreController);
    CoreController.$inject = ['$location']
    function CoreController($location) {
        var vm = this;
        vm.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }
})();

