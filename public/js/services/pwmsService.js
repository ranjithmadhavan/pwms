/**
 * Creates and Destroys a session
 * 
 * @param  {[type]} ){	this.create [description]
 * @return {[type]}                 [description]
 */
passwordManagementApp.service("Session", ['$window',function($window){			
	this.create = function(sessionId, userId, userRole, token) {
		this.id = sessionId;
		this.userId = userId;
		this.userRole = userRole;
		this.token = token;
		var user = {
			id : sessionId,
			userId : userId,
			userRole : userRole,
			token : token
		}
		$window.sessionStorage["user"] = btoa(JSON.stringify(user));
	};

	this.destroy = function() {
		this.id = null;
		this.userId = null;
		this.userRole = null;
		this.token = null;
	}
}]);

/**
 * Authentication Service.
 * @param  {[type]} $http          [description]
 * @param  {Object} Session){	var authService   [description]
 * @return {[type]}                [description]
 */
passwordManagementApp.factory("AuthService",['$http','Session', '$window', function($http, Session, $window){
	var authService = {};
	authService.login = function(credentials) {
		var loginUrl = "/login";
		if (!credentials.siteId || credentials.siteId.trim() === "" ) {
			loginUrl = "/authenticate";
		}
		return $http.post(loginUrl, credentials)
					.then(function(res){
						Session.create(res.data.id, res.data.user.id, res.data.user.role, res.data.token);
						return res.data;
					});
	};

	authService.isAuthenticated = function() {
		return !!Session.userId;
	};

	authService.isAuthorized = function(authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
	};

	authService.logout = function() {
		Session.destroy();		
        $window.sessionStorage.removeItem("user");
	}
	
	// Set the session id and token from local storage if available.
    if ($window.sessionStorage["user"] !== undefined) {  
    	try {  	
	        var user = JSON.parse(atob($window.sessionStorage["user"]));
	        Session.create(user.id, user.userId, user.userRole, user.token);
	    } catch (err) {
	    	authService.logout();
	    }
    }
	return authService;

}]);

/**
 * Auth interceptor for all http requests. We do the logic for showing and hiding the
 * Loading Image and adding the token to the request header here.
 * 
 * @param  {[type]} $rootScope     [description]
 * @param  {[type]} $q             [description]
 * @param  {[type]} AUTH_EVENTS    [description]
 * @param  {[type]} APP_CONSTANTS) {	var        numLoadings [description]
 * @param  {[type]} response:      function      (response)  {                                                if ((--numLoadings) < [description]
 * @param  {[type]} responseError: function      (response)  {            			if (!(--numLoadings)) {                                                $rootScope.$broadcast(APP_CONSTANTS.hideLoader);			}			$rootScope.$broadcast({		    	401: AUTH_EVENTS.notAuthenticated,		    	403: AUTH_EVENTS.notAuthorized,		    	419: AUTH_EVENTS.sessionTimeout,		    	440: AUTH_EVENTS.sessionTimeout		  	}[response.status], response [description]
 * @return {[type]}                [description]
 */
passwordManagementApp.factory('AuthInterceptor', ['$rootScope', '$q','AUTH_EVENTS', 'APP_CONSTANTS' , 'Session', function ($rootScope, $q,
                                      AUTH_EVENTS, APP_CONSTANTS, Session) {
	var numLoadings=0;
	return {
        request: function (config) {
            numLoadings++;
            $rootScope.$broadcast(APP_CONSTANTS.showLoader);
            config.headers['x-access-token'] = Session.token;
            return config || $q.when(config)
        },
        response: function (response) {
            if ((--numLoadings) <= 0) {
                $rootScope.$broadcast(APP_CONSTANTS.hideLoader);
            }            
            return response || $q.when(response);
        },
		responseError: function (response) { 
			if (!(--numLoadings)) {
                $rootScope.$broadcast(APP_CONSTANTS.hideLoader);
			}
			$rootScope.$broadcast({
				400: AUTH_EVENTS.customError,
		    	401: AUTH_EVENTS.notAuthenticated,
		    	403: AUTH_EVENTS.notAuthorized,
		    	419: AUTH_EVENTS.sessionTimeout,
		    	440: AUTH_EVENTS.sessionTimeout,
		    	500 :AUTH_EVENTS.serverError
		  	}[response.status], response);
		  	return $q.reject(response);
		}
	};
}]);