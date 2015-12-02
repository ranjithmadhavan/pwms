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

	return tenantAdminService;
}]);