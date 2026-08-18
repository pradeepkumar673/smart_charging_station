const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../models/User');

/**
 * protect
 * Reads a JWT from the Authorization header ("Bearer <token>") or from
 * an httpOnly cookie named "token", verifies it, loads the user, and
 * attaches it to req.user. Rejects expired/invalid/missing tokens.
 */
const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to access this resource', 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Your session has expired. Please log in again', 401));
    }
    return next(new AppError('Invalid token. Please log in again', 401));
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists', 401));
  }

  if (!currentUser.isActive) {
    return next(new AppError('This account has been deactivated', 401));
  }

  req.user = currentUser;
  next();
});

/**
 * restrictTo(...roles)
 * Must run after `protect`. Only allows the request through if
 * req.user.role is one of the allowed roles.
 */
const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('You are not logged in. Please log in to access this resource', 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }

  next();
};

module.exports = { protect, restrictTo };
