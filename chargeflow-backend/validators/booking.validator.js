const { body, param } = require('express-validator');

// --- Create Booking Validator ---
const createBookingValidator = [
  body('stationId')
    .notEmpty()
    .withMessage('Station ID is required')
    .isMongoId()
    .withMessage('Invalid Station ID format'),

  body('slotId')
    .notEmpty()
    .withMessage('Slot ID is required')
    .isMongoId()
    .withMessage('Invalid Slot ID format'),

  body('startTime')
    .notEmpty()
    .withMessage('Start time is required')
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 date string'),

  body('durationMinutes')
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration minutes must be between 15 and 480 minutes (8 hours)'),

  body('estimatedEnergyKWh')
    .isFloat({ min: 0.5 })
    .withMessage('Estimated energy kWh must be at least 0.5 kWh'),
];

// --- Reschedule Booking Validator ---
const rescheduleBookingValidator = [
  body('newStartTime')
    .notEmpty()
    .withMessage('New start time is required')
    .isISO8601()
    .withMessage('New start time must be a valid ISO 8601 date string'),

  body('newDurationMinutes')
    .optional()
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration minutes must be between 15 and 480 minutes'),
];

module.exports = {
  createBookingValidator,
  rescheduleBookingValidator,
};
