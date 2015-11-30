var passwordManagementApp = angular.module('passwordManagementApp', ['ui.router','ngAnimate']);

passwordManagementApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');    
    $stateProvider        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            controller:'homeController',
            templateUrl: 'js/views/home.html'
        })     
        .state('login', {
            url: '/login',
            controller : 'loginController',
            templateUrl : 'js/views/login.html'
        })      
        .state('about', {
            // we'll get to this in a bit       
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
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
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