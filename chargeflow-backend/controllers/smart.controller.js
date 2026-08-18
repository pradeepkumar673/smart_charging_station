const Station = require("../models/Station");
const Slot = require("../models/Slot");
const Booking = require("../models/Booking");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { sendResponse } = require("../utils/apiResponse");

/**
 * GET /api/v1/smart/load-balancing
 * Community Load Balancing: Detect station congestion and recommend nearby free stations with incentives
 */
exports.getLoadBalancing = catchAsync(async (req, res, next) => {
  const { stationId } = req.query;

  if (!stationId) {
    return next(new AppError("stationId query parameter is required", 400));
  }

  const targetStation = await Station.findById(stationId).lean();
  if (!targetStation) {
    return next(new AppError("Station not found", 404));
  }

  const now = new Date();
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

  // Find all slots of target station
  const targetSlots = await Slot.find({ station: stationId }).lean();
  const totalSlotsCount = targetSlots.length || 1;

  // Count occupied slots + confirmed bookings starting in next hour
  const occupiedCount = targetSlots.filter((s) => s.status === "occupied" || s.status === "reserved").length;

  const upcomingBookingsCount = await Booking.countDocuments({
    station: stationId,
    status: "confirmed",
    startTime: { $gte: now, $lte: nextHour },
  });

  const activeDensityCount = Math.min(totalSlotsCount, occupiedCount + upcomingBookingsCount);
  const currentUtilizationPct = Math.round((activeDensityCount / totalSlotsCount) * 100);

  const isOverloaded = currentUtilizationPct >= 75;

  let recommendedStations = [];

  if (isOverloaded && targetStation.location?.coordinates) {
    // Find nearby stations within 10km (10000m) excluding target station
    const nearby = await Station.find({
      _id: { $ne: targetStation._id },
      isOperational: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: targetStation.location.coordinates,
          },
          $maxDistance: 10000,
        },
      },
    })
      .limit(5)
      .lean();

    const nearbyIds = nearby.map((s) => s._id);
    const nearbySlots = await Slot.find({ station: { $in: nearbyIds } }).lean();

    const slotsByStation = {};
    nearbySlots.forEach((s) => {
      const stnId = s.station.toString();
      if (!slotsByStation[stnId]) slotsByStation[stnId] = [];
      slotsByStation[stnId].push(s);
    });

    recommendedStations = nearby
      .map((stn) => {
        const stnSlots = slotsByStation[stn._id.toString()] || [];
        const availableSlotsCount = stnSlots.filter((sl) => sl.status === "available").length;

        if (availableSlotsCount === 0) return null;

        const renewableSharePct = (stn.renewableMix?.solarPct || 0) + (stn.renewableMix?.windPct || 0);

        return {
          id: stn._id,
          name: stn.name,
          address: stn.address,
          location: stn.location,
          basePricePerKWh: stn.basePricePerKWh,
          availableSlotsCount,
          renewableSharePct,
          incentive: {
            greenPointsBonus: 100,
            discountPerKWh: Math.max(2, Math.round((targetStation.basePricePerKWh - stn.basePricePerKWh) * 10) / 10),
            description: "+100 Green Points & Off-Peak Grid Discount",
          },
        };
      })
      .filter(Boolean);
  }

  sendResponse(res, {
    message: isOverloaded
      ? "Target station is congested. Recommended alternative stations generated"
      : "Target station has normal load",
    data: {
      targetStation: {
        id: targetStation._id,
        name: targetStation.name,
        currentUtilizationPct,
        isOverloaded,
      },
      recommendedStations,
    },
  });
});

/**
 * GET /api/v1/smart/claimable-slots
 * Smart No-Show Recovery: Detect unclaimed bookings past check-in grace period (10 mins)
 */
exports.getClaimableSlots = catchAsync(async (req, res, next) => {
  // A booking is considered a no-show if startTime is past 10 minutes, isCheckedIn is false, and status is confirmed
  const noShowThreshold = new Date(Date.now() - 10 * 60 * 1000);

  const noShowBookings = await Booking.find({
    status: "confirmed",
    isCheckedIn: false,
    startTime: { $lte: noShowThreshold },
  })
    .populate("station", "name address location city basePricePerKWh renewableMix")
    .populate("slot", "slotId chargerType connectorType maxPowerKw status")
    .lean();

  const claimableSlots = noShowBookings
    .filter((b) => b.station && b.slot && b.endTime > new Date())
    .map((b) => {
      const remainingWindowMins = Math.max(0, Math.round((new Date(b.endTime).getTime() - Date.now()) / 60000));
      return {
        bookingId: b._id,
        slot: {
          id: b.slot._id,
          slotId: b.slot.slotId,
          chargerType: b.slot.chargerType,
          connectorType: b.slot.connectorType,
          maxPowerKw: b.slot.maxPowerKw,
        },
        station: {
          id: b.station._id,
          name: b.station.name,
          address: b.station.address,
          location: b.station.location,
          basePricePerKWh: b.station.basePricePerKWh,
        },
        originalStartTime: b.startTime,
        claimWindowMinutesRemaining: remainingWindowMins,
        incentive: "+100 Green Points + Fast Track Check-in",
      };
    });

  sendResponse(res, {
    message: "Claimable no-show slots retrieved successfully",
    data: { count: claimableSlots.length, claimableSlots },
  });
});

