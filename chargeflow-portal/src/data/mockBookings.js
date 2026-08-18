// src/data/mockBookings.js

// TODO: Replace with real API calls, e.g. getDriverBookings -> GET /bookings?driverId=

const bookings = [
  {
    id: "bkg_101",
    stationId: "stn_001",
    stationName: "Indiranagar EV Hub",
    bayId: "A1",
    status: "upcoming", // upcoming | ongoing | completed | cancelled
    date: "2026-08-20",
    time: "18:30",
    durationMins: 45,
    priceEstimate: 320,
    connector: "CCS2",
  },
  {
    id: "bkg_102",
    stationId: "stn_003",
    stationName: "Whitefield Charge Point",
    bayId: "A1",
    status: "ongoing",
    date: "2026-08-18",
    time: "14:00",
    durationMins: 30,
    priceEstimate: 410,
    connector: "CCS2",
  },
  {
    id: "bkg_103",
    stationId: "stn_002",
    stationName: "Koramangala Green Charge",
    bayId: "A3",
    status: "completed",
    date: "2026-08-10",
    time: "09:15",
    durationMins: 40,
    priceEstimate: 260,
    connector: "CCS2",
  },
  {
    id: "bkg_104",
    stationId: "stn_002",
    stationName: "Koramangala Green Charge",
    bayId: "A2",
    status: "cancelled",
    date: "2026-08-05",
    time: "11:00",
    durationMins: 30,
    priceEstimate: 180,
    connector: "CCS2",
  },
];

export const getDriverBookings = (status) =>
  Promise.resolve(status ? bookings.filter((b) => b.status === status) : bookings);

export const getBookingById = (id) =>
  Promise.resolve(bookings.find((b) => b.id === id) || null);

export const createBooking = (payload) =>
  Promise.resolve({ id: `bkg_${Date.now()}`, status: "upcoming", ...payload });

export const cancelBooking = (id) => Promise.resolve({ id, status: "cancelled" });
