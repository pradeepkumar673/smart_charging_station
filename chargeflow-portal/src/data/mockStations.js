// src/data/mockStations.js

// TODO: Replace all functions below with real API calls, e.g.
// export const getAllStations = () => api.get('/stations').then(r => r.data);

const stations = [
  {
    id: "stn_001",
    name: "Indiranagar EV Hub",
    address: "100 Feet Road, Indiranagar, Bengaluru",
    lat: 12.9716,
    lng: 77.6412,
    rating: 4.6,
    reviewCount: 128,
    distanceKm: 1.2,
    renewableShare: 82,
    pricePerKwh: 14.5,
    connectors: ["CCS2", "Type2"],
    powerKw: 60,
    amenities: ["Cafe", "Restroom", "WiFi"],
    bays: [
      { id: "A1", status: "available", connector: "CCS2", powerKw: 60 },
      { id: "A2", status: "charging", connector: "CCS2", powerKw: 60, vehicle: "Tata Nexon EV", etaMins: 24 },
      { id: "A3", status: "reserved", connector: "Type2", powerKw: 22, reservedUntil: 8 },
      { id: "A4", status: "maintenance", connector: "CCS2", powerKw: 60 },
      { id: "B1", status: "available", connector: "Type2", powerKw: 22 },
      { id: "B2", status: "charging", connector: "CCS2", powerKw: 60, vehicle: "MG ZS EV", etaMins: 12 },
    ],
  },
  {
    id: "stn_002",
    name: "Koramangala Green Charge",
    address: "80 Feet Road, Koramangala, Bengaluru",
    lat: 12.9352,
    lng: 77.6146,
    rating: 4.3,
    reviewCount: 76,
    distanceKm: 2.8,
    renewableShare: 65,
    pricePerKwh: 12.0,
    connectors: ["CCS2"],
    powerKw: 30,
    amenities: ["Parking", "Security"],
    bays: [
      { id: "A1", status: "available", connector: "CCS2", powerKw: 30 },
      { id: "A2", status: "available", connector: "CCS2", powerKw: 30 },
      { id: "A3", status: "charging", connector: "CCS2", powerKw: 30, vehicle: "Hyundai Kona", etaMins: 18 },
      { id: "A4", status: "reserved", connector: "CCS2", powerKw: 30, reservedUntil: 5 },
    ],
  },
  {
    id: "stn_003",
    name: "Whitefield Charge Point",
    address: "ITPL Main Road, Whitefield, Bengaluru",
    lat: 12.9698,
    lng: 77.7500,
    rating: 4.8,
    reviewCount: 214,
    distanceKm: 5.4,
    renewableShare: 91,
    pricePerKwh: 15.0,
    connectors: ["CCS2", "Type2", "CHAdeMO"],
    powerKw: 120,
    amenities: ["Cafe", "Lounge", "Restroom", "WiFi"],
    bays: [
      { id: "A1", status: "charging", connector: "CCS2", powerKw: 120, vehicle: "Kia EV6", etaMins: 9 },
      { id: "A2", status: "available", connector: "CCS2", powerKw: 120 },
      { id: "B1", status: "available", connector: "Type2", powerKw: 22 },
      { id: "B2", status: "maintenance", connector: "CHAdeMO", powerKw: 50 },
    ],
  },
];

export const getAllStations = () => Promise.resolve(stations);

export const getStationById = (id) =>
  Promise.resolve(stations.find((s) => s.id === id) || null);

export const getNearbyStations = (limit = 10) =>
  Promise.resolve([...stations].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, limit));

export const getStationBays = (stationId) =>
  Promise.resolve(stations.find((s) => s.id === stationId)?.bays || []);
