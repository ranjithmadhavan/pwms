var passwordManagementApp = angular.module('passwordManagementApp', ['ui.router','ngAnimate', 'ngResource']);

passwordManagementApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');    
    $stateProvider        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            controller:'HomeCtrl',
            templateUrl: 'js/views/home.html'
        })   
        .state('home.adminSettings', {
            url: '/adminSettings',
            controller:"AdminSettingsCtrl",
            templateUrl: 'js/views/partials/adminSettings.html'
        })     
        .state('home.adminProfilequestionSetup', {
            url: '/adminProfileQuestionSetup',
            controller : "AdminProfileQuestionsCtrl",
            templateUrl: 'js/views/partials/adminProfileQuestionSetup.html'
        })              
        .state('home.userProfile', {
            url: '/userProfile',
            controller: 'UserProfileCtrl',
            templateUrl: 'js/views/partials/userProfile.html'
        })    
        .state('home.userResetPassword', {
            url: '/userPasswordReset',
            controller: 'UserPasswordResetCtrl',
            templateUrl: 'js/views/partials/userPasswordReset.html'
        })    
        .state('login', {
            url: '/login',
            controller : 'LoginCtrl',
            templateUrl : 'js/views/login.html'
        })      
        .state('403', {
            url : "/forbidden",
            templateUrl : "js/views/partials/403.html"
        });
        
})
.config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
})
.constant('AUTH_EVENTS', {
  customError : 'errormessage-from-server',
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized',
  serverError : 'internal-server-error',
  notFound : 'url-not-found'
})

.constant('USER_ROLES', {
  all: '*',
  ROLE_SUPER: 'ROLE_SUPER',
  ROLE_ADMIN: 'ROLE_ADMIN',
  ROLE_EDITOR: 'ROLE_EDITOR',
  ROLE_USER: 'ROLE_USER',
  ROLE_GUEST: 'ROLE_GUEST'
})
.constant("APP_CONSTANTS",{
  showLoader :"LODADER_SHOW",
  hideLoader: "LOADER_HIDE"
})