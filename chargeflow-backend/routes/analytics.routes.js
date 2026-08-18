const express = require("express");
const analyticsController = require("../controllers/analytics.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect, restrictTo("owner"));

router.get("/dashboard", analyticsController.getDashboardAnalytics);
router.get("/utilization", analyticsController.getUtilizationAnalytics);
router.get("/revenue", analyticsController.getRevenueAnalytics);
router.get("/feedback", analyticsController.getFeedbackAnalytics);

module.exports = router;
