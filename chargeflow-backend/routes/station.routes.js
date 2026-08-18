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

// --- Public / Driver Search Routes ---
router.get(
  "/",
  queryStationsValidator,
  validateRequest,
  stationController.getAllStations
);

// Protected routes (must come before /:id)
router.get("/my", protect, restrictTo("owner"), stationController.getMyStations);
router.get("/favorites", protect, restrictTo("driver"), stationController.getFavorites);

router.get("/:id", stationController.getStationById);
router.get("/:id/twin", stationController.getStationTwin);
router.get("/:id/slots", slotController.getStationSlots);

// --- Driver Favorites Routes ---
router.post("/:id/favorite", protect, restrictTo("driver"), stationController.addFavorite);
router.delete("/:id/favorite", protect, restrictTo("driver"), stationController.removeFavorite);

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

router.patch(
  "/:id/pricing",
  protect,
  restrictTo("owner"),
  stationController.updatePricing
);

module.exports = router;
