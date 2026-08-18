const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Runs after an express-validator schema array. If any validation
 * failed, forwards a single AppError(422) whose `errors` array is
 * picked up by the global error handler and returned in the
 * standard { success:false, message, errors } shape.
 */
const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  return next(new AppError('Validation failed', 422, errors));
};

module.exports = validateRequest;
