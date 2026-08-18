const { body, query } = require('express-validator');

// --- Create Station Validator ---
const createStationValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Station name is required')
    .isLength({ max: 150 })
    .withMessage('Station name cannot exceed 150 characters'),

  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),

  body('pincode')
    .trim()
    .notEmpty()
    .withMessage('Pincode is required')
    .matches(/^[0-9]{6}$/)
    .withMessage('Pincode must be a valid 6-digit number'),

  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of [longitude, latitude]'),

  body('location.coordinates.*')
    .isNumeric()
    .withMessage('Coordinates must be valid numbers'),

  body('totalSlots')
    .isInt({ min: 1 })
    .withMessage('Total slots must be at least 1'),

  body('chargerTypes')
    .isArray({ min: 1 })
    .withMessage('At least one charger type is required'),

  body('chargerTypes.*')
    .isIn(['AC', 'DC', 'Fast', 'Rapid'])
    .withMessage('Invalid charger type'),

  body('operatingHours.open')
    .notEmpty()
    .withMessage('Opening time is required (e.g. "06:00")'),

  body('operatingHours.close')
    .notEmpty()
    .withMessage('Closing time is required (e.g. "23:00")'),

  body('operatingHours.is24Hours')
    .optional()
    .isBoolean()
    .withMessage('is24Hours must be a boolean'),

  body('basePricePerKWh')
    .isFloat({ min: 0 })
    .withMessage('Base price per kWh must be a non-negative number'),

  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array of strings'),

  body('renewableMix.solarPct')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Solar percentage must be between 0 and 100'),

  body('renewableMix.windPct')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Wind percentage must be between 0 and 100'),

  body('renewableMix.gridPct')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Grid percentage must be between 0 and 100'),
];

// --- Update Station Validator ---
const updateStationValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Station name cannot exceed 150 characters'),

  body('address').optional().trim(),
  body('city').optional().trim(),
  body('state').optional().trim(),

  body('pincode')
    .optional()
    .trim()
    .matches(/^[0-9]{6}$/)
    .withMessage('Pincode must be a valid 6-digit number'),

  body('location.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of [longitude, latitude]'),

  body('basePricePerKWh')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Base price per kWh must be a non-negative number'),

  body('isOperational')
    .optional()
    .isBoolean()
    .withMessage('isOperational must be a boolean'),

  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array of strings'),
];

// --- Query Stations Validator ---
const queryStationsValidator = [
  query('lat').optional().isFloat().withMessage('Latitude must be a valid number'),
  query('lng').optional().isFloat().withMessage('Longitude must be a valid number'),
  query('radius').optional().isFloat({ min: 0.1 }).withMessage('Radius must be a positive number in km'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a non-negative number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a non-negative number'),
  query('minPower').optional().isFloat({ min: 0 }).withMessage('Min power must be a non-negative number'),
  query('availableNow').optional().isBoolean().withMessage('availableNow must be true or false'),
  query('renewableMin').optional().isFloat({ min: 0, max: 100 }).withMessage('renewableMin must be between 0 and 100'),
];

module.exports = {
  createStationValidator,
  updateStationValidator,
  queryStationsValidator,
};
