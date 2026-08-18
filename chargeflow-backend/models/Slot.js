// models/Slot.js
const mongoose = require("mongoose");

const maintenanceInfoSchema = new mongoose.Schema(
  {
    issueType: { type: String, trim: true },
    description: { type: String, trim: true },
    startedAt: { type: Date },
    estimatedResolution: { type: Date },
    technician: { type: String, trim: true },
  },
  { _id: false }
);

const slotSchema = new mongoose.Schema(
  {
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: [true, "Slot must belong to a station"],
    },
    slotId: {
      type: String,
      required: [true, "Slot ID is required"],
      trim: true,
      uppercase: true,
    },
    chargerType: {
      type: String,
      enum: ["AC", "DC", "Fast", "Rapid"],
      required: true,
    },
    connectorType: {
      type: String,
      enum: ["CCS2", "Type2", "CHAdeMO", "GBT", "NACS", "Other"],
      required: true,
    },
    maxPowerKw: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved", "maintenance", "offline"],
      default: "available",
    },
    currentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    maintenanceInfo: {
      type: maintenanceInfoSchema,
      default: undefined,
    },
  },
  { timestamps: true }
);

// --- Indexes ---
slotSchema.index({ station: 1, slotId: 1 }, { unique: true });
slotSchema.index({ station: 1, status: 1 });

module.exports = mongoose.model("Slot", slotSchema);
