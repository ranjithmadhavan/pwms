/**
 * Profile Controller
 * 
 * @param  {[type]} $scope      [description]
 * @param  {[type]} $location   [description]
 * @param  {[type]} AuthService [description]
 * @param  {[type]} $state){                   	$scope.setPageDef ("User Profile");}] [description]
 * @return {[type]}             [description]
 */
passwordManagementApp.controller('UserProfileCtrl',['$scope', '$location', 'UserService', '$state',function ($scope, $location, UserService, $state){    
	$scope.setPageDef ("User Profile");
	UserService.getProfile()
		.then(function(response){
			$scope.userProfile = response;
		});	

}]);

/**
 * AdminProfileQuestionsController
 * 
 * @param  {[type]} $scope      [description]
 * @param  {[type]} $location   [description]
 * @param  {[type]} AuthService [description]
 * @param  {[type]} $state){                   	$scope.setPageDef ("User Profile");}] [description]
 * @return {[type]}             [description]
 */
passwordManagementApp.controller('AdminProfileQuestionsCtrl',['$scope', '$location', 'AuthService', '$state',function ($scope, $location, AuthService, $state){    
	$scope.setPageDef ("Setup Recovery Questions");
}]);

passwordManagementApp.controller('AdminSettingsCtrl',['$scope', '$location', 'AuthService', '$state',function ($scope, $location, AuthService, $state){    
	$scope.setPageDef ("Settings");
}]);

passwordManagementApp.controller('UserPasswordResetCtrl',['$scope', '$location', 'UserService', '$state',function ($scope, $location, UserService, $state){    
	$scope.setPageDef ("Reset Password");
	$scope.selfPasswordReset = function() {
		console.log("Called Reset User Password with old password "+$scope.currentPassword+" and new password "+$scope.newPassword);
		UserService.selfPasswordReset($scope.currentPassword,$scope.newPassword);
	}
}]);

