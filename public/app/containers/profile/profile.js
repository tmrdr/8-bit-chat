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
    topColor: 'chocolate',
    torsoColor: 'red',
    legsColor: 'blue'
  }

  UserService.getColors().then(function success(res) {
    profileComp.userSettings = res.data;
  },function error(res) {
    console.log(res);
  });

  profileComp.changeAvatar = function() {
    var params = {
      hairColor: profileComp.userSettings.hairColor || 'black',
      topColor: profileComp.userSettings.topColor || 'chocolate',
      torsoColor: profileComp.userSettings.torsoColor || 'red',
      legsColor: profileComp.userSettings.legsColor || 'blue'
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
