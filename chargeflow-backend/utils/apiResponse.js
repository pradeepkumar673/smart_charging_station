// utils/apiResponse.js
// Standardized success response helper so every controller returns
// the same shape: { success, message, data }

function sendResponse(res, statusCode, message, data = null) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

module.exports = { sendResponse };
