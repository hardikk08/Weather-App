var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngCookies']);

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


weatherApp.controller('LoginController', function($scope, userService, $location, $cookies){
  $scope.user = userService.username;
  if($cookies.get('username')){
    $location.path('/home');
  }

  $scope.submit = () => {
    if ('localStorage' in window && window['localStorage'] !== null) {
      if(($scope.username && $scope.password !== undefined || null)) {
            localStorage.setItem($scope.username, $scope.password);
            $scope.username = "";
            $scope.password = "";
          }

          else alert("You have either forgotten username or password");
  }
};
  $scope.login = () => {
    for(var i=0, len=localStorage.length; i<len; i++) {
    var key = localStorage.key(i);
    var value = localStorage[key];
    if(key === $scope.username && value === $scope.password){
      userService.isLogged = true;
      userService.username = $scope.username;
      $cookies.put('username', $scope.username);
      $location.path('/home');
    }
    else{
      userService.isLogged = false;
      userService.username = '';
    }
}
};

});

weatherApp.controller('HomeController', function($scope, userService, $location, $cookies, geoLocation, $http){
  $scope.cookies = $cookies.get('username');

    //HTML5 geoLocation is deprecated for non secure http servers hence using another location api service!

    $scope.location = () => {
    var promise = geoLocation.getLocation().then(function (d) {
      return d.data;
    });
    promise.then(function(x){
      $scope.data = {
        city: x.city,
        lat: x.lat,
        lon: x.lon
      };

      const appid = '04901d78b19fe8f31e36511c49dc0961';
      const url = "https://api.openweathermap.org/data/2.5/weather?q=" + $scope.city + "&appid=" + appid;
      console.log(url);
      $http.get(url).then(function(response){
        console.log(response);
      }, function(response){
        console.log("error");
      });
    });
    $scope.data.city = '';
  };

  $scope.logout = () => {
    $cookies.remove('username');
    $location.path('/login');
  };
});
