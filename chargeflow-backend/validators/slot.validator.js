const { body } = require('express-validator');

// --- Update Slot Status Validator ---
const updateSlotStatusValidator = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['available', 'occupied', 'reserved', 'maintenance', 'offline'])
    .withMessage('Status must be one of: available, occupied, reserved, maintenance, offline'),

  body('maintenanceInfo.issueType')
    .optional()
    .trim(),

  body('maintenanceInfo.description')
    .optional()
    .trim(),

  body('maintenanceInfo.technician')
    .optional()
    .trim(),
];

module.exports = {
  updateSlotStatusValidator,
};
