/**
 * Tenant Admin Service
 * @param  {[type]} $rootScope     [description]
 * @param  {[type]} $q             [description]
 * @param  {[type]} AUTH_EVENTS    [description]
 * @param  {[type]} APP_CONSTANTS  [description]
 * @param  {[type]} Session)       {	var        numLoadings [description]
 * @param  {[type]} response:      function      (response)  {                                                if ((--numLoadings) < [description]
 * @param  {[type]} responseError: function      (response)  {            			if (!(--numLoadings)) {                                                $rootScope.$broadcast(APP_CONSTANTS.hideLoader [description]
 * @return {[type]}                [description]
 */
passwordManagementApp.factory('TenantAdminService', ['$q', '$http', 
								function ($q, $http) {
	var tenantAdminService = {};
	tenantAdminService.getQuestions = function() {
		return $http.get("/getQuestions")
					.then(function(res){
						return res.data;
					});
	}

	tenantAdminService.addQuestion = function (question) {
		return $http.post("/addQuestion", question)
					.then(function(res){
						return res.data
					});
	}


	tenantAdminService.modifyQuestion = function (question) {
		return $http.post("/modifyQuestion", question)
					.then(function(res){
						return res.data
					});
	}

	tenantAdminService.deleteQuestion = function (question) {
		return $http.post("/deleteQuestion", question)
					.then(function(res){
						return res.data
					});
	}
	return tenantAdminService;
}]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
passwordManagementApp.factory('TenantAdminSettings', ['$resource',
	function($resource) {
		return $resource('/settings/:tenantSettingsId', {
			tenantSettingsId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);