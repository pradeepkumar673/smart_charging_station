const jwt = require('jsonwebtoken');

/**
 * Signs a JWT for a given user id + role.
 * JWT_SECRET and JWT_EXPIRES_IN must come from environment variables —
 * no fallback secret is used on purpose, so misconfiguration fails loudly.
 */
const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
