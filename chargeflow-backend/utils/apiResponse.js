/**
 * Sends a consistently-shaped JSON response across the whole API.
 *
 * Success:
 *   { success: true, message, data }
 * Failure:
 *   { success: false, message, errors }
 */
const sendResponse = (res, { statusCode = 200, success = true, message = '', data = null, errors = undefined }) => {
  const body = { success, message };

  if (success) {
    body.data = data ?? {};
  } else {
    body.errors = errors ?? [];
  }

  return res.status(statusCode).json(body);
};

module.exports = { sendResponse };
