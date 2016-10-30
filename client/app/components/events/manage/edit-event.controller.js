(function () {
    angular.module('app.events')
        .controller('EditEventController', EditEventController);

    EditEventController.$inject = ['$state', '$localStorage', '$rootScope', '$scope', 'EventService', '$stateParams', 'FileUploader', 'appConfigs', '$window', '$timeout'];

    function EditEventController($state, $localStorage, $rootScope, $scope, EventService, $stateParams, FileUploader, appConfigs, $window, $timeout) {
        var vm = this;
        // Initializes Variables
        vm.url = appConfigs.baseApiUrl + 'gallery/images';
        vm.counter = 0;
        vm.events = [];
        vm.eventImages = []
        vm.formData = {};
        vm.endDateBeforeRender = endDateBeforeRender;
        vm.endDateOnSetTime = endDateOnSetTime;
        vm.startDateBeforeRender = startDateBeforeRender;
        vm.startDateOnSetTime = startDateOnSetTime;
        vm.updateEvent = updateEvent;
        vm.eventId = $stateParams.eventId;
        // vm.uploader = new FileUploader({
        //     url: appConfigs.baseApiUrl + 'events/' + vm.eventId + '/images',
        //     headers: {
        //         authorization: $localStorage.token
        //     },
        //     alias: 'myfile'
        // });
        // vm.uploader.filters.push({
        //     name: 'imageFilter',
        //     fn: function (item, options) {
        //         var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        //         return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        //     }
        // });
        // vm.uploader.onAfterAddingFile = onAfterAddingFile;
        // vm.uploader.onSuccessItem = onSuccessItem;
        // vm.uploader.onErrorItem = onErrorItem;
        // vm.uploadEventImage = uploadEventImage;
        // vm.cancelUpload = cancelUpload;
        vm.resetForm = getEventsLocation;
        // vm.formChangeDisable = formChangeDisable;
        // vm.resetChangeDisable = resetChangeDisable;
        vm.loaded = false;

        getEventsLocation();

        // formChangeDisable()
        // resetChangeDisable()
        // function formChangeDisable() {
        //     return vm.loaded ? (vm.counter < 1 ? true : false) : (vm.counter < 3 ? true : false);
        //     // return vm.counter > 0?false:true;
        // };

        // function resetChangeDisable() {
        //     return vm.loaded ? (vm.counter < 1 ? true : false) : (vm.counter < 3 ? true : false);
        // }

        function getEventsLocation() {
            EventService.getEvent($stateParams.eventId).then(
                function (res) {
                    var evt = res;
                    vm.formData = evt;
                    vm.formData.latitude = evt.location[1];
                    vm.formData.longitude = evt.location[0];
                    delete vm.formData.location;
                    // vm.event = evt;
                    vm.events.push(evt);
                    vm.loaded = true;
                    console.log(vm.loaded);
                },
                function (err) {
                    $state.go('index.events');
                    vm.loaded = true;
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
        };

        $scope.$watch('vm.formData', function (data) {
            if (vm.loaded) {
                vm.counter++;
            }
            console.log(vm.counter);
            vm.formData = data;

        }, true);



        // // Get User's actual coordinates based on HTML5 at window load
        // geolocation.getLocation().then(function (data) {

        //     // Set the latitude and longitude equal to the HTML5 coordinates
        //     coords = { lat: data.coords.latitude, long: data.coords.longitude };

        //     // Display coordinates in location textboxes rounded to three decimal points
        //     vm.formData.longitude = parseFloat(coords.long).toFixed(3);
        //     vm.formData.latitude = parseFloat(coords.lat).toFixed(3);


        // });



        // Get coordinates based on mouse click. When a click event is detected....
        $rootScope.$on("clicked", function () {

            // Run the gservice functions associated with identifying coordinates
            $scope.$apply(function () {
                vm.formData.latitude = parseFloat($rootScope.clickLat).toFixed(3);
                vm.formData.longitude = parseFloat($rootScope.clickLong).toFixed(3);
                console.log(vm.clickLat);
            });
        });
        $rootScope.$on("drag", function () {

            // Run the gservice functions associated with identifying coordinates
            $scope.$apply(function () {
                vm.formData.latitude = parseFloat($rootScope.clickLat).toFixed(3);
                vm.formData.longitude = parseFloat($rootScope.clickLong).toFixed(3);
            });
        });

        function updateEvent() {
            vm.formData.location = [vm.formData.longitude, vm.formData.latitude]
            EventService.updateEvent(vm.formData)
                .then(function (res) {
                    console.log(res);
                    getEventsLocation()
                }, function (err) {
                    $rootScope.alert = err.data.message;
                });
            vm.counter = 0;
        };

        function startDateOnSetTime() {
            $scope.$broadcast('start-date-changed');
        }

        function endDateOnSetTime() {
            $scope.$broadcast('end-date-changed');
        }

        function startDateBeforeRender($dates) {
            if (vm.formData.endTime) {
                var activeDate = moment(vm.formData.endTime);

                $dates.filter(function (date) {
                    return date.localDateValue() >= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            }
        }

        function endDateBeforeRender($view, $dates) {
            if (vm.formData.startTime) {
                var activeDate = moment(vm.formData.startTime).subtract(1, $view).add(1, 'minute');

                $dates.filter(function (date) {
                    return date.localDateValue() <= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            };
        };
        // Called after the user selected a new picture file
        function onAfterAddingFile(fileItem) {
            if ($window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);

                fileReader.onload = function (fileReaderEvent) {
                    $timeout(function () {
                        vm.imageURL = fileReaderEvent.target.result;
                    }, 0);
                };
            }
        };

        // Called after the user has successfully uploaded a new picture
        function onSuccessItem(fileItem, response, status, headers) {
            // Show success message


            // Clear upload buttons
            vm.cancelUpload();
            var data = {};
            data._id = vm.eventId;
            data.imgUrl = response.imgUrl;
            EventService.updateEvent(data).then(function (res) {
                vm.success = "success";
                getEventsLocation();
            },
                function (err) {
                    vm.error = "error"
                });
            // $state.go('index.gallery');

        };

        // Called after the user has failed to uploaded a new picture
        function onErrorItem(fileItem, response, status, headers) {
            // Clear upload buttons
            vm.cancelUpload();

            // Show error message
            vm.error = response.message;
        };

        // Change user profile picture
        function uploadEventImage() {
            // Clear messages
            vm.success = vm.error = null;

            // Start upload
            vm.uploader.uploadAll();
        };

        // Cancel the upload process
        function cancelUpload() {
            vm.uploader.clearQueue();
        };
    };
})();
