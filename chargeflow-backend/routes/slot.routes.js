const express = require("express");
const slotController = require("../controllers/slot.controller");
const validateRequest = require("../middleware/validateRequest");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const { updateSlotStatusValidator } = require("../validators/slot.validator");

const router = express.Router();

// --- Owner Only Slot Routes ---
router.patch(
  "/:id",
  protect,
  restrictTo("owner"),
  updateSlotStatusValidator,
  validateRequest,
  slotController.updateSlotStatus
);

module.exports = router;
