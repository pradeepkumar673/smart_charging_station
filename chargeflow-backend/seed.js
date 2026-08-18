// seed.js
require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const Station = require("./models/Station");
const Slot = require("./models/Slot");
const Booking = require("./models/Booking");
const Session = require("./models/Session");
const Feedback = require("./models/Feedback");
const Notification = require("./models/Notification");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/chargeflow";

async function seedDatabase() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    console.log("🧹 Clearing existing collections...");
    await User.deleteMany({});
    await Station.deleteMany({});
    await Slot.deleteMany({});
    await Booking.deleteMany({});
    await Session.deleteMany({});
    await Feedback.deleteMany({});
    await Notification.deleteMany({});

    console.log("👤 Creating Users (3 Owners, 2 Drivers)...");
    const owner1 = await User.create({
      name: "Aarav Sharma",
      email: "owner1@chargeflow.io",
      password: "Password123",
      phone: "+919876543210",
      role: "owner",
      company: {
        companyName: "GreenCharge Energy Pvt Ltd",
        gstNumber: "29AAAAA0000A1Z5",
        businessAddress: "100 Feet Road, Indiranagar, Bengaluru",
      },
    });

    const owner2 = await User.create({
      name: "Priya Patel",
      email: "owner2@chargeflow.io",
      password: "Password123",
      phone: "+919876543211",
      role: "owner",
      company: {
        companyName: "VoltNet Stations India",
        gstNumber: "29BBBBB1111B1Z6",
        businessAddress: "MG Road, Bengaluru",
      },
    });

    const owner3 = await User.create({
      name: "Rohan Gupta",
      email: "owner3@chargeflow.io",
      password: "Password123",
      phone: "+919876543212",
      role: "owner",
      company: {
        companyName: "EcoDrive Power Grid",
        gstNumber: "29CCCCC2222C1Z7",
        businessAddress: "HSR Layout, Bengaluru",
      },
    });

    const driver1 = await User.create({
      name: "Karan Verma",
      email: "driver1@chargeflow.io",
      password: "Password123",
      phone: "+919876543213",
      role: "driver",
      vehicle: {
        brand: "Tata",
        model: "Nexon EV Max",
        make: "Tata",
        regNumber: "KA01EV1234",
        registrationNumber: "KA01EV1234",
        connectorType: "CCS2",
        batteryCapacityKWh: 40.5,
      },
    });

    const driver2 = await User.create({
      name: "Neha Reddy",
      email: "driver2@chargeflow.io",
      password: "Password123",
      phone: "+919876543214",
      role: "driver",
      vehicle: {
        brand: "MG",
        model: "ZS EV",
        make: "MG",
        regNumber: "KA03EV5678",
        registrationNumber: "KA03EV5678",
        connectorType: "Type2",
        batteryCapacityKWh: 50.3,
      },
    });

    console.log("⚡ Creating 6 Bengaluru EV Stations & Slots...");

    const stationsData = [
      {
        owner: owner1._id,
        name: "Indiranagar Ultra EV Hub",
        address: "100 Feet Road, Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038",
        location: { type: "Point", coordinates: [77.6412, 12.9716] },
        totalSlots: 6,
        chargerTypes: ["DC", "AC", "Rapid"],
        operatingHours: { open: "00:00", close: "23:59", is24Hours: true },
        basePricePerKWh: 14.5,
        amenities: ["Cafe", "Restroom", "WiFi", "Lounge", "Shopping Mall"],
        renewableMix: { solarPct: 60, windPct: 22, gridPct: 18 },
      },
      {
        owner: owner1._id,
        name: "Koramangala Green Power Bay",
        address: "80 Feet Road, 4th Block Koramangala",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560034",
        location: { type: "Point", coordinates: [77.6245, 12.9352] },
        totalSlots: 6,
        chargerTypes: ["DC", "Fast"],
        operatingHours: { open: "06:00", close: "23:00", is24Hours: false },
        basePricePerKWh: 13.8,
        amenities: ["Cafe", "WiFi", "Restroom"],
        renewableMix: { solarPct: 70, windPct: 15, gridPct: 15 },
      },
      {
        owner: owner2._id,
        name: "MG Road Central Supercharger",
        address: "MG Road Metro Station Complex",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560001",
        location: { type: "Point", coordinates: [77.607, 12.9756] },
        totalSlots: 8,
        chargerTypes: ["Rapid", "DC", "AC"],
        operatingHours: { open: "00:00", close: "23:59", is24Hours: true },
        basePricePerKWh: 16.0,
        amenities: ["Metro Access", "Food Court", "Restroom", "ATM"],
        renewableMix: { solarPct: 40, windPct: 20, gridPct: 40 },
      },
      {
        owner: owner2._id,
        name: "Whitefield Tech Park EV Station",
        address: "ITPL Main Road, Whitefield",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560066",
        location: { type: "Point", coordinates: [77.7499, 12.9863] },
        totalSlots: 8,
        chargerTypes: ["DC", "Fast"],
        operatingHours: { open: "06:00", close: "22:00", is24Hours: false },
        basePricePerKWh: 15.2,
        amenities: ["Tech Park Access", "Cafeteria", "Workstations"],
        renewableMix: { solarPct: 55, windPct: 25, gridPct: 20 },
      },
      {
        owner: owner3._id,
        name: "HSR Layout Renewable Grid",
        address: "27th Main Road, Sector 1 HSR Layout",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560102",
        location: { type: "Point", coordinates: [77.6387, 12.9121] },
        totalSlots: 6,
        chargerTypes: ["DC", "AC"],
        operatingHours: { open: "00:00", close: "23:59", is24Hours: true },
        basePricePerKWh: 14.0,
        amenities: ["Park Nearby", "Coffee Shop", "Restroom"],
        renewableMix: { solarPct: 75, windPct: 15, gridPct: 10 },
      },
      {
        owner: owner3._id,
        name: "Electronic City Fast Charge Spot",
        address: "Hosur Main Road, Phase 1 Electronic City",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560100",
        location: { type: "Point", coordinates: [77.6648, 12.8452] },
        totalSlots: 6,
        chargerTypes: ["Rapid", "DC"],
        operatingHours: { open: "06:00", close: "23:00", is24Hours: false },
        basePricePerKWh: 13.5,
        amenities: ["Highway Stop", "Restaurant", "EV Service Desk"],
        renewableMix: { solarPct: 50, windPct: 30, gridPct: 20 },
      },
    ];

    const createdStations = [];
    const allCreatedSlots = [];

    for (const stnData of stationsData) {
      const station = await Station.create(stnData);
      createdStations.push(station);

      const slotDocs = [];
      const connectors = ["CCS2", "Type2", "CHAdeMO", "NACS"];

      for (let i = 1; i <= station.totalSlots; i++) {
        const slotId = i <= 4 ? `A${i}` : `B${i - 4}`;
        const chargerType = station.chargerTypes[i % station.chargerTypes.length];
        const connectorType = connectors[i % connectors.length];
        const maxPowerKw = chargerType === "Rapid" ? 150 : chargerType === "DC" ? 60 : 22;

        slotDocs.push({
          station: station._id,
          slotId,
          chargerType,
          connectorType,
          maxPowerKw,
          status: "available",
        });
      }

      const slots = await Slot.insertMany(slotDocs);
      allCreatedSlots.push(...slots);
    }

    console.log(`Created ${createdStations.length} stations and ${allCreatedSlots.length} bays!`);

    console.log("📅 Seeding sample completed sessions & feedback...");
    const sampleStation = createdStations[0];
    const sampleSlot = allCreatedSlots[0];

    const pastStart = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const pastEnd = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const booking1 = await Booking.create({
      user: driver1._id,
      station: sampleStation._id,
      slot: sampleSlot._id,
      startTime: pastStart,
      endTime: pastEnd,
      durationMinutes: 60,
      status: "completed",
      estimatedEnergyKWh: 25,
      estimatedCost: 362.5,
      actualEnergyKWh: 24.2,
      actualCost: 350.9,
      isCheckedIn: true,
      checkInTime: pastStart,
      checkOutTime: pastEnd,
    });

    const session1 = await Session.create({
      booking: booking1._id,
      user: driver1._id,
      station: sampleStation._id,
      slot: sampleSlot._id,
      startTime: pastStart,
      endTime: pastEnd,
      energyDeliveredKWh: 24.2,
      cost: 350.9,
      status: "completed",
      renewableMixAtStart: sampleStation.renewableMix,
      renewableMixAtEnd: sampleStation.renewableMix,
    });

    await Feedback.create({
      user: driver1._id,
      station: sampleStation._id,
      session: session1._id,
      ratings: {
        cleanliness: 5,
        easeOfAccess: 5,
        cableCondition: 5,
        lighting: 4,
        overall: 5,
      },
      comment: "Outstanding fast charging experience! High solar ratio active.",
    });

    await Notification.create({
      user: driver1._id,
      title: "Booking Completed",
      message: "Your charging session at Indiranagar Ultra EV Hub is completed. You saved 14.3 kg CO₂!",
      type: "session",
      relatedEntity: { type: "Session", id: session1._id },
    });

    await Notification.create({
      user: owner1._id,
      title: "New Review Received",
      message: "Karan Verma left a 5★ review for Indiranagar Ultra EV Hub.",
      type: "station",
    });

    console.log("✨ Database seeding completed successfully!");
    console.log("\n🔑 Sample Accounts Created:");
    console.log("------------------------------------------");
    console.log("Owner 1:  owner1@chargeflow.io / Password123");
    console.log("Owner 2:  owner2@chargeflow.io / Password123");
    console.log("Owner 3:  owner3@chargeflow.io / Password123");
    console.log("Driver 1: driver1@chargeflow.io / Password123");
    console.log("Driver 2: driver2@chargeflow.io / Password123");
    console.log("------------------------------------------\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedDatabase();
