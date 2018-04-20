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
        windspeed: weather.wind.speed,
        country: weather.sys.country
      };
  }, function(error){
    alert("This must be the city of your dreams, please try again");
    $scope.cookies = $cookies.get('username');
    $scope.history = $cookies.get($scope.cookies);
    if($scope.history){
      let history = $cookies.get($scope.cookies);
      var splits = history.split(',');
      let newHistory = splits.slice(0,-1);
      $cookies.put($scope.cookies, newHistory, {'expires': expireDate});
    }
  });


  $scope.logout = () => {
    $cookies.remove('username');
    $location.path('/login');
  };
});
