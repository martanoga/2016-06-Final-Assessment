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
        authenticate: true,
        resolve: {
          giphs: function (Giphs) {
            return Giphs.getAll();
          }
        }
      })
      .state('translateGiph', {
        url: '/translateGiph',
        templateUrl: 'app/translategiph.html',
        controller: 'TranslateGiphController',
        authenticate: true
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
          localStorage.setItem("giphy.my", accessToken);
          $location.path("/giphs");
        }
      })
      .state('signout', {
        url: '/signout',
        controller: '',
        resolve: {
          auth: function(Auth){
            Auth.signout();
          }
        }
      })
  })
  .run(function ($rootScope, $location, Auth, $state) {
    $rootScope.$on("$stateChangeStart",
      function (event, toState, toParams, fromState, fromParams) {
        if ( toState && toState.authenticate && !Auth.isAuth()){
          event.preventDefault();
          console.log("unauthorized");
          $state.go("signin");
        }
      }
    );
  });