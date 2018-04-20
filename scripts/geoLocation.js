weatherApp.factory('geoLocation', function($http){
  return{
    getLocation: function(){
      return $http.get('http://ip-api.com/json').then(function(response){
        return response;
      });
    }
  };
});
