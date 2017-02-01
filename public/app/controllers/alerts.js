angular.module('ChatApp')
.controller('AlertCtrl', ['$scope', 'Alerts', function($scope, Alerts) {
  $scope.Alerts = Alerts;
}]);
