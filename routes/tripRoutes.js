const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const fetch = require("node-fetch"); // npm i node-fetch@2

/* ================= HELPER ================= */
const getCityStateOnly = (data) => {
  if (!data || !data.address) return "Unknown location";

  const a = data.address;

  const city =
    a.city ||
    a.town ||
    a.village ||
    a.county ||
    "Lucknow";

  const state = a.state || "Uttar Pradesh";

  return `${city}, ${state}`;
};

/* ================= START TRIP ================= */
router.post("/trip/start", async (req, res) => {
  try {
    const { lat, lon, title } = req.body;

    if (!lat || !lon) {
      return res.status(400).json({ message: "Latitude & Longitude required" });
    }

    // 🔥 Reverse geocoding
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const geoData = await geoRes.json();

    // ✅ FINAL DESTINATION (CITY + STATE ONLY)
    const destination = getCityStateOnly(geoData);

    console.log("FINAL DESTINATION:", destination);

    const trip = await Trip.create({
      title: title || "My Trip",
      destination, // 🔥 NO ROAD / NO SHOP
      startDate: new Date(),
      status: "ACTIVE",
    });

    res.status(201).json({
      success: true,
      trip,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Trip start failed" });
  }
});

/* ================= END TRIP ================= */
router.put("/trip/end/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.status = "COMPLETED";
    trip.endDate = new Date();
    await trip.save();

    res.json({
      success: true,
      message: "Trip ended successfully",
      trip,
    });
  } catch (error) {
    res.status(500).json({ message: "Trip end failed" });
  }
});

module.exports = router;