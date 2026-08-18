const Station = require("../models/Station");
const Slot = require("../models/Slot");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { sendResponse } = require("../utils/apiResponse");

/**
 * GET /api/v1/stations
 * Driver: List & filter stations with optional 2dsphere geo-nearby search
 */
exports.getAllStations = catchAsync(async (req, res, next) => {
  const {
    city,
    minPrice,
    maxPrice,
    chargerType,
    availableNow,
    renewableMin,
    lat,
    lng,
    radius,
  } = req.query;

  const filter = { isOperational: true };

  if (city) {
    filter.city = { $regex: new RegExp(city, "i") };
  }

  if (minPrice || maxPrice) {
    filter.basePricePerKWh = {};
    if (minPrice) filter.basePricePerKWh.$gte = Number(minPrice);
    if (maxPrice) filter.basePricePerKWh.$lte = Number(maxPrice);
  }

  if (chargerType) {
    filter.chargerTypes = chargerType;
  }

  if (renewableMin) {
    const minPct = Number(renewableMin);
    filter.$expr = {
      $gte: [
        {
          $add: [
            { $ifNull: ["$renewableMix.solarPct", 0] },
            { $ifNull: ["$renewableMix.windPct", 0] },
          ],
        },
        minPct,
      ],
    };
  }

  // Geo-nearby 2dsphere spatial filter if lat and lng provided
  if (lat && lng) {
    const maxDistanceMeters = (Number(radius) || 10) * 1000;
    filter.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [Number(lng), Number(lat)],
        },
        $maxDistance: maxDistanceMeters,
      },
    };
  }

  let stations = await Station.find(filter)
    .populate("owner", "name email phone company")
    .lean();

  // Attach slot metrics and availability filter
  const stationIds = stations.map((s) => s._id);
  const slots = await Slot.find({ station: { $in: stationIds } }).lean();

  const slotsByStation = {};
  slots.forEach((s) => {
    const stnId = s.station.toString();
    if (!slotsByStation[stnId]) slotsByStation[stnId] = [];
    slotsByStation[stnId].push(s);
  });

  stations = stations.map((s) => {
    const stnSlots = slotsByStation[s._id.toString()] || [];
    const availableCount = stnSlots.filter((sl) => sl.status === "available").length;
    const occupiedCount = stnSlots.filter((sl) => sl.status === "occupied").length;
    const reservedCount = stnSlots.filter((sl) => sl.status === "reserved").length;

    return {
      ...s,
      totalSlotsCount: stnSlots.length,
      availableSlotsCount: availableCount,
      occupiedSlotsCount: occupiedCount,
      reservedSlotsCount: reservedCount,
      renewableSharePct: (s.renewableMix?.solarPct || 0) + (s.renewableMix?.windPct || 0),
    };
  });

  if (availableNow === "true" || availableNow === true) {
    stations = stations.filter((s) => s.availableSlotsCount > 0);
  }

  sendResponse(res, {
    message: "Stations retrieved successfully",
    data: { count: stations.length, stations },
  });
});

/**
 * GET /api/v1/stations/:id
 * Driver: Single station details with populated slots & owner info
 */
exports.getStationById = catchAsync(async (req, res, next) => {
  const station = await Station.findById(req.params.id)
    .populate("owner", "name email phone company")
    .lean();

  if (!station) {
    return next(new AppError("Station not found", 404));
  }

  const slots = await Slot.find({ station: station._id })
    .populate({
      path: "currentBooking",
      select: "startTime endTime status isCheckedIn user",
      populate: { path: "user", select: "name email phone vehicle" },
    })
    .lean();

  const availableSlotsCount = slots.filter((s) => s.status === "available").length;

  sendResponse(res, {
    message: "Station details retrieved successfully",
    data: {
      station: {
        ...station,
        availableSlotsCount,
        renewableSharePct: (station.renewableMix?.solarPct || 0) + (station.renewableMix?.windPct || 0),
      },
      slots,
    },
  });
});

/**
 * GET /api/v1/stations/:id/twin
 * Driver/Owner: Real-time Digital Twin telemetry payload for visual station rendering
 */
