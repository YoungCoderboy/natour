const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tells use your name ']
  },
  email: {
    type: String,
    required: [true, 'please tell use your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Enter the Valid Email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'please provide your password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please provide your confirm password'],
    validate: {
      validator: function(ele) {
        // this only works in the case of save and on create
        return ele === this.password;
      },
      message: 'Passwords are not same'
    },
    select: false
  },
  passwordChangeAt: Date
});

userSchema.pre('save', async function(next) {
  // only run this function if the password is modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 13);
  //   delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Instance methods
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.generateJWT = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

userSchema.methods.changedPasswordAfter = function(jwtTimeStamp) {
  if (this.passwordChangeAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );

    return jwtTimeStamp < changedTimeStamp;
  }
  return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
