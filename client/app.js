angular.module('giphy', [
  'giphy.giphs',
  'giphy.auth',
  'ui.router'
])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/giphs');

    $stateProvider
      .state('giphs', {
        url: '/giphs',
        templateUrl: 'app/giphs.html',
        controller: 'GiphsController',
        resolve: {
          giphs: function (Giphs) {
            return Giphs.getAll();
          }
        }
      })
      .state('createGiph', {
        url: '/createGiph',
        templateUrl: 'app/translategiph.html',
        controller: 'TranslateGiphController'
      })
      .state('signin', {
        url: '/signin',
        templateUrl: 'app/signin.html',
        controller: 'AuthController'
      })
      .state('token', {
        url: '/token/:accessToken',
        template: '',
        controller: function ($stateParams, $location) {
          var accessToken = $stateParams.accessToken;
          localStorage.setItem("giphy.my",accessToken);
          $location.path("/giphs");
        }
      })
  })