angular.module('ChatApp')
.controller('AlertCtrl', ['$scope', 'Alerts', function($scope, Alerts) {
  $scope.Alerts = Alerts;

  $scope.show = true;

  $scope.closeAlert = function(index) {
    $scope.show = false;
};
}]);
