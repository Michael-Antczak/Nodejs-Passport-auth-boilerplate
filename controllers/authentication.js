const User = require('../models/users');

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
        success: "true"
      });
    });

  });
}
