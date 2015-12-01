/**
 * User Service.
 * @param  {[type]} $http         [description]
 * @param  {[type]} Session       [description]
 * @param  {[type]} $window){}] [description]
 * @return {[type]}               [description]
 */
passwordManagementApp.factory("UserService",['$http','Session', '$window', function($http, Session, $window){
	var userService = {};


	userService.getProfile = function() {
		return $http.get("/userProfile")
			.then(function(response){
				return response.data;
			});
	}

	return userService;

}]);