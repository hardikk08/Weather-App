var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngCookies']);

weatherApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider
  .when('/login', {
    templateUrl: '/views/login.html',
    controller: 'LoginController'
  })
  .when('/home', {
    templateUrl: '/views/home.html',
    controller:'HomeController'
  })
  .when('/weather', {
    templateUrl: '/views/weather.html',
    controller: 'weatherController'
  })
  .when('/history', {
    templateUrl: '/views/history.html',
    controller: 'historyController'
  })
  .otherwise({
    redirectTo: '/login'
  });

  $locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});

}]);

weatherApp.run(['$rootScope', '$location', 'userService', function ($rootScope, $location, userService) {
    $rootScope.$on('$routeChangeStart', function (event, prev, current) {
        if (!prev.access.isFree && !userService.isLogged) {
            event.preventDefault();
            $location.path('/');
        }
    });
}]);
