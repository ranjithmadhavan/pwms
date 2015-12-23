/**
 * Tenant Admin Controller.
 * 
 * @param  {[type]} $scope         [description]
 * @param  {[type]} $location      [description]
 * @param  {[type]} $rootScope     [description]
 * @param  {[type]} AUTH_EVENTS    [description]
 * @param  {Object} AuthService){                                                             $scope.credentials [description]
 * @param  {[type]} function       (responseError) {            $scope.errorMsg [description]
 * @return {[type]}                [description]
 */
passwordManagementApp.controller('AdminProfileQuestionsCtrl',['$scope', '$location', '$rootScope', 'AUTH_EVENTS', 
    'TenantAdminService',function ($scope, $location, $rootScope, AUTH_EVENTS, TenantAdminService){            


		$scope.newQuestion = {
			question : ""
		}

	    TenantAdminService.getQuestions()
	        .then(function(questions){
	            $scope.questions = questions; 
	     	});
	    $scope.clearQuestion = function() {
	    	$scope.newQuestion.question = "";
	    }

	    $scope.addQuestion = function(question) {
	    	TenantAdminService.addQuestion(question)
	    		.then(function(questions){
	    			$scope.clearQuestion();
	    			$scope.questions = questions;
	    		});
	    }

	    $scope.deleteQuestion = function() {	    				
	    	TenantAdminService.deleteQuestion($scope.questionToDelete)
	    		.then(function(questions){
	    			$('#deleteConfirmationModal').modal('hide');
	    			$scope.questions = questions;
	    			$scope.newQuestion = {}
	    			$scope.message = "Delete successful"
	    		});
	    }

	    $scope.confirmDelete = function(question) {	 
	    	$scope.questionToDelete = question;   	
			$('#deleteConfirmationModal').modal('show');
	    }

	    $scope.prepareQuestionForEdit = function(question) {
	    	$scope.newQuestion = JSON.parse(JSON.stringify(question));
	    	$scope.questionToEdit = question;
	    }

	    $scope.modifyQuestion = function() {
	    	var questionToEdit = JSON.parse(JSON.stringify($scope.questionToEdit));
	    	questionToEdit.question = $scope.newQuestion.question;
	    	TenantAdminService.modifyQuestion(questionToEdit)
	    		.then(function(questions){
	    			$scope.questions = questions;
	    			$scope.message = "Save successful";
	    		});
	    }

	    $scope.setPageDef ("Manage Password Recovery Questions"); 
}]);

/**
 * Tenant Admin Settings Controller.
 * 
 * @param  {[type]} $scope                   [description]
 * @param  {[type]} $location                [description]
 * @param  {[type]} $rootScope               [description]
 * @param  {[type]} AUTH_EVENTS              [description]
 * @param  {[type]} TenantAdminService){}] [description]
 * @return {[type]}                          [description]
 */
passwordManagementApp.controller('AdminSettingsCtrl',['$scope', '$location', '$rootScope', 'AUTH_EVENTS', 
    'TenantAdminSettings',function ($scope, $location, $rootScope, AUTH_EVENTS, TenantAdminSettings){

	$scope.setPageDef ("Settings"); 

	$scope.getAdminSettings = function() {
		$scope.tenantAdminSettings = new TenantAdminSettings();
		var settings = TenantAdminSettings.query();
		settings.$promise.then(function(result){			
			if (result && result.length > 0) {
				$scope.tenantAdminSettings = result[0];
			} 
		});
	}

	$scope.save = function() {
		var settings = $scope.tenantAdminSettings;
		if (settings._id) {
			settings.$update(function(response) {
				$scope.setMessage("Save successful.");
			}, function(errorResponse) {
				$scope.setError(errorResponse.data.message);
			});

		} else {
			settings.$save(function(response) {
				$scope.setMessage("Save successful.");
			}, function(errorResponse) {
				$scope.setError(errorResponse.data.message);
			});
		}
		
	};

	$scope.getAdminSettings();
}]);
