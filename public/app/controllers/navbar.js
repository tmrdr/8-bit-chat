angular.module('ChatApp')
.controller('NavCtrl', ['$scope', 'Auth', '$state', function($scope, Auth, $state) {
  $scope.Auth = Auth;
  $scope.logout = function() {
    Auth.removeToken();
    // Alerts.add('success', 'Logged out!');
    $state.reload();
  }
}])
