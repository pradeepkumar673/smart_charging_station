// src/data/mockSessions.js

// TODO: Replace with real-time API/WebSocket integration for live sessions.

const activeSession = {
  id: "sess_501",
  stationId: "stn_003",
  stationName: "Whitefield Charge Point",
  bayId: "A1",
  startedAt: "2026-08-18T14:00:00",
  connector: "CCS2",
  powerKw: 120,
  batteryStart: 22,
  batteryCurrent: 61,
  batteryTarget: 90,
  energyDeliveredKwh: 18.4,
  costSoFar: 276,
  etaMins: 14,
};

const pastSessions = [
  {
    id: "sess_401",
    stationName: "Koramangala Green Charge",
    date: "2026-08-10",
    energyKwh: 22.1,
    cost: 265,
    durationMins: 42,
    co2SavedKg: 4.6,
  },
  {
    id: "sess_402",
    stationName: "Indiranagar EV Hub",
    date: "2026-08-02",
    energyKwh: 15.7,
    cost: 227,
    durationMins: 28,
    co2SavedKg: 3.2,
  },
];

export const getActiveSession = () => Promise.resolve(activeSession);
export const getPastSessions = () => Promise.resolve(pastSessions);
export const getSessionSummary = (id) =>
  Promise.resolve(pastSessions.find((s) => s.id === id) || pastSessions[0]);
