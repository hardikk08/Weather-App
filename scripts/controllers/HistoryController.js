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

  $scope.logout = () => {
    $cookies.remove('username');
    $location.path('/login');
  };
});
