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
  console.log('signupComp.user', signupComp.user);
  signupComp.userSignup = function() {
    console.log('click');
    var params = {
      name: signupComp.user.name,
      password: signupComp.user.password
    }
    console.log('name,password:', signupComp.user.name, signupComp.user.password)
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

SignupCompCtrl.$inject = ['$scope', '$state', 'UserService'];
