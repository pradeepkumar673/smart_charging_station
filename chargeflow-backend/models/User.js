// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const vehicleSchema = new mongoose.Schema(
  {
    brand: { type: String, trim: true },
    model: { type: String, trim: true },
    batteryCapacityKWh: { type: Number, min: 0 },
    connectorType: {
      type: String,
      enum: ["CCS2", "Type2", "CHAdeMO", "GBT"],
    },
    registrationNumber: { type: String, trim: true, uppercase: true },
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, trim: true },
    gstNumber: { type: String, trim: true, uppercase: true },
    contactEmail: { type: String, trim: true, lowercase: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["driver", "owner"],
      required: [true, "Role is required"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
    },
    vehicle: {
      type: vehicleSchema,
      default: undefined, // only relevant for role: driver
    },
    company: {
      type: companySchema,
      default: undefined, // only relevant for role: owner
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpire: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// --- Indexes ---
userSchema.index({ role: 1 });


// --- Hooks ---
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Instance methods ---
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generatePasswordResetToken = function generatePasswordResetToken() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken; // plain token — only this gets emailed to the user
};

// --- Static methods ---
// Explicit helper for auth flows that need the password field included.
userSchema.statics.findByEmailWithPassword = function findByEmailWithPassword(email) {
  return this.findOne({ email }).select("+password");
};

module.exports = mongoose.model("User", userSchema);
