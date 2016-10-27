(function () {
    angular.module('app.events')
        .controller('EventDetailsController', EventDetailsController);

    EventDetailsController.$inject = ['$state', '$stateParams', '$localStorage', '$rootScope', 'EventService'];

    function EventDetailsController($state, $stateParams, $localStorage, $rootScope, EventService) {
        var vm = this;
        // // vm.event = EventResolve;
        // console.log(vm.event);
        vm.formData = {};
        vm.events = [];
        EventService.getEvent($stateParams.eventId).then(
            function (res) {
                var evt = res;
                vm.events.push(evt);
                vm.formData = evt;
                vm.formData.latitude = evt.location[1];
                vm.formData.longitude = evt.location[0];
                delete vm.formData.location;
            },
            function (err) {
                $state.go('index.dashboard');
            }
        );
    };
})();