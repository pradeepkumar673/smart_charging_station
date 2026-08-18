const Booking = require("../models/Booking");
const Station = require("../models/Station");
const Slot = require("../models/Slot");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { sendResponse } = require("../utils/apiResponse");

/**
 * POST /api/v1/bookings
 * Driver: Create a new slot booking with time range overlap prevention
 */
exports.createBooking = catchAsync(async (req, res, next) => {
  const { stationId, slotId, startTime, durationMinutes, estimatedEnergyKWh } = req.body;

  const station = await Station.findById(stationId);
  if (!station) {
    return next(new AppError("Station not found", 404));
  }

  if (!station.isOperational) {
    return next(new AppError("Station is currently non-operational", 400));
  }

  const slot = await Slot.findById(slotId);
  if (!slot) {
    return next(new AppError("Slot not found", 404));
  }

  if (slot.station.toString() !== stationId) {
    return next(new AppError("Slot does not belong to the specified station", 400));
  }

  if (slot.status === "maintenance" || slot.status === "offline") {
    return next(new AppError(`Slot is currently in ${slot.status} state and cannot be booked`, 400));
  }

  const start = new Date(startTime);
  if (isNaN(start.getTime()) || start < new Date(Date.now() - 5 * 60 * 1000)) {
    return next(new AppError("Start time must be a valid future date", 400));
  }

  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  // Time overlap check for confirmed or ongoing bookings on the same slot
  const overlappingBooking = await Booking.findOne({
    slot: slotId,
    status: { $in: ["confirmed", "ongoing"] },
    startTime: { $lt: end },
    endTime: { $gt: start },
  });

  if (overlappingBooking) {
    return next(new AppError("Slot is already booked for the selected time window", 409));
  }

  const estimatedCost = Math.round(Number(estimatedEnergyKWh) * station.basePricePerKWh * 100) / 100;

  const booking = await Booking.create({
    user: req.user._id,
    station: stationId,
    slot: slotId,
    startTime: start,
    endTime: end,
    durationMinutes,
    status: "confirmed",
    estimatedEnergyKWh,
    estimatedCost,
  });

  // Reserve slot if available
  slot.status = "reserved";
  slot.currentBooking = booking._id;
  await slot.save();

  // Socket.io real-time telemetry emissions
  req.app.get("io")?.emit("booking:created", {
    bookingId: booking._id,
    stationId,
    slotId,
    startTime: booking.startTime,
  });
  req.app.get("io")?.emit("slot:status_changed", {
    slotId: slot._id,
    stationId,
    status: "reserved",
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate("station", "name address city location basePricePerKWh")
    .populate("slot", "slotId chargerType connectorType maxPowerKw status");

  sendResponse(res, {
    statusCode: 201,
    message: "Slot booked successfully",
    data: { booking: populatedBooking },
  });
});

/**
 * GET /api/v1/bookings/my
 * Driver: Fetch my bookings list with status filtering & pagination
 */
exports.getMyBookings = catchAsync(async (req, res, next) => {
  const { status, page = 1, limit = 15 } = req.query;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 15;
  const skip = (pageNum - 1) * limitNum;

  const filter = { user: req.user._id };

  if (status) {
    if (status === "upcoming") {
      filter.status = "confirmed";
    } else {
      filter.status = status;
    }
  }

  const total = await Booking.countDocuments(filter);
  const bookings = await Booking.find(filter)
    .sort({ startTime: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate("station", "name address city location basePricePerKWh operatingHours")
    .populate("slot", "slotId chargerType connectorType maxPowerKw status")
    .lean();

  sendResponse(res, {
    message: "My bookings retrieved successfully",
    data: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      count: bookings.length,
      bookings,
    },
  });
});

/**
 * PATCH /api/v1/bookings/:id/cancel
 * Driver: Cancel a confirmed booking before check-in and release slot
 */
exports.cancelBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to cancel this booking", 403));
  }

  if (booking.status !== "confirmed") {
    return next(new AppError(`Booking cannot be cancelled because it is in '${booking.status}' status`, 400));
  }

  booking.status = "cancelled";
  await booking.save();

  // Free the slot if currentBooking points to this booking
  const slot = await Slot.findById(booking.slot);
  if (slot && slot.currentBooking?.toString() === booking._id.toString()) {
    slot.status = "available";
    slot.currentBooking = null;
    await slot.save();

    req.app.get("io")?.emit("slot:status_changed", {
      slotId: slot._id,
      stationId: slot.station,
      status: "available",
    });
  }

  sendResponse(res, {
    message: "Booking cancelled successfully",
    data: { booking },
  });
});

/**
 * PATCH /api/v1/bookings/:id/reschedule
 * Driver: Reschedule a confirmed booking
 */
exports.rescheduleBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { newStartTime, newDurationMinutes } = req.body;

  const booking = await Booking.findById(id).populate("station");
  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to reschedule this booking", 403));
  }

  if (booking.status !== "confirmed") {
    return next(new AppError("Only confirmed bookings can be rescheduled", 400));
  }

  const start = new Date(newStartTime);
  if (isNaN(start.getTime()) || start < new Date(Date.now() - 5 * 60 * 1000)) {
    return next(new AppError("New start time must be a valid future date", 400));
  }

  const duration = newDurationMinutes || booking.durationMinutes;
  const end = new Date(start.getTime() + duration * 60 * 1000);

  // Time overlap check for same slot excluding current booking
  const overlap = await Booking.findOne({
    _id: { $ne: booking._id },
    slot: booking.slot,
    status: { $in: ["confirmed", "ongoing"] },
    startTime: { $lt: end },
    endTime: { $gt: start },
  });

  if (overlap) {
    return next(new AppError("The slot is not available for the requested rescheduled time window", 409));
  }

  booking.startTime = start;
  booking.endTime = end;
  booking.durationMinutes = duration;
  if (booking.estimatedEnergyKWh && booking.station?.basePricePerKWh) {
    booking.estimatedCost = Math.round(booking.estimatedEnergyKWh * booking.station.basePricePerKWh * 100) / 100;
  }

  await booking.save();

  sendResponse(res, {
    message: "Booking rescheduled successfully",
    data: { booking },
  });
});
