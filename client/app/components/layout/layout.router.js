(function () {
    angular.module('app.layout')
        .config(Layout);

    Layout.$inject = ['$stateProvider'];
    function Layout($stateProvider) {
        $stateProvider
            .state('index', {
                templateUrl: 'app/components/layout/layout.html',
                abstract: true,
                controller: 'LayoutController',
                controllerAs: 'vm'
            });
    }
})();
