# ChargeFlow Backend API Specification

Comprehensive documentation of all REST API endpoints for the ChargeFlow Smart Charging Station system.

Base URL: `http://localhost:5000/api/v1`

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

---

## 1. Authentication & Profile (`/api/v1/auth`, `/api/v1/users`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register/driver` | Public | None | Register a new EV driver account |
| `POST` | `/auth/register/owner` | Public | None | Register a new station owner account |
| `POST` | `/auth/login` | Public | None | Authenticate user & issue JWT |
| `POST` | `/auth/forgot-password` | Public | None | Generate & issue 6-digit numeric OTP |
| `POST` | `/auth/verify-otp` | Public | None | Validate OTP code |
| `POST` | `/auth/reset-password` | Public | None | Reset password within OTP verification window |
| `GET` | `/auth/me` | Bearer Token | Any | Get current authenticated user profile |
| `GET` | `/users/profile` | Bearer Token | Any | Get user profile with populated favorites |
| `PATCH` | `/users/profile` | Bearer Token | Any | Update user profile & vehicle details (`brand`, `model`, `regNumber`, `connectorType`, `batteryCapacityKWh`) |

---

## 2. Station Management & Favorites (`/api/v1/stations`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/stations` | Public | Any | Search stations by name, city, spatial geo-nearby (`lat`, `lng`, `radius`), & price/power filters (supports pagination `page`, `limit`) |
| `GET` | `/stations/favorites` | Bearer Token | `driver` | List driver's favorite stations |
| `POST` | `/stations/:id/favorite` | Bearer Token | `driver` | Add station to driver's favorites list |
| `DELETE` | `/stations/:id/favorite` | Bearer Token | `driver` | Remove station from driver's favorites list |
| `GET` | `/stations/:id` | Public | Any | Get single station details with populated slots |
| `GET` | `/stations/:id/twin` | Public | Any | Real-time Digital Twin telemetry payload |
| `GET` | `/stations/:id/slots` | Public | Any | Get all charging bays/slots of a station |
| `GET` | `/stations/my` | Bearer Token | `owner` | List stations owned by logged-in owner |
| `POST` | `/stations` | Bearer Token | `owner` | Create station & auto-provision default slots (`A1`, `A2`, ...) |
| `PATCH` | `/stations/:id` | Bearer Token | `owner` | Update station details (ownership check enforced) |
| `PATCH` | `/stations/:id/pricing` | Bearer Token | `owner` | Update station tariff pricing per kWh |

---

## 3. Slot Management (`/api/v1/slots`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `PATCH` | `/slots/:id` | Bearer Token | `owner` | Update slot status (`available`, `occupied`, `reserved`, `maintenance`, `offline`) & maintenance info |

---

## 4. Booking System (`/api/v1/bookings`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/bookings` | Bearer Token | `driver` | Create booking (checks time-range slot overlap & reserves slot) |
| `GET` | `/bookings/my` | Bearer Token | `driver` | List driver's bookings with pagination (filter by status `upcoming`, `ongoing`, `completed`, `cancelled`) |
| `PATCH` | `/bookings/:id/cancel` | Bearer Token | `driver` | Cancel confirmed booking before start time & free slot |
| `PATCH` | `/bookings/:id/reschedule` | Bearer Token | `driver` | Reschedule booking window |
| `POST` | `/bookings/:id/checkin` | Bearer Token | `driver` | Check in to start charging session (`slot.status = 'occupied'`) |

---

## 5. Session Management (`/api/v1/sessions`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/sessions/active` | Bearer Token | `driver` | Retrieve driver's active live charging session |
| `POST` | `/sessions/:id/end` | Bearer Token | `driver`/`owner` | End charging session, calculate actual cost, and free slot |
| `GET` | `/sessions/:id` | Bearer Token | `driver`/`owner` | Get session summary + Green Impact telemetry (`CO₂ avoided`, `trees equivalent`) |

---

## 6. Smart Features (`/api/v1/smart`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/smart/load-balancing` | Bearer Token | `driver` | Detect station overload (>75%) & recommend nearby free stations with incentives |
| `GET` | `/smart/claimable-slots` | Bearer Token | `driver` | List claimable slots from no-show bookings past 10-min grace period |
| `POST` | `/smart/claim-slot` | Bearer Token | `driver` | Atomically claim a no-show slot & provision new reservation |
| `GET` | `/smart/energy-mix/:stationId` | Bearer Token | Any | Get real-time solar/wind/grid mix percentages |

---

## 7. Feedback System (`/api/v1/feedback`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/feedback` | Bearer Token | `driver` | Submit review for a completed session (1-to-1 session unique index) |
| `GET` | `/feedback/station/:stationId` | Bearer Token | `owner` | View paginated driver feedback for owned station |
| `GET` | `/feedback/my` | Bearer Token | `driver` | View driver's feedback submission history |

---

## 8. Notification System (`/api/v1/notifications`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/notifications` | Bearer Token | Any | Get paginated user notifications feed with unread count |
| `PATCH` | `/notifications/:id/read` | Bearer Token | Any | Mark a single notification as read |
| `PATCH` | `/notifications/read-all` | Bearer Token | Any | Mark all notifications as read |

---

## 9. Owner Analytics (`/api/v1/analytics`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/analytics/dashboard` | Bearer Token | `owner` | High-level KPIs (`totalRevenue`, `totalSessions`, `utilization%`, `avgRevenue`, `energy`, `rating`, `noShowRate`) |
| `GET` | `/analytics/utilization` | Bearer Token | `owner` | Hourly slot utilization aggregation for dashboard charts |
| `GET` | `/analytics/revenue` | Bearer Token | `owner` | Time-series daily revenue & energy aggregation |
| `GET` | `/analytics/feedback` | Bearer Token | `owner` | Feedback category averages (`cleanliness`, `access`, `cables`, `lighting`, `overall`) |

---

## 10. Real-Time Socket.io Event Catalog

Clients connect to the Socket.io server at `ws://localhost:5000`.

| Event Name | Trigger Condition | Payload Data |
| :--- | :--- | :--- |
| `slot:status_changed` | Slot status transitions (available, reserved, occupied, maintenance) | `{ slotId, stationId, status, maintenanceInfo }` |
| `booking:created` | Driver completes a new slot reservation | `{ bookingId, stationId, slotId, startTime }` |
| `session:started` | Driver checks in at station | `{ sessionId, bookingId, stationId, slotId }` |
| `session:ended` | Charging session is ended & finalized | `{ sessionId, bookingId, stationId, slotId, energyDeliveredKWh, cost }` |
| `noshow:claimed` | A no-show slot is recovered & claimed | `{ slotId, newBookingId, stationId }` |
