const Slot = require("../models/Slot");
const Station = require("../models/Station");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { sendResponse } = require("../utils/apiResponse");

/**
 * GET /api/v1/stations/:id/slots
 * Driver/Owner: Get slots for a specific station
 */
exports.getStationSlots = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const station = await Station.findById(id);
  if (!station) {
    return next(new AppError("Station not found", 404));
  }

  const slots = await Slot.find({ station: id })
    .populate({
      path: "currentBooking",
      select: "startTime endTime status isCheckedIn user",
      populate: { path: "user", select: "name vehicle" },
    })
    .lean();

  sendResponse(res, {
    message: "Station slots retrieved successfully",
    data: { count: slots.length, slots },
  });
});

/**
 * PATCH /api/v1/slots/:id
 * Owner: Update slot status & maintenance info with station ownership check
 */
exports.updateSlotStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status, maintenanceInfo } = req.body;

  const slot = await Slot.findById(id).populate("station");
  if (!slot) {
    return next(new AppError("Slot not found", 404));
  }

  if (slot.station.owner.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to update slots for this station", 403));
  }

  slot.status = status;

  if (status === "maintenance" && maintenanceInfo) {
    slot.maintenanceInfo = {
      issueType: maintenanceInfo.issueType || "General Maintenance",
      description: maintenanceInfo.description || "",
      startedAt: new Date(),
      estimatedResolution: maintenanceInfo.estimatedResolution || undefined,
      technician: maintenanceInfo.technician || "",
    };
  } else if (status !== "maintenance") {
    slot.maintenanceInfo = undefined;
  }

  await slot.save();

  sendResponse(res, {
    message: "Slot status updated successfully",
    data: { slot },
  });
});
