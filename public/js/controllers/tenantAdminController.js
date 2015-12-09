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
    'TenantAdminService',function ($scope, $location, $rootScope, AUTH_EVENTS, TenantAdminService){

	$scope.setPageDef ("Settings"); 

	TenantAdminService.getSettings().then(function(settings){
		$scope.settings = settings;
	});
}]);
