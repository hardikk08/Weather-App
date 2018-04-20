weatherApp.factory('geoLocation', function($http){
  return{
    getLocation: function(){
      return $http.get('https://api.ipdata.co').then(function(response){
        return response.data;
      });
    }
  };
});
