const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('../utils/appError');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = newUser.generateJWT();

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) check if the email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide a valid email and password', 400));
  }
  // 2) check if the user exists and password is correct
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email and password'), 401);
  }

  // 3) if everything is okay send  the token
  const token = user.generateJWT();
  res.status(201).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1)Get the token
  //   console.log(req.headers);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('your are not authorized to access', 401));
  }
  // 2) validate the token

  const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //   console.log(payload);
  const freshUser = await User.findById(payload.id);
  // 3) check if the user still exists and check user changed password after jwt issued
  if (!freshUser)
    return next(
      new AppError('The user belonging to token no longer exists', 401)
    );
  if (freshUser.changedPasswordAfter(payload.iat))
    return next(new AppError('The user has recently changed password', 401));
  // grant access to protected routes
  req.user = freshUser;
  next();
});
