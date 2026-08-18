const { body } = require('express-validator');

// --- End Session Validator ---
const endSessionValidator = [
  body('energyDeliveredKWh')
    .notEmpty()
    .withMessage('Energy delivered kWh is required')
    .isFloat({ min: 0.1 })
    .withMessage('Energy delivered kWh must be at least 0.1 kWh'),
];

module.exports = {
  endSessionValidator,
};
