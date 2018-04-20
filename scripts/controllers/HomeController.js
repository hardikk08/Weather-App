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
