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
    $scope.questions = "Ranjith";
}]);