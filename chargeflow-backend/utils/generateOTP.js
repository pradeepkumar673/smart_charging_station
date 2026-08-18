const crypto = require('crypto');

/**
 * Generates a 6-digit numeric OTP plus a SHA-256 hash of it.
 * Only the hash is persisted to the database — the plain OTP is sent to
 * the user (email/SMS) and never stored, so a DB leak can't expose it.
 */
const generateOTP = () => {
  const otp = crypto.randomInt(100000, 1000000).toString(); // 6 digits

  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

  return { otp, hashedOTP };
};

const hashOTP = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

module.exports = { generateOTP, hashOTP };
