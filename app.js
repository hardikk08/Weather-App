var weatherApp = angular.module('weatherApp', ['ngRoute']);

weatherApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'views/login.html',
    controller: 'LoginController'
  })
  .when('/home', {
    templateUrl: 'views/home.html',
    controller:'HomeController'
  })
  .otherwise({
    redirectTo: "/"
  });

  $locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});

}]);

weatherApp.run(['$rootScope', '$location', 'userService', function ($rootScope, $location, userService) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      console.log(next);
      console.log(current);
        if (!userService.isLogged) {
            console.log('DENY');
            event.preventDefault();
            $location.path('/login');
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
