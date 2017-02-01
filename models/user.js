var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  hairColor: {
    type: String,
    required: true,
    default: "black"
  },
  topColor: {
    type: String,
    required: true,
    default: "chocolate"
  },
  torsoColor: {
    type: String,
    required: true,
    default: "red"
  },
  legsColor: {
    type: String,
    required: true,
    default: "blue"
  }
});

UserSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var returnJson = {
      id: ret._id,
      name: ret.name,
      hair: ret.hair,
      head: ret.head,
      torso: ret.torso,
      legs: ret.legs
    };
    return returnJson;
  }
});

UserSchema.methods.authenticated = function(password) {
  var user = this;
  var isAuthenticated = bcrypt.compareSync(password, user.password);
  return isAuthenticated ? user : false;
};

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    next();
  } else {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
  }
});

module.exports = mongoose.model('User', UserSchema);
