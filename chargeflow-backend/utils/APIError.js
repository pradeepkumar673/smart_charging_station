// utils/APIError.js

class APIError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errors = null) {
    return new APIError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized") {
    return new APIError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new APIError(403, message);
  }

  static notFound(message = "Resource not found") {
    return new APIError(404, message);
  }

  static conflict(message = "Conflict") {
    return new APIError(409, message);
  }

  static internal(message = "Internal server error") {
    return new APIError(500, message);
  }
}

module.exports = APIError;
