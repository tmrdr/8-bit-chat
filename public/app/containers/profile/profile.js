angular.module('ChatApp')
.component('profileComp', {
  templateUrl: 'app/containers/profile/profile.html',
  controller: ProfileCompCtrl,
  controllerAs: 'profileComp'
});

function ProfileCompCtrl(Auth, UpdateUser) {
  var profileComp = this;
  console.log(Auth.currentUser().name);
  profileComp.username = Auth.currentUser().name;
  profileComp.userSettings = {
    hairColor: 'black',
    topColor: 'chocolate',
    torsoColor: 'red',
    legsColor: 'blue'
  }

  profileComp.changeAvatar = function() {
    var params = {
      hairColor: profileComp.userSettings.hairColor,
      topColor: profileComp.userSettings.topColor,
      torsoColor: profileComp.userSettings.torsoColor,
      legsColor: profileComp.userSettings.legsColor
    }
    console.log(params);
    console.log("user:", Auth.currentUser());
    var id = Auth.currentUser().id;
    UpdateUser.updateColors(id, params);
  }

}

ProfileCompCtrl.$inject = ['Auth', 'UpdateUser'];
