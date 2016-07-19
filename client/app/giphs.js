angular.module('giphy.giphs', [])

.controller('GiphsController', function ($scope, giphs) {
    console.log("Hello from Giphs controller");
    $scope.giphs = giphs;
    console.log("GIPHS number: " + giphs.length);

})
.controller('TranslateGiphController', function ($scope) {
    console.log("Hello from Translate Giph controller");
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
          return JSON.parse(resp.data).data;
        });
    },
  };
})
