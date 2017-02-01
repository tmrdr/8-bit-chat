
angular.module('ChatApp',['ui.router', 'ngResource'])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

  $urlRouterProvider.otherwise('/');

  // Between routes to check auth
  $httpProvider.interceptors.push('AuthInterceptor');

  //Setup states (aka routes)
  $stateProvider
  .state('home', {
    url: '/',
    component: 'homeComp'
  })
  .state('login', {
    url: '/login',
    component: 'loginComp'
  })
  .state('signup', {
    url: '/signup',
    component: 'signupComp'
  })
  .state('profile', {
    url: '/profile',
    component: 'profileComp'
  })

  // // Removes # symbol for our routes
  $locationProvider.html5Mode(true);

  }
]);
