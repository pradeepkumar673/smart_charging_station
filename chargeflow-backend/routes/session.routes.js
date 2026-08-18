const express = require("express");
const sessionController = require("../controllers/session.controller");
const validateRequest = require("../middleware/validateRequest");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const { endSessionValidator } = require("../validators/session.validator");

const router = express.Router();

router.use(protect);

router.get("/active", restrictTo("driver"), sessionController.getActiveSession);

router.post(
  "/:id/end",
  endSessionValidator,
  validateRequest,
  sessionController.endSession
);

router.get("/:id", sessionController.getSessionSummary);

module.exports = router;
