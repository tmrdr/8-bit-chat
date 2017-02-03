angular.module('ChatApp')
.component('signupComp', {
  templateUrl: 'app/containers/signup/signup.html',
  controller: SignupCompCtrl,
  controllerAs: 'signupComp'
});

function SignupCompCtrl($scope, $state, UserService, Alerts) {
  signupComp = this;
  signupComp.user = {
    name: '',
    password: ''
  };

  signupComp.userSignup = function() {
    var params = {
      name: signupComp.user.name,
      password: signupComp.user.password
    }

    UserService.createAccount(params).then(function(user) {
      if (user === false) {
        Alerts.add('danger', 'Error. See console');
        console.log('user create error');
      } else {
        // console.log('got user:', signupComp.user);
        Alerts.add('success', 'Successful! Login with new username/password.');
        $state.go('login');
      };
    });
  };
}

SignupCompCtrl.$inject = ['$scope', '$state', 'UserService', 'Alerts'];
