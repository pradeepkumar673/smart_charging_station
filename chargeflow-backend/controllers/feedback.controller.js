const Feedback = require("../models/Feedback");
const Session = require("../models/Session");
const Station = require("../models/Station");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { sendResponse } = require("../utils/apiResponse");
const createNotification = require("../utils/createNotification");

/**
 * POST /api/v1/feedback
 * Driver: Create session feedback after completion
 */
exports.createFeedback = catchAsync(async (req, res, next) => {
  const { sessionId, ratings, comment } = req.body;

  const session = await Session.findById(sessionId).populate("station");
  if (!session) {
    return next(new AppError("Session not found", 404));
  }

  if (session.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to submit feedback for this session", 403));
  }

  if (session.status !== "completed") {
    return next(new AppError("Feedback can only be submitted for completed sessions", 400));
  }

  // Check unique index constraint
  const existingFeedback = await Feedback.findOne({ session: sessionId });
  if (existingFeedback) {
    return next(new AppError("Feedback has already been submitted for this session", 409));
  }

  const feedback = await Feedback.create({
    user: req.user._id,
    station: session.station._id,
    session: sessionId,
    ratings,
    comment,
  });

  // Notify station owner of new rating
  if (session.station?.owner) {
    await createNotification({
      user: session.station.owner,
      title: "New Driver Review Received",
      message: `Driver rated ${ratings.overall}★ for charging session at ${session.station.name}`,
      type: "station",
      relatedEntity: { type: "Feedback", id: feedback._id },
    });
  }

  sendResponse(res, {
    statusCode: 201,
    message: "Feedback submitted successfully. Thank you!",
    data: { feedback },
  });
});

/**
 * GET /api/v1/feedback/station/:stationId
 * Owner: View driver feedback for their station with pagination
 */
exports.getStationFeedback = catchAsync(async (req, res, next) => {
  const { stationId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const station = await Station.findById(stationId);
  if (!station) {
    return next(new AppError("Station not found", 404));
  }

  if (station.owner.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to view feedback for this station", 403));
  }

  const total = await Feedback.countDocuments({ station: stationId });
  const feedbackList = await Feedback.find({ station: stationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "name email vehicle")
    .populate("session", "startTime endTime energyDeliveredKWh cost")
    .lean();

  sendResponse(res, {
    message: "Station feedback retrieved successfully",
    data: {
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      feedback: feedbackList,
    },
  });
});

/**
 * GET /api/v1/feedback/my
 * Driver: View personal feedback history
 */
exports.getMyFeedback = catchAsync(async (req, res, next) => {
  const feedbackList = await Feedback.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("station", "name address city location")
    .populate("session", "startTime energyDeliveredKWh cost")
    .lean();

  sendResponse(res, {
    message: "Personal feedback history retrieved successfully",
    data: { count: feedbackList.length, feedback: feedbackList },
  });
});
