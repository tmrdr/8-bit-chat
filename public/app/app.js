angular.module('ChatApp',['ui.router'])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');

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
