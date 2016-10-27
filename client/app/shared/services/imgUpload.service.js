(function () {
    angular.module('app.gallery')
        .factory('UploadImageService', UploadImageService);

    UploadImageService.$inject = ['$q', '$localStorage'];
    function UploadImageService($q, $localStorage) {
        return {
            uploadFileToUrl = uploadFileToUrl
        };

        function uploadFileToUrl(file, uploadUrl) {
            var deferred = $q.defer();
            var fd = new FormData();
            fd.append('file', file);
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    authorization: $localStorage.token
                },
            })
                .success(function () {
                    deferred.resolve(res.data);
                })
                .error(function () {
                    deferred.reject();
                });
            return deferred.promise;
        };
    };
})();

