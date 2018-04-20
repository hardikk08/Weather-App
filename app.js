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
  .when('/weather', {
    templateUrl: '/views/weather.html',
    controller: 'weatherController'
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
      alert("Invalid Credentials");
    }
}
};

});

//Home Page controller

weatherApp.controller('HomeController', function($scope, userService, $location, $cookies, geoLocation, $http, $rootScope){
  $scope.cookies = $cookies.get('username');
//Auto detect
    $scope.location = () => {
    var promise = geoLocation.getLocation().then(function (d) {
      return d;
    });
    promise.then(function(x){
      $scope.city = x.city;
      userService.username = $scope.username;
      userService.cityName = $scope.city;
      $location.path('/weather');
      const appid = '04901d78b19fe8f31e36511c49dc0961';
      const url = "https://api.openweathermap.org/data/2.5/weather?q=" + $scope.city + "&appid=" + appid;
      $http.get(url).then(function(response){
        userService.weatherInfo = response.data;
      }, function(response){
        console.log("error");
      });
    });
  };
//User enters city
  $scope.manlocation = () => {
    $scope.city = $scope.mancity;
    userService.cityName = $scope.city;
    const appid = '04901d78b19fe8f31e36511c49dc0961';
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + $scope.city + "&appid=" + appid;
    $http.get(url).then(function(response){
      userService.weatherInfo = response.data;
      $location.path('/weather');
    }, function(response){
      console.log("error");
    });

};
//Logout function
  $scope.logout = () => {
    $cookies.remove('username');
    $location.path('/login');
  };
});

//Weather Page controller

weatherApp.controller('weatherController', function($scope, $rootScope, userService){
  $scope.city = userService.cityName;
  let weather = userService.weatherInfo;
console.log(weather);
  function getweather(){
    return console.log("hello");
  };

  $scope.weather = {
    temp: weather.main.temp,
    max: weather.main.temp_max,
    min: weather.main.temp_min,
    weat: weather.weather[0].main,
    winddegree: weather.wind.deg,
    windspeed: weather.wind.speed
  };

  $scope.logout = () => {
    $cookies.remove('username');
    $location.path('/login');
  };
});
