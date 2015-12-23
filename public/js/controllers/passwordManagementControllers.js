/**
 * Main controller. We can put stuff in here rather than putting in root scope.
 * 
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $location     [description]
 * @param  {[type]} $window       [description]
 * @param  {[type]} AUTH_EVENTS   [description]
 * @param  {[type]} AuthService   [description]
 * @param  {[type]} APP_CONSTANTS [description]
 * @param  {[type]} Session){                    $scope.user [description]
 * @return {[type]}               [description]
 */
passwordManagementApp.controller('MainCtrl',['$scope', '$location', '$window', 'AUTH_EVENTS', 'AuthService', 'APP_CONSTANTS','Session', "USER_ROLES",
                function ($scope, $location, $window, AUTH_EVENTS, AuthService, APP_CONSTANTS, Session, USER_ROLES){
    $scope.user = function() {
       return Session.userId;
    }

    $scope.message = "";
    $scope.error = ""

    $scope.setMessage = function(message) {
        $scope.message = message;
    }

    $scope.setError = function(error) {
        $scope.error = error;
    }

    $scope.clearMessages = function() {
        $scope.message = "";
        $scope.error = "";
    }

    $scope.validationErrors = [];
    $scope.setValidationErrors = function(validationErrors) {
        $scope.validationErrors = validationErrors;
    }

    $scope.token = null;
    $scope.pageDef = "";
    $scope.isLoggedIn = function() {
        return AuthService.isAuthenticated();
    }
    $scope.logout = function() {
        AuthService.logout();
        $location.path("/login"); 
    }

    $scope.isAdmin = function() {
       return USER_ROLES.ROLE_ADMIN === Session.userRole;
    }

    $scope.isUser = function() {
       return USER_ROLES.ROLE_USER === Session.userRole;
    }

    $scope.$on(APP_CONSTANTS.showLoader, function (event, args) {
        $scope.loaderClass = "spinner-loader spinner-div";
        $scope.setValidationErrors([]);
        $scope.clearMessages();
     });

     $scope.$on(APP_CONSTANTS.hideLoader, function (event, args) {
        $scope.loaderClass = ""
     });

    $scope.$on(AUTH_EVENTS.loginFailed, function (event, args) {
        console.log("Received Login Failed Broadcast");  
        $location.path("/login");       
     });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function (event, args) {
        console.log("Received not Authenciated Broadcast");
        $scope.setError("Session expired. Please login");
        $scope.logout();
     });

     $scope.$on(AUTH_EVENTS.notFound, function (event, args) {
        console.log("Received not Found Broadcast");
        $scope.setError("Requested Url ("+args.config.url+") not found on server");
     });


    $scope.$on(AUTH_EVENTS.customError, function (event, args) {
        console.log("Received Custom Error");    
    /*    if (args.data.errors) {
           var keys = Object.keys(args.data.errors);
           keys.forEach(function(element, index, array){
                $scope.validationErrors.push(args.data.errors[element].message);
           });
        } */
        $scope.validationErrors.push(args.data.message);
     });

    $scope.$on(AUTH_EVENTS.notAuthorized, function (event, args) {
        console.log("Received Not Authorized Broadcast");
        $location.path("/forbidden");
     });

    $scope.setPageDef = function(pageDef) {
        $scope.pageDef = pageDef;
    }
}]);  

/**
 * Login Controller.
 * 
 * @param  {[type]} $scope         [description]
 * @param  {[type]} $location      [description]
 * @param  {[type]} $rootScope     [description]
 * @param  {[type]} AUTH_EVENTS    [description]
 * @param  {Object} AuthService){                                                             $scope.credentials [description]
 * @param  {[type]} function       (responseError) {            $scope.errorMsg [description]
 * @return {[type]}                [description]
 */
passwordManagementApp.controller('LoginCtrl',['$scope', '$location', '$rootScope', 'AUTH_EVENTS', 
    'AuthService',function ($scope, $location, $rootScope, AUTH_EVENTS, AuthService){            
    $scope.credentials = {
        userName : "kvaughan",
        password : "Password1",
        siteId : "bsu.com"
    /*    userName : "quicklaunchadmin@quicklaunchsso.com",
        password : "quicklaunchadmin",
        siteId : ""*/
    }
    // User is already logged in direct to home page.
    if (AuthService.isAuthenticated()) {        
        $location.path("/home");
    }
    $scope.login = function() { 
        AuthService.login($scope.credentials).then(function (response) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $location.path("/home"); 
        }, function (responseError) {
            $scope.errorMsg = responseError.data.errorMsg;
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    }
}]);


passwordManagementApp.controller('HomeCtrl',['$scope', '$location', 'AuthService', '$state',function ($scope, $location, AuthService, $state){    
   if (!AuthService.isAuthenticated()) {
        $location.path("/login");
   } else if ($scope.isAdmin()){
       // By Default to to user profile page.
        $state.go("home.adminProfilequestionSetup");     
   } else {
       // $state.go("home.userProfile");  
       $state.go("home.userResetPassword");  
   }
 
}]);