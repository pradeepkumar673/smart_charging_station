const Session = require("../models/Session");
const Booking = require("../models/Booking");
const Station = require("../models/Station");
const Slot = require("../models/Slot");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { sendResponse } = require("../utils/apiResponse");

/**
 * POST /api/v1/bookings/:id/checkin
 * Driver: Check in to start a charging session
 */
exports.checkIn = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to check in for this booking", 403));
  }

  if (booking.isCheckedIn || booking.status !== "confirmed") {
    return next(new AppError(`Cannot check in. Booking status is currently '${booking.status}'`, 400));
  }

  const station = await Station.findById(booking.station);
  if (!station) {
    return next(new AppError("Associated station not found", 404));
  }

  const now = new Date();

  // Create ongoing session document with start renewable mix snapshot
  const session = await Session.create({
    booking: booking._id,
    user: req.user._id,
    station: booking.station,
    slot: booking.slot,
    startTime: now,
    status: "ongoing",
    renewableMixAtStart: station.renewableMix || { solarPct: 0, windPct: 0, gridPct: 100 },
  });

  // Update Booking
  booking.isCheckedIn = true;
  booking.checkInTime = now;
  booking.status = "ongoing";
  await booking.save();

  // Update Slot to occupied
  const slot = await Slot.findById(booking.slot);
  if (slot) {
    slot.status = "occupied";
    slot.currentBooking = booking._id;
    await slot.save();
  }

  // Socket.io real-time telemetry emissions
  req.app.get("io")?.emit("session:started", {
    sessionId: session._id,
    bookingId: booking._id,
    stationId: booking.station,
    slotId: booking.slot,
  });
  req.app.get("io")?.emit("slot:status_changed", {
    slotId: booking.slot,
    stationId: booking.station,
    status: "occupied",
  });

  const populatedSession = await Session.findById(session._id)
    .populate("station", "name address location basePricePerKWh")
    .populate("slot", "slotId chargerType connectorType maxPowerKw")
    .populate("booking", "startTime endTime durationMinutes estimatedEnergyKWh estimatedCost");

  sendResponse(res, {
    statusCode: 201,
    message: "Checked in successfully. Session started",
    data: { session: populatedSession },
  });
});

/**
 * POST /api/v1/sessions/:id/end
 * Driver or Owner: Complete a charging session and release slot
 */
exports.endSession = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { energyDeliveredKWh } = req.body;

  const session = await Session.findById(id).populate("station slot booking");
  if (!session) {
    return next(new AppError("Session not found", 404));
  }

  if (session.status !== "ongoing") {
    return next(new AppError("Session is not currently active", 400));
  }

  // Authorization: Driver who owns session OR Owner who owns station
  const isDriverOwner = session.user.toString() === req.user._id.toString();
  const isStationOwner = session.station.owner.toString() === req.user._id.toString();

  if (!isDriverOwner && !isStationOwner) {
    return next(new AppError("You are not authorized to end this charging session", 403));
  }

  const now = new Date();
  const energyKWh = Number(energyDeliveredKWh);
  const cost = Math.round(energyKWh * session.station.basePricePerKWh * 100) / 100;

  // Update Session
  session.endTime = now;
  session.energyDeliveredKWh = energyKWh;
  session.cost = cost;
  session.status = "completed";
  session.renewableMixAtEnd = session.station.renewableMix || { solarPct: 0, windPct: 0, gridPct: 100 };
  await session.save();

  // Update Booking
  if (session.booking) {
    const booking = await Booking.findById(session.booking._id);
    if (booking) {
      booking.actualEnergyKWh = energyKWh;
      booking.actualCost = cost;
      booking.checkOutTime = now;
      booking.status = "completed";
      await booking.save();
    }
  }

  // Update Slot to available
  if (session.slot) {
    const slot = await Slot.findById(session.slot._id);
    if (slot) {
      slot.status = "available";
      slot.currentBooking = null;
      await slot.save();
    }
  }

  // Socket.io real-time telemetry emissions
  req.app.get("io")?.emit("session:ended", {
    sessionId: session._id,
    bookingId: session.booking?._id,
    stationId: session.station._id,
    slotId: session.slot?._id,
    energyDeliveredKWh: energyKWh,
    cost,
  });
  if (session.slot) {
    req.app.get("io")?.emit("slot:status_changed", {
      slotId: session.slot._id,
      stationId: session.station._id,
      status: "available",
    });
  }

  sendResponse(res, {
    message: "Charging session completed successfully",
    data: { session },
  });
});

/**
 * GET /api/v1/sessions/active
 * Driver: Retrieve current ongoing charging session
 */
exports.getActiveSession = catchAsync(async (req, res, next) => {
  const session = await Session.findOne({ user: req.user._id, status: "ongoing" })
    .populate("station", "name address location basePricePerKWh operatingHours renewableMix")
    .populate("slot", "slotId chargerType connectorType maxPowerKw status")
    .populate("booking", "startTime endTime durationMinutes estimatedEnergyKWh estimatedCost")
    .lean();

  if (!session) {
    return sendResponse(res, {
      message: "No active charging session found",
      data: { session: null },
    });
  }

  // Live session progress calculations
  const elapsedMins = Math.max(0, Math.round((Date.now() - new Date(session.startTime).getTime()) / 60000));
  const estimatedTotalMins = session.booking?.durationMinutes || 45;
  const progressPct = Math.min(99, Math.round((elapsedMins / estimatedTotalMins) * 100));

  sendResponse(res, {
    message: "Active charging session retrieved successfully",
    data: {
      session: {
        ...session,
        elapsedMins,
        estimatedTotalMins,
        progressPct,
      },
    },
  });
});

/**
 * GET /api/v1/sessions/:id
 * Driver: Fetch session summary with Green Impact telemetry
 */
exports.getSessionSummary = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const session = await Session.findById(id)
    .populate("station", "name address city location basePricePerKWh renewableMix")
    .populate("slot", "slotId chargerType connectorType maxPowerKw")
    .populate("booking", "startTime endTime durationMinutes estimatedEnergyKWh estimatedCost actualEnergyKWh actualCost")
    .populate("user", "name email vehicle")
    .lean();

  if (!session) {
    return next(new AppError("Session not found", 404));
  }

  if (session.user._id.toString() !== req.user._id.toString() && req.user.role !== "owner") {
    return next(new AppError("You are not authorized to view this session summary", 403));
  }

  // Green Impact Telemetry Formula:
  // Avg grid emissions intensity: 0.82 kg CO2 / kWh
  // CO2 Avoided (kg) = Energy (kWh) * 0.82 * (Renewable Share % / 100)
  const renewableSharePct =
    (session.renewableMixAtStart?.solarPct || 0) + (session.renewableMixAtStart?.windPct || 0);

  const co2SavedKg = Math.round(session.energyDeliveredKWh * 0.82 * (renewableSharePct / 100) * 10) / 10;
  const treesEquivalent = Math.round((co2SavedKg / 20) * 10) / 10; // ~20 kg CO2 / tree / year

  sendResponse(res, {
    message: "Session summary retrieved successfully",
    data: {
      session,
      greenImpact: {
        renewableSharePct,
        co2SavedKg,
        treesEquivalent,
        greenPointsEarned: Math.round(session.energyDeliveredKWh * 5),
      },
    },
  });
});
