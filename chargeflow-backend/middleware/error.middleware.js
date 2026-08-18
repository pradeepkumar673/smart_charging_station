const AppError = require("../utils/AppError");

// Converts a Mongoose duplicate-key error (e.g. duplicate email) into an AppError
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || "field";
  const value = err.keyValue ? err.keyValue[field] : "";
  const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' is already registered`;
  return new AppError(message, 409);
};

// Converts a Mongoose validation error into an AppError with field-level errors array
const handleMongooseValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => ({
    field: el.path,
    message: el.message,
  }));
  return new AppError("Validation failed", 422, errors);
};

// Converts JWT errors
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again", 401);

const handleJWTExpiredError = () =>
  new AppError("Your session has expired. Please log in again", 401);

// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
  let error = err;

  if (error.code === 11000) error = handleDuplicateKeyError(error);
  if (error.name === "ValidationError") error = handleMongooseValidationError(error);
  if (error.name === "CastError") error = new AppError(`Invalid ${error.path}: ${error.value}`, 400);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : "Something went wrong on the server";

  const response = {
    success: false,
    message,
  };

  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  if (process.env.NODE_ENV === "development" && !error.isOperational) {
    console.error("UNEXPECTED ERROR:", err);
  }

  res.status(statusCode).json(response);
};

module.exports = globalErrorHandler;
