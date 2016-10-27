(function () {
    "use strict";
    angular.module('app.config', [])
        .constant('appConfigs', {
            baseApiUrl: 'http://localhost:3000/api/',
            baseUrl: 'http://localhost'
        });
})();