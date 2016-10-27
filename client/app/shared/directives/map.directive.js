(function () {
    angular.module('app')
        .directive('myMap', Map);
    Map.$inject = ['$rootScope', '$filter', '$timeout']
    function Map($rootScope, $filter, $timeout) {
        return {
            restrict: 'EA',
            template: '<div></div>',
            scope: {
                events: '=events',
                editable: '=editable'
            },
            replace: true,
            link: link
        };
        // directive link function
        function link(scope, element, attrs) {
            var isMapLoad = false;
            window.initialize = function () {
                isMapLoad = true

            }
            initMap();
            // if (map === void 0 || google === void 0 || !isMapLoad) {
            //     addMapScript();
            // };

            // function addMapScript() {
            //     var script = document.createElement('script');
            //     script.type = 'text/javascript';
            //     script.src = "https://maps.googleapis.com/maps/api/js?callback=initialize"
            //     document.body.appendChild(script);
            // };


            var map, infoWindow;
            var markers = [];

            $timeout(function () {
                scope.$watch('events', function (events) {
                    console.log(events);
                    setMarker(events);
                });
            }, 1000);


            scope.$watch('clickLat', function (events) {
                console.log(events);
            });

            scope.$watch('clickLong', function (events) {
                console.log(events);
            });


            // init the map
            function initMap() {
                // map config
                if (map === void 0) {
                    var selectedLat = 10.8121052;
                    var selectedLong = 106.7120805;
                    var mapCanvas = document.getElementById('map_canvas');
                    var mapOptions = {
                        center: new google.maps.LatLng(selectedLat, selectedLong),
                        zoom: 13,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var lastMarker;
                    map = new google.maps.Map(mapCanvas, mapOptions);

                    google.maps.event.addListener(map, 'click', function (e) {
                        var marker = new google.maps.Marker({
                            position: e.latLng,
                            draggable: true,
                            animation: google.maps.Animation.BOUNCE,
                            map: map
                        });

                        // When a new spot is selected, delete the old red bouncing marker
                        if (lastMarker) {
                            lastMarker.setMap(null);
                        }

                        // Create a new red bouncing marker and move to it
                        lastMarker = marker;

                        // Update Broadcasted Variable (lets the panels know to change their lat, long values)
                        $rootScope.clickLat = marker.getPosition().lat();
                        $rootScope.clickLong = marker.getPosition().lng();
                        $rootScope.$broadcast("clicked");
                        window.setTimeout(function () {
                            map.panTo(marker.getPosition());
                        }, 500);
                        marker.addListener('drag', function () {
                            $rootScope.clickLat = marker.getPosition().lat();
                            $rootScope.clickLong = marker.getPosition().lng();
                            $rootScope.$broadcast("drag");
                        })
                    });
                };
            };

            function toggleBounce() {
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            };


            function setMarker(events) {
                clearMarkers();

                for (var i in events) {

                    addMarkerWithTimeout(events[i], i * 100, map);
                };
            };

            function addMarkerWithTimeout(event, timeout, map, draggable) {
                window.setTimeout(function () {
                    var position;
                    try {
                        position = new google.maps.LatLng(event.location[1], event.location[0]);
                    } catch (e) {
                        position = new google.maps.LatLng(event.latitude, event.longitude);
                    };
                    var icon = {
                        url: event.imgUrl, // url
                        scaledSize: new google.maps.Size(200, 100), // scaled size
                        origin: new google.maps.Point(0, 0), // origin
                        anchor: new google.maps.Point(0, 32),
                    };
                    var draggable = scope.editable ? true : false;
                    var marker = new google.maps.Marker({
                        position: position,
                        draggable: draggable,
                        map: map,
                        title: event.name,
                        animation: google.maps.Animation.DROP,
                        icon: icon
                    });
                    var name = event.name;
                    // var startTime = $filter('date')(event.startTime, 'medium', '+07');
                    // var endTime = $filter('date')(event.endTime, 'medium', '+07');
                    var startTime = $filter('date')(event.startTime, 'medium', '+070');
                    var endTime = $filter('date')(event.endTime, 'medium', '+070')
                    var description = event.description;
                    var eventHostId = event.userHost;
                    var link = '#/events/'.concat(event._id)
                    var address = event.address
                    // var link = window.location('/gallery')
                    var contentString = ' <div><h3>' + name + '</h3><br>'
                        + '<h4>Start Time: <strong>' + startTime + '</strong></h4>'
                        + '<h4>End Time: <strong>' + endTime + '</strong></h4>'
                        + '<h4>Address: <strong>' + address + '</strong></h4>'
                        + '<a href="' + link + '"><i>Event Details</i></a><br><br>'
                        + '<img style="height:200px; width:400px" src="' + event.imgUrl + '" />'
                        + '</div>';

                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });

                    marker.addListener('click', function () {
                        infowindow.open(map, marker);
                        $rootScope.clickLat = marker.getPosition().lat();
                        $rootScope.clickLong = marker.getPosition().lng();
                        $rootScope.$broadcast("clicked");

                    });
                    marker.addListener('drag', function () {
                        infowindow.open(map, marker);
                        $rootScope.clickLat = marker.getPosition().lat();
                        $rootScope.clickLong = marker.getPosition().lng();
                        $rootScope.$broadcast("drag");

                    });
                    markers.push(marker);
                }, timeout);
            }

            function clearMarkers() {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                markers = [];
            };
        };
    };
})();