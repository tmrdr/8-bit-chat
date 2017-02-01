angular.module('ChatApp')
.component('profileComp', {
  templateUrl: 'app/containers/profile/profile.html',
  controller: ProfileCompCtrl,
  controllerAs: 'ProfileComp'
});

function ProfileCompCtrl() {
  var profileComp = this;
  profileComp.customSettings = {
    control: 'brightness',
    theme: 'bootstrap',
    position: 'bottom right'
  };
  console.log($("#shirtColor").val())

}

ProfileCompCtrl.$inject = [];
