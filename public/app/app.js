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


  // // Removes # symbol for our routes
  $locationProvider.html5Mode(true);

  }
]);
