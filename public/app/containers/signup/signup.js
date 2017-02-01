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
  
  signupComp.userSignup = function() {
    var params = {
      name: signupComp.user.name,
      password: signupComp.user.password
    }

    UserService.createAccount(params).then(function(user) {
      if (user === false) {
        console.log('user create error');
      } else {
        // console.log('got user:', signupComp.user);
        $state.go('home');
      };
    });
  };
}

SignupCompCtrl.$inject = ['$scope', '$state', 'UserService'];
