const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendResponse } = require('../utils/apiResponse');
const generateToken = require('../utils/generateToken');
const { generateOTP, hashOTP } = require('../utils/generateOTP');

const OTP_EXPIRES_IN_MINUTES = Number(process.env.OTP_EXPIRES_IN_MINUTES) || 10;
const OTP_VERIFIED_WINDOW_MINUTES = Number(process.env.OTP_VERIFIED_WINDOW_MINUTES) || 15;

// Builds the { user, token } payload returned by register/login
const buildAuthPayload = (user) => {
  const token = generateToken(user._id, user.role);
  return { user: user.toSafeObject(), token };
};

/**
 * POST /api/v1/auth/register/driver
 */
exports.registerDriver = catchAsync(async (req, res, next) => {
  const { name, email, password, phone, vehicle } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 409));
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    vehicle,
    role: 'driver',
  });

  const { user: safeUser, token } = buildAuthPayload(user);

  sendResponse(res, {
    statusCode: 201,
    message: 'Driver registered successfully',
    data: { user: safeUser, token },
  });
});

/**
 * POST /api/v1/auth/register/owner
 */
exports.registerOwner = catchAsync(async (req, res, next) => {
  const { name, email, password, phone, company } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 409));
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    company,
    role: 'owner',
  });

  const { user: safeUser, token } = buildAuthPayload(user);

  sendResponse(res, {
    statusCode: 201,
    message: 'Station owner registered successfully',
    data: { user: safeUser, token },
  });
});

/**
 * POST /api/v1/auth/login
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  if (!user.isActive) {
    return next(new AppError('This account has been deactivated', 401));
  }

  const { user: safeUser, token } = buildAuthPayload(user);

  sendResponse(res, {
    message: 'Logged in successfully',
    data: { user: safeUser, token },
  });
});

/**
 * POST /api/v1/auth/forgot-password
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // Respond identically whether or not the email exists, to avoid
  // leaking which emails are registered.
  if (user) {
    const { otp, hashedOTP } = generateOTP();

    user.otp = hashedOTP;
    user.otpExpiresAt = Date.now() + OTP_EXPIRES_IN_MINUTES * 60 * 1000;
    user.otpVerifiedAt = undefined;
    await user.save({ validateBeforeSave: false });

    // TODO: integrate a real email/SMS provider (e.g. SendGrid, Twilio).
    // Stubbed for now — logging so the OTP is visible during development/testing.
    console.log(`[OTP STUB] OTP for ${email}: ${otp} (expires in ${OTP_EXPIRES_IN_MINUTES} min)`);
  }

  sendResponse(res, {
    message: 'If an account with that email exists, an OTP has been sent',
  });
});

/**
 * POST /api/v1/auth/verify-otp
 */
exports.verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email }).select('+otp +otpExpiresAt');
  if (!user || !user.otp || !user.otpExpiresAt) {
    return next(new AppError('Invalid or expired OTP', 400));
  }

  if (user.otpExpiresAt < Date.now()) {
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('OTP has expired. Please request a new one', 400));
  }

  if (hashOTP(otp) !== user.otp) {
    return next(new AppError('Invalid or expired OTP', 400));
  }

  // OTP is valid: clear it and mark the account as OTP-verified for a
  // short window so /reset-password can be called next.
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  user.otpVerifiedAt = new Date();
  await user.save({ validateBeforeSave: false });

  sendResponse(res, {
    message: 'OTP verified successfully. You can now reset your password',
  });
});

/**
 * POST /api/v1/auth/reset-password
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email }).select('+otpVerifiedAt');
  if (!user) {
    return next(new AppError('Invalid request', 400));
  }

  const verifiedWithinWindow =
    user.otpVerifiedAt &&
    Date.now() - new Date(user.otpVerifiedAt).getTime() < OTP_VERIFIED_WINDOW_MINUTES * 60 * 1000;

  if (!verifiedWithinWindow) {
    return next(new AppError('OTP verification required before resetting the password', 403));
  }

  user.password = newPassword; // hashed by the pre-save hook on User model
  user.otpVerifiedAt = undefined;
  await user.save();

  sendResponse(res, {
    message: 'Password reset successfully. Please log in with your new password',
  });
});

/**
 * GET /api/v1/auth/me
 */
exports.getMe = catchAsync(async (req, res) => {
  sendResponse(res, {
    message: 'Current user fetched successfully',
    data: { user: req.user.toSafeObject() },
  });
});
