angular.module('giphy.auth', [])

    .controller('AuthController', function ($scope) {
        console.log("Hello from Auth controller");

    })
    .factory('Auth', function ($http) {
        return {
            isAuth: function () {
                return !!localStorage.getItem("giphy.my");
            },
            signout: function ($location) {
                localStorage.removeItem("giphy.my");
                //TBD: request to server to destroy user session
                $location.go("signin");
            }

        };
    })