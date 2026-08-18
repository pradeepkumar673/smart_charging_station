const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { sendResponse } = require("../utils/apiResponse");

/**
 * GET /api/v1/users/profile
 * Driver/Owner: Get authenticated user profile with populated favorites
 */
exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate("favorites", "name address city location basePricePerKWh operatingHours renewableMix")
    .lean();

  if (!user) {
    return next(new AppError("User profile not found", 404));
  }

  // Strip sensitive fields
  delete user.password;
  delete user.otp;
  delete user.otpExpiresAt;
  delete user.otpVerifiedAt;
  delete user.resetPasswordToken;

  sendResponse(res, {
    message: "Profile fetched successfully",
    data: { user },
  });
});

/**
 * PATCH /api/v1/users/profile
 * Driver/Owner: Update user profile and vehicle details
 */
exports.updateProfile = catchAsync(async (req, res, next) => {
  const { name, phone, vehicle, company } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;

  if (user.role === "driver" && vehicle) {
    user.vehicle = {
      ...user.vehicle?.toObject(),
      ...vehicle,
    };
  }

  if (user.role === "owner" && company) {
    user.company = {
      ...user.company?.toObject(),
      ...company,
    };
  }

  await user.save();

  sendResponse(res, {
    message: "Profile updated successfully",
    data: { user: user.toSafeObject() },
  });
});
