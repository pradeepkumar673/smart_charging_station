const { body } = require("express-validator");

// --- Create Feedback Validator ---
const createFeedbackValidator = [
  body("sessionId")
    .notEmpty()
    .withMessage("Session ID is required")
    .isMongoId()
    .withMessage("Invalid Session ID format"),

  body("ratings.cleanliness")
    .isInt({ min: 1, max: 5 })
    .withMessage("Cleanliness rating must be an integer between 1 and 5"),

  body("ratings.easeOfAccess")
    .isInt({ min: 1, max: 5 })
    .withMessage("Ease of Access rating must be an integer between 1 and 5"),

  body("ratings.cableCondition")
    .isInt({ min: 1, max: 5 })
    .withMessage("Cable Condition rating must be an integer between 1 and 5"),

  body("ratings.lighting")
    .isInt({ min: 1, max: 5 })
    .withMessage("Lighting rating must be an integer between 1 and 5"),

  body("ratings.overall")
    .isInt({ min: 1, max: 5 })
    .withMessage("Overall rating must be an integer between 1 and 5"),

  body("comment")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Comment cannot exceed 1000 characters"),
];

module.exports = {
  createFeedbackValidator,
};
