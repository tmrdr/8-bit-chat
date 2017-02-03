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
    default: "#d2691e"
  },
  torsoColor: {
    type: String,
    required: true,
    default: "#ff0000"
  },
  legsColor: {
    type: String,
    required: true,
    default: "#0000ff"
  }
});

UserSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var returnJson = {
      id: ret._id,
      name: ret.name,
      hairColor: ret.hairColor,
      topColor: ret.topColor,
      torsoColor: ret.torsoColor,
      legsColor: ret.legsColor
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
