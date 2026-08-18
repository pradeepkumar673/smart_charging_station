// models/Feedback.js
const mongoose = require("mongoose");

const ratingsSchema = new mongoose.Schema(
  {
    cleanliness: { type: Number, min: 1, max: 5, required: true },
    easeOfAccess: { type: Number, min: 1, max: 5, required: true },
    cableCondition: { type: Number, min: 1, max: 5, required: true },
    lighting: { type: Number, min: 1, max: 5, required: true },
    overall: { type: Number, min: 1, max: 5, required: true },
  },
  { _id: false }
);

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Feedback must belong to a user"],
    },
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: [true, "Feedback must reference a station"],
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: [true, "Feedback must reference a session"],
      unique: true,
    },
    ratings: {
      type: ratingsSchema,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// --- Indexes ---
feedbackSchema.index({ station: 1 });
feedbackSchema.index({ user: 1 });


module.exports = mongoose.model("Feedback", feedbackSchema);
