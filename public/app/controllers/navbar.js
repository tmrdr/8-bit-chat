angular.module('ChatApp')
.controller('NavCtrl', ['$scope', 'Auth', '$state', 'Alerts', 'UserService', function($scope, Auth, $state, Alerts, UserService) {
  $scope.Auth = Auth;

  UserService.getColors().then(function success(res) {
    $scope.userSettings = res.data;
  },function error(res) {
    console.log(res);
  });

  $scope.logout = function() {
    Auth.removeToken();
    Alerts.add('success', 'Logged out!');
    $state.go('home');
  }
}])
