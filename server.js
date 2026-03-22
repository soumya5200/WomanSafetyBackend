require("dotenv").config();

const express = require("express");
const cors = require("cors");

const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./database/db");

const userRoutes = require("./routes/userRoutes");
const incRoutes = require("./routes/incidentRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const chatRoutes = require("./routes/chatRoutes");
const tripRoutes = require("./routes/tripRoutes");
const sosRoutes = require("./routes/sosRoutes");
const locationRoutes = require("./routes/locationRoutes");
const safeSpotRoutes = require("./routes/safeSpotRoutes");

const app = express();
const port = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());

// ✅ CORS FIX (FINAL)
app.use(cors());

// ✅ Static uploads
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/incidents", incRoutes);
app.use("/api/v1/emergency", emergencyRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/trips", tripRoutes);
app.use("/api/v1/sos", sosRoutes);
app.use("/api/v1/location", locationRoutes);
app.use("/api/v1/safespots", safeSpotRoutes);

// ✅ Error handler (LAST)
app.use(errorHandler);

// ✅ Start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server started on ${port}`);
      console.log(`Mongo Connected!!!`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();