angular.module('ChatApp')
.component('profileComp', {
  templateUrl: 'app/containers/profile/profile.html',
  controller: ProfileCompCtrl,
  controllerAs: 'profileComp'
});

function ProfileCompCtrl(Auth, UpdateUser, GetDetails) {
  var profileComp = this;
  //console.log(Auth.currentUser().name);
  profileComp.username = Auth.currentUser().name;
  profileComp.userSettings = {
    hairColor: 'black',
    topColor: 'chocolate',
    torsoColor: 'red',
    legsColor: 'blue'
  }

  GetDetails.getColors().then(function success(res) {
    profileComp.userSettings = res.data;
  },function error(res) {
    console.log(res);
  });

  //console.log(profileComp.userSettings);

  profileComp.changeAvatar = function() {
    var params = {
      hairColor: profileComp.userSettings.hairColor || 'black',
      topColor: profileComp.userSettings.topColor || 'chocolate',
      torsoColor: profileComp.userSettings.torsoColor || 'red',
      legsColor: profileComp.userSettings.legsColor || 'blue'
    }
    console.log(params);
    console.log("user:", Auth.currentUser());
    var id = Auth.currentUser().id;
    UpdateUser.updateColors(id, params);
  }

}

ProfileCompCtrl.$inject = ['Auth', 'UpdateUser', 'GetDetails'];
