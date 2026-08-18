// middleware/notFound.js
const APIError = require("../utils/APIError");

function notFound(req, res, next) {
  next(APIError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = notFound;
