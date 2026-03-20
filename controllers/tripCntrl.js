const Trip = require("../models/Trip");

/* ================= CREATE TRIP ================= */
exports.createTrip = async (req, res) => {
  try {
    const { title, destination, startDate, endDate, notes } = req.body;

    if (!title || !destination || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const trip = await Trip.create({
      user: req.user.id,
      title,
      destination,
      startDate,
      endDate,
      notes,
      status: "ACTIVE", // ✅ IMPORTANT
    });

    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET USER TRIPS ================= */
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= END TRIP ================= */
exports.endTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // 🔒 security check
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    trip.status = "ENDED";
    await trip.save();

    res.json({
      success: true,
      message: "Trip ended successfully",
      trip,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE TRIP ================= */
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await trip.deleteOne();
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};