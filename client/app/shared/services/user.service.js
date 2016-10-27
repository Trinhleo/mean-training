(function () {
    angular.module('app.services')
        .factory('UserService', UserService);

    UserService.$inject = ['$q', '$http', 'appConfigs', '$localStorage'];
    function UserService($q, $http, appConfigs, $localStorage) {
        var apiUrl = appConfigs.baseApiUrl + "user";
        return {
            getUserInfo: getUserInfo,
            updateUserInfo: updateUserInfo
        };

        function getUserInfo() {
            var deferred = $q.defer();
            $http.get(apiUrl + '/me').then(function (res) {
                deferred.resolve(res.data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        function updateUserInfo(data) {
            var deferred = $q.defer();
            $http.put(apiUrl + '/me', data).then(function (res) {
                deferred.resolve(res.data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
    }
})();