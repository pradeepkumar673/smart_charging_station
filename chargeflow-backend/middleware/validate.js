// middleware/validate.js
// Wraps express-validator's validationResult so route handlers stay clean.
const { validationResult } = require("express-validator");
const APIError = require("../utils/APIError");

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      APIError.badRequest(
        "Validation failed",
        errors.array().map((e) => ({ field: e.path, message: e.msg }))
      )
    );
  }
  next();
}

module.exports = validate;
