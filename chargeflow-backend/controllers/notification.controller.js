const Notification = require("../models/Notification");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { sendResponse } = require("../utils/apiResponse");

/**
 * GET /api/v1/notifications
 * Driver/Owner: Fetch user notifications feed with filtering & pagination
 */
exports.getNotifications = catchAsync(async (req, res, next) => {
  const { type, isRead } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 15;
  const skip = (page - 1) * limit;

  const filter = { user: req.user._id };

  if (type) {
    filter.type = type;
  }

  if (isRead !== undefined) {
    filter.isRead = isRead === "true" || isRead === true;
  }

  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  sendResponse(res, {
    message: "Notifications retrieved successfully",
    data: {
      total,
      unreadCount,
      page,
      pages: Math.ceil(total / limit) || 1,
      notifications,
    },
  });
});

/**
 * PATCH /api/v1/notifications/:id/read
 * Driver/Owner: Mark a single notification as read
 */
exports.markNotificationRead = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);
  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  if (notification.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to update this notification", 403));
  }

  notification.isRead = true;
  await notification.save();

  sendResponse(res, {
    message: "Notification marked as read",
    data: { notification },
  });
});

/**
 * PATCH /api/v1/notifications/read-all
 * Driver/Owner: Mark all user notifications as read
 */
exports.markAllNotificationsRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  sendResponse(res, {
    message: "All notifications marked as read",
    data: { success: true },
  });
});
