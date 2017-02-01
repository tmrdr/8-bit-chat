angular.module('ChatApp')
.controller('NavCtrl', ['$scope', 'Auth', '$state', 'Alerts', function($scope, Auth, $state, Alerts) {
  $scope.Auth = Auth;
  $scope.logout = function() {
    Auth.removeToken();
    Alerts.add('success', 'Logged out!');
    $state.go('home');
  }
}])
