const express = require('express');
const authController = require('../controllers/auth.controller');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/auth.middleware');
const {
  registerDriverValidator,
  registerOwnerValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyOtpValidator,
  resetPasswordValidator,
} = require('../validators/auth.validator');

const router = express.Router();

router.post(
  '/register/driver',
  registerDriverValidator,
  validateRequest,
  authController.registerDriver
);

router.post(
  '/register/owner',
  registerOwnerValidator,
  validateRequest,
  authController.registerOwner
);

router.post('/login', loginValidator, validateRequest, authController.login);

router.post(
  '/forgot-password',
  forgotPasswordValidator,
  validateRequest,
  authController.forgotPassword
);

router.post('/verify-otp', verifyOtpValidator, validateRequest, authController.verifyOtp);

router.post(
  '/reset-password',
  resetPasswordValidator,
  validateRequest,
  authController.resetPassword
);

router.get('/me', protect, authController.getMe);

module.exports = router;
