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
            alert("You have registered, Please login!");
          }
          else alert("You have either forgotten username or password");
  }
};
  $scope.login = () => {
    var isFound = false;
    for(var i=0, len=localStorage.length; i<len; i++) {
    var key = localStorage.key(i);
    var value = localStorage[key];
    if(key === $scope.username && value === $scope.password){
      $cookies.put('username', $scope.username);
      $location.path('/home');
      isFound = true;
        }
      }
    if(!isFound){
      alert("Invalid Credentials");
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
      userService.cityName = $scope.city;
        $location.path('/weather');
    });
  };
//User enters city
  $scope.manlocation = () => {
    userService.cityName = $scope.mancity;
    $scope.history = $cookies.get($scope.cookies);
    console.log($scope.history);
    if(!$scope.history){
      $cookies.put($scope.cookies, $scope.city);
    }
    else{
      let pastSearch = $scope.history + ',' + $scope.city;
      $cookies.put($scope.cookies, pastSearch);
    }
       $location.path('/weather');
};
//Logout function
  $scope.logout = () => {
    $cookies.remove('username');
    $location.path('/login');
  };
});

//Weather Page controller

weatherApp.controller('weatherController', function($scope, $rootScope, userService, $cookies, $location, $http){
  $scope.city = userService.cityName;
  const appid = '04901d78b19fe8f31e36511c49dc0961';
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + $scope.city + "&appid=" + appid;
  $http.get(url).then(function(response){
    userService.weatherInfo = response.data;
      let weather = userService.weatherInfo;
    console.log(weather, 'weather');
      $scope.weather = {
        temp: weather.main.temp,
        max: weather.main.temp_max,
        min: weather.main.temp_min,
        weat: weather.weather[0].main,
        winddegree: weather.wind.deg,
        windspeed: weather.wind.speed
      };
  }, function(response){
    console.log("error");
  });


  $scope.logout = () => {
    $cookies.remove('username');
    $location.path('/login');
  };
});


weatherApp.controller('historyController', function($scope, $rootScope, userService, $cookies, $location, unique){
  $scope.cookies = $cookies.get('username');
  let history = $cookies.get($scope.cookies);
  $scope.splits = history.split(',');

  $scope.historySearch = (item) => {
    userService.cityName = item;
    $location.path('/weather');
  };
});
