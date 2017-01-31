angular.module('ChatApp')
.component('signupComp', {
  templateUrl: 'app/containers/signup/signup.html',
  controller: SignupCompCtrl,
  controllerAs: 'signupComp'
});

function SignupCompCtrl($scope, $state, UserService) {
  signupComp = this;
  signupComp.user = {
    name: '',
    password: ''
  };
  console.log('signup.js here');
  signupComp.userSignup = function() {
    var params = {
      name: signupComp.user.name,
      password: signupComp.user.password
    }

    console.log('params', params);

    UserService.createAccount(params).then(function(user) {
      console.log('user service here');
      if (user === false) {
        console.log('user create error');
      } else {
        console.log('got user:', signupComp.user);
        $state.go('home');
      };
    });
  };
}

SignupCompCtrl.$inject = ['$scope', '$state', 'UserService'];
