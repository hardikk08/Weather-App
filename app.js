var weatherApp = angular.module('weatherApp', ['ngRoute']);

weatherApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider
  .when('/login', {
    templateUrl: '/views/login.html',
    controller: 'LoginController',
    access: {
    isFree: true
  }
  })
  .when('/home', {
    templateUrl: '/views/home.html',
    controller:'HomeController'
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


weatherApp.controller('LoginController', function($scope, userService, $location){
  $scope.submit = () => {
    if ('localStorage' in window && window['localStorage'] !== null) {
            localStorage.setItem($scope.email, $scope.password);
            $scope.email = "";
            $scope.password = "";
  }
}
  $scope.login = () => {
    for(var i=0, len=localStorage.length; i<len; i++) {
    var key = localStorage.key(i);
    var value = localStorage[key];
    if(key === $scope.email && value === $scope.password){
      console.log("Match");
      userService.isLogged = true;
      userService.username = $scope.email;
      $location.path('/home');
    }
    else{
      userService.isLogged = false;
      userService.username = '';
    }
}
  }
});

weatherApp.controller('HomeController', function($scope){
  console.log("hello");
});
