(function () {
    angular.module('app.events')
        .controller('AddEventController', AddEventController);

    AddEventController.$inject = ['$state', '$localStorage', '$rootScope', '$scope', 'EventService', 'geolocation', 'FileUploader', 'appConfigs', '$window', '$timeout'];

    function AddEventController($state, $localStorage, $rootScope, $scope, EventService, geolocation, FileUploader, appConfigs, $window, $timeout) {
        var vm = this;
        // Initializes Variables
        // ----------------------------------------------------------------------------
        var coords = {};
        var lat = 0;
        var long = 0;
        vm.clickLat = 10.350;
        vm.clickLong = 106.500;
        vm.eventId = '';
        vm.formData = {};
        vm.endDateBeforeRender = endDateBeforeRender;
        vm.endDateOnSetTime = endDateOnSetTime;
        vm.startDateBeforeRender = startDateBeforeRender;
        vm.startDateOnSetTime = startDateOnSetTime;
        // Set initial coordinates to the center of the US
        vm.formData.latitude = 10.350;
        vm.formData.longitude = 106.500;
        vm.createEvent = createEvent;
        vm.uploader = new FileUploader({
            url: appConfigs.baseApiUrl + 'gallery/images',
            headers: {
                authorization: $localStorage.token
            },
            alias: 'myfile'
        });
        vm.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        vm.uploader.onAfterAddingFile = onAfterAddingFile;
        vm.uploader.onSuccessItem = onSuccessItem;
        vm.uploader.onErrorItem = onErrorItem;
        vm.uploadEventImage = uploadEventImage;
        vm.cancelUpload = cancelUpload;

        this.isOpen = false;

        this.openCalendar = function (e) {
            e.preventDefault();
            e.stopPropagation();

            vm.isOpen = true;
        };


        getEventsLocation();

        function getEventsLocation() {
            EventService.loadEvents().then(
                function (res) {
                    vm.events = res;
                    // drop();
                    console.log(res);
                },
                function (err) {
                    console.log(err)
                    vm.alert = err;
                });
        }


        // Get User's actual coordinates based on HTML5 at window load
        geolocation.getLocation().then(function (data) {

            // Set the latitude and longitude equal to the HTML5 coordinates
            coords = { lat: data.coords.latitude, long: data.coords.longitude };

            // Display coordinates in location textboxes rounded to three decimal points
            vm.formData.longitude = parseFloat(coords.long).toFixed(3);
            vm.formData.latitude = parseFloat(coords.lat).toFixed(3);


        });



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

        function createEvent() {

            // Grabs all of the text box fields
            var eventData = {
                name: vm.formData.name,
                startTime: vm.formData.startTime,
                endTime: vm.formData.endTime,
                location: [vm.formData.longitude, vm.formData.latitude],
                description: vm.formData.description,
                address: vm.formData.address
            };

            EventService.createEvent(eventData)
                .then(function (res) {
                    console.log(res);
                    // Clear form data expert location
                    vm.formData.name = "";
                    vm.formData.startTime = "";
                    vm.formData.endTime = "";
                    vm.formData.description = "";
                    vm.formData.address = "";
                    getEventsLocation();
                    vm.uploadEventImage();
                    vm.eventId = res._id;
                }, function (err) {
                    $rootScope.alert = err.data.message;
                });

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
