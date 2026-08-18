const express = require("express");
const smartController = require("../controllers/smart.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.get("/load-balancing", restrictTo("driver"), smartController.getLoadBalancing);

router.get("/claimable-slots", restrictTo("driver"), smartController.getClaimableSlots);

router.post("/claim-slot", restrictTo("driver"), smartController.claimNoShowSlot);

router.get("/energy-mix/:stationId", smartController.getEnergyMix);

module.exports = router;
