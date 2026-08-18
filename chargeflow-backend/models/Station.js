// models/Station.js
const mongoose = require("mongoose");

const operatingHoursSchema = new mongoose.Schema(
  {
    open: { type: String, required: true }, // "06:00"
    close: { type: String, required: true }, // "23:00"
    is24Hours: { type: Boolean, default: false },
  },
  { _id: false }
);

const renewableMixSchema = new mongoose.Schema(
  {
    solarPct: { type: Number, min: 0, max: 100, default: 0 },
    windPct: { type: Number, min: 0, max: 100, default: 0 },
    gridPct: { type: Number, min: 0, max: 100, default: 100 },
  },
  { _id: false }
);

const stationSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Station must belong to an owner"],
    },
    name: {
      type: String,
      required: [true, "Station name is required"],
      trim: true,
      maxlength: 150,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, "Coordinates are required"],
        validate: {
          validator: (coords) => Array.isArray(coords) && coords.length === 2,
          message: "Coordinates must be an array of [longitude, latitude]",
        },
      },
    },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{6}$/, "Please provide a valid 6-digit pincode"],
    },
    totalSlots: {
      type: Number,
      required: [true, "Total slots is required"],
      min: 1,
    },
    chargerTypes: {
      type: [String],
      enum: ["AC", "DC", "Fast", "Rapid"],
      required: true,
    },
    operatingHours: {
      type: operatingHoursSchema,
      required: true,
    },
    basePricePerKWh: {
      type: Number,
      required: [true, "Base price per kWh is required"],
      min: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    isOperational: {
      type: Boolean,
      default: true,
    },
    renewableMix: {
      type: renewableMixSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// --- Indexes ---
stationSchema.index({ location: "2dsphere" });
stationSchema.index({ owner: 1, isOperational: 1 });
stationSchema.index({ city: 1, isOperational: 1 });
stationSchema.index({ name: "text" });

module.exports = mongoose.model("Station", stationSchema);
