/**
 * User Service.
 * @param  {[type]} $http         [description]
 * @param  {[type]} Session       [description]
 * @param  {[type]} $window){}] [description]
 * @return {[type]}               [description]
 */
passwordManagementApp.factory("UserService",['$http','Session', '$window', '$q', function($http, Session, $window, $q){
	var userService = {};


	userService.getProfile = function() {
		return $http.get("/userProfile")
			.then(function(response){
				return response.data;
			});
	}

	userService.selfPasswordReset = function(oldPassword, newPassword) {
		var deferred = $q.defer();
		$http.post("/selfPasswordReset", {oldPassword:oldPassword, newPassword:newPassword})
			.then(function(response){
				deferred.resolve(response);
			}, function(error){
				deferred.reject(error);
			});
		return deferred.promise;
	}
	return userService;

}]);