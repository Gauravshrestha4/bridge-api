const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");
//define the model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

//on save hook ,create password
userSchema.pre("save", function(next) {
  //get access to user model
  const user = this;

  //generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    //hash our password using salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);

      //overwrite plain password with encrypted password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

//create the modal class
const ModelClass = mongoose.model("user", userSchema);

//export the modal class
module.exports = ModelClass;
