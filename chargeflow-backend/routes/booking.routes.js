const express = require("express");
const bookingController = require("../controllers/booking.controller");
const sessionController = require("../controllers/session.controller");
const validateRequest = require("../middleware/validateRequest");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const {
  createBookingValidator,
  rescheduleBookingValidator,
} = require("../validators/booking.validator");

const router = express.Router();

// All booking routes require authenticated driver role
router.use(protect, restrictTo("driver"));

router.post(
  "/",
  createBookingValidator,
  validateRequest,
  bookingController.createBooking
);

router.get("/my", bookingController.getMyBookings);

router.patch("/:id/cancel", bookingController.cancelBooking);

router.patch(
  "/:id/reschedule",
  rescheduleBookingValidator,
  validateRequest,
  bookingController.rescheduleBooking
);

// Check-in route creates a Session off a confirmed booking
router.post("/:id/checkin", sessionController.checkIn);

module.exports = router;
