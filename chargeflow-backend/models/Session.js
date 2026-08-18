// models/Session.js
const mongoose = require("mongoose");

const renewableMixSnapshotSchema = new mongoose.Schema(
  {
    solarPct: { type: Number, min: 0, max: 100 },
    windPct: { type: Number, min: 0, max: 100 },
    gridPct: { type: Number, min: 0, max: 100 },
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Session must reference a booking"],
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Session must belong to a user"],
    },
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: [true, "Session must reference a station"],
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: [true, "Session must reference a slot"],
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
    },
    energyDeliveredKWh: {
      type: Number,
      default: 0,
      min: 0,
    },
    cost: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },
    renewableMixAtStart: {
      type: renewableMixSnapshotSchema,
    },
    renewableMixAtEnd: {
      type: renewableMixSnapshotSchema,
    },
  },
  { timestamps: true }
);

// --- Indexes ---
sessionSchema.index({ user: 1 });
sessionSchema.index({ status: 1 });
sessionSchema.index({ booking: 1 }, { unique: true });

module.exports = mongoose.model("Session", sessionSchema);
