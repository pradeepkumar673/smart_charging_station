// src/data/mockOwnerData.js

// TODO: Replace with real owner-facing API calls.

const ownerStations = [
  { id: "stn_001", name: "Indiranagar EV Hub", bays: 6, occupied: 3, revenueToday: 4820, status: "active" },
  { id: "stn_002", name: "Koramangala Green Charge", bays: 4, occupied: 2, revenueToday: 2360, status: "active" },
];

const feedback = [
  { id: "fb_1", stationId: "stn_001", user: "Rahul S.", rating: 5, comment: "Fast charging, clean facility.", date: "2026-08-15" },
  { id: "fb_2", stationId: "stn_001", user: "Ananya K.", rating: 4, comment: "Good but app UI could be faster.", date: "2026-08-12" },
];

const pricingRules = [
  { id: "pr_1", stationId: "stn_001", label: "Peak (6-9 PM)", pricePerKwh: 16.5 },
  { id: "pr_2", stationId: "stn_001", label: "Off-Peak", pricePerKwh: 12.0 },
];

export const getOwnerStations = () => Promise.resolve(ownerStations);

export const getOwnerAnalytics = (stationId, range = "7d") =>
  Promise.resolve({
    stationId,
    range,
    revenue: [1200, 1600, 900, 2100, 1800, 2400, 2000],
    utilizationPct: 68,
    avgSessionMins: 34,
    peakHour: "18:00-19:00",
  });

export const getOwnerFeedback = (stationId) =>
  Promise.resolve(stationId ? feedback.filter((f) => f.stationId === stationId) : feedback);

export const getPricingRules = (stationId) =>
  Promise.resolve(pricingRules.filter((p) => p.stationId === stationId));
