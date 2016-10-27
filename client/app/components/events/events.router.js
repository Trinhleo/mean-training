(function () {
    angular.module('app.events')
        .config(EventsRoute);
    function EventsRoute($stateProvider) {
        $stateProvider
            .state('index.events', {
                abstract: true,
                url: "/events",
                templateUrl: 'app/components/events/events.html',
                controller: 'EventsController',
                controllerAs: 'vm',
                redirectTo: 'index.events.query'
            })
            .state('index.events.query', {
                url: "",
                templateUrl: 'app/components/events/query-events.html',
                controller: 'QueryEventsController',
                controllerAs: 'vm'
            })
            .state('index.events.add', {
                url: "/add",
                templateUrl: 'app/components/events/manage/add-event.html',
                controller: 'AddEventController',
                controllerAs: 'vm'
            })
            .state('index.events.details', {
                url: "/:eventId",
                templateUrl: 'app/components/events/event-details.html',
                controller: 'EventDetailsController',
                controllerAs: 'vm'
            })
            .state('index.myevents', {
                url: "/myevents",
                templateUrl: 'app/components/events/manage/my-events.html',
                controller: 'MyEventsController',
                controllerAs: 'vm'
            });

        // getEvent.$inject = ['$state', '$stateParams', 'EventService'];

        // function getEvent($state, $stateParams, EventService) {
        //     EventService.getEvent($stateParams.eventId).then(
        //         function (res) {
        //             return res;
        //         },
        //         function (err) {
        //             return $state.go('index.dashboard');
        //         }
        //     );
        // }
    }
})();