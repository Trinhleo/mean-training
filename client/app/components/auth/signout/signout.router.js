(function(){
    angular.module('app.auth.signout')
    .config(Signout);

    function Signout($stateProvider){

     $stateProvider
            .state('signout', {
                url: '/signout',
                redirectTo: 'index.dashboard',
                controller: 'SignoutController',
                controllerAs: 'vm'
            });
    };
})();