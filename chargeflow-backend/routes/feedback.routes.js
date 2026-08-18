const express = require("express");
const feedbackController = require("../controllers/feedback.controller");
const validateRequest = require("../middleware/validateRequest");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const { createFeedbackValidator } = require("../validators/feedback.validator");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  restrictTo("driver"),
  createFeedbackValidator,
  validateRequest,
  feedbackController.createFeedback
);

router.get("/my", restrictTo("driver"), feedbackController.getMyFeedback);

router.get(
  "/station/:stationId",
  restrictTo("owner"),
  feedbackController.getStationFeedback
);

module.exports = router;
