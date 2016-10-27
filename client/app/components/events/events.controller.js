(function () {
    angular.module('app.events')
        .controller('EventsController', EventsController);

    EventsController.$inject = ['$state', '$localStorage', '$rootScope', '$location', '$timeout', '$filter'];

    function EventsController($state, $localStorage, $rootScope, $location, $timeout, $filter) {
        var vm = this;
        var markers = [];
        var marker;
        vm.isActive = isActive;
        // getMap();
        // $rootScope.dropEventsMakers = drop;

        function isActive(viewLocation) {
            return viewLocation === $location.path();
        };
        // function getMap() {
        //     MapService.init().then(function () {
        //     });
        // };


        // function initMap() {
        //     var selectedLat = 10.8121052;
        //     var selectedLong = 106.7120805;
        //     map = new google.maps.Map(document.getElementById('map'), {
        //         zoom: 13,
        //         center: { lat: selectedLat, lng: selectedLong }
        //     });
        //     var lastMarker;
        //     google.maps.event.addListener(map, 'click', function (e) {
        //         var marker = new google.maps.Marker({
        //             position: e.latLng,
        //             draggable: true,
        //             animation: google.maps.Animation.BOUNCE,
        //             map: map
        //         });

        //         // When a new spot is selected, delete the old red bouncing marker
        //         if (lastMarker) {
        //             lastMarker.setMap(null);
        //         }

        //         // Create a new red bouncing marker and move to it
        //         lastMarker = marker;

        //         // Update Broadcasted Variable (lets the panels know to change their lat, long values)
        //         $rootScope.clickLat = marker.getPosition().lat();
        //         $rootScope.clickLong = marker.getPosition().lng();
        //         $rootScope.$broadcast("clicked");
        //         window.setTimeout(function () {
        //             map.panTo(marker.getPosition());
        //         }, 500);
        //         marker.addListener('drag', function () {
        //             $rootScope.clickLat = marker.getPosition().lat();
        //             $rootScope.clickLong = marker.getPosition().lng();
        //             $rootScope.$broadcast("drag");
        //         })
        //     });
        // };
        

    };
})();
