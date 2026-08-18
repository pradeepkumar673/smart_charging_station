const { body } = require('express-validator');

// --- Shared field validators ---
const nameField = body('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required')
  .isLength({ min: 2, max: 60 })
  .withMessage('Name must be between 2 and 60 characters');

const emailField = body('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Please provide a valid email')
  .normalizeEmail();

const passwordField = body('password')
  .notEmpty()
  .withMessage('Password is required')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/\d/)
  .withMessage('Password must contain at least one number');

const phoneField = body('phone')
  .trim()
  .notEmpty()
  .withMessage('Phone number is required')
  .matches(/^[+]?[0-9]{10,15}$/)
  .withMessage('Please provide a valid phone number');

// --- Register: Driver ---
const registerDriverValidator = [
  nameField,
  emailField,
  passwordField,
  phoneField,
  body('vehicle.make').optional().trim().isLength({ max: 40 }),
  body('vehicle.model').optional().trim().isLength({ max: 40 }),
  body('vehicle.regNumber').optional().trim().isLength({ max: 20 }),
  body('vehicle.connectorType')
    .optional()
    .isIn(['CCS2', 'CHAdeMO', 'Type2', 'NACS', 'Other'])
    .withMessage('Invalid connector type'),
];

// --- Register: Owner ---
const registerOwnerValidator = [
  nameField,
  emailField,
  passwordField,
  phoneField,
  body('company.companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 100 }),
  body('company.gstNumber').optional().trim().isLength({ max: 20 }),
  body('company.businessAddress').optional().trim().isLength({ max: 200 }),
];

// --- Login ---
const loginValidator = [
  emailField,
  body('password').notEmpty().withMessage('Password is required'),
];

// --- Forgot Password ---
const forgotPasswordValidator = [emailField];

// --- Verify OTP ---
const verifyOtpValidator = [
  emailField,
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only digits'),
];

// --- Reset Password ---
const resetPasswordValidator = [
  emailField,
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
];

module.exports = {
  registerDriverValidator,
  registerOwnerValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyOtpValidator,
  resetPasswordValidator,
};
