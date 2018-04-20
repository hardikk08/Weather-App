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
    if (localStorage) {
      if($scope.username && $scope.password) {
            localStorage.setItem($scope.username, $scope.password);
            $scope.username = "";
            $scope.password = "";
            alert("You have registered, Please login!");
          }
          else {
            alert("Please set both, username and password!");
            $scope.username = "";
            $scope.password = "";
          }
  }
};
  $scope.login = () => {
    var isFound = false;
    for(var i=0, len=localStorage.length; i<len; i++) {
    var key = localStorage.key(i);
    var value = localStorage[key];
    if(key === $scope.username && value === $scope.password){
      var expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 100);
      var cookie = $cookies.put('username', $scope.username, {'expires': expireDate});
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
  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 100);
//Auto detect
    $scope.location = () => {
    var promise = geoLocation.getLocation().then(function (d) {
      return d;
    });
    promise.then(function(x){
      $scope.city = x.city;
      userService.cityName = $scope.city;
      $scope.history = $cookies.get($scope.cookies);
      if(!$scope.history){
        $cookies.put($scope.cookies, $scope.city, {'expires': expireDate});
      }
      else{
        let pastSearch = $scope.history + ',' + $scope.city;
        $cookies.put($scope.cookies, pastSearch, {'expires': expireDate});
      }
        $location.path('/weather');
    });
  };
//User enters city
  $scope.manlocation = () => {
    userService.cityName = $scope.mancity;
    $scope.history = $cookies.get($scope.cookies);
    if(!$scope.history){
      $cookies.put($scope.cookies, $scope.mancity, {'expires': expireDate});
    }
    else{
      let pastSearch = $scope.history + ',' + $scope.mancity;
      $cookies.put($scope.cookies, pastSearch, {'expires': expireDate});
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
  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 100);
  const appid = '04901d78b19fe8f31e36511c49dc0961';
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + $scope.city + "&appid=" + appid;
  $http.get(url).then(function(response){
    userService.weatherInfo = response.data;
      let weather = userService.weatherInfo;
      $scope.weather = {
        temp: weather.main.temp,
        max: weather.main.temp_max,
        min: weather.main.temp_min,
        weat: weather.weather[0].main,
        winddegree: weather.wind.deg,
        windspeed: weather.wind.speed
      };
  }, function(error){
    alert("This must be the city of your dreams, please try again");
    $scope.cookies = $cookies.get('username');
    console.log($scope.cookies, 'username');
    $scope.history = $cookies.get($scope.cookies);
    console.log($scope.history, 'history');
    if($scope.history){
      let history = $cookies.get($scope.cookies);
      console.log(history, 'history');
      var splits = history.split(',');
      let newHistory = splits.slice(0,-1);
      $cookies.put($scope.cookies, newHistory, {'expires': expireDate});
      debugger;
    }
  });


  $scope.logout = () => {
    $cookies.remove('username');
    $location.path('/login');
  };
});


weatherApp.controller('historyController', function($scope, $rootScope, userService, $cookies, $location){
  $scope.cookies = $cookies.get('username');
  $scope.historyExists = $cookies.get($scope.cookies);
  if($scope.historyExists){
    let history = $cookies.get($scope.cookies);
    $scope.splits = history.split(',');
  }
  $scope.historySearch = (item) => {
    userService.cityName = item;
    $location.path('/weather');
  };
});
