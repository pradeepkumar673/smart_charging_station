// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a user"],
    },
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: [true, "Booking must belong to a station"],
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: [true, "Booking must reference a slot"],
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
      validate: {
        validator: function validateEndAfterStart(value) {
          return value > this.startTime;
        },
        message: "End time must be after start time",
      },
    },
    durationMinutes: {
      type: Number,
      min: 1,
    },
    status: {
      type: String,
      enum: ["confirmed", "ongoing", "completed", "cancelled", "no-show"],
      default: "confirmed",
    },
    estimatedEnergyKWh: {
      type: Number,
      min: 0,
    },
    estimatedCost: {
      type: Number,
      min: 0,
    },
    actualEnergyKWh: {
      type: Number,
      min: 0,
    },
    actualCost: {
      type: Number,
      min: 0,
    },
    isCheckedIn: {
      type: Boolean,
      default: false,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    isNoShow: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// --- Indexes ---
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ station: 1, status: 1 });
bookingSchema.index({ slot: 1, status: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
