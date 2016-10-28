(function () {
    angular.module('app.events')
        .controller('EventsController', EventsController);

    EventsController.$inject = ['$scope', '$state', '$localStorage', '$rootScope', 'EventService', 'geolocation', '$timeout'];

    function EventsController($scope, $state, $localStorage, $rootScope, EventService, geolocation, $timeout) {
        var vm = this;
        // var queryBody = {};
        vm.events = [];
        vm.myEvents = false;
        vm.myId = $localStorage.userInfo._id;
        vm.getEventsLocation = getEventsLocation;
        vm.formData = {};
        getEventsLocation();

        function getEventsLocation(myEvents) {
            vm.myEvents = myEvents
            if (myEvents) {
                EventService.loadMyEvents().then(
                    function (res) {
                        vm.events = res;
                        console.log(res);
                    },
                    function (err) {
                        console.log(err)
                        vm.alert = err;
                    });
            } else {
                EventService.loadEvents().then(
                    function (res) {
                        vm.events = res;
                    },
                    function (err) {
                        console.log(err)
                        vm.alert = err;
                    });
            };
        };
    };
})();
