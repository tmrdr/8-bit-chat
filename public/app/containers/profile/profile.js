angular.module('ChatApp')
.component('profileComp', {
  templateUrl: 'app/containers/profile/profile.html',
  controller: ProfileCompCtrl,
  controllerAs: 'profileComp'
});

function ProfileCompCtrl(Auth) {
  var profileComp = this;
  console.log(Auth.currentUser().name);
  profileComp.username = Auth.currentUser().name;
  profileComp.userSettings = {
    hairColor: 'black',
    topColor: 'chocolate',
    torsoColor: 'red',
    legsColor: 'blue'
  }
}

ProfileCompCtrl.$inject = ['Auth'];