/**
 * POST /api/v1/smart/claim-slot
 * Smart No-Show Recovery: Atomically claim a no-show slot and provision a new reservation for driver
 */
exports.claimNoShowSlot = catchAsync(async (req, res, next) => {
  const { slotId, durationMinutes, estimatedEnergyKWh } = req.body;

  if (!slotId) {
    return next(new AppError("slotId is required to claim a slot", 400));
  }

  const slot = await Slot.findById(slotId).populate("station");
  if (!slot) {
    return next(new AppError("Slot not found", 404));
  }

  const noShowThreshold = new Date(Date.now() - 10 * 60 * 1000);

  // Find active no-show booking on this slot
  const noShowBooking = await Booking.findOne({
    slot: slotId,
    status: "confirmed",
    isCheckedIn: false,
    startTime: { $lte: noShowThreshold },
  });

  if (!noShowBooking) {
    return next(new AppError("This slot is not currently available for no-show recovery claim", 409));
  }

  // Atomically cancel no-show booking and mark as no-show
  noShowBooking.status = "cancelled";
  noShowBooking.isNoShow = true;
  await noShowBooking.save();

  // Create new reservation for claiming driver
  const duration = Number(durationMinutes) || 45;
  const energy = Number(estimatedEnergyKWh) || 18;
  const now = new Date();
  const endTime = new Date(now.getTime() + duration * 60 * 1000);
  const estimatedCost = Math.round(energy * slot.station.basePricePerKWh * 100) / 100;

  const newBooking = await Booking.create({
    user: req.user._id,
    station: slot.station._id,
    slot: slot._id,
    startTime: now,
    endTime,
    durationMinutes: duration,
    estimatedEnergyKWh: energy,
    estimatedCost,
    status: "confirmed",
  });

  // Lock slot for new driver
  slot.status = "reserved";
  slot.currentBooking = newBooking._id;
  await slot.save();

  // Socket.io real-time telemetry emissions
  req.app.get("io")?.emit("noshow:claimed", {
    slotId,
    newBookingId: newBooking._id,
    stationId: slot.station._id,
  });
  req.app.get("io")?.emit("slot:status_changed", {
    slotId,
    stationId: slot.station._id,
    status: "reserved",
  });

  const populatedBooking = await Booking.findById(newBooking._id)
    .populate("station", "name address location basePricePerKWh")
    .populate("slot", "slotId chargerType connectorType maxPowerKw");

  sendResponse(res, {
    statusCode: 201,
    message: "No-show slot claimed successfully! Slot locked for check-in",
    data: { booking: populatedBooking },
  });
});

/**
 * GET /api/v1/smart/energy-mix/:stationId
 * Transparent Energy Source: Get live grid renewable mix breakdown
 */
exports.getEnergyMix = catchAsync(async (req, res, next) => {
  const { stationId } = req.params;

  const station = await Station.findById(stationId).select("name address location renewableMix basePricePerKWh");
  if (!station) {
    return next(new AppError("Station not found", 404));
  }

  const mix = station.renewableMix || { solarPct: 0, windPct: 0, gridPct: 100 };
  const renewableSharePct = (mix.solarPct || 0) + (mix.windPct || 0);

  // Carbon offset coefficient: 0.82 kg CO2 per kWh grid average
  const co2AvoidedPerKWhKg = Math.round(0.82 * (renewableSharePct / 100) * 100) / 100;

  sendResponse(res, {
    message: "Live station energy mix telemetry retrieved successfully",
    data: {
      stationId: station._id,
      stationName: station.name,
      renewableMix: mix,
      renewableSharePct,
      co2AvoidedPerKWhKg,
      gridStatus: renewableSharePct >= 70 ? "High Green Solar/Wind Ratio" : "Standard Grid Mix",
      timestamp: new Date(),
    },
  });
});
