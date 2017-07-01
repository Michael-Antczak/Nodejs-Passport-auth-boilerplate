const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/users');

function tokenForUser(user) {
  const timestamp = new Date().getTime();

  return jwt.encode({
    sub: user.id,
    iat: timestamp,
    email: user.email
  }, config.secret);
}

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'ed
  // We just need to give them tokenForUser
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {

  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {
    return res.status(422).send({ error: 'No email or password provided.' });
  }

  // See if user already exists
  User.findOne({ email: email }, function(err, existingUser) {

    // Error
    if (err) { return next(err); }

    // If the user exists, return Error
    if (existingUser) {
      return res.status(422).send({ error: "Email is in use."})
    }

    // If the user does not exist,
    // create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }

      // Respond to request indicating the user was created
      res.json({
        success: "true",
        token: tokenForUser(user)
      });
    });

  });
}
