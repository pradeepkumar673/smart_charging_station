// src/data/mockInsights.js

// TODO: Replace with real analytics API, e.g. GET /insights?range=30d

export const getGreenInsights = (range = "30d") =>
  Promise.resolve({
    range,
    totalCo2SavedKg: 46.8,
    totalEnergyKwh: 214.3,
    treesEquivalent: 2,
    renewableSharePct: 78,
    chartData: [
      { label: "Week 1", co2: 8.2 },
      { label: "Week 2", co2: 11.4 },
      { label: "Week 3", co2: 14.9 },
      { label: "Week 4", co2: 12.3 },
    ],
    badges: [
      { id: "b1", label: "Green Streak x5", earned: true },
      { id: "b2", label: "Off-Peak Hero", earned: true },
      { id: "b3", label: "100kWh Club", earned: false },
    ],
  });
