const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define model
const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String
});

// On Save Hook, encrypt password
// Before saving a model , run this function
userSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      // override plain text password with salted password
      user.password = hash;
      next();
    });

  });
});

// Create model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
