const express = require("express");
const stationController = require("../controllers/station.controller");
const slotController = require("../controllers/slot.controller");
const validateRequest = require("../middleware/validateRequest");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const {
  createStationValidator,
  updateStationValidator,
  queryStationsValidator,
} = require("../validators/station.validator");

const router = express.Router();

// --- Public / Driver Routes ---
router.get(
  "/",
  queryStationsValidator,
  validateRequest,
  stationController.getAllStations
);

// Protected owner route: GET /my must come before /:id parameter route
router.get(
  "/my",
  protect,
  restrictTo("owner"),
  stationController.getMyStations
);

router.get("/:id", stationController.getStationById);
router.get("/:id/twin", stationController.getStationTwin);
router.get("/:id/slots", slotController.getStationSlots);

// --- Owner Only Routes ---
router.post(
  "/",
  protect,
  restrictTo("owner"),
  createStationValidator,
  validateRequest,
  stationController.createStation
);

router.patch(
  "/:id",
  protect,
  restrictTo("owner"),
  updateStationValidator,
  validateRequest,
  stationController.updateStation
);

module.exports = router;
