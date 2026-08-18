const mongoose = require("mongoose");
const Station = require("../models/Station");
const Slot = require("../models/Slot");
const Booking = require("../models/Booking");
const Session = require("../models/Session");
const Feedback = require("../models/Feedback");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { sendResponse } = require("../utils/apiResponse");

// Helper function to resolve owner's station IDs
async function getOwnerStationIds(ownerId, requestedStationId) {
  const query = { owner: ownerId };
  if (requestedStationId) {
    if (!mongoose.Types.ObjectId.isValid(requestedStationId)) {
      throw new AppError("Invalid Station ID format", 400);
    }
    query._id = requestedStationId;
  }

  const stations = await Station.find(query).select("_id").lean();
  return stations.map((s) => s._id);
}

/**
 * GET /api/v1/analytics/dashboard
 * Owner: High-level KPI metrics computed entirely via database aggregation pipelines
 */
exports.getDashboardAnalytics = catchAsync(async (req, res, next) => {
  const { stationId, from, to } = req.query;

  const stationIds = await getOwnerStationIds(req.user._id, stationId);
  if (stationIds.length === 0) {
    return sendResponse(res, {
      message: "No stations found for analytics calculation",
      data: {
        totalRevenue: 0,
        totalSessions: 0,
        averageUtilization: 0,
        averageRevenuePerSession: 0,
        totalEnergyDelivered: 0,
        averageDriverRating: 0,
        noShowRate: 0,
      },
    });
  }

  const dateFilter = {};
  if (from) dateFilter.$gte = new Date(from);
  if (to) dateFilter.$lte = new Date(to);

  const sessionMatch = {
    station: { $in: stationIds },
    status: "completed",
  };
  if (from || to) sessionMatch.createdAt = dateFilter;

  // 1. Session Aggregation (Revenue, Sessions Count, Energy)
  const sessionStats = await Session.aggregate([
    { $match: sessionMatch },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$cost" },
        totalEnergyDelivered: { $sum: "$energyDeliveredKWh" },
        totalSessions: { $sum: 1 },
      },
    },
  ]);

  const sStat = sessionStats[0] || { totalRevenue: 0, totalEnergyDelivered: 0, totalSessions: 0 };
  const totalRevenue = Math.round(sStat.totalRevenue * 100) / 100;
  const totalEnergyDelivered = Math.round(sStat.totalEnergyDelivered * 10) / 10;
  const totalSessions = sStat.totalSessions;
  const averageRevenuePerSession = totalSessions > 0 ? Math.round((totalRevenue / totalSessions) * 100) / 100 : 0;

  // 2. Booking Aggregation (No-Show Rate)
  const bookingMatch = { station: { $in: stationIds } };
  if (from || to) bookingMatch.createdAt = dateFilter;

  const bookingStats = await Booking.aggregate([
    { $match: bookingMatch },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        noShowCount: {
          $sum: {
            $cond: [
              { $or: [{ $eq: ["$status", "no-show"] }, { $eq: ["$isNoShow", true] }] },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const bStat = bookingStats[0] || { totalBookings: 0, noShowCount: 0 };
  const noShowRate = bStat.totalBookings > 0 ? Math.round((bStat.noShowCount / bStat.totalBookings) * 1000) / 10 : 0;

  // 3. Slot Utilization Aggregation
  const totalSlots = await Slot.countDocuments({ station: { $in: stationIds } });
  const activeSlots = await Slot.countDocuments({
    station: { $in: stationIds },
    status: { $in: ["occupied", "reserved"] },
  });
  const averageUtilization = totalSlots > 0 ? Math.round((activeSlots / totalSlots) * 100) : 0;

  // 4. Feedback Aggregation (Average Driver Rating)
  const feedbackMatch = { station: { $in: stationIds } };
  if (from || to) feedbackMatch.createdAt = dateFilter;

  const feedbackStats = await Feedback.aggregate([
    { $match: feedbackMatch },
    {
      $group: {
        _id: null,
        averageDriverRating: { $avg: "$ratings.overall" },
      },
    },
  ]);

  const averageDriverRating = feedbackStats[0]
    ? Math.round(feedbackStats[0].averageDriverRating * 10) / 10
    : 5.0;

  sendResponse(res, {
    message: "Owner dashboard analytics calculated successfully",
    data: {
      totalRevenue,
      totalSessions,
      averageUtilization,
      averageRevenuePerSession,
      totalEnergyDelivered,
      averageDriverRating,
      noShowRate,
    },
  });
});

/**
 * GET /api/v1/analytics/utilization
 * Owner: Slot utilization aggregation by hour of day
 */
exports.getUtilizationAnalytics = catchAsync(async (req, res, next) => {
  const { stationId } = req.query;

  const stationIds = await getOwnerStationIds(req.user._id, stationId);
  if (stationIds.length === 0) {
    return sendResponse(res, {
      message: "No stations found for utilization analytics",
      data: { utilizationByHour: [] },
    });
  }

  const utilizationByHour = await Session.aggregate([
    { $match: { station: { $in: stationIds } } },
    {
      $group: {
        _id: { $hour: "$startTime" },
        sessionsCount: { $sum: 1 },
        totalEnergy: { $sum: "$energyDeliveredKWh" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        hour: "$_id",
        sessionsCount: 1,
        totalEnergy: { $round: ["$totalEnergy", 1] },
      },
    },
  ]);

  sendResponse(res, {
    message: "Utilization analytics fetched successfully",
    data: { utilizationByHour },
  });
});

/**
 * GET /api/v1/analytics/revenue
 * Owner: Revenue time-series aggregation by day
 */
exports.getRevenueAnalytics = catchAsync(async (req, res, next) => {
  const { stationId } = req.query;

  const stationIds = await getOwnerStationIds(req.user._id, stationId);
  if (stationIds.length === 0) {
    return sendResponse(res, {
      message: "No stations found for revenue analytics",
      data: { revenueByDay: [] },
    });
  }

  const revenueByDay = await Session.aggregate([
    { $match: { station: { $in: stationIds }, status: "completed" } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$cost" },
        sessions: { $sum: 1 },
        energyKWh: { $sum: "$energyDeliveredKWh" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: "$_id",
        revenue: { $round: ["$revenue", 2] },
        sessions: 1,
        energyKWh: { $round: ["$energyKWh", 1] },
      },
    },
  ]);

  sendResponse(res, {
    message: "Revenue analytics fetched successfully",
    data: { revenueByDay },
  });
});

/**
 * GET /api/v1/analytics/feedback
 * Owner: Feedback category ratings aggregation breakdown
 */
exports.getFeedbackAnalytics = catchAsync(async (req, res, next) => {
  const { stationId } = req.query;

  const stationIds = await getOwnerStationIds(req.user._id, stationId);
  if (stationIds.length === 0) {
    return sendResponse(res, {
      message: "No stations found for feedback analytics",
      data: { categoryAverages: {} },
    });
  }

  const feedbackCategoryStats = await Feedback.aggregate([
    { $match: { station: { $in: stationIds } } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        cleanliness: { $avg: "$ratings.cleanliness" },
        easeOfAccess: { $avg: "$ratings.easeOfAccess" },
        cableCondition: { $avg: "$ratings.cableCondition" },
        lighting: { $avg: "$ratings.lighting" },
        overall: { $avg: "$ratings.overall" },
      },
    },
  ]);

  const stats = feedbackCategoryStats[0] || {
    totalReviews: 0,
    cleanliness: 5.0,
    easeOfAccess: 5.0,
    cableCondition: 5.0,
    lighting: 5.0,
    overall: 5.0,
  };

  sendResponse(res, {
    message: "Feedback category analytics fetched successfully",
    data: {
      totalReviews: stats.totalReviews,
      categoryAverages: {
        cleanliness: Math.round((stats.cleanliness || 5) * 10) / 10,
        easeOfAccess: Math.round((stats.easeOfAccess || 5) * 10) / 10,
        cableCondition: Math.round((stats.cableCondition || 5) * 10) / 10,
        lighting: Math.round((stats.lighting || 5) * 10) / 10,
        overall: Math.round((stats.overall || 5) * 10) / 10,
      },
    },
  });
});
