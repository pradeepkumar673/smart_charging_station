// server.js
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./middleware/error.middleware");
const initSocket = require("./sockets");

// --- Route Modules ---
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const stationRoutes = require("./routes/station.routes");
const slotRoutes = require("./routes/slot.routes");
const bookingRoutes = require("./routes/booking.routes");
const sessionRoutes = require("./routes/session.routes");
const smartRoutes = require("./routes/smart.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const notificationRoutes = require("./routes/notification.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const app = express();
const server = http.createServer(app);

// --- Security & HTTP Middleware ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// --- Rate Limiting ---
const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const generalMax = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 300;
const authMax = Number(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 20;

const generalLimiter = rateLimit({
  windowMs,
  max: generalMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});

const authLimiter = rateLimit({
  windowMs,
  max: authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again after 15 minutes",
  },
});

app.use("/api/", generalLimiter);

// --- Health Check ---
app.get(["/", "/api/v1/health"], (req, res) => {
  res.status(200).json({
    success: true,
    message: "ChargeFlow API is running smoothly",
    data: {
      status: "healthy",
      uptime: Math.round(process.uptime()),
      timestamp: new Date(),
    },
  });
});

// --- API Route Mounting ---
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/v1/stations", stationRoutes);
app.use("/api/stations", stationRoutes);

app.use("/api/v1/slots", slotRoutes);
app.use("/api/slots", slotRoutes);

app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/bookings", bookingRoutes);

app.use("/api/v1/sessions", sessionRoutes);
app.use("/api/sessions", sessionRoutes);

app.use("/api/v1/smart", smartRoutes);
app.use("/api/smart", smartRoutes);

app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use("/api/v1/users", userRoutes);
app.use("/api/users", userRoutes);

// --- Socket.io Integration ---
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});
initSocket(io);
app.set("io", io);

// --- 404 Unknown Route Handler ---
app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found on this server`, 404));
});

// --- Global Error Middleware ---
app.use(globalErrorHandler);

// --- Server Lifecycle ---
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`⚡ ChargeFlow Backend running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
});

process.on("unhandledRejection", (err) => {
  console.error(`💥 Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
