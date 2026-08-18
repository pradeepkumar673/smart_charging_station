# ChargeFlow Backend Service

Production-ready Express & MongoDB REST API server powering the ChargeFlow EV Smart Charging Station Management Platform.

---

## Technical Stack

- **Runtime & Framework**: Node.js & Express.js
- **Database**: MongoDB & Mongoose ORM (GeoJSON `2dsphere` spatial indexing, aggregations)
- **Authentication**: JSON Web Tokens (JWT), httpOnly Cookies, Bcrypt.js password hashing, 6-digit SHA-256 OTP password recovery
- **Real-Time Communication**: Socket.io for live station telemetry & Digital Twin updates
- **Validation & Security**: Express-Validator, Helmet, CORS, Express-Rate-Limit
- **Logging**: Morgan HTTP logger

---

## Directory Architecture

```
chargeflow-backend/
├── config/
│   └── db.js                 # MongoDB connection handler
├── controllers/
│   ├── analytics.controller.js  # Mongoose aggregation pipelines for owner KPIs
│   ├── auth.controller.js       # Register, Login, OTP, Me handlers
│   ├── booking.controller.js    # Overlap checking, reservations, cancellation
│   ├── feedback.controller.js   # Session review submission & station feedback
│   ├── notification.controller.js# User notifications feed & mark-read handlers
│   ├── session.controller.js    # Check-in, ongoing session tracking, end session, Green Impact
│   ├── slot.controller.js       # Slot status & maintenance management
│   ├── smart.controller.js      # Community load balancing, no-show recovery, energy mix
│   ├── station.controller.js    # Geo-nearby spatial search, Digital Twin telemetry, CRUD
│   └── user.controller.js       # User profile handlers
├── middleware/
│   ├── auth.middleware.js       # Protect JWT & restrictTo RBAC middleware
│   ├── error.middleware.js      # Global error handler (Mongoose 11000, 422, 401, 404, 500)
│   └── validateRequest.js      # Express-validator error array formatting
├── models/
│   ├── Booking.js               # Booking schema
│   ├── Feedback.js              # Feedback schema (unique session constraint)
│   ├── Notification.js          # Notification schema
│   ├── Session.js               # Session schema
│   ├── Slot.js                  # Slot/bay schema
│   ├── Station.js               # Station schema (GeoJSON Point location)
│   └── User.js                  # Driver & Owner user schema
├── routes/                      # Router modules for all 10 API endpoints
├── sockets/                     # Socket.io connection & event handlers
├── utils/
│   ├── APIError.js              # Custom operational error class
│   ├── AppError.js              # Standardized HTTP error class
│   ├── apiResponse.js           # Standardized JSON response helper ({ success, message, data })
│   ├── catchAsync.js            # Async controller wrapper
│   ├── createNotification.js    # Global notification creation utility
│   ├── generateOTP.js           # 6-digit numeric OTP generator & SHA-256 hasher
│   └── generateToken.js         # JWT signing helper
├── API.md                       # Full API specification reference
├── server.js                    # Express application entry point & route mounting
└── package.json                 # Project dependencies & scripts
```

---

## Setup & Environment Configuration

### 1. Installation
```bash
cd chargeflow-backend
npm install
```

### 2. Environment Variables (.env)
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://localhost:27017/chargeflow

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
COOKIE_EXPIRES_IN=7

CLIENT_URL=http://localhost:5173

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=300
AUTH_RATE_LIMIT_MAX_REQUESTS=20

OTP_EXPIRES_IN_MINUTES=10
OTP_VERIFIED_WINDOW_MINUTES=15
```

### 3. Run Development Server
```bash
npm run dev
```

---

## Connecting Frontend (`chargeflow-portal`)

To connect `chargeflow-portal` to this backend:
1. Ensure MongoDB is running locally (`mongodb://localhost:27017/chargeflow`) or set `MONGODB_URI` in `.env` to your MongoDB Atlas cluster URI.
2. Ensure `CLIENT_URL=http://localhost:5173` matches your Vite frontend port.
3. Pass `Authorization: Bearer <token>` in HTTP headers for protected endpoints.

---

## Verification & Audits

- **Syntax & Compilation**: Verified with `node -c server.js`.
- **Database Policy**: **Zero hardcoded fallback data**. All metrics, stations, slots, sessions, and analytics are calculated 100% dynamically from MongoDB collections.
