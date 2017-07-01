const passport = require('passport');
const User = require('../models/users');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localLogin = new LocalStrategy({
    usernameField: 'email'
  }, function(email, password, done) {

  // Verify email and password,
  // call done with the user if it is the correct
  // email and password
  // otherwise call done with false
   User.findOne({ email: email }, function(err, user) {
     if (err) { return done(err); }

     if (!user) { return done(null, false); }

     // Compare passwords - is "password" === user.password?
     user.comparePassword(password, function(err, isMatch) {
       if(err) { return done(err); }
       if(!isMatch) { return done(null, false); }

       return done(null, user);
     });

   });
});

// Set up options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // see if the user ID in payload exists in our DB
  // if yes, then call "done" with user
  // otherwise call "done" without user
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }

  });
});

// Tell Passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
