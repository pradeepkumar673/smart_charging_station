// models/Notification.js
const mongoose = require("mongoose");

const relatedEntitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Booking", "Station", "Session", "Slot", "Feedback"],
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { _id: false }
);

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Notification must belong to a user"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 150,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ["booking", "charging", "savings", "station", "session", "slot", "system"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedEntity: {
      type: relatedEntitySchema,
      default: undefined,
    },
  },
  { timestamps: true }
);

// --- Indexes ---
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