exports.getStationTwin = catchAsync(async (req, res, next) => {
  const station = await Station.findById(req.params.id)
    .populate("owner", "name email phone company")
    .lean();

  if (!station) {
    return next(new AppError("Station not found", 404));
  }

  const slots = await Slot.find({ station: station._id })
    .populate({
      path: "currentBooking",
      select: "startTime endTime status isCheckedIn user durationMinutes",
      populate: { path: "user", select: "name vehicle" },
    })
    .lean();

  const statusCounts = {
    available: 0,
    occupied: 0,
    reserved: 0,
    maintenance: 0,
    offline: 0,
  };

  slots.forEach((s) => {
    if (statusCounts[s.status] !== undefined) {
      statusCounts[s.status]++;
    }
  });

  const renewableSharePct = (station.renewableMix?.solarPct || 0) + (station.renewableMix?.windPct || 0);

  sendResponse(res, {
    message: "Digital Twin telemetry fetched successfully",
    data: {
      station: {
        id: station._id,
        name: station.name,
        address: station.address,
        location: station.location,
        isOperational: station.isOperational,
        basePricePerKWh: station.basePricePerKWh,
        operatingHours: station.operatingHours,
        renewableMix: station.renewableMix,
        renewableSharePct,
      },
      summary: {
        totalSlots: slots.length,
        ...statusCounts,
        utilizationPct: slots.length > 0 ? Math.round((statusCounts.occupied / slots.length) * 100) : 0,
      },
      slots,
    },
  });
});

/**
 * POST /api/v1/stations
 * Owner: Create station and auto-generate default slots
 */
exports.createStation = catchAsync(async (req, res, next) => {
  const {
    name,
    address,
    city,
    state,
    pincode,
    location,
    totalSlots,
    chargerTypes,
    operatingHours,
    basePricePerKWh,
    amenities,
    renewableMix,
  } = req.body;

  const station = await Station.create({
    owner: req.user._id,
    name,
    address,
    city,
    state,
    pincode,
    location,
    totalSlots,
    chargerTypes,
    operatingHours,
    basePricePerKWh,
    amenities: amenities || [],
    renewableMix: renewableMix || { solarPct: 0, windPct: 0, gridPct: 100 },
  });

  // Auto-generate slot documents (A1, A2, A3, ...)
  const slotDocs = [];
  const primaryConnector = "CCS2";

  for (let i = 1; i <= totalSlots; i++) {
    const slotId = i <= 4 ? `A${i}` : `B${i - 4}`;
    const chargerType = chargerTypes[i % chargerTypes.length] || chargerTypes[0];
    const maxPowerKw = chargerType === "DC" || chargerType === "Rapid" ? 150 : 60;

    slotDocs.push({
      station: station._id,
      slotId,
      chargerType,
      connectorType: primaryConnector,
      maxPowerKw,
      status: "available",
    });
  }

  const createdSlots = await Slot.insertMany(slotDocs);

  sendResponse(res, {
    statusCode: 201,
    message: "Station and bays created successfully",
    data: { station, slots: createdSlots },
  });
});

/**
 * GET /api/v1/stations/my
 * Owner: Fetch all stations owned by authenticated user
 */
exports.getMyStations = catchAsync(async (req, res, next) => {
  const stations = await Station.find({ owner: req.user._id }).lean();

  const stationIds = stations.map((s) => s._id);
  const slots = await Slot.find({ station: { $in: stationIds } }).lean();

  const slotsByStation = {};
  slots.forEach((s) => {
    const stnId = s.station.toString();
    if (!slotsByStation[stnId]) slotsByStation[stnId] = [];
    slotsByStation[stnId].push(s);
  });

  const formattedStations = stations.map((s) => {
    const stnSlots = slotsByStation[s._id.toString()] || [];
    const availableCount = stnSlots.filter((sl) => sl.status === "available").length;
    const occupiedCount = stnSlots.filter((sl) => sl.status === "occupied").length;
    const reservedCount = stnSlots.filter((sl) => sl.status === "reserved").length;

    return {
      ...s,
      totalSlots: stnSlots.length,
      availableSlots: availableCount,
      occupiedSlots: occupiedCount,
      reservedSlots: reservedCount,
      utilizationPct: stnSlots.length > 0 ? Math.round((occupiedCount / stnSlots.length) * 100) : 0,
    };
  });

  sendResponse(res, {
    message: "My stations retrieved successfully",
    data: { stations: formattedStations },
  });
});

/**
 * PATCH /api/v1/stations/:id
 * Owner: Update station attributes with ownership check
 */
exports.updateStation = catchAsync(async (req, res, next) => {
  const station = await Station.findById(req.params.id);

  if (!station) {
    return next(new AppError("Station not found", 404));
  }

  if (station.owner.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to update this station", 403));
  }

  const allowedUpdates = [
    "name",
    "address",
    "city",
    "state",
    "pincode",
    "location",
    "basePricePerKWh",
    "isOperational",
    "amenities",
    "operatingHours",
    "renewableMix",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      station[field] = req.body[field];
    }
  });

  await station.save();

  sendResponse(res, {
    message: "Station updated successfully",
    data: { station },
  });
});
