angular.module('ChatApp')
.component('signupComp', {
  templateUrl: 'app/containers/signup/signup.html',
  controller: SignupCompCtrl,
  controllerAs: 'signupComp'
});

function SignupCompCtrl($scope, UserService) {
  // signupComp = this;
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userSignup = function() {
    console.log('click');
    var params = {
      name: $scope.user.name,
      password: $scope.user.password
    }
    UserService.createAccount(params).then(function(user) {
      if (user === false) {
        console.log('user create error');
      } else {
        console.log('got user:', user);
        $state.go('home');
      };
    });
  };
}

SignupCompCtrl.$inject = ['$scope', 'UserService'];
