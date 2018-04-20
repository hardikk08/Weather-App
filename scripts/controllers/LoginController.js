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
