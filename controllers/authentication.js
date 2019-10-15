const User = require("../models/user");
const jwt = require("jwt-simple");
const config = require("../config");

function tokenForUser(user, secret) {
  console.log("called roken for use");
  const timestamp = new Date().getTime();
  console.log("time is", secret);
  console.log("toke is", jwt.encode({ sub: user.id, iat: timestamp }, secret));
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  //user has already has their email and passowrd verified
  //we just need to give them a token
  res.send({ token: tokenForUser(req.user, config.secret) });
};
exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  console.log("data", email, password);
  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide email and password." });
  }
  // see if a user with the given email exists

  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    //if a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: "Email is in use." });
    }
    //if a user with email does NOT exist, create and save user record
    const user = new User({
      email,
      password
    });

    user.save(function(err) {
      if (err) return next(err);
      //respond to request indicating user is created
      res.send({ token: tokenForUser(user, config.secret) });
    });
  });
};
