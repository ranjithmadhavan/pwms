// let's define the scotch controller that we call up in the about state
passwordManagementApp.controller('mainController',['$scope', '$location', '$window', 'AUTH_EVENTS', 'AuthService', 'APP_CONSTANTS','Session',
                function ($scope, $location, $window, AUTH_EVENTS, AuthService, APP_CONSTANTS, Session){
    $scope.user = function() {
       return Session.userId;
    }
    $scope.token = null;
    $scope.isLoggedIn = function() {
        // return !!$scope.user;
        return AuthService.isAuthenticated();
    }
    $scope.logout = function() {
        AuthService.logout();
        $location.path("/login");
 
    }



    $scope.$on(APP_CONSTANTS.showLoader, function (event, args) {
        // blockUI.start();
        $scope.loaderClass = "spinner-loader spinner-div";
     });

     $scope.$on(APP_CONSTANTS.hideLoader, function (event, args) {
        // Need to stop blockUI multiple times as there is a possibility of multiple starts
        /*for(var i=0;i<20;i++) {
            blockUI.stop();
        }*/
        $scope.loaderClass = ""
     });

    $scope.$on(AUTH_EVENTS.loginFailed, function (event, args) {
        console.log("Received Login Failed Broadcast");
     });
}]);  

passwordManagementApp.controller('loginController',['$scope', '$location', '$rootScope', 'AUTH_EVENTS', 
    'AuthService',function ($scope, $location, $rootScope, AUTH_EVENTS, AuthService){            
    $scope.credentials = {
        userName : "kwinters",
        password : "Password1",
        siteId : "bsu.com"
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


passwordManagementApp.controller('homeController',['$scope', '$location', 'AuthService',function ($scope, $location, AuthService){    
   if (!AuthService.isAuthenticated()) {
        $location.path("/login");
   }
}]);