angular.module('ChatApp')
.component('profileComp', {
  templateUrl: 'app/containers/profile/profile.html',
  controller: ProfileCompCtrl,
  controllerAs: 'profileComp'
});

function ProfileCompCtrl($state, Auth, UserService, Alerts) {
  var profileComp = this;
  var deleteConfirm = false;

  profileComp.username = Auth.currentUser().name;
  profileComp.userSettings = {
    hairColor: 'black',
    topColor: '#d2691e',
    torsoColor: '#ff0000',
    legsColor: '#0000ff'
  }

  UserService.getColors().then(function success(res) {
    profileComp.userSettings = res.data;
  },function error(res) {
    console.log(res);
  });

  profileComp.changeAvatar = function() {
    var params = {
      hairColor: profileComp.userSettings.hairColor || 'black',
      topColor: profileComp.userSettings.topColor || '#d2691e',
      torsoColor: profileComp.userSettings.torsoColor || '#ff0000',
      legsColor: profileComp.userSettings.legsColor || '#0000ff'
    }

    var id = Auth.currentUser().id;
    UserService.updateColors(id, params);
  }

  profileComp.deleteAccount = function() {
    profileComp.deleteConfirm = true;
  }

  profileComp.confirmNo = function() {
    profileComp.deleteConfirm = false;
  }

  profileComp.confirmYes = function() {
    UserService.deleteUser().then(function success(res) {
      Auth.removeToken();
      window.location = "/"
    },function error(res) {
      console.log(res);
    });
    Alerts.add('success', 'User Deleted!');

    console.log('user deleted');
  };

}

ProfileCompCtrl.$inject = ['$state', 'Auth', 'UserService', 'Alerts'];
