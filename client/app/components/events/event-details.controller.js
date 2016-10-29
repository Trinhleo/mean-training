(function () {
    angular.module('app.events')
        .controller('EventDetailsController', EventDetailsController);

    EventDetailsController.$inject = ['$state', '$stateParams', '$localStorage', '$rootScope', 'EventService'];

    function EventDetailsController($state, $stateParams, $localStorage, $rootScope, EventService) {
        var vm = this;
        // // vm.event = EventResolve;
        // console.log(vm.event);
        vm.room = {
            _id: '5814e3df64761b190480c542',
            name: 'abc',
            roomHost: '58121624c82e2e00d872f00d',
            __v: 0,
            creationDate: '2016 - 10 - 29T18: 01:03.913Z',
            listUserAttend: [],
            listBannedUser: []
        }
        vm.eventImages = [];
        vm.events = [];
        vm.event = {};
        vm.gotoEdit = gotoEdit
        vm.isMyEvent = false;
        EventService.getEvent($stateParams.eventId).then(
            function (res) {
                var evt = res;
                vm.isMyEvent = $localStorage.userInfo._id && $localStorage.userInfo._id === evt.userHost._id ? true : false;
                vm.event = evt;
                vm.events.push(evt);
            },
            function (err) {
                $state.go('index.events');
            }
        );

        EventService.getEventImages($stateParams.eventId).then(
            function (res) {
                var evt = res;
                vm.eventImages = evt;
            },
            function (err) {
                $state.go('index.events');
            }
        );

        function gotoEdit() {
            $state.go('index.edit', {
                eventId: vm.event._id
            });
        }
    };
})();
