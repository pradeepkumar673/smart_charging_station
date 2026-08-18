# ChargeFlow Backend

Backend API for the ChargeFlow EV Charging Station Portal.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in real values:
   ```bash
   cp .env.example .env
   ```

3. Make sure MongoDB is running and `MONGODB_URI` points to it.

4. Run in development (auto-restart on changes):
   ```bash
   npm run dev
   ```

5. Run in production:
   ```bash
   npm start
   ```

The health check is available at `GET /`. Auth, user, station, and booking
route files exist as empty routers under `/api/*` — add controllers,
models, and validators as each feature is built.
