angular.module('giphy.giphs', [])

    .controller('GiphsController', function ($scope, giphs) {
        console.log("Hello from Giphs controller");
        $scope.giphs = giphs;
        console.log("GIPHS number: " + giphs.length);
        console.log("TOKEN",localStorage.getItem("giphy.my"));

    })
    .controller('TranslateGiphController', function ($scope, Giphs) {
        console.log("Hello from Translate Giph controller");
        $scope.submitForm = function () {
            Giphs.translate($scope.emotion)
                .then(function (giph) {
                    $scope.giph = giph;
                })
        }
    })
    .factory('Giphs', function ($http) {
        // Your code here
        return {
            getAll: function () {
                return $http({
                    method: 'GET',
                    url: '/giphs'
                })
                    .then(function (resp) {
                        return resp.data;
                    });
            },
            translate: function (text) {
                return $http({
                    url: '/translate',
                    method: 'POST',
                    data: { 's': text }
                })
                    .then(function (resp) {
                        return resp.data;
                    })
            }

        };
    })
