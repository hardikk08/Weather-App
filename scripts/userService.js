weatherApp.service('userService', function(){
  return{
    isLogged: false,
    username: '',
    cityName: '',
    weatherInfo: ''
  };
});
